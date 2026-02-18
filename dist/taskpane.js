/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/services/llm.service.ts":
/*!*************************************!*\
  !*** ./src/services/llm.service.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   callLLM: function() { return /* binding */ callLLM; },
/* harmony export */   fetchOllamaModels: function() { return /* binding */ fetchOllamaModels; },
/* harmony export */   getConfig: function() { return /* binding */ getConfig; },
/* harmony export */   saveConfig: function() { return /* binding */ saveConfig; }
/* harmony export */ });
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * LLM Service — Abstraction layer for AI providers.
 * Supports: Groq (cloud), Ollama / LM Studio / any OpenAI-compatible local server.
 */

var DEFAULT_GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
var DEFAULT_LOCAL_URL = "http://localhost:11434/v1/chat/completions"; // Ollama default
var DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";
var DEFAULT_LOCAL_MODEL = "llama3";

/**
 * Get the saved LLM configuration from localStorage.
 */
function getConfig() {
  try {
    var saved = localStorage.getItem("sheetcraft_llm_config");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn("Failed to load LLM config from localStorage", e);
  }
  // Default: Groq with env key
  return {
    provider: "groq",
    apiKey: typeof process !== "undefined" && "MISSING_ENV_VAR" && "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" || "",
    baseUrl: DEFAULT_GROQ_URL,
    model: DEFAULT_GROQ_MODEL
  };
}

/**
 * Save LLM configuration to localStorage.
 */
function saveConfig(config) {
  localStorage.setItem("sheetcraft_llm_config", JSON.stringify(config));
}

/**
 * Call the configured LLM with the given messages.
 */
function callLLM(_x, _x2) {
  return _callLLM.apply(this, arguments);
}

/**
 * Fetch list of locally available Ollama models.
 * Ollama exposes GET http://localhost:11434/api/tags
 */
function _callLLM() {
  _callLLM = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(messages, config) {
    var cfg, url, headers, model, response, errorText, data, content;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          cfg = config || getConfig();
          headers = {
            "Content-Type": "application/json"
          };
          if (cfg.provider === "groq") {
            url = DEFAULT_GROQ_URL;
            if (cfg.apiKey) {
              headers["Authorization"] = "Bearer ".concat(cfg.apiKey);
            }
          } else {
            // Local provider (Ollama, LM Studio, etc.)
            url = cfg.baseUrl || DEFAULT_LOCAL_URL;
            if (cfg.apiKey) {
              headers["Authorization"] = "Bearer ".concat(cfg.apiKey);
            }
          }
          model = cfg.model || (cfg.provider === "groq" ? DEFAULT_GROQ_MODEL : DEFAULT_LOCAL_MODEL);
          _context.n = 1;
          return fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              messages: messages,
              model: model,
              temperature: 0.1,
              max_tokens: 2048
            })
          });
        case 1:
          response = _context.v;
          if (response.ok) {
            _context.n = 3;
            break;
          }
          _context.n = 2;
          return response.text();
        case 2:
          errorText = _context.v;
          console.error("LLM API Error:", response.status, errorText);
          throw new Error("AI Error (".concat(response.status, "): ").concat(errorText.substring(0, 200)));
        case 3:
          _context.n = 4;
          return response.json();
        case 4:
          data = _context.v;
          content = data.choices[0].message.content.trim(); // Clean up markdown fences
          content = content.replace(/^```(?:javascript|js|typescript|ts)?\n?/i, "");
          content = content.replace(/\n?```$/i, "");
          content = content.trim();

          // Remove accidental sheet redeclarations
          content = content.replace(/(?:const|let|var)\s+sheet\s*=\s*.*?;/g, "// sheet redeclaration removed");
          return _context.a(2, content);
      }
    }, _callee);
  }));
  return _callLLM.apply(this, arguments);
}
function fetchOllamaModels(_x3) {
  return _fetchOllamaModels.apply(this, arguments);
}
function _fetchOllamaModels() {
  _fetchOllamaModels = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(baseHost) {
    var host, url, response, data, _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          host = baseHost || "http://localhost:11434";
          url = "".concat(host, "/api/tags");
          _context2.p = 1;
          _context2.n = 2;
          return fetch(url, {
            method: "GET"
          });
        case 2:
          response = _context2.v;
          if (response.ok) {
            _context2.n = 3;
            break;
          }
          throw new Error("Ollama returned ".concat(response.status));
        case 3:
          _context2.n = 4;
          return response.json();
        case 4:
          data = _context2.v;
          return _context2.a(2, (data.models || []).map(function (m) {
            return {
              name: m.name,
              size: m.size || 0,
              modified_at: m.modified_at || ""
            };
          }));
        case 5:
          _context2.p = 5;
          _t = _context2.v;
          console.warn("Could not fetch Ollama models:", _t);
          return _context2.a(2, []);
      }
    }, _callee2, null, [[1, 5]]);
  }));
  return _fetchOllamaModels.apply(this, arguments);
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
 * System prompt for Excel JS code generation.
 * Extracted into its own module for maintainability.
 */
