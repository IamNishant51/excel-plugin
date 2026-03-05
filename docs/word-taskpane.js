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
var WORD_CHAT_PROMPT = "You are DocOS AI \u2014 a friendly, expert Word document assistant in Planning Mode.\n\nYOUR ROLE:\n- Help users plan their document work\n- Explain Word concepts, formatting, and best practices\n- Suggest approaches before executing\n- Answer questions about document structure, writing, and design\n- Provide formatting tips and style guidance\n- When given document context, analyze the USER'S ACTUAL DOCUMENT and answer questions directly\n- Help with resume optimization, ATS compliance, and professional writing\n\nCONTEXT AWARENESS:\nWhen a message includes [DOCUMENT CONTEXT], you have access to the user's ACTUAL Word document!\n- Analyze the real content, headings, paragraphs, and structure\n- Give SPECIFIC answers based on their actual document content\n- Reference their exact headings and text in your response\n- Suggest improvements tailored to their document\n- Point out formatting issues, writing quality, and structural problems\n- You CAN see their document \u2014 do NOT say \"I don't have access to your document\"\n\nRESPONSE FORMAT RULES:\n1. Respond in natural, conversational language\n2. Use markdown-style formatting for emphasis: **bold**, *italic*, `code`\n3. Use bullet points and numbered lists for clarity\n4. Keep responses concise but thorough (aim for 2-5 paragraphs max)\n5. If the user's request requires MODIFYING the document, mention they can switch to \u26A1 Agent Mode\n6. When you have document context, ALWAYS reference the user's actual content\n\nDOCUMENT EXPERTISE AREAS:\n- Resume/CV optimization and ATS compliance\n- Professional writing and tone\n- Document formatting and styles\n- Letter writing (cover letters, business letters)\n- Report structure and organization \n- Academic formatting (APA, MLA, Chicago)\n- Grammar, punctuation, and style guidance\n- Content summarization and expansion\n- Meeting notes and minutes templates\n- Proofreading and editing strategies\n- Document accessibility best practices\n- Table of contents and navigation\n\nPERSONALITY:\n- Friendly and encouraging\n- Uses concrete examples when explaining\n- Proactive \u2014 suggest improvements the user might not have thought of\n- Mentions potential pitfalls or common mistakes to avoid\n\nIf the user asks you to MODIFY or EXECUTE something, remind them:\n\"\uD83D\uDCA1 Switch to \u26A1 Agent Mode to execute this! I can help you plan it here first.\"\n\nUser Message:\n";

/**
 * Prompt for generating contextual suggestions based on document content
 */
var WORD_CONTEXT_PROMPT = "You are DocOS AI. Based on the following Word document content, suggest 3-4 useful actions the user could take. Each suggestion should be a short phrase (5-8 words max). Format as a JSON array of strings. Example: [\"Make resume ATS-friendly\", \"Improve professional tone\", \"Add table of contents\"]. Only output the JSON array, nothing else.\n\nDocument Content:\n";

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
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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

var BANNED_PATTERNS = [
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
}];

// ═══════════════════════════════════════════════════════════════
// ALLOWED API WHITELIST — Only these Word JS API calls are safe
// ═══════════════════════════════════════════════════════════════

