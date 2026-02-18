/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/services/cache.ts":
/*!*******************************!*\
  !*** ./src/services/cache.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cacheResponse: function() { return /* binding */ cacheResponse; },
/* harmony export */   clearCache: function() { return /* binding */ clearCache; },
/* harmony export */   getCachedResponse: function() { return /* binding */ getCachedResponse; }
/* harmony export */ });
/**
 * Simple prompt-response cache using localStorage.
 * Avoids redundant API calls for identical prompts.
 */

var CACHE_KEY = "sheetcraft_cache";
var CACHE_VERSION_KEY = "sheetcraft_cache_ver";
var CACHE_VERSION = 2; // Bump this when prompt changes significantly
var MAX_ENTRIES = 50;

// Auto-clear cache if version changed (prompt was updated)
function ensureCacheVersion() {
  try {
    var ver = localStorage.getItem(CACHE_VERSION_KEY);
    if (ver !== String(CACHE_VERSION)) {
      localStorage.removeItem(CACHE_KEY);
      localStorage.setItem(CACHE_VERSION_KEY, String(CACHE_VERSION));
    }
  } catch (_unused) {}
}
function getCache() {
  try {
    var raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_unused2) {
    return [];
  }
}
function setCache(entries) {
  // Keep only the most recent entries
  var trimmed = entries.slice(-MAX_ENTRIES);
  localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
}

/**
 * Look up a cached response for the given prompt.
 * Returns null if not found or expired (>1 hour).
 */
function getCachedResponse(prompt) {
  ensureCacheVersion();
  var entries = getCache();
  var key = prompt.trim().toLowerCase();
  var match = entries.find(function (e) {
    return e.prompt === key;
  });
  if (!match) return null;

  // Expire after 1 hour
  var ONE_HOUR = 60 * 60 * 1000;
  if (Date.now() - match.timestamp > ONE_HOUR) return null;
  return match.response;
}

/**
 * Store a prompt-response pair in the cache.
 */
function cacheResponse(prompt, response) {
  var entries = getCache();
  var key = prompt.trim().toLowerCase();

  // Remove existing entry for same prompt
  var filtered = entries.filter(function (e) {
    return e.prompt !== key;
  });
  filtered.push({
    prompt: key,
    response: response,
    timestamp: Date.now()
  });
  setCache(filtered);
}

/**
 * Clear the entire cache.
 */
function clearCache() {
  localStorage.removeItem(CACHE_KEY);
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
 * SheetCraft AI — Planning Mode (Chat) System Prompt
 * Conversational AI that helps users plan, learn, and strategize Excel work.
 */
var CHAT_PROMPT = "You are SheetCraft AI \u2014 a friendly, expert Excel assistant in Planning Mode.\n\nYOUR ROLE:\n- Help users plan their spreadsheet work\n- Explain Excel concepts, formulas, and best practices\n- Suggest approaches before executing\n- Answer questions about data organization, analysis, and visualization\n- Provide formula examples and explanations\n\nRESPONSE FORMAT RULES:\n1. Respond in natural, conversational language\n2. Use markdown-style formatting for emphasis: **bold**, *italic*, `code`\n3. When showing formulas, wrap them in backticks: `=VLOOKUP(A2, Sheet2!A:B, 2, FALSE)`\n4. Use bullet points and numbered lists for clarity\n5. Keep responses concise but thorough (aim for 2-5 paragraphs max)\n6. If the user's request would be better handled in Agent Mode (actual execution), mention that they can switch to \u26A1 Agent Mode to execute it\n\nEXCEL EXPERTISE AREAS:\n- Formula writing & debugging (VLOOKUP, INDEX/MATCH, IF, SUMIFS, etc.)\n- Data organization best practices\n- Chart type selection guidance\n- PivotTable planning\n- Data validation strategies\n- Conditional formatting approaches\n- Dashboard design principles\n- Data cleaning strategies\n- Performance optimization tips\n- Cross-sheet referencing patterns\n\nPERSONALITY:\n- Friendly and encouraging\n- Uses concrete examples when explaining\n- Proactive \u2014 suggest improvements the user might not have thought of\n- Mentions potential pitfalls or common mistakes to avoid\n\nIf the user asks you to DO something (create, format, execute), remind them:\n\"\uD83D\uDCA1 Switch to \u26A1 Agent Mode to execute this! I can help you plan it here first.\"\n\nUser Message:\n";

/**
 * Prompt for generating contextual suggestions based on sheet data
 */
var CONTEXT_PROMPT = "You are SheetCraft AI. Based on the following spreadsheet data, suggest 3-4 useful actions the user could take. Each suggestion should be a short phrase (5-8 words max). Format as a JSON array of strings. Example: [\"Add SUM to numeric columns\", \"Create a bar chart\", \"Apply professional formatting\"]. Only output the JSON array, nothing else.\n\nSheet Data:\n";

/***/ }),

/***/ "./src/services/icons.ts":
/*!*******************************!*\
  !*** ./src/services/icons.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Icons: function() { return /* binding */ Icons; }
/* harmony export */ });
/**
 * SVG Icon library for SheetCraft AI.
 * Inline Lucide-style icons — no external dependencies.
 */

var s = function s(d) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 14;
  return "<svg width=\"".concat(size, "\" height=\"").concat(size, "\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">").concat(d, "</svg>");
};
var Icons = {
  // Quick Actions
  chart: s('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>'),
  barChart: s('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'),
  table: s('<path d="M12 3v18"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>'),
  paintbrush: s('<path d="M18.37 2.63a2.12 2.12 0 0 1 3 3L14 13l-4 1 1-4Z"/><path d="M9 14.5A3.5 3.5 0 0 0 5.5 18H3v2h7a3 3 0 0 0 0-6"/>'),
  formula: s('<path d="M6 2v20"/><path d="M6 6h12l-6 6 6 6H6"/>'),
  sortAsc: s('<path d="M11 5h10"/><path d="M11 9h7"/><path d="M11 13h4"/><path d="M3 17l3 3 3-3"/><path d="M6 18V4"/>'),
  filter: s('<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>'),
  checkSquare: s('<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'),
  trendUp: s('<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>'),
  eraser: s('<path d="M20 20H7L3 16l9-9 9 9-4 4"/><path d="M6.5 13.5l5-5"/>'),
  copy: s('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),
  columns: s('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/>'),
  lock: s('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
  hash: s('<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>'),
  search: s('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>'),
  snowflake: s('<line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="20" y1="16" x2="4" y2="8"/><line x1="20" y1="8" x2="4" y2="16"/>'),
  // Status
  check: s('<path d="M20 6L9 17l-5-5"/>', 16),
  alertCircle: s('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>', 16),
  arrowRight: s('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>', 16),
  // Navigation
  settings: s('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.77 1.05 1.39 1.16V10H21a2 2 0 0 1 0 4h-.09c-.62.11-1.13.56-1.39 1.16z"/>', 18),
  helpCircle: s('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>', 18),
  refresh: s('<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>', 14),
  chevronDown: s('<polyline points="6 9 12 15 18 9"/>', 14),
  fileText: s('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 12v6"/><path d="M9 15h6"/>', 20),
  // ─── NEW: Mode Toggle Icons ───
  messageCircle: s('<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>', 16),
  zap: s('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>', 16),
  send: s('<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>', 14),
  // ─── NEW: Category Icons ───
  broom: s('<path d="M5 21h14"/><path d="M12 21V3"/><path d="M7 8l5-5 5 5"/><path d="M7 12l5 2 5-2"/>', 14),
  pieChart: s('<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>', 14),
  palette: s('<circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>', 14),
  fileTemplate: s('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>', 14),
  // ─── NEW: Chat Actions ───
  play: s('<polygon points="5 3 19 12 5 21 5 3"/>', 14),
  trash: s('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>', 14),
  sparkles: s('<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>', 14),
  user: s('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', 14),
  bot: s('<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>', 14)
};

/***/ }),

/***/ "./src/services/llm.service.ts":
/*!*************************************!*\
  !*** ./src/services/llm.service.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GROQ_MODELS: function() { return /* binding */ GROQ_MODELS; },
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
 * Stores separate model configs per provider to avoid cross-contamination.
 * Includes auto-retry with backoff for 429 rate limits.
 */

var DEFAULT_GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
var DEFAULT_LOCAL_URL = "http://localhost:11434/v1/chat/completions";
var DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant";
var DEFAULT_LOCAL_MODEL = "llama3";

// Valid Groq models (guaranteed to work)
var GROQ_MODELS = [{
  id: "llama-3.1-8b-instant",
  label: "Llama 3.1 8B (Fast, 131K TPM)"
}, {
  id: "llama-3.3-70b-versatile",
  label: "Llama 3.3 70B (Smart, 12K TPM)"
}, {
  id: "gemma2-9b-it",
  label: "Gemma 2 9B (15K TPM)"
}, {
  id: "mixtral-8x7b-32768",
  label: "Mixtral 8x7B (5K TPM)"
}];
var MAX_RETRIES = 3;
var BASE_DELAY_MS = 2000;

/**
 * Get saved config from localStorage.
 */
function getConfig() {
  try {
    var saved = localStorage.getItem("sheetcraft_llm_config");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn("Failed to load LLM config:", e);
  }
  return {
    provider: "groq",
    apiKey: typeof process !== "undefined" && "MISSING_ENV_VAR" && "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" || "",
    groqModel: DEFAULT_GROQ_MODEL,
    localModel: DEFAULT_LOCAL_MODEL
  };
}

/**
 * Save config to localStorage.
 */
function saveConfig(config) {
  localStorage.setItem("sheetcraft_llm_config", JSON.stringify(config));
}
function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

/**
 * Resolve the correct model for the active provider.
 */
function resolveModel(cfg) {
  if (cfg.provider === "groq") {
    var model = cfg.groqModel || cfg.model || DEFAULT_GROQ_MODEL;
    // Validate: if it looks like a local model name (has ':'), use default
    if (model.includes(":")) return DEFAULT_GROQ_MODEL;
    return model;
  } else {
    return cfg.localModel || cfg.model || DEFAULT_LOCAL_MODEL;
  }
}

/**
 * Call LLM with automatic 429 retry.
 */
function callLLM(_x, _x2) {
  return _callLLM.apply(this, arguments);
}

/**
 * Fetch locally available Ollama models.
 */
