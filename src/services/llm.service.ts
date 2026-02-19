/**
 * LLM Service — Abstraction layer for AI providers.
 * Stores separate model configs per provider to avoid cross-contamination.
 * Includes auto-retry with backoff for 429 rate limits.
 */

export interface LLMConfig {
  provider: "groq" | "local" | "gemini" | "openai";
  apiKey?: string;        // Storage for Groq Key (legacy name)
  geminiKey?: string;     // Storage for Gemini Key
  openaiKey?: string;     // Storage for OpenAI Key
  baseUrl?: string;
  model?: string;
  groqModel?: string;     
  localModel?: string;    
  geminiModel?: string;   
  openaiModel?: string;   
}

interface ChatContentPart {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string | ChatContentPart[];
}

const DEFAULT_GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_LOCAL_URL = "http://localhost:11434/v1/chat/completions";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile"; 

// Valid Groq models (guaranteed to work)
export const GROQ_MODELS = [
  { id: "llama-3.3-70b-versatile",    label: "Llama 3.3 70B (Smart, Text-Only)" },
  { id: "meta-llama/llama-4-maverick-17b-128e-instruct", label: "Llama 4 Maverick (Vision)" },
  { id: "gemma2-9b-it",              label: "Gemma 2 9B (15K TPM)" },
  { id: "mixtral-8x7b-32768",        label: "Mixtral 8x7B (5K TPM)" },
];

export const GEMINI_MODELS = [
  { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash (Fast, Free)" },
  { id: "gemini-1.5-pro",   label: "Gemini 1.5 Pro (Smarter)" },
];

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;

/**
 * Get saved config from localStorage.
 */
export function getConfig(): LLMConfig {
  try {
    const saved = localStorage.getItem("sheetcraft_llm_config");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn("Failed to load LLM config:", e);
  }
  return {
    provider: "groq",
    apiKey: (typeof process !== "undefined" && process.env && process.env.GROQ_API_KEY) || "",
    groqModel: "llama-3.3-70b-versatile",
    localModel: "llama3",
  };
}

/**
 * Save config to localStorage.
 */
export function saveConfig(config: LLMConfig): void {
  localStorage.setItem("sheetcraft_llm_config", JSON.stringify(config));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Resolve the correct model for the active provider.
 * Automatically handles Vision model selection.
 */
function resolveModel(cfg: LLMConfig, hasImages: boolean = false): string {
  if (cfg.provider === "groq") {
    if (hasImages) return "meta-llama/llama-4-maverick-17b-128e-instruct";
    let model = cfg.groqModel || "llama-3.3-70b-versatile";
    if (model.includes("llama-3.2") && (model.includes("vision") || model.includes("preview"))) return "llama-3.3-70b-versatile";
    if (model.includes(":")) return "llama-3.3-70b-versatile";
    return model;
  } else if (cfg.provider === "gemini") {
    return cfg.geminiModel || "gemini-1.5-flash";
  } else if (cfg.provider === "openai") {
    return cfg.openaiModel || "gpt-4o";
  } else {
    return cfg.localModel || cfg.model || "llama3";
  }
}

async function callGemini(messages: ChatMessage[], model: string, apiKey: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    // Transform messages to Gemini format
    // Simple approach: Combine system prompt into first user message
    const contents: any[] = [];
    let systemPrompt = "";

    messages.forEach(msg => {
        if (msg.role === "system") {
            const content = Array.isArray(msg.content) 
                ? msg.content.map(c => c.text || "").join("") 
                : msg.content;
            systemPrompt += content + "\n\n";
        } else {
            const parts: any[] = [];
            
            // Add system prompt to first user message context if exists
            if (systemPrompt && msg.role === "user" && contents.length === 0) {
                 parts.push({ text: "SYSTEM INSTRUCTIONS:\n" + systemPrompt });
                 systemPrompt = ""; // Clear it
            }

            if (typeof msg.content === "string") {
                parts.push({ text: msg.content });
            } else {
                msg.content.forEach(c => {
                    if (c.type === "text") parts.push({ text: c.text });
                    if (c.type === "image_url" && c.image_url) {
                        const base64 = c.image_url.url.split(",")[1]; // Remove data:image/png;base64,
                        if (base64) {
                            parts.push({ inline_data: { mime_type: "image/png", data: base64 }});
                        }
                    }
                });
            }
            // Map 'assistant' to 'model' for Gemini
            contents.push({ role: msg.role === "assistant" ? "model" : "user", parts });
        }
    });

    // Fallback: If no user message yet (only system), we can't send. Gemini needs at least one message.
    if (contents.length === 0 && systemPrompt) {
        contents.push({ role: "user", parts: [{ text: "SYSTEM INSTRUCTIONS:\n" + systemPrompt }] });
    }

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents, generationConfig: { temperature: 0.1 } })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Gemini Error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini returned empty response.");
    return text;
}

