/**
 * DocOS AI — Word Agent Orchestrator
 * Intelligent agent system for bulletproof Word automation.
 * 
 * Architecture:
 * 1. PLANNER - Analyzes task and creates execution plan
 * 2. CODER - Generates Word JavaScript API code
 * 3. VALIDATOR - Validates code syntax and API usage
 * 4. EXECUTOR - Executes code with sandboxing
 * 5. FIXER - Recovers from errors with context
 * 
 * Anti-Hallucination Strategy:
 * - Strict API whitelist
 * - Banned pattern detection
 * - Syntax validation before execution
 */

import { callLLM, getConfig } from "./llm.service";

// ═══════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════

export interface WordAgentState {
    task: string;
    plan: WordTaskPlan | null;
    code: string;
    validationResult: WordValidationResult | null;
    executionResult: WordExecutionResult | null;
    retryCount: number;
    conversationHistory: WordConversationMessage[];
    documentContext: DocumentContext | null;
    attachedFiles: WordAttachedFile[];
}

export interface WordTaskPlan {
    understanding: string;
    steps: string[];
    dataNeeded: string[];
    expectedOutput: string;
    complexity: "simple" | "moderate" | "complex";
    warnings: string[];
}

export interface WordValidationResult {
    isValid: boolean;
    errors: WordValidationError[];
    warnings: string[];
    sanitizedCode: string;
    apiCallsDetected: string[];
}

export interface WordValidationError {
    type: "syntax" | "banned_api" | "missing_sync" | "unsafe_pattern" | "type_error";
    message: string;
    line?: number;
    suggestion: string;
}

export interface WordExecutionResult {
    success: boolean;
    error?: string;
    errorType?: "runtime" | "api_error" | "timeout" | "unknown";
    duration: number;
}

export interface WordConversationMessage {
    role: "system" | "user" | "assistant" | "error";
    content: string;
    timestamp: number;
}

export interface DocumentContext {
    documentTitle: string;
    paragraphCount: number;
    wordCount: number;
    sampleText: string;
    headings: string[];
    hasContent: boolean;
    contentTypes: string[]; // "text", "table", "image", "list", etc.
    selectedText?: string;
}

export interface WordAttachedFile {
    name: string;
    type: "image" | "pdf" | "docx";
    data: string[];
    extractedText?: string;
}

// ═══════════════════════════════════════════════════════════════
// BANNED PATTERNS — These cause runtime errors in Word JS API
// ═══════════════════════════════════════════════════════════════

