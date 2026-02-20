/**
 * SheetOS AI — Agent Orchestrator
 * LangChain-inspired intelligent agent system for bulletproof Excel automation.
 * 
 * Architecture:
 * 1. PLANNER - Analyzes task and creates execution plan
 * 2. CODER - Generates Excel JavaScript API code
 * 3. VALIDATOR - Validates code syntax and API usage
 * 4. EXECUTOR - Executes code with sandboxing
 * 5. FIXER - Recovers from errors with context
 * 
 * Anti-Hallucination Strategy:
 * - Strict API whitelist
 * - Banned pattern detection
 * - Syntax validation before execution
 * - Structured output parsing
 */

import { callLLM, getConfig } from "./llm.service";

// ═══════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════

export interface AgentState {
  task: string;
  plan: TaskPlan | null;
  code: string;
  validationResult: ValidationResult | null;
  executionResult: ExecutionResult | null;
  retryCount: number;
  conversationHistory: ConversationMessage[];
  sheetContext: SheetContext | null;
  attachedFiles: AttachedFile[];
}

export interface TaskPlan {
  understanding: string;
  steps: string[];
  dataNeeded: string[];
  expectedOutput: string;
  complexity: "simple" | "moderate" | "complex";
  warnings: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
  sanitizedCode: string;
  apiCallsDetected: string[];
}

export interface ValidationError {
  type: "syntax" | "banned_api" | "missing_sync" | "unsafe_pattern" | "type_error";
  message: string;
  line?: number;
  suggestion: string;
}

export interface ExecutionResult {
  success: boolean;
  error?: string;
  errorType?: "runtime" | "api_error" | "timeout" | "unknown";
  duration: number;
}

export interface ConversationMessage {
  role: "system" | "user" | "assistant" | "error";
  content: string;
  timestamp: number;
}

export interface SheetContext {
  sheetName: string;
  rowCount: number;
  columnCount: number;
  headers: string[];
  sampleData: any[][];
  dataTypes: string[];
  hasData: boolean;
}

export interface AttachedFile {
  name: string;
  type: "image" | "pdf";
  data: string[];
}

// ═══════════════════════════════════════════════════════════════
// BANNED PATTERNS — These cause runtime errors in Excel JS API
// ═══════════════════════════════════════════════════════════════

