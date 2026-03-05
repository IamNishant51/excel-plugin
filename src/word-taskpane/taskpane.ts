/* global console, Word, document, window, Office */
import "../taskpane/taskpane.css";
import { callLLM, getConfig, saveConfig, fetchOllamaModels, GROQ_MODELS, LLMConfig } from "../services/llm.service";
import { WORD_SYSTEM_PROMPT } from "../services/word-prompt";
import { WORD_CHAT_PROMPT } from "../services/word-chat-prompt";
import { getCachedResponse, cacheResponse } from "../services/cache";
import {
    runWordAgent,
    validateWordCode,
    executeWordWithRecovery,
    readDocumentContext,
    DocumentContext,
} from "../services/word-orchestrator";
import { Icons } from "../services/icons";

// ─── Types ─────────────────────────────────────────────────────
type Mode = "planning" | "agent";
type WordActionCategory = "resume" | "writing" | "format" | "cleanup" | "templates" | "smart";

interface ChatMessage {
    role: "user" | "ai";
    content: string;
    timestamp: number;
}

// ─── State ─────────────────────────────────────────────────────
let currentMode: Mode = "planning";
let currentCategory: WordActionCategory = "resume";
const chatHistory: ChatMessage[] = [];
let chatConversation: { role: "system" | "user" | "assistant"; content: string }[] = [];
let isChatBusy = false;
let attachedFiles: { name: string; type: "image" | "pdf"; data: string[] }[] = [];
let chatAbortController: AbortController | null = null;
let agentAbortController: AbortController | null = null;