function _callLLM() {
  _callLLM = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(messages, config) {
    var cfg, url, headers, model, body, attempt, response, retryAfter, waitMs, errText, data, content;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          cfg = config || getConfig();
          headers = {
            "Content-Type": "application/json"
          };
          if (cfg.provider === "groq") {
            url = DEFAULT_GROQ_URL;
            if (cfg.apiKey) headers["Authorization"] = "Bearer ".concat(cfg.apiKey);
          } else {
            url = cfg.baseUrl || DEFAULT_LOCAL_URL;
            if (cfg.apiKey) headers["Authorization"] = "Bearer ".concat(cfg.apiKey);
          }
          model = resolveModel(cfg);
          body = JSON.stringify({
            messages: messages,
            model: model,
            temperature: 0.1,
            max_tokens: 2048
          });
          attempt = 0;
        case 1:
          if (!(attempt <= MAX_RETRIES)) {
            _context.n = 12;
            break;
          }
          _context.n = 2;
          return fetch(url, {
            method: "POST",
            headers: headers,
            body: body
          });
        case 2:
          response = _context.v;
          if (!(response.status === 429)) {
            _context.n = 5;
            break;
          }
          if (!(attempt < MAX_RETRIES)) {
            _context.n = 4;
            break;
          }
          retryAfter = response.headers.get("retry-after");
          waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : BASE_DELAY_MS * Math.pow(2, attempt);
          console.warn("Rate limited. Waiting ".concat(waitMs, "ms (retry ").concat(attempt + 1, "/").concat(MAX_RETRIES, ")..."));
          _context.n = 3;
          return sleep(waitMs);
        case 3:
          return _context.a(3, 11);
        case 4:
          throw new Error("Rate limited. Please wait a moment and try again.");
        case 5:
          if (!(response.status === 404)) {
            _context.n = 6;
            break;
          }
          throw new Error("Model \"".concat(model, "\" not found. Go to Settings \u2699\uFE0F and select a valid model."));
        case 6:
          if (response.ok) {
            _context.n = 9;
            break;
          }
          _context.n = 7;
          return response.text();
        case 7:
          errText = _context.v;
          if (!(errText.includes("out of memory") || errText.includes("cudaMalloc"))) {
            _context.n = 8;
            break;
          }
          throw new Error("GPU out of memory. Select a smaller model in Settings ⚙️ or switch to Groq (cloud).");
        case 8:
          throw new Error("AI Error (".concat(response.status, "): ").concat(errText.substring(0, 120)));
        case 9:
          _context.n = 10;
          return response.json();
        case 10:
          data = _context.v;
          content = data.choices[0].message.content.trim(); // Clean markdown fences
          content = content.replace(/^```(?:javascript|js|typescript|ts)?\n?/i, "");
          content = content.replace(/\n?```$/i, "");
          content = content.trim();

          // Remove accidental sheet redeclarations
          content = content.replace(/(?:const|let|var)\s+sheet\s*=\s*.*?;/g, "// sheet redeclaration removed");
          return _context.a(2, content);
        case 11:
          attempt++;
          _context.n = 1;
          break;
        case 12:
          throw new Error("Failed after maximum retries.");
        case 13:
          return _context.a(2);
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
    var host, response, data, _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          host = baseHost || "http://localhost:11434";
          _context2.p = 1;
          _context2.n = 2;
          return fetch("".concat(host, "/api/tags"), {
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
 * SheetCraft AI — Bulletproof System Prompt
 * Optimized for token efficiency + zero runtime errors.
 */
var SYSTEM_PROMPT = "You are SheetCraft AI, an Excel JavaScript API expert. Generate ONLY executable JS code.\n\nENVIRONMENT (already declared, do NOT redeclare):\n- context: Excel.RequestContext\n- sheet: active worksheet\n- Excel: namespace for enums\n\nCRITICAL RULES:\n1. Output ONLY code. No markdown, no explanations, no comments.\n2. Do NOT use Excel.run or redeclare sheet/context.\n3. EVERY row in a data array MUST have the EXACT same number of columns. Double-check this.\n4. Dates must be strings like \"01/15/2020\" or \"2020-01-15\", NEVER numeric serial numbers.\n5. ALWAYS call r.format.autofitColumns() AND r.format.autofitRows() after writing data.\n6. Use getResizedRange: startCell.getResizedRange(data.length-1, data[0].length-1)\n7. NEVER read properties without .load() + await context.sync() first.\n8. numberFormat MUST be a 2D array matching dimensions. For N rows: Array.from({length:N},()=>[\"fmt\"])\n9. Do NOT call .select() on large ranges.\n\nBANNED (crashes):\nchart.setTitle() \u2192 chart.title.text=\"X\"\nrange.setValues() \u2192 range.values=[...]\nrange.font.bold \u2192 range.format.font.bold\nrange.merge() \u2192 range.merge(false)\nrange.getColumnCount \u2192 load(\"columnCount\")+sync\nSpreadsheetApp \u2192 NOT Google Apps Script\n\nEXAMPLE \u2014 Employee/Teacher Sheet (FOLLOW THIS EXACT PATTERN):\nconst data = [\n  [\"Name\", \"Role\", \"Salary\", \"Joining Date\"],\n  [\"John Doe\", \"Teacher\", 55000, \"03/15/2019\"],\n  [\"Jane Smith\", \"Principal\", 72000, \"01/08/2015\"],\n  [\"Bob Johnson\", \"Teacher\", 48000, \"06/22/2020\"],\n  [\"Alice Brown\", \"Teacher\", 51000, \"09/10/2018\"],\n  [\"Mike Davis\", \"Teacher\", 46000, \"11/03/2021\"]\n];\nconst r = sheet.getRange(\"A1\").getResizedRange(data.length - 1, data[0].length - 1);\nr.values = data;\nconst hdr = r.getRow(0);\nhdr.format.font.bold = true;\nhdr.format.font.color = \"#FFFFFF\";\nhdr.format.fill.color = \"#4472C4\";\nconst salaryCol = sheet.getRange(\"C2\").getResizedRange(data.length - 2, 0);\nsalaryCol.numberFormat = Array.from({length: data.length - 1}, () => [\"$#,##0\"]);\nconst dateCol = sheet.getRange(\"D2\").getResizedRange(data.length - 2, 0);\ndateCol.numberFormat = Array.from({length: data.length - 1}, () => [\"mm/dd/yyyy\"]);\nr.format.autofitColumns();\nr.format.autofitRows();\nr.format.borders.getItem(\"InsideHorizontal\").style = Excel.BorderLineStyle.thin;\nr.format.borders.getItem(\"InsideVertical\").style = Excel.BorderLineStyle.thin;\nr.format.borders.getItem(\"EdgeTop\").style = Excel.BorderLineStyle.thin;\nr.format.borders.getItem(\"EdgeBottom\").style = Excel.BorderLineStyle.thin;\nr.format.borders.getItem(\"EdgeLeft\").style = Excel.BorderLineStyle.thin;\nr.format.borders.getItem(\"EdgeRight\").style = Excel.BorderLineStyle.thin;\n\nOTHER PATTERNS:\nChart: const ch=sheet.charts.add(Excel.ChartType.columnClustered,sheet.getRange(\"A1:C5\"),Excel.ChartSeriesBy.auto); ch.title.text=\"Title\"; ch.setPosition(\"F2\",\"N18\");\nTable: const t=sheet.tables.add(sheet.getRange(\"A1:D10\"),true); t.name=\"T1\"; t.style=\"TableStyleMedium9\";\nFormula: sheet.getRange(\"E2\").formulas=[[\"=SUM(B2:D2)\"]];\nGrades: const g=[]; for(let i=2;i<=N+1;i++) g.push([`=IF(C${i}>=90,\"A\",\"B\")`]); sheet.getRange(\"D2\").getResizedRange(g.length-1,0).formulas=g;\nSort: sheet.getUsedRange().sort.apply([{key:0,ascending:true}]);\nFilter: const fr=sheet.getUsedRange(); fr.autoFilter.apply(fr,0);\nValidation: sheet.getRange(\"B2:B20\").dataValidation.rule={list:{inCellDropDown:true,source:\"Yes,No,Maybe\"}};\nConditionalFormat: const cf=r.conditionalFormats.add(Excel.ConditionalFormatType.colorScale); cf.colorScale.criteria=[{type:Excel.ConditionalFormatColorCriterionType.lowestValue,color:\"#63BE7B\"},{type:Excel.ConditionalFormatColorCriterionType.highestValue,color:\"#F8696B\"}];\nFreezePanes: sheet.freezePanes.freezeRows(1);\nClear: sheet.getUsedRange().clear(Excel.ClearApplyTo.contents);\nRead: const ur=sheet.getUsedRange(); ur.load(\"values,rowCount,columnCount\"); await context.sync();\nZebra: for(let i=1;i<data.length;i++){if(i%2===0)r.getRow(i).format.fill.color=\"#D6E4F0\";}\nWorksheet: context.workbook.worksheets.add(\"SheetName\");\n\nUser Prompt:\n";

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



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2710%27 height=%2710%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%238C8E91%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E */ "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2710%27 height=%2710%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%238C8E91%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* \n * SheetCraft AI — Redesigned Interface\n * A warm, human-crafted design system.\n * Forest green + terracotta. No AI-purple gradients.\n */\n\n:root {\n    /* ── Surface & Layout ── */\n    --bg: #F5F4F1;\n    --surface: #FAFAF8;\n    --card: #FFFFFF;\n    --card-border: #E3E1DC;\n    --card-hover: #F0EFEB;\n    --input-bg: #F5F4F1;\n\n    /* ── Primary: Forest Green ── */\n    --primary: #2D6A4F;\n    --primary-hover: #1B4D3E;\n    --primary-light: #74C69D;\n    --primary-bg: rgba(45, 106, 79, 0.06);\n    --primary-glow: rgba(45, 106, 79, 0.12);\n\n    /* ── Accent: Terracotta ── */\n    --accent: #C4603D;\n    --accent-hover: #A8502F;\n    --accent-bg: rgba(196, 96, 61, 0.07);\n\n    /* ── Text ── */\n    --text: #1A1C1E;\n    --text-2: #555759;\n    --text-3: #8C8E91;\n    --text-4: #C5C7CA;\n\n    /* ── Semantic ── */\n    --success: #2D6A4F;\n    --success-bg: rgba(45, 106, 79, 0.07);\n    --error: #B83A3A;\n    --error-bg: rgba(184, 58, 58, 0.07);\n    --warning: #C08B2D;\n    --warning-bg: rgba(192, 139, 45, 0.07);\n\n    /* ── Shape ── */\n    --radius: 10px;\n    --radius-lg: 14px;\n    --radius-xl: 20px;\n\n    /* ── Depth — warm tinted shadows ── */\n    --shadow-sm: 0 1px 2px rgba(30, 25, 20, 0.04);\n    --shadow: 0 2px 5px rgba(30, 25, 20, 0.05), 0 1px 2px rgba(30, 25, 20, 0.03);\n    --shadow-md: 0 4px 12px rgba(30, 25, 20, 0.06), 0 1px 3px rgba(30, 25, 20, 0.04);\n    --shadow-lg: 0 8px 24px rgba(30, 25, 20, 0.08), 0 2px 6px rgba(30, 25, 20, 0.04);\n\n    /* ── Typography ── */\n    --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;\n    --mono: 'JetBrains Mono', 'Cascadia Code', 'Menlo', monospace;\n\n    /* ── Chat ── */\n    --chat-user-bg: var(--primary);\n    --chat-user-text: #FFFFFF;\n    --chat-ai-bg: #F0EFEB;\n    --chat-ai-border: #E3E1DC;\n    --chat-ai-text: var(--text);\n}\n\n/* ── Dark mode ── */\n@media (prefers-color-scheme: dark) {\n    :root {\n        --bg: #141516;\n        --surface: #1A1B1D;\n        --card: #212224;\n        --card-border: #313335;\n        --card-hover: #2A2B2D;\n        --input-bg: #19191B;\n\n        --primary: #52B788;\n        --primary-hover: #74C69D;\n        --primary-light: #2D6A4F;\n        --primary-bg: rgba(82, 183, 136, 0.08);\n        --primary-glow: rgba(82, 183, 136, 0.14);\n\n        --accent: #E0915A;\n        --accent-hover: #EAA876;\n        --accent-bg: rgba(224, 145, 90, 0.09);\n\n        --text: #E5E3DE;\n        --text-2: #9B9D9F;\n        --text-3: #606264;\n        --text-4: #3A3C3E;\n\n        --success: #52B788;\n        --success-bg: rgba(82, 183, 136, 0.09);\n        --error: #E06060;\n        --error-bg: rgba(224, 96, 96, 0.09);\n        --warning: #E0B85A;\n        --warning-bg: rgba(224, 184, 90, 0.09);\n\n        --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.18);\n        --shadow: 0 2px 5px rgba(0, 0, 0, 0.22);\n        --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.28);\n        --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.32);\n\n        --chat-user-bg: var(--primary);\n        --chat-user-text: #141516;\n        --chat-ai-bg: #262729;\n        --chat-ai-border: #313335;\n        --chat-ai-text: var(--text);\n    }\n}\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* RESET & BASE                                                    */\n/* ═══════════════════════════════════════════════════════════════ */\n*, *::before, *::after { box-sizing: border-box; }\n\nhtml, body {\n    width: 100%; height: 100%;\n    margin: 0; padding: 0;\n    font-family: var(--font);\n    font-size: 13px;\n    line-height: 1.55;\n    background: var(--bg);\n    color: var(--text);\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n    overflow-x: hidden;\n}\n\n#app-body {\n    display: flex;\n    flex-direction: column;\n    height: 100vh;\n    overflow: hidden;\n}\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* HEADER                                                          */\n/* ═══════════════════════════════════════════════════════════════ */\n.app-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 11px 16px;\n    background: var(--surface);\n    border-bottom: 1px solid var(--card-border);\n    position: sticky;\n    top: 0;\n    z-index: 20;\n}\n\n.brand {\n    display: flex;\n    align-items: center;\n    gap: 9px;\n}\n\n.logo {\n    color: var(--primary);\n    display: flex;\n    align-items: center;\n}\n\n.brand h1 {\n    font-size: 15px;\n    font-weight: 700;\n    margin: 0;\n    letter-spacing: -0.025em;\n    color: var(--text);\n}\n\n.highlight-text {\n    color: var(--primary);\n    font-weight: 700;\n    /* Solid color, not a gradient — feels hand-picked */\n}\n\n.header-actions {\n    display: flex;\n    gap: 5px;\n}\n\n\n/* ── Icon Buttons ── */\n.btn-icon {\n    width: 32px; height: 32px;\n    border: 1px solid var(--card-border);\n    border-radius: 9px;\n    background: var(--card);\n    color: var(--text-3);\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    transition: color 0.2s ease-out, border-color 0.2s ease-out, background 0.2s ease-out;\n    padding: 0;\n}\n\n.btn-icon:hover {\n    color: var(--primary);\n    border-color: var(--primary);\n    background: var(--primary-bg);\n}\n\n.btn-icon:active {\n    transform: scale(0.95);\n}\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* PANELS — Docs & Settings                                        */\n/* ═══════════════════════════════════════════════════════════════ */\n.panel {\n    padding: 16px;\n    background: var(--card);\n    border-bottom: 1px solid var(--card-border);\n    animation: slideDown 0.22s ease-out;\n}\n\n.panel h3 {\n    font-size: 11px;\n    font-weight: 650;\n    text-transform: uppercase;\n    letter-spacing: 0.06em;\n    color: var(--text-3);\n    margin: 0 0 12px;\n}\n\n\n/* ── Docs Grid ── */\n.docs-grid {\n    display: flex;\n    flex-direction: column;\n    gap: 8px;\n}\n\n.doc-item {\n    display: flex;\n    gap: 10px;\n    align-items: flex-start;\n    padding: 5px 0;\n}\n\n.doc-icon {\n    flex-shrink: 0;\n    width: 18px; height: 18px;\n    color: var(--primary);\n    display: flex;\n    align-items: center;\n    margin-top: 1px;\n}\n\n.doc-item strong {\n    font-size: 12px;\n    font-weight: 600;\n    color: var(--text);\n    display: block;\n    margin-bottom: 2px;\n}\n\n.doc-item p {\n    font-size: 11px;\n    color: var(--text-2);\n    margin: 0;\n    line-height: 1.45;\n}\n\n.docs-hint {\n    font-size: 11px;\n    color: var(--text-3);\n    margin: 12px 0 0;\n    font-style: italic;\n    line-height: 1.5;\n}\n\n\n/* ── Forms ── */\n.form-group { margin-bottom: 12px; }\n\n.form-group label {\n    display: block;\n    font-size: 11px;\n    font-weight: 600;\n    color: var(--text-3);\n    margin-bottom: 4px;\n    text-transform: uppercase;\n    letter-spacing: 0.04em;\n}\n\n.form-input {\n    width: 100%;\n    padding: 8px 11px;\n    font-size: 13px;\n    font-family: var(--font);\n    color: var(--text);\n    background: var(--input-bg);\n    border: 1px solid var(--card-border);\n    border-radius: 9px;\n    outline: none;\n    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;\n}\n\n.form-input:focus {\n    border-color: var(--primary);\n    box-shadow: 0 0 0 3px var(--primary-glow);\n}\n\nselect.form-input {\n    cursor: pointer;\n    appearance: none;\n    background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n    background-repeat: no-repeat;\n    background-position: right 10px center;\n    padding-right: 28px;\n}\n\n.btn-save {\n    width: 100%;\n    justify-content: center;\n    margin-top: 6px;\n}\n\n/* Model selector row */\n.model-select-wrapper {\n    display: flex;\n    gap: 5px;\n    align-items: center;\n}\n\n.model-select-wrapper .form-input {\n    flex: 1;\n    min-width: 0;\n}\n\n.btn-refresh {\n    width: 30px; height: 30px;\n    flex-shrink: 0;\n    padding: 0;\n}\n\n.model-status {\n    font-size: 11px;\n    margin-top: 4px;\n    min-height: 15px;\n    color: var(--text-3);\n}\n\n.model-status-ok  { color: var(--success); }\n.model-status-warn { color: var(--error); }\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* MODE TOGGLE                                                     */\n/* ═══════════════════════════════════════════════════════════════ */\n.mode-toggle {\n    display: flex;\n    align-items: center;\n    padding: 6px;\n    margin: 0;\n    background: var(--surface);\n    border-bottom: 1px solid var(--card-border);\n    position: relative;\n    gap: 4px;\n}\n\n.mode-tab {\n    flex: 1;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    gap: 6px;\n    padding: 9px 14px;\n    font-size: 12.5px;\n    font-weight: 600;\n    font-family: var(--font);\n    color: var(--text-3);\n    background: transparent;\n    border: none;\n    border-radius: 9px;\n    cursor: pointer;\n    transition: color 0.25s ease-out;\n    position: relative;\n    z-index: 2;\n}\n\n.mode-tab:hover { color: var(--text-2); }\n.mode-tab.active { color: var(--primary); }\n.mode-tab svg { width: 14px; height: 14px; }\n\n.mode-indicator {\n    position: absolute;\n    left: 6px;\n    top: 6px;\n    width: calc(50% - 8px);\n    height: calc(100% - 12px);\n    background: var(--primary-bg);\n    border: 1px solid var(--primary-glow);\n    border-radius: 9px;\n    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n    z-index: 1;\n}\n\n.mode-indicator.right {\n    transform: translateX(calc(100% + 4px));\n}\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* MODE CONTENT WRAPPER                                            */\n/* ═══════════════════════════════════════════════════════════════ */\n.mode-content {\n    display: none;\n    flex-direction: column;\n    flex: 1;\n    overflow: hidden;\n    animation: fadeIn 0.2s ease-out;\n}\n\n.mode-content.active { display: flex; }\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* PLANNING MODE — Chat                                            */\n/* ═══════════════════════════════════════════════════════════════ */\n\n/* ── Chat Messages Container ── */\n.chat-messages {\n    flex: 1;\n    overflow-y: auto;\n    padding: 14px 14px 6px;\n    display: flex;\n    flex-direction: column;\n    gap: 14px;\n    scroll-behavior: smooth;\n}\n\n\n/* ── Welcome Screen ── */\n.chat-welcome {\n    text-align: center;\n    padding: 28px 18px 18px;\n    animation: fadeIn 0.35s ease-out;\n}\n\n.welcome-icon {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    width: 52px; height: 52px;\n    background: var(--primary);\n    border-radius: 16px;\n    color: white;\n    margin-bottom: 14px;\n    box-shadow: 0 4px 14px rgba(45, 106, 79, 0.2);\n}\n\n.welcome-icon svg { width: 24px; height: 24px; }\n\n.chat-welcome h2 {\n    font-size: 17px;\n    font-weight: 700;\n    margin: 0 0 8px;\n    color: var(--text);\n    letter-spacing: -0.02em;\n}\n\n.chat-welcome p {\n    font-size: 12.5px;\n    color: var(--text-2);\n    margin: 0 0 18px;\n    line-height: 1.65;\n    max-width: 270px;\n    margin-left: auto;\n    margin-right: auto;\n}\n\n\n/* ── Chat Suggestions ── */\n.welcome-suggestions {\n    display: flex;\n    flex-direction: column;\n    gap: 7px;\n    max-width: 280px;\n    margin: 0 auto;\n}\n\n.suggestion-chip {\n    display: flex;\n    align-items: center;\n    gap: 9px;\n    padding: 10px 13px;\n    background: var(--card);\n    border: 1px solid var(--card-border);\n    border-radius: var(--radius);\n    font-size: 11.5px;\n    color: var(--text-2);\n    cursor: pointer;\n    transition: all 0.22s ease-out;\n    text-align: left;\n    font-family: var(--font);\n    line-height: 1.4;\n}\n\n.suggestion-chip:hover {\n    border-color: var(--primary);\n    color: var(--primary);\n    background: var(--primary-bg);\n    transform: translateX(3px);\n}\n\n.suggestion-chip svg {\n    flex-shrink: 0;\n    color: var(--primary);\n    opacity: 0.5;\n}\n\n.suggestion-chip:hover svg { opacity: 1; }\n\n\n/* ── Chat Message Bubbles ── */\n.chat-msg {\n    display: flex;\n    gap: 9px;\n    animation: msgSlideIn 0.25s ease-out;\n    max-width: 100%;\n}\n\n.chat-msg.user {\n    flex-direction: row-reverse;\n}\n\n.chat-avatar {\n    width: 28px; height: 28px;\n    border-radius: 9px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-shrink: 0;\n    font-size: 11px;\n    font-weight: 600;\n}\n\n.chat-msg.user .chat-avatar {\n    background: var(--primary);\n    color: white;\n}\n\n.chat-msg.ai .chat-avatar {\n    background: var(--primary-bg);\n    color: var(--primary);\n    border: 1px solid var(--primary-glow);\n}\n\n.chat-bubble {\n    padding: 11px 14px;\n    border-radius: var(--radius-lg);\n    font-size: 12.5px;\n    line-height: 1.65;\n    max-width: 82%;\n    word-wrap: break-word;\n    overflow-wrap: break-word;\n}\n\n.chat-msg.user .chat-bubble {\n    background: var(--chat-user-bg);\n    color: var(--chat-user-text);\n    border-bottom-right-radius: 5px;\n}\n\n.chat-msg.ai .chat-bubble {\n    background: var(--chat-ai-bg);\n    color: var(--chat-ai-text);\n    border: 1px solid var(--chat-ai-border);\n    border-bottom-left-radius: 5px;\n}\n\n\n/* ── Chat formatted text ── */\n.chat-bubble strong { font-weight: 600; }\n.chat-bubble em { font-style: italic; opacity: 0.9; }\n\n.chat-bubble code {\n    font-family: var(--mono);\n    font-size: 11px;\n    padding: 2px 5px;\n    border-radius: 5px;\n    background: rgba(0, 0, 0, 0.06);\n}\n\n.chat-msg.user .chat-bubble code {\n    background: rgba(255, 255, 255, 0.18);\n}\n\n.chat-bubble ul, .chat-bubble ol { margin: 6px 0; padding-left: 18px; }\n.chat-bubble li { margin-bottom: 3px; }\n.chat-bubble p { margin: 0 0 8px; }\n.chat-bubble p:last-child { margin: 0; }\n\n\n/* ── Execute from Chat ── */\n.chat-action-bar {\n    display: flex;\n    gap: 6px;\n    margin-top: 10px;\n}\n\n.btn-execute-from-chat {\n    display: inline-flex;\n    align-items: center;\n    gap: 5px;\n    padding: 5px 11px;\n    font-size: 10.5px;\n    font-weight: 600;\n    font-family: var(--font);\n    background: var(--primary-bg);\n    color: var(--primary);\n    border: 1px solid var(--primary-glow);\n    border-radius: 7px;\n    cursor: pointer;\n    transition: all 0.2s ease-out;\n}\n\n.btn-execute-from-chat:hover {\n    background: var(--primary);\n    color: white;\n    box-shadow: 0 2px 8px rgba(45, 106, 79, 0.25);\n}\n\n\n/* ── Typing Indicator ── */\n.typing-indicator {\n    display: flex;\n    gap: 4px;\n    align-items: center;\n    padding: 4px 0;\n}\n\n.typing-dot {\n    width: 6px; height: 6px;\n    background: var(--text-3);\n    border-radius: 50%;\n    animation: typingBounce 0.6s ease-in-out infinite;\n}\n\n.typing-dot:nth-child(2) { animation-delay: 0.15s; }\n.typing-dot:nth-child(3) { animation-delay: 0.3s; }\n\n\n/* ── Chat Input Area ── */\n.chat-input-area {\n    padding: 10px 14px 8px;\n    background: var(--surface);\n    border-top: 1px solid var(--card-border);\n}\n\n.chat-input-card {\n    display: flex;\n    align-items: flex-end;\n    gap: 7px;\n    background: var(--card);\n    border: 1px solid var(--card-border);\n    border-radius: var(--radius-lg);\n    padding: 5px 5px 5px 14px;\n    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;\n    box-shadow: var(--shadow-sm);\n}\n\n.chat-input-card:focus-within {\n    border-color: var(--primary);\n    box-shadow: 0 0 0 3px var(--primary-glow);\n}\n\n#chat-input {\n    flex: 1;\n    border: none;\n    background: transparent;\n    font-family: var(--font);\n    font-size: 13px;\n    color: var(--text);\n    padding: 8px 0;\n    resize: none;\n    outline: none;\n    min-height: 20px;\n    max-height: 84px;\n    line-height: 1.5;\n}\n\n#chat-input::placeholder { color: var(--text-3); }\n\n.btn-send {\n    width: 34px; height: 34px;\n    border: none;\n    border-radius: 9px;\n    background: var(--primary);\n    color: white;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-shrink: 0;\n    transition: background 0.2s ease-out, transform 0.15s ease-out;\n    box-shadow: 0 2px 6px rgba(45, 106, 79, 0.2);\n}\n\n.btn-send:hover {\n    background: var(--primary-hover);\n    transform: scale(1.04);\n}\n\n.btn-send:active { transform: scale(0.94); }\n\n.btn-send:disabled {\n    opacity: 0.35;\n    cursor: not-allowed;\n    transform: none;\n}\n\n.btn-send svg { width: 14px; height: 14px; }\n\n.chat-footer {\n    display: flex;\n    justify-content: center;\n    padding: 4px 0 0;\n}\n\n.btn-text {\n    display: inline-flex;\n    align-items: center;\n    gap: 4px;\n    padding: 5px 9px;\n    font-size: 11px;\n    font-weight: 500;\n    font-family: var(--font);\n    color: var(--text-3);\n    background: transparent;\n    border: none;\n    cursor: pointer;\n    border-radius: 7px;\n    transition: color 0.15s, background 0.15s;\n}\n\n.btn-text:hover {\n    color: var(--error);\n    background: var(--error-bg);\n}\n\n.btn-text svg { width: 12px; height: 12px; }\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* AGENT MODE                                                      */\n/* ═══════════════════════════════════════════════════════════════ */\n.content-wrapper {\n    flex: 1;\n    padding: 14px;\n    display: flex;\n    flex-direction: column;\n    gap: 12px;\n    width: 100%;\n    overflow-y: auto;\n}\n\n\n/* ── Category Tabs ── */\n.action-categories {\n    display: flex;\n    gap: 5px;\n    overflow-x: auto;\n    padding: 2px 0;\n    scrollbar-width: none;\n}\n\n.action-categories::-webkit-scrollbar { display: none; }\n\n.category-tab {\n    display: flex;\n    align-items: center;\n    gap: 5px;\n    padding: 7px 11px;\n    font-size: 11px;\n    font-weight: 600;\n    font-family: var(--font);\n    color: var(--text-3);\n    background: transparent;\n    border: 1px solid transparent;\n    border-radius: 9px;\n    cursor: pointer;\n    transition: all 0.2s ease-out;\n    white-space: nowrap;\n    flex-shrink: 0;\n}\n\n.category-tab:hover {\n    color: var(--text-2);\n    background: var(--card);\n}\n\n.category-tab.active {\n    color: var(--primary);\n    background: var(--primary-bg);\n    border-color: var(--primary-glow);\n}\n\n.category-tab svg { width: 12px; height: 12px; }\n\n\n/* ── Quick Action Chips ── */\n.quick-actions {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 6px;\n}\n\n.chip {\n    display: inline-flex;\n    align-items: center;\n    gap: 5px;\n    padding: 6px 11px;\n    font-size: 11px;\n    font-weight: 500;\n    font-family: var(--font);\n    color: var(--text-2);\n    background: var(--card);\n    border: 1px solid var(--card-border);\n    border-radius: 20px;\n    cursor: pointer;\n    transition: all 0.2s ease-out;\n    white-space: nowrap;\n}\n\n.chip:hover {\n    color: var(--primary);\n    border-color: var(--primary);\n    background: var(--primary-bg);\n    transform: translateY(-1px);\n    box-shadow: var(--shadow-sm);\n}\n\n.chip:active {\n    transform: scale(0.96) translateY(0);\n}\n\n.chip svg { width: 12px; height: 12px; flex-shrink: 0; }\n\n\n/* ── Input Card (Agent) ── */\n.input-card {\n    background: var(--card);\n    border: 1px solid var(--card-border);\n    border-radius: var(--radius-lg);\n    display: flex;\n    flex-direction: column;\n    box-shadow: var(--shadow);\n    overflow: hidden;\n    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;\n}\n\n.input-card:focus-within {\n    border-color: var(--primary);\n    box-shadow: 0 0 0 3px var(--primary-glow);\n}\n\ntextarea {\n    width: 100%;\n    min-height: 84px;\n    padding: 12px 14px;\n    background: transparent;\n    border: none;\n    color: var(--text);\n    font-family: var(--font);\n    font-size: 13px;\n    line-height: 1.6;\n    resize: vertical;\n    outline: none;\n}\n\ntextarea::placeholder {\n    color: var(--text-3);\n    opacity: 0.85;\n}\n\n.card-footer {\n    padding: 8px 12px;\n    border-top: 1px solid var(--card-border);\n    display: flex;\n    justify-content: flex-end;\n    align-items: center;\n    gap: 8px;\n}\n\n\n/* ── Cache Badge ── */\n.cache-badge {\n    font-size: 10.5px;\n    font-weight: 600;\n    color: var(--success);\n    background: var(--success-bg);\n    padding: 3px 9px;\n    border-radius: 10px;\n    animation: fadeIn 0.2s;\n}\n\n\n/* ── Primary Button ── */\n.btn-primary {\n    background: var(--primary);\n    color: white;\n    border: none;\n    padding: 8px 16px;\n    border-radius: 9px;\n    font-size: 12px;\n    font-weight: 600;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    transition: background 0.2s ease-out, transform 0.15s ease-out, box-shadow 0.2s ease-out;\n    box-shadow: 0 2px 6px rgba(45, 106, 79, 0.2);\n}\n\n.btn-primary:hover {\n    background: var(--primary-hover);\n    transform: translateY(-1px);\n    box-shadow: 0 4px 14px rgba(45, 106, 79, 0.25);\n}\n\n.btn-primary:active {\n    transform: translateY(0);\n}\n\n.btn-primary:disabled {\n    opacity: 0.4;\n    cursor: not-allowed;\n    transform: none;\n}\n\n.btn-primary svg { width: 13px; height: 13px; }\n\n\n/* ── Skeleton Loading ── */\n.skeleton-container {\n    display: flex;\n    flex-direction: column;\n    gap: 9px;\n    padding: 4px 0;\n}\n\n.skeleton-pill {\n    width: 140px;\n    height: 28px;\n    border-radius: 9px;\n    background: linear-gradient(90deg, var(--card-border) 25%, var(--input-bg) 50%, var(--card-border) 75%);\n    background-size: 200% 100%;\n    animation: shimmer 1.6s ease-in-out infinite;\n}\n\n.skeleton-line {\n    height: 13px;\n    border-radius: 5px;\n    background: linear-gradient(90deg, var(--card-border) 25%, var(--input-bg) 50%, var(--card-border) 75%);\n    background-size: 200% 100%;\n    animation: shimmer 1.6s ease-in-out infinite;\n}\n\n.skeleton-line.w80 { width: 80%; }\n.skeleton-line.w60 { width: 60%; }\n\n\n/* ── Status Pill ── */\n.status-pill {\n    padding: 9px 13px;\n    border-radius: var(--radius);\n    font-size: 12px;\n    font-weight: 500;\n    display: none;\n    align-items: center;\n    gap: 7px;\n    animation: fadeIn 0.2s;\n    border: 1px solid transparent;\n}\n\n.status-pill.info {\n    background: var(--primary-bg);\n    color: var(--primary);\n    border-color: var(--primary-glow);\n}\n\n.status-pill.success {\n    background: var(--success-bg);\n    color: var(--success);\n    border-color: rgba(45, 106, 79, 0.12);\n}\n\n.status-pill.error {\n    background: var(--error-bg);\n    color: var(--error);\n    border-color: rgba(184, 58, 58, 0.12);\n}\n\n\n/* ── Spinners ── */\n.spinner {\n    width: 14px; height: 14px;\n    border: 2px solid transparent;\n    border-radius: 50%;\n    border-top-color: currentColor;\n    border-right-color: currentColor;\n    animation: spin 0.7s linear infinite;\n}\n\n.btn-spinner {\n    width: 13px; height: 13px;\n    border: 2px solid rgba(255, 255, 255, 0.3);\n    border-radius: 50%;\n    border-top-color: white;\n    animation: spin 0.7s linear infinite;\n    display: inline-block;\n}\n\n\n/* ── Debug Section ── */\n#debug-section {\n    margin-top: auto;\n    padding-top: 8px;\n}\n\ndetails {\n    background: transparent;\n    border: none;\n    border-radius: var(--radius);\n}\n\nsummary {\n    padding: 5px 0;\n    cursor: pointer;\n    font-size: 11px;\n    font-weight: 600;\n    color: var(--text-3);\n    display: flex;\n    align-items: center;\n    gap: 5px;\n    list-style: none;\n    user-select: none;\n    transition: color 0.15s;\n}\n\nsummary::-webkit-details-marker { display: none; }\nsummary:hover { color: var(--text-2); }\ndetails[open] summary svg { transform: rotate(180deg); }\nsummary svg { transition: transform 0.15s; }\ndetails[open] summary { margin-bottom: 5px; }\n\npre {\n    margin: 0;\n    padding: 11px;\n    background: var(--input-bg);\n    color: var(--text-2);\n    font-family: var(--mono);\n    font-size: 11px;\n    overflow-x: auto;\n    border: 1px solid var(--card-border);\n    border-radius: 9px;\n    line-height: 1.55;\n    white-space: pre-wrap;\n    word-break: break-all;\n    max-height: 180px;\n}\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* SIDELOAD — Skeleton Loading Screen                              */\n/* ═══════════════════════════════════════════════════════════════ */\n.sideload-container {\n    height: 100vh;\n    display: flex;\n    flex-direction: column;\n    background: var(--bg);\n    overflow: hidden;\n}\n\n.sideload-skeleton {\n    display: flex;\n    flex-direction: column;\n    width: 100%;\n    height: 100%;\n    animation: fadeIn 0.3s ease-out;\n}\n\n.sk-shimmer {\n    background: linear-gradient(90deg, var(--card-border) 25%, var(--input-bg) 50%, var(--card-border) 75%);\n    background-size: 200% 100%;\n    animation: shimmer 1.8s ease-in-out infinite;\n    border-radius: 7px;\n}\n\n.sk-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 13px 16px;\n    border-bottom: 1px solid var(--card-border);\n}\n\n.sk-brand { display: flex; align-items: center; gap: 9px; }\n.sk-logo { width: 24px; height: 24px; border-radius: 7px; }\n.sk-title { width: 105px; height: 15px; border-radius: 5px; }\n.sk-header-actions { display: flex; gap: 5px; }\n.sk-icon-btn { width: 32px; height: 32px; border-radius: 9px; }\n\n.sk-mode-toggle {\n    display: flex;\n    gap: 4px;\n    padding: 8px 6px;\n    border-bottom: 1px solid var(--card-border);\n}\n\n.sk-mode-tab { flex: 1; height: 36px; border-radius: 9px; }\n\n.sk-welcome {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    padding: 34px 20px 18px;\n    gap: 11px;\n}\n\n.sk-welcome-icon { width: 52px; height: 52px; border-radius: 16px; }\n.sk-welcome-title { width: 145px; height: 19px; border-radius: 6px; }\n.sk-welcome-desc { width: 220px; height: 13px; border-radius: 5px; }\n.sk-welcome-desc.short { width: 175px; }\n\n.sk-suggestions {\n    display: flex;\n    flex-direction: column;\n    gap: 8px;\n    padding: 10px 32px;\n}\n\n.sk-suggestion { width: 100%; height: 38px; border-radius: 10px; }\n.sk-suggestion:nth-child(2) { animation-delay: 0.1s; }\n.sk-suggestion:nth-child(3) { animation-delay: 0.2s; }\n.sk-suggestion:nth-child(4) { animation-delay: 0.3s; }\n\n.sk-input-area {\n    margin-top: auto;\n    padding: 12px 16px 8px;\n    border-top: 1px solid var(--card-border);\n}\n\n.sk-input { width: 100%; height: 42px; border-radius: 14px; }\n\n.sideload-status {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    gap: 9px;\n    padding: 11px;\n    font-size: 11.5px;\n    font-weight: 500;\n    color: var(--text-3);\n}\n\n.sideload-pulse {\n    width: 8px; height: 8px;\n    border-radius: 50%;\n    background: var(--primary);\n    animation: pulse 1.5s ease-in-out infinite;\n    box-shadow: 0 0 8px var(--primary-glow);\n}\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* KEYFRAMES                                                       */\n/* ═══════════════════════════════════════════════════════════════ */\n@keyframes fadeIn {\n    from { opacity: 0; transform: translateY(3px); }\n    to   { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes slideDown {\n    from { opacity: 0; transform: translateY(-6px); }\n    to   { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes spin {\n    to { transform: rotate(360deg); }\n}\n\n@keyframes shimmer {\n    0%   { background-position: 200% 0; }\n    100% { background-position: -200% 0; }\n}\n\n@keyframes msgSlideIn {\n    from { opacity: 0; transform: translateY(6px); }\n    to   { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes typingBounce {\n    0%, 100% { transform: translateY(0); opacity: 0.4; }\n    50%      { transform: translateY(-4px); opacity: 1; }\n}\n\n@keyframes pulse {\n    0%, 100% { opacity: 0.4; transform: scale(0.85); }\n    50%      { opacity: 1; transform: scale(1.15); }\n}\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* SCROLLBAR                                                       */\n/* ═══════════════════════════════════════════════════════════════ */\n::-webkit-scrollbar { width: 5px; height: 5px; }\n::-webkit-scrollbar-track { background: transparent; }\n::-webkit-scrollbar-thumb { background: var(--card-border); border-radius: 4px; }\n::-webkit-scrollbar-thumb:hover { background: var(--text-3); }", "",{"version":3,"sources":["webpack://./src/taskpane/taskpane.css"],"names":[],"mappings":"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","sourcesContent":["/* \n * SheetCraft AI — Redesigned Interface\n * A warm, human-crafted design system.\n * Forest green + terracotta. No AI-purple gradients.\n */\n\n:root {\n    /* ── Surface & Layout ── */\n    --bg: #F5F4F1;\n    --surface: #FAFAF8;\n    --card: #FFFFFF;\n    --card-border: #E3E1DC;\n    --card-hover: #F0EFEB;\n    --input-bg: #F5F4F1;\n\n    /* ── Primary: Forest Green ── */\n    --primary: #2D6A4F;\n    --primary-hover: #1B4D3E;\n    --primary-light: #74C69D;\n    --primary-bg: rgba(45, 106, 79, 0.06);\n    --primary-glow: rgba(45, 106, 79, 0.12);\n\n    /* ── Accent: Terracotta ── */\n    --accent: #C4603D;\n    --accent-hover: #A8502F;\n    --accent-bg: rgba(196, 96, 61, 0.07);\n\n    /* ── Text ── */\n    --text: #1A1C1E;\n    --text-2: #555759;\n    --text-3: #8C8E91;\n    --text-4: #C5C7CA;\n\n    /* ── Semantic ── */\n    --success: #2D6A4F;\n    --success-bg: rgba(45, 106, 79, 0.07);\n    --error: #B83A3A;\n    --error-bg: rgba(184, 58, 58, 0.07);\n    --warning: #C08B2D;\n    --warning-bg: rgba(192, 139, 45, 0.07);\n\n    /* ── Shape ── */\n    --radius: 10px;\n    --radius-lg: 14px;\n    --radius-xl: 20px;\n\n    /* ── Depth — warm tinted shadows ── */\n    --shadow-sm: 0 1px 2px rgba(30, 25, 20, 0.04);\n    --shadow: 0 2px 5px rgba(30, 25, 20, 0.05), 0 1px 2px rgba(30, 25, 20, 0.03);\n    --shadow-md: 0 4px 12px rgba(30, 25, 20, 0.06), 0 1px 3px rgba(30, 25, 20, 0.04);\n    --shadow-lg: 0 8px 24px rgba(30, 25, 20, 0.08), 0 2px 6px rgba(30, 25, 20, 0.04);\n\n    /* ── Typography ── */\n    --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;\n    --mono: 'JetBrains Mono', 'Cascadia Code', 'Menlo', monospace;\n\n    /* ── Chat ── */\n    --chat-user-bg: var(--primary);\n    --chat-user-text: #FFFFFF;\n    --chat-ai-bg: #F0EFEB;\n    --chat-ai-border: #E3E1DC;\n    --chat-ai-text: var(--text);\n}\n\n/* ── Dark mode ── */\n@media (prefers-color-scheme: dark) {\n    :root {\n        --bg: #141516;\n        --surface: #1A1B1D;\n        --card: #212224;\n        --card-border: #313335;\n        --card-hover: #2A2B2D;\n        --input-bg: #19191B;\n\n        --primary: #52B788;\n        --primary-hover: #74C69D;\n        --primary-light: #2D6A4F;\n        --primary-bg: rgba(82, 183, 136, 0.08);\n        --primary-glow: rgba(82, 183, 136, 0.14);\n\n        --accent: #E0915A;\n        --accent-hover: #EAA876;\n        --accent-bg: rgba(224, 145, 90, 0.09);\n\n        --text: #E5E3DE;\n        --text-2: #9B9D9F;\n        --text-3: #606264;\n        --text-4: #3A3C3E;\n\n        --success: #52B788;\n        --success-bg: rgba(82, 183, 136, 0.09);\n        --error: #E06060;\n        --error-bg: rgba(224, 96, 96, 0.09);\n        --warning: #E0B85A;\n        --warning-bg: rgba(224, 184, 90, 0.09);\n\n        --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.18);\n        --shadow: 0 2px 5px rgba(0, 0, 0, 0.22);\n        --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.28);\n        --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.32);\n\n        --chat-user-bg: var(--primary);\n        --chat-user-text: #141516;\n        --chat-ai-bg: #262729;\n        --chat-ai-border: #313335;\n        --chat-ai-text: var(--text);\n    }\n}\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* RESET & BASE                                                    */\n/* ═══════════════════════════════════════════════════════════════ */\n*, *::before, *::after { box-sizing: border-box; }\n\nhtml, body {\n    width: 100%; height: 100%;\n    margin: 0; padding: 0;\n    font-family: var(--font);\n    font-size: 13px;\n    line-height: 1.55;\n    background: var(--bg);\n    color: var(--text);\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n    overflow-x: hidden;\n}\n\n#app-body {\n    display: flex;\n    flex-direction: column;\n    height: 100vh;\n    overflow: hidden;\n}\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* HEADER                                                          */\n/* ═══════════════════════════════════════════════════════════════ */\n.app-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 11px 16px;\n    background: var(--surface);\n    border-bottom: 1px solid var(--card-border);\n    position: sticky;\n    top: 0;\n    z-index: 20;\n}\n\n.brand {\n    display: flex;\n    align-items: center;\n    gap: 9px;\n}\n\n.logo {\n    color: var(--primary);\n    display: flex;\n    align-items: center;\n}\n\n.brand h1 {\n    font-size: 15px;\n    font-weight: 700;\n    margin: 0;\n    letter-spacing: -0.025em;\n    color: var(--text);\n}\n\n.highlight-text {\n    color: var(--primary);\n    font-weight: 700;\n    /* Solid color, not a gradient — feels hand-picked */\n}\n\n.header-actions {\n    display: flex;\n    gap: 5px;\n}\n\n\n/* ── Icon Buttons ── */\n.btn-icon {\n    width: 32px; height: 32px;\n    border: 1px solid var(--card-border);\n    border-radius: 9px;\n    background: var(--card);\n    color: var(--text-3);\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    transition: color 0.2s ease-out, border-color 0.2s ease-out, background 0.2s ease-out;\n    padding: 0;\n}\n\n.btn-icon:hover {\n    color: var(--primary);\n    border-color: var(--primary);\n    background: var(--primary-bg);\n}\n\n.btn-icon:active {\n    transform: scale(0.95);\n}\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* PANELS — Docs & Settings                                        */\n/* ═══════════════════════════════════════════════════════════════ */\n.panel {\n    padding: 16px;\n    background: var(--card);\n    border-bottom: 1px solid var(--card-border);\n    animation: slideDown 0.22s ease-out;\n}\n\n.panel h3 {\n    font-size: 11px;\n    font-weight: 650;\n    text-transform: uppercase;\n    letter-spacing: 0.06em;\n    color: var(--text-3);\n    margin: 0 0 12px;\n}\n\n\n/* ── Docs Grid ── */\n.docs-grid {\n    display: flex;\n    flex-direction: column;\n    gap: 8px;\n}\n\n.doc-item {\n    display: flex;\n    gap: 10px;\n    align-items: flex-start;\n    padding: 5px 0;\n}\n\n.doc-icon {\n    flex-shrink: 0;\n    width: 18px; height: 18px;\n    color: var(--primary);\n    display: flex;\n    align-items: center;\n    margin-top: 1px;\n}\n\n.doc-item strong {\n    font-size: 12px;\n    font-weight: 600;\n    color: var(--text);\n    display: block;\n    margin-bottom: 2px;\n}\n\n.doc-item p {\n    font-size: 11px;\n    color: var(--text-2);\n    margin: 0;\n    line-height: 1.45;\n}\n\n.docs-hint {\n    font-size: 11px;\n    color: var(--text-3);\n    margin: 12px 0 0;\n    font-style: italic;\n    line-height: 1.5;\n}\n\n\n/* ── Forms ── */\n.form-group { margin-bottom: 12px; }\n\n.form-group label {\n    display: block;\n    font-size: 11px;\n    font-weight: 600;\n    color: var(--text-3);\n    margin-bottom: 4px;\n    text-transform: uppercase;\n    letter-spacing: 0.04em;\n}\n\n.form-input {\n    width: 100%;\n    padding: 8px 11px;\n    font-size: 13px;\n    font-family: var(--font);\n    color: var(--text);\n    background: var(--input-bg);\n    border: 1px solid var(--card-border);\n    border-radius: 9px;\n    outline: none;\n    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;\n}\n\n.form-input:focus {\n    border-color: var(--primary);\n    box-shadow: 0 0 0 3px var(--primary-glow);\n}\n\nselect.form-input {\n    cursor: pointer;\n    appearance: none;\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%238C8E91' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\");\n    background-repeat: no-repeat;\n    background-position: right 10px center;\n    padding-right: 28px;\n}\n\n.btn-save {\n    width: 100%;\n    justify-content: center;\n    margin-top: 6px;\n}\n\n/* Model selector row */\n.model-select-wrapper {\n    display: flex;\n    gap: 5px;\n    align-items: center;\n}\n\n.model-select-wrapper .form-input {\n    flex: 1;\n    min-width: 0;\n}\n\n.btn-refresh {\n    width: 30px; height: 30px;\n    flex-shrink: 0;\n    padding: 0;\n}\n\n.model-status {\n    font-size: 11px;\n    margin-top: 4px;\n    min-height: 15px;\n    color: var(--text-3);\n}\n\n.model-status-ok  { color: var(--success); }\n.model-status-warn { color: var(--error); }\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* MODE TOGGLE                                                     */\n/* ═══════════════════════════════════════════════════════════════ */\n.mode-toggle {\n    display: flex;\n    align-items: center;\n    padding: 6px;\n    margin: 0;\n    background: var(--surface);\n    border-bottom: 1px solid var(--card-border);\n    position: relative;\n    gap: 4px;\n}\n\n.mode-tab {\n    flex: 1;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    gap: 6px;\n    padding: 9px 14px;\n    font-size: 12.5px;\n    font-weight: 600;\n    font-family: var(--font);\n    color: var(--text-3);\n    background: transparent;\n    border: none;\n    border-radius: 9px;\n    cursor: pointer;\n    transition: color 0.25s ease-out;\n    position: relative;\n    z-index: 2;\n}\n\n.mode-tab:hover { color: var(--text-2); }\n.mode-tab.active { color: var(--primary); }\n.mode-tab svg { width: 14px; height: 14px; }\n\n.mode-indicator {\n    position: absolute;\n    left: 6px;\n    top: 6px;\n    width: calc(50% - 8px);\n    height: calc(100% - 12px);\n    background: var(--primary-bg);\n    border: 1px solid var(--primary-glow);\n    border-radius: 9px;\n    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n    z-index: 1;\n}\n\n.mode-indicator.right {\n    transform: translateX(calc(100% + 4px));\n}\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* MODE CONTENT WRAPPER                                            */\n/* ═══════════════════════════════════════════════════════════════ */\n.mode-content {\n    display: none;\n    flex-direction: column;\n    flex: 1;\n    overflow: hidden;\n    animation: fadeIn 0.2s ease-out;\n}\n\n.mode-content.active { display: flex; }\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* PLANNING MODE — Chat                                            */\n/* ═══════════════════════════════════════════════════════════════ */\n\n/* ── Chat Messages Container ── */\n.chat-messages {\n    flex: 1;\n    overflow-y: auto;\n    padding: 14px 14px 6px;\n    display: flex;\n    flex-direction: column;\n    gap: 14px;\n    scroll-behavior: smooth;\n}\n\n\n/* ── Welcome Screen ── */\n.chat-welcome {\n    text-align: center;\n    padding: 28px 18px 18px;\n    animation: fadeIn 0.35s ease-out;\n}\n\n.welcome-icon {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    width: 52px; height: 52px;\n    background: var(--primary);\n    border-radius: 16px;\n    color: white;\n    margin-bottom: 14px;\n    box-shadow: 0 4px 14px rgba(45, 106, 79, 0.2);\n}\n\n.welcome-icon svg { width: 24px; height: 24px; }\n\n.chat-welcome h2 {\n    font-size: 17px;\n    font-weight: 700;\n    margin: 0 0 8px;\n    color: var(--text);\n    letter-spacing: -0.02em;\n}\n\n.chat-welcome p {\n    font-size: 12.5px;\n    color: var(--text-2);\n    margin: 0 0 18px;\n    line-height: 1.65;\n    max-width: 270px;\n    margin-left: auto;\n    margin-right: auto;\n}\n\n\n/* ── Chat Suggestions ── */\n.welcome-suggestions {\n    display: flex;\n    flex-direction: column;\n    gap: 7px;\n    max-width: 280px;\n    margin: 0 auto;\n}\n\n.suggestion-chip {\n    display: flex;\n    align-items: center;\n    gap: 9px;\n    padding: 10px 13px;\n    background: var(--card);\n    border: 1px solid var(--card-border);\n    border-radius: var(--radius);\n    font-size: 11.5px;\n    color: var(--text-2);\n    cursor: pointer;\n    transition: all 0.22s ease-out;\n    text-align: left;\n    font-family: var(--font);\n    line-height: 1.4;\n}\n\n.suggestion-chip:hover {\n    border-color: var(--primary);\n    color: var(--primary);\n    background: var(--primary-bg);\n    transform: translateX(3px);\n}\n\n.suggestion-chip svg {\n    flex-shrink: 0;\n    color: var(--primary);\n    opacity: 0.5;\n}\n\n.suggestion-chip:hover svg { opacity: 1; }\n\n\n/* ── Chat Message Bubbles ── */\n.chat-msg {\n    display: flex;\n    gap: 9px;\n    animation: msgSlideIn 0.25s ease-out;\n    max-width: 100%;\n}\n\n.chat-msg.user {\n    flex-direction: row-reverse;\n}\n\n.chat-avatar {\n    width: 28px; height: 28px;\n    border-radius: 9px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-shrink: 0;\n    font-size: 11px;\n    font-weight: 600;\n}\n\n.chat-msg.user .chat-avatar {\n    background: var(--primary);\n    color: white;\n}\n\n.chat-msg.ai .chat-avatar {\n    background: var(--primary-bg);\n    color: var(--primary);\n    border: 1px solid var(--primary-glow);\n}\n\n.chat-bubble {\n    padding: 11px 14px;\n    border-radius: var(--radius-lg);\n    font-size: 12.5px;\n    line-height: 1.65;\n    max-width: 82%;\n    word-wrap: break-word;\n    overflow-wrap: break-word;\n}\n\n.chat-msg.user .chat-bubble {\n    background: var(--chat-user-bg);\n    color: var(--chat-user-text);\n    border-bottom-right-radius: 5px;\n}\n\n.chat-msg.ai .chat-bubble {\n    background: var(--chat-ai-bg);\n    color: var(--chat-ai-text);\n    border: 1px solid var(--chat-ai-border);\n    border-bottom-left-radius: 5px;\n}\n\n\n/* ── Chat formatted text ── */\n.chat-bubble strong { font-weight: 600; }\n.chat-bubble em { font-style: italic; opacity: 0.9; }\n\n.chat-bubble code {\n    font-family: var(--mono);\n    font-size: 11px;\n    padding: 2px 5px;\n    border-radius: 5px;\n    background: rgba(0, 0, 0, 0.06);\n}\n\n.chat-msg.user .chat-bubble code {\n    background: rgba(255, 255, 255, 0.18);\n}\n\n.chat-bubble ul, .chat-bubble ol { margin: 6px 0; padding-left: 18px; }\n.chat-bubble li { margin-bottom: 3px; }\n.chat-bubble p { margin: 0 0 8px; }\n.chat-bubble p:last-child { margin: 0; }\n\n\n/* ── Execute from Chat ── */\n.chat-action-bar {\n    display: flex;\n    gap: 6px;\n    margin-top: 10px;\n}\n\n.btn-execute-from-chat {\n    display: inline-flex;\n    align-items: center;\n    gap: 5px;\n    padding: 5px 11px;\n    font-size: 10.5px;\n    font-weight: 600;\n    font-family: var(--font);\n    background: var(--primary-bg);\n    color: var(--primary);\n    border: 1px solid var(--primary-glow);\n    border-radius: 7px;\n    cursor: pointer;\n    transition: all 0.2s ease-out;\n}\n\n.btn-execute-from-chat:hover {\n    background: var(--primary);\n    color: white;\n    box-shadow: 0 2px 8px rgba(45, 106, 79, 0.25);\n}\n\n\n/* ── Typing Indicator ── */\n.typing-indicator {\n    display: flex;\n    gap: 4px;\n    align-items: center;\n    padding: 4px 0;\n}\n\n.typing-dot {\n    width: 6px; height: 6px;\n    background: var(--text-3);\n    border-radius: 50%;\n    animation: typingBounce 0.6s ease-in-out infinite;\n}\n\n.typing-dot:nth-child(2) { animation-delay: 0.15s; }\n.typing-dot:nth-child(3) { animation-delay: 0.3s; }\n\n\n/* ── Chat Input Area ── */\n.chat-input-area {\n    padding: 10px 14px 8px;\n    background: var(--surface);\n    border-top: 1px solid var(--card-border);\n}\n\n.chat-input-card {\n    display: flex;\n    align-items: flex-end;\n    gap: 7px;\n    background: var(--card);\n    border: 1px solid var(--card-border);\n    border-radius: var(--radius-lg);\n    padding: 5px 5px 5px 14px;\n    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;\n    box-shadow: var(--shadow-sm);\n}\n\n.chat-input-card:focus-within {\n    border-color: var(--primary);\n    box-shadow: 0 0 0 3px var(--primary-glow);\n}\n\n#chat-input {\n    flex: 1;\n    border: none;\n    background: transparent;\n    font-family: var(--font);\n    font-size: 13px;\n    color: var(--text);\n    padding: 8px 0;\n    resize: none;\n    outline: none;\n    min-height: 20px;\n    max-height: 84px;\n    line-height: 1.5;\n}\n\n#chat-input::placeholder { color: var(--text-3); }\n\n.btn-send {\n    width: 34px; height: 34px;\n    border: none;\n    border-radius: 9px;\n    background: var(--primary);\n    color: white;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-shrink: 0;\n    transition: background 0.2s ease-out, transform 0.15s ease-out;\n    box-shadow: 0 2px 6px rgba(45, 106, 79, 0.2);\n}\n\n.btn-send:hover {\n    background: var(--primary-hover);\n    transform: scale(1.04);\n}\n\n.btn-send:active { transform: scale(0.94); }\n\n.btn-send:disabled {\n    opacity: 0.35;\n    cursor: not-allowed;\n    transform: none;\n}\n\n.btn-send svg { width: 14px; height: 14px; }\n\n.chat-footer {\n    display: flex;\n    justify-content: center;\n    padding: 4px 0 0;\n}\n\n.btn-text {\n    display: inline-flex;\n    align-items: center;\n    gap: 4px;\n    padding: 5px 9px;\n    font-size: 11px;\n    font-weight: 500;\n    font-family: var(--font);\n    color: var(--text-3);\n    background: transparent;\n    border: none;\n    cursor: pointer;\n    border-radius: 7px;\n    transition: color 0.15s, background 0.15s;\n}\n\n.btn-text:hover {\n    color: var(--error);\n    background: var(--error-bg);\n}\n\n.btn-text svg { width: 12px; height: 12px; }\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* AGENT MODE                                                      */\n/* ═══════════════════════════════════════════════════════════════ */\n.content-wrapper {\n    flex: 1;\n    padding: 14px;\n    display: flex;\n    flex-direction: column;\n    gap: 12px;\n    width: 100%;\n    overflow-y: auto;\n}\n\n\n/* ── Category Tabs ── */\n.action-categories {\n    display: flex;\n    gap: 5px;\n    overflow-x: auto;\n    padding: 2px 0;\n    scrollbar-width: none;\n}\n\n.action-categories::-webkit-scrollbar { display: none; }\n\n.category-tab {\n    display: flex;\n    align-items: center;\n    gap: 5px;\n    padding: 7px 11px;\n    font-size: 11px;\n    font-weight: 600;\n    font-family: var(--font);\n    color: var(--text-3);\n    background: transparent;\n    border: 1px solid transparent;\n    border-radius: 9px;\n    cursor: pointer;\n    transition: all 0.2s ease-out;\n    white-space: nowrap;\n    flex-shrink: 0;\n}\n\n.category-tab:hover {\n    color: var(--text-2);\n    background: var(--card);\n}\n\n.category-tab.active {\n    color: var(--primary);\n    background: var(--primary-bg);\n    border-color: var(--primary-glow);\n}\n\n.category-tab svg { width: 12px; height: 12px; }\n\n\n/* ── Quick Action Chips ── */\n.quick-actions {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 6px;\n}\n\n.chip {\n    display: inline-flex;\n    align-items: center;\n    gap: 5px;\n    padding: 6px 11px;\n    font-size: 11px;\n    font-weight: 500;\n    font-family: var(--font);\n    color: var(--text-2);\n    background: var(--card);\n    border: 1px solid var(--card-border);\n    border-radius: 20px;\n    cursor: pointer;\n    transition: all 0.2s ease-out;\n    white-space: nowrap;\n}\n\n.chip:hover {\n    color: var(--primary);\n    border-color: var(--primary);\n    background: var(--primary-bg);\n    transform: translateY(-1px);\n    box-shadow: var(--shadow-sm);\n}\n\n.chip:active {\n    transform: scale(0.96) translateY(0);\n}\n\n.chip svg { width: 12px; height: 12px; flex-shrink: 0; }\n\n\n/* ── Input Card (Agent) ── */\n.input-card {\n    background: var(--card);\n    border: 1px solid var(--card-border);\n    border-radius: var(--radius-lg);\n    display: flex;\n    flex-direction: column;\n    box-shadow: var(--shadow);\n    overflow: hidden;\n    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;\n}\n\n.input-card:focus-within {\n    border-color: var(--primary);\n    box-shadow: 0 0 0 3px var(--primary-glow);\n}\n\ntextarea {\n    width: 100%;\n    min-height: 84px;\n    padding: 12px 14px;\n    background: transparent;\n    border: none;\n    color: var(--text);\n    font-family: var(--font);\n    font-size: 13px;\n    line-height: 1.6;\n    resize: vertical;\n    outline: none;\n}\n\ntextarea::placeholder {\n    color: var(--text-3);\n    opacity: 0.85;\n}\n\n.card-footer {\n    padding: 8px 12px;\n    border-top: 1px solid var(--card-border);\n    display: flex;\n    justify-content: flex-end;\n    align-items: center;\n    gap: 8px;\n}\n\n\n/* ── Cache Badge ── */\n.cache-badge {\n    font-size: 10.5px;\n    font-weight: 600;\n    color: var(--success);\n    background: var(--success-bg);\n    padding: 3px 9px;\n    border-radius: 10px;\n    animation: fadeIn 0.2s;\n}\n\n\n/* ── Primary Button ── */\n.btn-primary {\n    background: var(--primary);\n    color: white;\n    border: none;\n    padding: 8px 16px;\n    border-radius: 9px;\n    font-size: 12px;\n    font-weight: 600;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    transition: background 0.2s ease-out, transform 0.15s ease-out, box-shadow 0.2s ease-out;\n    box-shadow: 0 2px 6px rgba(45, 106, 79, 0.2);\n}\n\n.btn-primary:hover {\n    background: var(--primary-hover);\n    transform: translateY(-1px);\n    box-shadow: 0 4px 14px rgba(45, 106, 79, 0.25);\n}\n\n.btn-primary:active {\n    transform: translateY(0);\n}\n\n.btn-primary:disabled {\n    opacity: 0.4;\n    cursor: not-allowed;\n    transform: none;\n}\n\n.btn-primary svg { width: 13px; height: 13px; }\n\n\n/* ── Skeleton Loading ── */\n.skeleton-container {\n    display: flex;\n    flex-direction: column;\n    gap: 9px;\n    padding: 4px 0;\n}\n\n.skeleton-pill {\n    width: 140px;\n    height: 28px;\n    border-radius: 9px;\n    background: linear-gradient(90deg, var(--card-border) 25%, var(--input-bg) 50%, var(--card-border) 75%);\n    background-size: 200% 100%;\n    animation: shimmer 1.6s ease-in-out infinite;\n}\n\n.skeleton-line {\n    height: 13px;\n    border-radius: 5px;\n    background: linear-gradient(90deg, var(--card-border) 25%, var(--input-bg) 50%, var(--card-border) 75%);\n    background-size: 200% 100%;\n    animation: shimmer 1.6s ease-in-out infinite;\n}\n\n.skeleton-line.w80 { width: 80%; }\n.skeleton-line.w60 { width: 60%; }\n\n\n/* ── Status Pill ── */\n.status-pill {\n    padding: 9px 13px;\n    border-radius: var(--radius);\n    font-size: 12px;\n    font-weight: 500;\n    display: none;\n    align-items: center;\n    gap: 7px;\n    animation: fadeIn 0.2s;\n    border: 1px solid transparent;\n}\n\n.status-pill.info {\n    background: var(--primary-bg);\n    color: var(--primary);\n    border-color: var(--primary-glow);\n}\n\n.status-pill.success {\n    background: var(--success-bg);\n    color: var(--success);\n    border-color: rgba(45, 106, 79, 0.12);\n}\n\n.status-pill.error {\n    background: var(--error-bg);\n    color: var(--error);\n    border-color: rgba(184, 58, 58, 0.12);\n}\n\n\n/* ── Spinners ── */\n.spinner {\n    width: 14px; height: 14px;\n    border: 2px solid transparent;\n    border-radius: 50%;\n    border-top-color: currentColor;\n    border-right-color: currentColor;\n    animation: spin 0.7s linear infinite;\n}\n\n.btn-spinner {\n    width: 13px; height: 13px;\n    border: 2px solid rgba(255, 255, 255, 0.3);\n    border-radius: 50%;\n    border-top-color: white;\n    animation: spin 0.7s linear infinite;\n    display: inline-block;\n}\n\n\n/* ── Debug Section ── */\n#debug-section {\n    margin-top: auto;\n    padding-top: 8px;\n}\n\ndetails {\n    background: transparent;\n    border: none;\n    border-radius: var(--radius);\n}\n\nsummary {\n    padding: 5px 0;\n    cursor: pointer;\n    font-size: 11px;\n    font-weight: 600;\n    color: var(--text-3);\n    display: flex;\n    align-items: center;\n    gap: 5px;\n    list-style: none;\n    user-select: none;\n    transition: color 0.15s;\n}\n\nsummary::-webkit-details-marker { display: none; }\nsummary:hover { color: var(--text-2); }\ndetails[open] summary svg { transform: rotate(180deg); }\nsummary svg { transition: transform 0.15s; }\ndetails[open] summary { margin-bottom: 5px; }\n\npre {\n    margin: 0;\n    padding: 11px;\n    background: var(--input-bg);\n    color: var(--text-2);\n    font-family: var(--mono);\n    font-size: 11px;\n    overflow-x: auto;\n    border: 1px solid var(--card-border);\n    border-radius: 9px;\n    line-height: 1.55;\n    white-space: pre-wrap;\n    word-break: break-all;\n    max-height: 180px;\n}\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* SIDELOAD — Skeleton Loading Screen                              */\n/* ═══════════════════════════════════════════════════════════════ */\n.sideload-container {\n    height: 100vh;\n    display: flex;\n    flex-direction: column;\n    background: var(--bg);\n    overflow: hidden;\n}\n\n.sideload-skeleton {\n    display: flex;\n    flex-direction: column;\n    width: 100%;\n    height: 100%;\n    animation: fadeIn 0.3s ease-out;\n}\n\n.sk-shimmer {\n    background: linear-gradient(90deg, var(--card-border) 25%, var(--input-bg) 50%, var(--card-border) 75%);\n    background-size: 200% 100%;\n    animation: shimmer 1.8s ease-in-out infinite;\n    border-radius: 7px;\n}\n\n.sk-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 13px 16px;\n    border-bottom: 1px solid var(--card-border);\n}\n\n.sk-brand { display: flex; align-items: center; gap: 9px; }\n.sk-logo { width: 24px; height: 24px; border-radius: 7px; }\n.sk-title { width: 105px; height: 15px; border-radius: 5px; }\n.sk-header-actions { display: flex; gap: 5px; }\n.sk-icon-btn { width: 32px; height: 32px; border-radius: 9px; }\n\n.sk-mode-toggle {\n    display: flex;\n    gap: 4px;\n    padding: 8px 6px;\n    border-bottom: 1px solid var(--card-border);\n}\n\n.sk-mode-tab { flex: 1; height: 36px; border-radius: 9px; }\n\n.sk-welcome {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    padding: 34px 20px 18px;\n    gap: 11px;\n}\n\n.sk-welcome-icon { width: 52px; height: 52px; border-radius: 16px; }\n.sk-welcome-title { width: 145px; height: 19px; border-radius: 6px; }\n.sk-welcome-desc { width: 220px; height: 13px; border-radius: 5px; }\n.sk-welcome-desc.short { width: 175px; }\n\n.sk-suggestions {\n    display: flex;\n    flex-direction: column;\n    gap: 8px;\n    padding: 10px 32px;\n}\n\n.sk-suggestion { width: 100%; height: 38px; border-radius: 10px; }\n.sk-suggestion:nth-child(2) { animation-delay: 0.1s; }\n.sk-suggestion:nth-child(3) { animation-delay: 0.2s; }\n.sk-suggestion:nth-child(4) { animation-delay: 0.3s; }\n\n.sk-input-area {\n    margin-top: auto;\n    padding: 12px 16px 8px;\n    border-top: 1px solid var(--card-border);\n}\n\n.sk-input { width: 100%; height: 42px; border-radius: 14px; }\n\n.sideload-status {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    gap: 9px;\n    padding: 11px;\n    font-size: 11.5px;\n    font-weight: 500;\n    color: var(--text-3);\n}\n\n.sideload-pulse {\n    width: 8px; height: 8px;\n    border-radius: 50%;\n    background: var(--primary);\n    animation: pulse 1.5s ease-in-out infinite;\n    box-shadow: 0 0 8px var(--primary-glow);\n}\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* KEYFRAMES                                                       */\n/* ═══════════════════════════════════════════════════════════════ */\n@keyframes fadeIn {\n    from { opacity: 0; transform: translateY(3px); }\n    to   { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes slideDown {\n    from { opacity: 0; transform: translateY(-6px); }\n    to   { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes spin {\n    to { transform: rotate(360deg); }\n}\n\n@keyframes shimmer {\n    0%   { background-position: 200% 0; }\n    100% { background-position: -200% 0; }\n}\n\n@keyframes msgSlideIn {\n    from { opacity: 0; transform: translateY(6px); }\n    to   { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes typingBounce {\n    0%, 100% { transform: translateY(0); opacity: 0.4; }\n    50%      { transform: translateY(-4px); opacity: 1; }\n}\n\n@keyframes pulse {\n    0%, 100% { opacity: 0.4; transform: scale(0.85); }\n    50%      { opacity: 1; transform: scale(1.15); }\n}\n\n\n/* ═══════════════════════════════════════════════════════════════ */\n/* SCROLLBAR                                                       */\n/* ═══════════════════════════════════════════════════════════════ */\n::-webkit-scrollbar { width: 5px; height: 5px; }\n::-webkit-scrollbar-track { background: transparent; }\n::-webkit-scrollbar-thumb { background: var(--card-border); border-radius: 4px; }\n::-webkit-scrollbar-thumb:hover { background: var(--text-3); }"],"sourceRoot":""}]);
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

/***/ "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2710%27 height=%2710%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%238C8E91%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2710%27 height=%2710%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%238C8E91%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E ***!
  \***************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module) {

module.exports = "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2710%27 height=%2710%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%238C8E91%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E";

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
/* harmony import */ var _services_chat_prompt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/chat-prompt */ "./src/services/chat-prompt.ts");
/* harmony import */ var _services_llm_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/llm.service */ "./src/services/llm.service.ts");
/* harmony import */ var _services_cache__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/cache */ "./src/services/cache.ts");
/* harmony import */ var _services_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/icons */ "./src/services/icons.ts");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/* global console, document, Excel, Office */