/**
 * Call LLM with automatic 429 retry.
 */
export async function callLLM(messages: ChatMessage[], config?: LLMConfig): Promise<string> {
  const cfg = config || getConfig();
  
  // Check for images in the messages payload
  const hasImages = messages.some(m => Array.isArray(m.content) && m.content.some(p => p.type === "image_url"));
  const model = resolveModel(cfg, hasImages);

  // Gemini Handler
  if (cfg.provider === "gemini") {
      if (!cfg.geminiKey) throw new Error("Please enter your Google Gemini API Key in Settings.");
      return callGemini(messages, model, cfg.geminiKey);
  }

  // OpenAI Handler
  if (cfg.provider === "openai") {
      if (!cfg.openaiKey) throw new Error("Please enter your OpenAI API Key in Settings.");
      // Standard OpenAI format
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${cfg.openaiKey}` 
          },
          body: JSON.stringify({ messages, model, temperature: 0.1, max_tokens: 4096 })
      });
      if (!response.ok) throw new Error(`OpenAI Error: ${await response.text()}`);
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
  }

  // Legacy Handlers (Groq / Local)
  let url: string;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (cfg.provider === "groq") {
    url = DEFAULT_GROQ_URL;
    if (cfg.apiKey) headers["Authorization"] = `Bearer ${cfg.apiKey}`;
  } else {
    url = cfg.baseUrl || DEFAULT_LOCAL_URL;
    if (cfg.apiKey) headers["Authorization"] = `Bearer ${cfg.apiKey}`;
  }

  const body = JSON.stringify({
    messages,
    model,
    temperature: 0.1,
    max_tokens: 4096, 
  });

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(url, { method: "POST", headers, body });

    // 429 — rate limit
    if (response.status === 429) {
      if (attempt < MAX_RETRIES) {
        const retryAfter = response.headers.get("retry-after");
        const waitMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(`Rate limited. Waiting ${waitMs}ms (retry ${attempt + 1}/${MAX_RETRIES})...`);
        await sleep(waitMs);
        continue;
      }
      throw new Error("Rate limited. Please wait a moment and try again.");
    }

    // 404 — model not found
    if (response.status === 404) {
      throw new Error(`Model "${model}" not found. Go to Settings ⚙️ and select a valid model.`);
    }

      // Other errors
    if (!response.ok) {
      const errText = await response.text();
      // Friendly OOM message (GPU/CPU/RAM)
      if (errText.includes("out of memory") || errText.includes("cudaMalloc") || errText.includes("unable to allocate")) {
        throw new Error("Local AI ran out of memory (RAM/VRAM). Try selecting a smaller model (e.g. 7b/8b), closing other apps, or switching to Groq (Cloud).");
      }
      throw new Error(`AI Error (${response.status}): ${errText.substring(0, 120)}`);
    }

    // Success
    const data = await response.json();
    let content = data.choices[0].message.content.trim();

    // Clean markdown fences
    content = content.replace(/^```(?:javascript|js|typescript|ts)?\n?/i, "");
    content = content.replace(/\n?```$/i, "");
    content = content.trim();

    // Remove accidental sheet redeclarations
    content = content.replace(/(?:const|let|var)\s+sheet\s*=\s*.*?;/g, "// sheet redeclaration removed");

    return content;
  }

  throw new Error("Failed after maximum retries.");
}

/**
 * Fetch locally available Ollama models.
 */
export interface OllamaModel {
  name: string;
  size: number;
  modified_at: string;
}

export async function fetchOllamaModels(baseHost?: string): Promise<OllamaModel[]> {
  const host = baseHost || "http://localhost:11434";
  try {
    const response = await fetch(`${host}/api/tags`, { method: "GET" });
    if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
    const data = await response.json();
    return (data.models || []).map((m: any) => ({
      name: m.name,
      size: m.size || 0,
      modified_at: m.modified_at || "",
    }));
  } catch (e) {
    console.warn("Could not fetch Ollama models:", e);
    return [];
  }
}