var ALLOWED_API_PATTERNS = [
// Core objects
/context\.document/, /context\.sync\(\)/, /body\./, /Word\./,
// Paragraph operations
/\.paragraphs/, /\.insertParagraph\(/, /\.insertText\(/, /\.insertBreak\(/, /\.insertHtml\(/, /\.insertOoxml\(/, /\.insertContentControl\(/, /\.insertTable\(/, /\.insertInlinePictureFromBase64\(/,
// Font & formatting
/\.font\./, /\.style/, /\.alignment/, /\.hyperlink/, /\.lineSpacing/, /\.spaceAfter/, /\.spaceBefore/, /\.firstLineIndent/, /\.leftIndent/, /\.rightIndent/,
// Range operations
/\.getRange\(\)/, /\.search\(/, /\.select\(/,
// Table operations
/\.tables/, /\.rows/, /\.cells/, /\.addRows\(/, /\.addColumns\(/, /\.getBorder\(/,
// Content controls
/\.contentControls/,
// Section & header/footer
/\.sections/, /\.getHeader\(/, /\.getFooter\(/,
// Load operations
/\.load\(/,
// Delete (clear is BANNED for safety)
/\.delete\(\)/,
// Lists
/\.listItem/, /\.startNewList\(/];

// ═══════════════════════════════════════════════════════════════
// CODE VALIDATOR
// ═══════════════════════════════════════════════════════════════

function validateWordCode(code) {
  var allowClear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var errors = [];
  var warnings = [];
  var apiCallsDetected = [];
  var sanitizedCode = code;

  // 1. Remove markdown fences
  sanitizedCode = sanitizedCode.replace(/^```(?:javascript|js|typescript|ts)?\n?/gi, "");
  sanitizedCode = sanitizedCode.replace(/\n?```$/gi, "");
  sanitizedCode = sanitizedCode.trim();

  // 2. Check for banned patterns
  var _iterator = _createForOfIteratorHelper(BANNED_PATTERNS),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var banned = _step.value;
      // Skip body.clear() ban if allowClear is true (templates only)
      if (allowClear && banned.pattern.source.includes("body\\.clear")) {
        continue;
      }
      var matches = sanitizedCode.match(banned.pattern);
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
      suggestion: "Add 'await context.sync();' after .load() calls"
    });
  }

  // 4. Check for basic syntax errors
  try {
    new Function("context", "body", "Word", "return (async () => { ".concat(sanitizedCode, " })();"));
  } catch (syntaxError) {
    errors.push({
      type: "syntax",
      message: syntaxError.message,
      suggestion: "Check for missing brackets, semicolons, or typos"
    });
  }

  // 5. Detect API calls
  var _iterator2 = _createForOfIteratorHelper(ALLOWED_API_PATTERNS),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var pattern = _step2.value;
      var match = sanitizedCode.match(pattern);
      if (match) {
        apiCallsDetected.push(match[0]);
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
      message: "eval() is not allowed",
      suggestion: "Remove eval() call"
    });
  }

  // 7. Auto-fix body redeclarations
  sanitizedCode = sanitizedCode.replace(/(?:const|let|var)\s+body\s*=\s*context\.document\.body\s*;?/g, "// body already available");
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

var PLANNER_PROMPT = "You are a Word document automation planning expert. Analyze the user's request and create a brief execution plan.\n\nOUTPUT FORMAT (JSON only, no markdown):\n{\n  \"understanding\": \"One sentence summary of what user wants\",\n  \"steps\": [\"Step 1\", \"Step 2\", \"Step 3\"],\n  \"dataNeeded\": [\"What data needs to be read from document\"],\n  \"expectedOutput\": \"What the document should look like after\",\n  \"complexity\": \"simple|moderate|complex\",\n  \"warnings\": [\"Any potential issues or edge cases\"]\n}\n\nRULES:\n- Keep steps actionable and specific to Word document operations\n- Identify if document content needs to be read first\n- Flag complexity based on operations needed\n- Note any ambiguities in the request";
function createWordPlan(_x, _x2, _x3) {
  return _createWordPlan.apply(this, arguments);
}

// ═══════════════════════════════════════════════════════════════
// CODER — Generates validated Word JavaScript code
// ═══════════════════════════════════════════════════════════════
function _createWordPlan() {
  _createWordPlan = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(task, docContext, signal) {
    var contextInfo, messages, response, jsonMatch, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          contextInfo = "";
          if (docContext && docContext.hasContent) {
            contextInfo = "\n\nCURRENT DOCUMENT CONTEXT:\n- Paragraphs: ".concat(docContext.paragraphCount, "\n- Word Count: ~").concat(docContext.wordCount, "\n- Headings: ").concat(docContext.headings.join(", ") || "None", "\n- Content preview: \"").concat(docContext.sampleText.substring(0, 200), "...\"");
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
            expectedOutput: "Modified document",
            complexity: "moderate",
            warnings: []
          });
      }
    }, _callee, null, [[2, 4]]);
  }));
  return _createWordPlan.apply(this, arguments);
}
var CODER_SYSTEM_PROMPT = "You are a Word JavaScript API expert. Generate ONLY executable code.\n\nENVIRONMENT (pre-declared, DO NOT redeclare):\n- context: Word.RequestContext\n- body: context.document.body (already loaded)\n- Word: Namespace for enums (Word.InsertLocation, Word.Alignment, etc.)\n\nABSOLUTE RULE: NEVER use body.clear(). It DESTROYS all user content. FORBIDDEN.\n\nCRITICAL API RULES:\n1. Properties require .load() + await context.sync() before reading\n2. Writing text: body.insertParagraph(\"text\", Word.InsertLocation.end)\n3. Reading: paragraph.load(\"text,style,font\"); await context.sync();\n4. Font: paragraph.font.bold = true, paragraph.font.size = 14, paragraph.font.color = \"#000000\"\n5. Alignment: paragraph.alignment = Word.Alignment.centered\n6. Styles: DO NOT use 'Heading 1' for resumes (adds huge gaps). Use font.size=12, font.bold=true instead.\n7. Tables: body.insertTable(rows, cols, Word.InsertLocation.end, [[\"cell1\",\"cell2\"]])\n8. Search & Replace: body.search(\"old\").load(\"items\"); await context.sync(); then loop items\n9. Hyperlinks: items[0].hyperlink = \"https://\" + url.trim(); (\uD83D\uDEA8 MUST trim spaces AND start with http:// or crashes)\n10. Line spacing: paragraph.lineSpacing = 12 (compact single spacing)\n11. Space after: paragraph.spaceAfter = 2 (for tight body text)\n\nBANNED (will crash or destroy data):\n- body.clear() \u2192 DESTROYS ALL CONTENT. NEVER USE.\n- .addText() \u2192 Hallucinated method. Use insertText().\n- Excel.*, sheet.*, .getUsedRange(), .getCell() \u2192 Excel API, NOT Word\n- SpreadsheetApp, DocumentApp \u2192 Google Apps Script\n- alert(), confirm(), prompt() \u2192 Blocked in add-ins\n- const context = ... \u2192 Already declared\n- const body = ... \u2192 Already declared\n- \"Heading1\" \u2192 Wrong. Use \"Heading 1\" (with space)\n\nSAFE REFORMAT PATTERN (use for ATS/formatting/cleanup):\n// Load existing paragraphs\nconst paragraphs = body.paragraphs;\nparagraphs.load(\"items/text,items/style,items/font\");\nawait context.sync();\n\n// Modify each paragraph IN-PLACE (never clear/delete!)\nfor (let i = 0; i < paragraphs.items.length; i++) {\n  const p = paragraphs.items[i];\n  const text = p.text.trim();\n  \n  if (i === 0 && text.length > 0) {\n    p.font.size = 18; // Preserve large name\n    p.font.bold = true;\n  } else if (text.length > 0 && text.length < 50 && text === text.toUpperCase()) {\n    p.font.size = 12; // Section Headings\n    p.font.bold = true;\n    p.spaceBefore = 12;\n    p.spaceAfter = 4;\n  } else {\n    p.font.name = \"Calibri\";\n    p.font.size = 10.5; // Compact body\n    p.font.color = \"#000000\";\n    p.lineSpacing = 12; // True single\n    p.spaceAfter = 2; // Tight gap\n  }\n}\nawait context.sync();\n\nCONTENT PRESERVATION RULES:\n- When reformatting: Read paragraphs \u2192 modify font/style/spacing \u2192 sync. NEVER delete content.\n- When making ATS-friendly: Change fonts, apply heading styles, fix spacing. Keep all text.\n- Only use body.insertParagraph() to ADD new content, not to replace existing.\n- To add content at the end: Word.InsertLocation.end\n- To add content at the start: Word.InsertLocation.start\n\nOUTPUT: Raw JavaScript code only. No markdown, no explanation.";
function generateWordCode(_x4, _x5, _x6, _x7, _x8, _x9) {
  return _generateWordCode.apply(this, arguments);
}

// ═══════════════════════════════════════════════════════════════
// FIXER — Repairs code based on validation or runtime errors
// ═══════════════════════════════════════════════════════════════
function _generateWordCode() {
  _generateWordCode = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(task, plan, docContext, attachedFiles, previousError, signal) {
    var prompt, i, _i, messages, contentParts, code, firstNewline;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          prompt = task;
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
          if (docContext && docContext.hasContent) {
            prompt += '\n\nDOCUMENT DATA (EXISTING CONTENT — DO NOT DELETE THIS):\n';
            prompt += '- Paragraphs: ' + docContext.paragraphCount + '\n';
            prompt += '- Word Count: ~' + docContext.wordCount + '\n';
            prompt += '- Headings: ' + JSON.stringify(docContext.headings) + '\n';
            if (docContext.selectedText) {
              prompt += '- USER HIGHLIGHTED TEXT: "' + docContext.selectedText + '"\n';
            }
            prompt += '- Full text: "' + docContext.sampleText + '"\n';
            prompt += '\n⚠️ PRESERVE ALL EXISTING CONTENT. Modify paragraphs in-place. NEVER use body.clear().\n';
          }
          if (previousError) {
            prompt += '\n\nPREVIOUS ERROR: "' + previousError + '"\nFIX THIS ERROR. Output only corrected code.';
          }
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
          // Clean up markdown fences
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
  return _generateWordCode.apply(this, arguments);
}
var FIXER_SYSTEM_PROMPT = "You are a Word JavaScript API debugger. Fix the broken code.\n\nCOMMON FIXES:\n1. Excel.* \u2192 Use Word.* namespace instead\n2. sheet.* \u2192 Use body.* (Word document body)\n3. .getUsedRange() \u2192 Use body.paragraphs or body.search()\n4. const body = ... \u2192 REMOVE (already declared)\n5. SpreadsheetApp \u2192 Use Word JS API\n6. range.values = [[]] \u2192 Use body.insertParagraph() or insertTable()\n7. body.clear() \u2192 REMOVE THIS. Never clear the document. Modify paragraphs individually.\n8. InvalidArgument \u2192 Check: style names need quotes (\"Heading 1\"), InsertLocation must be Word.InsertLocation.end/start/replace, table data dimensions must match row/col counts\n9. InvalidArgument on hyperlink \u2192 ALWAYS trim spaces and add \"https://\" before the url. e.g., range.hyperlink = \"https://\" + url.trim();\n10. paragraph.style = \"Heading1\" \u2192 Use \"Heading 1\" (with space)\n11. Properties not loaded \u2192 Add .load(\"text,style,font\") + await context.sync() before reading\nCRITICAL: NEVER use body.clear(). Modify existing paragraphs in-place.\n\nOUTPUT: Fixed code only. No explanation, no markdown fences.";
function fixWordCode(_x0, _x1, _x10, _x11) {
  return _fixWordCode.apply(this, arguments);
}

// ═══════════════════════════════════════════════════════════════
// ORCHESTRATOR — Main agent loop
// ═══════════════════════════════════════════════════════════════
function _fixWordCode() {
  _fixWordCode = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(originalCode, errors, runtimeError, signal) {
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
          fixedCode = fixedCode.replace(/^```(?:javascript|js|typescript|ts)?\n?/gi, "");
          fixedCode = fixedCode.replace(/\n?```$/gi, "");
          return _context3.a(2, fixedCode.trim());
      }
    }, _callee3);
  }));
  return _fixWordCode.apply(this, arguments);
}
var DEFAULT_CONFIG = {
  maxRetries: 3,
  enablePlanning: true,
  strictValidation: true,
  timeout: 30000
};
function runWordAgent(_x12, _x13, _x14) {
  return _runWordAgent.apply(this, arguments);
}

// ═══════════════════════════════════════════════════════════════
// EXECUTE WITH RECOVERY
// ═══════════════════════════════════════════════════════════════
function _runWordAgent() {
  _runWordAgent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(task, docContext, attachedFiles) {
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
          return createWordPlan(task, docContext, signal);
        case 3:
          plan = _context4.v;
          console.log("[WordAgent] Plan created:", plan);
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
          console.warn("[WordAgent] Planning failed:", _t2);
        case 6:
          _context4.n = 7;
          return generateWordCode(task, plan, docContext, attachedFiles, undefined, signal);
        case 7:
          code = _context4.v;
          console.log("[WordAgent] Initial code generated");

          // ═══ PHASE 3: VALIDATION LOOP ═══
          attempt = 0;
        case 8:
          if (!(attempt <= cfg.maxRetries)) {
            _context4.n = 12;
            break;
          }
          validation = validateWordCode(code);
          if (!validation.isValid) {
            _context4.n = 9;
            break;
          }
          console.log("[WordAgent] Code validated on attempt ".concat(attempt + 1));
          return _context4.a(3, 12);
        case 9:
          if (!(attempt < cfg.maxRetries)) {
            _context4.n = 11;
            break;
          }
          console.log("[WordAgent] Validation failed (attempt ".concat(attempt + 1, "), fixing..."));
          _context4.n = 10;
          return fixWordCode(code, validation.errors, undefined, signal);
        case 10:
          code = _context4.v;
          retries++;
        case 11:
          attempt++;
          _context4.n = 8;
          break;
        case 12:
          // Final validation
          validation = validateWordCode(code);
          if (!(!validation.isValid && cfg.strictValidation)) {
            _context4.n = 13;
            break;
          }
          throw new Error("Code validation failed: ".concat(validation.errors.map(function (e) {
            return e.message;
          }).join("; ")));
        case 13:
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
  return _runWordAgent.apply(this, arguments);
}
function executeWordWithRecovery(_x15, _x16) {
  return _executeWordWithRecovery.apply(this, arguments);
}

// ═══════════════════════════════════════════════════════════════
// UTILITY: Read current document context
// ═══════════════════════════════════════════════════════════════
function _executeWordWithRecovery() {
  _executeWordWithRecovery = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(code, executor) {
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
          console.warn("[WordAgent] Execution failed (attempt ".concat(attempt + 1, "):"), lastError);
          if (!(attempt < maxRetries)) {
            _context5.n = 8;
            break;
          }
          _context5.n = 5;
          return fixWordCode(currentCode, [], lastError, signal);
        case 5:
          currentCode = _context5.v;
          validation = validateWordCode(currentCode);
          if (!validation.isValid) {
            _context5.n = 6;
            break;
          }
          currentCode = validation.sanitizedCode;
          _context5.n = 8;
          break;
        case 6:
          _context5.n = 7;
          return fixWordCode(currentCode, validation.errors, undefined, signal);
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
  return _executeWordWithRecovery.apply(this, arguments);
}
function readDocumentContext() {
  return _readDocumentContext.apply(this, arguments);
}
function _readDocumentContext() {
  _readDocumentContext = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    var _t5;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _context7.p = 0;
          _context7.n = 1;
          return Word.run(/*#__PURE__*/function () {
            var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(context) {
              var body, paragraphs, allText, wordCount, headings, contentTypes, i, p, tables, selection;
              return _regenerator().w(function (_context6) {
                while (1) switch (_context6.n) {
                  case 0:
                    body = context.document.body;
                    body.load("text");
                    paragraphs = body.paragraphs;
                    paragraphs.load("items/text,items/style");
                    _context6.n = 1;
                    return context.sync();
                  case 1:
                    allText = body.text || "";
                    wordCount = allText.split(/\s+/).filter(function (w) {
                      return w.length > 0;
                    }).length; // Extract headings
                    headings = [];
                    contentTypes = new Set();
                    contentTypes.add("text");
                    for (i = 0; i < paragraphs.items.length; i++) {
                      p = paragraphs.items[i];
                      if (p.style && (p.style.includes("Heading") || p.style.includes("heading"))) {
                        headings.push(p.text.trim());
                      }
                    }

                    // Check for tables
                    tables = body.tables;
                    tables.load("count");

                    // Get selected text
                    selection = context.document.getSelection();
                    selection.load("text");
                    _context6.n = 2;
                    return context.sync();
                  case 2:
                    if (tables.count > 0) {
                      contentTypes.add("table");
                    }
                    return _context6.a(2, {
                      documentTitle: headings.length > 0 ? headings[0] : "Untitled",
                      paragraphCount: paragraphs.items.length,
                      wordCount: wordCount,
                      sampleText: allText.substring(0, 3000),
                      headings: headings,
                      hasContent: allText.trim().length > 0,
                      contentTypes: Array.from(contentTypes),
                      selectedText: selection.text ? selection.text.trim() : ""
                    });
                }
              }, _callee6);
            }));
            return function (_x17) {
              return _ref.apply(this, arguments);
            };
          }());
        case 1:
          return _context7.a(2, _context7.v);
        case 2:
          _context7.p = 2;
          _t5 = _context7.v;
          console.error("Failed to read document context:", _t5);
          return _context7.a(2, null);
      }
    }, _callee7, null, [[0, 2]]);
  }));
  return _readDocumentContext.apply(this, arguments);
}

