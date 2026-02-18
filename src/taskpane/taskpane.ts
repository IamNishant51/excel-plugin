/* global console, document, Excel, Office */
import "./taskpane.css";
import { SYSTEM_PROMPT } from "../services/prompt";
import { CHAT_PROMPT } from "../services/chat-prompt";
import { callLLM, getConfig, saveConfig, fetchOllamaModels, LLMConfig } from "../services/llm.service";
import { getCachedResponse, cacheResponse } from "../services/cache";
import { Icons } from "../services/icons";

// ─── Types ─────────────────────────────────────────────────────
type Mode = "planning" | "agent";
type ActionCategory = "cleanup" | "analysis" | "format" | "templates";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

// ─── State ─────────────────────────────────────────────────────
let currentMode: Mode = "planning";
let currentCategory: ActionCategory = "cleanup";
const chatHistory: ChatMessage[] = [];
let chatConversation: { role: "system" | "user" | "assistant"; content: string }[] = [];
let isChatBusy = false;

// ─── Quick Actions by Category ─────────────────────────────────
const CATEGORIZED_ACTIONS: Record<ActionCategory, { icon: string; label: string; prompt: string }[]> = {
  cleanup: [
    { icon: "eraser",      label: "Remove Duplicates",    prompt: "Find and remove duplicate rows from the data, keeping the first occurrence of each." },
    { icon: "eraser",      label: "Trim Spaces",          prompt: "Trim all leading and trailing whitespace from every cell in the used range." },
    { icon: "eraser",      label: "Fix Empty Rows",       prompt: "Find and delete all completely empty rows within the used data range." },
    { icon: "search",      label: "Find Blanks",          prompt: "Highlight all blank cells in the used range with a light yellow background color (#FFF3CD)." },
    { icon: "hash",        label: "Fix Number Format",    prompt: "Detect columns with numbers stored as text and convert them back to proper numbers." },
    { icon: "eraser",      label: "Standardize Case",     prompt: "Convert all text in column A to proper case (first letter capitalized, rest lowercase)." },
    { icon: "eraser",      label: "Clear Formatting",     prompt: "Clear all formatting from the used range while keeping data, then auto-fit all columns." },
    { icon: "copy",        label: "Split Column",         prompt: "Split the data in column A by comma delimiter into separate columns B, C, D." },
  ],
  analysis: [
    { icon: "formula",     label: "Auto SUM",             prompt: "Add a SUM formula at the bottom of each numeric column with a bold TOTAL label." },
    { icon: "formula",     label: "AVERAGE Row",          prompt: "Add an AVERAGE formula at the bottom of each numeric column with a bold AVERAGE label." },
    { icon: "barChart",    label: "Column Chart",         prompt: "Create a clustered column chart from the data in the sheet. Add a title, legend at the bottom, and position it next to the data." },
    { icon: "trendUp",     label: "Trend Line",           prompt: "Create a line chart from the numeric data showing trends over time. Add a title and gridlines." },
    { icon: "formula",     label: "COUNT & COUNTA",       prompt: "Add COUNT and COUNTA formulas at the bottom to count numeric and non-empty cells in each column." },
    { icon: "sortAsc",     label: "Sort A→Z",             prompt: "Sort the data by the first column in ascending order." },
    { icon: "filter",      label: "AutoFilter",           prompt: "Apply AutoFilter to the data range so users can filter any column." },
    { icon: "trendUp",     label: "Conditional Colors",   prompt: "Add conditional formatting with a 3-color scale: green for high, yellow for medium, red for low values on numeric columns." },
  ],
  format: [
    { icon: "paintbrush",  label: "Professional",         prompt: "Apply professional formatting: bold headers with dark blue (#2B3A67) background and white text, alternating row colors (#F0F4FF and white), thin borders, and auto-fit." },
    { icon: "paintbrush",  label: "Dark Theme",           prompt: "Apply dark theme formatting: dark gray (#2D2D2D) header with gold (#FFD700) text, dark rows (#3D3D3D) alternating with (#333333), light gray text, and thin borders." },
    { icon: "paintbrush",  label: "Colorful",             prompt: "Apply colorful formatting: gradient blue header (#4A90D9) with white text, alternating pastel blue and pink rows, rounded borders effect, and auto-fit." },
    { icon: "snowflake",   label: "Freeze Header",        prompt: "Freeze the first row so headers stay visible when scrolling." },
    { icon: "table",       label: "Excel Table",          prompt: "Convert the data into a formatted Excel Table with TableStyleMedium9 style and auto-fit columns." },
    { icon: "hash",        label: "Currency $",           prompt: "Format all numeric columns as currency ($#,##0.00) and auto-fit." },
    { icon: "hash",        label: "Percentage %",         prompt: "Format the last numeric column as percentage (0.00%) and auto-fit." },
    { icon: "paintbrush",  label: "Borders All",          prompt: "Add thin borders to all cells in the used range — inside horizontal, inside vertical, and all edges." },
  ],
  templates: [
    { icon: "fileTemplate", label: "Monthly Budget",       prompt: "Create a monthly budget tracker with categories: Housing, Utilities, Food, Transport, Entertainment, Savings. Add columns for Budget, Actual, and Difference with SUM at bottom. Use professional formatting with green for under-budget and red for over-budget conditional formatting." },
    { icon: "fileTemplate", label: "Invoice",              prompt: "Create a professional invoice template with: Company Name header, Invoice #, Date, Bill To section, items table with Description, Quantity, Unit Price, Total columns, Subtotal, Tax (10%), and Grand Total calculations. Apply clean formatting." },
    { icon: "fileTemplate", label: "Employee List",        prompt: "Create an employee directory with 8 sample employees: Name, Department (HR/Engineering/Marketing/Sales), Email, Phone, Joining Date, Salary. Apply professional table formatting with alternating rows and currency format for salary." },
    { icon: "fileTemplate", label: "Project Tracker",      prompt: "Create a project tracker with 6 sample tasks: Task Name, Assigned To, Priority (High/Medium/Low), Status (Not Started/In Progress/Complete), Start Date, Due Date. Add dropdown validation for Priority and Status. Use conditional formatting for status colors." },
    { icon: "fileTemplate", label: "Sales Report",         prompt: "Create a quarterly sales report with 5 products across Q1-Q4. Add Total column and row with SUM formulas. Create a column chart showing quarterly performance. Apply professional formatting." },
    { icon: "fileTemplate", label: "Attendance Sheet",     prompt: "Create a monthly attendance sheet for 10 employees with dates as columns (1-31). Mark P for present, A for absent, L for leave. Add summary columns for Total Present, Absent, and Leave. Apply conditional formatting." },
    { icon: "fileTemplate", label: "Grade Book",           prompt: "Create a student grade book for 8 students with 5 assignments, Midterm, Final, and Total/Grade columns. Add weighted average formulas and letter grade calculation (A/B/C/D/F). Apply professional formatting with conditional colors." },
    { icon: "fileTemplate", label: "Weekly Schedule",      prompt: "Create a weekly schedule template with time slots from 8 AM to 6 PM (1-hour intervals) and columns for Mon-Fri. Add borders, colored header, and merge the title cell. Apply a clean, readable format." },
  ],
};