const BANNED_PATTERNS: { pattern: RegExp; message: string; fix: string }[] = [
  // Method calls that don't exist
  { pattern: /\.getColumnCount\s*\(\s*\)/g, message: "getColumnCount() doesn't exist", fix: "load('columnCount') then use .columnCount property" },
  { pattern: /\.getRowCount\s*\(\s*\)/g, message: "getRowCount() doesn't exist", fix: "load('rowCount') then use .rowCount property" },
  { pattern: /\.getAddress\s*\(\s*\)/g, message: "getAddress() doesn't exist", fix: "load('address') then use .address property" },
  { pattern: /\.getValues\s*\(\s*\)/g, message: "getValues() doesn't exist", fix: "load('values') then use .values property" },
  { pattern: /\.getText\s*\(\s*\)/g, message: "getText() doesn't exist", fix: "load('text') then use .text property" },
  { pattern: /\.setValues\s*\(/g, message: "setValues() doesn't exist", fix: "Use range.values = [[...]] assignment" },
  { pattern: /\.setFormula\s*\(/g, message: "setFormula() doesn't exist", fix: "Use range.formulas = [[...]] assignment" },
  { pattern: /\.setValue\s*\(/g, message: "setValue() doesn't exist", fix: "Use range.values = [[value]] assignment" },
  
  // Google Apps Script contamination
  { pattern: /SpreadsheetApp/g, message: "SpreadsheetApp is Google Apps Script, not Excel", fix: "Use Excel JavaScript API (sheet, context, Excel namespace)" },
  { pattern: /Logger\.log/g, message: "Logger.log is Google Apps Script", fix: "Use console.log or remove logging" },
  { pattern: /Browser\.msgBox/g, message: "Browser.msgBox is Google Apps Script", fix: "Remove - UI dialogs not supported in Excel Add-ins" },
  { pattern: /Utilities\./g, message: "Utilities is Google Apps Script", fix: "Use native JavaScript methods" },
  
  // Wrong chart API
  { pattern: /chart\.setTitle\s*\(/g, message: "chart.setTitle() doesn't exist", fix: "Use chart.title.text = '...'" },
  { pattern: /chart\.add\s*\(/g, message: "chart.add() doesn't exist", fix: "Use sheet.charts.add()" },
  
  // Wrong range methods
  { pattern: /range\.getItem\s*\(/g, message: "range.getItem() doesn't exist", fix: "Use range.getCell(row, col)" },
  { pattern: /range\.select\s*\(\s*\)/g, message: "range.select() causes performance issues", fix: "Remove - selection not needed for automation" },
  { pattern: /range\.activate\s*\(\s*\)/g, message: "range.activate() causes performance issues", fix: "Remove - activation not needed for automation" },
  
  // Wrong format paths
  { pattern: /range\.font\.bold/g, message: "range.font.bold path is wrong", fix: "Use range.format.font.bold" },
  { pattern: /range\.alignment/g, message: "range.alignment doesn't exist", fix: "Use range.format.horizontalAlignment or range.format.verticalAlignment" },
  { pattern: /range\.format\.alignment/g, message: "range.format.alignment object doesn't exist", fix: "Use range.format.horizontalAlignment directly" },
  { pattern: /range\.horizontal/g, message: "range.horizontal doesn't exist", fix: "Use range.format.horizontalAlignment" },
  
  // UI methods that don't work in add-ins
  { pattern: /message\.alert\s*\(/g, message: "message.alert() doesn't exist in add-ins", fix: "Remove - use status messages in add-in UI instead" },
  { pattern: /alert\s*\(/g, message: "alert() doesn't work in add-ins", fix: "Remove - JavaScript alert blocked in Office Add-ins" },
  { pattern: /confirm\s*\(/g, message: "confirm() doesn't work in add-ins", fix: "Remove - JavaScript confirm blocked in Office Add-ins" },
  { pattern: /prompt\s*\(/g, message: "prompt() doesn't work in add-ins", fix: "Remove - JavaScript prompt blocked in Office Add-ins" },
  
  // Variable redeclaration (context and sheet are pre-declared)
  { pattern: /(?:const|let|var)\s+context\s*=/g, message: "context is already declared", fix: "Remove declaration - context is provided" },
  { pattern: /(?:const|let|var)\s+sheet\s*=\s*context\.workbook/g, message: "sheet is already declared", fix: "Remove declaration - sheet is provided" },
  
  // Invalid range references
  { pattern: /getRange\s*\(\s*["']?[A-Z]0["']?\s*\)/gi, message: "Row 0 doesn't exist in Excel", fix: "Use row 1 or higher (e.g., A1, B1)" },
  { pattern: /getCell\s*\(\s*-?\d+\s*,\s*-?\d+\s*\)/g, message: "Negative cell indices are invalid", fix: "Use 0 or positive indices" },
  
  // Common formatting mistakes
  { pattern: /\.getRow\s*\(\s*\d+\s*\)\.format\.[^f]/g, message: "Using getRow without checking range first", fix: "Always load rowCount first and check if range has data" },
  { pattern: /usedRange\.getRow\s*\(\s*(\d+)\s*\)[^;]*(?!.*rowCount)/g, message: "Using getRow without verifying rowCount", fix: "Load rowCount and check if sheet has data before using getRow" },
];

// ═══════════════════════════════════════════════════════════════
// ALLOWED API WHITELIST — Only these Excel JS API calls are safe
// ═══════════════════════════════════════════════════════════════

const ALLOWED_API_PATTERNS = [
  // Core objects
  /context\.workbook/,
  /context\.sync\(\)/,
  /sheet\./,
  /Excel\./,
  
  // Range operations
  /\.getRange\(/,
  /\.getUsedRange\(/,
  /\.getCell\(/,
  /\.getRow\(/,
  /\.getColumn\(/,
  /\.getResizedRange\(/,
  /\.getOffsetRange\(/,
  /\.getEntireRow\(/,
  /\.getEntireColumn\(/,
  /\.getLastCell\(/,
  /\.getLastRow\(/,
  /\.getLastColumn\(/,
  /\.getBoundingRect\(/,
  /\.getIntersection\(/,
  
  // Load operations
  /\.load\(/,
  
  // Value assignment (via property)
  /\.values\s*=/,
  /\.formulas\s*=/,
  /\.numberFormat\s*=/,
  
  // Format operations
  /\.format\./,
  /\.autofitColumns\(/,
  /\.autofitRows\(/,
  
  // Table operations
  /\.tables\./,
  
  // Chart operations
  /\.charts\./,
  
  // Data operations
  /\.sort\./,
  /\.autoFilter\./,
  /\.dataValidation\./,
  /\.conditionalFormats\./,
  
  // Worksheet operations
  /\.worksheets\./,
  /\.freezePanes\./,
  
  // Clear operations
  /\.clear\(/,
  /\.delete\(/,
  /\.insert\(/,
  
  // Borders
  /\.borders\./,
];

// ═══════════════════════════════════════════════════════════════
// CODE VALIDATOR
// ═══════════════════════════════════════════════════════════════

export function validateCode(code: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];
  const apiCallsDetected: string[] = [];
  let sanitizedCode = code;

  // 1. Remove markdown fences if present
  sanitizedCode = sanitizedCode.replace(/^```(?:javascript|js|typescript|ts)?\n?/gi, "");
  sanitizedCode = sanitizedCode.replace(/\n?```$/gi, "");
  sanitizedCode = sanitizedCode.trim();

  // 2. Check for banned patterns
  for (const banned of BANNED_PATTERNS) {
    const matches = sanitizedCode.match(banned.pattern);
    if (matches) {
      errors.push({
        type: "banned_api",
        message: banned.message,
        suggestion: banned.fix,
      });
      
      // Auto-fix some patterns
      if (banned.pattern.source.includes("redeclare")) {
        sanitizedCode = sanitizedCode.replace(banned.pattern, "// [REMOVED] ");
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
      suggestion: "Add 'await context.sync();' after .load() calls before accessing loaded properties",
    });
  }
  
  if (loadCalls > syncCalls * 2) {
    warnings.push("Multiple .load() calls - consider batching with a single context.sync() for performance");
  }

  // 4. Check for basic syntax errors
  try {
    // Try to parse as function body
    new Function("context", "sheet", "Excel", `return (async () => { ${sanitizedCode} })();`);
  } catch (syntaxError: any) {
    errors.push({
      type: "syntax",
      message: syntaxError.message,
      suggestion: "Check for missing brackets, semicolons, or typos",
    });
  }

  // 5. Detect API calls being used
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
      message: "eval() is not allowed for security reasons",
      suggestion: "Remove eval() call",
    });
  }
  
  if (/Function\s*\(/i.test(sanitizedCode) && !/new\s+Function/.test(sanitizedCode)) {
    warnings.push("Direct Function constructor usage detected - ensure it's intentional");
  }

  // 7. Check for common AI mistakes with formulas
  if (/formulas\s*=\s*[^[]/i.test(sanitizedCode)) {
    errors.push({
      type: "type_error",
      message: "formulas must be a 2D array",
      suggestion: "Use range.formulas = [[\"=SUM(A1:A10)\"]] (2D array)",
    });
  }
  
  if (/values\s*=\s*[^[]/i.test(sanitizedCode) && !/values\s*=\s*\[\[/i.test(sanitizedCode)) {
    const match = sanitizedCode.match(/values\s*=\s*("[^"]*"|'[^']*'|\d+)/);
    if (match) {
      errors.push({
        type: "type_error",
        message: "values must be a 2D array",
        suggestion: `Use range.values = [[${match[1]}]] (2D array)`,
      });
    }
  }

  // 8. Auto-fix sheet redeclarations
  sanitizedCode = sanitizedCode.replace(
    /(?:const|let|var)\s+sheet\s*=\s*context\.workbook\.worksheets\.getActiveWorksheet\(\)\s*;?/g,
    "// sheet already available"
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

const PLANNER_PROMPT = `You are an Excel automation planning expert. Analyze the user's request and create a brief execution plan.

OUTPUT FORMAT (JSON only, no markdown):
{
  "understanding": "One sentence summary of what user wants",
  "steps": ["Step 1", "Step 2", "Step 3"],
  "dataNeeded": ["What data needs to be read from sheet"],
  "expectedOutput": "What the sheet should look like after",
  "complexity": "simple|moderate|complex",
  "warnings": ["Any potential issues or edge cases"]
}

RULES:
- Keep steps actionable and specific
- Identify if data needs to be read first
- Flag complexity based on operations needed
- Note any ambiguities in the request`;

export async function createPlan(task: string, sheetContext: SheetContext | null): Promise<TaskPlan> {
  let contextInfo = "";
  if (sheetContext && sheetContext.hasData) {
    contextInfo = `\n\nCURRENT SHEET CONTEXT:
- Sheet: "${sheetContext.sheetName}"
- Size: ${sheetContext.rowCount} rows × ${sheetContext.columnCount} columns
- Headers: ${sheetContext.headers.join(", ")}
- Data Types: ${sheetContext.dataTypes.join(", ")}`;
  }

  const messages = [
    { role: "system" as const, content: PLANNER_PROMPT },
    { role: "user" as const, content: task + contextInfo },
  ];

  const response = await callLLM(messages);
  
  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as TaskPlan;
    }
  } catch (e) {
    console.warn("Failed to parse plan:", e);
  }

  // Fallback plan
  return {
    understanding: task,
    steps: ["Execute the requested operation"],
    dataNeeded: [],
    expectedOutput: "Modified spreadsheet",
    complexity: "moderate",
    warnings: [],
  };
}

// ═══════════════════════════════════════════════════════════════
// CODER — Generates validated Excel JavaScript code
// ═══════════════════════════════════════════════════════════════

const CODER_SYSTEM_PROMPT = `You are an Excel JavaScript API expert. Generate ONLY executable code.

ENVIRONMENT (pre-declared, DO NOT redeclare):
- context: Excel.RequestContext
- sheet: Active worksheet (already loaded)
- Excel: Namespace for enums

CRITICAL API RULES:
1. Properties require .load() + await context.sync() before reading
2. Writing: range.values = [[...]] (2D array always)
3. Reading: range.load("values"); await context.sync(); // then access range.values
4. Formats: range.format.font.bold, range.format.fill.color, range.format.horizontalAlignment
5. Charts: sheet.charts.add(Excel.ChartType.xxx, dataRange, Excel.ChartSeriesBy.auto)
6. Tables: sheet.tables.add(range, hasHeaders)

BANNED (will crash):
- .getValues(), .getRowCount(), .getColumnCount(), .getAddress() → Use properties after load+sync
- .setValues(), .setFormula() → Use property assignment
- SpreadsheetApp, Logger.log → Wrong platform
- alert(), confirm(), prompt() → Blocked in add-ins
- const sheet = ... → Already declared
- const context = ... → Already declared

MANDATORY writeData HELPER (include this in all code):
function writeData(sheet, startCell, data) {
  if (!data || data.length === 0) return null;
  const rows = data.length;
  const cols = Math.max(...data.map(r => r ? r.length : 0));
  if (cols === 0) return null;
  const normalized = data.map(r => {
    const row = r ? [...r] : [];
    while (row.length < cols) row.push("");
    return row;
  });
  const range = sheet.getRange(startCell).getResizedRange(rows - 1, cols - 1);
  range.values = normalized;
  range.format.autofitColumns();
  return range;
}

OUTPUT: Raw JavaScript code only. No markdown, no explanation.`;

export async function generateCode(
  task: string,
  plan: TaskPlan | null,
  sheetContext: SheetContext | null,
  attachedFiles: AttachedFile[],
  previousError?: string
): Promise<string> {
  let prompt = task;

  // Add plan context
  if (plan) {
    prompt += `\n\nPLAN:\n${plan.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
    if (plan.warnings.length > 0) {
      prompt += `\n\nWATCH OUT FOR:\n${plan.warnings.join("\n")}`;
    }
  }

  // Add sheet context
  if (sheetContext && sheetContext.hasData) {
    prompt += `\n\nSHEET DATA:
- Headers: ${JSON.stringify(sheetContext.headers)}
- Rows: ${sheetContext.rowCount}
- Sample: ${JSON.stringify(sheetContext.sampleData.slice(0, 3))}`;
  }

  // Add error context for retry
  if (previousError) {
    prompt += `\n\nPREVIOUS ERROR: "${previousError}"
FIX THIS ERROR. Output only corrected code.`;
  }

  const messages: any[] = [{ role: "system", content: CODER_SYSTEM_PROMPT }];

  // Handle file attachments (vision)
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

  let code = await callLLM(messages);

  // Clean up response
  code = code.replace(/^```(?:javascript|js|typescript|ts)?\n?/gi, "");
  code = code.replace(/\n?```$/gi, "");
  code = code.trim();

  return code;
}

// ═══════════════════════════════════════════════════════════════
// FIXER — Repairs code based on validation or runtime errors
// ═══════════════════════════════════════════════════════════════

const FIXER_SYSTEM_PROMPT = `You are an Excel JavaScript API debugger. Fix the broken code.

COMMON FIXES:
1. .getValues() → .load("values") + await context.sync() + .values
2. .getRowCount() → .load("rowCount") + await context.sync() + .rowCount
3. range.values = "text" → range.values = [["text"]]
4. const sheet = ... → REMOVE (already declared)
5. SpreadsheetApp → Use sheet (Excel JS API)
6. chart.setTitle() → chart.title.text = "..."

OUTPUT: Fixed code only. No explanation, no markdown fences.`;

export async function fixCode(
  originalCode: string,
  errors: ValidationError[],
  runtimeError?: string
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

  let fixedCode = await callLLM(messages);

  // Clean response
  fixedCode = fixedCode.replace(/^```(?:javascript|js|typescript|ts)?\n?/gi, "");
  fixedCode = fixedCode.replace(/\n?```$/gi, "");

  return fixedCode.trim();
}

// ═══════════════════════════════════════════════════════════════
// ORCHESTRATOR — Main agent loop (LangGraph-inspired)
// ═══════════════════════════════════════════════════════════════

export interface OrchestratorConfig {
  maxRetries: number;
  enablePlanning: boolean;
  strictValidation: boolean;
  timeout: number;
}

const DEFAULT_CONFIG: OrchestratorConfig = {
  maxRetries: 3,
  enablePlanning: true,
  strictValidation: true,
  timeout: 30000,
};

export interface OrchestratorResult {
  success: boolean;
  code: string;
  plan: TaskPlan | null;
  validation: ValidationResult | null;
  error?: string;
  retries: number;
  duration: number;
}

export async function runAgent(
  task: string,
  sheetContext: SheetContext | null,
  attachedFiles: AttachedFile[],
  config: Partial<OrchestratorConfig> = {}
): Promise<OrchestratorResult> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const startTime = Date.now();
  
  let plan: TaskPlan | null = null;
  let code = "";
  let validation: ValidationResult | null = null;
  let retries = 0;

  try {
    // ═══ PHASE 1: PLANNING ═══
    if (cfg.enablePlanning && !attachedFiles.length) {
      try {
        plan = await createPlan(task, sheetContext);
        console.log("[Agent] Plan created:", plan);
      } catch (e) {
        console.warn("[Agent] Planning failed, proceeding without plan:", e);
      }
    }

    // ═══ PHASE 2: CODE GENERATION ═══
    code = await generateCode(task, plan, sheetContext, attachedFiles);
    console.log("[Agent] Initial code generated");

    // ═══ PHASE 3: VALIDATION LOOP ═══
    for (let attempt = 0; attempt <= cfg.maxRetries; attempt++) {
      validation = validateCode(code);

      if (validation.isValid) {
        console.log(`[Agent] Code validated successfully on attempt ${attempt + 1}`);
        break;
      }

      if (attempt < cfg.maxRetries) {
        console.log(`[Agent] Validation failed (attempt ${attempt + 1}), fixing...`);
        code = await fixCode(code, validation.errors);
        retries++;
      }
    }

    // Final validation check
    validation = validateCode(code);
    
    if (!validation.isValid && cfg.strictValidation) {
      throw new Error(
        `Code validation failed: ${validation.errors.map((e) => e.message).join("; ")}`
      );
    }

    // Use sanitized code
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
// EXECUTE WITH RECOVERY — Safe code execution with auto-fix
// ═══════════════════════════════════════════════════════════════

export async function executeWithRecovery(
  code: string,
  executor: (code: string) => Promise<void>,
  maxRetries: number = 2
): Promise<{ success: boolean; error?: string; finalCode: string }> {
  let currentCode = code;
  let lastError = "";

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await executor(currentCode);
      return { success: true, finalCode: currentCode };
    } catch (error: any) {
      lastError = error.message || String(error);
      console.warn(`[Agent] Execution failed (attempt ${attempt + 1}):`, lastError);

      if (attempt < maxRetries) {
        // Try to fix based on runtime error
        currentCode = await fixCode(currentCode, [], lastError);
        
        // Re-validate fixed code
        const validation = validateCode(currentCode);
        if (validation.isValid) {
          currentCode = validation.sanitizedCode;
        } else {
          // If still invalid, try one more fix round
          currentCode = await fixCode(currentCode, validation.errors);
        }
      }
    }
  }

  return { success: false, error: lastError, finalCode: currentCode };
}

// ═══════════════════════════════════════════════════════════════
// UTILITY: Read current sheet context
// ═══════════════════════════════════════════════════════════════

export async function readSheetContext(): Promise<SheetContext | null> {
  try {
    // @ts-ignore - Excel is global in Office Add-ins
    return await Excel.run(async (context: any) => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      sheet.load("name");

      const usedRange = sheet.getUsedRange();
      usedRange.load("values,rowCount,columnCount");
      await context.sync();

      if (usedRange.rowCount === 0 || usedRange.columnCount === 0) {
        return {
          sheetName: sheet.name,
          rowCount: 0,
          columnCount: 0,
          headers: [],
          sampleData: [],
          dataTypes: [],
          hasData: false,
        };
      }

      const values = usedRange.values;
      const headers = values[0].map((h: any) => String(h || "").trim());

      // Detect data types
      const dataTypes: string[] = [];
      if (values.length > 1) {
        for (let col = 0; col < usedRange.columnCount; col++) {
          const colValues = values.slice(1).map((row: any[]) => row[col]).filter((v: any) => v != null && v !== "");
          if (colValues.length === 0) {
            dataTypes.push("empty");
          } else if (colValues.every((v: any) => !isNaN(Number(v)))) {
            dataTypes.push("number");
          } else if (colValues.every((v: any) => /^\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}/.test(String(v)))) {
            dataTypes.push("date");
          } else {
            dataTypes.push("text");
          }
        }
      }

      return {
        sheetName: sheet.name,
        rowCount: usedRange.rowCount,
        columnCount: usedRange.columnCount,
        headers,
        sampleData: values.slice(0, 10),
        dataTypes,
        hasData: true,
      };
    });
  } catch (e) {
    console.error("Failed to read sheet context:", e);
    return null;
  }
}
