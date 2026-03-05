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
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
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

var BANNED_PATTERNS = [
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

var ALLOWED_API_PATTERNS = [
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
  var errors = [];
  var warnings = [];
  var apiCallsDetected = [];
  var sanitizedCode = code;

  // 1. Remove markdown fences if present
  sanitizedCode = sanitizedCode.replace(/^```(?:javascript|js|typescript|ts)?\n?/gi, "");
  sanitizedCode = sanitizedCode.replace(/\n?```$/gi, "");
  sanitizedCode = sanitizedCode.trim();

  // 2. Check for banned patterns and apply auto-fixes
  var _iterator = _createForOfIteratorHelper(BANNED_PATTERNS),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var banned = _step.value;
      var matches = sanitizedCode.match(banned.pattern);
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
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var loadCalls = (sanitizedCode.match(/\.load\s*\(/g) || []).length;
  var syncCalls = (sanitizedCode.match(/context\.sync\s*\(\s*\)/g) || []).length;
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
    new Function("context", "sheet", "Excel", "return (async () => { ".concat(sanitizedCode, " })();"));
  } catch (syntaxError) {
    errors.push({
      type: "syntax",
      message: syntaxError.message,
      suggestion: "Check for missing brackets, semicolons, or typos"
    });
  }

  // 5. Detect API calls being used
  var _iterator2 = _createForOfIteratorHelper(ALLOWED_API_PATTERNS),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var pattern = _step2.value;
      var _match = sanitizedCode.match(pattern);
      if (_match) {
        apiCallsDetected.push(_match[0]);
      }
    }

    // 6. Check for dangerous patterns
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
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
    var match = sanitizedCode.match(/values\s*=\s*("[^"]*"|'[^']*'|\d+)/);
    if (match) {
      errors.push({
        type: "type_error",
        message: "values must be a 2D array",
        suggestion: "Use range.values = [[".concat(match[1], "]] (2D array)")
      });
    }
  }

  // 8. Auto-fix sheet redeclarations
  sanitizedCode = sanitizedCode.replace(/(?:const|let|var)\s+sheet\s*=\s*context\.workbook\.worksheets\.getActiveWorksheet\(\)\s*;?/g, "// sheet already available");
  return {
    isValid: errors.length === 0,
    errors: errors,
    warnings: warnings,
    sanitizedCode: sanitizedCode,
    apiCallsDetected: apiCallsDetected
  };
}

// ═══════════════════════════════════════════════════════════════
// PLANNER — Analyzes task and creates execution plan
// ═══════════════════════════════════════════════════════════════

var PLANNER_PROMPT = "You are an Excel automation planning expert. Analyze the user's request and create a brief execution plan.\n\nOUTPUT FORMAT (JSON only, no markdown):\n{\n  \"understanding\": \"One sentence summary of what user wants\",\n  \"steps\": [\"Step 1\", \"Step 2\", \"Step 3\"],\n  \"dataNeeded\": [\"What data needs to be read from sheet\"],\n  \"expectedOutput\": \"What the sheet should look like after\",\n  \"complexity\": \"simple|moderate|complex\",\n  \"warnings\": [\"Any potential issues or edge cases\"]\n}\n\nRULES:\n- Keep steps actionable and specific\n- Identify if data needs to be read first\n- Flag complexity based on operations needed\n- Note any ambiguities in the request";
function createPlan(_x, _x2, _x3) {
  return _createPlan.apply(this, arguments);
}

// ═══════════════════════════════════════════════════════════════
// CODER — Generates validated Excel JavaScript code
// ═══════════════════════════════════════════════════════════════
function _createPlan() {
  _createPlan = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(task, sheetContext, signal) {
    var contextInfo, messages, response, jsonMatch, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          contextInfo = "";
          if (sheetContext && sheetContext.hasData) {
            contextInfo = "\n\nCURRENT SHEET CONTEXT:\n- Sheet: \"".concat(sheetContext.sheetName, "\"\n- Size: ").concat(sheetContext.rowCount, " rows \xD7 ").concat(sheetContext.columnCount, " columns\n- Headers: ").concat(sheetContext.headers.join(", "), "\n- Data Types: ").concat(sheetContext.dataTypes.join(", "));
          }
          messages = [{
            role: "system",
            content: PLANNER_PROMPT
          }, {
            role: "user",
            content: task + contextInfo
          }];
          _context.n = 1;
          return (0,_llm_service__WEBPACK_IMPORTED_MODULE_0__.callLLM)(messages, undefined, signal);
        case 1:
          response = _context.v;
          _context.p = 2;
          // Extract JSON from response
          jsonMatch = response.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            _context.n = 3;
            break;
          }
          return _context.a(2, JSON.parse(jsonMatch[0]));
        case 3:
          _context.n = 5;
          break;
        case 4:
          _context.p = 4;
          _t = _context.v;
          console.warn("Failed to parse plan:", _t);
        case 5:
          return _context.a(2, {
            understanding: task,
            steps: ["Execute the requested operation"],
            dataNeeded: [],
            expectedOutput: "Modified spreadsheet",
            complexity: "moderate",
            warnings: []
          });
      }
    }, _callee, null, [[2, 4]]);
  }));
  return _createPlan.apply(this, arguments);
}
var CODER_SYSTEM_PROMPT = "You are an Excel JavaScript API expert. Generate ONLY executable code.\n\nENVIRONMENT (pre-declared, DO NOT redeclare):\n- context: Excel.RequestContext\n- sheet: Active worksheet (already loaded)\n- Excel: Namespace for enums\n\nCRITICAL API RULES:\n1. Properties require .load() + await context.sync() before reading\n2. Writing: range.values = [[...]] (2D array always)\n3. Reading: range.load(\"values\"); await context.sync(); // then access range.values\n4. Formats: range.format.font.bold, range.format.fill.color, range.format.horizontalAlignment\n5. Always check rowCount and columnCount before using getRow or formatting\n6. Use context-aware formatting: adapt colors, fonts, borders, and row heights based on sheet type (office, banking, school, etc.)\n7. Clearing Formats ONLY: range.clear(Excel.ClearApplyTo.Formats)\n8. Clearing ALL content in sheer: sheet.getUsedRange().clear()\n9. Charts: sheet.charts.add(Excel.ChartType.xxx, dataRange, Excel.ChartSeriesBy.auto)\n10. Tables: sheet.tables.add(range, hasHeaders)\n11. Document Extraction: ALWAYS extract data as a flat HORIZONTAL table (Headers in row 1, data appended below). NEVER mimic vertical document layouts or create key-value lists (e.g., \"Name: Bob\" in column A). All data text must be a visible color (e.g. black).\n12. Memory Lifetime: If saving an object (like usedRange) to a variable used across multiple context.sync() calls, ALWAYS pin it: context.trackedObjects.add(usedRange)\n\nBANNED (will crash):\n- sheet.clear() \u2192 Worksheet lacks this method. Use sheet.getUsedRange().clear()\n- .getValues(), .getRowCount(), .getColumnCount(), .getAddress() \u2192 Use properties after load+sync\n- .setValues(), .setFormula() \u2192 Use property assignment\n- .clearFormats() \u2192 Use .clear(Excel.ClearApplyTo.formats)\n- SpreadsheetApp, Logger.log \u2192 Wrong platform\n- alert(), confirm(), prompt() \u2192 Blocked in add-ins\n- const sheet = ... \u2192 Already declared\n- const context = ... \u2192 Already declared\n\nMANDATORY HELPERS (available in environment, use them):\nfunction writeData(sheet, startCell, data): Range // Safely writes 2D array and expands matrix\nfunction formatTableStyle(usedRange, headerColor, fontColor): void // Safely styles the table and handles row bounds without throwing properties errors\n\nSAFE FORMATTING TEMPLATE (adapt details based on sheet type):\n// Step 1: Get used range, track it to prevent expiration, and load properties\nconst usedRange = sheet.getUsedRange();\ncontext.trackedObjects.add(usedRange);\nusedRange.load(\"values,rowCount,columnCount,address\");\nawait context.sync();\n\n// Step 2: Check if sheet has data\nif (!usedRange || usedRange.rowCount < 1 || usedRange.columnCount < 1) {\n  throw new Error(\"Sheet appears empty. Add some data first.\");\n}\n\n// Step 3: Format the range efficiently using the built-in helper\nformatTableStyle(usedRange, \"#1B2A4A\", \"#FFFFFF\");\nawait context.sync();\n\n// Step 5: Add borders to all cells\nusedRange.format.borders.getItem(\"InsideHorizontal\").style = \"Thin\";\nusedRange.format.borders.getItem(\"InsideVertical\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeTop\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeBottom\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeLeft\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeRight\").style = \"Thin\";\n\n// Step 6: Add medium bottom border under header\nheaderRow.format.borders.getItem(\"EdgeBottom\").style = \"Medium\";\nheaderRow.format.borders.getItem(\"EdgeBottom\").color = \"#1B2A4A\"; // Adapt color for sheet type\n\n// Step 7: Freeze first row\nsheet.freezePanes.freezeRows(1);\n\n// Step 8: Auto-fit columns\nusedRange.format.autofitColumns();\nawait context.sync();\n\nOUTPUT: Raw JavaScript code only. No markdown, no explanation.";
function generateCode(_x4, _x5, _x6, _x7, _x8, _x9) {
  return _generateCode.apply(this, arguments);
}

// ═══════════════════════════════════════════════════════════════
// FIXER — Repairs code based on validation or runtime errors
// ═══════════════════════════════════════════════════════════════
function _generateCode() {
  _generateCode = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(task, plan, sheetContext, attachedFiles, previousError, signal) {
    var prompt, i, _i, messages, contentParts, code, firstNewline;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          prompt = task; // Add plan context
          // (Removed problematic template string, use only string concatenation below)
          // Add plan context
          if (plan) {
            prompt += '\n\nPLAN:\n';
            for (i = 0; i < plan.steps.length; i++) {
              prompt += i + 1 + '. ' + plan.steps[i] + '\n';
            }
            if (plan.warnings.length > 0) {
              prompt += '\n\nWATCH OUT FOR:\n';
              for (_i = 0; _i < plan.warnings.length; _i++) {
                prompt += plan.warnings[_i] + '\n';
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
          messages = [{
            role: "system",
            content: CODER_SYSTEM_PROMPT
          }];
          if (attachedFiles.length > 0) {
            contentParts = [{
              type: "text",
              text: prompt
            }];
            attachedFiles.forEach(function (file) {
              file.data.slice(0, 10).forEach(function (imageUrl) {
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
          _context2.n = 1;
          return (0,_llm_service__WEBPACK_IMPORTED_MODULE_0__.callLLM)(messages, undefined, signal);
        case 1:
          code = _context2.v;
          // Clean up response: remove surrounding triple-backtick fences and optional language tag
          if (code.startsWith('```')) {
            firstNewline = code.indexOf('\n');
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
          return _context2.a(2, code);
      }
    }, _callee2);
  }));
  return _generateCode.apply(this, arguments);
}
var FIXER_SYSTEM_PROMPT = "You are an Excel JavaScript API debugger. Fix the broken code.\n\nCOMMON FIXES:\n1. .getValues() \u2192 .load(\"values\") + await context.sync() + .values\n2. .getRowCount() \u2192 .load(\"rowCount\") + await context.sync() + .rowCount\n3. range.values = \"text\" \u2192 range.values = [[\"text\"]]\n4. const sheet = ... \u2192 REMOVE (already declared)\n5. SpreadsheetApp \u2192 Use sheet (Excel JS API)\n6. chart.setTitle() \u2192 chart.title.text = \"...\"\n\nOUTPUT: Fixed code only. No explanation, no markdown fences.";
function fixCode(_x0, _x1, _x10, _x11) {
  return _fixCode.apply(this, arguments);
}

// ═══════════════════════════════════════════════════════════════
// ORCHESTRATOR — Main agent loop (LangGraph-inspired)
// ═══════════════════════════════════════════════════════════════
function _fixCode() {
  _fixCode = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(originalCode, errors, runtimeError, signal) {
    var errorSummary, messages, fixedCode;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          errorSummary = "";
          if (errors.length > 0) {
            errorSummary = "VALIDATION ERRORS:\n" + errors.map(function (e) {
              return "- ".concat(e.message, " \u2192 ").concat(e.suggestion);
            }).join("\n");
          }
          if (runtimeError) {
            errorSummary += (errorSummary ? "\n\n" : "") + "RUNTIME ERROR: ".concat(runtimeError);
          }
          messages = [{
            role: "system",
            content: FIXER_SYSTEM_PROMPT
          }, {
            role: "user",
            content: "BROKEN CODE:\n".concat(originalCode, "\n\n").concat(errorSummary, "\n\nFix the code:")
          }];
          _context3.n = 1;
          return (0,_llm_service__WEBPACK_IMPORTED_MODULE_0__.callLLM)(messages, undefined, signal);
        case 1:
          fixedCode = _context3.v;
          // Clean response
          fixedCode = fixedCode.replace(/^```(?:javascript|js|typescript|ts)?\n?/gi, "");
          fixedCode = fixedCode.replace(/\n?```$/gi, "");
          return _context3.a(2, fixedCode.trim());
      }
    }, _callee3);
  }));
  return _fixCode.apply(this, arguments);
}
var DEFAULT_CONFIG = {
  maxRetries: 3,
  enablePlanning: true,
  strictValidation: true,
  timeout: 30000
};
function runAgent(_x12, _x13, _x14) {
  return _runAgent.apply(this, arguments);
}

// ═══════════════════════════════════════════════════════════════
// EXECUTE WITH RECOVERY — Safe code execution with auto-fix
// ═══════════════════════════════════════════════════════════════
function _runAgent() {
  _runAgent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(task, sheetContext, attachedFiles) {
    var config,
      signal,
      cfg,
      startTime,
      plan,
      code,
      validation,
      retries,
      attempt,
      _args4 = arguments,
      _t2,
      _t3;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          config = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : {};
          signal = _args4.length > 4 ? _args4[4] : undefined;
          cfg = _objectSpread(_objectSpread({}, DEFAULT_CONFIG), config);
          startTime = Date.now();
          plan = null;
          code = "";
          validation = null;
          retries = 0;
          _context4.p = 1;
          if (!(cfg.enablePlanning && !attachedFiles.length)) {
            _context4.n = 6;
            break;
          }
          _context4.p = 2;
          _context4.n = 3;
          return createPlan(task, sheetContext, signal);
        case 3:
          plan = _context4.v;
          console.log("[Agent] Plan created:", plan);
          _context4.n = 6;
          break;
        case 4:
          _context4.p = 4;
          _t2 = _context4.v;
          if (!(_t2.name === 'AbortError')) {
            _context4.n = 5;
            break;
          }
          throw _t2;
        case 5:
          console.warn("[Agent] Planning failed, proceeding without plan:", _t2);
        case 6:
          _context4.n = 7;
          return generateCode(task, plan, sheetContext, attachedFiles, undefined, signal);
        case 7:
          code = _context4.v;
          console.log("[Agent] Initial code generated");

          // ═══ PHASE 3: VALIDATION LOOP ═══
          attempt = 0;
        case 8:
          if (!(attempt <= cfg.maxRetries)) {
            _context4.n = 12;
            break;
          }
          validation = validateCode(code);
          if (!validation.isValid) {
            _context4.n = 9;
            break;
          }
          console.log("[Agent] Code validated successfully on attempt ".concat(attempt + 1));
          return _context4.a(3, 12);
        case 9:
          if (!(attempt < cfg.maxRetries)) {
            _context4.n = 11;
            break;
          }
          console.log("[Agent] Validation failed (attempt ".concat(attempt + 1, "), fixing..."));
          _context4.n = 10;
          return fixCode(code, validation.errors, undefined, signal);
        case 10:
          code = _context4.v;
          retries++;
        case 11:
          attempt++;
          _context4.n = 8;
          break;
        case 12:
          // Final validation check
          validation = validateCode(code);
          if (!(!validation.isValid && cfg.strictValidation)) {
            _context4.n = 13;
            break;
          }
          throw new Error("Code validation failed: ".concat(validation.errors.map(function (e) {
            return e.message;
          }).join("; ")));
        case 13:
          // Use sanitized code
          code = validation.sanitizedCode;
          return _context4.a(2, {
            success: true,
            code: code,
            plan: plan,
            validation: validation,
            retries: retries,
            duration: Date.now() - startTime
          });
        case 14:
          _context4.p = 14;
          _t3 = _context4.v;
          return _context4.a(2, {
            success: false,
            code: code,
            plan: plan,
            validation: validation,
            error: _t3.message,
            retries: retries,
            duration: Date.now() - startTime
          });
      }
    }, _callee4, null, [[2, 4], [1, 14]]);
  }));
  return _runAgent.apply(this, arguments);
}
function executeWithRecovery(_x15, _x16) {
  return _executeWithRecovery.apply(this, arguments);
}