// Chat Suggestions (shown on welcome screen)
const CHAT_SUGGESTIONS = [
  { icon: "formula",  text: "When should I use VLOOKUP vs INDEX/MATCH?" },
  { icon: "barChart", text: "Which chart works best for my data?" },
  { icon: "trendUp",  text: "Help me clean up messy spreadsheet data" },
  { icon: "table",    text: "Best way to structure a dashboard?" },
];

// ─── Initialization ────────────────────────────────────────────
Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";

    // Inject icons
    injectIcons();

    // Wire up actions
    document.getElementById("run").onclick = runAICommand;
    document.getElementById("settings-toggle").onclick = () => togglePanel("settings-panel");
    document.getElementById("docs-toggle").onclick = () => togglePanel("docs-panel");
    document.getElementById("save-settings").onclick = handleSaveSettings;
    document.getElementById("refresh-models").onclick = () => loadOllamaModels();

    // Mode toggle
    document.getElementById("mode-planning").onclick = () => switchMode("planning");
    document.getElementById("mode-agent").onclick = () => switchMode("agent");

    // Chat actions
    document.getElementById("chat-send").onclick = sendChatMessage;
    document.getElementById("chat-clear").onclick = clearChat;
    setupChatInput();

    // Category tabs
    document.querySelectorAll(".category-tab").forEach((tab) => {
      (tab as HTMLElement).onclick = () => {
        const cat = (tab as HTMLElement).dataset.category as ActionCategory;
        switchCategory(cat);
      };
    });

    // Build UI
    buildQuickActions();
    buildChatSuggestions();
    loadSettingsUI();
    injectDocIcons();
    injectCategoryIcons();
  }
});

