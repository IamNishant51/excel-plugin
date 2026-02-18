/* global console, document, Excel, Office */
import "./taskpane.css";
import { SYSTEM_PROMPT } from "../services/prompt";
import { CHAT_PROMPT } from "../services/chat-prompt";
import { callLLM, getConfig, saveConfig, fetchOllamaModels, LLMConfig } from "../services/llm.service";
import { getCachedResponse, cacheResponse } from "../services/cache";
import { Icons } from "../services/icons";

// ─── Types ─────────────────────────────────────────────────────
type Mode = "planning" | "agent";
type ActionCategory = "cleanup" | "formulas" | "format" | "reports" | "templates";

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

  // ── Data Cleanup ──
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

  // ── Natural Language Formula Generator ──
  formulas: [
    { icon: "formula",     label: "Auto SUM",             prompt: "Add a SUM formula at the bottom of each numeric column with a bold TOTAL label in column A." },
    { icon: "formula",     label: "AVERAGE Row",          prompt: "Add an AVERAGE formula at the bottom of each numeric column with a bold AVERAGE label." },
    { icon: "formula",     label: "COUNT & COUNTA",       prompt: "Add COUNT and COUNTA formulas at the bottom to count numeric and non-empty cells in each column." },
    { icon: "formula",     label: "VLOOKUP Setup",        prompt: "Analyze the data and set up a VLOOKUP section: create a lookup area to the right of the data where user can type a search value in one cell, and VLOOKUP automatically returns matching data from the table. Add labels and formatting to make it clear how to use it." },
    { icon: "formula",     label: "SUMIF by Category",    prompt: "Detect the category column (text) and numeric columns in the data. Create a summary section below the data that uses SUMIF to total each unique category. Add labels, formatting, and a bold grand total row." },
    { icon: "formula",     label: "IF Conditional",       prompt: "Add a new Status column at the end of the data. Use an IF formula to classify each row: if the last numeric column value is above the average, mark it 'Above Average', otherwise 'Below Average'. Format green for above, red for below." },
    { icon: "trendUp",     label: "Running Total",        prompt: "Add a 'Running Total' column at the end of the data that calculates a cumulative sum of the main numeric column, row by row. Format it with a subtle blue background and number format with commas." },
    { icon: "sortAsc",     label: "Rank Values",          prompt: "Add a 'Rank' column at the end of the data that ranks each row by the primary numeric column (largest = rank 1). Highlight the top 3 with gold/green backgrounds. Auto-fit all columns." },
  ],

  // ── Smart Formatter (Canva for Excel) ──
  format: [
    { icon: "paintbrush",  label: "Make Professional",    prompt: "Make this sheet look completely professional. Do ALL of the following: (1) Bold the header row with dark navy (#1B2A4A) background and white text, font size 11. (2) Apply alternating row colors — white and light gray (#F4F5F7). (3) Add thin borders to all cells — edges and inside lines. (4) Auto-fit all columns with slight extra width. (5) Center-align headers. (6) Left-align text columns, right-align number columns. (7) Add a subtle bottom border (medium thickness, navy) under the header row. (8) Freeze the first row." },
    { icon: "paintbrush",  label: "Executive Style",      prompt: "Apply executive presentation style: (1) Merge and center a title row at the top with the sheet name, font size 14, bold, dark charcoal (#2C3E50) text. (2) Headers in row 2 with dark slate (#34495E) background, white text, bold, font size 10. (3) Data rows with subtle alternating tints (#F8F9FA and white). (4) All borders thin, light gray. (5) Number columns formatted with commas and 2 decimals. (6) Add a subtle dark bottom border under headers. (7) Auto-fit all columns. (8) Freeze row 2." },
    { icon: "paintbrush",  label: "Minimal Clean",        prompt: "Apply minimal, modern formatting: (1) No borders except a thin bottom border under the header row (color #D1D5DB). (2) Header row: bold, font size 11, no background color, dark text (#111827). (3) Data rows: font size 10, color (#374151), generous row height (22px). (4) Remove all fill colors for a clean white look. (5) Right-align number columns, left-align text. (6) Auto-fit all columns." },
    { icon: "paintbrush",  label: "Dark Theme",           prompt: "Apply dark theme formatting: dark gray (#1E1E1E) background for ALL cells in used range, header row with slightly lighter (#2D2D2D) background and gold (#F0C75E) bold text, data rows with light gray (#CCCCCC) text, alternating between (#1E1E1E) and (#252525). Thin borders (#3A3A3A). Auto-fit all columns." },
    { icon: "paintbrush",  label: "Colorful",             prompt: "Apply colorful formatting: header with deep teal (#0D7377) background and white bold text, alternating rows with very light teal (#E8F6F3) and white, all thin borders. Auto-fit columns. Freeze the first row." },
    { icon: "snowflake",   label: "Freeze Header",        prompt: "Freeze the first row so headers stay visible when scrolling." },
    { icon: "table",       label: "Excel Table",          prompt: "Convert the data into a formatted Excel Table with TableStyleMedium9 style and auto-fit columns." },
    { icon: "paintbrush",  label: "Borders All",          prompt: "Add thin borders to all cells in the used range — inside horizontal, inside vertical, and all edges." },
    { icon: "hash",        label: "Currency $",           prompt: "Format all numeric columns as currency ($#,##0.00) and auto-fit." },
    { icon: "hash",        label: "Percentage %",         prompt: "Format the last numeric column as percentage (0.00%) and auto-fit." },
  ],

  // ── Report Automation Engine ──
  reports: [
    { icon: "barChart",    label: "Sales Report",         prompt: "Generate a professional monthly sales report from the existing data. Do ALL of this: (1) Add a report title row at the top: 'Monthly Sales Report' in bold, font size 14, merged across all columns. (2) Add today's date below the title, right-aligned. (3) Format the data with professional headers (dark navy background, white bold text) and alternating row colors. (4) Add SUM, AVERAGE, MAX, and MIN summary rows at the bottom with labels. (5) Create a clustered column chart from the data showing performance by category. Position it below the summary. (6) Add thin borders throughout and auto-fit all columns." },
    { icon: "barChart",    label: "Financial Summary",    prompt: "Build a financial summary report from the data. (1) Add a 'Financial Summary' title merged at top, bold, font size 14. (2) Format headers professionally with dark green (#1B4D3E) background and white text. (3) Format all currency columns as $#,##0.00. (4) Add a TOTAL row with SUM formulas, bold, with a top border. (5) Add a 'Net' or 'Difference' calculation if applicable. (6) Apply conditional formatting: positive numbers in green, negative in red. (7) Create a pie chart showing the breakdown. (8) Auto-fit columns and freeze header row." },
    { icon: "trendUp",     label: "Performance Review",   prompt: "Create a team performance report from the data. (1) Add a 'Team Performance Report' title at top, merged, bold, font size 14. (2) Professional header formatting with indigo (#2B3A67) background, white text. (3) Add RANK column based on the primary numeric metric column. (4) Add conditional formatting: top 3 rows highlighted in light green (#E6F4EA), bottom 3 in light red (#FDE8E8). (5) Add AVERAGE, MAX, MIN summary rows at bottom. (6) Create a bar chart showing individual performance, sorted high to low. (7) Auto-fit and add borders." },
    { icon: "barChart",    label: "Inventory Report",     prompt: "Generate an inventory status report from the data. (1) Title: 'Inventory Status Report', merged, bold, size 14. (2) Professional formatting with teal (#0D7377) headers. (3) If there's a quantity column, add conditional formatting: red background for items ≤ 10 (low stock), yellow for 11-50 (medium), green for 50+ (healthy). (4) Add a status column with IF formula: 'Critical' for ≤ 10, 'Low' for 11-25, 'OK' for 26-50, 'Good' for 50+. (5) Add summary showing total items, total value (if price column exists), and count by status. (6) Create a pie chart showing stock level distribution." },
    { icon: "barChart",    label: "Attendance Summary",   prompt: "Generate an attendance summary report. (1) Title: 'Attendance Summary', merged, bold, size 14. (2) Count Present (P), Absent (A), Leave (L) for each person using COUNTIF. (3) Calculate attendance percentage. (4) Format: professional headers, alternating rows, percentage column formatted as percentage. (5) Conditional formatting on attendance %: green ≥ 90%, yellow 75-89%, red < 75%. (6) Add a column chart showing attendance by person. (7) Add class/team averages at bottom." },
    { icon: "fileTemplate", label: "Weekly Status",       prompt: "Create a weekly status report template: (1) Title: 'Weekly Status Update — Week of [Date]', merged, bold. (2) Section 1: 'Completed This Week' — 5 rows with Task, Owner, Status columns. (3) Section 2: 'In Progress' — 5 rows with Task, Owner, % Complete, ETA columns. (4) Section 3: 'Blockers & Risks' — 3 rows with Issue, Impact, Action Needed columns. (5) Section 4: 'Next Week Plans' — 4 rows. (6) Format each section with colored headers (different subtle colors), thin borders, and auto-fit." },
  ],

  // ── Ready-Made Templates ──
  templates: [
    { icon: "fileTemplate", label: "Monthly Budget",       prompt: "Create a monthly budget tracker with categories: Housing, Utilities, Food, Transport, Entertainment, Savings. Add columns for Budget, Actual, and Difference with SUM at bottom. Use professional formatting with green for under-budget and red for over-budget conditional formatting." },
    { icon: "fileTemplate", label: "Invoice",              prompt: "Create a professional invoice template with: Company Name header, Invoice #, Date, Bill To section, items table with Description, Quantity, Unit Price, Total columns, Subtotal, Tax (10%), and Grand Total calculations. Apply clean formatting." },
    { icon: "fileTemplate", label: "Employee List",        prompt: "Create an employee directory with 8 sample employees: Name, Department (HR/Engineering/Marketing/Sales), Email, Phone, Joining Date, Salary. Apply professional table formatting with alternating rows and currency format for salary." },
    { icon: "fileTemplate", label: "Project Tracker",      prompt: "Create a project tracker with 6 sample tasks: Task Name, Assigned To, Priority (High/Medium/Low), Status (Not Started/In Progress/Complete), Start Date, Due Date. Add dropdown validation for Priority and Status. Use conditional formatting for status colors." },
    { icon: "fileTemplate", label: "Sales Dashboard",      prompt: "Create a quarterly sales report with 5 products across Q1-Q4. Add Total column and row with SUM formulas. Create a column chart showing quarterly performance. Apply professional formatting." },
    { icon: "fileTemplate", label: "Attendance Sheet",     prompt: "Create a monthly attendance sheet for 10 employees with dates as columns (1-31). Mark P for present, A for absent, L for leave. Add summary columns for Total Present, Absent, and Leave. Apply conditional formatting." },
    { icon: "fileTemplate", label: "Grade Book",           prompt: "Create a student grade book for 8 students with 5 assignments, Midterm, Final, and Total/Grade columns. Add weighted average formulas and letter grade calculation (A/B/C/D/F). Apply professional formatting with conditional colors." },
    { icon: "fileTemplate", label: "Weekly Schedule",      prompt: "Create a weekly schedule template with time slots from 8 AM to 6 PM (1-hour intervals) and columns for Mon-Fri. Add borders, colored header, and merge the title cell. Apply a clean, readable format." },
  ],
};