// ─── Quick Actions by Category ─────────────────────────────────
const WORD_ACTIONS: Record<WordActionCategory, { icon: string; label: string; prompt: string }[]> = {

    // ── Resume & CV Tools ──
    resume: [
        { icon: "fileText", label: "Make ATS Friendly 🎯", prompt: "DO NOT use body.clear(). Read paragraphs with .load('items/text,items/font,items/style'). Sync. Modify in-place for a COMPACT 1-2 page resume. Rules: 1) Very first paragraph (Name) must be font.size=18, font.bold=true (DO NOT shrink the name!). 2) Other body text: font.name='Arial' or 'Calibri', font.size=10.5, lineSpacing=12 (single), spaceAfter=2, spaceBefore=0. 3) Section Headings (like WORK EXPERIENCE): Set font.size=12, font.bold=true, font.color='#000000', spaceBefore=12, spaceAfter=4. DO NOT use 'Heading 1' style as it adds massive blank gaps. Delete any extra empty paragraphs to save space. Keep all content." },
        { icon: "zap", label: "Optimize Keywords", prompt: "DO NOT use body.clear(). Read the document paragraphs. Identify the job role from the content. At the END of the document, insert a bolded paragraph 'Suggested Keywords', followed by a compact bullet list of recommended ATS keywords. Use font.size=10.5, lineSpacing=12. Do not modify existing content." },
        { icon: "paintbrush", label: "Professional Format", prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Make it a TIGHT, professional document. The very first paragraph (title/name) must stay large (font.size=18+). Body text: font.size=11, font.name='Calibri', lineSpacing=12 (single), spaceAfter=2. Section headings: font.size=12, font.bold=true, spaceBefore=10, spaceAfter=4. DO NOT use 'Heading 1' style to avoid massive spacing gaps. Delete empty lines. Sync." },
        { icon: "sortAsc", label: "Add Section Headers", prompt: "DO NOT use body.clear(). Identify paragraphs that look like resume sections ('Work Experience', 'Education', 'Skills'). Set their font.bold=true, font.size=12, text.toUpperCase(), spaceBefore=12, spaceAfter=4. DO NOT use 'Heading 1' style to prevent huge gaps. Keep existing text." },
        { icon: "checkSquare", label: "Resume Checklist ✅", prompt: "DO NOT use body.clear(). Read paragraphs. At the END, insert standard paragraphs (not Heading style) analyzing: Contact info ✅/❌, Summary ✅/❌, Experience ✅/❌, Education ✅/❌, Skills ✅/❌, Action verbs ✅/❌, Compact format ✅/❌. Use font.size=10.5, lineSpacing=12." },
        { icon: "trendUp", label: "Add Action Verbs", prompt: "DO NOT use body.clear(). Read all paragraphs. For bullet-point paragraphs in work experience sections, use search and replace to ensure each starts with a strong action verb. Use body.search() to find weak starts and replace with stronger alternatives via insertText with Word.InsertLocation.replace." },
        { icon: "users", label: "Add Summary", prompt: "DO NOT use body.clear(). Read the document to understand the background. Insert a 'Professional Summary' heading and 3-4 sentence summary paragraph at the START of the document (using Word.InsertLocation.start). Set the heading style to 'Heading 1'. Use industry-relevant keywords." },
        { icon: "barChart", label: "Quantify Achievements", prompt: "DO NOT use body.clear(). Read all paragraphs. At the END of the document, insert a section with 'Heading 1' title 'Suggested Metrics'. For each work experience bullet that lacks numbers, insert a paragraph suggesting how to add quantified achievements. Example: 'Line: Managed team → Suggestion: Managed team of [X] members'." },
    ],

    // ── Writing Tools ──
    writing: [
        { icon: "brain", label: "Improve Writing ✍️", prompt: "DO NOT use body.clear(). Read all paragraphs. Use body.search() to find and replace weak phrases with stronger alternatives. For example, search for passive voice patterns and replace with active voice. Use insertText with Word.InsertLocation.replace for each match. Preserve all original meaning." },
        { icon: "sortAsc", label: "Make Formal", prompt: "DO NOT use body.clear(). Read all paragraphs. Use body.search() to find casual words/phrases and replace them with formal equivalents. Examples: 'got' → 'received', 'a lot' → 'significantly', 'things' → 'elements'. Use insertText with Word.InsertLocation.replace." },
        { icon: "columns", label: "Make Concise", prompt: "DO NOT use body.clear(). Read all paragraphs. Use body.search() to find and remove filler words: 'very', 'really', 'basically', 'actually', 'in order to' → 'to', 'due to the fact that' → 'because'. Use insertText with Word.InsertLocation.replace." },
        { icon: "trendUp", label: "Expand Content", prompt: "DO NOT use body.clear(). Read the document. At the END, insert new paragraphs expanding on the key topics identified. Add supporting details, examples, and transitions as new paragraphs using body.insertParagraph with Word.InsertLocation.end." },
        { icon: "search", label: "Proofread", prompt: "DO NOT use body.clear(). Read all paragraphs. At the END of the document, insert a 'Proofreading Report' section listing any spotted issues: potential spelling errors, grammar issues, inconsistent formatting. Use insertParagraph with Word.InsertLocation.end." },
        { icon: "barChart", label: "Summarize", prompt: "DO NOT use body.clear(). Read all paragraphs. Insert an 'Executive Summary' heading at the START (Word.InsertLocation.start) followed by 3-5 sentence summary paragraphs. Set heading style to 'Heading 1'. Do not modify existing content." },
        { icon: "copy", label: "Add Bullet Points", prompt: "DO NOT use body.clear(). Read paragraphs. Identify long paragraphs (text.length > 200) that contain lists of items. After each such paragraph, insert bullet-point style paragraphs breaking down the key points. Use startNewList() for bullet formatting." },
        { icon: "hash", label: "Add Headings", prompt: "DO NOT use body.clear(). Read all paragraphs. Every 3-5 paragraphs where a topic change is detected, insert a new paragraph BEFORE the topic change with style='Heading 2'. Use descriptive heading text based on the content that follows." },
    ],

    // ── Format Tools ──
    format: [
        { icon: "paintbrush", label: "Professional Style", prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Apply a compact, professional look. First paragraph (title) keeps font.size=16+. Headings: font.size=12, font.bold=true, spaceBefore=10, spaceAfter=4 (DO NOT use 'Heading 1' style). Body: font.size=11, font.name='Calibri', lineSpacing=12, spaceAfter=4. Delete purely empty paragraphs. Sync." },
        { icon: "paintbrush", label: "Academic Style", prompt: "DO NOT use body.clear(). Load all paragraphs. Body: font.name='Times New Roman', font.size=12, lineSpacing=24 (double-spaced), firstLineIndent=36. Headings: font.bold=true, firstLineIndent=0, alignment=Word.Alignment.centered. Remove empty gap paragraphs. Sync." },
        { icon: "paintbrush", label: "Modern Clean", prompt: "DO NOT use body.clear(). Load all paragraphs. Body: font.name='Arial', font.size=10.5, lineSpacing=13, spaceAfter=4. Headings: font.size=12, font.bold=true, font.color='#2563EB', spaceBefore=12, spaceAfter=4. Title/Name: font.size=18, font.bold=true. Sync." },
        { icon: "paintbrush", label: "Business Letter", prompt: "DO NOT use body.clear(). Load all paragraphs. Set all to font.name='Calibri', font.size=11, lineSpacing=15. Set spaceAfter=12 for paragraphs to add spacing between them. Ensure first paragraph is right-aligned (for sender info) using alignment=Word.Alignment.right." },
        { icon: "formula", label: "Consistent Fonts", prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Force EVERYTHING to font.name='Calibri' or 'Arial', font.color='#000000'. First line font.size=18. Headings font.size=12. Body font.size=10.5. Fix spacing to lineSpacing=12, spaceAfter=2. Sync." },
        { icon: "table", label: "Format Tables", prompt: "DO NOT use body.clear(). Load body.tables, tables.load('items'). For each table: set table.styleBuiltIn = Word.BuiltInStyleName.gridTable5Dark_Accent1. Then table.autoFitWindow(). Then await context.sync()." },
        { icon: "snowflake", label: "Add Header/Footer", prompt: "DO NOT use body.clear(). Load context.document.sections, sections.load('items'), await context.sync(). Get header via sections.items[0].getHeader(Word.HeaderFooterType.primary). Insert a paragraph 'Document' with font.size=9, font.color='#888888', alignment=Word.Alignment.right. Then await context.sync()." },
        { icon: "hash", label: "Number Headings", prompt: "DO NOT use body.clear(). Load all paragraphs with styles. For each paragraph whose style includes 'Heading', prepend a number using search and replace. Use a counter to add '1. ', '2. ', etc. to Heading 1 paragraphs, and '1.1. ', '1.2. ' for Heading 2." },
    ],

    // ── Cleanup Tools ──
    cleanup: [
        { icon: "eraser", label: "Smart Clean 🧹", prompt: "DO NOT use body.clear(). Load all paragraphs. For each paragraph: if text.trim() is empty and the next paragraph is also empty, delete the empty one with paragraph.delete(). For non-empty paragraphs: set font.name='Calibri', font.size=11, lineSpacing=15, spaceAfter=6. Use body.search('  ') to find double spaces and replace with single space via insertText(Word.InsertLocation.replace). Then await context.sync()." },
        { icon: "eraser", label: "Remove Formatting", prompt: "DO NOT use body.clear(). Load all paragraphs. For each: set style='Normal', font.name='Calibri', font.size=11, font.bold=false, font.italic=false, font.underline='None', font.color='#000000', lineSpacing=15, spaceAfter=6. Then await context.sync()." },
        { icon: "eraser", label: "Fix Spacing", prompt: "DO NOT use body.clear(). Load all paragraphs. For empty paragraphs that are consecutive, delete the extras (keep max 1 between sections). For all paragraphs: set lineSpacing=15, spaceAfter=6, spaceBefore=0. Then await context.sync()." },
        { icon: "search", label: "Find & Replace", prompt: "DO NOT use body.clear(). Use body.search() to find and replace: double spaces → single space, triple dots → ellipsis, straight quotes. For each search, load items, sync, then loop and use insertText with Word.InsertLocation.replace." },
        { icon: "eraser", label: "Remove Empty Lines", prompt: "DO NOT use body.clear(). Load all paragraphs. Loop through and identify paragraphs where text.trim() === ''. Delete consecutive empty paragraphs but keep at most one between content sections using paragraph.delete()." },
        { icon: "eraser", label: "Fix Bullets", prompt: "DO NOT use body.clear(). Load all paragraphs. Identify paragraphs that start with '- ', '* ', '• '. Standardize them: use search to find the bullet character and replace with '• '. Ensure consistent font and spacing on all bullet paragraphs." },
    ],

    // ── Templates (these are the ONLY prompts that may clear the document) ──
    templates: [
        { icon: "fileTemplate", label: "Modern Resume", prompt: "First clear the document with body.clear(), await context.sync(). Then create a resume template: Insert '[Your Name]' paragraph with font.size=18, font.bold=true, alignment=Word.Alignment.centered. Insert '[email] | [phone] | [city, state]' centered. Then insert section headings using style='Heading 1': 'Professional Summary', 'Work Experience', 'Education', 'Skills'. Under each heading, insert placeholder paragraphs with font.name='Calibri', font.size=11. Finish with await context.sync()." },
        { icon: "fileTemplate", label: "Cover Letter", prompt: "First clear the document with body.clear(), await context.sync(). Then create a cover letter: Insert today's date, blank line, '[Hiring Manager Name]', '[Company Name]', '[Address]'. Then 'Dear [Hiring Manager]:'. Three body paragraphs. 'Sincerely,' and '[Your Name]'. All in Calibri 11pt with lineSpacing=15. Finish with await context.sync()." },
        { icon: "fileTemplate", label: "Business Letter", prompt: "First clear the document with body.clear(), await context.sync(). Then create: Sender info (right-aligned), date, recipient info (left-aligned), subject line bold, salutation, body (3 paragraphs), closing. All Calibri 11pt. Finish with await context.sync()." },
        { icon: "fileTemplate", label: "Meeting Notes", prompt: "First clear the document with body.clear(), await context.sync(). Then create: 'Meeting Notes' in style='Heading 1'. Date/Time line. 'Attendees' heading with bullet list. 'Agenda' heading with numbered items. 'Action Items' heading with a table (columns: Action, Owner, Due Date). All in Calibri. Finish with await context.sync()." },
        { icon: "fileTemplate", label: "Project Proposal", prompt: "First clear the document with body.clear(), await context.sync(). Then create sections with style='Heading 1': Executive Summary, Problem Statement, Proposed Solution, Scope, Timeline (insert a table), Budget (insert a table), Team, Conclusion. Add placeholder text under each. Calibri formatting. Finish with await context.sync()." },
        { icon: "fileTemplate", label: "Report Template", prompt: "First clear the document with body.clear(), await context.sync(). Then create: Title page (large centered title), sections with style='Heading 1': Executive Summary, Introduction, Methodology, Findings, Analysis, Recommendations, Conclusion, References. Add placeholder text. Calibri, lineSpacing=28 (double-spaced). Finish with await context.sync()." },
    ],

    // ── Smart Tools ──
    smart: [
        { icon: "brain", label: "Document Analyzer 🔬", prompt: "DO NOT use body.clear(). Read all paragraphs with body.paragraphs.load('items/text,items/style'). Calculate word count, paragraph count, estimated reading time (250 WPM). At the END, insert an 'Analysis Report' section with these stats as formatted paragraphs. Use insertParagraph with Word.InsertLocation.end." },
        { icon: "zap", label: "Make Links Clickable 🔗", prompt: "DO NOT use body.clear(). DO NOT insert or append any URL text. Get the user's selection with context.document.getSelection(), load its text, sync. Extract any URL from the selected text. Then ONLY set selection.hyperlink = url (with https:// prefix). If no text is selected, search the entire document body for URLs using body.search() with a URL pattern, load items and their text, sync, then for each found range set range.hyperlink = url. NEVER use insertText, insertParagraph, or insertHtml to write URL text — that duplicates the URL." },
        { icon: "trendUp", label: "Readability Score", prompt: "DO NOT use body.clear(). Read all paragraphs. Analyze average sentence length and word complexity. At the END, insert a 'Readability Report' section with findings. Use insertParagraph with Word.InsertLocation.end." },
        { icon: "search", label: "Extract Key Points", prompt: "DO NOT use body.clear(). Read all paragraphs. At the START of the document, insert 'Key Takeaways' heading (style='Heading 1') followed by numbered key points extracted from the content. Use insertParagraph with Word.InsertLocation.start." },
        { icon: "copy", label: "Compare Sections", prompt: "DO NOT use body.clear(). Read all paragraphs. Identify sections by headings. At the END, insert a comparison table using body.insertTable() showing: Section Name, Approximate Word Count, Number of Paragraphs. Use Word.InsertLocation.end." },
        { icon: "shield", label: "Consistency Check", prompt: "DO NOT use body.clear(). Read all paragraphs. At the END, insert a 'Consistency Report' section listing any found issues: inconsistent formatting, mixed fonts, spacing problems. Use insertParagraph with Word.InsertLocation.end." },
        { icon: "mail", label: "Extract Contacts", prompt: "DO NOT use body.clear(). Read all paragraphs. Search for email addresses (contains @), phone numbers, URLs. At the END, insert a 'Contact Information' table using body.insertTable() with columns: Type, Value. Use Word.InsertLocation.end." },
        { icon: "layers", label: "Create TOC", prompt: "DO NOT use body.clear(). Read all paragraphs and identify those with 'Heading' in their style. At the START of the document, insert 'Table of Contents' (style='Heading 1') followed by a paragraph listing each heading found. Use Word.InsertLocation.start." },
        { icon: "dollarSign", label: "Word Count Stats", prompt: "DO NOT use body.clear(). Read all paragraphs. Count total words, unique words (approximate), paragraphs. At the END, insert a stats table using body.insertTable() with this data. Use Word.InsertLocation.end." },
    ],
};

// Chat Suggestions
const WORD_CHAT_SUGGESTIONS = [
    { icon: "fileText", text: "Make my resume ATS-friendly" },
    { icon: "brain", text: "Improve the writing in my document" },
    { icon: "paintbrush", text: "Format my document professionally" },
    { icon: "search", text: "Proofread and fix errors in my doc" },
    { icon: "sparkles", text: "What can you do? Show me your features" },
    { icon: "trendUp", text: "Analyze my document and suggest improvements" },
];

// ─── Initialization ────────────────────────────────────────────
window.onerror = function (msg, url, line) {
    const statusEl = document.getElementById("loading-status");
    if (statusEl) {
        statusEl.innerHTML += `<br><span style="color:#d32f2f;font-weight:bold;font-size:11px;">${msg} (Line ${line})</span>`;
        document.getElementById("sideload-msg").style.display = "none";
        document.getElementById("app-body").style.display = "flex";
    }
    return false;
};

Office.onReady((info) => {
    const sideloadMsg = document.getElementById("sideload-msg");
    const appBody = document.getElementById("app-body");
    if (sideloadMsg) sideloadMsg.style.display = "none";
    if (appBody) appBody.style.display = "flex";

    if (info.host === Office.HostType.Word) {
        console.log("Running in Word");
    } else {
        console.warn("Running outside Word — host:", info.host);
    }

    // Inject Icons
    injectIcons();
    injectDocIcons();
    injectCategoryIcons();

    // Wire up UI Actions
    document.getElementById("run").onclick = runWordAICommand;

    // Settings & Docs
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
    const clearBtn = document.getElementById("chat-clear");
    if (clearBtn) clearBtn.onclick = clearChat;

    setupChatInput();
    setupScrollToBottom();
    setupAgentKeyboardShortcut();

    // Category Tabs
    document.querySelectorAll(".category-tab").forEach((tab) => {
        (tab as HTMLElement).onclick = () => {
            const cat = (tab as HTMLElement).dataset.category as WordActionCategory;
            switchCategory(cat);
        };
    });

    // Initial UI
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
    el("settings-toggle", Icons.settings);
    el("docs-toggle", Icons.helpCircle);
    el("run-icon", Icons.arrowRight);
    el("chevron-icon", Icons.chevronDown);
    el("refresh-models", Icons.refresh);
    el("mode-planning-icon", Icons.messageCircle);
    el("mode-agent-icon", Icons.zap);
    el("chat-send-icon", Icons.send);
    el("chat-clear-icon", Icons.trash);
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

    document.querySelectorAll(".mode-tab").forEach((tab) => {
        tab.classList.toggle("active", (tab as HTMLElement).dataset.mode === mode);
    });

    const indicator = document.getElementById("mode-indicator");
    if (mode === "agent") {
        indicator.classList.add("right");
    } else {
        indicator.classList.remove("right");
    }

    document.getElementById("planning-mode").classList.toggle("active", mode === "planning");
    document.getElementById("agent-mode").classList.toggle("active", mode === "agent");

    if (mode === "planning") {
        setTimeout(() => (document.getElementById("chat-input") as HTMLTextAreaElement).focus(), 200);
    } else {
        setTimeout(() => (document.getElementById("prompt-input") as HTMLTextAreaElement).focus(), 200);
    }
}

// ─── Category Switching ────────────────────────────────────────
function switchCategory(category: WordActionCategory): void {
    currentCategory = category;

    document.querySelectorAll(".category-tab").forEach((tab) => {
        tab.classList.toggle("active", (tab as HTMLElement).dataset.category === category);
    });

    buildQuickActions();
}

// ─── Quick Actions ────────────────────────────────────────────
function buildQuickActions(): void {
    const container = document.getElementById("quick-actions");
    if (!container) return;
    container.innerHTML = "";

    const actions = WORD_ACTIONS[currentCategory];
    if (!actions) return;

    actions.forEach((action) => {
        const chip = document.createElement("button");
        chip.className = "chip";
        const iconKey = action.icon as keyof typeof Icons;
        chip.innerHTML = `${Icons[iconKey] || ""}<span>${action.label}</span>`;
        chip.onclick = () => {
            const input = document.getElementById("prompt-input") as HTMLTextAreaElement;
            if (input) {
                input.value = action.prompt;
                input.focus();
                const statusEl = document.getElementById("status-message");
                if (statusEl) statusEl.style.display = "none";
            }
        };
        container.appendChild(chip);
    });
}

// ─── Chat Suggestions ────────────────────────────────────────
function buildChatSuggestions(): void {
    const container = document.getElementById("chat-suggestions");
    if (!container) return;

    WORD_CHAT_SUGGESTIONS.forEach((s) => {
        const btn = document.createElement("button");
        btn.className = "suggestion-chip";
        const iconKey = s.icon as keyof typeof Icons;
        btn.innerHTML = `${Icons[iconKey] || ""}${s.text}`;
        btn.onclick = () => {
            const input = document.getElementById("chat-input") as HTMLTextAreaElement;
            if (input) {
                input.value = s.text;
                sendChatMessage();
            }
        };
        container.appendChild(btn);
    });
}

// ─── Settings ──────────────────────────────────────────────────
function loadSettingsUI(): void {
    const config = getConfig();
    const providerSelect = document.getElementById("setting-provider") as HTMLSelectElement;
    if (providerSelect) {
        providerSelect.value = config.provider;
        providerSelect.onchange = (e) => {
            const p = (e.target as HTMLSelectElement).value;
            updateProviderFields(p);
            if (p === "local") loadOllamaModels();
        };
    }

    const setVal = (id: string, val: string) => {
        const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
        if (el) el.value = val || "";
    };

    setVal("setting-api-key", config.apiKey);
    setVal("setting-groq-model", config.groqModel || "llama-3.3-70b-versatile");
    setVal("setting-gemini-key", config.geminiKey);
    setVal("setting-gemini-model", config.geminiModel || "gemini-1.5-flash");
    setVal("setting-openai-key", config.openaiKey);
    setVal("setting-openai-model", config.openaiModel || "gpt-4o-mini");
    setVal("setting-anthropic-key", config.anthropicKey);
    setVal("setting-anthropic-model", config.anthropicModel || "claude-3-5-sonnet-20241022");
    setVal("setting-openrouter-key", config.openrouterKey);
    setVal("setting-openrouter-model", config.openrouterModel || "anthropic/claude-3.5-sonnet:beta");
    setVal("setting-base-url", config.baseUrl);

    updateProviderFields(config.provider);
}

function updateProviderFields(p: string): void {
    const setDisplay = (id: string, show: boolean) => {
        const el = document.getElementById(id);
        if (el) el.style.display = show ? "block" : "none";
    };
    setDisplay("groq-fields", p === "groq");
    setDisplay("gemini-fields", p === "gemini");
    setDisplay("openai-fields", p === "openai");
    setDisplay("anthropic-fields", p === "anthropic");
    setDisplay("openrouter-fields", p === "openrouter");
    setDisplay("local-fields", p === "local");
}

async function loadOllamaModels(): Promise<void> {
    const select = document.getElementById("setting-local-model") as HTMLSelectElement;
    const statusEl = document.getElementById("model-status");
    const host = (document.getElementById("setting-base-url") as HTMLInputElement)?.value?.trim() || "http://localhost:11434";

    if (!select) return;

    select.innerHTML = `<option value="" disabled selected>Loading...</option>`;
    if (statusEl) { statusEl.textContent = ""; statusEl.className = "model-status"; }

    const models = await fetchOllamaModels(host);
    if (models.length === 0) {
        select.innerHTML = `<option value="" disabled selected>No models found</option>`;
        if (statusEl) { statusEl.textContent = "Ollama not running or no models installed"; statusEl.className = "model-status model-status-warn"; }
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
    if (statusEl) { statusEl.textContent = `${models.length} model${models.length > 1 ? "s" : ""} found`; statusEl.className = "model-status model-status-ok"; }
}

function handleSaveSettings(): void {
    const provider = (document.getElementById("setting-provider") as HTMLSelectElement)?.value as any;
    const current = getConfig();

    const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLSelectElement)?.value?.trim() || "";

    const newConfig: LLMConfig = {
        ...current,
        provider: provider,
        apiKey: getVal("setting-api-key"),
        groqModel: getVal("setting-groq-model"),
        geminiKey: getVal("setting-gemini-key"),
        geminiModel: getVal("setting-gemini-model"),
        openaiKey: getVal("setting-openai-key"),
        openaiModel: getVal("setting-openai-model"),
        anthropicKey: getVal("setting-anthropic-key"),
        anthropicModel: getVal("setting-anthropic-model"),
        openrouterKey: getVal("setting-openrouter-key"),
        openrouterModel: getVal("setting-openrouter-model"),
        baseUrl: getVal("setting-base-url") ? `${getVal("setting-base-url").replace(/\/v1.*$/, "")}/v1/chat/completions` : undefined,
        localModel: getVal("setting-local-model") || current.localModel
    };

    saveConfig(newConfig);

    const btn = document.getElementById("save-settings");
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = "✓ Saved";
        btn.classList.add("saved");
        setTimeout(() => { btn.textContent = originalText || "Save"; btn.classList.remove("saved"); }, 1500);
    }

    showToast("success", "Settings saved successfully");
    setTimeout(() => { const panel = document.getElementById("settings-panel"); if (panel) panel.style.display = "none"; }, 800);
}

// ═══════════════════════════════════════════════════════════════
// PLANNING MODE — Chat Functions
// ═══════════════════════════════════════════════════════════════

function setupChatInput(): void {
    const input = document.getElementById("chat-input") as HTMLTextAreaElement;
    if (!input) return;

    input.addEventListener("input", () => {
        input.style.height = "auto";
        input.style.height = Math.min(input.scrollHeight, 80) + "px";
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });
}

async function sendChatMessage(): Promise<void> {
    if (isChatBusy) {
        if (chatAbortController) chatAbortController.abort();
        return;
    }

    const input = document.getElementById("chat-input") as HTMLTextAreaElement;
    if (!input) return;
    const message = input.value.trim();
    if (!message) return;

    const welcome = document.querySelector(".chat-welcome") as HTMLElement;
    if (welcome) welcome.remove();

    addChatBubble("user", message);
    chatHistory.push({ role: "user", content: message, timestamp: Date.now() });

    // Build conversation context
    if (chatConversation.length === 0) {
        let initialPrompt = WORD_CHAT_PROMPT;
        try {
            const docCtx = await readDocumentContext();
            if (docCtx && docCtx.hasContent) {
                initialPrompt += "\n\n[INITIAL DOCUMENT OVERVIEW]\n";
                initialPrompt += `Document: "${docCtx.documentTitle}"\n`;
                initialPrompt += `Paragraphs: ${docCtx.paragraphCount}, Words: ~${docCtx.wordCount}\n`;
                initialPrompt += `Headings: ${docCtx.headings.join(", ") || "None"}\n`;
                initialPrompt += `Content preview: "${docCtx.sampleText.substring(0, 500)}"`;
            }
        } catch (e) {
            console.warn("Could not load document overview:", e);
        }
        chatConversation.push({ role: "system", content: initialPrompt });
    }

    // Context awareness for document queries
    const needsDocContext = /\b(this|my|current|opened?)\s+(doc|document|resume|letter|word|file|text)\b|\b(find|search|check|improve|fix|format|analyze|review|proofread|summarize)\b/i.test(message);

    if (needsDocContext) {
        try {
            const docCtx = await readDocumentContext();
            if (docCtx && docCtx.hasContent) {
                chatConversation.push({
                    role: "system",
                    content: `[DOCUMENT CONTEXT]\nTitle: "${docCtx.documentTitle}"\nParagraphs: ${docCtx.paragraphCount}\nWord count: ~${docCtx.wordCount}\nHeadings: ${docCtx.headings.join(", ") || "None"}\nContent:\n"${docCtx.sampleText}"`
                });

                const lastBubble = document.querySelector('.chat-msg.user:last-child .chat-bubble');
                if (lastBubble) {
                    const badge = document.createElement('span');
                    badge.className = 'context-badge';
                    badge.innerHTML = '📄 Document context loaded';
                    lastBubble.appendChild(badge);
                }
            }
        } catch (e) {
            console.warn('Could not load document context:', e);
        }
    }

    chatConversation.push({ role: "user", content: message });

    input.value = "";
    input.style.height = "auto";

    const skeletonEl = showTypingIndicator();
    isChatBusy = true;

    const chatSendButton = document.getElementById("chat-send") as HTMLButtonElement;
    const chatSendIcon = document.getElementById("chat-send-icon");
    if (chatSendButton) {
        if (chatSendIcon) chatSendIcon.innerHTML = Icons.stop;
        chatSendButton.classList.add("is-busy");
    }

    chatAbortController = new AbortController();

    try {
        const response = await callLLM(chatConversation, undefined, chatAbortController.signal);
        const formattedResponse = formatChatResponse(response);

        if (skeletonEl) {
            const newBubble = createChatBubble("ai", formattedResponse, response);
            skeletonEl.replaceWith(newBubble);
        }

        chatConversation.push({ role: "assistant", content: response });
        chatHistory.push({ role: "ai", content: response, timestamp: Date.now() });

    } catch (error: any) {
        if (skeletonEl) skeletonEl.remove();
        if (error.name === 'AbortError') {
            addChatBubble("ai", `<p style="color:var(--text-3)"><i>Generation stopped.</i></p>`);
        } else {
            addChatBubble("ai", `<p style="color:var(--error)">⚠️ ${error.message}</p>`);
            showToast("error", error.message?.substring(0, 80) || "Something went wrong");
        }
    } finally {
        isChatBusy = false;
        chatAbortController = null;
        if (chatSendButton) {
            const sendIcon = document.getElementById("chat-send-icon");
            if (sendIcon) sendIcon.innerHTML = Icons.send;
            chatSendButton.classList.remove("is-busy");
        }
    }
}

function clearChat(): void {
    const container = document.getElementById("chat-messages");
    if (container) {
        container.innerHTML = `
      <div class="chat-welcome">
        <img src="../../assets/icon-80-v2.png" alt="DocOS Logo" style="width: 64px; height: 64px; margin-bottom: 16px;">
        <h2>What are you working on?</h2>
        <div class="welcome-suggestions" id="chat-suggestions"></div>
      </div>`;
        buildChatSuggestions();
    }
    chatHistory.length = 0;
    chatConversation = [];
}

// ─── Chat UI Helpers ──────────────────────────────────────────

function createChatBubble(role: "user" | "ai", htmlContent: string, rawContent?: string): HTMLElement {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${role}`;

    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "chat-bubble";
    bubbleDiv.innerHTML = htmlContent;

    if (role === "ai" && rawContent) {
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "chat-bubble-actions";

        const copyBtn = document.createElement("button");
        copyBtn.className = "btn-copy";
        copyBtn.innerHTML = `${Icons.copy} Copy`;
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(rawContent).then(() => {
                copyBtn.innerHTML = `${Icons.check} Copied`;
                copyBtn.classList.add("copied");
                setTimeout(() => { copyBtn.innerHTML = `${Icons.copy} Copy`; copyBtn.classList.remove("copied"); }, 2000);
            });
        };
        actionsDiv.appendChild(copyBtn);

        const execBtn = document.createElement("button");
        execBtn.className = "btn-execute-from-chat";
        execBtn.innerHTML = `${Icons.zap} Switch to Agent`;
        execBtn.onclick = () => {
            const agentPromptInput = document.getElementById("prompt-input") as HTMLTextAreaElement;
            if (agentPromptInput) {
                agentPromptInput.value = rawContent.substring(0, 500);
                switchMode("agent");
                agentPromptInput.focus();
            }
        };

        const actionBar = document.createElement("div");
        actionBar.className = "chat-action-bar";
        actionBar.appendChild(execBtn);

        bubbleDiv.appendChild(actionsDiv);
        bubbleDiv.appendChild(actionBar);
    }

    msgDiv.appendChild(bubbleDiv);
    return msgDiv;
}

function addChatBubble(role: "user" | "ai", htmlContent: string, rawContent?: string): HTMLElement {
    const container = document.getElementById("chat-messages");
    if (!container) throw new Error("Chat messages container not found.");

    const msgDiv = createChatBubble(role, htmlContent, rawContent);
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;

    return msgDiv;
}

function showTypingIndicator(): HTMLElement | null {
    const template = document.getElementById("chat-skeleton-template") as HTMLTemplateElement;
    if (!template) return null;

    const container = document.getElementById("chat-messages");
    if (!container) return null;

    const skeleton = template.content.cloneNode(true) as DocumentFragment;
    const skeletonDiv = skeleton.querySelector(".chat-msg") as HTMLElement;
    container.appendChild(skeleton);
    container.scrollTop = container.scrollHeight;

    return skeletonDiv || container.lastElementChild as HTMLElement;
}

function formatChatResponse(text: string): string {
    let html = text;
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/^\s*[-•]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    html = html.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li>$2</li>');
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    if (!html.startsWith('<')) html = '<p>' + html + '</p>';
    return html;
}

function setupScrollToBottom(): void {
    const scrollBtn = document.getElementById("scroll-to-bottom");
    const chatContainer = document.getElementById("chat-messages");
    if (!scrollBtn || !chatContainer) return;

    chatContainer.addEventListener("scroll", () => {
        const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 100;
        scrollBtn.classList.toggle("visible", !isNearBottom);
    });

    scrollBtn.onclick = () => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };
}

// ═══════════════════════════════════════════════════════════════
// AGENT MODE — Word Execution
// ═══════════════════════════════════════════════════════════════

function setupAgentKeyboardShortcut(): void {
    const input = document.getElementById("prompt-input") as HTMLTextAreaElement;
    if (!input) return;

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            e.preventDefault();
            runWordAICommand();
        }
    });
}

async function runWordAICommand(): Promise<void> {
    const statusEl = document.getElementById("status-message");
    const debugEl = document.getElementById("debug-code");
    const skeletonEl = document.getElementById("skeleton");
    const cacheBadge = document.getElementById("cache-badge");
    const promptInput = document.getElementById("prompt-input") as HTMLTextAreaElement;
    const button = document.getElementById("run") as HTMLButtonElement;

    if (!statusEl || !debugEl || !skeletonEl || !cacheBadge || !promptInput || !button) {
        console.error("Agent UI elements not found");
        return;
    }

    let userPrompt = promptInput.value.trim();

    if (!userPrompt && attachedFiles.length === 0) {
        showStatus(statusEl, "info", "Please enter a command.");
        return;
    }

    if (!userPrompt && attachedFiles.length > 0) {
        userPrompt = "Analyze the attached file and extract relevant content into the document.";
    }

    // Cancel if already running
    if (agentAbortController) {
        agentAbortController.abort();
        return;
    }

    agentAbortController = new AbortController();
    const signal = agentAbortController.signal;

    const runText = document.getElementById("run-text");
    const runIcon = document.getElementById("run-icon");
    const originalText = runText ? runText.innerText : "Execute";
    const originalIcon = runIcon ? runIcon.innerHTML : "";

    button.classList.add("is-busy");
    button.classList.add("btn-stop");
    if (runText) runText.innerText = "Stop Agent";
    if (runIcon) runIcon.innerHTML = Icons.stop;

    statusEl.style.display = "none";
    skeletonEl.style.display = "flex";
    cacheBadge.style.display = "none";
    debugEl.innerText = "";

    try {
        let code: string;
        let fromCache = false;

        // Read document context
        let docContext: DocumentContext | null = null;
        try {
            docContext = await readDocumentContext();
            if (docContext?.hasContent) {
                console.log(`[WordAgent] Document context: ${docContext.paragraphCount} paragraphs, ~${docContext.wordCount} words`);
            }
        } catch (e) {
            console.warn("[WordAgent] Could not read document context:", e);
        }

        // Check cache
        const cached = getCachedResponse(userPrompt);
        if (cached) {
            code = cached;
            fromCache = true;
            cacheBadge.style.display = "inline-block";

            const validation = validateWordCode(code);
            if (!validation.isValid) {
                fromCache = false;
                code = "";
            } else {
                code = validation.sanitizedCode;
            }
        }

        // Generate code if not cached
        if (!fromCache) {
            if (runText) runText.innerText = "Generating...";

            const wordAttachedFiles = attachedFiles.map(f => ({
                name: f.name,
                type: f.type as "image" | "pdf",
                data: f.data
            }));

            const result = await runWordAgent(
                userPrompt,
                docContext,
                wordAttachedFiles,
                { enablePlanning: true, strictValidation: true },
                signal
            );

            if (!result.success) {
                throw new Error(result.error || "Code generation failed");
            }

            code = result.code;

            if (!fromCache) {
                cacheResponse(userPrompt, code);
            }
        }

        skeletonEl.style.display = "none";
        debugEl.innerText = code;

        if (runText) runText.innerText = "Executing...";

        // Execute the code in Word
        // @ts-ignore
        const executionResult = await executeWordWithRecovery(code, async (codeToRun: string) => {
            // @ts-ignore
            await Word.run(async (ctx: any) => {
                const wordBody = ctx.document.body;

                const executeFn = new Function("context", "body", "Word", `return (async () => { ${codeToRun} })();`);
                // @ts-ignore
                await executeFn(ctx, wordBody, Word);

                await ctx.sync();
            });
        }, 2, signal);

        if (executionResult.success) {
            showStatus(statusEl, "success", "✅ Done! Document updated successfully.");
            showToast("success", "Document updated!");
        } else {
            showStatus(statusEl, "error", `❌ Error: ${executionResult.error}`);
            showToast("error", executionResult.error?.substring(0, 80) || "Execution failed");
        }

    } catch (error: any) {
        skeletonEl.style.display = "none";
        if (error.name === 'AbortError') {
            showStatus(statusEl, "info", "⏹ Agent stopped.");
        } else {
            showStatus(statusEl, "error", `❌ ${error.message}`);
            showToast("error", error.message?.substring(0, 80) || "Something went wrong");
        }
    } finally {
        agentAbortController = null;
        button.classList.remove("is-busy");
        button.classList.remove("btn-stop");
        if (runText) runText.innerText = originalText;
        if (runIcon) runIcon.innerHTML = originalIcon;
    }
}

// ─── Status & Toast ──────────────────────────────────────────

function showStatus(el: HTMLElement, type: string, message: string): void {
    el.style.display = "flex";
    el.className = `status-pill status-${type}`;
    el.innerHTML = message;
}

function showToast(type: string, message: string): void {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}</span>
    <span class="toast-text">${message}</span>
  `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("toast-exit");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