// ─── Icon Injection ────────────────────────────────────────────
function injectIcons(): void {
  const el = (id: string, html: string) => {
    const node = document.getElementById(id);
    if (node) node.innerHTML = html;
  };
  el("logo-icon", Icons.fileText);
  el("settings-toggle", Icons.settings);
  el("docs-toggle", Icons.helpCircle);
  el("run-icon", Icons.arrowRight);
  el("chevron-icon", Icons.chevronDown);
  el("refresh-models", Icons.refresh);
  el("mode-planning-icon", Icons.messageCircle);
  el("mode-agent-icon", Icons.zap);
  el("chat-send-icon", Icons.send);
  el("chat-clear-icon", Icons.trash);
  el("welcome-sparkle", Icons.sparkles);
}

function injectDocIcons(): void {
  document.querySelectorAll(".doc-icon[data-icon]").forEach((el) => {
    const key = el.getAttribute("data-icon") as keyof typeof Icons;
    if (Icons[key]) el.innerHTML = Icons[key];
  });
}

function injectCategoryIcons(): void {
  document.querySelectorAll(".cat-icon[data-icon]").forEach((el) => {
    const key = el.getAttribute("data-icon") as keyof typeof Icons;
    if (Icons[key]) el.innerHTML = Icons[key];
  });
}

// ─── Mode Switching ────────────────────────────────────────────
function switchMode(mode: Mode): void {
  if (mode === currentMode) return;
  currentMode = mode;

  // Update tabs
  document.querySelectorAll(".mode-tab").forEach((tab) => {
    tab.classList.toggle("active", (tab as HTMLElement).dataset.mode === mode);
  });

  // Update indicator
  const indicator = document.getElementById("mode-indicator");
  if (mode === "agent") {
    indicator.classList.add("right");
  } else {
    indicator.classList.remove("right");
  }

  // Show/hide content
  document.getElementById("planning-mode").classList.toggle("active", mode === "planning");
  document.getElementById("agent-mode").classList.toggle("active", mode === "agent");

  // Focus appropriate input
  if (mode === "planning") {
    setTimeout(() => (document.getElementById("chat-input") as HTMLTextAreaElement).focus(), 200);
  } else {
    setTimeout(() => (document.getElementById("prompt-input") as HTMLTextAreaElement).focus(), 200);
  }
}

// ─── Category Switching ────────────────────────────────────────
function switchCategory(category: ActionCategory): void {
  currentCategory = category;

  document.querySelectorAll(".category-tab").forEach((tab) => {
    tab.classList.toggle("active", (tab as HTMLElement).dataset.category === category);
  });

  buildQuickActions();
}

// ─── Quick Actions (Agent Mode) ────────────────────────────────
function buildQuickActions(): void {
  const container = document.getElementById("quick-actions");
  if (!container) return;
  container.innerHTML = "";

  const actions = CATEGORIZED_ACTIONS[currentCategory] || [];
  actions.forEach((action) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    const iconKey = action.icon as keyof typeof Icons;
    chip.innerHTML = `${Icons[iconKey] || ""}<span>${action.label}</span>`;
    chip.onclick = () => {
      const input = document.getElementById("prompt-input") as HTMLTextAreaElement;
      input.value = action.prompt;
      input.focus();
    };
    container.appendChild(chip);
  });
}

// ─── Chat Suggestions (Planning Mode) ──────────────────────────
function buildChatSuggestions(): void {
  const container = document.getElementById("chat-suggestions");
  if (!container) return;

  CHAT_SUGGESTIONS.forEach((s) => {
    const btn = document.createElement("button");
    btn.className = "suggestion-chip";
    const iconKey = s.icon as keyof typeof Icons;
    btn.innerHTML = `${Icons[iconKey] || ""}${s.text}`;
    btn.onclick = () => {
      const input = document.getElementById("chat-input") as HTMLTextAreaElement;
      input.value = s.text;
      sendChatMessage();
    };
    container.appendChild(btn);
  });
}

