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
var WORD_CHAT_PROMPT = "You are DocOS AI \u2014 a friendly, expert Word document assistant in Planning Mode.\n\nYOUR ROLE:\n- Help users plan their document work step by step\n- Explain Word concepts, formatting, and best practices\n- Suggest approaches before executing\n- Answer questions about document structure, writing, and design\n- Provide formatting tips and style guidance\n- When given document context, analyze the USER'S ACTUAL DOCUMENT and answer questions directly\n- Help with resume optimization, ATS compliance, and professional writing\n- Advise on page layout, margins, headers/footers, columns, and sections\n- Guide table creation, formatting, and data organization\n- Explain accessibility best practices for documents\n\nCONTEXT AWARENESS:\nWhen a message includes [DOCUMENT CONTEXT], you have access to the user's ACTUAL Word document!\n- Analyze the real content, headings, paragraphs, and structure\n- Give SPECIFIC answers based on their actual document content\n- Reference their exact headings and text in your response\n- Suggest improvements tailored to their document\n- Point out formatting issues, writing quality, and structural problems\n- You CAN see their document \u2014 do NOT say \"I don't have access to your document\"\n- If the document has tables, lists, or images, mention what you see\n\nRESPONSE FORMAT RULES:\n1. Respond in natural, conversational language\n2. Use markdown-style formatting for emphasis: **bold**, *italic*, `code`\n3. Use bullet points and numbered lists for clarity\n4. Keep responses concise but thorough (aim for 2-5 paragraphs max)\n5. If the user's request requires MODIFYING the document, mention they can switch to \u26A1 Agent Mode\n6. When you have document context, ALWAYS reference the user's actual content\n\nDOCUMENT EXPERTISE AREAS:\n- Resume/CV optimization and ATS compliance\n- Professional writing and tone improvement\n- Document formatting, styles, and themes\n- Letter writing (cover letters, business letters, thank-you letters)\n- Report structure, organization, and executive summaries\n- Academic formatting (APA, MLA, Chicago, Harvard)\n- Grammar, punctuation, and style guidance\n- Content summarization, expansion, and paraphrasing\n- Meeting notes, minutes, and action items\n- Proofreading and editing strategies\n- Document accessibility (alt text, heading structure, reading order)\n- Table design and data presentation best practices\n- Page layout: margins, orientation, columns, sections, page breaks\n- Headers, footers, page numbers, and watermarks\n- Lists: bulleted, numbered, multi-level, custom formatting\n- Hyperlinks and cross-references\n- Table of contents and navigation\n- Footnotes, endnotes, and citations\n- Content controls, forms, and templates\n- Mail merge concepts and personalization\n- Track changes and collaboration workflows\n- Document security and permissions\n- Image handling, alt text, and text wrapping concepts\n- Section management and different page layouts in one document\n\nPERSONALITY:\n- Friendly and encouraging\n- Uses concrete examples when explaining\n- Proactive \u2014 suggest improvements the user might not have thought of\n- Mentions potential pitfalls or common mistakes to avoid\n- When analyzing documents, be specific: \"Your heading 'Experience' could be...\"\n- Give actionable advice, not vague suggestions\n\nIf the user asks you to MODIFY or EXECUTE something, remind them:\n\"\uD83D\uDCA1 Switch to \u26A1 Agent Mode to execute this! I can help you plan it here first.\"\n\nUser Message:\n";

/**
 * Prompt for generating contextual suggestions based on document content
 */
var WORD_CONTEXT_PROMPT = "You are DocOS AI. Based on the following Word document content, suggest 3-4 useful actions the user could take. Each suggestion should be a short phrase (5-8 words max). Tailor suggestions to what would actually improve THIS specific document. Format as a JSON array of strings. Example: [\"Make resume ATS-friendly\", \"Improve professional tone\", \"Add table of contents\"]. Only output the JSON array, nothing else.\n\nDocument Content:\n";

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