/***/ }),

/***/ "./src/word-taskpane/taskpane.ts":
/*!***************************************!*\
  !*** ./src/word-taskpane/taskpane.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _taskpane_taskpane_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../taskpane/taskpane.css */ "./src/taskpane/taskpane.css");
/* harmony import */ var _services_llm_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/llm.service */ "./src/services/llm.service.ts");
/* harmony import */ var _services_word_chat_prompt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/word-chat-prompt */ "./src/services/word-chat-prompt.ts");
/* harmony import */ var _services_cache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/cache */ "./src/services/cache.ts");
/* harmony import */ var _services_word_orchestrator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/word-orchestrator */ "./src/services/word-orchestrator.ts");
/* harmony import */ var _services_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/icons */ "./src/services/icons.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/* global console, Word, document, window, Office */







// ─── Types ─────────────────────────────────────────────────────

// ─── State ─────────────────────────────────────────────────────
var currentMode = "planning";
var currentCategory = "resume";
var chatHistory = [];
var chatConversation = [];
var isChatBusy = false;
var attachedFiles = [];
var chatAbortController = null;
var agentAbortController = null;

// ─── Quick Actions by Category ─────────────────────────────────
var WORD_ACTIONS = {
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
    prompt: "DO NOT use body.clear(). Read the document to understand the background. Insert a 'Professional Summary' heading and 3-4 sentence summary paragraph at the START of the document (using Word.InsertLocation.start). Set the heading style to 'Heading 1'. Use industry-relevant keywords."
  }, {
    icon: "barChart",
    label: "Quantify Achievements",
    prompt: "DO NOT use body.clear(). Read all paragraphs. At the END of the document, insert a section with 'Heading 1' title 'Suggested Metrics'. For each work experience bullet that lacks numbers, insert a paragraph suggesting how to add quantified achievements. Example: 'Line: Managed team → Suggestion: Managed team of [X] members'."
  }],
  // ── Writing Tools ──
  writing: [{
    icon: "brain",
    label: "Improve Writing ✍️",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Use body.search() to find and replace weak phrases with stronger alternatives. For example, search for passive voice patterns and replace with active voice. Use insertText with Word.InsertLocation.replace for each match. Preserve all original meaning."
  }, {
    icon: "sortAsc",
    label: "Make Formal",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Use body.search() to find casual words/phrases and replace them with formal equivalents. Examples: 'got' → 'received', 'a lot' → 'significantly', 'things' → 'elements'. Use insertText with Word.InsertLocation.replace."
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
    prompt: "DO NOT use body.clear(). Read all paragraphs. Insert an 'Executive Summary' heading at the START (Word.InsertLocation.start) followed by 3-5 sentence summary paragraphs. Set heading style to 'Heading 1'. Do not modify existing content."
  }, {
    icon: "copy",
    label: "Add Bullet Points",
    prompt: "DO NOT use body.clear(). Read paragraphs. Identify long paragraphs (text.length > 200) that contain lists of items. After each such paragraph, insert bullet-point style paragraphs breaking down the key points. Use startNewList() for bullet formatting."
  }, {
    icon: "hash",
    label: "Add Headings",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Every 3-5 paragraphs where a topic change is detected, insert a new paragraph BEFORE the topic change with style='Heading 2'. Use descriptive heading text based on the content that follows."
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
    prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Force EVERYTHING to font.name='Calibri' or 'Arial', font.color='#000000'. First line font.size=18. Headings font.size=12. Body font.size=10.5. Fix spacing to lineSpacing=12, spaceAfter=2. Sync."
  }, {
    icon: "table",
    label: "Format Tables",
    prompt: "DO NOT use body.clear(). Load body.tables, tables.load('items'). For each table: set table.styleBuiltIn = Word.BuiltInStyleName.gridTable5Dark_Accent1. Then table.autoFitWindow(). Then await context.sync()."
  }, {
    icon: "snowflake",
    label: "Add Header/Footer",
    prompt: "DO NOT use body.clear(). Load context.document.sections, sections.load('items'), await context.sync(). Get header via sections.items[0].getHeader(Word.HeaderFooterType.primary). Insert a paragraph 'Document' with font.size=9, font.color='#888888', alignment=Word.Alignment.right. Then await context.sync()."
  }, {
    icon: "hash",
    label: "Number Headings",
    prompt: "DO NOT use body.clear(). Load all paragraphs with styles. For each paragraph whose style includes 'Heading', prepend a number using search and replace. Use a counter to add '1. ', '2. ', etc. to Heading 1 paragraphs, and '1.1. ', '1.2. ' for Heading 2."
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
    prompt: "DO NOT use body.clear(). Use body.search() to find and replace: double spaces → single space, triple dots → ellipsis, straight quotes. For each search, load items, sync, then loop and use insertText with Word.InsertLocation.replace."
  }, {
    icon: "eraser",
    label: "Remove Empty Lines",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Loop through and identify paragraphs where text.trim() === ''. Delete consecutive empty paragraphs but keep at most one between content sections using paragraph.delete()."
  }, {
    icon: "eraser",
    label: "Fix Bullets",
    prompt: "DO NOT use body.clear(). Load all paragraphs. Identify paragraphs that start with '- ', '* ', '• '. Standardize them: use search to find the bullet character and replace with '• '. Ensure consistent font and spacing on all bullet paragraphs."
  }],
  // ── Templates (these are the ONLY prompts that may clear the document) ──
  templates: [{
    icon: "fileTemplate",
    label: "Modern Resume",
    prompt: "First clear the document with body.clear(), await context.sync(). Then create a resume template: Insert '[Your Name]' paragraph with font.size=18, font.bold=true, alignment=Word.Alignment.centered. Insert '[email] | [phone] | [city, state]' centered. Then insert section headings using style='Heading 1': 'Professional Summary', 'Work Experience', 'Education', 'Skills'. Under each heading, insert placeholder paragraphs with font.name='Calibri', font.size=11. Finish with await context.sync()."
  }, {
    icon: "fileTemplate",
    label: "Cover Letter",
    prompt: "First clear the document with body.clear(), await context.sync(). Then create a cover letter: Insert today's date, blank line, '[Hiring Manager Name]', '[Company Name]', '[Address]'. Then 'Dear [Hiring Manager]:'. Three body paragraphs. 'Sincerely,' and '[Your Name]'. All in Calibri 11pt with lineSpacing=15. Finish with await context.sync()."
  }, {
    icon: "fileTemplate",
    label: "Business Letter",
    prompt: "First clear the document with body.clear(), await context.sync(). Then create: Sender info (right-aligned), date, recipient info (left-aligned), subject line bold, salutation, body (3 paragraphs), closing. All Calibri 11pt. Finish with await context.sync()."
  }, {
    icon: "fileTemplate",
    label: "Meeting Notes",
    prompt: "First clear the document with body.clear(), await context.sync(). Then create: 'Meeting Notes' in style='Heading 1'. Date/Time line. 'Attendees' heading with bullet list. 'Agenda' heading with numbered items. 'Action Items' heading with a table (columns: Action, Owner, Due Date). All in Calibri. Finish with await context.sync()."
  }, {
    icon: "fileTemplate",
    label: "Project Proposal",
    prompt: "First clear the document with body.clear(), await context.sync(). Then create sections with style='Heading 1': Executive Summary, Problem Statement, Proposed Solution, Scope, Timeline (insert a table), Budget (insert a table), Team, Conclusion. Add placeholder text under each. Calibri formatting. Finish with await context.sync()."
  }, {
    icon: "fileTemplate",
    label: "Report Template",
    prompt: "First clear the document with body.clear(), await context.sync(). Then create: Title page (large centered title), sections with style='Heading 1': Executive Summary, Introduction, Methodology, Findings, Analysis, Recommendations, Conclusion, References. Add placeholder text. Calibri, lineSpacing=28 (double-spaced). Finish with await context.sync()."
  }],
  // ── Smart Tools ──
  smart: [{
    icon: "brain",
    label: "Document Analyzer 🔬",
    prompt: "DO NOT use body.clear(). Read all paragraphs with body.paragraphs.load('items/text,items/style'). Calculate word count, paragraph count, estimated reading time (250 WPM). At the END, insert an 'Analysis Report' section with these stats as formatted paragraphs. Use insertParagraph with Word.InsertLocation.end."
  }, {
    icon: "trendUp",
    label: "Readability Score",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Analyze average sentence length and word complexity. At the END, insert a 'Readability Report' section with findings. Use insertParagraph with Word.InsertLocation.end."
  }, {
    icon: "search",
    label: "Extract Key Points",
    prompt: "DO NOT use body.clear(). Read all paragraphs. At the START of the document, insert 'Key Takeaways' heading (style='Heading 1') followed by numbered key points extracted from the content. Use insertParagraph with Word.InsertLocation.start."
  }, {
    icon: "copy",
    label: "Compare Sections",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Identify sections by headings. At the END, insert a comparison table using body.insertTable() showing: Section Name, Approximate Word Count, Number of Paragraphs. Use Word.InsertLocation.end."
  }, {
    icon: "shield",
    label: "Consistency Check",
    prompt: "DO NOT use body.clear(). Read all paragraphs. At the END, insert a 'Consistency Report' section listing any found issues: inconsistent formatting, mixed fonts, spacing problems. Use insertParagraph with Word.InsertLocation.end."
  }, {
    icon: "mail",
    label: "Extract Contacts",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Search for email addresses (contains @), phone numbers, URLs. At the END, insert a 'Contact Information' table using body.insertTable() with columns: Type, Value. Use Word.InsertLocation.end."
  }, {
    icon: "layers",
    label: "Create TOC",
    prompt: "DO NOT use body.clear(). Read all paragraphs and identify those with 'Heading' in their style. At the START of the document, insert 'Table of Contents' (style='Heading 1') followed by a paragraph listing each heading found. Use Word.InsertLocation.start."
  }, {
    icon: "dollarSign",
    label: "Word Count Stats",
    prompt: "DO NOT use body.clear(). Read all paragraphs. Count total words, unique words (approximate), paragraphs. At the END, insert a stats table using body.insertTable() with this data. Use Word.InsertLocation.end."
  }]
};