// ═══════════════════════════════════════════════════════════════
// UTILITY: Read current sheet context
// ═══════════════════════════════════════════════════════════════
function _executeWithRecovery() {
  _executeWithRecovery = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(code, executor) {
    var maxRetries,
      signal,
      currentCode,
      lastError,
      attempt,
      validation,
      _args5 = arguments,
      _t4;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          maxRetries = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : 2;
          signal = _args5.length > 3 ? _args5[3] : undefined;
          currentCode = code;
          lastError = "";
          attempt = 0;
        case 1:
          if (!(attempt <= maxRetries)) {
            _context5.n = 9;
            break;
          }
          if (!(signal !== null && signal !== void 0 && signal.aborted)) {
            _context5.n = 2;
            break;
          }
          throw new DOMException("Execution cancelled", "AbortError");
        case 2:
          _context5.p = 2;
          _context5.n = 3;
          return executor(currentCode);
        case 3:
          return _context5.a(2, {
            success: true,
            finalCode: currentCode
          });
        case 4:
          _context5.p = 4;
          _t4 = _context5.v;
          lastError = _t4.message || String(_t4);
          console.warn("[Agent] Execution failed (attempt ".concat(attempt + 1, "):"), lastError);
          if (!(attempt < maxRetries)) {
            _context5.n = 8;
            break;
          }
          _context5.n = 5;
          return fixCode(currentCode, [], lastError, signal);
        case 5:
          currentCode = _context5.v;
          // Re-validate fixed code
          validation = validateCode(currentCode);
          if (!validation.isValid) {
            _context5.n = 6;
            break;
          }
          currentCode = validation.sanitizedCode;
          _context5.n = 8;
          break;
        case 6:
          _context5.n = 7;
          return fixCode(currentCode, validation.errors, undefined, signal);
        case 7:
          currentCode = _context5.v;
        case 8:
          attempt++;
          _context5.n = 1;
          break;
        case 9:
          return _context5.a(2, {
            success: false,
            error: lastError,
            finalCode: currentCode
          });
      }
    }, _callee5, null, [[2, 4]]);
  }));
  return _executeWithRecovery.apply(this, arguments);
}
function readSheetContext() {
  return _readSheetContext.apply(this, arguments);
}
function _readSheetContext() {
  _readSheetContext = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    var _t5;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          _context8.n = 1;
          return Excel.run(/*#__PURE__*/function () {
            var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(context) {
              var sheet, usedRange, values, headers, dataTypes, _loop, col;
              return _regenerator().w(function (_context7) {
                while (1) switch (_context7.n) {
                  case 0:
                    sheet = context.workbook.worksheets.getActiveWorksheet();
                    sheet.load("name");
                    usedRange = sheet.getUsedRangeOrNullObject();
                    usedRange.load("values,rowCount,columnCount,isNullObject");
                    _context7.n = 1;
                    return context.sync();
                  case 1:
                    if (!(usedRange.isNullObject || usedRange.rowCount === 0 || usedRange.columnCount === 0)) {
                      _context7.n = 2;
                      break;
                    }
                    return _context7.a(2, {
                      sheetName: sheet.name,
                      rowCount: 0,
                      columnCount: 0,
                      headers: [],
                      sampleData: [],
                      dataTypes: [],
                      hasData: false
                    });
                  case 2:
                    values = usedRange.values;
                    headers = values[0].map(function (h) {
                      return String(h || "").trim();
                    }); // Detect data types
                    dataTypes = [];
                    if (!(values.length > 1)) {
                      _context7.n = 5;
                      break;
                    }
                    _loop = /*#__PURE__*/_regenerator().m(function _loop(col) {
                      var colValues;
                      return _regenerator().w(function (_context6) {
                        while (1) switch (_context6.n) {
                          case 0:
                            colValues = values.slice(1).map(function (row) {
                              return row[col];
                            }).filter(function (v) {
                              return v != null && v !== "";
                            });
                            if (colValues.length === 0) {
                              dataTypes.push("empty");
                            } else if (colValues.every(function (v) {
                              return !isNaN(Number(v));
                            })) {
                              dataTypes.push("number");
                            } else if (colValues.every(function (v) {
                              return /^\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}/.test(String(v));
                            })) {
                              dataTypes.push("date");
                            } else {
                              dataTypes.push("text");
                            }
                          case 1:
                            return _context6.a(2);
                        }
                      }, _loop);
                    });
                    col = 0;
                  case 3:
                    if (!(col < usedRange.columnCount)) {
                      _context7.n = 5;
                      break;
                    }
                    return _context7.d(_regeneratorValues(_loop(col)), 4);
                  case 4:
                    col++;
                    _context7.n = 3;
                    break;
                  case 5:
                    return _context7.a(2, {
                      sheetName: sheet.name,
                      rowCount: usedRange.rowCount,
                      columnCount: usedRange.columnCount,
                      headers: headers,
                      sampleData: values.slice(0, 10),
                      dataTypes: dataTypes,
                      hasData: true
                    });
                }
              }, _callee6);
            }));
            return function (_x17) {
              return _ref.apply(this, arguments);
            };
          }());
        case 1:
          return _context8.a(2, _context8.v);
        case 2:
          _context8.p = 2;
          _t5 = _context8.v;
          console.error("Failed to read sheet context:", _t5);
          return _context8.a(2, null);
      }
    }, _callee7, null, [[0, 2]]);
  }));
  return _readSheetContext.apply(this, arguments);
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
var CHAT_PROMPT = "You are SheetOS AI \u2014 a friendly, expert Excel assistant in Planning Mode.\n\nYOUR ROLE:\n- Help users plan their spreadsheet work\n- Explain Excel concepts, formulas, and best practices\n- Suggest approaches before executing\n- Answer questions about data organization, analysis, and visualization\n- Provide formula examples and explanations\n- When given sheet context, analyze the USER'S ACTUAL DATA and answer questions directly using the data provided\n- If the user asks for details about a person or entity (e.g., \"What are John's contact details?\"), and you see that entity in the \uD83D\uDEA8 SEARCH HITS, provide all relevant information from that row.\n\nCONTEXT AWARENESS:\nWhen a message includes [SHEET CONTEXT], you have access to the user's ACTUAL Excel data!\n- Analyze the real column names, data types, and sample values\n- Give SPECIFIC answers or suggestions based on their actual data structure\n- Reference their exact column names in your response\n- Suggest improvements tailored to their dataset\n- Point out data quality issues you observe (empty cells, inconsistent formats, etc.)\n- You CAN see their sheet \u2014 do NOT say \"I don't have access to your sheet\"\n- If you see \uD83D\uDEA8 SEARCH HITS in the context, these are specific values found in the sheet. Use them to answer questions like \"Where is X?\", \"Does Y exist?\", or \"Give me details on Z\". Reference the exact cell address shown in the match.\n- Answering questions about existing data should be done DIRECTLY in chat. You do NOT need Agent Mode for simple information retrieval.\n\nRESPONSE FORMAT RULES:\n1. Respond in natural, conversational language\n2. Use markdown-style formatting for emphasis: **bold**, *italic*, `code`\n3. When showing formulas, wrap them in backticks: `=VLOOKUP(A2, Sheet2!A:B, 2, FALSE)`\n4. Use bullet points and numbered lists for clarity\n5. Keep responses concise but thorough (aim for 2-5 paragraphs max)\n6. If the user's request requires MODIFYING the sheet (formatting, inserting, complex calculations), mention that they can switch to \u26A1 Agent Mode to execute it\n7. When you have sheet context, ALWAYS reference the user's actual column names and data\n\nEXCEL EXPERTISE AREAS:\n- Information retrieval from the current sheet\n- Formula writing & debugging (VLOOKUP, INDEX/MATCH, IF, SUMIFS, etc.)\n- Data organization best practices\n- Chart type selection guidance\n- PivotTable planning\n- Data validation strategies\n- Conditional formatting approaches\n- Dashboard design principles\n- Data cleaning strategies\n- Performance optimization tips\n- Cross-sheet referencing patterns\n\nPERSONALITY:\n- Friendly and encouraging\n- Uses concrete examples when explaining\n- Proactive \u2014 suggest improvements the user might not have thought of\n- Mentions potential pitfalls or common mistakes to avoid\n\nIf the user asks you to MODIFY or EXECUTE something (create, format, calculate), remind them:\n\"\uD83D\uDCA1 Switch to \u26A1 Agent Mode to execute this! I can help you plan it here first.\"\n(Remember: Reading data and answering questions about it can be done here in Chat.)\n\nUser Message:\n";

/**
 * Prompt for generating contextual suggestions based on sheet data
 */
var CONTEXT_PROMPT = "You are SheetOS AI. Based on the following spreadsheet data, suggest 3-4 useful actions the user could take. Each suggestion should be a short phrase (5-8 words max). Format as a JSON array of strings. Example: [\"Add SUM to numeric columns\", \"Create a bar chart\", \"Apply professional formatting\"]. Only output the JSON array, nothing else.\n\nSheet Data:\n";

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
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/**
 * Document Extractor Service
 * Schema-aware extraction from PDFs/CVs that only extracts data for specified columns.
 * NO HALLUCINATION - if data doesn't exist, leave it blank.
 */

/**
 * Get the schema-aware extraction prompt
 */
function getSchemaExtractionPrompt(schema) {
  var columnList = schema.columns.map(function (c, i) {
    return "".concat(i + 1, ". \"").concat(c, "\"");
  }).join("\n");
  return "You are a PRECISION DATA EXTRACTOR. Your job is to extract information from documents with ZERO hallucination.\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nCRITICAL RULES \u2014 MEMORIZE THESE:\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\n1. **SCHEMA LOCKED**: The user has predefined these columns in Excel. You MUST ONLY extract data for these columns:\n".concat(columnList, "\n\n2. **NO FABRICATION**: If a piece of information is NOT explicitly present in the document, return an EMPTY STRING (\"\"). Do NOT guess, infer, or make up data.\n\n3. **EXACT MATCHING**: \n   - \"Name\" \u2192 Look for full name (first + last)\n   - \"Email\" \u2192 Look for @email patterns\n   - \"Phone\" / \"Mobile\" / \"Contact\" \u2192 Look for phone numbers\n   - \"Age\" \u2192 Look for age OR calculate from DOB if present\n   - \"Address\" \u2192 Full address if available\n   - \"Skills\" \u2192 Technical skills, languages, tools\n   - \"Experience\" \u2192 Years or job titles\n   - \"Education\" \u2192 Degrees, institutions\n   - \"LinkedIn\" \u2192 LinkedIn URLs only\n\n4. **DATA CLEANING**:\n   - Names: Proper Case (John Smith, not JOHN SMITH)\n   - Phones: Keep original format or standardize to +1-XXX-XXX-XXXX\n   - Emails: Lowercase\n   - Dates: Keep as found (Jan 2020 - Dec 2022)\n\n5. **ONE ROW PER DOCUMENT**: Each uploaded PDF/image represents ONE candidate/record. Output exactly one row of data per document.\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nOUTPUT FORMAT:\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\nReturn a JSON array of objects. Each object has keys matching the column names EXACTLY.\n\nExample for columns [\"Name\", \"Email\", \"Phone\", \"Skills\"]:\n[\n  {\"Name\": \"John Smith\", \"Email\": \"john@email.com\", \"Phone\": \"+1-555-123-4567\", \"Skills\": \"Python, Excel, SQL\"},\n  {\"Name\": \"Jane Doe\", \"Email\": \"jane.doe@company.com\", \"Phone\": \"\", \"Skills\": \"JavaScript, React\"}\n]\n\nNote: Jane Doe had no phone number visible in her resume, so it's left as \"\".\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nWHAT NOT TO DO:\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\n\u274C Do NOT add columns that aren't in the schema\n\u274C Do NOT guess email addresses (e.g., firstname.lastname@company.com)\n\u274C Do NOT fabricate phone numbers\n\u274C Do NOT hallucinate skills or experience not mentioned\n\u274C Do NOT include \"N/A\", \"Not Found\", \"Unknown\" \u2014 use \"\" instead\n\u274C Do NOT include markdown formatting \u2014 ONLY raw JSON\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nNOW EXTRACT FROM THE ATTACHED DOCUMENTS:\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n");
}

/**
 * Generate Excel code that writes extracted data to the sheet
 */
function generateExcelCode(columns, data) {
  // Serialize data for JS injection
  var serializedData = JSON.stringify(data, null, 2);
  var serializedColumns = JSON.stringify(columns);
  return "\n// \u2500\u2500\u2500 Schema-Aware Resume Extraction \u2500\u2500\u2500\n// Columns: ".concat(columns.join(", "), "\n// Records: ").concat(data.length, "\n\n// Extracted Data\nconst columns = ").concat(serializedColumns, ";\nconst extractedData = ").concat(serializedData, ";\n\n// Check if headers exist (row 1)\nconst headerRange = sheet.getRange(\"A1\").getResizedRange(0, columns.length - 1);\nheaderRange.load(\"values\");\nawait context.sync();\n\nconst existingHeaders = headerRange.values[0];\nconst hasHeaders = existingHeaders.some(h => h && h.toString().trim() !== \"\");\n\nlet startRow = 2; // Default: after headers\n\nif (!hasHeaders) {\n    // No headers \u2014 write them first\n    const headerData = [columns];\n    const headerWriteRange = writeData(sheet, \"A1\", headerData);\n    if (headerWriteRange) {\n        headerWriteRange.format.font.bold = true;\n        headerWriteRange.format.fill.color = \"#2D6A4F\";\n        headerWriteRange.format.font.color = \"#FFFFFF\";\n        headerWriteRange.format.rowHeight = 28;\n    }\n} else {\n    // Headers exist \u2014 find the last row with data\n    const usedRange = sheet.getUsedRange();\n    usedRange.load(\"rowCount\");\n    await context.sync();\n    startRow = usedRange.rowCount + 1;\n}\n\n// Convert extracted objects to 2D array matching column order\nconst dataRows = extractedData.map(record => {\n    return columns.map(col => {\n        const value = record[col];\n        return value !== undefined && value !== null ? String(value) : \"\";\n    });\n});\n\nif (dataRows.length > 0) {\n    const dataRange = writeData(sheet, \"A\" + startRow, dataRows);\n    \n    if (dataRange) {\n        // Apply alternating row colors\n        for (let i = 0; i < dataRows.length; i++) {\n            const row = dataRange.getRow(i);\n            if (i % 2 === 0) {\n                row.format.fill.color = \"#F0FAF5\";\n            }\n        }\n        \n        // Apply borders\n        const borderStyle = \"Thin\";\n        dataRange.format.borders.getItem(\"InsideHorizontal\").style = borderStyle;\n        dataRange.format.borders.getItem(\"InsideVertical\").style = borderStyle;\n        dataRange.format.borders.getItem(\"EdgeTop\").style = borderStyle;\n        dataRange.format.borders.getItem(\"EdgeBottom\").style = borderStyle;\n        dataRange.format.borders.getItem(\"EdgeLeft\").style = borderStyle;\n        dataRange.format.borders.getItem(\"EdgeRight\").style = borderStyle;\n    }\n}\n\n// Final autofit\nsheet.getUsedRange().format.autofitColumns();\n");
}

/**
 * Parse LLM response to extract JSON data
 */