// ─── Panel Toggle ──────────────────────────────────────────────
function togglePanel(panelId: string): void {
  const panel = document.getElementById(panelId);
  const isHidden = panel.style.display === "none" || !panel.style.display;
  
  document.querySelectorAll(".panel").forEach((p: HTMLElement) => {
    p.style.display = "none";
  });

  if (isHidden) {
    panel.style.display = "block";
    if (panelId === "settings-panel") {
      const provider = (document.getElementById("setting-provider") as HTMLSelectElement).value;
      if (provider === "local") loadOllamaModels();
    }
  }
}

// ─── Settings ──────────────────────────────────────────────────
function loadSettingsUI(): void {
  const config = getConfig();
  (document.getElementById("setting-provider") as HTMLSelectElement).value = config.provider;
  (document.getElementById("setting-api-key") as HTMLInputElement).value = config.apiKey || "";
  (document.getElementById("setting-base-url") as HTMLInputElement).value = config.baseUrl || "";
  (document.getElementById("setting-groq-model") as HTMLSelectElement).value = config.groqModel || config.model || "llama-3.1-8b-instant";

  updateProviderFields(config.provider);
  (document.getElementById("setting-provider") as HTMLSelectElement).onchange = (e) => {
    const p = (e.target as HTMLSelectElement).value as "groq" | "local";
    updateProviderFields(p);
    if (p === "local") loadOllamaModels();
  };
}

function updateProviderFields(p: string): void {
  document.getElementById("groq-fields").style.display = p === "groq" ? "block" : "none";
  document.getElementById("local-fields").style.display = p === "local" ? "block" : "none";
}

async function loadOllamaModels(): Promise<void> {
  const select = document.getElementById("setting-local-model") as HTMLSelectElement;
  const statusEl = document.getElementById("model-status");
  const host = (document.getElementById("setting-base-url") as HTMLInputElement).value.trim() || "http://localhost:11434";

  select.innerHTML = `<option value="" disabled selected>Loading...</option>`;
  statusEl.textContent = "";
  statusEl.className = "model-status";

  const models = await fetchOllamaModels(host);
  if (models.length === 0) {
    select.innerHTML = `<option value="" disabled selected>No models found</option>`;
    statusEl.textContent = "Ollama not running or no models installed";
    statusEl.className = "model-status model-status-warn";
    return;
  }

  const config = getConfig();
  select.innerHTML = "";
  models.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m.name;
    opt.textContent = `${m.name} (${(m.size / 1e9).toFixed(1)}GB)`;
    if ((config.localModel || config.model) === m.name) opt.selected = true;
    select.appendChild(opt);
  });
  statusEl.textContent = `${models.length} model${models.length > 1 ? "s" : ""} found`;
  statusEl.className = "model-status model-status-ok";
}

function handleSaveSettings(): void {
  const provider = (document.getElementById("setting-provider") as HTMLSelectElement).value as "groq" | "local";
  let config: LLMConfig;

  if (provider === "groq") {
    config = {
      provider: "groq",
      apiKey: (document.getElementById("setting-api-key") as HTMLInputElement).value.trim(),
      groqModel: (document.getElementById("setting-groq-model") as HTMLSelectElement).value || "llama-3.1-8b-instant",
    };
  } else {
    const host = (document.getElementById("setting-base-url") as HTMLInputElement).value.trim() || "http://localhost:11434";
    config = {
      provider: "local",
      baseUrl: `${host}/v1/chat/completions`,
      localModel: (document.getElementById("setting-local-model") as HTMLSelectElement).value,
    };
  }

  saveConfig(config);
  const btn = document.getElementById("save-settings");
  btn.textContent = "Saved ✓";
  setTimeout(() => { btn.textContent = "Save"; }, 1200);
  setTimeout(() => togglePanel("settings-panel"), 600);
}


// ═══════════════════════════════════════════════════════════════
// PLANNING MODE — Chat Functions
// ═══════════════════════════════════════════════════════════════

function setupChatInput(): void {
  const input = document.getElementById("chat-input") as HTMLTextAreaElement;
  
  // Auto-resize textarea
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 80) + "px";
  });

  // Enter to send (Shift+Enter for newline)
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
}