// ─── Types ─────────────────────────────────────────────────────

// ─── State ─────────────────────────────────────────────────────
var currentMode = "planning";
var currentCategory = "cleanup";
var chatHistory = [];
var chatConversation = [];
var isChatBusy = false;

// ─── Quick Actions by Category ─────────────────────────────────
var CATEGORIZED_ACTIONS = {
  cleanup: [{
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
  }],
  analysis: [{
    icon: "formula",
    label: "Auto SUM",
    prompt: "Add a SUM formula at the bottom of each numeric column with a bold TOTAL label."
  }, {
    icon: "formula",
    label: "AVERAGE Row",
    prompt: "Add an AVERAGE formula at the bottom of each numeric column with a bold AVERAGE label."
  }, {
    icon: "barChart",
    label: "Column Chart",
    prompt: "Create a clustered column chart from the data in the sheet. Add a title, legend at the bottom, and position it next to the data."
  }, {
    icon: "trendUp",
    label: "Trend Line",
    prompt: "Create a line chart from the numeric data showing trends over time. Add a title and gridlines."
  }, {
    icon: "formula",
    label: "COUNT & COUNTA",
    prompt: "Add COUNT and COUNTA formulas at the bottom to count numeric and non-empty cells in each column."
  }, {
    icon: "sortAsc",
    label: "Sort A→Z",
    prompt: "Sort the data by the first column in ascending order."
  }, {
    icon: "filter",
    label: "AutoFilter",
    prompt: "Apply AutoFilter to the data range so users can filter any column."
  }, {
    icon: "trendUp",
    label: "Conditional Colors",
    prompt: "Add conditional formatting with a 3-color scale: green for high, yellow for medium, red for low values on numeric columns."
  }],
  format: [{
    icon: "paintbrush",
    label: "Professional",
    prompt: "Apply professional formatting: bold headers with dark blue (#2B3A67) background and white text, alternating row colors (#F0F4FF and white), thin borders, and auto-fit."
  }, {
    icon: "paintbrush",
    label: "Dark Theme",
    prompt: "Apply dark theme formatting: dark gray (#2D2D2D) header with gold (#FFD700) text, dark rows (#3D3D3D) alternating with (#333333), light gray text, and thin borders."
  }, {
    icon: "paintbrush",
    label: "Colorful",
    prompt: "Apply colorful formatting: gradient blue header (#4A90D9) with white text, alternating pastel blue and pink rows, rounded borders effect, and auto-fit."
  }, {
    icon: "snowflake",
    label: "Freeze Header",
    prompt: "Freeze the first row so headers stay visible when scrolling."
  }, {
    icon: "table",
    label: "Excel Table",
    prompt: "Convert the data into a formatted Excel Table with TableStyleMedium9 style and auto-fit columns."
  }, {
    icon: "hash",
    label: "Currency $",
    prompt: "Format all numeric columns as currency ($#,##0.00) and auto-fit."
  }, {
    icon: "hash",
    label: "Percentage %",
    prompt: "Format the last numeric column as percentage (0.00%) and auto-fit."
  }, {
    icon: "paintbrush",
    label: "Borders All",
    prompt: "Add thin borders to all cells in the used range — inside horizontal, inside vertical, and all edges."
  }],
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
    label: "Sales Report",
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
  }]
};

