/**
 * LLM Service — Abstraction layer for AI providers.
 * Stores separate model configs per provider to avoid cross-contamination.
 * Includes auto-retry with backoff for 429 rate limits.
 */

export interface LLMConfig {
  provider: "groq" | "local" | "gemini" | "openai" | "anthropic" | "openrouter";
  apiKey?: string;        // Storage for Groq Key (legacy name)
  geminiKey?: string;     // Storage for Gemini Key
  openaiKey?: string;     // Storage for OpenAI Key
  anthropicKey?: string;  // Storage for Anthropic Key
  openrouterKey?: string; // Storage for OpenRouter Key
  baseUrl?: string;
  model?: string;
  groqModel?: string;
  localModel?: string;
  geminiModel?: string;
  openaiModel?: string;
  anthropicModel?: string;
  openrouterModel?: string;
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
  { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B (Smart, Text-Only)" },
  { id: "meta-llama/llama-4-maverick-17b-128e-instruct", label: "Llama 4 Maverick (Vision)" },
  { id: "gemma2-9b-it", label: "Gemma 2 9B (15K TPM)" },
  { id: "mixtral-8x7b-32768", label: "Mixtral 8x7B (5K TPM)" },
];

export const GEMINI_MODELS = [
  { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash (Fast, Free)" },
  { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro (Smarter)" },
];

export const OPENAI_MODELS = [
  { id: "gpt-4o-mini", label: "GPT-4o Mini (Fast)" },
  { id: "gpt-4o", label: "GPT-4o (Smart)" },
];

export const ANTHROPIC_MODELS = [
  { id: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet (Best for Code)" },
  { id: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku (Fast)" },
];

export const OPENROUTER_MODELS = [
  { id: "anthropic/claude-3.5-sonnet:beta", label: "Claude 3.5 Sonnet" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { id: "openai/gpt-4o", label: "GPT-4o" },
  { id: "meta-llama/llama-3.3-70b-instruct", label: "Llama 3.3 70B" },
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
    localModel: "qwen2.5-coder:7b",
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
  } else if (cfg.provider === "anthropic") {
    return cfg.anthropicModel || "claude-3-5-sonnet-20241022";
  } else if (cfg.provider === "openrouter") {
    return cfg.openrouterModel || "anthropic/claude-3.5-sonnet:beta";
  } else {
    return cfg.localModel || cfg.model || "llama3";
  }
}

async function callGemini(messages: ChatMessage[], model: string, apiKey: string, signal?: AbortSignal): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents: any[] = [];
  const systemParts: any[] = [];

  messages.forEach(msg => {
    if (msg.role === "system") {
      const text = Array.isArray(msg.content)
        ? msg.content.map(c => (c.type === "text" ? c.text : "")).join("")
        : msg.content;
      if (text) systemParts.push({ text });
    } else {
      const role = msg.role === "assistant" ? "model" : "user";
      const parts: any[] = [];

      if (typeof msg.content === "string") {
        if (msg.content) parts.push({ text: msg.content });
      } else {
        msg.content.forEach(c => {
          if (c.type === "text" && c.text) parts.push({ text: c.text });
          if (c.type === "image_url" && c.image_url) {
            const base64 = c.image_url.url.split(",")[1]; // Remove data:image/png;base64,
            if (base64) {
              parts.push({ inline_data: { mime_type: "image/png", data: base64 } });
            }
          }
        });
      }

      if (parts.length > 0) {
        // Gemini requirement: roles must alternate. Merge consecutive same-role messages.
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts.push(...parts);
        } else {
          contents.push({ role, parts });
        }
      }
    }
  });

  // Gemini requirement: contents must start with user and end with user (for non-stream)
  // Actually, it just needs to start with user. If it ends with model, it's fine for continuation.
  // But we MUST have at least one message in contents if we don't have system_instruction.

  const payload: any = {
    contents,
    generationConfig: { temperature: 0, topP: 1, maxOutputTokens: 4096 }
  };

  if (systemParts.length > 0) {
    payload.system_instruction = { parts: systemParts };
  }

  // Final check: If no contents but we have system instructions, we need a dummy user message
  if (contents.length === 0) {
    contents.push({ role: "user", parts: [{ text: "Hello. Please acknowledge system instructions." }] });
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal
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
 * Core LLM dispatcher with automatic failover and retry logic.
 */
export async function callLLM(messages: ChatMessage[], config?: LLMConfig, signal?: AbortSignal): Promise<string> {
  const primaryConfig = config || getConfig();
  let currentConfig = { ...primaryConfig };
  let failoverOccurred = false;

  const hasImages = messages.some(m =>
    Array.isArray(m.content) && m.content.some(p => p.type === "image_url")
  );

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const model = resolveModel(currentConfig, hasImages);
      let content = "";

      // Route to appropriate provider handler
      if (currentConfig.provider === "gemini") {
        if (!currentConfig.geminiKey) throw new Error("Missing Gemini API Key");
        content = await callGemini(messages, model, currentConfig.geminiKey, signal);
      }
      else if (currentConfig.provider === "openai") {
        if (!currentConfig.openaiKey) throw new Error("Missing OpenAI API Key");
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${currentConfig.openaiKey}` },
          body: JSON.stringify({ messages, model, temperature: 0, top_p: 1, max_tokens: 4096 }),
          signal
        });
        const data = await resp.json();
        content = data.choices?.[0]?.message?.content || "";
      }
      else if (currentConfig.provider === "anthropic") {
        if (!currentConfig.anthropicKey) throw new Error("Missing Anthropic API Key");

        // Anthropic requires a different payload structure, separating system messages
        let systemPrompt = "";
        const anthropicMessages: any[] = [];

        messages.forEach(m => {
          if (m.role === "system") {
            systemPrompt = typeof m.content === "string" ? m.content : m.content.map(c => c.text || "").join("");
          } else {
            anthropicMessages.push({
              role: m.role,
              content: typeof m.content === "string" ? m.content : m.content.map(c => {
                if (c.type === "text") return { type: "text", text: c.text };
                if (c.type === "image_url" && c.image_url) {
                  const base64 = c.image_url.url.split(",")[1];
                  return { type: "image", source: { type: "base64", media_type: "image/png", data: base64 } };
                }
                return { type: "text", text: "" };
              }).filter(c => c.type === "text" ? c.text : true)
            });
          }
        });

        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": currentConfig.anthropicKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true"
          },
          body: JSON.stringify({
            messages: anthropicMessages,
            system: systemPrompt ? systemPrompt : undefined,
            model,
            max_tokens: 4096,
            temperature: 0
          }),
          signal
        });

        if (!resp.ok) {
          const errText = await resp.text();
          if (resp.status === 429) throw new Error("RATE_LIMIT");
          throw new Error(`Anthropic Error (${resp.status}): ${errText.substring(0, 100)}`);
        }

        const data = await resp.json();
        content = data.content?.[0]?.text || "";
      }
      else if (currentConfig.provider === "openrouter") {
        if (!currentConfig.openrouterKey) throw new Error("Missing OpenRouter API Key");
        const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentConfig.openrouterKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "SheetOS AI Plugin"
          },
          body: JSON.stringify({ messages, model, temperature: 0, top_p: 1, max_tokens: 4096 }),
          signal
        });

        if (!resp.ok) {
          const errText = await resp.text();
          if (resp.status === 429) throw new Error("RATE_LIMIT");
          throw new Error(`OpenRouter Error (${resp.status}): ${errText.substring(0, 100)}`);
        }

        const data = await resp.json();
        content = data.choices?.[0]?.message?.content || "";
      }
      else {
        // Groq or Local
        const url = currentConfig.provider === "groq" ? DEFAULT_GROQ_URL : (currentConfig.baseUrl || DEFAULT_LOCAL_URL);
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (currentConfig.apiKey) headers["Authorization"] = `Bearer ${currentConfig.apiKey}`;

        const resp = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({ messages, model, temperature: 0, top_p: 1, max_tokens: 4096 }),
          signal
        });

        if (!resp.ok) {
          const errText = await resp.text();
          const status = resp.status;

          if (status === 429) throw new Error("RATE_LIMIT");
          throw new Error(`AI Error (${status}): ${errText.substring(0, 100)}`);
        }

        const data = await resp.json();
        content = data.choices?.[0]?.message?.content || "";
      }

      // SHARED CLEANUP (Ensures no hallucinations/formatting issues across models)
      if (!content) throw new Error("Empty response from AI");

      let cleanContent = content.trim();
      cleanContent = cleanContent.replace(/^```(?:javascript|js|typescript|ts)?\n?/i, "");
      cleanContent = cleanContent.replace(/\n?```$/i, "");
      cleanContent = cleanContent.trim();
      cleanContent = cleanContent.replace(/(?:const|let|var)\s+sheet\s*=\s*.*?;/g, "// sheet redeclaration removed");

      return cleanContent;

    } catch (err: any) {
      if (err.message === "RATE_LIMIT" || err.message.includes("429")) {
        if (attempt < MAX_RETRIES) {
          const waitMs = BASE_DELAY_MS * Math.pow(2, attempt);
          console.warn(`Rate limit retry ${attempt + 1}/${MAX_RETRIES} in ${waitMs}ms...`);
          await sleep(waitMs);
          continue;
        }
      }
      throw err;
    }
  }

  throw new Error("Failed after maximum retries and possible failover.");
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