function parseExtractionResponse(response) {
  // Clean the response - remove markdown code blocks
  var cleaned = response.trim();
  cleaned = cleaned.replace(/^```json?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");
  cleaned = cleaned.trim();

  // Try to find JSON array in the response
  var jsonMatch = cleaned.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.warn("No JSON array found in response:", cleaned.substring(0, 200));
    return [];
  }
  try {
    var parsed = JSON.parse(jsonMatch[0]);
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
  var warnings = [];
  var unmappedFields = [];

  // Check each row for unmapped fields
  data.forEach(function (row, index) {
    Object.keys(row).forEach(function (key) {
      if (!schema.columns.includes(key) && !unmappedFields.includes(key)) {
        unmappedFields.push(key);
      }
    });

    // Check for empty required fields
    schema.columns.forEach(function (col) {
      if (!row[col] || row[col].toString().trim() === "") {
        warnings.push("Row ".concat(index + 1, ": \"").concat(col, "\" is empty"));
      }
    });
  });
  if (unmappedFields.length > 0) {
    warnings.push("Found data for columns not in schema: ".concat(unmappedFields.join(", ")));
  }
  return {
    success: data.length > 0,
    data: data,
    warnings: warnings,
    unmappedFields: unmappedFields
  };
}

/**
 * Common column name mappings for intelligent matching
 */
var COLUMN_ALIASES = {
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
  var normalized = columnName.trim();

  // Check direct match first
  if (COLUMN_ALIASES[normalized]) {
    return normalized;
  }

  // Check aliases
  for (var _i = 0, _Object$entries = Object.entries(COLUMN_ALIASES); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      standard = _Object$entries$_i[0],
      aliases = _Object$entries$_i[1];
    if (aliases.some(function (alias) {
      return alias.toLowerCase() === normalized.toLowerCase();
    })) {
      return standard;
    }
  }
  return normalized;
}

/**
 * Build extraction prompt with column aliases for better matching
 */
function buildEnhancedPrompt(columns) {
  var columnDetails = columns.map(function (col) {
    var aliases = COLUMN_ALIASES[col] || [];
    var aliasHint = aliases.length > 0 ? " (also look for: ".concat(aliases.slice(0, 3).join(", "), ")") : "";
    return "\u2022 \"".concat(col, "\"").concat(aliasHint);
  }).join("\n");
  return "\nCOLUMNS TO EXTRACT:\n".concat(columnDetails, "\n\nRemember: If you cannot find data for a column, return \"\". Never guess or fabricate.\n");
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
var SYSTEM_PROMPT = "You are SheetOS AI, an Excel JavaScript API expert. Generate ONLY executable JS code.\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nENVIRONMENT (Already available \u2014 DO NOT redeclare these):\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n- context: Excel.RequestContext (ready to use)\n- sheet: Active worksheet (already loaded)\n- Excel: Namespace for enums (Excel.ChartType, Excel.BorderLineStyle, etc.)\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nCRITICAL RULES (MUST FOLLOW):\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n1. OUTPUT: Raw executable JavaScript ONLY. No markdown, no explanations.\n2. NO REDECLARATIONS: Never write \"const context = ...\" or \"const sheet = ...\"\n3. LOAD BEFORE READ: Properties like .values, .rowCount require .load() + await context.sync()\n4. 2D ARRAYS: range.values and range.formulas MUST be 2D arrays: [[value]]\n5. SYNC OFTEN: Call await context.sync() after every .load() before accessing properties\n6. SAFETY: Always check if range/data exists before operating on it\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nBANNED PATTERNS (WILL CRASH \u2014 NEVER USE):\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\u274C .getValues()         \u2192 Use: range.load(\"values\"); await context.sync(); range.values\n\u274C .getRowCount()       \u2192 Use: range.load(\"rowCount\"); await context.sync(); range.rowCount\n\u274C .getColumnCount()    \u2192 Use: range.load(\"columnCount\"); await context.sync(); range.columnCount\n\u274C .getAddress()        \u2192 Use: range.load(\"address\"); await context.sync(); range.address\n\u274C .getText()           \u2192 Use: range.load(\"text\"); await context.sync(); range.text\n\u274C .setValues(x)        \u2192 Use: range.values = [[x]]\n\u274C .setFormula(x)       \u2192 Use: range.formulas = [[\"=SUM(A:A)\"]]\n\u274C .setValue(x)         \u2192 Use: range.values = [[x]]\n\u274C range.font.bold      \u2192 Use: range.format.font.bold\n\u274C range.alignment      \u2192 Use: range.format.horizontalAlignment\n\u274C chart.setTitle(x)    \u2192 Use: chart.title.text = x\n\u274C chart.add()          \u2192 Use: sheet.charts.add()\n\u274C range.getItem()      \u2192 Use: range.getCell(row, col)\n\u274C range.select()       \u2192 REMOVE (causes performance issues)\n\u274C range.activate()     \u2192 REMOVE (not needed)\n\u274C SpreadsheetApp       \u2192 WRONG PLATFORM (this is Google Apps Script)\n\u274C Logger.log()         \u2192 REMOVE or use console.log\n\u274C Browser.msgBox()     \u2192 REMOVE (not available)\n\u274C alert() / confirm()  \u2192 REMOVE (blocked in add-ins)\n\u274C message.alert()      \u2192 REMOVE (doesn't exist)\n\u274C getRange(\"A0\")       \u2192 Row 0 doesn't exist. Use A1 or higher.\n\u274C const context = ...  \u2192 ALREADY DECLARED\n\u274C const sheet = ...    \u2192 ALREADY DECLARED\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nCORRECT PATTERNS (COPY THESE):\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\n// \u2500\u2500\u2500 Read Data from Sheet \u2500\u2500\u2500\nconst usedRange = sheet.getUsedRange();\nusedRange.load(\"values,rowCount,columnCount\");\nawait context.sync();\nconst data = usedRange.values; // Now accessible\nconst rows = usedRange.rowCount;\nconst cols = usedRange.columnCount;\n\n// \u2500\u2500\u2500 Write Data (Single Cell) \u2500\u2500\u2500\nsheet.getRange(\"A1\").values = [[\"Hello World\"]];\n\n// \u2500\u2500\u2500 Write Data (Multiple Cells) \u2500\u2500\u2500\nsheet.getRange(\"A1:C2\").values = [\n  [\"Name\", \"Age\", \"City\"],\n  [\"John\", 25, \"NYC\"]\n];\n\n// \u2500\u2500\u2500 Formulas \u2500\u2500\u2500\nsheet.getRange(\"D2\").formulas = [[\"=SUM(B2:C2)\"]];\n// Multiple formulas:\nsheet.getRange(\"D2:D5\").formulas = [\n  [\"=SUM(B2:C2)\"],\n  [\"=SUM(B3:C3)\"],\n  [\"=SUM(B4:C4)\"],\n  [\"=SUM(B5:C5)\"]\n];\n\n// \u2500\u2500\u2500 Formatting \u2500\u2500\u2500\nconst r = sheet.getRange(\"A1:D1\");\nr.format.font.bold = true;\nr.format.font.color = \"#FFFFFF\";\nr.format.fill.color = \"#4472C4\";\nr.format.horizontalAlignment = \"Center\";\nr.format.verticalAlignment = \"Center\";\nr.format.rowHeight = 28;\n\n// \u2500\u2500\u2500 Borders \u2500\u2500\u2500\nconst range = sheet.getRange(\"A1:D10\");\nrange.format.borders.getItem(\"InsideHorizontal\").style = \"Thin\";\nrange.format.borders.getItem(\"InsideVertical\").style = \"Thin\";\nrange.format.borders.getItem(\"EdgeTop\").style = \"Thin\";\nrange.format.borders.getItem(\"EdgeBottom\").style = \"Thin\";\nrange.format.borders.getItem(\"EdgeLeft\").style = \"Thin\";\nrange.format.borders.getItem(\"EdgeRight\").style = \"Thin\";\n\n// \u2500\u2500\u2500 Charts \u2500\u2500\u2500\nconst chartRange = sheet.getRange(\"A1:B5\");\nconst chart = sheet.charts.add(Excel.ChartType.columnClustered, chartRange, Excel.ChartSeriesBy.auto);\nchart.title.text = \"Sales Report\";\nchart.setPosition(\"E2\", \"L15\");\n\n// \u2500\u2500\u2500 Tables \u2500\u2500\u2500\nconst tableRange = sheet.getRange(\"A1:D10\");\nconst table = sheet.tables.add(tableRange, true);\ntable.name = \"SalesTable\";\ntable.style = \"TableStyleMedium9\";\n\n// \u2500\u2500\u2500 Conditional Formatting \u2500\u2500\u2500\nconst cfRange = sheet.getRange(\"C2:C100\");\nconst cf = cfRange.conditionalFormats.add(Excel.ConditionalFormatType.cellValue);\ncf.cellValue.format.fill.color = \"#92D050\";\ncf.cellValue.rule = { formula1: \"=50\", operator: \"GreaterThan\" };\n\n// \u2500\u2500\u2500 Data Validation (Dropdown) \u2500\u2500\u2500\nsheet.getRange(\"E2:E100\").dataValidation.rule = {\n  list: { inCellDropDown: true, source: \"Yes,No,Maybe\" }\n};\n\n// \u2500\u2500\u2500 Sort \u2500\u2500\u2500\nsheet.getUsedRange().sort.apply([{ key: 0, ascending: true }]);\n\n// \u2500\u2500\u2500 Filter \u2500\u2500\u2500\nconst filterRange = sheet.getUsedRange();\nfilterRange.autoFilter.apply(filterRange, 0);\n\n// \u2500\u2500\u2500 Freeze Panes \u2500\u2500\u2500\nsheet.freezePanes.freezeRows(1);\n\n// \u2500\u2500\u2500 Number Format \u2500\u2500\u2500\nsheet.getRange(\"B2:B100\").numberFormat = [[\"$#,##0.00\"]];\nsheet.getRange(\"C2:C100\").numberFormat = [[\"0.0%\"]];\n\n// \u2500\u2500\u2500 Clear Contents \u2500\u2500\u2500\nsheet.getUsedRange().clear(Excel.ClearApplyTo.Contents);\n\n// \u2500\u2500\u2500 New Worksheet \u2500\u2500\u2500\nconst newSheet = context.workbook.worksheets.add(\"Report\");\nnewSheet.activate();\n\n// \u2500\u2500\u2500 Autofit Columns (ALWAYS DO THIS AT END) \u2500\u2500\u2500\nsheet.getUsedRange().format.autofitColumns();\n\n// \u2500\u2500\u2500 Data Cleanup (Trim Whitespace) \u2500\u2500\u2500\nconst range = sheet.getUsedRange();\nrange.load(\"values\");\nawait context.sync();\nconst cleanValues = range.values.map(row => \n  row.map(cell => (typeof cell === \"string\" ? cell.trim() : cell))\n);\nrange.values = cleanValues;\nawait context.sync();\n\n// \u2500\u2500\u2500 Data Cleanup (Remove Empty Rows) \u2500\u2500\u2500\nconst rangeToClean = sheet.getUsedRange();\nrangeToClean.load(\"values,rowCount\");\nawait context.sync();\nfor (let i = rangeToClean.rowCount - 1; i >= 0; i--) {\n  const rowVals = rangeToClean.values[i];\n  if (rowVals.every(v => v === null || v === \"\")) {\n    sheet.getRange((i + 1) + \":\" + (i + 1)).delete(Excel.DeleteShiftDirection.up);\n  }\n}\nawait context.sync();\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nMANDATORY writeData HELPER (Include this for any data writing):\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nfunction writeData(sheet, startCell, data) {\n  if (!data || data.length === 0) return null;\n  const rows = data.length;\n  const cols = Math.max(...data.map(r => r ? r.length : 0));\n  if (cols === 0) return null;\n  const normalized = data.map(r => {\n    const row = r ? [...r] : [];\n    while (row.length < cols) row.push(\"\");\n    return row;\n  });\n  const range = sheet.getRange(startCell).getResizedRange(rows - 1, cols - 1);\n  range.values = normalized;\n  range.format.autofitColumns();\n  return range;\n}\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nANTI-HALLUCINATION RULES (For Document/PDF Extraction):\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n1. EXTRACT ONLY WHAT YOU SEE: Never invent data that isn't in the image/PDF\n2. EMPTY IF MISSING: If a field (phone, email, etc.) isn't visible, use \"\" not \"N/A\"\n3. NO GUESSING: Don't make up names, numbers, or dates\n4. PRESERVE EXACT TEXT: Copy text exactly as shown (don't \"fix\" typos unless asked)\n5. ONE ROW PER DOCUMENT: Each PDF/resume = exactly one data row\n6. MATCH SCHEMA: If column headers exist, ONLY extract data for those columns\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nDESIGN BEST PRACTICES:\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n1. HEADERS: Bold, dark background (#1B4D3E or #2D6A4F), white text\n2. NUMBERS: Currency \"$#,##0.00\", Percentage \"0.0%\", Integer \"#,##0\"\n3. DATES: Format as \"Short Date\" or \"YYYY-MM-DD\" string\n4. COLORS: Professional muted tones \u2014 no neon, no pure red/blue\n5. ZEBRA STRIPES: White and light gray (#F5F5F5) alternating rows\n6. ROW HEIGHT: Headers 28px, Data 20px\n7. ALWAYS: End with sheet.getUsedRange().format.autofitColumns()\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nSCHEMA-AWARE EXTRACTION (When EXISTING_COLUMNS provided):\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nWhen given \"EXISTING_COLUMNS: [...]\":\n1. Extract ONLY data matching those columns\n2. Use intelligent matching: \"Phone\" = \"Mobile No\" = \"Contact Number\"\n3. Leave cells empty (\"\") if data not found \u2014 NEVER write \"Not Found\"\n4. Append to first empty row after existing data\n\nUser Prompt:\n";

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
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/* global console, Excel, document, window, Office */











// Worker setup for PDF.js
try {
  // @ts-ignore
  pdfjs_dist__WEBPACK_IMPORTED_MODULE_8__.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/".concat(pdfjs_dist__WEBPACK_IMPORTED_MODULE_8__.version, "/pdf.worker.min.js");
} catch (e) {
  console.warn("PDF Worker setup failed:", e);
}

// ─── Types ─────────────────────────────────────────────────────

// ─── State ─────────────────────────────────────────────────────
var currentMode = "planning";
var currentCategory = "cleanup";
var schemaExtractionMode = false; // When true, use column headers from Excel
var chatHistory = [];
var chatConversation = [];
var isChatBusy = false;
var attachedFiles = []; // Array of attached files
var chatAbortController = null;
var agentAbortController = null;
var rawPDFFiles = []; // Store raw File objects for text-based batch extraction
var batchAbortController = null;

// ─── Quick Actions by Category ─────────────────────────────────
var CATEGORIZED_ACTIONS = {
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
    prompt: "Apply professional formatting to the sheet. Use this EXACT safe pattern:\n\n// Step 1: Get used range and load properties\nconst usedRange = sheet.getUsedRange();\nusedRange.load(\"values,rowCount,columnCount,address\");\nawait context.sync();\n\n// Step 2: Check if sheet has data\nif (!usedRange || usedRange.rowCount < 1 || usedRange.columnCount < 1) {\n  throw new Error(\"Sheet appears empty. Add some data first.\");\n}\n\nconst rowCount = usedRange.rowCount;\nconst colCount = usedRange.columnCount;\n\n// Step 3: Format header row (row 1)\nconst headerRow = usedRange.getRow(0);\nheaderRow.format.set({\n  font: { bold: true, size: 11, color: \"#FFFFFF\" },\n  fill: { color: \"#1B2A4A\" },\n  horizontalAlignment: \"Center\",\n  verticalAlignment: \"Center\",\n  rowHeight: 28\n});\n\n// Step 4: Format data rows with alternating colors\nfor (let i = 1; i < rowCount; i++) {\n  const row = usedRange.getRow(i);\n  row.format.set({\n    fill: { color: i % 2 === 0 ? \"#F4F5F7\" : \"#FFFFFF\" },\n    rowHeight: 22\n  });\n}\n\n// Step 5: Add borders and freeze pane\nusedRange.format.borders.getItem(\"InsideHorizontal\").style = \"Thin\";\nusedRange.format.borders.getItem(\"InsideVertical\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeTop\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeBottom\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeLeft\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeRight\").style = \"Thin\";\n\nheaderRow.format.borders.getItem(\"EdgeBottom\").style = \"Medium\";\nheaderRow.format.borders.getItem(\"EdgeBottom\").color = \"#1B2A4A\";\n\nsheet.freezePanes.freezeRows(1);\nusedRange.format.autofitColumns();\nawait context.sync();"
  }, {
    icon: "paintbrush",
    label: "Executive Style",
    prompt: "Apply executive presentation style using this EXACT safe pattern:\n\nconst usedRange = sheet.getUsedRange();\nusedRange.load(\"values,rowCount,columnCount\");\nawait context.sync();\n\nif (!usedRange || usedRange.rowCount < 1) {\n  throw new Error(\"Sheet appears empty.\");\n}\n\nconst rowCount = usedRange.rowCount;\n\n// Header styling\nconst headerRow = usedRange.getRow(0);\nheaderRow.format.font.bold = true;\nheaderRow.format.font.size = 11;\nheaderRow.format.font.color = \"#FFFFFF\";\nheaderRow.format.fill.color = \"#34495E\";\nheaderRow.format.horizontalAlignment = \"Center\";\nheaderRow.format.rowHeight = 30;\n\n// Data rows with subtle alternating\nfor (let i = 1; i < rowCount; i++) {\n  const row = usedRange.getRow(i);\n  row.format.fill.color = i % 2 === 0 ? \"#F8F9FA\" : \"#FFFFFF\";\n  row.format.rowHeight = 22;\n}\n\n// Light gray borders\nusedRange.format.borders.getItem(\"InsideHorizontal\").style = \"Thin\";\nusedRange.format.borders.getItem(\"InsideHorizontal\").color = \"#DEE2E6\";\nusedRange.format.borders.getItem(\"InsideVertical\").style = \"Thin\";\nusedRange.format.borders.getItem(\"InsideVertical\").color = \"#DEE2E6\";\nusedRange.format.borders.getItem(\"EdgeTop\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeBottom\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeLeft\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeRight\").style = \"Thin\";\n\n// Freeze header\nsheet.freezePanes.freezeRows(1);\nusedRange.format.autofitColumns();\nawait context.sync();"
  }, {
    icon: "paintbrush",
    label: "Minimal Clean",
    prompt: "Apply minimal modern formatting:\n\nconst usedRange = sheet.getUsedRange();\nusedRange.load(\"rowCount,columnCount\");\nawait context.sync();\n\nif (!usedRange || usedRange.rowCount < 1) {\n  throw new Error(\"Sheet appears empty.\");\n}\n\n// Clear existing formatting\nusedRange.format.fill.clear();\nusedRange.format.borders.getItem(\"InsideHorizontal\").style = \"None\";\nusedRange.format.borders.getItem(\"InsideVertical\").style = \"None\";\nusedRange.format.borders.getItem(\"EdgeTop\").style = \"None\";\nusedRange.format.borders.getItem(\"EdgeBottom\").style = \"None\";\nusedRange.format.borders.getItem(\"EdgeLeft\").style = \"None\";\nusedRange.format.borders.getItem(\"EdgeRight\").style = \"None\";\n\n// Header: bold, dark text, bottom border only\nconst headerRow = usedRange.getRow(0);\nheaderRow.format.font.bold = true;\nheaderRow.format.font.size = 11;\nheaderRow.format.font.color = \"#111827\";\nheaderRow.format.borders.getItem(\"EdgeBottom\").style = \"Thin\";\nheaderRow.format.borders.getItem(\"EdgeBottom\").color = \"#D1D5DB\";\nheaderRow.format.rowHeight = 28;\n\n// Data rows: smaller font, gray text\nfor (let i = 1; i < usedRange.rowCount; i++) {\n  const row = usedRange.getRow(i);\n  row.format.font.size = 10;\n  row.format.font.color = \"#374151\";\n  row.format.rowHeight = 22;\n}\n\nusedRange.format.autofitColumns();\nawait context.sync();"
  }, {
    icon: "paintbrush",
    label: "Dark Theme",
    prompt: "Apply dark theme formatting:\n\nconst usedRange = sheet.getUsedRange();\nusedRange.load(\"rowCount,columnCount\");\nawait context.sync();\n\nif (!usedRange || usedRange.rowCount < 1) {\n  throw new Error(\"Sheet appears empty.\");\n}\n\nconst rowCount = usedRange.rowCount;\n\n// All cells: dark background, light text\nusedRange.format.fill.color = \"#1E1E1E\";\nusedRange.format.font.color = \"#CCCCCC\";\n\n// Header: gold text\nconst headerRow = usedRange.getRow(0);\nheaderRow.format.fill.color = \"#2D2D2D\";\nheaderRow.format.font.bold = true;\nheaderRow.format.font.color = \"#F0C75E\";\nheaderRow.format.rowHeight = 28;\n\n// Alternating dark rows\nfor (let i = 1; i < rowCount; i++) {\n  const row = usedRange.getRow(i);\n  row.format.fill.color = i % 2 === 0 ? \"#252525\" : \"#1E1E1E\";\n}\n\n// Dark borders\nusedRange.format.borders.getItem(\"InsideHorizontal\").style = \"Thin\";\nusedRange.format.borders.getItem(\"InsideHorizontal\").color = \"#3A3A3A\";\nusedRange.format.borders.getItem(\"InsideVertical\").style = \"Thin\";\nusedRange.format.borders.getItem(\"InsideVertical\").color = \"#3A3A3A\";\nusedRange.format.borders.getItem(\"EdgeTop\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeBottom\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeLeft\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeRight\").style = \"Thin\";\n\nusedRange.format.autofitColumns();\nawait context.sync();"
  }, {
    icon: "paintbrush",
    label: "Colorful Teal",
    prompt: "Apply colorful teal formatting:\n\nconst usedRange = sheet.getUsedRange();\nusedRange.load(\"rowCount\");\nawait context.sync();\n\nif (!usedRange || usedRange.rowCount < 1) {\n  throw new Error(\"Sheet appears empty.\");\n}\n\n// Header: teal background\nconst headerRow = usedRange.getRow(0);\nheaderRow.format.fill.color = \"#0D7377\";\nheaderRow.format.font.bold = true;\nheaderRow.format.font.color = \"#FFFFFF\";\nheaderRow.format.horizontalAlignment = \"Center\";\nheaderRow.format.rowHeight = 28;\n\n// Alternating light teal and white\nfor (let i = 1; i < usedRange.rowCount; i++) {\n  const row = usedRange.getRow(i);\n  row.format.fill.color = i % 2 === 0 ? \"#E8F6F3\" : \"#FFFFFF\";\n}\n\n// Thin borders\nusedRange.format.borders.getItem(\"InsideHorizontal\").style = \"Thin\";\nusedRange.format.borders.getItem(\"InsideVertical\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeTop\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeBottom\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeLeft\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeRight\").style = \"Thin\";\n\nsheet.freezePanes.freezeRows(1);\nusedRange.format.autofitColumns();\nawait context.sync();"
  }, {
    icon: "snowflake",
    label: "Freeze Header",
    prompt: "Freeze the first row:\n\nsheet.freezePanes.freezeRows(1);\nawait context.sync();"
  }, {
    icon: "table",
    label: "Excel Table",
    prompt: "Convert data to Excel Table:\n\nconst usedRange = sheet.getUsedRange();\nusedRange.load(\"address\");\nawait context.sync();\n\nif (!usedRange) {\n  throw new Error(\"No data found in sheet.\");\n}\n\nconst table = sheet.tables.add(usedRange, true);\ntable.style = \"TableStyleMedium9\";\nusedRange.format.autofitColumns();\nawait context.sync();"
  }, {
    icon: "paintbrush",
    label: "Borders All",
    prompt: "Add thin borders to all cells:\n\nconst usedRange = sheet.getUsedRange();\nusedRange.format.borders.getItem(\"InsideHorizontal\").style = \"Thin\";\nusedRange.format.borders.getItem(\"InsideVertical\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeTop\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeBottom\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeLeft\").style = \"Thin\";\nusedRange.format.borders.getItem(\"EdgeRight\").style = \"Thin\";\nawait context.sync();"
  }, {
    icon: "hash",
    label: "Currency $",
    prompt: "Format numeric columns as currency. First read the data to detect numeric columns, then apply $#,##0.00 format."
  }, {
    icon: "hash",
    label: "Percentage %",
    prompt: "Format the last numeric column as percentage (0.00%) and auto-fit columns."
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
    prompt: "Analyze the entire dataset and create a comprehensive Data Profile report on a NEW sheet called \"Data Profile\". For each column, calculate: (1) Column Name, (2) Data Type (text/number/date/mixed), (3) Total Count, (4) Blank Count, (5) Blank %, (6) Unique Values Count, (7) Most Common Value, (8) For numeric columns: Min, Max, Mean, Median. Create this as a formatted table with headers. Add a \"Data Quality Score\" at the top calculated as (100 - average blank %). Apply professional formatting: dark header row, alternating rows, conditional formatting on blank % (green < 5%, yellow 5-20%, red > 20%). Auto-fit all columns."
  }, {
    icon: "highlight",
    label: "Highlight Duplicates",
    prompt: "Find and highlight ALL duplicate values in the first data column (column A, excluding header).\n\nconst usedRange = sheet.getUsedRange();\nusedRange.load(\"values,rowCount,columnCount\");\nawait context.sync();\n\nif (!usedRange || usedRange.rowCount < 2) throw new Error(\"Need at least 2 rows of data.\");\n\nconst values = usedRange.values;\nconst col = 0; // Check column A\nconst seen = {};\nconst dupes = new Set();\n\n// Pass 1: find duplicates\nfor (let i = 1; i < values.length; i++) {\n  const val = String(values[i][col]).trim().toLowerCase();\n  if (val === \"\") continue;\n  if (seen[val] !== undefined) {\n    dupes.add(val);\n  }\n  seen[val] = i;\n}\n\n// Pass 2: highlight them\nlet count = 0;\nfor (let i = 1; i < values.length; i++) {\n  const val = String(values[i][col]).trim().toLowerCase();\n  if (dupes.has(val)) {\n    const cell = usedRange.getRow(i);\n    cell.format.fill.color = \"#FECACA\";\n    cell.format.font.color = \"#991B1B\";\n    count++;\n  }\n}\nawait context.sync();\n// Done: highlighted duplicates"
  }, {
    icon: "columns",
    label: "Compare Columns",
    prompt: "Compare columns A and B to find differences. For each row, if A \u2260 B, highlight both cells in light red (#FEE2E2). If they match, highlight in light green (#DCFCE7). Add a new column C with 'Match' or 'Mismatch' labels. Add a summary at the bottom showing total matches and mismatches. Format the summary row in bold."
  }, {
    icon: "formula",
    label: "Auto Summary Row ⚡",
    prompt: "Analyze ALL columns. For each NUMERIC column, add 4 summary rows at the bottom: SUM, AVERAGE, MIN, MAX \u2014 with formula labels in column A. Make the summary section visually distinct: add a thick top border, bold labels, and light blue (#EFF6FF) background. Format numbers with commas and 2 decimal places. Auto-fit all columns."
  }, {
    icon: "crosshair",
    label: "Top/Bottom 5 🎯",
    prompt: "Find the main numeric column in the data. Identify the Top 5 values and highlight their entire rows in green (#DCFCE7). Identify the Bottom 5 values and highlight their rows in red (#FEE2E2). Add a 'Rank' column at the end. Sort the data by the numeric column descending. Auto-fit columns."
  }, {
    icon: "mail",
    label: "Extract Emails & Phones",
    prompt: "Scan ALL cells in the used range. Extract any email addresses (containing @) and phone numbers (10+ digit patterns). Create a new sheet called \"Contacts\" with columns: Source Cell, Name (if adjacent), Email, Phone. Remove duplicates. Format as a professional table with filters. Auto-fit columns."
  }, {
    icon: "layers",
    label: "Unpivot Data",
    prompt: "Convert wide-format data to long format (unpivot). Take the first column as the ID column. Treat all remaining columns as value columns. Create a new sheet \"Unpivoted\" with 3 columns: the original ID, \"Category\" (original column header), and \"Value\" (the cell value). Skip blank values. Apply professional formatting."
  }, {
    icon: "shield",
    label: "Data Validation Rules",
    prompt: "Analyze column headers and add smart data validation rules. For columns that look like: (1) Email \u2014 add text validation requiring '@', (2) Phone \u2014 allow only numbers with length 10-15, (3) Date columns \u2014 add date validation, (4) Status/Type columns \u2014 create dropdown lists from unique existing values, (5) Numeric columns \u2014 add number validation (>= 0). Highlight validated columns with a subtle blue header to indicate protection is active."
  }, {
    icon: "dollarSign",
    label: "Number to Words 💰",
    prompt: "Add a new column next to the main numeric/currency column. For each row, convert the number to words in English (e.g., 1234 \u2192 \"One Thousand Two Hundred Thirty Four\"). This is useful for invoices and checks. Use a helper function that handles numbers up to 999,999,999. Format the words column with proper case and auto-fit."
  }, {
    icon: "copy",
    label: "Smart Merge Sheets",
    prompt: "Merge data from ALL worksheets in the workbook into a new sheet called \"Merged Data\". For each sheet: read the headers and data, align columns by header name (smart matching), and append all rows. Remove exact duplicate rows from the final merged data. Add a \"Source Sheet\" column to track where each row came from. Apply professional formatting with alternating rows."
  }]
};

// Chat Suggestions (shown on welcome screen)
var CHAT_SUGGESTIONS = [{
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
  var statusEl = document.getElementById("loading-status");
  if (statusEl) {
    statusEl.innerHTML += "<br><span style=\"color:#d32f2f;font-weight:bold;font-size:11px;\">".concat(msg, " (Line ").concat(line, ")</span>");
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
  }
  return false;
};

// ─── Initialization ────────────────────────────────────────────
Office.onReady(function (info) {
  // Always show app to prevent hang
  var sideloadMsg = document.getElementById("sideload-msg");
  var appBody = document.getElementById("app-body");
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
  document.getElementById("settings-toggle").onclick = function () {
    var panel = document.getElementById("settings-panel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    document.getElementById("docs-panel").style.display = "none";
  };
  document.getElementById("docs-toggle").onclick = function () {
    var panel = document.getElementById("docs-panel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    document.getElementById("settings-panel").style.display = "none";
  };
  document.getElementById("save-settings").onclick = handleSaveSettings;
  document.getElementById("refresh-models").onclick = loadOllamaModels;

  // Mode Toggles
  document.getElementById("mode-planning").onclick = function () {
    return switchMode("planning");
  };
  document.getElementById("mode-agent").onclick = function () {
    return switchMode("agent");
  };

  // Chat Actions
  document.getElementById("chat-send").onclick = sendChatMessage;
  var clearBtn = document.getElementById("chat-clear");
  if (clearBtn) clearBtn.onclick = clearChat;
  setupChatInput();
  setupScrollToBottom();
  setupAgentKeyboardShortcut();
  setupCharCount();

  // File Upload Handlers
  var bindClick = function bindClick(id, handler) {
    var el = document.getElementById(id);
    if (el) el.onclick = handler;
  };
  var bindChange = function bindChange(id, handler) {
    var el = document.getElementById(id);
    if (el) el.onchange = handler;
  };
  bindClick("file-upload-btn", function () {
    return document.getElementById("file-input").click();
  });
  bindChange("file-input", function (e) {
    return handleFileSelect(e, false);
  });
  bindClick("file-remove", function () {
    return clearFile(false);
  });
  bindClick("agent-file-btn", function () {
    return document.getElementById("agent-file-input").click();
  });
  bindChange("agent-file-input", function (e) {
    return handleFileSelect(e, true);
  });
  bindClick("agent-file-remove", function () {
    return clearFile(true);
  });

  // Batch PDF Extraction
  bindClick("batch-extract-btn", runBatchPDFExtraction);

  // Category Tabs
  document.querySelectorAll(".category-tab").forEach(function (tab) {
    tab.onclick = function () {
      var cat = tab.dataset.category;
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
  var el = function el(id, html) {
    var node = document.getElementById(id);
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
  document.querySelectorAll(".doc-icon[data-icon]").forEach(function (el) {
    var key = el.getAttribute("data-icon");
    if (_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons[key]) el.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons[key];
  });
}
function injectCategoryIcons() {
  document.querySelectorAll(".cat-icon[data-icon]").forEach(function (el) {
    var key = el.getAttribute("data-icon");
    if (_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons[key]) el.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons[key];
  });
}

// ─── Mode Switching ────────────────────────────────────────────
function switchMode(mode) {
  if (mode === currentMode) return;
  currentMode = mode;

  // Update tabs
  document.querySelectorAll(".mode-tab").forEach(function (tab) {
    tab.classList.toggle("active", tab.dataset.mode === mode);
  });

  // Update indicator
  var indicator = document.getElementById("mode-indicator");
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
    setTimeout(function () {
      return document.getElementById("chat-input").focus();
    }, 200);
  } else {
    setTimeout(function () {
      return document.getElementById("prompt-input").focus();
    }, 200);
  }
}

// ─── Category Switching ────────────────────────────────────────
function switchCategory(category) {
  currentCategory = category;
  document.querySelectorAll(".category-tab").forEach(function (tab) {
    tab.classList.toggle("active", tab.dataset.category === category);
  });

  // Show/hide schema info banner for Extract mode
  var schemaInfo = document.getElementById("schema-info");
  var detectedColumns = document.getElementById("detected-columns");
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
  var container = document.getElementById("quick-actions");
  if (!container) return;
  container.innerHTML = "";
  var actions = CATEGORIZED_ACTIONS[currentCategory];
  if (!actions) {
    console.warn("No quick actions found for category: ".concat(currentCategory));
    return;
  }
  actions.forEach(function (action) {
    var chip = document.createElement("button");
    chip.className = "chip";
    var iconKey = action.icon;
    chip.innerHTML = "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons[iconKey] || "", "<span>").concat(action.label, "</span>");
    chip.onclick = function () {
      var input = document.getElementById("prompt-input");
      if (input) {
        input.value = action.prompt;
        input.focus();
        // Clear status when switching action
        var statusEl = document.getElementById("status-message");
        if (statusEl) statusEl.style.display = "none";
      }
    };
    container.appendChild(chip);
  });
}

// ─── Chat Suggestions (Planning Mode) ──────────────────────────
function buildChatSuggestions() {
  var container = document.getElementById("chat-suggestions");
  if (!container) return;
  CHAT_SUGGESTIONS.forEach(function (s) {
    var btn = document.createElement("button");
    btn.className = "suggestion-chip";
    var iconKey = s.icon;
    btn.innerHTML = "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons[iconKey] || "").concat(s.text);
    btn.onclick = function () {
      var input = document.getElementById("chat-input");
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
  var panel = document.getElementById(panelId);
  var isHidden = (panel === null || panel === void 0 ? void 0 : panel.style.display) === "none" || !(panel !== null && panel !== void 0 && panel.style.display);
  document.querySelectorAll(".panel").forEach(function (p) {
    p.style.display = "none";
  });
  if (isHidden && panel) {
    panel.style.display = "block";
    if (panelId === "settings-panel") {
      var providerSelect = document.getElementById("setting-provider");
      if (providerSelect && providerSelect.value === "local") loadOllamaModels();
    }
  }
}

// ─── Settings ──────────────────────────────────────────────────
// ─── Settings ──────────────────────────────────────────────────
function loadSettingsUI() {
  var config = (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.getConfig)();
  var providerSelect = document.getElementById("setting-provider");
  if (providerSelect) {
    providerSelect.value = config.provider;
    providerSelect.onchange = function (e) {
      var p = e.target.value;
      updateProviderFields(p);
      if (p === "local") loadOllamaModels();
    };
  }

  // Populate inputs (safe checks)
  var setVal = function setVal(id, val) {
    var el = document.getElementById(id);
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
  var setDisplay = function setDisplay(id, show) {
    var el = document.getElementById(id);
    if (el) el.style.display = show ? "block" : "none";
  };
  setDisplay("groq-fields", p === "groq");
  setDisplay("gemini-fields", p === "gemini");
  setDisplay("openai-fields", p === "openai");
  setDisplay("anthropic-fields", p === "anthropic");
  setDisplay("openrouter-fields", p === "openrouter");
  setDisplay("local-fields", p === "local");
}
function loadOllamaModels() {
  return _loadOllamaModels.apply(this, arguments);
}
function _loadOllamaModels() {
  _loadOllamaModels = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var _document$getElementB3;
    var select, statusEl, host, models, config;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          select = document.getElementById("setting-local-model");
          statusEl = document.getElementById("model-status");
          host = ((_document$getElementB3 = document.getElementById("setting-base-url")) === null || _document$getElementB3 === void 0 || (_document$getElementB3 = _document$getElementB3.value) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.trim()) || "http://localhost:11434";
          if (select) {
            _context.n = 1;
            break;
          }
          return _context.a(2);
        case 1:
          select.innerHTML = "<option value=\"\" disabled selected>Loading...</option>";
          if (statusEl) {
            statusEl.textContent = "";
            statusEl.className = "model-status";
          }
          _context.n = 2;
          return (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.fetchOllamaModels)(host);
        case 2:
          models = _context.v;
          if (!(models.length === 0)) {
            _context.n = 3;
            break;
          }
          select.innerHTML = "<option value=\"\" disabled selected>No models found</option>";
          if (statusEl) {
            statusEl.textContent = "Ollama not running or no models installed";
            statusEl.className = "model-status model-status-warn";
          }
          return _context.a(2);
        case 3:
          config = (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.getConfig)();
          select.innerHTML = "";
          models.forEach(function (m) {
            var opt = document.createElement("option");
            opt.value = m.name;
            opt.textContent = "".concat(m.name, " (").concat((m.size / 1e9).toFixed(1), "GB)");
            if ((config.localModel || config.model) === m.name) opt.selected = true;
            select.appendChild(opt);
          });
          if (statusEl) {
            statusEl.textContent = "".concat(models.length, " model").concat(models.length > 1 ? "s" : "", " found");
            statusEl.className = "model-status model-status-ok";
          }
        case 4:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _loadOllamaModels.apply(this, arguments);
}
function handleSaveSettings() {
  var _document$getElementB;
  var provider = (_document$getElementB = document.getElementById("setting-provider")) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value;
  var current = (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.getConfig)();

  // Helper to read val
  var getVal = function getVal(id) {
    var _document$getElementB2;
    return ((_document$getElementB2 = document.getElementById(id)) === null || _document$getElementB2 === void 0 || (_document$getElementB2 = _document$getElementB2.value) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.trim()) || "";
  };
  var newConfig = _objectSpread(_objectSpread({}, current), {}, {
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
    baseUrl: getVal("setting-base-url") ? "".concat(getVal("setting-base-url").replace(/\/v1.*$/, ""), "/v1/chat/completions") : undefined,
    localModel: getVal("setting-local-model") || current.localModel
  });
  (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.saveConfig)(newConfig);

  // Animated save feedback
  var btn = document.getElementById("save-settings");
  if (btn) {
    var originalText = btn.textContent;
    btn.textContent = "✓ Saved";
    btn.classList.add("saved");
    setTimeout(function () {
      btn.textContent = originalText || "Save";
      btn.classList.remove("saved");
    }, 1500);
  }
  showToast("success", "Settings saved successfully");
  setTimeout(function () {
    var panel = document.getElementById("settings-panel");
    if (panel) panel.style.display = "none";
  }, 800);
}

// ═══════════════════════════════════════════════════════════════
// PLANNING MODE — Chat Functions
// ═══════════════════════════════════════════════════════════════

function setupChatInput() {
  var input = document.getElementById("chat-input");
  if (!input) return;

  // Auto-resize textarea
  input.addEventListener("input", function () {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 80) + "px";
  });

  // Enter to send (Shift+Enter for newline)
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
}
function sendChatMessage() {
  return _sendChatMessage.apply(this, arguments);
}
function _sendChatMessage() {
  _sendChatMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var input, message, welcome, initialPrompt, overview, needsSheetContext, contextResult, text, hits, lastBubble, badge, skeletonEl, chatSendButton, chatSendIcon, response, formattedResponse, newBubble, bubbleContent, _error$message, sendIcon, _t, _t2, _t3;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          if (!isChatBusy) {
            _context2.n = 1;
            break;
          }
          stopChatGeneration();
          return _context2.a(2);
        case 1:
          input = document.getElementById("chat-input");
          if (input) {
            _context2.n = 2;
            break;
          }
          return _context2.a(2);
        case 2:
          message = input.value.trim();
          if (message) {
            _context2.n = 3;
            break;
          }
          return _context2.a(2);
        case 3:
          // Clear welcome screen on first message
          welcome = document.querySelector(".chat-welcome");
          if (welcome) welcome.remove();

          // Add user message
          addChatBubble("user", message);
          chatHistory.push({
            role: "user",
            content: message,
            timestamp: Date.now()
          });

          // Build conversation context with initial sheet overview
          if (!(chatConversation.length === 0)) {
            _context2.n = 8;
            break;
          }
          initialPrompt = _services_chat_prompt__WEBPACK_IMPORTED_MODULE_3__.CHAT_PROMPT;
          _context2.p = 4;
          _context2.n = 5;
          return getSheetContext();
        case 5:
          overview = _context2.v;
          if (overview && overview.hits === 0 && overview.text.length > 20) {
            initialPrompt += "\n\n[INITIAL SHEET OVERVIEW]\n" + overview.text;
          }
          _context2.n = 7;
          break;
        case 6:
          _context2.p = 6;
          _t = _context2.v;
          console.warn("Could not load initial sheet overview:", _t);
        case 7:
          chatConversation.push({
            role: "system",
            content: initialPrompt
          });
        case 8:
          // 🔥 CONTEXT AWARENESS: Auto-detect if user is asking about their sheet or searching for data
          needsSheetContext = /\b(this|my|current|opened?)\s+(sheet|data|table|workbook|excel|spreadsheet|sheeet|spreadsheat)\b|\b(find|search|where|is|check|lookup|contains?|exist|details|about|located|who|tell|give)\b|what\s+(do|can|should)|improve|analyze|suggest|help|better|optimize|\b\d{5,}\b|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(message) || /\b[A-Z]{2,}(?:\s+[A-Z]{2,})+\b/.test(message) ||
          // ALL CAPS sequences (Names/IDs)
          /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/.test(message); // Title Case sequences (Names)
          if (!needsSheetContext) {
            _context2.n = 12;
            break;
          }
          _context2.p = 9;
          _context2.n = 10;
          return getSheetContext(message);
        case 10:
          contextResult = _context2.v;
          if (contextResult) {
            text = contextResult.text, hits = contextResult.hits; // Add to persistent conversation context
            chatConversation.push({
              role: "system",
              content: "The following data was retrieved from the user's sheet for this query:\n".concat(text)
            });

            // Show context indicator
            lastBubble = document.querySelector('.chat-msg.user:last-child .chat-bubble');
            if (lastBubble) {
              badge = document.createElement('span');
              badge.className = 'context-badge';
              badge.innerHTML = hits > 0 ? "\uD83D\uDD0D Found ".concat(hits, " search hits in sheet") : '📊 Sheet context loaded';
              lastBubble.appendChild(badge);
            }
          }
          _context2.n = 12;
          break;
        case 11:
          _context2.p = 11;
          _t2 = _context2.v;
          console.warn('Could not load sheet context:', _t2);
        case 12:
          chatConversation.push({
            role: "user",
            content: message
          });

          // Clear input
          input.value = "";
          input.style.height = "auto";

          // Show skeleton loader
          skeletonEl = showTypingIndicator();
          isChatBusy = true;

          // Toggle button to Stop
          chatSendButton = document.getElementById("chat-send");
          chatSendIcon = document.getElementById("chat-send-icon");
          if (chatSendButton) {
            if (chatSendIcon) chatSendIcon.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.stop;
            chatSendButton.classList.add("is-busy");
          }

          // Create AbortController
          chatAbortController = new AbortController();
          _context2.p = 13;
          _context2.n = 14;
          return (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.callLLM)(chatConversation, undefined, chatAbortController.signal);
        case 14:
          response = _context2.v;
          // Format AI response
          formattedResponse = formatChatResponse(response); // Create the real bubble
          newBubble = createChatBubble("ai", "", response); // Replace skeleton with the real bubble
          if (skeletonEl) skeletonEl.replaceWith(newBubble);

          // Find the content part of the new bubble to apply the typewriter effect
          bubbleContent = newBubble.querySelector('.chat-bubble'); // Stream content
          if (!bubbleContent) {
            _context2.n = 15;
            break;
          }
          _context2.n = 15;
          return typewriterEffect(bubbleContent, formattedResponse);
        case 15:
          chatConversation.push({
            role: "assistant",
            content: response
          });
          chatHistory.push({
            role: "ai",
            content: response,
            timestamp: Date.now()
          });
          _context2.n = 17;
          break;
        case 16:
          _context2.p = 16;
          _t3 = _context2.v;
          if (_t3.name === 'AbortError') {
            if (skeletonEl) skeletonEl.remove();
            addChatBubble("ai", "<p style=\"color:var(--text-3)\"><i>Generation stopped.</i></p>");
          } else {
            if (skeletonEl) skeletonEl.remove();
            addChatBubble("ai", "<p style=\"color:var(--error)\">\u26A0\uFE0F ".concat(_t3.message, "</p>"));
            showToast("error", ((_error$message = _t3.message) === null || _error$message === void 0 ? void 0 : _error$message.substring(0, 80)) || "Something went wrong");
          }
        case 17:
          _context2.p = 17;
          isChatBusy = false;
          chatAbortController = null;
          // Reuse outer chatSendButton reference (avoid redeclaring)
          if (chatSendButton) {
            sendIcon = document.getElementById("chat-send-icon");
            if (sendIcon) sendIcon.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.send;
            chatSendButton.classList.remove("is-busy");
          }
          return _context2.f(17);
        case 18:
          return _context2.a(2);
      }
    }, _callee2, null, [[13, 16, 17, 18], [9, 11], [4, 6]]);
  }));
  return _sendChatMessage.apply(this, arguments);
}
function stopChatGeneration() {
  return _stopChatGeneration.apply(this, arguments);
}
function _stopChatGeneration() {
  _stopChatGeneration = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          if (chatAbortController) {
            chatAbortController.abort();
          }
        case 1:
          return _context3.a(2);
      }
    }, _callee3);
  }));
  return _stopChatGeneration.apply(this, arguments);
}
function typewriterEffect(_x, _x2) {
  return _typewriterEffect.apply(this, arguments);
}
function _typewriterEffect() {
  _typewriterEffect = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(element, html) {
    var tokens, _iterator2, _step2, token, words, _iterator3, _step3, word, container, _t4, _t5;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          // 1. Reveal element immediately
          element.innerHTML = "";

          // 2. Parse into tokens (simple tag-preserving tokenizer)
          // We split by tags so we can print text content progressively, but print tags instantly.
          tokens = html.split(/(<[^>]+>)/g);
          _iterator2 = _createForOfIteratorHelper(tokens);
          _context4.p = 1;
          _iterator2.s();
        case 2:
          if ((_step2 = _iterator2.n()).done) {
            _context4.n = 11;
            break;
          }
          token = _step2.value;
          if (!(token.startsWith("<") && token.endsWith(">"))) {
            _context4.n = 3;
            break;
          }
          // It's a tag, append immediately
          element.innerHTML += token;
          _context4.n = 10;
          break;
        case 3:
          if (!(token.trim().length > 0)) {
            _context4.n = 10;
            break;
          }
          // It's text, type it out word by word for speed
          words = token.split(/(\s+)/); // Keep spaces
          _iterator3 = _createForOfIteratorHelper(words);
          _context4.p = 4;
          _iterator3.s();
        case 5:
          if ((_step3 = _iterator3.n()).done) {
            _context4.n = 7;
            break;
          }
          word = _step3.value;
          element.innerHTML += word;
          // Scroll to bottom
          container = document.getElementById("chat-messages");
          if (container) container.scrollTop = container.scrollHeight;
          // Variable delay for realism
          _context4.n = 6;
          return new Promise(function (r) {
            return setTimeout(r, Math.random() * 10 + 5);
          });
        case 6:
          _context4.n = 5;
          break;
        case 7:
          _context4.n = 9;
          break;
        case 8:
          _context4.p = 8;
          _t4 = _context4.v;
          _iterator3.e(_t4);
        case 9:
          _context4.p = 9;
          _iterator3.f();
          return _context4.f(9);
        case 10:
          _context4.n = 2;
          break;
        case 11:
          _context4.n = 13;
          break;
        case 12:
          _context4.p = 12;
          _t5 = _context4.v;
          _iterator2.e(_t5);
        case 13:
          _context4.p = 13;
          _iterator2.f();
          return _context4.f(13);
        case 14:
          return _context4.a(2);
      }
    }, _callee4, null, [[4, 8, 9, 10], [1, 12, 13, 14]]);
  }));
  return _typewriterEffect.apply(this, arguments);
}
function createChatBubble(role, htmlContent, rawContent) {
  var msgDiv = document.createElement("div");
  msgDiv.className = "chat-msg ".concat(role);
  var bubbleDiv = document.createElement("div");
  bubbleDiv.className = "chat-bubble";
  bubbleDiv.innerHTML = htmlContent;

  // If AI message, add action buttons
  if (role === "ai" && rawContent) {
    // Actions bar with copy + switch to agent
    var actionsDiv = document.createElement("div");
    actionsDiv.className = "chat-bubble-actions";

    // Copy button
    var copyBtn = document.createElement("button");
    copyBtn.className = "btn-copy";
    copyBtn.innerHTML = "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.copy, " Copy");
    copyBtn.onclick = function () {
      navigator.clipboard.writeText(rawContent).then(function () {
        copyBtn.innerHTML = "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.check, " Copied");
        copyBtn.classList.add("copied");
        setTimeout(function () {
          copyBtn.innerHTML = "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.copy, " Copy");
          copyBtn.classList.remove("copied");
        }, 2000);
      }).catch(function () {
        showToast("error", "Failed to copy");
      });
    };
    actionsDiv.appendChild(copyBtn);

    // Execute in Agent button
    var execBtn = document.createElement("button");
    execBtn.className = "btn-execute-from-chat";
    execBtn.innerHTML = "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.zap, " Switch to Agent");
    execBtn.onclick = function () {
      var agentPromptInput = document.getElementById("prompt-input");
      if (agentPromptInput) {
        agentPromptInput.value = extractActionablePrompt(rawContent);
        switchMode("agent");
        agentPromptInput.focus();
      }
    };
    var actionBar = document.createElement("div");
    actionBar.className = "chat-action-bar";
    actionBar.appendChild(execBtn);
    bubbleDiv.appendChild(actionsDiv);
    bubbleDiv.appendChild(actionBar);
  }
  msgDiv.appendChild(bubbleDiv);
  return msgDiv;
}
function addChatBubble(role, htmlContent, rawContent) {
  var container = document.getElementById("chat-messages");
  if (!container) throw new Error("Chat messages container not found.");
  var msgDiv = createChatBubble(role, htmlContent, rawContent);
  container.appendChild(msgDiv);

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
  return msgDiv.querySelector('.chat-bubble'); // Return bubble for typewriter
}
function showTypingIndicator() {
  var container = document.getElementById("chat-messages");
  if (!container) throw new Error("Chat messages container not found.");
  var template = document.getElementById("chat-skeleton-template");

  // Fallback to old indicator if template is missing
  if (!template) {
    var oldIndicator = document.createElement("div");
    oldIndicator.className = "chat-msg ai";
    oldIndicator.id = "typing-msg";
    oldIndicator.innerHTML = "<div class=\"chat-avatar\">".concat(_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.bot, "</div><div class=\"chat-bubble\"><div class=\"typing-indicator\"><div class=\"typing-dot\"></div><div class=\"typing-dot\"></div><div class=\"typing-dot\"></div></div></div>");
    container.appendChild(oldIndicator);
    container.scrollTop = container.scrollHeight;
    return oldIndicator;
  }
  var skeleton = template.content.cloneNode(true);
  var skeletonElement = skeleton.firstElementChild;
  if (skeletonElement) {
    skeletonElement.id = 'typing-msg';
    container.appendChild(skeletonElement);
    container.scrollTop = container.scrollHeight;
    return skeletonElement;
  }
  return null; // Should not happen
}
function formatChatResponse(text) {
  var html = text.trim();

  // 1. Headers (### Heading)
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // 2. Tables (| col | col |)
  var lines = html.split('\n');
  var inTable = false;
  var tableHtml = '';
  var processedLines = [];
  var _loop = function _loop(i) {
    var line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHtml = '<table>';
      }

      // Skip separator row (|---|---|)
      if (line.includes('---')) return 1; // continue
      var cells = line.split('|').filter(function (c) {
        return c.trim() !== '' || line.indexOf('|' + c + '|') !== -1;
      });
      // Clean cells of leading/trailing pipes
      var cleanCells = line.split('|').slice(1, -1).map(function (c) {
        return c.trim();
      });
      tableHtml += '<tr>' + cleanCells.map(function (c) {
        return i === 0 || lines[i - 1] && !lines[i - 1].includes('|') ? "<th>".concat(c, "</th>") : "<td>".concat(c, "</td>");
      }).join('') + '</tr>';
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</table>';
        processedLines.push(tableHtml);
        tableHtml = '';
      }
      processedLines.push(lines[i]);
    }
  };
  for (var i = 0; i < lines.length; i++) {
    if (_loop(i)) continue;
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
  html = html.replace(/((?:<li class="ol-item">.*?<\/li>\n?)+)/g, function (match) {
    return "<ol>".concat(match.replace(/ class="ol-item"/g, ''), "</ol>");
  });

  // 7. Paragraphs
  var blocks = html.split(/\n\n+/);
  html = blocks.map(function (block) {
    var b = block.trim();
    if (!b) return '';
    // If it starts with a tag already, don't wrap in <p>
    if (/^<(h1|h2|h3|ul|ol|table|pre|p|li|div)/i.test(b)) return b;
    // Otherwise wrap in <p> and handle single newlines as <br>
    return "<p>".concat(b.replace(/\n/g, '<br>'), "</p>");
  }).join('');

  // 8. Visual Polish: Cleanup bullet and paragraph spacing
  html = html.replace(/<p>\s*<ul>/g, '<ul>').replace(/<\/ul>\s*<\/p>/g, '</ul>');
  html = html.replace(/<li>\s*<p>/g, '<li>').replace(/<\/p>\s*<\/li>/g, '</li>');
  return html;
}
function extractActionablePrompt(aiResponse) {
  // Try to build a useful prompt from the AI's response for agent mode
  // Look for formula mentions or action keywords
  var lines = aiResponse.split('\n');
  var _iterator = _createForOfIteratorHelper(lines),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var line = _step.value;
      if (line.includes('=') && line.includes('(') && !line.startsWith('#')) {
        // Looks like a formula mention
        return "Apply this formula: ".concat(line.trim());
      }
    }
    // Default: use a summary
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var firstSentence = aiResponse.split(/[.!?]/)[0];
  return firstSentence.length > 120 ? firstSentence.substring(0, 120) : firstSentence;
}
function clearChat() {
  var container = document.getElementById("chat-messages");
  container.innerHTML = "";
  chatHistory.length = 0;
  chatConversation = [];
  isChatBusy = false;

  // Re-add welcome screen
  var welcomeHTML = "\n    <div class=\"chat-welcome\">\n      <img src=\"assets/icon-80-v2.png\" alt=\"SheetOS Logo\" style=\"width: 64px; height: 64px; margin-bottom: 16px;\">\n      <h2>What are you working on?</h2>\n      <div class=\"welcome-suggestions\" id=\"chat-suggestions\"></div>\n    </div>\n  ";
  container.innerHTML = welcomeHTML;
  buildChatSuggestions();
}

// ═══════════════════════════════════════════════════════════════
// TOAST NOTIFICATION SYSTEM
// ═══════════════════════════════════════════════════════════════
function showToast(type, message) {
  var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3000;
  var container = document.getElementById("toast-container");
  if (!container) return;
  var toast = document.createElement("div");
  toast.className = "toast toast-".concat(type);
  var iconMap = {
    success: _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.check,
    error: _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.alertCircle,
    info: _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.helpCircle
  };
  toast.innerHTML = "".concat(iconMap[type] || "", "<span>").concat(message, "</span>");
  container.appendChild(toast);

  // Auto-dismiss
  setTimeout(function () {
    toast.classList.add("toast-out");
    setTimeout(function () {
      return toast.remove();
    }, 300);
  }, duration);
}

// ═══════════════════════════════════════════════════════════════
// SCROLL-TO-BOTTOM BUTTON
// ═══════════════════════════════════════════════════════════════
function setupScrollToBottom() {
  var chatMessages = document.getElementById("chat-messages");
  var scrollBtn = document.getElementById("scroll-to-bottom");
  if (!chatMessages || !scrollBtn) return;

  // Show/hide based on scroll position
  chatMessages.addEventListener("scroll", function () {
    var isNearBottom = chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight < 100;
    scrollBtn.classList.toggle("visible", !isNearBottom);
  });

  // Click to scroll
  scrollBtn.onclick = function () {
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
  var promptInput = document.getElementById("prompt-input");
  if (!promptInput) return;
  promptInput.addEventListener("keydown", function (e) {
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
  var promptInput = document.getElementById("prompt-input");
  if (!promptInput) return;

  // Create and insert char count element
  var charCount = document.createElement("span");
  charCount.className = "char-count";
  charCount.textContent = "";
  var footerLeft = (_promptInput$closest = promptInput.closest(".input-card")) === null || _promptInput$closest === void 0 ? void 0 : _promptInput$closest.querySelector(".footer-left");
  if (footerLeft) {
    footerLeft.appendChild(charCount);
  }
  promptInput.addEventListener("input", function () {
    var len = promptInput.value.length;
    if (len === 0) {
      charCount.textContent = "";
      charCount.className = "char-count";
    } else {
      charCount.textContent = "".concat(len);
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
function getSheetContext(_x3) {
  return _getSheetContext.apply(this, arguments);
} // ═══════════════════════════════════════════════════════════════
// SCHEMA-AWARE EXTRACTION — Read Column Headers from Excel
// ═══════════════════════════════════════════════════════════════
/**
 * Read existing column headers from row 1 of the active Excel sheet
 * Returns array of non-empty header names
 */
function _getSheetContext() {
  _getSheetContext = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(query) {
    var _t6;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _context7.p = 0;
          _context7.n = 1;
          return Excel.run(/*#__PURE__*/function () {
            var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(context) {
              var sheet, usedRange, headerRange, headers, deepSearchContext, hitsCount, searchTerms, termsArray, _i, _termsArray, term, foundRange, words, bestWord, row, rowData, sampleSize, sampleRange, sampleData, columnTypes, _loop2, col, contextStr, overviewHeaders;
              return _regenerator().w(function (_context6) {
                while (1) switch (_context6.n) {
                  case 0:
                    sheet = context.workbook.worksheets.getActiveWorksheet();
                    sheet.load("name");

                    // Use getUsedRangeOrNullObject for robustness
                    usedRange = sheet.getUsedRangeOrNullObject();
                    usedRange.load("rowCount,columnCount,address,isNullObject");
                    _context6.n = 1;
                    return context.sync();
                  case 1:
                    if (!(usedRange.isNullObject || usedRange.rowCount === 0 || usedRange.columnCount === 0)) {
                      _context6.n = 2;
                      break;
                    }
                    return _context6.a(2, {
                      text: "Sheet is empty.",
                      hits: 0
                    });
                  case 2:
                    // 1. Get Headers (Row 1)
                    headerRange = usedRange.getRow(0);
                    headerRange.load("values");
                    _context6.n = 3;
                    return context.sync();
                  case 3:
                    headers = headerRange.values[0].map(function (h) {
                      return String(h || "").trim();
                    }); // 2. Perform Deep Search if query contains potential search terms
                    deepSearchContext = "";
                    hitsCount = 0;
                    if (!query) {
                      _context6.n = 16;
                      break;
                    }
                    searchTerms = new Set(); // 1. ALL CAPS sequences (e.g., MD PRAVEJ ALAM)
                    (query.match(/\b[A-Z]{2,}(?:\s+[A-Z]{2,})+\b/g) || []).forEach(function (t) {
                      return searchTerms.add(t);
                    });

                    // 2. Title Case sequences
                    (query.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g) || []).forEach(function (t) {
                      return searchTerms.add(t);
                    });

                    // 3. Numbers, Quoted strings, and Emails
                    (query.match(/\b\d{5,}\b/g) || []).forEach(function (t) {
                      return searchTerms.add(t);
                    });
                    (query.match(/"([^"]+)"/g) || []).forEach(function (t) {
                      return searchTerms.add(t.replace(/"/g, ''));
                    });
                    (query.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi) || []).forEach(function (t) {
                      return searchTerms.add(t);
                    });

                    // 4. Fallback: Generic phrases
                    (query.match(/\b[A-Za-z]{3,}(?:\s+[A-Za-z]{3,}){1,2}\b/g) || []).forEach(function (t) {
                      var commonWords = /^(this|that|sheet|data|name|about|find|search|where|exist|check|lookup|improve|analyze|suggest|help|better|optimize|what|when|where|there|from|with|tell|your|mine|ours|will|shall|should|could|would|please|show|list|their|details|contact|given|into|some|those|these)$/i;
                      if (!t.split(/\s+/).every(function (word) {
                        return commonWords.test(word);
                      })) {
                        searchTerms.add(t);
                      }
                    });
                    if (!(searchTerms.size > 0)) {
                      _context6.n = 11;
                      break;
                    }
                    termsArray = Array.from(searchTerms);
                    _i = 0, _termsArray = termsArray;
                  case 4:
                    if (!(_i < _termsArray.length)) {
                      _context6.n = 10;
                      break;
                    }
                    term = _termsArray[_i];
                    if (!/^(Name|Sheet|Data|Candidate|Find|Is|This|My|Current|Column|Details|About)$/i.test(term)) {
                      _context6.n = 5;
                      break;
                    }
                    return _context6.a(3, 9);
                  case 5:
                    foundRange = usedRange.find(term, {
                      completeMatch: false,
                      matchCase: false
                    });
                    foundRange.load("address,isNullObject");
                    _context6.n = 6;
                    return context.sync();
                  case 6:
                    if (!(foundRange.isNullObject && term.includes(" "))) {
                      _context6.n = 7;
                      break;
                    }
                    words = term.split(/\s+/).sort(function (a, b) {
                      return b.length - a.length;
                    });
                    bestWord = words[0];
                    if (!(bestWord.length > 3)) {
                      _context6.n = 7;
                      break;
                    }
                    foundRange = usedRange.find(bestWord, {
                      completeMatch: false,
                      matchCase: false
                    });
                    foundRange.load("address,isNullObject");
                    _context6.n = 7;
                    return context.sync();
                  case 7:
                    if (!(!foundRange.isNullObject && hitsCount < 10)) {
                      _context6.n = 9;
                      break;
                    }
                    hitsCount++;
                    row = foundRange.getEntireRow().getIntersection(usedRange);
                    row.load("values");
                    _context6.n = 8;
                    return context.sync();
                  case 8:
                    rowData = row.values[0].map(function (v, idx) {
                      var header = headers[idx] || "Col ".concat(idx + 1);
                      var val = v === "" || v === null ? "(empty)" : String(v);
                      return "".concat(header, ": ").concat(val);
                    }).join(" | ");
                    deepSearchContext += "\uD83D\uDCCC MATCH [".concat(term, "] at ").concat(foundRange.address, ":\n   >> ").concat(rowData, "\n");
                  case 9:
                    _i++;
                    _context6.n = 4;
                    break;
                  case 10:
                    if (hitsCount > 0) {
                      deepSearchContext += "=".repeat(40) + "\n";
                    } else {
                      deepSearchContext = "\n(I searched the sheet for your mentioned terms, but no exact matches were found in the current sheet.)\n";
                    }
                  case 11:
                    // 3. Sample data (max 10 rows for general context)
                    sampleSize = Math.min(10, usedRange.rowCount);
                    sampleRange = usedRange.getResizedRange(sampleSize - 1, 0); // Headers included
                    sampleRange.load("values");
                    _context6.n = 12;
                    return context.sync();
                  case 12:
                    sampleData = sampleRange.values; // Data type detection
                    columnTypes = [];
                    if (!(sampleData.length > 1)) {
                      _context6.n = 15;
                      break;
                    }
                    _loop2 = /*#__PURE__*/_regenerator().m(function _loop2(col) {
                      var columnValues;
                      return _regenerator().w(function (_context5) {
                        while (1) switch (_context5.n) {
                          case 0:
                            columnValues = sampleData.slice(1).map(function (row) {
                              return row[col];
                            }).filter(function (v) {
                              return v !== null && v !== "";
                            });
                            if (columnValues.length === 0) {
                              columnTypes.push("empty");
                            } else if (columnValues.every(function (v) {
                              return !isNaN(Number(v));
                            })) {
                              columnTypes.push("number");
                            } else if (columnValues.every(function (v) {
                              return /^\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}/.test(String(v));
                            })) {
                              columnTypes.push("date");
                            } else {
                              columnTypes.push("text");
                            }
                          case 1:
                            return _context5.a(2);
                        }
                      }, _loop2);
                    });
                    col = 0;
                  case 13:
                    if (!(col < usedRange.columnCount)) {
                      _context6.n = 15;
                      break;
                    }
                    return _context6.d(_regeneratorValues(_loop2(col)), 14);
                  case 14:
                    col++;
                    _context6.n = 13;
                    break;
                  case 15:
                    // Build context string
                    contextStr = "";
                    if (deepSearchContext && deepSearchContext.length > 50) {
                      contextStr += "\uD83D\uDEA8 [CRITICAL DATA HIT] \uD83D\uDEA8\n".concat(deepSearchContext, "\n\n");
                    }
                    contextStr += "--- GENERAL SHEET INFO ---\n";
                    contextStr += "Sheet: \"".concat(sheet.name, "\" (").concat(usedRange.rowCount, " rows \xD7 ").concat(usedRange.columnCount, " columns)\n");
                    contextStr += "Location: ".concat(usedRange.address, "\n\n");
                    contextStr += "COLUMNS:\n";
                    headers.forEach(function (h, i) {
                      var type = columnTypes[i] || "unknown";
                      contextStr += "  ".concat(i + 1, ". \"").concat(h || "Column".concat(i + 1), "\" (").concat(type, ")\n");
                    });
                    contextStr += "\nDATA SAMPLE (First ".concat(sampleSize, " rows):\n");
                    sampleData.forEach(function (row, i) {
                      if (i === 0) {
                        contextStr += "  [Headers] ".concat(row.map(function (c) {
                          return "\"".concat(c, "\"");
                        }).join(" | "), "\n");
                      } else {
                        contextStr += "  Row ".concat(i, ": ").concat(row.map(function (c) {
                          return c === null || c === "" ? "(empty)" : "\"".concat(c, "\"");
                        }).join(" | "), "\n");
                      }
                    });
                    if (usedRange.rowCount > sampleSize) {
                      contextStr += "  ... (".concat(usedRange.rowCount - sampleSize, " more rows not shown)\n");
                    }
                    return _context6.a(2, {
                      text: contextStr,
                      hits: hitsCount
                    });
                  case 16:
                    // Even without a query, return a general sheet overview
                    overviewHeaders = headers.filter(function (h) {
                      return h.length > 0;
                    });
                    if (!(overviewHeaders.length > 0)) {
                      _context6.n = 17;
                      break;
                    }
                    return _context6.a(2, {
                      text: "Sheet: \"".concat(sheet.name, "\" (").concat(usedRange.rowCount, " rows \xD7 ").concat(usedRange.columnCount, " columns)\nColumns: ").concat(overviewHeaders.join(", ")),
                      hits: 0
                    });
                  case 17:
                    return _context6.a(2, null);
                }
              }, _callee5);
            }));
            return function (_x12) {
              return _ref.apply(this, arguments);
            };
          }());
        case 1:
          return _context7.a(2, _context7.v);
        case 2:
          _context7.p = 2;
          _t6 = _context7.v;
          console.error("Error reading sheet context:", _t6);
          return _context7.a(2, null);
      }
    }, _callee6, null, [[0, 2]]);
  }));
  return _getSheetContext.apply(this, arguments);
}
function getExcelColumnHeaders() {
  return _getExcelColumnHeaders.apply(this, arguments);
}
/**
 * Get count of existing data rows (excluding header)
 */
function _getExcelColumnHeaders() {
  _getExcelColumnHeaders = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          return _context9.a(2, Excel.run(/*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(context) {
              var sheet, headerRange, headers;
              return _regenerator().w(function (_context8) {
                while (1) switch (_context8.n) {
                  case 0:
                    sheet = context.workbook.worksheets.getActiveWorksheet(); // Read first row (A1:Z1) for headers - covers up to 26 columns
                    headerRange = sheet.getRange("A1:Z1");
                    headerRange.load("values");
                    _context8.n = 1;
                    return context.sync();
                  case 1:
                    headers = headerRange.values[0].map(function (cell) {
                      return cell ? String(cell).trim() : "";
                    }).filter(function (header) {
                      return header !== "";
                    });
                    return _context8.a(2, headers);
                }
              }, _callee7);
            }));
            return function (_x13) {
              return _ref2.apply(this, arguments);
            };
          }()));
      }
    }, _callee8);
  }));
  return _getExcelColumnHeaders.apply(this, arguments);
}
function getExistingDataRowCount() {
  return _getExistingDataRowCount.apply(this, arguments);
}
/**
 * Detect and display column headers in the UI
 */
function _getExistingDataRowCount() {
  _getExistingDataRowCount = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          return _context1.a(2, Excel.run(/*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(context) {
              var sheet, usedRange;
              return _regenerator().w(function (_context0) {
                while (1) switch (_context0.n) {
                  case 0:
                    sheet = context.workbook.worksheets.getActiveWorksheet();
                    usedRange = sheet.getUsedRange();
                    usedRange.load("rowCount");
                    _context0.n = 1;
                    return context.sync();
                  case 1:
                    return _context0.a(2, Math.max(0, usedRange.rowCount - 1));
                }
              }, _callee9);
            }));
            return function (_x14) {
              return _ref3.apply(this, arguments);
            };
          }()));
      }
    }, _callee0);
  }));
  return _getExistingDataRowCount.apply(this, arguments);
}
function detectAndShowColumns() {
  return _detectAndShowColumns.apply(this, arguments);
}
/**
 * Build the schema-aware extraction prompt with existing column headers
 */
function _detectAndShowColumns() {
  _detectAndShowColumns = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
    var btn, detectedSection, columnChips, columnCount, columns, _t7;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          btn = document.getElementById("detect-columns-btn");
          detectedSection = document.getElementById("detected-columns");
          columnChips = document.getElementById("column-chips");
          columnCount = document.getElementById("column-count");
          if (!(!detectedSection || !columnChips || !columnCount)) {
            _context10.n = 1;
            break;
          }
          return _context10.a(2);
        case 1:
          // Show loading state
          if (btn) btn.innerHTML = "⏳ Loading...";
          _context10.p = 2;
          _context10.n = 3;
          return getExcelColumnHeaders();
        case 3:
          columns = _context10.v;
          if (columns.length === 0) {
            // No columns found
            columnChips.innerHTML = '<span class="column-chip empty-warning">⚠️ No headers in Row 1 — add columns first</span>';
            columnCount.textContent = "0";
            detectedSection.style.display = "block";
          } else {
            // Show detected columns as chips
            columnChips.innerHTML = columns.map(function (col) {
              return "<span class=\"column-chip\">".concat(col, "</span>");
            }).join("");
            columnCount.textContent = String(columns.length);
            detectedSection.style.display = "block";
          }
          _context10.n = 5;
          break;
        case 4:
          _context10.p = 4;
          _t7 = _context10.v;
          console.error("Error detecting columns:", _t7);
          columnChips.innerHTML = '<span class="column-chip empty-warning">⚠️ Error reading Excel</span>';
          columnCount.textContent = "0";
          detectedSection.style.display = "block";
        case 5:
          _context10.p = 5;
          if (btn) btn.innerHTML = "🔍 Detect";
          return _context10.f(5);
        case 6:
          return _context10.a(2);
      }
    }, _callee1, null, [[2, 4, 5, 6]]);
  }));
  return _detectAndShowColumns.apply(this, arguments);
}
function buildSchemaExtractionDirective(columns) {
  var columnList = columns.map(function (c, i) {
    return "".concat(i + 1, ". \"").concat(c, "\"");
  }).join("\n");
  var enhancedHints = (0,_services_document_extractor__WEBPACK_IMPORTED_MODULE_5__.buildEnhancedPrompt)(columns);
  return "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\uD83D\uDD12 SCHEMA-LOCKED EXTRACTION MODE \u2014 CRITICAL INSTRUCTIONS\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\nThe user has PRE-DEFINED these columns in their Excel sheet. You MUST extract data ONLY for these columns:\n\n".concat(columnList, "\n\n").concat(enhancedHints, "\n\nEXTRACTION RULES (MEMORIZE THESE):\n1. ONE ROW PER DOCUMENT: Each attached PDF/image represents ONE candidate/record.\n2. EXACT COLUMN MATCHING: Only fill data for the columns listed above.\n3. NO HALLUCINATION: If information for a column is NOT visible in the document, use \"\" (empty string).\n4. NO NEW COLUMNS: Do NOT add any columns that aren't in the list above.\n5. PROPER FORMATTING:\n   - Names: Proper Case (John Smith)\n   - Emails: lowercase\n   - Phones: Keep original format or +X-XXX-XXX-XXXX\n   - Skills: Comma-separated list\n\nBANNED BEHAVIORS:\n\u274C Guessing email addresses (e.g., firstname@company.com)\n\u274C Fabricating phone numbers\n\u274C Making up skills not explicitly listed\n\u274C Using \"N/A\", \"Not Found\", \"Unknown\" \u2014 use \"\" instead\n\u274C Adding extra columns\n\nOUTPUT: Generate Excel JS code that writes the extracted data starting from the first empty row.\nThe code should use the writeData helper function and format the data professionally.\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n");
}

// ═══════════════════════════════════════════════════════════════
// AGENT MODE — Execute Functions (Enhanced with Orchestrator)
// ═══════════════════════════════════════════════════════════════

var MAX_EXECUTION_RETRIES = 3;
function runAICommand() {
  return _runAICommand.apply(this, arguments);
}

// ─── Helpers ───────────────────────────────────────────────────
function _runAICommand() {
  _runAICommand = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
    var statusEl, debugEl, skeletonEl, cacheBadge, promptInput, button, userPrompt, isSchemaMode, signal, runText, runIcon, originalText, originalIcon, code, fromCache, sheetContext, _sheetContext, existingColumns, cached, validation, messages, schemaDirective, cleanPrompt, contentText, contentParts, totalImages, _validation, validationAttempts, MAX_VALIDATION_FIXES, errorSummary, orchestratorResult, recovery, _t8, _t9, _t0;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.p = _context12.n) {
        case 0:
          statusEl = document.getElementById("status-message");
          debugEl = document.getElementById("debug-code");
          skeletonEl = document.getElementById("skeleton");
          cacheBadge = document.getElementById("cache-badge");
          promptInput = document.getElementById("prompt-input");
          button = document.getElementById("run");
          if (!(!statusEl || !debugEl || !skeletonEl || !cacheBadge || !promptInput || !button)) {
            _context12.n = 1;
            break;
          }
          console.error("Agent UI elements not found");
          return _context12.a(2);
        case 1:
          userPrompt = promptInput.value.trim(); // Handle File Input
          if (!(!userPrompt && attachedFiles.length === 0)) {
            _context12.n = 2;
            break;
          }
          showStatus(statusEl, "info", "Please enter a command or attach a file.");
          return _context12.a(2);
        case 2:
          // Default prompt for files
          if (attachedFiles.length > 0 && !userPrompt) {
            userPrompt = attachedFiles.length > 1 ? "Analyze the ".concat(attachedFiles.length, " attached files. Extract and merge all tabular data into a single master table. Standardize headers and columns.") : "Analyze the attached ".concat(attachedFiles[0].type, ". Extract all tabular data and write valid Excel JS code to populate the active sheet. Format headers and auto-fit columns.");
          }

          // Detect Schema Extraction Mode
          isSchemaMode = userPrompt.includes("SCHEMA_EXTRACTION_MODE") || currentCategory === "extract"; // Enforce table format if processing a document
          if (attachedFiles.length > 0 && !isSchemaMode) {
            userPrompt += "\n\n[FORMATTING STRICT RULE]: You are extracting data from a document. ALWAYS output the data as a clean, flat 2D HORIZONTAL table at the top of the sheet. Put Column Headers in Row A1...X1. Append the extracted data underneath. NEVER output a vertical key-value list mimicking a document. Ensure data rows have { font: { color: \"#000000\" } }.";
          }

          // UI: loading
          if (!agentAbortController) {
            _context12.n = 3;
            break;
          }
          agentAbortController.abort();
          return _context12.a(2);
        case 3:
          agentAbortController = new AbortController();
          signal = agentAbortController.signal;
          runText = document.getElementById("run-text");
          runIcon = document.getElementById("run-icon");
          originalText = runText ? runText.innerText : "Execute";
          originalIcon = runIcon ? runIcon.innerHTML : "";
          button.classList.add("is-busy");
          button.classList.add("btn-stop");
          if (runText) runText.innerText = "Stop Agent";
          if (runIcon) runIcon.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.stop;
          statusEl.style.display = "none";
          skeletonEl.style.display = "flex";
          cacheBadge.style.display = "none";
          debugEl.innerText = "";
          _context12.p = 4;
          fromCache = false; // ─── Read Sheet Context for Intelligent Assistance ───
          sheetContext = null;
          _context12.p = 5;
          _context12.n = 6;
          return (0,_services_agent_orchestrator__WEBPACK_IMPORTED_MODULE_7__.readSheetContext)();
        case 6:
          sheetContext = _context12.v;
          if ((_sheetContext = sheetContext) !== null && _sheetContext !== void 0 && _sheetContext.hasData) {
            console.log("[Agent] Sheet context: ".concat(sheetContext.rowCount, "x").concat(sheetContext.columnCount));
          }
          _context12.n = 8;
          break;
        case 7:
          _context12.p = 7;
          _t8 = _context12.v;
          console.warn("[Agent] Could not read sheet context:", _t8);
        case 8:
          // ─── Schema Extraction Mode ───
          existingColumns = [];
          if (!(isSchemaMode && attachedFiles.length > 0)) {
            _context12.n = 13;
            break;
          }
          _context12.p = 9;
          _context12.n = 10;
          return getExcelColumnHeaders();
        case 10:
          existingColumns = _context12.v;
          console.log("[Agent] Schema columns detected:", existingColumns);
          if (!(existingColumns.length === 0)) {
            _context12.n = 11;
            break;
          }
          showStatus(statusEl, "info", "⚠️ No column headers found in Row 1. Add headers first or use 'HR Database Setup' to create them.");
          skeletonEl.style.display = "none";
          return _context12.a(2);
        case 11:
          if (runText) runText.innerText = "Extracting (".concat(existingColumns.length, " cols)...");
          _context12.n = 13;
          break;
        case 12:
          _context12.p = 12;
          _t9 = _context12.v;
          console.warn("[Agent] Could not read Excel headers:", _t9);
        case 13:
          // ─── Check Cache (Skip for files/schema mode) ───
          cached = attachedFiles.length === 0 && !isSchemaMode ? (0,_services_cache__WEBPACK_IMPORTED_MODULE_4__.getCachedResponse)(userPrompt) : null;
          if (cached) {
            code = cached;
            fromCache = true;
            cacheBadge.style.display = "inline-block";

            // Still validate cached code
            validation = (0,_services_agent_orchestrator__WEBPACK_IMPORTED_MODULE_7__.validateCode)(code);
            if (!validation.isValid) {
              console.warn("[Agent] Cached code failed validation, regenerating...");
              fromCache = false;
              code = ""; // Will regenerate
            } else {
              code = validation.sanitizedCode;
            }
          }

          // ─── Generate Code (if not from cache) ───
          if (fromCache) {
            _context12.n = 21;
            break;
          }
          if (!(isSchemaMode && attachedFiles.length > 0)) {
            _context12.n = 18;
            break;
          }
          if (runText) runText.innerText = "Generating...";
          messages = [{
            role: "system",
            content: _services_prompt__WEBPACK_IMPORTED_MODULE_2__.SYSTEM_PROMPT
          }];
          schemaDirective = buildSchemaExtractionDirective(existingColumns);
          cleanPrompt = userPrompt.replace("SCHEMA_EXTRACTION_MODE:", "").trim();
          contentText = "".concat(cleanPrompt, "\n\nEXISTING_COLUMNS: ").concat(JSON.stringify(existingColumns), "\n\n").concat(schemaDirective);
          contentParts = [{
            type: "text",
            text: contentText
          }];
          totalImages = 0;
          attachedFiles.forEach(function (file) {
            file.data.forEach(function (url) {
              if (totalImages < 20) {
                contentParts.push({
                  type: "image_url",
                  image_url: {
                    url: url
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
          _context12.n = 14;
          return (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.callLLM)(messages, undefined, signal);
        case 14:
          code = _context12.v;
          if (runText) runText.innerText = "Validating...";
          _validation = (0,_services_agent_orchestrator__WEBPACK_IMPORTED_MODULE_7__.validateCode)(code);
          validationAttempts = 0;
          MAX_VALIDATION_FIXES = 2;
        case 15:
          if (!(!_validation.isValid && validationAttempts < MAX_VALIDATION_FIXES)) {
            _context12.n = 17;
            break;
          }
          console.warn("[Agent] Validation failed (attempt ".concat(validationAttempts + 1, "):"), _validation.errors);
          errorSummary = _validation.errors.map(function (e) {
            return "".concat(e.message, " \u2192 ").concat(e.suggestion);
          }).join("\n");
          _context12.n = 16;
          return (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.callLLM)([{
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
            content: "VALIDATION ERRORS:\n".concat(errorSummary, "\n\nFix these errors. Output ONLY the corrected code.")
          }], undefined, signal);
        case 16:
          code = _context12.v;
          _validation = (0,_services_agent_orchestrator__WEBPACK_IMPORTED_MODULE_7__.validateCode)(code);
          validationAttempts++;
          _context12.n = 15;
          break;
        case 17:
          code = _validation.sanitizedCode;
          if (_validation.warnings.length > 0) {
            console.log("[Agent] Validation warnings:", _validation.warnings);
          }
          _context12.n = 21;
          break;
        case 18:
          if (runText) runText.innerText = "Planning...";
          _context12.n = 19;
          return (0,_services_agent_orchestrator__WEBPACK_IMPORTED_MODULE_7__.runAgent)(userPrompt, sheetContext, attachedFiles, {
            maxRetries: 2,
            enablePlanning: true,
            strictValidation: true
          }, signal);
        case 19:
          orchestratorResult = _context12.v;
          if (orchestratorResult.success) {
            _context12.n = 20;
            break;
          }
          throw new Error(orchestratorResult.error || "Agent failed to generate valid code");
        case 20:
          code = orchestratorResult.code;
        case 21:
          debugEl.innerText = code;
          skeletonEl.style.display = "none";

          // ─── EXECUTION PHASE with Advanced Recovery ───
          if (runText) runText.innerText = "Running...";
          showStatus(statusEl, "info", "<div class=\"spinner\"></div><span>Executing code...</span>");
          _context12.n = 22;
          return (0,_services_agent_orchestrator__WEBPACK_IMPORTED_MODULE_7__.executeWithRecovery)(code, /*#__PURE__*/function () {
            var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(candidateCode) {
              return _regenerator().w(function (_context11) {
                while (1) switch (_context11.n) {
                  case 0:
                    _context11.n = 1;
                    return executeExcelCode(candidateCode);
                  case 1:
                    return _context11.a(2);
                }
              }, _callee10);
            }));
            return function (_x15) {
              return _ref4.apply(this, arguments);
            };
          }(), MAX_EXECUTION_RETRIES, signal);
        case 22:
          recovery = _context12.v;
          if (!recovery.success) {
            _context12.n = 23;
            break;
          }
          code = recovery.finalCode;
          debugEl.innerText = code;
          if (!fromCache && attachedFiles.length === 0 && !isSchemaMode) {
            (0,_services_cache__WEBPACK_IMPORTED_MODULE_4__.cacheResponse)(userPrompt, code);
          }
          showStatus(statusEl, "success", "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_9__.Icons.check, "<span>Done</span>"));
          showToast("success", "Executed successfully \u2713 (Press Ctrl+Z to undo)");
          _context12.n = 24;
          break;
        case 23:
          throw new Error(recovery.error || "Execution failed after retries");
        case 24:
          _context12.n = 26;
          break;
        case 25:
          _context12.p = 25;
          _t0 = _context12.v;
          console.error("[Agent] Fatal error:", _t0);
          skeletonEl.style.display = "none";
          if (_t0.name === 'AbortError') {
            showStatus(statusEl, "info", "Agent stopped by user.");
            showToast("info", "Agent stopped");
          } else {
            showStatus(statusEl, "error", _t0.message || String(_t0));
            showToast("error", (_t0.message || "Execution failed").substring(0, 80));
          }
        case 26:
          _context12.p = 26;
          button.disabled = false;
          if (runText) runText.innerText = originalText;
          if (runIcon) runIcon.innerHTML = originalIcon;
          button.classList.remove("btn-stop");
          button.classList.remove("is-busy");
          agentAbortController = null;
          return _context12.f(26);
        case 27:
          return _context12.a(2);
      }
    }, _callee11, null, [[9, 12], [5, 7], [4, 25, 26, 27]]);
  }));
  return _runAICommand.apply(this, arguments);
}
function showStatus(el, type, html) {
  el.innerHTML = html;
  el.className = "status-pill ".concat(type);
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
function executeExcelCode(_x4) {
  return _executeExcelCode.apply(this, arguments);
} // ─── File Handling Logic ───────────────────────────────────────
function _executeExcelCode() {
  _executeExcelCode = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(code) {
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.n) {
        case 0:
          _context14.n = 1;
          return Excel.run(/*#__PURE__*/function () {
            var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(context) {
              var sheet, writeDataHelper, wrappedCode, _t1, _t10;
              return _regenerator().w(function (_context13) {
                while (1) switch (_context13.p = _context13.n) {
                  case 0:
                    sheet = context.workbook.worksheets.getActiveWorksheet(); // Mandatory writeData helper that all generated code can use
                    writeDataHelper = "\nfunction writeData(sheet, startCell, data) {\n  if (!data || data.length === 0) return null;\n  const rows = data.length;\n  const cols = Math.max(...data.map(r => r ? r.length : 0));\n  if (cols === 0) return null;\n  const normalized = data.map(r => {\n    const row = r ? [...r] : [];\n    while (row.length < cols) row.push(\"\");\n    return row.map(cell => {\n      if (cell === null || cell === undefined) return \"\";\n      let val = typeof cell === \"object\" ? (Array.isArray(cell) ? cell.join(\", \") : JSON.stringify(cell)) : String(cell);\n      if (/^[=+\\-@]/.test(val)) val = \"'\" + val;\n      if (val.length > 30000) val = val.substring(0, 30000) + \"...\";\n      return val;\n    });\n    });\n  });\n  try {\n    const range = sheet.getRange(startCell).getResizedRange(rows - 1, cols - 1);\n    range.values = normalized;\n    range.format.font.name = \"Segoe UI\";\n    range.format.font.size = 10;\n    range.format.verticalAlignment = \"Center\";\n    return range;\n  } catch (e) {\n    console.error(\"writeData error:\", e);\n    return null;\n  }\n}\n\n  function formatTableStyle(usedRange, headerColor, fontColor) {\n    if (!usedRange) return;\n    try {\n      if (usedRange.rowCount < 1) return;\n      const headerRow = usedRange.getRow(0);\n      headerRow.format.set({\n        font: { bold: true, size: 11, color: fontColor },\n        fill: { color: headerColor },\n        horizontalAlignment: \"Center\",\n        verticalAlignment: \"Center\"\n      });\n      // Try resolving body\n      if (usedRange.rowCount > 1) {\n        const bodyRange = usedRange.getOffsetRange(1, 0).getResizedRange(-1, 0);\n        bodyRange.format.font.color = \"#000000\";\n        bodyRange.format.wrapText = true;\n      }\n    } catch (e) {\n      console.error(\"formatTableStyle error: \", e);\n    }\n  }\n  ";
                    wrappedCode = "\n      ".concat(writeDataHelper, "\n      \n      try {\n        // \u2550\u2550\u2550 AI Generated Code \u2550\u2550\u2550\n        ").concat(code, "\n        \n        // \u2550\u2550\u2550 Safety Finalization \u2550\u2550\u2550\n        try {\n          sheet.getUsedRange().format.autofitColumns();\n        } catch(_) { /* Sheet might be empty */ }\n        \n      } catch(_innerErr) {\n        console.error(\"[Agent] Runtime Error:\", _innerErr);\n        try { await context.sync(); } catch(_) {}\n        throw _innerErr;\n      }\n    ");
                    console.log("=== EXECUTING AI CODE ===");
                    console.log(wrappedCode.split("\\n").map(function (l, i) {
                      return "".concat(i + 1, ": ").concat(l);
                    }).join("\\n"));
                    console.log("=========================");
                    _context13.p = 1;
                    _context13.n = 2;
                    return new Function("context", "sheet", "Excel", "return (async () => {\n          try {\n            ".concat(wrappedCode, "\n            await context.sync();\n          } catch (inner) {\n        // Enhance error messages for common issues\n        if (inner.code === \"InvalidArgument\") {\n          const original = inner.message || \"\";\n          if (original.includes(\"A0\") || original.includes(\"row 0\")) {\n            inner.message = \"Invalid range: Row 0 doesn't exist. Excel rows start at 1.\";\n          } else if (original.includes(\"getResizedRange\")) {\n            inner.message = \"Invalid range size: Check that data dimensions match the range.\";\n          } else {\n            inner.message = \"Invalid argument: \" + original;\n          }\n        } else if (inner.message?.includes(\"is not a function\")) {\n          const fnMatch = inner.message.match(/(\\w+) is not a function/);\n          const fn = fnMatch ? fnMatch[1] : (inner.stack?.match(/at\\s+.*\\.(.*)\\s+\\(/)?.[1] || \"method\");\n          inner.message = \"API Error: .\" + fn + \"() doesn't exist. Use correct Excel JS API methods.\";\n        } else if (inner.message?.includes(\"is not defined\")) {\n          const varMatch = inner.message.match(/(\\w+) is not defined/);\n          const v = varMatch ? varMatch[1] : \"variable\";\n          inner.message = \"Undefined: '\" + v + \"' was used before being declared.\";\n        } else if (inner.message?.includes(\"Cannot read property\")) {\n          inner.message = \"Null reference: Tried to read property of undefined. Add null checks or ensure .load() was called.\";\n        }\n        throw inner;\n      }\n    })()"))(context, sheet, Excel);
                  case 2:
                    _context13.n = 8;
                    break;
                  case 3:
                    _context13.p = 3;
                    _t1 = _context13.v;
                    console.error("[Agent] Execution Error:", _t1);
                    _context13.p = 4;
                    _context13.n = 5;
                    return context.sync();
                  case 5:
                    _context13.n = 7;
                    break;
                  case 6:
                    _context13.p = 6;
                    _t10 = _context13.v;
                  case 7:
                    throw _t1;
                  case 8:
                    _context13.n = 9;
                    return context.sync();
                  case 9:
                    return _context13.a(2);
                }
              }, _callee12, null, [[4, 6], [1, 3]]);
            }));
            return function (_x16) {
              return _ref5.apply(this, arguments);
            };
          }());
        case 1:
          return _context14.a(2);
      }
    }, _callee13);
  }));
  return _executeExcelCode.apply(this, arguments);
}
function handleFileSelect(_x5) {
  return _handleFileSelect.apply(this, arguments);
}
function _handleFileSelect() {
  _handleFileSelect = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(event) {
    var isAgent,
      input,
      btnId,
      btn,
      newFiles,
      i,
      file,
      arrayBuffer,
      images,
      base64,
      icon,
      _args15 = arguments,
      _t11;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.p = _context15.n) {
        case 0:
          isAgent = _args15.length > 1 && _args15[1] !== undefined ? _args15[1] : false;
          input = event.target;
          if (!(!input.files || input.files.length === 0)) {
            _context15.n = 1;
            break;
          }
          return _context15.a(2);
        case 1:
          btnId = isAgent ? "agent-file-btn" : "file-upload-btn";
          btn = document.getElementById(btnId);
          if (btn) btn.innerHTML = "< span class=\"btn-spinner\" > </span>";
          _context15.p = 2;
          newFiles = []; // Process all selected files
          i = 0;
        case 3:
          if (!(i < input.files.length)) {
            _context15.n = 9;
            break;
          }
          file = input.files[i];
          if (!(file.type === "application/pdf")) {
            _context15.n = 6;
            break;
          }
          rawPDFFiles.push(file); // Keep raw file for text extraction
          _context15.n = 4;
          return file.arrayBuffer();
        case 4:
          arrayBuffer = _context15.v;
          _context15.n = 5;
          return renderPdfToImages(arrayBuffer);
        case 5:
          images = _context15.v;
          newFiles.push({
            name: file.name,
            type: "pdf",
            data: images
          });
          _context15.n = 8;
          break;
        case 6:
          if (!file.type.startsWith("image/")) {
            _context15.n = 8;
            break;
          }
          _context15.n = 7;
          return fileToBase64(file);
        case 7:
          base64 = _context15.v;
          newFiles.push({
            name: file.name,
            type: "image",
            data: [base64]
          });
        case 8:
          i++;
          _context15.n = 3;
          break;
        case 9:
          if (!(newFiles.length > 0)) {
            _context15.n = 10;
            break;
          }
          // Append to existing files
          attachedFiles = [].concat(_toConsumableArray(attachedFiles), newFiles);
          // Show batch panel if in extract mode and we have PDFs
          if (currentCategory === "extract" && rawPDFFiles.length > 0) {
            showBatchPanel(true);
          }
          updateFilePreview(true, isAgent);
          _context15.n = 11;
          break;
        case 10:
          throw new Error("Unsupported file type. Please upload PDF or Image.");
        case 11:
          _context15.n = 13;
          break;
        case 12:
          _context15.p = 12;
          _t11 = _context15.v;
          console.error(_t11);
          showStatus(document.getElementById("status-message"), "error", "Error reading file: " + _t11.message);
        case 13:
          _context15.p = 13;
          // Reset input so same file can be selected again if needed
          input.value = "";
          if (btn) {
            // Restore icon
            icon = isAgent ? "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\"></path></svg>" : "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\"></path></svg>";
            btn.innerHTML = icon;
          }
          return _context15.f(13);
        case 14:
          return _context15.a(2);
      }
    }, _callee14, null, [[2, 12, 13, 14]]);
  }));
  return _handleFileSelect.apply(this, arguments);
}
function updateFilePreview(show) {
  var isAgent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var listId = isAgent ? "agent-file-preview-list" : "file-preview-list";
  var container = document.getElementById(listId);
  if (!container) return;
  container.innerHTML = "";
  if (attachedFiles.length === 0) {
    return;
  }

  // Render chips
  attachedFiles.forEach(function (file, index) {
    var chip = document.createElement("div");
    chip.className = "file-chip";
    var icon = document.createElement("span");
    icon.className = "file-chip-icon";
    icon.innerHTML = file.type === "pdf" ? "📄" : "🖼️";
    var name = document.createElement("span");
    name.className = "file-chip-name";
    name.innerText = file.name;
    var remove = document.createElement("button");
    remove.className = "file-chip-remove";
    remove.innerHTML = "×";
    remove.title = "Remove file";
    remove.onclick = function (e) {
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
  var isAgent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  attachedFiles = [];
  rawPDFFiles = [];
  showBatchPanel(false);
  updateFilePreview(false, isAgent);
}
function fileToBase64(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function () {
      return resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function renderPdfToImages(_x6) {
  return _renderPdfToImages.apply(this, arguments);
} // ═══════════════════════════════════════════════════════════════
// BATCH PDF EXTRACTION ENGINE
// ═══════════════════════════════════════════════════════════════
/**
 * Shows or hides the batch extraction panel and updates the file count badge.
 */
function _renderPdfToImages() {
  _renderPdfToImages = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(buffer) {
    var pdf, images, maxPages, i, page, viewport, canvas, context;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.n) {
        case 0:
          _context16.n = 1;
          return pdfjs_dist__WEBPACK_IMPORTED_MODULE_8__.getDocument(buffer).promise;
        case 1:
          pdf = _context16.v;
          images = []; // Limit to 5 pages per PDF for better coverage of long CVs
          maxPages = Math.min(pdf.numPages, 5);
          i = 1;
        case 2:
          if (!(i <= maxPages)) {
            _context16.n = 7;
            break;
          }
          _context16.n = 3;
          return pdf.getPage(i);
        case 3:
          page = _context16.v;
          // Use 1.0 scale to keep image size manageable for local vision models
          viewport = page.getViewport({
            scale: 1.0
          });
          canvas = document.createElement("canvas");
          context = canvas.getContext("2d");
          if (context) {
            _context16.n = 4;
            break;
          }
          return _context16.a(3, 6);
        case 4:
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          _context16.n = 5;
          return page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
        case 5:
          images.push(canvas.toDataURL("image/png"));
        case 6:
          i++;
          _context16.n = 2;
          break;
        case 7:
          return _context16.a(2, images);
      }
    }, _callee15);
  }));
  return _renderPdfToImages.apply(this, arguments);
}
function showBatchPanel(show) {
  var panel = document.getElementById("batch-extraction-panel");
  var badge = document.getElementById("batch-file-count");
  if (!panel) return;
  panel.style.display = show ? "block" : "none";
  if (show && badge) {
    var count = rawPDFFiles.length;
    badge.textContent = "".concat(count, " PDF").concat(count !== 1 ? "s" : "");
  }
}

/**
 * Parses field names from natural language instruction using regex heuristics.
 * E.g. "Extract Name, Email, Phone, Skills and Experience" → ["Name","Email","Phone","Skills","Experience"]
 */
function parseFieldsFromInstruction(instruction) {
  // Look for explicit list patterns: "extract X, Y, Z" or "find X, Y and Z"
  var listPattern = /(?:extract|find|get|pull|identify|return|capture|include)[:\s]+([^.!?]+)/i;
  var match = instruction.match(listPattern);
  if (match) {
    return match[1].split(/[,;&]| and /i).map(function (f) {
      return f.trim().replace(/^["'\-•]+|["'\-•]+$/g, "");
    }).filter(function (f) {
      return f.length > 1 && f.length < 50;
    });
  }

  // Fallback: detect capitalised or quoted words as field names
  var capitalWords = instruction.match(/\b[A-Z][a-z]{2,}(?:\s[A-Z][a-z]{2,})?\b/g) || [];
  var filtered = capitalWords.filter(function (w) {
    return !/^(These|This|The|And|From|With|For|All|Each|Into|Then|After|Before|Upload|File|Excel|Sheet|Row|Column|PDF|Resume|CV)$/.test(w);
  });
  if (filtered.length > 0) return Array.from(new Set(filtered));

  // Default for resumes if nothing detected
  return ["Name", "Email", "Phone", "Skills", "Experience"];
}

/**
 * Ensures the first row of the active sheet has the given fields as headers.
 * If the sheet is empty, writes them in row 1. If headers already exist, leaves them.
 * Returns the final, authoritative list of headers in sheet order.
 */
function ensureExcelHeaders(_x7) {
  return _ensureExcelHeaders.apply(this, arguments);
}
/**
 * Calls the LLM to extract structured fields from raw PDF text.
 * Returns a parsed object { fieldName: value } or null on failure.
 */
function _ensureExcelHeaders() {
  _ensureExcelHeaders = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(fields) {
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.n) {
        case 0:
          return _context18.a(2, Excel.run(/*#__PURE__*/function () {
            var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(context) {
              var sheet, headerRange, existing;
              return _regenerator().w(function (_context17) {
                while (1) switch (_context17.n) {
                  case 0:
                    sheet = context.workbook.worksheets.getActiveWorksheet();
                    headerRange = sheet.getRange("A1:".concat(String.fromCharCode(64 + fields.length), "1"));
                    headerRange.load("values");
                    _context17.n = 1;
                    return context.sync();
                  case 1:
                    existing = headerRange.values[0].map(function (v) {
                      return String(v || "").trim();
                    }).filter(function (v) {
                      return v;
                    });
                    if (!(existing.length > 0)) {
                      _context17.n = 2;
                      break;
                    }
                    return _context17.a(2, existing);
                  case 2:
                    // Write new headers
                    headerRange.values = [fields.map(function (f) {
                      return f.trim();
                    })];
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
                    _context17.n = 3;
                    return context.sync();
                  case 3:
                    return _context17.a(2, fields);
                }
              }, _callee16);
            }));
            return function (_x17) {
              return _ref6.apply(this, arguments);
            };
          }()));
      }
    }, _callee17);
  }));
  return _ensureExcelHeaders.apply(this, arguments);
}
function extractStructuredData(_x8, _x9, _x0, _x1) {
  return _extractStructuredData.apply(this, arguments);
}
/**
 * Appends a single data row to the Excel sheet below the header.
 * Detects the next empty row automatically.
 */
function _extractStructuredData() {
  _extractStructuredData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(pdfText, userInstruction, fields, signal) {
    var fieldList, systemPrompt, userMessage, response, cleaned, jsonMatch, _t12;
    return _regenerator().w(function (_context19) {
      while (1) switch (_context19.p = _context19.n) {
        case 0:
          fieldList = fields.join(", ");
          systemPrompt = "You are a precision data extraction engine. Your ONLY output is valid JSON.\n\nGiven a document, extract the following fields: ".concat(fieldList, "\n\nRules:\n- Output ONLY a JSON object. No markdown, no explanation, no extra text.\n- Use exact field names as keys: ").concat(JSON.stringify(fields), "\n- If a field is not found in the document, use null as the value.\n- For \"Skills\": list as a comma-separated string.\n- For \"Experience\": summarize the most recent role: \"Title at Company (Years)\" or list companies.\n- Never hallucinate or guess information not in the document.\n\nExample output:\n{\"Name\": \"John Smith\", \"Email\": \"john@email.com\", \"Phone\": \"9876543210\", \"Skills\": \"Python, React, SQL\", \"Experience\": \"Software Engineer at Google (3 yrs)\"}");
          userMessage = "Instruction: ".concat(userInstruction, "\n\nDOCUMENT TEXT:\n").concat(pdfText.substring(0, 8000));
          _context19.p = 1;
          _context19.n = 2;
          return (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.callLLM)([{
            role: "system",
            content: systemPrompt
          }, {
            role: "user",
            content: userMessage
          }], undefined, signal);
        case 2:
          response = _context19.v;
          // Strip markdown fences if model added them
          cleaned = response.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
          jsonMatch = cleaned.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            _context19.n = 3;
            break;
          }
          return _context19.a(2, null);
        case 3:
          return _context19.a(2, JSON.parse(jsonMatch[0]));
        case 4:
          _context19.p = 4;
          _t12 = _context19.v;
          console.error("[Batch] LLM extraction failed:", _t12);
          return _context19.a(2, null);
      }
    }, _callee18, null, [[1, 4]]);
  }));
  return _extractStructuredData.apply(this, arguments);
}
function appendExcelRow(_x10, _x11) {
  return _appendExcelRow.apply(this, arguments);
}
/**
 * Adds a log entry to the batch log panel.
 */
function _appendExcelRow() {
  _appendExcelRow = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(headers, data) {
    return _regenerator().w(function (_context21) {
      while (1) switch (_context21.n) {
        case 0:
          _context21.n = 1;
          return Excel.run(/*#__PURE__*/function () {
            var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(context) {
              var sheet, usedRange, nextRow, rowValues, startCell, endCell, range;
              return _regenerator().w(function (_context20) {
                while (1) switch (_context20.n) {
                  case 0:
                    sheet = context.workbook.worksheets.getActiveWorksheet();
                    usedRange = sheet.getUsedRangeOrNullObject();
                    usedRange.load("rowCount,isNullObject");
                    _context20.n = 1;
                    return context.sync();
                  case 1:
                    nextRow = usedRange.isNullObject ? 1 : usedRange.rowCount + 1; // 1-indexed
                    rowValues = headers.map(function (h) {
                      var _ref8, _ref9, _data$h;
                      var rawVal = (_ref8 = (_ref9 = (_data$h = data[h]) !== null && _data$h !== void 0 ? _data$h : data[h.toLowerCase()]) !== null && _ref9 !== void 0 ? _ref9 : data[Object.keys(data).find(function (k) {
                        return k.toLowerCase() === h.toLowerCase();
                      }) || ""]) !== null && _ref8 !== void 0 ? _ref8 : "";
                      var safeVal = rawVal === null ? "" : rawVal;
                      var val = _typeof(safeVal) === "object" && safeVal !== null ? Array.isArray(safeVal) ? safeVal.join(", ") : JSON.stringify(safeVal) : String(safeVal || "");
                      if (/^[=+\-@]/.test(val)) val = "'" + val;
                      if (val.length > 30000) val = val.substring(0, 30000) + "...";
                      return val;
                    });
                    startCell = "A".concat(nextRow);
                    endCell = "".concat(String.fromCharCode(64 + headers.length)).concat(nextRow);
                    range = sheet.getRange("".concat(startCell, ":").concat(endCell));
                    range.values = [rowValues];
                    range.format.wrapText = true;
                    // Subtle alternating row colour
                    range.format.fill.color = nextRow % 2 === 0 ? "#F4F5F7" : "#FFFFFF";
                    _context20.n = 2;
                    return context.sync();
                  case 2:
                    return _context20.a(2);
                }
              }, _callee19);
            }));
            return function (_x18) {
              return _ref7.apply(this, arguments);
            };
          }());
        case 1:
          return _context21.a(2);
      }
    }, _callee20);
  }));
  return _appendExcelRow.apply(this, arguments);
}
function batchLog(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "info";
  var log = document.getElementById("batch-log");
  if (!log) return;
  var entry = document.createElement("div");
  entry.className = "batch-log-entry ".concat(type);
  entry.textContent = "".concat(type === "success" ? "✓" : type === "error" ? "✗" : "•", " ").concat(message);
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

/**
 * Main batch PDF extraction orchestrator.
 * Reads instruction, parses fields, creates headers, loops through PDFs, extracts data, appends rows.
 */
function runBatchPDFExtraction() {
  return _runBatchPDFExtraction.apply(this, arguments);
}
function _runBatchPDFExtraction() {
  _runBatchPDFExtraction = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21() {
    var _instructionEl$value;
    var btn, btnText, progressWrap, progressBar, progressLabel, logEl, instructionEl, instruction, pdfsToProcess, fields, signal, successCount, errorCount, headers, i, file, pct, extracted, data, finalPct, msg, _t13, _t14;
    return _regenerator().w(function (_context22) {
      while (1) switch (_context22.p = _context22.n) {
        case 0:
          btn = document.getElementById("batch-extract-btn");
          btnText = document.getElementById("batch-btn-text");
          progressWrap = document.getElementById("batch-progress-wrap");
          progressBar = document.getElementById("batch-progress-bar");
          progressLabel = document.getElementById("batch-progress-label");
          logEl = document.getElementById("batch-log");
          instructionEl = document.getElementById("batch-instruction"); // Handle stop
          if (!batchAbortController) {
            _context22.n = 1;
            break;
          }
          batchAbortController.abort();
          batchAbortController = null;
          if (btnText) btnText.textContent = "Extract All PDFs";
          if (btn) btn.disabled = false;
          return _context22.a(2);
        case 1:
          instruction = (instructionEl === null || instructionEl === void 0 || (_instructionEl$value = instructionEl.value) === null || _instructionEl$value === void 0 ? void 0 : _instructionEl$value.trim()) || "These are documents. Extract Name, Email, Phone, Skills, and Experience.";
          pdfsToProcess = _toConsumableArray(rawPDFFiles); // snapshot
          if (!(pdfsToProcess.length === 0)) {
            _context22.n = 2;
            break;
          }
          showToast("error", "No PDFs attached. Please upload PDFs first.");
          return _context22.a(2);
        case 2:
          // Parse target fields
          fields = parseFieldsFromInstruction(instruction);
          if (!(fields.length === 0)) {
            _context22.n = 3;
            break;
          }
          showToast("error", "Could not detect fields to extract. Please be more specific.");
          return _context22.a(2);
        case 3:
          batchAbortController = new AbortController();
          signal = batchAbortController.signal; // Setup UI
          if (btn) {
            btn.disabled = false;
          }
          if (btnText) btnText.textContent = "⏹ Stop Extraction";
          if (progressWrap) progressWrap.style.display = "block";
          if (logEl) logEl.innerHTML = "";
          batchLog("Starting extraction of ".concat(pdfsToProcess.length, " PDF(s)\u2026"), "info");
          batchLog("Detected fields: ".concat(fields.join(", ")), "info");
          successCount = 0;
          errorCount = 0;
          headers = [];
          _context22.p = 4;
          _context22.n = 5;
          return ensureExcelHeaders(fields);
        case 5:
          headers = _context22.v;
          batchLog("Excel headers ready: ".concat(headers.join(", ")), "info");
          i = 0;
        case 6:
          if (!(i < pdfsToProcess.length)) {
            _context22.n = 17;
            break;
          }
          if (!signal.aborted) {
            _context22.n = 7;
            break;
          }
          return _context22.a(3, 17);
        case 7:
          file = pdfsToProcess[i];
          pct = Math.round(i / pdfsToProcess.length * 100);
          if (progressBar) progressBar.style.width = "".concat(pct, "%");
          if (progressLabel) progressLabel.textContent = "".concat(i, " / ").concat(pdfsToProcess.length);
          batchLog("[".concat(i + 1, "/").concat(pdfsToProcess.length, "] Processing: ").concat(file.name), "info");
          _context22.p = 8;
          _context22.n = 9;
          return (0,_services_pdfService__WEBPACK_IMPORTED_MODULE_6__.extractTextFromPDFFile)(file);
        case 9:
          extracted = _context22.v;
          if (!(!extracted.text || extracted.text.length < 20)) {
            _context22.n = 10;
            break;
          }
          throw new Error("PDF appears empty or unreadable");
        case 10:
          _context22.n = 11;
          return extractStructuredData(extracted.text, instruction, fields, signal);
        case 11:
          data = _context22.v;
          if (data) {
            _context22.n = 12;
            break;
          }
          throw new Error("LLM returned no data");
        case 12:
          _context22.n = 13;
          return appendExcelRow(headers, data);
        case 13:
          successCount++;
          batchLog("\u2713 ".concat(file.name, " \u2192 ").concat(Object.values(data).filter(function (v) {
            return v;
          }).length, "/").concat(fields.length, " fields extracted"), "success");
          _context22.n = 16;
          break;
        case 14:
          _context22.p = 14;
          _t13 = _context22.v;
          if (!(_t13.name === "AbortError")) {
            _context22.n = 15;
            break;
          }
          return _context22.a(3, 17);
        case 15:
          errorCount++;
          batchLog("\u2717 ".concat(file.name, ": ").concat(_t13.message), "error");
        case 16:
          i++;
          _context22.n = 6;
          break;
        case 17:
          _context22.n = 19;
          break;
        case 18:
          _context22.p = 18;
          _t14 = _context22.v;
          batchLog("Fatal error: ".concat(_t14.message), "error");
        case 19:
          _context22.p = 19;
          // Final UI update
          finalPct = Math.round(successCount / pdfsToProcess.length * 100);
          if (progressBar) progressBar.style.width = "100%";
          if (progressLabel) progressLabel.textContent = "".concat(pdfsToProcess.length, " / ").concat(pdfsToProcess.length);
          msg = "\u2705 Done! ".concat(successCount, " rows added").concat(errorCount > 0 ? ", ".concat(errorCount, " failed") : "", ".");
          batchLog(msg, successCount > 0 ? "success" : "error");
          showToast(successCount > 0 ? "success" : "error", msg);
          batchAbortController = null;
          if (btn) btn.disabled = false;
          if (btnText) btnText.textContent = "Extract All PDFs";
          return _context22.f(19);
        case 20:
          return _context22.a(2);
      }
    }, _callee21, null, [[8, 14], [4, 18, 19, 20]]);
  }));
  return _runBatchPDFExtraction.apply(this, arguments);
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