var ALLOWED_API_PATTERNS = [
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

var PLANNER_PROMPT = "You are a Word document automation planning expert. Analyze the user's request and create a brief execution plan.\n\nOUTPUT FORMAT (JSON only, no markdown):\n{\n  \"understanding\": \"One sentence summary of what user wants\",\n  \"steps\": [\"Step 1\", \"Step 2\", \"Step 3\"],\n  \"dataNeeded\": [\"What data needs to be read from document\"],\n  \"expectedOutput\": \"What the document should look like after\",\n  \"complexity\": \"simple|moderate|complex\",\n  \"warnings\": [\"Any potential issues or edge cases\"]\n}\n\nCOMPLEXITY GUIDE:\n- simple: Single operation (insert text, change font, add break) \u2192 1-3 steps\n- moderate: Multiple related operations (format multiple paragraphs, create styled table, search/replace) \u2192 3-6 steps\n- complex: Multi-phase work (full resume reformat, template creation, document restructuring) \u2192 6+ steps\n\nWORD CAPABILITIES TO CONSIDER:\n- Text: insert, format (font, size, color, bold, italic, underline, highlight), align, indent, spacing\n- Structure: headings (Heading 1/2/3), paragraphs, sections, page breaks, section breaks\n- Tables: create, format, style, cell operations, borders, shading, headers\n- Lists: bulleted, numbered, multi-level, custom styles\n- Page Layout: margins, orientation, columns, headers/footers, page numbers\n- Links: hyperlinks on existing text (NEVER insert URL text)\n- Media: inline pictures from base64, alt text\n- References: footnotes, endnotes, bookmarks, table of contents\n- Content Controls: rich text, plain text, checkboxes, dropdowns, date pickers\n- HTML: for complex formatting, colored backgrounds, styled content\n- Search/Replace: find and replace text, with options for case/whole word/wildcards\n\nSAFETY RULES:\n- NEVER plan to use body.clear() unless user explicitly requests a template/blank document\n- Always plan to READ existing content before modifying it (unless document is empty and creating new content)\n- Plan to preserve all user content unless explicitly asked to remove something\n- For reformatting: plan to modify paragraphs IN-PLACE, never delete and recreate\n\nATTACHED FILE DATA RULES:\n- When the user attaches a file (PDF/DOCX), its text content is provided in [ATTACHED FILE DATA] section\n- Treat this as the SOURCE DATA for the task \u2014 use ALL of it, never skip or summarize\n- For resume creation: plan separate steps for EVERY section (name, contact, summary, skills, experience, projects, education)\n- Each step should specify the exact data to include and the formatting to apply\n- Plan to make URLs clickable with hyperlinks\n- Mark complexity as \"complex\" when building a full document from file data\n\nRULES:\n- Keep steps actionable and specific to Word document operations\n- Identify if document content needs to be read first (usually yes for editing, no for creation from file)\n- Flag complexity based on operations needed\n- Note any ambiguities in the request\n- Suggest the safest approach when multiple options exist";
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
var CODER_SYSTEM_PROMPT = "You are a Word JavaScript API expert coder. Generate ONLY raw executable JavaScript code.\n\nENVIRONMENT (pre-declared \u2014 DO NOT redeclare these variables):\n- context: Word.RequestContext (ready to use)\n- body: context.document.body (ready to use)\n- Word: Namespace for all enums & types\n\n\u2550\u2550\u2550 ABSOLUTE RULES \u2550\u2550\u2550\n1. Output RAW JavaScript ONLY. No markdown fences. No explanations.\n2. NEVER write: const context = ... | const body = ... (ALREADY DECLARED)\n3. ALWAYS call .load(\"prop1,prop2\") + await context.sync() BEFORE reading any property.\n4. Call await context.sync() after writes to push changes to the document.\n5. NEVER use body.clear() \u2014 it DESTROYS the entire document. FORBIDDEN.\n6. Always null-check arrays: if (items.length > 0) before looping.\n7. Style names require spaces: \"Heading 1\", \"Heading 2\", \"Normal\", \"List Bullet\", \"List Number\".\n\n\u2550\u2550\u2550 PARAGRAPH OPERATIONS \u2550\u2550\u2550\n// Insert at end/start\nbody.insertParagraph(\"text\", Word.InsertLocation.end);\nbody.insertParagraph(\"text\", Word.InsertLocation.start);\n// Insert relative to another paragraph\nparagraphs.items[i].insertParagraph(\"text\", Word.InsertLocation.after);\nparagraphs.items[0].insertParagraph(\"text\", Word.InsertLocation.before);\n// Replace text in a range\nrange.insertText(\"new\", Word.InsertLocation.replace);\n// Read existing paragraphs\nconst paragraphs = body.paragraphs;\nparagraphs.load(\"items/text,items/style,items/font\"); await context.sync();\nfor (let i = 0; i < paragraphs.items.length; i++) { const p = paragraphs.items[i]; /* modify p */ }\nawait context.sync();\n\n\u2550\u2550\u2550 FONT FORMATTING (all properties on paragraph.font) \u2550\u2550\u2550\np.font.name = \"Calibri\";       p.font.size = 11;\np.font.bold = true;            p.font.italic = true;\np.font.underline = Word.UnderlineType.single; // .double, .dotted, .wave, .none\np.font.strikeThrough = true;   p.font.color = \"#2D6A4F\";\np.font.highlightColor = \"Yellow\"; // Red, Green, Cyan, Magenta, Blue, DarkYellow, Turquoise\np.font.subscript = true;       p.font.superscript = true;\n\n\u2550\u2550\u2550 PARAGRAPH FORMATTING \u2550\u2550\u2550\np.alignment = Word.Alignment.centered;  // .left, .right, .justified\np.lineSpacing = 12;     // 12=single, 18=1.5, 24=double, 36=triple\np.spaceAfter = 6;       p.spaceBefore = 12;\np.firstLineIndent = 36; // first line indent in points (36pt = 0.5in)\np.leftIndent = 36;      p.rightIndent = 0;\np.keepWithNext = true;   p.keepTogether = true;\np.outlineLevel = Word.OutlineLevel.outlineLevel1;\n\n\u2550\u2550\u2550 STYLES \u2550\u2550\u2550\np.style = \"Heading 1\";     p.style = \"Heading 2\";    p.style = \"Heading 3\";\np.style = \"Normal\";        p.style = \"Title\";         p.style = \"Subtitle\";\np.style = \"List Bullet\";   p.style = \"List Number\";   p.style = \"List Bullet 2\";\np.style = \"Quote\";         p.style = \"Intense Quote\"; p.style = \"No Spacing\";\np.style = \"TOC Heading\";   p.style = \"Header\";        p.style = \"Footer\";\n\n\u2550\u2550\u2550 TABLES \u2550\u2550\u2550\n// Create\nconst data = [[\"Name\",\"Age\",\"Email\"],[\"Alice\",\"30\",\"a@b.com\"]];\nconst table = body.insertTable(data.length, data[0].length, Word.InsertLocation.end, data);\ntable.styleBuiltIn = Word.BuiltInStyleName.gridTable5Dark_Accent1;\ntable.autoFitWindow(); // Fit to page width\n// Access cells\ntable.getCell(0, 0).body.insertParagraph(\"text\", Word.InsertLocation.replace);\n// Cell shading, alignment\ntable.getCell(0, 0).shadingColor = \"#2D6A4F\";\ntable.getCell(0, 0).verticalAlignment = Word.VerticalAlignment.center;\n// Row operations\ntable.rows.load(\"items\"); await context.sync();\ntable.addRows(Word.InsertLocation.end, 1, [[\"New\",\"Row\",\"Data\"]]);\n// Header row bold\nconst headerRow = table.rows.items[0]; headerRow.load(\"cells\"); await context.sync();\nfor(let c=0;c<headerRow.cells.items.length;c++){headerRow.cells.items[c].body.paragraphs.load(\"items/font\");} await context.sync();\ntable.headerRowCount = 1;\n// Borders\nconst border = table.getBorder(Word.BorderLocation.all);\nborder.type = Word.BorderType.single; border.color = \"#000000\"; border.width = 1;\nawait context.sync();\n\n\u2550\u2550\u2550 SEARCH & REPLACE \u2550\u2550\u2550\nconst results = body.search(\"oldText\", {matchCase: false, matchWholeWord: false});\nresults.load(\"items/text\"); await context.sync();\nfor (let i = 0; i < results.items.length; i++) {\n  results.items[i].insertText(\"newText\", Word.InsertLocation.replace);\n}\nawait context.sync();\n// Search with wildcards: body.search(\"pattern\", {matchWildcards: true})\n\n\u2550\u2550\u2550 SELECTION-SCOPED OPERATIONS \u2550\u2550\u2550\n// When user has SELECTED text, ALL operations must target ONLY the selection:\nconst sel = context.document.getSelection();\nsel.load(\"text,font\");\nawait context.sync();\n// Format selection: sel.font.bold = true; sel.font.size = 14; sel.font.color = \"#000\";\n// Hyperlink on selection: sel.hyperlink = \"https://\" + sel.text.trim();\n// NEVER scan body.paragraphs when the user selected specific text.\n// NEVER modify anything outside the selection.\n\n\u2550\u2550\u2550 HYPERLINKS / MAKE ALL LINKS CLICKABLE \u2550\u2550\u2550\n// \uD83D\uDEA8 NEVER insert/append URL text \u2014 ONLY set .hyperlink on existing range\n// CORRECT approach: scan paragraphs with JS regex, then search for each full URL:\nconst paras = body.paragraphs;\nparas.load(\"items/text\");\nawait context.sync();\nconst urlRegex = /https?://[^s,)>]]+/g;\nconst foundUrls = [];\nfor (let i = 0; i < paras.items.length; i++) {\n  const txt = paras.items[i].text || \"\";\n  let m;\n  while ((m = urlRegex.exec(txt)) !== null) { foundUrls.push(m[0]); }\n}\nfor (let j = 0; j < foundUrls.length; j++) {\n  const searchResults = body.search(foundUrls[j], {matchCase: false, matchWholeWord: false});\n  searchResults.load(\"items\");\n  await context.sync();\n  for (let k = 0; k < searchResults.items.length; k++) {\n    searchResults.items[k].hyperlink = foundUrls[j];\n  }\n  await context.sync();\n}\n// \u26A0\uFE0F body.search(\"http\") only matches the 4-char \"http\" substring, NOT the full URL!\n// Always search for the FULL URL string to get the correct range.\n\n\u2550\u2550\u2550 LISTS (BULLETS & NUMBERED) \u2550\u2550\u2550\nconst b1 = body.insertParagraph(\"First item\", Word.InsertLocation.end);\nb1.startNewList(); // starts a new bulleted list\nbody.insertParagraph(\"Second item\", Word.InsertLocation.end);\nbody.insertParagraph(\"Third item\", Word.InsertLocation.end);\nawait context.sync();\n// Styled lists:\n// p.style = \"List Bullet\"; p.style = \"List Number\"; p.style = \"List Bullet 2\";\n\n\u2550\u2550\u2550 HEADERS & FOOTERS \u2550\u2550\u2550\nconst sections = context.document.sections;\nsections.load(\"items\"); await context.sync();\nconst section = sections.items[0];\n// Primary header\nconst header = section.getHeader(Word.HeaderFooterType.primary);\nconst hPara = header.insertParagraph(\"Document Header\", Word.InsertLocation.end);\nhPara.font.size = 9; hPara.font.color = \"#888888\"; hPara.alignment = Word.Alignment.right;\n// Primary footer\nconst footer = section.getFooter(Word.HeaderFooterType.primary);\nconst fPara = footer.insertParagraph(\"Page \", Word.InsertLocation.end);\nfPara.font.size = 9; fPara.alignment = Word.Alignment.centered;\n// First page different: section.getHeader(Word.HeaderFooterType.firstPage)\n// Even pages: section.getHeader(Word.HeaderFooterType.evenPages)\nawait context.sync();\n\n\u2550\u2550\u2550 PAGE BREAKS & SECTION BREAKS \u2550\u2550\u2550\nbody.insertBreak(Word.BreakType.page, Word.InsertLocation.end);\nbody.insertBreak(Word.BreakType.sectionNext, Word.InsertLocation.end); // New section on next page\nbody.insertBreak(Word.BreakType.sectionContinuous, Word.InsertLocation.end); // New section same page\n// Column break: Word.BreakType.column\n// Line break (within paragraph): p.insertBreak(Word.BreakType.line, Word.InsertLocation.end);\n\n\u2550\u2550\u2550 PAGE LAYOUT (via section pageSetup) \u2550\u2550\u2550\nconst secs = context.document.sections;\nsecs.load(\"items\"); await context.sync();\n// Margins (in points: 72pt = 1 inch)\n// Read current: secs.items[0].load(\"pageSetup\"); await context.sync();\n// Normal: top=72, bottom=72, left=72, right=72\n// Narrow: top=36, bottom=36, left=36, right=36\n// Wide: top=72, bottom=72, left=144, right=144\n\n\u2550\u2550\u2550 IMAGES / INLINE PICTURES \u2550\u2550\u2550\n// Insert from base64 (strip \"data:image/...\" prefix first)\nconst pic = body.insertInlinePictureFromBase64(base64String, Word.InsertLocation.end);\npic.width = 300; pic.height = 200;\npic.altTextTitle = \"Description\";\n// Read existing pictures:\nconst pics = body.inlinePictures; pics.load(\"items/width,items/height\"); await context.sync();\n\n\u2550\u2550\u2550 CONTENT CONTROLS \u2550\u2550\u2550\nconst cc = body.insertContentControl(Word.ContentControlType.richText);\ncc.title = \"Section Name\"; cc.tag = \"section1\";\ncc.appearance = Word.ContentControlAppearance.tags;\n// Types: richText, plainText, checkBox, dropDownList, datePicker, picture\n\n\u2550\u2550\u2550 INSERT HTML (for complex formatting) \u2550\u2550\u2550\nbody.insertHtml(\"<h1>Title</h1><p>Content here</p>\", Word.InsertLocation.end);\nbody.insertHtml('<table border=\"1\"><tr><td>A</td><td>B</td></tr></table>', Word.InsertLocation.end);\nbody.insertHtml('<ul><li>Item 1</li><li>Item 2</li></ul>', Word.InsertLocation.end);\nbody.insertHtml('<p style=\"border-bottom:2px solid #333;padding-bottom:4px;\">With border</p>', Word.InsertLocation.end);\n// HTML is ideal for: complex tables, colored backgrounds, styled lists, horizontal rules\n\n\u2550\u2550\u2550 HORIZONTAL RULE / SEPARATOR \u2550\u2550\u2550\nbody.insertHtml('<hr style=\"border:none;border-top:1px solid #ccc;margin:12px 0;\">', Word.InsertLocation.end);\n// Or: insert a paragraph with bottom border via HTML\n\n\u2550\u2550\u2550 FOOTNOTES & ENDNOTES \u2550\u2550\u2550\nconst range = context.document.getSelection();\nrange.insertFootnote(\"Footnote text.\");\n// range.insertEndnote(\"Endnote text.\");\nawait context.sync();\n\n\u2550\u2550\u2550 DELETE EMPTY PARAGRAPHS (space saving) \u2550\u2550\u2550\nconst allParas = body.paragraphs;\nallParas.load(\"items/text\"); await context.sync();\nfor (let i = allParas.items.length - 1; i >= 0; i--) {\n  if (allParas.items[i].text.trim() === \"\") allParas.items[i].delete();\n}\nawait context.sync();\n\n\u2550\u2550\u2550 CREATING DOCUMENTS FROM ATTACHED FILE DATA \u2550\u2550\u2550\nWhen the user attaches a file (PDF, DOCX) and asks you to create/build something from it:\n1. The file's extracted text will be provided in [ATTACHED FILE CONTENT] section.\n2. Use ALL data from the file \u2014 names, contacts, dates, skills, every detail. Do NOT skip or summarize.\n3. Generate code that creates a COMPLETE, fully-formatted Word document using insertParagraph, font styling, tables, etc.\n4. Structure the output professionally with proper sections, headings, spacing, and formatting.\n5. For resumes: Include name (large, bold), contact info, summary, skills, experience with bullet points, projects with descriptions & links, education \u2014 ALL from the source data.\n6. Make all URLs clickable by setting .hyperlink on the range after inserting the text.\n7. Use body.insertParagraph() for each new paragraph/line. Format each one appropriately.\n8. Use insertHtml() for complex layouts like contact info rows, horizontal rules, or multi-column sections.\n\n\u2550\u2550\u2550 ATS RESUME FORMATTING RULES \u2550\u2550\u2550\n- Name: font.size=22, bold=true, alignment=centered, font.color=\"#1a1a1a\".\n- Contact line: font.size=10, centered, include phone | email | location, separated by \" | \".\n- Section headings: font.size=13, bold=true, font.color=\"#2B547E\", spaceAfter=4, spaceBefore=12. Add a horizontal rule below via insertHtml.\n- Body text: Calibri 10.5pt, lineSpacing=14, spaceAfter=2.\n- Bullet points: Use \"List Bullet\" style for items under experience/projects.\n- Links (GitHub, LinkedIn, NPM, Live Demo): Insert the text first, then search for the URL and set .hyperlink.\n- Delete consecutive empty paragraphs to save space.\n\n\u2550\u2550\u2550 CONTENT PRESERVATION (when editing existing docs) \u2550\u2550\u2550\n- Reformatting: Read \u2192 modify font/style/spacing \u2192 sync. NEVER delete text content.\n- Adding: Word.InsertLocation.end or .start. Do NOT replace existing.\n- Only delete truly empty paragraphs (p.text.trim() === \"\").\n\n\u2550\u2550\u2550 BANNED (CRASH/DATA LOSS) \u2550\u2550\u2550\nbody.clear(), Excel.*, sheet.*, .getUsedRange(), .getCell() (for non-tables),\n.addText(), .addLink(), .addPage(), .setText(), .setFont(),\nSpreadsheetApp, DocumentApp, alert(), confirm(), prompt(),\nconst context=..., const body=..., \"Heading1\" (no space), fetch(), require(), import\n\nOUTPUT: Raw JavaScript code only. No markdown, no explanation.";
function generateWordCode(_x4, _x5, _x6, _x7, _x8, _x9) {
  return _generateWordCode.apply(this, arguments);
}

// ═══════════════════════════════════════════════════════════════
// FIXER — Repairs code based on validation or runtime errors
// ═══════════════════════════════════════════════════════════════
function _generateWordCode() {
  _generateWordCode = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(task, plan, docContext, attachedFiles, previousError, signal) {
    var prompt, i, _i, isCreationTask, docIsEmpty, linkKeywordsNoSel, messages, textParts, hasImages, contentParts, code, firstNewline;
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

          // When files are attached and document is mostly empty, this is a CREATION task
          isCreationTask = attachedFiles.length > 0 && attachedFiles.some(function (f) {
            return f.extractedText;
          });
          docIsEmpty = !docContext || !docContext.hasContent || docContext.wordCount < 20;
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
            linkKeywordsNoSel = /\b(clickable|hyperlink|link|url)\b/i;
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
          messages = [{
            role: "system",
            content: CODER_SYSTEM_PROMPT
          }];
          if (attachedFiles.length > 0) {
            // Include extracted text content directly in the prompt for reliable data usage
            textParts = [];
            attachedFiles.forEach(function (file) {
              if (file.extractedText) {
                textParts.push("\n[FILE: \"".concat(file.name, "\"]\n").concat(file.extractedText));
              }
            });
            if (textParts.length > 0) {
              prompt += "\n\n[ATTACHED FILE CONTENT — Use this as source data for the task]" + textParts.join("\n");
            }

            // Also send images for vision-capable models (PDFs rendered as images)
            hasImages = attachedFiles.some(function (f) {
              return f.data && f.data.length > 0;
            });
            if (hasImages) {
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
var FIXER_SYSTEM_PROMPT = "You are a Word JavaScript API debugger expert. Fix the broken code.\n\nCOMMON FIXES:\n1. Excel.* \u2192 Use Word.* namespace instead\n2. sheet.* \u2192 Use body.* (Word document body)\n3. .getUsedRange() \u2192 Use body.paragraphs or body.search()\n4. const body = ... \u2192 REMOVE (already declared, same for const context = ...)\n5. SpreadsheetApp, DocumentApp \u2192 Use Word JS API\n6. range.values = [[]] \u2192 Use body.insertParagraph() or insertTable()\n7. body.clear() \u2192 REMOVE THIS. Never clear the document. Modify paragraphs individually.\n8. InvalidArgument \u2192 Check: style names need spaces (\"Heading 1\" not \"Heading1\"), InsertLocation must be Word.InsertLocation.end/start/replace, table data dimensions must match row/col counts, hyperlinks need \"https://\" prefix\n9. InvalidArgument on hyperlink \u2192 ALWAYS trim spaces and add \"https://\" prefix: range.hyperlink = \"https://\" + url.trim(); NEVER insert URL text.\n10. Mashed/duplicated URL text \u2192 REMOVE any insertText/insertParagraph calls that write the URL. ONLY use range.hyperlink = url.\n11. paragraph.style = \"Heading1\" \u2192 Use \"Heading 1\" (with space)\n12. Properties not loaded \u2192 Add .load(\"text,style,font\") + await context.sync() before reading\n13. \"Property 'text' is unavailable\" \u2192 Must call .load(\"text\") + await context.sync() before accessing .text\n14. \"This member is not part of this object\" \u2192 Method doesn't exist on this type. Check correct API method.\n15. table.getCell() errors \u2192 Ensure row/column indices are within bounds. Use table.load(\"rowCount,columnCount\") first.\n16. .addText()/.addLink()/.addPage()/.setText() \u2192 These are HALLUCINATED. Use .insertText(), .hyperlink=, .insertBreak(), .insertText(Word.InsertLocation.replace)\n17. \"RichApi.Error\" \u2192 Usually means accessing a property that wasn't loaded. Add .load() + sync().\n18. Infinite loop \u2192 Add bounds checking, use for-loops with clear termination, never while(true).\n19. Missing await \u2192 All context.sync(), Word.run(), and other async calls need await.\n20. alert/confirm/prompt \u2192 Remove - these are blocked in add-ins.\n21. fetch/require/import \u2192 Remove - not available in sandboxed execution.\n22. document.getElementById/createElement/innerHTML \u2192 These are DOM, not Word API. Use Word JS methods.\n\nCRITICAL: NEVER use body.clear(). Modify existing paragraphs in-place.\nOUTPUT: Fixed code only. No explanation, no markdown fences.";
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
      isTemplateTask,
      plan,
      code,
      validation,
      retries,
      plannerTask,
      fileTexts,
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
          startTime = Date.now(); // Detect if this is a template prompt that legitimately needs body.clear()
          isTemplateTask = /\bbody\.clear\(\)/i.test(task) || /^First clear the document/i.test(task);
          plan = null;
          code = "";
          validation = null;
          retries = 0;
          _context4.p = 1;
          if (!cfg.enablePlanning) {
            _context4.n = 6;
            break;
          }
          _context4.p = 2;
          // Include attached file content in planner context
          plannerTask = task;
          if (attachedFiles.length > 0) {
            fileTexts = attachedFiles.filter(function (f) {
              return f.extractedText;
            }).map(function (f) {
              return "[File: \"".concat(f.name, "\"]\n").concat(f.extractedText);
            });
            if (fileTexts.length > 0) {
              plannerTask += "\n\n[ATTACHED FILE DATA — Use this as source data for the task]\n" + fileTexts.join("\n\n");
            }
          }
          _context4.n = 3;
          return createWordPlan(plannerTask, docContext, signal);
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
          validation = validateWordCode(code, isTemplateTask);
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
          validation = validateWordCode(code, isTemplateTask);
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
              var body, paragraphs, tables, pictures, selection, allText, wordCount, headings, contentTypes, hasLists, hasBoldText, i, p, trimmed;
              return _regenerator().w(function (_context6) {
                while (1) switch (_context6.n) {
                  case 0:
                    body = context.document.body;
                    body.load("text");
                    paragraphs = body.paragraphs;
                    paragraphs.load("items/text,items/style,items/font");

                    // Check for tables
                    tables = body.tables;
                    tables.load("count");

                    // Check for inline pictures
                    pictures = body.inlinePictures;
                    pictures.load("count");

                    // Get selected text
                    selection = context.document.getSelection();
                    selection.load("text");
                    _context6.n = 1;
                    return context.sync();
                  case 1:
                    allText = body.text || "";
                    wordCount = allText.split(/\s+/).filter(function (w) {
                      return w.length > 0;
                    }).length; // Extract headings and detect content types
                    headings = [];
                    contentTypes = new Set();
                    contentTypes.add("text");
                    hasLists = false;
                    hasBoldText = false;
                    for (i = 0; i < paragraphs.items.length; i++) {
                      p = paragraphs.items[i];
                      if (p.style && (p.style.includes("Heading") || p.style.includes("heading"))) {
                        headings.push(p.text.trim());
                      }
                      if (p.style && (p.style.includes("List") || p.style.includes("Bullet") || p.style.includes("Number"))) {
                        hasLists = true;
                      }
                      // Check for bullet-like characters at start
                      trimmed = p.text.trim();
                      if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*") || /^\d+\.\s/.test(trimmed)) {
                        hasLists = true;
                      }
                    }
                    if (tables.count > 0) contentTypes.add("table");
                    if (pictures.count > 0) contentTypes.add("image");
                    if (hasLists) contentTypes.add("list");
                    if (headings.length > 0) contentTypes.add("headings");
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
/* harmony import */ var pdfjs_dist__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! pdfjs-dist */ "./node_modules/pdfjs-dist/build/pdf.js");
/* harmony import */ var pdfjs_dist__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(pdfjs_dist__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _services_pdfService__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/pdfService */ "./src/services/pdfService.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
/* global console, Word, document, window, Office */









// Configure PDF.js worker
pdfjs_dist__WEBPACK_IMPORTED_MODULE_6__.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/".concat(pdfjs_dist__WEBPACK_IMPORTED_MODULE_6__.version, "/pdf.worker.min.js");

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
  bindClick("agent-file-btn", function () {
    return document.getElementById("agent-file-input").click();
  });
  bindChange("agent-file-input", function (e) {
    return handleFileSelect(e, true);
  });

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
  setupDiffDismiss();

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
    var input, message, welcome, initialPrompt, docCtx, needsDocContext, _docCtx, lastBubble, badge, fileTexts, _iterator2, _step2, file, _lastBubble, _badge, skeletonEl, chatSendButton, chatSendIcon, response, formattedResponse, newBubble, _error$message, sendIcon, _t, _t2, _t3;
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

          // Include attached file content in the conversation
          if (attachedFiles.length > 0) {
            fileTexts = [];
            _iterator2 = _createForOfIteratorHelper(attachedFiles);
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                file = _step2.value;
                if (file.extractedText) {
                  fileTexts.push("[ATTACHED FILE: \"".concat(file.name, "\"]\n").concat(file.extractedText));
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
            if (fileTexts.length > 0) {
              chatConversation.push({
                role: "system",
                content: "[UPLOADED FILE CONTENT]\nThe user has attached ".concat(attachedFiles.length, " file(s). Here is the extracted text content:\n\n").concat(fileTexts.join("\n\n---\n\n"), "\n\nUse this data to answer the user's request. If they ask you to create a resume, use the information from these files as the source material.")
              });
              _lastBubble = document.querySelector('.chat-msg.user:last-child .chat-bubble');
              if (_lastBubble) {
                _badge = document.createElement('span');
                _badge.className = 'context-badge';
                _badge.innerHTML = "\uD83D\uDCCE ".concat(attachedFiles.length, " file(s) attached");
                _lastBubble.appendChild(_badge);
              }
            }
            // Clear attached files after including them
            attachedFiles = [];
            updateFilePreview(false, false);
          }
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

// ─── Diff dismiss handler ──────────────────────────────────────
function setupDiffDismiss() {
  var dismissBtn = document.getElementById("ai-diff-dismiss");
  if (dismissBtn) {
    dismissBtn.onclick = function () {
      var diffView = document.getElementById("ai-diff-view");
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
function tryHardcodedAction(_x) {
  return _tryHardcodedAction.apply(this, arguments);
} // ═══════════════════════════════════════════════════════════════
// MAIN EXECUTION — Run AI Command
// ═══════════════════════════════════════════════════════════════
function _tryHardcodedAction() {
  _tryHardcodedAction = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(userPrompt) {
    var lower, isLinkAction, count;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          lower = userPrompt.toLowerCase(); // ── Make Links Clickable ──────────────────────────────────
          isLinkAction = lower.includes("clickable") || lower.includes("hyperlink") || lower.includes("link") && (lower.includes("make") || lower.includes("all"));
          if (!isLinkAction) {
            _context4.n = 3;
            break;
          }
          count = 0; // @ts-ignore
          _context4.n = 1;
          return Word.run(/*#__PURE__*/function () {
            var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(ctx) {
              var selection, selectedText, urlRegex, wwwRegex, foundUrls, m, url, _url, _iterator3, _step3, _url2, fullUrl, searchResults, k, linkUrl, body, paras, _urlRegex, _foundUrls, i, txt, _m, _url3, j, _url4, _searchResults, _k, _wwwRegex, _i, _txt, _m2, _url5, _fullUrl, _searchResults2, _k2, _t4;
              return _regenerator().w(function (_context3) {
                while (1) switch (_context3.p = _context3.n) {
                  case 0:
                    // Check if user has selected text — if so, only operate on the selection
                    selection = ctx.document.getSelection();
                    selection.load("text");
                    _context3.n = 1;
                    return ctx.sync();
                  case 1:
                    selectedText = (selection.text || "").trim();
                    if (!(selectedText.length > 0)) {
                      _context3.n = 13;
                      break;
                    }
                    // SELECTION MODE: Only make the selected text clickable
                    console.log("[HardcodedAction] Selection mode \u2014 selected: \"".concat(selectedText, "\""));

                    // Extract URLs from the selected text
                    urlRegex = /https?:\/\/[^\s,)>\]"']+/g;
                    wwwRegex = /(?<![\/\/])www\.[^\s,)>\]"']+/g;
                    foundUrls = [];
                    while ((m = urlRegex.exec(selectedText)) !== null) {
                      url = m[0].replace(/[.,;:!?)]+$/, "");
                      if (!foundUrls.includes(url)) foundUrls.push(url);
                    }
                    while ((m = wwwRegex.exec(selectedText)) !== null) {
                      _url = m[0].replace(/[.,;:!?)]+$/, "");
                      if (!foundUrls.includes(_url)) foundUrls.push(_url);
                    }
                    if (!(foundUrls.length > 0)) {
                      _context3.n = 10;
                      break;
                    }
                    // Search within the selection for each URL
                    _iterator3 = _createForOfIteratorHelper(foundUrls);
                    _context3.p = 2;
                    _iterator3.s();
                  case 3:
                    if ((_step3 = _iterator3.n()).done) {
                      _context3.n = 6;
                      break;
                    }
                    _url2 = _step3.value;
                    fullUrl = _url2.startsWith("http") ? _url2 : "https://" + _url2;
                    searchResults = selection.search(_url2, {
                      matchCase: false,
                      matchWholeWord: false
                    });
                    searchResults.load("items");
                    _context3.n = 4;
                    return ctx.sync();
                  case 4:
                    for (k = 0; k < searchResults.items.length; k++) {
                      searchResults.items[k].hyperlink = fullUrl;
                      searchResults.items[k].font.color = "#0563C1";
                      searchResults.items[k].font.underline = "Single";
                      count++;
                    }
                    _context3.n = 5;
                    return ctx.sync();
                  case 5:
                    _context3.n = 3;
                    break;
                  case 6:
                    _context3.n = 8;
                    break;
                  case 7:
                    _context3.p = 7;
                    _t4 = _context3.v;
                    _iterator3.e(_t4);
                  case 8:
                    _context3.p = 8;
                    _iterator3.f();
                    return _context3.f(8);
                  case 9:
                    _context3.n = 12;
                    break;
                  case 10:
                    // The entire selection IS the URL (e.g. user selected "www.linkedin.com/in/nishant")
                    linkUrl = selectedText;
                    if (!linkUrl.startsWith("http")) linkUrl = "https://" + linkUrl;
                    selection.hyperlink = linkUrl;
                    selection.font.color = "#0563C1";
                    selection.font.underline = "Single";
                    _context3.n = 11;
                    return ctx.sync();
                  case 11:
                    count = 1;
                  case 12:
                    _context3.n = 24;
                    break;
                  case 13:
                    // NO SELECTION: Scan entire document
                    body = ctx.document.body;
                    paras = body.paragraphs;
                    paras.load("items/text");
                    _context3.n = 14;
                    return ctx.sync();
                  case 14:
                    _urlRegex = /https?:\/\/[^\s,)>\]"']+/g;
                    _foundUrls = [];
                    for (i = 0; i < paras.items.length; i++) {
                      txt = paras.items[i].text || "";
                      _m = void 0;
                      while ((_m = _urlRegex.exec(txt)) !== null) {
                        _url3 = _m[0].replace(/[.,;:!?)]+$/, "");
                        if (!_foundUrls.includes(_url3)) _foundUrls.push(_url3);
                      }
                    }
                    j = 0;
                  case 15:
                    if (!(j < _foundUrls.length)) {
                      _context3.n = 18;
                      break;
                    }
                    _url4 = _foundUrls[j];
                    _searchResults = body.search(_url4, {
                      matchCase: false,
                      matchWholeWord: false
                    });
                    _searchResults.load("items");
                    _context3.n = 16;
                    return ctx.sync();
                  case 16:
                    for (_k = 0; _k < _searchResults.items.length; _k++) {
                      _searchResults.items[_k].hyperlink = _url4;
                      _searchResults.items[_k].font.color = "#0563C1";
                      _searchResults.items[_k].font.underline = "Single";
                      count++;
                    }
                    _context3.n = 17;
                    return ctx.sync();
                  case 17:
                    j++;
                    _context3.n = 15;
                    break;
                  case 18:
                    _wwwRegex = /(?<![\/\/])www\.[^\s,)>\]"']+/g;
                    _i = 0;
                  case 19:
                    if (!(_i < paras.items.length)) {
                      _context3.n = 24;
                      break;
                    }
                    _txt = paras.items[_i].text || "";
                    _m2 = void 0;
                  case 20:
                    if (!((_m2 = _wwwRegex.exec(_txt)) !== null)) {
                      _context3.n = 23;
                      break;
                    }
                    _url5 = _m2[0].replace(/[.,;:!?)]+$/, "");
                    _fullUrl = "https://" + _url5;
                    _searchResults2 = body.search(_url5, {
                      matchCase: false,
                      matchWholeWord: false
                    });
                    _searchResults2.load("items");
                    _context3.n = 21;
                    return ctx.sync();
                  case 21:
                    for (_k2 = 0; _k2 < _searchResults2.items.length; _k2++) {
                      _searchResults2.items[_k2].hyperlink = _fullUrl;
                      _searchResults2.items[_k2].font.color = "#0563C1";
                      _searchResults2.items[_k2].font.underline = "Single";
                      count++;
                    }
                    _context3.n = 22;
                    return ctx.sync();
                  case 22:
                    _context3.n = 20;
                    break;
                  case 23:
                    _i++;
                    _context3.n = 19;
                    break;
                  case 24:
                    return _context3.a(2);
                }
              }, _callee3, null, [[2, 7, 8, 9]]);
            }));
            return function (_x7) {
              return _ref.apply(this, arguments);
            };
          }());
        case 1:
          if (!(count === 0)) {
            _context4.n = 2;
            break;
          }
          return _context4.a(2, {
            handled: true,
            message: "⚠️ No URLs found. Make sure the text contains links starting with http://, https://, or www."
          });
        case 2:
          return _context4.a(2, {
            handled: true,
            message: "\u2705 Made ".concat(count, " link").concat(count !== 1 ? "s" : "", " clickable!")
          });
        case 3:
          return _context4.a(2, {
            handled: false
          });
      }
    }, _callee4);
  }));
  return _tryHardcodedAction.apply(this, arguments);
}
function runWordAICommand() {
  return _runWordAICommand.apply(this, arguments);
} // ═══════════════════════════════════════════════════════════════
// AI EDITING ANIMATION SYSTEM
// ═══════════════════════════════════════════════════════════════
function _runWordAICommand() {
  _runWordAICommand = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
    var statusEl, debugEl, skeletonEl, cacheBadge, promptInput, button, userPrompt, signal, runText, runIcon, originalText, originalIcon, beforeText, hardcoded, _hardcoded$message, _hardcoded$message2, isError, afterText, code, fromCache, docContext, _docContext, cached, validation, wordAttachedFiles, result, executionResult, _afterText, _executionResult$erro, _error$message2, _t5, _t6, _t7, _t8, _t9, _t0;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          statusEl = document.getElementById("status-message");
          debugEl = document.getElementById("debug-code");
          skeletonEl = document.getElementById("skeleton");
          cacheBadge = document.getElementById("cache-badge");
          promptInput = document.getElementById("prompt-input");
          button = document.getElementById("run");
          if (!(!statusEl || !debugEl || !skeletonEl || !cacheBadge || !promptInput || !button)) {
            _context0.n = 1;
            break;
          }
          console.error("Agent UI elements not found");
          return _context0.a(2);
        case 1:
          userPrompt = promptInput.value.trim();
          if (!(!userPrompt && attachedFiles.length === 0)) {
            _context0.n = 2;
            break;
          }
          showStatus(statusEl, "info", "Please enter a command.");
          return _context0.a(2);
        case 2:
          if (!userPrompt && attachedFiles.length > 0) {
            userPrompt = "Analyze the attached file and extract relevant content into the document.";
          }

          // Cancel if already running
          if (!agentAbortController) {
            _context0.n = 3;
            break;
          }
          agentAbortController.abort();
          return _context0.a(2);
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
          hideEditingOverlay();
          hideDiffView();

          // Capture document text BEFORE execution for diff
          beforeText = "";
          _context0.p = 4;
          _context0.n = 5;
          return Word.run(/*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(ctx) {
              var b;
              return _regenerator().w(function (_context5) {
                while (1) switch (_context5.n) {
                  case 0:
                    b = ctx.document.body;
                    b.load("text");
                    _context5.n = 1;
                    return ctx.sync();
                  case 1:
                    beforeText = b.text || "";
                  case 2:
                    return _context5.a(2);
                }
              }, _callee5);
            }));
            return function (_x8) {
              return _ref2.apply(this, arguments);
            };
          }());
        case 5:
          _context0.n = 7;
          break;
        case 6:
          _context0.p = 6;
          _t5 = _context0.v;
          console.warn("[Diff] Could not capture before-text:", _t5);
        case 7:
          _context0.p = 7;
          _context0.p = 8;
          _context0.n = 9;
          return tryHardcodedAction(userPrompt);
        case 9:
          hardcoded = _context0.v;
          if (!hardcoded.handled) {
            _context0.n = 14;
            break;
          }
          skeletonEl.style.display = "none";
          debugEl.innerText = "// Executed via hardcoded action (no LLM needed)";
          hideEditingOverlay();
          isError = ((_hardcoded$message = hardcoded.message) === null || _hardcoded$message === void 0 ? void 0 : _hardcoded$message.startsWith("⚠️")) || ((_hardcoded$message2 = hardcoded.message) === null || _hardcoded$message2 === void 0 ? void 0 : _hardcoded$message2.startsWith("❌"));
          showStatus(statusEl, isError ? "info" : "success", hardcoded.message || "✅ Done!");
          if (!isError) showToast("success", hardcoded.message || "Done!");
          // Show diff
          _context0.p = 10;
          afterText = ""; // @ts-ignore
          _context0.n = 11;
          return Word.run(/*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(ctx) {
              var b;
              return _regenerator().w(function (_context6) {
                while (1) switch (_context6.n) {
                  case 0:
                    b = ctx.document.body;
                    b.load("text");
                    _context6.n = 1;
                    return ctx.sync();
                  case 1:
                    afterText = b.text || "";
                  case 2:
                    return _context6.a(2);
                }
              }, _callee6);
            }));
            return function (_x9) {
              return _ref3.apply(this, arguments);
            };
          }());
        case 11:
          if (beforeText || afterText) showDiffView(beforeText, afterText);
          _context0.n = 13;
          break;
        case 12:
          _context0.p = 12;
          _t6 = _context0.v;
        case 13:
          return _context0.a(2);
        case 14:
          _context0.n = 16;
          break;
        case 15:
          _context0.p = 15;
          _t7 = _context0.v;
          console.warn("[HardcodedAction] Failed, falling back to LLM:", _t7);
          // Fall through to normal LLM pipeline
        case 16:
          fromCache = false; // Read document context
          docContext = null;
          _context0.p = 17;
          _context0.n = 18;
          return (0,_services_word_orchestrator__WEBPACK_IMPORTED_MODULE_4__.readDocumentContext)();
        case 18:
          docContext = _context0.v;
          if ((_docContext = docContext) !== null && _docContext !== void 0 && _docContext.hasContent) {
            console.log("[WordAgent] Document context: ".concat(docContext.paragraphCount, " paragraphs, ~").concat(docContext.wordCount, " words"));
          }
          _context0.n = 20;
          break;
        case 19:
          _context0.p = 19;
          _t8 = _context0.v;
          console.warn("[WordAgent] Could not read document context:", _t8);
        case 20:
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
            _context0.n = 23;
            break;
          }
          if (runText) runText.innerText = "Generating...";
          wordAttachedFiles = attachedFiles.map(function (f) {
            return {
              name: f.name,
              type: f.type,
              data: f.data,
              extractedText: f.extractedText
            };
          });
          _context0.n = 21;
          return (0,_services_word_orchestrator__WEBPACK_IMPORTED_MODULE_4__.runWordAgent)(userPrompt, docContext, wordAttachedFiles, {
            enablePlanning: true,
            strictValidation: true
          }, signal);
        case 21:
          result = _context0.v;
          // Clear attached files after use
          attachedFiles = [];
          updateFilePreview(false, true);
          if (result.success) {
            _context0.n = 22;
            break;
          }
          throw new Error(result.error || "Code generation failed");
        case 22:
          code = result.code;
          if (!fromCache) {
            (0,_services_cache__WEBPACK_IMPORTED_MODULE_3__.cacheResponse)(userPrompt, code);
          }
        case 23:
          skeletonEl.style.display = "none";
          debugEl.innerText = code;
          if (runText) runText.innerText = "Executing...";

          // Show live editing animation
          showEditingOverlay(code);

          // Execute the code in Word
          // @ts-ignore
          _context0.n = 24;
          return (0,_services_word_orchestrator__WEBPACK_IMPORTED_MODULE_4__.executeWordWithRecovery)(code, /*#__PURE__*/function () {
            var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(codeToRun) {
              return _regenerator().w(function (_context8) {
                while (1) switch (_context8.n) {
                  case 0:
                    _context8.n = 1;
                    return Word.run(/*#__PURE__*/function () {
                      var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(ctx) {
                        var wordBody, executeFn;
                        return _regenerator().w(function (_context7) {
                          while (1) switch (_context7.n) {
                            case 0:
                              wordBody = ctx.document.body;
                              executeFn = new Function("context", "body", "Word", "return (async () => { ".concat(codeToRun, " })();")); // @ts-ignore
                              _context7.n = 1;
                              return executeFn(ctx, wordBody, Word);
                            case 1:
                              _context7.n = 2;
                              return ctx.sync();
                            case 2:
                              return _context7.a(2);
                          }
                        }, _callee7);
                      }));
                      return function (_x1) {
                        return _ref5.apply(this, arguments);
                      };
                    }());
                  case 1:
                    return _context8.a(2);
                }
              }, _callee8);
            }));
            return function (_x0) {
              return _ref4.apply(this, arguments);
            };
          }(), 2, signal);
        case 24:
          executionResult = _context0.v;
          // Hide editing overlay
          hideEditingOverlay();
          if (!executionResult.success) {
            _context0.n = 29;
            break;
          }
          showStatus(statusEl, "success", "✅ Done! Document updated successfully.");
          showToast("success", "Document updated!");

          // Capture AFTER text and show diff
          _context0.p = 25;
          _afterText = ""; // @ts-ignore
          _context0.n = 26;
          return Word.run(/*#__PURE__*/function () {
            var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(ctx) {
              var b;
              return _regenerator().w(function (_context9) {
                while (1) switch (_context9.n) {
                  case 0:
                    b = ctx.document.body;
                    b.load("text");
                    _context9.n = 1;
                    return ctx.sync();
                  case 1:
                    _afterText = b.text || "";
                  case 2:
                    return _context9.a(2);
                }
              }, _callee9);
            }));
            return function (_x10) {
              return _ref6.apply(this, arguments);
            };
          }());
        case 26:
          if (beforeText || _afterText) {
            showDiffView(beforeText, _afterText);
          }
          _context0.n = 28;
          break;
        case 27:
          _context0.p = 27;
          _t9 = _context0.v;
          console.warn("[Diff] Could not capture after-text:", _t9);
        case 28:
          _context0.n = 30;
          break;
        case 29:
          showStatus(statusEl, "error", "\u274C Error: ".concat(executionResult.error));
          showToast("error", ((_executionResult$erro = executionResult.error) === null || _executionResult$erro === void 0 ? void 0 : _executionResult$erro.substring(0, 80)) || "Execution failed");
        case 30:
          _context0.n = 32;
          break;
        case 31:
          _context0.p = 31;
          _t0 = _context0.v;
          skeletonEl.style.display = "none";
          hideEditingOverlay();
          if (_t0.name === 'AbortError') {
            showStatus(statusEl, "info", "⏹ Agent stopped.");
          } else {
            showStatus(statusEl, "error", "\u274C ".concat(_t0.message));
            showToast("error", ((_error$message2 = _t0.message) === null || _error$message2 === void 0 ? void 0 : _error$message2.substring(0, 80)) || "Something went wrong");
          }
        case 32:
          _context0.p = 32;
          agentAbortController = null;
          button.classList.remove("is-busy");
          button.classList.remove("btn-stop");
          if (runText) runText.innerText = originalText;
          if (runIcon) runIcon.innerHTML = originalIcon;
          return _context0.f(32);
        case 33:
          return _context0.a(2);
      }
    }, _callee0, null, [[25, 27], [17, 19], [10, 12], [8, 15], [7, 31, 32, 33], [4, 6]]);
  }));
  return _runWordAICommand.apply(this, arguments);
}
var editAnimInterval = null;