var SYSTEM_PROMPT = "\nYou are an expert Office JS (Excel JavaScript API) code generator.\nYou generate VALID JavaScript code that runs inside an `Excel.run(async (context) => { ... })` block.\n\n## ENVIRONMENT (already provided to you):\n- `context` \u2014 the RequestContext\n- `sheet` \u2014 `context.workbook.worksheets.getActiveWorksheet()`\n- `Excel` \u2014 the Excel namespace object (for enums like Excel.ChartType)\n\n## OUTPUT RULES:\n- Output ONLY executable JavaScript lines. No markdown, no explanation, no wrapping.\n- Do NOT redeclare `sheet`, `context`, or `Excel`.\n- Do NOT wrap code in `Excel.run` or `async function`.\n\n## \uD83D\uDEAB BANNED PATTERNS (will cause runtime errors):\n1. `chart.setTitle(...)` \u2192 Use `chart.title.text = \"...\"`\n2. `range.setValues(...)` \u2192 Use `range.values = [...]`\n3. `range.setNumberFormat(...)` \u2192 Use `range.numberFormat = [...]`\n4. `range.activate()` \u2192 Use `range.select()`\n5. `range.getColumnCount()`, `range.getRowCount()`, `range.getLastRow()`, `range.getLastColumn()` \u2192 These DO NOT EXIST.\n6. `SpreadsheetApp`, `activeSheet`, `getActiveSpreadsheet()` \u2192 This is NOT Google Apps Script.\n7. `chart.setPosition(...)` \u2192 Use `chart.setPosition(\"D2\", \"J20\")` (string cell references only).\n\n## \uD83D\uDD34 CRITICAL \u2014 PROPERTY LOADING RULE:\nIn Office JS, you CANNOT read a property value from an object unless you first call `.load(\"propertyName\")` and then `await context.sync()`.\n**If you do NOT need to READ a property, do NOT load it.**\n**AVOID reading properties whenever possible.** Prefer writing/setting values directly.\n\n### Example of CORRECT property reading (only when absolutely necessary):\n```javascript\nconst usedRange = sheet.getUsedRange();\nusedRange.load(\"address, values, rowCount, columnCount\");\nawait context.sync();\n// NOW you can read: usedRange.address, usedRange.values, etc.\n```\n\n### WRONG (will crash):\n```javascript\nconst usedRange = sheet.getUsedRange();\nconsole.log(usedRange.address); // ERROR: property not loaded!\n```\n\n## \u2705 REQUIRED PATTERNS:\n\n### 1. Writing Data (Tables/Lists):\n```javascript\nconst data = [\n  [\"Product\", \"Quantity\", \"Price\"],\n  [\"Widget A\", 50, 9.99],\n  [\"Widget B\", 30, 14.99]\n];\nconst startCell = sheet.getRange(\"A1\");\nconst targetRange = startCell.getResizedRange(data.length - 1, data[0].length - 1);\ntargetRange.values = data;\ntargetRange.format.autofitColumns();\ntargetRange.getRow(0).format.font.bold = true;\ntargetRange.getRow(0).format.fill.color = \"#4472C4\";\ntargetRange.getRow(0).format.font.color = \"#FFFFFF\";\ntargetRange.select();\n```\n\n### 2. Creating Charts (NO property reads needed):\n```javascript\n// Assume data already exists in A1:B6\nconst sourceRange = sheet.getRange(\"A1:B6\");\nconst chart = sheet.charts.add(Excel.ChartType.columnClustered, sourceRange, Excel.ChartSeriesBy.auto);\nchart.title.text = \"My Chart Title\";\nchart.legend.position = Excel.ChartLegendPosition.bottom;\nchart.setPosition(\"D2\", \"K15\");\nawait context.sync();\n```\n\n### 3. Formulas (single cell):\n```javascript\nsheet.getRange(\"D1\").values = [[\"Total\"]];\nsheet.getRange(\"D2\").formulas = [[\"=SUM(B2:B100)\"]];\n```\n\n### 4. Formatting existing data:\n```javascript\nconst dataRange = sheet.getUsedRange();\ndataRange.format.autofitColumns();\ndataRange.format.autofitRows();\nconst headerRow = dataRange.getRow(0);\nheaderRow.format.font.bold = true;\nheaderRow.format.fill.color = \"#4472C4\";\nheaderRow.format.font.color = \"#FFFFFF\";\ndataRange.format.borders.getItem(\"InsideHorizontal\").style = \"Continuous\";\ndataRange.format.borders.getItem(\"InsideVertical\").style = \"Continuous\";\ndataRange.format.borders.getItem(\"EdgeBottom\").style = \"Continuous\";\ndataRange.format.borders.getItem(\"EdgeLeft\").style = \"Continuous\";\ndataRange.format.borders.getItem(\"EdgeRight\").style = \"Continuous\";\ndataRange.format.borders.getItem(\"EdgeTop\").style = \"Continuous\";\ndataRange.select();\n```\n\n### 5. Reading existing data (MUST load first):\n```javascript\nconst usedRange = sheet.getUsedRange();\nusedRange.load(\"values, rowCount, columnCount\");\nawait context.sync();\nconst rows = usedRange.rowCount;\nconst cols = usedRange.columnCount;\nconst values = usedRange.values;\n// Now use rows, cols, values...\n```\n\n## General Tips:\n- Use `Excel.ChartType.columnClustered`, `Excel.ChartType.line`, `Excel.ChartType.pie`, etc. for chart types.\n- Use `Excel.ChartSeriesBy.auto` for automatic series detection.\n- When the user says \"create a chart from data\", assume data is already in the sheet and reference it by range.\n- Always call `await context.sync()` after loading properties.\n- For dynamic data you CREATE, use `data.length` and `data[0].length` \u2014 never try to read range dimensions.\n\nUser Prompt:\n";

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/taskpane/taskpane.css":
/*!*************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/taskpane/taskpane.css ***!
  \*************************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2371717a%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E */ "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2371717a%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* \n * SheetCraft AI - Adaptive Clean & Minimal Theme\n * Design System: Refined Zinc / Inter\n * Adapts to Light/Dark via prefers-color-scheme\n */\n\n:root {\n    --bg-color: #ffffff;\n    --app-surface: #ffffff;\n    --card-bg: #ffffff;\n    --card-border: #e4e4e7;\n    --input-bg: #fafafa;\n    --input-border: #d4d4d8;\n    --primary: #2563eb;\n    --primary-hover: #1d4ed8;\n    --primary-bg: #eff6ff;\n    --text-primary: #18181b;\n    --text-secondary: #71717a;\n    --success: #10b981;\n    --success-bg: #ecfdf5;\n    --error: #ef4444;\n    --error-bg: #fef2f2;\n    --radius: 8px;\n    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n    --font-mono: 'JetBrains Mono', 'Menlo', monospace;\n}\n\n@media (prefers-color-scheme: dark) {\n    :root {\n        --bg-color: #09090b;\n        --app-surface: #09090b;\n        --card-bg: #18181b;\n        --card-border: #27272a;\n        --input-bg: #18181b;\n        --input-border: #3f3f46;\n        --primary: #3b82f6;\n        --primary-hover: #60a5fa;\n        --primary-bg: rgba(59, 130, 246, 0.1);\n        --text-primary: #fafafa;\n        --text-secondary: #a1a1aa;\n        --success: #34d399;\n        --success-bg: rgba(16, 185, 129, 0.1);\n        --error: #f87171;\n        --error-bg: rgba(239, 68, 68, 0.1);\n        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);\n    }\n}\n\n/* ─── Reset ─────────────────────────────────────────── */\n*, *::before, *::after { box-sizing: border-box; }\n\nhtml, body {\n    width: 100%;\n    height: 100%;\n    margin: 0;\n    padding: 0;\n    font-family: var(--font-sans);\n    background-color: var(--bg-color);\n    color: var(--text-primary);\n    -webkit-font-smoothing: antialiased;\n    overflow-x: hidden;\n}\n\n/* ─── Layout ────────────────────────────────────────── */\n#app-body {\n    display: flex;\n    flex-direction: column;\n    height: 100vh;\n}\n\n/* ─── Header ────────────────────────────────────────── */\n.app-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 14px 20px;\n    background: var(--app-surface);\n    border-bottom: 1px solid var(--card-border);\n    position: sticky;\n    top: 0;\n    z-index: 10;\n}\n\n.brand {\n    display: flex;\n    align-items: center;\n    gap: 10px;\n}\n\n.logo {\n    width: 32px;\n    height: 32px;\n    color: var(--primary);\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.brand h1 {\n    font-size: 16px;\n    font-weight: 600;\n    margin: 0;\n    letter-spacing: -0.01em;\n}\n\n.highlight-text {\n    color: var(--primary);\n}\n\n/* Icon button (settings gear) */\n.btn-icon {\n    width: 36px;\n    height: 36px;\n    border: 1px solid var(--card-border);\n    border-radius: var(--radius);\n    background: var(--card-bg);\n    color: var(--text-secondary);\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    transition: color 0.2s, border-color 0.2s;\n}\n\n.btn-icon:hover {\n    color: var(--text-primary);\n    border-color: var(--text-secondary);\n}\n\n/* ─── Settings Panel ────────────────────────────────── */\n.settings-panel {\n    padding: 20px;\n    background: var(--card-bg);\n    border-bottom: 1px solid var(--card-border);\n    animation: slideDown 0.2s ease;\n}\n\n.settings-panel h3 {\n    font-size: 13px;\n    font-weight: 600;\n    text-transform: uppercase;\n    letter-spacing: 0.05em;\n    color: var(--text-secondary);\n    margin: 0 0 16px 0;\n}\n\n.form-group {\n    margin-bottom: 14px;\n}\n\n.form-group label {\n    display: block;\n    font-size: 12px;\n    font-weight: 500;\n    color: var(--text-secondary);\n    margin-bottom: 6px;\n}\n\n.form-input {\n    width: 100%;\n    padding: 8px 12px;\n    font-size: 13px;\n    font-family: var(--font-sans);\n    color: var(--text-primary);\n    background: var(--input-bg);\n    border: 1px solid var(--card-border);\n    border-radius: 6px;\n    outline: none;\n    transition: border-color 0.2s;\n}\n\n.form-input:focus {\n    border-color: var(--primary);\n}\n\nselect.form-input {\n    cursor: pointer;\n    appearance: none;\n    background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n    background-repeat: no-repeat;\n    background-position: right 10px center;\n    padding-right: 30px;\n}\n\n.btn-save {\n    width: 100%;\n    justify-content: center;\n    margin-top: 8px;\n}\n\n/* Model selector row */\n.model-select-wrapper {\n    display: flex;\n    gap: 6px;\n    align-items: center;\n}\n\n.model-select-wrapper .form-input {\n    flex: 1;\n    min-width: 0;\n}\n\n.btn-refresh {\n    width: 32px;\n    height: 32px;\n    flex-shrink: 0;\n    padding: 0;\n}\n\n.btn-refresh:active svg {\n    animation: spin 0.5s ease;\n}\n\n.model-status {\n    font-size: 11px;\n    margin-top: 4px;\n    min-height: 16px;\n    color: var(--text-secondary);\n}\n\n.model-status-ok {\n    color: var(--success);\n}\n\n.model-status-warn {\n    color: var(--error);\n}\n\n/* ─── Content ───────────────────────────────────────── */\n.content-wrapper {\n    flex: 1;\n    padding: 20px;\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    width: 100%;\n}\n\n/* ─── Input Card ────────────────────────────────────── */\n.input-card {\n    background: var(--card-bg);\n    border: 1px solid var(--card-border);\n    border-radius: var(--radius);\n    display: flex;\n    flex-direction: column;\n    box-shadow: var(--shadow-sm);\n    overflow: hidden;\n    transition: border-color 0.2s;\n}\n\n.input-card:focus-within {\n    border-color: var(--primary);\n}\n\ntextarea {\n    width: 100%;\n    min-height: 100px;\n    padding: 14px 16px;\n    background: transparent;\n    border: none;\n    color: var(--text-primary);\n    font-family: var(--font-sans);\n    font-size: 14px;\n    line-height: 1.6;\n    resize: vertical;\n    outline: none;\n}\n\ntextarea::placeholder {\n    color: var(--text-secondary);\n    opacity: 0.7;\n}\n\n.card-footer {\n    padding: 10px 14px;\n    border-top: 1px solid var(--card-border);\n    display: flex;\n    justify-content: flex-end;\n    align-items: center;\n}\n\n/* ─── Primary Button ────────────────────────────────── */\n.btn-primary {\n    background: var(--primary);\n    color: white;\n    border: none;\n    padding: 8px 16px;\n    border-radius: 6px;\n    font-size: 13px;\n    font-weight: 500;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    transition: background-color 0.15s, opacity 0.15s;\n}\n\n.btn-primary:hover {\n    background: var(--primary-hover);\n}\n\n.btn-primary:active {\n    opacity: 0.9;\n}\n\n.btn-primary:disabled {\n    opacity: 0.6;\n    cursor: not-allowed;\n}\n\n.btn-primary svg {\n    width: 14px;\n    height: 14px;\n}\n\n/* ─── Status Pill ───────────────────────────────────── */\n.status-pill {\n    padding: 10px 14px;\n    border-radius: 6px;\n    font-size: 13px;\n    font-weight: 500;\n    display: none;\n    align-items: center;\n    gap: 8px;\n    animation: fadeIn 0.25s ease;\n    border: 1px solid transparent;\n}\n\n.status-pill.info {\n    background: var(--primary-bg);\n    color: var(--primary);\n    border-color: rgba(37, 99, 235, 0.15);\n}\n\n.status-pill.success {\n    background: var(--success-bg);\n    color: var(--success);\n    border-color: rgba(16, 185, 129, 0.15);\n}\n\n.status-pill.error {\n    background: var(--error-bg);\n    color: var(--error);\n    border-color: rgba(239, 68, 68, 0.15);\n}\n\n/* ─── Spinners ──────────────────────────────────────── */\n.spinner {\n    width: 14px;\n    height: 14px;\n    border: 2px solid transparent;\n    border-radius: 50%;\n    border-top-color: currentColor;\n    border-right-color: currentColor;\n    animation: spin 0.7s linear infinite;\n}\n\n.btn-spinner {\n    width: 14px;\n    height: 14px;\n    border: 2px solid rgba(255, 255, 255, 0.3);\n    border-radius: 50%;\n    border-top-color: white;\n    animation: spin 0.7s linear infinite;\n    display: inline-block;\n}\n\n/* ─── Debug Section ─────────────────────────────────── */\n#debug-section {\n    margin-top: auto;\n    padding-top: 16px;\n}\n\ndetails {\n    background: transparent;\n    border: none;\n    border-radius: var(--radius);\n}\n\nsummary {\n    padding: 6px 0;\n    cursor: pointer;\n    font-size: 12px;\n    font-weight: 500;\n    color: var(--text-secondary);\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    list-style: none;\n    user-select: none;\n    transition: color 0.2s;\n}\n\nsummary::-webkit-details-marker {\n    display: none;\n}\n\nsummary:hover {\n    color: var(--text-primary);\n}\n\ndetails[open] summary svg.chevron {\n    transform: rotate(180deg);\n}\n\nsvg.chevron {\n    transition: transform 0.2s;\n    opacity: 0.6;\n}\n\ndetails[open] summary {\n    margin-bottom: 6px;\n}\n\npre {\n    margin: 0;\n    padding: 12px;\n    background: var(--input-bg);\n    color: var(--text-secondary);\n    font-family: var(--font-mono);\n    font-size: 11px;\n    overflow-x: auto;\n    border: 1px solid var(--card-border);\n    border-radius: 6px;\n    line-height: 1.5;\n    white-space: pre-wrap;\n    word-break: break-all;\n}\n\n/* ─── Sideload Screen ───────────────────────────────── */\n.sideload-container {\n    height: 100vh;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    background: var(--bg-color);\n    color: var(--text-secondary);\n    gap: 16px;\n}\n\n.sideload-container .spinner {\n    width: 28px;\n    height: 28px;\n    border-width: 3px;\n}\n\n.sideload-container h2 {\n    font-size: 14px;\n    font-weight: 500;\n    margin: 0;\n}\n\n/* ─── Keyframes ─────────────────────────────────────── */\n@keyframes fadeIn {\n    from { opacity: 0; transform: translateY(4px); }\n    to { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes slideDown {\n    from { opacity: 0; transform: translateY(-8px); }\n    to { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes spin {\n    to { transform: rotate(360deg); }\n}\n\n/* ─── Scrollbar ─────────────────────────────────────── */\n::-webkit-scrollbar {\n    width: 6px;\n    height: 6px;\n}\n::-webkit-scrollbar-track {\n    background: transparent;\n}\n::-webkit-scrollbar-thumb {\n    background: var(--card-border);\n    border-radius: 3px;\n}\n::-webkit-scrollbar-thumb:hover {\n    background: var(--text-secondary);\n}", "",{"version":3,"sources":["webpack://./src/taskpane/taskpane.css"],"names":[],"mappings":"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","sourcesContent":["/* \n * SheetCraft AI - Adaptive Clean & Minimal Theme\n * Design System: Refined Zinc / Inter\n * Adapts to Light/Dark via prefers-color-scheme\n */\n\n:root {\n    --bg-color: #ffffff;\n    --app-surface: #ffffff;\n    --card-bg: #ffffff;\n    --card-border: #e4e4e7;\n    --input-bg: #fafafa;\n    --input-border: #d4d4d8;\n    --primary: #2563eb;\n    --primary-hover: #1d4ed8;\n    --primary-bg: #eff6ff;\n    --text-primary: #18181b;\n    --text-secondary: #71717a;\n    --success: #10b981;\n    --success-bg: #ecfdf5;\n    --error: #ef4444;\n    --error-bg: #fef2f2;\n    --radius: 8px;\n    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n    --font-mono: 'JetBrains Mono', 'Menlo', monospace;\n}\n\n@media (prefers-color-scheme: dark) {\n    :root {\n        --bg-color: #09090b;\n        --app-surface: #09090b;\n        --card-bg: #18181b;\n        --card-border: #27272a;\n        --input-bg: #18181b;\n        --input-border: #3f3f46;\n        --primary: #3b82f6;\n        --primary-hover: #60a5fa;\n        --primary-bg: rgba(59, 130, 246, 0.1);\n        --text-primary: #fafafa;\n        --text-secondary: #a1a1aa;\n        --success: #34d399;\n        --success-bg: rgba(16, 185, 129, 0.1);\n        --error: #f87171;\n        --error-bg: rgba(239, 68, 68, 0.1);\n        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);\n    }\n}\n\n/* ─── Reset ─────────────────────────────────────────── */\n*, *::before, *::after { box-sizing: border-box; }\n\nhtml, body {\n    width: 100%;\n    height: 100%;\n    margin: 0;\n    padding: 0;\n    font-family: var(--font-sans);\n    background-color: var(--bg-color);\n    color: var(--text-primary);\n    -webkit-font-smoothing: antialiased;\n    overflow-x: hidden;\n}\n\n/* ─── Layout ────────────────────────────────────────── */\n#app-body {\n    display: flex;\n    flex-direction: column;\n    height: 100vh;\n}\n\n/* ─── Header ────────────────────────────────────────── */\n.app-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 14px 20px;\n    background: var(--app-surface);\n    border-bottom: 1px solid var(--card-border);\n    position: sticky;\n    top: 0;\n    z-index: 10;\n}\n\n.brand {\n    display: flex;\n    align-items: center;\n    gap: 10px;\n}\n\n.logo {\n    width: 32px;\n    height: 32px;\n    color: var(--primary);\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.brand h1 {\n    font-size: 16px;\n    font-weight: 600;\n    margin: 0;\n    letter-spacing: -0.01em;\n}\n\n.highlight-text {\n    color: var(--primary);\n}\n\n/* Icon button (settings gear) */\n.btn-icon {\n    width: 36px;\n    height: 36px;\n    border: 1px solid var(--card-border);\n    border-radius: var(--radius);\n    background: var(--card-bg);\n    color: var(--text-secondary);\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    transition: color 0.2s, border-color 0.2s;\n}\n\n.btn-icon:hover {\n    color: var(--text-primary);\n    border-color: var(--text-secondary);\n}\n\n/* ─── Settings Panel ────────────────────────────────── */\n.settings-panel {\n    padding: 20px;\n    background: var(--card-bg);\n    border-bottom: 1px solid var(--card-border);\n    animation: slideDown 0.2s ease;\n}\n\n.settings-panel h3 {\n    font-size: 13px;\n    font-weight: 600;\n    text-transform: uppercase;\n    letter-spacing: 0.05em;\n    color: var(--text-secondary);\n    margin: 0 0 16px 0;\n}\n\n.form-group {\n    margin-bottom: 14px;\n}\n\n.form-group label {\n    display: block;\n    font-size: 12px;\n    font-weight: 500;\n    color: var(--text-secondary);\n    margin-bottom: 6px;\n}\n\n.form-input {\n    width: 100%;\n    padding: 8px 12px;\n    font-size: 13px;\n    font-family: var(--font-sans);\n    color: var(--text-primary);\n    background: var(--input-bg);\n    border: 1px solid var(--card-border);\n    border-radius: 6px;\n    outline: none;\n    transition: border-color 0.2s;\n}\n\n.form-input:focus {\n    border-color: var(--primary);\n}\n\nselect.form-input {\n    cursor: pointer;\n    appearance: none;\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\");\n    background-repeat: no-repeat;\n    background-position: right 10px center;\n    padding-right: 30px;\n}\n\n.btn-save {\n    width: 100%;\n    justify-content: center;\n    margin-top: 8px;\n}\n\n/* Model selector row */\n.model-select-wrapper {\n    display: flex;\n    gap: 6px;\n    align-items: center;\n}\n\n.model-select-wrapper .form-input {\n    flex: 1;\n    min-width: 0;\n}\n\n.btn-refresh {\n    width: 32px;\n    height: 32px;\n    flex-shrink: 0;\n    padding: 0;\n}\n\n.btn-refresh:active svg {\n    animation: spin 0.5s ease;\n}\n\n.model-status {\n    font-size: 11px;\n    margin-top: 4px;\n    min-height: 16px;\n    color: var(--text-secondary);\n}\n\n.model-status-ok {\n    color: var(--success);\n}\n\n.model-status-warn {\n    color: var(--error);\n}\n\n/* ─── Content ───────────────────────────────────────── */\n.content-wrapper {\n    flex: 1;\n    padding: 20px;\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    width: 100%;\n}\n\n/* ─── Input Card ────────────────────────────────────── */\n.input-card {\n    background: var(--card-bg);\n    border: 1px solid var(--card-border);\n    border-radius: var(--radius);\n    display: flex;\n    flex-direction: column;\n    box-shadow: var(--shadow-sm);\n    overflow: hidden;\n    transition: border-color 0.2s;\n}\n\n.input-card:focus-within {\n    border-color: var(--primary);\n}\n\ntextarea {\n    width: 100%;\n    min-height: 100px;\n    padding: 14px 16px;\n    background: transparent;\n    border: none;\n    color: var(--text-primary);\n    font-family: var(--font-sans);\n    font-size: 14px;\n    line-height: 1.6;\n    resize: vertical;\n    outline: none;\n}\n\ntextarea::placeholder {\n    color: var(--text-secondary);\n    opacity: 0.7;\n}\n\n.card-footer {\n    padding: 10px 14px;\n    border-top: 1px solid var(--card-border);\n    display: flex;\n    justify-content: flex-end;\n    align-items: center;\n}\n\n/* ─── Primary Button ────────────────────────────────── */\n.btn-primary {\n    background: var(--primary);\n    color: white;\n    border: none;\n    padding: 8px 16px;\n    border-radius: 6px;\n    font-size: 13px;\n    font-weight: 500;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    transition: background-color 0.15s, opacity 0.15s;\n}\n\n.btn-primary:hover {\n    background: var(--primary-hover);\n}\n\n.btn-primary:active {\n    opacity: 0.9;\n}\n\n.btn-primary:disabled {\n    opacity: 0.6;\n    cursor: not-allowed;\n}\n\n.btn-primary svg {\n    width: 14px;\n    height: 14px;\n}\n\n/* ─── Status Pill ───────────────────────────────────── */\n.status-pill {\n    padding: 10px 14px;\n    border-radius: 6px;\n    font-size: 13px;\n    font-weight: 500;\n    display: none;\n    align-items: center;\n    gap: 8px;\n    animation: fadeIn 0.25s ease;\n    border: 1px solid transparent;\n}\n\n.status-pill.info {\n    background: var(--primary-bg);\n    color: var(--primary);\n    border-color: rgba(37, 99, 235, 0.15);\n}\n\n.status-pill.success {\n    background: var(--success-bg);\n    color: var(--success);\n    border-color: rgba(16, 185, 129, 0.15);\n}\n\n.status-pill.error {\n    background: var(--error-bg);\n    color: var(--error);\n    border-color: rgba(239, 68, 68, 0.15);\n}\n\n/* ─── Spinners ──────────────────────────────────────── */\n.spinner {\n    width: 14px;\n    height: 14px;\n    border: 2px solid transparent;\n    border-radius: 50%;\n    border-top-color: currentColor;\n    border-right-color: currentColor;\n    animation: spin 0.7s linear infinite;\n}\n\n.btn-spinner {\n    width: 14px;\n    height: 14px;\n    border: 2px solid rgba(255, 255, 255, 0.3);\n    border-radius: 50%;\n    border-top-color: white;\n    animation: spin 0.7s linear infinite;\n    display: inline-block;\n}\n\n/* ─── Debug Section ─────────────────────────────────── */\n#debug-section {\n    margin-top: auto;\n    padding-top: 16px;\n}\n\ndetails {\n    background: transparent;\n    border: none;\n    border-radius: var(--radius);\n}\n\nsummary {\n    padding: 6px 0;\n    cursor: pointer;\n    font-size: 12px;\n    font-weight: 500;\n    color: var(--text-secondary);\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    list-style: none;\n    user-select: none;\n    transition: color 0.2s;\n}\n\nsummary::-webkit-details-marker {\n    display: none;\n}\n\nsummary:hover {\n    color: var(--text-primary);\n}\n\ndetails[open] summary svg.chevron {\n    transform: rotate(180deg);\n}\n\nsvg.chevron {\n    transition: transform 0.2s;\n    opacity: 0.6;\n}\n\ndetails[open] summary {\n    margin-bottom: 6px;\n}\n\npre {\n    margin: 0;\n    padding: 12px;\n    background: var(--input-bg);\n    color: var(--text-secondary);\n    font-family: var(--font-mono);\n    font-size: 11px;\n    overflow-x: auto;\n    border: 1px solid var(--card-border);\n    border-radius: 6px;\n    line-height: 1.5;\n    white-space: pre-wrap;\n    word-break: break-all;\n}\n\n/* ─── Sideload Screen ───────────────────────────────── */\n.sideload-container {\n    height: 100vh;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    background: var(--bg-color);\n    color: var(--text-secondary);\n    gap: 16px;\n}\n\n.sideload-container .spinner {\n    width: 28px;\n    height: 28px;\n    border-width: 3px;\n}\n\n.sideload-container h2 {\n    font-size: 14px;\n    font-weight: 500;\n    margin: 0;\n}\n\n/* ─── Keyframes ─────────────────────────────────────── */\n@keyframes fadeIn {\n    from { opacity: 0; transform: translateY(4px); }\n    to { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes slideDown {\n    from { opacity: 0; transform: translateY(-8px); }\n    to { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes spin {\n    to { transform: rotate(360deg); }\n}\n\n/* ─── Scrollbar ─────────────────────────────────────── */\n::-webkit-scrollbar {\n    width: 6px;\n    height: 6px;\n}\n::-webkit-scrollbar-track {\n    background: transparent;\n}\n::-webkit-scrollbar-thumb {\n    background: var(--card-border);\n    border-radius: 3px;\n}\n::-webkit-scrollbar-thumb:hover {\n    background: var(--text-secondary);\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ (function(module) {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ (function(module) {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ (function(module) {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/taskpane/taskpane.css":
/*!***********************************!*\
  !*** ./src/taskpane/taskpane.css ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_taskpane_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./taskpane.css */ "./node_modules/css-loader/dist/cjs.js!./src/taskpane/taskpane.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_taskpane_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_taskpane_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_taskpane_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_taskpane_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ (function(module) {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ (function(module) {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ (function(module) {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ (function(module) {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ (function(module) {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2371717a%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2371717a%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E ***!
  \***************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module) {

module.exports = "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2371717a%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E";

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
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
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	!function() {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
!function() {
var __webpack_exports__ = {};
/*!**********************************!*\
  !*** ./src/taskpane/taskpane.ts ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runAICommand: function() { return /* binding */ runAICommand; }
/* harmony export */ });
/* harmony import */ var _taskpane_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./taskpane.css */ "./src/taskpane/taskpane.css");
/* harmony import */ var _services_prompt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/prompt */ "./src/services/prompt.ts");
/* harmony import */ var _services_llm_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/llm.service */ "./src/services/llm.service.ts");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/* global console, document, Excel, Office */




