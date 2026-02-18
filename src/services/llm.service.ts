/**
 * LLM Service — Abstraction layer for AI providers.
 * Supports: Groq (cloud), Ollama / LM Studio / any OpenAI-compatible local server.
 */

export interface LLMConfig {
  provider: "groq" | "local";
  apiKey?: string;      // Required for Groq, optional for local
  baseUrl?: string;     // For local models (e.g., http://localhost:11434/v1)
  model?: string;       // Model name
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const DEFAULT_GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_LOCAL_URL = "http://localhost:11434/v1/chat/completions"; // Ollama default
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";
const DEFAULT_LOCAL_MODEL = "llama3";

/**
 * Get the saved LLM configuration from localStorage.
 */
export function getConfig(): LLMConfig {
  try {
    const saved = localStorage.getItem("sheetcraft_llm_config");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn("Failed to load LLM config from localStorage", e);
  }
  // Default: Groq with env key
  return {
    provider: "groq",
    apiKey: (typeof process !== "undefined" && process.env && process.env.GROQ_API_KEY) || "",
    baseUrl: DEFAULT_GROQ_URL,
    model: DEFAULT_GROQ_MODEL,
  };
}

/**
 * Save LLM configuration to localStorage.
 */
export function saveConfig(config: LLMConfig): void {
  localStorage.setItem("sheetcraft_llm_config", JSON.stringify(config));
}

/**
 * Call the configured LLM with the given messages.
 */
export async function callLLM(messages: ChatMessage[], config?: LLMConfig): Promise<string> {
  const cfg = config || getConfig();

  let url: string;
  let headers: Record<string, string> = { "Content-Type": "application/json" };

  if (cfg.provider === "groq") {
    url = DEFAULT_GROQ_URL;
    if (cfg.apiKey) {
      headers["Authorization"] = `Bearer ${cfg.apiKey}`;
    }
  } else {
    // Local provider (Ollama, LM Studio, etc.)
    url = cfg.baseUrl || DEFAULT_LOCAL_URL;
    if (cfg.apiKey) {
      headers["Authorization"] = `Bearer ${cfg.apiKey}`;
    }
  }

  const model = cfg.model || (cfg.provider === "groq" ? DEFAULT_GROQ_MODEL : DEFAULT_LOCAL_MODEL);

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      messages,
      model,
      temperature: 0.1,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("LLM API Error:", response.status, errorText);
    throw new Error(`AI Error (${response.status}): ${errorText.substring(0, 200)}`);
  }

  const data = await response.json();
  let content = data.choices[0].message.content.trim();

  // Clean up markdown fences
  content = content.replace(/^```(?:javascript|js|typescript|ts)?\n?/i, "");
  content = content.replace(/\n?```$/i, "");
  content = content.trim();

  // Remove accidental sheet redeclarations
  content = content.replace(/(?:const|let|var)\s+sheet\s*=\s*.*?;/g, "// sheet redeclaration removed");

  return content;
}

/**
 * Fetch list of locally available Ollama models.
 * Ollama exposes GET http://localhost:11434/api/tags
 */
export interface OllamaModel {
  name: string;
  size: number;         // bytes
  modified_at: string;
}

export async function fetchOllamaModels(baseHost?: string): Promise<OllamaModel[]> {
  const host = baseHost || "http://localhost:11434";
  const url = `${host}/api/tags`;

  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }
    const data = await response.json();
    // Ollama returns { models: [{ name, size, modified_at, ... }] }
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