/** Show the live editing overlay with animated code lines */
function showEditingOverlay(code) {
  var overlay = document.getElementById("ai-editing-overlay");
  var linesEl = document.getElementById("ai-edit-lines");
  var phaseEl = document.getElementById("ai-edit-phase");
  var progressBar = document.getElementById("ai-edit-progress-bar");
  if (!overlay || !linesEl) return;
  linesEl.innerHTML = "";
  if (progressBar) progressBar.style.width = "0%";
  overlay.classList.add("active");

  // Parse the generated code into display lines
  var codeLines = code.split("\n").filter(function (l) {
    return l.trim().length > 0;
  });
  var displayLines = [];
  var _iterator = _createForOfIteratorHelper(codeLines),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var line = _step.value;
      var trimmed = line.trim();
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
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var toShow = displayLines.slice(0, 12);
  var lineIndex = 0;
  var phases = ["Analyzing...", "Reading document...", "Applying changes...", "Formatting...", "Finalizing..."];
  var phaseIndex = 0;

  // Animate lines appearing one by one
  editAnimInterval = setInterval(function () {
    if (lineIndex < toShow.length) {
      var item = toShow[lineIndex];
      var lineDiv = document.createElement("div");
      lineDiv.className = "ai-edit-line ".concat(item.type);
      lineDiv.style.animationDelay = "0ms";
      var gutter = document.createElement("span");
      gutter.className = "line-gutter";
      gutter.textContent = item.type === "added" ? "+" : item.type === "removed" ? "−" : " ";
      var content = document.createElement("span");
      content.className = "line-content";

      // Truncate long lines
      var displayText = item.text.length > 50 ? item.text.substring(0, 50) + "..." : item.text;
      content.textContent = displayText;

      // Add typing cursor to last added line
      if (item.type === "added" && lineIndex === toShow.length - 1) {
        var cursor = document.createElement("span");
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
      var pi = Math.min(Math.floor(phaseIndex / 4), phases.length - 1);
      phaseEl.textContent = phases[pi];
    }

    // Update progress bar
    if (progressBar) {
      var progress = Math.min(95, lineIndex / Math.max(toShow.length, 1) * 85 + 10);
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
  var overlay = document.getElementById("ai-editing-overlay");
  var progressBar = document.getElementById("ai-edit-progress-bar");
  if (progressBar) progressBar.style.width = "100%";

  // Brief delay to show completion
  setTimeout(function () {
    if (overlay) overlay.classList.remove("active");
  }, 300);
}

// ═══════════════════════════════════════════════════════════════
// DIFF VIEW SYSTEM
// ═══════════════════════════════════════════════════════════════

/** Compute a simple line-level diff between two texts */
function computeSimpleDiff(before, after) {
  var beforeLines = before.split(/\r?\n/).map(function (l) {
    return l.trimEnd();
  });
  var afterLines = after.split(/\r?\n/).map(function (l) {
    return l.trimEnd();
  });
  var result = [];

  // Simple LCS-based diff for reasonable-sized documents
  var beforeSet = new Map();
  beforeLines.forEach(function (line, i) {
    if (!beforeSet.has(line)) beforeSet.set(line, []);
    beforeSet.get(line).push(i);
  });
  var afterSet = new Map();
  afterLines.forEach(function (line, i) {
    if (!afterSet.has(line)) afterSet.set(line, []);
    afterSet.get(line).push(i);
  });

  // Find lines only in before (removed), only in after (added), in both (context)
  var usedBefore = new Set();
  var usedAfter = new Set();

  // Match identical lines in order
  var bIdx = 0;
  var aIdx = 0;
  while (bIdx < beforeLines.length && aIdx < afterLines.length) {
    if (beforeLines[bIdx] === afterLines[aIdx]) {
      usedBefore.add(bIdx);
      usedAfter.add(aIdx);
      bIdx++;
      aIdx++;
    } else {
      // Try to find next match
      var foundInAfter = -1;
      for (var j = aIdx; j < Math.min(aIdx + 10, afterLines.length); j++) {
        if (afterLines[j] === beforeLines[bIdx]) {
          foundInAfter = j;
          break;
        }
      }
      var foundInBefore = -1;
      for (var _j = bIdx; _j < Math.min(bIdx + 10, beforeLines.length); _j++) {
        if (beforeLines[_j] === afterLines[aIdx]) {
          foundInBefore = _j;
          break;
        }
      }
      if (foundInAfter >= 0 && (foundInBefore < 0 || foundInAfter - aIdx <= foundInBefore - bIdx)) {
        // Lines in after before match are additions
        for (var _j2 = aIdx; _j2 < foundInAfter; _j2++) {
          usedAfter.add(_j2);
        }
        aIdx = foundInAfter;
      } else if (foundInBefore >= 0) {
        // Lines in before before match are removals
        for (var _j3 = bIdx; _j3 < foundInBefore; _j3++) {
          usedBefore.add(_j3);
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
  var contextCount = 0;
  var MAX_CONTEXT = 2; // Show max 2 unchanged lines between changes

  while (bIdx < beforeLines.length || aIdx < afterLines.length) {
    var bLine = bIdx < beforeLines.length ? beforeLines[bIdx] : null;
    var aLine = aIdx < afterLines.length ? afterLines[aIdx] : null;
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
        var afterOccurrences = afterSet.get(bLine) || [];
        var stillExists = afterOccurrences.some(function (j) {
          return j >= aIdx - 3 && j <= aIdx + 10;
        });
        if (!stillExists && bLine.trim().length > 0) {
          result.push({
            type: "removed",
            text: bLine
          });
        }
        bIdx++;
      }
      if (aLine !== null && (bLine === null || aLine !== bLine)) {
        var beforeOccurrences = beforeSet.get(aLine) || [];
        var existedBefore = beforeOccurrences.some(function (j) {
          return j >= bIdx - 3 && j <= bIdx + 10;
        });
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
  var diffView = document.getElementById("ai-diff-view");
  var diffBody = document.getElementById("ai-diff-body");
  var diffStats = document.getElementById("ai-diff-stats");
  if (!diffView || !diffBody) return;
  var diff = computeSimpleDiff(before, after);

  // Don't show if no meaningful changes
  var addedCount = diff.filter(function (d) {
    return d.type === "added";
  }).length;
  var removedCount = diff.filter(function (d) {
    return d.type === "removed";
  }).length;
  if (addedCount === 0 && removedCount === 0) return;

  // Stats
  if (diffStats) {
    diffStats.innerHTML = "\n            <span class=\"stat-added\">+".concat(addedCount, "</span>\n            <span class=\"stat-removed\">\u2212").concat(removedCount, "</span>\n        ");
  }

  // Build diff lines
  diffBody.innerHTML = "";
  diff.forEach(function (item, index) {
    if (item.type === "separator") {
      var sep = document.createElement("div");
      sep.className = "diff-separator";
      sep.textContent = item.text;
      diffBody.appendChild(sep);
      return;
    }
    var lineEl = document.createElement("div");
    lineEl.className = "diff-line diff-".concat(item.type);
    lineEl.style.animationDelay = "".concat(index * 40, "ms");
    var gutter = document.createElement("span");
    gutter.className = "diff-gutter";
    gutter.textContent = item.type === "added" ? "+" : item.type === "removed" ? "−" : " ";
    var text = document.createElement("span");
    text.className = "diff-text";

    // For added lines, wrap in highlight span
    if (item.type === "added") {
      var highlight = document.createElement("span");
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
  var diffView = document.getElementById("ai-diff-view");
  if (diffView) diffView.classList.remove("active");
}

// ─── Status & Toast ──────────────────────────────────────────

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

// ═══════════════════════════════════════════════════════════════
// FILE HANDLING — Attach PDFs, Images, and Word Documents
// ═══════════════════════════════════════════════════════════════

var PAPERCLIP_SVG = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\"></path></svg>";
function handleFileSelect(_x2) {
  return _handleFileSelect.apply(this, arguments);
}
/**
 * Extract text from a DOCX file.
 * DOCX is a ZIP archive with word/document.xml containing paragraph data.
 * We parse the ZIP structure, decompress the XML, and extract <w:t> text nodes.
 */
function _handleFileSelect() {
  _handleFileSelect = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(event) {
    var isAgent,
      input,
      btnId,
      btn,
      newFiles,
      i,
      file,
      extractedText,
      pdfResult,
      arrayBuffer,
      images,
      _extractedText,
      base64,
      _args1 = arguments,
      _t1,
      _t10,
      _t11;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          isAgent = _args1.length > 1 && _args1[1] !== undefined ? _args1[1] : false;
          input = event.target;
          if (!(!input.files || input.files.length === 0)) {
            _context1.n = 1;
            break;
          }
          return _context1.a(2);
        case 1:
          btnId = isAgent ? "agent-file-btn" : "file-upload-btn";
          btn = document.getElementById(btnId);
          if (btn) btn.innerHTML = "<span class=\"btn-spinner\"></span>";
          _context1.p = 2;
          newFiles = [];
          i = 0;
        case 3:
          if (!(i < input.files.length)) {
            _context1.n = 18;
            break;
          }
          file = input.files[i];
          if (!(file.type === "application/pdf")) {
            _context1.n = 10;
            break;
          }
          // Extract actual text from the PDF for content-based tasks
          extractedText = "";
          _context1.p = 4;
          _context1.n = 5;
          return (0,_services_pdfService__WEBPACK_IMPORTED_MODULE_7__.extractTextFromPDFFile)(file);
        case 5:
          pdfResult = _context1.v;
          extractedText = pdfResult.text;
          _context1.n = 7;
          break;
        case 6:
          _context1.p = 6;
          _t1 = _context1.v;
          console.warn("PDF text extraction failed, falling back to image mode:", _t1);
        case 7:
          _context1.n = 8;
          return file.arrayBuffer();
        case 8:
          arrayBuffer = _context1.v;
          _context1.n = 9;
          return renderPdfToImages(arrayBuffer);
        case 9:
          images = _context1.v;
          newFiles.push({
            name: file.name,
            type: "pdf",
            data: images,
            extractedText: extractedText
          });
          _context1.n = 17;
          break;
        case 10:
          if (!(file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx"))) {
            _context1.n = 15;
            break;
          }
          // Extract text from DOCX using the Word API or manual parsing
          _extractedText = "";
          _context1.p = 11;
          _context1.n = 12;
          return extractTextFromDocx(file);
        case 12:
          _extractedText = _context1.v;
          _context1.n = 14;
          break;
        case 13:
          _context1.p = 13;
          _t10 = _context1.v;
          console.warn("DOCX text extraction failed:", _t10);
        case 14:
          newFiles.push({
            name: file.name,
            type: "docx",
            data: [],
            extractedText: _extractedText
          });
          _context1.n = 17;
          break;
        case 15:
          if (!file.type.startsWith("image/")) {
            _context1.n = 17;
            break;
          }
          _context1.n = 16;
          return fileToBase64(file);
        case 16:
          base64 = _context1.v;
          newFiles.push({
            name: file.name,
            type: "image",
            data: [base64]
          });
        case 17:
          i++;
          _context1.n = 3;
          break;
        case 18:
          if (newFiles.length > 0) {
            attachedFiles = [].concat(_toConsumableArray(attachedFiles), newFiles);
            updateFilePreview(true, isAgent);
          } else {
            showToast("error", "Unsupported file type. Use PDF, DOCX, or images.");
          }
          _context1.n = 20;
          break;
        case 19:
          _context1.p = 19;
          _t11 = _context1.v;
          console.error("File handling error:", _t11);
          showToast("error", "Error reading file: " + _t11.message);
        case 20:
          _context1.p = 20;
          // Reset input so the same file can be selected again
          input.value = "";
          if (btn) btn.innerHTML = PAPERCLIP_SVG;
          return _context1.f(20);
        case 21:
          return _context1.a(2);
      }
    }, _callee1, null, [[11, 13], [4, 6], [2, 19, 20, 21]]);
  }));
  return _handleFileSelect.apply(this, arguments);
}
function extractTextFromDocx(_x3) {
  return _extractTextFromDocx.apply(this, arguments);
}
function _extractTextFromDocx() {
  _extractTextFromDocx = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(file) {
    var arrayBuffer, uint8, entries, docEntry, xmlText, textParts, paragraphRegex, textRunRegex, pMatch, paraXml, paraTexts, tMatch;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.n) {
        case 0:
          _context10.n = 1;
          return file.arrayBuffer();
        case 1:
          arrayBuffer = _context10.v;
          uint8 = new Uint8Array(arrayBuffer);
          entries = parseZipEntries(uint8);
          docEntry = entries.find(function (e) {
            return e.name === "word/document.xml";
          });
          if (docEntry) {
            _context10.n = 2;
            break;
          }
          throw new Error("Not a valid DOCX file — word/document.xml not found.");
        case 2:
          _context10.n = 3;
          return decompressZipEntry(uint8, docEntry);
        case 3:
          xmlText = _context10.v;
          // Extract text from <w:t> elements within <w:p> paragraphs
          textParts = [];
          paragraphRegex = /<w:p[\s>][\s\S]*?<\/w:p>/g;
          textRunRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
          while ((pMatch = paragraphRegex.exec(xmlText)) !== null) {
            paraXml = pMatch[0];
            paraTexts = [];
            tMatch = void 0;
            textRunRegex.lastIndex = 0;
            while ((tMatch = textRunRegex.exec(paraXml)) !== null) {
              paraTexts.push(tMatch[1]);
            }
            if (paraTexts.length > 0) {
              textParts.push(paraTexts.join(""));
            }
          }
          return _context10.a(2, textParts.join("\n"));
      }
    }, _callee10);
  }));
  return _extractTextFromDocx.apply(this, arguments);
}
function parseZipEntries(data) {
  var entries = [];
  var pos = 0;
  var view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  while (pos < data.length - 4) {
    var sig = view.getUint32(pos, true);
    if (sig !== 0x04034b50) break;
    var compressionMethod = view.getUint16(pos + 8, true);
    var compressedSize = view.getUint32(pos + 18, true);
    var uncompressedSize = view.getUint32(pos + 22, true);
    var nameLength = view.getUint16(pos + 26, true);
    var extraLength = view.getUint16(pos + 28, true);
    var nameBytes = data.slice(pos + 30, pos + 30 + nameLength);
    var name = new TextDecoder("utf-8").decode(nameBytes);
    var dataOffset = pos + 30 + nameLength + extraLength;
    entries.push({
      name: name,
      compressionMethod: compressionMethod,
      compressedSize: compressedSize,
      uncompressedSize: uncompressedSize,
      offset: dataOffset
    });
    pos = dataOffset + compressedSize;
  }
  return entries;
}
function decompressZipEntry(_x4, _x5) {
  return _decompressZipEntry.apply(this, arguments);
}
function _decompressZipEntry() {
  _decompressZipEntry = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(zipData, entry) {
    var raw, ds, writer, reader, chunks, _yield$reader$read, done, value, totalLength, result, off, _i2, _chunks, chunk;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.n) {
        case 0:
          raw = zipData.slice(entry.offset, entry.offset + entry.compressedSize);
          if (!(entry.compressionMethod === 0)) {
            _context11.n = 1;
            break;
          }
          return _context11.a(2, new TextDecoder("utf-8").decode(raw));
        case 1:
          if (!(entry.compressionMethod === 8 && typeof DecompressionStream !== "undefined")) {
            _context11.n = 6;
            break;
          }
          ds = new DecompressionStream("deflate-raw");
          writer = ds.writable.getWriter();
          writer.write(raw);
          writer.close();
          reader = ds.readable.getReader();
          chunks = [];
        case 2:
          if (false) // removed by dead control flow
{}
          _context11.n = 3;
          return reader.read();
        case 3:
          _yield$reader$read = _context11.v;
          done = _yield$reader$read.done;
          value = _yield$reader$read.value;
          if (!done) {
            _context11.n = 4;
            break;
          }
          return _context11.a(3, 5);
        case 4:
          chunks.push(value);
          _context11.n = 2;
          break;
        case 5:
          totalLength = chunks.reduce(function (sum, c) {
            return sum + c.length;
          }, 0);
          result = new Uint8Array(totalLength);
          off = 0;
          for (_i2 = 0, _chunks = chunks; _i2 < _chunks.length; _i2++) {
            chunk = _chunks[_i2];
            result.set(chunk, off);
            off += chunk.length;
          }
          return _context11.a(2, new TextDecoder("utf-8").decode(result));
        case 6:
          return _context11.a(2, new TextDecoder("utf-8", {
            fatal: false
          }).decode(raw));
      }
    }, _callee11);
  }));
  return _decompressZipEntry.apply(this, arguments);
}
function updateFilePreview(show) {
  var isAgent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var listId = isAgent ? "agent-file-preview-list" : "file-preview-list";
  var container = document.getElementById(listId);
  if (!container) return;
  container.innerHTML = "";
  if (attachedFiles.length === 0) return;
  attachedFiles.forEach(function (file, index) {
    var chip = document.createElement("div");
    chip.className = "file-chip";
    var icon = document.createElement("span");
    icon.className = "file-chip-icon";
    icon.textContent = file.type === "pdf" ? "PDF" : file.type === "docx" ? "DOC" : "IMG";
    var name = document.createElement("span");
    name.className = "file-chip-name";
    name.textContent = file.name;
    var remove = document.createElement("button");
    remove.className = "file-chip-remove";
    remove.innerHTML = "&times;";
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
}
function _renderPdfToImages() {
  _renderPdfToImages = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(buffer) {
    var pdf, images, maxPages, i, page, viewport, canvas, ctx;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.n) {
        case 0:
          _context12.n = 1;
          return pdfjs_dist__WEBPACK_IMPORTED_MODULE_6__.getDocument({
            data: buffer
          }).promise;
        case 1:
          pdf = _context12.v;
          images = [];
          maxPages = Math.min(pdf.numPages, 5);
          i = 1;
        case 2:
          if (!(i <= maxPages)) {
            _context12.n = 7;
            break;
          }
          _context12.n = 3;
          return pdf.getPage(i);
        case 3:
          page = _context12.v;
          viewport = page.getViewport({
            scale: 1.0
          });
          canvas = document.createElement("canvas");
          ctx = canvas.getContext("2d");
          if (ctx) {
            _context12.n = 4;
            break;
          }
          return _context12.a(3, 6);
        case 4:
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          _context12.n = 5;
          return page.render({
            canvasContext: ctx,
            viewport: viewport
          }).promise;
        case 5:
          images.push(canvas.toDataURL("image/png"));
        case 6:
          i++;
          _context12.n = 2;
          break;
        case 7:
          return _context12.a(2, images);
      }
    }, _callee12);
  }));
  return _renderPdfToImages.apply(this, arguments);
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
var code = "<!DOCTYPE html>\r\n<html>\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\" />\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\" />\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r\n    <title>DocOS AI</title>\r\n    <" + "script type=\"text/javascript\" src=\"https://appsforoffice.microsoft.com/lib/1/hosted/office.js\"><" + "/script>\r\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\r\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\r\n    <link\r\n        href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap\"\r\n        rel=\"stylesheet\">\r\n</head>\r\n\r\n<body>\r\n    <main id=\"app-body\" style=\"display: none;\">\r\n        <header class=\"app-header\">\r\n            <div class=\"brand\">\r\n                <h1>DocOS <span class=\"highlight-text\">AI</span></h1>\r\n            </div>\r\n            <div class=\"header-actions\">\r\n                <button id=\"docs-toggle\" class=\"btn-icon\" title=\"What can I do?\"></button>\r\n                <button id=\"settings-toggle\" class=\"btn-icon\" title=\"Settings\"></button>\r\n            </div>\r\n        </header>\r\n\r\n        <!-- Docs Panel -->\r\n        <div id=\"docs-panel\" class=\"panel\" style=\"display: none;\">\r\n            <h3>What can DocOS AI do?</h3>\r\n            <div class=\"docs-grid\">\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"fileText\"></span>\r\n                    <div><strong>ATS Resume Optimizer</strong>\r\n                        <p>Make your resume ATS-friendly with clean formatting, proper keywords, and standard sections</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"paintbrush\"></span>\r\n                    <div><strong>Professional Formatting</strong>\r\n                        <p>Apply consistent fonts, headings, spacing, and styles to your entire document</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"eraser\"></span>\r\n                    <div><strong>Document Cleanup</strong>\r\n                        <p>Remove extra spaces, fix formatting issues, standardize styles</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"search\"></span>\r\n                    <div><strong>Find & Replace</strong>\r\n                        <p>Smart search and replace with pattern matching across your document</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"table\"></span>\r\n                    <div><strong>Tables & Lists</strong>\r\n                        <p>Create formatted tables, bullet lists, and numbered lists</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"fileTemplate\"></span>\r\n                    <div><strong>Templates</strong>\r\n                        <p>Generate resumes, cover letters, business letters, meeting notes</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"brain\"></span>\r\n                    <div><strong>AI Writing Assistant</strong>\r\n                        <p>Improve writing, change tone, summarize, expand content</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"checkSquare\"></span>\r\n                    <div><strong>Proofreading</strong>\r\n                        <p>Check grammar, spelling, punctuation, and style consistency</p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <p class=\"docs-hint\">Just describe what you need in plain English — DocOS handles the rest.</p>\r\n        </div>\r\n\r\n        <!-- Settings Panel -->\r\n        <div id=\"settings-panel\" class=\"panel\" style=\"display: none;\">\r\n            <h3>AI Provider</h3>\r\n\r\n            <div class=\"form-group\">\r\n                <label for=\"setting-provider\">Provider</label>\r\n                <select id=\"setting-provider\" class=\"form-input\">\r\n                    <option value=\"groq\">Groq (Llama)</option>\r\n                    <option value=\"gemini\">Google Gemini</option>\r\n                    <option value=\"openai\">OpenAI (GPT-4)</option>\r\n                    <option value=\"anthropic\">Anthropic (Claude)</option>\r\n                    <option value=\"openrouter\">OpenRouter</option>\r\n                    <option value=\"local\">Ollama (Local)</option>\r\n                </select>\r\n            </div>\r\n\r\n            <!-- Groq Fields -->\r\n            <div id=\"groq-fields\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-api-key\">Groq API Key</label>\r\n                    <input id=\"setting-api-key\" type=\"password\" class=\"form-input\" placeholder=\"gsk_...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-groq-model\">Model</label>\r\n                    <select id=\"setting-groq-model\" class=\"form-input\">\r\n                        <option value=\"llama-3.1-8b-instant\">Llama 3.1 8B — Fast</option>\r\n                        <option value=\"llama-3.3-70b-versatile\" selected>Llama 3.3 70B — Smart</option>\r\n                        <option value=\"gemma2-9b-it\">Gemma 2 9B</option>\r\n                        <option value=\"mixtral-8x7b-32768\">Mixtral 8x7B</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Gemini Fields -->\r\n            <div id=\"gemini-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-gemini-key\">Gemini API Key</label>\r\n                    <input id=\"setting-gemini-key\" type=\"password\" class=\"form-input\" placeholder=\"AIzaSy...\" />\r\n                    <div style=\"font-size:10px; color:var(--text-3); margin-top:4px\">Get free key at <a\r\n                            href=\"https://aistudio.google.com/app/apikey\" target=\"_blank\">aistudio.google.com</a></div>\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-gemini-model\">Model</label>\r\n                    <select id=\"setting-gemini-model\" class=\"form-input\">\r\n                        <option value=\"gemini-1.5-flash\" selected>Gemini 1.5 Flash</option>\r\n                        <option value=\"gemini-1.5-flash-001\">Gemini 1.5 Flash-001</option>\r\n                        <option value=\"gemini-1.5-pro\">Gemini 1.5 Pro</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- OpenAI Fields -->\r\n            <div id=\"openai-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openai-key\">OpenAI API Key</label>\r\n                    <input id=\"setting-openai-key\" type=\"password\" class=\"form-input\" placeholder=\"sk-...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openai-model\">Model</label>\r\n                    <select id=\"setting-openai-model\" class=\"form-input\">\r\n                        <option value=\"gpt-4o-mini\" selected>GPT-4o Mini</option>\r\n                        <option value=\"gpt-4o\">GPT-4o</option>\r\n                        <option value=\"gpt-3.5-turbo\">GPT-3.5 Turbo</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Anthropic Fields -->\r\n            <div id=\"anthropic-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-anthropic-key\">Anthropic API Key</label>\r\n                    <input id=\"setting-anthropic-key\" type=\"password\" class=\"form-input\" placeholder=\"sk-ant-...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-anthropic-model\">Model</label>\r\n                    <select id=\"setting-anthropic-model\" class=\"form-input\">\r\n                        <option value=\"claude-3-5-sonnet-20241022\" selected>Claude 3.5 Sonnet</option>\r\n                        <option value=\"claude-3-5-haiku-20241022\">Claude 3.5 Haiku</option>\r\n                        <option value=\"claude-3-opus-20240229\">Claude 3 Opus</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- OpenRouter Fields -->\r\n            <div id=\"openrouter-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openrouter-key\">OpenRouter API Key</label>\r\n                    <input id=\"setting-openrouter-key\" type=\"password\" class=\"form-input\"\r\n                        placeholder=\"sk-or-v1-...\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-openrouter-model\">Model</label>\r\n                    <select id=\"setting-openrouter-model\" class=\"form-input\">\r\n                        <option value=\"anthropic/claude-3.5-sonnet:beta\" selected>Claude 3.5 Sonnet</option>\r\n                        <option value=\"google/gemini-2.5-pro\">Gemini 2.5 Pro</option>\r\n                        <option value=\"openai/gpt-4o\">GPT-4o</option>\r\n                        <option value=\"meta-llama/llama-3.3-70b-instruct\">Llama 3.3 70B</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Local Fields -->\r\n            <div id=\"local-fields\" style=\"display: none;\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"setting-base-url\">Ollama Host</label>\r\n                    <input id=\"setting-base-url\" type=\"text\" class=\"form-input\"\r\n                        placeholder=\"http://localhost:11434\" />\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label>Model</label>\r\n                    <div class=\"model-select-wrapper\">\r\n                        <select id=\"setting-local-model\" class=\"form-input\">\r\n                            <option value=\"\" disabled selected>Click refresh →</option>\r\n                        </select>\r\n                        <button id=\"refresh-models\" class=\"btn-icon btn-refresh\" title=\"Refresh models\"></button>\r\n                    </div>\r\n                    <div id=\"model-status\" class=\"model-status\"></div>\r\n                </div>\r\n            </div>\r\n\r\n            <button id=\"save-settings\" class=\"btn-primary btn-save\">Save</button>\r\n        </div>\r\n\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <!-- MODE TOGGLE -->\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <div class=\"mode-toggle\">\r\n            <button id=\"mode-planning\" class=\"mode-tab active\" data-mode=\"planning\">\r\n                <span id=\"mode-planning-icon\"></span>\r\n                <span>Planning</span>\r\n            </button>\r\n            <button id=\"mode-agent\" class=\"mode-tab\" data-mode=\"agent\">\r\n                <span id=\"mode-agent-icon\"></span>\r\n                <span>Agent</span>\r\n            </button>\r\n            <div class=\"mode-indicator\" id=\"mode-indicator\"></div>\r\n        </div>\r\n\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <!-- PLANNING MODE (Chat) -->\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <div id=\"planning-mode\" class=\"mode-content active\">\r\n            <!-- Chat Messages Area -->\r\n            <div style=\"position: relative; flex: 1; display: flex; flex-direction: column; overflow: hidden;\">\r\n                <div id=\"chat-messages\" class=\"chat-messages\">\r\n                    <!-- Welcome message -->\r\n                    <div class=\"chat-welcome\">\r\n                        <img src=\"" + ___HTML_LOADER_IMPORT_0___ + "\" alt=\"DocOS Logo\"\r\n                            style=\"width: 64px; height: 64px; margin-bottom: 16px;\">\r\n                        <h2>What are you working on?</h2>\r\n                        <div class=\"welcome-suggestions\" id=\"chat-suggestions\">\r\n                            <!-- Dynamically populated -->\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <button id=\"scroll-to-bottom\" class=\"scroll-to-bottom\" title=\"Scroll to bottom\">\r\n                    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"\r\n                        stroke-linecap=\"round\" stroke-linejoin=\"round\">\r\n                        <polyline points=\"6 9 12 15 18 9\" />\r\n                    </svg>\r\n                </button>\r\n            </div>\r\n\r\n            <!-- Chat Input -->\r\n            <div class=\"chat-input-area\">\r\n                <div id=\"file-preview-list\" class=\"file-preview-list\"></div>\r\n\r\n                <div class=\"chat-input-card\">\r\n                    <input type=\"file\" id=\"file-input\" accept=\"image/png, image/jpeg, application/pdf, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document\" multiple\r\n                        style=\"display: none;\" />\r\n                    <button id=\"file-upload-btn\" class=\"btn-clip\" title=\"Attach PDF, Word Doc, or Image\">\r\n                        <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n                            stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\r\n                            <path\r\n                                d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\">\r\n                            </path>\r\n                        </svg>\r\n                    </button>\r\n                    <textarea id=\"chat-input\" placeholder=\"Ask about your document or upload a file...\" rows=\"1\"\r\n                        spellcheck=\"false\"></textarea>\r\n                    <button id=\"chat-send\" class=\"btn-send\" title=\"Send message\">\r\n                        <span id=\"chat-send-icon\"></span>\r\n                    </button>\r\n                </div>\r\n                <div class=\"chat-footer\">\r\n                    <button id=\"chat-clear\" class=\"btn-text\" title=\"Clear conversation\">\r\n                        <span id=\"chat-clear-icon\"></span>\r\n                        <span>Clear</span>\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <!-- AGENT MODE (Execute) -->\r\n        <!-- ═══════════════════════════════════════════════════ -->\r\n        <div id=\"agent-mode\" class=\"mode-content\">\r\n            <div class=\"content-wrapper\">\r\n                <!-- Input Card -->\r\n                <div class=\"input-card\">\r\n                    <textarea id=\"prompt-input\" placeholder=\"Describe what you want to do with your document...\"\r\n                        spellcheck=\"false\"></textarea>\r\n\r\n                    <!-- File Preview (Agent Mode) -->\r\n                    <div id=\"agent-file-preview-list\" class=\"file-preview-list\"></div>\r\n\r\n                    <div class=\"card-footer\">\r\n                        <div class=\"footer-left\">\r\n                            <input type=\"file\" id=\"agent-file-input\" accept=\"image/png, image/jpeg, application/pdf, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document\"\r\n                                multiple style=\"display: none;\" />\r\n                            <button id=\"agent-file-btn\" class=\"btn-clip\" title=\"Attach files\">\r\n                                <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n                                    stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\r\n                                    <path\r\n                                        d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\">\r\n                                    </path>\r\n                                </svg>\r\n                            </button>\r\n                            <span id=\"cache-badge\" class=\"cache-badge\" style=\"display:none;\">⚡ cached</span>\r\n                        </div>\r\n                        <span class=\"kbd-hint\">Ctrl+↵</span>\r\n                        <button id=\"run\" class=\"btn-primary\">\r\n                            <span id=\"run-text\">Execute</span>\r\n                            <span id=\"run-icon\"></span>\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- Scrollable content area -->\r\n                <div class=\"agent-scroll-area\">\r\n                    <!-- Category Tabs for Quick Actions -->\r\n                    <div class=\"action-categories\" id=\"action-categories\">\r\n                        <button class=\"category-tab active\" data-category=\"resume\">\r\n                            <span class=\"cat-icon\" data-icon=\"fileText\"></span>\r\n                            <span>Resume</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"writing\">\r\n                            <span class=\"cat-icon\" data-icon=\"brain\"></span>\r\n                            <span>Writing</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"format\">\r\n                            <span class=\"cat-icon\" data-icon=\"palette\"></span>\r\n                            <span>Format</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"insert\">\r\n                            <span class=\"cat-icon\" data-icon=\"plusCircle\"></span>\r\n                            <span>Insert</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"layout\">\r\n                            <span class=\"cat-icon\" data-icon=\"layoutGrid\"></span>\r\n                            <span>Layout</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"cleanup\">\r\n                            <span class=\"cat-icon\" data-icon=\"broom\"></span>\r\n                            <span>Cleanup</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"templates\">\r\n                            <span class=\"cat-icon\" data-icon=\"fileTemplate\"></span>\r\n                            <span>Templates</span>\r\n                        </button>\r\n                        <button class=\"category-tab\" data-category=\"smart\">\r\n                            <span class=\"cat-icon\" data-icon=\"brain\"></span>\r\n                            <span>Smart Tools</span>\r\n                        </button>\r\n                    </div>\r\n\r\n                    <!-- Quick Actions -->\r\n                    <div id=\"quick-actions\" class=\"quick-actions\"></div>\r\n\r\n                    <!-- Skeleton -->\r\n                    <div id=\"skeleton\" class=\"skeleton-container\" style=\"display: none;\">\r\n                        <div class=\"skeleton-pill\"></div>\r\n                        <div class=\"skeleton-line w80\"></div>\r\n                        <div class=\"skeleton-line w60\"></div>\r\n                    </div>\r\n\r\n                    <!-- AI Editing Animation Overlay -->\r\n                    <div id=\"ai-editing-overlay\" class=\"ai-editing-overlay\">\r\n                        <div class=\"ai-edit-header\">\r\n                            <span class=\"pulse-dot\"></span>\r\n                            <span class=\"edit-label\">DocOS AI is editing</span>\r\n                            <span class=\"edit-phase\" id=\"ai-edit-phase\">Analyzing...</span>\r\n                        </div>\r\n                        <div class=\"ai-edit-lines\" id=\"ai-edit-lines\"></div>\r\n                        <div class=\"ai-edit-progress\">\r\n                            <div class=\"bar\" id=\"ai-edit-progress-bar\"></div>\r\n                            <div class=\"shimmer\"></div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!-- Diff View (shown after execution) -->\r\n                    <div id=\"ai-diff-view\" class=\"ai-diff-view\">\r\n                        <div class=\"ai-diff-header\">\r\n                            <div class=\"ai-diff-title\">\r\n                                <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3v18\"/><path d=\"M18 9l-6-6-6 6\"/></svg>\r\n                                <span>Changes Applied</span>\r\n                            </div>\r\n                            <div class=\"ai-diff-stats\" id=\"ai-diff-stats\"></div>\r\n                        </div>\r\n                        <div class=\"ai-diff-body\" id=\"ai-diff-body\"></div>\r\n                        <div class=\"ai-diff-dismiss\" id=\"ai-diff-dismiss\">\r\n                            <span>Dismiss</span>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!-- Status Message -->\r\n                    <div id=\"status-message\" class=\"status-pill\"></div>\r\n\r\n                    <!-- Debug -->\r\n                    <div id=\"debug-section\">\r\n                        <details>\r\n                            <summary>\r\n                                <span id=\"chevron-icon\"></span>\r\n                                <span>Generated Code</span>\r\n                            </summary>\r\n                            <pre id=\"debug-code\"></pre>\r\n                        </details>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Toast Notification Container -->\r\n        <div id=\"toast-container\" class=\"toast-container\"></div>\r\n    </main>\r\n\r\n    <section id=\"sideload-msg\" class=\"sideload-container\">\r\n        <div class=\"sideload-skeleton\">\r\n            <div class=\"sk-header\">\r\n                <div class=\"sk-brand\">\r\n                    <div class=\"sk-logo sk-shimmer\"></div>\r\n                    <div class=\"sk-title sk-shimmer\"></div>\r\n                </div>\r\n                <div class=\"sk-header-actions\">\r\n                    <div class=\"sk-icon-btn sk-shimmer\"></div>\r\n                    <div class=\"sk-icon-btn sk-shimmer\"></div>\r\n                </div>\r\n            </div>\r\n            <div style=\"padding: 0 16px;\">\r\n                <div class=\"sk-mode-toggle\">\r\n                    <div class=\"sk-mode-tab sk-shimmer\"></div>\r\n                    <div class=\"sk-mode-tab sk-shimmer\"></div>\r\n                </div>\r\n            </div>\r\n            <div class=\"sk-welcome\">\r\n                <div class=\"sk-welcome-icon sk-shimmer\"></div>\r\n                <div class=\"sk-welcome-title sk-shimmer\"></div>\r\n                <div class=\"sk-welcome-desc sk-shimmer\"></div>\r\n                <div class=\"sk-welcome-desc short sk-shimmer\"></div>\r\n            </div>\r\n            <div class=\"sk-suggestions\">\r\n                <div class=\"sk-suggestion sk-shimmer\"></div>\r\n                <div class=\"sk-suggestion sk-shimmer\"></div>\r\n                <div class=\"sk-suggestion sk-shimmer\"></div>\r\n            </div>\r\n            <div class=\"sk-input-area\">\r\n                <div style=\"padding: 0 16px;\">\r\n                    <div class=\"sk-input sk-shimmer\"></div>\r\n                </div>\r\n            </div>\r\n            <div class=\"sideload-status\">\r\n                <div class=\"sideload-pulse\"></div>\r\n                <span id=\"loading-status\">Initializing DocOS AI...</span>\r\n            </div>\r\n        </div>\r\n    </section>\r\n\r\n    <template id=\"chat-skeleton-template\">\r\n        <div class=\"chat-msg ai skeleton-msg\">\r\n            <div class=\"chat-bubble skeleton-bubble\">\r\n                <div class=\"skeleton-line w80 sk-shimmer\"></div>\r\n                <div class=\"skeleton-line w60 sk-shimmer\"></div>\r\n                <div class=\"skeleton-line w40 sk-shimmer\"></div>\r\n            </div>\r\n        </div>\r\n    </template>\r\n\r\n    <!-- Fallback Script -->\r\n    <" + "script>\r\n        setTimeout(function () {\r\n            var app = document.getElementById(\"app-body\");\r\n            var fb = document.getElementById(\"debug-fallback\");\r\n            if ((!app || app.style.display === \"none\") && fb) {\r\n                fb.style.display = \"block\";\r\n            }\r\n        }, 30000);\r\n    <" + "/script>\r\n</body>\r\n\r\n</html>\r\n";
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