// ─── Initialization ────────────────────────────────────────────
Office.onReady(function (info) {
  if (info.host === Office.HostType.Excel) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("app-body").style.flexDirection = "column";

    // Wire up main action
    document.getElementById("run").onclick = runAICommand;

    // Wire up settings
    document.getElementById("settings-toggle").onclick = toggleSettings;
    document.getElementById("save-settings").onclick = handleSaveSettings;
    document.getElementById("refresh-models").onclick = function () {
      return loadOllamaModels();
    };

    // Load existing config into settings form
    loadSettingsUI();
  }
});

// ─── Settings Panel ────────────────────────────────────────────
function toggleSettings() {
  var panel = document.getElementById("settings-panel");
  var isHidden = panel.style.display === "none" || panel.style.display === "";
  panel.style.display = isHidden ? "block" : "none";

  // Auto-fetch models when opening and provider is local
  if (isHidden) {
    var provider = document.getElementById("setting-provider").value;
    if (provider === "local") {
      loadOllamaModels();
    }
  }
}
function loadSettingsUI() {
  var config = (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_2__.getConfig)();
  var providerSelect = document.getElementById("setting-provider");
  var apiKeyInput = document.getElementById("setting-api-key");
  var baseUrlInput = document.getElementById("setting-base-url");
  var groqModelInput = document.getElementById("setting-groq-model");
  providerSelect.value = config.provider;
  apiKeyInput.value = config.apiKey || "";
  baseUrlInput.value = config.baseUrl || "";
  groqModelInput.value = config.model || "";

  // Toggle provider-specific fields
  updateProviderFields(config.provider);
  providerSelect.onchange = function () {
    var newProvider = providerSelect.value;
    updateProviderFields(newProvider);
    if (newProvider === "local") {
      loadOllamaModels();
    }
  };
}
function updateProviderFields(provider) {
  var groqFields = document.getElementById("groq-fields");
  var localFields = document.getElementById("local-fields");
  groqFields.style.display = provider === "groq" ? "block" : "none";
  localFields.style.display = provider === "local" ? "block" : "none";
}
function loadOllamaModels() {
  return _loadOllamaModels.apply(this, arguments);
}
function _loadOllamaModels() {
  _loadOllamaModels = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var select, statusEl, baseUrlInput, host, models, config;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          select = document.getElementById("setting-local-model");
          statusEl = document.getElementById("model-status");
          baseUrlInput = document.getElementById("setting-base-url");
          host = baseUrlInput.value.trim() || "http://localhost:11434"; // Show loading
          select.innerHTML = "<option value=\"\" disabled selected>Loading...</option>";
          statusEl.textContent = "";
          statusEl.className = "model-status";
          _context.n = 1;
          return (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_2__.fetchOllamaModels)(host);
        case 1:
          models = _context.v;
          if (!(models.length === 0)) {
            _context.n = 2;
            break;
          }
          select.innerHTML = "<option value=\"\" disabled selected>No models found</option>";
          statusEl.textContent = "⚠ Ollama not running or no models downloaded";
          statusEl.className = "model-status model-status-warn";
          return _context.a(2);
        case 2:
          // Populate dropdown
          config = (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_2__.getConfig)();
          select.innerHTML = "";
          models.forEach(function (m) {
            var option = document.createElement("option");
            option.value = m.name;
            var sizeGB = (m.size / 1e9).toFixed(1);
            option.textContent = "".concat(m.name, " (").concat(sizeGB, "GB)");
            if (config.model === m.name) {
              option.selected = true;
            }
            select.appendChild(option);
          });
          statusEl.textContent = "".concat(models.length, " model").concat(models.length > 1 ? "s" : "", " available");
          statusEl.className = "model-status model-status-ok";
        case 3:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _loadOllamaModels.apply(this, arguments);
}
function handleSaveSettings() {
  var providerSelect = document.getElementById("setting-provider");
  var provider = providerSelect.value;
  var config;
  if (provider === "groq") {
    var apiKeyInput = document.getElementById("setting-api-key");
    var groqModelInput = document.getElementById("setting-groq-model");
    config = {
      provider: "groq",
      apiKey: apiKeyInput.value.trim(),
      model: groqModelInput.value.trim() || "llama-3.3-70b-versatile"
    };
  } else {
    var baseUrlInput = document.getElementById("setting-base-url");
    var localModelSelect = document.getElementById("setting-local-model");
    var host = baseUrlInput.value.trim() || "http://localhost:11434";
    config = {
      provider: "local",
      baseUrl: "".concat(host, "/v1/chat/completions"),
      model: localModelSelect.value
    };
  }
  (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_2__.saveConfig)(config);

  // Visual feedback
  var btn = document.getElementById("save-settings");
  btn.textContent = "Saved ✓";
  setTimeout(function () {
    btn.textContent = "Save";
  }, 1500);

  // Close panel
  setTimeout(function () {
    document.getElementById("settings-panel").style.display = "none";
  }, 800);
}