async function sendChatMessage(): Promise<void> {
  if (isChatBusy) return;

  const input = document.getElementById("chat-input") as HTMLTextAreaElement;
  const message = input.value.trim();
  if (!message) return;

  // Clear welcome screen on first message
  const welcome = document.querySelector(".chat-welcome") as HTMLElement;
  if (welcome) welcome.remove();

  // Add user message
  addChatBubble("user", message);
  chatHistory.push({ role: "user", content: message, timestamp: Date.now() });

  // Build conversation context
  if (chatConversation.length === 0) {
    chatConversation.push({ role: "system", content: CHAT_PROMPT });
  }
  chatConversation.push({ role: "user", content: message });

  // Clear input
  input.value = "";
  input.style.height = "auto";

  // Show typing indicator
  const typingEl = showTypingIndicator();
  isChatBusy = true;
  (document.getElementById("chat-send") as HTMLButtonElement).disabled = true;

  try {
    const response = await callLLM(chatConversation);
    
    // Remove typing indicator
    typingEl.remove();

    // Format and display AI response
    const formattedResponse = formatChatResponse(response);
    addChatBubble("ai", formattedResponse, response);
    
    chatConversation.push({ role: "assistant", content: response });
    chatHistory.push({ role: "ai", content: response, timestamp: Date.now() });

  } catch (error) {
    typingEl.remove();
    addChatBubble("ai", `<p style="color:var(--error)">⚠️ ${error.message}</p>`);
  } finally {
    isChatBusy = false;
    (document.getElementById("chat-send") as HTMLButtonElement).disabled = false;
  }
}

function addChatBubble(role: "user" | "ai", htmlContent: string, rawContent?: string): void {
  const container = document.getElementById("chat-messages");
  
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-msg ${role}`;

  const avatarDiv = document.createElement("div");
  avatarDiv.className = "chat-avatar";
  avatarDiv.innerHTML = role === "user" ? Icons.user : Icons.bot;

  const bubbleDiv = document.createElement("div");
  bubbleDiv.className = "chat-bubble";
  bubbleDiv.innerHTML = htmlContent;

  // If AI message, add "Execute in Agent" button
  if (role === "ai" && rawContent) {
    const actionBar = document.createElement("div");
    actionBar.className = "chat-action-bar";
    
    const execBtn = document.createElement("button");
    execBtn.className = "btn-execute-from-chat";
    execBtn.innerHTML = `${Icons.zap} Switch to Agent`;
    execBtn.onclick = () => {
      // Extract any actionable text and put it in agent mode
      const agentPromptInput = document.getElementById("prompt-input") as HTMLTextAreaElement;
      // Try to find a practical suggestion from the AI response
      agentPromptInput.value = extractActionablePrompt(rawContent);
      switchMode("agent");
      agentPromptInput.focus();
    };
    actionBar.appendChild(execBtn);
    bubbleDiv.appendChild(actionBar);
  }

  msgDiv.appendChild(avatarDiv);
  msgDiv.appendChild(bubbleDiv);
  container.appendChild(msgDiv);

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator(): HTMLElement {
  const container = document.getElementById("chat-messages");
  
  const msgDiv = document.createElement("div");
  msgDiv.className = "chat-msg ai";
  msgDiv.id = "typing-msg";

  const avatarDiv = document.createElement("div");
  avatarDiv.className = "chat-avatar";
  avatarDiv.innerHTML = Icons.bot;

  const bubbleDiv = document.createElement("div");
  bubbleDiv.className = "chat-bubble";
  bubbleDiv.innerHTML = `
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;

  msgDiv.appendChild(avatarDiv);
  msgDiv.appendChild(bubbleDiv);
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;

  return msgDiv;
}

function formatChatResponse(text: string): string {
  // Convert markdown-like formatting to HTML
  let html = text;
  
  // Code blocks (``` ... ```)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre style="margin:6px 0;padding:8px;background:rgba(0,0,0,0.06);border-radius:6px;font-family:var(--mono);font-size:10px;overflow-x:auto"><code>$2</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Bullet lists
  html = html.replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>[\s\S]*?<\/li>\n?)+)/g, '<ul>$1</ul>');
  
  // Numbered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  
  // Line breaks → paragraphs
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs
    .map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<ul>') || p.startsWith('<ol>') || p.startsWith('<pre>') || p.startsWith('<li>')) return p;
      // Don't wrap if it's already wrapped
      if (p.startsWith('<p>')) return p;
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    })
    .join('');

  return html;
}

function extractActionablePrompt(aiResponse: string): string {
  // Try to build a useful prompt from the AI's response for agent mode
  // Look for formula mentions or action keywords
  const lines = aiResponse.split('\n');
  for (const line of lines) {
    if (line.includes('=') && line.includes('(') && !line.startsWith('#')) {
      // Looks like a formula mention
      return `Apply this formula: ${line.trim()}`;
    }
  }
  // Default: use a summary
  const firstSentence = aiResponse.split(/[.!?]/)[0];
  return firstSentence.length > 120 ? firstSentence.substring(0, 120) : firstSentence;
}