const BANNED_PATTERNS: { pattern: RegExp; message: string; fix: string }[] = [
    // CRITICAL: Prevent content destruction
    { pattern: /body\.clear\s*\(/g, message: "body.clear() DELETES ALL CONTENT — NEVER use this", fix: "To reformat, iterate body.paragraphs and modify each one in-place. Never clear the document." },

    // Excel-contamination
    { pattern: /Excel\./g, message: "Excel namespace doesn't exist in Word", fix: "Use Word namespace (Word.InsertLocation, Word.Alignment, etc.)" },
    { pattern: /sheet\./g, message: "sheet doesn't exist in Word", fix: "Use context.document.body or paragraphs" },
    { pattern: /\.getUsedRange\(/g, message: "getUsedRange() is an Excel method", fix: "Use context.document.body for Word" },
    { pattern: /\.getRange\(/g, message: "getRange() is an Excel method", fix: "Use body.paragraphs or body.search() for Word" },
    { pattern: /\.getCell\(/g, message: "getCell() is an Excel method", fix: "Use Word paragraph/table API instead" },
    { pattern: /\.getRow\(/g, message: "getRow() is an Excel method", fix: "Use Word table rows API: table.rows" },
    { pattern: /\.format\.fill/g, message: "format.fill is Excel-specific", fix: "Use paragraph.font or shading for Word" },
    { pattern: /\.format\.borders/g, message: "format.borders is Excel-specific", fix: "Use Word table borders or paragraph borders" },
    { pattern: /\.freezePanes/g, message: "freezePanes is Excel-specific", fix: "Remove - not applicable in Word" },
    { pattern: /\.autofitColumns/g, message: "autofitColumns is Excel-specific", fix: "Use table.autoFitWindow() in Word" },

    // Google Apps Script contamination
    { pattern: /SpreadsheetApp/g, message: "SpreadsheetApp is Google Apps Script", fix: "Use Word JavaScript API" },
    { pattern: /DocumentApp/g, message: "DocumentApp is Google Apps Script", fix: "Use Word JavaScript API" },
    { pattern: /Logger\.log/g, message: "Logger.log is Google Apps Script", fix: "Use console.log or remove" },

    // Wrong variable declarations
    { pattern: /(?:const|let|var)\s+context\s*=/g, message: "context is already declared", fix: "Remove - context is provided" },
    { pattern: /(?:const|let|var)\s+body\s*=\s*context\.document/g, message: "body is already declared", fix: "Remove - body is provided" },

    // Fake/Hallucinated methods
    { pattern: /\.addText\(/g, message: "addText() is not in Word API", fix: "Use .insertText('text', Word.InsertLocation.end)" },
    { pattern: /\.addLink\(/g, message: "addLink() is not in Word API", fix: "Use range.hyperlink = 'url'" },
    { pattern: /\.addPage\(/g, message: "addPage() is not in Word API", fix: "Use body.insertBreak(Word.BreakType.page, Word.InsertLocation.end)" },
    { pattern: /\.addSection\(/g, message: "addSection() is not in Word API", fix: "Use body.insertBreak(Word.BreakType.sectionNext, Word.InsertLocation.end)" },
    { pattern: /\.addBookmark\(/g, message: "addBookmark() is not in Word API", fix: "Use range.insertBookmark('name')" },
    { pattern: /\.addComment\(/g, message: "addComment() is not in Word API", fix: "Use range.insertComment('text')" },
    { pattern: /\.setText\(/g, message: "setText() is not in Word API", fix: "Use .insertText('text', Word.InsertLocation.replace)" },
    { pattern: /\.setFont\(/g, message: "setFont() is not in Word API", fix: "Use .font.name = 'Calibri', .font.size = 11, etc." },
    { pattern: /\.setAlignment\(/g, message: "setAlignment() is not in Word API", fix: "Use .alignment = Word.Alignment.centered" },
    { pattern: /\.getBoundingClientRect\(/g, message: "getBoundingClientRect() is a DOM method, not Word API", fix: "Remove" },
    { pattern: /document\.getElementById/g, message: "DOM methods are not for Word document manipulation", fix: "Use Word JS API body/paragraphs methods" },
    { pattern: /document\.createElement/g, message: "DOM methods are not for Word document manipulation", fix: "Use Word JS API insertParagraph, insertTable, insertHtml" },
    { pattern: /\.innerHTML/g, message: "innerHTML is DOM, not Word API", fix: "Use Word body.insertHtml() instead" },

    // UI methods that don't work in add-ins
    { pattern: /alert\s*\(/g, message: "alert() doesn't work in add-ins", fix: "Remove - use status messages" },
    { pattern: /confirm\s*\(/g, message: "confirm() doesn't work in add-ins", fix: "Remove" },
    { pattern: /prompt\s*\(/g, message: "prompt() doesn't work in add-ins", fix: "Remove" },

    // Network/File operations not available
    { pattern: /fetch\s*\(/g, message: "fetch() is not allowed in generated code", fix: "Remove - data should come from document context" },
    { pattern: /require\s*\(/g, message: "require() is not available in sandboxed execution", fix: "Remove" },
    { pattern: /import\s+/g, message: "import statements are not available in sandboxed execution", fix: "Remove" },
];

// ═══════════════════════════════════════════════════════════════
// ALLOWED API WHITELIST — Only these Word JS API calls are safe
// ═══════════════════════════════════════════════════════════════

const ALLOWED_API_PATTERNS = [
    // Core objects
    /context\.document/,
    /context\.sync\(\)/,
    /body\./,
    /Word\./,

    // Paragraph operations
    /\.paragraphs/,
    /\.insertParagraph\(/,
    /\.insertText\(/,
    /\.insertBreak\(/,
    /\.insertHtml\(/,
    /\.insertOoxml\(/,
    /\.insertContentControl\(/,
    /\.insertTable\(/,
    /\.insertInlinePictureFromBase64\(/,
    /\.insertFileFromBase64\(/,

    // Font & formatting (comprehensive)
    /\.font\./,
    /\.style/,
    /\.alignment/,
    /\.hyperlink/,
    /\.lineSpacing/,
    /\.spaceAfter/,
    /\.spaceBefore/,
    /\.firstLineIndent/,
    /\.leftIndent/,
    /\.rightIndent/,
    /\.keepWithNext/,
    /\.keepTogether/,
    /\.outlineLevel/,
    /\.lineUnitAfter/,
    /\.lineUnitBefore/,
    /\.highlightColor/,
    /\.strikeThrough/,
    /\.subscript/,
    /\.superscript/,
    /\.underline/,
    /\.styleBuiltIn/,

    // Range operations
    /\.getRange\(/,
    /\.search\(/,
    /\.select\(/,
    /\.getSelection\(/,
    /\.getTextRanges\(/,
    /\.expandTo\(/,
    /\.intersectWith\(/,
    /\.compareLocationWith\(/,
    /\.getNext\(/,
    /\.getPrevious\(/,
    /\.getFirst\(/,
    /\.getLast\(/,
    /\.split\(/,
    /\.parentBody/,
    /\.parentTable/,
    /\.parentTableCell/,

    // Table operations (comprehensive)
    /\.tables/,
    /\.rows/,
    /\.cells/,
    /\.addRows\(/,
    /\.addColumns\(/,
    /\.getBorder\(/,
    /\.getCell\(/,
    /\.autoFitWindow\(/,
    /\.autoFitContents\(/,
    /\.width/,
    /\.height/,
    /\.rowCount/,
    /\.columnCount/,
    /\.values/,
    /\.verticalAlignment/,
    /\.shadingColor/,
    /\.setCellPadding\(/,
    /\.mergeCells\(/,
    /\.headerRowCount/,

    // Content controls
    /\.contentControls/,
    /\.tag/,
    /\.title/,
    /\.appearance/,
    /\.cannotDelete/,
    /\.cannotEdit/,
    /\.removeWhenEdited/,
    /\.placeholderText/,

    // Section & header/footer
    /\.sections/,
    /\.getHeader\(/,
    /\.getFooter\(/,
    /\.pageSetup/,
    /\.headerDistance/,
    /\.footerDistance/,
    /\.differentFirstPage/,
    /\.differentOddAndEvenPages/,
    /\.topMargin/,
    /\.bottomMargin/,
    /\.leftMargin/,
    /\.rightMargin/,
    /\.paperWidth/,
    /\.paperHeight/,
    /\.orientation/,

    // Load operations
    /\.load\(/,

    // Delete (clear is BANNED for body, OK for cells/ranges)
    /\.delete\(\)/,
    /\.clear\(\)/,

    // Lists (comprehensive)
    /\.listItem/,
    /\.startNewList\(/,
    /\.lists/,
    /\.listOrNullObject/,
    /\.levelNumber/,

    // Inline pictures
    /\.inlinePictures/,
    /\.altTextTitle/,
    /\.altTextDescription/,
    /\.lockAspectRatio/,

    // Footnotes & endnotes
    /\.footnotes/,
    /\.endnotes/,
    /\.insertFootnote\(/,
    /\.insertEndnote\(/,

    // Comments
    /\.comments/,
    /\.getComments\(/,

    // Bookmarks
    /\.bookmarks/,

    // Fields
    /\.fields/,
    /\.insertField\(/,

    // OOXML
    /\.getOoxml\(/,

    // Track changes
    /\.track/,

    // Document properties
    /\.properties/,
];

// ═══════════════════════════════════════════════════════════════
// CODE VALIDATOR
// ═══════════════════════════════════════════════════════════════

export function validateWordCode(code: string, allowClear: boolean = false): WordValidationResult {
    const errors: WordValidationError[] = [];
    const warnings: string[] = [];
    const apiCallsDetected: string[] = [];
    let sanitizedCode = code;

    // 1. Remove markdown fences
    sanitizedCode = sanitizedCode.replace(/^```(?:javascript|js|typescript|ts)?\n?/gi, "");
    sanitizedCode = sanitizedCode.replace(/\n?```$/gi, "");
    sanitizedCode = sanitizedCode.trim();

    // 2. Check for banned patterns
    for (const banned of BANNED_PATTERNS) {
        // Skip body.clear() ban if allowClear is true (templates only)
        if (allowClear && banned.pattern.source.includes("body\\.clear")) {
            continue;
        }
        const matches = sanitizedCode.match(banned.pattern);
        if (matches) {
            if (banned.pattern.source.includes("redeclare") || banned.message.includes("already declared")) {
                sanitizedCode = sanitizedCode.replace(banned.pattern, "// [REMOVED] ");
            } else {
                errors.push({
                    type: "banned_api",
                    message: banned.message,
                    suggestion: banned.fix,
                });
            }
        }
    }

    // 3. Check for missing context.sync() calls
    const loadCalls = (sanitizedCode.match(/\.load\s*\(/g) || []).length;
    const syncCalls = (sanitizedCode.match(/context\.sync\s*\(\s*\)/g) || []).length;

    if (loadCalls > 0 && syncCalls === 0) {
        errors.push({
            type: "missing_sync",
            message: "Code loads properties but never calls context.sync()",
            suggestion: "Add 'await context.sync();' after .load() calls",
        });
    }

    // 4. Check for basic syntax errors
    try {
        new Function("context", "body", "Word", `return (async () => { ${sanitizedCode} })();`);
    } catch (syntaxError: any) {
        errors.push({
            type: "syntax",
            message: syntaxError.message,
            suggestion: "Check for missing brackets, semicolons, or typos",
        });
    }

    // 5. Detect API calls
    for (const pattern of ALLOWED_API_PATTERNS) {
        const match = sanitizedCode.match(pattern);
        if (match) {
            apiCallsDetected.push(match[0]);
        }
    }

    // 6. Check for dangerous patterns
    if (/eval\s*\(/i.test(sanitizedCode)) {
        errors.push({
            type: "unsafe_pattern",
            message: "eval() is not allowed",
            suggestion: "Remove eval() call",
        });
    }

    // 7. Auto-fix body redeclarations
    sanitizedCode = sanitizedCode.replace(
        /(?:const|let|var)\s+body\s*=\s*context\.document\.body\s*;?/g,
        "// body already available"
    );

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        sanitizedCode,
        apiCallsDetected,
    };
}

// ═══════════════════════════════════════════════════════════════
// PLANNER — Analyzes task and creates execution plan
// ═══════════════════════════════════════════════════════════════

const PLANNER_PROMPT = `You are a Word document automation planning expert. Analyze the user's request and create a brief execution plan.

OUTPUT FORMAT (JSON only, no markdown):
{
  "understanding": "One sentence summary of what user wants",
  "steps": ["Step 1", "Step 2", "Step 3"],
  "dataNeeded": ["What data needs to be read from document"],
  "expectedOutput": "What the document should look like after",
  "complexity": "simple|moderate|complex",
  "warnings": ["Any potential issues or edge cases"]
}

COMPLEXITY GUIDE:
- simple: Single operation (insert text, change font, add break) → 1-3 steps
- moderate: Multiple related operations (format multiple paragraphs, create styled table, search/replace) → 3-6 steps
- complex: Multi-phase work (full resume reformat, template creation, document restructuring) → 6+ steps

WORD CAPABILITIES TO CONSIDER:
- Text: insert, format (font, size, color, bold, italic, underline, highlight), align, indent, spacing
- Structure: headings (Heading 1/2/3), paragraphs, sections, page breaks, section breaks
- Tables: create, format, style, cell operations, borders, shading, headers
- Lists: bulleted, numbered, multi-level, custom styles
- Page Layout: margins, orientation, columns, headers/footers, page numbers
- Links: hyperlinks on existing text (NEVER insert URL text)
- Media: inline pictures from base64, alt text
- References: footnotes, endnotes, bookmarks, table of contents
- Content Controls: rich text, plain text, checkboxes, dropdowns, date pickers
- HTML: for complex formatting, colored backgrounds, styled content
- Search/Replace: find and replace text, with options for case/whole word/wildcards

SAFETY RULES:
- NEVER plan to use body.clear() unless user explicitly requests a template/blank document
- Always plan to READ existing content before modifying it (unless document is empty and creating new content)
- Plan to preserve all user content unless explicitly asked to remove something
- For reformatting: plan to modify paragraphs IN-PLACE, never delete and recreate

ATTACHED FILE DATA RULES:
- When the user attaches a file (PDF/DOCX), its text content is provided in [ATTACHED FILE DATA] section
- Treat this as the SOURCE DATA for the task — use ALL of it, never skip or summarize
- For resume creation: plan separate steps for EVERY section (name, contact, summary, skills, experience, projects, education)
- Each step should specify the exact data to include and the formatting to apply
- Plan to make URLs clickable with hyperlinks
- Mark complexity as "complex" when building a full document from file data

RULES:
- Keep steps actionable and specific to Word document operations
- Identify if document content needs to be read first (usually yes for editing, no for creation from file)
- Flag complexity based on operations needed
- Note any ambiguities in the request
- Suggest the safest approach when multiple options exist`;

export async function createWordPlan(task: string, docContext: DocumentContext | null, signal?: AbortSignal): Promise<WordTaskPlan> {
    let contextInfo = "";
    if (docContext && docContext.hasContent) {
        contextInfo = `\n\nCURRENT DOCUMENT CONTEXT:
- Paragraphs: ${docContext.paragraphCount}
- Word Count: ~${docContext.wordCount}
- Headings: ${docContext.headings.join(", ") || "None"}
- Content preview: "${docContext.sampleText.substring(0, 200)}..."`;
    }

    const messages = [
        { role: "system" as const, content: PLANNER_PROMPT },
        { role: "user" as const, content: task + contextInfo },
    ];

    const response = await callLLM(messages, undefined, signal);

    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as WordTaskPlan;
        }
    } catch (e) {
        console.warn("Failed to parse plan:", e);
    }

    return {
        understanding: task,
        steps: ["Execute the requested operation"],
        dataNeeded: [],
        expectedOutput: "Modified document",
        complexity: "moderate",
        warnings: [],
    };
}

// ═══════════════════════════════════════════════════════════════
// CODER — Generates validated Word JavaScript code
// ═══════════════════════════════════════════════════════════════

const CODER_SYSTEM_PROMPT = `You are a Word JavaScript API expert coder. Generate ONLY raw executable JavaScript code.

ENVIRONMENT (pre-declared — DO NOT redeclare these variables):
- context: Word.RequestContext (ready to use)
- body: context.document.body (ready to use)
- Word: Namespace for all enums & types

═══ ABSOLUTE RULES ═══
1. Output RAW JavaScript ONLY. No markdown fences. No explanations.
2. NEVER write: const context = ... | const body = ... (ALREADY DECLARED)
3. ALWAYS call .load("prop1,prop2") + await context.sync() BEFORE reading any property.
4. Call await context.sync() after writes to push changes to the document.
5. NEVER use body.clear() — it DESTROYS the entire document. FORBIDDEN.
6. Always null-check arrays: if (items.length > 0) before looping.
7. Style names require spaces: "Heading 1", "Heading 2", "Normal", "List Bullet", "List Number".

═══ PARAGRAPH OPERATIONS ═══
// Insert at end/start
body.insertParagraph("text", Word.InsertLocation.end);
body.insertParagraph("text", Word.InsertLocation.start);
// Insert relative to another paragraph
paragraphs.items[i].insertParagraph("text", Word.InsertLocation.after);
paragraphs.items[0].insertParagraph("text", Word.InsertLocation.before);
// Replace text in a range
range.insertText("new", Word.InsertLocation.replace);
// Read existing paragraphs
const paragraphs = body.paragraphs;
paragraphs.load("items/text,items/style,items/font"); await context.sync();
for (let i = 0; i < paragraphs.items.length; i++) { const p = paragraphs.items[i]; /* modify p */ }
await context.sync();

═══ FONT FORMATTING (all properties on paragraph.font) ═══
p.font.name = "Calibri";       p.font.size = 11;
p.font.bold = true;            p.font.italic = true;
p.font.underline = Word.UnderlineType.single; // .double, .dotted, .wave, .none
p.font.strikeThrough = true;   p.font.color = "#2D6A4F";
p.font.highlightColor = "Yellow"; // Red, Green, Cyan, Magenta, Blue, DarkYellow, Turquoise
p.font.subscript = true;       p.font.superscript = true;

═══ PARAGRAPH FORMATTING ═══
p.alignment = Word.Alignment.centered;  // .left, .right, .justified
p.lineSpacing = 12;     // 12=single, 18=1.5, 24=double, 36=triple
p.spaceAfter = 6;       p.spaceBefore = 12;
p.firstLineIndent = 36; // first line indent in points (36pt = 0.5in)
p.leftIndent = 36;      p.rightIndent = 0;
p.keepWithNext = true;   p.keepTogether = true;
p.outlineLevel = Word.OutlineLevel.outlineLevel1;

═══ STYLES ═══
p.style = "Heading 1";     p.style = "Heading 2";    p.style = "Heading 3";
p.style = "Normal";        p.style = "Title";         p.style = "Subtitle";
p.style = "List Bullet";   p.style = "List Number";   p.style = "List Bullet 2";
p.style = "Quote";         p.style = "Intense Quote"; p.style = "No Spacing";
p.style = "TOC Heading";   p.style = "Header";        p.style = "Footer";

═══ TABLES ═══
// Create
const data = [["Name","Age","Email"],["Alice","30","a@b.com"]];
const table = body.insertTable(data.length, data[0].length, Word.InsertLocation.end, data);
table.styleBuiltIn = Word.BuiltInStyleName.gridTable5Dark_Accent1;
table.autoFitWindow(); // Fit to page width
// Access cells
table.getCell(0, 0).body.insertParagraph("text", Word.InsertLocation.replace);
// Cell shading, alignment
table.getCell(0, 0).shadingColor = "#2D6A4F";
table.getCell(0, 0).verticalAlignment = Word.VerticalAlignment.center;
// Row operations
table.rows.load("items"); await context.sync();
table.addRows(Word.InsertLocation.end, 1, [["New","Row","Data"]]);
// Header row bold
const headerRow = table.rows.items[0]; headerRow.load("cells"); await context.sync();
for(let c=0;c<headerRow.cells.items.length;c++){headerRow.cells.items[c].body.paragraphs.load("items/font");} await context.sync();
table.headerRowCount = 1;
// Borders
const border = table.getBorder(Word.BorderLocation.all);
border.type = Word.BorderType.single; border.color = "#000000"; border.width = 1;
await context.sync();

═══ SEARCH & REPLACE ═══
const results = body.search("oldText", {matchCase: false, matchWholeWord: false});
results.load("items/text"); await context.sync();
for (let i = 0; i < results.items.length; i++) {
  results.items[i].insertText("newText", Word.InsertLocation.replace);
}
await context.sync();
// Search with wildcards: body.search("pattern", {matchWildcards: true})

═══ SELECTION-SCOPED OPERATIONS ═══
// When user has SELECTED text, ALL operations must target ONLY the selection:
const sel = context.document.getSelection();
sel.load("text,font");
await context.sync();
// Format selection: sel.font.bold = true; sel.font.size = 14; sel.font.color = "#000";
// Hyperlink on selection: sel.hyperlink = "https://" + sel.text.trim();
// NEVER scan body.paragraphs when the user selected specific text.
// NEVER modify anything outside the selection.

═══ HYPERLINKS / MAKE ALL LINKS CLICKABLE ═══
// NEVER insert/append URL text — ONLY set .hyperlink on existing range
// CORRECT approach: scan paragraphs with JS regex, then search for each full URL:
const paras = body.paragraphs;
paras.load("items/text");
await context.sync();
const urlRegex = /https?:\/\/[^\s,)>\]]+/g;
const foundUrls = [];
for (let i = 0; i < paras.items.length; i++) {
  const txt = paras.items[i].text || "";
  let m;
  while ((m = urlRegex.exec(txt)) !== null) { foundUrls.push(m[0]); }
}
for (let j = 0; j < foundUrls.length; j++) {
  const searchResults = body.search(foundUrls[j], {matchCase: false, matchWholeWord: false});
  searchResults.load("items");
  await context.sync();
  for (let k = 0; k < searchResults.items.length; k++) {
    searchResults.items[k].hyperlink = foundUrls[j];
  }
  await context.sync();
}
// body.search("http") only matches the 4-char "http" substring, NOT the full URL!
// Always search for the FULL URL string to get the correct range.

═══ LISTS (BULLETS & NUMBERED) ═══
const b1 = body.insertParagraph("First item", Word.InsertLocation.end);
b1.startNewList(); // starts a new bulleted list
body.insertParagraph("Second item", Word.InsertLocation.end);
body.insertParagraph("Third item", Word.InsertLocation.end);
await context.sync();
// Styled lists:
// p.style = "List Bullet"; p.style = "List Number"; p.style = "List Bullet 2";

═══ HEADERS & FOOTERS ═══
const sections = context.document.sections;
sections.load("items"); await context.sync();
const section = sections.items[0];
// Primary header
const header = section.getHeader(Word.HeaderFooterType.primary);
const hPara = header.insertParagraph("Document Header", Word.InsertLocation.end);
hPara.font.size = 9; hPara.font.color = "#888888"; hPara.alignment = Word.Alignment.right;
// Primary footer
const footer = section.getFooter(Word.HeaderFooterType.primary);
const fPara = footer.insertParagraph("Page ", Word.InsertLocation.end);
fPara.font.size = 9; fPara.alignment = Word.Alignment.centered;
// First page different: section.getHeader(Word.HeaderFooterType.firstPage)
// Even pages: section.getHeader(Word.HeaderFooterType.evenPages)
await context.sync();

═══ PAGE BREAKS & SECTION BREAKS ═══
body.insertBreak(Word.BreakType.page, Word.InsertLocation.end);
body.insertBreak(Word.BreakType.sectionNext, Word.InsertLocation.end); // New section on next page
body.insertBreak(Word.BreakType.sectionContinuous, Word.InsertLocation.end); // New section same page
// Column break: Word.BreakType.column
// Line break (within paragraph): p.insertBreak(Word.BreakType.line, Word.InsertLocation.end);

═══ PAGE LAYOUT (via section pageSetup) ═══
const secs = context.document.sections;
secs.load("items"); await context.sync();
// Margins (in points: 72pt = 1 inch)
// Read current: secs.items[0].load("pageSetup"); await context.sync();
// Normal: top=72, bottom=72, left=72, right=72
// Narrow: top=36, bottom=36, left=36, right=36
// Wide: top=72, bottom=72, left=144, right=144

═══ IMAGES / INLINE PICTURES ═══
// Insert from base64 (strip "data:image/..." prefix first)
const pic = body.insertInlinePictureFromBase64(base64String, Word.InsertLocation.end);
pic.width = 300; pic.height = 200;
pic.altTextTitle = "Description";
// Read existing pictures:
const pics = body.inlinePictures; pics.load("items/width,items/height"); await context.sync();

═══ CONTENT CONTROLS ═══
const cc = body.insertContentControl(Word.ContentControlType.richText);
cc.title = "Section Name"; cc.tag = "section1";
cc.appearance = Word.ContentControlAppearance.tags;
// Types: richText, plainText, checkBox, dropDownList, datePicker, picture

═══ INSERT HTML (for complex formatting) ═══
body.insertHtml("<h1>Title</h1><p>Content here</p>", Word.InsertLocation.end);
body.insertHtml('<table border="1"><tr><td>A</td><td>B</td></tr></table>', Word.InsertLocation.end);
body.insertHtml('<ul><li>Item 1</li><li>Item 2</li></ul>', Word.InsertLocation.end);
body.insertHtml('<p style="border-bottom:2px solid #333;padding-bottom:4px;">With border</p>', Word.InsertLocation.end);
// HTML is ideal for: complex tables, colored backgrounds, styled lists, horizontal rules

═══ HORIZONTAL RULE / SEPARATOR ═══
body.insertHtml('<hr style="border:none;border-top:1px solid #ccc;margin:12px 0;">', Word.InsertLocation.end);
// Or: insert a paragraph with bottom border via HTML

═══ FOOTNOTES & ENDNOTES ═══
const range = context.document.getSelection();
range.insertFootnote("Footnote text.");
// range.insertEndnote("Endnote text.");
await context.sync();

═══ DELETE EMPTY PARAGRAPHS (space saving) ═══
const allParas = body.paragraphs;
allParas.load("items/text"); await context.sync();
for (let i = allParas.items.length - 1; i >= 0; i--) {
  if (allParas.items[i].text.trim() === "") allParas.items[i].delete();
}
await context.sync();

═══ CREATING DOCUMENTS FROM ATTACHED FILE DATA ═══
When the user attaches a file (PDF, DOCX) and asks you to create/build something from it:
1. The file's extracted text will be provided in [ATTACHED FILE CONTENT] section.
2. Use ALL data from the file — names, contacts, dates, skills, every detail. Do NOT skip or summarize.
3. Generate code that creates a COMPLETE, fully-formatted Word document using insertParagraph, font styling, tables, etc.
4. Structure the output professionally with proper sections, headings, spacing, and formatting.
5. For resumes: Include name (large, bold), contact info, summary, skills, experience with bullet points, projects with descriptions & links, education — ALL from the source data.
6. Make all URLs clickable by setting .hyperlink on the range after inserting the text.
7. Use body.insertParagraph() for each new paragraph/line. Format each one appropriately.
8. Use insertHtml() for complex layouts like contact info rows, horizontal rules, or multi-column sections.

═══ ATS RESUME FORMATTING RULES ═══
- Name: font.size=22, bold=true, alignment=centered, font.color="#1a1a1a".
- Contact line: font.size=10, centered, include phone | email | location, separated by " | ".
- Section headings: font.size=13, bold=true, font.color="#2B547E", spaceAfter=4, spaceBefore=12. Add a horizontal rule below via insertHtml.
- Body text: Calibri 10.5pt, lineSpacing=14, spaceAfter=2.
- Bullet points: Use "List Bullet" style for items under experience/projects.
- Links (GitHub, LinkedIn, NPM, Live Demo): Insert the text first, then search for the URL and set .hyperlink.
- Delete consecutive empty paragraphs to save space.

═══ CONTENT PRESERVATION (when editing existing docs) ═══
- Reformatting: Read → modify font/style/spacing → sync. NEVER delete text content.
- Adding: Word.InsertLocation.end or .start. Do NOT replace existing.
- Only delete truly empty paragraphs (p.text.trim() === "").

═══ BANNED (CRASH/DATA LOSS) ═══
body.clear(), Excel.*, sheet.*, .getUsedRange(), .getCell() (for non-tables),
.addText(), .addLink(), .addPage(), .setText(), .setFont(),
SpreadsheetApp, DocumentApp, alert(), confirm(), prompt(),
const context=..., const body=..., "Heading1" (no space), fetch(), require(), import

OUTPUT: Raw JavaScript code only. No markdown, no explanation.`;

export async function generateWordCode(
    task: string,
    plan: WordTaskPlan | null,
    docContext: DocumentContext | null,
    attachedFiles: WordAttachedFile[],
    previousError?: string,
    signal?: AbortSignal
): Promise<string> {
    let prompt = task;

    if (plan) {
        prompt += '\n\nPLAN:\n';
        for (let i = 0; i < plan.steps.length; i++) {
            prompt += (i + 1) + '. ' + plan.steps[i] + '\n';
        }
        if (plan.warnings.length > 0) {
            prompt += '\n\nWATCH OUT FOR:\n';
            for (let i = 0; i < plan.warnings.length; i++) {
                prompt += plan.warnings[i] + '\n';
            }
        }
    }

    // When files are attached and document is mostly empty, this is a CREATION task
    const isCreationTask = attachedFiles.length > 0 && attachedFiles.some(f => f.extractedText);
    const docIsEmpty = !docContext || !docContext.hasContent || docContext.wordCount < 20;

    if (docContext && docContext.hasContent) {
        if (isCreationTask && docIsEmpty) {
            // Document is empty/near-empty and we have file data — this is a creation task
            prompt += '\n\nDOCUMENT IS EMPTY. You are creating NEW content from the attached file data.\n';
            prompt += 'Use body.insertParagraph() to add content. Do NOT try to read or modify existing paragraphs.\n';
        } else {
            prompt += '\n\nDOCUMENT DATA (EXISTING CONTENT — DO NOT DELETE THIS):\n';
        }
        prompt += '- Paragraphs: ' + docContext.paragraphCount + '\n';
        prompt += '- Word Count: ~' + docContext.wordCount + '\n';
        prompt += '- Headings: ' + JSON.stringify(docContext.headings) + '\n';
        if (docContext.selectedText) {
            prompt += '- USER SELECTED/HIGHLIGHTED TEXT: "' + docContext.selectedText + '"\n';
            prompt += '\nSELECTION-SCOPED OPERATION: The user has selected specific text in the document.\n';
            prompt += 'RULES FOR SELECTED TEXT:\n';
            prompt += '1. The user\'s command applies ONLY to the selected text, NOT the entire document.\n';
            prompt += '2. Use context.document.getSelection() to get the selected range.\n';
            prompt += '3. Apply changes (formatting, hyperlinks, styling, etc.) ONLY to that range.\n';
            prompt += '4. Do NOT scan the whole document. Do NOT modify other paragraphs.\n';
            prompt += '5. For hyperlinks on selected text:\n';
            prompt += '   const sel = context.document.getSelection();\n';
            prompt += '   sel.load("text");\n';
            prompt += '   await context.sync();\n';
            prompt += '   let linkUrl = sel.text.trim();\n';
            prompt += '   if (!linkUrl.startsWith("http")) linkUrl = "https://" + linkUrl;\n';
            prompt += '   sel.hyperlink = linkUrl;\n';
            prompt += '   sel.font.color = "#0563C1"; sel.font.underline = Word.UnderlineType.single;\n';
            prompt += '   await context.sync();\n';
            prompt += '6. For formatting selected text: sel.font.bold = true; sel.font.size = 14; etc.\n';
            prompt += '7. NEVER use body.paragraphs loops when user has selected text. Work with the selection range ONLY.\n';
            prompt += '8. Do NOT insert, append, or duplicate the selected text. Modify it IN-PLACE.\n\n';
        }

        // Detect "make links clickable" without selection — scan entire document
        const linkKeywordsNoSel = /\b(clickable|hyperlink|link|url)\b/i;
        if ((!docContext.selectedText || docContext.selectedText.trim() === '') && linkKeywordsNoSel.test(task) && /\b(all|every|document|whole)\b/i.test(task)) {
            prompt += '\nNO TEXT SELECTED — SCAN ENTIRE DOCUMENT FOR URLs:\n';
            prompt += 'DO NOT use getSelection(). DO NOT use body.search("http") — that only matches the 4-char substring, not the full URL.\n';
            prompt += 'Instead, use this EXACT approach:\n';
            prompt += '  const paras = body.paragraphs;\n';
            prompt += '  paras.load("items/text");\n';
            prompt += '  await context.sync();\n';
            prompt += '  const urlRegex = /https?:\\/\\/[^\\s,)>\\]]+/g;\n';
            prompt += '  const foundUrls = [];\n';
            prompt += '  for (let i = 0; i < paras.items.length; i++) {\n';
            prompt += '    const txt = paras.items[i].text || "";\n';
            prompt += '    let m;\n';
            prompt += '    while ((m = urlRegex.exec(txt)) !== null) { foundUrls.push(m[0]); }\n';
            prompt += '  }\n';
            prompt += '  for (let j = 0; j < foundUrls.length; j++) {\n';
            prompt += '    const searchResults = body.search(foundUrls[j], {matchCase: false, matchWholeWord: false});\n';
            prompt += '    searchResults.load("items");\n';
            prompt += '    await context.sync();\n';
            prompt += '    for (let k = 0; k < searchResults.items.length; k++) {\n';
            prompt += '      searchResults.items[k].hyperlink = foundUrls[j];\n';
            prompt += '    }\n';
            prompt += '    await context.sync();\n';
            prompt += '  }\n';
            prompt += 'DO NOT use getSelection(). DO NOT use body.search("http"). Search for the FULL URL string.\n';
        }
        prompt += '- Full text: "' + docContext.sampleText + '"\n';
        if (isCreationTask && docIsEmpty) {
            prompt += '\nThis is a CREATION task. Generate NEW content using insertParagraph. Do NOT use body.clear().\n';
        } else {
            prompt += '\nPRESERVE ALL EXISTING CONTENT. Modify paragraphs in-place. NEVER use body.clear().\n';
        }
    }

    if (previousError) {
        prompt += '\n\nPREVIOUS ERROR: "' + previousError + '"\nFIX THIS ERROR. Output only corrected code.';
    }

    const messages: any[] = [{ role: "system", content: CODER_SYSTEM_PROMPT }];

    if (attachedFiles.length > 0) {
        // Include extracted text content directly in the prompt for reliable data usage
        const textParts: string[] = [];
        attachedFiles.forEach((file) => {
            if (file.extractedText) {
                textParts.push(`\n[FILE: "${file.name}"]\n${file.extractedText}`);
            }
        });
        if (textParts.length > 0) {
            prompt += "\n\n[ATTACHED FILE CONTENT — Use this as source data for the task]" + textParts.join("\n");
        }

        // Also send images for vision-capable models (PDFs rendered as images)
        const hasImages = attachedFiles.some(f => f.data && f.data.length > 0);
        if (hasImages) {
            const contentParts: any[] = [{ type: "text", text: prompt }];
            attachedFiles.forEach((file) => {
                file.data.slice(0, 10).forEach((imageUrl) => {
                    contentParts.push({ type: "image_url", image_url: { url: imageUrl } });
                });
            });
            messages.push({ role: "user", content: contentParts });
        } else {
            messages.push({ role: "user", content: prompt });
        }
    } else {
        messages.push({ role: "user", content: prompt });
    }

    let code = await callLLM(messages, undefined, signal);

    // Clean up markdown fences
    if (code.startsWith('```')) {
        const firstNewline = code.indexOf('\n');
        if (firstNewline >= 0) {
            code = code.slice(firstNewline + 1);
        } else {
            code = code.slice(3);
        }
    }
    if (code.endsWith('```')) {
        code = code.slice(0, -3);
    }
    code = code.trim();

    return code;
}

// ═══════════════════════════════════════════════════════════════
// FIXER — Repairs code based on validation or runtime errors
// ═══════════════════════════════════════════════════════════════

const FIXER_SYSTEM_PROMPT = `You are a Word JavaScript API debugger expert. Fix the broken code.

COMMON FIXES:
1. Excel.* → Use Word.* namespace instead
2. sheet.* → Use body.* (Word document body)
3. .getUsedRange() → Use body.paragraphs or body.search()
4. const body = ... → REMOVE (already declared, same for const context = ...)
5. SpreadsheetApp, DocumentApp → Use Word JS API
6. range.values = [[]] → Use body.insertParagraph() or insertTable()
7. body.clear() → REMOVE THIS. Never clear the document. Modify paragraphs individually.
8. InvalidArgument → Check: style names need spaces ("Heading 1" not "Heading1"), InsertLocation must be Word.InsertLocation.end/start/replace, table data dimensions must match row/col counts, hyperlinks need "https://" prefix
9. InvalidArgument on hyperlink → ALWAYS trim spaces and add "https://" prefix: range.hyperlink = "https://" + url.trim(); NEVER insert URL text.
10. Mashed/duplicated URL text → REMOVE any insertText/insertParagraph calls that write the URL. ONLY use range.hyperlink = url.
11. paragraph.style = "Heading1" → Use "Heading 1" (with space)
12. Properties not loaded → Add .load("text,style,font") + await context.sync() before reading
13. "Property 'text' is unavailable" → Must call .load("text") + await context.sync() before accessing .text
14. "This member is not part of this object" → Method doesn't exist on this type. Check correct API method.
15. table.getCell() errors → Ensure row/column indices are within bounds. Use table.load("rowCount,columnCount") first.
16. .addText()/.addLink()/.addPage()/.setText() → These are HALLUCINATED. Use .insertText(), .hyperlink=, .insertBreak(), .insertText(Word.InsertLocation.replace)
17. "RichApi.Error" → Usually means accessing a property that wasn't loaded. Add .load() + sync().
18. Infinite loop → Add bounds checking, use for-loops with clear termination, never while(true).
19. Missing await → All context.sync(), Word.run(), and other async calls need await.
20. alert/confirm/prompt → Remove - these are blocked in add-ins.
21. fetch/require/import → Remove - not available in sandboxed execution.
22. document.getElementById/createElement/innerHTML → These are DOM, not Word API. Use Word JS methods.

CRITICAL: NEVER use body.clear(). Modify existing paragraphs in-place.
OUTPUT: Fixed code only. No explanation, no markdown fences.`;

export async function fixWordCode(
    originalCode: string,
    errors: WordValidationError[],
    runtimeError?: string,
    signal?: AbortSignal
): Promise<string> {
    let errorSummary = "";

    if (errors.length > 0) {
        errorSummary = "VALIDATION ERRORS:\n" + errors.map((e) => `- ${e.message} → ${e.suggestion}`).join("\n");
    }

    if (runtimeError) {
        errorSummary += (errorSummary ? "\n\n" : "") + `RUNTIME ERROR: ${runtimeError}`;
    }

    const messages = [
        { role: "system" as const, content: FIXER_SYSTEM_PROMPT },
        { role: "user" as const, content: `BROKEN CODE:\n${originalCode}\n\n${errorSummary}\n\nFix the code:` },
    ];

    let fixedCode = await callLLM(messages, undefined, signal);

    fixedCode = fixedCode.replace(/^```(?:javascript|js|typescript|ts)?\n?/gi, "");
    fixedCode = fixedCode.replace(/\n?```$/gi, "");

    return fixedCode.trim();
}

// ═══════════════════════════════════════════════════════════════
// ORCHESTRATOR — Main agent loop
// ═══════════════════════════════════════════════════════════════

export interface WordOrchestratorConfig {
    maxRetries: number;
    enablePlanning: boolean;
    strictValidation: boolean;
    timeout: number;
}

const DEFAULT_CONFIG: WordOrchestratorConfig = {
    maxRetries: 3,
    enablePlanning: true,
    strictValidation: true,
    timeout: 30000,
};

export interface WordOrchestratorResult {
    success: boolean;
    code: string;
    plan: WordTaskPlan | null;
    validation: WordValidationResult | null;
    error?: string;
    retries: number;
    duration: number;
}

export async function runWordAgent(
    task: string,
    docContext: DocumentContext | null,
    attachedFiles: WordAttachedFile[],
    config: Partial<WordOrchestratorConfig> = {},
    signal?: AbortSignal
): Promise<WordOrchestratorResult> {
    const cfg = { ...DEFAULT_CONFIG, ...config };
    const startTime = Date.now();

    // Detect if this is a template prompt that legitimately needs body.clear()
    const isTemplateTask = /\bbody\.clear\(\)/i.test(task) || /^First clear the document/i.test(task);

    let plan: WordTaskPlan | null = null;
    let code = "";
    let validation: WordValidationResult | null = null;
    let retries = 0;

    try {
        // ═══ PHASE 1: PLANNING ═══
        if (cfg.enablePlanning) {
            try {
                // Include attached file content in planner context
                let plannerTask = task;
                if (attachedFiles.length > 0) {
                    const fileTexts = attachedFiles
                        .filter(f => f.extractedText)
                        .map(f => `[File: "${f.name}"]\n${f.extractedText}`);
                    if (fileTexts.length > 0) {
                        plannerTask += "\n\n[ATTACHED FILE DATA — Use this as source data for the task]\n" + fileTexts.join("\n\n");
                    }
                }
                plan = await createWordPlan(plannerTask, docContext, signal);
                console.log("[WordAgent] Plan created:", plan);
            } catch (e) {
                if ((e as any).name === 'AbortError') throw e;
                console.warn("[WordAgent] Planning failed:", e);
            }
        }

        // ═══ PHASE 2: CODE GENERATION ═══
        code = await generateWordCode(task, plan, docContext, attachedFiles, undefined, signal);
        console.log("[WordAgent] Initial code generated");

        // ═══ PHASE 3: VALIDATION LOOP ═══
        for (let attempt = 0; attempt <= cfg.maxRetries; attempt++) {
            validation = validateWordCode(code, isTemplateTask);

            if (validation.isValid) {
                console.log(`[WordAgent] Code validated on attempt ${attempt + 1}`);
                break;
            }

            if (attempt < cfg.maxRetries) {
                console.log(`[WordAgent] Validation failed (attempt ${attempt + 1}), fixing...`);
                code = await fixWordCode(code, validation.errors, undefined, signal);
                retries++;
            }
        }

        // Final validation
        validation = validateWordCode(code, isTemplateTask);

        if (!validation.isValid && cfg.strictValidation) {
            throw new Error(
                `Code validation failed: ${validation.errors.map((e) => e.message).join("; ")}`
            );
        }

        code = validation.sanitizedCode;

        return {
            success: true,
            code,
            plan,
            validation,
            retries,
            duration: Date.now() - startTime,
        };
    } catch (error: any) {
        return {
            success: false,
            code,
            plan,
            validation,
            error: error.message,
            retries,
            duration: Date.now() - startTime,
        };
    }
}

// ═══════════════════════════════════════════════════════════════
// EXECUTE WITH RECOVERY
// ═══════════════════════════════════════════════════════════════

export async function executeWordWithRecovery(
    code: string,
    executor: (code: string) => Promise<void>,
    maxRetries: number = 2,
    signal?: AbortSignal
): Promise<{ success: boolean; error?: string; finalCode: string }> {
    let currentCode = code;
    let lastError = "";

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        if (signal?.aborted) {
            throw new DOMException("Execution cancelled", "AbortError");
        }

        try {
            await executor(currentCode);
            return { success: true, finalCode: currentCode };
        } catch (error: any) {
            lastError = error.message || String(error);
            console.warn(`[WordAgent] Execution failed (attempt ${attempt + 1}):`, lastError);

            if (attempt < maxRetries) {
                currentCode = await fixWordCode(currentCode, [], lastError, signal);
                const validation = validateWordCode(currentCode);
                if (validation.isValid) {
                    currentCode = validation.sanitizedCode;
                } else {
                    currentCode = await fixWordCode(currentCode, validation.errors, undefined, signal);
                }
            }
        }
    }

    return { success: false, error: lastError, finalCode: currentCode };
}

// ═══════════════════════════════════════════════════════════════
// UTILITY: Read current document context
// ═══════════════════════════════════════════════════════════════

export async function readDocumentContext(): Promise<DocumentContext | null> {
    try {
        // @ts-ignore - Word is global in Office Add-ins
        return await Word.run(async (context: any) => {
            const body = context.document.body;
            body.load("text");

            const paragraphs = body.paragraphs;
            paragraphs.load("items/text,items/style,items/font");

            // Check for tables
            const tables = body.tables;
            tables.load("count");

            // Check for inline pictures
            const pictures = body.inlinePictures;
            pictures.load("count");

            // Get selected text
            const selection = context.document.getSelection();
            selection.load("text");

            await context.sync();

            const allText = body.text || "";
            const wordCount = allText.split(/\s+/).filter((w: string) => w.length > 0).length;

            // Extract headings and detect content types
            const headings: string[] = [];
            const contentTypes = new Set<string>();
            contentTypes.add("text");

            let hasLists = false;
            let hasBoldText = false;

            for (let i = 0; i < paragraphs.items.length; i++) {
                const p = paragraphs.items[i];
                if (p.style && (p.style.includes("Heading") || p.style.includes("heading"))) {
                    headings.push(p.text.trim());
                }
                if (p.style && (p.style.includes("List") || p.style.includes("Bullet") || p.style.includes("Number"))) {
                    hasLists = true;
                }
                // Check for bullet-like characters at start
                const trimmed = p.text.trim();
                if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*") || /^\d+\.\s/.test(trimmed)) {
                    hasLists = true;
                }
            }

            if (tables.count > 0) contentTypes.add("table");
            if (pictures.count > 0) contentTypes.add("image");
            if (hasLists) contentTypes.add("list");
            if (headings.length > 0) contentTypes.add("headings");

            return {
                documentTitle: headings.length > 0 ? headings[0] : "Untitled",
                paragraphCount: paragraphs.items.length,
                wordCount,
                sampleText: allText.substring(0, 3000),
                headings,
                hasContent: allText.trim().length > 0,
                contentTypes: Array.from(contentTypes),
                selectedText: selection.text ? selection.text.trim() : "",
            };
        });
    } catch (e) {
        console.error("Failed to read document context:", e);
        return null;
    }
}