// ─── Main Command Runner ───────────────────────────────────────
function runAICommand() {
  return _runAICommand.apply(this, arguments);
}

// ─── Helpers ───────────────────────────────────────────────────
function _runAICommand() {
  _runAICommand = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var statusElement, debugElement, promptInput, button, userPrompt, originalButtonHTML, generatedCode, _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          statusElement = document.getElementById("status-message");
          debugElement = document.getElementById("debug-code");
          promptInput = document.getElementById("prompt-input");
          button = document.getElementById("run");
          userPrompt = promptInput.value.trim();
          if (userPrompt) {
            _context2.n = 1;
            break;
          }
          showStatus(statusElement, "info", "Please enter a command.");
          return _context2.a(2);
        case 1:
          // UI: Show loading state
          originalButtonHTML = button.innerHTML;
          button.disabled = true;
          button.innerHTML = "<span class=\"btn-spinner\"></span><span>Generating...</span>";
          showStatus(statusElement, "info", '<div class="spinner"></div><span>Thinking...</span>');
          debugElement.innerText = "";
          _context2.p = 2;
          _context2.n = 3;
          return (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_2__.callLLM)([{
            role: "system",
            content: _services_prompt__WEBPACK_IMPORTED_MODULE_1__.SYSTEM_PROMPT
          }, {
            role: "user",
            content: userPrompt
          }]);
        case 3:
          generatedCode = _context2.v;
          debugElement.innerText = generatedCode;

          // 2. Execute in Excel
          button.innerHTML = "<span class=\"btn-spinner\"></span><span>Running...</span>";
          showStatus(statusElement, "info", '<div class="spinner"></div><span>Executing in Excel...</span>');
          _context2.n = 4;
          return executeExcelCode(generatedCode);
        case 4:
          // 3. Success
          showStatus(statusElement, "success", "\n      <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M20 6L9 17l-5-5\"/></svg>\n      <span>Done</span>\n    ");
          _context2.n = 6;
          break;
        case 5:
          _context2.p = 5;
          _t = _context2.v;
          console.error(_t);
          showStatus(statusElement, "error", "\n      <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"/></svg>\n      <span>".concat(_t.message, "</span>\n    "));
        case 6:
          _context2.p = 6;
          button.disabled = false;
          button.innerHTML = originalButtonHTML;
          return _context2.f(6);
        case 7:
          return _context2.a(2);
      }
    }, _callee2, null, [[2, 5, 6, 7]]);
  }));
  return _runAICommand.apply(this, arguments);
}
function showStatus(el, type, html) {
  el.innerHTML = html;
  el.className = "status-pill ".concat(type);
  el.style.display = "flex";
}
function executeExcelCode(_x) {
  return _executeExcelCode.apply(this, arguments);
}
function _executeExcelCode() {
  _executeExcelCode = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(code) {
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return Excel.run(/*#__PURE__*/function () {
            var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(context) {
              var sheet, _t2;
              return _regenerator().w(function (_context3) {
                while (1) switch (_context3.p = _context3.n) {
                  case 0:
                    sheet = context.workbook.worksheets.getActiveWorksheet();
                    _context3.p = 1;
                    _context3.n = 2;
                    return new Function("context", "sheet", "Excel", "return (async () => { ".concat(code, "\nawait context.sync(); })()"))(context, sheet, Excel);
                  case 2:
                    _context3.n = 4;
                    break;
                  case 3:
                    _context3.p = 3;
                    _t2 = _context3.v;
                    console.error("Execution Error:", _t2);
                    throw _t2;
                  case 4:
                    _context3.n = 5;
                    return context.sync();
                  case 5:
                    return _context3.a(2);
                }
              }, _callee3, null, [[1, 3]]);
            }));
            return function (_x2) {
              return _ref.apply(this, arguments);
            };
          }());
        case 1:
          return _context4.a(2);
      }
    }, _callee4);
  }));
  return _executeExcelCode.apply(this, arguments);
}
}();
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
!function() {
/*!************************************!*\
  !*** ./src/taskpane/taskpane.html ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
// Module
var code = "<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset=\"UTF-8\" />\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n        <title>SheetCraft AI</title>\n        <!-- Office JavaScript API -->\n        <" + "script type=\"text/javascript\" src=\"https://appsforoffice.microsoft.com/lib/1/hosted/office.js\"><" + "/script>\n        <!-- Fonts -->\n        <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n        <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n        <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap\" rel=\"stylesheet\">\n    </head>\n    <body>\n        <main id=\"app-body\" style=\"display: none;\">\n            <header class=\"app-header\">\n                <div class=\"brand\">\n                    <div class=\"logo\">\n                        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                            <path d=\"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z\"/>\n                            <polyline points=\"14 2 14 8 20 8\"/>\n                            <path d=\"M12 12v6\"/>\n                            <path d=\"M9 15h6\"/>\n                        </svg>\n                    </div>\n                    <h1>SheetCraft <span class=\"highlight-text\">AI</span></h1>\n                </div>\n                <div class=\"header-actions\">\n                    <button id=\"settings-toggle\" class=\"btn-icon\" title=\"Settings\">\n                        <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                            <circle cx=\"12\" cy=\"12\" r=\"3\"/>\n                            <path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"/>\n                        </svg>\n                    </button>\n                </div>\n            </header>\n\n            <!-- Settings Panel (hidden by default) -->\n            <div id=\"settings-panel\" class=\"settings-panel\" style=\"display: none;\">\n                <h3>AI Provider Settings</h3>\n                \n                <div class=\"form-group\">\n                    <label for=\"setting-provider\">Provider</label>\n                    <select id=\"setting-provider\" class=\"form-input\">\n                        <option value=\"groq\">Groq (Cloud)</option>\n                        <option value=\"local\">Ollama (Local)</option>\n                    </select>\n                </div>\n\n                <!-- Groq fields -->\n                <div id=\"groq-fields\">\n                    <div class=\"form-group\">\n                        <label for=\"setting-api-key\">API Key</label>\n                        <input id=\"setting-api-key\" type=\"password\" class=\"form-input\" placeholder=\"gsk_...\" />\n                    </div>\n                    <div class=\"form-group\">\n                        <label for=\"setting-groq-model\">Model</label>\n                        <input id=\"setting-groq-model\" type=\"text\" class=\"form-input\" placeholder=\"llama-3.3-70b-versatile\" />\n                    </div>\n                </div>\n\n                <!-- Local / Ollama fields -->\n                <div id=\"local-fields\" style=\"display: none;\">\n                    <div class=\"form-group\">\n                        <label for=\"setting-base-url\">Ollama Host</label>\n                        <input id=\"setting-base-url\" type=\"text\" class=\"form-input\" placeholder=\"http://localhost:11434\" />\n                    </div>\n                    <div class=\"form-group\">\n                        <label>Model</label>\n                        <div class=\"model-select-wrapper\">\n                            <select id=\"setting-local-model\" class=\"form-input\">\n                                <option value=\"\" disabled selected>Loading models...</option>\n                            </select>\n                            <button id=\"refresh-models\" class=\"btn-icon btn-refresh\" title=\"Refresh models\">\n                                <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"23 4 23 10 17 10\"/><path d=\"M20.49 15a9 9 0 1 1-2.12-9.36L23 10\"/></svg>\n                            </button>\n                        </div>\n                        <div id=\"model-status\" class=\"model-status\"></div>\n                    </div>\n                </div>\n\n                <button id=\"save-settings\" class=\"btn-primary btn-save\">Save</button>\n            </div>\n\n            <div class=\"content-wrapper\">\n                <div class=\"input-card\">\n                    <textarea id=\"prompt-input\" placeholder=\"Describe your task... (e.g., 'Create a sales chart from A1:B10')\" spellcheck=\"false\"></textarea>\n                    \n                    <div class=\"card-footer\">\n                        <button id=\"run\" class=\"btn-primary\">\n                            <span>Execute</span>\n                            <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                                <line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line>\n                                <polyline points=\"12 5 19 12 12 19\"></polyline>\n                            </svg>\n                        </button>\n                    </div>\n                </div>\n\n                <div id=\"status-message\" class=\"status-pill\"></div>\n\n                <div id=\"debug-section\">\n                    <details>\n                        <summary>\n                            <svg class=\"chevron\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>\n                            <span>Generated Code</span>\n                        </summary>\n                        <pre id=\"debug-code\"></pre>\n                    </details>\n                </div>\n            </div>\n        </main>\n        \n        <!-- Sideload Message -->\n        <section id=\"sideload-msg\" class=\"sideload-container\">\n            <div class=\"spinner\"></div>\n            <h2>Connecting to Excel...</h2>\n        </section>\n    </body>\n</html>\n";
// Exports
/* harmony default export */ __webpack_exports__["default"] = (code);
}();
/******/ })()
;
//# sourceMappingURL=taskpane.js.map