// Chat Suggestions (shown on welcome screen)
var CHAT_SUGGESTIONS = [{
  icon: "formula",
  text: "When should I use VLOOKUP vs INDEX/MATCH?"
}, {
  icon: "barChart",
  text: "Which chart works best for my data?"
}, {
  icon: "trendUp",
  text: "Help me clean up messy spreadsheet data"
}, {
  icon: "table",
  text: "Best way to structure a dashboard?"
}];

// ─── Initialization ────────────────────────────────────────────
Office.onReady(function (info) {
  if (info.host === Office.HostType.Excel) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";

    // Inject icons
    injectIcons();

    // Wire up actions
    document.getElementById("run").onclick = runAICommand;
    document.getElementById("settings-toggle").onclick = function () {
      return togglePanel("settings-panel");
    };
    document.getElementById("docs-toggle").onclick = function () {
      return togglePanel("docs-panel");
    };
    document.getElementById("save-settings").onclick = handleSaveSettings;
    document.getElementById("refresh-models").onclick = function () {
      return loadOllamaModels();
    };

    // Mode toggle
    document.getElementById("mode-planning").onclick = function () {
      return switchMode("planning");
    };
    document.getElementById("mode-agent").onclick = function () {
      return switchMode("agent");
    };

    // Chat actions
    document.getElementById("chat-send").onclick = sendChatMessage;
    document.getElementById("chat-clear").onclick = clearChat;
    setupChatInput();

    // Category tabs
    document.querySelectorAll(".category-tab").forEach(function (tab) {
      tab.onclick = function () {
        var cat = tab.dataset.category;
        switchCategory(cat);
      };
    });

    // Build UI
    buildQuickActions();
    buildChatSuggestions();
    loadSettingsUI();
    injectDocIcons();
    injectCategoryIcons();
  }
});