function clearChat(): void {
  const container = document.getElementById("chat-messages");
  container.innerHTML = "";
  chatHistory.length = 0;
  chatConversation = [];
  isChatBusy = false;

  // Re-add welcome screen
  const welcomeHTML = `
    <div class="chat-welcome">
      <div class="welcome-icon">${Icons.sparkles}</div>
      <h2>What are you working on?</h2>
      <p>I'm your spreadsheet thinking partner. Ask me about formulas, data strategies, best practices, or let me help you plan your next step.</p>
      <div class="welcome-suggestions" id="chat-suggestions"></div>
    </div>
  `;
  container.innerHTML = welcomeHTML;
  buildChatSuggestions();
}


// ═══════════════════════════════════════════════════════════════
// AGENT MODE — Execute Functions (Existing + Enhanced)
// ═══════════════════════════════════════════════════════════════

const MAX_RETRIES = 1;

export async function runAICommand(): Promise<void> {
  const statusEl = document.getElementById("status-message");
  const debugEl = document.getElementById("debug-code");
  const skeletonEl = document.getElementById("skeleton");
  const cacheBadge = document.getElementById("cache-badge");
  const promptInput = document.getElementById("prompt-input") as HTMLTextAreaElement;
  const button = document.getElementById("run") as HTMLButtonElement;

  const userPrompt = promptInput.value.trim();
  if (!userPrompt) {
    showStatus(statusEl, "info", "Please enter a command.");
    return;
  }

  // UI: loading
  const originalHTML = button.innerHTML;
  button.disabled = true;
  button.innerHTML = `<span class="btn-spinner"></span><span>Generating...</span>`;
  statusEl.style.display = "none";
  skeletonEl.style.display = "flex";
  cacheBadge.style.display = "none";
  debugEl.innerText = "";

  try {
    let code: string;
    let fromCache = false;

    // Check cache first
    const cached = getCachedResponse(userPrompt);
    if (cached) {
      code = cached;
      fromCache = true;
      cacheBadge.style.display = "inline-block";
    } else {
      code = await callLLM([
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ]);
    }

    debugEl.innerText = code;
    skeletonEl.style.display = "none";

    // Execute with retry
    let lastError: Error | null = null;
    let success = false;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        button.innerHTML = `<span class="btn-spinner"></span><span>${attempt > 0 ? "Retrying..." : "Running..."}</span>`;
        showStatus(statusEl, "info", `<div class="spinner"></div><span>${attempt > 0 ? "Auto-fixing..." : "Executing..."}</span>`);

        await executeExcelCode(code);
        success = true;
        break;
      } catch (execError) {
        lastError = execError;
        console.warn(`Attempt ${attempt + 1} failed:`, execError.message);

        if (attempt < MAX_RETRIES) {
          showStatus(statusEl, "info", '<div class="spinner"></div><span>AI is fixing the error...</span>');
          button.innerHTML = `<span class="btn-spinner"></span><span>Fixing...</span>`;
          code = await callLLM([
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
            { role: "assistant", content: code },
            { role: "user", content: `Error: "${execError.message}". Fix the code. Output ONLY corrected code.` },
          ]);
          debugEl.innerText = code;
        }
      }
    }

    if (success) {
      if (!fromCache) cacheResponse(userPrompt, code);
      showStatus(statusEl, "success", `${Icons.check}<span>Done</span>`);
    } else {
      throw lastError;
    }

  } catch (error) {
    console.error(error);
    skeletonEl.style.display = "none";
    showStatus(statusEl, "error", `${Icons.alertCircle}<span>${error.message}</span>`);
  } finally {
    button.disabled = false;
    button.innerHTML = originalHTML;
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

    const wrappedCode = `
      try {
        ${code}
      } catch(_innerErr) {
        try { await context.sync(); } catch(_) {}
        throw _innerErr;
      }
    `;

    try {
      await new Function(
        "context", "sheet", "Excel",
        `return (async () => { ${wrappedCode}\nawait context.sync(); })()`
      )(context, sheet, Excel);
    } catch (e) {
      try { await context.sync(); } catch (_) {}
      console.error("Execution Error:", e);
      throw e;
    }
    await context.sync();
  });
}