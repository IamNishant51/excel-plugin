/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/services/agent-orchestrator.ts":
/*!********************************************!*\
  !*** ./src/services/agent-orchestrator.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPlan: function() { return /* binding */ createPlan; },
/* harmony export */   executeWithRecovery: function() { return /* binding */ executeWithRecovery; },
/* harmony export */   fixCode: function() { return /* binding */ fixCode; },
/* harmony export */   generateCode: function() { return /* binding */ generateCode; },
/* harmony export */   readSheetContext: function() { return /* binding */ readSheetContext; },
/* harmony export */   runAgent: function() { return /* binding */ runAgent; },
/* harmony export */   validateCode: function() { return /* binding */ validateCode; }
/* harmony export */ });
/* harmony import */ var _llm_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./llm.service */ "./src/services/llm.service.ts");
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



// ═══════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// BANNED PATTERNS — These cause runtime errors in Excel JS API
// ═══════════════════════════════════════════════════════════════

const BANNED_PATTERNS = [
// Method calls that don't exist
{
  pattern: /\.getColumnCount\s*\(\s*\)/g,
  message: "getColumnCount() doesn't exist",
  fix: "load('columnCount') then use .columnCount property"
}, {
  pattern: /\.getRowCount\s*\(\s*\)/g,
  message: "getRowCount() doesn't exist",
  fix: "load('rowCount') then use .rowCount property"
}, {
  pattern: /\.getAddress\s*\(\s*\)/g,
  message: "getAddress() doesn't exist",
  fix: "load('address') then use .address property"
}, {
  pattern: /\.getValues\s*\(\s*\)/g,
  message: "getValues() doesn't exist",
  fix: "load('values') then use .values property"
}, {
  pattern: /\.getText\s*\(\s*\)/g,
  message: "getText() doesn't exist",
  fix: "load('text') then use .text property"
}, {
  pattern: /\.setValues\s*\(/g,
  message: "setValues() doesn't exist",
  fix: "Use range.values = [[...]] assignment"
}, {
  pattern: /\.setFormula\s*\(/g,
  message: "setFormula() doesn't exist",
  fix: "Use range.formulas = [[...]] assignment"
}, {
  pattern: /\.setValue\s*\(/g,
  message: "setValue() doesn't exist",
  fix: "Use range.values = [[value]] assignment"
}, {
  pattern: /\.clearFormat\s*\(\s*\)/g,
  message: "clearFormat() doesn't exist",
  fix: "Use .clear(Excel.ClearApplyTo.Formats)"
}, {
  pattern: /\.clearFormats\s*\(\s*\)/g,
  message: "clearFormats() doesn't exist",
  fix: "Use .clear(Excel.ClearApplyTo.Formats)"
}, {
  pattern: /\.clearValue\s*\(\s*\)/g,
  message: "clearValue() doesn't exist",
  fix: "Use .clear(Excel.ClearApplyTo.Contents)"
}, {
  pattern: /\.clearValues\s*\(\s*\)/g,
  message: "clearValues() doesn't exist",
  fix: "Use .clear(Excel.ClearApplyTo.Contents)"
},
// Google Apps Script contamination
{
  pattern: /SpreadsheetApp/g,
  message: "SpreadsheetApp is Google Apps Script, not Excel",
  fix: "Use Excel JavaScript API (sheet, context, Excel namespace)"
}, {
  pattern: /Logger\.log/g,
  message: "Logger.log is Google Apps Script",
  fix: "Use console.log or remove logging"
}, {
  pattern: /Browser\.msgBox/g,
  message: "Browser.msgBox is Google Apps Script",
  fix: "Remove - UI dialogs not supported in Excel Add-ins"
}, {
  pattern: /Utilities\./g,
  message: "Utilities is Google Apps Script",
  fix: "Use native JavaScript methods"
},
// Wrong chart API
{
  pattern: /chart\.setTitle\s*\(/g,
  message: "chart.setTitle() doesn't exist",
  fix: "Use chart.title.text = '...'"
}, {
  pattern: /chart\.add\s*\(/g,
  message: "chart.add() doesn't exist",
  fix: "Use sheet.charts.add()"
},
// Wrong range methods
{
  pattern: /range\.getItem\s*\(/g,
  message: "range.getItem() doesn't exist",
  fix: "Use range.getCell(row, col)"
}, {
  pattern: /range\.select\s*\(\s*\)/g,
  message: "range.select() causes performance issues",
  fix: "Remove - selection not needed for automation"
}, {
  pattern: /range\.activate\s*\(\s*\)/g,
  message: "range.activate() causes performance issues",
  fix: "Remove - activation not needed for automation"
},
// Wrong format paths
{
  pattern: /range\.font\.bold/g,
  message: "range.font.bold path is wrong",
  fix: "Use range.format.font.bold"
}, {
  pattern: /range\.alignment/g,
  message: "range.alignment doesn't exist",
  fix: "Use range.format.horizontalAlignment or range.format.verticalAlignment"
}, {
  pattern: /range\.format\.alignment/g,
  message: "range.format.alignment object doesn't exist",
  fix: "Use range.format.horizontalAlignment directly"
}, {
  pattern: /range\.horizontal/g,
  message: "range.horizontal doesn't exist",
  fix: "Use range.format.horizontalAlignment"
},
// UI methods that don't work in add-ins
{
  pattern: /message\.alert\s*\(/g,
  message: "message.alert() doesn't exist in add-ins",
  fix: "Remove - use status messages in add-in UI instead"
}, {
  pattern: /alert\s*\(/g,
  message: "alert() doesn't work in add-ins",
  fix: "Remove - JavaScript alert blocked in Office Add-ins"
}, {
  pattern: /confirm\s*\(/g,
  message: "confirm() doesn't work in add-ins",
  fix: "Remove - JavaScript confirm blocked in Office Add-ins"
}, {
  pattern: /prompt\s*\(/g,
  message: "prompt() doesn't work in add-ins",
  fix: "Remove - JavaScript prompt blocked in Office Add-ins"
},
// Variable redeclaration (context and sheet are pre-declared)
{
  pattern: /(?:const|let|var)\s+context\s*=/g,
  message: "context is already declared",
  fix: "Remove declaration - context is provided"
}, {
  pattern: /(?:const|let|var)\s+sheet\s*=\s*context\.workbook/g,
  message: "sheet is already declared",
  fix: "Remove declaration - sheet is provided"
},
// Invalid range references
// Invalid range references
{
  pattern: /getRange\s*\(\s*["']?[A-Z]0["']?\s*\)/gi,
  message: "Row 0 doesn't exist in Excel",
  fix: "Use row 1 or higher (e.g., A1, B1)"
}, {
  pattern: /getCell\s*\(\s*-?\d+\s*,\s*-?\d+\s*\)/g,
  message: "Negative cell indices are invalid",
  fix: "Use 0 or positive indices"
},
// Invalid worksheet methods
{
  pattern: /sheet\.clear\s*\(/g,
  message: "sheet.clear() doesn't exist in Excel JS API",
  fix: "Use sheet.getUsedRange().clear()"
}];

// ═══════════════════════════════════════════════════════════════
// ALLOWED API WHITELIST — Only these Excel JS API calls are safe
// ═══════════════════════════════════════════════════════════════

const ALLOWED_API_PATTERNS = [
// Core objects
/context\.workbook/, /context\.sync\(\)/, /sheet\./, /Excel\./,
// Range operations
/\.getRange\(/, /\.getUsedRange\(/, /\.getCell\(/, /\.getRow\(/, /\.getColumn\(/, /\.getResizedRange\(/, /\.getOffsetRange\(/, /\.getEntireRow\(/, /\.getEntireColumn\(/, /\.getLastCell\(/, /\.getLastRow\(/, /\.getLastColumn\(/, /\.getBoundingRect\(/, /\.getIntersection\(/,
// Load operations
/\.load\(/,
// Value assignment (via property)
/\.values\s*=/, /\.formulas\s*=/, /\.numberFormat\s*=/,
// Format operations
/\.format\./, /\.autofitColumns\(/, /\.autofitRows\(/,
// Table operations
/\.tables\./,
// Chart operations
/\.charts\./,
// Data operations
/\.sort\./, /\.autoFilter\./, /\.dataValidation\./, /\.conditionalFormats\./,
// Worksheet operations
/\.worksheets\./, /\.freezePanes\./,
// Clear operations
/\.clear\(/, /\.delete\(/, /\.insert\(/,
// Borders
/\.borders\./];

// ═══════════════════════════════════════════════════════════════
// CODE VALIDATOR
// ═══════════════════════════════════════════════════════════════

function validateCode(code) {
  const errors = [];
  const warnings = [];
  const apiCallsDetected = [];
  let sanitizedCode = code;

  // 1. Remove markdown fences if present
  sanitizedCode = sanitizedCode.replace(/^```(?:javascript|js|typescript|ts)?\n?/gi, "");
  sanitizedCode = sanitizedCode.replace(/\n?```$/gi, "");
  sanitizedCode = sanitizedCode.trim();

  // 2. Check for banned patterns and apply auto-fixes
  for (const banned of BANNED_PATTERNS) {
    const matches = sanitizedCode.match(banned.pattern);
    if (matches) {
      // Priority fixes (Auto-replace common hallucinations)
      if (banned.message.includes("clearFormats")) {
        sanitizedCode = sanitizedCode.replace(banned.pattern, ".clear(Excel.ClearApplyTo.Formats)");
      } else if (banned.message.includes("clearValue")) {
        sanitizedCode = sanitizedCode.replace(banned.pattern, ".clear(Excel.ClearApplyTo.Contents)");
      } else if (banned.pattern.source.includes("redeclare")) {
        sanitizedCode = sanitizedCode.replace(banned.pattern, "// [REMOVED] ");
      } else {
        // Only add error if we couldn't auto-fix it
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
      suggestion: "Add 'await context.sync();' after .load() calls before accessing loaded properties"
    });
  }
  if (loadCalls > syncCalls * 2) {
    warnings.push("Multiple .load() calls - consider batching with a single context.sync() for performance");
  }

  // 4. Check for basic syntax errors
  try {
    // Try to parse as function body
    new Function("context", "sheet", "Excel", `return (async () => { ${sanitizedCode} })();`);
  } catch (syntaxError) {
    errors.push({
      type: "syntax",
      message: syntaxError.message,
      suggestion: "Check for missing brackets, semicolons, or typos"
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
      suggestion: "Remove eval() call"
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
      suggestion: "Use range.formulas = [[\"=SUM(A1:A10)\"]] (2D array)"
    });
  }
  if (/values\s*=\s*[^[]/i.test(sanitizedCode) && !/values\s*=\s*\[\[/i.test(sanitizedCode)) {
    const match = sanitizedCode.match(/values\s*=\s*("[^"]*"|'[^']*'|\d+)/);
    if (match) {
      errors.push({
        type: "type_error",
        message: "values must be a 2D array",
        suggestion: `Use range.values = [[${match[1]}]] (2D array)`
      });
    }
  }

  // 8. Auto-fix sheet redeclarations
  sanitizedCode = sanitizedCode.replace(/(?:const|let|var)\s+sheet\s*=\s*context\.workbook\.worksheets\.getActiveWorksheet\(\)\s*;?/g, "// sheet already available");
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
async function createPlan(task, sheetContext, signal) {
  let contextInfo = "";
  if (sheetContext && sheetContext.hasData) {
    contextInfo = `\n\nCURRENT SHEET CONTEXT:
- Sheet: "${sheetContext.sheetName}"
- Size: ${sheetContext.rowCount} rows × ${sheetContext.columnCount} columns
- Headers: ${sheetContext.headers.join(", ")}
- Data Types: ${sheetContext.dataTypes.join(", ")}`;
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
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
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
    warnings: []
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
5. Always check rowCount and columnCount before using getRow or formatting
6. Use context-aware formatting: adapt colors, fonts, borders, and row heights based on sheet type (office, banking, school, etc.)
7. Clearing Formats ONLY: range.clear(Excel.ClearApplyTo.Formats)
8. Clearing ALL content in sheer: sheet.getUsedRange().clear()
9. Charts: sheet.charts.add(Excel.ChartType.xxx, dataRange, Excel.ChartSeriesBy.auto)
10. Tables: sheet.tables.add(range, hasHeaders)
11. Document Extraction: ALWAYS extract data as a flat HORIZONTAL table (Headers in row 1, data appended below). NEVER mimic vertical document layouts or create key-value lists (e.g., "Name: Bob" in column A). All data text must be a visible color (e.g. black).
12. Memory Lifetime: If saving an object (like usedRange) to a variable used across multiple context.sync() calls, ALWAYS pin it: context.trackedObjects.add(usedRange)

BANNED (will crash):
- sheet.clear() → Worksheet lacks this method. Use sheet.getUsedRange().clear()
- .getValues(), .getRowCount(), .getColumnCount(), .getAddress() → Use properties after load+sync
- .setValues(), .setFormula() → Use property assignment
- .clearFormats() → Use .clear(Excel.ClearApplyTo.formats)
- SpreadsheetApp, Logger.log → Wrong platform
- alert(), confirm(), prompt() → Blocked in add-ins
- const sheet = ... → Already declared
- const context = ... → Already declared

MANDATORY HELPERS (available in environment, use them):
function writeData(sheet, startCell, data): Range // Safely writes 2D array and expands matrix
function formatTableStyle(usedRange, headerColor, fontColor): void // Safely styles the table and handles row bounds without throwing properties errors

SAFE FORMATTING TEMPLATE (adapt details based on sheet type):
// Step 1: Get used range, track it to prevent expiration, and load properties
const usedRange = sheet.getUsedRange();
context.trackedObjects.add(usedRange);
usedRange.load("values,rowCount,columnCount,address");
await context.sync();

// Step 2: Check if sheet has data
if (!usedRange || usedRange.rowCount < 1 || usedRange.columnCount < 1) {
  throw new Error("Sheet appears empty. Add some data first.");
}

// Step 3: Format the range efficiently using the built-in helper
formatTableStyle(usedRange, "#1B2A4A", "#FFFFFF");
await context.sync();

// Step 5: Add borders to all cells
usedRange.format.borders.getItem("InsideHorizontal").style = "Thin";
usedRange.format.borders.getItem("InsideVertical").style = "Thin";
usedRange.format.borders.getItem("EdgeTop").style = "Thin";
usedRange.format.borders.getItem("EdgeBottom").style = "Thin";
usedRange.format.borders.getItem("EdgeLeft").style = "Thin";
usedRange.format.borders.getItem("EdgeRight").style = "Thin";

// Step 6: Add medium bottom border under header
headerRow.format.borders.getItem("EdgeBottom").style = "Medium";
headerRow.format.borders.getItem("EdgeBottom").color = "#1B2A4A"; // Adapt color for sheet type

// Step 7: Freeze first row
sheet.freezePanes.freezeRows(1);

// Step 8: Auto-fit columns
usedRange.format.autofitColumns();
await context.sync();

OUTPUT: Raw JavaScript code only. No markdown, no explanation.`;
async function generateCode(task, plan, sheetContext, attachedFiles, previousError, signal) {
  let prompt = task;

  // Add plan context
  // (Removed problematic template string, use only string concatenation below)

  // Add plan context
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

  // Add sheet context
  if (sheetContext && sheetContext.hasData) {
    prompt += '\n\nSHEET DATA:\n';
    prompt += '- Headers: ' + JSON.stringify(sheetContext.headers) + '\n';
    prompt += '- Rows: ' + sheetContext.rowCount + '\n';
    prompt += '- Sample: ' + JSON.stringify(sheetContext.sampleData.slice(0, 3)) + '\n';
  }

  // Add error context for retry
  if (previousError) {
    prompt += '\n\nPREVIOUS ERROR: "' + previousError + '"\nFIX THIS ERROR. Output only corrected code.';
  }
  // Prepare LLM messages with coder system prompt
  const messages = [{
    role: "system",
    content: CODER_SYSTEM_PROMPT
  }];
  if (attachedFiles.length > 0) {
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
  let code = await (0,_llm_service__WEBPACK_IMPORTED_MODULE_0__.callLLM)(messages, undefined, signal);

  // Clean up response: remove surrounding triple-backtick fences and optional language tag
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

const FIXER_SYSTEM_PROMPT = `You are an Excel JavaScript API debugger. Fix the broken code.

COMMON FIXES:
1. .getValues() → .load("values") + await context.sync() + .values
2. .getRowCount() → .load("rowCount") + await context.sync() + .rowCount
3. range.values = "text" → range.values = [["text"]]
4. const sheet = ... → REMOVE (already declared)
5. SpreadsheetApp → Use sheet (Excel JS API)
6. chart.setTitle() → chart.title.text = "..."

OUTPUT: Fixed code only. No explanation, no markdown fences.`;
async function fixCode(originalCode, errors, runtimeError, signal) {
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

  // Clean response
  fixedCode = fixedCode.replace(/^```(?:javascript|js|typescript|ts)?\n?/gi, "");
  fixedCode = fixedCode.replace(/\n?```$/gi, "");
  return fixedCode.trim();
}

// ═══════════════════════════════════════════════════════════════
// ORCHESTRATOR — Main agent loop (LangGraph-inspired)
// ═══════════════════════════════════════════════════════════════

const DEFAULT_CONFIG = {
  maxRetries: 3,
  enablePlanning: true,
  strictValidation: true,
  timeout: 30000
};
async function runAgent(task, sheetContext, attachedFiles) {
  let config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  let signal = arguments.length > 4 ? arguments[4] : undefined;
  const cfg = {
    ...DEFAULT_CONFIG,
    ...config
  };
  const startTime = Date.now();
  let plan = null;
  let code = "";
  let validation = null;
  let retries = 0;
  try {
    // ═══ PHASE 1: PLANNING ═══
    if (cfg.enablePlanning && !attachedFiles.length) {
      try {
        plan = await createPlan(task, sheetContext, signal);
        console.log("[Agent] Plan created:", plan);
      } catch (e) {
        if (e.name === 'AbortError') throw e;
        console.warn("[Agent] Planning failed, proceeding without plan:", e);
      }
    }

    // ═══ PHASE 2: CODE GENERATION ═══
    code = await generateCode(task, plan, sheetContext, attachedFiles, undefined, signal);
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
        code = await fixCode(code, validation.errors, undefined, signal);
        retries++;
      }
    }

    // Final validation check
    validation = validateCode(code);
    if (!validation.isValid && cfg.strictValidation) {
      throw new Error(`Code validation failed: ${validation.errors.map(e => e.message).join("; ")}`);
    }

    // Use sanitized code
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
// EXECUTE WITH RECOVERY — Safe code execution with auto-fix
// ═══════════════════════════════════════════════════════════════

async function executeWithRecovery(code, executor) {
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
      console.warn(`[Agent] Execution failed (attempt ${attempt + 1}):`, lastError);
      if (attempt < maxRetries) {
        // Try to fix based on runtime error
        currentCode = await fixCode(currentCode, [], lastError, signal);

        // Re-validate fixed code
        const validation = validateCode(currentCode);
        if (validation.isValid) {
          currentCode = validation.sanitizedCode;
        } else {
          // If still invalid, try one more fix round
          currentCode = await fixCode(currentCode, validation.errors, undefined, signal);
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
// UTILITY: Read current sheet context
// ═══════════════════════════════════════════════════════════════

async function readSheetContext() {
  try {
    // @ts-ignore - Excel is global in Office Add-ins
    return await Excel.run(async context => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      sheet.load("name");
      const usedRange = sheet.getUsedRangeOrNullObject();
      usedRange.load("values,rowCount,columnCount,isNullObject");
      await context.sync();
      if (usedRange.isNullObject || usedRange.rowCount === 0 || usedRange.columnCount === 0) {
        return {
          sheetName: sheet.name,
          rowCount: 0,
          columnCount: 0,
          headers: [],
          sampleData: [],
          dataTypes: [],
          hasData: false
        };
      }
      const values = usedRange.values;
      const headers = values[0].map(h => String(h || "").trim());

      // Detect data types
      const dataTypes = [];
      if (values.length > 1) {
        for (let col = 0; col < usedRange.columnCount; col++) {
          const colValues = values.slice(1).map(row => row[col]).filter(v => v != null && v !== "");
          if (colValues.length === 0) {
            dataTypes.push("empty");
          } else if (colValues.every(v => !isNaN(Number(v)))) {
            dataTypes.push("number");
          } else if (colValues.every(v => /^\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}/.test(String(v)))) {
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
        hasData: true
      };
    });
  } catch (e) {
    console.error("Failed to read sheet context:", e);
    return null;
  }
}

/***/ }),

/***/ "./src/services/chat-prompt.ts":
/*!*************************************!*\
  !*** ./src/services/chat-prompt.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHAT_PROMPT: function() { return /* binding */ CHAT_PROMPT; },
/* harmony export */   CONTEXT_PROMPT: function() { return /* binding */ CONTEXT_PROMPT; }
/* harmony export */ });
/**
 * SheetOS AI — Planning Mode (Chat) System Prompt
 * Conversational AI that helps users plan, learn, and strategize Excel work.
 */
const CHAT_PROMPT = `You are SheetOS AI — a friendly, expert Excel assistant in Planning Mode.

YOUR ROLE:
- Help users plan their spreadsheet work
- Explain Excel concepts, formulas, and best practices
- Suggest approaches before executing
- Answer questions about data organization, analysis, and visualization
- Provide formula examples and explanations
- When given sheet context, analyze the USER'S ACTUAL DATA and answer questions directly using the data provided
- If the user asks for details about a person or entity (e.g., "What are John's contact details?"), and you see that entity in the 🚨 SEARCH HITS, provide all relevant information from that row.

CONTEXT AWARENESS:
When a message includes [SHEET CONTEXT], you have access to the user's ACTUAL Excel data!
- Analyze the real column names, data types, and sample values
- Give SPECIFIC answers or suggestions based on their actual data structure
- Reference their exact column names in your response
- Suggest improvements tailored to their dataset
- Point out data quality issues you observe (empty cells, inconsistent formats, etc.)
- You CAN see their sheet — do NOT say "I don't have access to your sheet"
- If you see 🚨 SEARCH HITS in the context, these are specific values found in the sheet. Use them to answer questions like "Where is X?", "Does Y exist?", or "Give me details on Z". Reference the exact cell address shown in the match.
- Answering questions about existing data should be done DIRECTLY in chat. You do NOT need Agent Mode for simple information retrieval.

RESPONSE FORMAT RULES:
1. Respond in natural, conversational language
2. Use markdown-style formatting for emphasis: **bold**, *italic*, \`code\`
3. When showing formulas, wrap them in backticks: \`=VLOOKUP(A2, Sheet2!A:B, 2, FALSE)\`
4. Use bullet points and numbered lists for clarity
5. Keep responses concise but thorough (aim for 2-5 paragraphs max)
6. If the user's request requires MODIFYING the sheet (formatting, inserting, complex calculations), mention that they can switch to ⚡ Agent Mode to execute it
7. When you have sheet context, ALWAYS reference the user's actual column names and data

EXCEL EXPERTISE AREAS:
- Information retrieval from the current sheet
- Formula writing & debugging (VLOOKUP, INDEX/MATCH, IF, SUMIFS, etc.)
- Data organization best practices
- Chart type selection guidance
- PivotTable planning
- Data validation strategies
- Conditional formatting approaches
- Dashboard design principles
- Data cleaning strategies
- Performance optimization tips
- Cross-sheet referencing patterns

PERSONALITY:
- Friendly and encouraging
- Uses concrete examples when explaining
- Proactive — suggest improvements the user might not have thought of
- Mentions potential pitfalls or common mistakes to avoid

If the user asks you to MODIFY or EXECUTE something (create, format, calculate), remind them:
"💡 Switch to ⚡ Agent Mode to execute this! I can help you plan it here first."
(Remember: Reading data and answering questions about it can be done here in Chat.)

User Message:
`;

/**
 * Prompt for generating contextual suggestions based on sheet data
 */
const CONTEXT_PROMPT = `You are SheetOS AI. Based on the following spreadsheet data, suggest 3-4 useful actions the user could take. Each suggestion should be a short phrase (5-8 words max). Format as a JSON array of strings. Example: ["Add SUM to numeric columns", "Create a bar chart", "Apply professional formatting"]. Only output the JSON array, nothing else.

Sheet Data:
`;

/***/ }),

/***/ "./src/services/document-extractor.ts":
/*!********************************************!*\
  !*** ./src/services/document-extractor.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COLUMN_ALIASES: function() { return /* binding */ COLUMN_ALIASES; },
/* harmony export */   buildEnhancedPrompt: function() { return /* binding */ buildEnhancedPrompt; },
/* harmony export */   generateExcelCode: function() { return /* binding */ generateExcelCode; },
/* harmony export */   getSchemaExtractionPrompt: function() { return /* binding */ getSchemaExtractionPrompt; },
/* harmony export */   normalizeColumnName: function() { return /* binding */ normalizeColumnName; },
/* harmony export */   parseExtractionResponse: function() { return /* binding */ parseExtractionResponse; },
/* harmony export */   validateExtraction: function() { return /* binding */ validateExtraction; }
/* harmony export */ });
/**
 * Document Extractor Service
 * Schema-aware extraction from PDFs/CVs that only extracts data for specified columns.
 * NO HALLUCINATION - if data doesn't exist, leave it blank.
 */

/**
 * Get the schema-aware extraction prompt
 */
function getSchemaExtractionPrompt(schema) {
  const columnList = schema.columns.map((c, i) => `${i + 1}. "${c}"`).join("\n");
  return `You are a PRECISION DATA EXTRACTOR. Your job is to extract information from documents with ZERO hallucination.

═══════════════════════════════════════════════════════════════════════════════
CRITICAL RULES — MEMORIZE THESE:
═══════════════════════════════════════════════════════════════════════════════

1. **SCHEMA LOCKED**: The user has predefined these columns in Excel. You MUST ONLY extract data for these columns:
${columnList}

2. **NO FABRICATION**: If a piece of information is NOT explicitly present in the document, return an EMPTY STRING (""). Do NOT guess, infer, or make up data.

3. **EXACT MATCHING**: 
   - "Name" → Look for full name (first + last)
   - "Email" → Look for @email patterns
   - "Phone" / "Mobile" / "Contact" → Look for phone numbers
   - "Age" → Look for age OR calculate from DOB if present
   - "Address" → Full address if available
   - "Skills" → Technical skills, languages, tools
   - "Experience" → Years or job titles
   - "Education" → Degrees, institutions
   - "LinkedIn" → LinkedIn URLs only

4. **DATA CLEANING**:
   - Names: Proper Case (John Smith, not JOHN SMITH)
   - Phones: Keep original format or standardize to +1-XXX-XXX-XXXX
   - Emails: Lowercase
   - Dates: Keep as found (Jan 2020 - Dec 2022)

5. **ONE ROW PER DOCUMENT**: Each uploaded PDF/image represents ONE candidate/record. Output exactly one row of data per document.

═══════════════════════════════════════════════════════════════════════════════
OUTPUT FORMAT:
═══════════════════════════════════════════════════════════════════════════════

Return a JSON array of objects. Each object has keys matching the column names EXACTLY.

Example for columns ["Name", "Email", "Phone", "Skills"]:
[
  {"Name": "John Smith", "Email": "john@email.com", "Phone": "+1-555-123-4567", "Skills": "Python, Excel, SQL"},
  {"Name": "Jane Doe", "Email": "jane.doe@company.com", "Phone": "", "Skills": "JavaScript, React"}
]

Note: Jane Doe had no phone number visible in her resume, so it's left as "".

═══════════════════════════════════════════════════════════════════════════════
WHAT NOT TO DO:
═══════════════════════════════════════════════════════════════════════════════

❌ Do NOT add columns that aren't in the schema
❌ Do NOT guess email addresses (e.g., firstname.lastname@company.com)
❌ Do NOT fabricate phone numbers
❌ Do NOT hallucinate skills or experience not mentioned
❌ Do NOT include "N/A", "Not Found", "Unknown" — use "" instead
❌ Do NOT include markdown formatting — ONLY raw JSON

═══════════════════════════════════════════════════════════════════════════════
NOW EXTRACT FROM THE ATTACHED DOCUMENTS:
═══════════════════════════════════════════════════════════════════════════════
`;
}

/**
 * Generate Excel code that writes extracted data to the sheet
 */
function generateExcelCode(columns, data) {
  // Serialize data for JS injection
  const serializedData = JSON.stringify(data, null, 2);
  const serializedColumns = JSON.stringify(columns);
  return `
// ─── Schema-Aware Resume Extraction ───
// Columns: ${columns.join(", ")}
// Records: ${data.length}

// Extracted Data
const columns = ${serializedColumns};
const extractedData = ${serializedData};

// Check if headers exist (row 1)
const headerRange = sheet.getRange("A1").getResizedRange(0, columns.length - 1);
headerRange.load("values");
await context.sync();

const existingHeaders = headerRange.values[0];
const hasHeaders = existingHeaders.some(h => h && h.toString().trim() !== "");

let startRow = 2; // Default: after headers

if (!hasHeaders) {
    // No headers — write them first
    const headerData = [columns];
    const headerWriteRange = writeData(sheet, "A1", headerData);
    if (headerWriteRange) {
        headerWriteRange.format.font.bold = true;
        headerWriteRange.format.fill.color = "#2D6A4F";
        headerWriteRange.format.font.color = "#FFFFFF";
        headerWriteRange.format.rowHeight = 28;
    }
} else {
    // Headers exist — find the last row with data
    const usedRange = sheet.getUsedRange();
    usedRange.load("rowCount");
    await context.sync();
    startRow = usedRange.rowCount + 1;
}

// Convert extracted objects to 2D array matching column order
const dataRows = extractedData.map(record => {
    return columns.map(col => {
        const value = record[col];
        return value !== undefined && value !== null ? String(value) : "";
    });
});

if (dataRows.length > 0) {
    const dataRange = writeData(sheet, "A" + startRow, dataRows);
    
    if (dataRange) {
        // Apply alternating row colors
        for (let i = 0; i < dataRows.length; i++) {
            const row = dataRange.getRow(i);
            if (i % 2 === 0) {
                row.format.fill.color = "#F0FAF5";
            }
        }
        
        // Apply borders
        const borderStyle = "Thin";
        dataRange.format.borders.getItem("InsideHorizontal").style = borderStyle;
        dataRange.format.borders.getItem("InsideVertical").style = borderStyle;
        dataRange.format.borders.getItem("EdgeTop").style = borderStyle;
        dataRange.format.borders.getItem("EdgeBottom").style = borderStyle;
        dataRange.format.borders.getItem("EdgeLeft").style = borderStyle;
        dataRange.format.borders.getItem("EdgeRight").style = borderStyle;
    }
}

// Final autofit
sheet.getUsedRange().format.autofitColumns();
`;
}

/**
 * Parse LLM response to extract JSON data
 */
function parseExtractionResponse(response) {
  // Clean the response - remove markdown code blocks
  let cleaned = response.trim();
  cleaned = cleaned.replace(/^```json?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");
  cleaned = cleaned.trim();

  // Try to find JSON array in the response
  const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.warn("No JSON array found in response:", cleaned.substring(0, 200));
    return [];
  }
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) {
      console.warn("Parsed result is not an array");
      return [];
    }
    return parsed;
  } catch (e) {
    console.error("JSON parse error:", e);
    return [];
  }
}

/**
 * Validate extracted data against schema
 */
function validateExtraction(data, schema) {
  const warnings = [];
  const unmappedFields = [];

  // Check each row for unmapped fields
  data.forEach((row, index) => {
    Object.keys(row).forEach(key => {
      if (!schema.columns.includes(key) && !unmappedFields.includes(key)) {
        unmappedFields.push(key);
      }
    });

    // Check for empty required fields
    schema.columns.forEach(col => {
      if (!row[col] || row[col].toString().trim() === "") {
        warnings.push(`Row ${index + 1}: "${col}" is empty`);
      }
    });
  });
  if (unmappedFields.length > 0) {
    warnings.push(`Found data for columns not in schema: ${unmappedFields.join(", ")}`);
  }
  return {
    success: data.length > 0,
    data,
    warnings,
    unmappedFields
  };
}

/**
 * Common column name mappings for intelligent matching
 */
const COLUMN_ALIASES = {
  "Name": ["Full Name", "Candidate Name", "Applicant Name", "First Name", "First", "Naam"],
  "Email": ["E-mail", "Email Address", "E-Mail", "Mail", "Contact Email"],
  "Phone": ["Mobile", "Mobile No", "Mobile Number", "Contact", "Contact No", "Phone Number", "Tel", "Telephone"],
  "Age": ["Years", "DOB", "Date of Birth", "Birth Date"],
  "Address": ["Location", "City", "Current Location", "Residence"],
  "Skills": ["Technical Skills", "Key Skills", "Skillset", "Expertise", "Technologies"],
  "Experience": ["Work Experience", "Total Experience", "Years of Experience", "Professional Experience"],
  "Education": ["Qualification", "Degree", "Academic", "Educational Qualification"],
  "LinkedIn": ["LinkedIn URL", "LinkedIn Profile", "Profile URL"],
  "Company": ["Current Company", "Organization", "Employer", "Current Employer"],
  "Position": ["Role", "Job Title", "Designation", "Current Role", "Title"],
  "Summary": ["Profile Summary", "About", "Objective", "Career Objective"]
};

/**
 * Normalize column name to standard form
 */
function normalizeColumnName(columnName) {
  const normalized = columnName.trim();

  // Check direct match first
  if (COLUMN_ALIASES[normalized]) {
    return normalized;
  }

  // Check aliases
  for (const [standard, aliases] of Object.entries(COLUMN_ALIASES)) {
    if (aliases.some(alias => alias.toLowerCase() === normalized.toLowerCase())) {
      return standard;
    }
  }
  return normalized;
}

/**
 * Build extraction prompt with column aliases for better matching
 */
function buildEnhancedPrompt(columns) {
  const columnDetails = columns.map(col => {
    const aliases = COLUMN_ALIASES[col] || [];
    const aliasHint = aliases.length > 0 ? ` (also look for: ${aliases.slice(0, 3).join(", ")})` : "";
    return `• "${col}"${aliasHint}`;
  }).join("\n");
  return `
COLUMNS TO EXTRACT:
${columnDetails}

Remember: If you cannot find data for a column, return "". Never guess or fabricate.
`;
}

/***/ }),

/***/ "./src/services/prompt.ts":
/*!********************************!*\
  !*** ./src/services/prompt.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SYSTEM_PROMPT: function() { return /* binding */ SYSTEM_PROMPT; }
/* harmony export */ });
/**
 * SheetOS AI — Bulletproof System Prompt v2.0
 * Optimized for zero hallucination + production reliability.
 * 
 * Key improvements:
 * - Explicit API whitelist and blacklist
 * - More examples for common patterns
 * - Better error prevention
 * - Anti-hallucination guards
 */
const SYSTEM_PROMPT = `You are SheetOS AI, an Excel JavaScript API expert. Generate ONLY executable JS code.

═══════════════════════════════════════════════════════════════════════════════
ENVIRONMENT (Already available — DO NOT redeclare these):
═══════════════════════════════════════════════════════════════════════════════
- context: Excel.RequestContext (ready to use)
- sheet: Active worksheet (already loaded)
- Excel: Namespace for enums (Excel.ChartType, Excel.BorderLineStyle, etc.)

═══════════════════════════════════════════════════════════════════════════════
CRITICAL RULES (MUST FOLLOW):
═══════════════════════════════════════════════════════════════════════════════
1. OUTPUT: Raw executable JavaScript ONLY. No markdown, no explanations.
2. NO REDECLARATIONS: Never write "const context = ..." or "const sheet = ..."
3. LOAD BEFORE READ: Properties like .values, .rowCount require .load() + await context.sync()
4. 2D ARRAYS: range.values and range.formulas MUST be 2D arrays: [[value]]
5. SYNC OFTEN: Call await context.sync() after every .load() before accessing properties
6. SAFETY: Always check if range/data exists before operating on it

═══════════════════════════════════════════════════════════════════════════════
BANNED PATTERNS (WILL CRASH — NEVER USE):
═══════════════════════════════════════════════════════════════════════════════
❌ .getValues()         → Use: range.load("values"); await context.sync(); range.values
❌ .getRowCount()       → Use: range.load("rowCount"); await context.sync(); range.rowCount
❌ .getColumnCount()    → Use: range.load("columnCount"); await context.sync(); range.columnCount
❌ .getAddress()        → Use: range.load("address"); await context.sync(); range.address
❌ .getText()           → Use: range.load("text"); await context.sync(); range.text
❌ .setValues(x)        → Use: range.values = [[x]]
❌ .setFormula(x)       → Use: range.formulas = [["=SUM(A:A)"]]
❌ .setValue(x)         → Use: range.values = [[x]]
❌ range.font.bold      → Use: range.format.font.bold
❌ range.alignment      → Use: range.format.horizontalAlignment
❌ chart.setTitle(x)    → Use: chart.title.text = x
❌ chart.add()          → Use: sheet.charts.add()
❌ range.getItem()      → Use: range.getCell(row, col)
❌ range.select()       → REMOVE (causes performance issues)
❌ range.activate()     → REMOVE (not needed)
❌ SpreadsheetApp       → WRONG PLATFORM (this is Google Apps Script)
❌ Logger.log()         → REMOVE or use console.log
❌ Browser.msgBox()     → REMOVE (not available)
❌ alert() / confirm()  → REMOVE (blocked in add-ins)
❌ message.alert()      → REMOVE (doesn't exist)
❌ getRange("A0")       → Row 0 doesn't exist. Use A1 or higher.
❌ const context = ...  → ALREADY DECLARED
❌ const sheet = ...    → ALREADY DECLARED

═══════════════════════════════════════════════════════════════════════════════
CORRECT PATTERNS (COPY THESE):
═══════════════════════════════════════════════════════════════════════════════

// ─── Read Data from Sheet ───
const usedRange = sheet.getUsedRange();
usedRange.load("values,rowCount,columnCount");
await context.sync();
const data = usedRange.values; // Now accessible
const rows = usedRange.rowCount;
const cols = usedRange.columnCount;

// ─── Write Data (Single Cell) ───
sheet.getRange("A1").values = [["Hello World"]];

// ─── Write Data (Multiple Cells) ───
sheet.getRange("A1:C2").values = [
  ["Name", "Age", "City"],
  ["John", 25, "NYC"]
];

// ─── Formulas ───
sheet.getRange("D2").formulas = [["=SUM(B2:C2)"]];
// Multiple formulas:
sheet.getRange("D2:D5").formulas = [
  ["=SUM(B2:C2)"],
  ["=SUM(B3:C3)"],
  ["=SUM(B4:C4)"],
  ["=SUM(B5:C5)"]
];

// ─── Formatting ───
const r = sheet.getRange("A1:D1");
r.format.font.bold = true;
r.format.font.color = "#FFFFFF";
r.format.fill.color = "#4472C4";
r.format.horizontalAlignment = "Center";
r.format.verticalAlignment = "Center";
r.format.rowHeight = 28;

// ─── Borders ───
const range = sheet.getRange("A1:D10");
range.format.borders.getItem("InsideHorizontal").style = "Thin";
range.format.borders.getItem("InsideVertical").style = "Thin";
range.format.borders.getItem("EdgeTop").style = "Thin";
range.format.borders.getItem("EdgeBottom").style = "Thin";
range.format.borders.getItem("EdgeLeft").style = "Thin";
range.format.borders.getItem("EdgeRight").style = "Thin";

// ─── Charts ───
const chartRange = sheet.getRange("A1:B5");
const chart = sheet.charts.add(Excel.ChartType.columnClustered, chartRange, Excel.ChartSeriesBy.auto);
chart.title.text = "Sales Report";
chart.setPosition("E2", "L15");

// ─── Tables ───
const tableRange = sheet.getRange("A1:D10");
const table = sheet.tables.add(tableRange, true);
table.name = "SalesTable";
table.style = "TableStyleMedium9";

// ─── Conditional Formatting ───
const cfRange = sheet.getRange("C2:C100");
const cf = cfRange.conditionalFormats.add(Excel.ConditionalFormatType.cellValue);
cf.cellValue.format.fill.color = "#92D050";
cf.cellValue.rule = { formula1: "=50", operator: "GreaterThan" };

// ─── Data Validation (Dropdown) ───
sheet.getRange("E2:E100").dataValidation.rule = {
  list: { inCellDropDown: true, source: "Yes,No,Maybe" }
};

// ─── Sort ───
sheet.getUsedRange().sort.apply([{ key: 0, ascending: true }]);

// ─── Filter ───
const filterRange = sheet.getUsedRange();
filterRange.autoFilter.apply(filterRange, 0);

// ─── Freeze Panes ───
sheet.freezePanes.freezeRows(1);

// ─── Number Format ───
sheet.getRange("B2:B100").numberFormat = [["$#,##0.00"]];
sheet.getRange("C2:C100").numberFormat = [["0.0%"]];

// ─── Clear Contents ───
sheet.getUsedRange().clear(Excel.ClearApplyTo.Contents);

// ─── New Worksheet ───
const newSheet = context.workbook.worksheets.add("Report");
newSheet.activate();

// ─── Autofit Columns (ALWAYS DO THIS AT END) ───
sheet.getUsedRange().format.autofitColumns();

// ─── Data Cleanup (Trim Whitespace) ───
const range = sheet.getUsedRange();
range.load("values");
await context.sync();
const cleanValues = range.values.map(row => 
  row.map(cell => (typeof cell === "string" ? cell.trim() : cell))
);
range.values = cleanValues;
await context.sync();

// ─── Data Cleanup (Remove Empty Rows) ───
const rangeToClean = sheet.getUsedRange();
rangeToClean.load("values,rowCount");
await context.sync();
for (let i = rangeToClean.rowCount - 1; i >= 0; i--) {
  const rowVals = rangeToClean.values[i];
  if (rowVals.every(v => v === null || v === "")) {
    sheet.getRange((i + 1) + ":" + (i + 1)).delete(Excel.DeleteShiftDirection.up);
  }
}
await context.sync();

═══════════════════════════════════════════════════════════════════════════════
MANDATORY writeData HELPER (Include this for any data writing):
═══════════════════════════════════════════════════════════════════════════════
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

═══════════════════════════════════════════════════════════════════════════════
ANTI-HALLUCINATION RULES (For Document/PDF Extraction):
═══════════════════════════════════════════════════════════════════════════════
1. EXTRACT ONLY WHAT YOU SEE: Never invent data that isn't in the image/PDF
2. EMPTY IF MISSING: If a field (phone, email, etc.) isn't visible, use "" not "N/A"
3. NO GUESSING: Don't make up names, numbers, or dates
4. PRESERVE EXACT TEXT: Copy text exactly as shown (don't "fix" typos unless asked)
5. ONE ROW PER DOCUMENT: Each PDF/resume = exactly one data row
6. MATCH SCHEMA: If column headers exist, ONLY extract data for those columns

═══════════════════════════════════════════════════════════════════════════════
DESIGN BEST PRACTICES:
═══════════════════════════════════════════════════════════════════════════════
1. HEADERS: Bold, dark background (#1B4D3E or #2D6A4F), white text
2. NUMBERS: Currency "$#,##0.00", Percentage "0.0%", Integer "#,##0"
3. DATES: Format as "Short Date" or "YYYY-MM-DD" string
4. COLORS: Professional muted tones — no neon, no pure red/blue
5. ZEBRA STRIPES: White and light gray (#F5F5F5) alternating rows
6. ROW HEIGHT: Headers 28px, Data 20px
7. ALWAYS: End with sheet.getUsedRange().format.autofitColumns()

═══════════════════════════════════════════════════════════════════════════════
SCHEMA-AWARE EXTRACTION (When EXISTING_COLUMNS provided):
═══════════════════════════════════════════════════════════════════════════════
When given "EXISTING_COLUMNS: [...]":
1. Extract ONLY data matching those columns
2. Use intelligent matching: "Phone" = "Mobile No" = "Contact Number"
3. Leave cells empty ("") if data not found — NEVER write "Not Found"
4. Append to first empty row after existing data

User Prompt:
`;

/***/ }),

/***/ "./src/taskpane/taskpane.ts":
/*!**********************************!*\
  !*** ./src/taskpane/taskpane.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runAICommand: function() { return /* binding */ runAICommand; }
/* harmony export */ });
/* harmony import */ var _taskpane_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./taskpane.css */ "./src/taskpane/taskpane.css");
/* harmony import */ var _services_llm_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/llm.service */ "./src/services/llm.service.ts");
/* harmony import */ var _services_prompt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/prompt */ "./src/services/prompt.ts");
/* harmony import */ var _services_chat_prompt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/chat-prompt */ "./src/services/chat-prompt.ts");
/* harmony import */ var _services_cache__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/cache */ "./src/services/cache.ts");
/* harmony import */ var _services_document_extractor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/document-extractor */ "./src/services/document-extractor.ts");
/* harmony import */ var _services_pdfService__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/pdfService */ "./src/services/pdfService.ts");
/* harmony import */ var _services_agent_orchestrator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/agent-orchestrator */ "./src/services/agent-orchestrator.ts");
/* harmony import */ var pdfjs_dist__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! pdfjs-dist */ "./node_modules/pdfjs-dist/build/pdf.js");
/* harmony import */ var pdfjs_dist__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(pdfjs_dist__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _services_icons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../services/icons */ "./src/services/icons.ts");
/* global console, Excel, document, window, Office */











// Worker setup for PDF.js
try {
  // @ts-ignore
  pdfjs_dist__WEBPACK_IMPORTED_MODULE_8__.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs_dist__WEBPACK_IMPORTED_MODULE_8__.version}/pdf.worker.min.js`;
} catch (e) {
  console.warn("PDF Worker setup failed:", e);
}

// ─── Types ─────────────────────────────────────────────────────

// ─── State ─────────────────────────────────────────────────────
let currentMode = "planning";
let currentCategory = "cleanup";
let schemaExtractionMode = false; // When true, use column headers from Excel
const chatHistory = [];
let chatConversation = [];
let isChatBusy = false;
let attachedFiles = []; // Array of attached files
let chatAbortController = null;
let agentAbortController = null;
let rawPDFFiles = []; // Store raw File objects for text-based batch extraction
let batchAbortController = null;

// ─── Quick Actions by Category ─────────────────────────────────
const CATEGORIZED_ACTIONS = {
  // ── Data Cleanup ──
  cleanup: [{
    icon: "eraser",
    label: "Smart Clean 🧹",
    prompt: "Analyze the used range. Perform 'Smart Cleaning': (1) Trim all whitespace. (2) Convert text-numbers to real numbers. (3) Standardize dates to Short Date format. (4) Remove completely empty rows. (5) Remove duplicate rows. (6) Convert text columns to Proper Case. Write a summary of changes in a new cell comment."
  }, {
    icon: "eraser",
    label: "Remove Duplicates",
    prompt: "Find and remove duplicate rows from the data, keeping the first occurrence of each."
  }, {
    icon: "eraser",
    label: "Trim Spaces",
    prompt: "Trim all leading and trailing whitespace from every cell in the used range."
  }, {
    icon: "eraser",
    label: "Fix Empty Rows",
    prompt: "Find and delete all completely empty rows within the used data range."
  }, {
    icon: "search",
    label: "Find Blanks",
    prompt: "Highlight all blank cells in the used range with a light yellow background color (#FFF3CD)."
  }, {
    icon: "hash",
    label: "Fix Number Format",
    prompt: "Detect columns with numbers stored as text and convert them back to proper numbers."
  }, {
    icon: "eraser",
    label: "Standardize Case",
    prompt: "Convert all text in column A to proper case (first letter capitalized, rest lowercase)."
  }, {
    icon: "eraser",
    label: "Clear Formatting",
    prompt: "Clear all formatting from the used range while keeping data, then auto-fit all columns."
  }, {
    icon: "copy",
    label: "Split Column",
    prompt: "Split the data in column A by comma delimiter into separate columns B, C, D."
  }, {
    icon: "eraser",
    label: "Remove Hyperlinks",
    prompt: "Find all cells in the used range. Remove all hyperlinks while keeping the cell values. Set the font color of all cells to black and remove any underlines to ensure a consistent, professional appearance."
  }],
  // ── Natural Language Formula Generator ──
  formulas: [{
    icon: "formula",
    label: "Formula Doctor 🚑",
    prompt: "Analyze the active cell/formula. (1) Explain the logic in a cell note. (2) If there is an error (#VALUE, #REF), FIX it and explain the fix. (3) If it's a value, suggest a formula. Expertly debug."
  }, {
    icon: "formula",
    label: "Auto SUM",
    prompt: "Add a SUM formula at the bottom of each numeric column with a bold TOTAL label in column A."
  }, {
    icon: "formula",
    label: "AVERAGE Row",
    prompt: "Add an AVERAGE formula at the bottom of each numeric column with a bold AVERAGE label."
  }, {
    icon: "formula",
    label: "COUNT & COUNTA",
    prompt: "Add COUNT and COUNTA formulas at the bottom to count numeric and non-empty cells in each column."
  }, {
    icon: "formula",
    label: "VLOOKUP Setup",
    prompt: "Analyze the data and set up a VLOOKUP section: create a lookup area to the right of the data where user can type a search value in one cell, and VLOOKUP automatically returns matching data from the table. Add labels and formatting to make it clear how to use it."
  }, {
    icon: "formula",
    label: "SUMIF by Category",
    prompt: "Detect the category column (text) and numeric columns in the data. Create a summary section below the data that uses SUMIF to total each unique category. Add labels, formatting, and a bold grand total row."
  }, {
    icon: "formula",
    label: "IF Conditional",
    prompt: "Add a new Status column at the end of the data. Use an IF formula to classify each row: if the last numeric column value is above the average, mark it 'Above Average', otherwise 'Below Average'. Format green for above, red for below."
  }, {
    icon: "trendUp",
    label: "Running Total",
    prompt: "Add a 'Running Total' column at the end of the data that calculates a cumulative sum of the main numeric column, row by row. Format it with a subtle blue background and number format with commas."
  }, {
    icon: "sortAsc",
    label: "Rank Values",
    prompt: "Add a 'Rank' column at the end of the data that ranks each row by the primary numeric column (largest = rank 1). Highlight the top 3 with gold/green backgrounds. Auto-fit all columns."
  }],
  // ── Smart Formatter (Canva for Excel) ──
  format: [{
    icon: "paintbrush",
    label: "Make Professional",
    prompt: `Apply professional formatting to the sheet. Use this EXACT safe pattern:

// Step 1: Get used range and load properties
const usedRange = sheet.getUsedRange();
usedRange.load("values,rowCount,columnCount,address");
await context.sync();

// Step 2: Check if sheet has data
if (!usedRange || usedRange.rowCount < 1 || usedRange.columnCount < 1) {
  throw new Error("Sheet appears empty. Add some data first.");
}

const rowCount = usedRange.rowCount;
const colCount = usedRange.columnCount;

// Step 3: Format header row (row 1)
const headerRow = usedRange.getRow(0);
headerRow.format.set({
  font: { bold: true, size: 11, color: "#FFFFFF" },
  fill: { color: "#1B2A4A" },
  horizontalAlignment: "Center",
  verticalAlignment: "Center",
  rowHeight: 28
});

// Step 4: Format data rows with alternating colors
for (let i = 1; i < rowCount; i++) {
  const row = usedRange.getRow(i);
  row.format.set({
    fill: { color: i % 2 === 0 ? "#F4F5F7" : "#FFFFFF" },
    rowHeight: 22
  });
}

// Step 5: Add borders and freeze pane
usedRange.format.borders.getItem("InsideHorizontal").style = "Thin";
usedRange.format.borders.getItem("InsideVertical").style = "Thin";
usedRange.format.borders.getItem("EdgeTop").style = "Thin";
usedRange.format.borders.getItem("EdgeBottom").style = "Thin";
usedRange.format.borders.getItem("EdgeLeft").style = "Thin";
usedRange.format.borders.getItem("EdgeRight").style = "Thin";

headerRow.format.borders.getItem("EdgeBottom").style = "Medium";
headerRow.format.borders.getItem("EdgeBottom").color = "#1B2A4A";

sheet.freezePanes.freezeRows(1);
usedRange.format.autofitColumns();
await context.sync();`
  }, {
    icon: "paintbrush",
    label: "Executive Style",
    prompt: `Apply executive presentation style using this EXACT safe pattern:

const usedRange = sheet.getUsedRange();
usedRange.load("values,rowCount,columnCount");
await context.sync();

if (!usedRange || usedRange.rowCount < 1) {
  throw new Error("Sheet appears empty.");
}

const rowCount = usedRange.rowCount;

// Header styling
const headerRow = usedRange.getRow(0);
headerRow.format.font.bold = true;
headerRow.format.font.size = 11;
headerRow.format.font.color = "#FFFFFF";
headerRow.format.fill.color = "#34495E";
headerRow.format.horizontalAlignment = "Center";
headerRow.format.rowHeight = 30;

// Data rows with subtle alternating
for (let i = 1; i < rowCount; i++) {
  const row = usedRange.getRow(i);
  row.format.fill.color = i % 2 === 0 ? "#F8F9FA" : "#FFFFFF";
  row.format.rowHeight = 22;
}

// Light gray borders
usedRange.format.borders.getItem("InsideHorizontal").style = "Thin";
usedRange.format.borders.getItem("InsideHorizontal").color = "#DEE2E6";
usedRange.format.borders.getItem("InsideVertical").style = "Thin";
usedRange.format.borders.getItem("InsideVertical").color = "#DEE2E6";
usedRange.format.borders.getItem("EdgeTop").style = "Thin";
usedRange.format.borders.getItem("EdgeBottom").style = "Thin";
usedRange.format.borders.getItem("EdgeLeft").style = "Thin";
usedRange.format.borders.getItem("EdgeRight").style = "Thin";

// Freeze header
sheet.freezePanes.freezeRows(1);
usedRange.format.autofitColumns();
await context.sync();`
  }, {
    icon: "paintbrush",
    label: "Minimal Clean",
    prompt: `Apply minimal modern formatting:

const usedRange = sheet.getUsedRange();
usedRange.load("rowCount,columnCount");
await context.sync();

if (!usedRange || usedRange.rowCount < 1) {
  throw new Error("Sheet appears empty.");
}

// Clear existing formatting
usedRange.format.fill.clear();
usedRange.format.borders.getItem("InsideHorizontal").style = "None";
usedRange.format.borders.getItem("InsideVertical").style = "None";
usedRange.format.borders.getItem("EdgeTop").style = "None";
usedRange.format.borders.getItem("EdgeBottom").style = "None";
usedRange.format.borders.getItem("EdgeLeft").style = "None";
usedRange.format.borders.getItem("EdgeRight").style = "None";

// Header: bold, dark text, bottom border only
const headerRow = usedRange.getRow(0);
headerRow.format.font.bold = true;
headerRow.format.font.size = 11;
headerRow.format.font.color = "#111827";
headerRow.format.borders.getItem("EdgeBottom").style = "Thin";
headerRow.format.borders.getItem("EdgeBottom").color = "#D1D5DB";
headerRow.format.rowHeight = 28;

// Data rows: smaller font, gray text
for (let i = 1; i < usedRange.rowCount; i++) {
  const row = usedRange.getRow(i);
  row.format.font.size = 10;
  row.format.font.color = "#374151";
  row.format.rowHeight = 22;
}

usedRange.format.autofitColumns();
await context.sync();`
  }, {
    icon: "paintbrush",
    label: "Dark Theme",
    prompt: `Apply dark theme formatting:

const usedRange = sheet.getUsedRange();
usedRange.load("rowCount,columnCount");
await context.sync();

if (!usedRange || usedRange.rowCount < 1) {
  throw new Error("Sheet appears empty.");
}

const rowCount = usedRange.rowCount;

// All cells: dark background, light text
usedRange.format.fill.color = "#1E1E1E";
usedRange.format.font.color = "#CCCCCC";

// Header: gold text
const headerRow = usedRange.getRow(0);
headerRow.format.fill.color = "#2D2D2D";
headerRow.format.font.bold = true;
headerRow.format.font.color = "#F0C75E";
headerRow.format.rowHeight = 28;

// Alternating dark rows
for (let i = 1; i < rowCount; i++) {
  const row = usedRange.getRow(i);
  row.format.fill.color = i % 2 === 0 ? "#252525" : "#1E1E1E";
}

// Dark borders
usedRange.format.borders.getItem("InsideHorizontal").style = "Thin";
usedRange.format.borders.getItem("InsideHorizontal").color = "#3A3A3A";
usedRange.format.borders.getItem("InsideVertical").style = "Thin";
usedRange.format.borders.getItem("InsideVertical").color = "#3A3A3A";
usedRange.format.borders.getItem("EdgeTop").style = "Thin";
usedRange.format.borders.getItem("EdgeBottom").style = "Thin";
usedRange.format.borders.getItem("EdgeLeft").style = "Thin";
usedRange.format.borders.getItem("EdgeRight").style = "Thin";

usedRange.format.autofitColumns();
await context.sync();`
  }, {
    icon: "paintbrush",
    label: "Colorful Teal",
    prompt: `Apply colorful teal formatting:

const usedRange = sheet.getUsedRange();
usedRange.load("rowCount");
await context.sync();

if (!usedRange || usedRange.rowCount < 1) {
  throw new Error("Sheet appears empty.");
}

// Header: teal background
const headerRow = usedRange.getRow(0);
headerRow.format.fill.color = "#0D7377";
headerRow.format.font.bold = true;
headerRow.format.font.color = "#FFFFFF";
headerRow.format.horizontalAlignment = "Center";
headerRow.format.rowHeight = 28;

// Alternating light teal and white
for (let i = 1; i < usedRange.rowCount; i++) {
  const row = usedRange.getRow(i);
  row.format.fill.color = i % 2 === 0 ? "#E8F6F3" : "#FFFFFF";
}

// Thin borders
usedRange.format.borders.getItem("InsideHorizontal").style = "Thin";
usedRange.format.borders.getItem("InsideVertical").style = "Thin";
usedRange.format.borders.getItem("EdgeTop").style = "Thin";
usedRange.format.borders.getItem("EdgeBottom").style = "Thin";
usedRange.format.borders.getItem("EdgeLeft").style = "Thin";
usedRange.format.borders.getItem("EdgeRight").style = "Thin";

sheet.freezePanes.freezeRows(1);
usedRange.format.autofitColumns();
await context.sync();`
  }, {
    icon: "snowflake",
    label: "Freeze Header",
    prompt: `Freeze the first row:

sheet.freezePanes.freezeRows(1);
await context.sync();`
  }, {
    icon: "table",
    label: "Excel Table",
    prompt: `Convert data to Excel Table:

const usedRange = sheet.getUsedRange();
usedRange.load("address");
await context.sync();

if (!usedRange) {
  throw new Error("No data found in sheet.");
}

const table = sheet.tables.add(usedRange, true);
table.style = "TableStyleMedium9";
usedRange.format.autofitColumns();
await context.sync();`
  }, {
    icon: "paintbrush",
    label: "Borders All",
    prompt: `Add thin borders to all cells:

const usedRange = sheet.getUsedRange();
usedRange.format.borders.getItem("InsideHorizontal").style = "Thin";
usedRange.format.borders.getItem("InsideVertical").style = "Thin";
usedRange.format.borders.getItem("EdgeTop").style = "Thin";
usedRange.format.borders.getItem("EdgeBottom").style = "Thin";
usedRange.format.borders.getItem("EdgeLeft").style = "Thin";
usedRange.format.borders.getItem("EdgeRight").style = "Thin";
await context.sync();`
  }, {
    icon: "hash",
    label: "Currency $",
    prompt: `Format numeric columns as currency. First read the data to detect numeric columns, then apply $#,##0.00 format.`
  }, {
    icon: "hash",
    label: "Percentage %",
    prompt: `Format the last numeric column as percentage (0.00%) and auto-fit columns.`
  }],
  // ── Report Automation Engine ──
  reports: [{
    icon: "barChart",
    label: "Instant Dashboard 📊",
    prompt: "Analyze the dataset. Create a new sheet 'Dashboard'. Generate 3 professional charts (Bar, Line, Pie) for key trends. Add 'Big Number' cards at top for Totals. Apply modern theme. Make it executive-ready."
  }, {
    icon: "barChart",
    label: "Sales Report",
    prompt: "Generate a professional monthly sales report from the existing data. Do ALL of this: (1) Add a report title row at the top: 'Monthly Sales Report' in bold, font size 14, merged across all columns. (2) Add today's date below the title, right-aligned. (3) Format the data with professional headers (dark navy background, white bold text) and alternating row colors. (4) Add SUM, AVERAGE, MAX, and MIN summary rows at the bottom with labels. (5) Create a clustered column chart from the data showing performance by category. Position it below the summary. (6) Add thin borders throughout and auto-fit all columns."
  }, {
    icon: "barChart",
    label: "Financial Summary",
    prompt: "Build a financial summary report from the data. (1) Add a 'Financial Summary' title merged at top, bold, font size 14. (2) Format headers professionally with dark green (#1B4D3E) background and white text. (3) Format all currency columns as $#,##0.00. (4) Add a TOTAL row with SUM formulas, bold, with a top border. (5) Add a 'Net' or 'Difference' calculation if applicable. (6) Apply conditional formatting: positive numbers in green, negative in red. (7) Create a pie chart showing the breakdown. (8) Auto-fit columns and freeze header row."
  }, {
    icon: "trendUp",
    label: "Performance Review",
    prompt: "Create a team performance report from the data. (1) Add a 'Team Performance Report' title at top, merged, bold, font size 14. (2) Professional header formatting with indigo (#2B3A67) background, white text. (3) Add RANK column based on the primary numeric metric column. (4) Add conditional formatting: top 3 rows highlighted in light green (#E6F4EA), bottom 3 in light red (#FDE8E8). (5) Add AVERAGE, MAX, MIN summary rows at bottom. (6) Create a bar chart showing individual performance, sorted high to low. (7) Auto-fit and add borders."
  }, {
    icon: "barChart",
    label: "Inventory Report",
    prompt: "Generate an inventory status report from the data. (1) Title: 'Inventory Status Report', merged, bold, size 14. (2) Professional formatting with teal (#0D7377) headers. (3) If there's a quantity column, add conditional formatting: red background for items ≤ 10 (low stock), yellow for 11-50 (medium), green for 50+ (healthy). (4) Add a status column with IF formula: 'Critical' for ≤ 10, 'Low' for 11-25, 'OK' for 26-50, 'Good' for 50+. (5) Add summary showing total items, total value (if price column exists), and count by status. (6) Create a pie chart showing stock level distribution."
  }, {
    icon: "barChart",
    label: "Attendance Summary",
    prompt: "Generate an attendance summary report. (1) Title: 'Attendance Summary', merged, bold, size 14. (2) Count Present (P), Absent (A), Leave (L) for each person using COUNTIF. (3) Calculate attendance percentage. (4) Format: professional headers, alternating rows, percentage column formatted as percentage. (5) Conditional formatting on attendance %: green ≥ 90%, yellow 75-89%, red < 75%. (6) Add a column chart showing attendance by person. (7) Add class/team averages at bottom."
  }, {
    icon: "fileTemplate",
    label: "Weekly Status",
    prompt: "Create a weekly status report template: (1) Title: 'Weekly Status Update — Week of [Date]', merged, bold. (2) Section 1: 'Completed This Week' — 5 rows with Task, Owner, Status columns. (3) Section 2: 'In Progress' — 5 rows with Task, Owner, % Complete, ETA columns. (4) Section 3: 'Blockers & Risks' — 3 rows with Issue, Impact, Action Needed columns. (5) Section 4: 'Next Week Plans' — 4 rows. (6) Format each section with colored headers (different subtle colors), thin borders, and auto-fit."
  }],
  // ── Ready-Made Templates ──
  templates: [{
    icon: "fileTemplate",
    label: "Monthly Budget",
    prompt: "Create a monthly budget tracker with categories: Housing, Utilities, Food, Transport, Entertainment, Savings. Add columns for Budget, Actual, and Difference with SUM at bottom. Use professional formatting with green for under-budget and red for over-budget conditional formatting."
  }, {
    icon: "fileTemplate",
    label: "Invoice",
    prompt: "Create a professional invoice template with: Company Name header, Invoice #, Date, Bill To section, items table with Description, Quantity, Unit Price, Total columns, Subtotal, Tax (10%), and Grand Total calculations. Apply clean formatting."
  }, {
    icon: "fileTemplate",
    label: "Employee List",
    prompt: "Create an employee directory with 8 sample employees: Name, Department (HR/Engineering/Marketing/Sales), Email, Phone, Joining Date, Salary. Apply professional table formatting with alternating rows and currency format for salary."
  }, {
    icon: "fileTemplate",
    label: "Project Tracker",
    prompt: "Create a project tracker with 6 sample tasks: Task Name, Assigned To, Priority (High/Medium/Low), Status (Not Started/In Progress/Complete), Start Date, Due Date. Add dropdown validation for Priority and Status. Use conditional formatting for status colors."
  }, {
    icon: "fileTemplate",
    label: "Sales Dashboard",
    prompt: "Create a quarterly sales report with 5 products across Q1-Q4. Add Total column and row with SUM formulas. Create a column chart showing quarterly performance. Apply professional formatting."
  }, {
    icon: "fileTemplate",
    label: "Attendance Sheet",
    prompt: "Create a monthly attendance sheet for 10 employees with dates as columns (1-31). Mark P for present, A for absent, L for leave. Add summary columns for Total Present, Absent, and Leave. Apply conditional formatting."
  }, {
    icon: "fileTemplate",
    label: "Grade Book",
    prompt: "Create a student grade book for 8 students with 5 assignments, Midterm, Final, and Total/Grade columns. Add weighted average formulas and letter grade calculation (A/B/C/D/F). Apply professional formatting with conditional colors."
  }, {
    icon: "fileTemplate",
    label: "Weekly Schedule",
    prompt: "Create a weekly schedule template with time slots from 8 AM to 6 PM (1-hour intervals) and columns for Mon-Fri. Add borders, colored header, and merge the title cell. Apply a clean, readable format."
  }],
  // ── Advanced Analysis (Master Level) ──
  analysis: [{
    icon: "trendUp",
    label: "Pivot Analysis",
    prompt: "Create a new sheet named 'Pivot Analysis'. Select the entire current dataset. Insert a Pivot Table starting at A3. Automatically detect the categorical column for Rows and the numeric column for Values (Sum). Apply the 'PivotStyleMedium9' style."
  }, {
    icon: "barChart",
    label: "Pareto Chart",
    prompt: "Create a Pareto analysis. (1) Copy the data to a new sheet 'Pareto'. (2) Sort by the numeric metric descending. (3) Calculate cumulative percentage. (4) Create a Pareto chart (combo chart: bars for values, line for cumulative %). Add data labels."
  }, {
    icon: "search",
    label: "Find Outliers",
    prompt: "Analyze the numeric column. Calculate Mean and Standard Deviation. Highlight any cell that is more than 2 Standard Deviations away from the Mean in RED (#FFCCCC). Add a note to the cell 'Outlier'."
  }, {
    icon: "sortAsc",
    label: "Correlation Matrix",
    prompt: "Analyze all numeric columns. Create a correlation matrix in a new sheet 'Correlations'. Calculate the correlation coefficient (CORREL) between every pair of numeric variables. Use Conditional Formatting (Color Scale) to highlight strong positive (green) and negative (red) correlations."
  }, {
    icon: "calendar",
    label: "Date Intelligence",
    prompt: "Find the Date column. Insert 4 new columns to the right: Year, Quarter, Month Name, Week Number. Use formulas (=YEAR, =ROUNDUP(MONTH(.)/3,0), =TEXT(.,'mmmm'), =ISOWEEKNUM) to populate them for all rows. Copy and Paste Values to finalize."
  }, {
    icon: "trendUp",
    label: "Forecast 12M",
    prompt: "Analyze the time-series data. Create a new sheet 'Forecast'. Use the FORECAST.ETS function to predict the next 12 months based on historical data. Create a Line Chart showing history (solid) and forecast (dotted) with confidence intervals."
  }, {
    icon: "copy",
    label: "Transpose & Link",
    prompt: "Copy the selected table. Create a new sheet 'Transposed'. Paste the data linked/transposed (=TRANSPOSE(Original!Range)) so it updates automatically. Apply professional formatting."
  }, {
    icon: "filter",
    label: "Advanced Filter",
    prompt: "Create a 'Search' area above the data. Set up a dynamic visual filter: when user types in cell B1, filter the main table rows where the text content contains that value (wildcard match). Use conditional formatting to hide non-matching rows if Filter function is not available."
  }, {
    icon: "hash",
    label: "Frequency Dist",
    prompt: "Create a frequency distribution (histogram data) for the main numeric column. Create bins (groups) automatically. Count the frequency of items in each bin. Output a summary table and a Histogram chart in a new sheet."
  }, {
    icon: "zap",
    label: "Regex Extract",
    prompt: "Analyze the text column. If it contains emails, extract them to a new column 'Email'. If it contains phone numbers, extract and format them. If it contains IDs (like #1234), extract them. Use Flash Fill logic or pattern matching formulas."
  }],
  // ── Document Extraction (Resume/CV Import) ──
  extract: [{
    icon: "fileText",
    label: "📄 Import to Schema",
    prompt: "SCHEMA_EXTRACTION_MODE: Read the column headers in row 1 of the current sheet. For each attached PDF/resume, extract ONLY the data that matches those columns. If a column's data doesn't exist in the PDF, leave it blank. Append each candidate as a new row."
  }, {
    icon: "users",
    label: "📋 Bulk Resume Import",
    prompt: "SCHEMA_EXTRACTION_MODE: Import all attached resumes/CVs. First read existing column headers. If no headers exist, create: Name, Email, Phone, Skills, Experience, Education. Extract data from each PDF and add one row per candidate. Never hallucinate — if data is missing, leave blank."
  }, {
    icon: "fileTemplate",
    label: "📝 HR Database Setup",
    prompt: "Create a professional HR candidate database template with columns: Name, Email, Phone, LinkedIn, Current Company, Current Role, Skills, Years of Experience, Highest Education, Expected Salary, Notes. Apply formatting with filters and freeze header row."
  }, {
    icon: "search",
    label: "🔍 Smart Extract",
    prompt: "SCHEMA_EXTRACTION_MODE: Intelligently analyze the attached documents. Read column headers from the sheet. Match document content to columns using smart aliases (e.g., 'Mobile No' matches 'Phone' column). Only extract what exists — no guessing."
  }, {
    icon: "table",
    label: "📊 Create Schema First",
    prompt: "Before importing, set up your columns: Create header row with: Name, Email, Mobile No, Age, Address, Skills, Experience. Format as a proper table with filters. Now attach PDFs and click 'Import to Schema'."
  }, {
    icon: "checkSquare",
    label: "✅ Validate & Clean",
    prompt: "Validate the extracted data: Check for blank required fields (Name, Email). Highlight rows with missing data in yellow. Add a 'Status' column marking 'Complete' or 'Incomplete' for each row."
  }],
  // ── Smart Tools (Power User Headache Solvers) ──
  smart: [{
    icon: "brain",
    label: "Data Profiler 🔬",
    prompt: `Analyze the entire dataset and create a comprehensive Data Profile report on a NEW sheet called "Data Profile". For each column, calculate: (1) Column Name, (2) Data Type (text/number/date/mixed), (3) Total Count, (4) Blank Count, (5) Blank %, (6) Unique Values Count, (7) Most Common Value, (8) For numeric columns: Min, Max, Mean, Median. Create this as a formatted table with headers. Add a "Data Quality Score" at the top calculated as (100 - average blank %). Apply professional formatting: dark header row, alternating rows, conditional formatting on blank % (green < 5%, yellow 5-20%, red > 20%). Auto-fit all columns.`
  }, {
    icon: "highlight",
    label: "Highlight Duplicates",
    prompt: `Find and highlight ALL duplicate values in the first data column (column A, excluding header).

const usedRange = sheet.getUsedRange();
usedRange.load("values,rowCount,columnCount");
await context.sync();

if (!usedRange || usedRange.rowCount < 2) throw new Error("Need at least 2 rows of data.");

const values = usedRange.values;
const col = 0; // Check column A
const seen = {};
const dupes = new Set();

// Pass 1: find duplicates
for (let i = 1; i < values.length; i++) {
  const val = String(values[i][col]).trim().toLowerCase();
  if (val === "") continue;
  if (seen[val] !== undefined) {
    dupes.add(val);
  }
  seen[val] = i;
}

// Pass 2: highlight them
let count = 0;
for (let i = 1; i < values.length; i++) {
  const val = String(values[i][col]).trim().toLowerCase();
  if (dupes.has(val)) {
    const cell = usedRange.getRow(i);
    cell.format.fill.color = "#FECACA";
    cell.format.font.color = "#991B1B";
    count++;
  }
}
await context.sync();
// Done: highlighted duplicates`
  }, {
    icon: "columns",
    label: "Compare Columns",
    prompt: `Compare columns A and B to find differences. For each row, if A ≠ B, highlight both cells in light red (#FEE2E2). If they match, highlight in light green (#DCFCE7). Add a new column C with 'Match' or 'Mismatch' labels. Add a summary at the bottom showing total matches and mismatches. Format the summary row in bold.`
  }, {
    icon: "formula",
    label: "Auto Summary Row ⚡",
    prompt: `Analyze ALL columns. For each NUMERIC column, add 4 summary rows at the bottom: SUM, AVERAGE, MIN, MAX — with formula labels in column A. Make the summary section visually distinct: add a thick top border, bold labels, and light blue (#EFF6FF) background. Format numbers with commas and 2 decimal places. Auto-fit all columns.`
  }, {
    icon: "crosshair",
    label: "Top/Bottom 5 🎯",
    prompt: `Find the main numeric column in the data. Identify the Top 5 values and highlight their entire rows in green (#DCFCE7). Identify the Bottom 5 values and highlight their rows in red (#FEE2E2). Add a 'Rank' column at the end. Sort the data by the numeric column descending. Auto-fit columns.`
  }, {
    icon: "mail",
    label: "Extract Emails & Phones",
    prompt: `Scan ALL cells in the used range. Extract any email addresses (containing @) and phone numbers (10+ digit patterns). Create a new sheet called "Contacts" with columns: Source Cell, Name (if adjacent), Email, Phone. Remove duplicates. Format as a professional table with filters. Auto-fit columns.`
  }, {
    icon: "layers",
    label: "Unpivot Data",
    prompt: `Convert wide-format data to long format (unpivot). Take the first column as the ID column. Treat all remaining columns as value columns. Create a new sheet "Unpivoted" with 3 columns: the original ID, "Category" (original column header), and "Value" (the cell value). Skip blank values. Apply professional formatting.`
  }, {
    icon: "shield",
    label: "Data Validation Rules",
    prompt: `Analyze column headers and add smart data validation rules. For columns that look like: (1) Email — add text validation requiring '@', (2) Phone — allow only numbers with length 10-15, (3) Date columns — add date validation, (4) Status/Type columns — create dropdown lists from unique existing values, (5) Numeric columns — add number validation (>= 0). Highlight validated columns with a subtle blue header to indicate protection is active.`
  }, {
    icon: "dollarSign",
    label: "Number to Words 💰",
    prompt: `Add a new column next to the main numeric/currency column. For each row, convert the number to words in English (e.g., 1234 → "One Thousand Two Hundred Thirty Four"). This is useful for invoices and checks. Use a helper function that handles numbers up to 999,999,999. Format the words column with proper case and auto-fit.`
  }, {
    icon: "copy",
    label: "Smart Merge Sheets",
    prompt: `Merge data from ALL worksheets in the workbook into a new sheet called "Merged Data". For each sheet: read the headers and data, align columns by header name (smart matching), and append all rows. Remove exact duplicate rows from the final merged data. Add a "Source Sheet" column to track where each row came from. Apply professional formatting with alternating rows.`
  }]
};

// Chat Suggestions (shown on welcome screen)
const CHAT_SUGGESTIONS = [{
  icon: "brain",
  text: "Analyze my data and tell me what's interesting"
}, {
  icon: "formula",
  text: "Which formula should I use for my use case?"
}, {
  icon: "paintbrush",
  text: "Make my sheet look professional in one click"
}, {
  icon: "barChart",
  text: "Generate a monthly report with charts"
}, {
  icon: "search",
  text: "Find all duplicates and inconsistencies"
}, {
  icon: "sparkles",
  text: "What can you do? Show me your best features"
}];

// ─── Initialization ────────────────────────────────────────────
// ─── Global Error Handler ───
window.onerror = function (msg, url, line) {
  const statusEl = document.getElementById("loading-status");
  if (statusEl) {
    statusEl.innerHTML += `<br><span style="color:#d32f2f;font-weight:bold;font-size:11px;">${msg} (Line ${line})</span>`;
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
  }
  return false;
};

// ─── Initialization ────────────────────────────────────────────
Office.onReady(info => {
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
  const clearBtn = document.getElementById("chat-clear");
  if (clearBtn) clearBtn.onclick = clearChat;
  setupChatInput();
  setupScrollToBottom();
  setupAgentKeyboardShortcut();
  setupCharCount();

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
  bindClick("file-remove", () => clearFile(false));
  bindClick("agent-file-btn", () => document.getElementById("agent-file-input").click());
  bindChange("agent-file-input", e => handleFileSelect(e, true));
  bindClick("agent-file-remove", () => clearFile(true));

  // Batch PDF Extraction
  bindClick("batch-extract-btn", runBatchPDFExtraction);

  // Category Tabs
  document.querySelectorAll(".category-tab").forEach(tab => {
    tab.onclick = () => {
      const cat = tab.dataset.category;
      switchCategory(cat);
    };
  });

  // Detect Columns Button (Extract Mode)
  bindClick("detect-columns-btn", detectAndShowColumns);

  // Initial UI Build
  buildQuickActions();
  buildChatSuggestions();
  loadSettingsUI();
});

// ─── Icon Injection ────────────────────────────────────────────
function injectIcons() {
  const el = (id, html) => {
    const node = document.getElementById(id);
    if (node) node.innerHTML = html;
  };
  el("logo-icon", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.fileText);
  el("settings-toggle", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.settings);
  el("docs-toggle", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.helpCircle);
  el("run-icon", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.arrowRight);
  el("chevron-icon", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.chevronDown);
  el("refresh-models", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.refresh);
  el("mode-planning-icon", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.messageCircle);
  el("mode-agent-icon", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.zap);
  el("chat-send-icon", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.send);
  el("chat-clear-icon", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.trash);
  el("welcome-sparkle", _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.sparkles);
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

  // Update tabs
  document.querySelectorAll(".mode-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.mode === mode);
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

  // Show/hide schema info banner for Extract mode
  const schemaInfo = document.getElementById("schema-info");
  const detectedColumns = document.getElementById("detected-columns");
  if (schemaInfo) {
    schemaInfo.style.display = category === "extract" ? "flex" : "none";
  }
  if (detectedColumns) {
    detectedColumns.style.display = category === "extract" && detectedColumns.innerHTML.trim() ? "block" : "none";
  }

  // Update extraction mode flag
  schemaExtractionMode = category === "extract";
  buildQuickActions();
  // Show/hide batch panel when switching to/from extract
  showBatchPanel(category === "extract" && rawPDFFiles.length > 0);
}

// ─── Quick Actions (Agent Mode) ────────────────────────────────
function buildQuickActions() {
  const container = document.getElementById("quick-actions");
  if (!container) return;
  container.innerHTML = "";
  const actions = CATEGORIZED_ACTIONS[currentCategory];
  if (!actions) {
    console.warn(`No quick actions found for category: ${currentCategory}`);
    return;
  }
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
        // Clear status when switching action
        const statusEl = document.getElementById("status-message");
        if (statusEl) statusEl.style.display = "none";
      }
    };
    container.appendChild(chip);
  });
}

// ─── Chat Suggestions (Planning Mode) ──────────────────────────
function buildChatSuggestions() {
  const container = document.getElementById("chat-suggestions");
  if (!container) return;
  CHAT_SUGGESTIONS.forEach(s => {
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

// ─── Panel Toggle ──────────────────────────────────────────────
function togglePanel(panelId) {
  const panel = document.getElementById(panelId);
  const isHidden = (panel === null || panel === void 0 ? void 0 : panel.style.display) === "none" || !(panel !== null && panel !== void 0 && panel.style.display);
  document.querySelectorAll(".panel").forEach(p => {
    p.style.display = "none";
  });
  if (isHidden && panel) {
    panel.style.display = "block";
    if (panelId === "settings-panel") {
      const providerSelect = document.getElementById("setting-provider");
      if (providerSelect && providerSelect.value === "local") loadOllamaModels();
    }
  }
}

// ─── Settings ──────────────────────────────────────────────────
// ─── Settings ──────────────────────────────────────────────────
function loadSettingsUI() {
  const config = (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.getConfig)();
  const providerSelect = document.getElementById("setting-provider");
  if (providerSelect) {
    providerSelect.value = config.provider;
    providerSelect.onchange = e => {
      const p = e.target.value;
      updateProviderFields(p);
      if (p === "local") loadOllamaModels();
    };
  }

  // Populate inputs (safe checks)
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  };
  setVal("setting-api-key", config.apiKey); // Groq
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
  // Local model is populated async

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
  const models = await (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.fetchOllamaModels)(host);
  if (models.length === 0) {
    select.innerHTML = `<option value="" disabled selected>No models found</option>`;
    if (statusEl) {
      statusEl.textContent = "Ollama not running or no models installed";
      statusEl.className = "model-status model-status-warn";
    }
    return;
  }
  const config = (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.getConfig)();
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
  const current = (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.getConfig)();

  // Helper to read val
  const getVal = id => {
    var _document$getElementB3;
    return ((_document$getElementB3 = document.getElementById(id)) === null || _document$getElementB3 === void 0 || (_document$getElementB3 = _document$getElementB3.value) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.trim()) || "";
  };
  const newConfig = {
    ...current,
    provider: provider,
    // Groq
    apiKey: getVal("setting-api-key"),
    groqModel: getVal("setting-groq-model"),
    // Gemini
    geminiKey: getVal("setting-gemini-key"),
    geminiModel: getVal("setting-gemini-model"),
    // OpenAI
    openaiKey: getVal("setting-openai-key"),
    openaiModel: getVal("setting-openai-model"),
    // Anthropic
    anthropicKey: getVal("setting-anthropic-key"),
    anthropicModel: getVal("setting-anthropic-model"),
    // OpenRouter
    openrouterKey: getVal("setting-openrouter-key"),
    openrouterModel: getVal("setting-openrouter-model"),
    // Local
    baseUrl: getVal("setting-base-url") ? `${getVal("setting-base-url").replace(/\/v1.*$/, "")}/v1/chat/completions` : undefined,
    localModel: getVal("setting-local-model") || current.localModel
  };
  (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.saveConfig)(newConfig);

  // Animated save feedback
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

  // Auto-resize textarea
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 80) + "px";
  });

  // Enter to send (Shift+Enter for newline)
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
}
async function sendChatMessage() {
  if (isChatBusy) {
    stopChatGeneration();
    return;
  }
  const input = document.getElementById("chat-input");
  if (!input) return;
  const message = input.value.trim();
  if (!message) return;

  // Clear welcome screen on first message
  const welcome = document.querySelector(".chat-welcome");
  if (welcome) welcome.remove();

  // Add user message
  addChatBubble("user", message);
  chatHistory.push({
    role: "user",
    content: message,
    timestamp: Date.now()
  });

  // Build conversation context with initial sheet overview
  if (chatConversation.length === 0) {
    let initialPrompt = _services_chat_prompt__WEBPACK_IMPORTED_MODULE_3__.CHAT_PROMPT;
    try {
      // Proactively give the AI an overview of the sheet columns at the start
      const overview = await getSheetContext();
      if (overview && overview.hits === 0 && overview.text.length > 20) {
        initialPrompt += "\n\n[INITIAL SHEET OVERVIEW]\n" + overview.text;
      }
    } catch (e) {
      console.warn("Could not load initial sheet overview:", e);
    }
    chatConversation.push({
      role: "system",
      content: initialPrompt
    });
  }

  // 🔥 CONTEXT AWARENESS: Auto-detect if user is asking about their sheet or searching for data
  const needsSheetContext = /\b(this|my|current|opened?)\s+(sheet|data|table|workbook|excel|spreadsheet|sheeet|spreadsheat)\b|\b(find|search|where|is|check|lookup|contains?|exist|details|about|located|who|tell|give)\b|what\s+(do|can|should)|improve|analyze|suggest|help|better|optimize|\b\d{5,}\b|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(message) || /\b[A-Z]{2,}(?:\s+[A-Z]{2,})+\b/.test(message) ||
  // ALL CAPS sequences (Names/IDs)
  /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/.test(message); // Title Case sequences (Names)

  if (needsSheetContext) {
    try {
      const contextResult = await getSheetContext(message);
      if (contextResult) {
        const {
          text,
          hits
        } = contextResult;

        // Add to persistent conversation context
        chatConversation.push({
          role: "system",
          content: `The following data was retrieved from the user's sheet for this query:\n${text}`
        });

        // Show context indicator
        const lastBubble = document.querySelector('.chat-msg.user:last-child .chat-bubble');
        if (lastBubble) {
          const badge = document.createElement('span');
          badge.className = 'context-badge';
          badge.innerHTML = hits > 0 ? `🔍 Found ${hits} search hits in sheet` : '📊 Sheet context loaded';
          lastBubble.appendChild(badge);
        }
      }
    } catch (e) {
      console.warn('Could not load sheet context:', e);
    }
  }
  chatConversation.push({
    role: "user",
    content: message
  });

  // Clear input
  input.value = "";
  input.style.height = "auto";

  // Show skeleton loader
  const skeletonEl = showTypingIndicator();
  isChatBusy = true;

  // Toggle button to Stop
  const chatSendButton = document.getElementById("chat-send");
  const chatSendIcon = document.getElementById("chat-send-icon");
  if (chatSendButton) {
    if (chatSendIcon) chatSendIcon.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.stop;
    chatSendButton.classList.add("is-busy");
  }

  // Create AbortController
  chatAbortController = new AbortController();
  try {
    const response = await (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.callLLM)(chatConversation, undefined, chatAbortController.signal);

    // Format AI response
    const formattedResponse = formatChatResponse(response);

    // Create the real bubble
    const newBubble = createChatBubble("ai", "", response);

    // Replace skeleton with the real bubble
    if (skeletonEl) skeletonEl.replaceWith(newBubble);

    // Find the content part of the new bubble to apply the typewriter effect
    const bubbleContent = newBubble.querySelector('.chat-bubble');

    // Stream content
    if (bubbleContent) {
      await typewriterEffect(bubbleContent, formattedResponse);
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
    if (error.name === 'AbortError') {
      if (skeletonEl) skeletonEl.remove();
      addChatBubble("ai", `<p style="color:var(--text-3)"><i>Generation stopped.</i></p>`);
    } else {
      var _error$message;
      if (skeletonEl) skeletonEl.remove();
      addChatBubble("ai", `<p style="color:var(--error)">⚠️ ${error.message}</p>`);
      showToast("error", ((_error$message = error.message) === null || _error$message === void 0 ? void 0 : _error$message.substring(0, 80)) || "Something went wrong");
    }
  } finally {
    isChatBusy = false;
    chatAbortController = null;
    // Reuse outer chatSendButton reference (avoid redeclaring)
    if (chatSendButton) {
      const sendIcon = document.getElementById("chat-send-icon");
      if (sendIcon) sendIcon.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.send;
      chatSendButton.classList.remove("is-busy");
    }
  }
}
async function stopChatGeneration() {
  if (chatAbortController) {
    chatAbortController.abort();
  }
}
async function typewriterEffect(element, html) {
  // 1. Reveal element immediately
  element.innerHTML = "";

  // 2. Parse into tokens (simple tag-preserving tokenizer)
  // We split by tags so we can print text content progressively, but print tags instantly.
  const tokens = html.split(/(<[^>]+>)/g);
  for (const token of tokens) {
    if (token.startsWith("<") && token.endsWith(">")) {
      // It's a tag, append immediately
      element.innerHTML += token;
    } else if (token.trim().length > 0) {
      // It's text, type it out word by word for speed
      const words = token.split(/(\s+)/); // Keep spaces
      for (const word of words) {
        element.innerHTML += word;
        // Scroll to bottom
        const container = document.getElementById("chat-messages");
        if (container) container.scrollTop = container.scrollHeight;
        // Variable delay for realism
        await new Promise(r => setTimeout(r, Math.random() * 10 + 5));
      }
    }
  }
}
function createChatBubble(role, htmlContent, rawContent) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-msg ${role}`;
  const bubbleDiv = document.createElement("div");
  bubbleDiv.className = "chat-bubble";
  bubbleDiv.innerHTML = htmlContent;

  // If AI message, add action buttons
  if (role === "ai" && rawContent) {
    // Actions bar with copy + switch to agent
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "chat-bubble-actions";

    // Copy button
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
      }).catch(() => {
        showToast("error", "Failed to copy");
      });
    };
    actionsDiv.appendChild(copyBtn);

    // Execute in Agent button
    const execBtn = document.createElement("button");
    execBtn.className = "btn-execute-from-chat";
    execBtn.innerHTML = `${_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.zap} Switch to Agent`;
    execBtn.onclick = () => {
      const agentPromptInput = document.getElementById("prompt-input");
      if (agentPromptInput) {
        agentPromptInput.value = extractActionablePrompt(rawContent);
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

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
  return msgDiv.querySelector('.chat-bubble'); // Return bubble for typewriter
}
function showTypingIndicator() {
  const container = document.getElementById("chat-messages");
  if (!container) throw new Error("Chat messages container not found.");
  const template = document.getElementById("chat-skeleton-template");

  // Fallback to old indicator if template is missing
  if (!template) {
    const oldIndicator = document.createElement("div");
    oldIndicator.className = "chat-msg ai";
    oldIndicator.id = "typing-msg";
    oldIndicator.innerHTML = `<div class="chat-avatar">${_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.bot}</div><div class="chat-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
    container.appendChild(oldIndicator);
    container.scrollTop = container.scrollHeight;
    return oldIndicator;
  }
  const skeleton = template.content.cloneNode(true);
  const skeletonElement = skeleton.firstElementChild;
  if (skeletonElement) {
    skeletonElement.id = 'typing-msg';
    container.appendChild(skeletonElement);
    container.scrollTop = container.scrollHeight;
    return skeletonElement;
  }
  return null; // Should not happen
}
function formatChatResponse(text) {
  let html = text.trim();

  // 1. Headers (### Heading)
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // 2. Tables (| col | col |)
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  const processedLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHtml = '<table>';
      }

      // Skip separator row (|---|---|)
      if (line.includes('---')) continue;
      const cells = line.split('|').filter(c => c.trim() !== '' || line.indexOf('|' + c + '|') !== -1);
      // Clean cells of leading/trailing pipes
      const cleanCells = line.split('|').slice(1, -1).map(c => c.trim());
      tableHtml += '<tr>' + cleanCells.map(c => i === 0 || lines[i - 1] && !lines[i - 1].includes('|') ? `<th>${c}</th>` : `<td>${c}</td>`).join('') + '</tr>';
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</table>';
        processedLines.push(tableHtml);
        tableHtml = '';
      }
      processedLines.push(lines[i]);
    }
  }
  if (inTable) {
    tableHtml += '</table>';
    processedLines.push(tableHtml);
  }
  html = processedLines.join('\n');

  // 3. Code blocks (``` ... ```)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre style="margin:6px 0;padding:8px;background:rgba(0,0,0,0.06);border-radius:6px;font-family:var(--mono);font-size:10px;overflow-x:auto"><code>$2</code></pre>');

  // 4. Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 5. Bold (**bold**)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // 5.1 Italic (*italic*)
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 6. Lists
  // 6.1 Unordered lists (- or * or •)
  html = html.replace(/^[-*•]\s+(.+)$/gm, '<li>$1</li>');

  // 6.2 Numbered lists (1.)
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ol-item">$1</li>');

  // 6.3 Wrap consecutive li items
  html = html.replace(/((?:<li>.*?<\/li>\n?)+)/g, '<ul>$1</ul>');
  html = html.replace(/((?:<li class="ol-item">.*?<\/li>\n?)+)/g, match => {
    return `<ol>${match.replace(/ class="ol-item"/g, '')}</ol>`;
  });

  // 7. Paragraphs
  const blocks = html.split(/\n\n+/);
  html = blocks.map(block => {
    const b = block.trim();
    if (!b) return '';
    // If it starts with a tag already, don't wrap in <p>
    if (/^<(h1|h2|h3|ul|ol|table|pre|p|li|div)/i.test(b)) return b;
    // Otherwise wrap in <p> and handle single newlines as <br>
    return `<p>${b.replace(/\n/g, '<br>')}</p>`;
  }).join('');

  // 8. Visual Polish: Cleanup bullet and paragraph spacing
  html = html.replace(/<p>\s*<ul>/g, '<ul>').replace(/<\/ul>\s*<\/p>/g, '</ul>');
  html = html.replace(/<li>\s*<p>/g, '<li>').replace(/<\/p>\s*<\/li>/g, '</li>');
  return html;
}
function extractActionablePrompt(aiResponse) {
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
function clearChat() {
  const container = document.getElementById("chat-messages");
  container.innerHTML = "";
  chatHistory.length = 0;
  chatConversation = [];
  isChatBusy = false;

  // Re-add welcome screen
  const welcomeHTML = `
    <div class="chat-welcome">
      <img src="assets/icon-80-v2.png" alt="SheetOS Logo" style="width: 64px; height: 64px; margin-bottom: 16px;">
      <h2>What are you working on?</h2>
      <div class="welcome-suggestions" id="chat-suggestions"></div>
    </div>
  `;
  container.innerHTML = welcomeHTML;
  buildChatSuggestions();
}

// ═══════════════════════════════════════════════════════════════
// TOAST NOTIFICATION SYSTEM
// ═══════════════════════════════════════════════════════════════
function showToast(type, message) {
  let duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3000;
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  const iconMap = {
    success: _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.check,
    error: _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.alertCircle,
    info: _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.helpCircle
  };
  toast.innerHTML = `${iconMap[type] || ""}<span>${message}</span>`;
  container.appendChild(toast);

  // Auto-dismiss
  setTimeout(() => {
    toast.classList.add("toast-out");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ═══════════════════════════════════════════════════════════════
// SCROLL-TO-BOTTOM BUTTON
// ═══════════════════════════════════════════════════════════════
function setupScrollToBottom() {
  const chatMessages = document.getElementById("chat-messages");
  const scrollBtn = document.getElementById("scroll-to-bottom");
  if (!chatMessages || !scrollBtn) return;

  // Show/hide based on scroll position
  chatMessages.addEventListener("scroll", () => {
    const isNearBottom = chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight < 100;
    scrollBtn.classList.toggle("visible", !isNearBottom);
  });

  // Click to scroll
  scrollBtn.onclick = () => {
    chatMessages.scrollTo({
      top: chatMessages.scrollHeight,
      behavior: "smooth"
    });
  };
}

// ═══════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════════
function setupAgentKeyboardShortcut() {
  const promptInput = document.getElementById("prompt-input");
  if (!promptInput) return;
  promptInput.addEventListener("keydown", e => {
    // Ctrl+Enter to execute
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runAICommand();
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// CHARACTER COUNT INDICATOR
// ═══════════════════════════════════════════════════════════════
function setupCharCount() {
  var _promptInput$closest;
  const promptInput = document.getElementById("prompt-input");
  if (!promptInput) return;

  // Create and insert char count element
  const charCount = document.createElement("span");
  charCount.className = "char-count";
  charCount.textContent = "";
  const footerLeft = (_promptInput$closest = promptInput.closest(".input-card")) === null || _promptInput$closest === void 0 ? void 0 : _promptInput$closest.querySelector(".footer-left");
  if (footerLeft) {
    footerLeft.appendChild(charCount);
  }
  promptInput.addEventListener("input", () => {
    const len = promptInput.value.length;
    if (len === 0) {
      charCount.textContent = "";
      charCount.className = "char-count";
    } else {
      charCount.textContent = `${len}`;
      if (len > 3000) {
        charCount.className = "char-count danger";
      } else if (len > 2000) {
        charCount.className = "char-count warning";
      } else {
        charCount.className = "char-count";
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// CONTEXT AWARENESS — Read Excel Sheet Data
// ═══════════════════════════════════════════════════════════════

/**
 * Get comprehensive sheet context for AI analysis
 * Returns { text: string, hits: number }
 */
async function getSheetContext(query) {
  try {
    return await Excel.run(async context => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      sheet.load("name");

      // Use getUsedRangeOrNullObject for robustness
      const usedRange = sheet.getUsedRangeOrNullObject();
      usedRange.load("rowCount,columnCount,address,isNullObject");
      await context.sync();
      if (usedRange.isNullObject || usedRange.rowCount === 0 || usedRange.columnCount === 0) {
        return {
          text: "Sheet is empty.",
          hits: 0
        };
      }

      // 1. Get Headers (Row 1)
      const headerRange = usedRange.getRow(0);
      headerRange.load("values");
      await context.sync();
      const headers = headerRange.values[0].map(h => String(h || "").trim());

      // 2. Perform Deep Search if query contains potential search terms
      let deepSearchContext = "";
      let hitsCount = 0;
      if (query) {
        const searchTerms = new Set();
        // 1. ALL CAPS sequences (e.g., MD PRAVEJ ALAM)
        (query.match(/\b[A-Z]{2,}(?:\s+[A-Z]{2,})+\b/g) || []).forEach(t => searchTerms.add(t));

        // 2. Title Case sequences
        (query.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g) || []).forEach(t => searchTerms.add(t));

        // 3. Numbers, Quoted strings, and Emails
        (query.match(/\b\d{5,}\b/g) || []).forEach(t => searchTerms.add(t));
        (query.match(/"([^"]+)"/g) || []).forEach(t => searchTerms.add(t.replace(/"/g, '')));
        (query.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi) || []).forEach(t => searchTerms.add(t));

        // 4. Fallback: Generic phrases
        (query.match(/\b[A-Za-z]{3,}(?:\s+[A-Za-z]{3,}){1,2}\b/g) || []).forEach(t => {
          const commonWords = /^(this|that|sheet|data|name|about|find|search|where|exist|check|lookup|improve|analyze|suggest|help|better|optimize|what|when|where|there|from|with|tell|your|mine|ours|will|shall|should|could|would|please|show|list|their|details|contact|given|into|some|those|these)$/i;
          if (!t.split(/\s+/).every(word => commonWords.test(word))) {
            searchTerms.add(t);
          }
        });
        if (searchTerms.size > 0) {
          const termsArray = Array.from(searchTerms);
          for (const term of termsArray) {
            // Ignore common query words
            if (/^(Name|Sheet|Data|Candidate|Find|Is|This|My|Current|Column|Details|About)$/i.test(term)) continue;
            let foundRange = usedRange.find(term, {
              completeMatch: false,
              matchCase: false
            });
            foundRange.load("address,isNullObject");
            await context.sync();

            // If full term not found, try searching for the longest word in the term
            if (foundRange.isNullObject && term.includes(" ")) {
              const words = term.split(/\s+/).sort((a, b) => b.length - a.length);
              const bestWord = words[0];
              if (bestWord.length > 3) {
                foundRange = usedRange.find(bestWord, {
                  completeMatch: false,
                  matchCase: false
                });
                foundRange.load("address,isNullObject");
                await context.sync();
              }
            }
            if (!foundRange.isNullObject && hitsCount < 10) {
              hitsCount++;
              const row = foundRange.getEntireRow().getIntersection(usedRange);
              row.load("values");
              await context.sync();
              const rowData = row.values[0].map((v, idx) => {
                const header = headers[idx] || `Col ${idx + 1}`;
                const val = v === "" || v === null ? "(empty)" : String(v);
                return `${header}: ${val}`;
              }).join(" | ");
              deepSearchContext += `📌 MATCH [${term}] at ${foundRange.address}:\n   >> ${rowData}\n`;
            }
          }
          if (hitsCount > 0) {
            deepSearchContext += "=".repeat(40) + "\n";
          } else {
            deepSearchContext = "\n(I searched the sheet for your mentioned terms, but no exact matches were found in the current sheet.)\n";
          }
        }

        // 3. Sample data (max 10 rows for general context)
        const sampleSize = Math.min(10, usedRange.rowCount);
        const sampleRange = usedRange.getResizedRange(sampleSize - 1, 0); // Headers included
        sampleRange.load("values");
        await context.sync();
        const sampleData = sampleRange.values;

        // Data type detection
        const columnTypes = [];
        if (sampleData.length > 1) {
          for (let col = 0; col < usedRange.columnCount; col++) {
            const columnValues = sampleData.slice(1).map(row => row[col]).filter(v => v !== null && v !== "");
            if (columnValues.length === 0) {
              columnTypes.push("empty");
            } else if (columnValues.every(v => !isNaN(Number(v)))) {
              columnTypes.push("number");
            } else if (columnValues.every(v => /^\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}/.test(String(v)))) {
              columnTypes.push("date");
            } else {
              columnTypes.push("text");
            }
          }
        }

        // Build context string
        let contextStr = "";
        if (deepSearchContext && deepSearchContext.length > 50) {
          contextStr += `🚨 [CRITICAL DATA HIT] 🚨\n${deepSearchContext}\n\n`;
        }
        contextStr += `--- GENERAL SHEET INFO ---\n`;
        contextStr += `Sheet: "${sheet.name}" (${usedRange.rowCount} rows × ${usedRange.columnCount} columns)\n`;
        contextStr += `Location: ${usedRange.address}\n\n`;
        contextStr += `COLUMNS:\n`;
        headers.forEach((h, i) => {
          const type = columnTypes[i] || "unknown";
          contextStr += `  ${i + 1}. "${h || `Column${i + 1}`}" (${type})\n`;
        });
        contextStr += `\nDATA SAMPLE (First ${sampleSize} rows):\n`;
        sampleData.forEach((row, i) => {
          if (i === 0) {
            contextStr += `  [Headers] ${row.map(c => `"${c}"`).join(" | ")}\n`;
          } else {
            contextStr += `  Row ${i}: ${row.map(c => c === null || c === "" ? "(empty)" : `"${c}"`).join(" | ")}\n`;
          }
        });
        if (usedRange.rowCount > sampleSize) {
          contextStr += `  ... (${usedRange.rowCount - sampleSize} more rows not shown)\n`;
        }
        return {
          text: contextStr,
          hits: hitsCount
        };
      }

      // Even without a query, return a general sheet overview
      const overviewHeaders = headers.filter(h => h.length > 0);
      if (overviewHeaders.length > 0) {
        return {
          text: `Sheet: "${sheet.name}" (${usedRange.rowCount} rows × ${usedRange.columnCount} columns)\nColumns: ${overviewHeaders.join(", ")}`,
          hits: 0
        };
      }
      return null;
    });
  } catch (error) {
    console.error("Error reading sheet context:", error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// SCHEMA-AWARE EXTRACTION — Read Column Headers from Excel
// ═══════════════════════════════════════════════════════════════

/**
 * Read existing column headers from row 1 of the active Excel sheet
 * Returns array of non-empty header names
 */
async function getExcelColumnHeaders() {
  return Excel.run(async context => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();

    // Read first row (A1:Z1) for headers - covers up to 26 columns
    const headerRange = sheet.getRange("A1:Z1");
    headerRange.load("values");
    await context.sync();
    const headers = headerRange.values[0].map(cell => cell ? String(cell).trim() : "").filter(header => header !== "");
    return headers;
  });
}

/**
 * Get count of existing data rows (excluding header)
 */
async function getExistingDataRowCount() {
  return Excel.run(async context => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const usedRange = sheet.getUsedRange();
    usedRange.load("rowCount");
    await context.sync();
    return Math.max(0, usedRange.rowCount - 1); // Subtract header row
  });
}

/**
 * Detect and display column headers in the UI
 */
async function detectAndShowColumns() {
  const btn = document.getElementById("detect-columns-btn");
  const detectedSection = document.getElementById("detected-columns");
  const columnChips = document.getElementById("column-chips");
  const columnCount = document.getElementById("column-count");
  if (!detectedSection || !columnChips || !columnCount) return;

  // Show loading state
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="skeleton-pill sk-shimmer" style="width:80px;height:20px;display:inline-block;"></span>';
  }
  try {
    const columns = await getExcelColumnHeaders();
    if (columns.length === 0) {
      // No columns found
      columnChips.innerHTML = '<span class="column-chip empty-warning">⚠️ No headers in Row 1 — add columns first</span>';
      columnCount.textContent = "0";
      detectedSection.style.display = "block";
    } else {
      // Show detected columns as chips
      columnChips.innerHTML = columns.map(col => `<span class="column-chip">${col}</span>`).join("");
      columnCount.textContent = String(columns.length);
      detectedSection.style.display = "block";
    }
  } catch (e) {
    console.error("Error detecting columns:", e);
    columnChips.innerHTML = '<span class="column-chip empty-warning">⚠️ Error reading Excel</span>';
    columnCount.textContent = "0";
    detectedSection.style.display = "block";
  } finally {
    if (btn) {
      btn.innerHTML = "🔍 Detect";
      btn.disabled = false;
    }
  }
}

/**
 * Build the schema-aware extraction prompt with existing column headers
 */
function buildSchemaExtractionDirective(columns) {
  const columnList = columns.map((c, i) => `${i + 1}. "${c}"`).join("\n");
  const enhancedHints = (0,_services_document_extractor__WEBPACK_IMPORTED_MODULE_5__.buildEnhancedPrompt)(columns);
  return `
═══════════════════════════════════════════════════════════════════════════════
🔒 SCHEMA-LOCKED EXTRACTION MODE — CRITICAL INSTRUCTIONS
═══════════════════════════════════════════════════════════════════════════════

The user has PRE-DEFINED these columns in their Excel sheet. You MUST extract data ONLY for these columns:

${columnList}

${enhancedHints}

EXTRACTION RULES (MEMORIZE THESE):
1. ONE ROW PER DOCUMENT: Each attached PDF/image represents ONE candidate/record.
2. EXACT COLUMN MATCHING: Only fill data for the columns listed above.
3. NO HALLUCINATION: If information for a column is NOT visible in the document, use "" (empty string).
4. NO NEW COLUMNS: Do NOT add any columns that aren't in the list above.
5. PROPER FORMATTING:
   - Names: Proper Case (John Smith)
   - Emails: lowercase
   - Phones: Keep original format or +X-XXX-XXX-XXXX
   - Skills: Comma-separated list

BANNED BEHAVIORS:
❌ Guessing email addresses (e.g., firstname@company.com)
❌ Fabricating phone numbers
❌ Making up skills not explicitly listed
❌ Using "N/A", "Not Found", "Unknown" — use "" instead
❌ Adding extra columns

OUTPUT: Generate Excel JS code that writes the extracted data starting from the first empty row.
The code should use the writeData helper function and format the data professionally.

═══════════════════════════════════════════════════════════════════════════════
`;
}

// ═══════════════════════════════════════════════════════════════
// AGENT MODE — Execute Functions (Enhanced with Orchestrator)
// ═══════════════════════════════════════════════════════════════

const MAX_EXECUTION_RETRIES = 3;
async function runAICommand() {
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

  // Handle File Input
  if (!userPrompt && attachedFiles.length === 0) {
    showStatus(statusEl, "info", "Please enter a command or attach a file.");
    return;
  }

  // Default prompt for files
  if (attachedFiles.length > 0 && !userPrompt) {
    userPrompt = attachedFiles.length > 1 ? `Analyze the ${attachedFiles.length} attached files. Extract and merge all tabular data into a single master table. Standardize headers and columns.` : `Analyze the attached ${attachedFiles[0].type}. Extract all tabular data and write valid Excel JS code to populate the active sheet. Format headers and auto-fit columns.`;
  }

  // Detect Schema Extraction Mode
  const isSchemaMode = userPrompt.includes("SCHEMA_EXTRACTION_MODE") || currentCategory === "extract";

  // Enforce table format if processing a document
  if (attachedFiles.length > 0 && !isSchemaMode) {
    userPrompt += `\n\n[FORMATTING STRICT RULE]: You are extracting data from a document. ALWAYS output the data as a clean, flat 2D HORIZONTAL table at the top of the sheet. Put Column Headers in Row A1...X1. Append the extracted data underneath. NEVER output a vertical key-value list mimicking a document. Ensure data rows have { font: { color: "#000000" } }.`;
  }

  // UI: loading
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
  try {
    let code;
    let fromCache = false;

    // ─── Read Sheet Context for Intelligent Assistance ───
    let sheetContext = null;
    try {
      var _sheetContext;
      sheetContext = await (0,_services_agent_orchestrator__WEBPACK_IMPORTED_MODULE_7__.readSheetContext)();
      if ((_sheetContext = sheetContext) !== null && _sheetContext !== void 0 && _sheetContext.hasData) {
        console.log(`[Agent] Sheet context: ${sheetContext.rowCount}x${sheetContext.columnCount}`);
      }
    } catch (e) {
      console.warn("[Agent] Could not read sheet context:", e);
    }

    // ─── Schema Extraction Mode ───
    let existingColumns = [];
    if (isSchemaMode && attachedFiles.length > 0) {
      try {
        existingColumns = await getExcelColumnHeaders();
        console.log("[Agent] Schema columns detected:", existingColumns);
        if (existingColumns.length === 0) {
          showStatus(statusEl, "info", "⚠️ No column headers found in Row 1. Add headers first or use 'HR Database Setup' to create them.");
          skeletonEl.style.display = "none";
          return;
        }
        if (runText) runText.innerText = `Extracting (${existingColumns.length} cols)...`;
      } catch (e) {
        console.warn("[Agent] Could not read Excel headers:", e);
      }
    }

    // ─── Check Cache (Skip for files/schema mode) ───
    const cached = attachedFiles.length === 0 && !isSchemaMode ? (0,_services_cache__WEBPACK_IMPORTED_MODULE_4__.getCachedResponse)(userPrompt) : null;
    if (cached) {
      code = cached;
      fromCache = true;
      cacheBadge.style.display = "inline-block";

      // Still validate cached code
      const validation = (0,_services_agent_orchestrator__WEBPACK_IMPORTED_MODULE_7__.validateCode)(code);
      if (!validation.isValid) {
        console.warn("[Agent] Cached code failed validation, regenerating...");
        fromCache = false;
        code = ""; // Will regenerate
      } else {
        code = validation.sanitizedCode;
      }
    }

    // ─── Generate Code (if not from cache) ───
    if (!fromCache) {
      if (isSchemaMode && attachedFiles.length > 0) {
        if (runText) runText.innerText = "Generating...";
        const messages = [{
          role: "system",
          content: _services_prompt__WEBPACK_IMPORTED_MODULE_2__.SYSTEM_PROMPT
        }];
        const schemaDirective = buildSchemaExtractionDirective(existingColumns);
        const cleanPrompt = userPrompt.replace("SCHEMA_EXTRACTION_MODE:", "").trim();
        const contentText = `${cleanPrompt}\n\nEXISTING_COLUMNS: ${JSON.stringify(existingColumns)}\n\n${schemaDirective}`;
        const contentParts = [{
          type: "text",
          text: contentText
        }];
        let totalImages = 0;
        attachedFiles.forEach(file => {
          file.data.forEach(url => {
            if (totalImages < 20) {
              contentParts.push({
                type: "image_url",
                image_url: {
                  url
                }
              });
              totalImages++;
            }
          });
        });
        messages.push({
          role: "user",
          content: contentParts
        });
        code = await (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.callLLM)(messages, undefined, signal);
        if (runText) runText.innerText = "Validating...";
        let validation = (0,_services_agent_orchestrator__WEBPACK_IMPORTED_MODULE_7__.validateCode)(code);
        let validationAttempts = 0;
        const MAX_VALIDATION_FIXES = 2;
        while (!validation.isValid && validationAttempts < MAX_VALIDATION_FIXES) {
          console.warn(`[Agent] Validation failed (attempt ${validationAttempts + 1}):`, validation.errors);
          const errorSummary = validation.errors.map(e => `${e.message} → ${e.suggestion}`).join("\n");
          code = await (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.callLLM)([{
            role: "system",
            content: _services_prompt__WEBPACK_IMPORTED_MODULE_2__.SYSTEM_PROMPT
          }, {
            role: "user",
            content: userPrompt
          }, {
            role: "assistant",
            content: code
          }, {
            role: "user",
            content: `VALIDATION ERRORS:\n${errorSummary}\n\nFix these errors. Output ONLY the corrected code.`
          }], undefined, signal);
          validation = (0,_services_agent_orchestrator__WEBPACK_IMPORTED_MODULE_7__.validateCode)(code);
          validationAttempts++;
        }
        code = validation.sanitizedCode;
        if (validation.warnings.length > 0) {
          console.log("[Agent] Validation warnings:", validation.warnings);
        }
      } else {
        if (runText) runText.innerText = "Planning...";
        const orchestratorResult = await (0,_services_agent_orchestrator__WEBPACK_IMPORTED_MODULE_7__.runAgent)(userPrompt, sheetContext, attachedFiles, {
          maxRetries: 2,
          enablePlanning: true,
          strictValidation: true
        }, signal);
        if (!orchestratorResult.success) {
          throw new Error(orchestratorResult.error || "Agent failed to generate valid code");
        }
        code = orchestratorResult.code;
      }
    }
    debugEl.innerText = code;
    skeletonEl.style.display = "none";

    // ─── EXECUTION PHASE with Advanced Recovery ───
    if (runText) runText.innerText = "Running...";
    showStatus(statusEl, "info", `<div class="spinner"></div><span>Executing code...</span>`);
    const recovery = await (0,_services_agent_orchestrator__WEBPACK_IMPORTED_MODULE_7__.executeWithRecovery)(code, async candidateCode => {
      await executeExcelCode(candidateCode);
    }, MAX_EXECUTION_RETRIES, signal);
    if (recovery.success) {
      code = recovery.finalCode;
      debugEl.innerText = code;
      if (!fromCache && attachedFiles.length === 0 && !isSchemaMode) {
        (0,_services_cache__WEBPACK_IMPORTED_MODULE_4__.cacheResponse)(userPrompt, code);
      }
      showStatus(statusEl, "success", `${_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.check}<span>Done</span>`);
      showToast("success", "Executed successfully \u2713 (Press Ctrl+Z to undo)");
    } else {
      throw new Error(recovery.error || "Execution failed after retries");
    }
  } catch (error) {
    console.error("[Agent] Fatal error:", error);
    skeletonEl.style.display = "none";
    if (error.name === 'AbortError') {
      showStatus(statusEl, "info", "Agent stopped by user.");
      showToast("info", "Agent stopped");
    } else {
      showStatus(statusEl, "error", error.message || String(error));
      showToast("error", (error.message || "Execution failed").substring(0, 80));
    }
  } finally {
    button.disabled = false;
    if (runText) runText.innerText = originalText;
    if (runIcon) runIcon.innerHTML = originalIcon;
    button.classList.remove("btn-stop");
    button.classList.remove("is-busy");
    agentAbortController = null;
  }
}

// ─── Helpers ───────────────────────────────────────────────────
function showStatus(el, type, html) {
  el.innerHTML = html;
  el.className = `status-pill ${type}`;
  el.style.display = "flex";
}

/**
 * Execute AI-generated Excel JavaScript code with safety wrappers.
 * Provides:
 * - Pre-declared context, sheet, Excel variables
 * - writeData helper function
 * - Auto-fit columns on completion
 * - Enhanced error messages
 */
async function executeExcelCode(code) {
  await Excel.run(async context => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();

    // Mandatory writeData helper that all generated code can use
    const writeDataHelper = `
function writeData(sheet, startCell, data) {
  if (!data || data.length === 0) return null;
  const rows = data.length;
  const cols = Math.max(...data.map(r => r ? r.length : 0));
  if (cols === 0) return null;
  const normalized = data.map(r => {
    const row = r ? [...r] : [];
    while (row.length < cols) row.push("");
    return row.map(cell => {
      if (cell === null || cell === undefined) return "";
      let val = typeof cell === "object" ? (Array.isArray(cell) ? cell.join(", ") : JSON.stringify(cell)) : String(cell);
      if (/^[=+\\-@]/.test(val)) val = "'" + val;
      if (val.length > 30000) val = val.substring(0, 30000) + "...";
      return val;
    });
    });
  });
  try {
    const range = sheet.getRange(startCell).getResizedRange(rows - 1, cols - 1);
    range.values = normalized;
    range.format.font.name = "Segoe UI";
    range.format.font.size = 10;
    range.format.verticalAlignment = "Center";
    return range;
  } catch (e) {
    console.error("writeData error:", e);
    return null;
  }
}

  function formatTableStyle(usedRange, headerColor, fontColor) {
    if (!usedRange) return;
    try {
      if (usedRange.rowCount < 1) return;
      const headerRow = usedRange.getRow(0);
      headerRow.format.set({
        font: { bold: true, size: 11, color: fontColor },
        fill: { color: headerColor },
        horizontalAlignment: "Center",
        verticalAlignment: "Center"
      });
      // Try resolving body
      if (usedRange.rowCount > 1) {
        const bodyRange = usedRange.getOffsetRange(1, 0).getResizedRange(-1, 0);
        bodyRange.format.font.color = "#000000";
        bodyRange.format.wrapText = true;
      }
    } catch (e) {
      console.error("formatTableStyle error: ", e);
    }
  }
  `;
    const wrappedCode = `
      ${writeDataHelper}
      
      try {
        // ═══ AI Generated Code ═══
        ${code}
        
        // ═══ Safety Finalization ═══
        try {
          sheet.getUsedRange().format.autofitColumns();
        } catch(_) { /* Sheet might be empty */ }
        
      } catch(_innerErr) {
        console.error("[Agent] Runtime Error:", _innerErr);
        try { await context.sync(); } catch(_) {}
        throw _innerErr;
      }
    `;
    console.log("=== EXECUTING AI CODE ===");
    console.log(wrappedCode.split("\\n").map((l, i) => `${i + 1}: ${l}`).join("\\n"));
    console.log("=========================");
    try {
      await new Function("context", "sheet", "Excel", `return (async () => {
          try {
            ${wrappedCode}
            await context.sync();
          } catch (inner) {
        // Enhance error messages for common issues
        if (inner.code === "InvalidArgument") {
          const original = inner.message || "";
          if (original.includes("A0") || original.includes("row 0")) {
            inner.message = "Invalid range: Row 0 doesn't exist. Excel rows start at 1.";
          } else if (original.includes("getResizedRange")) {
            inner.message = "Invalid range size: Check that data dimensions match the range.";
          } else {
            inner.message = "Invalid argument: " + original;
          }
        } else if (inner.message?.includes("is not a function")) {
          const fnMatch = inner.message.match(/(\\w+) is not a function/);
          const fn = fnMatch ? fnMatch[1] : (inner.stack?.match(/at\\s+.*\\.(.*)\\s+\\(/)?.[1] || "method");
          inner.message = "API Error: ." + fn + "() doesn't exist. Use correct Excel JS API methods.";
        } else if (inner.message?.includes("is not defined")) {
          const varMatch = inner.message.match(/(\\w+) is not defined/);
          const v = varMatch ? varMatch[1] : "variable";
          inner.message = "Undefined: '" + v + "' was used before being declared.";
        } else if (inner.message?.includes("Cannot read property")) {
          inner.message = "Null reference: Tried to read property of undefined. Add null checks or ensure .load() was called.";
        }
        throw inner;
      }
    })()`)(context, sheet, Excel);
    } catch (e) {
      console.error("[Agent] Execution Error:", e);
      try {
        await context.sync();
      } catch (_) {}
      throw e;
    }
    await context.sync();
  });
}
// ─── File Handling Logic ───────────────────────────────────────
async function handleFileSelect(event) {
  let isAgent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const input = event.target;
  if (!input.files || input.files.length === 0) return;
  const btnId = isAgent ? "agent-file-btn" : "file-upload-btn";
  const btn = document.getElementById(btnId);
  if (btn) btn.innerHTML = `< span class="btn-spinner" > </span>`;
  try {
    const newFiles = [];

    // Process all selected files
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (file.type === "application/pdf") {
        rawPDFFiles.push(file); // Keep raw file for text extraction
        const arrayBuffer = await file.arrayBuffer();
        const images = await renderPdfToImages(arrayBuffer);
        newFiles.push({
          name: file.name,
          type: "pdf",
          data: images
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
      // Append to existing files
      attachedFiles = [...attachedFiles, ...newFiles];
      // Show batch panel if in extract mode and we have PDFs
      if (currentCategory === "extract" && rawPDFFiles.length > 0) {
        showBatchPanel(true);
      }
      updateFilePreview(true, isAgent);
    } else {
      throw new Error("Unsupported file type. Please upload PDF or Image.");
    }
  } catch (error) {
    console.error(error);
    showStatus(document.getElementById("status-message"), "error", "Error reading file: " + error.message);
  } finally {
    // Reset input so same file can be selected again if needed
    input.value = "";
    if (btn) {
      // Restore icon
      const icon = isAgent ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>` : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`;
      btn.innerHTML = icon;
    }
  }
}
function updateFilePreview(show) {
  let isAgent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const listId = isAgent ? "agent-file-preview-list" : "file-preview-list";
  const container = document.getElementById(listId);
  if (!container) return;
  container.innerHTML = "";
  if (attachedFiles.length === 0) {
    return;
  }

  // Render chips
  attachedFiles.forEach((file, index) => {
    const chip = document.createElement("div");
    chip.className = "file-chip";
    const icon = document.createElement("span");
    icon.className = "file-chip-icon";
    icon.innerHTML = file.type === "pdf" ? "📄" : "🖼️";
    const name = document.createElement("span");
    name.className = "file-chip-name";
    name.innerText = file.name;
    const remove = document.createElement("button");
    remove.className = "file-chip-remove";
    remove.innerHTML = "×";
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
}
function removeFile(index, isAgent) {
  attachedFiles.splice(index, 1);
  updateFilePreview(true, isAgent);
}
function clearFile() {
  let isAgent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  attachedFiles = [];
  rawPDFFiles = [];
  showBatchPanel(false);
  updateFilePreview(false, isAgent);
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
  // @ts-ignore
  const pdf = await pdfjs_dist__WEBPACK_IMPORTED_MODULE_8__.getDocument(buffer).promise;
  const images = [];
  // Limit to 5 pages per PDF for better coverage of long CVs
  const maxPages = Math.min(pdf.numPages, 5);
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    // Use 1.0 scale to keep image size manageable for local vision models
    const viewport = page.getViewport({
      scale: 1.0
    });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) continue;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({
      canvasContext: context,
      viewport
    }).promise;
    images.push(canvas.toDataURL("image/png"));
  }
  return images;
}

// ═══════════════════════════════════════════════════════════════
// BATCH PDF EXTRACTION ENGINE
// ═══════════════════════════════════════════════════════════════

/**
 * Shows or hides the batch extraction panel and updates the file count badge.
 */
function showBatchPanel(show) {
  const panel = document.getElementById("batch-extraction-panel");
  const badge = document.getElementById("batch-file-count");
  if (!panel) return;
  panel.style.display = show ? "block" : "none";
  if (show && badge) {
    const count = rawPDFFiles.length;
    badge.textContent = `${count} PDF${count !== 1 ? "s" : ""}`;
  }
}

/**
 * Parses field names from natural language instruction using regex heuristics.
 * E.g. "Extract Name, Email, Phone, Skills and Experience" → ["Name","Email","Phone","Skills","Experience"]
 */
function parseFieldsFromInstruction(instruction) {
  // Look for explicit list patterns: "extract X, Y, Z" or "find X, Y and Z"
  const listPattern = /(?:extract|find|get|pull|identify|return|capture|include)[:\s]+([^.!?]+)/i;
  const match = instruction.match(listPattern);
  if (match) {
    return match[1].split(/[,;&]| and /i).map(f => f.trim().replace(/^["'\-•]+|["'\-•]+$/g, "")).filter(f => f.length > 1 && f.length < 50);
  }

  // Fallback: detect capitalised or quoted words as field names
  const capitalWords = instruction.match(/\b[A-Z][a-z]{2,}(?:\s[A-Z][a-z]{2,})?\b/g) || [];
  const filtered = capitalWords.filter(w => !/^(These|This|The|And|From|With|For|All|Each|Into|Then|After|Before|Upload|File|Excel|Sheet|Row|Column|PDF|Resume|CV)$/.test(w));
  if (filtered.length > 0) return Array.from(new Set(filtered));

  // Default for resumes if nothing detected
  return ["Name", "Email", "Phone", "Skills", "Experience"];
}

/**
 * Ensures the first row of the active sheet has the given fields as headers.
 * If the sheet is empty, writes them in row 1. If headers already exist, leaves them.
 * Returns the final, authoritative list of headers in sheet order.
 */
async function ensureExcelHeaders(fields) {
  return Excel.run(async context => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const headerRange = sheet.getRange(`A1:${String.fromCharCode(64 + fields.length)}1`);
    headerRange.load("values");
    await context.sync();
    const existing = headerRange.values[0].map(v => String(v || "").trim()).filter(v => v);
    if (existing.length > 0) {
      // Headers already exist — respect them
      return existing;
    }

    // Write new headers
    headerRange.values = [fields.map(f => f.trim())];
    headerRange.format.set({
      font: {
        bold: true
      },
      fill: {
        color: "#1B2A4A"
      },
      horizontalAlignment: "Center"
    });
    headerRange.format.font.color = "#FFFFFF";
    headerRange.format.autofitColumns();
    await context.sync();
    return fields;
  });
}

/**
 * Calls the LLM to extract structured fields from raw PDF text.
 * Returns a parsed object { fieldName: value } or null on failure.
 */
async function extractStructuredData(pdfText, userInstruction, fields, signal) {
  const fieldList = fields.join(", ");
  const systemPrompt = `You are a precision data extraction engine. Your ONLY output is valid JSON.

Given a document, extract the following fields: ${fieldList}

Rules:
- Output ONLY a JSON object. No markdown, no explanation, no extra text.
- Use exact field names as keys: ${JSON.stringify(fields)}
- If a field is not found in the document, use null as the value.
- For "Skills": list as a comma-separated string.
- For "Experience": summarize the most recent role: "Title at Company (Years)" or list companies.
- Never hallucinate or guess information not in the document.

Example output:
{"Name": "John Smith", "Email": "john@email.com", "Phone": "9876543210", "Skills": "Python, React, SQL", "Experience": "Software Engineer at Google (3 yrs)"}`;
  const userMessage = `Instruction: ${userInstruction}\n\nDOCUMENT TEXT:\n${pdfText.substring(0, 8000)}`;
  try {
    const response = await (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.callLLM)([{
      role: "system",
      content: systemPrompt
    }, {
      role: "user",
      content: userMessage
    }], undefined, signal);

    // Strip markdown fences if model added them
    const cleaned = response.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("[Batch] LLM extraction failed:", e);
    return null;
  }
}

/**
 * Appends a single data row to the Excel sheet below the header.
 * Detects the next empty row automatically.
 */
async function appendExcelRow(headers, data) {
  await Excel.run(async context => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const usedRange = sheet.getUsedRangeOrNullObject();
    usedRange.load("rowCount,isNullObject");
    await context.sync();
    const nextRow = usedRange.isNullObject ? 1 : usedRange.rowCount + 1; // 1-indexed

    const rowValues = headers.map(h => {
      var _ref, _ref2, _data$h;
      const rawVal = (_ref = (_ref2 = (_data$h = data[h]) !== null && _data$h !== void 0 ? _data$h : data[h.toLowerCase()]) !== null && _ref2 !== void 0 ? _ref2 : data[Object.keys(data).find(k => k.toLowerCase() === h.toLowerCase()) || ""]) !== null && _ref !== void 0 ? _ref : "";
      const safeVal = rawVal === null ? "" : rawVal;
      let val = typeof safeVal === "object" && safeVal !== null ? Array.isArray(safeVal) ? safeVal.join(", ") : JSON.stringify(safeVal) : String(safeVal || "");
      if (/^[=+\-@]/.test(val)) val = "'" + val;
      if (val.length > 30000) val = val.substring(0, 30000) + "...";
      return val;
    });
    const startCell = `A${nextRow}`;
    const endCell = `${String.fromCharCode(64 + headers.length)}${nextRow}`;
    const range = sheet.getRange(`${startCell}:${endCell}`);
    range.values = [rowValues];
    range.format.wrapText = true;
    // Subtle alternating row colour
    range.format.fill.color = nextRow % 2 === 0 ? "#F4F5F7" : "#FFFFFF";
    await context.sync();
  });
}

/**
 * Adds a log entry to the batch log panel.
 */
function batchLog(message) {
  let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "info";
  const log = document.getElementById("batch-log");
  if (!log) return;
  const entry = document.createElement("div");
  entry.className = `batch-log-entry ${type}`;
  entry.textContent = `${type === "success" ? "✓" : type === "error" ? "✗" : "•"} ${message}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

/**
 * Main batch PDF extraction orchestrator.
 * Reads instruction, parses fields, creates headers, loops through PDFs, extracts data, appends rows.
 */
async function runBatchPDFExtraction() {
  var _instructionEl$value;
  const btn = document.getElementById("batch-extract-btn");
  const btnText = document.getElementById("batch-btn-text");
  const progressWrap = document.getElementById("batch-progress-wrap");
  const progressBar = document.getElementById("batch-progress-bar");
  const progressLabel = document.getElementById("batch-progress-label");
  const logEl = document.getElementById("batch-log");
  const instructionEl = document.getElementById("batch-instruction");

  // Handle stop
  if (batchAbortController) {
    batchAbortController.abort();
    batchAbortController = null;
    if (btnText) btnText.textContent = "Extract All PDFs";
    if (btn) btn.disabled = false;
    return;
  }
  const instruction = (instructionEl === null || instructionEl === void 0 || (_instructionEl$value = instructionEl.value) === null || _instructionEl$value === void 0 ? void 0 : _instructionEl$value.trim()) || "These are documents. Extract Name, Email, Phone, Skills, and Experience.";
  const pdfsToProcess = [...rawPDFFiles]; // snapshot
  if (pdfsToProcess.length === 0) {
    showToast("error", "No PDFs attached. Please upload PDFs first.");
    return;
  }

  // Parse target fields
  const fields = parseFieldsFromInstruction(instruction);
  if (fields.length === 0) {
    showToast("error", "Could not detect fields to extract. Please be more specific.");
    return;
  }
  batchAbortController = new AbortController();
  const signal = batchAbortController.signal;

  // Setup UI
  if (btn) {
    btn.disabled = false;
  }
  if (btnText) btnText.textContent = "⏹ Stop Extraction";
  if (progressWrap) progressWrap.style.display = "block";
  if (logEl) logEl.innerHTML = "";
  batchLog(`Starting extraction of ${pdfsToProcess.length} PDF(s)…`, "info");
  batchLog(`Detected fields: ${fields.join(", ")}`, "info");
  let successCount = 0;
  let errorCount = 0;
  let headers = [];
  try {
    // Ensure Excel headers are ready
    headers = await ensureExcelHeaders(fields);
    batchLog(`Excel headers ready: ${headers.join(", ")}`, "info");
    for (let i = 0; i < pdfsToProcess.length; i++) {
      if (signal.aborted) break;
      const file = pdfsToProcess[i];
      const pct = Math.round(i / pdfsToProcess.length * 100);
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (progressLabel) progressLabel.textContent = `${i} / ${pdfsToProcess.length}`;
      batchLog(`[${i + 1}/${pdfsToProcess.length}] Processing: ${file.name}`, "info");
      try {
        // Step 1: Extract text from PDF
        const extracted = await (0,_services_pdfService__WEBPACK_IMPORTED_MODULE_6__.extractTextFromPDFFile)(file);
        if (!extracted.text || extracted.text.length < 20) {
          throw new Error("PDF appears empty or unreadable");
        }

        // Step 2: Call LLM for structured data
        const data = await extractStructuredData(extracted.text, instruction, fields, signal);
        if (!data) throw new Error("LLM returned no data");

        // Step 3: Write to Excel
        await appendExcelRow(headers, data);
        successCount++;
        batchLog(`✓ ${file.name} → ${Object.values(data).filter(v => v).length}/${fields.length} fields extracted`, "success");
      } catch (fileError) {
        if (fileError.name === "AbortError") break;
        errorCount++;
        batchLog(`✗ ${file.name}: ${fileError.message}`, "error");
      }
    }
  } catch (fatalError) {
    batchLog(`Fatal error: ${fatalError.message}`, "error");
  } finally {
    // Final UI update
    const finalPct = Math.round(successCount / pdfsToProcess.length * 100);
    if (progressBar) progressBar.style.width = "100%";
    if (progressLabel) progressLabel.textContent = `${pdfsToProcess.length} / ${pdfsToProcess.length}`;
    const msg = `✅ Done! ${successCount} rows added${errorCount > 0 ? `, ${errorCount} failed` : ""}.`;
    batchLog(msg, successCount > 0 ? "success" : "error");
    showToast(successCount > 0 ? "success" : "error", msg);
    batchAbortController = null;
    if (btn) btn.disabled = false;
    if (btnText) btnText.textContent = "Extract All PDFs";
  }
}

/***/ }),

/***/ "./src/taskpane/taskpane.html":
/*!************************************!*\
  !*** ./src/taskpane/taskpane.html ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// Imports
var ___HTML_LOADER_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../../assets/icon-80-v2.png */ "./assets/icon-80-v2.png"), __webpack_require__.b);
// Module
var code = "<!DOCTYPE html>\r\n<html>\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\" />\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\" />\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r\n    <title>SheetOS AI</title>\r\n    <" + "script type=\"text/javascript\" src=\"https://appsforoffice.microsoft.com/lib/1/hosted/office.js\"><" + "/script>\r\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\r\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\r\n    <link\r\n        href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap\"\r\n        rel=\"stylesheet\">\r\n</head>\r\n\r\n<body>\r\n    <main id=\"app-body\" style=\"display: none;\">\r\n        <header class=\"app-header\">\r\n            <div class=\"brand\">\r\n                <h1>SheetOS <span class=\"highlight-text\">AI</span></h1>\r\n            </div>\r\n            <div class=\"header-actions\">\r\n                <button id=\"docs-toggle\" class=\"btn-icon\" title=\"What can I do?\"></button>\r\n                <button id=\"settings-toggle\" class=\"btn-icon\" title=\"Settings\"></button>\r\n            </div>\r\n        </header>\r\n\r\n        <!-- Docs Panel -->\r\n        <div id=\"docs-panel\" class=\"panel\" style=\"display: none;\">\r\n            <h3>What can SheetOS AI do?</h3>\r\n            <div class=\"docs-grid\">\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"paintbrush\"></span>\r\n                    <div><strong>Smart Formatter</strong>\r\n                        <p>Say \"make this professional\" and get instant clean formatting, spacing, fonts, colors,\r\n                            alignment</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"formula\"></span>\r\n                    <div><strong>Formula Generator</strong>\r\n                        <p>Describe what you need in plain English — get VLOOKUP, SUMIF, INDEX/MATCH, any formula</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"barChart\"></span>\r\n                    <div><strong>Report Automation</strong>\r\n                        <p>Generate monthly sales, financial, or performance reports with charts in one click</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"table\"></span>\r\n                    <div><strong>Tables & Charts</strong>\r\n                        <p>Create formatted tables, column/bar/line/pie charts, dashboards</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"sortAsc\"></span>\r\n                    <div><strong>Sort & Filter</strong>\r\n                        <p>Sort by any column, apply AutoFilter, multi-column sorting</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"checkSquare\"></span>\r\n                    <div><strong>Validation</strong>\r\n                        <p>Dropdown lists, number constraints, date limits, error alerts</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"trendUp\"></span>\r\n                    <div><strong>Conditional Formatting</strong>\r\n                        <p>Color scales, data bars, icon sets, highlight rules</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"eraser\"></span>\r\n                    <div><strong>Data Cleanup</strong>\r\n                        <p>Remove duplicates, trim spaces, fix formats, standardize case</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"snowflake\"></span>\r\n                    <div><strong>Freeze & Protect</strong>\r\n                        <p>Freeze header rows, protect sheets with custom permissions</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"columns\"></span>\r\n                    <div><strong>Worksheets</strong>\r\n                        <p>Add, rename, delete, copy sheets, change tab colors</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"fileTemplate\"></span>\r\n                    <div><strong>Templates</strong>\r\n                        <p>Budget trackers, invoices, employee lists, project trackers, grade books</p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <p class=\"docs-hint\">Just describe what you need in plain English — SheetOS handles the rest.</p>\r\n        </div>\r\n\r\n        <!-- Settings Panel -->\r\n        <div id=\"settings-panel\" class=\"panel\" style=\"display: none;\">\r\n            <h3>AI Provider</h3>\r\n\r\n            <div class=\"form-group\">\r\n                <label for=\"setting-provider\">Provider</label>\r\n                <select id=\"setting-provider\" class=\"form-input\">\r\n                    <option value=\"groq\">Groq (Llama)</option>\r\n                    <option value=\"gemini\">Google Gemini</option>\r\n                    <option value=\"openai\">OpenAI (GPT-4)</option>\r\n                    <option value=\"anthropic\">Anthropic (Claude)</option>\r\n                    <option value=\"openrouter\">OpenRouter</option>\r\n                    <option value=\"local\">Ollama (Local)</option>\r\n                </select>\r\n            </div>\r\n\r\n            <!-- Groq Fields -->\r\n            <div id=\"groq-fields\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-api-key\">Groq API Key</label>\r\n                    <input id=\"setting-api-key\" type=\"password\" class=\"form-input\" placeholder=\"gsk_...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-groq-model\">Model</label>\r\n                    <select id=\"setting-groq-model\" class=\"form-input\">\r\n                        <option value=\"llama-3.1-8b-instant\" selected>Llama 3.1 8B — Fast (131K TPM)</option>\r\n                        <option value=\"llama-3.3-70b-versatile\">Llama 3.3 70B — Smart (12K TPM)</option>\r\n                        <option value=\"gemma2-9b-it\">Gemma 2 9B (15K TPM)</option>\r\n                        <option value=\"mixtral-8x7b-32768\">Mixtral 8x7B (5K TPM)</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Gemini Fields -->\r\n            <div id=\"gemini-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-gemini-key\">Gemini API Key</label>\r\n                    <input id=\"setting-gemini-key\" type=\"password\" class=\"form-input\" placeholder=\"AIzaSy...\" />\r\n                    <div style=\"font-size:10px; color:var(--text-3); margin-top:4px\">Get free key at <a\r\n                            href=\"https://aistudio.google.com/app/apikey\" target=\"_blank\">aistudio.google.com</a></div>\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-gemini-model\">Model</label>\r\n                    <select id=\"setting-gemini-model\" class=\"form-input\">\r\n                        <option value=\"gemini-1.5-flash\" selected>Gemini 1.5 Flash (Latest)</option>\r\n                        <option value=\"gemini-1.5-flash-001\">Gemini 1.5 Flash-001</option>\r\n                        <option value=\"gemini-1.5-flash-002\">Gemini 1.5 Flash-002</option>\r\n                        <option value=\"gemini-1.5-flash-8b\">Gemini 1.5 Flash-8B</option>\r\n                        <option value=\"gemini-1.5-pro\">Gemini 1.5 Pro</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- OpenAI Fields -->\r\n            <div id=\"openai-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openai-key\">OpenAI API Key</label>\r\n                    <input id=\"setting-openai-key\" type=\"password\" class=\"form-input\" placeholder=\"sk-...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openai-model\">Model</label>\r\n                    <select id=\"setting-openai-model\" class=\"form-input\">\r\n                        <option value=\"gpt-4o-mini\" selected>GPT-4o Mini (Fast)</option>\r\n                        <option value=\"gpt-4o\">GPT-4o (Smart)</option>\r\n                        <option value=\"gpt-3.5-turbo\">GPT-3.5 Turbo</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Anthropic Fields -->\r\n            <div id=\"anthropic-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-anthropic-key\">Anthropic API Key</label>\r\n                    <input id=\"setting-anthropic-key\" type=\"password\" class=\"form-input\" placeholder=\"sk-ant-...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-anthropic-model\">Model</label>\r\n                    <select id=\"setting-anthropic-model\" class=\"form-input\">\r\n                        <option value=\"claude-3-5-sonnet-20241022\" selected>Claude 3.5 Sonnet (Best for Code)</option>\r\n                        <option value=\"claude-3-5-haiku-20241022\">Claude 3.5 Haiku (Fast)</option>\r\n                        <option value=\"claude-3-opus-20240229\">Claude 3 Opus</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- OpenRouter Fields -->\r\n            <div id=\"openrouter-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openrouter-key\">OpenRouter API Key</label>\r\n                    <input id=\"setting-openrouter-key\" type=\"password\" class=\"form-input\" placeholder=\"sk-or-v1-...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openrouter-model\">Model</label>\r\n                    <select id=\"setting-openrouter-model\" class=\"form-input\">\r\n                        <option value=\"anthropic/claude-3.5-sonnet:beta\" selected>Claude 3.5 Sonnet</option>\r\n                        <option value=\"google/gemini-2.5-pro\">Gemini 2.5 Pro</option>\r\n                        <option value=\"openai/gpt-4o\">GPT-4o</option>\r\n                        <option value=\"meta-llama/llama-3.3-70b-instruct\">Llama 3.3 70B</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Local Fields -->\r\n            <div id=\"local-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-base-url\">Ollama Host</label>\r\n                    <input id=\"setting-base-url\" type=\"text\" class=\"form-input\" placeholder=\"http://localhost:11434\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label>Model</label>\r\n                    <div class=\"model-select-wrapper\">\r\n                        <select id=\"setting-local-model\" class=\"form-input\">\r\n                            <option value=\"\" disabled selected>Click refresh →</option>\r\n                        </select>\r\n                        <button id=\"refresh-models\" class=\"btn-icon btn-refresh\" title=\"Refresh models\"></button>\r\n                    </div>\r\n                    <div id=\"model-status\" class=\"model-status\"></div>\r\n                </div>\r\n            </div>\r\n\r\n            <button id=\"save-settings\" class=\"btn-primary btn-save\">Save</button>\r\n        </div>\r\n\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <!-- MODE TOGGLE -->\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <div class=\"mode-toggle\">\r\n            <button id=\"mode-planning\" class=\"mode-tab active\" data-mode=\"planning\">\r\n                <span id=\"mode-planning-icon\"></span>\r\n                <span>Planning</span>\r\n            </button>\r\n            <button id=\"mode-agent\" class=\"mode-tab\" data-mode=\"agent\">\r\n                <span id=\"mode-agent-icon\"></span>\r\n                <span>Agent</span>\r\n            </button>\r\n            <div class=\"mode-indicator\" id=\"mode-indicator\"></div>\r\n        </div>\r\n\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <!-- PLANNING MODE (Chat) -->\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <div id=\"planning-mode\" class=\"mode-content active\">\r\n            <!-- Chat Messages Area -->\r\n            <div style=\"position: relative; flex: 1; display: flex; flex-direction: column; overflow: hidden;\">\r\n                <div id=\"chat-messages\" class=\"chat-messages\">\r\n                    <!-- Welcome message -->\r\n                    <div class=\"chat-welcome\">\r\n                        <img src=\"" + ___HTML_LOADER_IMPORT_0___ + "\" alt=\"SheetOS Logo\"\r\n                            style=\"width: 64px; height: 64px; margin-bottom: 16px;\">\r\n                        <h2>What are you working on?</h2>\r\n                        <div class=\"welcome-suggestions\" id=\"chat-suggestions\">\r\n                            <!-- Dynamically populated -->\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <button id=\"scroll-to-bottom\" class=\"scroll-to-bottom\" title=\"Scroll to bottom\">\r\n                    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"\r\n                        stroke-linecap=\"round\" stroke-linejoin=\"round\">\r\n                        <polyline points=\"6 9 12 15 18 9\" />\r\n                    </svg>\r\n                </button>\r\n            </div>\r\n\r\n            <!-- Chat Input -->\r\n            <div class=\"chat-input-area\">\r\n                <!-- File Preview -->\r\n                <div id=\"file-preview-list\" class=\"file-preview-list\"></div>\r\n\r\n                <div class=\"chat-input-card\">\r\n                    <input type=\"file\" id=\"file-input\" accept=\"image/png, image/jpeg, application/pdf\" multiple\r\n                        style=\"display: none;\" />\r\n                    <button id=\"file-upload-btn\" class=\"btn-clip\" title=\"Attach Images or PDFs\">\r\n                        <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n                            stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\r\n                            <path\r\n                                d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\">\r\n                            </path>\r\n                        </svg>\r\n                    </button>\r\n                    <textarea id=\"chat-input\" placeholder=\"Ask or upload file...\" rows=\"1\"\r\n                        spellcheck=\"false\"></textarea>\r\n                    <button id=\"chat-send\" class=\"btn-send\" title=\"Send message\">\r\n                        <span id=\"chat-send-icon\"></span>\r\n                    </button>\r\n                </div>\r\n                <div class=\"chat-footer\">\r\n                    <button id=\"chat-clear\" class=\"btn-text\" title=\"Clear conversation\">\r\n                        <span id=\"chat-clear-icon\"></span>\r\n                        <span>Clear</span>\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <!-- AGENT MODE (Execute) -->\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <div id=\"agent-mode\" class=\"mode-content\">\r\n            <div class=\"content-wrapper\">\r\n                <!-- Input Card (pinned at top, never scrolls) -->\r\n                <div class=\"input-card\">\r\n                    <textarea id=\"prompt-input\" placeholder=\"Describe what you want to do in Excel...\"\r\n                        spellcheck=\"false\"></textarea>\r\n\r\n                    <!-- File Preview (Agent Mode) -->\r\n                    <div id=\"agent-file-preview-list\" class=\"file-preview-list\"></div>\r\n\r\n                    <!-- Batch PDF Extraction Panel (shown in Extract mode with PDFs attached) -->\r\n                    <div id=\"batch-extraction-panel\" class=\"batch-panel\" style=\"display:none;\">\r\n                        <div class=\"batch-panel-header\">\r\n                            <span class=\"batch-panel-title\">🧠 Batch PDF Extraction</span>\r\n                            <span id=\"batch-file-count\" class=\"batch-file-count\">0 PDFs</span>\r\n                        </div>\r\n                        <textarea id=\"batch-instruction\" class=\"batch-instruction\"\r\n                            placeholder=\"Describe what to extract, e.g: These are resumes. Extract Name, Email, Phone, Skills, and Experience.\"\r\n                            rows=\"2\"></textarea>\r\n                        <button id=\"batch-extract-btn\" class=\"btn-primary btn-batch-extract\">\r\n                            <span id=\"batch-icon\">🚀</span>\r\n                            <span id=\"batch-btn-text\">Extract All PDFs</span>\r\n                        </button>\r\n                        <div id=\"batch-progress-wrap\" class=\"batch-progress-wrap\" style=\"display:none;\">\r\n                            <div class=\"batch-progress-bar-track\">\r\n                                <div id=\"batch-progress-bar\" class=\"batch-progress-bar\" style=\"width:0%\"></div>\r\n                            </div>\r\n                            <div id=\"batch-progress-label\" class=\"batch-progress-label\">0 / 0</div>\r\n                        </div>\r\n                        <div id=\"batch-log\" class=\"batch-log\"></div>\r\n                    </div>\r\n\r\n                    <div class=\"card-footer\">\r\n                        <div class=\"footer-left\">\r\n                            <input type=\"file\" id=\"agent-file-input\" accept=\"image/png, image/jpeg, application/pdf\"\r\n                                multiple style=\"display: none;\" />\r\n                            <button id=\"agent-file-btn\" class=\"btn-clip\" title=\"Extract from Images/PDFs\">\r\n                                <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n                                    stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\r\n                                    <path\r\n                                        d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\">\r\n                                    </path>\r\n                                </svg>\r\n                            </button>\r\n                            <span id=\"cache-badge\" class=\"cache-badge\" style=\"display:none;\">⚡ cached</span>\r\n                        </div>\r\n                        <span class=\"kbd-hint\">Ctrl+↵</span>\r\n                        <button id=\"run\" class=\"btn-primary\">\r\n                            <span id=\"run-text\">Execute</span>\r\n                            <span id=\"run-icon\"></span>\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- Scrollable content area (categories, actions, status, code) -->\r\n                <div class=\"agent-scroll-area\">\r\n                    <!-- Category Tabs for Quick Actions -->\r\n                    <div class=\"action-categories\" id=\"action-categories\">\r\n                        <button class=\"category-tab active\" data-category=\"cleanup\">\r\n                            <span class=\"cat-icon\" data-icon=\"broom\"></span>\r\n                            <span>Cleanup</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"formulas\">\r\n                            <span class=\"cat-icon\" data-icon=\"formula\"></span>\r\n                            <span>Formulas</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"format\">\r\n                            <span class=\"cat-icon\" data-icon=\"palette\"></span>\r\n                            <span>Format</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"reports\">\r\n                            <span class=\"cat-icon\" data-icon=\"barChart\"></span>\r\n                            <span>Reports</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"templates\">\r\n                            <span class=\"cat-icon\" data-icon=\"fileTemplate\"></span>\r\n                            <span>Templates</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"analysis\">\r\n                            <span class=\"cat-icon\" data-icon=\"trendUp\"></span>\r\n                            <span>Analysis</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"extract\">\r\n                            <span class=\"cat-icon\" data-icon=\"upload\"></span>\r\n                            <span>Extract</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"smart\">\r\n                            <span class=\"cat-icon\" data-icon=\"brain\"></span>\r\n                            <span>Smart Tools</span>\r\n                        </button>\r\n                    </div>\r\n\r\n                    <!-- Schema Info Banner (shown in Extract mode) -->\r\n                    <div id=\"schema-info\" class=\"schema-info\" style=\"display: none;\">\r\n                        <div class=\"schema-icon\">📋</div>\r\n                        <div class=\"schema-text\">\r\n                            <strong>Schema-Aware Mode</strong>\r\n                            <span>Data will only be extracted for columns defined in Row 1 of your sheet</span>\r\n                        </div>\r\n                        <button id=\"detect-columns-btn\" class=\"btn-detect\" title=\"Detect column headers\">\r\n                            🔍 Detect\r\n                        </button>\r\n                    </div>\r\n\r\n                    <!-- Detected Columns Preview (shown after detection) -->\r\n                    <div id=\"detected-columns\" class=\"detected-columns\" style=\"display: none;\">\r\n                        <div class=\"detected-header\">\r\n                            <span class=\"detected-label\">Detected Columns:</span>\r\n                            <span id=\"column-count\" class=\"column-count\">0</span>\r\n                        </div>\r\n                        <div id=\"column-chips\" class=\"column-chips\"></div>\r\n                    </div>\r\n\r\n                    <!-- Quick Actions -->\r\n                    <div id=\"quick-actions\" class=\"quick-actions\"></div>\r\n\r\n                    <!-- Skeleton (shown during loading) -->\r\n                    <div id=\"skeleton\" class=\"skeleton-container\" style=\"display: none;\">\r\n                        <div class=\"skeleton-pill\"></div>\r\n                        <div class=\"skeleton-line w80\"></div>\r\n                        <div class=\"skeleton-line w60\"></div>\r\n                    </div>\r\n\r\n                    <!-- Status Message -->\r\n                    <div id=\"status-message\" class=\"status-pill\"></div>\r\n\r\n                    <!-- Debug -->\r\n                    <div id=\"debug-section\">\r\n                        <details>\r\n                            <summary>\r\n                                <span id=\"chevron-icon\"></span>\r\n                                <span>Generated Code</span>\r\n                            </summary>\r\n                            <pre id=\"debug-code\"></pre>\r\n                        </details>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Toast Notification Container -->\r\n        <div id=\"toast-container\" class=\"toast-container\"></div>\r\n    </main>\r\n\r\n    <section id=\"sideload-msg\" class=\"sideload-container\">\r\n        <!-- High-Fidelity Skeleton Screen -->\r\n        <div class=\"sideload-skeleton\">\r\n            <!-- Header Skeleton -->\r\n            <div class=\"sk-header\">\r\n                <div class=\"sk-brand\">\r\n                    <div class=\"sk-logo sk-shimmer\"></div>\r\n                    <div class=\"sk-title sk-shimmer\"></div>\r\n                </div>\r\n                <div class=\"sk-header-actions\">\r\n                    <div class=\"sk-icon-btn sk-shimmer\"></div>\r\n                    <div class=\"sk-icon-btn sk-shimmer\"></div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Mode Toggle Skeleton -->\r\n            <div style=\"padding: 0 16px;\">\r\n                <div class=\"sk-mode-toggle\">\r\n                    <div class=\"sk-mode-tab sk-shimmer\"></div>\r\n                    <div class=\"sk-mode-tab sk-shimmer\"></div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Welcome/Chat Skeleton -->\r\n            <div class=\"sk-welcome\">\r\n                <div class=\"sk-welcome-icon sk-shimmer\"></div>\r\n                <div class=\"sk-welcome-title sk-shimmer\"></div>\r\n                <div class=\"sk-welcome-desc sk-shimmer\"></div>\r\n                <div class=\"sk-welcome-desc short sk-shimmer\"></div>\r\n            </div>\r\n\r\n            <div class=\"sk-suggestions\">\r\n                <div class=\"sk-suggestion sk-shimmer\"></div>\r\n                <div class=\"sk-suggestion sk-shimmer\"></div>\r\n                <div class=\"sk-suggestion sk-shimmer\"></div>\r\n            </div>\r\n\r\n            <div class=\"sk-input-area\">\r\n                <div style=\"padding: 0 16px;\">\r\n                    <div class=\"sk-input sk-shimmer\"></div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"sideload-status\">\r\n                <div class=\"sideload-pulse\"></div>\r\n                <span id=\"loading-status\">Initializing SheetOS AI...</span>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Connection Trouble Overlay -->\r\n        <div id=\"debug-fallback\"\r\n            style=\"display:none; position:fixed; inset:0; background:rgba(255,255,255,0.98); padding:30px; z-index: 10000; flex-direction: column; align-items: center; justify-content: center; text-align: center; font-family: 'Segoe UI', system-ui, sans-serif;\">\r\n\r\n            <div\r\n                style=\"background:#FFF5F5; border:1px solid #FFD1D1; padding:24px; border-radius:16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); max-width: 320px;\">\r\n                <div style=\"font-size: 48px; margin-bottom: 16px;\">🌐</div>\r\n                <h3 style=\"color:#E53E3E; margin:0 0 12px; font-size: 18px;\">Connection Blocked</h3>\r\n                <p style=\"color:#718096; font-size: 13px; line-height: 1.6; margin-bottom: 20px;\">\r\n                    Windows is preventing the Add-in from connecting to the local server.\r\n                </p>\r\n\r\n                <div\r\n                    style=\"text-align: left; background:#fff; padding:12px; border-radius:8px; border:1px solid #EDF2F7; font-size: 12px; margin-bottom: 20px;\">\r\n                    <strong style=\"color:#2D3748; display: block; margin-bottom: 8px;\">Quick Fix:</strong>\r\n                    <ol style=\"margin:0; padding-left:20px; color:#4A5568;\">\r\n                        <li style=\"margin-bottom:6px;\">Open <b>PowerShell</b> as Admin</li>\r\n                        <li style=\"margin-bottom:6px;\">Paste and run this:</li>\r\n                    </ol>\r\n                    <code\r\n                        style=\"display:block; background:#f4f4f4; padding:8px; border-radius:4px; font-size:10px; word-break: break-all; margin-top:8px; color:#c53030; border: 1px solid #e2e8f0;\">\r\n                        npx office-addin-dev-settings loopback --add  5552d631-21e7-4926-b20c-84c6c296efd5\r\n                    </code>\r\n                </div>\r\n\r\n                <a href=\"https://localhost:3000/taskpane.html\" target=\"_blank\"\r\n                    style=\"display:block; background:#E53E3E; color:white; text-decoration:none; padding:10px; border-radius:8px; font-weight:600; font-size:13px; margin-bottom:12px;\">\r\n                    Open Debug & Trust Cert\r\n                </a>\r\n\r\n                <button onclick=\"location.reload()\"\r\n                    style=\"background:none; border:none; color:#718096; font-size:12px; cursor:pointer; text-decoration:underline;\">\r\n                    Try Refreshing\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </section>\r\n\r\n    <template id=\"chat-skeleton-template\">\r\n        <div class=\"chat-msg ai skeleton-msg\">\r\n            <div class=\"chat-bubble skeleton-bubble\">\r\n                <div class=\"skeleton-line w80 sk-shimmer\"></div>\r\n                <div class=\"skeleton-line w60 sk-shimmer\"></div>\r\n                <div class=\"skeleton-line w40 sk-shimmer\"></div>\r\n            </div>\r\n        </div>\r\n    </template>\r\n\r\n    <!-- Fallback Script -->\r\n    <" + "script>\r\n        setTimeout(function () {\r\n            var app = document.getElementById(\"app-body\");\r\n            var fb = document.getElementById(\"debug-fallback\");\r\n            if ((!app || app.style.display === \"none\") && fb) {\r\n                fb.style.display = \"block\";\r\n            }\r\n        }, 30000); // 30 seconds timeout before red box\r\n    <" + "/script>\r\n</body>\r\n\r\n</html>";
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
/******/ 			"taskpane": 0
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
/******/ 	__webpack_require__.O(undefined, ["vendor"], function() { return __webpack_require__("./src/taskpane/taskpane.ts"); })
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], function() { return __webpack_require__("./src/taskpane/taskpane.html"); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=taskpane.js.map