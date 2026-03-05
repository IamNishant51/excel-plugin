/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/services/word-chat-prompt.ts":
/*!******************************************!*\
  !*** ./src/services/word-chat-prompt.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WORD_CHAT_PROMPT: function() { return /* binding */ WORD_CHAT_PROMPT; },
/* harmony export */   WORD_CONTEXT_PROMPT: function() { return /* binding */ WORD_CONTEXT_PROMPT; }
/* harmony export */ });
/**
 * DocOS AI — Planning Mode (Chat) System Prompt for Word
 * Conversational AI that helps users plan, learn, and strategize document work.
 */
const WORD_CHAT_PROMPT = `You are DocOS AI — a friendly, expert Word document assistant in Planning Mode.

YOUR ROLE:
- Help users plan their document work step by step
- Explain Word concepts, formatting, and best practices
- Suggest approaches before executing
- Answer questions about document structure, writing, and design
- Provide formatting tips and style guidance
- When given document context, analyze the USER'S ACTUAL DOCUMENT and answer questions directly
- Help with resume optimization, ATS compliance, and professional writing
- Advise on page layout, margins, headers/footers, columns, and sections
- Guide table creation, formatting, and data organization
- Explain accessibility best practices for documents

CONTEXT AWARENESS:
When a message includes [DOCUMENT CONTEXT], you have access to the user's ACTUAL Word document!
- Analyze the real content, headings, paragraphs, and structure
- Give SPECIFIC answers based on their actual document content
- Reference their exact headings and text in your response
- Suggest improvements tailored to their document
- Point out formatting issues, writing quality, and structural problems
- You CAN see their document — do NOT say "I don't have access to your document"
- If the document has tables, lists, or images, mention what you see

RESPONSE FORMAT RULES:
1. Respond in natural, conversational language
2. Use markdown-style formatting for emphasis: **bold**, *italic*, \`code\`
3. Use bullet points and numbered lists for clarity
4. Keep responses concise but thorough (aim for 2-5 paragraphs max)
5. If the user's request requires MODIFYING the document, mention they can switch to ⚡ Agent Mode
6. When you have document context, ALWAYS reference the user's actual content

DOCUMENT EXPERTISE AREAS:
- Resume/CV optimization and ATS compliance
- Professional writing and tone improvement
- Document formatting, styles, and themes
- Letter writing (cover letters, business letters, thank-you letters)
- Report structure, organization, and executive summaries
- Academic formatting (APA, MLA, Chicago, Harvard)
- Grammar, punctuation, and style guidance
- Content summarization, expansion, and paraphrasing
- Meeting notes, minutes, and action items
- Proofreading and editing strategies
- Document accessibility (alt text, heading structure, reading order)
- Table design and data presentation best practices
- Page layout: margins, orientation, columns, sections, page breaks
- Headers, footers, page numbers, and watermarks
- Lists: bulleted, numbered, multi-level, custom formatting
- Hyperlinks and cross-references
- Table of contents and navigation
- Footnotes, endnotes, and citations
- Content controls, forms, and templates
- Mail merge concepts and personalization
- Track changes and collaboration workflows
- Document security and permissions
- Image handling, alt text, and text wrapping concepts
- Section management and different page layouts in one document

PERSONALITY:
- Friendly and encouraging
- Uses concrete examples when explaining
- Proactive — suggest improvements the user might not have thought of
- Mentions potential pitfalls or common mistakes to avoid
- When analyzing documents, be specific: "Your heading 'Experience' could be..."
- Give actionable advice, not vague suggestions

If the user asks you to MODIFY or EXECUTE something, remind them:
"💡 Switch to ⚡ Agent Mode to execute this! I can help you plan it here first."

User Message:
`;

/**
 * Prompt for generating contextual suggestions based on document content
 */
const WORD_CONTEXT_PROMPT = `You are DocOS AI. Based on the following Word document content, suggest 3-4 useful actions the user could take. Each suggestion should be a short phrase (5-8 words max). Tailor suggestions to what would actually improve THIS specific document. Format as a JSON array of strings. Example: ["Make resume ATS-friendly", "Improve professional tone", "Add table of contents"]. Only output the JSON array, nothing else.

Document Content:
`;

/***/ }),

/***/ "./src/services/word-orchestrator.ts":
/*!*******************************************!*\
  !*** ./src/services/word-orchestrator.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createWordPlan: function() { return /* binding */ createWordPlan; },
/* harmony export */   executeWordWithRecovery: function() { return /* binding */ executeWordWithRecovery; },
/* harmony export */   fixWordCode: function() { return /* binding */ fixWordCode; },
/* harmony export */   generateWordCode: function() { return /* binding */ generateWordCode; },
/* harmony export */   readDocumentContext: function() { return /* binding */ readDocumentContext; },
/* harmony export */   runWordAgent: function() { return /* binding */ runWordAgent; },
/* harmony export */   validateWordCode: function() { return /* binding */ validateWordCode; }
/* harmony export */ });
/* harmony import */ var _llm_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./llm.service */ "./src/services/llm.service.ts");
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



// ═══════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// BANNED PATTERNS — These cause runtime errors in Word JS API
// ═══════════════════════════════════════════════════════════════