// Chat Suggestions
var WORD_CHAT_SUGGESTIONS = [{
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
  var statusEl = document.getElementById("loading-status");
  if (statusEl) {
    statusEl.innerHTML += "<br><span style=\"color:#d32f2f;font-weight:bold;font-size:11px;\">".concat(msg, " (Line ").concat(line, ")</span>");
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
  }
  return false;
};
Office.onReady(function (info) {
  var sideloadMsg = document.getElementById("sideload-msg");
  var appBody = document.getElementById("app-body");
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

  // Category Tabs
  document.querySelectorAll(".category-tab").forEach(function (tab) {
    tab.onclick = function () {
      var cat = tab.dataset.category;
      switchCategory(cat);
    };
  });

  // Initial UI
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
  el("settings-toggle", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.settings);
  el("docs-toggle", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.helpCircle);
  el("run-icon", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.arrowRight);
  el("chevron-icon", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.chevronDown);
  el("refresh-models", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.refresh);
  el("mode-planning-icon", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.messageCircle);
  el("mode-agent-icon", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.zap);
  el("chat-send-icon", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.send);
  el("chat-clear-icon", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.trash);
}
function injectDocIcons() {
  document.querySelectorAll(".doc-icon[data-icon]").forEach(function (el) {
    var key = el.getAttribute("data-icon");
    if (_services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons[key]) el.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons[key];
  });
}
function injectCategoryIcons() {
  document.querySelectorAll(".cat-icon[data-icon]").forEach(function (el) {
    var key = el.getAttribute("data-icon");
    if (_services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons[key]) el.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons[key];
  });
}

// ─── Mode Switching ────────────────────────────────────────────
function switchMode(mode) {
  if (mode === currentMode) return;
  currentMode = mode;
  document.querySelectorAll(".mode-tab").forEach(function (tab) {
    tab.classList.toggle("active", tab.dataset.mode === mode);
  });
  var indicator = document.getElementById("mode-indicator");
  if (mode === "agent") {
    indicator.classList.add("right");
  } else {
    indicator.classList.remove("right");
  }
  document.getElementById("planning-mode").classList.toggle("active", mode === "planning");
  document.getElementById("agent-mode").classList.toggle("active", mode === "agent");
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
  buildQuickActions();
}

// ─── Quick Actions ────────────────────────────────────────────
function buildQuickActions() {
  var container = document.getElementById("quick-actions");
  if (!container) return;
  container.innerHTML = "";
  var actions = WORD_ACTIONS[currentCategory];
  if (!actions) return;
  actions.forEach(function (action) {
    var chip = document.createElement("button");
    chip.className = "chip";
    var iconKey = action.icon;
    chip.innerHTML = "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons[iconKey] || "", "<span>").concat(action.label, "</span>");
    chip.onclick = function () {
      var input = document.getElementById("prompt-input");
      if (input) {
        input.value = action.prompt;
        input.focus();
        var statusEl = document.getElementById("status-message");
        if (statusEl) statusEl.style.display = "none";
      }
    };
    container.appendChild(chip);
  });
}

// ─── Chat Suggestions ────────────────────────────────────────
function buildChatSuggestions() {
  var container = document.getElementById("chat-suggestions");
  if (!container) return;
  WORD_CHAT_SUGGESTIONS.forEach(function (s) {
    var btn = document.createElement("button");
    btn.className = "suggestion-chip";
    var iconKey = s.icon;
    btn.innerHTML = "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons[iconKey] || "").concat(s.text);
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
  var setVal = function setVal(id, val) {
    var el = document.getElementById(id);
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
  var getVal = function getVal(id) {
    var _document$getElementB2;
    return ((_document$getElementB2 = document.getElementById(id)) === null || _document$getElementB2 === void 0 || (_document$getElementB2 = _document$getElementB2.value) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.trim()) || "";
  };
  var newConfig = _objectSpread(_objectSpread({}, current), {}, {
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
    baseUrl: getVal("setting-base-url") ? "".concat(getVal("setting-base-url").replace(/\/v1.*$/, ""), "/v1/chat/completions") : undefined,
    localModel: getVal("setting-local-model") || current.localModel
  });
  (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.saveConfig)(newConfig);
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
  input.addEventListener("input", function () {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 80) + "px";
  });
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
    var input, message, welcome, initialPrompt, docCtx, needsDocContext, _docCtx, lastBubble, badge, skeletonEl, chatSendButton, chatSendIcon, response, formattedResponse, newBubble, _error$message, sendIcon, _t, _t2, _t3;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          if (!isChatBusy) {
            _context2.n = 1;
            break;
          }
          if (chatAbortController) chatAbortController.abort();
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
          welcome = document.querySelector(".chat-welcome");
          if (welcome) welcome.remove();
          addChatBubble("user", message);
          chatHistory.push({
            role: "user",
            content: message,
            timestamp: Date.now()
          });

          // Build conversation context
          if (!(chatConversation.length === 0)) {
            _context2.n = 8;
            break;
          }
          initialPrompt = _services_word_chat_prompt__WEBPACK_IMPORTED_MODULE_2__.WORD_CHAT_PROMPT;
          _context2.p = 4;
          _context2.n = 5;
          return (0,_services_word_orchestrator__WEBPACK_IMPORTED_MODULE_4__.readDocumentContext)();
        case 5:
          docCtx = _context2.v;
          if (docCtx && docCtx.hasContent) {
            initialPrompt += "\n\n[INITIAL DOCUMENT OVERVIEW]\n";
            initialPrompt += "Document: \"".concat(docCtx.documentTitle, "\"\n");
            initialPrompt += "Paragraphs: ".concat(docCtx.paragraphCount, ", Words: ~").concat(docCtx.wordCount, "\n");
            initialPrompt += "Headings: ".concat(docCtx.headings.join(", ") || "None", "\n");
            initialPrompt += "Content preview: \"".concat(docCtx.sampleText.substring(0, 500), "\"");
          }
          _context2.n = 7;
          break;
        case 6:
          _context2.p = 6;
          _t = _context2.v;
          console.warn("Could not load document overview:", _t);
        case 7:
          chatConversation.push({
            role: "system",
            content: initialPrompt
          });
        case 8:
          // Context awareness for document queries
          needsDocContext = /\b(this|my|current|opened?)\s+(doc|document|resume|letter|word|file|text)\b|\b(find|search|check|improve|fix|format|analyze|review|proofread|summarize)\b/i.test(message);
          if (!needsDocContext) {
            _context2.n = 12;
            break;
          }
          _context2.p = 9;
          _context2.n = 10;
          return (0,_services_word_orchestrator__WEBPACK_IMPORTED_MODULE_4__.readDocumentContext)();
        case 10:
          _docCtx = _context2.v;
          if (_docCtx && _docCtx.hasContent) {
            chatConversation.push({
              role: "system",
              content: "[DOCUMENT CONTEXT]\nTitle: \"".concat(_docCtx.documentTitle, "\"\nParagraphs: ").concat(_docCtx.paragraphCount, "\nWord count: ~").concat(_docCtx.wordCount, "\nHeadings: ").concat(_docCtx.headings.join(", ") || "None", "\nContent:\n\"").concat(_docCtx.sampleText, "\"")
            });
            lastBubble = document.querySelector('.chat-msg.user:last-child .chat-bubble');
            if (lastBubble) {
              badge = document.createElement('span');
              badge.className = 'context-badge';
              badge.innerHTML = '📄 Document context loaded';
              lastBubble.appendChild(badge);
            }
          }
          _context2.n = 12;
          break;
        case 11:
          _context2.p = 11;
          _t2 = _context2.v;
          console.warn('Could not load document context:', _t2);
        case 12:
          chatConversation.push({
            role: "user",
            content: message
          });
          input.value = "";
          input.style.height = "auto";
          skeletonEl = showTypingIndicator();
          isChatBusy = true;
          chatSendButton = document.getElementById("chat-send");
          chatSendIcon = document.getElementById("chat-send-icon");
          if (chatSendButton) {
            if (chatSendIcon) chatSendIcon.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.stop;
            chatSendButton.classList.add("is-busy");
          }
          chatAbortController = new AbortController();
          _context2.p = 13;
          _context2.n = 14;
          return (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_1__.callLLM)(chatConversation, undefined, chatAbortController.signal);
        case 14:
          response = _context2.v;
          formattedResponse = formatChatResponse(response);
          if (skeletonEl) {
            newBubble = createChatBubble("ai", formattedResponse, response);
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
          _context2.n = 16;
          break;
        case 15:
          _context2.p = 15;
          _t3 = _context2.v;
          if (skeletonEl) skeletonEl.remove();
          if (_t3.name === 'AbortError') {
            addChatBubble("ai", "<p style=\"color:var(--text-3)\"><i>Generation stopped.</i></p>");
          } else {
            addChatBubble("ai", "<p style=\"color:var(--error)\">\u26A0\uFE0F ".concat(_t3.message, "</p>"));
            showToast("error", ((_error$message = _t3.message) === null || _error$message === void 0 ? void 0 : _error$message.substring(0, 80)) || "Something went wrong");
          }
        case 16:
          _context2.p = 16;
          isChatBusy = false;
          chatAbortController = null;
          if (chatSendButton) {
            sendIcon = document.getElementById("chat-send-icon");
            if (sendIcon) sendIcon.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.send;
            chatSendButton.classList.remove("is-busy");
          }
          return _context2.f(16);
        case 17:
          return _context2.a(2);
      }
    }, _callee2, null, [[13, 15, 16, 17], [9, 11], [4, 6]]);
  }));
  return _sendChatMessage.apply(this, arguments);
}
function clearChat() {
  var container = document.getElementById("chat-messages");
  if (container) {
    container.innerHTML = "\n      <div class=\"chat-welcome\">\n        <img src=\"../../assets/icon-80-v2.png\" alt=\"DocOS Logo\" style=\"width: 64px; height: 64px; margin-bottom: 16px;\">\n        <h2>What are you working on?</h2>\n        <div class=\"welcome-suggestions\" id=\"chat-suggestions\"></div>\n      </div>";
    buildChatSuggestions();
  }
  chatHistory.length = 0;
  chatConversation = [];
}