// ─── Icon Injection ────────────────────────────────────────────
function injectIcons() {
  var el = function el(id, html) {
    var node = document.getElementById(id);
    if (node) node.innerHTML = html;
  };
  el("logo-icon", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.fileText);
  el("settings-toggle", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.settings);
  el("docs-toggle", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.helpCircle);
  el("run-icon", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.arrowRight);
  el("chevron-icon", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.chevronDown);
  el("refresh-models", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.refresh);
  el("mode-planning-icon", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.messageCircle);
  el("mode-agent-icon", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.zap);
  el("chat-send-icon", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.send);
  el("chat-clear-icon", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.trash);
  el("welcome-sparkle", _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.sparkles);
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
  buildQuickActions();
}

// ─── Quick Actions (Agent Mode) ────────────────────────────────
function buildQuickActions() {
  var container = document.getElementById("quick-actions");
  if (!container) return;
  container.innerHTML = "";
  var actions = CATEGORIZED_ACTIONS[currentCategory] || [];
  actions.forEach(function (action) {
    var chip = document.createElement("button");
    chip.className = "chip";
    var iconKey = action.icon;
    chip.innerHTML = "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons[iconKey] || "", "<span>").concat(action.label, "</span>");
    chip.onclick = function () {
      var input = document.getElementById("prompt-input");
      input.value = action.prompt;
      input.focus();
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
    btn.innerHTML = "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons[iconKey] || "").concat(s.text);
    btn.onclick = function () {
      var input = document.getElementById("chat-input");
      input.value = s.text;
      sendChatMessage();
    };
    container.appendChild(btn);
  });
}

// ─── Panel Toggle ──────────────────────────────────────────────
function togglePanel(panelId) {
  var panel = document.getElementById(panelId);
  var isHidden = panel.style.display === "none" || !panel.style.display;
  document.querySelectorAll(".panel").forEach(function (p) {
    p.style.display = "none";
  });
  if (isHidden) {
    panel.style.display = "block";
    if (panelId === "settings-panel") {
      var provider = document.getElementById("setting-provider").value;
      if (provider === "local") loadOllamaModels();
    }
  }
}

// ─── Settings ──────────────────────────────────────────────────
function loadSettingsUI() {
  var config = (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_3__.getConfig)();
  document.getElementById("setting-provider").value = config.provider;
  document.getElementById("setting-api-key").value = config.apiKey || "";
  document.getElementById("setting-base-url").value = config.baseUrl || "";
  document.getElementById("setting-groq-model").value = config.groqModel || config.model || "llama-3.1-8b-instant";
  updateProviderFields(config.provider);
  document.getElementById("setting-provider").onchange = function (e) {
    var p = e.target.value;
    updateProviderFields(p);
    if (p === "local") loadOllamaModels();
  };
}
function updateProviderFields(p) {
  document.getElementById("groq-fields").style.display = p === "groq" ? "block" : "none";
  document.getElementById("local-fields").style.display = p === "local" ? "block" : "none";
}
function loadOllamaModels() {
  return _loadOllamaModels.apply(this, arguments);
}
function _loadOllamaModels() {
  _loadOllamaModels = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var select, statusEl, host, models, config;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          select = document.getElementById("setting-local-model");
          statusEl = document.getElementById("model-status");
          host = document.getElementById("setting-base-url").value.trim() || "http://localhost:11434";
          select.innerHTML = "<option value=\"\" disabled selected>Loading...</option>";
          statusEl.textContent = "";
          statusEl.className = "model-status";
          _context.n = 1;
          return (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_3__.fetchOllamaModels)(host);
        case 1:
          models = _context.v;
          if (!(models.length === 0)) {
            _context.n = 2;
            break;
          }
          select.innerHTML = "<option value=\"\" disabled selected>No models found</option>";
          statusEl.textContent = "Ollama not running or no models installed";
          statusEl.className = "model-status model-status-warn";
          return _context.a(2);
        case 2:
          config = (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_3__.getConfig)();
          select.innerHTML = "";
          models.forEach(function (m) {
            var opt = document.createElement("option");
            opt.value = m.name;
            opt.textContent = "".concat(m.name, " (").concat((m.size / 1e9).toFixed(1), "GB)");
            if ((config.localModel || config.model) === m.name) opt.selected = true;
            select.appendChild(opt);
          });
          statusEl.textContent = "".concat(models.length, " model").concat(models.length > 1 ? "s" : "", " found");
          statusEl.className = "model-status model-status-ok";
        case 3:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _loadOllamaModels.apply(this, arguments);
}
function handleSaveSettings() {
  var provider = document.getElementById("setting-provider").value;
  var config;
  if (provider === "groq") {
    config = {
      provider: "groq",
      apiKey: document.getElementById("setting-api-key").value.trim(),
      groqModel: document.getElementById("setting-groq-model").value || "llama-3.1-8b-instant"
    };
  } else {
    var host = document.getElementById("setting-base-url").value.trim() || "http://localhost:11434";
    config = {
      provider: "local",
      baseUrl: "".concat(host, "/v1/chat/completions"),
      localModel: document.getElementById("setting-local-model").value
    };
  }
  (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_3__.saveConfig)(config);
  var btn = document.getElementById("save-settings");
  btn.textContent = "Saved ✓";
  setTimeout(function () {
    btn.textContent = "Save";
  }, 1200);
  setTimeout(function () {
    return togglePanel("settings-panel");
  }, 600);
}

// ═══════════════════════════════════════════════════════════════
// PLANNING MODE — Chat Functions
// ═══════════════════════════════════════════════════════════════

function setupChatInput() {
  var input = document.getElementById("chat-input");

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
    var input, message, welcome, typingEl, response, formattedResponse, _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          if (!isChatBusy) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2);
        case 1:
          input = document.getElementById("chat-input");
          message = input.value.trim();
          if (message) {
            _context2.n = 2;
            break;
          }
          return _context2.a(2);
        case 2:
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

          // Build conversation context
          if (chatConversation.length === 0) {
            chatConversation.push({
              role: "system",
              content: _services_chat_prompt__WEBPACK_IMPORTED_MODULE_2__.CHAT_PROMPT
            });
          }
          chatConversation.push({
            role: "user",
            content: message
          });

          // Clear input
          input.value = "";
          input.style.height = "auto";

          // Show typing indicator
          typingEl = showTypingIndicator();
          isChatBusy = true;
          document.getElementById("chat-send").disabled = true;
          _context2.p = 3;
          _context2.n = 4;
          return (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_3__.callLLM)(chatConversation);
        case 4:
          response = _context2.v;
          // Remove typing indicator
          typingEl.remove();

          // Format and display AI response
          formattedResponse = formatChatResponse(response);
          addChatBubble("ai", formattedResponse, response);
          chatConversation.push({
            role: "assistant",
            content: response
          });
          chatHistory.push({
            role: "ai",
            content: response,
            timestamp: Date.now()
          });
          _context2.n = 6;
          break;
        case 5:
          _context2.p = 5;
          _t = _context2.v;
          typingEl.remove();
          addChatBubble("ai", "<p style=\"color:var(--error)\">\u26A0\uFE0F ".concat(_t.message, "</p>"));
        case 6:
          _context2.p = 6;
          isChatBusy = false;
          document.getElementById("chat-send").disabled = false;
          return _context2.f(6);
        case 7:
          return _context2.a(2);
      }
    }, _callee2, null, [[3, 5, 6, 7]]);
  }));
  return _sendChatMessage.apply(this, arguments);
}
function addChatBubble(role, htmlContent, rawContent) {
  var container = document.getElementById("chat-messages");
  var msgDiv = document.createElement("div");
  msgDiv.className = "chat-msg ".concat(role);
  var avatarDiv = document.createElement("div");
  avatarDiv.className = "chat-avatar";
  avatarDiv.innerHTML = role === "user" ? _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.user : _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.bot;
  var bubbleDiv = document.createElement("div");
  bubbleDiv.className = "chat-bubble";
  bubbleDiv.innerHTML = htmlContent;

  // If AI message, add "Execute in Agent" button
  if (role === "ai" && rawContent) {
    var actionBar = document.createElement("div");
    actionBar.className = "chat-action-bar";
    var execBtn = document.createElement("button");
    execBtn.className = "btn-execute-from-chat";
    execBtn.innerHTML = "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.zap, " Switch to Agent");
    execBtn.onclick = function () {
      // Extract any actionable text and put it in agent mode
      var agentPromptInput = document.getElementById("prompt-input");
      // Try to find a practical suggestion from the AI response
      agentPromptInput.value = extractActionablePrompt(rawContent);
      switchMode("agent");
      agentPromptInput.focus();
    };
    actionBar.appendChild(execBtn);
    bubbleDiv.appendChild(actionBar);
  }
  msgDiv.appendChild(avatarDiv);
  msgDiv.appendChild(bubbleDiv);
  container.appendChild(msgDiv);

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}
function showTypingIndicator() {
  var container = document.getElementById("chat-messages");
  var msgDiv = document.createElement("div");
  msgDiv.className = "chat-msg ai";
  msgDiv.id = "typing-msg";
  var avatarDiv = document.createElement("div");
  avatarDiv.className = "chat-avatar";
  avatarDiv.innerHTML = _services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.bot;
  var bubbleDiv = document.createElement("div");
  bubbleDiv.className = "chat-bubble";
  bubbleDiv.innerHTML = "\n    <div class=\"typing-indicator\">\n      <div class=\"typing-dot\"></div>\n      <div class=\"typing-dot\"></div>\n      <div class=\"typing-dot\"></div>\n    </div>\n  ";
  msgDiv.appendChild(avatarDiv);
  msgDiv.appendChild(bubbleDiv);
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  return msgDiv;
}
function formatChatResponse(text) {
  // Convert markdown-like formatting to HTML
  var html = text;

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre style="margin:6px 0;padding:8px;background:rgba(0,0,0,0.06);border-radius:6px;font-family:var(--mono);font-size:10px;overflow-x:auto"><code>$2</code></pre>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Bullet lists
  html = html.replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>[\s\S]*?<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Numbered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

  // Line breaks → paragraphs
  var paragraphs = html.split(/\n\n+/);
  html = paragraphs.map(function (p) {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<ul>') || p.startsWith('<ol>') || p.startsWith('<pre>') || p.startsWith('<li>')) return p;
    // Don't wrap if it's already wrapped
    if (p.startsWith('<p>')) return p;
    return "<p>".concat(p.replace(/\n/g, '<br>'), "</p>");
  }).join('');
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
  var welcomeHTML = "\n    <div class=\"chat-welcome\">\n      <div class=\"welcome-icon\">".concat(_services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.sparkles, "</div>\n      <h2>What are you working on?</h2>\n      <p>I'm your spreadsheet thinking partner. Ask me about formulas, data strategies, best practices, or let me help you plan your next step.</p>\n      <div class=\"welcome-suggestions\" id=\"chat-suggestions\"></div>\n    </div>\n  ");
  container.innerHTML = welcomeHTML;
  buildChatSuggestions();
}