const BANNED_PATTERNS = [
// ⚠️ CRITICAL: Prevent content destruction
{
  pattern: /body\.clear\s*\(/g,
  message: "body.clear() DELETES ALL CONTENT — NEVER use this",
  fix: "To reformat, iterate body.paragraphs and modify each one in-place. Never clear the document."
},
// Excel-contamination
{
  pattern: /Excel\./g,
  message: "Excel namespace doesn't exist in Word",
  fix: "Use Word namespace (Word.InsertLocation, Word.Alignment, etc.)"
}, {
  pattern: /sheet\./g,
  message: "sheet doesn't exist in Word",
  fix: "Use context.document.body or paragraphs"
}, {
  pattern: /\.getUsedRange\(/g,
  message: "getUsedRange() is an Excel method",
  fix: "Use context.document.body for Word"
}, {
  pattern: /\.getRange\(/g,
  message: "getRange() is an Excel method",
  fix: "Use body.paragraphs or body.search() for Word"
}, {
  pattern: /\.getCell\(/g,
  message: "getCell() is an Excel method",
  fix: "Use Word paragraph/table API instead"
}, {
  pattern: /\.getRow\(/g,
  message: "getRow() is an Excel method",
  fix: "Use Word table rows API: table.rows"
}, {
  pattern: /\.format\.fill/g,
  message: "format.fill is Excel-specific",
  fix: "Use paragraph.font or shading for Word"
}, {
  pattern: /\.format\.borders/g,
  message: "format.borders is Excel-specific",
  fix: "Use Word table borders or paragraph borders"
}, {
  pattern: /\.freezePanes/g,
  message: "freezePanes is Excel-specific",
  fix: "Remove - not applicable in Word"
}, {
  pattern: /\.autofitColumns/g,
  message: "autofitColumns is Excel-specific",
  fix: "Use table.autoFitWindow() in Word"
},
// Google Apps Script contamination
{
  pattern: /SpreadsheetApp/g,
  message: "SpreadsheetApp is Google Apps Script",
  fix: "Use Word JavaScript API"
}, {
  pattern: /DocumentApp/g,
  message: "DocumentApp is Google Apps Script",
  fix: "Use Word JavaScript API"
}, {
  pattern: /Logger\.log/g,
  message: "Logger.log is Google Apps Script",
  fix: "Use console.log or remove"
},
// Wrong variable declarations
{
  pattern: /(?:const|let|var)\s+context\s*=/g,
  message: "context is already declared",
  fix: "Remove - context is provided"
}, {
  pattern: /(?:const|let|var)\s+body\s*=\s*context\.document/g,
  message: "body is already declared",
  fix: "Remove - body is provided"
},
// Fake/Hallucinated methods
{
  pattern: /\.addText\(/g,
  message: "addText() is not in Word API",
  fix: "Use .insertText('text', Word.InsertLocation.end)"
}, {
  pattern: /\.addLink\(/g,
  message: "addLink() is not in Word API",
  fix: "Use range.hyperlink = 'url'"
}, {
  pattern: /\.addPage\(/g,
  message: "addPage() is not in Word API",
  fix: "Use body.insertBreak(Word.BreakType.page, Word.InsertLocation.end)"
}, {
  pattern: /\.addSection\(/g,
  message: "addSection() is not in Word API",
  fix: "Use body.insertBreak(Word.BreakType.sectionNext, Word.InsertLocation.end)"
}, {
  pattern: /\.addBookmark\(/g,
  message: "addBookmark() is not in Word API",
  fix: "Use range.insertBookmark('name')"
}, {
  pattern: /\.addComment\(/g,
  message: "addComment() is not in Word API",
  fix: "Use range.insertComment('text')"
}, {
  pattern: /\.setText\(/g,
  message: "setText() is not in Word API",
  fix: "Use .insertText('text', Word.InsertLocation.replace)"
}, {
  pattern: /\.setFont\(/g,
  message: "setFont() is not in Word API",
  fix: "Use .font.name = 'Calibri', .font.size = 11, etc."
}, {
  pattern: /\.setAlignment\(/g,
  message: "setAlignment() is not in Word API",
  fix: "Use .alignment = Word.Alignment.centered"
}, {
  pattern: /\.getBoundingClientRect\(/g,
  message: "getBoundingClientRect() is a DOM method, not Word API",
  fix: "Remove"
}, {
  pattern: /document\.getElementById/g,
  message: "DOM methods are not for Word document manipulation",
  fix: "Use Word JS API body/paragraphs methods"
}, {
  pattern: /document\.createElement/g,
  message: "DOM methods are not for Word document manipulation",
  fix: "Use Word JS API insertParagraph, insertTable, insertHtml"
}, {
  pattern: /\.innerHTML/g,
  message: "innerHTML is DOM, not Word API",
  fix: "Use Word body.insertHtml() instead"
},
// UI methods that don't work in add-ins
{
  pattern: /alert\s*\(/g,
  message: "alert() doesn't work in add-ins",
  fix: "Remove - use status messages"
}, {
  pattern: /confirm\s*\(/g,
  message: "confirm() doesn't work in add-ins",
  fix: "Remove"
}, {
  pattern: /prompt\s*\(/g,
  message: "prompt() doesn't work in add-ins",
  fix: "Remove"
},
// Network/File operations not available
{
  pattern: /fetch\s*\(/g,
  message: "fetch() is not allowed in generated code",
  fix: "Remove - data should come from document context"
}, {
  pattern: /require\s*\(/g,
  message: "require() is not available in sandboxed execution",
  fix: "Remove"
}, {
  pattern: /import\s+/g,
  message: "import statements are not available in sandboxed execution",
  fix: "Remove"
}];

// ═══════════════════════════════════════════════════════════════
// ALLOWED API WHITELIST — Only these Word JS API calls are safe
// ═══════════════════════════════════════════════════════════════

const ALLOWED_API_PATTERNS = [
// Core objects
/context\.document/, /context\.sync\(\)/, /body\./, /Word\./,
// Paragraph operations
/\.paragraphs/, /\.insertParagraph\(/, /\.insertText\(/, /\.insertBreak\(/, /\.insertHtml\(/, /\.insertOoxml\(/, /\.insertContentControl\(/, /\.insertTable\(/, /\.insertInlinePictureFromBase64\(/, /\.insertFileFromBase64\(/,
// Font & formatting (comprehensive)
/\.font\./, /\.style/, /\.alignment/, /\.hyperlink/, /\.lineSpacing/, /\.spaceAfter/, /\.spaceBefore/, /\.firstLineIndent/, /\.leftIndent/, /\.rightIndent/, /\.keepWithNext/, /\.keepTogether/, /\.outlineLevel/, /\.lineUnitAfter/, /\.lineUnitBefore/, /\.highlightColor/, /\.strikeThrough/, /\.subscript/, /\.superscript/, /\.underline/, /\.styleBuiltIn/,
// Range operations
/\.getRange\(/, /\.search\(/, /\.select\(/, /\.getSelection\(/, /\.getTextRanges\(/, /\.expandTo\(/, /\.intersectWith\(/, /\.compareLocationWith\(/, /\.getNext\(/, /\.getPrevious\(/, /\.getFirst\(/, /\.getLast\(/, /\.split\(/, /\.parentBody/, /\.parentTable/, /\.parentTableCell/,
// Table operations (comprehensive)
/\.tables/, /\.rows/, /\.cells/, /\.addRows\(/, /\.addColumns\(/, /\.getBorder\(/, /\.getCell\(/, /\.autoFitWindow\(/, /\.autoFitContents\(/, /\.width/, /\.height/, /\.rowCount/, /\.columnCount/, /\.values/, /\.verticalAlignment/, /\.shadingColor/, /\.setCellPadding\(/, /\.mergeCells\(/, /\.headerRowCount/,
// Content controls
/\.contentControls/, /\.tag/, /\.title/, /\.appearance/, /\.cannotDelete/, /\.cannotEdit/, /\.removeWhenEdited/, /\.placeholderText/,
// Section & header/footer
/\.sections/, /\.getHeader\(/, /\.getFooter\(/, /\.pageSetup/, /\.headerDistance/, /\.footerDistance/, /\.differentFirstPage/, /\.differentOddAndEvenPages/, /\.topMargin/, /\.bottomMargin/, /\.leftMargin/, /\.rightMargin/, /\.paperWidth/, /\.paperHeight/, /\.orientation/,
// Load operations
/\.load\(/,
// Delete (clear is BANNED for body, OK for cells/ranges)
/\.delete\(\)/, /\.clear\(\)/,
// Lists (comprehensive)
/\.listItem/, /\.startNewList\(/, /\.lists/, /\.listOrNullObject/, /\.levelNumber/,
// Inline pictures
/\.inlinePictures/, /\.altTextTitle/, /\.altTextDescription/, /\.lockAspectRatio/,
// Footnotes & endnotes
/\.footnotes/, /\.endnotes/, /\.insertFootnote\(/, /\.insertEndnote\(/,
// Comments
/\.comments/, /\.getComments\(/,
// Bookmarks
/\.bookmarks/,
// Fields
/\.fields/, /\.insertField\(/,
// OOXML
/\.getOoxml\(/,
// Track changes
/\.track/,
// Document properties
/\.properties/];

// ═══════════════════════════════════════════════════════════════
// CODE VALIDATOR
// ═══════════════════════════════════════════════════════════════

function validateWordCode(code) {
  let allowClear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const errors = [];
  const warnings = [];
  const apiCallsDetected = [];
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
          suggestion: banned.fix
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
      suggestion: "Add 'await context.sync();' after .load() calls"
    });
  }

  // 4. Check for basic syntax errors
  try {
    new Function("context", "body", "Word", `return (async () => { ${sanitizedCode} })();`);
  } catch (syntaxError) {
    errors.push({
      type: "syntax",
      message: syntaxError.message,
      suggestion: "Check for missing brackets, semicolons, or typos"
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
      suggestion: "Remove eval() call"
    });
  }

  // 7. Auto-fix body redeclarations
  sanitizedCode = sanitizedCode.replace(/(?:const|let|var)\s+body\s*=\s*context\.document\.body\s*;?/g, "// body already available");
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedCode,
    apiCallsDetected
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
async function createWordPlan(task, docContext, signal) {
  let contextInfo = "";
  if (docContext && docContext.hasContent) {
    contextInfo = `\n\nCURRENT DOCUMENT CONTEXT:
- Paragraphs: ${docContext.paragraphCount}
- Word Count: ~${docContext.wordCount}
- Headings: ${docContext.headings.join(", ") || "None"}
- Content preview: "${docContext.sampleText.substring(0, 200)}..."`;
  }
  const messages = [{
    role: "system",
    content: PLANNER_PROMPT
  }, {
    role: "user",
    content: task + contextInfo
  }];
  const response = await (0,_llm_service__WEBPACK_IMPORTED_MODULE_0__.callLLM)(messages, undefined, signal);
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
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
    warnings: []
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
// 🚨 NEVER insert/append URL text — ONLY set .hyperlink on existing range
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
// ⚠️ body.search("http") only matches the 4-char "http" substring, NOT the full URL!
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
async function generateWordCode(task, plan, docContext, attachedFiles, previousError, signal) {
  let prompt = task;
  if (plan) {
    prompt += '\n\nPLAN:\n';
    for (let i = 0; i < plan.steps.length; i++) {
      prompt += i + 1 + '. ' + plan.steps[i] + '\n';
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
      prompt += '\n🚨 SELECTION-SCOPED OPERATION: The user has selected specific text in the document.\n';
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
      prompt += '\n🚨 NO TEXT SELECTED — SCAN ENTIRE DOCUMENT FOR URLs:\n';
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
      prompt += '🚨 DO NOT use getSelection(). DO NOT use body.search("http"). Search for the FULL URL string.\n';
    }
    prompt += '- Full text: "' + docContext.sampleText + '"\n';
    if (isCreationTask && docIsEmpty) {
      prompt += '\nThis is a CREATION task. Generate NEW content using insertParagraph. Do NOT use body.clear().\n';
    } else {
      prompt += '\n⚠️ PRESERVE ALL EXISTING CONTENT. Modify paragraphs in-place. NEVER use body.clear().\n';
    }
  }
  if (previousError) {
    prompt += '\n\nPREVIOUS ERROR: "' + previousError + '"\nFIX THIS ERROR. Output only corrected code.';
  }
  const messages = [{
    role: "system",
    content: CODER_SYSTEM_PROMPT
  }];
  if (attachedFiles.length > 0) {
    // Include extracted text content directly in the prompt for reliable data usage
    const textParts = [];
    attachedFiles.forEach(file => {
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
      const contentParts = [{
        type: "text",
        text: prompt
      }];
      attachedFiles.forEach(file => {
        file.data.slice(0, 10).forEach(imageUrl => {
          contentParts.push({
            type: "image_url",
            image_url: {
              url: imageUrl
            }
          });
        });
      });
      messages.push({
        role: "user",
        content: contentParts
      });
    } else {
      messages.push({
        role: "user",
        content: prompt
      });
    }
  } else {
    messages.push({
      role: "user",
      content: prompt
    });
  }
  let code = await (0,_llm_service__WEBPACK_IMPORTED_MODULE_0__.callLLM)(messages, undefined, signal);

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
async function fixWordCode(originalCode, errors, runtimeError, signal) {
  let errorSummary = "";
  if (errors.length > 0) {
    errorSummary = "VALIDATION ERRORS:\n" + errors.map(e => `- ${e.message} → ${e.suggestion}`).join("\n");
  }
  if (runtimeError) {
    errorSummary += (errorSummary ? "\n\n" : "") + `RUNTIME ERROR: ${runtimeError}`;
  }
  const messages = [{
    role: "system",
    content: FIXER_SYSTEM_PROMPT
  }, {
    role: "user",
    content: `BROKEN CODE:\n${originalCode}\n\n${errorSummary}\n\nFix the code:`
  }];
  let fixedCode = await (0,_llm_service__WEBPACK_IMPORTED_MODULE_0__.callLLM)(messages, undefined, signal);
  fixedCode = fixedCode.replace(/^```(?:javascript|js|typescript|ts)?\n?/gi, "");
  fixedCode = fixedCode.replace(/\n?```$/gi, "");
  return fixedCode.trim();
}

// ═══════════════════════════════════════════════════════════════
// ORCHESTRATOR — Main agent loop
// ═══════════════════════════════════════════════════════════════

const DEFAULT_CONFIG = {
  maxRetries: 3,
  enablePlanning: true,
  strictValidation: true,
  timeout: 30000
};
async function runWordAgent(task, docContext, attachedFiles) {
  let config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  let signal = arguments.length > 4 ? arguments[4] : undefined;
  const cfg = {
    ...DEFAULT_CONFIG,
    ...config
  };
  const startTime = Date.now();

  // Detect if this is a template prompt that legitimately needs body.clear()
  const isTemplateTask = /\bbody\.clear\(\)/i.test(task) || /^First clear the document/i.test(task);
  let plan = null;
  let code = "";
  let validation = null;
  let retries = 0;
  try {
    // ═══ PHASE 1: PLANNING ═══
    if (cfg.enablePlanning) {
      try {
        // Include attached file content in planner context
        let plannerTask = task;
        if (attachedFiles.length > 0) {
          const fileTexts = attachedFiles.filter(f => f.extractedText).map(f => `[File: "${f.name}"]\n${f.extractedText}`);
          if (fileTexts.length > 0) {
            plannerTask += "\n\n[ATTACHED FILE DATA — Use this as source data for the task]\n" + fileTexts.join("\n\n");
          }
        }
        plan = await createWordPlan(plannerTask, docContext, signal);
        console.log("[WordAgent] Plan created:", plan);
      } catch (e) {
        if (e.name === 'AbortError') throw e;
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
      throw new Error(`Code validation failed: ${validation.errors.map(e => e.message).join("; ")}`);
    }
    code = validation.sanitizedCode;
    return {
      success: true,
      code,
      plan,
      validation,
      retries,
      duration: Date.now() - startTime
    };
  } catch (error) {
    return {
      success: false,
      code,
      plan,
      validation,
      error: error.message,
      retries,
      duration: Date.now() - startTime
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// EXECUTE WITH RECOVERY
// ═══════════════════════════════════════════════════════════════

async function executeWordWithRecovery(code, executor) {
  let maxRetries = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  let signal = arguments.length > 3 ? arguments[3] : undefined;
  let currentCode = code;
  let lastError = "";
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (signal !== null && signal !== void 0 && signal.aborted) {
      throw new DOMException("Execution cancelled", "AbortError");
    }
    try {
      await executor(currentCode);
      return {
        success: true,
        finalCode: currentCode
      };
    } catch (error) {
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
  return {
    success: false,
    error: lastError,
    finalCode: currentCode
  };
}

// ═══════════════════════════════════════════════════════════════
// UTILITY: Read current document context
// ═══════════════════════════════════════════════════════════════

async function readDocumentContext() {
  try {
    // @ts-ignore - Word is global in Office Add-ins
    return await Word.run(async context => {
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
      const wordCount = allText.split(/\s+/).filter(w => w.length > 0).length;

      // Extract headings and detect content types
      const headings = [];
      const contentTypes = new Set();
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
        selectedText: selection.text ? selection.text.trim() : ""
      };
    });
  } catch (e) {
    console.error("Failed to read document context:", e);
    return null;
  }
}

/***/ }),

/***/ "./src/word-taskpane/taskpane.ts":
/*!***************************************!*\
  !*** ./src/word-taskpane/taskpane.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_reduce_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.reduce.js */ "./node_modules/core-js/modules/es.array.reduce.js");
/* harmony import */ var core_js_modules_es_array_reduce_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_reduce_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.typed-array.fill.js */ "./node_modules/core-js/modules/es.typed-array.fill.js");
/* harmony import */ var core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.typed-array.set.js */ "./node_modules/core-js/modules/es.typed-array.set.js");
/* harmony import */ var core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.typed-array.sort.js */ "./node_modules/core-js/modules/es.typed-array.sort.js");
/* harmony import */ var core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _taskpane_taskpane_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../taskpane/taskpane.css */ "./src/taskpane/taskpane.css");
/* harmony import */ var _services_llm_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/llm.service */ "./src/services/llm.service.ts");
/* harmony import */ var _services_word_chat_prompt__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/word-chat-prompt */ "./src/services/word-chat-prompt.ts");
/* harmony import */ var _services_cache__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/cache */ "./src/services/cache.ts");
/* harmony import */ var _services_word_orchestrator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../services/word-orchestrator */ "./src/services/word-orchestrator.ts");
/* harmony import */ var _services_icons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../services/icons */ "./src/services/icons.ts");




/* global console, Word, document, window, Office */







// PDF.js is lazy-loaded on first PDF file attachment to avoid blocking initial load
let _pdfjsLib = null;
let _extractTextFromPDFFile = null;
async function getPdfJs() {
  if (!_pdfjsLib) {
    _pdfjsLib = await __webpack_require__.e(/*! import() */ "vendor").then(__webpack_require__.t.bind(__webpack_require__, /*! pdfjs-dist */ "./node_modules/pdfjs-dist/build/pdf.js", 23));
    _pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${_pdfjsLib.version}/pdf.worker.min.js`;
  }
  return _pdfjsLib;
}
async function getPdfExtractor() {
  if (!_extractTextFromPDFFile) {
    const mod = await __webpack_require__.e(/*! import() */ "vendor").then(__webpack_require__.bind(__webpack_require__, /*! ../services/pdfService */ "./src/services/pdfService.ts"));
    _extractTextFromPDFFile = mod.extractTextFromPDFFile;
  }
  return _extractTextFromPDFFile;
}

// ─── Types ─────────────────────────────────────────────────────

// ─── State ─────────────────────────────────────────────────────
let currentMode = "planning";
let currentCategory = "resume";
const chatHistory = [];
let chatConversation = [];
let isChatBusy = false;
let attachedFiles = [];
let chatAbortController = null;
let agentAbortController = null;

// ─── Quick Actions by Category ─────────────────────────────────
const WORD_ACTIONS = {
  // ── Resume & CV Tools ──
  resume: [{
    icon: "fileText",
    label: "Make ATS Friendly 🎯",
    prompt: "DO NOT use body.clear(). Read paragraphs with .load('items/text,items/font,items/style'). Sync. Modify in-place for a COMPACT 1-2 page resume. Rules: 1) Very first paragraph (Name) must be font.size=18, font.bold=true (DO NOT shrink the name!). 2) Other body text: font.name='Arial' or 'Calibri', font.size=10.5, lineSpacing=12 (single), spaceAfter=2, spaceBefore=0. 3) Section Headings (like WORK EXPERIENCE): Set font.size=12, font.bold=true, font.color='#000000', spaceBefore=12, spaceAfter=4. DO NOT use 'Heading 1' style as it adds massive blank gaps. Delete any extra empty paragraphs to save space. Keep all content."
  }, {
    icon: "zap",
    label: "Optimize Keywords",
    prompt: "DO NOT use body.clear(). Read the document paragraphs. Identify the job role from the content. At the END of the document, insert a bolded paragraph 'Suggested Keywords', followed by a compact bullet list of recommended ATS keywords. Use font.size=10.5, lineSpacing=12. Do not modify existing content."
  }, {
    icon: "paintbrush",
    label: "Professional Format",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Make it a TIGHT, professional document. The very first paragraph (title/name) must stay large (font.size=18+). Body text: font.size=11, font.name='Calibri', lineSpacing=12 (single), spaceAfter=2. Section headings: font.size=12, font.bold=true, spaceBefore=10, spaceAfter=4. DO NOT use 'Heading 1' style to avoid massive spacing gaps. Delete empty lines. Sync."
  }, {
    icon: "sortAsc",
    label: "Add Section Headers",
    prompt: "DO NOT use body.clear(). Identify paragraphs that look like resume sections ('Work Experience', 'Education', 'Skills'). Set their font.bold=true, font.size=12, text.toUpperCase(), spaceBefore=12, spaceAfter=4. DO NOT use 'Heading 1' style to prevent huge gaps. Keep existing text."
  }, {
    icon: "checkSquare",
    label: "Resume Checklist ✅",
    prompt: "DO NOT use body.clear(). Read paragraphs. At the END, insert standard paragraphs (not Heading style) analyzing: Contact info ✅/❌, Summary ✅/❌, Experience ✅/❌, Education ✅/❌, Skills ✅/❌, Action verbs ✅/❌, Compact format ✅/❌. Use font.size=10.5, lineSpacing=12."
  }, {
    icon: "trendUp",
    label: "Add Action Verbs",
    prompt: "DO NOT use body.clear(). Read all paragraphs. For bullet-point paragraphs in work experience sections, use search and replace to ensure each starts with a strong action verb. Use body.search() to find weak starts and replace with stronger alternatives via insertText with Word.InsertLocation.replace."
  }, {
    icon: "users",
    label: "Add Summary",
    prompt: "DO NOT use body.clear(). Read the document to understand the background. Insert a 'Professional Summary' heading and 3-4 sentence summary paragraph at the START of the document (using Word.InsertLocation.start). Set the heading font to bold, size 12. Do NOT use 'Heading 1' style. Use industry-relevant keywords."
  }, {
    icon: "barChart",
    label: "Quantify Achievements",
    prompt: "DO NOT use body.clear(). Read all paragraphs. At the END of the document, insert a section titled 'Suggested Metrics' (bold, size 12). For each work experience bullet that lacks numbers, insert a paragraph suggesting how to add quantified achievements. Example: 'Line: Managed team → Suggestion: Managed team of [X] members, achieving [Y]% growth'."
  }, {
    icon: "scissors",
    label: "Trim to One Page",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Make everything ultra-compact: font.size=10 for body, lineSpacing=11 (tight single), spaceAfter=1, spaceBefore=0. Delete ALL empty paragraphs. Name: font.size=16 (slightly smaller). Section headings: font.size=11, spaceBefore=8, spaceAfter=2. This forces content into minimum space."
  }, {
    icon: "link",
    label: "Add LinkedIn/Portfolio",
    prompt: "DO NOT use body.clear(). Read the first few paragraphs (contact info area). After the name/contact paragraph, insert a new paragraph with 'LinkedIn: [your-linkedin-url] | Portfolio: [your-portfolio-url]' in font.size=10, font.color='#0563C1'. Set hyperlink on each URL placeholder."
  }],
  // ── Writing Tools ──
  writing: [{
    icon: "brain",
    label: "Improve Writing ✍️",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Use body.search() to find and replace weak phrases with stronger alternatives. For example, search for passive voice patterns and replace with active voice. Use insertText with Word.InsertLocation.replace for each match. Preserve all original meaning."
  }, {
    icon: "sortAsc",
    label: "Make Formal",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Use body.search() to find casual words/phrases and replace them with formal equivalents. Examples: 'got' → 'received', 'a lot' → 'significantly', 'things' → 'elements', 'stuff' → 'materials'. Use insertText with Word.InsertLocation.replace."
  }, {
    icon: "columns",
    label: "Make Concise",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Use body.search() to find and remove filler words: 'very', 'really', 'basically', 'actually', 'in order to' → 'to', 'due to the fact that' → 'because'. Use insertText with Word.InsertLocation.replace."
  }, {
    icon: "trendUp",
    label: "Expand Content",
    prompt: "DO NOT use body.clear(). Read the document. At the END, insert new paragraphs expanding on the key topics identified. Add supporting details, examples, and transitions as new paragraphs using body.insertParagraph with Word.InsertLocation.end."
  }, {
    icon: "search",
    label: "Proofread",
    prompt: "DO NOT use body.clear(). Read all paragraphs. At the END of the document, insert a 'Proofreading Report' section listing any spotted issues: potential spelling errors, grammar issues, inconsistent formatting. Use insertParagraph with Word.InsertLocation.end."
  }, {
    icon: "barChart",
    label: "Summarize",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Insert an 'Executive Summary' heading at the START (Word.InsertLocation.start) followed by 3-5 sentence summary paragraphs. Set heading font to bold, size 14. Do not modify existing content."
  }, {
    icon: "copy",
    label: "Add Bullet Points",
    prompt: "DO NOT use body.clear(). Read paragraphs. Identify long paragraphs (text.length > 200) that contain lists of items. After each such paragraph, insert bullet-point style paragraphs breaking down the key points. Use startNewList() for bullet formatting."
  }, {
    icon: "hash",
    label: "Add Headings",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Every 3-5 paragraphs where a topic change is detected, insert a new paragraph BEFORE the topic change with style='Heading 2'. Use descriptive heading text based on the content that follows."
  }, {
    icon: "highlight",
    label: "Highlight Key Points",
    prompt: "DO NOT use body.clear(). Read all paragraphs. For each paragraph, identify the most important sentence or phrase. Use body.search() to find those key phrases and set their font.bold=true and font.highlightColor='Yellow'. Sync after changes."
  }, {
    icon: "type",
    label: "Fix Capitalization",
    prompt: "DO NOT use body.clear(). Read all paragraphs. For each paragraph, check if the first letter of the first word is capitalized. If not, use body.search() and insertText with Word.InsertLocation.replace to fix it. Also check for common capitalization issues: proper nouns, sentence beginnings after periods."
  }],
  // ── Format Tools ──
  format: [{
    icon: "paintbrush",
    label: "Professional Style",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Apply a compact, professional look. First paragraph (title) keeps font.size=16+. Headings: font.size=12, font.bold=true, spaceBefore=10, spaceAfter=4 (DO NOT use 'Heading 1' style). Body: font.size=11, font.name='Calibri', lineSpacing=12, spaceAfter=4. Delete purely empty paragraphs. Sync."
  }, {
    icon: "paintbrush",
    label: "Academic Style",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Body: font.name='Times New Roman', font.size=12, lineSpacing=24 (double-spaced), firstLineIndent=36. Headings: font.bold=true, firstLineIndent=0, alignment=Word.Alignment.centered. Remove empty gap paragraphs. Sync."
  }, {
    icon: "paintbrush",
    label: "Modern Clean",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Body: font.name='Arial', font.size=10.5, lineSpacing=13, spaceAfter=4. Headings: font.size=12, font.bold=true, font.color='#2563EB', spaceBefore=12, spaceAfter=4. Title/Name: font.size=18, font.bold=true. Sync."
  }, {
    icon: "paintbrush",
    label: "Business Letter",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Set all to font.name='Calibri', font.size=11, lineSpacing=15. Set spaceAfter=12 for paragraphs to add spacing between them. Ensure first paragraph is right-aligned (for sender info) using alignment=Word.Alignment.right."
  }, {
    icon: "formula",
    label: "Consistent Fonts",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Force EVERYTHING to font.name='Calibri', font.color='#000000'. First line font.size=18. Headings font.size=12. Body font.size=10.5. Fix spacing to lineSpacing=12, spaceAfter=2. Sync."
  }, {
    icon: "table",
    label: "Format Tables",
    prompt: "DO NOT use body.clear(). Load body.tables with tables.load('items'). Sync. For each table: set table.styleBuiltIn = Word.BuiltInStyleName.gridTable5Dark_Accent1, then table.autoFitWindow(). Sync."
  }, {
    icon: "snowflake",
    label: "Add Header/Footer",
    prompt: "DO NOT use body.clear(). Load context.document.sections, sections.load('items'), await context.sync(). Get header via sections.items[0].getHeader(Word.HeaderFooterType.primary). Insert a paragraph 'Document' with font.size=9, font.color='#888888', alignment=Word.Alignment.right. Get footer via sections.items[0].getFooter(Word.HeaderFooterType.primary). Insert 'Page' paragraph centered, font.size=9. Sync."
  }, {
    icon: "hash",
    label: "Number Headings",
    prompt: "DO NOT use body.clear(). Load all paragraphs with styles. Sync. For each paragraph whose style includes 'Heading 1': prepend number using search and replace with a counter '1. ', '2. ', etc. For 'Heading 2' paragraphs: use '1.1', '1.2' etc."
  }, {
    icon: "alignCenter",
    label: "Center Everything",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Set every paragraph alignment = Word.Alignment.centered. Sync."
  }, {
    icon: "indent",
    label: "Block Indent",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. For all paragraphs that are not headings: set leftIndent=36 (0.5 inch). Keep headings at leftIndent=0. Sync."
  }],
  // ── Insert Tools ──
  insert: [{
    icon: "divider",
    label: "Page Break",
    prompt: "Insert a page break at the end of the document using body.insertBreak(Word.BreakType.page, Word.InsertLocation.end). Then await context.sync()."
  }, {
    icon: "table",
    label: "Blank Table 📊",
    prompt: "Insert a blank 4x3 table at the end of the document. Use body.insertTable(4, 3, Word.InsertLocation.end, [['Column 1','Column 2','Column 3'],['','',''],['','',''],['','',' ']]). Set table style: table.styleBuiltIn = Word.BuiltInStyleName.gridTable4_Accent1. Then table.autoFitWindow(). Sync."
  }, {
    icon: "minus",
    label: "Horizontal Line",
    prompt: "Insert a horizontal rule at the end of the document. Use body.insertHtml('<hr style=\"border:none;border-top:2px solid #cccccc;margin:12px 0;\">', Word.InsertLocation.end). Sync."
  }, {
    icon: "calendar",
    label: "Date & Time",
    prompt: "Insert today's date in a formatted paragraph at the end. Calculate the date: const now = new Date(); const dateStr = now.toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'}); Insert with body.insertParagraph(dateStr, Word.InsertLocation.end). Set font.size=11, alignment right. Sync."
  }, {
    icon: "hash",
    label: "Page Numbers",
    prompt: "DO NOT use body.clear(). Load sections. Get footer via sections.items[0].getFooter(Word.HeaderFooterType.primary). Insert 'Page ' paragraph with font.size=9, alignment=Word.Alignment.centered, font.color='#666666'. Sync."
  }, {
    icon: "footprint",
    label: "Footnote",
    prompt: "Get the current selection with context.document.getSelection(). Insert a footnote: selection.insertFootnote('Enter footnote text here.'). Sync."
  }, {
    icon: "list",
    label: "Bullet List",
    prompt: "Insert a new bulleted list at the end with 5 items: const b1 = body.insertParagraph('First item', Word.InsertLocation.end); b1.startNewList(); body.insertParagraph('Second item', Word.InsertLocation.end); body.insertParagraph('Third item', Word.InsertLocation.end); body.insertParagraph('Fourth item', Word.InsertLocation.end); body.insertParagraph('Fifth item', Word.InsertLocation.end); Sync."
  }, {
    icon: "hash",
    label: "Numbered List",
    prompt: "Insert a new numbered list at the end using HTML: body.insertHtml('<ol><li>First item</li><li>Second item</li><li>Third item</li><li>Fourth item</li><li>Fifth item</li></ol>', Word.InsertLocation.end). Sync."
  }, {
    icon: "bookmark",
    label: "Table of Contents",
    prompt: "DO NOT use body.clear(). Read all paragraphs and their styles. Identify paragraphs with 'Heading' in their style name. At the START, insert 'Table of Contents' with style='Heading 1', then for each heading found, insert a paragraph with the heading text prefixed by its level number. Use Word.InsertLocation.start in reverse order. Sync."
  }, {
    icon: "checkSquare",
    label: "Checkbox List ☑️",
    prompt: "Insert a checkbox-style list at the end using HTML. Use body.insertHtml('<p>☐ Task item 1</p><p>☐ Task item 2</p><p>☐ Task item 3</p><p>☐ Task item 4</p><p>☐ Task item 5</p>', Word.InsertLocation.end). Sync."
  }],
  // ── Layout Tools ──
  layout: [{
    icon: "minimize",
    label: "Narrow Margins",
    prompt: "Load context.document.sections and sections.load('items'). Sync. Set narrow margins on all sections: for each section, load pageSetup and try to apply smaller margins. Insert a small note paragraph at the end: 'Margins adjusted to narrow.' Sync. Note: If pageSetup is read-only in your API version, insert the note explaining to manually set margins to 0.5 inch all around."
  }, {
    icon: "maximize",
    label: "Wide Margins",
    prompt: "DO NOT use body.clear(). Insert a small note paragraph at the end explaining: 'For wide margins, go to Layout → Margins → Wide (1.27\" top/bottom, 2\" left/right). API margin control may be limited in your Word version.' Set font.size=10, font.italic=true, font.color='#666666'."
  }, {
    icon: "rotateCw",
    label: "Landscape Note",
    prompt: "DO NOT use body.clear(). Insert a note paragraph at the end: 'To switch to Landscape orientation, go to Layout → Orientation → Landscape. For section-specific orientation changes, insert a Section Break first.' Set font.italic=true, font.color='#666666'. Sync."
  }, {
    icon: "alignLeft",
    label: "Single Spacing",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Set every paragraph: lineSpacing=12 (single spacing), spaceAfter=0, spaceBefore=0. Sync."
  }, {
    icon: "alignCenter",
    label: "1.5 Spacing",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Set every paragraph: lineSpacing=18 (1.5 spacing), spaceAfter=6, spaceBefore=0. Sync."
  }, {
    icon: "columns",
    label: "Double Spacing",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Set every paragraph: lineSpacing=24 (double spacing), spaceAfter=0, spaceBefore=0. Sync."
  }, {
    icon: "divider",
    label: "Section Break",
    prompt: "Insert a section break (next page) at the end using body.insertBreak(Word.BreakType.sectionNext, Word.InsertLocation.end). Sync."
  }, {
    icon: "indent",
    label: "First Line Indent",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. For all paragraphs that are Normal style (not headings): set firstLineIndent=36 (0.5 inch). Sync."
  }],
  // ── Cleanup Tools ──
  cleanup: [{
    icon: "eraser",
    label: "Smart Clean 🧹",
    prompt: "DO NOT use body.clear(). Load all paragraphs. For each paragraph: if text.trim() is empty and the next paragraph is also empty, delete the empty one with paragraph.delete(). For non-empty paragraphs: set font.name='Calibri', font.size=11, lineSpacing=15, spaceAfter=6. Use body.search('  ') to find double spaces and replace with single space via insertText(Word.InsertLocation.replace). Then await context.sync()."
  }, {
    icon: "eraser",
    label: "Remove Formatting",
    prompt: "DO NOT use body.clear(). Load all paragraphs. For each: set style='Normal', font.name='Calibri', font.size=11, font.bold=false, font.italic=false, font.underline='None', font.color='#000000', lineSpacing=15, spaceAfter=6. Then await context.sync()."
  }, {
    icon: "eraser",
    label: "Fix Spacing",
    prompt: "DO NOT use body.clear(). Load all paragraphs. For empty paragraphs that are consecutive, delete the extras (keep max 1 between sections). For all paragraphs: set lineSpacing=15, spaceAfter=6, spaceBefore=0. Then await context.sync()."
  }, {
    icon: "search",
    label: "Find & Replace",
    prompt: "DO NOT use body.clear(). Use body.search() to find and replace: double spaces → single space, triple dots '...' → ellipsis '…'. For each search, load items, sync, then loop and use insertText with Word.InsertLocation.replace."
  }, {
    icon: "eraser",
    label: "Remove Empty Lines",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Loop through BACKWARDS and identify paragraphs where text.trim() === ''. Delete consecutive empty paragraphs but keep at most one between content sections using paragraph.delete(). Sync."
  }, {
    icon: "eraser",
    label: "Fix Bullets",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Identify paragraphs that start with '- ', '* ', '• '. Standardize them: use search to find the bullet character and replace with '• '. Ensure consistent font and spacing on all bullet paragraphs."
  }, {
    icon: "paintbrush",
    label: "Normalize Fonts",
    prompt: "DO NOT use body.clear(). Load all paragraphs with font info. Sync. Force every paragraph to the same font family: font.name='Calibri'. Keep existing bold/italic/size but make the font family consistent. Sync."
  }, {
    icon: "scissors",
    label: "Remove Hyperlinks",
    prompt: "DO NOT use body.clear(). Load all paragraphs. For each paragraph, search for text that contains URLs. When found, set the range's hyperlink to an empty string or remove it. This keeps the text but removes the clickable link. Sync."
  }],
  // ── Templates (these are the ONLY prompts that may clear the document) ──
  templates: [{
    icon: "fileTemplate",
    label: "Modern Resume",
    prompt: "First clear the document with body.clear(), await context.sync(). Then create a resume template: Insert '[Your Name]' paragraph with font.size=18, font.bold=true, alignment=Word.Alignment.centered. Insert '[email] | [phone] | [city, state]' centered. Then insert section headings using font.bold=true, font.size=12: 'PROFESSIONAL SUMMARY', 'WORK EXPERIENCE', 'EDUCATION', 'SKILLS'. Under each heading, insert placeholder paragraphs with font.name='Calibri', font.size=11. Finish with await context.sync()."
  }, {
    icon: "fileTemplate",
    label: "Cover Letter",
    prompt: "First clear the document with body.clear(), await context.sync(). Then create a cover letter: Insert today's date (calculate with new Date()), blank line, '[Hiring Manager Name]', '[Company Name]', '[Address]'. Then 'Dear [Hiring Manager]:'. Three body paragraphs with placeholder text about qualifications. 'Sincerely,' and '[Your Name]'. All in Calibri 11pt with lineSpacing=15. Finish with await context.sync()."
  }, {
    icon: "fileTemplate",
    label: "Business Letter",
    prompt: "First clear the document with body.clear(), await context.sync(). Then create: Sender info (right-aligned), date, recipient info (left-aligned), subject line bold, salutation 'Dear Sir/Madam:', body (3 paragraphs), closing 'Yours faithfully,'. All Calibri 11pt. Finish with await context.sync()."
  }, {
    icon: "fileTemplate",
    label: "Meeting Notes",
    prompt: "First clear the document with body.clear(), await context.sync(). Then create: 'Meeting Notes' in bold font.size=16, centered. Date/Time line. 'Attendees' heading (bold, size 12) with bullet list. 'Agenda' heading with numbered items. 'Discussion' heading with placeholder paragraphs. 'Action Items' heading with a table (columns: Action, Owner, Due Date, Status). All in Calibri. Finish with await context.sync()."
  }, {
    icon: "fileTemplate",
    label: "Project Proposal",
    prompt: "First clear the document with body.clear(), await context.sync(). Then create sections with bold font.size=14 headings: Executive Summary, Problem Statement, Proposed Solution, Scope, Timeline (insert a table with Phase/Duration/Deliverable columns), Budget (insert a table with Item/Cost columns), Team, Conclusion. Add placeholder text under each. Calibri formatting. Finish with await context.sync()."
  }, {
    icon: "fileTemplate",
    label: "Report Template",
    prompt: "First clear the document with body.clear(), await context.sync(). Then create: Title page (large centered title font.size=24, subtitle font.size=14). Insert page break. Sections with style='Heading 1': Executive Summary, Introduction, Methodology, Findings, Analysis, Recommendations, Conclusion, References. Add placeholder text. Calibri, lineSpacing=24 (double-spaced). Finish with await context.sync()."
  }, {
    icon: "fileTemplate",
    label: "Invoice Template",
    prompt: "First clear the document with body.clear(), await context.sync(). Then create: 'INVOICE' title centered, font.size=24, font.bold=true. Company info line. Invoice # and date line right-aligned. Bill-To section. Then insert a table with columns: Description, Qty, Unit Price, Total. Add 3 sample rows. Below table: Subtotal, Tax, Total lines right-aligned. 'Thank you for your business!' at bottom. Sync."
  }, {
    icon: "fileTemplate",
    label: "SOP Document",
    prompt: "First clear the document with body.clear(), await context.sync(). Then create a Standard Operating Procedure: 'Standard Operating Procedure' title centered, bold, size 16. Doc info table (SOP Number, Version, Date, Author). Then sections: 1. Purpose, 2. Scope, 3. Responsibilities, 4. Procedure (with numbered sub-steps), 5. Safety, 6. References, 7. Revision History (table). All Calibri 11pt. Sync."
  }],
  // ── Smart Tools ──
  smart: [{
    icon: "brain",
    label: "Document Analyzer 🔬",
    prompt: "DO NOT use body.clear(). Read all paragraphs with body.paragraphs.load('items/text,items/style'). Sync. Calculate word count, paragraph count, estimated reading time (250 WPM), avg words per paragraph, sentence count (approx by counting periods). At the END, insert a styled 'Document Analysis Report' section with these stats as a formatted table using body.insertTable. Use Word.InsertLocation.end."
  }, {
    icon: "zap",
    label: "Make Links Clickable 🔗",
    prompt: "DO NOT use body.clear(). DO NOT use getSelection(). DO NOT insert or append any URL text. DO NOT use body.search('http') because that only matches the 4-char substring, NOT the full URL. Instead: 1) Load paragraphs: const paras = body.paragraphs; paras.load('items/text'); await context.sync(); 2) Extract full URLs with JS regex: const urlRegex = /https?:\\/\\/[^\\s,)>\\]]+/g; const foundUrls = []; for (let i = 0; i < paras.items.length; i++) { const txt = paras.items[i].text || ''; let m; while ((m = urlRegex.exec(txt)) !== null) foundUrls.push(m[0]); } 3) For each URL, search and hyperlink: for (let j = 0; j < foundUrls.length; j++) { const sr = body.search(foundUrls[j], {matchCase:false, matchWholeWord:false}); sr.load('items'); await context.sync(); for (let k = 0; k < sr.items.length; k++) sr.items[k].hyperlink = foundUrls[j]; await context.sync(); } NEVER use insertText, insertParagraph, or insertHtml to write URL text."
  }, {
    icon: "trendUp",
    label: "Readability Score",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Count total words, total sentences (periods+exclamation+question marks), and total syllables (approximate: count vowel groups in each word). Calculate Flesch-Kincaid grade level and reading ease. At the END, insert a 'Readability Report' section with the scores and interpretation. Use insertParagraph with Word.InsertLocation.end."
  }, {
    icon: "search",
    label: "Extract Key Points",
    prompt: "DO NOT use body.clear(). Read all paragraphs. At the START of the document, insert 'Key Takeaways' heading (bold, font.size=14) followed by numbered key points extracted from the content. Use insertParagraph with Word.InsertLocation.start. Insert in reverse order so they appear correctly."
  }, {
    icon: "copy",
    label: "Compare Sections",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Identify sections by headings. At the END, insert a comparison table using body.insertTable() showing: Section Name, Word Count, Paragraph Count, Avg Sentence Length. Style the table. Use Word.InsertLocation.end."
  }, {
    icon: "shield",
    label: "Consistency Check",
    prompt: "DO NOT use body.clear(). Read all paragraphs with font info loaded. At the END, insert a 'Consistency Report' section listing any found issues: mixed fonts (list all unique font names found), inconsistent sizes, paragraphs with different spacing values, headings without consistent styling. Use insertParagraph with Word.InsertLocation.end."
  }, {
    icon: "mail",
    label: "Extract Contacts",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Search body text for email addresses (pattern with @), phone numbers (digits with dashes/spaces), and URLs (http/www). At the END, insert a 'Contact Information' table using body.insertTable() with columns: Type, Value. Use Word.InsertLocation.end."
  }, {
    icon: "layers",
    label: "Create TOC",
    prompt: "DO NOT use body.clear(). Read all paragraphs and identify those with 'Heading' in their style. At the START of the document, insert 'Table of Contents' (bold, font.size=14) followed by a paragraph listing each heading found with indentation based on heading level. Use Word.InsertLocation.start, inserting in reverse order."
  }, {
    icon: "dollarSign",
    label: "Word Count Stats",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Count total words, total characters (with and without spaces), unique words (approximate), paragraphs, sentences. At the END, insert a stats table using body.insertTable() with these metrics. Style with gridTable4_Accent1. Use Word.InsertLocation.end."
  }, {
    icon: "globe",
    label: "Translate Structure",
    prompt: "DO NOT use body.clear(). Read all paragraphs. At the END, insert a 'Document Structure Map' section. For each paragraph, insert a line showing: [Paragraph #] [Style: X] [Words: Y] [First 40 chars...]. This gives the user a complete structural overview. Use insertParagraph with Word.InsertLocation.end."
  }]
};

// Chat Suggestions
const WORD_CHAT_SUGGESTIONS = [{
  icon: "fileText",
  text: "Make my resume ATS-friendly"
}, {
  icon: "brain",
  text: "Improve the writing in my document"
}, {
  icon: "paintbrush",
  text: "Format my document professionally"
}, {
  icon: "search",
  text: "Proofread and fix errors in my doc"
}, {
  icon: "sparkles",
  text: "What can you do? Show me your features"
}, {
  icon: "trendUp",
  text: "Analyze my document and suggest improvements"
}];

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
Office.onReady(info => {
  const sideloadMsg = document.getElementById("sideload-msg");
  const appBody = document.getElementById("app-body");

  // Show app immediately — don't block on anything
  if (sideloadMsg) sideloadMsg.style.display = "none";
  if (appBody) appBody.style.display = "flex";
  if (info.host === Office.HostType.Word) {
    console.log("Running in Word");
  } else {
    console.warn("Running outside Word — host:", info.host);
  }

  // ── CRITICAL PATH: Wire up interactive elements first ──
  // These are needed immediately for user interaction
  document.getElementById("run").onclick = () => {
    const input = document.getElementById("prompt-input");
    if (input && (input.value.trim() || attachedFiles.length > 0)) {
      runWordAICommand();
    }
  };
  document.getElementById("mode-planning").onclick = () => switchMode("planning");
  document.getElementById("mode-agent").onclick = () => switchMode("agent");
  document.getElementById("chat-send").onclick = sendChatMessage;
  const clearBtn = document.getElementById("chat-clear");
  if (clearBtn) clearBtn.onclick = clearChat;
  setupChatInput();
  setupAgentKeyboardShortcut();

  // ── FAST PATH: Inject essential icons (header only) ──
  injectIcons();

  // ── DEFERRED: Non-critical UI work after first paint ──
  requestAnimationFrame(() => {
    // Settings & Docs toggles
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

    // File Upload Handlers
    const bindClick = (id, handler) => {
      const el = document.getElementById(id);
      if (el) el.onclick = handler;
    };
    const bindChange = (id, handler) => {
      const el = document.getElementById(id);
      if (el) el.onchange = handler;
    };
    bindClick("file-upload-btn", () => document.getElementById("file-input").click());
    bindChange("file-input", e => handleFileSelect(e, false));
    bindClick("agent-file-btn", () => document.getElementById("agent-file-input").click());
    bindChange("agent-file-input", e => handleFileSelect(e, true));

    // Category Tabs
    document.querySelectorAll(".category-tab").forEach(tab => {
      tab.onclick = () => {
        const cat = tab.dataset.category;
        switchCategory(cat);
      };
    });
    setupScrollToBottom();
    setupDiffDismiss();

    // Build UI content and inject remaining icons
    injectDocIcons();
    injectCategoryIcons();
    buildQuickActions();
    buildChatSuggestions();
    loadSettingsUI();
  });
});

// ─── Icon Injection ────────────────────────────────────────────
function injectIcons() {
  const el = (id, html) => {
    const node = document.getElementById(id);
    if (node) node.innerHTML = html;
  };
  el("settings-toggle", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.settings);
  el("docs-toggle", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.helpCircle);
  el("run-icon", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.arrowRight);
  el("chevron-icon", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.chevronDown);
  el("refresh-models", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.refresh);
  el("mode-planning-icon", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.messageCircle);
  el("mode-agent-icon", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.zap);
  el("chat-send-icon", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.send);
  el("chat-clear-icon", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.trash);
}
function injectDocIcons() {
  document.querySelectorAll(".doc-icon[data-icon]").forEach(el => {
    const key = el.getAttribute("data-icon");
    if (_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons[key]) el.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons[key];
  });
}
function injectCategoryIcons() {
  document.querySelectorAll(".cat-icon[data-icon]").forEach(el => {
    const key = el.getAttribute("data-icon");
    if (_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons[key]) el.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons[key];
  });
}

// ─── Mode Switching ────────────────────────────────────────────
function switchMode(mode) {
  if (mode === currentMode) return;
  currentMode = mode;
  document.querySelectorAll(".mode-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.mode === mode);
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
    setTimeout(() => document.getElementById("chat-input").focus(), 200);
  } else {
    setTimeout(() => document.getElementById("prompt-input").focus(), 200);
  }
}

// ─── Category Switching ────────────────────────────────────────
function switchCategory(category) {
  currentCategory = category;
  document.querySelectorAll(".category-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.category === category);
  });
  buildQuickActions();
}

// ─── Quick Actions ────────────────────────────────────────────
function buildQuickActions() {
  const container = document.getElementById("quick-actions");
  if (!container) return;
  container.innerHTML = "";
  const actions = WORD_ACTIONS[currentCategory];
  if (!actions) return;
  actions.forEach(action => {
    const chip = document.createElement("button");
    chip.className = "chip";
    const iconKey = action.icon;
    chip.innerHTML = `${_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons[iconKey] || ""}<span>${action.label}</span>`;
    chip.onclick = () => {
      const input = document.getElementById("prompt-input");
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
function buildChatSuggestions() {
  const container = document.getElementById("chat-suggestions");
  if (!container) return;
  WORD_CHAT_SUGGESTIONS.forEach(s => {
    const btn = document.createElement("button");
    btn.className = "suggestion-chip";
    const iconKey = s.icon;
    btn.innerHTML = `${_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons[iconKey] || ""}${s.text}`;
    btn.onclick = () => {
      const input = document.getElementById("chat-input");
      if (input) {
        input.value = s.text;
        sendChatMessage();
      }
    };
    container.appendChild(btn);
  });
}

// ─── Settings ──────────────────────────────────────────────────
function loadSettingsUI() {
  const config = (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_5__.getConfig)();
  const providerSelect = document.getElementById("setting-provider");
  if (providerSelect) {
    providerSelect.value = config.provider;
    providerSelect.onchange = e => {
      const p = e.target.value;
      updateProviderFields(p);
      if (p === "local") loadOllamaModels();
    };
  }
  const setVal = (id, val) => {
    const el = document.getElementById(id);
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
function updateProviderFields(p) {
  const setDisplay = (id, show) => {
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
async function loadOllamaModels() {
  var _document$getElementB;
  const select = document.getElementById("setting-local-model");
  const statusEl = document.getElementById("model-status");
  const host = ((_document$getElementB = document.getElementById("setting-base-url")) === null || _document$getElementB === void 0 || (_document$getElementB = _document$getElementB.value) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.trim()) || "http://localhost:11434";
  if (!select) return;
  select.innerHTML = `<option value="" disabled selected>Loading...</option>`;
  if (statusEl) {
    statusEl.textContent = "";
    statusEl.className = "model-status";
  }
  const models = await (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_5__.fetchOllamaModels)(host);
  if (models.length === 0) {
    select.innerHTML = `<option value="" disabled selected>No models found</option>`;
    if (statusEl) {
      statusEl.textContent = "Ollama not running or no models installed";
      statusEl.className = "model-status model-status-warn";
    }
    return;
  }
  const config = (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_5__.getConfig)();
  select.innerHTML = "";
  models.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.name;
    opt.textContent = `${m.name} (${(m.size / 1e9).toFixed(1)}GB)`;
    if ((config.localModel || config.model) === m.name) opt.selected = true;
    select.appendChild(opt);
  });
  if (statusEl) {
    statusEl.textContent = `${models.length} model${models.length > 1 ? "s" : ""} found`;
    statusEl.className = "model-status model-status-ok";
  }
}
function handleSaveSettings() {
  var _document$getElementB2;
  const provider = (_document$getElementB2 = document.getElementById("setting-provider")) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.value;
  const current = (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_5__.getConfig)();
  const getVal = id => {
    var _document$getElementB3;
    return ((_document$getElementB3 = document.getElementById(id)) === null || _document$getElementB3 === void 0 || (_document$getElementB3 = _document$getElementB3.value) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.trim()) || "";
  };
  const newConfig = {
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
  (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_5__.saveConfig)(newConfig);
  const btn = document.getElementById("save-settings");
  if (btn) {
    const originalText = btn.textContent;
    btn.textContent = "✓ Saved";
    btn.classList.add("saved");
    setTimeout(() => {
      btn.textContent = originalText || "Save";
      btn.classList.remove("saved");
    }, 1500);
  }
  showToast("success", "Settings saved successfully");
  setTimeout(() => {
    const panel = document.getElementById("settings-panel");
    if (panel) panel.style.display = "none";
  }, 800);
}

// ═══════════════════════════════════════════════════════════════
// PLANNING MODE — Chat Functions
// ═══════════════════════════════════════════════════════════════

function setupChatInput() {
  const input = document.getElementById("chat-input");
  if (!input) return;
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 80) + "px";
  });
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
}
async function sendChatMessage() {
  if (isChatBusy) {
    if (chatAbortController) chatAbortController.abort();
    return;
  }
  const input = document.getElementById("chat-input");
  if (!input) return;
  const message = input.value.trim();
  if (!message) return;
  const welcome = document.querySelector(".chat-welcome");
  if (welcome) welcome.remove();
  addChatBubble("user", message);
  chatHistory.push({
    role: "user",
    content: message,
    timestamp: Date.now()
  });

  // Build conversation context
  if (chatConversation.length === 0) {
    let initialPrompt = _services_word_chat_prompt__WEBPACK_IMPORTED_MODULE_6__.WORD_CHAT_PROMPT;
    try {
      const docCtx = await (0,_services_word_orchestrator__WEBPACK_IMPORTED_MODULE_8__.readDocumentContext)();
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
    chatConversation.push({
      role: "system",
      content: initialPrompt
    });
  }

  // Context awareness for document queries
  const needsDocContext = /\b(this|my|current|opened?)\s+(doc|document|resume|letter|word|file|text)\b|\b(find|search|check|improve|fix|format|analyze|review|proofread|summarize)\b/i.test(message);
  if (needsDocContext) {
    try {
      const docCtx = await (0,_services_word_orchestrator__WEBPACK_IMPORTED_MODULE_8__.readDocumentContext)();
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
  chatConversation.push({
    role: "user",
    content: message
  });

  // Include attached file content in the conversation
  if (attachedFiles.length > 0) {
    const fileTexts = [];
    for (const file of attachedFiles) {
      if (file.extractedText) {
        fileTexts.push(`[ATTACHED FILE: "${file.name}"]\n${file.extractedText}`);
      }
    }
    if (fileTexts.length > 0) {
      chatConversation.push({
        role: "system",
        content: `[UPLOADED FILE CONTENT]\nThe user has attached ${attachedFiles.length} file(s). Here is the extracted text content:\n\n${fileTexts.join("\n\n---\n\n")}\n\nUse this data to answer the user's request. If they ask you to create a resume, use the information from these files as the source material.`
      });
      const lastBubble = document.querySelector('.chat-msg.user:last-child .chat-bubble');
      if (lastBubble) {
        const badge = document.createElement('span');
        badge.className = 'context-badge';
        badge.innerHTML = `📎 ${attachedFiles.length} file(s) attached`;
        lastBubble.appendChild(badge);
      }
    }
    // Clear attached files after including them
    attachedFiles = [];
    updateFilePreview(false, false);
  }
  input.value = "";
  input.style.height = "auto";
  const skeletonEl = showTypingIndicator();
  isChatBusy = true;
  const chatSendButton = document.getElementById("chat-send");
  const chatSendIcon = document.getElementById("chat-send-icon");
  if (chatSendButton) {
    if (chatSendIcon) chatSendIcon.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.stop;
    chatSendButton.classList.add("is-busy");
  }
  chatAbortController = new AbortController();
  try {
    const response = await (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_5__.callLLM)(chatConversation, undefined, chatAbortController.signal);
    const formattedResponse = formatChatResponse(response);
    if (skeletonEl) {
      const newBubble = createChatBubble("ai", formattedResponse, response);
      skeletonEl.replaceWith(newBubble);
    }
    chatConversation.push({
      role: "assistant",
      content: response
    });
    chatHistory.push({
      role: "ai",
      content: response,
      timestamp: Date.now()
    });
  } catch (error) {
    if (skeletonEl) skeletonEl.remove();
    if (error.name === 'AbortError') {
      addChatBubble("ai", `<p style="color:var(--text-3)"><i>Generation stopped.</i></p>`);
    } else {
      var _error$message;
      addChatBubble("ai", `<p style="color:var(--error)">⚠️ ${error.message}</p>`);
      showToast("error", ((_error$message = error.message) === null || _error$message === void 0 ? void 0 : _error$message.substring(0, 80)) || "Something went wrong");
    }
  } finally {
    isChatBusy = false;
    chatAbortController = null;
    if (chatSendButton) {
      const sendIcon = document.getElementById("chat-send-icon");
      if (sendIcon) sendIcon.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.send;
      chatSendButton.classList.remove("is-busy");
    }
  }
}
function clearChat() {
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

function createChatBubble(role, htmlContent, rawContent) {
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
    copyBtn.innerHTML = `${_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.copy} Copy`;
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(rawContent).then(() => {
        copyBtn.innerHTML = `${_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.check} Copied`;
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.innerHTML = `${_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.copy} Copy`;
          copyBtn.classList.remove("copied");
        }, 2000);
      });
    };
    actionsDiv.appendChild(copyBtn);
    const execBtn = document.createElement("button");
    execBtn.className = "btn-execute-from-chat";
    execBtn.innerHTML = `${_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.zap} Switch to Agent`;
    execBtn.onclick = () => {
      const agentPromptInput = document.getElementById("prompt-input");
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
function addChatBubble(role, htmlContent, rawContent) {
  const container = document.getElementById("chat-messages");
  if (!container) throw new Error("Chat messages container not found.");
  const msgDiv = createChatBubble(role, htmlContent, rawContent);
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  return msgDiv;
}
function showTypingIndicator() {
  const template = document.getElementById("chat-skeleton-template");
  if (!template) return null;
  const container = document.getElementById("chat-messages");
  if (!container) return null;
  const skeleton = template.content.cloneNode(true);
  const skeletonDiv = skeleton.querySelector(".chat-msg");
  container.appendChild(skeleton);
  container.scrollTop = container.scrollHeight;
  return skeletonDiv || container.lastElementChild;
}
function formatChatResponse(text) {
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
function setupScrollToBottom() {
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

function setupAgentKeyboardShortcut() {
  const input = document.getElementById("prompt-input");
  const button = document.getElementById("run");
  if (!input) return;

  // Auto-resize textarea as user types
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 80) + "px";
    // Enable/disable Execute button based on input content
    updateExecuteButtonState();
  });

  // Enter to submit (Shift+Enter for newline)
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.value.trim() || attachedFiles.length > 0) {
        runWordAICommand();
      }
    }
  });

  // Initial button state
  updateExecuteButtonState();
}
function updateExecuteButtonState() {
  const input = document.getElementById("prompt-input");
  const button = document.getElementById("run");
  if (!input || !button) return;
  const hasContent = input.value.trim().length > 0 || attachedFiles.length > 0;
  // Don't disable if agent is running (it becomes a Stop button)
  if (button.classList.contains("is-busy")) return;
  button.disabled = !hasContent;
  button.style.opacity = hasContent ? "1" : "0.5";
  button.style.cursor = hasContent ? "pointer" : "not-allowed";
}

// ─── Diff dismiss handler ──────────────────────────────────────
function setupDiffDismiss() {
  const dismissBtn = document.getElementById("ai-diff-dismiss");
  if (dismissBtn) {
    dismissBtn.onclick = () => {
      const diffView = document.getElementById("ai-diff-view");
      if (diffView) diffView.classList.remove("active");
    };
  }
}

// ─── Hardcoded Actions — deterministic code for well-defined ops (bypasses LLM) ──

/**
 * Some operations are too critical or specific to trust LLM generation.
 * This map intercepts known prompts and runs battle-tested code directly.
 * Returns the number of items affected, or -1 if the prompt is not hardcoded.
 */
async function tryHardcodedAction(userPrompt) {
  const lower = userPrompt.toLowerCase();

  // Skip hardcoded actions when files are attached — user wants to CREATE content, not fix existing
  if (attachedFiles.length > 0) {
    return {
      handled: false
    };
  }

  // ── Make Links Clickable ──────────────────────────────────
  // Only match when the PRIMARY intent is about making links clickable,
  // not when "link" or "clickable" appear as part of a larger creation request
  const isLinkAction = (lower.includes("clickable") || lower.includes("hyperlink")) && !lower.includes("resume") && !lower.includes("create") && !lower.includes("build") && !lower.includes("make me") && !lower.includes("generate") && !lower.includes("write") || lower.includes("link") && (lower.includes("make") || lower.includes("all")) && !lower.includes("resume") && !lower.includes("create") && !lower.includes("build") && !lower.includes("make me") && !lower.includes("generate") && !lower.includes("write");
  if (isLinkAction) {
    let count = 0;
    // @ts-ignore
    await Word.run(async ctx => {
      // Check if user has selected text — if so, only operate on the selection
      const selection = ctx.document.getSelection();
      selection.load("text");
      await ctx.sync();
      const selectedText = (selection.text || "").trim();
      if (selectedText.length > 0) {
        // SELECTION MODE: Only make the selected text clickable
        console.log(`[HardcodedAction] Selection mode — selected: "${selectedText}"`);

        // Extract URLs from the selected text
        const urlRegex = /https?:\/\/[^\s,)>\]"']+/g;
        const wwwRegex = /(?<![\/\/])www\.[^\s,)>\]"']+/g;
        const foundUrls = [];
        let m;
        while ((m = urlRegex.exec(selectedText)) !== null) {
          let url = m[0].replace(/[.,;:!?)]+$/, "");
          if (!foundUrls.includes(url)) foundUrls.push(url);
        }
        while ((m = wwwRegex.exec(selectedText)) !== null) {
          let url = m[0].replace(/[.,;:!?)]+$/, "");
          if (!foundUrls.includes(url)) foundUrls.push(url);
        }
        if (foundUrls.length > 0) {
          // Search within the selection for each URL
          for (const url of foundUrls) {
            const fullUrl = url.startsWith("http") ? url : "https://" + url;
            const searchResults = selection.search(url, {
              matchCase: false,
              matchWholeWord: false
            });
            searchResults.load("items");
            await ctx.sync();
            for (let k = 0; k < searchResults.items.length; k++) {
              searchResults.items[k].hyperlink = fullUrl;
              searchResults.items[k].font.color = "#0563C1";
              searchResults.items[k].font.underline = "Single";
              count++;
            }
            await ctx.sync();
          }
        } else {
          // The entire selection IS the URL (e.g. user selected "www.linkedin.com/in/nishant")
          let linkUrl = selectedText;
          if (!linkUrl.startsWith("http")) linkUrl = "https://" + linkUrl;
          selection.hyperlink = linkUrl;
          selection.font.color = "#0563C1";
          selection.font.underline = "Single";
          await ctx.sync();
          count = 1;
        }
      } else {
        // NO SELECTION: Scan entire document
        const body = ctx.document.body;
        const paras = body.paragraphs;
        paras.load("items/text");
        await ctx.sync();
        const urlRegex = /https?:\/\/[^\s,)>\]"']+/g;
        const foundUrls = [];
        for (let i = 0; i < paras.items.length; i++) {
          const txt = paras.items[i].text || "";
          let m;
          while ((m = urlRegex.exec(txt)) !== null) {
            let url = m[0].replace(/[.,;:!?)]+$/, "");
            if (!foundUrls.includes(url)) foundUrls.push(url);
          }
        }
        for (let j = 0; j < foundUrls.length; j++) {
          const url = foundUrls[j];
          const searchResults = body.search(url, {
            matchCase: false,
            matchWholeWord: false
          });
          searchResults.load("items");
          await ctx.sync();
          for (let k = 0; k < searchResults.items.length; k++) {
            searchResults.items[k].hyperlink = url;
            searchResults.items[k].font.color = "#0563C1";
            searchResults.items[k].font.underline = "Single";
            count++;
          }
          await ctx.sync();
        }
        const wwwRegex = /(?<![\/\/])www\.[^\s,)>\]"']+/g;
        for (let i = 0; i < paras.items.length; i++) {
          const txt = paras.items[i].text || "";
          let m;
          while ((m = wwwRegex.exec(txt)) !== null) {
            let url = m[0].replace(/[.,;:!?)]+$/, "");
            const fullUrl = "https://" + url;
            const searchResults = body.search(url, {
              matchCase: false,
              matchWholeWord: false
            });
            searchResults.load("items");
            await ctx.sync();
            for (let k = 0; k < searchResults.items.length; k++) {
              searchResults.items[k].hyperlink = fullUrl;
              searchResults.items[k].font.color = "#0563C1";
              searchResults.items[k].font.underline = "Single";
              count++;
            }
            await ctx.sync();
          }
        }
      }
    });
    if (count === 0) {
      return {
        handled: true,
        message: "⚠️ No URLs found. Make sure the text contains links starting with http://, https://, or www."
      };
    }
    return {
      handled: true,
      message: `✅ Made ${count} link${count !== 1 ? "s" : ""} clickable!`
    };
  }

  // Not a hardcoded action — fall through to LLM
  return {
    handled: false
  };
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXECUTION — Run AI Command
// ═══════════════════════════════════════════════════════════════

async function runWordAICommand() {
  const statusEl = document.getElementById("status-message");
  const debugEl = document.getElementById("debug-code");
  const skeletonEl = document.getElementById("skeleton");
  const cacheBadge = document.getElementById("cache-badge");
  const promptInput = document.getElementById("prompt-input");
  const button = document.getElementById("run");
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
  if (runIcon) runIcon.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.stop;
  statusEl.style.display = "none";
  skeletonEl.style.display = "flex";
  cacheBadge.style.display = "none";
  debugEl.innerText = "";
  hideEditingOverlay();
  hideDiffView();

  // Capture document text BEFORE execution for diff
  let beforeText = "";
  try {
    // @ts-ignore
    await Word.run(async ctx => {
      const b = ctx.document.body;
      b.load("text");
      await ctx.sync();
      beforeText = b.text || "";
    });
  } catch (e) {
    console.warn("[Diff] Could not capture before-text:", e);
  }
  try {
    // ═══ HARDCODED ACTIONS — bypass LLM for deterministic operations ═══
    try {
      const hardcoded = await tryHardcodedAction(userPrompt);
      if (hardcoded.handled) {
        var _hardcoded$message, _hardcoded$message2;
        skeletonEl.style.display = "none";
        debugEl.innerText = "// Executed via hardcoded action (no LLM needed)";
        hideEditingOverlay();
        const isError = ((_hardcoded$message = hardcoded.message) === null || _hardcoded$message === void 0 ? void 0 : _hardcoded$message.startsWith("⚠️")) || ((_hardcoded$message2 = hardcoded.message) === null || _hardcoded$message2 === void 0 ? void 0 : _hardcoded$message2.startsWith("❌"));
        showStatus(statusEl, isError ? "info" : "success", hardcoded.message || "✅ Done!");
        if (!isError) showToast("success", hardcoded.message || "Done!");
        // Show diff
        try {
          let afterText = "";
          // @ts-ignore
          await Word.run(async ctx => {
            const b = ctx.document.body;
            b.load("text");
            await ctx.sync();
            afterText = b.text || "";
          });
          if (beforeText || afterText) showDiffView(beforeText, afterText);
        } catch (e) {/* ignore diff errors */}
        return;
      }
    } catch (hardcodedErr) {
      console.warn("[HardcodedAction] Failed, falling back to LLM:", hardcodedErr);
      // Fall through to normal LLM pipeline
    }
    let code;
    let fromCache = false;

    // Read document context
    let docContext = null;
    try {
      var _docContext;
      docContext = await (0,_services_word_orchestrator__WEBPACK_IMPORTED_MODULE_8__.readDocumentContext)();
      if ((_docContext = docContext) !== null && _docContext !== void 0 && _docContext.hasContent) {
        console.log(`[WordAgent] Document context: ${docContext.paragraphCount} paragraphs, ~${docContext.wordCount} words`);
      }
    } catch (e) {
      console.warn("[WordAgent] Could not read document context:", e);
    }

    // Check cache
    const cached = (0,_services_cache__WEBPACK_IMPORTED_MODULE_7__.getCachedResponse)(userPrompt);
    if (cached) {
      code = cached;
      fromCache = true;
      cacheBadge.style.display = "inline-block";
      const validation = (0,_services_word_orchestrator__WEBPACK_IMPORTED_MODULE_8__.validateWordCode)(code);
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
        type: f.type,
        data: f.data,
        extractedText: f.extractedText
      }));
      const result = await (0,_services_word_orchestrator__WEBPACK_IMPORTED_MODULE_8__.runWordAgent)(userPrompt, docContext, wordAttachedFiles, {
        enablePlanning: true,
        strictValidation: true
      }, signal);

      // Clear attached files after use
      attachedFiles = [];
      updateFilePreview(false, true);
      if (!result.success) {
        throw new Error(result.error || "Code generation failed");
      }
      code = result.code;
      if (!fromCache) {
        (0,_services_cache__WEBPACK_IMPORTED_MODULE_7__.cacheResponse)(userPrompt, code);
      }
    }
    skeletonEl.style.display = "none";
    debugEl.innerText = code;
    if (runText) runText.innerText = "Executing...";

    // Show live editing animation
    showEditingOverlay(code);

    // Execute the code in Word
    // @ts-ignore
    const executionResult = await (0,_services_word_orchestrator__WEBPACK_IMPORTED_MODULE_8__.executeWordWithRecovery)(code, async codeToRun => {
      // @ts-ignore
      await Word.run(async ctx => {
        const wordBody = ctx.document.body;
        const executeFn = new Function("context", "body", "Word", `return (async () => { ${codeToRun} })();`);
        // @ts-ignore
        await executeFn(ctx, wordBody, Word);
        await ctx.sync();
      });
    }, 2, signal);

    // Hide editing overlay
    hideEditingOverlay();
    if (executionResult.success) {
      showStatus(statusEl, "success", "✅ Done! Document updated successfully.");
      showToast("success", "Document updated!");

      // Capture AFTER text and show diff
      try {
        let afterText = "";
        // @ts-ignore
        await Word.run(async ctx => {
          const b = ctx.document.body;
          b.load("text");
          await ctx.sync();
          afterText = b.text || "";
        });
        if (beforeText || afterText) {
          showDiffView(beforeText, afterText);
        }
      } catch (e) {
        console.warn("[Diff] Could not capture after-text:", e);
      }
    } else {
      var _executionResult$erro;
      showStatus(statusEl, "error", `❌ Error: ${executionResult.error}`);
      showToast("error", ((_executionResult$erro = executionResult.error) === null || _executionResult$erro === void 0 ? void 0 : _executionResult$erro.substring(0, 80)) || "Execution failed");
    }
  } catch (error) {
    skeletonEl.style.display = "none";
    hideEditingOverlay();
    if (error.name === 'AbortError') {
      showStatus(statusEl, "info", "⏹ Agent stopped.");
    } else {
      var _error$message2;
      showStatus(statusEl, "error", `❌ ${error.message}`);
      showToast("error", ((_error$message2 = error.message) === null || _error$message2 === void 0 ? void 0 : _error$message2.substring(0, 80)) || "Something went wrong");
    }
  } finally {
    agentAbortController = null;
    button.classList.remove("is-busy");
    button.classList.remove("btn-stop");
    if (runText) runText.innerText = originalText;
    if (runIcon) runIcon.innerHTML = originalIcon;
    updateExecuteButtonState();
  }
}

// ═══════════════════════════════════════════════════════════════
// AI EDITING ANIMATION SYSTEM
// ═══════════════════════════════════════════════════════════════

let editAnimInterval = null;

/** Show the live editing overlay with animated code lines */
function showEditingOverlay(code) {
  const overlay = document.getElementById("ai-editing-overlay");
  const linesEl = document.getElementById("ai-edit-lines");
  const phaseEl = document.getElementById("ai-edit-phase");
  const progressBar = document.getElementById("ai-edit-progress-bar");
  if (!overlay || !linesEl) return;
  linesEl.innerHTML = "";
  if (progressBar) progressBar.style.width = "0%";
  overlay.classList.add("active");

  // Parse the generated code into display lines
  const codeLines = code.split("\n").filter(l => l.trim().length > 0);
  const displayLines = [];
  for (const line of codeLines) {
    const trimmed = line.trim();
    // Heuristic: lines with .delete(), search/replace removals = removed
    if (/\.delete\(\)/.test(trimmed) || /insertText\(.*replace/i.test(trimmed)) {
      displayLines.push({
        text: trimmed,
        type: "removed"
      });
    }
    // Lines that set properties, insert text = added
    else if (/\.font\.|\.style|\.hyperlink|\.alignment|insertParagraph|insertText|insertTable|insertHtml|\.spaceAfter|\.spaceBefore|\.lineSpacing/i.test(trimmed)) {
      displayLines.push({
        text: trimmed,
        type: "added"
      });
    }
    // Everything else is context
    else {
      displayLines.push({
        text: trimmed,
        type: "context"
      });
    }
  }

  // Show only a subset (max 12 lines)
  const toShow = displayLines.slice(0, 12);
  let lineIndex = 0;
  const phases = ["Analyzing...", "Reading document...", "Applying changes...", "Formatting...", "Finalizing..."];
  let phaseIndex = 0;

  // Animate lines appearing one by one
  editAnimInterval = setInterval(() => {
    if (lineIndex < toShow.length) {
      const item = toShow[lineIndex];
      const lineDiv = document.createElement("div");
      lineDiv.className = `ai-edit-line ${item.type}`;
      lineDiv.style.animationDelay = "0ms";
      const gutter = document.createElement("span");
      gutter.className = "line-gutter";
      gutter.textContent = item.type === "added" ? "+" : item.type === "removed" ? "−" : " ";
      const content = document.createElement("span");
      content.className = "line-content";

      // Truncate long lines
      const displayText = item.text.length > 50 ? item.text.substring(0, 50) + "..." : item.text;
      content.textContent = displayText;

      // Add typing cursor to last added line
      if (item.type === "added" && lineIndex === toShow.length - 1) {
        const cursor = document.createElement("span");
        cursor.className = "typing-cursor";
        content.appendChild(cursor);
      }
      lineDiv.appendChild(gutter);
      lineDiv.appendChild(content);
      linesEl.appendChild(lineDiv);

      // Keep scrolled to bottom
      linesEl.scrollTop = linesEl.scrollHeight;
      lineIndex++;
    }

    // Update phase text
    phaseIndex++;
    if (phaseEl && phaseIndex % 4 === 0) {
      const pi = Math.min(Math.floor(phaseIndex / 4), phases.length - 1);
      phaseEl.textContent = phases[pi];
    }

    // Update progress bar
    if (progressBar) {
      const progress = Math.min(95, lineIndex / Math.max(toShow.length, 1) * 85 + 10);
      progressBar.style.width = progress + "%";
    }
  }, 250);
}

/** Hide the editing overlay and clean up */
function hideEditingOverlay() {
  if (editAnimInterval) {
    clearInterval(editAnimInterval);
    editAnimInterval = null;
  }
  const overlay = document.getElementById("ai-editing-overlay");
  const progressBar = document.getElementById("ai-edit-progress-bar");
  if (progressBar) progressBar.style.width = "100%";

  // Brief delay to show completion
  setTimeout(() => {
    if (overlay) overlay.classList.remove("active");
  }, 300);
}

// ═══════════════════════════════════════════════════════════════
// DIFF VIEW SYSTEM
// ═══════════════════════════════════════════════════════════════

/** Compute a simple line-level diff between two texts */
function computeSimpleDiff(before, after) {
  const beforeLines = before.split(/\r?\n/).map(l => l.trimEnd());
  const afterLines = after.split(/\r?\n/).map(l => l.trimEnd());
  const result = [];

  // Simple LCS-based diff for reasonable-sized documents
  const beforeSet = new Map();
  beforeLines.forEach((line, i) => {
    if (!beforeSet.has(line)) beforeSet.set(line, []);
    beforeSet.get(line).push(i);
  });
  const afterSet = new Map();
  afterLines.forEach((line, i) => {
    if (!afterSet.has(line)) afterSet.set(line, []);
    afterSet.get(line).push(i);
  });

  // Find lines only in before (removed), only in after (added), in both (context)
  const usedBefore = new Set();
  const usedAfter = new Set();

  // Match identical lines in order
  let bIdx = 0;
  let aIdx = 0;
  while (bIdx < beforeLines.length && aIdx < afterLines.length) {
    if (beforeLines[bIdx] === afterLines[aIdx]) {
      usedBefore.add(bIdx);
      usedAfter.add(aIdx);
      bIdx++;
      aIdx++;
    } else {
      // Try to find next match
      let foundInAfter = -1;
      for (let j = aIdx; j < Math.min(aIdx + 10, afterLines.length); j++) {
        if (afterLines[j] === beforeLines[bIdx]) {
          foundInAfter = j;
          break;
        }
      }
      let foundInBefore = -1;
      for (let j = bIdx; j < Math.min(bIdx + 10, beforeLines.length); j++) {
        if (beforeLines[j] === afterLines[aIdx]) {
          foundInBefore = j;
          break;
        }
      }
      if (foundInAfter >= 0 && (foundInBefore < 0 || foundInAfter - aIdx <= foundInBefore - bIdx)) {
        // Lines in after before match are additions
        for (let j = aIdx; j < foundInAfter; j++) {
          usedAfter.add(j);
        }
        aIdx = foundInAfter;
      } else if (foundInBefore >= 0) {
        // Lines in before before match are removals
        for (let j = bIdx; j < foundInBefore; j++) {
          usedBefore.add(j);
        }
        bIdx = foundInBefore;
      } else {
        usedBefore.add(bIdx);
        usedAfter.add(aIdx);
        bIdx++;
        aIdx++;
      }
    }
  }

  // Build diff output (simplified: walk both arrays)
  bIdx = 0;
  aIdx = 0;
  let contextCount = 0;
  const MAX_CONTEXT = 2; // Show max 2 unchanged lines between changes

  while (bIdx < beforeLines.length || aIdx < afterLines.length) {
    const bLine = bIdx < beforeLines.length ? beforeLines[bIdx] : null;
    const aLine = aIdx < afterLines.length ? afterLines[aIdx] : null;
    if (bLine !== null && aLine !== null && bLine === aLine) {
      // Context (matching line)
      contextCount++;
      if (contextCount <= MAX_CONTEXT) {
        result.push({
          type: "context",
          text: bLine || " "
        });
      } else if (contextCount === MAX_CONTEXT + 1) {
        result.push({
          type: "separator",
          text: "···"
        });
      }
      bIdx++;
      aIdx++;
    } else {
      contextCount = 0;
      // Check if current before line was removed
      if (bLine !== null && (aLine === null || bLine !== aLine)) {
        // Is this line NOT in the after set at roughly similar position?
        const afterOccurrences = afterSet.get(bLine) || [];
        const stillExists = afterOccurrences.some(j => j >= aIdx - 3 && j <= aIdx + 10);
        if (!stillExists && bLine.trim().length > 0) {
          result.push({
            type: "removed",
            text: bLine
          });
        }
        bIdx++;
      }
      if (aLine !== null && (bLine === null || aLine !== bLine)) {
        const beforeOccurrences = beforeSet.get(aLine) || [];
        const existedBefore = beforeOccurrences.some(j => j >= bIdx - 3 && j <= bIdx + 10);
        if (!existedBefore && aLine.trim().length > 0) {
          result.push({
            type: "added",
            text: aLine
          });
        }
        aIdx++;
      }
    }
  }

  // Limit total lines for display
  return result.slice(0, 30);
}

/** Show the diff view with before/after comparison */
function showDiffView(before, after) {
  const diffView = document.getElementById("ai-diff-view");
  const diffBody = document.getElementById("ai-diff-body");
  const diffStats = document.getElementById("ai-diff-stats");
  if (!diffView || !diffBody) return;
  const diff = computeSimpleDiff(before, after);

  // Don't show if no meaningful changes
  const addedCount = diff.filter(d => d.type === "added").length;
  const removedCount = diff.filter(d => d.type === "removed").length;
  if (addedCount === 0 && removedCount === 0) return;

  // Stats
  if (diffStats) {
    diffStats.innerHTML = `
            <span class="stat-added">+${addedCount}</span>
            <span class="stat-removed">−${removedCount}</span>
        `;
  }

  // Build diff lines
  diffBody.innerHTML = "";
  diff.forEach((item, index) => {
    if (item.type === "separator") {
      const sep = document.createElement("div");
      sep.className = "diff-separator";
      sep.textContent = item.text;
      diffBody.appendChild(sep);
      return;
    }
    const lineEl = document.createElement("div");
    lineEl.className = `diff-line diff-${item.type}`;
    lineEl.style.animationDelay = `${index * 40}ms`;
    const gutter = document.createElement("span");
    gutter.className = "diff-gutter";
    gutter.textContent = item.type === "added" ? "+" : item.type === "removed" ? "−" : " ";
    const text = document.createElement("span");
    text.className = "diff-text";

    // For added lines, wrap in highlight span
    if (item.type === "added") {
      const highlight = document.createElement("span");
      highlight.className = "diff-highlight";
      highlight.textContent = item.text || " ";
      text.appendChild(highlight);
    } else {
      text.textContent = item.text || " ";
    }
    lineEl.appendChild(gutter);
    lineEl.appendChild(text);
    diffBody.appendChild(lineEl);
  });
  diffView.classList.add("active");
}

/** Hide the diff view */
function hideDiffView() {
  const diffView = document.getElementById("ai-diff-view");
  if (diffView) diffView.classList.remove("active");
}

// ─── Status & Toast ──────────────────────────────────────────

function showStatus(el, type, message) {
  el.style.display = "flex";
  el.className = `status-pill status-${type}`;
  el.innerHTML = message;
}
function showToast(type, message) {
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

// ═══════════════════════════════════════════════════════════════
// FILE HANDLING — Attach PDFs, Images, and Word Documents
// ═══════════════════════════════════════════════════════════════

const PAPERCLIP_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`;
async function handleFileSelect(event) {
  let isAgent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const input = event.target;
  if (!input.files || input.files.length === 0) return;
  const btnId = isAgent ? "agent-file-btn" : "file-upload-btn";
  const btn = document.getElementById(btnId);
  if (btn) btn.innerHTML = `<span class="btn-spinner"></span>`;
  try {
    const newFiles = [];
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (file.type === "application/pdf") {
        // Extract actual text from the PDF for content-based tasks
        let extractedText = "";
        try {
          const extractFn = await getPdfExtractor();
          const pdfResult = await extractFn(file);
          extractedText = pdfResult.text;
        } catch (e) {
          console.warn("PDF text extraction failed, falling back to image mode:", e);
        }

        // Also render pages as images for vision model fallback
        const arrayBuffer = await file.arrayBuffer();
        const images = await renderPdfToImages(arrayBuffer);
        newFiles.push({
          name: file.name,
          type: "pdf",
          data: images,
          extractedText
        });
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
        // Extract text from DOCX using the Word API or manual parsing
        let extractedText = "";
        try {
          extractedText = await extractTextFromDocx(file);
        } catch (e) {
          console.warn("DOCX text extraction failed:", e);
        }
        newFiles.push({
          name: file.name,
          type: "docx",
          data: [],
          extractedText
        });
      } else if (file.type.startsWith("image/")) {
        const base64 = await fileToBase64(file);
        newFiles.push({
          name: file.name,
          type: "image",
          data: [base64]
        });
      }
    }
    if (newFiles.length > 0) {
      attachedFiles = [...attachedFiles, ...newFiles];
      updateFilePreview(true, isAgent);
    } else {
      showToast("error", "Unsupported file type. Use PDF, DOCX, or images.");
    }
  } catch (error) {
    console.error("File handling error:", error);
    showToast("error", "Error reading file: " + error.message);
  } finally {
    // Reset input so the same file can be selected again
    input.value = "";
    if (btn) btn.innerHTML = PAPERCLIP_SVG;
  }
}

/**
 * Extract text from a DOCX file.
 * DOCX is a ZIP archive with word/document.xml containing paragraph data.
 * We parse the ZIP structure, decompress the XML, and extract <w:t> text nodes.
 */
async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);
  const entries = parseZipEntries(uint8);
  const docEntry = entries.find(e => e.name === "word/document.xml");
  if (!docEntry) {
    throw new Error("Not a valid DOCX file — word/document.xml not found.");
  }
  const xmlText = await decompressZipEntry(uint8, docEntry);

  // Extract text from <w:t> elements within <w:p> paragraphs
  const textParts = [];
  const paragraphRegex = /<w:p[\s>][\s\S]*?<\/w:p>/g;
  const textRunRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
  let pMatch;
  while ((pMatch = paragraphRegex.exec(xmlText)) !== null) {
    const paraXml = pMatch[0];
    const paraTexts = [];
    let tMatch;
    textRunRegex.lastIndex = 0;
    while ((tMatch = textRunRegex.exec(paraXml)) !== null) {
      paraTexts.push(tMatch[1]);
    }
    if (paraTexts.length > 0) {
      textParts.push(paraTexts.join(""));
    }
  }
  return textParts.join("\n");
}
function parseZipEntries(data) {
  const entries = [];
  let pos = 0;
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  while (pos < data.length - 4) {
    const sig = view.getUint32(pos, true);
    if (sig !== 0x04034b50) break;
    const compressionMethod = view.getUint16(pos + 8, true);
    const compressedSize = view.getUint32(pos + 18, true);
    const uncompressedSize = view.getUint32(pos + 22, true);
    const nameLength = view.getUint16(pos + 26, true);
    const extraLength = view.getUint16(pos + 28, true);
    const nameBytes = data.slice(pos + 30, pos + 30 + nameLength);
    const name = new TextDecoder("utf-8").decode(nameBytes);
    const dataOffset = pos + 30 + nameLength + extraLength;
    entries.push({
      name,
      compressionMethod,
      compressedSize,
      uncompressedSize,
      offset: dataOffset
    });
    pos = dataOffset + compressedSize;
  }
  return entries;
}
async function decompressZipEntry(zipData, entry) {
  const raw = zipData.slice(entry.offset, entry.offset + entry.compressedSize);
  if (entry.compressionMethod === 0) {
    return new TextDecoder("utf-8").decode(raw);
  }
  if (entry.compressionMethod === 8 && typeof DecompressionStream !== "undefined") {
    const ds = new DecompressionStream("deflate-raw");
    const writer = ds.writable.getWriter();
    writer.write(raw);
    writer.close();
    const reader = ds.readable.getReader();
    const chunks = [];
    while (true) {
      const {
        done,
        value
      } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
    const result = new Uint8Array(totalLength);
    let off = 0;
    for (const chunk of chunks) {
      result.set(chunk, off);
      off += chunk.length;
    }
    return new TextDecoder("utf-8").decode(result);
  }

  // Fallback for environments without DecompressionStream
  return new TextDecoder("utf-8", {
    fatal: false
  }).decode(raw);
}
function updateFilePreview(show) {
  let isAgent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const listId = isAgent ? "agent-file-preview-list" : "file-preview-list";
  const container = document.getElementById(listId);
  if (!container) return;
  container.innerHTML = "";
  if (attachedFiles.length === 0) {
    updateExecuteButtonState();
    return;
  }
  attachedFiles.forEach((file, index) => {
    const chip = document.createElement("div");
    chip.className = "file-chip";
    const icon = document.createElement("span");
    icon.className = "file-chip-icon";
    icon.textContent = file.type === "pdf" ? "PDF" : file.type === "docx" ? "DOC" : "IMG";
    const name = document.createElement("span");
    name.className = "file-chip-name";
    name.textContent = file.name;
    const remove = document.createElement("button");
    remove.className = "file-chip-remove";
    remove.innerHTML = "&times;";
    remove.title = "Remove file";
    remove.onclick = e => {
      e.stopPropagation();
      removeFile(index, isAgent);
    };
    chip.appendChild(icon);
    chip.appendChild(name);
    chip.appendChild(remove);
    container.appendChild(chip);
  });
  updateExecuteButtonState();
}
function removeFile(index, isAgent) {
  attachedFiles.splice(index, 1);
  updateFilePreview(true, isAgent);
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
async function renderPdfToImages(buffer) {
  const pdfjsLib = await getPdfJs();
  const pdf = await pdfjsLib.getDocument({
    data: buffer
  }).promise;
  const images = [];
  const maxPages = Math.min(pdf.numPages, 5);
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({
      scale: 1.0
    });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({
      canvasContext: ctx,
      viewport
    }).promise;
    images.push(canvas.toDataURL("image/png"));
  }
  return images;
}

/***/ }),

/***/ "./src/word-taskpane/taskpane.html":
/*!*****************************************!*\
  !*** ./src/word-taskpane/taskpane.html ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// Imports
var ___HTML_LOADER_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../../assets/icon-80-v2.png */ "./assets/icon-80-v2.png"), __webpack_require__.b);
// Module
var code = "<!DOCTYPE html>\r\n<html>\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\" />\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\" />\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r\n    <title>DocOS AI</title>\r\n    <" + "script type=\"text/javascript\" src=\"https://appsforoffice.microsoft.com/lib/1/hosted/office.js\"><" + "/script>\r\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\r\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\r\n    <link\r\n        href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap\"\r\n        rel=\"stylesheet\" media=\"print\" onload=\"this.media='all'\">\r\n    <noscript><link\r\n        href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap\"\r\n        rel=\"stylesheet\"></noscript>\r\n</head>\r\n\r\n<body>\r\n    <main id=\"app-body\" style=\"display: none;\">\r\n        <header class=\"app-header\">\r\n            <div class=\"brand\">\r\n                <h1>DocOS <span class=\"highlight-text\">AI</span></h1>\r\n            </div>\r\n            <div class=\"header-actions\">\r\n                <button id=\"docs-toggle\" class=\"btn-icon\" title=\"What can I do?\"></button>\r\n                <button id=\"settings-toggle\" class=\"btn-icon\" title=\"Settings\"></button>\r\n            </div>\r\n        </header>\r\n\r\n        <!-- Docs Panel -->\r\n        <div id=\"docs-panel\" class=\"panel\" style=\"display: none;\">\r\n            <h3>What can DocOS AI do?</h3>\r\n            <div class=\"docs-grid\">\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"fileText\"></span>\r\n                    <div><strong>ATS Resume Optimizer</strong>\r\n                        <p>Make your resume ATS-friendly with clean formatting, proper keywords, and standard sections</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"paintbrush\"></span>\r\n                    <div><strong>Professional Formatting</strong>\r\n                        <p>Apply consistent fonts, headings, spacing, and styles to your entire document</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"eraser\"></span>\r\n                    <div><strong>Document Cleanup</strong>\r\n                        <p>Remove extra spaces, fix formatting issues, standardize styles</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"search\"></span>\r\n                    <div><strong>Find & Replace</strong>\r\n                        <p>Smart search and replace with pattern matching across your document</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"table\"></span>\r\n                    <div><strong>Tables & Lists</strong>\r\n                        <p>Create formatted tables, bullet lists, and numbered lists</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"fileTemplate\"></span>\r\n                    <div><strong>Templates</strong>\r\n                        <p>Generate resumes, cover letters, business letters, meeting notes</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"brain\"></span>\r\n                    <div><strong>AI Writing Assistant</strong>\r\n                        <p>Improve writing, change tone, summarize, expand content</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"checkSquare\"></span>\r\n                    <div><strong>Proofreading</strong>\r\n                        <p>Check grammar, spelling, punctuation, and style consistency</p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <p class=\"docs-hint\">Just describe what you need in plain English — DocOS handles the rest.</p>\r\n        </div>\r\n\r\n        <!-- Settings Panel -->\r\n        <div id=\"settings-panel\" class=\"panel\" style=\"display: none;\">\r\n            <h3>AI Provider</h3>\r\n\r\n            <div class=\"form-group\">\r\n                <label for=\"setting-provider\">Provider</label>\r\n                <select id=\"setting-provider\" class=\"form-input\">\r\n                    <option value=\"groq\">Groq (Llama)</option>\r\n                    <option value=\"gemini\">Google Gemini</option>\r\n                    <option value=\"openai\">OpenAI (GPT-4)</option>\r\n                    <option value=\"anthropic\">Anthropic (Claude)</option>\r\n                    <option value=\"openrouter\">OpenRouter</option>\r\n                    <option value=\"local\">Ollama (Local)</option>\r\n                </select>\r\n            </div>\r\n\r\n            <!-- Groq Fields -->\r\n            <div id=\"groq-fields\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-api-key\">Groq API Key</label>\r\n                    <input id=\"setting-api-key\" type=\"password\" class=\"form-input\" placeholder=\"gsk_...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-groq-model\">Model</label>\r\n                    <select id=\"setting-groq-model\" class=\"form-input\">\r\n                        <option value=\"llama-3.1-8b-instant\">Llama 3.1 8B — Fast</option>\r\n                        <option value=\"llama-3.3-70b-versatile\" selected>Llama 3.3 70B — Smart</option>\r\n                        <option value=\"gemma2-9b-it\">Gemma 2 9B</option>\r\n                        <option value=\"mixtral-8x7b-32768\">Mixtral 8x7B</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Gemini Fields -->\r\n            <div id=\"gemini-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-gemini-key\">Gemini API Key</label>\r\n                    <input id=\"setting-gemini-key\" type=\"password\" class=\"form-input\" placeholder=\"AIzaSy...\" />\r\n                    <div style=\"font-size:10px; color:var(--text-3); margin-top:4px\">Get free key at <a\r\n                            href=\"https://aistudio.google.com/app/apikey\" target=\"_blank\">aistudio.google.com</a></div>\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-gemini-model\">Model</label>\r\n                    <select id=\"setting-gemini-model\" class=\"form-input\">\r\n                        <option value=\"gemini-1.5-flash\" selected>Gemini 1.5 Flash</option>\r\n                        <option value=\"gemini-1.5-flash-001\">Gemini 1.5 Flash-001</option>\r\n                        <option value=\"gemini-1.5-pro\">Gemini 1.5 Pro</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- OpenAI Fields -->\r\n            <div id=\"openai-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openai-key\">OpenAI API Key</label>\r\n                    <input id=\"setting-openai-key\" type=\"password\" class=\"form-input\" placeholder=\"sk-...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openai-model\">Model</label>\r\n                    <select id=\"setting-openai-model\" class=\"form-input\">\r\n                        <option value=\"gpt-4o-mini\" selected>GPT-4o Mini</option>\r\n                        <option value=\"gpt-4o\">GPT-4o</option>\r\n                        <option value=\"gpt-3.5-turbo\">GPT-3.5 Turbo</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Anthropic Fields -->\r\n            <div id=\"anthropic-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-anthropic-key\">Anthropic API Key</label>\r\n                    <input id=\"setting-anthropic-key\" type=\"password\" class=\"form-input\" placeholder=\"sk-ant-...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-anthropic-model\">Model</label>\r\n                    <select id=\"setting-anthropic-model\" class=\"form-input\">\r\n                        <option value=\"claude-3-5-sonnet-20241022\" selected>Claude 3.5 Sonnet</option>\r\n                        <option value=\"claude-3-5-haiku-20241022\">Claude 3.5 Haiku</option>\r\n                        <option value=\"claude-3-opus-20240229\">Claude 3 Opus</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- OpenRouter Fields -->\r\n            <div id=\"openrouter-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openrouter-key\">OpenRouter API Key</label>\r\n                    <input id=\"setting-openrouter-key\" type=\"password\" class=\"form-input\"\r\n                        placeholder=\"sk-or-v1-...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openrouter-model\">Model</label>\r\n                    <select id=\"setting-openrouter-model\" class=\"form-input\">\r\n                        <option value=\"anthropic/claude-3.5-sonnet:beta\" selected>Claude 3.5 Sonnet</option>\r\n                        <option value=\"google/gemini-2.5-pro\">Gemini 2.5 Pro</option>\r\n                        <option value=\"openai/gpt-4o\">GPT-4o</option>\r\n                        <option value=\"meta-llama/llama-3.3-70b-instruct\">Llama 3.3 70B</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Local Fields -->\r\n            <div id=\"local-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-base-url\">Ollama Host</label>\r\n                    <input id=\"setting-base-url\" type=\"text\" class=\"form-input\"\r\n                        placeholder=\"http://localhost:11434\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label>Model</label>\r\n                    <div class=\"model-select-wrapper\">\r\n                        <select id=\"setting-local-model\" class=\"form-input\">\r\n                            <option value=\"\" disabled selected>Click refresh →</option>\r\n                        </select>\r\n                        <button id=\"refresh-models\" class=\"btn-icon btn-refresh\" title=\"Refresh models\"></button>\r\n                    </div>\r\n                    <div id=\"model-status\" class=\"model-status\"></div>\r\n                </div>\r\n            </div>\r\n\r\n            <button id=\"save-settings\" class=\"btn-primary btn-save\">Save</button>\r\n        </div>\r\n\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <!-- MODE TOGGLE -->\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <div class=\"mode-toggle\">\r\n            <button id=\"mode-planning\" class=\"mode-tab active\" data-mode=\"planning\">\r\n                <span id=\"mode-planning-icon\"></span>\r\n                <span>Planning</span>\r\n            </button>\r\n            <button id=\"mode-agent\" class=\"mode-tab\" data-mode=\"agent\">\r\n                <span id=\"mode-agent-icon\"></span>\r\n                <span>Agent</span>\r\n            </button>\r\n            <div class=\"mode-indicator\" id=\"mode-indicator\"></div>\r\n        </div>\r\n\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <!-- PLANNING MODE (Chat) -->\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <div id=\"planning-mode\" class=\"mode-content active\">\r\n            <!-- Chat Messages Area -->\r\n            <div style=\"position: relative; flex: 1; display: flex; flex-direction: column; overflow: hidden;\">\r\n                <div id=\"chat-messages\" class=\"chat-messages\">\r\n                    <!-- Welcome message -->\r\n                    <div class=\"chat-welcome\">\r\n                        <img src=\"" + ___HTML_LOADER_IMPORT_0___ + "\" alt=\"DocOS Logo\"\r\n                            style=\"width: 64px; height: 64px; margin-bottom: 16px;\">\r\n                        <h2>What are you working on?</h2>\r\n                        <div class=\"welcome-suggestions\" id=\"chat-suggestions\">\r\n                            <!-- Dynamically populated -->\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <button id=\"scroll-to-bottom\" class=\"scroll-to-bottom\" title=\"Scroll to bottom\">\r\n                    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"\r\n                        stroke-linecap=\"round\" stroke-linejoin=\"round\">\r\n                        <polyline points=\"6 9 12 15 18 9\" />\r\n                    </svg>\r\n                </button>\r\n            </div>\r\n\r\n            <!-- Chat Input -->\r\n            <div class=\"chat-input-area\">\r\n                <div id=\"file-preview-list\" class=\"file-preview-list\"></div>\r\n\r\n                <div class=\"chat-input-card\">\r\n                    <input type=\"file\" id=\"file-input\" accept=\"image/png, image/jpeg, application/pdf, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document\" multiple\r\n                        style=\"display: none;\" />\r\n                    <button id=\"file-upload-btn\" class=\"btn-clip\" title=\"Attach PDF, Word Doc, or Image\">\r\n                        <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n                            stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\r\n                            <path\r\n                                d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\">\r\n                            </path>\r\n                        </svg>\r\n                    </button>\r\n                    <textarea id=\"chat-input\" placeholder=\"Ask about your document or upload a file...\" rows=\"1\"\r\n                        spellcheck=\"false\"></textarea>\r\n                    <button id=\"chat-send\" class=\"btn-send\" title=\"Send message\">\r\n                        <span id=\"chat-send-icon\"></span>\r\n                    </button>\r\n                </div>\r\n                <div class=\"chat-footer\">\r\n                    <button id=\"chat-clear\" class=\"btn-text\" title=\"Clear conversation\">\r\n                        <span id=\"chat-clear-icon\"></span>\r\n                        <span>Clear</span>\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <!-- AGENT MODE (Execute) -->\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <div id=\"agent-mode\" class=\"mode-content\">\r\n            <div class=\"content-wrapper\">\r\n                <!-- Input Card -->\r\n                <div class=\"input-card\">\r\n                    <textarea id=\"prompt-input\" placeholder=\"Describe what you want to do with your document...\"\r\n                        spellcheck=\"false\"></textarea>\r\n\r\n                    <!-- File Preview (Agent Mode) -->\r\n                    <div id=\"agent-file-preview-list\" class=\"file-preview-list\"></div>\r\n\r\n                    <div class=\"card-footer\">\r\n                        <div class=\"footer-left\">\r\n                            <input type=\"file\" id=\"agent-file-input\" accept=\"image/png, image/jpeg, application/pdf, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document\"\r\n                                multiple style=\"display: none;\" />\r\n                            <button id=\"agent-file-btn\" class=\"btn-clip\" title=\"Attach files\">\r\n                                <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n                                    stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\r\n                                    <path\r\n                                        d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\">\r\n                                    </path>\r\n                                </svg>\r\n                            </button>\r\n                            <span id=\"cache-badge\" class=\"cache-badge\" style=\"display:none;\">⚡ cached</span>\r\n                        </div>\r\n                        <span class=\"kbd-hint\">↵ Enter</span>\r\n                        <button id=\"run\" class=\"btn-primary\">\r\n                            <span id=\"run-text\">Execute</span>\r\n                            <span id=\"run-icon\"></span>\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- Scrollable content area -->\r\n                <div class=\"agent-scroll-area\">\r\n                    <!-- Category Tabs for Quick Actions -->\r\n                    <div class=\"action-categories\" id=\"action-categories\">\r\n                        <button class=\"category-tab active\" data-category=\"resume\">\r\n                            <span class=\"cat-icon\" data-icon=\"fileText\"></span>\r\n                            <span>Resume</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"writing\">\r\n                            <span class=\"cat-icon\" data-icon=\"brain\"></span>\r\n                            <span>Writing</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"format\">\r\n                            <span class=\"cat-icon\" data-icon=\"palette\"></span>\r\n                            <span>Format</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"insert\">\r\n                            <span class=\"cat-icon\" data-icon=\"plusCircle\"></span>\r\n                            <span>Insert</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"layout\">\r\n                            <span class=\"cat-icon\" data-icon=\"layoutGrid\"></span>\r\n                            <span>Layout</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"cleanup\">\r\n                            <span class=\"cat-icon\" data-icon=\"broom\"></span>\r\n                            <span>Cleanup</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"templates\">\r\n                            <span class=\"cat-icon\" data-icon=\"fileTemplate\"></span>\r\n                            <span>Templates</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"smart\">\r\n                            <span class=\"cat-icon\" data-icon=\"brain\"></span>\r\n                            <span>Smart Tools</span>\r\n                        </button>\r\n                    </div>\r\n\r\n                    <!-- Quick Actions -->\r\n                    <div id=\"quick-actions\" class=\"quick-actions\"></div>\r\n\r\n                    <!-- Skeleton -->\r\n                    <div id=\"skeleton\" class=\"skeleton-container\" style=\"display: none;\">\r\n                        <div class=\"skeleton-pill\"></div>\r\n                        <div class=\"skeleton-line w80\"></div>\r\n                        <div class=\"skeleton-line w60\"></div>\r\n                    </div>\r\n\r\n                    <!-- AI Editing Animation Overlay -->\r\n                    <div id=\"ai-editing-overlay\" class=\"ai-editing-overlay\">\r\n                        <div class=\"ai-edit-header\">\r\n                            <span class=\"pulse-dot\"></span>\r\n                            <span class=\"edit-label\">DocOS AI is editing</span>\r\n                            <span class=\"edit-phase\" id=\"ai-edit-phase\">Analyzing...</span>\r\n                        </div>\r\n                        <div class=\"ai-edit-lines\" id=\"ai-edit-lines\"></div>\r\n                        <div class=\"ai-edit-progress\">\r\n                            <div class=\"bar\" id=\"ai-edit-progress-bar\"></div>\r\n                            <div class=\"shimmer\"></div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!-- Diff View (shown after execution) -->\r\n                    <div id=\"ai-diff-view\" class=\"ai-diff-view\">\r\n                        <div class=\"ai-diff-header\">\r\n                            <div class=\"ai-diff-title\">\r\n                                <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3v18\"/><path d=\"M18 9l-6-6-6 6\"/></svg>\r\n                                <span>Changes Applied</span>\r\n                            </div>\r\n                            <div class=\"ai-diff-stats\" id=\"ai-diff-stats\"></div>\r\n                        </div>\r\n                        <div class=\"ai-diff-body\" id=\"ai-diff-body\"></div>\r\n                        <div class=\"ai-diff-dismiss\" id=\"ai-diff-dismiss\">\r\n                            <span>Dismiss</span>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!-- Status Message -->\r\n                    <div id=\"status-message\" class=\"status-pill\"></div>\r\n\r\n                    <!-- Debug -->\r\n                    <div id=\"debug-section\">\r\n                        <details>\r\n                            <summary>\r\n                                <span id=\"chevron-icon\"></span>\r\n                                <span>Generated Code</span>\r\n                            </summary>\r\n                            <pre id=\"debug-code\"></pre>\r\n                        </details>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Toast Notification Container -->\r\n        <div id=\"toast-container\" class=\"toast-container\"></div>\r\n    </main>\r\n\r\n    <section id=\"sideload-msg\" class=\"sideload-container\">\r\n        <div class=\"sideload-skeleton\">\r\n            <div class=\"sk-header\">\r\n                <div class=\"sk-brand\">\r\n                    <div class=\"sk-logo sk-shimmer\"></div>\r\n                    <div class=\"sk-title sk-shimmer\"></div>\r\n                </div>\r\n                <div class=\"sk-header-actions\">\r\n                    <div class=\"sk-icon-btn sk-shimmer\"></div>\r\n                    <div class=\"sk-icon-btn sk-shimmer\"></div>\r\n                </div>\r\n            </div>\r\n            <div style=\"padding: 0 16px;\">\r\n                <div class=\"sk-mode-toggle\">\r\n                    <div class=\"sk-mode-tab sk-shimmer\"></div>\r\n                    <div class=\"sk-mode-tab sk-shimmer\"></div>\r\n                </div>\r\n            </div>\r\n            <div class=\"sk-welcome\">\r\n                <div class=\"sk-welcome-icon sk-shimmer\"></div>\r\n                <div class=\"sk-welcome-title sk-shimmer\"></div>\r\n                <div class=\"sk-welcome-desc sk-shimmer\"></div>\r\n                <div class=\"sk-welcome-desc short sk-shimmer\"></div>\r\n            </div>\r\n            <div class=\"sk-suggestions\">\r\n                <div class=\"sk-suggestion sk-shimmer\"></div>\r\n                <div class=\"sk-suggestion sk-shimmer\"></div>\r\n                <div class=\"sk-suggestion sk-shimmer\"></div>\r\n            </div>\r\n            <div class=\"sk-input-area\">\r\n                <div style=\"padding: 0 16px;\">\r\n                    <div class=\"sk-input sk-shimmer\"></div>\r\n                </div>\r\n            </div>\r\n            <div class=\"sideload-status\">\r\n                <div class=\"sideload-pulse\"></div>\r\n                <span id=\"loading-status\">Initializing DocOS AI...</span>\r\n            </div>\r\n        </div>\r\n    </section>\r\n\r\n    <template id=\"chat-skeleton-template\">\r\n        <div class=\"chat-msg ai skeleton-msg\">\r\n            <div class=\"chat-bubble skeleton-bubble\">\r\n                <div class=\"skeleton-line w80 sk-shimmer\"></div>\r\n                <div class=\"skeleton-line w60 sk-shimmer\"></div>\r\n                <div class=\"skeleton-line w40 sk-shimmer\"></div>\r\n            </div>\r\n        </div>\r\n    </template>\r\n\r\n    <!-- Fallback Script -->\r\n    <" + "script>\r\n        setTimeout(function () {\r\n            var app = document.getElementById(\"app-body\");\r\n            var fb = document.getElementById(\"debug-fallback\");\r\n            if ((!app || app.style.display === \"none\") && fb) {\r\n                fb.style.display = \"block\";\r\n            }\r\n        }, 30000);\r\n    <" + "/script>\r\n</body>\r\n\r\n</html>\r\n";
// Exports
/* harmony default export */ __webpack_exports__["default"] = (code);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	!function() {
/******/ 		var getProto = Object.getPrototypeOf ? function(obj) { return Object.getPrototypeOf(obj); } : function(obj) { return obj.__proto__; };
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach(function(key) { def[key] = function() { return value[key]; }; });
/******/ 			}
/******/ 			def['default'] = function() { return value; };
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	!function() {
/******/ 		// The chunk loading function for additional chunks
/******/ 		// Since all referenced chunks are already included
/******/ 		// in this file, this function is empty here.
/******/ 		__webpack_require__.e = function() { return Promise.resolve(); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		__webpack_require__.b = (typeof document !== 'undefined' && document.baseURI) || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"word-taskpane": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunksheetos_ai"] = self["webpackChunksheetos_ai"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	!function() {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["vendor"], function() { return __webpack_require__("./src/word-taskpane/taskpane.ts"); })
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], function() { return __webpack_require__("./src/word-taskpane/taskpane.html"); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=word-taskpane.js.map