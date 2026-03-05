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
    type: "image" | "pdf";
    data: string[];
}

// ═══════════════════════════════════════════════════════════════
// BANNED PATTERNS — These cause runtime errors in Word JS API
// ═══════════════════════════════════════════════════════════════

const BANNED_PATTERNS: { pattern: RegExp; message: string; fix: string }[] = [
    // ⚠️ CRITICAL: Prevent content destruction
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

    // UI methods that don't work in add-ins
    { pattern: /alert\s*\(/g, message: "alert() doesn't work in add-ins", fix: "Remove - use status messages" },
    { pattern: /confirm\s*\(/g, message: "confirm() doesn't work in add-ins", fix: "Remove" },
    { pattern: /prompt\s*\(/g, message: "prompt() doesn't work in add-ins", fix: "Remove" },
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

    // Font & formatting
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

    // Range operations
    /\.getRange\(\)/,
    /\.search\(/,
    /\.select\(/,

    // Table operations
    /\.tables/,
    /\.rows/,
    /\.cells/,
    /\.addRows\(/,
    /\.addColumns\(/,
    /\.getBorder\(/,

    // Content controls
    /\.contentControls/,

    // Section & header/footer
    /\.sections/,
    /\.getHeader\(/,
    /\.getFooter\(/,

    // Load operations
    /\.load\(/,

    // Delete (clear is BANNED for safety)
    /\.delete\(\)/,

    // Lists
    /\.listItem/,
    /\.startNewList\(/,
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

RULES:
- Keep steps actionable and specific to Word document operations
- Identify if document content needs to be read first
- Flag complexity based on operations needed
- Note any ambiguities in the request`;

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

const CODER_SYSTEM_PROMPT = `You are a Word JavaScript API expert. Generate ONLY executable code.

ENVIRONMENT (pre-declared, DO NOT redeclare):
- context: Word.RequestContext
- body: context.document.body (already loaded)
- Word: Namespace for enums (Word.InsertLocation, Word.Alignment, etc.)

ABSOLUTE RULE: NEVER use body.clear(). It DESTROYS all user content. FORBIDDEN.

CRITICAL API RULES:
1. Properties require .load() + await context.sync() before reading
2. Writing text: body.insertParagraph("text", Word.InsertLocation.end)
3. Reading: paragraph.load("text,style,font"); await context.sync();
4. Font: paragraph.font.bold = true, paragraph.font.size = 14, paragraph.font.color = "#000000"
5. Alignment: paragraph.alignment = Word.Alignment.centered
6. Styles: DO NOT use 'Heading 1' for resumes (adds huge gaps). Use font.size=12, font.bold=true instead.
7. Tables: body.insertTable(rows, cols, Word.InsertLocation.end, [["cell1","cell2"]])
8. Search & Replace: body.search("old").load("items"); await context.sync(); then loop items
9. Hyperlinks / Make Link Clickable:
   - To make SELECTED text clickable: const sel = context.document.getSelection(); sel.load("text"); await context.sync(); let url = sel.text.trim(); if (!url.startsWith("http")) url = "https://" + url; sel.hyperlink = url; await context.sync();
   - 🚨 NEVER insert/append URL text — ONLY set .hyperlink on existing range. Inserting text DUPLICATES the URL.
   - 🚨 MUST trim spaces AND url must start with "http://" or "https://" or it crashes with InvalidArgument.
10. Line spacing: paragraph.lineSpacing = 12 (compact single spacing)
11. Space after: paragraph.spaceAfter = 2 (for tight body text)

BANNED (will crash or destroy data):
- body.clear() → DESTROYS ALL CONTENT. NEVER USE.
- .addText() → Hallucinated method. Use insertText().
- Excel.*, sheet.*, .getUsedRange(), .getCell() → Excel API, NOT Word
- SpreadsheetApp, DocumentApp → Google Apps Script
- alert(), confirm(), prompt() → Blocked in add-ins
- const context = ... → Already declared
- const body = ... → Already declared
- "Heading1" → Wrong. Use "Heading 1" (with space)

MAKE LINK CLICKABLE PATTERN (use when user selects a URL and wants it clickable):
// 🚨 NEVER insert/append URL text. ONLY set .hyperlink on the existing range.
const sel = context.document.getSelection();
sel.load("text");
await context.sync();
let linkUrl = sel.text.trim();
if (!linkUrl.startsWith("http")) linkUrl = "https://" + linkUrl;
sel.hyperlink = linkUrl; // Makes it clickable WITHOUT changing any text
await context.sync();
// 🚨 DO NOT use insertText, insertParagraph, or insertHtml to write the URL — that DUPLICATES it.

SAFE REFORMAT PATTERN (use for ATS/formatting/cleanup):
// Load existing paragraphs
const paragraphs = body.paragraphs;
paragraphs.load("items/text,items/style,items/font");
await context.sync();

// Modify each paragraph IN-PLACE (never clear/delete!)
for (let i = 0; i < paragraphs.items.length; i++) {
  const p = paragraphs.items[i];
  const text = p.text.trim();
  
  if (i === 0 && text.length > 0) {
    p.font.size = 18; // Preserve large name
    p.font.bold = true;
  } else if (text.length > 0 && text.length < 50 && text === text.toUpperCase()) {
    p.font.size = 12; // Section Headings
    p.font.bold = true;
    p.spaceBefore = 12;
    p.spaceAfter = 4;
  } else {
    p.font.name = "Calibri";
    p.font.size = 10.5; // Compact body
    p.font.color = "#000000";
    p.lineSpacing = 12; // True single
    p.spaceAfter = 2; // Tight gap
  }
}
await context.sync();

CONTENT PRESERVATION RULES:
- When reformatting: Read paragraphs → modify font/style/spacing → sync. NEVER delete content.
- When making ATS-friendly: Change fonts, apply heading styles, fix spacing. Keep all text.
- Only use body.insertParagraph() to ADD new content, not to replace existing.
- To add content at the end: Word.InsertLocation.end
- To add content at the start: Word.InsertLocation.start

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

    if (docContext && docContext.hasContent) {
        prompt += '\n\nDOCUMENT DATA (EXISTING CONTENT — DO NOT DELETE THIS):\n';
        prompt += '- Paragraphs: ' + docContext.paragraphCount + '\n';
        prompt += '- Word Count: ~' + docContext.wordCount + '\n';
        prompt += '- Headings: ' + JSON.stringify(docContext.headings) + '\n';
        if (docContext.selectedText) {
            prompt += '- USER HIGHLIGHTED TEXT: "' + docContext.selectedText + '"\n';

            // Detect if selected text contains URLs and task is about making links clickable
            const urlPattern = /(?:https?:\/\/|www\.)[^\s]+/i;
            const linkKeywords = /\b(clickable|hyperlink|link|url)\b/i;
            if (urlPattern.test(docContext.selectedText) && linkKeywords.test(task)) {
                prompt += '\n🚨 HYPERLINK INSTRUCTION: The user selected a URL and wants it clickable.\n';
                prompt += 'DO THIS:\n';
                prompt += '  const sel = context.document.getSelection();\n';
                prompt += '  sel.load("text");\n';
                prompt += '  await context.sync();\n';
                prompt += '  let linkUrl = sel.text.trim();\n';
                prompt += '  if (!linkUrl.startsWith("http")) linkUrl = "https://" + linkUrl;\n';
                prompt += '  sel.hyperlink = linkUrl;\n';
                prompt += '  await context.sync();\n';
                prompt += '🚨 DO NOT insert, append, or write any URL text. ONLY set .hyperlink on the selection. Any insertText/insertParagraph/insertHtml that writes the URL will DUPLICATE it.\n';
            }
        }
        prompt += '- Full text: "' + docContext.sampleText + '"\n';
        prompt += '\n⚠️ PRESERVE ALL EXISTING CONTENT. Modify paragraphs in-place. NEVER use body.clear().\n';
    }

    if (previousError) {
        prompt += '\n\nPREVIOUS ERROR: "' + previousError + '"\nFIX THIS ERROR. Output only corrected code.';
    }

    const messages: any[] = [{ role: "system", content: CODER_SYSTEM_PROMPT }];

    if (attachedFiles.length > 0) {
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

const FIXER_SYSTEM_PROMPT = `You are a Word JavaScript API debugger. Fix the broken code.

COMMON FIXES:
1. Excel.* → Use Word.* namespace instead
2. sheet.* → Use body.* (Word document body)
3. .getUsedRange() → Use body.paragraphs or body.search()
4. const body = ... → REMOVE (already declared)
5. SpreadsheetApp → Use Word JS API
6. range.values = [[]] → Use body.insertParagraph() or insertTable()
7. body.clear() → REMOVE THIS. Never clear the document. Modify paragraphs individually.
8. InvalidArgument → Check: style names need quotes ("Heading 1"), InsertLocation must be Word.InsertLocation.end/start/replace, table data dimensions must match row/col counts
9. InvalidArgument on hyperlink → ALWAYS trim spaces and add "https://" before the url. e.g., range.hyperlink = "https://" + url.trim(); NEVER insert URL text — only set .hyperlink property on existing range.
10. Mashed/duplicated URL text → The code is inserting URL text via insertText/insertParagraph instead of just setting .hyperlink. Fix: REMOVE any insertText/insertParagraph calls that write the URL. ONLY use range.hyperlink = url.
11. paragraph.style = "Heading1" → Use "Heading 1" (with space)
11. Properties not loaded → Add .load("text,style,font") + await context.sync() before reading
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

    let plan: WordTaskPlan | null = null;
    let code = "";
    let validation: WordValidationResult | null = null;
    let retries = 0;

    try {
        // ═══ PHASE 1: PLANNING ═══
        if (cfg.enablePlanning && !attachedFiles.length) {
            try {
                plan = await createWordPlan(task, docContext, signal);
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
            validation = validateWordCode(code);

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
        validation = validateWordCode(code);

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
            paragraphs.load("items/text,items/style");
            await context.sync();

            const allText = body.text || "";
            const wordCount = allText.split(/\s+/).filter((w: string) => w.length > 0).length;

            // Extract headings
            const headings: string[] = [];
            const contentTypes = new Set<string>();
            contentTypes.add("text");

            for (let i = 0; i < paragraphs.items.length; i++) {
                const p = paragraphs.items[i];
                if (p.style && (p.style.includes("Heading") || p.style.includes("heading"))) {
                    headings.push(p.text.trim());
                }
            }

            // Check for tables
            const tables = body.tables;
            tables.load("count");

            // Get selected text
            const selection = context.document.getSelection();
            selection.load("text");

            await context.sync();

            if (tables.count > 0) {
                contentTypes.add("table");
            }

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
