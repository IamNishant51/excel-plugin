/* global console, document, Excel, Office */
import "./taskpane.css";
import { SYSTEM_PROMPT } from "../services/prompt";
import { callLLM, getConfig, saveConfig, fetchOllamaModels, LLMConfig } from "../services/llm.service";

// ─── Initialization ────────────────────────────────────────────
Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("app-body").style.flexDirection = "column";

    // Wire up main action
    document.getElementById("run").onclick = runAICommand;

    // Wire up settings
    document.getElementById("settings-toggle").onclick = toggleSettings;
    document.getElementById("save-settings").onclick = handleSaveSettings;
    document.getElementById("refresh-models").onclick = () => loadOllamaModels();

    // Load existing config into settings form
    loadSettingsUI();
  }
});

// ─── Settings Panel ────────────────────────────────────────────
function toggleSettings(): void {
  const panel = document.getElementById("settings-panel");
  const isHidden = panel.style.display === "none" || panel.style.display === "";
  panel.style.display = isHidden ? "block" : "none";
  
  // Auto-fetch models when opening and provider is local
  if (isHidden) {
    const provider = (document.getElementById("setting-provider") as HTMLSelectElement).value;
    if (provider === "local") {
      loadOllamaModels();
    }
  }
}

function loadSettingsUI(): void {
  const config = getConfig();
  const providerSelect = document.getElementById("setting-provider") as HTMLSelectElement;
  const apiKeyInput = document.getElementById("setting-api-key") as HTMLInputElement;
  const baseUrlInput = document.getElementById("setting-base-url") as HTMLInputElement;
  const groqModelInput = document.getElementById("setting-groq-model") as HTMLInputElement;

  providerSelect.value = config.provider;
  apiKeyInput.value = config.apiKey || "";
  baseUrlInput.value = config.baseUrl || "";
  groqModelInput.value = config.model || "";

  // Toggle provider-specific fields
  updateProviderFields(config.provider);
  providerSelect.onchange = () => {
    const newProvider = providerSelect.value as "groq" | "local";
    updateProviderFields(newProvider);
    if (newProvider === "local") {
      loadOllamaModels();
    }
  };
}

function updateProviderFields(provider: string): void {
  const groqFields = document.getElementById("groq-fields");
  const localFields = document.getElementById("local-fields");
  groqFields.style.display = provider === "groq" ? "block" : "none";
  localFields.style.display = provider === "local" ? "block" : "none";
}

async function loadOllamaModels(): Promise<void> {
  const select = document.getElementById("setting-local-model") as HTMLSelectElement;
  const statusEl = document.getElementById("model-status");
  const baseUrlInput = document.getElementById("setting-base-url") as HTMLInputElement;
  const host = baseUrlInput.value.trim() || "http://localhost:11434";

  // Show loading
  select.innerHTML = `<option value="" disabled selected>Loading...</option>`;
  statusEl.textContent = "";
  statusEl.className = "model-status";

  const models = await fetchOllamaModels(host);

  if (models.length === 0) {
    select.innerHTML = `<option value="" disabled selected>No models found</option>`;
    statusEl.textContent = "⚠ Ollama not running or no models downloaded";
    statusEl.className = "model-status model-status-warn";
    return;
  }

  // Populate dropdown
  const config = getConfig();
  select.innerHTML = "";
  models.forEach((m) => {
    const option = document.createElement("option");
    option.value = m.name;
    const sizeGB = (m.size / 1e9).toFixed(1);
    option.textContent = `${m.name} (${sizeGB}GB)`;
    if (config.model === m.name) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  statusEl.textContent = `${models.length} model${models.length > 1 ? "s" : ""} available`;
  statusEl.className = "model-status model-status-ok";
}

function handleSaveSettings(): void {
  const providerSelect = document.getElementById("setting-provider") as HTMLSelectElement;
  const provider = providerSelect.value as "groq" | "local";

  let config: LLMConfig;

  if (provider === "groq") {
    const apiKeyInput = document.getElementById("setting-api-key") as HTMLInputElement;
    const groqModelInput = document.getElementById("setting-groq-model") as HTMLInputElement;
    config = {
      provider: "groq",
      apiKey: apiKeyInput.value.trim(),
      model: groqModelInput.value.trim() || "llama-3.3-70b-versatile",
    };
  } else {
    const baseUrlInput = document.getElementById("setting-base-url") as HTMLInputElement;
    const localModelSelect = document.getElementById("setting-local-model") as HTMLSelectElement;
    const host = baseUrlInput.value.trim() || "http://localhost:11434";
    config = {
      provider: "local",
      baseUrl: `${host}/v1/chat/completions`,
      model: localModelSelect.value,
    };
  }

  saveConfig(config);

  // Visual feedback
  const btn = document.getElementById("save-settings");
  btn.textContent = "Saved ✓";
  setTimeout(() => { btn.textContent = "Save"; }, 1500);

  // Close panel
  setTimeout(() => {
    document.getElementById("settings-panel").style.display = "none";
  }, 800);
}

// ─── Main Command Runner ───────────────────────────────────────
export async function runAICommand(): Promise<void> {
  const statusElement = document.getElementById("status-message");
  const debugElement = document.getElementById("debug-code");
  const promptInput = document.getElementById("prompt-input") as HTMLTextAreaElement;
  const button = document.getElementById("run") as HTMLButtonElement;

  const userPrompt = promptInput.value.trim();
  if (!userPrompt) {
    showStatus(statusElement, "info", "Please enter a command.");
    return;
  }

  // UI: Show loading state
  const originalButtonHTML = button.innerHTML;
  button.disabled = true;
  button.innerHTML = `<span class="btn-spinner"></span><span>Generating...</span>`;
  showStatus(statusElement, "info", '<div class="spinner"></div><span>Thinking...</span>');
  debugElement.innerText = "";

  try {
    // 1. Generate code via LLM
    const generatedCode = await callLLM([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ]);

    debugElement.innerText = generatedCode;

    // 2. Execute in Excel
    button.innerHTML = `<span class="btn-spinner"></span><span>Running...</span>`;
    showStatus(statusElement, "info", '<div class="spinner"></div><span>Executing in Excel...</span>');

    await executeExcelCode(generatedCode);

    // 3. Success
    showStatus(statusElement, "success", `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
      <span>Done</span>
    `);

  } catch (error) {
    console.error(error);
    showStatus(statusElement, "error", `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>${error.message}</span>
    `);
  } finally {
    button.disabled = false;
    button.innerHTML = originalButtonHTML;
  }
}

// ─── Helpers ───────────────────────────────────────────────────
function showStatus(el: HTMLElement, type: "info" | "success" | "error", html: string): void {
  el.innerHTML = html;
  el.className = `status-pill ${type}`;
  el.style.display = "flex";
}

async function executeExcelCode(code: string): Promise<void> {
  await Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    try {
      await new Function(
        "context",
        "sheet",
        "Excel",
        `return (async () => { ${code}\nawait context.sync(); })()`
      )(context, sheet, Excel);
    } catch (e) {
      console.error("Execution Error:", e);
      throw e;
    }
    await context.sync();
  });
}