// ═══════════════════════════════════════════════════════════════
// AGENT MODE — Execute Functions (Existing + Enhanced)
// ═══════════════════════════════════════════════════════════════

var MAX_RETRIES = 1;
function runAICommand() {
  return _runAICommand.apply(this, arguments);
}

// ─── Helpers ───────────────────────────────────────────────────
function _runAICommand() {
  _runAICommand = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var statusEl, debugEl, skeletonEl, cacheBadge, promptInput, button, userPrompt, originalHTML, code, fromCache, cached, lastError, success, attempt, _t2, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          statusEl = document.getElementById("status-message");
          debugEl = document.getElementById("debug-code");
          skeletonEl = document.getElementById("skeleton");
          cacheBadge = document.getElementById("cache-badge");
          promptInput = document.getElementById("prompt-input");
          button = document.getElementById("run");
          userPrompt = promptInput.value.trim();
          if (userPrompt) {
            _context3.n = 1;
            break;
          }
          showStatus(statusEl, "info", "Please enter a command.");
          return _context3.a(2);
        case 1:
          // UI: loading
          originalHTML = button.innerHTML;
          button.disabled = true;
          button.innerHTML = "<span class=\"btn-spinner\"></span><span>Generating...</span>";
          statusEl.style.display = "none";
          skeletonEl.style.display = "flex";
          cacheBadge.style.display = "none";
          debugEl.innerText = "";
          _context3.p = 2;
          fromCache = false; // Check cache first
          cached = (0,_services_cache__WEBPACK_IMPORTED_MODULE_4__.getCachedResponse)(userPrompt);
          if (!cached) {
            _context3.n = 3;
            break;
          }
          code = cached;
          fromCache = true;
          cacheBadge.style.display = "inline-block";
          _context3.n = 5;
          break;
        case 3:
          _context3.n = 4;
          return (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_3__.callLLM)([{
            role: "system",
            content: _services_prompt__WEBPACK_IMPORTED_MODULE_1__.SYSTEM_PROMPT
          }, {
            role: "user",
            content: userPrompt
          }]);
        case 4:
          code = _context3.v;
        case 5:
          debugEl.innerText = code;
          skeletonEl.style.display = "none";

          // Execute with retry
          lastError = null;
          success = false;
          attempt = 0;
        case 6:
          if (!(attempt <= MAX_RETRIES)) {
            _context3.n = 12;
            break;
          }
          _context3.p = 7;
          button.innerHTML = "<span class=\"btn-spinner\"></span><span>".concat(attempt > 0 ? "Retrying..." : "Running...", "</span>");
          showStatus(statusEl, "info", "<div class=\"spinner\"></div><span>".concat(attempt > 0 ? "Auto-fixing..." : "Executing...", "</span>"));
          _context3.n = 8;
          return executeExcelCode(code);
        case 8:
          success = true;
          return _context3.a(3, 12);
        case 9:
          _context3.p = 9;
          _t2 = _context3.v;
          lastError = _t2;
          console.warn("Attempt ".concat(attempt + 1, " failed:"), _t2.message);
          if (!(attempt < MAX_RETRIES)) {
            _context3.n = 11;
            break;
          }
          showStatus(statusEl, "info", '<div class="spinner"></div><span>AI is fixing the error...</span>');
          button.innerHTML = "<span class=\"btn-spinner\"></span><span>Fixing...</span>";
          _context3.n = 10;
          return (0,_services_llm_service__WEBPACK_IMPORTED_MODULE_3__.callLLM)([{
            role: "system",
            content: _services_prompt__WEBPACK_IMPORTED_MODULE_1__.SYSTEM_PROMPT
          }, {
            role: "user",
            content: userPrompt
          }, {
            role: "assistant",
            content: code
          }, {
            role: "user",
            content: "Error: \"".concat(_t2.message, "\". Fix the code. Output ONLY corrected code.")
          }]);
        case 10:
          code = _context3.v;
          debugEl.innerText = code;
        case 11:
          attempt++;
          _context3.n = 6;
          break;
        case 12:
          if (!success) {
            _context3.n = 13;
            break;
          }
          if (!fromCache) (0,_services_cache__WEBPACK_IMPORTED_MODULE_4__.cacheResponse)(userPrompt, code);
          showStatus(statusEl, "success", "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.check, "<span>Done</span>"));
          _context3.n = 14;
          break;
        case 13:
          throw lastError;
        case 14:
          _context3.n = 16;
          break;
        case 15:
          _context3.p = 15;
          _t3 = _context3.v;
          console.error(_t3);
          skeletonEl.style.display = "none";
          showStatus(statusEl, "error", "".concat(_services_icons__WEBPACK_IMPORTED_MODULE_5__.Icons.alertCircle, "<span>").concat(_t3.message, "</span>"));
        case 16:
          _context3.p = 16;
          button.disabled = false;
          button.innerHTML = originalHTML;
          return _context3.f(16);
        case 17:
          return _context3.a(2);
      }
    }, _callee3, null, [[7, 9], [2, 15, 16, 17]]);
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
  _executeExcelCode = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(code) {
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _context5.n = 1;
          return Excel.run(/*#__PURE__*/function () {
            var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(context) {
              var sheet, wrappedCode, _t4, _t5;
              return _regenerator().w(function (_context4) {
                while (1) switch (_context4.p = _context4.n) {
                  case 0:
                    sheet = context.workbook.worksheets.getActiveWorksheet();
                    wrappedCode = "\n      try {\n        ".concat(code, "\n      } catch(_innerErr) {\n        try { await context.sync(); } catch(_) {}\n        throw _innerErr;\n      }\n    ");
                    _context4.p = 1;
                    _context4.n = 2;
                    return new Function("context", "sheet", "Excel", "return (async () => { ".concat(wrappedCode, "\nawait context.sync(); })()"))(context, sheet, Excel);
                  case 2:
                    _context4.n = 8;
                    break;
                  case 3:
                    _context4.p = 3;
                    _t4 = _context4.v;
                    _context4.p = 4;
                    _context4.n = 5;
                    return context.sync();
                  case 5:
                    _context4.n = 7;
                    break;
                  case 6:
                    _context4.p = 6;
                    _t5 = _context4.v;
                  case 7:
                    console.error("Execution Error:", _t4);
                    throw _t4;
                  case 8:
                    _context4.n = 9;
                    return context.sync();
                  case 9:
                    return _context4.a(2);
                }
              }, _callee4, null, [[4, 6], [1, 3]]);
            }));
            return function (_x2) {
              return _ref.apply(this, arguments);
            };
          }());
        case 1:
          return _context5.a(2);
      }
    }, _callee5);
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
var code = "<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset=\"UTF-8\" />\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n        <title>SheetCraft AI</title>\n        <" + "script type=\"text/javascript\" src=\"https://appsforoffice.microsoft.com/lib/1/hosted/office.js\"><" + "/script>\n        <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n        <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n        <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap\" rel=\"stylesheet\">\n    </head>\n    <body>\n        <main id=\"app-body\" style=\"display: none;\">\n            <header class=\"app-header\">\n                <div class=\"brand\">\n                    <div class=\"logo\" id=\"logo-icon\"></div>\n                    <h1>SheetCraft <span class=\"highlight-text\">AI</span></h1>\n                </div>\n                <div class=\"header-actions\">\n                    <button id=\"docs-toggle\" class=\"btn-icon\" title=\"What can I do?\"></button>\n                    <button id=\"settings-toggle\" class=\"btn-icon\" title=\"Settings\"></button>\n                </div>\n            </header>\n\n            <!-- Docs Panel -->\n            <div id=\"docs-panel\" class=\"panel\" style=\"display: none;\">\n                <h3>What can SheetCraft AI do?</h3>\n                <div class=\"docs-grid\">\n                    <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"barChart\"></span><div><strong>Charts</strong><p>Create any chart type — column, bar, line, pie, area, scatter, radar, doughnut</p></div></div>\n                    <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"table\"></span><div><strong>Tables</strong><p>Generate formatted tables, add headers, totals row, styles</p></div></div>\n                    <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"paintbrush\"></span><div><strong>Formatting</strong><p>Bold, colors, borders, alignment, number formats, merge cells, zebra stripes</p></div></div>\n                    <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"formula\"></span><div><strong>Formulas</strong><p>SUM, AVERAGE, VLOOKUP, IF, COUNTIF, SUMIF, and any Excel formula</p></div></div>\n                    <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"sortAsc\"></span><div><strong>Sort & Filter</strong><p>Sort by any column, apply AutoFilter, multi-column sorting</p></div></div>\n                    <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"checkSquare\"></span><div><strong>Validation</strong><p>Dropdown lists, number constraints, date limits, error alerts</p></div></div>\n                    <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"trendUp\"></span><div><strong>Conditional Formatting</strong><p>Color scales, data bars, icon sets, highlight rules</p></div></div>\n                    <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"snowflake\"></span><div><strong>Freeze Panes</strong><p>Freeze header rows or columns for better navigation</p></div></div>\n                    <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"columns\"></span><div><strong>Worksheets</strong><p>Add, rename, delete, copy sheets, change tab colors</p></div></div>\n                    <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"lock\"></span><div><strong>Protection</strong><p>Protect/unprotect sheets with custom permissions</p></div></div>\n                    <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"search\"></span><div><strong>Find & Highlight</strong><p>Search for values and highlight matches</p></div></div>\n                    <div class=\"doc-item\"><span class=\"doc-icon\" data-icon=\"eraser\"></span><div><strong>Clean Data</strong><p>Clear formatting, contents, or everything. Remove duplicates</p></div></div>\n                </div>\n                <p class=\"docs-hint\">Just describe what you need in plain English — SheetCraft handles the rest.</p>\n            </div>\n\n            <!-- Settings Panel -->\n            <div id=\"settings-panel\" class=\"panel\" style=\"display: none;\">\n                <h3>AI Provider</h3>\n                \n                <div class=\"form-group\">\n                    <label for=\"setting-provider\">Provider</label>\n                    <select id=\"setting-provider\" class=\"form-input\">\n                        <option value=\"groq\">Groq (Cloud)</option>\n                        <option value=\"local\">Ollama (Local)</option>\n                    </select>\n                </div>\n\n                <div id=\"groq-fields\">\n                    <div class=\"form-group\">\n                        <label for=\"setting-api-key\">API Key</label>\n                        <input id=\"setting-api-key\" type=\"password\" class=\"form-input\" placeholder=\"gsk_...\" />\n                    </div>\n                    <div class=\"form-group\">\n                        <label for=\"setting-groq-model\">Model</label>\n                        <select id=\"setting-groq-model\" class=\"form-input\">\n                            <option value=\"llama-3.1-8b-instant\" selected>Llama 3.1 8B — Fast (131K TPM)</option>\n                            <option value=\"llama-3.3-70b-versatile\">Llama 3.3 70B — Smart (12K TPM)</option>\n                            <option value=\"gemma2-9b-it\">Gemma 2 9B (15K TPM)</option>\n                            <option value=\"mixtral-8x7b-32768\">Mixtral 8x7B (5K TPM)</option>\n                        </select>\n                    </div>\n                </div>\n\n                <div id=\"local-fields\" style=\"display: none;\">\n                    <div class=\"form-group\">\n                        <label for=\"setting-base-url\">Ollama Host</label>\n                        <input id=\"setting-base-url\" type=\"text\" class=\"form-input\" placeholder=\"http://localhost:11434\" />\n                    </div>\n                    <div class=\"form-group\">\n                        <label>Model</label>\n                        <div class=\"model-select-wrapper\">\n                            <select id=\"setting-local-model\" class=\"form-input\">\n                                <option value=\"\" disabled selected>Click refresh →</option>\n                            </select>\n                            <button id=\"refresh-models\" class=\"btn-icon btn-refresh\" title=\"Refresh models\"></button>\n                        </div>\n                        <div id=\"model-status\" class=\"model-status\"></div>\n                    </div>\n                </div>\n\n                <button id=\"save-settings\" class=\"btn-primary btn-save\">Save</button>\n            </div>\n\n            <!-- ═══════════════════════════════════════════════════ -->\n            <!-- MODE TOGGLE -->\n            <!-- ═══════════════════════════════════════════════════ -->\n            <div class=\"mode-toggle\">\n                <button id=\"mode-planning\" class=\"mode-tab active\" data-mode=\"planning\">\n                    <span id=\"mode-planning-icon\"></span>\n                    <span>Planning</span>\n                </button>\n                <button id=\"mode-agent\" class=\"mode-tab\" data-mode=\"agent\">\n                    <span id=\"mode-agent-icon\"></span>\n                    <span>Agent</span>\n                </button>\n                <div class=\"mode-indicator\" id=\"mode-indicator\"></div>\n            </div>\n\n            <!-- ═══════════════════════════════════════════════════ -->\n            <!-- PLANNING MODE (Chat) -->\n            <!-- ═══════════════════════════════════════════════════ -->\n            <div id=\"planning-mode\" class=\"mode-content active\">\n                <!-- Chat Messages Area -->\n                <div id=\"chat-messages\" class=\"chat-messages\">\n                    <!-- Welcome message -->\n                    <div class=\"chat-welcome\">\n                        <div class=\"welcome-icon\" id=\"welcome-sparkle\"></div>\n                        <h2>What are you working on?</h2>\n                        <p>I'm your spreadsheet thinking partner. Ask me about formulas, data strategies, best practices, or let me help you plan your next step.</p>\n                        <div class=\"welcome-suggestions\" id=\"chat-suggestions\">\n                            <!-- Dynamically populated -->\n                        </div>\n                    </div>\n                </div>\n\n                <!-- Chat Input -->\n                <div class=\"chat-input-area\">\n                    <div class=\"chat-input-card\">\n                        <textarea id=\"chat-input\" placeholder=\"Ask anything about Excel...\" rows=\"1\" spellcheck=\"false\"></textarea>\n                        <button id=\"chat-send\" class=\"btn-send\" title=\"Send message\">\n                            <span id=\"chat-send-icon\"></span>\n                        </button>\n                    </div>\n                    <div class=\"chat-footer\">\n                        <button id=\"chat-clear\" class=\"btn-text\" title=\"Clear conversation\">\n                            <span id=\"chat-clear-icon\"></span>\n                            <span>Clear</span>\n                        </button>\n                    </div>\n                </div>\n            </div>\n\n            <!-- ═══════════════════════════════════════════════════ -->\n            <!-- AGENT MODE (Execute) -->\n            <!-- ═══════════════════════════════════════════════════ -->\n            <div id=\"agent-mode\" class=\"mode-content\">\n                <div class=\"content-wrapper\">\n                    <div class=\"input-card\">\n                        <textarea id=\"prompt-input\" placeholder=\"Describe what you want to do in Excel...\" spellcheck=\"false\"></textarea>\n                        <div class=\"card-footer\">\n                            <span id=\"cache-badge\" class=\"cache-badge\" style=\"display:none;\">⚡ cached</span>\n                            <button id=\"run\" class=\"btn-primary\">\n                                <span>Execute</span>\n                                <span id=\"run-icon\"></span>\n                            </button>\n                        </div>\n                    </div>\n\n                    <!-- Category Tabs for Quick Actions -->\n                    <div class=\"action-categories\" id=\"action-categories\">\n                        <button class=\"category-tab active\" data-category=\"cleanup\">\n                            <span class=\"cat-icon\" data-icon=\"broom\"></span>\n                            <span>Cleanup</span>\n                        </button>\n                        <button class=\"category-tab\" data-category=\"analysis\">\n                            <span class=\"cat-icon\" data-icon=\"pieChart\"></span>\n                            <span>Analysis</span>\n                        </button>\n                        <button class=\"category-tab\" data-category=\"format\">\n                            <span class=\"cat-icon\" data-icon=\"palette\"></span>\n                            <span>Format</span>\n                        </button>\n                        <button class=\"category-tab\" data-category=\"templates\">\n                            <span class=\"cat-icon\" data-icon=\"fileTemplate\"></span>\n                            <span>Templates</span>\n                        </button>\n                    </div>\n\n                    <!-- Quick Actions -->\n                    <div id=\"quick-actions\" class=\"quick-actions\"></div>\n\n                    <!-- Skeleton (shown during loading) -->\n                    <div id=\"skeleton\" class=\"skeleton-container\" style=\"display: none;\">\n                        <div class=\"skeleton-pill\"></div>\n                        <div class=\"skeleton-line w80\"></div>\n                        <div class=\"skeleton-line w60\"></div>\n                    </div>\n\n                    <!-- Status Message -->\n                    <div id=\"status-message\" class=\"status-pill\"></div>\n\n                    <!-- Debug -->\n                    <div id=\"debug-section\">\n                        <details>\n                            <summary>\n                                <span id=\"chevron-icon\"></span>\n                                <span>Generated Code</span>\n                            </summary>\n                            <pre id=\"debug-code\"></pre>\n                        </details>\n                    </div>\n                </div>\n            </div>\n        </main>\n        \n        <section id=\"sideload-msg\" class=\"sideload-container\">\n            <!-- Skeleton UI mimicking the real app layout -->\n            <div class=\"sideload-skeleton\">\n                <!-- Skeleton Header -->\n                <div class=\"sk-header\">\n                    <div class=\"sk-brand\">\n                        <div class=\"sk-logo sk-shimmer\"></div>\n                        <div class=\"sk-title sk-shimmer\"></div>\n                    </div>\n                    <div class=\"sk-header-actions\">\n                        <div class=\"sk-icon-btn sk-shimmer\"></div>\n                        <div class=\"sk-icon-btn sk-shimmer\"></div>\n                    </div>\n                </div>\n\n                <!-- Skeleton Mode Toggle -->\n                <div class=\"sk-mode-toggle\">\n                    <div class=\"sk-mode-tab sk-shimmer\"></div>\n                    <div class=\"sk-mode-tab sk-shimmer\"></div>\n                </div>\n\n                <!-- Skeleton Welcome -->\n                <div class=\"sk-welcome\">\n                    <div class=\"sk-welcome-icon sk-shimmer\"></div>\n                    <div class=\"sk-welcome-title sk-shimmer\"></div>\n                    <div class=\"sk-welcome-desc sk-shimmer\"></div>\n                    <div class=\"sk-welcome-desc short sk-shimmer\"></div>\n                </div>\n\n                <!-- Skeleton Suggestions -->\n                <div class=\"sk-suggestions\">\n                    <div class=\"sk-suggestion sk-shimmer\"></div>\n                    <div class=\"sk-suggestion sk-shimmer\"></div>\n                    <div class=\"sk-suggestion sk-shimmer\"></div>\n                    <div class=\"sk-suggestion sk-shimmer\"></div>\n                </div>\n\n                <!-- Skeleton Input -->\n                <div class=\"sk-input-area\">\n                    <div class=\"sk-input sk-shimmer\"></div>\n                </div>\n\n                <!-- Loading Status -->\n                <div class=\"sideload-status\">\n                    <div class=\"sideload-pulse\"></div>\n                    <span>Connecting to Excel...</span>\n                </div>\n            </div>\n        </section>\n    </body>\n</html>\n";
// Exports
/* harmony default export */ __webpack_exports__["default"] = (code);
}();
/******/ })()
;
//# sourceMappingURL=taskpane.js.map