// Chat Suggestions (shown on welcome screen)
const CHAT_SUGGESTIONS = [
  { icon: "formula",  text: "Find total sales for each employee — which formula?" },
  { icon: "paintbrush", text: "Make my sheet look professional in one click" },
  { icon: "barChart", text: "Generate a monthly report with charts" },
  { icon: "table",    text: "What's the best way to structure my data?" },
];

// ─── Initialization ────────────────────────────────────────────
// ─── Global Error Handler ───
window.onerror = function(msg, url, line) {
  const statusEl = document.getElementById("loading-status");
  if (statusEl) {
    statusEl.innerHTML += `<br><span style="color:#d32f2f;font-weight:bold;font-size:11px;">${msg} (Line ${line})</span>`;
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
  }
  return false;
};

// ─── Initialization ────────────────────────────────────────────
Office.onReady((info) => {
  // Always show app to prevent hang
  const sideloadMsg = document.getElementById("sideload-msg");
  const appBody = document.getElementById("app-body");
  if (sideloadMsg) sideloadMsg.style.display = "none";
  if (appBody) appBody.style.display = "flex";

  if (info.host === Office.HostType.Excel) {
    console.log("Running in Excel");
  } else {
    console.warn("Running outside Excel");
  }

  // Inject Icons
  injectIcons();
  injectDocIcons();
  injectCategoryIcons();

  // Wire up UI Actions
  document.getElementById("run").onclick = runAICommand;
  
  // Settings & Docs Toggles
  document.getElementById("settings-toggle").onclick = () => {
      const panel = document.getElementById("settings-panel");
      panel.style.display = panel.style.display === "none" ? "block" : "none";
      document.getElementById("docs-panel").style.display = "none";
  };
  document.getElementById("docs-toggle").onclick = () => {
      const panel = document.getElementById("docs-panel");
      panel.style.display = panel.style.display === "none" ? "block" : "none";
      document.getElementById("settings-panel").style.display = "none";
  };

  document.getElementById("save-settings").onclick = handleSaveSettings;
  document.getElementById("refresh-models").onclick = loadOllamaModels;

  // Mode Toggles
  document.getElementById("mode-planning").onclick = () => switchMode("planning");
  document.getElementById("mode-agent").onclick = () => switchMode("agent");

  // Chat Actions
  document.getElementById("chat-send").onclick = sendChatMessage;
  // document.getElementById("chat-clear").onclick = clearChat; // Check ID match
  const clearBtn = document.getElementById("chat-clear");
  if (clearBtn) clearBtn.onclick = clearChat;
  
  setupChatInput();

  // Category Tabs
  document.querySelectorAll(".category-tab").forEach((tab) => {
    (tab as HTMLElement).onclick = () => {
       const cat = (tab as HTMLElement).dataset.category as ActionCategory;
       switchCategory(cat);
    };
  });

  // Initial UI Build
  buildQuickActions();
  buildChatSuggestions();
  loadSettingsUI();
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
        // AI Generated Code
        ${code}
        
        // ─── Safety Net ───
        // Ensure columns are readable (fixes ##### issues)
        sheet.getUsedRange().format.autofitColumns();
      } catch(_innerErr) {
        console.error("AI Role Runtime Error:", _innerErr);
        try { await context.sync(); } catch(_) {}
        throw _innerErr;
      }
    `;

    try {
      await new Function(
        "context", "sheet", "Excel",
        `return (async () => { ${wrappedCode}\nawait context.sync(); })()`
      )(context, sheet, Excel);
    } catch (e: any) {
      // Enhance error message for common AI mistakes
      if (e.message && (e.message.includes("is not a function") || e.message.includes("is not defined"))) {
        e.message = `AI Code Error: ${e.message}. (Try rephrasing your prompt)`;
      }
      try { await context.sync(); } catch (_) {}
      throw e;
    }
    await context.sync();
  });
}