// ─── Chat UI Helpers ──────────────────────────────────────────

function createChatBubble(role, htmlContent, rawContent) {
  var msgDiv = document.createElement("div");
  msgDiv.className = "chat-msg ".concat(role);
  var bubbleDiv = document.createElement("div");
  bubbleDiv.className = "chat-bubble";
  bubbleDiv.innerHTML = htmlContent;
  if (role === "ai" && rawContent) {
    var actionsDiv = document.createElement("div");
    actionsDiv.className = "chat-bubble-actions";
    var copyBtn = document.createElement("button");
    copyBtn.className = "btn-copy";
    copyBtn.innerHTML = "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.copy, " Copy");
    copyBtn.onclick = function () {
      navigator.clipboard.writeText(rawContent).then(function () {
        copyBtn.innerHTML = "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.check, " Copied");
        copyBtn.classList.add("copied");
        setTimeout(function () {
          copyBtn.innerHTML = "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.copy, " Copy");
          copyBtn.classList.remove("copied");
        }, 2000);
      });
    };
    actionsDiv.appendChild(copyBtn);
    var execBtn = document.createElement("button");
    execBtn.className = "btn-execute-from-chat";
    execBtn.innerHTML = "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.zap, " Switch to Agent");
    execBtn.onclick = function () {
      var agentPromptInput = document.getElementById("prompt-input");
      if (agentPromptInput) {
        agentPromptInput.value = rawContent.substring(0, 500);
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
  container.scrollTop = container.scrollHeight;
  return msgDiv;
}
function showTypingIndicator() {
  var template = document.getElementById("chat-skeleton-template");
  if (!template) return null;
  var container = document.getElementById("chat-messages");
  if (!container) return null;
  var skeleton = template.content.cloneNode(true);
  var skeletonDiv = skeleton.querySelector(".chat-msg");
  container.appendChild(skeleton);
  container.scrollTop = container.scrollHeight;
  return skeletonDiv || container.lastElementChild;
}
function formatChatResponse(text) {
  var html = text;
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
  var scrollBtn = document.getElementById("scroll-to-bottom");
  var chatContainer = document.getElementById("chat-messages");
  if (!scrollBtn || !chatContainer) return;
  chatContainer.addEventListener("scroll", function () {
    var isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 100;
    scrollBtn.classList.toggle("visible", !isNearBottom);
  });
  scrollBtn.onclick = function () {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };
}

// ═══════════════════════════════════════════════════════════════
// AGENT MODE — Word Execution
// ═══════════════════════════════════════════════════════════════

function setupAgentKeyboardShortcut() {
  var input = document.getElementById("prompt-input");
  if (!input) return;
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      runWordAICommand();
    }
  });
}
function runWordAICommand() {
  return _runWordAICommand.apply(this, arguments);
} // ─── Status & Toast ──────────────────────────────────────────
function _runWordAICommand() {
  _runWordAICommand = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var statusEl, debugEl, skeletonEl, cacheBadge, promptInput, button, userPrompt, signal, runText, runIcon, originalText, originalIcon, code, fromCache, docContext, _docContext, cached, validation, wordAttachedFiles, result, executionResult, _executionResult$erro, _error$message2, _t4, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          statusEl = document.getElementById("status-message");
          debugEl = document.getElementById("debug-code");
          skeletonEl = document.getElementById("skeleton");
          cacheBadge = document.getElementById("cache-badge");
          promptInput = document.getElementById("prompt-input");
          button = document.getElementById("run");
          if (!(!statusEl || !debugEl || !skeletonEl || !cacheBadge || !promptInput || !button)) {
            _context5.n = 1;
            break;
          }
          console.error("Agent UI elements not found");
          return _context5.a(2);
        case 1:
          userPrompt = promptInput.value.trim();
          if (!(!userPrompt && attachedFiles.length === 0)) {
            _context5.n = 2;
            break;
          }
          showStatus(statusEl, "info", "Please enter a command.");
          return _context5.a(2);
        case 2:
          if (!userPrompt && attachedFiles.length > 0) {
            userPrompt = "Analyze the attached file and extract relevant content into the document.";
          }

          // Cancel if already running
          if (!agentAbortController) {
            _context5.n = 3;
            break;
          }
          agentAbortController.abort();
          return _context5.a(2);
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
          if (runIcon) runIcon.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.stop;
          statusEl.style.display = "none";
          skeletonEl.style.display = "flex";
          cacheBadge.style.display = "none";
          debugEl.innerText = "";
          _context5.p = 4;
          fromCache = false; // Read document context
          docContext = null;
          _context5.p = 5;
          _context5.n = 6;
          return (0,_services_word_orchestrator__WEBPACK_IMPORTED_MODULE_4__.readDocumentContext)();
        case 6:
          docContext = _context5.v;
          if ((_docContext = docContext) !== null && _docContext !== void 0 && _docContext.hasContent) {
            console.log("[WordAgent] Document context: ".concat(docContext.paragraphCount, " paragraphs, ~").concat(docContext.wordCount, " words"));
          }
          _context5.n = 8;
          break;
        case 7:
          _context5.p = 7;
          _t4 = _context5.v;
          console.warn("[WordAgent] Could not read document context:", _t4);
        case 8:
          // Check cache
          cached = (0,_services_cache__WEBPACK_IMPORTED_MODULE_3__.getCachedResponse)(userPrompt);
          if (cached) {
            code = cached;
            fromCache = true;
            cacheBadge.style.display = "inline-block";
            validation = (0,_services_word_orchestrator__WEBPACK_IMPORTED_MODULE_4__.validateWordCode)(code);
            if (!validation.isValid) {
              fromCache = false;
              code = "";
            } else {
              code = validation.sanitizedCode;
            }
          }

          // Generate code if not cached
          if (fromCache) {
            _context5.n = 11;
            break;
          }
          if (runText) runText.innerText = "Generating...";
          wordAttachedFiles = attachedFiles.map(function (f) {
            return {
              name: f.name,
              type: f.type,
              data: f.data
            };
          });
          _context5.n = 9;
          return (0,_services_word_orchestrator__WEBPACK_IMPORTED_MODULE_4__.runWordAgent)(userPrompt, docContext, wordAttachedFiles, {
            enablePlanning: true,
            strictValidation: true
          }, signal);
        case 9:
          result = _context5.v;
          if (result.success) {
            _context5.n = 10;
            break;
          }
          throw new Error(result.error || "Code generation failed");
        case 10:
          code = result.code;
          if (!fromCache) {
            (0,_services_cache__WEBPACK_IMPORTED_MODULE_3__.cacheResponse)(userPrompt, code);
          }
        case 11:
          skeletonEl.style.display = "none";
          debugEl.innerText = code;
          if (runText) runText.innerText = "Executing...";

          // Execute the code in Word
          // @ts-ignore
          _context5.n = 12;
          return (0,_services_word_orchestrator__WEBPACK_IMPORTED_MODULE_4__.executeWordWithRecovery)(code, /*#__PURE__*/function () {
            var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(codeToRun) {
              return _regenerator().w(function (_context4) {
                while (1) switch (_context4.n) {
                  case 0:
                    _context4.n = 1;
                    return Word.run(/*#__PURE__*/function () {
                      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(ctx) {
                        var wordBody, executeFn;
                        return _regenerator().w(function (_context3) {
                          while (1) switch (_context3.n) {
                            case 0:
                              wordBody = ctx.document.body;
                              executeFn = new Function("context", "body", "Word", "return (async () => { ".concat(codeToRun, " })();")); // @ts-ignore
                              _context3.n = 1;
                              return executeFn(ctx, wordBody, Word);
                            case 1:
                              _context3.n = 2;
                              return ctx.sync();
                            case 2:
                              return _context3.a(2);
                          }
                        }, _callee3);
                      }));
                      return function (_x2) {
                        return _ref2.apply(this, arguments);
                      };
                    }());
                  case 1:
                    return _context4.a(2);
                }
              }, _callee4);
            }));
            return function (_x) {
              return _ref.apply(this, arguments);
            };
          }(), 2, signal);
        case 12:
          executionResult = _context5.v;
          if (executionResult.success) {
            showStatus(statusEl, "success", "✅ Done! Document updated successfully.");
            showToast("success", "Document updated!");
          } else {
            showStatus(statusEl, "error", "\u274C Error: ".concat(executionResult.error));
            showToast("error", ((_executionResult$erro = executionResult.error) === null || _executionResult$erro === void 0 ? void 0 : _executionResult$erro.substring(0, 80)) || "Execution failed");
          }
          _context5.n = 14;
          break;
        case 13:
          _context5.p = 13;
          _t5 = _context5.v;
          skeletonEl.style.display = "none";
          if (_t5.name === 'AbortError') {
            showStatus(statusEl, "info", "⏹ Agent stopped.");
          } else {
            showStatus(statusEl, "error", "\u274C ".concat(_t5.message));
            showToast("error", ((_error$message2 = _t5.message) === null || _error$message2 === void 0 ? void 0 : _error$message2.substring(0, 80)) || "Something went wrong");
          }
        case 14:
          _context5.p = 14;
          agentAbortController = null;
          button.classList.remove("is-busy");
          button.classList.remove("btn-stop");
          if (runText) runText.innerText = originalText;
          if (runIcon) runIcon.innerHTML = originalIcon;
          return _context5.f(14);
        case 15:
          return _context5.a(2);
      }
    }, _callee5, null, [[5, 7], [4, 13, 14, 15]]);
  }));
  return _runWordAICommand.apply(this, arguments);
}
function showStatus(el, type, message) {
  el.style.display = "flex";
  el.className = "status-pill status-".concat(type);
  el.innerHTML = message;
}
function showToast(type, message) {
  var container = document.getElementById("toast-container");
  if (!container) return;
  var toast = document.createElement("div");
  toast.className = "toast toast-".concat(type);
  toast.innerHTML = "\n    <span class=\"toast-icon\">".concat(type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️", "</span>\n    <span class=\"toast-text\">").concat(message, "</span>\n  ");
  container.appendChild(toast);
  setTimeout(function () {
    toast.classList.add("toast-exit");
    setTimeout(function () {
      return toast.remove();
    }, 300);
  }, 3000);
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
var code = "<!DOCTYPE html>\r\n<html>\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\" />\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\" />\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r\n    <title>DocOS AI</title>\r\n    <" + "script type=\"text/javascript\" src=\"https://appsforoffice.microsoft.com/lib/1/hosted/office.js\"><" + "/script>\r\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\r\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\r\n    <link\r\n        href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap\"\r\n        rel=\"stylesheet\">\r\n</head>\r\n\r\n<body>\r\n    <main id=\"app-body\" style=\"display: none;\">\r\n        <header class=\"app-header\">\r\n            <div class=\"brand\">\r\n                <h1>DocOS <span class=\"highlight-text\">AI</span></h1>\r\n            </div>\r\n            <div class=\"header-actions\">\r\n                <button id=\"docs-toggle\" class=\"btn-icon\" title=\"What can I do?\"></button>\r\n                <button id=\"settings-toggle\" class=\"btn-icon\" title=\"Settings\"></button>\r\n            </div>\r\n        </header>\r\n\r\n        <!-- Docs Panel -->\r\n        <div id=\"docs-panel\" class=\"panel\" style=\"display: none;\">\r\n            <h3>What can DocOS AI do?</h3>\r\n            <div class=\"docs-grid\">\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"fileText\"></span>\r\n                    <div><strong>ATS Resume Optimizer</strong>\r\n                        <p>Make your resume ATS-friendly with clean formatting, proper keywords, and standard sections</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"paintbrush\"></span>\r\n                    <div><strong>Professional Formatting</strong>\r\n                        <p>Apply consistent fonts, headings, spacing, and styles to your entire document</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"eraser\"></span>\r\n                    <div><strong>Document Cleanup</strong>\r\n                        <p>Remove extra spaces, fix formatting issues, standardize styles</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"search\"></span>\r\n                    <div><strong>Find & Replace</strong>\r\n                        <p>Smart search and replace with pattern matching across your document</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"table\"></span>\r\n                    <div><strong>Tables & Lists</strong>\r\n                        <p>Create formatted tables, bullet lists, and numbered lists</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"fileTemplate\"></span>\r\n                    <div><strong>Templates</strong>\r\n                        <p>Generate resumes, cover letters, business letters, meeting notes</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"brain\"></span>\r\n                    <div><strong>AI Writing Assistant</strong>\r\n                        <p>Improve writing, change tone, summarize, expand content</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"checkSquare\"></span>\r\n                    <div><strong>Proofreading</strong>\r\n                        <p>Check grammar, spelling, punctuation, and style consistency</p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <p class=\"docs-hint\">Just describe what you need in plain English — DocOS handles the rest.</p>\r\n        </div>\r\n\r\n        <!-- Settings Panel -->\r\n        <div id=\"settings-panel\" class=\"panel\" style=\"display: none;\">\r\n            <h3>AI Provider</h3>\r\n\r\n            <div class=\"form-group\">\r\n                <label for=\"setting-provider\">Provider</label>\r\n                <select id=\"setting-provider\" class=\"form-input\">\r\n                    <option value=\"groq\">Groq (Llama)</option>\r\n                    <option value=\"gemini\">Google Gemini</option>\r\n                    <option value=\"openai\">OpenAI (GPT-4)</option>\r\n                    <option value=\"anthropic\">Anthropic (Claude)</option>\r\n                    <option value=\"openrouter\">OpenRouter</option>\r\n                    <option value=\"local\">Ollama (Local)</option>\r\n                </select>\r\n            </div>\r\n\r\n            <!-- Groq Fields -->\r\n            <div id=\"groq-fields\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-api-key\">Groq API Key</label>\r\n                    <input id=\"setting-api-key\" type=\"password\" class=\"form-input\" placeholder=\"gsk_...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-groq-model\">Model</label>\r\n                    <select id=\"setting-groq-model\" class=\"form-input\">\r\n                        <option value=\"llama-3.1-8b-instant\" selected>Llama 3.1 8B — Fast</option>\r\n                        <option value=\"llama-3.3-70b-versatile\">Llama 3.3 70B — Smart</option>\r\n                        <option value=\"gemma2-9b-it\">Gemma 2 9B</option>\r\n                        <option value=\"mixtral-8x7b-32768\">Mixtral 8x7B</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Gemini Fields -->\r\n            <div id=\"gemini-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-gemini-key\">Gemini API Key</label>\r\n                    <input id=\"setting-gemini-key\" type=\"password\" class=\"form-input\" placeholder=\"AIzaSy...\" />\r\n                    <div style=\"font-size:10px; color:var(--text-3); margin-top:4px\">Get free key at <a\r\n                            href=\"https://aistudio.google.com/app/apikey\" target=\"_blank\">aistudio.google.com</a></div>\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-gemini-model\">Model</label>\r\n                    <select id=\"setting-gemini-model\" class=\"form-input\">\r\n                        <option value=\"gemini-1.5-flash\" selected>Gemini 1.5 Flash</option>\r\n                        <option value=\"gemini-1.5-flash-001\">Gemini 1.5 Flash-001</option>\r\n                        <option value=\"gemini-1.5-pro\">Gemini 1.5 Pro</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- OpenAI Fields -->\r\n            <div id=\"openai-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openai-key\">OpenAI API Key</label>\r\n                    <input id=\"setting-openai-key\" type=\"password\" class=\"form-input\" placeholder=\"sk-...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openai-model\">Model</label>\r\n                    <select id=\"setting-openai-model\" class=\"form-input\">\r\n                        <option value=\"gpt-4o-mini\" selected>GPT-4o Mini</option>\r\n                        <option value=\"gpt-4o\">GPT-4o</option>\r\n                        <option value=\"gpt-3.5-turbo\">GPT-3.5 Turbo</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Anthropic Fields -->\r\n            <div id=\"anthropic-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-anthropic-key\">Anthropic API Key</label>\r\n                    <input id=\"setting-anthropic-key\" type=\"password\" class=\"form-input\" placeholder=\"sk-ant-...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-anthropic-model\">Model</label>\r\n                    <select id=\"setting-anthropic-model\" class=\"form-input\">\r\n                        <option value=\"claude-3-5-sonnet-20241022\" selected>Claude 3.5 Sonnet</option>\r\n                        <option value=\"claude-3-5-haiku-20241022\">Claude 3.5 Haiku</option>\r\n                        <option value=\"claude-3-opus-20240229\">Claude 3 Opus</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- OpenRouter Fields -->\r\n            <div id=\"openrouter-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openrouter-key\">OpenRouter API Key</label>\r\n                    <input id=\"setting-openrouter-key\" type=\"password\" class=\"form-input\"\r\n                        placeholder=\"sk-or-v1-...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openrouter-model\">Model</label>\r\n                    <select id=\"setting-openrouter-model\" class=\"form-input\">\r\n                        <option value=\"anthropic/claude-3.5-sonnet:beta\" selected>Claude 3.5 Sonnet</option>\r\n                        <option value=\"google/gemini-2.5-pro\">Gemini 2.5 Pro</option>\r\n                        <option value=\"openai/gpt-4o\">GPT-4o</option>\r\n                        <option value=\"meta-llama/llama-3.3-70b-instruct\">Llama 3.3 70B</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Local Fields -->\r\n            <div id=\"local-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-base-url\">Ollama Host</label>\r\n                    <input id=\"setting-base-url\" type=\"text\" class=\"form-input\"\r\n                        placeholder=\"http://localhost:11434\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label>Model</label>\r\n                    <div class=\"model-select-wrapper\">\r\n                        <select id=\"setting-local-model\" class=\"form-input\">\r\n                            <option value=\"\" disabled selected>Click refresh →</option>\r\n                        </select>\r\n                        <button id=\"refresh-models\" class=\"btn-icon btn-refresh\" title=\"Refresh models\"></button>\r\n                    </div>\r\n                    <div id=\"model-status\" class=\"model-status\"></div>\r\n                </div>\r\n            </div>\r\n\r\n            <button id=\"save-settings\" class=\"btn-primary btn-save\">Save</button>\r\n        </div>\r\n\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <!-- MODE TOGGLE -->\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <div class=\"mode-toggle\">\r\n            <button id=\"mode-planning\" class=\"mode-tab active\" data-mode=\"planning\">\r\n                <span id=\"mode-planning-icon\"></span>\r\n                <span>Planning</span>\r\n            </button>\r\n            <button id=\"mode-agent\" class=\"mode-tab\" data-mode=\"agent\">\r\n                <span id=\"mode-agent-icon\"></span>\r\n                <span>Agent</span>\r\n            </button>\r\n            <div class=\"mode-indicator\" id=\"mode-indicator\"></div>\r\n        </div>\r\n\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <!-- PLANNING MODE (Chat) -->\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <div id=\"planning-mode\" class=\"mode-content active\">\r\n            <!-- Chat Messages Area -->\r\n            <div style=\"position: relative; flex: 1; display: flex; flex-direction: column; overflow: hidden;\">\r\n                <div id=\"chat-messages\" class=\"chat-messages\">\r\n                    <!-- Welcome message -->\r\n                    <div class=\"chat-welcome\">\r\n                        <img src=\"" + ___HTML_LOADER_IMPORT_0___ + "\" alt=\"DocOS Logo\"\r\n                            style=\"width: 64px; height: 64px; margin-bottom: 16px;\">\r\n                        <h2>What are you working on?</h2>\r\n                        <div class=\"welcome-suggestions\" id=\"chat-suggestions\">\r\n                            <!-- Dynamically populated -->\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <button id=\"scroll-to-bottom\" class=\"scroll-to-bottom\" title=\"Scroll to bottom\">\r\n                    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"\r\n                        stroke-linecap=\"round\" stroke-linejoin=\"round\">\r\n                        <polyline points=\"6 9 12 15 18 9\" />\r\n                    </svg>\r\n                </button>\r\n            </div>\r\n\r\n            <!-- Chat Input -->\r\n            <div class=\"chat-input-area\">\r\n                <div id=\"file-preview-list\" class=\"file-preview-list\"></div>\r\n\r\n                <div class=\"chat-input-card\">\r\n                    <input type=\"file\" id=\"file-input\" accept=\"image/png, image/jpeg, application/pdf\" multiple\r\n                        style=\"display: none;\" />\r\n                    <button id=\"file-upload-btn\" class=\"btn-clip\" title=\"Attach Images or PDFs\">\r\n                        <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n                            stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\r\n                            <path\r\n                                d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\">\r\n                            </path>\r\n                        </svg>\r\n                    </button>\r\n                    <textarea id=\"chat-input\" placeholder=\"Ask about your document or upload a file...\" rows=\"1\"\r\n                        spellcheck=\"false\"></textarea>\r\n                    <button id=\"chat-send\" class=\"btn-send\" title=\"Send message\">\r\n                        <span id=\"chat-send-icon\"></span>\r\n                    </button>\r\n                </div>\r\n                <div class=\"chat-footer\">\r\n                    <button id=\"chat-clear\" class=\"btn-text\" title=\"Clear conversation\">\r\n                        <span id=\"chat-clear-icon\"></span>\r\n                        <span>Clear</span>\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <!-- AGENT MODE (Execute) -->\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <div id=\"agent-mode\" class=\"mode-content\">\r\n            <div class=\"content-wrapper\">\r\n                <!-- Input Card -->\r\n                <div class=\"input-card\">\r\n                    <textarea id=\"prompt-input\" placeholder=\"Describe what you want to do with your document...\"\r\n                        spellcheck=\"false\"></textarea>\r\n\r\n                    <!-- File Preview (Agent Mode) -->\r\n                    <div id=\"agent-file-preview-list\" class=\"file-preview-list\"></div>\r\n\r\n                    <div class=\"card-footer\">\r\n                        <div class=\"footer-left\">\r\n                            <input type=\"file\" id=\"agent-file-input\" accept=\"image/png, image/jpeg, application/pdf\"\r\n                                multiple style=\"display: none;\" />\r\n                            <button id=\"agent-file-btn\" class=\"btn-clip\" title=\"Attach files\">\r\n                                <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n                                    stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\r\n                                    <path\r\n                                        d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\">\r\n                                    </path>\r\n                                </svg>\r\n                            </button>\r\n                            <span id=\"cache-badge\" class=\"cache-badge\" style=\"display:none;\">⚡ cached</span>\r\n                        </div>\r\n                        <span class=\"kbd-hint\">Ctrl+↵</span>\r\n                        <button id=\"run\" class=\"btn-primary\">\r\n                            <span id=\"run-text\">Execute</span>\r\n                            <span id=\"run-icon\"></span>\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- Scrollable content area -->\r\n                <div class=\"agent-scroll-area\">\r\n                    <!-- Category Tabs for Quick Actions -->\r\n                    <div class=\"action-categories\" id=\"action-categories\">\r\n                        <button class=\"category-tab active\" data-category=\"resume\">\r\n                            <span class=\"cat-icon\" data-icon=\"fileText\"></span>\r\n                            <span>Resume</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"writing\">\r\n                            <span class=\"cat-icon\" data-icon=\"brain\"></span>\r\n                            <span>Writing</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"format\">\r\n                            <span class=\"cat-icon\" data-icon=\"palette\"></span>\r\n                            <span>Format</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"cleanup\">\r\n                            <span class=\"cat-icon\" data-icon=\"broom\"></span>\r\n                            <span>Cleanup</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"templates\">\r\n                            <span class=\"cat-icon\" data-icon=\"fileTemplate\"></span>\r\n                            <span>Templates</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"smart\">\r\n                            <span class=\"cat-icon\" data-icon=\"brain\"></span>\r\n                            <span>Smart Tools</span>\r\n                        </button>\r\n                    </div>\r\n\r\n                    <!-- Quick Actions -->\r\n                    <div id=\"quick-actions\" class=\"quick-actions\"></div>\r\n\r\n                    <!-- Skeleton -->\r\n                    <div id=\"skeleton\" class=\"skeleton-container\" style=\"display: none;\">\r\n                        <div class=\"skeleton-pill\"></div>\r\n                        <div class=\"skeleton-line w80\"></div>\r\n                        <div class=\"skeleton-line w60\"></div>\r\n                    </div>\r\n\r\n                    <!-- Status Message -->\r\n                    <div id=\"status-message\" class=\"status-pill\"></div>\r\n\r\n                    <!-- Debug -->\r\n                    <div id=\"debug-section\">\r\n                        <details>\r\n                            <summary>\r\n                                <span id=\"chevron-icon\"></span>\r\n                                <span>Generated Code</span>\r\n                            </summary>\r\n                            <pre id=\"debug-code\"></pre>\r\n                        </details>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Toast Notification Container -->\r\n        <div id=\"toast-container\" class=\"toast-container\"></div>\r\n    </main>\r\n\r\n    <section id=\"sideload-msg\" class=\"sideload-container\">\r\n        <div class=\"sideload-skeleton\">\r\n            <div class=\"sk-header\">\r\n                <div class=\"sk-brand\">\r\n                    <div class=\"sk-logo sk-shimmer\"></div>\r\n                    <div class=\"sk-title sk-shimmer\"></div>\r\n                </div>\r\n                <div class=\"sk-header-actions\">\r\n                    <div class=\"sk-icon-btn sk-shimmer\"></div>\r\n                    <div class=\"sk-icon-btn sk-shimmer\"></div>\r\n                </div>\r\n            </div>\r\n            <div style=\"padding: 0 16px;\">\r\n                <div class=\"sk-mode-toggle\">\r\n                    <div class=\"sk-mode-tab sk-shimmer\"></div>\r\n                    <div class=\"sk-mode-tab sk-shimmer\"></div>\r\n                </div>\r\n            </div>\r\n            <div class=\"sk-welcome\">\r\n                <div class=\"sk-welcome-icon sk-shimmer\"></div>\r\n                <div class=\"sk-welcome-title sk-shimmer\"></div>\r\n                <div class=\"sk-welcome-desc sk-shimmer\"></div>\r\n                <div class=\"sk-welcome-desc short sk-shimmer\"></div>\r\n            </div>\r\n            <div class=\"sk-suggestions\">\r\n                <div class=\"sk-suggestion sk-shimmer\"></div>\r\n                <div class=\"sk-suggestion sk-shimmer\"></div>\r\n                <div class=\"sk-suggestion sk-shimmer\"></div>\r\n            </div>\r\n            <div class=\"sk-input-area\">\r\n                <div style=\"padding: 0 16px;\">\r\n                    <div class=\"sk-input sk-shimmer\"></div>\r\n                </div>\r\n            </div>\r\n            <div class=\"sideload-status\">\r\n                <div class=\"sideload-pulse\"></div>\r\n                <span id=\"loading-status\">Initializing DocOS AI...</span>\r\n            </div>\r\n        </div>\r\n    </section>\r\n\r\n    <template id=\"chat-skeleton-template\">\r\n        <div class=\"chat-msg ai skeleton-msg\">\r\n            <div class=\"chat-bubble skeleton-bubble\">\r\n                <div class=\"skeleton-line w80 sk-shimmer\"></div>\r\n                <div class=\"skeleton-line w60 sk-shimmer\"></div>\r\n                <div class=\"skeleton-line w40 sk-shimmer\"></div>\r\n            </div>\r\n        </div>\r\n    </template>\r\n\r\n    <!-- Fallback Script -->\r\n    <" + "script>\r\n        setTimeout(function () {\r\n            var app = document.getElementById(\"app-body\");\r\n            var fb = document.getElementById(\"debug-fallback\");\r\n            if ((!app || app.style.display === \"none\") && fb) {\r\n                fb.style.display = \"block\";\r\n            }\r\n        }, 30000);\r\n    <" + "/script>\r\n</body>\r\n\r\n</html>\r\n";
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