/**
 * LLM Service — Abstraction layer for AI providers.
 * Stores separate model configs per provider to avoid cross-contamination.
 * Includes auto-retry with backoff for 429 rate limits.
 */

export interface LLMConfig {
  provider: "groq" | "local";
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  groqModel?: string;   // Stored separately
  localModel?: string;  // Stored separately
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const DEFAULT_GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_LOCAL_URL = "http://localhost:11434/v1/chat/completions";
const DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant";
const DEFAULT_LOCAL_MODEL = "llama3";

// Valid Groq models (guaranteed to work)
export const GROQ_MODELS = [
  { id: "llama-3.1-8b-instant",      label: "Llama 3.1 8B (Fast, 131K TPM)" },
  { id: "llama-3.3-70b-versatile",    label: "Llama 3.3 70B (Smart, 12K TPM)" },
  { id: "gemma2-9b-it",              label: "Gemma 2 9B (15K TPM)" },
  { id: "mixtral-8x7b-32768",        label: "Mixtral 8x7B (5K TPM)" },
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
    groqModel: DEFAULT_GROQ_MODEL,
    localModel: DEFAULT_LOCAL_MODEL,
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
 */
function resolveModel(cfg: LLMConfig): string {
  if (cfg.provider === "groq") {
    const model = cfg.groqModel || cfg.model || DEFAULT_GROQ_MODEL;
    // Validate: if it looks like a local model name (has ':'), use default
    if (model.includes(":")) return DEFAULT_GROQ_MODEL;
    return model;
  } else {
    return cfg.localModel || cfg.model || DEFAULT_LOCAL_MODEL;
  }
}

/**
 * Call LLM with automatic 429 retry.
 */
export async function callLLM(messages: ChatMessage[], config?: LLMConfig): Promise<string> {
  const cfg = config || getConfig();

  let url: string;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (cfg.provider === "groq") {
    url = DEFAULT_GROQ_URL;
    if (cfg.apiKey) headers["Authorization"] = `Bearer ${cfg.apiKey}`;
  } else {
    url = cfg.baseUrl || DEFAULT_LOCAL_URL;
    if (cfg.apiKey) headers["Authorization"] = `Bearer ${cfg.apiKey}`;
  }

  const model = resolveModel(cfg);

  const body = JSON.stringify({
    messages,
    model,
    temperature: 0.1,
    max_tokens: 2048,
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
      // Friendly GPU OOM message
      if (errText.includes("out of memory") || errText.includes("cudaMalloc")) {
        throw new Error("GPU out of memory. Select a smaller model in Settings ⚙️ or switch to Groq (cloud).");
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
