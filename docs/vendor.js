(self["webpackChunksheetos_ai"] = self["webpackChunksheetos_ai"] || []).push([["vendor"],{

/***/ "./src/services/cache.ts":
/*!*******************************!*\
  !*** ./src/services/cache.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

const CACHE_KEY = "sheetcraft_cache";
const CACHE_VERSION_KEY = "sheetcraft_cache_ver";
const CACHE_VERSION = 4; // Bump this when prompt changes significantly
const MAX_ENTRIES = 50;

// Auto-clear cache if version changed (prompt was updated)
function ensureCacheVersion() {
  try {
    const ver = localStorage.getItem(CACHE_VERSION_KEY);
    if (ver !== String(CACHE_VERSION)) {
      localStorage.removeItem(CACHE_KEY);
      localStorage.setItem(CACHE_VERSION_KEY, String(CACHE_VERSION));
    }
  } catch {}
}
function getCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function setCache(entries) {
  // Keep only the most recent entries
  const trimmed = entries.slice(-MAX_ENTRIES);
  localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
}

/**
 * Look up a cached response for the given prompt.
 * Returns null if not found or expired (>1 hour).
 */
function getCachedResponse(prompt) {
  ensureCacheVersion();
  const entries = getCache();
  const key = prompt.trim().toLowerCase();
  const match = entries.find(e => e.prompt === key);
  if (!match) return null;

  // Expire after 1 hour
  const ONE_HOUR = 60 * 60 * 1000;
  if (Date.now() - match.timestamp > ONE_HOUR) return null;
  return match.response;
}

/**
 * Store a prompt-response pair in the cache.
 */
function cacheResponse(prompt, response) {
  const entries = getCache();
  const key = prompt.trim().toLowerCase();

  // Remove existing entry for same prompt
  const filtered = entries.filter(e => e.prompt !== key);
  filtered.push({
    prompt: key,
    response,
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

/***/ "./src/services/icons.ts":
/*!*******************************!*\
  !*** ./src/services/icons.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Icons: function() { return /* binding */ Icons; }
/* harmony export */ });
/**
 * SVG Icon library for DocOS AI.
 * Inline Lucide-style icons — no external dependencies.
 */

const s = function (d) {
  let size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 14;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
};
const Icons = {
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
  // ─── Mode Toggle Icons ───
  messageCircle: s('<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>', 16),
  zap: s('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>', 16),
  send: s('<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>', 14),
  stop: s('<rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor"/>', 16),
  // ─── Category Icons ───
  broom: s('<path d="M5 21h14"/><path d="M12 21V3"/><path d="M7 8l5-5 5 5"/><path d="M7 12l5 2 5-2"/>', 14),
  pieChart: s('<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>', 14),
  palette: s('<circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>', 14),
  fileTemplate: s('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>', 14),
  // ─── Chat Actions ───
  play: s('<polygon points="5 3 19 12 5 21 5 3"/>', 14),
  trash: s('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>', 14),
  sparkles: s('<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>', 14),
  user: s('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', 14),
  bot: s('<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>', 14),
  // ─── Extract/Import Icons ───
  upload: s('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>', 14),
  users: s('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', 14),
  filePlus: s('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>', 14),
  calendar: s('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', 14),
  database: s('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>', 14),
  clipboardList: s('<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>', 14),
  // ─── Smart Tools Icons ───
  brain: s('<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>', 14),
  crosshair: s('<circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>', 14),
  dollarSign: s('<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>', 14),
  shield: s('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', 14),
  mail: s('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>', 14),
  highlight: s('<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>', 14),
  layers: s('<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>', 14),
  // ─── Insert & Layout Icons ───
  image: s('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>', 14),
  bookmark: s('<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>', 14),
  ruler: s('<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>', 14),
  layoutGrid: s('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>', 14),
  alignLeft: s('<line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>', 14),
  alignCenter: s('<line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/>', 14),
  minus: s('<line x1="5" y1="12" x2="19" y2="12"/>', 14),
  plusCircle: s('<circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/>', 14),
  type: s('<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>', 14),
  list: s('<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>', 14),
  link: s('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>', 14),
  globe: s('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>', 14),
  footprint: s('<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5 10 7.89 9 10 8 11l-1.5 1.5"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 2.39 1 4.5 2 5.5l1.5 1.5"/>', 14),
  scissors: s('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>', 14),
  indent: s('<polyline points="3 8 7 12 3 16"/><line x1="21" y1="12" x2="11" y2="12"/><line x1="21" y1="6" x2="11" y2="6"/><line x1="21" y1="18" x2="11" y2="18"/>', 14),
  maximize: s('<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>', 14),
  minimize: s('<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>', 14),
  rotateCw: s('<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>', 14),
  divider: s('<line x1="3" y1="12" x2="21" y2="12"/><polyline points="8 8 12 4 16 8"/><polyline points="16 16 12 20 8 16"/>', 14)
};

/***/ }),

/***/ "./src/services/llm.service.ts":
/*!*************************************!*\
  !*** ./src/services/llm.service.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ANTHROPIC_MODELS: function() { return /* binding */ ANTHROPIC_MODELS; },
/* harmony export */   GEMINI_MODELS: function() { return /* binding */ GEMINI_MODELS; },
/* harmony export */   GROQ_MODELS: function() { return /* binding */ GROQ_MODELS; },
/* harmony export */   OPENAI_MODELS: function() { return /* binding */ OPENAI_MODELS; },
/* harmony export */   OPENROUTER_MODELS: function() { return /* binding */ OPENROUTER_MODELS; },
/* harmony export */   callLLM: function() { return /* binding */ callLLM; },
/* harmony export */   fetchOllamaModels: function() { return /* binding */ fetchOllamaModels; },
/* harmony export */   getConfig: function() { return /* binding */ getConfig; },
/* harmony export */   saveConfig: function() { return /* binding */ saveConfig; }
/* harmony export */ });
/**
 * LLM Service — Abstraction layer for AI providers.
 * Stores separate model configs per provider to avoid cross-contamination.
 * Includes auto-retry with backoff for 429 rate limits.
 */

const DEFAULT_GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_LOCAL_URL = "http://localhost:11434/v1/chat/completions";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

// Valid Groq models (guaranteed to work)
const GROQ_MODELS = [{
  id: "llama-3.3-70b-versatile",
  label: "Llama 3.3 70B (Smart, Text-Only)"
}, {
  id: "meta-llama/llama-4-maverick-17b-128e-instruct",
  label: "Llama 4 Maverick (Vision)"
}, {
  id: "gemma2-9b-it",
  label: "Gemma 2 9B (15K TPM)"
}, {
  id: "mixtral-8x7b-32768",
  label: "Mixtral 8x7B (5K TPM)"
}];
const GEMINI_MODELS = [{
  id: "gemini-1.5-flash",
  label: "Gemini 1.5 Flash (Fast, Free)"
}, {
  id: "gemini-1.5-pro",
  label: "Gemini 1.5 Pro (Smarter)"
}];
const OPENAI_MODELS = [{
  id: "gpt-4o-mini",
  label: "GPT-4o Mini (Fast)"
}, {
  id: "gpt-4o",
  label: "GPT-4o (Smart)"
}];
const ANTHROPIC_MODELS = [{
  id: "claude-3-5-sonnet-20241022",
  label: "Claude 3.5 Sonnet (Best for Code)"
}, {
  id: "claude-3-5-haiku-20241022",
  label: "Claude 3.5 Haiku (Fast)"
}];
const OPENROUTER_MODELS = [{
  id: "anthropic/claude-3.5-sonnet:beta",
  label: "Claude 3.5 Sonnet"
}, {
  id: "google/gemini-2.5-pro",
  label: "Gemini 2.5 Pro"
}, {
  id: "openai/gpt-4o",
  label: "GPT-4o"
}, {
  id: "meta-llama/llama-3.3-70b-instruct",
  label: "Llama 3.3 70B"
}];
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;

/**
 * Get saved config from localStorage.
 */
function getConfig() {
  try {
    const saved = localStorage.getItem("sheetcraft_llm_config");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn("Failed to load LLM config:", e);
  }
  return {
    provider: "groq",
    apiKey: typeof process !== "undefined" && "MISSING_ENV_VAR" && "MISSING_ENV_VAR".GROQ_API_KEY || "",
    groqModel: "llama-3.3-70b-versatile",
    localModel: "qwen2.5-coder:7b"
  };
}

/**
 * Save config to localStorage.
 */
function saveConfig(config) {
  localStorage.setItem("sheetcraft_llm_config", JSON.stringify(config));
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Resolve the correct model for the active provider.
 * Automatically handles Vision model selection.
 */
function resolveModel(cfg) {
  let hasImages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (cfg.provider === "groq") {
    if (hasImages) return "meta-llama/llama-4-maverick-17b-128e-instruct";
    let model = cfg.groqModel || "llama-3.3-70b-versatile";
    if (model.includes("llama-3.2") && (model.includes("vision") || model.includes("preview"))) return "llama-3.3-70b-versatile";
    if (model.includes(":")) return "llama-3.3-70b-versatile";
    return model;
  } else if (cfg.provider === "gemini") {
    return cfg.geminiModel || "gemini-1.5-flash";
  } else if (cfg.provider === "openai") {
    return cfg.openaiModel || "gpt-4o";
  } else if (cfg.provider === "anthropic") {
    return cfg.anthropicModel || "claude-3-5-sonnet-20241022";
  } else if (cfg.provider === "openrouter") {
    return cfg.openrouterModel || "anthropic/claude-3.5-sonnet:beta";
  } else {
    return cfg.localModel || cfg.model || "llama3";
  }
}
async function callGemini(messages, model, apiKey, signal) {
  var _data$candidates;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const contents = [];
  const systemParts = [];
  messages.forEach(msg => {
    if (msg.role === "system") {
      const text = Array.isArray(msg.content) ? msg.content.map(c => c.type === "text" ? c.text : "").join("") : msg.content;
      if (text) systemParts.push({
        text
      });
    } else {
      const role = msg.role === "assistant" ? "model" : "user";
      const parts = [];
      if (typeof msg.content === "string") {
        if (msg.content) parts.push({
          text: msg.content
        });
      } else {
        msg.content.forEach(c => {
          if (c.type === "text" && c.text) parts.push({
            text: c.text
          });
          if (c.type === "image_url" && c.image_url) {
            const base64 = c.image_url.url.split(",")[1]; // Remove data:image/png;base64,
            if (base64) {
              parts.push({
                inline_data: {
                  mime_type: "image/png",
                  data: base64
                }
              });
            }
          }
        });
      }
      if (parts.length > 0) {
        // Gemini requirement: roles must alternate. Merge consecutive same-role messages.
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts.push(...parts);
        } else {
          contents.push({
            role,
            parts
          });
        }
      }
    }
  });

  // Gemini requirement: contents must start with user and end with user (for non-stream)
  // Actually, it just needs to start with user. If it ends with model, it's fine for continuation.
  // But we MUST have at least one message in contents if we don't have system_instruction.

  const payload = {
    contents,
    generationConfig: {
      temperature: 0,
      topP: 1,
      maxOutputTokens: 4096
    }
  };
  if (systemParts.length > 0) {
    payload.system_instruction = {
      parts: systemParts
    };
  }

  // Final check: If no contents but we have system instructions, we need a dummy user message
  if (contents.length === 0) {
    contents.push({
      role: "user",
      parts: [{
        text: "Hello. Please acknowledge system instructions."
      }]
    });
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini Error (${response.status}): ${err}`);
  }
  const data = await response.json();
  const text = (_data$candidates = data.candidates) === null || _data$candidates === void 0 || (_data$candidates = _data$candidates[0]) === null || _data$candidates === void 0 || (_data$candidates = _data$candidates.content) === null || _data$candidates === void 0 || (_data$candidates = _data$candidates.parts) === null || _data$candidates === void 0 || (_data$candidates = _data$candidates[0]) === null || _data$candidates === void 0 ? void 0 : _data$candidates.text;
  if (!text) throw new Error("Gemini returned empty response.");
  return text;
}

/**
 * Core LLM dispatcher with automatic failover and retry logic.
 */
async function callLLM(messages, config, signal) {
  const primaryConfig = config || getConfig();
  let currentConfig = {
    ...primaryConfig
  };
  let failoverOccurred = false;
  const hasImages = messages.some(m => Array.isArray(m.content) && m.content.some(p => p.type === "image_url"));
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const model = resolveModel(currentConfig, hasImages);
      let content = "";

      // Route to appropriate provider handler
      if (currentConfig.provider === "gemini") {
        if (!currentConfig.geminiKey) throw new Error("Missing Gemini API Key");
        content = await callGemini(messages, model, currentConfig.geminiKey, signal);
      } else if (currentConfig.provider === "openai") {
        var _data$choices;
        if (!currentConfig.openaiKey) throw new Error("Missing OpenAI API Key");
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentConfig.openaiKey}`
          },
          body: JSON.stringify({
            messages,
            model,
            temperature: 0,
            top_p: 1,
            max_tokens: 4096
          }),
          signal
        });
        const data = await resp.json();
        content = ((_data$choices = data.choices) === null || _data$choices === void 0 || (_data$choices = _data$choices[0]) === null || _data$choices === void 0 || (_data$choices = _data$choices.message) === null || _data$choices === void 0 ? void 0 : _data$choices.content) || "";
      } else if (currentConfig.provider === "anthropic") {
        var _data$content;
        if (!currentConfig.anthropicKey) throw new Error("Missing Anthropic API Key");

        // Anthropic requires a different payload structure, separating system messages
        let systemPrompt = "";
        const anthropicMessages = [];
        messages.forEach(m => {
          if (m.role === "system") {
            systemPrompt = typeof m.content === "string" ? m.content : m.content.map(c => c.text || "").join("");
          } else {
            anthropicMessages.push({
              role: m.role,
              content: typeof m.content === "string" ? m.content : m.content.map(c => {
                if (c.type === "text") return {
                  type: "text",
                  text: c.text
                };
                if (c.type === "image_url" && c.image_url) {
                  const base64 = c.image_url.url.split(",")[1];
                  return {
                    type: "image",
                    source: {
                      type: "base64",
                      media_type: "image/png",
                      data: base64
                    }
                  };
                }
                return {
                  type: "text",
                  text: ""
                };
              }).filter(c => c.type === "text" ? c.text : true)
            });
          }
        });
        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": currentConfig.anthropicKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true"
          },
          body: JSON.stringify({
            messages: anthropicMessages,
            system: systemPrompt ? systemPrompt : undefined,
            model,
            max_tokens: 4096,
            temperature: 0
          }),
          signal
        });
        if (!resp.ok) {
          const errText = await resp.text();
          if (resp.status === 429) throw new Error("RATE_LIMIT");
          throw new Error(`Anthropic Error (${resp.status}): ${errText.substring(0, 100)}`);
        }
        const data = await resp.json();
        content = ((_data$content = data.content) === null || _data$content === void 0 || (_data$content = _data$content[0]) === null || _data$content === void 0 ? void 0 : _data$content.text) || "";
      } else if (currentConfig.provider === "openrouter") {
        var _data$choices2;
        if (!currentConfig.openrouterKey) throw new Error("Missing OpenRouter API Key");
        const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentConfig.openrouterKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "DocOS AI"
          },
          body: JSON.stringify({
            messages,
            model,
            temperature: 0,
            top_p: 1,
            max_tokens: 4096
          }),
          signal
        });
        if (!resp.ok) {
          const errText = await resp.text();
          if (resp.status === 429) throw new Error("RATE_LIMIT");
          throw new Error(`OpenRouter Error (${resp.status}): ${errText.substring(0, 100)}`);
        }
        const data = await resp.json();
        content = ((_data$choices2 = data.choices) === null || _data$choices2 === void 0 || (_data$choices2 = _data$choices2[0]) === null || _data$choices2 === void 0 || (_data$choices2 = _data$choices2.message) === null || _data$choices2 === void 0 ? void 0 : _data$choices2.content) || "";
      } else {
        var _data$choices3;
        // Groq or Local
        const url = currentConfig.provider === "groq" ? DEFAULT_GROQ_URL : currentConfig.baseUrl || DEFAULT_LOCAL_URL;
        const headers = {
          "Content-Type": "application/json"
        };
        if (currentConfig.apiKey) headers["Authorization"] = `Bearer ${currentConfig.apiKey}`;
        const resp = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({
            messages,
            model,
            temperature: 0,
            top_p: 1,
            max_tokens: 4096
          }),
          signal
        });
        if (!resp.ok) {
          const errText = await resp.text();
          const status = resp.status;
          if (status === 429) throw new Error("RATE_LIMIT");
          throw new Error(`AI Error (${status}): ${errText.substring(0, 100)}`);
        }
        const data = await resp.json();
        content = ((_data$choices3 = data.choices) === null || _data$choices3 === void 0 || (_data$choices3 = _data$choices3[0]) === null || _data$choices3 === void 0 || (_data$choices3 = _data$choices3.message) === null || _data$choices3 === void 0 ? void 0 : _data$choices3.content) || "";
      }

      // SHARED CLEANUP (Ensures no hallucinations/formatting issues across models)
      if (!content) throw new Error("Empty response from AI");
      let cleanContent = content.trim();
      cleanContent = cleanContent.replace(/^```(?:javascript|js|typescript|ts)?\n?/i, "");
      cleanContent = cleanContent.replace(/\n?```$/i, "");
      cleanContent = cleanContent.trim();
      cleanContent = cleanContent.replace(/(?:const|let|var)\s+sheet\s*=\s*.*?;/g, "// sheet redeclaration removed");
      return cleanContent;
    } catch (err) {
      if (err.message === "RATE_LIMIT" || err.message.includes("429")) {
        if (attempt < MAX_RETRIES) {
          const waitMs = BASE_DELAY_MS * Math.pow(2, attempt);
          console.warn(`Rate limit retry ${attempt + 1}/${MAX_RETRIES} in ${waitMs}ms...`);
          await sleep(waitMs);
          continue;
        }
      }
      throw err;
    }
  }
  throw new Error("Failed after maximum retries and possible failover.");
}

/**
 * Fetch locally available Ollama models.
 */

async function fetchOllamaModels(baseHost) {
  const host = baseHost || "http://localhost:11434";
  try {
    const response = await fetch(`${host}/api/tags`, {
      method: "GET"
    });
    if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
    const data = await response.json();
    return (data.models || []).map(m => ({
      name: m.name,
      size: m.size || 0,
      modified_at: m.modified_at || ""
    }));
  } catch (e) {
    console.warn("Could not fetch Ollama models:", e);
    return [];
  }
}

/***/ }),

/***/ "./src/services/pdfService.ts":
/*!************************************!*\
  !*** ./src/services/pdfService.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extractTextFromBase64PDF: function() { return /* binding */ extractTextFromBase64PDF; },
/* harmony export */   extractTextFromMultiplePDFs: function() { return /* binding */ extractTextFromMultiplePDFs; },
/* harmony export */   extractTextFromPDF: function() { return /* binding */ extractTextFromPDF; },
/* harmony export */   extractTextFromPDFFile: function() { return /* binding */ extractTextFromPDFFile; },
/* harmony export */   isValidPDF: function() { return /* binding */ isValidPDF; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.typed-array.fill.js */ "./node_modules/core-js/modules/es.typed-array.fill.js");
/* harmony import */ var core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.typed-array.set.js */ "./node_modules/core-js/modules/es.typed-array.set.js");
/* harmony import */ var core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.typed-array.sort.js */ "./node_modules/core-js/modules/es.typed-array.sort.js");
/* harmony import */ var core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var pdfjs_dist__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! pdfjs-dist */ "./node_modules/pdfjs-dist/build/pdf.js");
/* harmony import */ var pdfjs_dist__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(pdfjs_dist__WEBPACK_IMPORTED_MODULE_3__);



/**
 * PDF Service - Extracts plain text from PDFs using pdf-parse
 * This provides clean text extraction before LLM processing
 */


// Configure PDF.js worker
pdfjs_dist__WEBPACK_IMPORTED_MODULE_3__.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs_dist__WEBPACK_IMPORTED_MODULE_3__.version}/pdf.worker.min.js`;

/**
 * Extract text from a PDF file using PDF.js (browser-compatible)
 * @param fileBuffer - ArrayBuffer of the PDF file
 * @returns Extracted text and metadata
 */
async function extractTextFromPDF(fileBuffer) {
  try {
    const loadingTask = pdfjs_dist__WEBPACK_IMPORTED_MODULE_3__.getDocument({
      data: fileBuffer
    });
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;
    let fullText = "";

    // Extract text from each page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine text items with proper spacing
      const pageText = textContent.items.map(item => item.str).join(" ");
      fullText += pageText + "\n\n";
    }

    // Extract metadata
    const metadata = await pdf.getMetadata();
    const info = metadata.info;
    return {
      text: cleanExtractedText(fullText),
      pages: totalPages,
      metadata: {
        title: info === null || info === void 0 ? void 0 : info.Title,
        author: info === null || info === void 0 ? void 0 : info.Author,
        subject: info === null || info === void 0 ? void 0 : info.Subject,
        creator: info === null || info === void 0 ? void 0 : info.Creator
      }
    };
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract text from a PDF file (File object from input)
 * @param file - File object from file input
 * @returns Extracted text and metadata
 */
async function extractTextFromPDFFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  return extractTextFromPDF(arrayBuffer);
}

/**
 * Extract text from a base64-encoded PDF string
 * @param base64String - Base64-encoded PDF data
 * @returns Extracted text and metadata
 */
async function extractTextFromBase64PDF(base64String) {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:application\/pdf;base64,/, "");

  // Convert base64 to ArrayBuffer
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return extractTextFromPDF(bytes.buffer);
}

/**
 * Clean and normalize extracted text
 * @param text - Raw extracted text
 * @returns Cleaned text
 */
function cleanExtractedText(text) {
  return text
  // Remove excessive whitespace
  .replace(/\s+/g, " ")
  // Remove control characters except newlines
  .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "")
  // Normalize line breaks
  .replace(/\r\n/g, "\n").replace(/\r/g, "\n")
  // Remove multiple consecutive newlines (keep max 2)
  .replace(/\n{3,}/g, "\n\n")
  // Trim leading/trailing whitespace
  .trim();
}

/**
 * Validate if a buffer is a valid PDF
 * @param buffer - ArrayBuffer to validate
 * @returns True if valid PDF
 */
function isValidPDF(buffer) {
  const uint8Array = new Uint8Array(buffer);
  // PDF files start with %PDF-
  return uint8Array.length >= 5 && uint8Array[0] === 0x25 &&
  // %
  uint8Array[1] === 0x50 &&
  // P
  uint8Array[2] === 0x44 &&
  // D
  uint8Array[3] === 0x46 &&
  // F
  uint8Array[4] === 0x2d // -
;
}

/**
 * Extract text from multiple PDFs in parallel
 * @param files - Array of File objects
 * @param maxConcurrency - Maximum parallel extractions
 * @returns Array of extraction results
 */
async function extractTextFromMultiplePDFs(files) {
  let maxConcurrency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
  const results = [];
  for (let i = 0; i < files.length; i += maxConcurrency) {
    const batch = files.slice(i, i + maxConcurrency);
    const batchResults = await Promise.allSettled(batch.map(async file => {
      try {
        const result = await extractTextFromPDFFile(file);
        return {
          file,
          result
        };
      } catch (error) {
        return {
          file,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }));
    batchResults.forEach(settled => {
      if (settled.status === "fulfilled") {
        results.push(settled.value);
      } else {
        results.push({
          file: batch[results.length % maxConcurrency],
          error: settled.reason
        });
      }
    });
  }
  return results;
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/taskpane/taskpane.css":
/*!*************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/taskpane/taskpane.css ***!
  \*************************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
___CSS_LOADER_EXPORT___.push([module.id, "/* \r\n * SheetOS AI — Redesigned Interface\r\n * A warm, human-crafted design system.\r\n * Forest green + terracotta. No AI-purple gradients.\r\n */\r\n\r\n:root {\r\n    /* ── Surface & Layout ── */\r\n    --bg: #F5F4F1;\r\n    --bg-gradient: radial-gradient(circle at 50% 0%, #FFFFFF, #F2F0EB);\r\n    --surface: #FAFAF8;\r\n    --card: #FFFFFF;\r\n    --card-border: #E3E1DC;\r\n    --card-hover: #F0EFEB;\r\n    --input-bg: #F5F4F1;\r\n\r\n    /* ── Primary: Forest Green ── */\r\n    --primary: #2D6A4F;\r\n    --primary-hover: #1B4D3E;\r\n    --primary-light: #74C69D;\r\n    --primary-bg: rgba(45, 106, 79, 0.06);\r\n    --primary-glow: rgba(45, 106, 79, 0.12);\r\n\r\n    /* ── Accent: Terracotta ── */\r\n    --accent: #C4603D;\r\n    --accent-hover: #A8502F;\r\n    --accent-bg: rgba(196, 96, 61, 0.07);\r\n\r\n    /* ── Text ── */\r\n    --text: #1A1C1E;\r\n    --text-2: #555759;\r\n    --text-3: #8C8E91;\r\n    --text-4: #C5C7CA;\r\n\r\n    /* ── Semantic ── */\r\n    --success: #2D6A4F;\r\n    --success-bg: rgba(45, 106, 79, 0.07);\r\n    --error: #B83A3A;\r\n    --error-bg: rgba(184, 58, 58, 0.07);\r\n    --warning: #C08B2D;\r\n    --warning-bg: rgba(192, 139, 45, 0.07);\r\n\r\n    /* ── Shape ── */\r\n    --radius: 10px;\r\n    --radius-lg: 14px;\r\n    --radius-xl: 20px;\r\n\r\n    /* ── Depth — warm tinted shadows ── */\r\n    --shadow-sm: 0 1px 2px rgba(30, 25, 20, 0.04);\r\n    --shadow: 0 2px 5px rgba(30, 25, 20, 0.05), 0 1px 2px rgba(30, 25, 20, 0.03);\r\n    --shadow-md: 0 4px 12px rgba(30, 25, 20, 0.06), 0 1px 3px rgba(30, 25, 20, 0.04);\r\n    --shadow-lg: 0 8px 24px rgba(30, 25, 20, 0.08), 0 2px 6px rgba(30, 25, 20, 0.04);\r\n\r\n    /* ── Typography ── */\r\n    --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;\r\n    --mono: 'JetBrains Mono', 'Cascadia Code', 'Menlo', monospace;\r\n\r\n    /* ── Chat ── */\r\n    --chat-user-bg: var(--primary);\r\n    --chat-user-text: #FFFFFF;\r\n    --chat-ai-bg: #FFFFFF;\r\n    --chat-ai-border: rgba(0, 0, 0, 0.06);\r\n    --chat-ai-text: var(--text);\r\n\r\n    /* ── Glass ── */\r\n    --glass-bg: rgba(255, 255, 255, 0.7);\r\n    --glass-border: rgba(255, 255, 255, 0.4);\r\n    --blur: 16px;\r\n}\r\n\r\n/* ── Dark mode ── */\r\n@media (prefers-color-scheme: dark) {\r\n    :root {\r\n        --bg: #141516;\r\n        --bg-gradient: radial-gradient(circle at 50% 0%, #1A1B1D, #0F1011);\r\n        --surface: #1A1B1D;\r\n        --card: #212224;\r\n        --card-border: #313335;\r\n        --card-hover: #2A2B2D;\r\n        --input-bg: #19191B;\r\n\r\n        --primary: #52B788;\r\n        --primary-hover: #74C69D;\r\n        --primary-light: #2D6A4F;\r\n        --primary-bg: rgba(82, 183, 136, 0.08);\r\n        --primary-glow: rgba(82, 183, 136, 0.14);\r\n\r\n        --accent: #E0915A;\r\n        --accent-hover: #EAA876;\r\n        --accent-bg: rgba(224, 145, 90, 0.09);\r\n\r\n        --text: #E5E3DE;\r\n        --text-2: #9B9D9F;\r\n        --text-3: #606264;\r\n        --text-4: #3A3C3E;\r\n\r\n        --success: #52B788;\r\n        --success-bg: rgba(82, 183, 136, 0.09);\r\n        --error: #E06060;\r\n        --error-bg: rgba(224, 96, 96, 0.09);\r\n        --warning: #E0B85A;\r\n        --warning-bg: rgba(224, 184, 90, 0.09);\r\n\r\n        --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.18);\r\n        --shadow: 0 2px 5px rgba(0, 0, 0, 0.22);\r\n        --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.28);\r\n        --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.32);\r\n\r\n        --chat-user-bg: var(--primary);\r\n        --chat-user-text: #141516;\r\n        --chat-ai-bg: #212224;\r\n        --chat-ai-border: rgba(255, 255, 255, 0.05);\r\n        --chat-ai-text: var(--text);\r\n\r\n        --glass-bg: rgba(20, 21, 22, 0.75);\r\n        --glass-border: rgba(255, 255, 255, 0.08);\r\n    }\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* RESET & BASE                                                    */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n*,\r\n*::before,\r\n*::after {\r\n    box-sizing: border-box;\r\n}\r\n\r\nhtml,\r\nbody {\r\n    width: 100%;\r\n    height: 100%;\r\n    margin: 0;\r\n    padding: 0;\r\n    font-family: var(--font);\r\n    font-size: 13px;\r\n    line-height: 1.55;\r\n    background: var(--bg-gradient);\r\n    color: var(--text);\r\n    -webkit-font-smoothing: antialiased;\r\n    -moz-osx-font-smoothing: grayscale;\r\n    overflow-x: hidden;\r\n}\r\n\r\n#app-body {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100vh;\r\n    overflow: hidden;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* HEADER                                                          */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.app-header {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    padding: 12px 18px;\r\n    background: var(--glass-bg);\r\n    backdrop-filter: blur(var(--blur));\r\n    -webkit-backdrop-filter: blur(var(--blur));\r\n    border-bottom: 1px solid var(--glass-border);\r\n    position: sticky;\r\n    top: 0;\r\n    z-index: 100;\r\n}\r\n\r\n.brand {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 9px;\r\n}\r\n\r\n.logo {\r\n    color: var(--primary);\r\n    display: flex;\r\n    align-items: center;\r\n}\r\n\r\n.brand h1 {\r\n    font-size: 15px;\r\n    font-weight: 700;\r\n    margin: 0;\r\n    letter-spacing: -0.025em;\r\n    color: var(--text);\r\n}\r\n\r\n.highlight-text {\r\n    color: var(--primary);\r\n    font-weight: 700;\r\n    /* Solid color, not a gradient — feels hand-picked */\r\n}\r\n\r\n.header-actions {\r\n    display: flex;\r\n    gap: 5px;\r\n}\r\n\r\n\r\n/* ── Icon Buttons ── */\r\n/* Base Icon Button */\r\n.btn-icon {\r\n    width: 34px;\r\n    height: 34px;\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 10px;\r\n    background: var(--card);\r\n    color: var(--text-2);\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);\r\n    padding: 0;\r\n    box-shadow: var(--shadow-sm);\r\n}\r\n\r\n.btn-icon:hover {\r\n    color: var(--primary);\r\n    border-color: var(--primary-light);\r\n    background: var(--primary-bg);\r\n    transform: translateY(-2px);\r\n    box-shadow: var(--shadow);\r\n}\r\n\r\n.btn-icon:active {\r\n    transform: scale(0.95);\r\n}\r\n\r\n\r\n\r\n/* ─── Panels (Docs / Settings) ─── */\r\n.panel {\r\n    padding: 16px;\r\n    background: var(--card);\r\n    border-bottom: 1px solid var(--card-border);\r\n    animation: slideDown 0.22s ease-out;\r\n    max-height: 80vh;\r\n    overflow-y: auto;\r\n    box-shadow: var(--shadow-md);\r\n}\r\n\r\n.panel h3 {\r\n    font-size: 11px;\r\n    font-weight: 700;\r\n    /* Fixed from 650 */\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.06em;\r\n    color: var(--text-3);\r\n    margin: 0 0 12px;\r\n}\r\n\r\n\r\n/* ── Docs Grid ── */\r\n.docs-grid {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 8px;\r\n}\r\n\r\n.doc-item {\r\n    display: flex;\r\n    gap: 10px;\r\n    align-items: flex-start;\r\n    padding: 5px 0;\r\n}\r\n\r\n.doc-icon {\r\n    flex-shrink: 0;\r\n    width: 18px;\r\n    height: 18px;\r\n    color: var(--primary);\r\n    display: flex;\r\n    align-items: center;\r\n    margin-top: 1px;\r\n}\r\n\r\n.doc-item strong {\r\n    font-size: 12px;\r\n    font-weight: 600;\r\n    color: var(--text);\r\n    display: block;\r\n    margin-bottom: 2px;\r\n}\r\n\r\n.doc-item p {\r\n    font-size: 11px;\r\n    color: var(--text-2);\r\n    margin: 0;\r\n    line-height: 1.45;\r\n}\r\n\r\n.docs-hint {\r\n    font-size: 11px;\r\n    color: var(--text-3);\r\n    margin: 12px 0 0;\r\n    font-style: italic;\r\n    line-height: 1.5;\r\n}\r\n\r\n\r\n/* ── Forms ── */\r\n.form-group {\r\n    margin-bottom: 12px;\r\n}\r\n\r\n.form-group label {\r\n    display: block;\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    color: var(--text-3);\r\n    margin-bottom: 4px;\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.04em;\r\n}\r\n\r\n.form-input {\r\n    width: 100%;\r\n    padding: 8px 11px;\r\n    font-size: 13px;\r\n    font-family: var(--font);\r\n    color: var(--text);\r\n    background: var(--input-bg);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 9px;\r\n    outline: none;\r\n    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;\r\n}\r\n\r\n.form-input:focus {\r\n    border-color: var(--primary);\r\n    box-shadow: 0 0 0 3px var(--primary-glow);\r\n}\r\n\r\nselect.form-input {\r\n    cursor: pointer;\r\n    appearance: none;\r\n    background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\r\n    background-repeat: no-repeat;\r\n    background-position: right 10px center;\r\n    padding-right: 28px;\r\n}\r\n\r\n.btn-save {\r\n    width: 100%;\r\n    justify-content: center;\r\n    margin-top: 6px;\r\n}\r\n\r\n/* Model selector row */\r\n.model-select-wrapper {\r\n    display: flex;\r\n    gap: 5px;\r\n    align-items: center;\r\n}\r\n\r\n.model-select-wrapper .form-input {\r\n    flex: 1;\r\n    min-width: 0;\r\n}\r\n\r\n.btn-refresh {\r\n    width: 30px;\r\n    height: 30px;\r\n    flex-shrink: 0;\r\n    padding: 0;\r\n}\r\n\r\n.model-status {\r\n    font-size: 11px;\r\n    margin-top: 4px;\r\n    min-height: 15px;\r\n    color: var(--text-3);\r\n}\r\n\r\n.model-status-ok {\r\n    color: var(--success);\r\n}\r\n\r\n.model-status-warn {\r\n    color: var(--error);\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* MODE TOGGLE                                                     */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.mode-toggle {\r\n    display: flex;\r\n    align-items: center;\r\n    padding: 5px;\r\n    margin: 10px 14px;\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 14px;\r\n    position: relative;\r\n    gap: 4px;\r\n    box-shadow: var(--shadow-sm);\r\n}\r\n\r\n.mode-tab {\r\n    flex: 1;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 8px;\r\n    padding: 10px;\r\n    font-size: 13px;\r\n    font-weight: 600;\r\n    font-family: var(--font);\r\n    color: var(--text-3);\r\n    background: transparent;\r\n    border: none;\r\n    cursor: pointer;\r\n    transition: all 0.3s ease;\r\n    position: relative;\r\n    z-index: 2;\r\n}\r\n\r\n.mode-tab.active {\r\n    color: var(--primary);\r\n}\r\n\r\n.mode-indicator {\r\n    position: absolute;\r\n    left: 5px;\r\n    top: 5px;\r\n    width: calc(50% - 7px);\r\n    height: calc(100% - 10px);\r\n    background: var(--primary-bg);\r\n    border-radius: 10px;\r\n    transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);\r\n    z-index: 1;\r\n}\r\n\r\n.mode-indicator.right {\r\n    transform: translateX(calc(100% + 4px));\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* MODE CONTENT WRAPPER                                            */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.mode-content {\r\n    display: none;\r\n    flex-direction: column;\r\n    flex: 1;\r\n    overflow: hidden;\r\n    animation: fadeIn 0.2s ease-out;\r\n}\r\n\r\n.mode-content.active {\r\n    display: flex;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* PLANNING MODE — Chat                                            */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n\r\n/* ── Chat Messages Container ── */\r\n.chat-messages {\r\n    flex: 1;\r\n    overflow-y: auto;\r\n    padding: 14px 14px 6px;\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 14px;\r\n    scroll-behavior: smooth;\r\n}\r\n\r\n\r\n/* ── Welcome Screen ── */\r\n.chat-welcome {\r\n    text-align: center;\r\n    padding: 28px 18px 18px;\r\n    animation: fadeIn 0.35s ease-out;\r\n}\r\n\r\n.welcome-icon {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    width: 52px;\r\n    height: 52px;\r\n    background: var(--primary);\r\n    border-radius: 16px;\r\n    color: white;\r\n    margin-bottom: 14px;\r\n    box-shadow: 0 4px 14px rgba(45, 106, 79, 0.2);\r\n}\r\n\r\n.welcome-icon svg {\r\n    width: 24px;\r\n    height: 24px;\r\n}\r\n\r\n.chat-welcome h2 {\r\n    font-size: 17px;\r\n    font-weight: 700;\r\n    margin: 0 0 8px;\r\n    color: var(--text);\r\n    letter-spacing: -0.02em;\r\n}\r\n\r\n.chat-welcome p {\r\n    font-size: 12.5px;\r\n    color: var(--text-2);\r\n    margin: 0 0 18px;\r\n    line-height: 1.65;\r\n    max-width: 270px;\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n}\r\n\r\n\r\n/* ── Chat Suggestions ── */\r\n.welcome-suggestions {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 7px;\r\n    max-width: 280px;\r\n    margin: 0 auto;\r\n}\r\n\r\n.suggestion-chip {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 9px;\r\n    padding: 10px 13px;\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: var(--radius);\r\n    font-size: 11.5px;\r\n    color: var(--text-2);\r\n    cursor: pointer;\r\n    transition: all 0.22s ease-out;\r\n    text-align: left;\r\n    font-family: var(--font);\r\n    line-height: 1.4;\r\n}\r\n\r\n.suggestion-chip:hover {\r\n    border-color: var(--primary);\r\n    color: var(--primary);\r\n    background: var(--primary-bg);\r\n    transform: translateX(3px);\r\n}\r\n\r\n.suggestion-chip svg {\r\n    flex-shrink: 0;\r\n    color: var(--primary);\r\n    opacity: 0.5;\r\n}\r\n\r\n.suggestion-chip:hover svg {\r\n    opacity: 1;\r\n}\r\n\r\n\r\n/* ── Chat Message Bubbles ── */\r\n.chat-msg {\r\n    display: flex;\r\n    gap: 0;\r\n    margin-bottom: 12px;\r\n    animation: msgSlideIn 0.35s cubic-bezier(0.19, 1, 0.22, 1);\r\n    max-width: 100%;\r\n}\r\n\r\n.chat-msg.user {\r\n    justify-content: flex-end;\r\n}\r\n\r\n.chat-msg.ai {\r\n    justify-content: flex-start;\r\n}\r\n\r\n.chat-bubble {\r\n    padding: 12px 16px;\r\n    border-radius: 20px;\r\n    font-size: 14px;\r\n    line-height: 1.5;\r\n    max-width: 85%;\r\n    word-wrap: break-word;\r\n    overflow-wrap: break-word;\r\n    box-shadow: var(--shadow-sm);\r\n    transition: transform 0.2s ease;\r\n}\r\n\r\n.chat-bubble:has(table) {\r\n    max-width: 95%;\r\n}\r\n\r\n.chat-msg.user .chat-bubble {\r\n    background: var(--primary);\r\n    color: white;\r\n    border-bottom-right-radius: 4px;\r\n    margin-right: 4px;\r\n}\r\n\r\n.chat-msg.ai .chat-bubble {\r\n    background: var(--card);\r\n    color: var(--text-1);\r\n    border: 1px solid var(--card-border);\r\n    border-bottom-left-radius: 4px;\r\n    margin-left: 4px;\r\n}\r\n\r\n\r\n/* ── Chat formatted text ── */\r\n.chat-bubble strong {\r\n    font-weight: 600;\r\n}\r\n\r\n.chat-bubble em {\r\n    font-style: italic;\r\n    opacity: 0.9;\r\n}\r\n\r\n.chat-bubble code {\r\n    font-family: var(--mono);\r\n    font-size: 11px;\r\n    padding: 2px 5px;\r\n    border-radius: 5px;\r\n    background: rgba(0, 0, 0, 0.06);\r\n}\r\n\r\n.chat-msg.user .chat-bubble code {\r\n    background: rgba(255, 255, 255, 0.18);\r\n}\r\n\r\n.chat-bubble ul,\r\n.chat-bubble ol {\r\n    margin: 6px 0;\r\n    padding-left: 18px;\r\n}\r\n\r\n.chat-bubble li {\r\n    margin-bottom: 3px;\r\n}\r\n\r\n.chat-bubble p {\r\n    margin: 0 0 8px;\r\n}\r\n\r\n.chat-bubble li p {\r\n    margin: 0;\r\n    display: inline;\r\n}\r\n\r\n.chat-bubble p:last-child {\r\n    margin: 0;\r\n}\r\n\r\n.chat-bubble h1,\r\n.chat-bubble h2,\r\n.chat-bubble h3 {\r\n    margin: 12px 0 6px;\r\n    font-weight: 700;\r\n    line-height: 1.3;\r\n}\r\n\r\n.chat-bubble h1 {\r\n    font-size: 1.25em;\r\n    border-bottom: 1px solid var(--border);\r\n    padding-bottom: 4px;\r\n}\r\n\r\n.chat-bubble h2 {\r\n    font-size: 1.15em;\r\n}\r\n\r\n.chat-bubble h3 {\r\n    font-size: 1.05em;\r\n    color: var(--text-2);\r\n}\r\n\r\n/* Table styling for AI responses */\r\n.chat-bubble table {\r\n    width: 100%;\r\n    border-collapse: collapse;\r\n    margin: 10px 0;\r\n    font-size: 11px;\r\n    background: var(--surface);\r\n    border-radius: 8px;\r\n    overflow: hidden;\r\n    display: block;\r\n    overflow-x: auto;\r\n}\r\n\r\n.chat-bubble th,\r\n.chat-bubble td {\r\n    padding: 6px 10px;\r\n    border: 1px solid var(--border);\r\n    text-align: left;\r\n}\r\n\r\n.chat-bubble th {\r\n    background: var(--surface-2);\r\n    font-weight: 600;\r\n    color: var(--primary);\r\n}\r\n\r\n.chat-bubble tr:nth-child(even) {\r\n    background: rgba(0, 0, 0, 0.02);\r\n}\r\n\r\n/* ── Context Badge ── */\r\n.context-badge {\r\n    display: block;\r\n    margin-top: 8px;\r\n    padding: 4px 8px;\r\n    font-size: 10px;\r\n    font-weight: 500;\r\n    color: rgba(255, 255, 255, 0.85);\r\n    background: rgba(255, 255, 255, 0.15);\r\n    border-radius: 6px;\r\n    letter-spacing: 0.2px;\r\n}\r\n\r\n.chat-msg.ai .context-badge {\r\n    color: var(--text-2);\r\n    background: var(--primary-bg);\r\n}\r\n\r\n\r\n/* ── Execute from Chat ── */\r\n.chat-action-bar {\r\n    display: flex;\r\n    gap: 6px;\r\n    margin-top: 10px;\r\n}\r\n\r\n.btn-execute-from-chat {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    gap: 5px;\r\n    padding: 5px 11px;\r\n    font-size: 10.5px;\r\n    font-weight: 600;\r\n    font-family: var(--font);\r\n    background: var(--primary-bg);\r\n    color: var(--primary);\r\n    border: 1px solid var(--primary-glow);\r\n    border-radius: 7px;\r\n    cursor: pointer;\r\n    transition: all 0.2s ease-out;\r\n}\r\n\r\n.btn-execute-from-chat:hover {\r\n    background: var(--primary);\r\n    color: white;\r\n    box-shadow: 0 2px 8px rgba(45, 106, 79, 0.25);\r\n}\r\n\r\n\r\n/* ── Typing Indicator ── */\r\n.typing-indicator {\r\n    display: flex;\r\n    gap: 4px;\r\n    align-items: center;\r\n    padding: 4px 0;\r\n}\r\n\r\n.typing-dot {\r\n    width: 6px;\r\n    height: 6px;\r\n    background: var(--text-3);\r\n    border-radius: 50%;\r\n    animation: typingBounce 0.6s ease-in-out infinite;\r\n}\r\n\r\n.typing-dot:nth-child(2) {\r\n    animation-delay: 0.15s;\r\n}\r\n\r\n.typing-dot:nth-child(3) {\r\n    animation-delay: 0.3s;\r\n}\r\n\r\n\r\n/* ── Chat Input Area ── */\r\n.chat-input-area {\r\n    padding: 12px 14px 12px;\r\n    background: var(--glass-bg);\r\n    backdrop-filter: blur(var(--blur));\r\n    -webkit-backdrop-filter: blur(var(--blur));\r\n    border-top: 1px solid var(--glass-border);\r\n}\r\n\r\n.chat-input-card {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 10px;\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: var(--radius-xl);\r\n    padding: 6px 6px 6px 16px;\r\n    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\r\n    box-shadow: var(--shadow-md);\r\n}\r\n\r\n.chat-input-card:focus-within {\r\n    border-color: var(--primary);\r\n    box-shadow: 0 4px 20px var(--primary-glow);\r\n    transform: translateY(-2px);\r\n}\r\n\r\n#chat-input {\r\n    flex: 1;\r\n    border: none;\r\n    background: transparent;\r\n    font-family: var(--font);\r\n    font-size: 13px;\r\n    line-height: 1.4;\r\n    padding: 6px 0;\r\n    color: var(--text-1);\r\n    resize: none;\r\n    outline: none;\r\n    max-height: 120px;\r\n    min-height: 20px;\r\n}\r\n\r\n/* Agent Footer Layout */\r\n.card-footer {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    margin-top: 12px;\r\n}\r\n\r\n.footer-left {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 8px;\r\n}\r\n\r\n/* Original btn-clip (updated) */\r\n.btn-clip {\r\n    background: none;\r\n    border: none;\r\n    color: var(--text-3);\r\n    cursor: pointer;\r\n    padding: 6px;\r\n    border-radius: 6px;\r\n    display: inline-flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    transition: all 0.2s;\r\n}\r\n\r\n.btn-clip:hover {\r\n    background: var(--surface-hover);\r\n    color: var(--primary);\r\n}\r\n\r\n.file-preview {\r\n    background: var(--surface-2);\r\n    border: 1px solid var(--border);\r\n    border-radius: 6px;\r\n    padding: 6px 10px;\r\n    margin-bottom: 8px;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    font-size: 11px;\r\n    color: var(--text-1);\r\n}\r\n\r\n.file-thumb {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 8px;\r\n    padding-right: 8px;\r\n}\r\n\r\n.file-remove {\r\n    background: none;\r\n    border: none;\r\n    color: var(--text-3);\r\n    font-size: 16px;\r\n    cursor: pointer;\r\n    padding: 0 4px;\r\n    line-height: 1;\r\n}\r\n\r\n.file-center {\r\n    display: flex;\r\n    align-items: center;\r\n}\r\n\r\n#chat-input::placeholder {\r\n    color: var(--text-3);\r\n}\r\n\r\n.btn-send {\r\n    width: 38px;\r\n    height: 38px;\r\n    border: none;\r\n    border-radius: 12px;\r\n    background: var(--primary);\r\n    color: white;\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    flex-shrink: 0;\r\n    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);\r\n    box-shadow: 0 4px 12px rgba(45, 106, 79, 0.3);\r\n}\r\n\r\n.btn-send:hover {\r\n    background: var(--primary-hover);\r\n    transform: translateY(-2px) scale(1.05);\r\n}\r\n\r\n.btn-send:disabled {\r\n    opacity: 0.35;\r\n    cursor: not-allowed;\r\n    transform: none;\r\n}\r\n\r\n.btn-send.is-busy {\r\n    background: #FF4D4D;\r\n    /* Red stop button */\r\n    box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);\r\n}\r\n\r\n.btn-send.is-busy:hover {\r\n    background: #E60000;\r\n    transform: scale(1.1);\r\n}\r\n\r\n.btn-send svg {\r\n    width: 14px;\r\n    height: 14px;\r\n}\r\n\r\n.chat-footer {\r\n    display: flex;\r\n    justify-content: center;\r\n    padding: 4px 0 0;\r\n}\r\n\r\n/* ── File Preview List ── */\r\n.file-preview-list {\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n    gap: 6px;\r\n    margin-bottom: 8px;\r\n    padding: 0 4px;\r\n}\r\n\r\n.file-chip {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    gap: 6px;\r\n    background: var(--surface);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 6px;\r\n    padding: 4px 8px;\r\n    font-size: 11px;\r\n    color: var(--text);\r\n    transition: all 0.2s ease;\r\n    max-width: 100%;\r\n}\r\n\r\n.file-chip:hover {\r\n    border-color: var(--primary-light);\r\n    background: var(--card);\r\n    transform: translateY(-1px);\r\n    box-shadow: var(--shadow-sm);\r\n}\r\n\r\n.file-chip-icon {\r\n    font-size: 12px;\r\n    opacity: 0.7;\r\n}\r\n\r\n.file-chip-name {\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    max-width: 140px;\r\n}\r\n\r\n.file-chip-remove {\r\n    background: none;\r\n    border: none;\r\n    cursor: pointer;\r\n    color: var(--text-3);\r\n    padding: 0 2px;\r\n    font-size: 14px;\r\n    line-height: 1;\r\n    display: flex;\r\n    align-items: center;\r\n    border-radius: 4px;\r\n    transition: color 0.2s;\r\n}\r\n\r\n.file-chip-remove:hover {\r\n    color: var(--error);\r\n    background: var(--error-bg);\r\n}\r\n\r\n/* ── Custom Scrollbar ── */\r\n::-webkit-scrollbar {\r\n    width: 6px;\r\n    height: 6px;\r\n}\r\n\r\n::-webkit-scrollbar-track {\r\n    background: transparent;\r\n}\r\n\r\n::-webkit-scrollbar-thumb {\r\n    background: rgba(0, 0, 0, 0.1);\r\n    border-radius: 3px;\r\n}\r\n\r\n::-webkit-scrollbar-thumb:hover {\r\n    background: rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n@media (prefers-color-scheme: dark) {\r\n    ::-webkit-scrollbar-thumb {\r\n        background: rgba(255, 255, 255, 0.15);\r\n    }\r\n\r\n    ::-webkit-scrollbar-thumb:hover {\r\n        background: rgba(255, 255, 255, 0.25);\r\n    }\r\n\r\n    .app-header {\r\n        background: rgba(26, 27, 29, 0.85);\r\n        /* Dark mode glass */\r\n    }\r\n}\r\n\r\n.btn-text {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    gap: 4px;\r\n    padding: 5px 9px;\r\n    font-size: 11px;\r\n    font-weight: 500;\r\n    font-family: var(--font);\r\n    color: var(--text-3);\r\n    background: transparent;\r\n    border: none;\r\n    cursor: pointer;\r\n    border-radius: 7px;\r\n    transition: color 0.15s, background 0.15s;\r\n}\r\n\r\n.btn-text:hover {\r\n    color: var(--error);\r\n    background: var(--error-bg);\r\n}\r\n\r\n.btn-text svg {\r\n    width: 12px;\r\n    height: 12px;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* AGENT MODE                                                      */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.content-wrapper {\r\n    flex: 1;\r\n    display: flex;\r\n    flex-direction: column;\r\n    width: 100%;\r\n    overflow: hidden;\r\n    position: relative;\r\n    min-height: 0;\r\n}\r\n\r\n.agent-scroll-area {\r\n    flex: 1;\r\n    overflow-y: auto;\r\n    padding: 10px 14px 14px;\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 12px;\r\n    scroll-behavior: smooth;\r\n    min-height: 0;\r\n}\r\n\r\n\r\n/* ── Category Tabs ── */\r\n.action-categories {\r\n    display: flex;\r\n    gap: 5px;\r\n    overflow-x: auto;\r\n    padding: 2px 0;\r\n    scrollbar-width: none;\r\n    flex-shrink: 0;\r\n}\r\n\r\n.action-categories::-webkit-scrollbar {\r\n    display: none;\r\n}\r\n\r\n.category-tab {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 5px;\r\n    padding: 7px 11px;\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    font-family: var(--font);\r\n    color: var(--text-3);\r\n    background: transparent;\r\n    border: 1px solid transparent;\r\n    border-radius: 9px;\r\n    cursor: pointer;\r\n    transition: all 0.2s ease-out;\r\n    white-space: nowrap;\r\n    flex-shrink: 0;\r\n}\r\n\r\n.category-tab:hover {\r\n    color: var(--text-2);\r\n    background: var(--card);\r\n}\r\n\r\n.category-tab.active {\r\n    color: var(--primary);\r\n    background: var(--primary-bg);\r\n    border-color: var(--primary-glow);\r\n    animation: tabPulse 2s infinite ease-in-out;\r\n}\r\n\r\n.category-tab svg {\r\n    width: 12px;\r\n    height: 12px;\r\n}\r\n\r\n\r\n/* ── Schema Info Banner (Extract Mode) ── */\r\n.schema-info {\r\n    display: flex;\r\n    align-items: flex-start;\r\n    gap: 10px;\r\n    padding: 10px 12px;\r\n    margin-bottom: 10px;\r\n    background: linear-gradient(135deg, var(--primary-bg), rgba(74, 144, 226, 0.06));\r\n    border: 1px solid var(--primary-glow);\r\n    border-radius: 10px;\r\n    animation: fadeIn 0.3s ease-out;\r\n}\r\n\r\n.schema-icon {\r\n    font-size: 18px;\r\n    line-height: 1;\r\n    flex-shrink: 0;\r\n}\r\n\r\n.schema-text {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 2px;\r\n}\r\n\r\n.schema-text strong {\r\n    font-size: 11.5px;\r\n    font-weight: 600;\r\n    color: var(--primary);\r\n}\r\n\r\n.schema-text span {\r\n    font-size: 10.5px;\r\n    color: var(--text-2);\r\n    line-height: 1.4;\r\n}\r\n\r\n.btn-detect {\r\n    padding: 5px 10px;\r\n    font-size: 10px;\r\n    font-weight: 600;\r\n    font-family: var(--font);\r\n    color: var(--primary);\r\n    background: var(--card);\r\n    border: 1px solid var(--primary-glow);\r\n    border-radius: 6px;\r\n    cursor: pointer;\r\n    transition: all 0.2s ease-out;\r\n    flex-shrink: 0;\r\n    margin-left: auto;\r\n}\r\n\r\n.btn-detect:hover {\r\n    background: var(--primary-bg);\r\n    transform: translateY(-1px);\r\n}\r\n\r\n.btn-detect:active {\r\n    transform: scale(0.96);\r\n}\r\n\r\n/* ── Detected Columns Preview ── */\r\n.detected-columns {\r\n    padding: 10px 12px;\r\n    margin-bottom: 10px;\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 10px;\r\n    animation: fadeIn 0.3s ease-out;\r\n}\r\n\r\n.detected-header {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    margin-bottom: 8px;\r\n}\r\n\r\n.detected-label {\r\n    font-size: 10.5px;\r\n    font-weight: 600;\r\n    color: var(--text-2);\r\n}\r\n\r\n.column-count {\r\n    font-size: 10px;\r\n    font-weight: 700;\r\n    color: var(--primary);\r\n    background: var(--primary-bg);\r\n    padding: 2px 8px;\r\n    border-radius: 10px;\r\n}\r\n\r\n.column-chips {\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n    gap: 4px;\r\n}\r\n\r\n.column-chip {\r\n    padding: 3px 8px;\r\n    font-size: 10px;\r\n    font-weight: 500;\r\n    color: var(--text-2);\r\n    background: var(--input-bg);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 6px;\r\n}\r\n\r\n.column-chip.empty-warning {\r\n    color: var(--warning);\r\n    background: var(--warning-bg);\r\n    border-color: rgba(192, 139, 45, 0.2);\r\n}\r\n\r\n/* ── Extract Category Highlight ── */\r\n.category-tab[data-category=\"extract\"].active {\r\n    color: #C4603D;\r\n    background: rgba(196, 96, 61, 0.08);\r\n    border-color: rgba(196, 96, 61, 0.15);\r\n}\r\n\r\n.category-tab[data-category=\"extract\"]:hover {\r\n    color: #A8502F;\r\n}\r\n\r\n/* ── Smart Tools Category Highlight ── */\r\n.category-tab[data-category=\"smart\"].active {\r\n    color: #7C3AED;\r\n    background: rgba(124, 58, 237, 0.08);\r\n    border-color: rgba(124, 58, 237, 0.15);\r\n}\r\n\r\n.category-tab[data-category=\"smart\"]:hover {\r\n    color: #6D28D9;\r\n}\r\n\r\n\r\n/* ── Quick Action Chips ── */\r\n.quick-actions {\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n    gap: 6px;\r\n}\r\n\r\n.chip {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    gap: 6px;\r\n    padding: 8px 14px;\r\n    font-size: 12px;\r\n    font-weight: 500;\r\n    font-family: var(--font);\r\n    color: var(--text-2);\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 24px;\r\n    cursor: pointer;\r\n    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);\r\n    white-space: nowrap;\r\n}\r\n\r\n.chip:hover {\r\n    color: var(--primary);\r\n    border-color: var(--primary);\r\n    background: var(--card);\r\n    transform: translateY(-2px);\r\n    box-shadow: var(--shadow-md);\r\n}\r\n\r\n.chip svg {\r\n    width: 14px;\r\n    height: 14px;\r\n    flex-shrink: 0;\r\n    transition: transform 0.3s ease;\r\n}\r\n\r\n.chip:hover svg {\r\n    transform: rotate(15deg);\r\n}\r\n\r\n\r\n/* ── Input Card (Agent) ── */\r\n.input-card {\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: var(--radius-xl);\r\n    display: flex;\r\n    flex-direction: column;\r\n    box-shadow: var(--shadow-md);\r\n    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\r\n    margin: 14px 14px 0 14px;\r\n    flex-shrink: 0;\r\n}\r\n\r\n.input-card:focus-within {\r\n    border-color: var(--primary);\r\n    box-shadow: 0 2px 16px var(--primary-glow);\r\n}\r\n\r\ntextarea {\r\n    width: 100%;\r\n    min-height: 80px;\r\n    max-height: 160px;\r\n    padding: 14px 16px;\r\n    background: transparent;\r\n    border: none;\r\n    color: var(--text);\r\n    font-family: var(--font);\r\n    font-size: 13px;\r\n    line-height: 1.6;\r\n    resize: none;\r\n    outline: none;\r\n}\r\n\r\n.card-footer {\r\n    padding: 8px 12px;\r\n    background: rgba(0, 0, 0, 0.02);\r\n    border-top: 1px solid var(--card-border);\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    gap: 8px;\r\n    flex-shrink: 0;\r\n}\r\n\r\n\r\n/* ── Cache Badge ── */\r\n.cache-badge {\r\n    font-size: 10.5px;\r\n    font-weight: 600;\r\n    color: var(--success);\r\n    background: var(--success-bg);\r\n    padding: 3px 9px;\r\n    border-radius: 10px;\r\n    animation: fadeIn 0.2s;\r\n}\r\n\r\n\r\n/* ── Primary Button ── */\r\n.btn-primary {\r\n    background: var(--primary);\r\n    color: white;\r\n    border: none;\r\n    padding: 8px 16px;\r\n    border-radius: 9px;\r\n    font-size: 12px;\r\n    font-weight: 600;\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 6px;\r\n    transition: background 0.2s ease-out, transform 0.15s ease-out, box-shadow 0.2s ease-out;\r\n    box-shadow: 0 2px 6px rgba(45, 106, 79, 0.2);\r\n}\r\n\r\n.btn-primary:hover {\r\n    background: var(--primary-hover);\r\n    transform: translateY(-1px);\r\n    box-shadow: 0 4px 14px rgba(45, 106, 79, 0.25);\r\n}\r\n\r\n.btn-primary:active {\r\n    transform: translateY(0);\r\n}\r\n\r\n.btn-primary.btn-stop {\r\n    background: #E53E3E;\r\n    border-color: #C53030;\r\n    box-shadow: 0 4px 10px rgba(229, 62, 62, 0.2);\r\n}\r\n\r\n.btn-primary.btn-stop:hover {\r\n    background: #C53030;\r\n}\r\n\r\n.btn-primary:disabled {\r\n    opacity: 0.4;\r\n    cursor: not-allowed;\r\n    transform: none;\r\n}\r\n\r\n.btn-primary svg {\r\n    width: 13px;\r\n    height: 13px;\r\n}\r\n\r\n\r\n/* ── Skeleton Loading ── */\r\n.skeleton-container {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 9px;\r\n    padding: 4px 0;\r\n}\r\n\r\n.skeleton-pill {\r\n    width: 140px;\r\n    height: 28px;\r\n    border-radius: 9px;\r\n}\r\n\r\n.skeleton-line {\r\n    height: 13px;\r\n    border-radius: 5px;\r\n}\r\n\r\n.skeleton-line.w80 {\r\n    width: 80%;\r\n}\r\n\r\n.skeleton-line.w60 {\r\n    width: 60%;\r\n}\r\n\r\n.skeleton-line.w40 {\r\n    width: 40%;\r\n}\r\n\r\n/* Chat Skeleton Specifics */\r\n.skeleton-msg {\r\n    display: flex;\r\n    gap: 12px;\r\n    margin-bottom: 12px;\r\n    align-items: flex-start;\r\n}\r\n\r\n.skeleton-bubble {\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 20px;\r\n    border-bottom-left-radius: 4px;\r\n    padding: 14px;\r\n    flex: 1;\r\n    max-width: 85%;\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 10px;\r\n    box-shadow: var(--shadow-sm);\r\n    margin-left: 4px;\r\n}\r\n\r\n\r\n/* ── Status Pill ── */\r\n.status-pill {\r\n    padding: 9px 13px;\r\n    border-radius: var(--radius);\r\n    font-size: 12px;\r\n    font-weight: 500;\r\n    display: none;\r\n    align-items: center;\r\n    gap: 7px;\r\n    animation: fadeIn 0.2s;\r\n    border: 1px solid transparent;\r\n}\r\n\r\n.status-pill.info {\r\n    background: var(--primary-bg);\r\n    color: var(--primary);\r\n    border-color: var(--primary-glow);\r\n}\r\n\r\n.status-pill.success {\r\n    background: var(--success-bg);\r\n    color: var(--success);\r\n    border-color: rgba(45, 106, 79, 0.12);\r\n}\r\n\r\n.status-pill.error {\r\n    background: var(--error-bg);\r\n    color: var(--error);\r\n    border-color: rgba(184, 58, 58, 0.12);\r\n}\r\n\r\n\r\n/* ── Generated Code (Debug Section) ── */\r\n#debug-section {\r\n    margin-top: 4px;\r\n}\r\n\r\n#debug-section details {\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: var(--radius);\r\n    overflow: hidden;\r\n}\r\n\r\n#debug-section summary {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 6px;\r\n    padding: 10px 14px;\r\n    font-size: 12px;\r\n    font-weight: 600;\r\n    color: var(--text-2);\r\n    cursor: pointer;\r\n    user-select: none;\r\n    transition: all 0.2s ease;\r\n}\r\n\r\n#debug-section summary:hover {\r\n    color: var(--text);\r\n    background: rgba(0, 0, 0, 0.02);\r\n}\r\n\r\n#debug-section summary svg {\r\n    width: 12px;\r\n    height: 12px;\r\n    transition: transform 0.2s ease;\r\n}\r\n\r\n#debug-section details[open] summary svg {\r\n    transform: rotate(180deg);\r\n}\r\n\r\n#debug-code {\r\n    margin: 0;\r\n    padding: 12px 14px;\r\n    font-family: var(--mono);\r\n    font-size: 10px;\r\n    line-height: 1.6;\r\n    color: var(--text-2);\r\n    background: var(--input-bg);\r\n    border-top: 1px solid var(--card-border);\r\n    max-height: 200px;\r\n    overflow-y: auto;\r\n    white-space: pre-wrap;\r\n    word-break: break-all;\r\n}\r\n\r\n\r\n/* ── Spinners ── */\r\n.spinner {\r\n    width: 14px;\r\n    height: 14px;\r\n    border: 2px solid transparent;\r\n    border-radius: 50%;\r\n    border-top-color: currentColor;\r\n    border-right-color: currentColor;\r\n    animation: spin 0.7s linear infinite;\r\n}\r\n\r\n.btn-spinner {\r\n    width: 13px;\r\n    height: 13px;\r\n    border: 2px solid rgba(255, 255, 255, 0.3);\r\n    border-radius: 50%;\r\n    border-top-color: white;\r\n    animation: spin 0.7s linear infinite;\r\n    display: inline-block;\r\n}\r\n\r\n\r\n/* ── Debug Section ── */\r\n#debug-section {\r\n    margin-top: auto;\r\n    padding-top: 8px;\r\n}\r\n\r\ndetails {\r\n    background: transparent;\r\n    border: none;\r\n    border-radius: var(--radius);\r\n}\r\n\r\nsummary {\r\n    padding: 5px 0;\r\n    cursor: pointer;\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    color: var(--text-3);\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 5px;\r\n    list-style: none;\r\n    user-select: none;\r\n    transition: color 0.15s;\r\n}\r\n\r\nsummary::-webkit-details-marker {\r\n    display: none;\r\n}\r\n\r\nsummary:hover {\r\n    color: var(--text-2);\r\n}\r\n\r\ndetails[open] summary svg {\r\n    transform: rotate(180deg);\r\n}\r\n\r\nsummary svg {\r\n    transition: transform 0.15s;\r\n}\r\n\r\ndetails[open] summary {\r\n    margin-bottom: 5px;\r\n}\r\n\r\npre {\r\n    margin: 0;\r\n    padding: 11px;\r\n    background: var(--input-bg);\r\n    color: var(--text-2);\r\n    font-family: var(--mono);\r\n    font-size: 11px;\r\n    overflow-x: auto;\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 9px;\r\n    line-height: 1.55;\r\n    white-space: pre-wrap;\r\n    word-break: break-all;\r\n    max-height: 180px;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* PERFORMANCE — Skip rendering of offscreen/hidden content        */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n\r\n/* Hidden panels should not trigger layout/paint until opened */\r\n#settings-panel[style*=\"display: none\"],\r\n#docs-panel[style*=\"display: none\"] {\r\n    content-visibility: hidden;\r\n}\r\n\r\n/* Offscreen scrollable areas: skip rendering until scrolled into view */\r\n.agent-scroll-area,\r\n.chat-messages {\r\n    content-visibility: auto;\r\n    contain-intrinsic-size: 0 500px;\r\n}\r\n\r\n/* Reduce paint complexity during transitions: composite-only props */\r\n.chip,\r\n.suggestion-chip,\r\n.category-tab,\r\n.btn-icon,\r\n.btn-primary,\r\n.btn-send {\r\n    contain: layout style;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* SIDELOAD — Skeleton Loading Screen                              */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.sideload-container {\r\n    height: 100vh;\r\n    display: flex;\r\n    flex-direction: column;\r\n    background: var(--bg);\r\n    overflow: hidden;\r\n}\r\n\r\n.sideload-skeleton {\r\n    display: flex;\r\n    flex-direction: column;\r\n    width: 100%;\r\n    height: 100%;\r\n    animation: fadeIn 0.3s ease-out;\r\n}\r\n\r\n/* ── Premium Shimmer — GPU-accelerated glass wave ── */\r\n.sk-shimmer,\r\n.skeleton-line,\r\n.skeleton-pill {\r\n    position: relative;\r\n    overflow: hidden;\r\n    background: var(--card-border);\r\n}\r\n\r\n.sk-shimmer::after,\r\n.skeleton-line::after,\r\n.skeleton-pill::after {\r\n    content: '';\r\n    position: absolute;\r\n    inset: 0;\r\n    transform: translateX(-100%);\r\n    background: linear-gradient(\r\n        90deg,\r\n        transparent 0%,\r\n        rgba(255, 255, 255, 0.08) 25%,\r\n        rgba(255, 255, 255, 0.45) 50%,\r\n        rgba(255, 255, 255, 0.08) 75%,\r\n        transparent 100%\r\n    );\r\n    animation: shimmerWave 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;\r\n}\r\n\r\n/* Staggered wave within groups */\r\n.sk-brand .sk-shimmer:nth-child(2)::after,\r\n.sk-welcome .sk-shimmer:nth-child(2)::after,\r\n.skeleton-line:nth-child(2)::after { animation-delay: 0.12s; }\r\n\r\n.sk-welcome .sk-shimmer:nth-child(3)::after,\r\n.skeleton-line:nth-child(3)::after { animation-delay: 0.24s; }\r\n\r\n.sk-welcome .sk-shimmer:nth-child(4)::after { animation-delay: 0.36s; }\r\n\r\n.sk-suggestions .sk-shimmer:nth-child(2)::after { animation-delay: 0.1s; }\r\n.sk-suggestions .sk-shimmer:nth-child(3)::after { animation-delay: 0.2s; }\r\n\r\n.sk-mode-toggle .sk-shimmer:nth-child(2)::after { animation-delay: 0.1s; }\r\n\r\n/* ── Panel Skeleton — loading state for panels ── */\r\n.panel-skeleton {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 12px;\r\n    padding: 20px;\r\n}\r\n\r\n.panel-skeleton .sk-heading {\r\n    width: 55%;\r\n    height: 18px;\r\n    border-radius: 6px;\r\n}\r\n\r\n.panel-skeleton .sk-badge {\r\n    width: 90px;\r\n    height: 22px;\r\n    border-radius: 12px;\r\n}\r\n\r\n.panel-skeleton .sk-row {\r\n    display: flex;\r\n    gap: 12px;\r\n}\r\n\r\n.panel-skeleton .sk-block {\r\n    flex: 1;\r\n    height: 56px;\r\n    border-radius: 10px;\r\n}\r\n\r\n.panel-skeleton .sk-bar {\r\n    height: 13px;\r\n    border-radius: 5px;\r\n}\r\n\r\n.panel-skeleton .sk-bar.w70 { width: 70%; }\r\n.panel-skeleton .sk-bar.w50 { width: 50%; }\r\n.panel-skeleton .sk-bar.w85 { width: 85%; }\r\n.panel-skeleton .sk-bar.w40 { width: 40%; }\r\n\r\n.sk-header {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    padding: 13px 16px;\r\n    border-bottom: 1px solid var(--card-border);\r\n}\r\n\r\n.sk-brand {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 9px;\r\n}\r\n\r\n.sk-logo {\r\n    width: 24px;\r\n    height: 24px;\r\n    border-radius: 7px;\r\n}\r\n\r\n.sk-title {\r\n    width: 105px;\r\n    height: 15px;\r\n    border-radius: 5px;\r\n}\r\n\r\n.sk-header-actions {\r\n    display: flex;\r\n    gap: 5px;\r\n}\r\n\r\n.sk-icon-btn {\r\n    width: 32px;\r\n    height: 32px;\r\n    border-radius: 9px;\r\n}\r\n\r\n.sk-mode-toggle {\r\n    display: flex;\r\n    gap: 4px;\r\n    padding: 8px 6px;\r\n    border-bottom: 1px solid var(--card-border);\r\n}\r\n\r\n.sk-mode-tab {\r\n    flex: 1;\r\n    height: 36px;\r\n    border-radius: 9px;\r\n}\r\n\r\n.sk-welcome {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    padding: 34px 20px 18px;\r\n    gap: 11px;\r\n}\r\n\r\n.sk-welcome-icon {\r\n    width: 52px;\r\n    height: 52px;\r\n    border-radius: 16px;\r\n}\r\n\r\n.sk-welcome-title {\r\n    width: 145px;\r\n    height: 19px;\r\n    border-radius: 6px;\r\n}\r\n\r\n.sk-welcome-desc {\r\n    width: 220px;\r\n    height: 13px;\r\n    border-radius: 5px;\r\n}\r\n\r\n.sk-welcome-desc.short {\r\n    width: 175px;\r\n}\r\n\r\n.sk-suggestions {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 8px;\r\n    padding: 10px 32px;\r\n}\r\n\r\n.sk-suggestion {\r\n    width: 100%;\r\n    height: 38px;\r\n    border-radius: 10px;\r\n}\r\n\r\n.sk-suggestion:nth-child(2) {\r\n    animation-delay: 0.1s;\r\n}\r\n\r\n.sk-suggestion:nth-child(3) {\r\n    animation-delay: 0.2s;\r\n}\r\n\r\n.sk-suggestion:nth-child(4) {\r\n    animation-delay: 0.3s;\r\n}\r\n\r\n.sk-input-area {\r\n    margin-top: auto;\r\n    padding: 12px 16px 8px;\r\n    border-top: 1px solid var(--card-border);\r\n}\r\n\r\n.sk-input {\r\n    width: 100%;\r\n    height: 42px;\r\n    border-radius: 14px;\r\n}\r\n\r\n.sideload-status {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 9px;\r\n    padding: 11px;\r\n    font-size: 11.5px;\r\n    font-weight: 500;\r\n    color: var(--text-3);\r\n}\r\n\r\n.sideload-pulse {\r\n    width: 8px;\r\n    height: 8px;\r\n    border-radius: 50%;\r\n    background: var(--primary);\r\n    animation: pulse 1.5s ease-in-out infinite;\r\n    box-shadow: 0 0 8px var(--primary-glow);\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* KEYFRAMES                                                       */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n@keyframes fadeIn {\r\n    from {\r\n        opacity: 0;\r\n        transform: translateY(3px);\r\n    }\r\n\r\n    to {\r\n        opacity: 1;\r\n        transform: translateY(0);\r\n    }\r\n}\r\n\r\n@keyframes slideDown {\r\n    from {\r\n        opacity: 0;\r\n        transform: translateY(-6px);\r\n    }\r\n\r\n    to {\r\n        opacity: 1;\r\n        transform: translateY(0);\r\n    }\r\n}\r\n\r\n@keyframes spin {\r\n    to {\r\n        transform: rotate(360deg);\r\n    }\r\n}\r\n\r\n@keyframes shimmerWave {\r\n    0% {\r\n        transform: translateX(-100%);\r\n    }\r\n\r\n    100% {\r\n        transform: translateX(100%);\r\n    }\r\n}\r\n\r\n@keyframes msgSlideIn {\r\n    from {\r\n        opacity: 0;\r\n        transform: translateY(6px);\r\n    }\r\n\r\n    to {\r\n        opacity: 1;\r\n        transform: translateY(0);\r\n    }\r\n}\r\n\r\n@keyframes typingBounce {\r\n\r\n    0%,\r\n    100% {\r\n        transform: translateY(0);\r\n        opacity: 0.4;\r\n    }\r\n\r\n    50% {\r\n        transform: translateY(-4px);\r\n        opacity: 1;\r\n    }\r\n}\r\n\r\n@keyframes pulse {\r\n\r\n    0%,\r\n    100% {\r\n        opacity: 0.4;\r\n        transform: scale(0.85);\r\n    }\r\n\r\n    50% {\r\n        opacity: 1;\r\n        transform: scale(1.15);\r\n    }\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* SCROLL FIXES                                                    */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n\r\n/* Chat messages area scrolls */\r\n.chat-messages {\r\n    flex: 1;\r\n    overflow-y: auto !important;\r\n    min-height: 0;\r\n    padding-bottom: 40px;\r\n    scroll-behavior: smooth;\r\n    -webkit-overflow-scrolling: touch;\r\n}\r\n\r\n/* Content-wrapper is a flex container, NOT a scroller */\r\n.content-wrapper {\r\n    flex: 1;\r\n    display: flex;\r\n    flex-direction: column;\r\n    overflow: hidden !important;\r\n    min-height: 0;\r\n}\r\n\r\n/* Ensure parent containers occupy full height but don't scroll themselves */\r\n#agent-mode,\r\n#planning-mode {\r\n    display: none;\r\n    height: 100%;\r\n    overflow: hidden;\r\n    flex-direction: column;\r\n}\r\n\r\n#agent-mode.active,\r\n#planning-mode.active {\r\n    display: flex;\r\n}\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* SCROLLBAR STYLING                                               */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n::-webkit-scrollbar {\r\n    width: 6px;\r\n    height: 6px;\r\n}\r\n\r\n::-webkit-scrollbar-track {\r\n    background: transparent;\r\n}\r\n\r\n::-webkit-scrollbar-thumb {\r\n    background: rgba(0, 0, 0, 0.15);\r\n    border-radius: 4px;\r\n}\r\n\r\n::-webkit-scrollbar-thumb:hover {\r\n    background: rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* PRODUCTION OPTIMIZATIONS (RESPONSIVE & PERFORMANCE)             */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n\r\n/* 1. Hardware Acceleration for Animations (targeted, not global) */\r\n.chat-msg {\r\n    will-change: transform, opacity;\r\n    backface-visibility: hidden;\r\n}\r\n\r\n/* Only apply GPU hints on hover/active states to avoid memory overhead */\r\n.chip:hover,\r\n.suggestion-chip:hover,\r\n.category-tab:hover,\r\n.btn-icon:hover {\r\n    will-change: transform;\r\n}\r\n\r\n/* 2. Responsive Tweaks for Narrow Taskpanes (< 360px) */\r\n@media (max-width: 360px) {\r\n    :root {\r\n        --radius-lg: 10px;\r\n        /* Tighter corners */\r\n    }\r\n\r\n    .app-header {\r\n        padding: 8px 12px;\r\n    }\r\n\r\n    .chat-bubble {\r\n        font-size: 11.5px;\r\n        padding: 8px 12px;\r\n        max-width: 88%;\r\n    }\r\n\r\n    .chip {\r\n        font-size: 10px;\r\n        padding: 5px 9px;\r\n    }\r\n\r\n    .category-tab {\r\n        padding: 5px 9px;\r\n        font-size: 10px;\r\n    }\r\n\r\n    /* Stack form groups tighter */\r\n    .form-group {\r\n        margin-bottom: 10px;\r\n    }\r\n\r\n    /* Ensure code blocks don't overflow */\r\n    .chat-bubble pre {\r\n        font-size: 10px;\r\n        padding: 8px;\r\n    }\r\n}\r\n\r\n/* 3. High-DPI Screens (Retina) Text Sharpness */\r\n@media (-webkit-min-device-pixel-ratio: 2),\r\n(min-resolution: 192dpi) {\r\n    body {\r\n        -webkit-font-smoothing: antialiased;\r\n        -moz-osx-font-smoothing: grayscale;\r\n    }\r\n}\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* ANIMATION ENHANCEMENTS                                          */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n\r\n/* Make transitions smoother */\r\n.chip,\r\n.suggestion-chip,\r\n.category-tab,\r\n.btn-icon,\r\n.btn-primary,\r\n.btn-send {\r\n    transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);\r\n    /* A bit of overshoot */\r\n}\r\n\r\n/* More pronounced hover effect for chips */\r\n.chip:hover,\r\n.suggestion-chip:hover,\r\n.category-tab:hover {\r\n    transform: translateY(-2px);\r\n    box-shadow: var(--shadow-md);\r\n}\r\n\r\n/* Remove the translateX from suggestion-chip to be consistent */\r\n.suggestion-chip:hover {\r\n    transform: translateY(-2px);\r\n}\r\n\r\n/* Add hover effect to icon buttons */\r\n.btn-icon:hover {\r\n    transform: translateY(-2px) scale(1.05);\r\n    box-shadow: var(--shadow-md);\r\n}\r\n\r\n\r\n\r\n@keyframes tabPulse {\r\n    0% {\r\n        box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.15);\r\n    }\r\n\r\n    70% {\r\n        box-shadow: 0 0 0 4px rgba(74, 144, 226, 0);\r\n    }\r\n\r\n    100% {\r\n        box-shadow: 0 0 0 0 rgba(74, 144, 226, 0);\r\n    }\r\n}\r\n\r\n.chat-msg {\r\n    animation: msgSlideIn 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;\r\n}\r\n\r\n/* Better button press feedback */\r\n.btn-primary:active,\r\n.btn-send:active,\r\n.btn-icon:active,\r\n.chip:active,\r\n.suggestion-chip:active,\r\n.category-tab:active {\r\n    transform: scale(0.95) !important;\r\n    /* Use important to override hover transforms */\r\n    transition-duration: 0.1s;\r\n}\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* BUSINESS MODULES                                                */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.modules-grid {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 12px;\r\n    margin-top: 16px;\r\n}\r\n\r\n.module-card {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 16px;\r\n    padding: 16px;\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: var(--radius-lg);\r\n    transition: all 0.2s ease;\r\n}\r\n\r\n.module-card:hover {\r\n    transform: translateY(-2px);\r\n    box-shadow: var(--shadow-md);\r\n    border-color: var(--primary-light);\r\n}\r\n\r\n.module-icon {\r\n    font-size: 24px;\r\n    width: 48px;\r\n    height: 48px;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    background: var(--bg);\r\n    border-radius: 12px;\r\n}\r\n\r\n.module-info {\r\n    flex: 1;\r\n}\r\n\r\n.module-info h3 {\r\n    margin: 0 0 4px;\r\n    font-size: 14px;\r\n    font-weight: 600;\r\n}\r\n\r\n.module-info p {\r\n    margin: 0;\r\n    font-size: 12px;\r\n    color: var(--text-2);\r\n    line-height: 1.4;\r\n}\r\n\r\n.module-preview-area {\r\n    margin-top: 24px;\r\n    padding: 16px;\r\n    background: var(--primary-bg);\r\n    border-radius: var(--radius-lg);\r\n    border: 1px dashed var(--primary);\r\n}\r\n\r\n.badge-gold {\r\n    background: #FFF9E6;\r\n    color: #B28B00;\r\n    border: 1px solid #FFE699;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* TOAST NOTIFICATION SYSTEM                                       */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.toast-container {\r\n    position: fixed;\r\n    bottom: 20px;\r\n    left: 50%;\r\n    transform: translateX(-50%);\r\n    z-index: 10000;\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    gap: 8px;\r\n    pointer-events: none;\r\n}\r\n\r\n.toast {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 8px;\r\n    padding: 10px 16px;\r\n    border-radius: 12px;\r\n    font-size: 12px;\r\n    font-weight: 500;\r\n    font-family: var(--font);\r\n    box-shadow: var(--shadow-lg);\r\n    animation: toastIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);\r\n    pointer-events: auto;\r\n    backdrop-filter: blur(12px);\r\n    -webkit-backdrop-filter: blur(12px);\r\n    max-width: 280px;\r\n}\r\n\r\n.toast.toast-out {\r\n    animation: toastOut 0.3s ease-in forwards;\r\n}\r\n\r\n.toast.toast-success {\r\n    background: rgba(45, 106, 79, 0.92);\r\n    color: white;\r\n    border: 1px solid rgba(82, 183, 136, 0.3);\r\n}\r\n\r\n.toast.toast-error {\r\n    background: rgba(184, 58, 58, 0.92);\r\n    color: white;\r\n    border: 1px solid rgba(224, 96, 96, 0.3);\r\n}\r\n\r\n.toast.toast-info {\r\n    background: rgba(255, 255, 255, 0.92);\r\n    color: var(--text);\r\n    border: 1px solid var(--card-border);\r\n}\r\n\r\n@media (prefers-color-scheme: dark) {\r\n    .toast.toast-info {\r\n        background: rgba(33, 34, 36, 0.92);\r\n        color: var(--text);\r\n        border: 1px solid var(--card-border);\r\n    }\r\n}\r\n\r\n.toast svg {\r\n    width: 14px;\r\n    height: 14px;\r\n    flex-shrink: 0;\r\n}\r\n\r\n@keyframes toastIn {\r\n    from {\r\n        opacity: 0;\r\n        transform: translateY(16px) scale(0.95);\r\n    }\r\n\r\n    to {\r\n        opacity: 1;\r\n        transform: translateY(0) scale(1);\r\n    }\r\n}\r\n\r\n@keyframes toastOut {\r\n    from {\r\n        opacity: 1;\r\n        transform: translateY(0) scale(1);\r\n    }\r\n\r\n    to {\r\n        opacity: 0;\r\n        transform: translateY(10px) scale(0.95);\r\n    }\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* COPY-TO-CLIPBOARD BUTTON (AI Bubble)                            */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.chat-bubble-actions {\r\n    display: flex;\r\n    gap: 4px;\r\n    margin-top: 8px;\r\n    opacity: 0;\r\n    transition: opacity 0.2s ease;\r\n}\r\n\r\n.chat-msg.ai:hover .chat-bubble-actions {\r\n    opacity: 1;\r\n}\r\n\r\n.btn-copy {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    gap: 4px;\r\n    padding: 3px 8px;\r\n    font-size: 10px;\r\n    font-weight: 500;\r\n    font-family: var(--font);\r\n    color: var(--text-3);\r\n    background: var(--input-bg);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 6px;\r\n    cursor: pointer;\r\n    transition: all 0.2s ease;\r\n}\r\n\r\n.btn-copy:hover {\r\n    color: var(--primary);\r\n    border-color: var(--primary-glow);\r\n    background: var(--primary-bg);\r\n}\r\n\r\n.btn-copy.copied {\r\n    color: var(--success);\r\n    border-color: rgba(45, 106, 79, 0.2);\r\n    background: var(--success-bg);\r\n}\r\n\r\n.btn-copy svg {\r\n    width: 11px;\r\n    height: 11px;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* SMOOTH MODE CROSSFADE                                           */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.mode-content {\r\n    animation: modeFadeIn 0.3s ease-out;\r\n}\r\n\r\n@keyframes modeFadeIn {\r\n    from {\r\n        opacity: 0;\r\n        transform: translateY(4px);\r\n    }\r\n\r\n    to {\r\n        opacity: 1;\r\n        transform: translateY(0);\r\n    }\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* SCROLL-TO-BOTTOM FAB                                            */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.scroll-to-bottom {\r\n    position: absolute;\r\n    bottom: 80px;\r\n    right: 18px;\r\n    width: 32px;\r\n    height: 32px;\r\n    border-radius: 50%;\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    color: var(--text-2);\r\n    cursor: pointer;\r\n    display: none;\r\n    align-items: center;\r\n    justify-content: center;\r\n    box-shadow: var(--shadow-md);\r\n    z-index: 10;\r\n    transition: all 0.2s ease;\r\n    animation: fadeIn 0.2s ease-out;\r\n}\r\n\r\n.scroll-to-bottom:hover {\r\n    background: var(--primary-bg);\r\n    color: var(--primary);\r\n    border-color: var(--primary-glow);\r\n    transform: translateY(-2px);\r\n}\r\n\r\n.scroll-to-bottom.visible {\r\n    display: flex;\r\n}\r\n\r\n.scroll-to-bottom svg {\r\n    width: 16px;\r\n    height: 16px;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* CHARACTER COUNT INDICATOR                                       */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.char-count {\r\n    font-size: 10px;\r\n    color: var(--text-4);\r\n    font-weight: 500;\r\n    font-variant-numeric: tabular-nums;\r\n    transition: color 0.2s ease;\r\n    min-width: 28px;\r\n    text-align: right;\r\n}\r\n\r\n.char-count.warning {\r\n    color: var(--warning);\r\n}\r\n\r\n.char-count.danger {\r\n    color: var(--error);\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* KEYBOARD SHORTCUT BADGE                                         */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.kbd-hint {\r\n    font-size: 9px;\r\n    font-weight: 500;\r\n    color: var(--text-4);\r\n    background: var(--input-bg);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 4px;\r\n    padding: 1px 5px;\r\n    font-family: var(--mono);\r\n    letter-spacing: 0.02em;\r\n    pointer-events: none;\r\n    white-space: nowrap;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* STAGGERED SUGGESTION ANIMATION                                  */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.suggestion-chip:nth-child(1) {\r\n    animation-delay: 0.05s;\r\n}\r\n\r\n.suggestion-chip:nth-child(2) {\r\n    animation-delay: 0.1s;\r\n}\r\n\r\n.suggestion-chip:nth-child(3) {\r\n    animation-delay: 0.15s;\r\n}\r\n\r\n.suggestion-chip:nth-child(4) {\r\n    animation-delay: 0.2s;\r\n}\r\n\r\n.suggestion-chip {\r\n    animation: msgSlideIn 0.4s cubic-bezier(0.19, 1, 0.22, 1) both;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* ENHANCED INPUT FOCUS GLOW                                       */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.input-card:focus-within,\r\n.chat-input-card:focus-within {\r\n    border-color: var(--primary);\r\n    box-shadow: 0 0 0 3px var(--primary-glow), var(--shadow-md);\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* SETTINGS SAVE SUCCESS ANIMATION                                 */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.btn-save.saved {\r\n    background: var(--success);\r\n    box-shadow: 0 2px 8px rgba(45, 106, 79, 0.3);\r\n}\r\n\r\n@keyframes successPop {\r\n    0% {\r\n        transform: scale(1);\r\n    }\r\n\r\n    50% {\r\n        transform: scale(1.05);\r\n    }\r\n\r\n    100% {\r\n        transform: scale(1);\r\n    }\r\n}\r\n\r\n.btn-save.saved {\r\n    animation: successPop 0.3s ease;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* CHAT WELCOME STAGGER                                            */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.chat-welcome img {\r\n    animation: fadeIn 0.5s ease-out both;\r\n    animation-delay: 0.1s;\r\n}\r\n\r\n.chat-welcome h2 {\r\n    animation: fadeIn 0.5s ease-out both;\r\n    animation-delay: 0.2s;\r\n}\r\n\r\n.chat-welcome .welcome-suggestions {\r\n    animation: fadeIn 0.5s ease-out both;\r\n    animation-delay: 0.3s;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* RIPPLE EFFECT ON BUTTONS                                        */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.btn-primary,\r\n.btn-send,\r\n.chip,\r\n.category-tab {\r\n    position: relative;\r\n    overflow: hidden;\r\n}\r\n\r\n.btn-primary::after,\r\n.btn-send::after {\r\n    content: '';\r\n    position: absolute;\r\n    inset: 0;\r\n    background: radial-gradient(circle at var(--ripple-x, 50%) var(--ripple-y, 50%), rgba(255, 255, 255, 0.25) 0%, transparent 60%);\r\n    opacity: 0;\r\n    transition: opacity 0.4s ease;\r\n    pointer-events: none;\r\n}\r\n\r\n.btn-primary:active::after,\r\n.btn-send:active::after {\r\n    opacity: 1;\r\n    transition: opacity 0s;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* IMPROVED DARK MODE SCROLLBAR                                    */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n@media (prefers-color-scheme: dark) {\r\n    ::-webkit-scrollbar-thumb {\r\n        background: rgba(255, 255, 255, 0.12);\r\n    }\r\n\r\n    ::-webkit-scrollbar-thumb:hover {\r\n        background: rgba(255, 255, 255, 0.22);\r\n    }\r\n}\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* BATCH PDF EXTRACTION PANEL                                      */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.batch-panel {\r\n    margin: 10px 14px;\r\n    padding: 14px;\r\n    background: var(--card);\r\n    border: 1.5px solid var(--primary-glow);\r\n    border-radius: var(--radius-lg);\r\n    box-shadow: var(--shadow-md);\r\n    animation: slideDown 0.22s ease-out;\r\n}\r\n\r\n.batch-panel-header {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.batch-panel-title {\r\n    font-size: 12px;\r\n    font-weight: 700;\r\n    color: var(--primary);\r\n    letter-spacing: -0.01em;\r\n}\r\n\r\n.batch-file-count {\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    color: var(--text-3);\r\n    background: var(--primary-bg);\r\n    padding: 2px 8px;\r\n    border-radius: 20px;\r\n}\r\n\r\n.batch-instruction {\r\n    width: 100%;\r\n    padding: 9px 11px;\r\n    font-size: 12.5px;\r\n    font-family: var(--font);\r\n    color: var(--text);\r\n    background: var(--input-bg);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: var(--radius);\r\n    outline: none;\r\n    resize: none;\r\n    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;\r\n    margin-bottom: 10px;\r\n    line-height: 1.5;\r\n}\r\n\r\n.batch-instruction:focus {\r\n    border-color: var(--primary);\r\n    box-shadow: 0 0 0 3px var(--primary-glow);\r\n}\r\n\r\n.btn-batch-extract {\r\n    width: 100%;\r\n    justify-content: center;\r\n    gap: 7px;\r\n    font-size: 13px;\r\n    padding: 10px;\r\n    background: var(--primary);\r\n    color: white;\r\n    border: none;\r\n    border-radius: var(--radius);\r\n    cursor: pointer;\r\n    font-weight: 600;\r\n    font-family: var(--font);\r\n    display: flex;\r\n    align-items: center;\r\n    transition: all 0.2s ease-out;\r\n    box-shadow: 0 3px 10px rgba(45, 106, 79, 0.3);\r\n}\r\n\r\n.btn-batch-extract:hover {\r\n    background: var(--primary-hover);\r\n    transform: translateY(-1px);\r\n    box-shadow: 0 5px 16px rgba(45, 106, 79, 0.38);\r\n}\r\n\r\n.btn-batch-extract:disabled {\r\n    opacity: 0.55;\r\n    cursor: not-allowed;\r\n    transform: none;\r\n}\r\n\r\n.batch-progress-wrap {\r\n    margin-top: 12px;\r\n}\r\n\r\n.batch-progress-bar-track {\r\n    height: 6px;\r\n    background: var(--input-bg);\r\n    border-radius: 99px;\r\n    overflow: hidden;\r\n}\r\n\r\n.batch-progress-bar {\r\n    height: 100%;\r\n    background: linear-gradient(90deg, var(--primary), var(--primary-light));\r\n    border-radius: 99px;\r\n    transition: width 0.4s ease-out;\r\n    position: relative;\r\n    overflow: hidden;\r\n}\r\n\r\n.batch-progress-bar::after {\r\n    content: '';\r\n    position: absolute;\r\n    top: 0;\r\n    left: -60%;\r\n    width: 60%;\r\n    height: 100%;\r\n    background: rgba(255, 255, 255, 0.3);\r\n    animation: shimmerSlide 1.2s linear infinite;\r\n}\r\n\r\n@keyframes shimmerSlide {\r\n    to {\r\n        left: 160%;\r\n    }\r\n}\r\n\r\n.batch-progress-label {\r\n    font-size: 11px;\r\n    color: var(--text-3);\r\n    text-align: right;\r\n    margin-top: 4px;\r\n    font-weight: 600;\r\n}\r\n\r\n.batch-log {\r\n    margin-top: 10px;\r\n    max-height: 100px;\r\n    overflow-y: auto;\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 3px;\r\n}\r\n\r\n.batch-log-entry {\r\n    font-size: 11px;\r\n    font-family: var(--mono);\r\n    color: var(--text-2);\r\n    padding: 2px 6px;\r\n    border-radius: 4px;\r\n    display: flex;\r\n    gap: 6px;\r\n    align-items: center;\r\n}\r\n\r\n.batch-log-entry.success {\r\n    color: var(--success);\r\n    background: var(--success-bg);\r\n}\r\n\r\n.batch-log-entry.error {\r\n    color: var(--error);\r\n    background: var(--error-bg);\r\n}\r\n\r\n.batch-log-entry.info {\r\n    color: var(--text-3);\r\n    background: var(--input-bg);\r\n}\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* AI EDITING ANIMATION & DIFF VIEW                                */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n\r\n/* ── Live Editing Overlay ── */\r\n.ai-editing-overlay {\r\n    display: none;\r\n    flex-direction: column;\r\n    gap: 0;\r\n    border-radius: var(--radius-lg);\r\n    overflow: hidden;\r\n    border: 1px solid var(--primary-glow);\r\n    background: var(--card);\r\n    box-shadow: 0 0 0 1px var(--primary-glow), var(--shadow-md);\r\n    animation: overlayAppear 0.35s cubic-bezier(0.16, 1, 0.3, 1);\r\n}\r\n\r\n.ai-editing-overlay.active {\r\n    display: flex;\r\n}\r\n\r\n@keyframes overlayAppear {\r\n    from { opacity: 0; transform: translateY(6px) scale(0.98); }\r\n    to   { opacity: 1; transform: translateY(0) scale(1); }\r\n}\r\n\r\n/* Header bar */\r\n.ai-edit-header {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 8px;\r\n    padding: 10px 14px;\r\n    background: linear-gradient(135deg, var(--primary-bg), transparent);\r\n    border-bottom: 1px solid var(--card-border);\r\n}\r\n\r\n.ai-edit-header .pulse-dot {\r\n    width: 8px;\r\n    height: 8px;\r\n    border-radius: 50%;\r\n    background: var(--primary);\r\n    animation: pulseDot 1.4s ease-in-out infinite;\r\n    flex-shrink: 0;\r\n}\r\n\r\n@keyframes pulseDot {\r\n    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 var(--primary); }\r\n    50%      { opacity: 0.6; box-shadow: 0 0 0 6px transparent; }\r\n}\r\n\r\n.ai-edit-header .edit-label {\r\n    font-size: 12px;\r\n    font-weight: 600;\r\n    color: var(--primary);\r\n    letter-spacing: 0.3px;\r\n}\r\n\r\n.ai-edit-header .edit-phase {\r\n    font-size: 11px;\r\n    color: var(--text-3);\r\n    margin-left: auto;\r\n    font-weight: 500;\r\n}\r\n\r\n/* Fake code lines area */\r\n.ai-edit-lines {\r\n    padding: 10px 0;\r\n    max-height: 180px;\r\n    overflow: hidden;\r\n    position: relative;\r\n    background: var(--input-bg);\r\n}\r\n\r\n.ai-edit-lines::after {\r\n    content: '';\r\n    position: absolute;\r\n    bottom: 0;\r\n    left: 0;\r\n    right: 0;\r\n    height: 40px;\r\n    background: linear-gradient(transparent, var(--input-bg));\r\n    pointer-events: none;\r\n}\r\n\r\n.ai-edit-line {\r\n    display: flex;\r\n    align-items: center;\r\n    padding: 1px 12px 1px 0;\r\n    font-family: var(--mono);\r\n    font-size: 11px;\r\n    line-height: 20px;\r\n    opacity: 0;\r\n    transform: translateY(6px);\r\n    animation: lineAppear 0.3s ease forwards;\r\n}\r\n\r\n.ai-edit-line .line-gutter {\r\n    width: 36px;\r\n    text-align: right;\r\n    padding-right: 10px;\r\n    color: var(--text-4);\r\n    font-size: 10px;\r\n    flex-shrink: 0;\r\n    user-select: none;\r\n}\r\n\r\n.ai-edit-line .line-content {\r\n    flex: 1;\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n}\r\n\r\n.ai-edit-line.added {\r\n    background: rgba(45, 106, 79, 0.08);\r\n}\r\n\r\n.ai-edit-line.added .line-gutter {\r\n    color: var(--primary);\r\n    font-weight: 600;\r\n}\r\n\r\n.ai-edit-line.added .line-content {\r\n    color: var(--primary);\r\n}\r\n\r\n.ai-edit-line.removed {\r\n    background: rgba(184, 58, 58, 0.07);\r\n}\r\n\r\n.ai-edit-line.removed .line-gutter {\r\n    color: var(--error);\r\n    font-weight: 600;\r\n}\r\n\r\n.ai-edit-line.removed .line-content {\r\n    color: var(--error);\r\n    text-decoration: line-through;\r\n    opacity: 0.7;\r\n}\r\n\r\n.ai-edit-line.context .line-content {\r\n    color: var(--text-3);\r\n}\r\n\r\n@keyframes lineAppear {\r\n    to { opacity: 1; transform: translateY(0); }\r\n}\r\n\r\n/* Typing cursor */\r\n.ai-edit-line .typing-cursor {\r\n    display: inline-block;\r\n    width: 2px;\r\n    height: 14px;\r\n    background: var(--primary);\r\n    margin-left: 2px;\r\n    vertical-align: middle;\r\n    animation: blink 0.5s step-end infinite;\r\n    border-radius: 1px;\r\n}\r\n\r\n@keyframes blink {\r\n    50% { opacity: 0; }\r\n}\r\n\r\n/* Progress bar at bottom of overlay */\r\n.ai-edit-progress {\r\n    height: 3px;\r\n    background: var(--input-bg);\r\n    position: relative;\r\n    overflow: hidden;\r\n}\r\n\r\n.ai-edit-progress .bar {\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    height: 100%;\r\n    width: 0%;\r\n    background: linear-gradient(90deg, var(--primary), var(--primary-light));\r\n    border-radius: 0 2px 2px 0;\r\n    transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);\r\n}\r\n\r\n.ai-edit-progress .shimmer {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    height: 100%;\r\n    background: linear-gradient(\r\n        90deg,\r\n        transparent,\r\n        rgba(255, 255, 255, 0.3),\r\n        transparent\r\n    );\r\n    animation: progressShimmer 1.8s ease-in-out infinite;\r\n}\r\n\r\n@keyframes progressShimmer {\r\n    0%   { transform: translateX(-100%); }\r\n    100% { transform: translateX(200%); }\r\n}\r\n\r\n/* ── Diff View (after execution) ── */\r\n.ai-diff-view {\r\n    display: none;\r\n    flex-direction: column;\r\n    border-radius: var(--radius-lg);\r\n    overflow: hidden;\r\n    border: 1px solid var(--card-border);\r\n    background: var(--card);\r\n    box-shadow: var(--shadow);\r\n    animation: diffAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1);\r\n}\r\n\r\n.ai-diff-view.active {\r\n    display: flex;\r\n}\r\n\r\n@keyframes diffAppear {\r\n    from { opacity: 0; transform: translateY(8px); }\r\n    to   { opacity: 1; transform: translateY(0); }\r\n}\r\n\r\n.ai-diff-header {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    padding: 8px 12px;\r\n    border-bottom: 1px solid var(--card-border);\r\n    background: var(--input-bg);\r\n}\r\n\r\n.ai-diff-title {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 6px;\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    color: var(--text-2);\r\n}\r\n\r\n.ai-diff-title svg {\r\n    color: var(--primary);\r\n}\r\n\r\n.ai-diff-stats {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 10px;\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    font-family: var(--mono);\r\n}\r\n\r\n.ai-diff-stats .stat-added {\r\n    color: var(--success);\r\n}\r\n\r\n.ai-diff-stats .stat-removed {\r\n    color: var(--error);\r\n}\r\n\r\n.ai-diff-body {\r\n    max-height: 220px;\r\n    overflow-y: auto;\r\n    overflow-x: hidden;\r\n    padding: 6px 0;\r\n    scrollbar-width: thin;\r\n}\r\n\r\n.diff-line {\r\n    display: flex;\r\n    align-items: stretch;\r\n    font-family: var(--mono);\r\n    font-size: 11px;\r\n    line-height: 20px;\r\n    padding: 0;\r\n    animation: diffLineIn 0.25s ease forwards;\r\n    opacity: 0;\r\n}\r\n\r\n@keyframes diffLineIn {\r\n    from { opacity: 0; }\r\n    to   { opacity: 1; }\r\n}\r\n\r\n.diff-line .diff-gutter {\r\n    width: 26px;\r\n    text-align: center;\r\n    padding: 0 2px;\r\n    flex-shrink: 0;\r\n    font-size: 11px;\r\n    font-weight: 700;\r\n    user-select: none;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n.diff-line .diff-text {\r\n    flex: 1;\r\n    padding: 0 10px;\r\n    white-space: pre;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n}\r\n\r\n/* Added lines */\r\n.diff-line.diff-added {\r\n    background: rgba(45, 106, 79, 0.06);\r\n}\r\n\r\n.diff-line.diff-added .diff-gutter {\r\n    background: rgba(45, 106, 79, 0.12);\r\n    color: var(--success);\r\n}\r\n\r\n.diff-line.diff-added .diff-text {\r\n    color: var(--text);\r\n}\r\n\r\n.diff-line.diff-added .diff-text .diff-highlight {\r\n    background: rgba(45, 106, 79, 0.15);\r\n    border-radius: 2px;\r\n    padding: 0 1px;\r\n}\r\n\r\n/* Removed lines */\r\n.diff-line.diff-removed {\r\n    background: rgba(184, 58, 58, 0.05);\r\n}\r\n\r\n.diff-line.diff-removed .diff-gutter {\r\n    background: rgba(184, 58, 58, 0.1);\r\n    color: var(--error);\r\n}\r\n\r\n.diff-line.diff-removed .diff-text {\r\n    color: var(--text-3);\r\n    text-decoration: line-through;\r\n}\r\n\r\n/* Context lines */\r\n.diff-line.diff-context .diff-gutter {\r\n    color: var(--text-4);\r\n}\r\n\r\n.diff-line.diff-context .diff-text {\r\n    color: var(--text-3);\r\n}\r\n\r\n/* Separator */\r\n.diff-separator {\r\n    padding: 3px 12px;\r\n    font-size: 10px;\r\n    color: var(--text-4);\r\n    font-family: var(--mono);\r\n    background: var(--input-bg);\r\n    border-top: 1px dashed var(--card-border);\r\n    border-bottom: 1px dashed var(--card-border);\r\n    text-align: center;\r\n    user-select: none;\r\n}\r\n\r\n/* Dismiss button */\r\n.ai-diff-dismiss {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    padding: 6px;\r\n    border-top: 1px solid var(--card-border);\r\n    background: var(--input-bg);\r\n    cursor: pointer;\r\n    transition: background 0.15s;\r\n}\r\n\r\n.ai-diff-dismiss:hover {\r\n    background: var(--card-hover);\r\n}\r\n\r\n.ai-diff-dismiss span {\r\n    font-size: 11px;\r\n    color: var(--text-3);\r\n    font-weight: 500;\r\n}\r\n\r\n/* Dark mode adjustments for diff */\r\n@media (prefers-color-scheme: dark) {\r\n    .diff-line.diff-added {\r\n        background: rgba(82, 183, 136, 0.08);\r\n    }\r\n    .diff-line.diff-added .diff-gutter {\r\n        background: rgba(82, 183, 136, 0.15);\r\n    }\r\n    .diff-line.diff-added .diff-text .diff-highlight {\r\n        background: rgba(82, 183, 136, 0.18);\r\n    }\r\n    .diff-line.diff-removed {\r\n        background: rgba(224, 96, 96, 0.08);\r\n    }\r\n    .diff-line.diff-removed .diff-gutter {\r\n        background: rgba(224, 96, 96, 0.12);\r\n    }\r\n    .ai-edit-line.added {\r\n        background: rgba(82, 183, 136, 0.1);\r\n    }\r\n    .ai-edit-line.removed {\r\n        background: rgba(224, 96, 96, 0.1);\r\n    }\r\n}", "",{"version":3,"sources":["webpack://./src/taskpane/taskpane.css"],"names":[],"mappings":"AAAA;;;;EAIE;;AAEF;IACI,2BAA2B;IAC3B,aAAa;IACb,kEAAkE;IAClE,kBAAkB;IAClB,eAAe;IACf,sBAAsB;IACtB,qBAAqB;IACrB,mBAAmB;;IAEnB,gCAAgC;IAChC,kBAAkB;IAClB,wBAAwB;IACxB,wBAAwB;IACxB,qCAAqC;IACrC,uCAAuC;;IAEvC,6BAA6B;IAC7B,iBAAiB;IACjB,uBAAuB;IACvB,oCAAoC;;IAEpC,eAAe;IACf,eAAe;IACf,iBAAiB;IACjB,iBAAiB;IACjB,iBAAiB;;IAEjB,mBAAmB;IACnB,kBAAkB;IAClB,qCAAqC;IACrC,gBAAgB;IAChB,mCAAmC;IACnC,kBAAkB;IAClB,sCAAsC;;IAEtC,gBAAgB;IAChB,cAAc;IACd,iBAAiB;IACjB,iBAAiB;;IAEjB,sCAAsC;IACtC,6CAA6C;IAC7C,4EAA4E;IAC5E,gFAAgF;IAChF,gFAAgF;;IAEhF,qBAAqB;IACrB,qFAAqF;IACrF,6DAA6D;;IAE7D,eAAe;IACf,8BAA8B;IAC9B,yBAAyB;IACzB,qBAAqB;IACrB,qCAAqC;IACrC,2BAA2B;;IAE3B,gBAAgB;IAChB,oCAAoC;IACpC,wCAAwC;IACxC,YAAY;AAChB;;AAEA,oBAAoB;AACpB;IACI;QACI,aAAa;QACb,kEAAkE;QAClE,kBAAkB;QAClB,eAAe;QACf,sBAAsB;QACtB,qBAAqB;QACrB,mBAAmB;;QAEnB,kBAAkB;QAClB,wBAAwB;QACxB,wBAAwB;QACxB,sCAAsC;QACtC,wCAAwC;;QAExC,iBAAiB;QACjB,uBAAuB;QACvB,qCAAqC;;QAErC,eAAe;QACf,iBAAiB;QACjB,iBAAiB;QACjB,iBAAiB;;QAEjB,kBAAkB;QAClB,sCAAsC;QACtC,gBAAgB;QAChB,mCAAmC;QACnC,kBAAkB;QAClB,sCAAsC;;QAEtC,0CAA0C;QAC1C,uCAAuC;QACvC,2CAA2C;QAC3C,2CAA2C;;QAE3C,8BAA8B;QAC9B,yBAAyB;QACzB,qBAAqB;QACrB,2CAA2C;QAC3C,2BAA2B;;QAE3B,kCAAkC;QAClC,yCAAyC;IAC7C;AACJ;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;;;IAGI,sBAAsB;AAC1B;;AAEA;;IAEI,WAAW;IACX,YAAY;IACZ,SAAS;IACT,UAAU;IACV,wBAAwB;IACxB,eAAe;IACf,iBAAiB;IACjB,8BAA8B;IAC9B,kBAAkB;IAClB,mCAAmC;IACnC,kCAAkC;IAClC,kBAAkB;AACtB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,aAAa;IACb,gBAAgB;AACpB;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,aAAa;IACb,mBAAmB;IACnB,8BAA8B;IAC9B,kBAAkB;IAClB,2BAA2B;IAC3B,kCAAkC;IAClC,0CAA0C;IAC1C,4CAA4C;IAC5C,gBAAgB;IAChB,MAAM;IACN,YAAY;AAChB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,QAAQ;AACZ;;AAEA;IACI,qBAAqB;IACrB,aAAa;IACb,mBAAmB;AACvB;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,SAAS;IACT,wBAAwB;IACxB,kBAAkB;AACtB;;AAEA;IACI,qBAAqB;IACrB,gBAAgB;IAChB,oDAAoD;AACxD;;AAEA;IACI,aAAa;IACb,QAAQ;AACZ;;;AAGA,uBAAuB;AACvB,qBAAqB;AACrB;IACI,WAAW;IACX,YAAY;IACZ,oCAAoC;IACpC,mBAAmB;IACnB,uBAAuB;IACvB,oBAAoB;IACpB,eAAe;IACf,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,4DAA4D;IAC5D,UAAU;IACV,4BAA4B;AAChC;;AAEA;IACI,qBAAqB;IACrB,kCAAkC;IAClC,6BAA6B;IAC7B,2BAA2B;IAC3B,yBAAyB;AAC7B;;AAEA;IACI,sBAAsB;AAC1B;;;;AAIA,qCAAqC;AACrC;IACI,aAAa;IACb,uBAAuB;IACvB,2CAA2C;IAC3C,mCAAmC;IACnC,gBAAgB;IAChB,gBAAgB;IAChB,4BAA4B;AAChC;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,mBAAmB;IACnB,yBAAyB;IACzB,sBAAsB;IACtB,oBAAoB;IACpB,gBAAgB;AACpB;;;AAGA,oBAAoB;AACpB;IACI,aAAa;IACb,sBAAsB;IACtB,QAAQ;AACZ;;AAEA;IACI,aAAa;IACb,SAAS;IACT,uBAAuB;IACvB,cAAc;AAClB;;AAEA;IACI,cAAc;IACd,WAAW;IACX,YAAY;IACZ,qBAAqB;IACrB,aAAa;IACb,mBAAmB;IACnB,eAAe;AACnB;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,kBAAkB;IAClB,cAAc;IACd,kBAAkB;AACtB;;AAEA;IACI,eAAe;IACf,oBAAoB;IACpB,SAAS;IACT,iBAAiB;AACrB;;AAEA;IACI,eAAe;IACf,oBAAoB;IACpB,gBAAgB;IAChB,kBAAkB;IAClB,gBAAgB;AACpB;;;AAGA,gBAAgB;AAChB;IACI,mBAAmB;AACvB;;AAEA;IACI,cAAc;IACd,eAAe;IACf,gBAAgB;IAChB,oBAAoB;IACpB,kBAAkB;IAClB,yBAAyB;IACzB,sBAAsB;AAC1B;;AAEA;IACI,WAAW;IACX,iBAAiB;IACjB,eAAe;IACf,wBAAwB;IACxB,kBAAkB;IAClB,2BAA2B;IAC3B,oCAAoC;IACpC,kBAAkB;IAClB,aAAa;IACb,gEAAgE;AACpE;;AAEA;IACI,4BAA4B;IAC5B,yCAAyC;AAC7C;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,yDAAoO;IACpO,4BAA4B;IAC5B,sCAAsC;IACtC,mBAAmB;AACvB;;AAEA;IACI,WAAW;IACX,uBAAuB;IACvB,eAAe;AACnB;;AAEA,uBAAuB;AACvB;IACI,aAAa;IACb,QAAQ;IACR,mBAAmB;AACvB;;AAEA;IACI,OAAO;IACP,YAAY;AAChB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,cAAc;IACd,UAAU;AACd;;AAEA;IACI,eAAe;IACf,eAAe;IACf,gBAAgB;IAChB,oBAAoB;AACxB;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,mBAAmB;AACvB;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,aAAa;IACb,mBAAmB;IACnB,YAAY;IACZ,iBAAiB;IACjB,uBAAuB;IACvB,oCAAoC;IACpC,mBAAmB;IACnB,kBAAkB;IAClB,QAAQ;IACR,4BAA4B;AAChC;;AAEA;IACI,OAAO;IACP,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,QAAQ;IACR,aAAa;IACb,eAAe;IACf,gBAAgB;IAChB,wBAAwB;IACxB,oBAAoB;IACpB,uBAAuB;IACvB,YAAY;IACZ,eAAe;IACf,yBAAyB;IACzB,kBAAkB;IAClB,UAAU;AACd;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,kBAAkB;IAClB,SAAS;IACT,QAAQ;IACR,sBAAsB;IACtB,yBAAyB;IACzB,6BAA6B;IAC7B,mBAAmB;IACnB,yDAAyD;IACzD,UAAU;AACd;;AAEA;IACI,uCAAuC;AAC3C;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,aAAa;IACb,sBAAsB;IACtB,OAAO;IACP,gBAAgB;IAChB,+BAA+B;AACnC;;AAEA;IACI,aAAa;AACjB;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;;AAEpE,kCAAkC;AAClC;IACI,OAAO;IACP,gBAAgB;IAChB,sBAAsB;IACtB,aAAa;IACb,sBAAsB;IACtB,SAAS;IACT,uBAAuB;AAC3B;;;AAGA,yBAAyB;AACzB;IACI,kBAAkB;IAClB,uBAAuB;IACvB,gCAAgC;AACpC;;AAEA;IACI,oBAAoB;IACpB,mBAAmB;IACnB,uBAAuB;IACvB,WAAW;IACX,YAAY;IACZ,0BAA0B;IAC1B,mBAAmB;IACnB,YAAY;IACZ,mBAAmB;IACnB,6CAA6C;AACjD;;AAEA;IACI,WAAW;IACX,YAAY;AAChB;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,eAAe;IACf,kBAAkB;IAClB,uBAAuB;AAC3B;;AAEA;IACI,iBAAiB;IACjB,oBAAoB;IACpB,gBAAgB;IAChB,iBAAiB;IACjB,gBAAgB;IAChB,iBAAiB;IACjB,kBAAkB;AACtB;;;AAGA,2BAA2B;AAC3B;IACI,aAAa;IACb,sBAAsB;IACtB,QAAQ;IACR,gBAAgB;IAChB,cAAc;AAClB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,QAAQ;IACR,kBAAkB;IAClB,uBAAuB;IACvB,oCAAoC;IACpC,4BAA4B;IAC5B,iBAAiB;IACjB,oBAAoB;IACpB,eAAe;IACf,8BAA8B;IAC9B,gBAAgB;IAChB,wBAAwB;IACxB,gBAAgB;AACpB;;AAEA;IACI,4BAA4B;IAC5B,qBAAqB;IACrB,6BAA6B;IAC7B,0BAA0B;AAC9B;;AAEA;IACI,cAAc;IACd,qBAAqB;IACrB,YAAY;AAChB;;AAEA;IACI,UAAU;AACd;;;AAGA,+BAA+B;AAC/B;IACI,aAAa;IACb,MAAM;IACN,mBAAmB;IACnB,0DAA0D;IAC1D,eAAe;AACnB;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,kBAAkB;IAClB,mBAAmB;IACnB,eAAe;IACf,gBAAgB;IAChB,cAAc;IACd,qBAAqB;IACrB,yBAAyB;IACzB,4BAA4B;IAC5B,+BAA+B;AACnC;;AAEA;IACI,cAAc;AAClB;;AAEA;IACI,0BAA0B;IAC1B,YAAY;IACZ,+BAA+B;IAC/B,iBAAiB;AACrB;;AAEA;IACI,uBAAuB;IACvB,oBAAoB;IACpB,oCAAoC;IACpC,8BAA8B;IAC9B,gBAAgB;AACpB;;;AAGA,8BAA8B;AAC9B;IACI,gBAAgB;AACpB;;AAEA;IACI,kBAAkB;IAClB,YAAY;AAChB;;AAEA;IACI,wBAAwB;IACxB,eAAe;IACf,gBAAgB;IAChB,kBAAkB;IAClB,+BAA+B;AACnC;;AAEA;IACI,qCAAqC;AACzC;;AAEA;;IAEI,aAAa;IACb,kBAAkB;AACtB;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,eAAe;AACnB;;AAEA;IACI,SAAS;IACT,eAAe;AACnB;;AAEA;IACI,SAAS;AACb;;AAEA;;;IAGI,kBAAkB;IAClB,gBAAgB;IAChB,gBAAgB;AACpB;;AAEA;IACI,iBAAiB;IACjB,sCAAsC;IACtC,mBAAmB;AACvB;;AAEA;IACI,iBAAiB;AACrB;;AAEA;IACI,iBAAiB;IACjB,oBAAoB;AACxB;;AAEA,mCAAmC;AACnC;IACI,WAAW;IACX,yBAAyB;IACzB,cAAc;IACd,eAAe;IACf,0BAA0B;IAC1B,kBAAkB;IAClB,gBAAgB;IAChB,cAAc;IACd,gBAAgB;AACpB;;AAEA;;IAEI,iBAAiB;IACjB,+BAA+B;IAC/B,gBAAgB;AACpB;;AAEA;IACI,4BAA4B;IAC5B,gBAAgB;IAChB,qBAAqB;AACzB;;AAEA;IACI,+BAA+B;AACnC;;AAEA,wBAAwB;AACxB;IACI,cAAc;IACd,eAAe;IACf,gBAAgB;IAChB,eAAe;IACf,gBAAgB;IAChB,gCAAgC;IAChC,qCAAqC;IACrC,kBAAkB;IAClB,qBAAqB;AACzB;;AAEA;IACI,oBAAoB;IACpB,6BAA6B;AACjC;;;AAGA,4BAA4B;AAC5B;IACI,aAAa;IACb,QAAQ;IACR,gBAAgB;AACpB;;AAEA;IACI,oBAAoB;IACpB,mBAAmB;IACnB,QAAQ;IACR,iBAAiB;IACjB,iBAAiB;IACjB,gBAAgB;IAChB,wBAAwB;IACxB,6BAA6B;IAC7B,qBAAqB;IACrB,qCAAqC;IACrC,kBAAkB;IAClB,eAAe;IACf,6BAA6B;AACjC;;AAEA;IACI,0BAA0B;IAC1B,YAAY;IACZ,6CAA6C;AACjD;;;AAGA,2BAA2B;AAC3B;IACI,aAAa;IACb,QAAQ;IACR,mBAAmB;IACnB,cAAc;AAClB;;AAEA;IACI,UAAU;IACV,WAAW;IACX,yBAAyB;IACzB,kBAAkB;IAClB,iDAAiD;AACrD;;AAEA;IACI,sBAAsB;AAC1B;;AAEA;IACI,qBAAqB;AACzB;;;AAGA,0BAA0B;AAC1B;IACI,uBAAuB;IACvB,2BAA2B;IAC3B,kCAAkC;IAClC,0CAA0C;IAC1C,yCAAyC;AAC7C;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,SAAS;IACT,uBAAuB;IACvB,oCAAoC;IACpC,+BAA+B;IAC/B,yBAAyB;IACzB,iDAAiD;IACjD,4BAA4B;AAChC;;AAEA;IACI,4BAA4B;IAC5B,0CAA0C;IAC1C,2BAA2B;AAC/B;;AAEA;IACI,OAAO;IACP,YAAY;IACZ,uBAAuB;IACvB,wBAAwB;IACxB,eAAe;IACf,gBAAgB;IAChB,cAAc;IACd,oBAAoB;IACpB,YAAY;IACZ,aAAa;IACb,iBAAiB;IACjB,gBAAgB;AACpB;;AAEA,wBAAwB;AACxB;IACI,aAAa;IACb,8BAA8B;IAC9B,mBAAmB;IACnB,gBAAgB;AACpB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,QAAQ;AACZ;;AAEA,gCAAgC;AAChC;IACI,gBAAgB;IAChB,YAAY;IACZ,oBAAoB;IACpB,eAAe;IACf,YAAY;IACZ,kBAAkB;IAClB,oBAAoB;IACpB,mBAAmB;IACnB,uBAAuB;IACvB,oBAAoB;AACxB;;AAEA;IACI,gCAAgC;IAChC,qBAAqB;AACzB;;AAEA;IACI,4BAA4B;IAC5B,+BAA+B;IAC/B,kBAAkB;IAClB,iBAAiB;IACjB,kBAAkB;IAClB,aAAa;IACb,mBAAmB;IACnB,8BAA8B;IAC9B,eAAe;IACf,oBAAoB;AACxB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,QAAQ;IACR,kBAAkB;AACtB;;AAEA;IACI,gBAAgB;IAChB,YAAY;IACZ,oBAAoB;IACpB,eAAe;IACf,eAAe;IACf,cAAc;IACd,cAAc;AAClB;;AAEA;IACI,aAAa;IACb,mBAAmB;AACvB;;AAEA;IACI,oBAAoB;AACxB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,YAAY;IACZ,mBAAmB;IACnB,0BAA0B;IAC1B,YAAY;IACZ,eAAe;IACf,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,cAAc;IACd,4DAA4D;IAC5D,6CAA6C;AACjD;;AAEA;IACI,gCAAgC;IAChC,uCAAuC;AAC3C;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,eAAe;AACnB;;AAEA;IACI,mBAAmB;IACnB,oBAAoB;IACpB,6CAA6C;AACjD;;AAEA;IACI,mBAAmB;IACnB,qBAAqB;AACzB;;AAEA;IACI,WAAW;IACX,YAAY;AAChB;;AAEA;IACI,aAAa;IACb,uBAAuB;IACvB,gBAAgB;AACpB;;AAEA,4BAA4B;AAC5B;IACI,aAAa;IACb,eAAe;IACf,QAAQ;IACR,kBAAkB;IAClB,cAAc;AAClB;;AAEA;IACI,oBAAoB;IACpB,mBAAmB;IACnB,QAAQ;IACR,0BAA0B;IAC1B,oCAAoC;IACpC,kBAAkB;IAClB,gBAAgB;IAChB,eAAe;IACf,kBAAkB;IAClB,yBAAyB;IACzB,eAAe;AACnB;;AAEA;IACI,kCAAkC;IAClC,uBAAuB;IACvB,2BAA2B;IAC3B,4BAA4B;AAChC;;AAEA;IACI,eAAe;IACf,YAAY;AAChB;;AAEA;IACI,mBAAmB;IACnB,gBAAgB;IAChB,uBAAuB;IACvB,gBAAgB;AACpB;;AAEA;IACI,gBAAgB;IAChB,YAAY;IACZ,eAAe;IACf,oBAAoB;IACpB,cAAc;IACd,eAAe;IACf,cAAc;IACd,aAAa;IACb,mBAAmB;IACnB,kBAAkB;IAClB,sBAAsB;AAC1B;;AAEA;IACI,mBAAmB;IACnB,2BAA2B;AAC/B;;AAEA,2BAA2B;AAC3B;IACI,UAAU;IACV,WAAW;AACf;;AAEA;IACI,uBAAuB;AAC3B;;AAEA;IACI,8BAA8B;IAC9B,kBAAkB;AACtB;;AAEA;IACI,8BAA8B;AAClC;;AAEA;IACI;QACI,qCAAqC;IACzC;;IAEA;QACI,qCAAqC;IACzC;;IAEA;QACI,kCAAkC;QAClC,oBAAoB;IACxB;AACJ;;AAEA;IACI,oBAAoB;IACpB,mBAAmB;IACnB,QAAQ;IACR,gBAAgB;IAChB,eAAe;IACf,gBAAgB;IAChB,wBAAwB;IACxB,oBAAoB;IACpB,uBAAuB;IACvB,YAAY;IACZ,eAAe;IACf,kBAAkB;IAClB,yCAAyC;AAC7C;;AAEA;IACI,mBAAmB;IACnB,2BAA2B;AAC/B;;AAEA;IACI,WAAW;IACX,YAAY;AAChB;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,OAAO;IACP,aAAa;IACb,sBAAsB;IACtB,WAAW;IACX,gBAAgB;IAChB,kBAAkB;IAClB,aAAa;AACjB;;AAEA;IACI,OAAO;IACP,gBAAgB;IAChB,uBAAuB;IACvB,aAAa;IACb,sBAAsB;IACtB,SAAS;IACT,uBAAuB;IACvB,aAAa;AACjB;;;AAGA,wBAAwB;AACxB;IACI,aAAa;IACb,QAAQ;IACR,gBAAgB;IAChB,cAAc;IACd,qBAAqB;IACrB,cAAc;AAClB;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,QAAQ;IACR,iBAAiB;IACjB,eAAe;IACf,gBAAgB;IAChB,wBAAwB;IACxB,oBAAoB;IACpB,uBAAuB;IACvB,6BAA6B;IAC7B,kBAAkB;IAClB,eAAe;IACf,6BAA6B;IAC7B,mBAAmB;IACnB,cAAc;AAClB;;AAEA;IACI,oBAAoB;IACpB,uBAAuB;AAC3B;;AAEA;IACI,qBAAqB;IACrB,6BAA6B;IAC7B,iCAAiC;IACjC,2CAA2C;AAC/C;;AAEA;IACI,WAAW;IACX,YAAY;AAChB;;;AAGA,4CAA4C;AAC5C;IACI,aAAa;IACb,uBAAuB;IACvB,SAAS;IACT,kBAAkB;IAClB,mBAAmB;IACnB,gFAAgF;IAChF,qCAAqC;IACrC,mBAAmB;IACnB,+BAA+B;AACnC;;AAEA;IACI,eAAe;IACf,cAAc;IACd,cAAc;AAClB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,QAAQ;AACZ;;AAEA;IACI,iBAAiB;IACjB,gBAAgB;IAChB,qBAAqB;AACzB;;AAEA;IACI,iBAAiB;IACjB,oBAAoB;IACpB,gBAAgB;AACpB;;AAEA;IACI,iBAAiB;IACjB,eAAe;IACf,gBAAgB;IAChB,wBAAwB;IACxB,qBAAqB;IACrB,uBAAuB;IACvB,qCAAqC;IACrC,kBAAkB;IAClB,eAAe;IACf,6BAA6B;IAC7B,cAAc;IACd,iBAAiB;AACrB;;AAEA;IACI,6BAA6B;IAC7B,2BAA2B;AAC/B;;AAEA;IACI,sBAAsB;AAC1B;;AAEA,mCAAmC;AACnC;IACI,kBAAkB;IAClB,mBAAmB;IACnB,uBAAuB;IACvB,oCAAoC;IACpC,mBAAmB;IACnB,+BAA+B;AACnC;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,8BAA8B;IAC9B,kBAAkB;AACtB;;AAEA;IACI,iBAAiB;IACjB,gBAAgB;IAChB,oBAAoB;AACxB;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,qBAAqB;IACrB,6BAA6B;IAC7B,gBAAgB;IAChB,mBAAmB;AACvB;;AAEA;IACI,aAAa;IACb,eAAe;IACf,QAAQ;AACZ;;AAEA;IACI,gBAAgB;IAChB,eAAe;IACf,gBAAgB;IAChB,oBAAoB;IACpB,2BAA2B;IAC3B,oCAAoC;IACpC,kBAAkB;AACtB;;AAEA;IACI,qBAAqB;IACrB,6BAA6B;IAC7B,qCAAqC;AACzC;;AAEA,qCAAqC;AACrC;IACI,cAAc;IACd,mCAAmC;IACnC,qCAAqC;AACzC;;AAEA;IACI,cAAc;AAClB;;AAEA,yCAAyC;AACzC;IACI,cAAc;IACd,oCAAoC;IACpC,sCAAsC;AAC1C;;AAEA;IACI,cAAc;AAClB;;;AAGA,6BAA6B;AAC7B;IACI,aAAa;IACb,eAAe;IACf,QAAQ;AACZ;;AAEA;IACI,oBAAoB;IACpB,mBAAmB;IACnB,QAAQ;IACR,iBAAiB;IACjB,eAAe;IACf,gBAAgB;IAChB,wBAAwB;IACxB,oBAAoB;IACpB,uBAAuB;IACvB,oCAAoC;IACpC,mBAAmB;IACnB,eAAe;IACf,4DAA4D;IAC5D,mBAAmB;AACvB;;AAEA;IACI,qBAAqB;IACrB,4BAA4B;IAC5B,uBAAuB;IACvB,2BAA2B;IAC3B,4BAA4B;AAChC;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,cAAc;IACd,+BAA+B;AACnC;;AAEA;IACI,wBAAwB;AAC5B;;;AAGA,6BAA6B;AAC7B;IACI,uBAAuB;IACvB,oCAAoC;IACpC,+BAA+B;IAC/B,aAAa;IACb,sBAAsB;IACtB,4BAA4B;IAC5B,iDAAiD;IACjD,wBAAwB;IACxB,cAAc;AAClB;;AAEA;IACI,4BAA4B;IAC5B,0CAA0C;AAC9C;;AAEA;IACI,WAAW;IACX,gBAAgB;IAChB,iBAAiB;IACjB,kBAAkB;IAClB,uBAAuB;IACvB,YAAY;IACZ,kBAAkB;IAClB,wBAAwB;IACxB,eAAe;IACf,gBAAgB;IAChB,YAAY;IACZ,aAAa;AACjB;;AAEA;IACI,iBAAiB;IACjB,+BAA+B;IAC/B,wCAAwC;IACxC,aAAa;IACb,8BAA8B;IAC9B,mBAAmB;IACnB,QAAQ;IACR,cAAc;AAClB;;;AAGA,sBAAsB;AACtB;IACI,iBAAiB;IACjB,gBAAgB;IAChB,qBAAqB;IACrB,6BAA6B;IAC7B,gBAAgB;IAChB,mBAAmB;IACnB,sBAAsB;AAC1B;;;AAGA,yBAAyB;AACzB;IACI,0BAA0B;IAC1B,YAAY;IACZ,YAAY;IACZ,iBAAiB;IACjB,kBAAkB;IAClB,eAAe;IACf,gBAAgB;IAChB,eAAe;IACf,aAAa;IACb,mBAAmB;IACnB,QAAQ;IACR,wFAAwF;IACxF,4CAA4C;AAChD;;AAEA;IACI,gCAAgC;IAChC,2BAA2B;IAC3B,8CAA8C;AAClD;;AAEA;IACI,wBAAwB;AAC5B;;AAEA;IACI,mBAAmB;IACnB,qBAAqB;IACrB,6CAA6C;AACjD;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,YAAY;IACZ,mBAAmB;IACnB,eAAe;AACnB;;AAEA;IACI,WAAW;IACX,YAAY;AAChB;;;AAGA,2BAA2B;AAC3B;IACI,aAAa;IACb,sBAAsB;IACtB,QAAQ;IACR,cAAc;AAClB;;AAEA;IACI,YAAY;IACZ,YAAY;IACZ,kBAAkB;AACtB;;AAEA;IACI,YAAY;IACZ,kBAAkB;AACtB;;AAEA;IACI,UAAU;AACd;;AAEA;IACI,UAAU;AACd;;AAEA;IACI,UAAU;AACd;;AAEA,4BAA4B;AAC5B;IACI,aAAa;IACb,SAAS;IACT,mBAAmB;IACnB,uBAAuB;AAC3B;;AAEA;IACI,uBAAuB;IACvB,oCAAoC;IACpC,mBAAmB;IACnB,8BAA8B;IAC9B,aAAa;IACb,OAAO;IACP,cAAc;IACd,aAAa;IACb,sBAAsB;IACtB,SAAS;IACT,4BAA4B;IAC5B,gBAAgB;AACpB;;;AAGA,sBAAsB;AACtB;IACI,iBAAiB;IACjB,4BAA4B;IAC5B,eAAe;IACf,gBAAgB;IAChB,aAAa;IACb,mBAAmB;IACnB,QAAQ;IACR,sBAAsB;IACtB,6BAA6B;AACjC;;AAEA;IACI,6BAA6B;IAC7B,qBAAqB;IACrB,iCAAiC;AACrC;;AAEA;IACI,6BAA6B;IAC7B,qBAAqB;IACrB,qCAAqC;AACzC;;AAEA;IACI,2BAA2B;IAC3B,mBAAmB;IACnB,qCAAqC;AACzC;;;AAGA,yCAAyC;AACzC;IACI,eAAe;AACnB;;AAEA;IACI,uBAAuB;IACvB,oCAAoC;IACpC,4BAA4B;IAC5B,gBAAgB;AACpB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,QAAQ;IACR,kBAAkB;IAClB,eAAe;IACf,gBAAgB;IAChB,oBAAoB;IACpB,eAAe;IACf,iBAAiB;IACjB,yBAAyB;AAC7B;;AAEA;IACI,kBAAkB;IAClB,+BAA+B;AACnC;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,+BAA+B;AACnC;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,SAAS;IACT,kBAAkB;IAClB,wBAAwB;IACxB,eAAe;IACf,gBAAgB;IAChB,oBAAoB;IACpB,2BAA2B;IAC3B,wCAAwC;IACxC,iBAAiB;IACjB,gBAAgB;IAChB,qBAAqB;IACrB,qBAAqB;AACzB;;;AAGA,mBAAmB;AACnB;IACI,WAAW;IACX,YAAY;IACZ,6BAA6B;IAC7B,kBAAkB;IAClB,8BAA8B;IAC9B,gCAAgC;IAChC,oCAAoC;AACxC;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,0CAA0C;IAC1C,kBAAkB;IAClB,uBAAuB;IACvB,oCAAoC;IACpC,qBAAqB;AACzB;;;AAGA,wBAAwB;AACxB;IACI,gBAAgB;IAChB,gBAAgB;AACpB;;AAEA;IACI,uBAAuB;IACvB,YAAY;IACZ,4BAA4B;AAChC;;AAEA;IACI,cAAc;IACd,eAAe;IACf,eAAe;IACf,gBAAgB;IAChB,oBAAoB;IACpB,aAAa;IACb,mBAAmB;IACnB,QAAQ;IACR,gBAAgB;IAChB,iBAAiB;IACjB,uBAAuB;AAC3B;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,oBAAoB;AACxB;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,SAAS;IACT,aAAa;IACb,2BAA2B;IAC3B,oBAAoB;IACpB,wBAAwB;IACxB,eAAe;IACf,gBAAgB;IAChB,oCAAoC;IACpC,kBAAkB;IAClB,iBAAiB;IACjB,qBAAqB;IACrB,qBAAqB;IACrB,iBAAiB;AACrB;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;;AAEpE,+DAA+D;AAC/D;;IAEI,0BAA0B;AAC9B;;AAEA,wEAAwE;AACxE;;IAEI,wBAAwB;IACxB,+BAA+B;AACnC;;AAEA,qEAAqE;AACrE;;;;;;IAMI,qBAAqB;AACzB;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,aAAa;IACb,aAAa;IACb,sBAAsB;IACtB,qBAAqB;IACrB,gBAAgB;AACpB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,WAAW;IACX,YAAY;IACZ,+BAA+B;AACnC;;AAEA,uDAAuD;AACvD;;;IAGI,kBAAkB;IAClB,gBAAgB;IAChB,8BAA8B;AAClC;;AAEA;;;IAGI,WAAW;IACX,kBAAkB;IAClB,QAAQ;IACR,4BAA4B;IAC5B;;;;;;;KAOC;IACD,iEAAiE;AACrE;;AAEA,iCAAiC;AACjC;;qCAEqC,sBAAsB,EAAE;;AAE7D;qCACqC,sBAAsB,EAAE;;AAE7D,8CAA8C,sBAAsB,EAAE;;AAEtE,kDAAkD,qBAAqB,EAAE;AACzE,kDAAkD,qBAAqB,EAAE;;AAEzE,kDAAkD,qBAAqB,EAAE;;AAEzE,oDAAoD;AACpD;IACI,aAAa;IACb,sBAAsB;IACtB,SAAS;IACT,aAAa;AACjB;;AAEA;IACI,UAAU;IACV,YAAY;IACZ,kBAAkB;AACtB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,mBAAmB;AACvB;;AAEA;IACI,aAAa;IACb,SAAS;AACb;;AAEA;IACI,OAAO;IACP,YAAY;IACZ,mBAAmB;AACvB;;AAEA;IACI,YAAY;IACZ,kBAAkB;AACtB;;AAEA,8BAA8B,UAAU,EAAE;AAC1C,8BAA8B,UAAU,EAAE;AAC1C,8BAA8B,UAAU,EAAE;AAC1C,8BAA8B,UAAU,EAAE;;AAE1C;IACI,aAAa;IACb,mBAAmB;IACnB,8BAA8B;IAC9B,kBAAkB;IAClB,2CAA2C;AAC/C;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,QAAQ;AACZ;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,kBAAkB;AACtB;;AAEA;IACI,YAAY;IACZ,YAAY;IACZ,kBAAkB;AACtB;;AAEA;IACI,aAAa;IACb,QAAQ;AACZ;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,kBAAkB;AACtB;;AAEA;IACI,aAAa;IACb,QAAQ;IACR,gBAAgB;IAChB,2CAA2C;AAC/C;;AAEA;IACI,OAAO;IACP,YAAY;IACZ,kBAAkB;AACtB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;IACvB,SAAS;AACb;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,mBAAmB;AACvB;;AAEA;IACI,YAAY;IACZ,YAAY;IACZ,kBAAkB;AACtB;;AAEA;IACI,YAAY;IACZ,YAAY;IACZ,kBAAkB;AACtB;;AAEA;IACI,YAAY;AAChB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,QAAQ;IACR,kBAAkB;AACtB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,mBAAmB;AACvB;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,gBAAgB;IAChB,sBAAsB;IACtB,wCAAwC;AAC5C;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,mBAAmB;AACvB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,QAAQ;IACR,aAAa;IACb,iBAAiB;IACjB,gBAAgB;IAChB,oBAAoB;AACxB;;AAEA;IACI,UAAU;IACV,WAAW;IACX,kBAAkB;IAClB,0BAA0B;IAC1B,0CAA0C;IAC1C,uCAAuC;AAC3C;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI;QACI,UAAU;QACV,0BAA0B;IAC9B;;IAEA;QACI,UAAU;QACV,wBAAwB;IAC5B;AACJ;;AAEA;IACI;QACI,UAAU;QACV,2BAA2B;IAC/B;;IAEA;QACI,UAAU;QACV,wBAAwB;IAC5B;AACJ;;AAEA;IACI;QACI,yBAAyB;IAC7B;AACJ;;AAEA;IACI;QACI,4BAA4B;IAChC;;IAEA;QACI,2BAA2B;IAC/B;AACJ;;AAEA;IACI;QACI,UAAU;QACV,0BAA0B;IAC9B;;IAEA;QACI,UAAU;QACV,wBAAwB;IAC5B;AACJ;;AAEA;;IAEI;;QAEI,wBAAwB;QACxB,YAAY;IAChB;;IAEA;QACI,2BAA2B;QAC3B,UAAU;IACd;AACJ;;AAEA;;IAEI;;QAEI,YAAY;QACZ,sBAAsB;IAC1B;;IAEA;QACI,UAAU;QACV,sBAAsB;IAC1B;AACJ;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;;AAEpE,+BAA+B;AAC/B;IACI,OAAO;IACP,2BAA2B;IAC3B,aAAa;IACb,oBAAoB;IACpB,uBAAuB;IACvB,iCAAiC;AACrC;;AAEA,wDAAwD;AACxD;IACI,OAAO;IACP,aAAa;IACb,sBAAsB;IACtB,2BAA2B;IAC3B,aAAa;AACjB;;AAEA,4EAA4E;AAC5E;;IAEI,aAAa;IACb,YAAY;IACZ,gBAAgB;IAChB,sBAAsB;AAC1B;;AAEA;;IAEI,aAAa;AACjB;;AAEA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,UAAU;IACV,WAAW;AACf;;AAEA;IACI,uBAAuB;AAC3B;;AAEA;IACI,+BAA+B;IAC/B,kBAAkB;AACtB;;AAEA;IACI,8BAA8B;AAClC;;AAEA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;;AAEpE,mEAAmE;AACnE;IACI,+BAA+B;IAC/B,2BAA2B;AAC/B;;AAEA,yEAAyE;AACzE;;;;IAII,sBAAsB;AAC1B;;AAEA,wDAAwD;AACxD;IACI;QACI,iBAAiB;QACjB,oBAAoB;IACxB;;IAEA;QACI,iBAAiB;IACrB;;IAEA;QACI,iBAAiB;QACjB,iBAAiB;QACjB,cAAc;IAClB;;IAEA;QACI,eAAe;QACf,gBAAgB;IACpB;;IAEA;QACI,gBAAgB;QAChB,eAAe;IACnB;;IAEA,8BAA8B;IAC9B;QACI,mBAAmB;IACvB;;IAEA,sCAAsC;IACtC;QACI,eAAe;QACf,YAAY;IAChB;AACJ;;AAEA,gDAAgD;AAChD;;IAEI;QACI,mCAAmC;QACnC,kCAAkC;IACtC;AACJ;;AAEA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;;AAEpE,8BAA8B;AAC9B;;;;;;IAMI,6DAA6D;IAC7D,uBAAuB;AAC3B;;AAEA,2CAA2C;AAC3C;;;IAGI,2BAA2B;IAC3B,4BAA4B;AAChC;;AAEA,gEAAgE;AAChE;IACI,2BAA2B;AAC/B;;AAEA,qCAAqC;AACrC;IACI,uCAAuC;IACvC,4BAA4B;AAChC;;;;AAIA;IACI;QACI,4CAA4C;IAChD;;IAEA;QACI,2CAA2C;IAC/C;;IAEA;QACI,yCAAyC;IAC7C;AACJ;;AAEA;IACI,kEAAkE;AACtE;;AAEA,iCAAiC;AACjC;;;;;;IAMI,iCAAiC;IACjC,+CAA+C;IAC/C,yBAAyB;AAC7B;;AAEA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,aAAa;IACb,sBAAsB;IACtB,SAAS;IACT,gBAAgB;AACpB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,SAAS;IACT,aAAa;IACb,uBAAuB;IACvB,oCAAoC;IACpC,+BAA+B;IAC/B,yBAAyB;AAC7B;;AAEA;IACI,2BAA2B;IAC3B,4BAA4B;IAC5B,kCAAkC;AACtC;;AAEA;IACI,eAAe;IACf,WAAW;IACX,YAAY;IACZ,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,qBAAqB;IACrB,mBAAmB;AACvB;;AAEA;IACI,OAAO;AACX;;AAEA;IACI,eAAe;IACf,eAAe;IACf,gBAAgB;AACpB;;AAEA;IACI,SAAS;IACT,eAAe;IACf,oBAAoB;IACpB,gBAAgB;AACpB;;AAEA;IACI,gBAAgB;IAChB,aAAa;IACb,6BAA6B;IAC7B,+BAA+B;IAC/B,iCAAiC;AACrC;;AAEA;IACI,mBAAmB;IACnB,cAAc;IACd,yBAAyB;AAC7B;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,eAAe;IACf,YAAY;IACZ,SAAS;IACT,2BAA2B;IAC3B,cAAc;IACd,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,QAAQ;IACR,oBAAoB;AACxB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,QAAQ;IACR,kBAAkB;IAClB,mBAAmB;IACnB,eAAe;IACf,gBAAgB;IAChB,wBAAwB;IACxB,4BAA4B;IAC5B,+DAA+D;IAC/D,oBAAoB;IACpB,2BAA2B;IAC3B,mCAAmC;IACnC,gBAAgB;AACpB;;AAEA;IACI,yCAAyC;AAC7C;;AAEA;IACI,mCAAmC;IACnC,YAAY;IACZ,yCAAyC;AAC7C;;AAEA;IACI,mCAAmC;IACnC,YAAY;IACZ,wCAAwC;AAC5C;;AAEA;IACI,qCAAqC;IACrC,kBAAkB;IAClB,oCAAoC;AACxC;;AAEA;IACI;QACI,kCAAkC;QAClC,kBAAkB;QAClB,oCAAoC;IACxC;AACJ;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,cAAc;AAClB;;AAEA;IACI;QACI,UAAU;QACV,uCAAuC;IAC3C;;IAEA;QACI,UAAU;QACV,iCAAiC;IACrC;AACJ;;AAEA;IACI;QACI,UAAU;QACV,iCAAiC;IACrC;;IAEA;QACI,UAAU;QACV,uCAAuC;IAC3C;AACJ;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,aAAa;IACb,QAAQ;IACR,eAAe;IACf,UAAU;IACV,6BAA6B;AACjC;;AAEA;IACI,UAAU;AACd;;AAEA;IACI,oBAAoB;IACpB,mBAAmB;IACnB,QAAQ;IACR,gBAAgB;IAChB,eAAe;IACf,gBAAgB;IAChB,wBAAwB;IACxB,oBAAoB;IACpB,2BAA2B;IAC3B,oCAAoC;IACpC,kBAAkB;IAClB,eAAe;IACf,yBAAyB;AAC7B;;AAEA;IACI,qBAAqB;IACrB,iCAAiC;IACjC,6BAA6B;AACjC;;AAEA;IACI,qBAAqB;IACrB,oCAAoC;IACpC,6BAA6B;AACjC;;AAEA;IACI,WAAW;IACX,YAAY;AAChB;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,mCAAmC;AACvC;;AAEA;IACI;QACI,UAAU;QACV,0BAA0B;IAC9B;;IAEA;QACI,UAAU;QACV,wBAAwB;IAC5B;AACJ;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,kBAAkB;IAClB,YAAY;IACZ,WAAW;IACX,WAAW;IACX,YAAY;IACZ,kBAAkB;IAClB,uBAAuB;IACvB,oCAAoC;IACpC,oBAAoB;IACpB,eAAe;IACf,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,4BAA4B;IAC5B,WAAW;IACX,yBAAyB;IACzB,+BAA+B;AACnC;;AAEA;IACI,6BAA6B;IAC7B,qBAAqB;IACrB,iCAAiC;IACjC,2BAA2B;AAC/B;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,WAAW;IACX,YAAY;AAChB;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,eAAe;IACf,oBAAoB;IACpB,gBAAgB;IAChB,kCAAkC;IAClC,2BAA2B;IAC3B,eAAe;IACf,iBAAiB;AACrB;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,mBAAmB;AACvB;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,cAAc;IACd,gBAAgB;IAChB,oBAAoB;IACpB,2BAA2B;IAC3B,oCAAoC;IACpC,kBAAkB;IAClB,gBAAgB;IAChB,wBAAwB;IACxB,sBAAsB;IACtB,oBAAoB;IACpB,mBAAmB;AACvB;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,sBAAsB;AAC1B;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,sBAAsB;AAC1B;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,8DAA8D;AAClE;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;;IAEI,4BAA4B;IAC5B,2DAA2D;AAC/D;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,0BAA0B;IAC1B,4CAA4C;AAChD;;AAEA;IACI;QACI,mBAAmB;IACvB;;IAEA;QACI,sBAAsB;IAC1B;;IAEA;QACI,mBAAmB;IACvB;AACJ;;AAEA;IACI,+BAA+B;AACnC;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,oCAAoC;IACpC,qBAAqB;AACzB;;AAEA;IACI,oCAAoC;IACpC,qBAAqB;AACzB;;AAEA;IACI,oCAAoC;IACpC,qBAAqB;AACzB;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;;;;IAII,kBAAkB;IAClB,gBAAgB;AACpB;;AAEA;;IAEI,WAAW;IACX,kBAAkB;IAClB,QAAQ;IACR,+HAA+H;IAC/H,UAAU;IACV,6BAA6B;IAC7B,oBAAoB;AACxB;;AAEA;;IAEI,UAAU;IACV,sBAAsB;AAC1B;;;AAGA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI;QACI,qCAAqC;IACzC;;IAEA;QACI,qCAAqC;IACzC;AACJ;;AAEA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;AACpE;IACI,iBAAiB;IACjB,aAAa;IACb,uBAAuB;IACvB,uCAAuC;IACvC,+BAA+B;IAC/B,4BAA4B;IAC5B,mCAAmC;AACvC;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,8BAA8B;IAC9B,mBAAmB;AACvB;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,qBAAqB;IACrB,uBAAuB;AAC3B;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,oBAAoB;IACpB,6BAA6B;IAC7B,gBAAgB;IAChB,mBAAmB;AACvB;;AAEA;IACI,WAAW;IACX,iBAAiB;IACjB,iBAAiB;IACjB,wBAAwB;IACxB,kBAAkB;IAClB,2BAA2B;IAC3B,oCAAoC;IACpC,4BAA4B;IAC5B,aAAa;IACb,YAAY;IACZ,gEAAgE;IAChE,mBAAmB;IACnB,gBAAgB;AACpB;;AAEA;IACI,4BAA4B;IAC5B,yCAAyC;AAC7C;;AAEA;IACI,WAAW;IACX,uBAAuB;IACvB,QAAQ;IACR,eAAe;IACf,aAAa;IACb,0BAA0B;IAC1B,YAAY;IACZ,YAAY;IACZ,4BAA4B;IAC5B,eAAe;IACf,gBAAgB;IAChB,wBAAwB;IACxB,aAAa;IACb,mBAAmB;IACnB,6BAA6B;IAC7B,6CAA6C;AACjD;;AAEA;IACI,gCAAgC;IAChC,2BAA2B;IAC3B,8CAA8C;AAClD;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,eAAe;AACnB;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI,WAAW;IACX,2BAA2B;IAC3B,mBAAmB;IACnB,gBAAgB;AACpB;;AAEA;IACI,YAAY;IACZ,wEAAwE;IACxE,mBAAmB;IACnB,+BAA+B;IAC/B,kBAAkB;IAClB,gBAAgB;AACpB;;AAEA;IACI,WAAW;IACX,kBAAkB;IAClB,MAAM;IACN,UAAU;IACV,UAAU;IACV,YAAY;IACZ,oCAAoC;IACpC,4CAA4C;AAChD;;AAEA;IACI;QACI,UAAU;IACd;AACJ;;AAEA;IACI,eAAe;IACf,oBAAoB;IACpB,iBAAiB;IACjB,eAAe;IACf,gBAAgB;AACpB;;AAEA;IACI,gBAAgB;IAChB,iBAAiB;IACjB,gBAAgB;IAChB,aAAa;IACb,sBAAsB;IACtB,QAAQ;AACZ;;AAEA;IACI,eAAe;IACf,wBAAwB;IACxB,oBAAoB;IACpB,gBAAgB;IAChB,kBAAkB;IAClB,aAAa;IACb,QAAQ;IACR,mBAAmB;AACvB;;AAEA;IACI,qBAAqB;IACrB,6BAA6B;AACjC;;AAEA;IACI,mBAAmB;IACnB,2BAA2B;AAC/B;;AAEA;IACI,oBAAoB;IACpB,2BAA2B;AAC/B;;AAEA,oEAAoE;AACpE,oEAAoE;AACpE,oEAAoE;;AAEpE,+BAA+B;AAC/B;IACI,aAAa;IACb,sBAAsB;IACtB,MAAM;IACN,+BAA+B;IAC/B,gBAAgB;IAChB,qCAAqC;IACrC,uBAAuB;IACvB,2DAA2D;IAC3D,4DAA4D;AAChE;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,OAAO,UAAU,EAAE,sCAAsC,EAAE;IAC3D,OAAO,UAAU,EAAE,iCAAiC,EAAE;AAC1D;;AAEA,eAAe;AACf;IACI,aAAa;IACb,mBAAmB;IACnB,QAAQ;IACR,kBAAkB;IAClB,mEAAmE;IACnE,2CAA2C;AAC/C;;AAEA;IACI,UAAU;IACV,WAAW;IACX,kBAAkB;IAClB,0BAA0B;IAC1B,6CAA6C;IAC7C,cAAc;AAClB;;AAEA;IACI,WAAW,UAAU,EAAE,kCAAkC,EAAE;IAC3D,WAAW,YAAY,EAAE,iCAAiC,EAAE;AAChE;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,qBAAqB;IACrB,qBAAqB;AACzB;;AAEA;IACI,eAAe;IACf,oBAAoB;IACpB,iBAAiB;IACjB,gBAAgB;AACpB;;AAEA,yBAAyB;AACzB;IACI,eAAe;IACf,iBAAiB;IACjB,gBAAgB;IAChB,kBAAkB;IAClB,2BAA2B;AAC/B;;AAEA;IACI,WAAW;IACX,kBAAkB;IAClB,SAAS;IACT,OAAO;IACP,QAAQ;IACR,YAAY;IACZ,yDAAyD;IACzD,oBAAoB;AACxB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,wBAAwB;IACxB,eAAe;IACf,iBAAiB;IACjB,UAAU;IACV,0BAA0B;IAC1B,wCAAwC;AAC5C;;AAEA;IACI,WAAW;IACX,iBAAiB;IACjB,mBAAmB;IACnB,oBAAoB;IACpB,eAAe;IACf,cAAc;IACd,iBAAiB;AACrB;;AAEA;IACI,OAAO;IACP,mBAAmB;IACnB,gBAAgB;IAChB,uBAAuB;AAC3B;;AAEA;IACI,mCAAmC;AACvC;;AAEA;IACI,qBAAqB;IACrB,gBAAgB;AACpB;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,mCAAmC;AACvC;;AAEA;IACI,mBAAmB;IACnB,gBAAgB;AACpB;;AAEA;IACI,mBAAmB;IACnB,6BAA6B;IAC7B,YAAY;AAChB;;AAEA;IACI,oBAAoB;AACxB;;AAEA;IACI,KAAK,UAAU,EAAE,wBAAwB,EAAE;AAC/C;;AAEA,kBAAkB;AAClB;IACI,qBAAqB;IACrB,UAAU;IACV,YAAY;IACZ,0BAA0B;IAC1B,gBAAgB;IAChB,sBAAsB;IACtB,uCAAuC;IACvC,kBAAkB;AACtB;;AAEA;IACI,MAAM,UAAU,EAAE;AACtB;;AAEA,sCAAsC;AACtC;IACI,WAAW;IACX,2BAA2B;IAC3B,kBAAkB;IAClB,gBAAgB;AACpB;;AAEA;IACI,kBAAkB;IAClB,OAAO;IACP,MAAM;IACN,YAAY;IACZ,SAAS;IACT,wEAAwE;IACxE,0BAA0B;IAC1B,qDAAqD;AACzD;;AAEA;IACI,kBAAkB;IAClB,MAAM;IACN,OAAO;IACP,QAAQ;IACR,YAAY;IACZ;;;;;KAKC;IACD,oDAAoD;AACxD;;AAEA;IACI,OAAO,4BAA4B,EAAE;IACrC,OAAO,2BAA2B,EAAE;AACxC;;AAEA,sCAAsC;AACtC;IACI,aAAa;IACb,sBAAsB;IACtB,+BAA+B;IAC/B,gBAAgB;IAChB,oCAAoC;IACpC,uBAAuB;IACvB,yBAAyB;IACzB,wDAAwD;AAC5D;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,OAAO,UAAU,EAAE,0BAA0B,EAAE;IAC/C,OAAO,UAAU,EAAE,wBAAwB,EAAE;AACjD;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,8BAA8B;IAC9B,iBAAiB;IACjB,2CAA2C;IAC3C,2BAA2B;AAC/B;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,QAAQ;IACR,eAAe;IACf,gBAAgB;IAChB,oBAAoB;AACxB;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,SAAS;IACT,eAAe;IACf,gBAAgB;IAChB,wBAAwB;AAC5B;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,iBAAiB;IACjB,gBAAgB;IAChB,kBAAkB;IAClB,cAAc;IACd,qBAAqB;AACzB;;AAEA;IACI,aAAa;IACb,oBAAoB;IACpB,wBAAwB;IACxB,eAAe;IACf,iBAAiB;IACjB,UAAU;IACV,yCAAyC;IACzC,UAAU;AACd;;AAEA;IACI,OAAO,UAAU,EAAE;IACnB,OAAO,UAAU,EAAE;AACvB;;AAEA;IACI,WAAW;IACX,kBAAkB;IAClB,cAAc;IACd,cAAc;IACd,eAAe;IACf,gBAAgB;IAChB,iBAAiB;IACjB,aAAa;IACb,mBAAmB;IACnB,uBAAuB;AAC3B;;AAEA;IACI,OAAO;IACP,eAAe;IACf,gBAAgB;IAChB,gBAAgB;IAChB,uBAAuB;AAC3B;;AAEA,gBAAgB;AAChB;IACI,mCAAmC;AACvC;;AAEA;IACI,mCAAmC;IACnC,qBAAqB;AACzB;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,mCAAmC;IACnC,kBAAkB;IAClB,cAAc;AAClB;;AAEA,kBAAkB;AAClB;IACI,mCAAmC;AACvC;;AAEA;IACI,kCAAkC;IAClC,mBAAmB;AACvB;;AAEA;IACI,oBAAoB;IACpB,6BAA6B;AACjC;;AAEA,kBAAkB;AAClB;IACI,oBAAoB;AACxB;;AAEA;IACI,oBAAoB;AACxB;;AAEA,cAAc;AACd;IACI,iBAAiB;IACjB,eAAe;IACf,oBAAoB;IACpB,wBAAwB;IACxB,2BAA2B;IAC3B,yCAAyC;IACzC,4CAA4C;IAC5C,kBAAkB;IAClB,iBAAiB;AACrB;;AAEA,mBAAmB;AACnB;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,YAAY;IACZ,wCAAwC;IACxC,2BAA2B;IAC3B,eAAe;IACf,4BAA4B;AAChC;;AAEA;IACI,6BAA6B;AACjC;;AAEA;IACI,eAAe;IACf,oBAAoB;IACpB,gBAAgB;AACpB;;AAEA,mCAAmC;AACnC;IACI;QACI,oCAAoC;IACxC;IACA;QACI,oCAAoC;IACxC;IACA;QACI,oCAAoC;IACxC;IACA;QACI,mCAAmC;IACvC;IACA;QACI,mCAAmC;IACvC;IACA;QACI,mCAAmC;IACvC;IACA;QACI,kCAAkC;IACtC;AACJ","sourcesContent":["/* \r\n * SheetOS AI — Redesigned Interface\r\n * A warm, human-crafted design system.\r\n * Forest green + terracotta. No AI-purple gradients.\r\n */\r\n\r\n:root {\r\n    /* ── Surface & Layout ── */\r\n    --bg: #F5F4F1;\r\n    --bg-gradient: radial-gradient(circle at 50% 0%, #FFFFFF, #F2F0EB);\r\n    --surface: #FAFAF8;\r\n    --card: #FFFFFF;\r\n    --card-border: #E3E1DC;\r\n    --card-hover: #F0EFEB;\r\n    --input-bg: #F5F4F1;\r\n\r\n    /* ── Primary: Forest Green ── */\r\n    --primary: #2D6A4F;\r\n    --primary-hover: #1B4D3E;\r\n    --primary-light: #74C69D;\r\n    --primary-bg: rgba(45, 106, 79, 0.06);\r\n    --primary-glow: rgba(45, 106, 79, 0.12);\r\n\r\n    /* ── Accent: Terracotta ── */\r\n    --accent: #C4603D;\r\n    --accent-hover: #A8502F;\r\n    --accent-bg: rgba(196, 96, 61, 0.07);\r\n\r\n    /* ── Text ── */\r\n    --text: #1A1C1E;\r\n    --text-2: #555759;\r\n    --text-3: #8C8E91;\r\n    --text-4: #C5C7CA;\r\n\r\n    /* ── Semantic ── */\r\n    --success: #2D6A4F;\r\n    --success-bg: rgba(45, 106, 79, 0.07);\r\n    --error: #B83A3A;\r\n    --error-bg: rgba(184, 58, 58, 0.07);\r\n    --warning: #C08B2D;\r\n    --warning-bg: rgba(192, 139, 45, 0.07);\r\n\r\n    /* ── Shape ── */\r\n    --radius: 10px;\r\n    --radius-lg: 14px;\r\n    --radius-xl: 20px;\r\n\r\n    /* ── Depth — warm tinted shadows ── */\r\n    --shadow-sm: 0 1px 2px rgba(30, 25, 20, 0.04);\r\n    --shadow: 0 2px 5px rgba(30, 25, 20, 0.05), 0 1px 2px rgba(30, 25, 20, 0.03);\r\n    --shadow-md: 0 4px 12px rgba(30, 25, 20, 0.06), 0 1px 3px rgba(30, 25, 20, 0.04);\r\n    --shadow-lg: 0 8px 24px rgba(30, 25, 20, 0.08), 0 2px 6px rgba(30, 25, 20, 0.04);\r\n\r\n    /* ── Typography ── */\r\n    --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;\r\n    --mono: 'JetBrains Mono', 'Cascadia Code', 'Menlo', monospace;\r\n\r\n    /* ── Chat ── */\r\n    --chat-user-bg: var(--primary);\r\n    --chat-user-text: #FFFFFF;\r\n    --chat-ai-bg: #FFFFFF;\r\n    --chat-ai-border: rgba(0, 0, 0, 0.06);\r\n    --chat-ai-text: var(--text);\r\n\r\n    /* ── Glass ── */\r\n    --glass-bg: rgba(255, 255, 255, 0.7);\r\n    --glass-border: rgba(255, 255, 255, 0.4);\r\n    --blur: 16px;\r\n}\r\n\r\n/* ── Dark mode ── */\r\n@media (prefers-color-scheme: dark) {\r\n    :root {\r\n        --bg: #141516;\r\n        --bg-gradient: radial-gradient(circle at 50% 0%, #1A1B1D, #0F1011);\r\n        --surface: #1A1B1D;\r\n        --card: #212224;\r\n        --card-border: #313335;\r\n        --card-hover: #2A2B2D;\r\n        --input-bg: #19191B;\r\n\r\n        --primary: #52B788;\r\n        --primary-hover: #74C69D;\r\n        --primary-light: #2D6A4F;\r\n        --primary-bg: rgba(82, 183, 136, 0.08);\r\n        --primary-glow: rgba(82, 183, 136, 0.14);\r\n\r\n        --accent: #E0915A;\r\n        --accent-hover: #EAA876;\r\n        --accent-bg: rgba(224, 145, 90, 0.09);\r\n\r\n        --text: #E5E3DE;\r\n        --text-2: #9B9D9F;\r\n        --text-3: #606264;\r\n        --text-4: #3A3C3E;\r\n\r\n        --success: #52B788;\r\n        --success-bg: rgba(82, 183, 136, 0.09);\r\n        --error: #E06060;\r\n        --error-bg: rgba(224, 96, 96, 0.09);\r\n        --warning: #E0B85A;\r\n        --warning-bg: rgba(224, 184, 90, 0.09);\r\n\r\n        --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.18);\r\n        --shadow: 0 2px 5px rgba(0, 0, 0, 0.22);\r\n        --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.28);\r\n        --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.32);\r\n\r\n        --chat-user-bg: var(--primary);\r\n        --chat-user-text: #141516;\r\n        --chat-ai-bg: #212224;\r\n        --chat-ai-border: rgba(255, 255, 255, 0.05);\r\n        --chat-ai-text: var(--text);\r\n\r\n        --glass-bg: rgba(20, 21, 22, 0.75);\r\n        --glass-border: rgba(255, 255, 255, 0.08);\r\n    }\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* RESET & BASE                                                    */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n*,\r\n*::before,\r\n*::after {\r\n    box-sizing: border-box;\r\n}\r\n\r\nhtml,\r\nbody {\r\n    width: 100%;\r\n    height: 100%;\r\n    margin: 0;\r\n    padding: 0;\r\n    font-family: var(--font);\r\n    font-size: 13px;\r\n    line-height: 1.55;\r\n    background: var(--bg-gradient);\r\n    color: var(--text);\r\n    -webkit-font-smoothing: antialiased;\r\n    -moz-osx-font-smoothing: grayscale;\r\n    overflow-x: hidden;\r\n}\r\n\r\n#app-body {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100vh;\r\n    overflow: hidden;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* HEADER                                                          */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.app-header {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    padding: 12px 18px;\r\n    background: var(--glass-bg);\r\n    backdrop-filter: blur(var(--blur));\r\n    -webkit-backdrop-filter: blur(var(--blur));\r\n    border-bottom: 1px solid var(--glass-border);\r\n    position: sticky;\r\n    top: 0;\r\n    z-index: 100;\r\n}\r\n\r\n.brand {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 9px;\r\n}\r\n\r\n.logo {\r\n    color: var(--primary);\r\n    display: flex;\r\n    align-items: center;\r\n}\r\n\r\n.brand h1 {\r\n    font-size: 15px;\r\n    font-weight: 700;\r\n    margin: 0;\r\n    letter-spacing: -0.025em;\r\n    color: var(--text);\r\n}\r\n\r\n.highlight-text {\r\n    color: var(--primary);\r\n    font-weight: 700;\r\n    /* Solid color, not a gradient — feels hand-picked */\r\n}\r\n\r\n.header-actions {\r\n    display: flex;\r\n    gap: 5px;\r\n}\r\n\r\n\r\n/* ── Icon Buttons ── */\r\n/* Base Icon Button */\r\n.btn-icon {\r\n    width: 34px;\r\n    height: 34px;\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 10px;\r\n    background: var(--card);\r\n    color: var(--text-2);\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);\r\n    padding: 0;\r\n    box-shadow: var(--shadow-sm);\r\n}\r\n\r\n.btn-icon:hover {\r\n    color: var(--primary);\r\n    border-color: var(--primary-light);\r\n    background: var(--primary-bg);\r\n    transform: translateY(-2px);\r\n    box-shadow: var(--shadow);\r\n}\r\n\r\n.btn-icon:active {\r\n    transform: scale(0.95);\r\n}\r\n\r\n\r\n\r\n/* ─── Panels (Docs / Settings) ─── */\r\n.panel {\r\n    padding: 16px;\r\n    background: var(--card);\r\n    border-bottom: 1px solid var(--card-border);\r\n    animation: slideDown 0.22s ease-out;\r\n    max-height: 80vh;\r\n    overflow-y: auto;\r\n    box-shadow: var(--shadow-md);\r\n}\r\n\r\n.panel h3 {\r\n    font-size: 11px;\r\n    font-weight: 700;\r\n    /* Fixed from 650 */\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.06em;\r\n    color: var(--text-3);\r\n    margin: 0 0 12px;\r\n}\r\n\r\n\r\n/* ── Docs Grid ── */\r\n.docs-grid {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 8px;\r\n}\r\n\r\n.doc-item {\r\n    display: flex;\r\n    gap: 10px;\r\n    align-items: flex-start;\r\n    padding: 5px 0;\r\n}\r\n\r\n.doc-icon {\r\n    flex-shrink: 0;\r\n    width: 18px;\r\n    height: 18px;\r\n    color: var(--primary);\r\n    display: flex;\r\n    align-items: center;\r\n    margin-top: 1px;\r\n}\r\n\r\n.doc-item strong {\r\n    font-size: 12px;\r\n    font-weight: 600;\r\n    color: var(--text);\r\n    display: block;\r\n    margin-bottom: 2px;\r\n}\r\n\r\n.doc-item p {\r\n    font-size: 11px;\r\n    color: var(--text-2);\r\n    margin: 0;\r\n    line-height: 1.45;\r\n}\r\n\r\n.docs-hint {\r\n    font-size: 11px;\r\n    color: var(--text-3);\r\n    margin: 12px 0 0;\r\n    font-style: italic;\r\n    line-height: 1.5;\r\n}\r\n\r\n\r\n/* ── Forms ── */\r\n.form-group {\r\n    margin-bottom: 12px;\r\n}\r\n\r\n.form-group label {\r\n    display: block;\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    color: var(--text-3);\r\n    margin-bottom: 4px;\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.04em;\r\n}\r\n\r\n.form-input {\r\n    width: 100%;\r\n    padding: 8px 11px;\r\n    font-size: 13px;\r\n    font-family: var(--font);\r\n    color: var(--text);\r\n    background: var(--input-bg);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 9px;\r\n    outline: none;\r\n    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;\r\n}\r\n\r\n.form-input:focus {\r\n    border-color: var(--primary);\r\n    box-shadow: 0 0 0 3px var(--primary-glow);\r\n}\r\n\r\nselect.form-input {\r\n    cursor: pointer;\r\n    appearance: none;\r\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%238C8E91' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\");\r\n    background-repeat: no-repeat;\r\n    background-position: right 10px center;\r\n    padding-right: 28px;\r\n}\r\n\r\n.btn-save {\r\n    width: 100%;\r\n    justify-content: center;\r\n    margin-top: 6px;\r\n}\r\n\r\n/* Model selector row */\r\n.model-select-wrapper {\r\n    display: flex;\r\n    gap: 5px;\r\n    align-items: center;\r\n}\r\n\r\n.model-select-wrapper .form-input {\r\n    flex: 1;\r\n    min-width: 0;\r\n}\r\n\r\n.btn-refresh {\r\n    width: 30px;\r\n    height: 30px;\r\n    flex-shrink: 0;\r\n    padding: 0;\r\n}\r\n\r\n.model-status {\r\n    font-size: 11px;\r\n    margin-top: 4px;\r\n    min-height: 15px;\r\n    color: var(--text-3);\r\n}\r\n\r\n.model-status-ok {\r\n    color: var(--success);\r\n}\r\n\r\n.model-status-warn {\r\n    color: var(--error);\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* MODE TOGGLE                                                     */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.mode-toggle {\r\n    display: flex;\r\n    align-items: center;\r\n    padding: 5px;\r\n    margin: 10px 14px;\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 14px;\r\n    position: relative;\r\n    gap: 4px;\r\n    box-shadow: var(--shadow-sm);\r\n}\r\n\r\n.mode-tab {\r\n    flex: 1;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 8px;\r\n    padding: 10px;\r\n    font-size: 13px;\r\n    font-weight: 600;\r\n    font-family: var(--font);\r\n    color: var(--text-3);\r\n    background: transparent;\r\n    border: none;\r\n    cursor: pointer;\r\n    transition: all 0.3s ease;\r\n    position: relative;\r\n    z-index: 2;\r\n}\r\n\r\n.mode-tab.active {\r\n    color: var(--primary);\r\n}\r\n\r\n.mode-indicator {\r\n    position: absolute;\r\n    left: 5px;\r\n    top: 5px;\r\n    width: calc(50% - 7px);\r\n    height: calc(100% - 10px);\r\n    background: var(--primary-bg);\r\n    border-radius: 10px;\r\n    transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);\r\n    z-index: 1;\r\n}\r\n\r\n.mode-indicator.right {\r\n    transform: translateX(calc(100% + 4px));\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* MODE CONTENT WRAPPER                                            */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.mode-content {\r\n    display: none;\r\n    flex-direction: column;\r\n    flex: 1;\r\n    overflow: hidden;\r\n    animation: fadeIn 0.2s ease-out;\r\n}\r\n\r\n.mode-content.active {\r\n    display: flex;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* PLANNING MODE — Chat                                            */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n\r\n/* ── Chat Messages Container ── */\r\n.chat-messages {\r\n    flex: 1;\r\n    overflow-y: auto;\r\n    padding: 14px 14px 6px;\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 14px;\r\n    scroll-behavior: smooth;\r\n}\r\n\r\n\r\n/* ── Welcome Screen ── */\r\n.chat-welcome {\r\n    text-align: center;\r\n    padding: 28px 18px 18px;\r\n    animation: fadeIn 0.35s ease-out;\r\n}\r\n\r\n.welcome-icon {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    width: 52px;\r\n    height: 52px;\r\n    background: var(--primary);\r\n    border-radius: 16px;\r\n    color: white;\r\n    margin-bottom: 14px;\r\n    box-shadow: 0 4px 14px rgba(45, 106, 79, 0.2);\r\n}\r\n\r\n.welcome-icon svg {\r\n    width: 24px;\r\n    height: 24px;\r\n}\r\n\r\n.chat-welcome h2 {\r\n    font-size: 17px;\r\n    font-weight: 700;\r\n    margin: 0 0 8px;\r\n    color: var(--text);\r\n    letter-spacing: -0.02em;\r\n}\r\n\r\n.chat-welcome p {\r\n    font-size: 12.5px;\r\n    color: var(--text-2);\r\n    margin: 0 0 18px;\r\n    line-height: 1.65;\r\n    max-width: 270px;\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n}\r\n\r\n\r\n/* ── Chat Suggestions ── */\r\n.welcome-suggestions {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 7px;\r\n    max-width: 280px;\r\n    margin: 0 auto;\r\n}\r\n\r\n.suggestion-chip {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 9px;\r\n    padding: 10px 13px;\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: var(--radius);\r\n    font-size: 11.5px;\r\n    color: var(--text-2);\r\n    cursor: pointer;\r\n    transition: all 0.22s ease-out;\r\n    text-align: left;\r\n    font-family: var(--font);\r\n    line-height: 1.4;\r\n}\r\n\r\n.suggestion-chip:hover {\r\n    border-color: var(--primary);\r\n    color: var(--primary);\r\n    background: var(--primary-bg);\r\n    transform: translateX(3px);\r\n}\r\n\r\n.suggestion-chip svg {\r\n    flex-shrink: 0;\r\n    color: var(--primary);\r\n    opacity: 0.5;\r\n}\r\n\r\n.suggestion-chip:hover svg {\r\n    opacity: 1;\r\n}\r\n\r\n\r\n/* ── Chat Message Bubbles ── */\r\n.chat-msg {\r\n    display: flex;\r\n    gap: 0;\r\n    margin-bottom: 12px;\r\n    animation: msgSlideIn 0.35s cubic-bezier(0.19, 1, 0.22, 1);\r\n    max-width: 100%;\r\n}\r\n\r\n.chat-msg.user {\r\n    justify-content: flex-end;\r\n}\r\n\r\n.chat-msg.ai {\r\n    justify-content: flex-start;\r\n}\r\n\r\n.chat-bubble {\r\n    padding: 12px 16px;\r\n    border-radius: 20px;\r\n    font-size: 14px;\r\n    line-height: 1.5;\r\n    max-width: 85%;\r\n    word-wrap: break-word;\r\n    overflow-wrap: break-word;\r\n    box-shadow: var(--shadow-sm);\r\n    transition: transform 0.2s ease;\r\n}\r\n\r\n.chat-bubble:has(table) {\r\n    max-width: 95%;\r\n}\r\n\r\n.chat-msg.user .chat-bubble {\r\n    background: var(--primary);\r\n    color: white;\r\n    border-bottom-right-radius: 4px;\r\n    margin-right: 4px;\r\n}\r\n\r\n.chat-msg.ai .chat-bubble {\r\n    background: var(--card);\r\n    color: var(--text-1);\r\n    border: 1px solid var(--card-border);\r\n    border-bottom-left-radius: 4px;\r\n    margin-left: 4px;\r\n}\r\n\r\n\r\n/* ── Chat formatted text ── */\r\n.chat-bubble strong {\r\n    font-weight: 600;\r\n}\r\n\r\n.chat-bubble em {\r\n    font-style: italic;\r\n    opacity: 0.9;\r\n}\r\n\r\n.chat-bubble code {\r\n    font-family: var(--mono);\r\n    font-size: 11px;\r\n    padding: 2px 5px;\r\n    border-radius: 5px;\r\n    background: rgba(0, 0, 0, 0.06);\r\n}\r\n\r\n.chat-msg.user .chat-bubble code {\r\n    background: rgba(255, 255, 255, 0.18);\r\n}\r\n\r\n.chat-bubble ul,\r\n.chat-bubble ol {\r\n    margin: 6px 0;\r\n    padding-left: 18px;\r\n}\r\n\r\n.chat-bubble li {\r\n    margin-bottom: 3px;\r\n}\r\n\r\n.chat-bubble p {\r\n    margin: 0 0 8px;\r\n}\r\n\r\n.chat-bubble li p {\r\n    margin: 0;\r\n    display: inline;\r\n}\r\n\r\n.chat-bubble p:last-child {\r\n    margin: 0;\r\n}\r\n\r\n.chat-bubble h1,\r\n.chat-bubble h2,\r\n.chat-bubble h3 {\r\n    margin: 12px 0 6px;\r\n    font-weight: 700;\r\n    line-height: 1.3;\r\n}\r\n\r\n.chat-bubble h1 {\r\n    font-size: 1.25em;\r\n    border-bottom: 1px solid var(--border);\r\n    padding-bottom: 4px;\r\n}\r\n\r\n.chat-bubble h2 {\r\n    font-size: 1.15em;\r\n}\r\n\r\n.chat-bubble h3 {\r\n    font-size: 1.05em;\r\n    color: var(--text-2);\r\n}\r\n\r\n/* Table styling for AI responses */\r\n.chat-bubble table {\r\n    width: 100%;\r\n    border-collapse: collapse;\r\n    margin: 10px 0;\r\n    font-size: 11px;\r\n    background: var(--surface);\r\n    border-radius: 8px;\r\n    overflow: hidden;\r\n    display: block;\r\n    overflow-x: auto;\r\n}\r\n\r\n.chat-bubble th,\r\n.chat-bubble td {\r\n    padding: 6px 10px;\r\n    border: 1px solid var(--border);\r\n    text-align: left;\r\n}\r\n\r\n.chat-bubble th {\r\n    background: var(--surface-2);\r\n    font-weight: 600;\r\n    color: var(--primary);\r\n}\r\n\r\n.chat-bubble tr:nth-child(even) {\r\n    background: rgba(0, 0, 0, 0.02);\r\n}\r\n\r\n/* ── Context Badge ── */\r\n.context-badge {\r\n    display: block;\r\n    margin-top: 8px;\r\n    padding: 4px 8px;\r\n    font-size: 10px;\r\n    font-weight: 500;\r\n    color: rgba(255, 255, 255, 0.85);\r\n    background: rgba(255, 255, 255, 0.15);\r\n    border-radius: 6px;\r\n    letter-spacing: 0.2px;\r\n}\r\n\r\n.chat-msg.ai .context-badge {\r\n    color: var(--text-2);\r\n    background: var(--primary-bg);\r\n}\r\n\r\n\r\n/* ── Execute from Chat ── */\r\n.chat-action-bar {\r\n    display: flex;\r\n    gap: 6px;\r\n    margin-top: 10px;\r\n}\r\n\r\n.btn-execute-from-chat {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    gap: 5px;\r\n    padding: 5px 11px;\r\n    font-size: 10.5px;\r\n    font-weight: 600;\r\n    font-family: var(--font);\r\n    background: var(--primary-bg);\r\n    color: var(--primary);\r\n    border: 1px solid var(--primary-glow);\r\n    border-radius: 7px;\r\n    cursor: pointer;\r\n    transition: all 0.2s ease-out;\r\n}\r\n\r\n.btn-execute-from-chat:hover {\r\n    background: var(--primary);\r\n    color: white;\r\n    box-shadow: 0 2px 8px rgba(45, 106, 79, 0.25);\r\n}\r\n\r\n\r\n/* ── Typing Indicator ── */\r\n.typing-indicator {\r\n    display: flex;\r\n    gap: 4px;\r\n    align-items: center;\r\n    padding: 4px 0;\r\n}\r\n\r\n.typing-dot {\r\n    width: 6px;\r\n    height: 6px;\r\n    background: var(--text-3);\r\n    border-radius: 50%;\r\n    animation: typingBounce 0.6s ease-in-out infinite;\r\n}\r\n\r\n.typing-dot:nth-child(2) {\r\n    animation-delay: 0.15s;\r\n}\r\n\r\n.typing-dot:nth-child(3) {\r\n    animation-delay: 0.3s;\r\n}\r\n\r\n\r\n/* ── Chat Input Area ── */\r\n.chat-input-area {\r\n    padding: 12px 14px 12px;\r\n    background: var(--glass-bg);\r\n    backdrop-filter: blur(var(--blur));\r\n    -webkit-backdrop-filter: blur(var(--blur));\r\n    border-top: 1px solid var(--glass-border);\r\n}\r\n\r\n.chat-input-card {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 10px;\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: var(--radius-xl);\r\n    padding: 6px 6px 6px 16px;\r\n    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\r\n    box-shadow: var(--shadow-md);\r\n}\r\n\r\n.chat-input-card:focus-within {\r\n    border-color: var(--primary);\r\n    box-shadow: 0 4px 20px var(--primary-glow);\r\n    transform: translateY(-2px);\r\n}\r\n\r\n#chat-input {\r\n    flex: 1;\r\n    border: none;\r\n    background: transparent;\r\n    font-family: var(--font);\r\n    font-size: 13px;\r\n    line-height: 1.4;\r\n    padding: 6px 0;\r\n    color: var(--text-1);\r\n    resize: none;\r\n    outline: none;\r\n    max-height: 120px;\r\n    min-height: 20px;\r\n}\r\n\r\n/* Agent Footer Layout */\r\n.card-footer {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    margin-top: 12px;\r\n}\r\n\r\n.footer-left {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 8px;\r\n}\r\n\r\n/* Original btn-clip (updated) */\r\n.btn-clip {\r\n    background: none;\r\n    border: none;\r\n    color: var(--text-3);\r\n    cursor: pointer;\r\n    padding: 6px;\r\n    border-radius: 6px;\r\n    display: inline-flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    transition: all 0.2s;\r\n}\r\n\r\n.btn-clip:hover {\r\n    background: var(--surface-hover);\r\n    color: var(--primary);\r\n}\r\n\r\n.file-preview {\r\n    background: var(--surface-2);\r\n    border: 1px solid var(--border);\r\n    border-radius: 6px;\r\n    padding: 6px 10px;\r\n    margin-bottom: 8px;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    font-size: 11px;\r\n    color: var(--text-1);\r\n}\r\n\r\n.file-thumb {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 8px;\r\n    padding-right: 8px;\r\n}\r\n\r\n.file-remove {\r\n    background: none;\r\n    border: none;\r\n    color: var(--text-3);\r\n    font-size: 16px;\r\n    cursor: pointer;\r\n    padding: 0 4px;\r\n    line-height: 1;\r\n}\r\n\r\n.file-center {\r\n    display: flex;\r\n    align-items: center;\r\n}\r\n\r\n#chat-input::placeholder {\r\n    color: var(--text-3);\r\n}\r\n\r\n.btn-send {\r\n    width: 38px;\r\n    height: 38px;\r\n    border: none;\r\n    border-radius: 12px;\r\n    background: var(--primary);\r\n    color: white;\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    flex-shrink: 0;\r\n    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);\r\n    box-shadow: 0 4px 12px rgba(45, 106, 79, 0.3);\r\n}\r\n\r\n.btn-send:hover {\r\n    background: var(--primary-hover);\r\n    transform: translateY(-2px) scale(1.05);\r\n}\r\n\r\n.btn-send:disabled {\r\n    opacity: 0.35;\r\n    cursor: not-allowed;\r\n    transform: none;\r\n}\r\n\r\n.btn-send.is-busy {\r\n    background: #FF4D4D;\r\n    /* Red stop button */\r\n    box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);\r\n}\r\n\r\n.btn-send.is-busy:hover {\r\n    background: #E60000;\r\n    transform: scale(1.1);\r\n}\r\n\r\n.btn-send svg {\r\n    width: 14px;\r\n    height: 14px;\r\n}\r\n\r\n.chat-footer {\r\n    display: flex;\r\n    justify-content: center;\r\n    padding: 4px 0 0;\r\n}\r\n\r\n/* ── File Preview List ── */\r\n.file-preview-list {\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n    gap: 6px;\r\n    margin-bottom: 8px;\r\n    padding: 0 4px;\r\n}\r\n\r\n.file-chip {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    gap: 6px;\r\n    background: var(--surface);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 6px;\r\n    padding: 4px 8px;\r\n    font-size: 11px;\r\n    color: var(--text);\r\n    transition: all 0.2s ease;\r\n    max-width: 100%;\r\n}\r\n\r\n.file-chip:hover {\r\n    border-color: var(--primary-light);\r\n    background: var(--card);\r\n    transform: translateY(-1px);\r\n    box-shadow: var(--shadow-sm);\r\n}\r\n\r\n.file-chip-icon {\r\n    font-size: 12px;\r\n    opacity: 0.7;\r\n}\r\n\r\n.file-chip-name {\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    max-width: 140px;\r\n}\r\n\r\n.file-chip-remove {\r\n    background: none;\r\n    border: none;\r\n    cursor: pointer;\r\n    color: var(--text-3);\r\n    padding: 0 2px;\r\n    font-size: 14px;\r\n    line-height: 1;\r\n    display: flex;\r\n    align-items: center;\r\n    border-radius: 4px;\r\n    transition: color 0.2s;\r\n}\r\n\r\n.file-chip-remove:hover {\r\n    color: var(--error);\r\n    background: var(--error-bg);\r\n}\r\n\r\n/* ── Custom Scrollbar ── */\r\n::-webkit-scrollbar {\r\n    width: 6px;\r\n    height: 6px;\r\n}\r\n\r\n::-webkit-scrollbar-track {\r\n    background: transparent;\r\n}\r\n\r\n::-webkit-scrollbar-thumb {\r\n    background: rgba(0, 0, 0, 0.1);\r\n    border-radius: 3px;\r\n}\r\n\r\n::-webkit-scrollbar-thumb:hover {\r\n    background: rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n@media (prefers-color-scheme: dark) {\r\n    ::-webkit-scrollbar-thumb {\r\n        background: rgba(255, 255, 255, 0.15);\r\n    }\r\n\r\n    ::-webkit-scrollbar-thumb:hover {\r\n        background: rgba(255, 255, 255, 0.25);\r\n    }\r\n\r\n    .app-header {\r\n        background: rgba(26, 27, 29, 0.85);\r\n        /* Dark mode glass */\r\n    }\r\n}\r\n\r\n.btn-text {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    gap: 4px;\r\n    padding: 5px 9px;\r\n    font-size: 11px;\r\n    font-weight: 500;\r\n    font-family: var(--font);\r\n    color: var(--text-3);\r\n    background: transparent;\r\n    border: none;\r\n    cursor: pointer;\r\n    border-radius: 7px;\r\n    transition: color 0.15s, background 0.15s;\r\n}\r\n\r\n.btn-text:hover {\r\n    color: var(--error);\r\n    background: var(--error-bg);\r\n}\r\n\r\n.btn-text svg {\r\n    width: 12px;\r\n    height: 12px;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* AGENT MODE                                                      */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.content-wrapper {\r\n    flex: 1;\r\n    display: flex;\r\n    flex-direction: column;\r\n    width: 100%;\r\n    overflow: hidden;\r\n    position: relative;\r\n    min-height: 0;\r\n}\r\n\r\n.agent-scroll-area {\r\n    flex: 1;\r\n    overflow-y: auto;\r\n    padding: 10px 14px 14px;\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 12px;\r\n    scroll-behavior: smooth;\r\n    min-height: 0;\r\n}\r\n\r\n\r\n/* ── Category Tabs ── */\r\n.action-categories {\r\n    display: flex;\r\n    gap: 5px;\r\n    overflow-x: auto;\r\n    padding: 2px 0;\r\n    scrollbar-width: none;\r\n    flex-shrink: 0;\r\n}\r\n\r\n.action-categories::-webkit-scrollbar {\r\n    display: none;\r\n}\r\n\r\n.category-tab {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 5px;\r\n    padding: 7px 11px;\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    font-family: var(--font);\r\n    color: var(--text-3);\r\n    background: transparent;\r\n    border: 1px solid transparent;\r\n    border-radius: 9px;\r\n    cursor: pointer;\r\n    transition: all 0.2s ease-out;\r\n    white-space: nowrap;\r\n    flex-shrink: 0;\r\n}\r\n\r\n.category-tab:hover {\r\n    color: var(--text-2);\r\n    background: var(--card);\r\n}\r\n\r\n.category-tab.active {\r\n    color: var(--primary);\r\n    background: var(--primary-bg);\r\n    border-color: var(--primary-glow);\r\n    animation: tabPulse 2s infinite ease-in-out;\r\n}\r\n\r\n.category-tab svg {\r\n    width: 12px;\r\n    height: 12px;\r\n}\r\n\r\n\r\n/* ── Schema Info Banner (Extract Mode) ── */\r\n.schema-info {\r\n    display: flex;\r\n    align-items: flex-start;\r\n    gap: 10px;\r\n    padding: 10px 12px;\r\n    margin-bottom: 10px;\r\n    background: linear-gradient(135deg, var(--primary-bg), rgba(74, 144, 226, 0.06));\r\n    border: 1px solid var(--primary-glow);\r\n    border-radius: 10px;\r\n    animation: fadeIn 0.3s ease-out;\r\n}\r\n\r\n.schema-icon {\r\n    font-size: 18px;\r\n    line-height: 1;\r\n    flex-shrink: 0;\r\n}\r\n\r\n.schema-text {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 2px;\r\n}\r\n\r\n.schema-text strong {\r\n    font-size: 11.5px;\r\n    font-weight: 600;\r\n    color: var(--primary);\r\n}\r\n\r\n.schema-text span {\r\n    font-size: 10.5px;\r\n    color: var(--text-2);\r\n    line-height: 1.4;\r\n}\r\n\r\n.btn-detect {\r\n    padding: 5px 10px;\r\n    font-size: 10px;\r\n    font-weight: 600;\r\n    font-family: var(--font);\r\n    color: var(--primary);\r\n    background: var(--card);\r\n    border: 1px solid var(--primary-glow);\r\n    border-radius: 6px;\r\n    cursor: pointer;\r\n    transition: all 0.2s ease-out;\r\n    flex-shrink: 0;\r\n    margin-left: auto;\r\n}\r\n\r\n.btn-detect:hover {\r\n    background: var(--primary-bg);\r\n    transform: translateY(-1px);\r\n}\r\n\r\n.btn-detect:active {\r\n    transform: scale(0.96);\r\n}\r\n\r\n/* ── Detected Columns Preview ── */\r\n.detected-columns {\r\n    padding: 10px 12px;\r\n    margin-bottom: 10px;\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 10px;\r\n    animation: fadeIn 0.3s ease-out;\r\n}\r\n\r\n.detected-header {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    margin-bottom: 8px;\r\n}\r\n\r\n.detected-label {\r\n    font-size: 10.5px;\r\n    font-weight: 600;\r\n    color: var(--text-2);\r\n}\r\n\r\n.column-count {\r\n    font-size: 10px;\r\n    font-weight: 700;\r\n    color: var(--primary);\r\n    background: var(--primary-bg);\r\n    padding: 2px 8px;\r\n    border-radius: 10px;\r\n}\r\n\r\n.column-chips {\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n    gap: 4px;\r\n}\r\n\r\n.column-chip {\r\n    padding: 3px 8px;\r\n    font-size: 10px;\r\n    font-weight: 500;\r\n    color: var(--text-2);\r\n    background: var(--input-bg);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 6px;\r\n}\r\n\r\n.column-chip.empty-warning {\r\n    color: var(--warning);\r\n    background: var(--warning-bg);\r\n    border-color: rgba(192, 139, 45, 0.2);\r\n}\r\n\r\n/* ── Extract Category Highlight ── */\r\n.category-tab[data-category=\"extract\"].active {\r\n    color: #C4603D;\r\n    background: rgba(196, 96, 61, 0.08);\r\n    border-color: rgba(196, 96, 61, 0.15);\r\n}\r\n\r\n.category-tab[data-category=\"extract\"]:hover {\r\n    color: #A8502F;\r\n}\r\n\r\n/* ── Smart Tools Category Highlight ── */\r\n.category-tab[data-category=\"smart\"].active {\r\n    color: #7C3AED;\r\n    background: rgba(124, 58, 237, 0.08);\r\n    border-color: rgba(124, 58, 237, 0.15);\r\n}\r\n\r\n.category-tab[data-category=\"smart\"]:hover {\r\n    color: #6D28D9;\r\n}\r\n\r\n\r\n/* ── Quick Action Chips ── */\r\n.quick-actions {\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n    gap: 6px;\r\n}\r\n\r\n.chip {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    gap: 6px;\r\n    padding: 8px 14px;\r\n    font-size: 12px;\r\n    font-weight: 500;\r\n    font-family: var(--font);\r\n    color: var(--text-2);\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 24px;\r\n    cursor: pointer;\r\n    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);\r\n    white-space: nowrap;\r\n}\r\n\r\n.chip:hover {\r\n    color: var(--primary);\r\n    border-color: var(--primary);\r\n    background: var(--card);\r\n    transform: translateY(-2px);\r\n    box-shadow: var(--shadow-md);\r\n}\r\n\r\n.chip svg {\r\n    width: 14px;\r\n    height: 14px;\r\n    flex-shrink: 0;\r\n    transition: transform 0.3s ease;\r\n}\r\n\r\n.chip:hover svg {\r\n    transform: rotate(15deg);\r\n}\r\n\r\n\r\n/* ── Input Card (Agent) ── */\r\n.input-card {\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: var(--radius-xl);\r\n    display: flex;\r\n    flex-direction: column;\r\n    box-shadow: var(--shadow-md);\r\n    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\r\n    margin: 14px 14px 0 14px;\r\n    flex-shrink: 0;\r\n}\r\n\r\n.input-card:focus-within {\r\n    border-color: var(--primary);\r\n    box-shadow: 0 2px 16px var(--primary-glow);\r\n}\r\n\r\ntextarea {\r\n    width: 100%;\r\n    min-height: 80px;\r\n    max-height: 160px;\r\n    padding: 14px 16px;\r\n    background: transparent;\r\n    border: none;\r\n    color: var(--text);\r\n    font-family: var(--font);\r\n    font-size: 13px;\r\n    line-height: 1.6;\r\n    resize: none;\r\n    outline: none;\r\n}\r\n\r\n.card-footer {\r\n    padding: 8px 12px;\r\n    background: rgba(0, 0, 0, 0.02);\r\n    border-top: 1px solid var(--card-border);\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    gap: 8px;\r\n    flex-shrink: 0;\r\n}\r\n\r\n\r\n/* ── Cache Badge ── */\r\n.cache-badge {\r\n    font-size: 10.5px;\r\n    font-weight: 600;\r\n    color: var(--success);\r\n    background: var(--success-bg);\r\n    padding: 3px 9px;\r\n    border-radius: 10px;\r\n    animation: fadeIn 0.2s;\r\n}\r\n\r\n\r\n/* ── Primary Button ── */\r\n.btn-primary {\r\n    background: var(--primary);\r\n    color: white;\r\n    border: none;\r\n    padding: 8px 16px;\r\n    border-radius: 9px;\r\n    font-size: 12px;\r\n    font-weight: 600;\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 6px;\r\n    transition: background 0.2s ease-out, transform 0.15s ease-out, box-shadow 0.2s ease-out;\r\n    box-shadow: 0 2px 6px rgba(45, 106, 79, 0.2);\r\n}\r\n\r\n.btn-primary:hover {\r\n    background: var(--primary-hover);\r\n    transform: translateY(-1px);\r\n    box-shadow: 0 4px 14px rgba(45, 106, 79, 0.25);\r\n}\r\n\r\n.btn-primary:active {\r\n    transform: translateY(0);\r\n}\r\n\r\n.btn-primary.btn-stop {\r\n    background: #E53E3E;\r\n    border-color: #C53030;\r\n    box-shadow: 0 4px 10px rgba(229, 62, 62, 0.2);\r\n}\r\n\r\n.btn-primary.btn-stop:hover {\r\n    background: #C53030;\r\n}\r\n\r\n.btn-primary:disabled {\r\n    opacity: 0.4;\r\n    cursor: not-allowed;\r\n    transform: none;\r\n}\r\n\r\n.btn-primary svg {\r\n    width: 13px;\r\n    height: 13px;\r\n}\r\n\r\n\r\n/* ── Skeleton Loading ── */\r\n.skeleton-container {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 9px;\r\n    padding: 4px 0;\r\n}\r\n\r\n.skeleton-pill {\r\n    width: 140px;\r\n    height: 28px;\r\n    border-radius: 9px;\r\n}\r\n\r\n.skeleton-line {\r\n    height: 13px;\r\n    border-radius: 5px;\r\n}\r\n\r\n.skeleton-line.w80 {\r\n    width: 80%;\r\n}\r\n\r\n.skeleton-line.w60 {\r\n    width: 60%;\r\n}\r\n\r\n.skeleton-line.w40 {\r\n    width: 40%;\r\n}\r\n\r\n/* Chat Skeleton Specifics */\r\n.skeleton-msg {\r\n    display: flex;\r\n    gap: 12px;\r\n    margin-bottom: 12px;\r\n    align-items: flex-start;\r\n}\r\n\r\n.skeleton-bubble {\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 20px;\r\n    border-bottom-left-radius: 4px;\r\n    padding: 14px;\r\n    flex: 1;\r\n    max-width: 85%;\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 10px;\r\n    box-shadow: var(--shadow-sm);\r\n    margin-left: 4px;\r\n}\r\n\r\n\r\n/* ── Status Pill ── */\r\n.status-pill {\r\n    padding: 9px 13px;\r\n    border-radius: var(--radius);\r\n    font-size: 12px;\r\n    font-weight: 500;\r\n    display: none;\r\n    align-items: center;\r\n    gap: 7px;\r\n    animation: fadeIn 0.2s;\r\n    border: 1px solid transparent;\r\n}\r\n\r\n.status-pill.info {\r\n    background: var(--primary-bg);\r\n    color: var(--primary);\r\n    border-color: var(--primary-glow);\r\n}\r\n\r\n.status-pill.success {\r\n    background: var(--success-bg);\r\n    color: var(--success);\r\n    border-color: rgba(45, 106, 79, 0.12);\r\n}\r\n\r\n.status-pill.error {\r\n    background: var(--error-bg);\r\n    color: var(--error);\r\n    border-color: rgba(184, 58, 58, 0.12);\r\n}\r\n\r\n\r\n/* ── Generated Code (Debug Section) ── */\r\n#debug-section {\r\n    margin-top: 4px;\r\n}\r\n\r\n#debug-section details {\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: var(--radius);\r\n    overflow: hidden;\r\n}\r\n\r\n#debug-section summary {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 6px;\r\n    padding: 10px 14px;\r\n    font-size: 12px;\r\n    font-weight: 600;\r\n    color: var(--text-2);\r\n    cursor: pointer;\r\n    user-select: none;\r\n    transition: all 0.2s ease;\r\n}\r\n\r\n#debug-section summary:hover {\r\n    color: var(--text);\r\n    background: rgba(0, 0, 0, 0.02);\r\n}\r\n\r\n#debug-section summary svg {\r\n    width: 12px;\r\n    height: 12px;\r\n    transition: transform 0.2s ease;\r\n}\r\n\r\n#debug-section details[open] summary svg {\r\n    transform: rotate(180deg);\r\n}\r\n\r\n#debug-code {\r\n    margin: 0;\r\n    padding: 12px 14px;\r\n    font-family: var(--mono);\r\n    font-size: 10px;\r\n    line-height: 1.6;\r\n    color: var(--text-2);\r\n    background: var(--input-bg);\r\n    border-top: 1px solid var(--card-border);\r\n    max-height: 200px;\r\n    overflow-y: auto;\r\n    white-space: pre-wrap;\r\n    word-break: break-all;\r\n}\r\n\r\n\r\n/* ── Spinners ── */\r\n.spinner {\r\n    width: 14px;\r\n    height: 14px;\r\n    border: 2px solid transparent;\r\n    border-radius: 50%;\r\n    border-top-color: currentColor;\r\n    border-right-color: currentColor;\r\n    animation: spin 0.7s linear infinite;\r\n}\r\n\r\n.btn-spinner {\r\n    width: 13px;\r\n    height: 13px;\r\n    border: 2px solid rgba(255, 255, 255, 0.3);\r\n    border-radius: 50%;\r\n    border-top-color: white;\r\n    animation: spin 0.7s linear infinite;\r\n    display: inline-block;\r\n}\r\n\r\n\r\n/* ── Debug Section ── */\r\n#debug-section {\r\n    margin-top: auto;\r\n    padding-top: 8px;\r\n}\r\n\r\ndetails {\r\n    background: transparent;\r\n    border: none;\r\n    border-radius: var(--radius);\r\n}\r\n\r\nsummary {\r\n    padding: 5px 0;\r\n    cursor: pointer;\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    color: var(--text-3);\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 5px;\r\n    list-style: none;\r\n    user-select: none;\r\n    transition: color 0.15s;\r\n}\r\n\r\nsummary::-webkit-details-marker {\r\n    display: none;\r\n}\r\n\r\nsummary:hover {\r\n    color: var(--text-2);\r\n}\r\n\r\ndetails[open] summary svg {\r\n    transform: rotate(180deg);\r\n}\r\n\r\nsummary svg {\r\n    transition: transform 0.15s;\r\n}\r\n\r\ndetails[open] summary {\r\n    margin-bottom: 5px;\r\n}\r\n\r\npre {\r\n    margin: 0;\r\n    padding: 11px;\r\n    background: var(--input-bg);\r\n    color: var(--text-2);\r\n    font-family: var(--mono);\r\n    font-size: 11px;\r\n    overflow-x: auto;\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 9px;\r\n    line-height: 1.55;\r\n    white-space: pre-wrap;\r\n    word-break: break-all;\r\n    max-height: 180px;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* PERFORMANCE — Skip rendering of offscreen/hidden content        */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n\r\n/* Hidden panels should not trigger layout/paint until opened */\r\n#settings-panel[style*=\"display: none\"],\r\n#docs-panel[style*=\"display: none\"] {\r\n    content-visibility: hidden;\r\n}\r\n\r\n/* Offscreen scrollable areas: skip rendering until scrolled into view */\r\n.agent-scroll-area,\r\n.chat-messages {\r\n    content-visibility: auto;\r\n    contain-intrinsic-size: 0 500px;\r\n}\r\n\r\n/* Reduce paint complexity during transitions: composite-only props */\r\n.chip,\r\n.suggestion-chip,\r\n.category-tab,\r\n.btn-icon,\r\n.btn-primary,\r\n.btn-send {\r\n    contain: layout style;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* SIDELOAD — Skeleton Loading Screen                              */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.sideload-container {\r\n    height: 100vh;\r\n    display: flex;\r\n    flex-direction: column;\r\n    background: var(--bg);\r\n    overflow: hidden;\r\n}\r\n\r\n.sideload-skeleton {\r\n    display: flex;\r\n    flex-direction: column;\r\n    width: 100%;\r\n    height: 100%;\r\n    animation: fadeIn 0.3s ease-out;\r\n}\r\n\r\n/* ── Premium Shimmer — GPU-accelerated glass wave ── */\r\n.sk-shimmer,\r\n.skeleton-line,\r\n.skeleton-pill {\r\n    position: relative;\r\n    overflow: hidden;\r\n    background: var(--card-border);\r\n}\r\n\r\n.sk-shimmer::after,\r\n.skeleton-line::after,\r\n.skeleton-pill::after {\r\n    content: '';\r\n    position: absolute;\r\n    inset: 0;\r\n    transform: translateX(-100%);\r\n    background: linear-gradient(\r\n        90deg,\r\n        transparent 0%,\r\n        rgba(255, 255, 255, 0.08) 25%,\r\n        rgba(255, 255, 255, 0.45) 50%,\r\n        rgba(255, 255, 255, 0.08) 75%,\r\n        transparent 100%\r\n    );\r\n    animation: shimmerWave 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;\r\n}\r\n\r\n/* Staggered wave within groups */\r\n.sk-brand .sk-shimmer:nth-child(2)::after,\r\n.sk-welcome .sk-shimmer:nth-child(2)::after,\r\n.skeleton-line:nth-child(2)::after { animation-delay: 0.12s; }\r\n\r\n.sk-welcome .sk-shimmer:nth-child(3)::after,\r\n.skeleton-line:nth-child(3)::after { animation-delay: 0.24s; }\r\n\r\n.sk-welcome .sk-shimmer:nth-child(4)::after { animation-delay: 0.36s; }\r\n\r\n.sk-suggestions .sk-shimmer:nth-child(2)::after { animation-delay: 0.1s; }\r\n.sk-suggestions .sk-shimmer:nth-child(3)::after { animation-delay: 0.2s; }\r\n\r\n.sk-mode-toggle .sk-shimmer:nth-child(2)::after { animation-delay: 0.1s; }\r\n\r\n/* ── Panel Skeleton — loading state for panels ── */\r\n.panel-skeleton {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 12px;\r\n    padding: 20px;\r\n}\r\n\r\n.panel-skeleton .sk-heading {\r\n    width: 55%;\r\n    height: 18px;\r\n    border-radius: 6px;\r\n}\r\n\r\n.panel-skeleton .sk-badge {\r\n    width: 90px;\r\n    height: 22px;\r\n    border-radius: 12px;\r\n}\r\n\r\n.panel-skeleton .sk-row {\r\n    display: flex;\r\n    gap: 12px;\r\n}\r\n\r\n.panel-skeleton .sk-block {\r\n    flex: 1;\r\n    height: 56px;\r\n    border-radius: 10px;\r\n}\r\n\r\n.panel-skeleton .sk-bar {\r\n    height: 13px;\r\n    border-radius: 5px;\r\n}\r\n\r\n.panel-skeleton .sk-bar.w70 { width: 70%; }\r\n.panel-skeleton .sk-bar.w50 { width: 50%; }\r\n.panel-skeleton .sk-bar.w85 { width: 85%; }\r\n.panel-skeleton .sk-bar.w40 { width: 40%; }\r\n\r\n.sk-header {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    padding: 13px 16px;\r\n    border-bottom: 1px solid var(--card-border);\r\n}\r\n\r\n.sk-brand {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 9px;\r\n}\r\n\r\n.sk-logo {\r\n    width: 24px;\r\n    height: 24px;\r\n    border-radius: 7px;\r\n}\r\n\r\n.sk-title {\r\n    width: 105px;\r\n    height: 15px;\r\n    border-radius: 5px;\r\n}\r\n\r\n.sk-header-actions {\r\n    display: flex;\r\n    gap: 5px;\r\n}\r\n\r\n.sk-icon-btn {\r\n    width: 32px;\r\n    height: 32px;\r\n    border-radius: 9px;\r\n}\r\n\r\n.sk-mode-toggle {\r\n    display: flex;\r\n    gap: 4px;\r\n    padding: 8px 6px;\r\n    border-bottom: 1px solid var(--card-border);\r\n}\r\n\r\n.sk-mode-tab {\r\n    flex: 1;\r\n    height: 36px;\r\n    border-radius: 9px;\r\n}\r\n\r\n.sk-welcome {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    padding: 34px 20px 18px;\r\n    gap: 11px;\r\n}\r\n\r\n.sk-welcome-icon {\r\n    width: 52px;\r\n    height: 52px;\r\n    border-radius: 16px;\r\n}\r\n\r\n.sk-welcome-title {\r\n    width: 145px;\r\n    height: 19px;\r\n    border-radius: 6px;\r\n}\r\n\r\n.sk-welcome-desc {\r\n    width: 220px;\r\n    height: 13px;\r\n    border-radius: 5px;\r\n}\r\n\r\n.sk-welcome-desc.short {\r\n    width: 175px;\r\n}\r\n\r\n.sk-suggestions {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 8px;\r\n    padding: 10px 32px;\r\n}\r\n\r\n.sk-suggestion {\r\n    width: 100%;\r\n    height: 38px;\r\n    border-radius: 10px;\r\n}\r\n\r\n.sk-suggestion:nth-child(2) {\r\n    animation-delay: 0.1s;\r\n}\r\n\r\n.sk-suggestion:nth-child(3) {\r\n    animation-delay: 0.2s;\r\n}\r\n\r\n.sk-suggestion:nth-child(4) {\r\n    animation-delay: 0.3s;\r\n}\r\n\r\n.sk-input-area {\r\n    margin-top: auto;\r\n    padding: 12px 16px 8px;\r\n    border-top: 1px solid var(--card-border);\r\n}\r\n\r\n.sk-input {\r\n    width: 100%;\r\n    height: 42px;\r\n    border-radius: 14px;\r\n}\r\n\r\n.sideload-status {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 9px;\r\n    padding: 11px;\r\n    font-size: 11.5px;\r\n    font-weight: 500;\r\n    color: var(--text-3);\r\n}\r\n\r\n.sideload-pulse {\r\n    width: 8px;\r\n    height: 8px;\r\n    border-radius: 50%;\r\n    background: var(--primary);\r\n    animation: pulse 1.5s ease-in-out infinite;\r\n    box-shadow: 0 0 8px var(--primary-glow);\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* KEYFRAMES                                                       */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n@keyframes fadeIn {\r\n    from {\r\n        opacity: 0;\r\n        transform: translateY(3px);\r\n    }\r\n\r\n    to {\r\n        opacity: 1;\r\n        transform: translateY(0);\r\n    }\r\n}\r\n\r\n@keyframes slideDown {\r\n    from {\r\n        opacity: 0;\r\n        transform: translateY(-6px);\r\n    }\r\n\r\n    to {\r\n        opacity: 1;\r\n        transform: translateY(0);\r\n    }\r\n}\r\n\r\n@keyframes spin {\r\n    to {\r\n        transform: rotate(360deg);\r\n    }\r\n}\r\n\r\n@keyframes shimmerWave {\r\n    0% {\r\n        transform: translateX(-100%);\r\n    }\r\n\r\n    100% {\r\n        transform: translateX(100%);\r\n    }\r\n}\r\n\r\n@keyframes msgSlideIn {\r\n    from {\r\n        opacity: 0;\r\n        transform: translateY(6px);\r\n    }\r\n\r\n    to {\r\n        opacity: 1;\r\n        transform: translateY(0);\r\n    }\r\n}\r\n\r\n@keyframes typingBounce {\r\n\r\n    0%,\r\n    100% {\r\n        transform: translateY(0);\r\n        opacity: 0.4;\r\n    }\r\n\r\n    50% {\r\n        transform: translateY(-4px);\r\n        opacity: 1;\r\n    }\r\n}\r\n\r\n@keyframes pulse {\r\n\r\n    0%,\r\n    100% {\r\n        opacity: 0.4;\r\n        transform: scale(0.85);\r\n    }\r\n\r\n    50% {\r\n        opacity: 1;\r\n        transform: scale(1.15);\r\n    }\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* SCROLL FIXES                                                    */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n\r\n/* Chat messages area scrolls */\r\n.chat-messages {\r\n    flex: 1;\r\n    overflow-y: auto !important;\r\n    min-height: 0;\r\n    padding-bottom: 40px;\r\n    scroll-behavior: smooth;\r\n    -webkit-overflow-scrolling: touch;\r\n}\r\n\r\n/* Content-wrapper is a flex container, NOT a scroller */\r\n.content-wrapper {\r\n    flex: 1;\r\n    display: flex;\r\n    flex-direction: column;\r\n    overflow: hidden !important;\r\n    min-height: 0;\r\n}\r\n\r\n/* Ensure parent containers occupy full height but don't scroll themselves */\r\n#agent-mode,\r\n#planning-mode {\r\n    display: none;\r\n    height: 100%;\r\n    overflow: hidden;\r\n    flex-direction: column;\r\n}\r\n\r\n#agent-mode.active,\r\n#planning-mode.active {\r\n    display: flex;\r\n}\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* SCROLLBAR STYLING                                               */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n::-webkit-scrollbar {\r\n    width: 6px;\r\n    height: 6px;\r\n}\r\n\r\n::-webkit-scrollbar-track {\r\n    background: transparent;\r\n}\r\n\r\n::-webkit-scrollbar-thumb {\r\n    background: rgba(0, 0, 0, 0.15);\r\n    border-radius: 4px;\r\n}\r\n\r\n::-webkit-scrollbar-thumb:hover {\r\n    background: rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* PRODUCTION OPTIMIZATIONS (RESPONSIVE & PERFORMANCE)             */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n\r\n/* 1. Hardware Acceleration for Animations (targeted, not global) */\r\n.chat-msg {\r\n    will-change: transform, opacity;\r\n    backface-visibility: hidden;\r\n}\r\n\r\n/* Only apply GPU hints on hover/active states to avoid memory overhead */\r\n.chip:hover,\r\n.suggestion-chip:hover,\r\n.category-tab:hover,\r\n.btn-icon:hover {\r\n    will-change: transform;\r\n}\r\n\r\n/* 2. Responsive Tweaks for Narrow Taskpanes (< 360px) */\r\n@media (max-width: 360px) {\r\n    :root {\r\n        --radius-lg: 10px;\r\n        /* Tighter corners */\r\n    }\r\n\r\n    .app-header {\r\n        padding: 8px 12px;\r\n    }\r\n\r\n    .chat-bubble {\r\n        font-size: 11.5px;\r\n        padding: 8px 12px;\r\n        max-width: 88%;\r\n    }\r\n\r\n    .chip {\r\n        font-size: 10px;\r\n        padding: 5px 9px;\r\n    }\r\n\r\n    .category-tab {\r\n        padding: 5px 9px;\r\n        font-size: 10px;\r\n    }\r\n\r\n    /* Stack form groups tighter */\r\n    .form-group {\r\n        margin-bottom: 10px;\r\n    }\r\n\r\n    /* Ensure code blocks don't overflow */\r\n    .chat-bubble pre {\r\n        font-size: 10px;\r\n        padding: 8px;\r\n    }\r\n}\r\n\r\n/* 3. High-DPI Screens (Retina) Text Sharpness */\r\n@media (-webkit-min-device-pixel-ratio: 2),\r\n(min-resolution: 192dpi) {\r\n    body {\r\n        -webkit-font-smoothing: antialiased;\r\n        -moz-osx-font-smoothing: grayscale;\r\n    }\r\n}\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* ANIMATION ENHANCEMENTS                                          */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n\r\n/* Make transitions smoother */\r\n.chip,\r\n.suggestion-chip,\r\n.category-tab,\r\n.btn-icon,\r\n.btn-primary,\r\n.btn-send {\r\n    transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);\r\n    /* A bit of overshoot */\r\n}\r\n\r\n/* More pronounced hover effect for chips */\r\n.chip:hover,\r\n.suggestion-chip:hover,\r\n.category-tab:hover {\r\n    transform: translateY(-2px);\r\n    box-shadow: var(--shadow-md);\r\n}\r\n\r\n/* Remove the translateX from suggestion-chip to be consistent */\r\n.suggestion-chip:hover {\r\n    transform: translateY(-2px);\r\n}\r\n\r\n/* Add hover effect to icon buttons */\r\n.btn-icon:hover {\r\n    transform: translateY(-2px) scale(1.05);\r\n    box-shadow: var(--shadow-md);\r\n}\r\n\r\n\r\n\r\n@keyframes tabPulse {\r\n    0% {\r\n        box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.15);\r\n    }\r\n\r\n    70% {\r\n        box-shadow: 0 0 0 4px rgba(74, 144, 226, 0);\r\n    }\r\n\r\n    100% {\r\n        box-shadow: 0 0 0 0 rgba(74, 144, 226, 0);\r\n    }\r\n}\r\n\r\n.chat-msg {\r\n    animation: msgSlideIn 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;\r\n}\r\n\r\n/* Better button press feedback */\r\n.btn-primary:active,\r\n.btn-send:active,\r\n.btn-icon:active,\r\n.chip:active,\r\n.suggestion-chip:active,\r\n.category-tab:active {\r\n    transform: scale(0.95) !important;\r\n    /* Use important to override hover transforms */\r\n    transition-duration: 0.1s;\r\n}\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* BUSINESS MODULES                                                */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.modules-grid {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 12px;\r\n    margin-top: 16px;\r\n}\r\n\r\n.module-card {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 16px;\r\n    padding: 16px;\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: var(--radius-lg);\r\n    transition: all 0.2s ease;\r\n}\r\n\r\n.module-card:hover {\r\n    transform: translateY(-2px);\r\n    box-shadow: var(--shadow-md);\r\n    border-color: var(--primary-light);\r\n}\r\n\r\n.module-icon {\r\n    font-size: 24px;\r\n    width: 48px;\r\n    height: 48px;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    background: var(--bg);\r\n    border-radius: 12px;\r\n}\r\n\r\n.module-info {\r\n    flex: 1;\r\n}\r\n\r\n.module-info h3 {\r\n    margin: 0 0 4px;\r\n    font-size: 14px;\r\n    font-weight: 600;\r\n}\r\n\r\n.module-info p {\r\n    margin: 0;\r\n    font-size: 12px;\r\n    color: var(--text-2);\r\n    line-height: 1.4;\r\n}\r\n\r\n.module-preview-area {\r\n    margin-top: 24px;\r\n    padding: 16px;\r\n    background: var(--primary-bg);\r\n    border-radius: var(--radius-lg);\r\n    border: 1px dashed var(--primary);\r\n}\r\n\r\n.badge-gold {\r\n    background: #FFF9E6;\r\n    color: #B28B00;\r\n    border: 1px solid #FFE699;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* TOAST NOTIFICATION SYSTEM                                       */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.toast-container {\r\n    position: fixed;\r\n    bottom: 20px;\r\n    left: 50%;\r\n    transform: translateX(-50%);\r\n    z-index: 10000;\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    gap: 8px;\r\n    pointer-events: none;\r\n}\r\n\r\n.toast {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 8px;\r\n    padding: 10px 16px;\r\n    border-radius: 12px;\r\n    font-size: 12px;\r\n    font-weight: 500;\r\n    font-family: var(--font);\r\n    box-shadow: var(--shadow-lg);\r\n    animation: toastIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);\r\n    pointer-events: auto;\r\n    backdrop-filter: blur(12px);\r\n    -webkit-backdrop-filter: blur(12px);\r\n    max-width: 280px;\r\n}\r\n\r\n.toast.toast-out {\r\n    animation: toastOut 0.3s ease-in forwards;\r\n}\r\n\r\n.toast.toast-success {\r\n    background: rgba(45, 106, 79, 0.92);\r\n    color: white;\r\n    border: 1px solid rgba(82, 183, 136, 0.3);\r\n}\r\n\r\n.toast.toast-error {\r\n    background: rgba(184, 58, 58, 0.92);\r\n    color: white;\r\n    border: 1px solid rgba(224, 96, 96, 0.3);\r\n}\r\n\r\n.toast.toast-info {\r\n    background: rgba(255, 255, 255, 0.92);\r\n    color: var(--text);\r\n    border: 1px solid var(--card-border);\r\n}\r\n\r\n@media (prefers-color-scheme: dark) {\r\n    .toast.toast-info {\r\n        background: rgba(33, 34, 36, 0.92);\r\n        color: var(--text);\r\n        border: 1px solid var(--card-border);\r\n    }\r\n}\r\n\r\n.toast svg {\r\n    width: 14px;\r\n    height: 14px;\r\n    flex-shrink: 0;\r\n}\r\n\r\n@keyframes toastIn {\r\n    from {\r\n        opacity: 0;\r\n        transform: translateY(16px) scale(0.95);\r\n    }\r\n\r\n    to {\r\n        opacity: 1;\r\n        transform: translateY(0) scale(1);\r\n    }\r\n}\r\n\r\n@keyframes toastOut {\r\n    from {\r\n        opacity: 1;\r\n        transform: translateY(0) scale(1);\r\n    }\r\n\r\n    to {\r\n        opacity: 0;\r\n        transform: translateY(10px) scale(0.95);\r\n    }\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* COPY-TO-CLIPBOARD BUTTON (AI Bubble)                            */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.chat-bubble-actions {\r\n    display: flex;\r\n    gap: 4px;\r\n    margin-top: 8px;\r\n    opacity: 0;\r\n    transition: opacity 0.2s ease;\r\n}\r\n\r\n.chat-msg.ai:hover .chat-bubble-actions {\r\n    opacity: 1;\r\n}\r\n\r\n.btn-copy {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    gap: 4px;\r\n    padding: 3px 8px;\r\n    font-size: 10px;\r\n    font-weight: 500;\r\n    font-family: var(--font);\r\n    color: var(--text-3);\r\n    background: var(--input-bg);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 6px;\r\n    cursor: pointer;\r\n    transition: all 0.2s ease;\r\n}\r\n\r\n.btn-copy:hover {\r\n    color: var(--primary);\r\n    border-color: var(--primary-glow);\r\n    background: var(--primary-bg);\r\n}\r\n\r\n.btn-copy.copied {\r\n    color: var(--success);\r\n    border-color: rgba(45, 106, 79, 0.2);\r\n    background: var(--success-bg);\r\n}\r\n\r\n.btn-copy svg {\r\n    width: 11px;\r\n    height: 11px;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* SMOOTH MODE CROSSFADE                                           */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.mode-content {\r\n    animation: modeFadeIn 0.3s ease-out;\r\n}\r\n\r\n@keyframes modeFadeIn {\r\n    from {\r\n        opacity: 0;\r\n        transform: translateY(4px);\r\n    }\r\n\r\n    to {\r\n        opacity: 1;\r\n        transform: translateY(0);\r\n    }\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* SCROLL-TO-BOTTOM FAB                                            */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.scroll-to-bottom {\r\n    position: absolute;\r\n    bottom: 80px;\r\n    right: 18px;\r\n    width: 32px;\r\n    height: 32px;\r\n    border-radius: 50%;\r\n    background: var(--card);\r\n    border: 1px solid var(--card-border);\r\n    color: var(--text-2);\r\n    cursor: pointer;\r\n    display: none;\r\n    align-items: center;\r\n    justify-content: center;\r\n    box-shadow: var(--shadow-md);\r\n    z-index: 10;\r\n    transition: all 0.2s ease;\r\n    animation: fadeIn 0.2s ease-out;\r\n}\r\n\r\n.scroll-to-bottom:hover {\r\n    background: var(--primary-bg);\r\n    color: var(--primary);\r\n    border-color: var(--primary-glow);\r\n    transform: translateY(-2px);\r\n}\r\n\r\n.scroll-to-bottom.visible {\r\n    display: flex;\r\n}\r\n\r\n.scroll-to-bottom svg {\r\n    width: 16px;\r\n    height: 16px;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* CHARACTER COUNT INDICATOR                                       */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.char-count {\r\n    font-size: 10px;\r\n    color: var(--text-4);\r\n    font-weight: 500;\r\n    font-variant-numeric: tabular-nums;\r\n    transition: color 0.2s ease;\r\n    min-width: 28px;\r\n    text-align: right;\r\n}\r\n\r\n.char-count.warning {\r\n    color: var(--warning);\r\n}\r\n\r\n.char-count.danger {\r\n    color: var(--error);\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* KEYBOARD SHORTCUT BADGE                                         */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.kbd-hint {\r\n    font-size: 9px;\r\n    font-weight: 500;\r\n    color: var(--text-4);\r\n    background: var(--input-bg);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: 4px;\r\n    padding: 1px 5px;\r\n    font-family: var(--mono);\r\n    letter-spacing: 0.02em;\r\n    pointer-events: none;\r\n    white-space: nowrap;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* STAGGERED SUGGESTION ANIMATION                                  */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.suggestion-chip:nth-child(1) {\r\n    animation-delay: 0.05s;\r\n}\r\n\r\n.suggestion-chip:nth-child(2) {\r\n    animation-delay: 0.1s;\r\n}\r\n\r\n.suggestion-chip:nth-child(3) {\r\n    animation-delay: 0.15s;\r\n}\r\n\r\n.suggestion-chip:nth-child(4) {\r\n    animation-delay: 0.2s;\r\n}\r\n\r\n.suggestion-chip {\r\n    animation: msgSlideIn 0.4s cubic-bezier(0.19, 1, 0.22, 1) both;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* ENHANCED INPUT FOCUS GLOW                                       */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.input-card:focus-within,\r\n.chat-input-card:focus-within {\r\n    border-color: var(--primary);\r\n    box-shadow: 0 0 0 3px var(--primary-glow), var(--shadow-md);\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* SETTINGS SAVE SUCCESS ANIMATION                                 */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.btn-save.saved {\r\n    background: var(--success);\r\n    box-shadow: 0 2px 8px rgba(45, 106, 79, 0.3);\r\n}\r\n\r\n@keyframes successPop {\r\n    0% {\r\n        transform: scale(1);\r\n    }\r\n\r\n    50% {\r\n        transform: scale(1.05);\r\n    }\r\n\r\n    100% {\r\n        transform: scale(1);\r\n    }\r\n}\r\n\r\n.btn-save.saved {\r\n    animation: successPop 0.3s ease;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* CHAT WELCOME STAGGER                                            */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.chat-welcome img {\r\n    animation: fadeIn 0.5s ease-out both;\r\n    animation-delay: 0.1s;\r\n}\r\n\r\n.chat-welcome h2 {\r\n    animation: fadeIn 0.5s ease-out both;\r\n    animation-delay: 0.2s;\r\n}\r\n\r\n.chat-welcome .welcome-suggestions {\r\n    animation: fadeIn 0.5s ease-out both;\r\n    animation-delay: 0.3s;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* RIPPLE EFFECT ON BUTTONS                                        */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.btn-primary,\r\n.btn-send,\r\n.chip,\r\n.category-tab {\r\n    position: relative;\r\n    overflow: hidden;\r\n}\r\n\r\n.btn-primary::after,\r\n.btn-send::after {\r\n    content: '';\r\n    position: absolute;\r\n    inset: 0;\r\n    background: radial-gradient(circle at var(--ripple-x, 50%) var(--ripple-y, 50%), rgba(255, 255, 255, 0.25) 0%, transparent 60%);\r\n    opacity: 0;\r\n    transition: opacity 0.4s ease;\r\n    pointer-events: none;\r\n}\r\n\r\n.btn-primary:active::after,\r\n.btn-send:active::after {\r\n    opacity: 1;\r\n    transition: opacity 0s;\r\n}\r\n\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* IMPROVED DARK MODE SCROLLBAR                                    */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n@media (prefers-color-scheme: dark) {\r\n    ::-webkit-scrollbar-thumb {\r\n        background: rgba(255, 255, 255, 0.12);\r\n    }\r\n\r\n    ::-webkit-scrollbar-thumb:hover {\r\n        background: rgba(255, 255, 255, 0.22);\r\n    }\r\n}\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* BATCH PDF EXTRACTION PANEL                                      */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n.batch-panel {\r\n    margin: 10px 14px;\r\n    padding: 14px;\r\n    background: var(--card);\r\n    border: 1.5px solid var(--primary-glow);\r\n    border-radius: var(--radius-lg);\r\n    box-shadow: var(--shadow-md);\r\n    animation: slideDown 0.22s ease-out;\r\n}\r\n\r\n.batch-panel-header {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.batch-panel-title {\r\n    font-size: 12px;\r\n    font-weight: 700;\r\n    color: var(--primary);\r\n    letter-spacing: -0.01em;\r\n}\r\n\r\n.batch-file-count {\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    color: var(--text-3);\r\n    background: var(--primary-bg);\r\n    padding: 2px 8px;\r\n    border-radius: 20px;\r\n}\r\n\r\n.batch-instruction {\r\n    width: 100%;\r\n    padding: 9px 11px;\r\n    font-size: 12.5px;\r\n    font-family: var(--font);\r\n    color: var(--text);\r\n    background: var(--input-bg);\r\n    border: 1px solid var(--card-border);\r\n    border-radius: var(--radius);\r\n    outline: none;\r\n    resize: none;\r\n    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;\r\n    margin-bottom: 10px;\r\n    line-height: 1.5;\r\n}\r\n\r\n.batch-instruction:focus {\r\n    border-color: var(--primary);\r\n    box-shadow: 0 0 0 3px var(--primary-glow);\r\n}\r\n\r\n.btn-batch-extract {\r\n    width: 100%;\r\n    justify-content: center;\r\n    gap: 7px;\r\n    font-size: 13px;\r\n    padding: 10px;\r\n    background: var(--primary);\r\n    color: white;\r\n    border: none;\r\n    border-radius: var(--radius);\r\n    cursor: pointer;\r\n    font-weight: 600;\r\n    font-family: var(--font);\r\n    display: flex;\r\n    align-items: center;\r\n    transition: all 0.2s ease-out;\r\n    box-shadow: 0 3px 10px rgba(45, 106, 79, 0.3);\r\n}\r\n\r\n.btn-batch-extract:hover {\r\n    background: var(--primary-hover);\r\n    transform: translateY(-1px);\r\n    box-shadow: 0 5px 16px rgba(45, 106, 79, 0.38);\r\n}\r\n\r\n.btn-batch-extract:disabled {\r\n    opacity: 0.55;\r\n    cursor: not-allowed;\r\n    transform: none;\r\n}\r\n\r\n.batch-progress-wrap {\r\n    margin-top: 12px;\r\n}\r\n\r\n.batch-progress-bar-track {\r\n    height: 6px;\r\n    background: var(--input-bg);\r\n    border-radius: 99px;\r\n    overflow: hidden;\r\n}\r\n\r\n.batch-progress-bar {\r\n    height: 100%;\r\n    background: linear-gradient(90deg, var(--primary), var(--primary-light));\r\n    border-radius: 99px;\r\n    transition: width 0.4s ease-out;\r\n    position: relative;\r\n    overflow: hidden;\r\n}\r\n\r\n.batch-progress-bar::after {\r\n    content: '';\r\n    position: absolute;\r\n    top: 0;\r\n    left: -60%;\r\n    width: 60%;\r\n    height: 100%;\r\n    background: rgba(255, 255, 255, 0.3);\r\n    animation: shimmerSlide 1.2s linear infinite;\r\n}\r\n\r\n@keyframes shimmerSlide {\r\n    to {\r\n        left: 160%;\r\n    }\r\n}\r\n\r\n.batch-progress-label {\r\n    font-size: 11px;\r\n    color: var(--text-3);\r\n    text-align: right;\r\n    margin-top: 4px;\r\n    font-weight: 600;\r\n}\r\n\r\n.batch-log {\r\n    margin-top: 10px;\r\n    max-height: 100px;\r\n    overflow-y: auto;\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 3px;\r\n}\r\n\r\n.batch-log-entry {\r\n    font-size: 11px;\r\n    font-family: var(--mono);\r\n    color: var(--text-2);\r\n    padding: 2px 6px;\r\n    border-radius: 4px;\r\n    display: flex;\r\n    gap: 6px;\r\n    align-items: center;\r\n}\r\n\r\n.batch-log-entry.success {\r\n    color: var(--success);\r\n    background: var(--success-bg);\r\n}\r\n\r\n.batch-log-entry.error {\r\n    color: var(--error);\r\n    background: var(--error-bg);\r\n}\r\n\r\n.batch-log-entry.info {\r\n    color: var(--text-3);\r\n    background: var(--input-bg);\r\n}\r\n\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n/* AI EDITING ANIMATION & DIFF VIEW                                */\r\n/* ═══════════════════════════════════════════════════════════════ */\r\n\r\n/* ── Live Editing Overlay ── */\r\n.ai-editing-overlay {\r\n    display: none;\r\n    flex-direction: column;\r\n    gap: 0;\r\n    border-radius: var(--radius-lg);\r\n    overflow: hidden;\r\n    border: 1px solid var(--primary-glow);\r\n    background: var(--card);\r\n    box-shadow: 0 0 0 1px var(--primary-glow), var(--shadow-md);\r\n    animation: overlayAppear 0.35s cubic-bezier(0.16, 1, 0.3, 1);\r\n}\r\n\r\n.ai-editing-overlay.active {\r\n    display: flex;\r\n}\r\n\r\n@keyframes overlayAppear {\r\n    from { opacity: 0; transform: translateY(6px) scale(0.98); }\r\n    to   { opacity: 1; transform: translateY(0) scale(1); }\r\n}\r\n\r\n/* Header bar */\r\n.ai-edit-header {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 8px;\r\n    padding: 10px 14px;\r\n    background: linear-gradient(135deg, var(--primary-bg), transparent);\r\n    border-bottom: 1px solid var(--card-border);\r\n}\r\n\r\n.ai-edit-header .pulse-dot {\r\n    width: 8px;\r\n    height: 8px;\r\n    border-radius: 50%;\r\n    background: var(--primary);\r\n    animation: pulseDot 1.4s ease-in-out infinite;\r\n    flex-shrink: 0;\r\n}\r\n\r\n@keyframes pulseDot {\r\n    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 var(--primary); }\r\n    50%      { opacity: 0.6; box-shadow: 0 0 0 6px transparent; }\r\n}\r\n\r\n.ai-edit-header .edit-label {\r\n    font-size: 12px;\r\n    font-weight: 600;\r\n    color: var(--primary);\r\n    letter-spacing: 0.3px;\r\n}\r\n\r\n.ai-edit-header .edit-phase {\r\n    font-size: 11px;\r\n    color: var(--text-3);\r\n    margin-left: auto;\r\n    font-weight: 500;\r\n}\r\n\r\n/* Fake code lines area */\r\n.ai-edit-lines {\r\n    padding: 10px 0;\r\n    max-height: 180px;\r\n    overflow: hidden;\r\n    position: relative;\r\n    background: var(--input-bg);\r\n}\r\n\r\n.ai-edit-lines::after {\r\n    content: '';\r\n    position: absolute;\r\n    bottom: 0;\r\n    left: 0;\r\n    right: 0;\r\n    height: 40px;\r\n    background: linear-gradient(transparent, var(--input-bg));\r\n    pointer-events: none;\r\n}\r\n\r\n.ai-edit-line {\r\n    display: flex;\r\n    align-items: center;\r\n    padding: 1px 12px 1px 0;\r\n    font-family: var(--mono);\r\n    font-size: 11px;\r\n    line-height: 20px;\r\n    opacity: 0;\r\n    transform: translateY(6px);\r\n    animation: lineAppear 0.3s ease forwards;\r\n}\r\n\r\n.ai-edit-line .line-gutter {\r\n    width: 36px;\r\n    text-align: right;\r\n    padding-right: 10px;\r\n    color: var(--text-4);\r\n    font-size: 10px;\r\n    flex-shrink: 0;\r\n    user-select: none;\r\n}\r\n\r\n.ai-edit-line .line-content {\r\n    flex: 1;\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n}\r\n\r\n.ai-edit-line.added {\r\n    background: rgba(45, 106, 79, 0.08);\r\n}\r\n\r\n.ai-edit-line.added .line-gutter {\r\n    color: var(--primary);\r\n    font-weight: 600;\r\n}\r\n\r\n.ai-edit-line.added .line-content {\r\n    color: var(--primary);\r\n}\r\n\r\n.ai-edit-line.removed {\r\n    background: rgba(184, 58, 58, 0.07);\r\n}\r\n\r\n.ai-edit-line.removed .line-gutter {\r\n    color: var(--error);\r\n    font-weight: 600;\r\n}\r\n\r\n.ai-edit-line.removed .line-content {\r\n    color: var(--error);\r\n    text-decoration: line-through;\r\n    opacity: 0.7;\r\n}\r\n\r\n.ai-edit-line.context .line-content {\r\n    color: var(--text-3);\r\n}\r\n\r\n@keyframes lineAppear {\r\n    to { opacity: 1; transform: translateY(0); }\r\n}\r\n\r\n/* Typing cursor */\r\n.ai-edit-line .typing-cursor {\r\n    display: inline-block;\r\n    width: 2px;\r\n    height: 14px;\r\n    background: var(--primary);\r\n    margin-left: 2px;\r\n    vertical-align: middle;\r\n    animation: blink 0.5s step-end infinite;\r\n    border-radius: 1px;\r\n}\r\n\r\n@keyframes blink {\r\n    50% { opacity: 0; }\r\n}\r\n\r\n/* Progress bar at bottom of overlay */\r\n.ai-edit-progress {\r\n    height: 3px;\r\n    background: var(--input-bg);\r\n    position: relative;\r\n    overflow: hidden;\r\n}\r\n\r\n.ai-edit-progress .bar {\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    height: 100%;\r\n    width: 0%;\r\n    background: linear-gradient(90deg, var(--primary), var(--primary-light));\r\n    border-radius: 0 2px 2px 0;\r\n    transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);\r\n}\r\n\r\n.ai-edit-progress .shimmer {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    height: 100%;\r\n    background: linear-gradient(\r\n        90deg,\r\n        transparent,\r\n        rgba(255, 255, 255, 0.3),\r\n        transparent\r\n    );\r\n    animation: progressShimmer 1.8s ease-in-out infinite;\r\n}\r\n\r\n@keyframes progressShimmer {\r\n    0%   { transform: translateX(-100%); }\r\n    100% { transform: translateX(200%); }\r\n}\r\n\r\n/* ── Diff View (after execution) ── */\r\n.ai-diff-view {\r\n    display: none;\r\n    flex-direction: column;\r\n    border-radius: var(--radius-lg);\r\n    overflow: hidden;\r\n    border: 1px solid var(--card-border);\r\n    background: var(--card);\r\n    box-shadow: var(--shadow);\r\n    animation: diffAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1);\r\n}\r\n\r\n.ai-diff-view.active {\r\n    display: flex;\r\n}\r\n\r\n@keyframes diffAppear {\r\n    from { opacity: 0; transform: translateY(8px); }\r\n    to   { opacity: 1; transform: translateY(0); }\r\n}\r\n\r\n.ai-diff-header {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    padding: 8px 12px;\r\n    border-bottom: 1px solid var(--card-border);\r\n    background: var(--input-bg);\r\n}\r\n\r\n.ai-diff-title {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 6px;\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    color: var(--text-2);\r\n}\r\n\r\n.ai-diff-title svg {\r\n    color: var(--primary);\r\n}\r\n\r\n.ai-diff-stats {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 10px;\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    font-family: var(--mono);\r\n}\r\n\r\n.ai-diff-stats .stat-added {\r\n    color: var(--success);\r\n}\r\n\r\n.ai-diff-stats .stat-removed {\r\n    color: var(--error);\r\n}\r\n\r\n.ai-diff-body {\r\n    max-height: 220px;\r\n    overflow-y: auto;\r\n    overflow-x: hidden;\r\n    padding: 6px 0;\r\n    scrollbar-width: thin;\r\n}\r\n\r\n.diff-line {\r\n    display: flex;\r\n    align-items: stretch;\r\n    font-family: var(--mono);\r\n    font-size: 11px;\r\n    line-height: 20px;\r\n    padding: 0;\r\n    animation: diffLineIn 0.25s ease forwards;\r\n    opacity: 0;\r\n}\r\n\r\n@keyframes diffLineIn {\r\n    from { opacity: 0; }\r\n    to   { opacity: 1; }\r\n}\r\n\r\n.diff-line .diff-gutter {\r\n    width: 26px;\r\n    text-align: center;\r\n    padding: 0 2px;\r\n    flex-shrink: 0;\r\n    font-size: 11px;\r\n    font-weight: 700;\r\n    user-select: none;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n.diff-line .diff-text {\r\n    flex: 1;\r\n    padding: 0 10px;\r\n    white-space: pre;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n}\r\n\r\n/* Added lines */\r\n.diff-line.diff-added {\r\n    background: rgba(45, 106, 79, 0.06);\r\n}\r\n\r\n.diff-line.diff-added .diff-gutter {\r\n    background: rgba(45, 106, 79, 0.12);\r\n    color: var(--success);\r\n}\r\n\r\n.diff-line.diff-added .diff-text {\r\n    color: var(--text);\r\n}\r\n\r\n.diff-line.diff-added .diff-text .diff-highlight {\r\n    background: rgba(45, 106, 79, 0.15);\r\n    border-radius: 2px;\r\n    padding: 0 1px;\r\n}\r\n\r\n/* Removed lines */\r\n.diff-line.diff-removed {\r\n    background: rgba(184, 58, 58, 0.05);\r\n}\r\n\r\n.diff-line.diff-removed .diff-gutter {\r\n    background: rgba(184, 58, 58, 0.1);\r\n    color: var(--error);\r\n}\r\n\r\n.diff-line.diff-removed .diff-text {\r\n    color: var(--text-3);\r\n    text-decoration: line-through;\r\n}\r\n\r\n/* Context lines */\r\n.diff-line.diff-context .diff-gutter {\r\n    color: var(--text-4);\r\n}\r\n\r\n.diff-line.diff-context .diff-text {\r\n    color: var(--text-3);\r\n}\r\n\r\n/* Separator */\r\n.diff-separator {\r\n    padding: 3px 12px;\r\n    font-size: 10px;\r\n    color: var(--text-4);\r\n    font-family: var(--mono);\r\n    background: var(--input-bg);\r\n    border-top: 1px dashed var(--card-border);\r\n    border-bottom: 1px dashed var(--card-border);\r\n    text-align: center;\r\n    user-select: none;\r\n}\r\n\r\n/* Dismiss button */\r\n.ai-diff-dismiss {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    padding: 6px;\r\n    border-top: 1px solid var(--card-border);\r\n    background: var(--input-bg);\r\n    cursor: pointer;\r\n    transition: background 0.15s;\r\n}\r\n\r\n.ai-diff-dismiss:hover {\r\n    background: var(--card-hover);\r\n}\r\n\r\n.ai-diff-dismiss span {\r\n    font-size: 11px;\r\n    color: var(--text-3);\r\n    font-weight: 500;\r\n}\r\n\r\n/* Dark mode adjustments for diff */\r\n@media (prefers-color-scheme: dark) {\r\n    .diff-line.diff-added {\r\n        background: rgba(82, 183, 136, 0.08);\r\n    }\r\n    .diff-line.diff-added .diff-gutter {\r\n        background: rgba(82, 183, 136, 0.15);\r\n    }\r\n    .diff-line.diff-added .diff-text .diff-highlight {\r\n        background: rgba(82, 183, 136, 0.18);\r\n    }\r\n    .diff-line.diff-removed {\r\n        background: rgba(224, 96, 96, 0.08);\r\n    }\r\n    .diff-line.diff-removed .diff-gutter {\r\n        background: rgba(224, 96, 96, 0.12);\r\n    }\r\n    .ai-edit-line.added {\r\n        background: rgba(82, 183, 136, 0.1);\r\n    }\r\n    .ai-edit-line.removed {\r\n        background: rgba(224, 96, 96, 0.1);\r\n    }\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ (function(module) {

"use strict";


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

"use strict";


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

"use strict";


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

/***/ "./node_modules/pdfjs-dist/build/pdf.js":
/*!**********************************************!*\
  !*** ./node_modules/pdfjs-dist/build/pdf.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * @licstart The following is the entire license notice for the
 * JavaScript code in this page
 *
 * Copyright 2023 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend The above is the entire license notice for the
 * JavaScript code in this page
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = root.pdfjsLib = factory();
	else // removed by dead control flow
{}
})(globalThis, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VerbosityLevel = exports.Util = exports.UnknownErrorException = exports.UnexpectedResponseException = exports.TextRenderingMode = exports.RenderingIntentFlag = exports.PromiseCapability = exports.PermissionFlag = exports.PasswordResponses = exports.PasswordException = exports.PageActionEventType = exports.OPS = exports.MissingPDFException = exports.MAX_IMAGE_SIZE_TO_CACHE = exports.LINE_FACTOR = exports.LINE_DESCENT_FACTOR = exports.InvalidPDFException = exports.ImageKind = exports.IDENTITY_MATRIX = exports.FormatError = exports.FeatureTest = exports.FONT_IDENTITY_MATRIX = exports.DocumentActionEventType = exports.CMapCompressionType = exports.BaseException = exports.BASELINE_FACTOR = exports.AnnotationType = exports.AnnotationReplyType = exports.AnnotationPrefix = exports.AnnotationMode = exports.AnnotationFlag = exports.AnnotationFieldFlag = exports.AnnotationEditorType = exports.AnnotationEditorPrefix = exports.AnnotationEditorParamsType = exports.AnnotationBorderStyleType = exports.AnnotationActionEventType = exports.AbortException = void 0;
exports.assert = assert;
exports.bytesToString = bytesToString;
exports.createValidAbsoluteUrl = createValidAbsoluteUrl;
exports.getModificationDate = getModificationDate;
exports.getUuid = getUuid;
exports.getVerbosityLevel = getVerbosityLevel;
exports.info = info;
exports.isArrayBuffer = isArrayBuffer;
exports.isArrayEqual = isArrayEqual;
exports.isNodeJS = void 0;
exports.normalizeUnicode = normalizeUnicode;
exports.objectFromMap = objectFromMap;
exports.objectSize = objectSize;
exports.setVerbosityLevel = setVerbosityLevel;
exports.shadow = shadow;
exports.string32 = string32;
exports.stringToBytes = stringToBytes;
exports.stringToPDFString = stringToPDFString;
exports.stringToUTF8String = stringToUTF8String;
exports.unreachable = unreachable;
exports.utf8StringToString = utf8StringToString;
exports.warn = warn;
const isNodeJS = typeof process === "object" && process + "" === "[object process]" && !process.versions.nw && !(process.versions.electron && process.type && process.type !== "browser");
exports.isNodeJS = isNodeJS;
const IDENTITY_MATRIX = [1, 0, 0, 1, 0, 0];
exports.IDENTITY_MATRIX = IDENTITY_MATRIX;
const FONT_IDENTITY_MATRIX = [0.001, 0, 0, 0.001, 0, 0];
exports.FONT_IDENTITY_MATRIX = FONT_IDENTITY_MATRIX;
const MAX_IMAGE_SIZE_TO_CACHE = 10e6;
exports.MAX_IMAGE_SIZE_TO_CACHE = MAX_IMAGE_SIZE_TO_CACHE;
const LINE_FACTOR = 1.35;
exports.LINE_FACTOR = LINE_FACTOR;
const LINE_DESCENT_FACTOR = 0.35;
exports.LINE_DESCENT_FACTOR = LINE_DESCENT_FACTOR;
const BASELINE_FACTOR = LINE_DESCENT_FACTOR / LINE_FACTOR;
exports.BASELINE_FACTOR = BASELINE_FACTOR;
const RenderingIntentFlag = {
  ANY: 0x01,
  DISPLAY: 0x02,
  PRINT: 0x04,
  SAVE: 0x08,
  ANNOTATIONS_FORMS: 0x10,
  ANNOTATIONS_STORAGE: 0x20,
  ANNOTATIONS_DISABLE: 0x40,
  OPLIST: 0x100
};
exports.RenderingIntentFlag = RenderingIntentFlag;
const AnnotationMode = {
  DISABLE: 0,
  ENABLE: 1,
  ENABLE_FORMS: 2,
  ENABLE_STORAGE: 3
};
exports.AnnotationMode = AnnotationMode;
const AnnotationEditorPrefix = "pdfjs_internal_editor_";
exports.AnnotationEditorPrefix = AnnotationEditorPrefix;
const AnnotationEditorType = {
  DISABLE: -1,
  NONE: 0,
  FREETEXT: 3,
  STAMP: 13,
  INK: 15
};
exports.AnnotationEditorType = AnnotationEditorType;
const AnnotationEditorParamsType = {
  RESIZE: 1,
  CREATE: 2,
  FREETEXT_SIZE: 11,
  FREETEXT_COLOR: 12,
  FREETEXT_OPACITY: 13,
  INK_COLOR: 21,
  INK_THICKNESS: 22,
  INK_OPACITY: 23
};
exports.AnnotationEditorParamsType = AnnotationEditorParamsType;
const PermissionFlag = {
  PRINT: 0x04,
  MODIFY_CONTENTS: 0x08,
  COPY: 0x10,
  MODIFY_ANNOTATIONS: 0x20,
  FILL_INTERACTIVE_FORMS: 0x100,
  COPY_FOR_ACCESSIBILITY: 0x200,
  ASSEMBLE: 0x400,
  PRINT_HIGH_QUALITY: 0x800
};
exports.PermissionFlag = PermissionFlag;
const TextRenderingMode = {
  FILL: 0,
  STROKE: 1,
  FILL_STROKE: 2,
  INVISIBLE: 3,
  FILL_ADD_TO_PATH: 4,
  STROKE_ADD_TO_PATH: 5,
  FILL_STROKE_ADD_TO_PATH: 6,
  ADD_TO_PATH: 7,
  FILL_STROKE_MASK: 3,
  ADD_TO_PATH_FLAG: 4
};
exports.TextRenderingMode = TextRenderingMode;
const ImageKind = {
  GRAYSCALE_1BPP: 1,
  RGB_24BPP: 2,
  RGBA_32BPP: 3
};
exports.ImageKind = ImageKind;
const AnnotationType = {
  TEXT: 1,
  LINK: 2,
  FREETEXT: 3,
  LINE: 4,
  SQUARE: 5,
  CIRCLE: 6,
  POLYGON: 7,
  POLYLINE: 8,
  HIGHLIGHT: 9,
  UNDERLINE: 10,
  SQUIGGLY: 11,
  STRIKEOUT: 12,
  STAMP: 13,
  CARET: 14,
  INK: 15,
  POPUP: 16,
  FILEATTACHMENT: 17,
  SOUND: 18,
  MOVIE: 19,
  WIDGET: 20,
  SCREEN: 21,
  PRINTERMARK: 22,
  TRAPNET: 23,
  WATERMARK: 24,
  THREED: 25,
  REDACT: 26
};
exports.AnnotationType = AnnotationType;
const AnnotationReplyType = {
  GROUP: "Group",
  REPLY: "R"
};
exports.AnnotationReplyType = AnnotationReplyType;
const AnnotationFlag = {
  INVISIBLE: 0x01,
  HIDDEN: 0x02,
  PRINT: 0x04,
  NOZOOM: 0x08,
  NOROTATE: 0x10,
  NOVIEW: 0x20,
  READONLY: 0x40,
  LOCKED: 0x80,
  TOGGLENOVIEW: 0x100,
  LOCKEDCONTENTS: 0x200
};
exports.AnnotationFlag = AnnotationFlag;
const AnnotationFieldFlag = {
  READONLY: 0x0000001,
  REQUIRED: 0x0000002,
  NOEXPORT: 0x0000004,
  MULTILINE: 0x0001000,
  PASSWORD: 0x0002000,
  NOTOGGLETOOFF: 0x0004000,
  RADIO: 0x0008000,
  PUSHBUTTON: 0x0010000,
  COMBO: 0x0020000,
  EDIT: 0x0040000,
  SORT: 0x0080000,
  FILESELECT: 0x0100000,
  MULTISELECT: 0x0200000,
  DONOTSPELLCHECK: 0x0400000,
  DONOTSCROLL: 0x0800000,
  COMB: 0x1000000,
  RICHTEXT: 0x2000000,
  RADIOSINUNISON: 0x2000000,
  COMMITONSELCHANGE: 0x4000000
};
exports.AnnotationFieldFlag = AnnotationFieldFlag;
const AnnotationBorderStyleType = {
  SOLID: 1,
  DASHED: 2,
  BEVELED: 3,
  INSET: 4,
  UNDERLINE: 5
};
exports.AnnotationBorderStyleType = AnnotationBorderStyleType;
const AnnotationActionEventType = {
  E: "Mouse Enter",
  X: "Mouse Exit",
  D: "Mouse Down",
  U: "Mouse Up",
  Fo: "Focus",
  Bl: "Blur",
  PO: "PageOpen",
  PC: "PageClose",
  PV: "PageVisible",
  PI: "PageInvisible",
  K: "Keystroke",
  F: "Format",
  V: "Validate",
  C: "Calculate"
};
exports.AnnotationActionEventType = AnnotationActionEventType;
const DocumentActionEventType = {
  WC: "WillClose",
  WS: "WillSave",
  DS: "DidSave",
  WP: "WillPrint",
  DP: "DidPrint"
};
exports.DocumentActionEventType = DocumentActionEventType;
const PageActionEventType = {
  O: "PageOpen",
  C: "PageClose"
};
exports.PageActionEventType = PageActionEventType;
const VerbosityLevel = {
  ERRORS: 0,
  WARNINGS: 1,
  INFOS: 5
};
exports.VerbosityLevel = VerbosityLevel;
const CMapCompressionType = {
  NONE: 0,
  BINARY: 1
};
exports.CMapCompressionType = CMapCompressionType;
const OPS = {
  dependency: 1,
  setLineWidth: 2,
  setLineCap: 3,
  setLineJoin: 4,
  setMiterLimit: 5,
  setDash: 6,
  setRenderingIntent: 7,
  setFlatness: 8,
  setGState: 9,
  save: 10,
  restore: 11,
  transform: 12,
  moveTo: 13,
  lineTo: 14,
  curveTo: 15,
  curveTo2: 16,
  curveTo3: 17,
  closePath: 18,
  rectangle: 19,
  stroke: 20,
  closeStroke: 21,
  fill: 22,
  eoFill: 23,
  fillStroke: 24,
  eoFillStroke: 25,
  closeFillStroke: 26,
  closeEOFillStroke: 27,
  endPath: 28,
  clip: 29,
  eoClip: 30,
  beginText: 31,
  endText: 32,
  setCharSpacing: 33,
  setWordSpacing: 34,
  setHScale: 35,
  setLeading: 36,
  setFont: 37,
  setTextRenderingMode: 38,
  setTextRise: 39,
  moveText: 40,
  setLeadingMoveText: 41,
  setTextMatrix: 42,
  nextLine: 43,
  showText: 44,
  showSpacedText: 45,
  nextLineShowText: 46,
  nextLineSetSpacingShowText: 47,
  setCharWidth: 48,
  setCharWidthAndBounds: 49,
  setStrokeColorSpace: 50,
  setFillColorSpace: 51,
  setStrokeColor: 52,
  setStrokeColorN: 53,
  setFillColor: 54,
  setFillColorN: 55,
  setStrokeGray: 56,
  setFillGray: 57,
  setStrokeRGBColor: 58,
  setFillRGBColor: 59,
  setStrokeCMYKColor: 60,
  setFillCMYKColor: 61,
  shadingFill: 62,
  beginInlineImage: 63,
  beginImageData: 64,
  endInlineImage: 65,
  paintXObject: 66,
  markPoint: 67,
  markPointProps: 68,
  beginMarkedContent: 69,
  beginMarkedContentProps: 70,
  endMarkedContent: 71,
  beginCompat: 72,
  endCompat: 73,
  paintFormXObjectBegin: 74,
  paintFormXObjectEnd: 75,
  beginGroup: 76,
  endGroup: 77,
  beginAnnotation: 80,
  endAnnotation: 81,
  paintImageMaskXObject: 83,
  paintImageMaskXObjectGroup: 84,
  paintImageXObject: 85,
  paintInlineImageXObject: 86,
  paintInlineImageXObjectGroup: 87,
  paintImageXObjectRepeat: 88,
  paintImageMaskXObjectRepeat: 89,
  paintSolidColorImageMask: 90,
  constructPath: 91
};
exports.OPS = OPS;
const PasswordResponses = {
  NEED_PASSWORD: 1,
  INCORRECT_PASSWORD: 2
};
exports.PasswordResponses = PasswordResponses;
let verbosity = VerbosityLevel.WARNINGS;
function setVerbosityLevel(level) {
  if (Number.isInteger(level)) {
    verbosity = level;
  }
}
function getVerbosityLevel() {
  return verbosity;
}
function info(msg) {
  if (verbosity >= VerbosityLevel.INFOS) {
    console.log(`Info: ${msg}`);
  }
}
function warn(msg) {
  if (verbosity >= VerbosityLevel.WARNINGS) {
    console.log(`Warning: ${msg}`);
  }
}
function unreachable(msg) {
  throw new Error(msg);
}
function assert(cond, msg) {
  if (!cond) {
    unreachable(msg);
  }
}
function _isValidProtocol(url) {
  switch (url?.protocol) {
    case "http:":
    case "https:":
    case "ftp:":
    case "mailto:":
    case "tel:":
      return true;
    default:
      return false;
  }
}
function createValidAbsoluteUrl(url, baseUrl = null, options = null) {
  if (!url) {
    return null;
  }
  try {
    if (options && typeof url === "string") {
      if (options.addDefaultProtocol && url.startsWith("www.")) {
        const dots = url.match(/\./g);
        if (dots?.length >= 2) {
          url = `http://${url}`;
        }
      }
      if (options.tryConvertEncoding) {
        try {
          url = stringToUTF8String(url);
        } catch {}
      }
    }
    const absoluteUrl = baseUrl ? new URL(url, baseUrl) : new URL(url);
    if (_isValidProtocol(absoluteUrl)) {
      return absoluteUrl;
    }
  } catch {}
  return null;
}
function shadow(obj, prop, value, nonSerializable = false) {
  Object.defineProperty(obj, prop, {
    value,
    enumerable: !nonSerializable,
    configurable: true,
    writable: false
  });
  return value;
}
const BaseException = function BaseExceptionClosure() {
  function BaseException(message, name) {
    if (this.constructor === BaseException) {
      unreachable("Cannot initialize BaseException.");
    }
    this.message = message;
    this.name = name;
  }
  BaseException.prototype = new Error();
  BaseException.constructor = BaseException;
  return BaseException;
}();
exports.BaseException = BaseException;
class PasswordException extends BaseException {
  constructor(msg, code) {
    super(msg, "PasswordException");
    this.code = code;
  }
}
exports.PasswordException = PasswordException;
class UnknownErrorException extends BaseException {
  constructor(msg, details) {
    super(msg, "UnknownErrorException");
    this.details = details;
  }
}
exports.UnknownErrorException = UnknownErrorException;
class InvalidPDFException extends BaseException {
  constructor(msg) {
    super(msg, "InvalidPDFException");
  }
}
exports.InvalidPDFException = InvalidPDFException;
class MissingPDFException extends BaseException {
  constructor(msg) {
    super(msg, "MissingPDFException");
  }
}
exports.MissingPDFException = MissingPDFException;
class UnexpectedResponseException extends BaseException {
  constructor(msg, status) {
    super(msg, "UnexpectedResponseException");
    this.status = status;
  }
}
exports.UnexpectedResponseException = UnexpectedResponseException;
class FormatError extends BaseException {
  constructor(msg) {
    super(msg, "FormatError");
  }
}
exports.FormatError = FormatError;
class AbortException extends BaseException {
  constructor(msg) {
    super(msg, "AbortException");
  }
}
exports.AbortException = AbortException;
function bytesToString(bytes) {
  if (typeof bytes !== "object" || bytes?.length === undefined) {
    unreachable("Invalid argument for bytesToString");
  }
  const length = bytes.length;
  const MAX_ARGUMENT_COUNT = 8192;
  if (length < MAX_ARGUMENT_COUNT) {
    return String.fromCharCode.apply(null, bytes);
  }
  const strBuf = [];
  for (let i = 0; i < length; i += MAX_ARGUMENT_COUNT) {
    const chunkEnd = Math.min(i + MAX_ARGUMENT_COUNT, length);
    const chunk = bytes.subarray(i, chunkEnd);
    strBuf.push(String.fromCharCode.apply(null, chunk));
  }
  return strBuf.join("");
}
function stringToBytes(str) {
  if (typeof str !== "string") {
    unreachable("Invalid argument for stringToBytes");
  }
  const length = str.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; ++i) {
    bytes[i] = str.charCodeAt(i) & 0xff;
  }
  return bytes;
}
function string32(value) {
  return String.fromCharCode(value >> 24 & 0xff, value >> 16 & 0xff, value >> 8 & 0xff, value & 0xff);
}
function objectSize(obj) {
  return Object.keys(obj).length;
}
function objectFromMap(map) {
  const obj = Object.create(null);
  for (const [key, value] of map) {
    obj[key] = value;
  }
  return obj;
}
function isLittleEndian() {
  const buffer8 = new Uint8Array(4);
  buffer8[0] = 1;
  const view32 = new Uint32Array(buffer8.buffer, 0, 1);
  return view32[0] === 1;
}
function isEvalSupported() {
  try {
    new Function("");
    return true;
  } catch {
    return false;
  }
}
class FeatureTest {
  static get isLittleEndian() {
    return shadow(this, "isLittleEndian", isLittleEndian());
  }
  static get isEvalSupported() {
    return shadow(this, "isEvalSupported", isEvalSupported());
  }
  static get isOffscreenCanvasSupported() {
    return shadow(this, "isOffscreenCanvasSupported", typeof OffscreenCanvas !== "undefined");
  }
  static get platform() {
    if (typeof navigator === "undefined") {
      return shadow(this, "platform", {
        isWin: false,
        isMac: false
      });
    }
    return shadow(this, "platform", {
      isWin: navigator.platform.includes("Win"),
      isMac: navigator.platform.includes("Mac")
    });
  }
  static get isCSSRoundSupported() {
    return shadow(this, "isCSSRoundSupported", globalThis.CSS?.supports?.("width: round(1.5px, 1px)"));
  }
}
exports.FeatureTest = FeatureTest;
const hexNumbers = [...Array(256).keys()].map(n => n.toString(16).padStart(2, "0"));
class Util {
  static makeHexColor(r, g, b) {
    return `#${hexNumbers[r]}${hexNumbers[g]}${hexNumbers[b]}`;
  }
  static scaleMinMax(transform, minMax) {
    let temp;
    if (transform[0]) {
      if (transform[0] < 0) {
        temp = minMax[0];
        minMax[0] = minMax[1];
        minMax[1] = temp;
      }
      minMax[0] *= transform[0];
      minMax[1] *= transform[0];
      if (transform[3] < 0) {
        temp = minMax[2];
        minMax[2] = minMax[3];
        minMax[3] = temp;
      }
      minMax[2] *= transform[3];
      minMax[3] *= transform[3];
    } else {
      temp = minMax[0];
      minMax[0] = minMax[2];
      minMax[2] = temp;
      temp = minMax[1];
      minMax[1] = minMax[3];
      minMax[3] = temp;
      if (transform[1] < 0) {
        temp = minMax[2];
        minMax[2] = minMax[3];
        minMax[3] = temp;
      }
      minMax[2] *= transform[1];
      minMax[3] *= transform[1];
      if (transform[2] < 0) {
        temp = minMax[0];
        minMax[0] = minMax[1];
        minMax[1] = temp;
      }
      minMax[0] *= transform[2];
      minMax[1] *= transform[2];
    }
    minMax[0] += transform[4];
    minMax[1] += transform[4];
    minMax[2] += transform[5];
    minMax[3] += transform[5];
  }
  static transform(m1, m2) {
    return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3], m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
  }
  static applyTransform(p, m) {
    const xt = p[0] * m[0] + p[1] * m[2] + m[4];
    const yt = p[0] * m[1] + p[1] * m[3] + m[5];
    return [xt, yt];
  }
  static applyInverseTransform(p, m) {
    const d = m[0] * m[3] - m[1] * m[2];
    const xt = (p[0] * m[3] - p[1] * m[2] + m[2] * m[5] - m[4] * m[3]) / d;
    const yt = (-p[0] * m[1] + p[1] * m[0] + m[4] * m[1] - m[5] * m[0]) / d;
    return [xt, yt];
  }
  static getAxialAlignedBoundingBox(r, m) {
    const p1 = this.applyTransform(r, m);
    const p2 = this.applyTransform(r.slice(2, 4), m);
    const p3 = this.applyTransform([r[0], r[3]], m);
    const p4 = this.applyTransform([r[2], r[1]], m);
    return [Math.min(p1[0], p2[0], p3[0], p4[0]), Math.min(p1[1], p2[1], p3[1], p4[1]), Math.max(p1[0], p2[0], p3[0], p4[0]), Math.max(p1[1], p2[1], p3[1], p4[1])];
  }
  static inverseTransform(m) {
    const d = m[0] * m[3] - m[1] * m[2];
    return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[4] * m[3]) / d, (m[4] * m[1] - m[5] * m[0]) / d];
  }
  static singularValueDecompose2dScale(m) {
    const transpose = [m[0], m[2], m[1], m[3]];
    const a = m[0] * transpose[0] + m[1] * transpose[2];
    const b = m[0] * transpose[1] + m[1] * transpose[3];
    const c = m[2] * transpose[0] + m[3] * transpose[2];
    const d = m[2] * transpose[1] + m[3] * transpose[3];
    const first = (a + d) / 2;
    const second = Math.sqrt((a + d) ** 2 - 4 * (a * d - c * b)) / 2;
    const sx = first + second || 1;
    const sy = first - second || 1;
    return [Math.sqrt(sx), Math.sqrt(sy)];
  }
  static normalizeRect(rect) {
    const r = rect.slice(0);
    if (rect[0] > rect[2]) {
      r[0] = rect[2];
      r[2] = rect[0];
    }
    if (rect[1] > rect[3]) {
      r[1] = rect[3];
      r[3] = rect[1];
    }
    return r;
  }
  static intersect(rect1, rect2) {
    const xLow = Math.max(Math.min(rect1[0], rect1[2]), Math.min(rect2[0], rect2[2]));
    const xHigh = Math.min(Math.max(rect1[0], rect1[2]), Math.max(rect2[0], rect2[2]));
    if (xLow > xHigh) {
      return null;
    }
    const yLow = Math.max(Math.min(rect1[1], rect1[3]), Math.min(rect2[1], rect2[3]));
    const yHigh = Math.min(Math.max(rect1[1], rect1[3]), Math.max(rect2[1], rect2[3]));
    if (yLow > yHigh) {
      return null;
    }
    return [xLow, yLow, xHigh, yHigh];
  }
  static bezierBoundingBox(x0, y0, x1, y1, x2, y2, x3, y3) {
    const tvalues = [],
      bounds = [[], []];
    let a, b, c, t, t1, t2, b2ac, sqrtb2ac;
    for (let i = 0; i < 2; ++i) {
      if (i === 0) {
        b = 6 * x0 - 12 * x1 + 6 * x2;
        a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
        c = 3 * x1 - 3 * x0;
      } else {
        b = 6 * y0 - 12 * y1 + 6 * y2;
        a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
        c = 3 * y1 - 3 * y0;
      }
      if (Math.abs(a) < 1e-12) {
        if (Math.abs(b) < 1e-12) {
          continue;
        }
        t = -c / b;
        if (0 < t && t < 1) {
          tvalues.push(t);
        }
        continue;
      }
      b2ac = b * b - 4 * c * a;
      sqrtb2ac = Math.sqrt(b2ac);
      if (b2ac < 0) {
        continue;
      }
      t1 = (-b + sqrtb2ac) / (2 * a);
      if (0 < t1 && t1 < 1) {
        tvalues.push(t1);
      }
      t2 = (-b - sqrtb2ac) / (2 * a);
      if (0 < t2 && t2 < 1) {
        tvalues.push(t2);
      }
    }
    let j = tvalues.length,
      mt;
    const jlen = j;
    while (j--) {
      t = tvalues[j];
      mt = 1 - t;
      bounds[0][j] = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
      bounds[1][j] = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
    }
    bounds[0][jlen] = x0;
    bounds[1][jlen] = y0;
    bounds[0][jlen + 1] = x3;
    bounds[1][jlen + 1] = y3;
    bounds[0].length = bounds[1].length = jlen + 2;
    return [Math.min(...bounds[0]), Math.min(...bounds[1]), Math.max(...bounds[0]), Math.max(...bounds[1])];
  }
}
exports.Util = Util;
const PDFStringTranslateTable = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2d8, 0x2c7, 0x2c6, 0x2d9, 0x2dd, 0x2db, 0x2da, 0x2dc, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2022, 0x2020, 0x2021, 0x2026, 0x2014, 0x2013, 0x192, 0x2044, 0x2039, 0x203a, 0x2212, 0x2030, 0x201e, 0x201c, 0x201d, 0x2018, 0x2019, 0x201a, 0x2122, 0xfb01, 0xfb02, 0x141, 0x152, 0x160, 0x178, 0x17d, 0x131, 0x142, 0x153, 0x161, 0x17e, 0, 0x20ac];
function stringToPDFString(str) {
  if (str[0] >= "\xEF") {
    let encoding;
    if (str[0] === "\xFE" && str[1] === "\xFF") {
      encoding = "utf-16be";
    } else if (str[0] === "\xFF" && str[1] === "\xFE") {
      encoding = "utf-16le";
    } else if (str[0] === "\xEF" && str[1] === "\xBB" && str[2] === "\xBF") {
      encoding = "utf-8";
    }
    if (encoding) {
      try {
        const decoder = new TextDecoder(encoding, {
          fatal: true
        });
        const buffer = stringToBytes(str);
        return decoder.decode(buffer);
      } catch (ex) {
        warn(`stringToPDFString: "${ex}".`);
      }
    }
  }
  const strBuf = [];
  for (let i = 0, ii = str.length; i < ii; i++) {
    const code = PDFStringTranslateTable[str.charCodeAt(i)];
    strBuf.push(code ? String.fromCharCode(code) : str.charAt(i));
  }
  return strBuf.join("");
}
function stringToUTF8String(str) {
  return decodeURIComponent(escape(str));
}
function utf8StringToString(str) {
  return unescape(encodeURIComponent(str));
}
function isArrayBuffer(v) {
  return typeof v === "object" && v?.byteLength !== undefined;
}
function isArrayEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0, ii = arr1.length; i < ii; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
function getModificationDate(date = new Date()) {
  const buffer = [date.getUTCFullYear().toString(), (date.getUTCMonth() + 1).toString().padStart(2, "0"), date.getUTCDate().toString().padStart(2, "0"), date.getUTCHours().toString().padStart(2, "0"), date.getUTCMinutes().toString().padStart(2, "0"), date.getUTCSeconds().toString().padStart(2, "0")];
  return buffer.join("");
}
class PromiseCapability {
  #settled = false;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = data => {
        this.#settled = true;
        resolve(data);
      };
      this.reject = reason => {
        this.#settled = true;
        reject(reason);
      };
    });
  }
  get settled() {
    return this.#settled;
  }
}
exports.PromiseCapability = PromiseCapability;
let NormalizeRegex = null;
let NormalizationMap = null;
function normalizeUnicode(str) {
  if (!NormalizeRegex) {
    NormalizeRegex = /([\u00a0\u00b5\u037e\u0eb3\u2000-\u200a\u202f\u2126\ufb00-\ufb04\ufb06\ufb20-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufba1\ufba4-\ufba9\ufbae-\ufbb1\ufbd3-\ufbdc\ufbde-\ufbe7\ufbea-\ufbf8\ufbfc-\ufbfd\ufc00-\ufc5d\ufc64-\ufcf1\ufcf5-\ufd3d\ufd88\ufdf4\ufdfa-\ufdfb\ufe71\ufe77\ufe79\ufe7b\ufe7d]+)|(\ufb05+)/gu;
    NormalizationMap = new Map([["ﬅ", "ſt"]]);
  }
  return str.replaceAll(NormalizeRegex, (_, p1, p2) => {
    return p1 ? p1.normalize("NFKC") : NormalizationMap.get(p2);
  });
}
function getUuid() {
  if (typeof crypto !== "undefined" && typeof crypto?.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const buf = new Uint8Array(32);
  if (typeof crypto !== "undefined" && typeof crypto?.getRandomValues === "function") {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < 32; i++) {
      buf[i] = Math.floor(Math.random() * 255);
    }
  }
  return bytesToString(buf);
}
const AnnotationPrefix = "pdfjs_internal_id_";
exports.AnnotationPrefix = AnnotationPrefix;

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderTask = exports.PDFWorkerUtil = exports.PDFWorker = exports.PDFPageProxy = exports.PDFDocumentProxy = exports.PDFDocumentLoadingTask = exports.PDFDataRangeTransport = exports.LoopbackPort = exports.DefaultStandardFontDataFactory = exports.DefaultFilterFactory = exports.DefaultCanvasFactory = exports.DefaultCMapReaderFactory = void 0;
Object.defineProperty(exports, "SVGGraphics", ({
  enumerable: true,
  get: function () {
    return _displaySvg.SVGGraphics;
  }
}));
exports.build = void 0;
exports.getDocument = getDocument;
exports.version = void 0;
var _util = __w_pdfjs_require__(1);
var _annotation_storage = __w_pdfjs_require__(3);
var _display_utils = __w_pdfjs_require__(6);
var _font_loader = __w_pdfjs_require__(9);
var _displayNode_utils = __w_pdfjs_require__(10);
var _canvas = __w_pdfjs_require__(11);
var _worker_options = __w_pdfjs_require__(14);
var _message_handler = __w_pdfjs_require__(15);
var _metadata = __w_pdfjs_require__(16);
var _optional_content_config = __w_pdfjs_require__(17);
var _transport_stream = __w_pdfjs_require__(18);
var _displayFetch_stream = __w_pdfjs_require__(19);
var _displayNetwork = __w_pdfjs_require__(22);
var _displayNode_stream = __w_pdfjs_require__(23);
var _displaySvg = __w_pdfjs_require__(24);
var _xfa_text = __w_pdfjs_require__(25);
const DEFAULT_RANGE_CHUNK_SIZE = 65536;
const RENDERING_CANCELLED_TIMEOUT = 100;
const DELAYED_CLEANUP_TIMEOUT = 5000;
const DefaultCanvasFactory = _util.isNodeJS ? _displayNode_utils.NodeCanvasFactory : _display_utils.DOMCanvasFactory;
exports.DefaultCanvasFactory = DefaultCanvasFactory;
const DefaultCMapReaderFactory = _util.isNodeJS ? _displayNode_utils.NodeCMapReaderFactory : _display_utils.DOMCMapReaderFactory;
exports.DefaultCMapReaderFactory = DefaultCMapReaderFactory;
const DefaultFilterFactory = _util.isNodeJS ? _displayNode_utils.NodeFilterFactory : _display_utils.DOMFilterFactory;
exports.DefaultFilterFactory = DefaultFilterFactory;
const DefaultStandardFontDataFactory = _util.isNodeJS ? _displayNode_utils.NodeStandardFontDataFactory : _display_utils.DOMStandardFontDataFactory;
exports.DefaultStandardFontDataFactory = DefaultStandardFontDataFactory;
function getDocument(src) {
  if (typeof src === "string" || src instanceof URL) {
    src = {
      url: src
    };
  } else if ((0, _util.isArrayBuffer)(src)) {
    src = {
      data: src
    };
  }
  if (typeof src !== "object") {
    throw new Error("Invalid parameter in getDocument, need parameter object.");
  }
  if (!src.url && !src.data && !src.range) {
    throw new Error("Invalid parameter object: need either .data, .range or .url");
  }
  const task = new PDFDocumentLoadingTask();
  const {
    docId
  } = task;
  const url = src.url ? getUrlProp(src.url) : null;
  const data = src.data ? getDataProp(src.data) : null;
  const httpHeaders = src.httpHeaders || null;
  const withCredentials = src.withCredentials === true;
  const password = src.password ?? null;
  const rangeTransport = src.range instanceof PDFDataRangeTransport ? src.range : null;
  const rangeChunkSize = Number.isInteger(src.rangeChunkSize) && src.rangeChunkSize > 0 ? src.rangeChunkSize : DEFAULT_RANGE_CHUNK_SIZE;
  let worker = src.worker instanceof PDFWorker ? src.worker : null;
  const verbosity = src.verbosity;
  const docBaseUrl = typeof src.docBaseUrl === "string" && !(0, _display_utils.isDataScheme)(src.docBaseUrl) ? src.docBaseUrl : null;
  const cMapUrl = typeof src.cMapUrl === "string" ? src.cMapUrl : null;
  const cMapPacked = src.cMapPacked !== false;
  const CMapReaderFactory = src.CMapReaderFactory || DefaultCMapReaderFactory;
  const standardFontDataUrl = typeof src.standardFontDataUrl === "string" ? src.standardFontDataUrl : null;
  const StandardFontDataFactory = src.StandardFontDataFactory || DefaultStandardFontDataFactory;
  const ignoreErrors = src.stopAtErrors !== true;
  const maxImageSize = Number.isInteger(src.maxImageSize) && src.maxImageSize > -1 ? src.maxImageSize : -1;
  const isEvalSupported = src.isEvalSupported !== false;
  const isOffscreenCanvasSupported = typeof src.isOffscreenCanvasSupported === "boolean" ? src.isOffscreenCanvasSupported : !_util.isNodeJS;
  const canvasMaxAreaInBytes = Number.isInteger(src.canvasMaxAreaInBytes) ? src.canvasMaxAreaInBytes : -1;
  const disableFontFace = typeof src.disableFontFace === "boolean" ? src.disableFontFace : _util.isNodeJS;
  const fontExtraProperties = src.fontExtraProperties === true;
  const enableXfa = src.enableXfa === true;
  const ownerDocument = src.ownerDocument || globalThis.document;
  const disableRange = src.disableRange === true;
  const disableStream = src.disableStream === true;
  const disableAutoFetch = src.disableAutoFetch === true;
  const pdfBug = src.pdfBug === true;
  const length = rangeTransport ? rangeTransport.length : src.length ?? NaN;
  const useSystemFonts = typeof src.useSystemFonts === "boolean" ? src.useSystemFonts : !_util.isNodeJS && !disableFontFace;
  const useWorkerFetch = typeof src.useWorkerFetch === "boolean" ? src.useWorkerFetch : CMapReaderFactory === _display_utils.DOMCMapReaderFactory && StandardFontDataFactory === _display_utils.DOMStandardFontDataFactory && cMapUrl && standardFontDataUrl && (0, _display_utils.isValidFetchUrl)(cMapUrl, document.baseURI) && (0, _display_utils.isValidFetchUrl)(standardFontDataUrl, document.baseURI);
  const canvasFactory = src.canvasFactory || new DefaultCanvasFactory({
    ownerDocument
  });
  const filterFactory = src.filterFactory || new DefaultFilterFactory({
    docId,
    ownerDocument
  });
  const styleElement = null;
  (0, _util.setVerbosityLevel)(verbosity);
  const transportFactory = {
    canvasFactory,
    filterFactory
  };
  if (!useWorkerFetch) {
    transportFactory.cMapReaderFactory = new CMapReaderFactory({
      baseUrl: cMapUrl,
      isCompressed: cMapPacked
    });
    transportFactory.standardFontDataFactory = new StandardFontDataFactory({
      baseUrl: standardFontDataUrl
    });
  }
  if (!worker) {
    const workerParams = {
      verbosity,
      port: _worker_options.GlobalWorkerOptions.workerPort
    };
    worker = workerParams.port ? PDFWorker.fromPort(workerParams) : new PDFWorker(workerParams);
    task._worker = worker;
  }
  const fetchDocParams = {
    docId,
    apiVersion: '3.11.174',
    data,
    password,
    disableAutoFetch,
    rangeChunkSize,
    length,
    docBaseUrl,
    enableXfa,
    evaluatorOptions: {
      maxImageSize,
      disableFontFace,
      ignoreErrors,
      isEvalSupported,
      isOffscreenCanvasSupported,
      canvasMaxAreaInBytes,
      fontExtraProperties,
      useSystemFonts,
      cMapUrl: useWorkerFetch ? cMapUrl : null,
      standardFontDataUrl: useWorkerFetch ? standardFontDataUrl : null
    }
  };
  const transportParams = {
    ignoreErrors,
    isEvalSupported,
    disableFontFace,
    fontExtraProperties,
    enableXfa,
    ownerDocument,
    disableAutoFetch,
    pdfBug,
    styleElement
  };
  worker.promise.then(function () {
    if (task.destroyed) {
      throw new Error("Loading aborted");
    }
    const workerIdPromise = _fetchDocument(worker, fetchDocParams);
    const networkStreamPromise = new Promise(function (resolve) {
      let networkStream;
      if (rangeTransport) {
        networkStream = new _transport_stream.PDFDataTransportStream({
          length,
          initialData: rangeTransport.initialData,
          progressiveDone: rangeTransport.progressiveDone,
          contentDispositionFilename: rangeTransport.contentDispositionFilename,
          disableRange,
          disableStream
        }, rangeTransport);
      } else if (!data) {
        const createPDFNetworkStream = params => {
          if (_util.isNodeJS) {
            return new _displayNode_stream.PDFNodeStream(params);
          }
          return (0, _display_utils.isValidFetchUrl)(params.url) ? new _displayFetch_stream.PDFFetchStream(params) : new _displayNetwork.PDFNetworkStream(params);
        };
        networkStream = createPDFNetworkStream({
          url,
          length,
          httpHeaders,
          withCredentials,
          rangeChunkSize,
          disableRange,
          disableStream
        });
      }
      resolve(networkStream);
    });
    return Promise.all([workerIdPromise, networkStreamPromise]).then(function ([workerId, networkStream]) {
      if (task.destroyed) {
        throw new Error("Loading aborted");
      }
      const messageHandler = new _message_handler.MessageHandler(docId, workerId, worker.port);
      const transport = new WorkerTransport(messageHandler, task, networkStream, transportParams, transportFactory);
      task._transport = transport;
      messageHandler.send("Ready", null);
    });
  }).catch(task._capability.reject);
  return task;
}
async function _fetchDocument(worker, source) {
  if (worker.destroyed) {
    throw new Error("Worker was destroyed");
  }
  const workerId = await worker.messageHandler.sendWithPromise("GetDocRequest", source, source.data ? [source.data.buffer] : null);
  if (worker.destroyed) {
    throw new Error("Worker was destroyed");
  }
  return workerId;
}
function getUrlProp(val) {
  if (val instanceof URL) {
    return val.href;
  }
  try {
    return new URL(val, window.location).href;
  } catch {
    if (_util.isNodeJS && typeof val === "string") {
      return val;
    }
  }
  throw new Error("Invalid PDF url data: " + "either string or URL-object is expected in the url property.");
}
function getDataProp(val) {
  if (_util.isNodeJS && typeof Buffer !== "undefined" && val instanceof Buffer) {
    throw new Error("Please provide binary data as `Uint8Array`, rather than `Buffer`.");
  }
  if (val instanceof Uint8Array && val.byteLength === val.buffer.byteLength) {
    return val;
  }
  if (typeof val === "string") {
    return (0, _util.stringToBytes)(val);
  }
  if (typeof val === "object" && !isNaN(val?.length) || (0, _util.isArrayBuffer)(val)) {
    return new Uint8Array(val);
  }
  throw new Error("Invalid PDF binary data: either TypedArray, " + "string, or array-like object is expected in the data property.");
}
class PDFDocumentLoadingTask {
  static #docId = 0;
  constructor() {
    this._capability = new _util.PromiseCapability();
    this._transport = null;
    this._worker = null;
    this.docId = `d${PDFDocumentLoadingTask.#docId++}`;
    this.destroyed = false;
    this.onPassword = null;
    this.onProgress = null;
  }
  get promise() {
    return this._capability.promise;
  }
  async destroy() {
    this.destroyed = true;
    try {
      if (this._worker?.port) {
        this._worker._pendingDestroy = true;
      }
      await this._transport?.destroy();
    } catch (ex) {
      if (this._worker?.port) {
        delete this._worker._pendingDestroy;
      }
      throw ex;
    }
    this._transport = null;
    if (this._worker) {
      this._worker.destroy();
      this._worker = null;
    }
  }
}
exports.PDFDocumentLoadingTask = PDFDocumentLoadingTask;
class PDFDataRangeTransport {
  constructor(length, initialData, progressiveDone = false, contentDispositionFilename = null) {
    this.length = length;
    this.initialData = initialData;
    this.progressiveDone = progressiveDone;
    this.contentDispositionFilename = contentDispositionFilename;
    this._rangeListeners = [];
    this._progressListeners = [];
    this._progressiveReadListeners = [];
    this._progressiveDoneListeners = [];
    this._readyCapability = new _util.PromiseCapability();
  }
  addRangeListener(listener) {
    this._rangeListeners.push(listener);
  }
  addProgressListener(listener) {
    this._progressListeners.push(listener);
  }
  addProgressiveReadListener(listener) {
    this._progressiveReadListeners.push(listener);
  }
  addProgressiveDoneListener(listener) {
    this._progressiveDoneListeners.push(listener);
  }
  onDataRange(begin, chunk) {
    for (const listener of this._rangeListeners) {
      listener(begin, chunk);
    }
  }
  onDataProgress(loaded, total) {
    this._readyCapability.promise.then(() => {
      for (const listener of this._progressListeners) {
        listener(loaded, total);
      }
    });
  }
  onDataProgressiveRead(chunk) {
    this._readyCapability.promise.then(() => {
      for (const listener of this._progressiveReadListeners) {
        listener(chunk);
      }
    });
  }
  onDataProgressiveDone() {
    this._readyCapability.promise.then(() => {
      for (const listener of this._progressiveDoneListeners) {
        listener();
      }
    });
  }
  transportReady() {
    this._readyCapability.resolve();
  }
  requestDataRange(begin, end) {
    (0, _util.unreachable)("Abstract method PDFDataRangeTransport.requestDataRange");
  }
  abort() {}
}
exports.PDFDataRangeTransport = PDFDataRangeTransport;
class PDFDocumentProxy {
  constructor(pdfInfo, transport) {
    this._pdfInfo = pdfInfo;
    this._transport = transport;
    Object.defineProperty(this, "getJavaScript", {
      value: () => {
        (0, _display_utils.deprecated)("`PDFDocumentProxy.getJavaScript`, " + "please use `PDFDocumentProxy.getJSActions` instead.");
        return this.getJSActions().then(js => {
          if (!js) {
            return js;
          }
          const jsArr = [];
          for (const name in js) {
            jsArr.push(...js[name]);
          }
          return jsArr;
        });
      }
    });
  }
  get annotationStorage() {
    return this._transport.annotationStorage;
  }
  get filterFactory() {
    return this._transport.filterFactory;
  }
  get numPages() {
    return this._pdfInfo.numPages;
  }
  get fingerprints() {
    return this._pdfInfo.fingerprints;
  }
  get isPureXfa() {
    return (0, _util.shadow)(this, "isPureXfa", !!this._transport._htmlForXfa);
  }
  get allXfaHtml() {
    return this._transport._htmlForXfa;
  }
  getPage(pageNumber) {
    return this._transport.getPage(pageNumber);
  }
  getPageIndex(ref) {
    return this._transport.getPageIndex(ref);
  }
  getDestinations() {
    return this._transport.getDestinations();
  }
  getDestination(id) {
    return this._transport.getDestination(id);
  }
  getPageLabels() {
    return this._transport.getPageLabels();
  }
  getPageLayout() {
    return this._transport.getPageLayout();
  }
  getPageMode() {
    return this._transport.getPageMode();
  }
  getViewerPreferences() {
    return this._transport.getViewerPreferences();
  }
  getOpenAction() {
    return this._transport.getOpenAction();
  }
  getAttachments() {
    return this._transport.getAttachments();
  }
  getJSActions() {
    return this._transport.getDocJSActions();
  }
  getOutline() {
    return this._transport.getOutline();
  }
  getOptionalContentConfig() {
    return this._transport.getOptionalContentConfig();
  }
  getPermissions() {
    return this._transport.getPermissions();
  }
  getMetadata() {
    return this._transport.getMetadata();
  }
  getMarkInfo() {
    return this._transport.getMarkInfo();
  }
  getData() {
    return this._transport.getData();
  }
  saveDocument() {
    return this._transport.saveDocument();
  }
  getDownloadInfo() {
    return this._transport.downloadInfoCapability.promise;
  }
  cleanup(keepLoadedFonts = false) {
    return this._transport.startCleanup(keepLoadedFonts || this.isPureXfa);
  }
  destroy() {
    return this.loadingTask.destroy();
  }
  get loadingParams() {
    return this._transport.loadingParams;
  }
  get loadingTask() {
    return this._transport.loadingTask;
  }
  getFieldObjects() {
    return this._transport.getFieldObjects();
  }
  hasJSActions() {
    return this._transport.hasJSActions();
  }
  getCalculationOrderIds() {
    return this._transport.getCalculationOrderIds();
  }
}
exports.PDFDocumentProxy = PDFDocumentProxy;
class PDFPageProxy {
  #delayedCleanupTimeout = null;
  #pendingCleanup = false;
  constructor(pageIndex, pageInfo, transport, pdfBug = false) {
    this._pageIndex = pageIndex;
    this._pageInfo = pageInfo;
    this._transport = transport;
    this._stats = pdfBug ? new _display_utils.StatTimer() : null;
    this._pdfBug = pdfBug;
    this.commonObjs = transport.commonObjs;
    this.objs = new PDFObjects();
    this._maybeCleanupAfterRender = false;
    this._intentStates = new Map();
    this.destroyed = false;
  }
  get pageNumber() {
    return this._pageIndex + 1;
  }
  get rotate() {
    return this._pageInfo.rotate;
  }
  get ref() {
    return this._pageInfo.ref;
  }
  get userUnit() {
    return this._pageInfo.userUnit;
  }
  get view() {
    return this._pageInfo.view;
  }
  getViewport({
    scale,
    rotation = this.rotate,
    offsetX = 0,
    offsetY = 0,
    dontFlip = false
  } = {}) {
    return new _display_utils.PageViewport({
      viewBox: this.view,
      scale,
      rotation,
      offsetX,
      offsetY,
      dontFlip
    });
  }
  getAnnotations({
    intent = "display"
  } = {}) {
    const intentArgs = this._transport.getRenderingIntent(intent);
    return this._transport.getAnnotations(this._pageIndex, intentArgs.renderingIntent);
  }
  getJSActions() {
    return this._transport.getPageJSActions(this._pageIndex);
  }
  get filterFactory() {
    return this._transport.filterFactory;
  }
  get isPureXfa() {
    return (0, _util.shadow)(this, "isPureXfa", !!this._transport._htmlForXfa);
  }
  async getXfa() {
    return this._transport._htmlForXfa?.children[this._pageIndex] || null;
  }
  render({
    canvasContext,
    viewport,
    intent = "display",
    annotationMode = _util.AnnotationMode.ENABLE,
    transform = null,
    background = null,
    optionalContentConfigPromise = null,
    annotationCanvasMap = null,
    pageColors = null,
    printAnnotationStorage = null
  }) {
    this._stats?.time("Overall");
    const intentArgs = this._transport.getRenderingIntent(intent, annotationMode, printAnnotationStorage);
    this.#pendingCleanup = false;
    this.#abortDelayedCleanup();
    if (!optionalContentConfigPromise) {
      optionalContentConfigPromise = this._transport.getOptionalContentConfig();
    }
    let intentState = this._intentStates.get(intentArgs.cacheKey);
    if (!intentState) {
      intentState = Object.create(null);
      this._intentStates.set(intentArgs.cacheKey, intentState);
    }
    if (intentState.streamReaderCancelTimeout) {
      clearTimeout(intentState.streamReaderCancelTimeout);
      intentState.streamReaderCancelTimeout = null;
    }
    const intentPrint = !!(intentArgs.renderingIntent & _util.RenderingIntentFlag.PRINT);
    if (!intentState.displayReadyCapability) {
      intentState.displayReadyCapability = new _util.PromiseCapability();
      intentState.operatorList = {
        fnArray: [],
        argsArray: [],
        lastChunk: false,
        separateAnnots: null
      };
      this._stats?.time("Page Request");
      this._pumpOperatorList(intentArgs);
    }
    const complete = error => {
      intentState.renderTasks.delete(internalRenderTask);
      if (this._maybeCleanupAfterRender || intentPrint) {
        this.#pendingCleanup = true;
      }
      this.#tryCleanup(!intentPrint);
      if (error) {
        internalRenderTask.capability.reject(error);
        this._abortOperatorList({
          intentState,
          reason: error instanceof Error ? error : new Error(error)
        });
      } else {
        internalRenderTask.capability.resolve();
      }
      this._stats?.timeEnd("Rendering");
      this._stats?.timeEnd("Overall");
    };
    const internalRenderTask = new InternalRenderTask({
      callback: complete,
      params: {
        canvasContext,
        viewport,
        transform,
        background
      },
      objs: this.objs,
      commonObjs: this.commonObjs,
      annotationCanvasMap,
      operatorList: intentState.operatorList,
      pageIndex: this._pageIndex,
      canvasFactory: this._transport.canvasFactory,
      filterFactory: this._transport.filterFactory,
      useRequestAnimationFrame: !intentPrint,
      pdfBug: this._pdfBug,
      pageColors
    });
    (intentState.renderTasks ||= new Set()).add(internalRenderTask);
    const renderTask = internalRenderTask.task;
    Promise.all([intentState.displayReadyCapability.promise, optionalContentConfigPromise]).then(([transparency, optionalContentConfig]) => {
      if (this.destroyed) {
        complete();
        return;
      }
      this._stats?.time("Rendering");
      internalRenderTask.initializeGraphics({
        transparency,
        optionalContentConfig
      });
      internalRenderTask.operatorListChanged();
    }).catch(complete);
    return renderTask;
  }
  getOperatorList({
    intent = "display",
    annotationMode = _util.AnnotationMode.ENABLE,
    printAnnotationStorage = null
  } = {}) {
    function operatorListChanged() {
      if (intentState.operatorList.lastChunk) {
        intentState.opListReadCapability.resolve(intentState.operatorList);
        intentState.renderTasks.delete(opListTask);
      }
    }
    const intentArgs = this._transport.getRenderingIntent(intent, annotationMode, printAnnotationStorage, true);
    let intentState = this._intentStates.get(intentArgs.cacheKey);
    if (!intentState) {
      intentState = Object.create(null);
      this._intentStates.set(intentArgs.cacheKey, intentState);
    }
    let opListTask;
    if (!intentState.opListReadCapability) {
      opListTask = Object.create(null);
      opListTask.operatorListChanged = operatorListChanged;
      intentState.opListReadCapability = new _util.PromiseCapability();
      (intentState.renderTasks ||= new Set()).add(opListTask);
      intentState.operatorList = {
        fnArray: [],
        argsArray: [],
        lastChunk: false,
        separateAnnots: null
      };
      this._stats?.time("Page Request");
      this._pumpOperatorList(intentArgs);
    }
    return intentState.opListReadCapability.promise;
  }
  streamTextContent({
    includeMarkedContent = false,
    disableNormalization = false
  } = {}) {
    const TEXT_CONTENT_CHUNK_SIZE = 100;
    return this._transport.messageHandler.sendWithStream("GetTextContent", {
      pageIndex: this._pageIndex,
      includeMarkedContent: includeMarkedContent === true,
      disableNormalization: disableNormalization === true
    }, {
      highWaterMark: TEXT_CONTENT_CHUNK_SIZE,
      size(textContent) {
        return textContent.items.length;
      }
    });
  }
  getTextContent(params = {}) {
    if (this._transport._htmlForXfa) {
      return this.getXfa().then(xfa => {
        return _xfa_text.XfaText.textContent(xfa);
      });
    }
    const readableStream = this.streamTextContent(params);
    return new Promise(function (resolve, reject) {
      function pump() {
        reader.read().then(function ({
          value,
          done
        }) {
          if (done) {
            resolve(textContent);
            return;
          }
          Object.assign(textContent.styles, value.styles);
          textContent.items.push(...value.items);
          pump();
        }, reject);
      }
      const reader = readableStream.getReader();
      const textContent = {
        items: [],
        styles: Object.create(null)
      };
      pump();
    });
  }
  getStructTree() {
    return this._transport.getStructTree(this._pageIndex);
  }
  _destroy() {
    this.destroyed = true;
    const waitOn = [];
    for (const intentState of this._intentStates.values()) {
      this._abortOperatorList({
        intentState,
        reason: new Error("Page was destroyed."),
        force: true
      });
      if (intentState.opListReadCapability) {
        continue;
      }
      for (const internalRenderTask of intentState.renderTasks) {
        waitOn.push(internalRenderTask.completed);
        internalRenderTask.cancel();
      }
    }
    this.objs.clear();
    this.#pendingCleanup = false;
    this.#abortDelayedCleanup();
    return Promise.all(waitOn);
  }
  cleanup(resetStats = false) {
    this.#pendingCleanup = true;
    const success = this.#tryCleanup(false);
    if (resetStats && success) {
      this._stats &&= new _display_utils.StatTimer();
    }
    return success;
  }
  #tryCleanup(delayed = false) {
    this.#abortDelayedCleanup();
    if (!this.#pendingCleanup || this.destroyed) {
      return false;
    }
    if (delayed) {
      this.#delayedCleanupTimeout = setTimeout(() => {
        this.#delayedCleanupTimeout = null;
        this.#tryCleanup(false);
      }, DELAYED_CLEANUP_TIMEOUT);
      return false;
    }
    for (const {
      renderTasks,
      operatorList
    } of this._intentStates.values()) {
      if (renderTasks.size > 0 || !operatorList.lastChunk) {
        return false;
      }
    }
    this._intentStates.clear();
    this.objs.clear();
    this.#pendingCleanup = false;
    return true;
  }
  #abortDelayedCleanup() {
    if (this.#delayedCleanupTimeout) {
      clearTimeout(this.#delayedCleanupTimeout);
      this.#delayedCleanupTimeout = null;
    }
  }
  _startRenderPage(transparency, cacheKey) {
    const intentState = this._intentStates.get(cacheKey);
    if (!intentState) {
      return;
    }
    this._stats?.timeEnd("Page Request");
    intentState.displayReadyCapability?.resolve(transparency);
  }
  _renderPageChunk(operatorListChunk, intentState) {
    for (let i = 0, ii = operatorListChunk.length; i < ii; i++) {
      intentState.operatorList.fnArray.push(operatorListChunk.fnArray[i]);
      intentState.operatorList.argsArray.push(operatorListChunk.argsArray[i]);
    }
    intentState.operatorList.lastChunk = operatorListChunk.lastChunk;
    intentState.operatorList.separateAnnots = operatorListChunk.separateAnnots;
    for (const internalRenderTask of intentState.renderTasks) {
      internalRenderTask.operatorListChanged();
    }
    if (operatorListChunk.lastChunk) {
      this.#tryCleanup(true);
    }
  }
  _pumpOperatorList({
    renderingIntent,
    cacheKey,
    annotationStorageSerializable
  }) {
    const {
      map,
      transfers
    } = annotationStorageSerializable;
    const readableStream = this._transport.messageHandler.sendWithStream("GetOperatorList", {
      pageIndex: this._pageIndex,
      intent: renderingIntent,
      cacheKey,
      annotationStorage: map
    }, transfers);
    const reader = readableStream.getReader();
    const intentState = this._intentStates.get(cacheKey);
    intentState.streamReader = reader;
    const pump = () => {
      reader.read().then(({
        value,
        done
      }) => {
        if (done) {
          intentState.streamReader = null;
          return;
        }
        if (this._transport.destroyed) {
          return;
        }
        this._renderPageChunk(value, intentState);
        pump();
      }, reason => {
        intentState.streamReader = null;
        if (this._transport.destroyed) {
          return;
        }
        if (intentState.operatorList) {
          intentState.operatorList.lastChunk = true;
          for (const internalRenderTask of intentState.renderTasks) {
            internalRenderTask.operatorListChanged();
          }
          this.#tryCleanup(true);
        }
        if (intentState.displayReadyCapability) {
          intentState.displayReadyCapability.reject(reason);
        } else if (intentState.opListReadCapability) {
          intentState.opListReadCapability.reject(reason);
        } else {
          throw reason;
        }
      });
    };
    pump();
  }
  _abortOperatorList({
    intentState,
    reason,
    force = false
  }) {
    if (!intentState.streamReader) {
      return;
    }
    if (intentState.streamReaderCancelTimeout) {
      clearTimeout(intentState.streamReaderCancelTimeout);
      intentState.streamReaderCancelTimeout = null;
    }
    if (!force) {
      if (intentState.renderTasks.size > 0) {
        return;
      }
      if (reason instanceof _display_utils.RenderingCancelledException) {
        let delay = RENDERING_CANCELLED_TIMEOUT;
        if (reason.extraDelay > 0 && reason.extraDelay < 1000) {
          delay += reason.extraDelay;
        }
        intentState.streamReaderCancelTimeout = setTimeout(() => {
          intentState.streamReaderCancelTimeout = null;
          this._abortOperatorList({
            intentState,
            reason,
            force: true
          });
        }, delay);
        return;
      }
    }
    intentState.streamReader.cancel(new _util.AbortException(reason.message)).catch(() => {});
    intentState.streamReader = null;
    if (this._transport.destroyed) {
      return;
    }
    for (const [curCacheKey, curIntentState] of this._intentStates) {
      if (curIntentState === intentState) {
        this._intentStates.delete(curCacheKey);
        break;
      }
    }
    this.cleanup();
  }
  get stats() {
    return this._stats;
  }
}
exports.PDFPageProxy = PDFPageProxy;
class LoopbackPort {
  #listeners = new Set();
  #deferred = Promise.resolve();
  postMessage(obj, transfer) {
    const event = {
      data: structuredClone(obj, transfer ? {
        transfer
      } : null)
    };
    this.#deferred.then(() => {
      for (const listener of this.#listeners) {
        listener.call(this, event);
      }
    });
  }
  addEventListener(name, listener) {
    this.#listeners.add(listener);
  }
  removeEventListener(name, listener) {
    this.#listeners.delete(listener);
  }
  terminate() {
    this.#listeners.clear();
  }
}
exports.LoopbackPort = LoopbackPort;
const PDFWorkerUtil = {
  isWorkerDisabled: false,
  fallbackWorkerSrc: null,
  fakeWorkerId: 0
};
exports.PDFWorkerUtil = PDFWorkerUtil;
{
  if (_util.isNodeJS && "function" === "function") {
    PDFWorkerUtil.isWorkerDisabled = true;
    PDFWorkerUtil.fallbackWorkerSrc = "./pdf.worker.js";
  } else if (typeof document === "object") {
    const pdfjsFilePath = document?.currentScript?.src;
    if (pdfjsFilePath) {
      PDFWorkerUtil.fallbackWorkerSrc = pdfjsFilePath.replace(/(\.(?:min\.)?js)(\?.*)?$/i, ".worker$1$2");
    }
  }
  PDFWorkerUtil.isSameOrigin = function (baseUrl, otherUrl) {
    let base;
    try {
      base = new URL(baseUrl);
      if (!base.origin || base.origin === "null") {
        return false;
      }
    } catch {
      return false;
    }
    const other = new URL(otherUrl, base);
    return base.origin === other.origin;
  };
  PDFWorkerUtil.createCDNWrapper = function (url) {
    const wrapper = `importScripts("${url}");`;
    return URL.createObjectURL(new Blob([wrapper]));
  };
}
class PDFWorker {
  static #workerPorts;
  constructor({
    name = null,
    port = null,
    verbosity = (0, _util.getVerbosityLevel)()
  } = {}) {
    this.name = name;
    this.destroyed = false;
    this.verbosity = verbosity;
    this._readyCapability = new _util.PromiseCapability();
    this._port = null;
    this._webWorker = null;
    this._messageHandler = null;
    if (port) {
      if (PDFWorker.#workerPorts?.has(port)) {
        throw new Error("Cannot use more than one PDFWorker per port.");
      }
      (PDFWorker.#workerPorts ||= new WeakMap()).set(port, this);
      this._initializeFromPort(port);
      return;
    }
    this._initialize();
  }
  get promise() {
    return this._readyCapability.promise;
  }
  get port() {
    return this._port;
  }
  get messageHandler() {
    return this._messageHandler;
  }
  _initializeFromPort(port) {
    this._port = port;
    this._messageHandler = new _message_handler.MessageHandler("main", "worker", port);
    this._messageHandler.on("ready", function () {});
    this._readyCapability.resolve();
    this._messageHandler.send("configure", {
      verbosity: this.verbosity
    });
  }
  _initialize() {
    if (!PDFWorkerUtil.isWorkerDisabled && !PDFWorker._mainThreadWorkerMessageHandler) {
      let {
        workerSrc
      } = PDFWorker;
      try {
        if (!PDFWorkerUtil.isSameOrigin(window.location.href, workerSrc)) {
          workerSrc = PDFWorkerUtil.createCDNWrapper(new URL(workerSrc, window.location).href);
        }
        const worker = new Worker(workerSrc);
        const messageHandler = new _message_handler.MessageHandler("main", "worker", worker);
        const terminateEarly = () => {
          worker.removeEventListener("error", onWorkerError);
          messageHandler.destroy();
          worker.terminate();
          if (this.destroyed) {
            this._readyCapability.reject(new Error("Worker was destroyed"));
          } else {
            this._setupFakeWorker();
          }
        };
        const onWorkerError = () => {
          if (!this._webWorker) {
            terminateEarly();
          }
        };
        worker.addEventListener("error", onWorkerError);
        messageHandler.on("test", data => {
          worker.removeEventListener("error", onWorkerError);
          if (this.destroyed) {
            terminateEarly();
            return;
          }
          if (data) {
            this._messageHandler = messageHandler;
            this._port = worker;
            this._webWorker = worker;
            this._readyCapability.resolve();
            messageHandler.send("configure", {
              verbosity: this.verbosity
            });
          } else {
            this._setupFakeWorker();
            messageHandler.destroy();
            worker.terminate();
          }
        });
        messageHandler.on("ready", data => {
          worker.removeEventListener("error", onWorkerError);
          if (this.destroyed) {
            terminateEarly();
            return;
          }
          try {
            sendTest();
          } catch {
            this._setupFakeWorker();
          }
        });
        const sendTest = () => {
          const testObj = new Uint8Array();
          messageHandler.send("test", testObj, [testObj.buffer]);
        };
        sendTest();
        return;
      } catch {
        (0, _util.info)("The worker has been disabled.");
      }
    }
    this._setupFakeWorker();
  }
  _setupFakeWorker() {
    if (!PDFWorkerUtil.isWorkerDisabled) {
      (0, _util.warn)("Setting up fake worker.");
      PDFWorkerUtil.isWorkerDisabled = true;
    }
    PDFWorker._setupFakeWorkerGlobal.then(WorkerMessageHandler => {
      if (this.destroyed) {
        this._readyCapability.reject(new Error("Worker was destroyed"));
        return;
      }
      const port = new LoopbackPort();
      this._port = port;
      const id = `fake${PDFWorkerUtil.fakeWorkerId++}`;
      const workerHandler = new _message_handler.MessageHandler(id + "_worker", id, port);
      WorkerMessageHandler.setup(workerHandler, port);
      const messageHandler = new _message_handler.MessageHandler(id, id + "_worker", port);
      this._messageHandler = messageHandler;
      this._readyCapability.resolve();
      messageHandler.send("configure", {
        verbosity: this.verbosity
      });
    }).catch(reason => {
      this._readyCapability.reject(new Error(`Setting up fake worker failed: "${reason.message}".`));
    });
  }
  destroy() {
    this.destroyed = true;
    if (this._webWorker) {
      this._webWorker.terminate();
      this._webWorker = null;
    }
    PDFWorker.#workerPorts?.delete(this._port);
    this._port = null;
    if (this._messageHandler) {
      this._messageHandler.destroy();
      this._messageHandler = null;
    }
  }
  static fromPort(params) {
    if (!params?.port) {
      throw new Error("PDFWorker.fromPort - invalid method signature.");
    }
    const cachedPort = this.#workerPorts?.get(params.port);
    if (cachedPort) {
      if (cachedPort._pendingDestroy) {
        throw new Error("PDFWorker.fromPort - the worker is being destroyed.\n" + "Please remember to await `PDFDocumentLoadingTask.destroy()`-calls.");
      }
      return cachedPort;
    }
    return new PDFWorker(params);
  }
  static get workerSrc() {
    if (_worker_options.GlobalWorkerOptions.workerSrc) {
      return _worker_options.GlobalWorkerOptions.workerSrc;
    }
    if (PDFWorkerUtil.fallbackWorkerSrc !== null) {
      if (!_util.isNodeJS) {
        (0, _display_utils.deprecated)('No "GlobalWorkerOptions.workerSrc" specified.');
      }
      return PDFWorkerUtil.fallbackWorkerSrc;
    }
    throw new Error('No "GlobalWorkerOptions.workerSrc" specified.');
  }
  static get _mainThreadWorkerMessageHandler() {
    try {
      return globalThis.pdfjsWorker?.WorkerMessageHandler || null;
    } catch {
      return null;
    }
  }
  static get _setupFakeWorkerGlobal() {
    const loader = async () => {
      const mainWorkerMessageHandler = this._mainThreadWorkerMessageHandler;
      if (mainWorkerMessageHandler) {
        return mainWorkerMessageHandler;
      }
      if (_util.isNodeJS && "function" === "function") {
        const worker = eval("require")(this.workerSrc);
        return worker.WorkerMessageHandler;
      }
      await (0, _display_utils.loadScript)(this.workerSrc);
      return window.pdfjsWorker.WorkerMessageHandler;
    };
    return (0, _util.shadow)(this, "_setupFakeWorkerGlobal", loader());
  }
}
exports.PDFWorker = PDFWorker;
class WorkerTransport {
  #methodPromises = new Map();
  #pageCache = new Map();
  #pagePromises = new Map();
  #passwordCapability = null;
  constructor(messageHandler, loadingTask, networkStream, params, factory) {
    this.messageHandler = messageHandler;
    this.loadingTask = loadingTask;
    this.commonObjs = new PDFObjects();
    this.fontLoader = new _font_loader.FontLoader({
      ownerDocument: params.ownerDocument,
      styleElement: params.styleElement
    });
    this._params = params;
    this.canvasFactory = factory.canvasFactory;
    this.filterFactory = factory.filterFactory;
    this.cMapReaderFactory = factory.cMapReaderFactory;
    this.standardFontDataFactory = factory.standardFontDataFactory;
    this.destroyed = false;
    this.destroyCapability = null;
    this._networkStream = networkStream;
    this._fullReader = null;
    this._lastProgress = null;
    this.downloadInfoCapability = new _util.PromiseCapability();
    this.setupMessageHandler();
  }
  #cacheSimpleMethod(name, data = null) {
    const cachedPromise = this.#methodPromises.get(name);
    if (cachedPromise) {
      return cachedPromise;
    }
    const promise = this.messageHandler.sendWithPromise(name, data);
    this.#methodPromises.set(name, promise);
    return promise;
  }
  get annotationStorage() {
    return (0, _util.shadow)(this, "annotationStorage", new _annotation_storage.AnnotationStorage());
  }
  getRenderingIntent(intent, annotationMode = _util.AnnotationMode.ENABLE, printAnnotationStorage = null, isOpList = false) {
    let renderingIntent = _util.RenderingIntentFlag.DISPLAY;
    let annotationStorageSerializable = _annotation_storage.SerializableEmpty;
    switch (intent) {
      case "any":
        renderingIntent = _util.RenderingIntentFlag.ANY;
        break;
      case "display":
        break;
      case "print":
        renderingIntent = _util.RenderingIntentFlag.PRINT;
        break;
      default:
        (0, _util.warn)(`getRenderingIntent - invalid intent: ${intent}`);
    }
    switch (annotationMode) {
      case _util.AnnotationMode.DISABLE:
        renderingIntent += _util.RenderingIntentFlag.ANNOTATIONS_DISABLE;
        break;
      case _util.AnnotationMode.ENABLE:
        break;
      case _util.AnnotationMode.ENABLE_FORMS:
        renderingIntent += _util.RenderingIntentFlag.ANNOTATIONS_FORMS;
        break;
      case _util.AnnotationMode.ENABLE_STORAGE:
        renderingIntent += _util.RenderingIntentFlag.ANNOTATIONS_STORAGE;
        const annotationStorage = renderingIntent & _util.RenderingIntentFlag.PRINT && printAnnotationStorage instanceof _annotation_storage.PrintAnnotationStorage ? printAnnotationStorage : this.annotationStorage;
        annotationStorageSerializable = annotationStorage.serializable;
        break;
      default:
        (0, _util.warn)(`getRenderingIntent - invalid annotationMode: ${annotationMode}`);
    }
    if (isOpList) {
      renderingIntent += _util.RenderingIntentFlag.OPLIST;
    }
    return {
      renderingIntent,
      cacheKey: `${renderingIntent}_${annotationStorageSerializable.hash}`,
      annotationStorageSerializable
    };
  }
  destroy() {
    if (this.destroyCapability) {
      return this.destroyCapability.promise;
    }
    this.destroyed = true;
    this.destroyCapability = new _util.PromiseCapability();
    this.#passwordCapability?.reject(new Error("Worker was destroyed during onPassword callback"));
    const waitOn = [];
    for (const page of this.#pageCache.values()) {
      waitOn.push(page._destroy());
    }
    this.#pageCache.clear();
    this.#pagePromises.clear();
    if (this.hasOwnProperty("annotationStorage")) {
      this.annotationStorage.resetModified();
    }
    const terminated = this.messageHandler.sendWithPromise("Terminate", null);
    waitOn.push(terminated);
    Promise.all(waitOn).then(() => {
      this.commonObjs.clear();
      this.fontLoader.clear();
      this.#methodPromises.clear();
      this.filterFactory.destroy();
      this._networkStream?.cancelAllRequests(new _util.AbortException("Worker was terminated."));
      if (this.messageHandler) {
        this.messageHandler.destroy();
        this.messageHandler = null;
      }
      this.destroyCapability.resolve();
    }, this.destroyCapability.reject);
    return this.destroyCapability.promise;
  }
  setupMessageHandler() {
    const {
      messageHandler,
      loadingTask
    } = this;
    messageHandler.on("GetReader", (data, sink) => {
      (0, _util.assert)(this._networkStream, "GetReader - no `IPDFStream` instance available.");
      this._fullReader = this._networkStream.getFullReader();
      this._fullReader.onProgress = evt => {
        this._lastProgress = {
          loaded: evt.loaded,
          total: evt.total
        };
      };
      sink.onPull = () => {
        this._fullReader.read().then(function ({
          value,
          done
        }) {
          if (done) {
            sink.close();
            return;
          }
          (0, _util.assert)(value instanceof ArrayBuffer, "GetReader - expected an ArrayBuffer.");
          sink.enqueue(new Uint8Array(value), 1, [value]);
        }).catch(reason => {
          sink.error(reason);
        });
      };
      sink.onCancel = reason => {
        this._fullReader.cancel(reason);
        sink.ready.catch(readyReason => {
          if (this.destroyed) {
            return;
          }
          throw readyReason;
        });
      };
    });
    messageHandler.on("ReaderHeadersReady", data => {
      const headersCapability = new _util.PromiseCapability();
      const fullReader = this._fullReader;
      fullReader.headersReady.then(() => {
        if (!fullReader.isStreamingSupported || !fullReader.isRangeSupported) {
          if (this._lastProgress) {
            loadingTask.onProgress?.(this._lastProgress);
          }
          fullReader.onProgress = evt => {
            loadingTask.onProgress?.({
              loaded: evt.loaded,
              total: evt.total
            });
          };
        }
        headersCapability.resolve({
          isStreamingSupported: fullReader.isStreamingSupported,
          isRangeSupported: fullReader.isRangeSupported,
          contentLength: fullReader.contentLength
        });
      }, headersCapability.reject);
      return headersCapability.promise;
    });
    messageHandler.on("GetRangeReader", (data, sink) => {
      (0, _util.assert)(this._networkStream, "GetRangeReader - no `IPDFStream` instance available.");
      const rangeReader = this._networkStream.getRangeReader(data.begin, data.end);
      if (!rangeReader) {
        sink.close();
        return;
      }
      sink.onPull = () => {
        rangeReader.read().then(function ({
          value,
          done
        }) {
          if (done) {
            sink.close();
            return;
          }
          (0, _util.assert)(value instanceof ArrayBuffer, "GetRangeReader - expected an ArrayBuffer.");
          sink.enqueue(new Uint8Array(value), 1, [value]);
        }).catch(reason => {
          sink.error(reason);
        });
      };
      sink.onCancel = reason => {
        rangeReader.cancel(reason);
        sink.ready.catch(readyReason => {
          if (this.destroyed) {
            return;
          }
          throw readyReason;
        });
      };
    });
    messageHandler.on("GetDoc", ({
      pdfInfo
    }) => {
      this._numPages = pdfInfo.numPages;
      this._htmlForXfa = pdfInfo.htmlForXfa;
      delete pdfInfo.htmlForXfa;
      loadingTask._capability.resolve(new PDFDocumentProxy(pdfInfo, this));
    });
    messageHandler.on("DocException", function (ex) {
      let reason;
      switch (ex.name) {
        case "PasswordException":
          reason = new _util.PasswordException(ex.message, ex.code);
          break;
        case "InvalidPDFException":
          reason = new _util.InvalidPDFException(ex.message);
          break;
        case "MissingPDFException":
          reason = new _util.MissingPDFException(ex.message);
          break;
        case "UnexpectedResponseException":
          reason = new _util.UnexpectedResponseException(ex.message, ex.status);
          break;
        case "UnknownErrorException":
          reason = new _util.UnknownErrorException(ex.message, ex.details);
          break;
        default:
          (0, _util.unreachable)("DocException - expected a valid Error.");
      }
      loadingTask._capability.reject(reason);
    });
    messageHandler.on("PasswordRequest", exception => {
      this.#passwordCapability = new _util.PromiseCapability();
      if (loadingTask.onPassword) {
        const updatePassword = password => {
          if (password instanceof Error) {
            this.#passwordCapability.reject(password);
          } else {
            this.#passwordCapability.resolve({
              password
            });
          }
        };
        try {
          loadingTask.onPassword(updatePassword, exception.code);
        } catch (ex) {
          this.#passwordCapability.reject(ex);
        }
      } else {
        this.#passwordCapability.reject(new _util.PasswordException(exception.message, exception.code));
      }
      return this.#passwordCapability.promise;
    });
    messageHandler.on("DataLoaded", data => {
      loadingTask.onProgress?.({
        loaded: data.length,
        total: data.length
      });
      this.downloadInfoCapability.resolve(data);
    });
    messageHandler.on("StartRenderPage", data => {
      if (this.destroyed) {
        return;
      }
      const page = this.#pageCache.get(data.pageIndex);
      page._startRenderPage(data.transparency, data.cacheKey);
    });
    messageHandler.on("commonobj", ([id, type, exportedData]) => {
      if (this.destroyed) {
        return;
      }
      if (this.commonObjs.has(id)) {
        return;
      }
      switch (type) {
        case "Font":
          const params = this._params;
          if ("error" in exportedData) {
            const exportedError = exportedData.error;
            (0, _util.warn)(`Error during font loading: ${exportedError}`);
            this.commonObjs.resolve(id, exportedError);
            break;
          }
          const inspectFont = params.pdfBug && globalThis.FontInspector?.enabled ? (font, url) => globalThis.FontInspector.fontAdded(font, url) : null;
          const font = new _font_loader.FontFaceObject(exportedData, {
            isEvalSupported: params.isEvalSupported,
            disableFontFace: params.disableFontFace,
            ignoreErrors: params.ignoreErrors,
            inspectFont
          });
          this.fontLoader.bind(font).catch(reason => {
            return messageHandler.sendWithPromise("FontFallback", {
              id
            });
          }).finally(() => {
            if (!params.fontExtraProperties && font.data) {
              font.data = null;
            }
            this.commonObjs.resolve(id, font);
          });
          break;
        case "FontPath":
        case "Image":
        case "Pattern":
          this.commonObjs.resolve(id, exportedData);
          break;
        default:
          throw new Error(`Got unknown common object type ${type}`);
      }
    });
    messageHandler.on("obj", ([id, pageIndex, type, imageData]) => {
      if (this.destroyed) {
        return;
      }
      const pageProxy = this.#pageCache.get(pageIndex);
      if (pageProxy.objs.has(id)) {
        return;
      }
      switch (type) {
        case "Image":
          pageProxy.objs.resolve(id, imageData);
          if (imageData) {
            let length;
            if (imageData.bitmap) {
              const {
                width,
                height
              } = imageData;
              length = width * height * 4;
            } else {
              length = imageData.data?.length || 0;
            }
            if (length > _util.MAX_IMAGE_SIZE_TO_CACHE) {
              pageProxy._maybeCleanupAfterRender = true;
            }
          }
          break;
        case "Pattern":
          pageProxy.objs.resolve(id, imageData);
          break;
        default:
          throw new Error(`Got unknown object type ${type}`);
      }
    });
    messageHandler.on("DocProgress", data => {
      if (this.destroyed) {
        return;
      }
      loadingTask.onProgress?.({
        loaded: data.loaded,
        total: data.total
      });
    });
    messageHandler.on("FetchBuiltInCMap", data => {
      if (this.destroyed) {
        return Promise.reject(new Error("Worker was destroyed."));
      }
      if (!this.cMapReaderFactory) {
        return Promise.reject(new Error("CMapReaderFactory not initialized, see the `useWorkerFetch` parameter."));
      }
      return this.cMapReaderFactory.fetch(data);
    });
    messageHandler.on("FetchStandardFontData", data => {
      if (this.destroyed) {
        return Promise.reject(new Error("Worker was destroyed."));
      }
      if (!this.standardFontDataFactory) {
        return Promise.reject(new Error("StandardFontDataFactory not initialized, see the `useWorkerFetch` parameter."));
      }
      return this.standardFontDataFactory.fetch(data);
    });
  }
  getData() {
    return this.messageHandler.sendWithPromise("GetData", null);
  }
  saveDocument() {
    if (this.annotationStorage.size <= 0) {
      (0, _util.warn)("saveDocument called while `annotationStorage` is empty, " + "please use the getData-method instead.");
    }
    const {
      map,
      transfers
    } = this.annotationStorage.serializable;
    return this.messageHandler.sendWithPromise("SaveDocument", {
      isPureXfa: !!this._htmlForXfa,
      numPages: this._numPages,
      annotationStorage: map,
      filename: this._fullReader?.filename ?? null
    }, transfers).finally(() => {
      this.annotationStorage.resetModified();
    });
  }
  getPage(pageNumber) {
    if (!Number.isInteger(pageNumber) || pageNumber <= 0 || pageNumber > this._numPages) {
      return Promise.reject(new Error("Invalid page request."));
    }
    const pageIndex = pageNumber - 1,
      cachedPromise = this.#pagePromises.get(pageIndex);
    if (cachedPromise) {
      return cachedPromise;
    }
    const promise = this.messageHandler.sendWithPromise("GetPage", {
      pageIndex
    }).then(pageInfo => {
      if (this.destroyed) {
        throw new Error("Transport destroyed");
      }
      const page = new PDFPageProxy(pageIndex, pageInfo, this, this._params.pdfBug);
      this.#pageCache.set(pageIndex, page);
      return page;
    });
    this.#pagePromises.set(pageIndex, promise);
    return promise;
  }
  getPageIndex(ref) {
    if (typeof ref !== "object" || ref === null || !Number.isInteger(ref.num) || ref.num < 0 || !Number.isInteger(ref.gen) || ref.gen < 0) {
      return Promise.reject(new Error("Invalid pageIndex request."));
    }
    return this.messageHandler.sendWithPromise("GetPageIndex", {
      num: ref.num,
      gen: ref.gen
    });
  }
  getAnnotations(pageIndex, intent) {
    return this.messageHandler.sendWithPromise("GetAnnotations", {
      pageIndex,
      intent
    });
  }
  getFieldObjects() {
    return this.#cacheSimpleMethod("GetFieldObjects");
  }
  hasJSActions() {
    return this.#cacheSimpleMethod("HasJSActions");
  }
  getCalculationOrderIds() {
    return this.messageHandler.sendWithPromise("GetCalculationOrderIds", null);
  }
  getDestinations() {
    return this.messageHandler.sendWithPromise("GetDestinations", null);
  }
  getDestination(id) {
    if (typeof id !== "string") {
      return Promise.reject(new Error("Invalid destination request."));
    }
    return this.messageHandler.sendWithPromise("GetDestination", {
      id
    });
  }
  getPageLabels() {
    return this.messageHandler.sendWithPromise("GetPageLabels", null);
  }
  getPageLayout() {
    return this.messageHandler.sendWithPromise("GetPageLayout", null);
  }
  getPageMode() {
    return this.messageHandler.sendWithPromise("GetPageMode", null);
  }
  getViewerPreferences() {
    return this.messageHandler.sendWithPromise("GetViewerPreferences", null);
  }
  getOpenAction() {
    return this.messageHandler.sendWithPromise("GetOpenAction", null);
  }
  getAttachments() {
    return this.messageHandler.sendWithPromise("GetAttachments", null);
  }
  getDocJSActions() {
    return this.#cacheSimpleMethod("GetDocJSActions");
  }
  getPageJSActions(pageIndex) {
    return this.messageHandler.sendWithPromise("GetPageJSActions", {
      pageIndex
    });
  }
  getStructTree(pageIndex) {
    return this.messageHandler.sendWithPromise("GetStructTree", {
      pageIndex
    });
  }
  getOutline() {
    return this.messageHandler.sendWithPromise("GetOutline", null);
  }
  getOptionalContentConfig() {
    return this.messageHandler.sendWithPromise("GetOptionalContentConfig", null).then(results => {
      return new _optional_content_config.OptionalContentConfig(results);
    });
  }
  getPermissions() {
    return this.messageHandler.sendWithPromise("GetPermissions", null);
  }
  getMetadata() {
    const name = "GetMetadata",
      cachedPromise = this.#methodPromises.get(name);
    if (cachedPromise) {
      return cachedPromise;
    }
    const promise = this.messageHandler.sendWithPromise(name, null).then(results => {
      return {
        info: results[0],
        metadata: results[1] ? new _metadata.Metadata(results[1]) : null,
        contentDispositionFilename: this._fullReader?.filename ?? null,
        contentLength: this._fullReader?.contentLength ?? null
      };
    });
    this.#methodPromises.set(name, promise);
    return promise;
  }
  getMarkInfo() {
    return this.messageHandler.sendWithPromise("GetMarkInfo", null);
  }
  async startCleanup(keepLoadedFonts = false) {
    if (this.destroyed) {
      return;
    }
    await this.messageHandler.sendWithPromise("Cleanup", null);
    for (const page of this.#pageCache.values()) {
      const cleanupSuccessful = page.cleanup();
      if (!cleanupSuccessful) {
        throw new Error(`startCleanup: Page ${page.pageNumber} is currently rendering.`);
      }
    }
    this.commonObjs.clear();
    if (!keepLoadedFonts) {
      this.fontLoader.clear();
    }
    this.#methodPromises.clear();
    this.filterFactory.destroy(true);
  }
  get loadingParams() {
    const {
      disableAutoFetch,
      enableXfa
    } = this._params;
    return (0, _util.shadow)(this, "loadingParams", {
      disableAutoFetch,
      enableXfa
    });
  }
}
class PDFObjects {
  #objs = Object.create(null);
  #ensureObj(objId) {
    return this.#objs[objId] ||= {
      capability: new _util.PromiseCapability(),
      data: null
    };
  }
  get(objId, callback = null) {
    if (callback) {
      const obj = this.#ensureObj(objId);
      obj.capability.promise.then(() => callback(obj.data));
      return null;
    }
    const obj = this.#objs[objId];
    if (!obj?.capability.settled) {
      throw new Error(`Requesting object that isn't resolved yet ${objId}.`);
    }
    return obj.data;
  }
  has(objId) {
    const obj = this.#objs[objId];
    return obj?.capability.settled || false;
  }
  resolve(objId, data = null) {
    const obj = this.#ensureObj(objId);
    obj.data = data;
    obj.capability.resolve();
  }
  clear() {
    for (const objId in this.#objs) {
      const {
        data
      } = this.#objs[objId];
      data?.bitmap?.close();
    }
    this.#objs = Object.create(null);
  }
}
class RenderTask {
  #internalRenderTask = null;
  constructor(internalRenderTask) {
    this.#internalRenderTask = internalRenderTask;
    this.onContinue = null;
  }
  get promise() {
    return this.#internalRenderTask.capability.promise;
  }
  cancel(extraDelay = 0) {
    this.#internalRenderTask.cancel(null, extraDelay);
  }
  get separateAnnots() {
    const {
      separateAnnots
    } = this.#internalRenderTask.operatorList;
    if (!separateAnnots) {
      return false;
    }
    const {
      annotationCanvasMap
    } = this.#internalRenderTask;
    return separateAnnots.form || separateAnnots.canvas && annotationCanvasMap?.size > 0;
  }
}
exports.RenderTask = RenderTask;
class InternalRenderTask {
  static #canvasInUse = new WeakSet();
  constructor({
    callback,
    params,
    objs,
    commonObjs,
    annotationCanvasMap,
    operatorList,
    pageIndex,
    canvasFactory,
    filterFactory,
    useRequestAnimationFrame = false,
    pdfBug = false,
    pageColors = null
  }) {
    this.callback = callback;
    this.params = params;
    this.objs = objs;
    this.commonObjs = commonObjs;
    this.annotationCanvasMap = annotationCanvasMap;
    this.operatorListIdx = null;
    this.operatorList = operatorList;
    this._pageIndex = pageIndex;
    this.canvasFactory = canvasFactory;
    this.filterFactory = filterFactory;
    this._pdfBug = pdfBug;
    this.pageColors = pageColors;
    this.running = false;
    this.graphicsReadyCallback = null;
    this.graphicsReady = false;
    this._useRequestAnimationFrame = useRequestAnimationFrame === true && typeof window !== "undefined";
    this.cancelled = false;
    this.capability = new _util.PromiseCapability();
    this.task = new RenderTask(this);
    this._cancelBound = this.cancel.bind(this);
    this._continueBound = this._continue.bind(this);
    this._scheduleNextBound = this._scheduleNext.bind(this);
    this._nextBound = this._next.bind(this);
    this._canvas = params.canvasContext.canvas;
  }
  get completed() {
    return this.capability.promise.catch(function () {});
  }
  initializeGraphics({
    transparency = false,
    optionalContentConfig
  }) {
    if (this.cancelled) {
      return;
    }
    if (this._canvas) {
      if (InternalRenderTask.#canvasInUse.has(this._canvas)) {
        throw new Error("Cannot use the same canvas during multiple render() operations. " + "Use different canvas or ensure previous operations were " + "cancelled or completed.");
      }
      InternalRenderTask.#canvasInUse.add(this._canvas);
    }
    if (this._pdfBug && globalThis.StepperManager?.enabled) {
      this.stepper = globalThis.StepperManager.create(this._pageIndex);
      this.stepper.init(this.operatorList);
      this.stepper.nextBreakPoint = this.stepper.getNextBreakPoint();
    }
    const {
      canvasContext,
      viewport,
      transform,
      background
    } = this.params;
    this.gfx = new _canvas.CanvasGraphics(canvasContext, this.commonObjs, this.objs, this.canvasFactory, this.filterFactory, {
      optionalContentConfig
    }, this.annotationCanvasMap, this.pageColors);
    this.gfx.beginDrawing({
      transform,
      viewport,
      transparency,
      background
    });
    this.operatorListIdx = 0;
    this.graphicsReady = true;
    this.graphicsReadyCallback?.();
  }
  cancel(error = null, extraDelay = 0) {
    this.running = false;
    this.cancelled = true;
    this.gfx?.endDrawing();
    InternalRenderTask.#canvasInUse.delete(this._canvas);
    this.callback(error || new _display_utils.RenderingCancelledException(`Rendering cancelled, page ${this._pageIndex + 1}`, extraDelay));
  }
  operatorListChanged() {
    if (!this.graphicsReady) {
      this.graphicsReadyCallback ||= this._continueBound;
      return;
    }
    this.stepper?.updateOperatorList(this.operatorList);
    if (this.running) {
      return;
    }
    this._continue();
  }
  _continue() {
    this.running = true;
    if (this.cancelled) {
      return;
    }
    if (this.task.onContinue) {
      this.task.onContinue(this._scheduleNextBound);
    } else {
      this._scheduleNext();
    }
  }
  _scheduleNext() {
    if (this._useRequestAnimationFrame) {
      window.requestAnimationFrame(() => {
        this._nextBound().catch(this._cancelBound);
      });
    } else {
      Promise.resolve().then(this._nextBound).catch(this._cancelBound);
    }
  }
  async _next() {
    if (this.cancelled) {
      return;
    }
    this.operatorListIdx = this.gfx.executeOperatorList(this.operatorList, this.operatorListIdx, this._continueBound, this.stepper);
    if (this.operatorListIdx === this.operatorList.argsArray.length) {
      this.running = false;
      if (this.operatorList.lastChunk) {
        this.gfx.endDrawing();
        InternalRenderTask.#canvasInUse.delete(this._canvas);
        this.callback();
      }
    }
  }
}
const version = '3.11.174';
exports.version = version;
const build = 'ce8716743';
exports.build = build;

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SerializableEmpty = exports.PrintAnnotationStorage = exports.AnnotationStorage = void 0;
var _util = __w_pdfjs_require__(1);
var _editor = __w_pdfjs_require__(4);
var _murmurhash = __w_pdfjs_require__(8);
const SerializableEmpty = Object.freeze({
  map: null,
  hash: "",
  transfers: undefined
});
exports.SerializableEmpty = SerializableEmpty;
class AnnotationStorage {
  #modified = false;
  #storage = new Map();
  constructor() {
    this.onSetModified = null;
    this.onResetModified = null;
    this.onAnnotationEditor = null;
  }
  getValue(key, defaultValue) {
    const value = this.#storage.get(key);
    if (value === undefined) {
      return defaultValue;
    }
    return Object.assign(defaultValue, value);
  }
  getRawValue(key) {
    return this.#storage.get(key);
  }
  remove(key) {
    this.#storage.delete(key);
    if (this.#storage.size === 0) {
      this.resetModified();
    }
    if (typeof this.onAnnotationEditor === "function") {
      for (const value of this.#storage.values()) {
        if (value instanceof _editor.AnnotationEditor) {
          return;
        }
      }
      this.onAnnotationEditor(null);
    }
  }
  setValue(key, value) {
    const obj = this.#storage.get(key);
    let modified = false;
    if (obj !== undefined) {
      for (const [entry, val] of Object.entries(value)) {
        if (obj[entry] !== val) {
          modified = true;
          obj[entry] = val;
        }
      }
    } else {
      modified = true;
      this.#storage.set(key, value);
    }
    if (modified) {
      this.#setModified();
    }
    if (value instanceof _editor.AnnotationEditor && typeof this.onAnnotationEditor === "function") {
      this.onAnnotationEditor(value.constructor._type);
    }
  }
  has(key) {
    return this.#storage.has(key);
  }
  getAll() {
    return this.#storage.size > 0 ? (0, _util.objectFromMap)(this.#storage) : null;
  }
  setAll(obj) {
    for (const [key, val] of Object.entries(obj)) {
      this.setValue(key, val);
    }
  }
  get size() {
    return this.#storage.size;
  }
  #setModified() {
    if (!this.#modified) {
      this.#modified = true;
      if (typeof this.onSetModified === "function") {
        this.onSetModified();
      }
    }
  }
  resetModified() {
    if (this.#modified) {
      this.#modified = false;
      if (typeof this.onResetModified === "function") {
        this.onResetModified();
      }
    }
  }
  get print() {
    return new PrintAnnotationStorage(this);
  }
  get serializable() {
    if (this.#storage.size === 0) {
      return SerializableEmpty;
    }
    const map = new Map(),
      hash = new _murmurhash.MurmurHash3_64(),
      transfers = [];
    const context = Object.create(null);
    let hasBitmap = false;
    for (const [key, val] of this.#storage) {
      const serialized = val instanceof _editor.AnnotationEditor ? val.serialize(false, context) : val;
      if (serialized) {
        map.set(key, serialized);
        hash.update(`${key}:${JSON.stringify(serialized)}`);
        hasBitmap ||= !!serialized.bitmap;
      }
    }
    if (hasBitmap) {
      for (const value of map.values()) {
        if (value.bitmap) {
          transfers.push(value.bitmap);
        }
      }
    }
    return map.size > 0 ? {
      map,
      hash: hash.hexdigest(),
      transfers
    } : SerializableEmpty;
  }
}
exports.AnnotationStorage = AnnotationStorage;
class PrintAnnotationStorage extends AnnotationStorage {
  #serializable;
  constructor(parent) {
    super();
    const {
      map,
      hash,
      transfers
    } = parent.serializable;
    const clone = structuredClone(map, transfers ? {
      transfer: transfers
    } : null);
    this.#serializable = {
      map: clone,
      hash,
      transfers
    };
  }
  get print() {
    (0, _util.unreachable)("Should not call PrintAnnotationStorage.print");
  }
  get serializable() {
    return this.#serializable;
  }
}
exports.PrintAnnotationStorage = PrintAnnotationStorage;

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AnnotationEditor = void 0;
var _tools = __w_pdfjs_require__(5);
var _util = __w_pdfjs_require__(1);
var _display_utils = __w_pdfjs_require__(6);
class AnnotationEditor {
  #altText = "";
  #altTextDecorative = false;
  #altTextButton = null;
  #altTextTooltip = null;
  #altTextTooltipTimeout = null;
  #keepAspectRatio = false;
  #resizersDiv = null;
  #boundFocusin = this.focusin.bind(this);
  #boundFocusout = this.focusout.bind(this);
  #hasBeenClicked = false;
  #isEditing = false;
  #isInEditMode = false;
  _initialOptions = Object.create(null);
  _uiManager = null;
  _focusEventsAllowed = true;
  _l10nPromise = null;
  #isDraggable = false;
  #zIndex = AnnotationEditor._zIndex++;
  static _borderLineWidth = -1;
  static _colorManager = new _tools.ColorManager();
  static _zIndex = 1;
  static SMALL_EDITOR_SIZE = 0;
  constructor(parameters) {
    if (this.constructor === AnnotationEditor) {
      (0, _util.unreachable)("Cannot initialize AnnotationEditor.");
    }
    this.parent = parameters.parent;
    this.id = parameters.id;
    this.width = this.height = null;
    this.pageIndex = parameters.parent.pageIndex;
    this.name = parameters.name;
    this.div = null;
    this._uiManager = parameters.uiManager;
    this.annotationElementId = null;
    this._willKeepAspectRatio = false;
    this._initialOptions.isCentered = parameters.isCentered;
    this._structTreeParentId = null;
    const {
      rotation,
      rawDims: {
        pageWidth,
        pageHeight,
        pageX,
        pageY
      }
    } = this.parent.viewport;
    this.rotation = rotation;
    this.pageRotation = (360 + rotation - this._uiManager.viewParameters.rotation) % 360;
    this.pageDimensions = [pageWidth, pageHeight];
    this.pageTranslation = [pageX, pageY];
    const [width, height] = this.parentDimensions;
    this.x = parameters.x / width;
    this.y = parameters.y / height;
    this.isAttachedToDOM = false;
    this.deleted = false;
  }
  get editorType() {
    return Object.getPrototypeOf(this).constructor._type;
  }
  static get _defaultLineColor() {
    return (0, _util.shadow)(this, "_defaultLineColor", this._colorManager.getHexCode("CanvasText"));
  }
  static deleteAnnotationElement(editor) {
    const fakeEditor = new FakeEditor({
      id: editor.parent.getNextId(),
      parent: editor.parent,
      uiManager: editor._uiManager
    });
    fakeEditor.annotationElementId = editor.annotationElementId;
    fakeEditor.deleted = true;
    fakeEditor._uiManager.addToAnnotationStorage(fakeEditor);
  }
  static initialize(l10n, options = null) {
    AnnotationEditor._l10nPromise ||= new Map(["editor_alt_text_button_label", "editor_alt_text_edit_button_label", "editor_alt_text_decorative_tooltip"].map(str => [str, l10n.get(str)]));
    if (options?.strings) {
      for (const str of options.strings) {
        AnnotationEditor._l10nPromise.set(str, l10n.get(str));
      }
    }
    if (AnnotationEditor._borderLineWidth !== -1) {
      return;
    }
    const style = getComputedStyle(document.documentElement);
    AnnotationEditor._borderLineWidth = parseFloat(style.getPropertyValue("--outline-width")) || 0;
  }
  static updateDefaultParams(_type, _value) {}
  static get defaultPropertiesToUpdate() {
    return [];
  }
  static isHandlingMimeForPasting(mime) {
    return false;
  }
  static paste(item, parent) {
    (0, _util.unreachable)("Not implemented");
  }
  get propertiesToUpdate() {
    return [];
  }
  get _isDraggable() {
    return this.#isDraggable;
  }
  set _isDraggable(value) {
    this.#isDraggable = value;
    this.div?.classList.toggle("draggable", value);
  }
  center() {
    const [pageWidth, pageHeight] = this.pageDimensions;
    switch (this.parentRotation) {
      case 90:
        this.x -= this.height * pageHeight / (pageWidth * 2);
        this.y += this.width * pageWidth / (pageHeight * 2);
        break;
      case 180:
        this.x += this.width / 2;
        this.y += this.height / 2;
        break;
      case 270:
        this.x += this.height * pageHeight / (pageWidth * 2);
        this.y -= this.width * pageWidth / (pageHeight * 2);
        break;
      default:
        this.x -= this.width / 2;
        this.y -= this.height / 2;
        break;
    }
    this.fixAndSetPosition();
  }
  addCommands(params) {
    this._uiManager.addCommands(params);
  }
  get currentLayer() {
    return this._uiManager.currentLayer;
  }
  setInBackground() {
    this.div.style.zIndex = 0;
  }
  setInForeground() {
    this.div.style.zIndex = this.#zIndex;
  }
  setParent(parent) {
    if (parent !== null) {
      this.pageIndex = parent.pageIndex;
      this.pageDimensions = parent.pageDimensions;
    }
    this.parent = parent;
  }
  focusin(event) {
    if (!this._focusEventsAllowed) {
      return;
    }
    if (!this.#hasBeenClicked) {
      this.parent.setSelected(this);
    } else {
      this.#hasBeenClicked = false;
    }
  }
  focusout(event) {
    if (!this._focusEventsAllowed) {
      return;
    }
    if (!this.isAttachedToDOM) {
      return;
    }
    const target = event.relatedTarget;
    if (target?.closest(`#${this.id}`)) {
      return;
    }
    event.preventDefault();
    if (!this.parent?.isMultipleSelection) {
      this.commitOrRemove();
    }
  }
  commitOrRemove() {
    if (this.isEmpty()) {
      this.remove();
    } else {
      this.commit();
    }
  }
  commit() {
    this.addToAnnotationStorage();
  }
  addToAnnotationStorage() {
    this._uiManager.addToAnnotationStorage(this);
  }
  setAt(x, y, tx, ty) {
    const [width, height] = this.parentDimensions;
    [tx, ty] = this.screenToPageTranslation(tx, ty);
    this.x = (x + tx) / width;
    this.y = (y + ty) / height;
    this.fixAndSetPosition();
  }
  #translate([width, height], x, y) {
    [x, y] = this.screenToPageTranslation(x, y);
    this.x += x / width;
    this.y += y / height;
    this.fixAndSetPosition();
  }
  translate(x, y) {
    this.#translate(this.parentDimensions, x, y);
  }
  translateInPage(x, y) {
    this.#translate(this.pageDimensions, x, y);
    this.div.scrollIntoView({
      block: "nearest"
    });
  }
  drag(tx, ty) {
    const [parentWidth, parentHeight] = this.parentDimensions;
    this.x += tx / parentWidth;
    this.y += ty / parentHeight;
    if (this.parent && (this.x < 0 || this.x > 1 || this.y < 0 || this.y > 1)) {
      const {
        x,
        y
      } = this.div.getBoundingClientRect();
      if (this.parent.findNewParent(this, x, y)) {
        this.x -= Math.floor(this.x);
        this.y -= Math.floor(this.y);
      }
    }
    let {
      x,
      y
    } = this;
    const [bx, by] = this.#getBaseTranslation();
    x += bx;
    y += by;
    this.div.style.left = `${(100 * x).toFixed(2)}%`;
    this.div.style.top = `${(100 * y).toFixed(2)}%`;
    this.div.scrollIntoView({
      block: "nearest"
    });
  }
  #getBaseTranslation() {
    const [parentWidth, parentHeight] = this.parentDimensions;
    const {
      _borderLineWidth
    } = AnnotationEditor;
    const x = _borderLineWidth / parentWidth;
    const y = _borderLineWidth / parentHeight;
    switch (this.rotation) {
      case 90:
        return [-x, y];
      case 180:
        return [x, y];
      case 270:
        return [x, -y];
      default:
        return [-x, -y];
    }
  }
  fixAndSetPosition() {
    const [pageWidth, pageHeight] = this.pageDimensions;
    let {
      x,
      y,
      width,
      height
    } = this;
    width *= pageWidth;
    height *= pageHeight;
    x *= pageWidth;
    y *= pageHeight;
    switch (this.rotation) {
      case 0:
        x = Math.max(0, Math.min(pageWidth - width, x));
        y = Math.max(0, Math.min(pageHeight - height, y));
        break;
      case 90:
        x = Math.max(0, Math.min(pageWidth - height, x));
        y = Math.min(pageHeight, Math.max(width, y));
        break;
      case 180:
        x = Math.min(pageWidth, Math.max(width, x));
        y = Math.min(pageHeight, Math.max(height, y));
        break;
      case 270:
        x = Math.min(pageWidth, Math.max(height, x));
        y = Math.max(0, Math.min(pageHeight - width, y));
        break;
    }
    this.x = x /= pageWidth;
    this.y = y /= pageHeight;
    const [bx, by] = this.#getBaseTranslation();
    x += bx;
    y += by;
    const {
      style
    } = this.div;
    style.left = `${(100 * x).toFixed(2)}%`;
    style.top = `${(100 * y).toFixed(2)}%`;
    this.moveInDOM();
  }
  static #rotatePoint(x, y, angle) {
    switch (angle) {
      case 90:
        return [y, -x];
      case 180:
        return [-x, -y];
      case 270:
        return [-y, x];
      default:
        return [x, y];
    }
  }
  screenToPageTranslation(x, y) {
    return AnnotationEditor.#rotatePoint(x, y, this.parentRotation);
  }
  pageTranslationToScreen(x, y) {
    return AnnotationEditor.#rotatePoint(x, y, 360 - this.parentRotation);
  }
  #getRotationMatrix(rotation) {
    switch (rotation) {
      case 90:
        {
          const [pageWidth, pageHeight] = this.pageDimensions;
          return [0, -pageWidth / pageHeight, pageHeight / pageWidth, 0];
        }
      case 180:
        return [-1, 0, 0, -1];
      case 270:
        {
          const [pageWidth, pageHeight] = this.pageDimensions;
          return [0, pageWidth / pageHeight, -pageHeight / pageWidth, 0];
        }
      default:
        return [1, 0, 0, 1];
    }
  }
  get parentScale() {
    return this._uiManager.viewParameters.realScale;
  }
  get parentRotation() {
    return (this._uiManager.viewParameters.rotation + this.pageRotation) % 360;
  }
  get parentDimensions() {
    const {
      parentScale,
      pageDimensions: [pageWidth, pageHeight]
    } = this;
    const scaledWidth = pageWidth * parentScale;
    const scaledHeight = pageHeight * parentScale;
    return _util.FeatureTest.isCSSRoundSupported ? [Math.round(scaledWidth), Math.round(scaledHeight)] : [scaledWidth, scaledHeight];
  }
  setDims(width, height) {
    const [parentWidth, parentHeight] = this.parentDimensions;
    this.div.style.width = `${(100 * width / parentWidth).toFixed(2)}%`;
    if (!this.#keepAspectRatio) {
      this.div.style.height = `${(100 * height / parentHeight).toFixed(2)}%`;
    }
    this.#altTextButton?.classList.toggle("small", width < AnnotationEditor.SMALL_EDITOR_SIZE || height < AnnotationEditor.SMALL_EDITOR_SIZE);
  }
  fixDims() {
    const {
      style
    } = this.div;
    const {
      height,
      width
    } = style;
    const widthPercent = width.endsWith("%");
    const heightPercent = !this.#keepAspectRatio && height.endsWith("%");
    if (widthPercent && heightPercent) {
      return;
    }
    const [parentWidth, parentHeight] = this.parentDimensions;
    if (!widthPercent) {
      style.width = `${(100 * parseFloat(width) / parentWidth).toFixed(2)}%`;
    }
    if (!this.#keepAspectRatio && !heightPercent) {
      style.height = `${(100 * parseFloat(height) / parentHeight).toFixed(2)}%`;
    }
  }
  getInitialTranslation() {
    return [0, 0];
  }
  #createResizers() {
    if (this.#resizersDiv) {
      return;
    }
    this.#resizersDiv = document.createElement("div");
    this.#resizersDiv.classList.add("resizers");
    const classes = ["topLeft", "topRight", "bottomRight", "bottomLeft"];
    if (!this._willKeepAspectRatio) {
      classes.push("topMiddle", "middleRight", "bottomMiddle", "middleLeft");
    }
    for (const name of classes) {
      const div = document.createElement("div");
      this.#resizersDiv.append(div);
      div.classList.add("resizer", name);
      div.addEventListener("pointerdown", this.#resizerPointerdown.bind(this, name));
      div.addEventListener("contextmenu", _display_utils.noContextMenu);
    }
    this.div.prepend(this.#resizersDiv);
  }
  #resizerPointerdown(name, event) {
    event.preventDefault();
    const {
      isMac
    } = _util.FeatureTest.platform;
    if (event.button !== 0 || event.ctrlKey && isMac) {
      return;
    }
    const boundResizerPointermove = this.#resizerPointermove.bind(this, name);
    const savedDraggable = this._isDraggable;
    this._isDraggable = false;
    const pointerMoveOptions = {
      passive: true,
      capture: true
    };
    window.addEventListener("pointermove", boundResizerPointermove, pointerMoveOptions);
    const savedX = this.x;
    const savedY = this.y;
    const savedWidth = this.width;
    const savedHeight = this.height;
    const savedParentCursor = this.parent.div.style.cursor;
    const savedCursor = this.div.style.cursor;
    this.div.style.cursor = this.parent.div.style.cursor = window.getComputedStyle(event.target).cursor;
    const pointerUpCallback = () => {
      this._isDraggable = savedDraggable;
      window.removeEventListener("pointerup", pointerUpCallback);
      window.removeEventListener("blur", pointerUpCallback);
      window.removeEventListener("pointermove", boundResizerPointermove, pointerMoveOptions);
      this.parent.div.style.cursor = savedParentCursor;
      this.div.style.cursor = savedCursor;
      const newX = this.x;
      const newY = this.y;
      const newWidth = this.width;
      const newHeight = this.height;
      if (newX === savedX && newY === savedY && newWidth === savedWidth && newHeight === savedHeight) {
        return;
      }
      this.addCommands({
        cmd: () => {
          this.width = newWidth;
          this.height = newHeight;
          this.x = newX;
          this.y = newY;
          const [parentWidth, parentHeight] = this.parentDimensions;
          this.setDims(parentWidth * newWidth, parentHeight * newHeight);
          this.fixAndSetPosition();
        },
        undo: () => {
          this.width = savedWidth;
          this.height = savedHeight;
          this.x = savedX;
          this.y = savedY;
          const [parentWidth, parentHeight] = this.parentDimensions;
          this.setDims(parentWidth * savedWidth, parentHeight * savedHeight);
          this.fixAndSetPosition();
        },
        mustExec: true
      });
    };
    window.addEventListener("pointerup", pointerUpCallback);
    window.addEventListener("blur", pointerUpCallback);
  }
  #resizerPointermove(name, event) {
    const [parentWidth, parentHeight] = this.parentDimensions;
    const savedX = this.x;
    const savedY = this.y;
    const savedWidth = this.width;
    const savedHeight = this.height;
    const minWidth = AnnotationEditor.MIN_SIZE / parentWidth;
    const minHeight = AnnotationEditor.MIN_SIZE / parentHeight;
    const round = x => Math.round(x * 10000) / 10000;
    const rotationMatrix = this.#getRotationMatrix(this.rotation);
    const transf = (x, y) => [rotationMatrix[0] * x + rotationMatrix[2] * y, rotationMatrix[1] * x + rotationMatrix[3] * y];
    const invRotationMatrix = this.#getRotationMatrix(360 - this.rotation);
    const invTransf = (x, y) => [invRotationMatrix[0] * x + invRotationMatrix[2] * y, invRotationMatrix[1] * x + invRotationMatrix[3] * y];
    let getPoint;
    let getOpposite;
    let isDiagonal = false;
    let isHorizontal = false;
    switch (name) {
      case "topLeft":
        isDiagonal = true;
        getPoint = (w, h) => [0, 0];
        getOpposite = (w, h) => [w, h];
        break;
      case "topMiddle":
        getPoint = (w, h) => [w / 2, 0];
        getOpposite = (w, h) => [w / 2, h];
        break;
      case "topRight":
        isDiagonal = true;
        getPoint = (w, h) => [w, 0];
        getOpposite = (w, h) => [0, h];
        break;
      case "middleRight":
        isHorizontal = true;
        getPoint = (w, h) => [w, h / 2];
        getOpposite = (w, h) => [0, h / 2];
        break;
      case "bottomRight":
        isDiagonal = true;
        getPoint = (w, h) => [w, h];
        getOpposite = (w, h) => [0, 0];
        break;
      case "bottomMiddle":
        getPoint = (w, h) => [w / 2, h];
        getOpposite = (w, h) => [w / 2, 0];
        break;
      case "bottomLeft":
        isDiagonal = true;
        getPoint = (w, h) => [0, h];
        getOpposite = (w, h) => [w, 0];
        break;
      case "middleLeft":
        isHorizontal = true;
        getPoint = (w, h) => [0, h / 2];
        getOpposite = (w, h) => [w, h / 2];
        break;
    }
    const point = getPoint(savedWidth, savedHeight);
    const oppositePoint = getOpposite(savedWidth, savedHeight);
    let transfOppositePoint = transf(...oppositePoint);
    const oppositeX = round(savedX + transfOppositePoint[0]);
    const oppositeY = round(savedY + transfOppositePoint[1]);
    let ratioX = 1;
    let ratioY = 1;
    let [deltaX, deltaY] = this.screenToPageTranslation(event.movementX, event.movementY);
    [deltaX, deltaY] = invTransf(deltaX / parentWidth, deltaY / parentHeight);
    if (isDiagonal) {
      const oldDiag = Math.hypot(savedWidth, savedHeight);
      ratioX = ratioY = Math.max(Math.min(Math.hypot(oppositePoint[0] - point[0] - deltaX, oppositePoint[1] - point[1] - deltaY) / oldDiag, 1 / savedWidth, 1 / savedHeight), minWidth / savedWidth, minHeight / savedHeight);
    } else if (isHorizontal) {
      ratioX = Math.max(minWidth, Math.min(1, Math.abs(oppositePoint[0] - point[0] - deltaX))) / savedWidth;
    } else {
      ratioY = Math.max(minHeight, Math.min(1, Math.abs(oppositePoint[1] - point[1] - deltaY))) / savedHeight;
    }
    const newWidth = round(savedWidth * ratioX);
    const newHeight = round(savedHeight * ratioY);
    transfOppositePoint = transf(...getOpposite(newWidth, newHeight));
    const newX = oppositeX - transfOppositePoint[0];
    const newY = oppositeY - transfOppositePoint[1];
    this.width = newWidth;
    this.height = newHeight;
    this.x = newX;
    this.y = newY;
    this.setDims(parentWidth * newWidth, parentHeight * newHeight);
    this.fixAndSetPosition();
  }
  async addAltTextButton() {
    if (this.#altTextButton) {
      return;
    }
    const altText = this.#altTextButton = document.createElement("button");
    altText.className = "altText";
    const msg = await AnnotationEditor._l10nPromise.get("editor_alt_text_button_label");
    altText.textContent = msg;
    altText.setAttribute("aria-label", msg);
    altText.tabIndex = "0";
    altText.addEventListener("contextmenu", _display_utils.noContextMenu);
    altText.addEventListener("pointerdown", event => event.stopPropagation());
    altText.addEventListener("click", event => {
      event.preventDefault();
      this._uiManager.editAltText(this);
    }, {
      capture: true
    });
    altText.addEventListener("keydown", event => {
      if (event.target === altText && event.key === "Enter") {
        event.preventDefault();
        this._uiManager.editAltText(this);
      }
    });
    this.#setAltTextButtonState();
    this.div.append(altText);
    if (!AnnotationEditor.SMALL_EDITOR_SIZE) {
      const PERCENT = 40;
      AnnotationEditor.SMALL_EDITOR_SIZE = Math.min(128, Math.round(altText.getBoundingClientRect().width * (1 + PERCENT / 100)));
    }
  }
  async #setAltTextButtonState() {
    const button = this.#altTextButton;
    if (!button) {
      return;
    }
    if (!this.#altText && !this.#altTextDecorative) {
      button.classList.remove("done");
      this.#altTextTooltip?.remove();
      return;
    }
    AnnotationEditor._l10nPromise.get("editor_alt_text_edit_button_label").then(msg => {
      button.setAttribute("aria-label", msg);
    });
    let tooltip = this.#altTextTooltip;
    if (!tooltip) {
      this.#altTextTooltip = tooltip = document.createElement("span");
      tooltip.className = "tooltip";
      tooltip.setAttribute("role", "tooltip");
      const id = tooltip.id = `alt-text-tooltip-${this.id}`;
      button.setAttribute("aria-describedby", id);
      const DELAY_TO_SHOW_TOOLTIP = 100;
      button.addEventListener("mouseenter", () => {
        this.#altTextTooltipTimeout = setTimeout(() => {
          this.#altTextTooltipTimeout = null;
          this.#altTextTooltip.classList.add("show");
          this._uiManager._eventBus.dispatch("reporttelemetry", {
            source: this,
            details: {
              type: "editing",
              subtype: this.editorType,
              data: {
                action: "alt_text_tooltip"
              }
            }
          });
        }, DELAY_TO_SHOW_TOOLTIP);
      });
      button.addEventListener("mouseleave", () => {
        clearTimeout(this.#altTextTooltipTimeout);
        this.#altTextTooltipTimeout = null;
        this.#altTextTooltip?.classList.remove("show");
      });
    }
    button.classList.add("done");
    tooltip.innerText = this.#altTextDecorative ? await AnnotationEditor._l10nPromise.get("editor_alt_text_decorative_tooltip") : this.#altText;
    if (!tooltip.parentNode) {
      button.append(tooltip);
    }
  }
  getClientDimensions() {
    return this.div.getBoundingClientRect();
  }
  get altTextData() {
    return {
      altText: this.#altText,
      decorative: this.#altTextDecorative
    };
  }
  set altTextData({
    altText,
    decorative
  }) {
    if (this.#altText === altText && this.#altTextDecorative === decorative) {
      return;
    }
    this.#altText = altText;
    this.#altTextDecorative = decorative;
    this.#setAltTextButtonState();
  }
  render() {
    this.div = document.createElement("div");
    this.div.setAttribute("data-editor-rotation", (360 - this.rotation) % 360);
    this.div.className = this.name;
    this.div.setAttribute("id", this.id);
    this.div.setAttribute("tabIndex", 0);
    this.setInForeground();
    this.div.addEventListener("focusin", this.#boundFocusin);
    this.div.addEventListener("focusout", this.#boundFocusout);
    const [parentWidth, parentHeight] = this.parentDimensions;
    if (this.parentRotation % 180 !== 0) {
      this.div.style.maxWidth = `${(100 * parentHeight / parentWidth).toFixed(2)}%`;
      this.div.style.maxHeight = `${(100 * parentWidth / parentHeight).toFixed(2)}%`;
    }
    const [tx, ty] = this.getInitialTranslation();
    this.translate(tx, ty);
    (0, _tools.bindEvents)(this, this.div, ["pointerdown"]);
    return this.div;
  }
  pointerdown(event) {
    const {
      isMac
    } = _util.FeatureTest.platform;
    if (event.button !== 0 || event.ctrlKey && isMac) {
      event.preventDefault();
      return;
    }
    this.#hasBeenClicked = true;
    this.#setUpDragSession(event);
  }
  #setUpDragSession(event) {
    if (!this._isDraggable) {
      return;
    }
    const isSelected = this._uiManager.isSelected(this);
    this._uiManager.setUpDragSession();
    let pointerMoveOptions, pointerMoveCallback;
    if (isSelected) {
      pointerMoveOptions = {
        passive: true,
        capture: true
      };
      pointerMoveCallback = e => {
        const [tx, ty] = this.screenToPageTranslation(e.movementX, e.movementY);
        this._uiManager.dragSelectedEditors(tx, ty);
      };
      window.addEventListener("pointermove", pointerMoveCallback, pointerMoveOptions);
    }
    const pointerUpCallback = () => {
      window.removeEventListener("pointerup", pointerUpCallback);
      window.removeEventListener("blur", pointerUpCallback);
      if (isSelected) {
        window.removeEventListener("pointermove", pointerMoveCallback, pointerMoveOptions);
      }
      this.#hasBeenClicked = false;
      if (!this._uiManager.endDragSession()) {
        const {
          isMac
        } = _util.FeatureTest.platform;
        if (event.ctrlKey && !isMac || event.shiftKey || event.metaKey && isMac) {
          this.parent.toggleSelected(this);
        } else {
          this.parent.setSelected(this);
        }
      }
    };
    window.addEventListener("pointerup", pointerUpCallback);
    window.addEventListener("blur", pointerUpCallback);
  }
  moveInDOM() {
    this.parent?.moveEditorInDOM(this);
  }
  _setParentAndPosition(parent, x, y) {
    parent.changeParent(this);
    this.x = x;
    this.y = y;
    this.fixAndSetPosition();
  }
  getRect(tx, ty) {
    const scale = this.parentScale;
    const [pageWidth, pageHeight] = this.pageDimensions;
    const [pageX, pageY] = this.pageTranslation;
    const shiftX = tx / scale;
    const shiftY = ty / scale;
    const x = this.x * pageWidth;
    const y = this.y * pageHeight;
    const width = this.width * pageWidth;
    const height = this.height * pageHeight;
    switch (this.rotation) {
      case 0:
        return [x + shiftX + pageX, pageHeight - y - shiftY - height + pageY, x + shiftX + width + pageX, pageHeight - y - shiftY + pageY];
      case 90:
        return [x + shiftY + pageX, pageHeight - y + shiftX + pageY, x + shiftY + height + pageX, pageHeight - y + shiftX + width + pageY];
      case 180:
        return [x - shiftX - width + pageX, pageHeight - y + shiftY + pageY, x - shiftX + pageX, pageHeight - y + shiftY + height + pageY];
      case 270:
        return [x - shiftY - height + pageX, pageHeight - y - shiftX - width + pageY, x - shiftY + pageX, pageHeight - y - shiftX + pageY];
      default:
        throw new Error("Invalid rotation");
    }
  }
  getRectInCurrentCoords(rect, pageHeight) {
    const [x1, y1, x2, y2] = rect;
    const width = x2 - x1;
    const height = y2 - y1;
    switch (this.rotation) {
      case 0:
        return [x1, pageHeight - y2, width, height];
      case 90:
        return [x1, pageHeight - y1, height, width];
      case 180:
        return [x2, pageHeight - y1, width, height];
      case 270:
        return [x2, pageHeight - y2, height, width];
      default:
        throw new Error("Invalid rotation");
    }
  }
  onceAdded() {}
  isEmpty() {
    return false;
  }
  enableEditMode() {
    this.#isInEditMode = true;
  }
  disableEditMode() {
    this.#isInEditMode = false;
  }
  isInEditMode() {
    return this.#isInEditMode;
  }
  shouldGetKeyboardEvents() {
    return false;
  }
  needsToBeRebuilt() {
    return this.div && !this.isAttachedToDOM;
  }
  rebuild() {
    this.div?.addEventListener("focusin", this.#boundFocusin);
    this.div?.addEventListener("focusout", this.#boundFocusout);
  }
  serialize(isForCopying = false, context = null) {
    (0, _util.unreachable)("An editor must be serializable");
  }
  static deserialize(data, parent, uiManager) {
    const editor = new this.prototype.constructor({
      parent,
      id: parent.getNextId(),
      uiManager
    });
    editor.rotation = data.rotation;
    const [pageWidth, pageHeight] = editor.pageDimensions;
    const [x, y, width, height] = editor.getRectInCurrentCoords(data.rect, pageHeight);
    editor.x = x / pageWidth;
    editor.y = y / pageHeight;
    editor.width = width / pageWidth;
    editor.height = height / pageHeight;
    return editor;
  }
  remove() {
    this.div.removeEventListener("focusin", this.#boundFocusin);
    this.div.removeEventListener("focusout", this.#boundFocusout);
    if (!this.isEmpty()) {
      this.commit();
    }
    if (this.parent) {
      this.parent.remove(this);
    } else {
      this._uiManager.removeEditor(this);
    }
    this.#altTextButton?.remove();
    this.#altTextButton = null;
    this.#altTextTooltip = null;
  }
  get isResizable() {
    return false;
  }
  makeResizable() {
    if (this.isResizable) {
      this.#createResizers();
      this.#resizersDiv.classList.remove("hidden");
    }
  }
  select() {
    this.makeResizable();
    this.div?.classList.add("selectedEditor");
  }
  unselect() {
    this.#resizersDiv?.classList.add("hidden");
    this.div?.classList.remove("selectedEditor");
    if (this.div?.contains(document.activeElement)) {
      this._uiManager.currentLayer.div.focus();
    }
  }
  updateParams(type, value) {}
  disableEditing() {
    if (this.#altTextButton) {
      this.#altTextButton.hidden = true;
    }
  }
  enableEditing() {
    if (this.#altTextButton) {
      this.#altTextButton.hidden = false;
    }
  }
  enterInEditMode() {}
  get contentDiv() {
    return this.div;
  }
  get isEditing() {
    return this.#isEditing;
  }
  set isEditing(value) {
    this.#isEditing = value;
    if (!this.parent) {
      return;
    }
    if (value) {
      this.parent.setSelected(this);
      this.parent.setActiveEditor(this);
    } else {
      this.parent.setActiveEditor(null);
    }
  }
  setAspectRatio(width, height) {
    this.#keepAspectRatio = true;
    const aspectRatio = width / height;
    const {
      style
    } = this.div;
    style.aspectRatio = aspectRatio;
    style.height = "auto";
  }
  static get MIN_SIZE() {
    return 16;
  }
}
exports.AnnotationEditor = AnnotationEditor;
class FakeEditor extends AnnotationEditor {
  constructor(params) {
    super(params);
    this.annotationElementId = params.annotationElementId;
    this.deleted = true;
  }
  serialize() {
    return {
      id: this.annotationElementId,
      deleted: true,
      pageIndex: this.pageIndex
    };
  }
}

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.KeyboardManager = exports.CommandManager = exports.ColorManager = exports.AnnotationEditorUIManager = void 0;
exports.bindEvents = bindEvents;
exports.opacityToHex = opacityToHex;
var _util = __w_pdfjs_require__(1);
var _display_utils = __w_pdfjs_require__(6);
function bindEvents(obj, element, names) {
  for (const name of names) {
    element.addEventListener(name, obj[name].bind(obj));
  }
}
function opacityToHex(opacity) {
  return Math.round(Math.min(255, Math.max(1, 255 * opacity))).toString(16).padStart(2, "0");
}
class IdManager {
  #id = 0;
  getId() {
    return `${_util.AnnotationEditorPrefix}${this.#id++}`;
  }
}
class ImageManager {
  #baseId = (0, _util.getUuid)();
  #id = 0;
  #cache = null;
  static get _isSVGFittingCanvas() {
    const svg = `data:image/svg+xml;charset=UTF-8,<svg viewBox="0 0 1 1" width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" style="fill:red;"/></svg>`;
    const canvas = new OffscreenCanvas(1, 3);
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = svg;
    const promise = image.decode().then(() => {
      ctx.drawImage(image, 0, 0, 1, 1, 0, 0, 1, 3);
      return new Uint32Array(ctx.getImageData(0, 0, 1, 1).data.buffer)[0] === 0;
    });
    return (0, _util.shadow)(this, "_isSVGFittingCanvas", promise);
  }
  async #get(key, rawData) {
    this.#cache ||= new Map();
    let data = this.#cache.get(key);
    if (data === null) {
      return null;
    }
    if (data?.bitmap) {
      data.refCounter += 1;
      return data;
    }
    try {
      data ||= {
        bitmap: null,
        id: `image_${this.#baseId}_${this.#id++}`,
        refCounter: 0,
        isSvg: false
      };
      let image;
      if (typeof rawData === "string") {
        data.url = rawData;
        const response = await fetch(rawData);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        image = await response.blob();
      } else {
        image = data.file = rawData;
      }
      if (image.type === "image/svg+xml") {
        const mustRemoveAspectRatioPromise = ImageManager._isSVGFittingCanvas;
        const fileReader = new FileReader();
        const imageElement = new Image();
        const imagePromise = new Promise((resolve, reject) => {
          imageElement.onload = () => {
            data.bitmap = imageElement;
            data.isSvg = true;
            resolve();
          };
          fileReader.onload = async () => {
            const url = data.svgUrl = fileReader.result;
            imageElement.src = (await mustRemoveAspectRatioPromise) ? `${url}#svgView(preserveAspectRatio(none))` : url;
          };
          imageElement.onerror = fileReader.onerror = reject;
        });
        fileReader.readAsDataURL(image);
        await imagePromise;
      } else {
        data.bitmap = await createImageBitmap(image);
      }
      data.refCounter = 1;
    } catch (e) {
      console.error(e);
      data = null;
    }
    this.#cache.set(key, data);
    if (data) {
      this.#cache.set(data.id, data);
    }
    return data;
  }
  async getFromFile(file) {
    const {
      lastModified,
      name,
      size,
      type
    } = file;
    return this.#get(`${lastModified}_${name}_${size}_${type}`, file);
  }
  async getFromUrl(url) {
    return this.#get(url, url);
  }
  async getFromId(id) {
    this.#cache ||= new Map();
    const data = this.#cache.get(id);
    if (!data) {
      return null;
    }
    if (data.bitmap) {
      data.refCounter += 1;
      return data;
    }
    if (data.file) {
      return this.getFromFile(data.file);
    }
    return this.getFromUrl(data.url);
  }
  getSvgUrl(id) {
    const data = this.#cache.get(id);
    if (!data?.isSvg) {
      return null;
    }
    return data.svgUrl;
  }
  deleteId(id) {
    this.#cache ||= new Map();
    const data = this.#cache.get(id);
    if (!data) {
      return;
    }
    data.refCounter -= 1;
    if (data.refCounter !== 0) {
      return;
    }
    data.bitmap = null;
  }
  isValidId(id) {
    return id.startsWith(`image_${this.#baseId}_`);
  }
}
class CommandManager {
  #commands = [];
  #locked = false;
  #maxSize;
  #position = -1;
  constructor(maxSize = 128) {
    this.#maxSize = maxSize;
  }
  add({
    cmd,
    undo,
    mustExec,
    type = NaN,
    overwriteIfSameType = false,
    keepUndo = false
  }) {
    if (mustExec) {
      cmd();
    }
    if (this.#locked) {
      return;
    }
    const save = {
      cmd,
      undo,
      type
    };
    if (this.#position === -1) {
      if (this.#commands.length > 0) {
        this.#commands.length = 0;
      }
      this.#position = 0;
      this.#commands.push(save);
      return;
    }
    if (overwriteIfSameType && this.#commands[this.#position].type === type) {
      if (keepUndo) {
        save.undo = this.#commands[this.#position].undo;
      }
      this.#commands[this.#position] = save;
      return;
    }
    const next = this.#position + 1;
    if (next === this.#maxSize) {
      this.#commands.splice(0, 1);
    } else {
      this.#position = next;
      if (next < this.#commands.length) {
        this.#commands.splice(next);
      }
    }
    this.#commands.push(save);
  }
  undo() {
    if (this.#position === -1) {
      return;
    }
    this.#locked = true;
    this.#commands[this.#position].undo();
    this.#locked = false;
    this.#position -= 1;
  }
  redo() {
    if (this.#position < this.#commands.length - 1) {
      this.#position += 1;
      this.#locked = true;
      this.#commands[this.#position].cmd();
      this.#locked = false;
    }
  }
  hasSomethingToUndo() {
    return this.#position !== -1;
  }
  hasSomethingToRedo() {
    return this.#position < this.#commands.length - 1;
  }
  destroy() {
    this.#commands = null;
  }
}
exports.CommandManager = CommandManager;
class KeyboardManager {
  constructor(callbacks) {
    this.buffer = [];
    this.callbacks = new Map();
    this.allKeys = new Set();
    const {
      isMac
    } = _util.FeatureTest.platform;
    for (const [keys, callback, options = {}] of callbacks) {
      for (const key of keys) {
        const isMacKey = key.startsWith("mac+");
        if (isMac && isMacKey) {
          this.callbacks.set(key.slice(4), {
            callback,
            options
          });
          this.allKeys.add(key.split("+").at(-1));
        } else if (!isMac && !isMacKey) {
          this.callbacks.set(key, {
            callback,
            options
          });
          this.allKeys.add(key.split("+").at(-1));
        }
      }
    }
  }
  #serialize(event) {
    if (event.altKey) {
      this.buffer.push("alt");
    }
    if (event.ctrlKey) {
      this.buffer.push("ctrl");
    }
    if (event.metaKey) {
      this.buffer.push("meta");
    }
    if (event.shiftKey) {
      this.buffer.push("shift");
    }
    this.buffer.push(event.key);
    const str = this.buffer.join("+");
    this.buffer.length = 0;
    return str;
  }
  exec(self, event) {
    if (!this.allKeys.has(event.key)) {
      return;
    }
    const info = this.callbacks.get(this.#serialize(event));
    if (!info) {
      return;
    }
    const {
      callback,
      options: {
        bubbles = false,
        args = [],
        checker = null
      }
    } = info;
    if (checker && !checker(self, event)) {
      return;
    }
    callback.bind(self, ...args)();
    if (!bubbles) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
exports.KeyboardManager = KeyboardManager;
class ColorManager {
  static _colorsMapping = new Map([["CanvasText", [0, 0, 0]], ["Canvas", [255, 255, 255]]]);
  get _colors() {
    const colors = new Map([["CanvasText", null], ["Canvas", null]]);
    (0, _display_utils.getColorValues)(colors);
    return (0, _util.shadow)(this, "_colors", colors);
  }
  convert(color) {
    const rgb = (0, _display_utils.getRGB)(color);
    if (!window.matchMedia("(forced-colors: active)").matches) {
      return rgb;
    }
    for (const [name, RGB] of this._colors) {
      if (RGB.every((x, i) => x === rgb[i])) {
        return ColorManager._colorsMapping.get(name);
      }
    }
    return rgb;
  }
  getHexCode(name) {
    const rgb = this._colors.get(name);
    if (!rgb) {
      return name;
    }
    return _util.Util.makeHexColor(...rgb);
  }
}
exports.ColorManager = ColorManager;
class AnnotationEditorUIManager {
  #activeEditor = null;
  #allEditors = new Map();
  #allLayers = new Map();
  #altTextManager = null;
  #annotationStorage = null;
  #commandManager = new CommandManager();
  #currentPageIndex = 0;
  #deletedAnnotationsElementIds = new Set();
  #draggingEditors = null;
  #editorTypes = null;
  #editorsToRescale = new Set();
  #filterFactory = null;
  #idManager = new IdManager();
  #isEnabled = false;
  #isWaiting = false;
  #lastActiveElement = null;
  #mode = _util.AnnotationEditorType.NONE;
  #selectedEditors = new Set();
  #pageColors = null;
  #boundBlur = this.blur.bind(this);
  #boundFocus = this.focus.bind(this);
  #boundCopy = this.copy.bind(this);
  #boundCut = this.cut.bind(this);
  #boundPaste = this.paste.bind(this);
  #boundKeydown = this.keydown.bind(this);
  #boundOnEditingAction = this.onEditingAction.bind(this);
  #boundOnPageChanging = this.onPageChanging.bind(this);
  #boundOnScaleChanging = this.onScaleChanging.bind(this);
  #boundOnRotationChanging = this.onRotationChanging.bind(this);
  #previousStates = {
    isEditing: false,
    isEmpty: true,
    hasSomethingToUndo: false,
    hasSomethingToRedo: false,
    hasSelectedEditor: false
  };
  #translation = [0, 0];
  #translationTimeoutId = null;
  #container = null;
  #viewer = null;
  static TRANSLATE_SMALL = 1;
  static TRANSLATE_BIG = 10;
  static get _keyboardManager() {
    const proto = AnnotationEditorUIManager.prototype;
    const arrowChecker = self => {
      const {
        activeElement
      } = document;
      return activeElement && self.#container.contains(activeElement) && self.hasSomethingToControl();
    };
    const small = this.TRANSLATE_SMALL;
    const big = this.TRANSLATE_BIG;
    return (0, _util.shadow)(this, "_keyboardManager", new KeyboardManager([[["ctrl+a", "mac+meta+a"], proto.selectAll], [["ctrl+z", "mac+meta+z"], proto.undo], [["ctrl+y", "ctrl+shift+z", "mac+meta+shift+z", "ctrl+shift+Z", "mac+meta+shift+Z"], proto.redo], [["Backspace", "alt+Backspace", "ctrl+Backspace", "shift+Backspace", "mac+Backspace", "mac+alt+Backspace", "mac+ctrl+Backspace", "Delete", "ctrl+Delete", "shift+Delete", "mac+Delete"], proto.delete], [["Escape", "mac+Escape"], proto.unselectAll], [["ArrowLeft", "mac+ArrowLeft"], proto.translateSelectedEditors, {
      args: [-small, 0],
      checker: arrowChecker
    }], [["ctrl+ArrowLeft", "mac+shift+ArrowLeft"], proto.translateSelectedEditors, {
      args: [-big, 0],
      checker: arrowChecker
    }], [["ArrowRight", "mac+ArrowRight"], proto.translateSelectedEditors, {
      args: [small, 0],
      checker: arrowChecker
    }], [["ctrl+ArrowRight", "mac+shift+ArrowRight"], proto.translateSelectedEditors, {
      args: [big, 0],
      checker: arrowChecker
    }], [["ArrowUp", "mac+ArrowUp"], proto.translateSelectedEditors, {
      args: [0, -small],
      checker: arrowChecker
    }], [["ctrl+ArrowUp", "mac+shift+ArrowUp"], proto.translateSelectedEditors, {
      args: [0, -big],
      checker: arrowChecker
    }], [["ArrowDown", "mac+ArrowDown"], proto.translateSelectedEditors, {
      args: [0, small],
      checker: arrowChecker
    }], [["ctrl+ArrowDown", "mac+shift+ArrowDown"], proto.translateSelectedEditors, {
      args: [0, big],
      checker: arrowChecker
    }]]));
  }
  constructor(container, viewer, altTextManager, eventBus, pdfDocument, pageColors) {
    this.#container = container;
    this.#viewer = viewer;
    this.#altTextManager = altTextManager;
    this._eventBus = eventBus;
    this._eventBus._on("editingaction", this.#boundOnEditingAction);
    this._eventBus._on("pagechanging", this.#boundOnPageChanging);
    this._eventBus._on("scalechanging", this.#boundOnScaleChanging);
    this._eventBus._on("rotationchanging", this.#boundOnRotationChanging);
    this.#annotationStorage = pdfDocument.annotationStorage;
    this.#filterFactory = pdfDocument.filterFactory;
    this.#pageColors = pageColors;
    this.viewParameters = {
      realScale: _display_utils.PixelsPerInch.PDF_TO_CSS_UNITS,
      rotation: 0
    };
  }
  destroy() {
    this.#removeKeyboardManager();
    this.#removeFocusManager();
    this._eventBus._off("editingaction", this.#boundOnEditingAction);
    this._eventBus._off("pagechanging", this.#boundOnPageChanging);
    this._eventBus._off("scalechanging", this.#boundOnScaleChanging);
    this._eventBus._off("rotationchanging", this.#boundOnRotationChanging);
    for (const layer of this.#allLayers.values()) {
      layer.destroy();
    }
    this.#allLayers.clear();
    this.#allEditors.clear();
    this.#editorsToRescale.clear();
    this.#activeEditor = null;
    this.#selectedEditors.clear();
    this.#commandManager.destroy();
    this.#altTextManager.destroy();
  }
  get hcmFilter() {
    return (0, _util.shadow)(this, "hcmFilter", this.#pageColors ? this.#filterFactory.addHCMFilter(this.#pageColors.foreground, this.#pageColors.background) : "none");
  }
  get direction() {
    return (0, _util.shadow)(this, "direction", getComputedStyle(this.#container).direction);
  }
  editAltText(editor) {
    this.#altTextManager?.editAltText(this, editor);
  }
  onPageChanging({
    pageNumber
  }) {
    this.#currentPageIndex = pageNumber - 1;
  }
  focusMainContainer() {
    this.#container.focus();
  }
  findParent(x, y) {
    for (const layer of this.#allLayers.values()) {
      const {
        x: layerX,
        y: layerY,
        width,
        height
      } = layer.div.getBoundingClientRect();
      if (x >= layerX && x <= layerX + width && y >= layerY && y <= layerY + height) {
        return layer;
      }
    }
    return null;
  }
  disableUserSelect(value = false) {
    this.#viewer.classList.toggle("noUserSelect", value);
  }
  addShouldRescale(editor) {
    this.#editorsToRescale.add(editor);
  }
  removeShouldRescale(editor) {
    this.#editorsToRescale.delete(editor);
  }
  onScaleChanging({
    scale
  }) {
    this.commitOrRemove();
    this.viewParameters.realScale = scale * _display_utils.PixelsPerInch.PDF_TO_CSS_UNITS;
    for (const editor of this.#editorsToRescale) {
      editor.onScaleChanging();
    }
  }
  onRotationChanging({
    pagesRotation
  }) {
    this.commitOrRemove();
    this.viewParameters.rotation = pagesRotation;
  }
  addToAnnotationStorage(editor) {
    if (!editor.isEmpty() && this.#annotationStorage && !this.#annotationStorage.has(editor.id)) {
      this.#annotationStorage.setValue(editor.id, editor);
    }
  }
  #addFocusManager() {
    window.addEventListener("focus", this.#boundFocus);
    window.addEventListener("blur", this.#boundBlur);
  }
  #removeFocusManager() {
    window.removeEventListener("focus", this.#boundFocus);
    window.removeEventListener("blur", this.#boundBlur);
  }
  blur() {
    if (!this.hasSelection) {
      return;
    }
    const {
      activeElement
    } = document;
    for (const editor of this.#selectedEditors) {
      if (editor.div.contains(activeElement)) {
        this.#lastActiveElement = [editor, activeElement];
        editor._focusEventsAllowed = false;
        break;
      }
    }
  }
  focus() {
    if (!this.#lastActiveElement) {
      return;
    }
    const [lastEditor, lastActiveElement] = this.#lastActiveElement;
    this.#lastActiveElement = null;
    lastActiveElement.addEventListener("focusin", () => {
      lastEditor._focusEventsAllowed = true;
    }, {
      once: true
    });
    lastActiveElement.focus();
  }
  #addKeyboardManager() {
    window.addEventListener("keydown", this.#boundKeydown, {
      capture: true
    });
  }
  #removeKeyboardManager() {
    window.removeEventListener("keydown", this.#boundKeydown, {
      capture: true
    });
  }
  #addCopyPasteListeners() {
    document.addEventListener("copy", this.#boundCopy);
    document.addEventListener("cut", this.#boundCut);
    document.addEventListener("paste", this.#boundPaste);
  }
  #removeCopyPasteListeners() {
    document.removeEventListener("copy", this.#boundCopy);
    document.removeEventListener("cut", this.#boundCut);
    document.removeEventListener("paste", this.#boundPaste);
  }
  addEditListeners() {
    this.#addKeyboardManager();
    this.#addCopyPasteListeners();
  }
  removeEditListeners() {
    this.#removeKeyboardManager();
    this.#removeCopyPasteListeners();
  }
  copy(event) {
    event.preventDefault();
    this.#activeEditor?.commitOrRemove();
    if (!this.hasSelection) {
      return;
    }
    const editors = [];
    for (const editor of this.#selectedEditors) {
      const serialized = editor.serialize(true);
      if (serialized) {
        editors.push(serialized);
      }
    }
    if (editors.length === 0) {
      return;
    }
    event.clipboardData.setData("application/pdfjs", JSON.stringify(editors));
  }
  cut(event) {
    this.copy(event);
    this.delete();
  }
  paste(event) {
    event.preventDefault();
    const {
      clipboardData
    } = event;
    for (const item of clipboardData.items) {
      for (const editorType of this.#editorTypes) {
        if (editorType.isHandlingMimeForPasting(item.type)) {
          editorType.paste(item, this.currentLayer);
          return;
        }
      }
    }
    let data = clipboardData.getData("application/pdfjs");
    if (!data) {
      return;
    }
    try {
      data = JSON.parse(data);
    } catch (ex) {
      (0, _util.warn)(`paste: "${ex.message}".`);
      return;
    }
    if (!Array.isArray(data)) {
      return;
    }
    this.unselectAll();
    const layer = this.currentLayer;
    try {
      const newEditors = [];
      for (const editor of data) {
        const deserializedEditor = layer.deserialize(editor);
        if (!deserializedEditor) {
          return;
        }
        newEditors.push(deserializedEditor);
      }
      const cmd = () => {
        for (const editor of newEditors) {
          this.#addEditorToLayer(editor);
        }
        this.#selectEditors(newEditors);
      };
      const undo = () => {
        for (const editor of newEditors) {
          editor.remove();
        }
      };
      this.addCommands({
        cmd,
        undo,
        mustExec: true
      });
    } catch (ex) {
      (0, _util.warn)(`paste: "${ex.message}".`);
    }
  }
  keydown(event) {
    if (!this.getActive()?.shouldGetKeyboardEvents()) {
      AnnotationEditorUIManager._keyboardManager.exec(this, event);
    }
  }
  onEditingAction(details) {
    if (["undo", "redo", "delete", "selectAll"].includes(details.name)) {
      this[details.name]();
    }
  }
  #dispatchUpdateStates(details) {
    const hasChanged = Object.entries(details).some(([key, value]) => this.#previousStates[key] !== value);
    if (hasChanged) {
      this._eventBus.dispatch("annotationeditorstateschanged", {
        source: this,
        details: Object.assign(this.#previousStates, details)
      });
    }
  }
  #dispatchUpdateUI(details) {
    this._eventBus.dispatch("annotationeditorparamschanged", {
      source: this,
      details
    });
  }
  setEditingState(isEditing) {
    if (isEditing) {
      this.#addFocusManager();
      this.#addKeyboardManager();
      this.#addCopyPasteListeners();
      this.#dispatchUpdateStates({
        isEditing: this.#mode !== _util.AnnotationEditorType.NONE,
        isEmpty: this.#isEmpty(),
        hasSomethingToUndo: this.#commandManager.hasSomethingToUndo(),
        hasSomethingToRedo: this.#commandManager.hasSomethingToRedo(),
        hasSelectedEditor: false
      });
    } else {
      this.#removeFocusManager();
      this.#removeKeyboardManager();
      this.#removeCopyPasteListeners();
      this.#dispatchUpdateStates({
        isEditing: false
      });
      this.disableUserSelect(false);
    }
  }
  registerEditorTypes(types) {
    if (this.#editorTypes) {
      return;
    }
    this.#editorTypes = types;
    for (const editorType of this.#editorTypes) {
      this.#dispatchUpdateUI(editorType.defaultPropertiesToUpdate);
    }
  }
  getId() {
    return this.#idManager.getId();
  }
  get currentLayer() {
    return this.#allLayers.get(this.#currentPageIndex);
  }
  getLayer(pageIndex) {
    return this.#allLayers.get(pageIndex);
  }
  get currentPageIndex() {
    return this.#currentPageIndex;
  }
  addLayer(layer) {
    this.#allLayers.set(layer.pageIndex, layer);
    if (this.#isEnabled) {
      layer.enable();
    } else {
      layer.disable();
    }
  }
  removeLayer(layer) {
    this.#allLayers.delete(layer.pageIndex);
  }
  updateMode(mode, editId = null) {
    if (this.#mode === mode) {
      return;
    }
    this.#mode = mode;
    if (mode === _util.AnnotationEditorType.NONE) {
      this.setEditingState(false);
      this.#disableAll();
      return;
    }
    this.setEditingState(true);
    this.#enableAll();
    this.unselectAll();
    for (const layer of this.#allLayers.values()) {
      layer.updateMode(mode);
    }
    if (!editId) {
      return;
    }
    for (const editor of this.#allEditors.values()) {
      if (editor.annotationElementId === editId) {
        this.setSelected(editor);
        editor.enterInEditMode();
        break;
      }
    }
  }
  updateToolbar(mode) {
    if (mode === this.#mode) {
      return;
    }
    this._eventBus.dispatch("switchannotationeditormode", {
      source: this,
      mode
    });
  }
  updateParams(type, value) {
    if (!this.#editorTypes) {
      return;
    }
    if (type === _util.AnnotationEditorParamsType.CREATE) {
      this.currentLayer.addNewEditor(type);
      return;
    }
    for (const editor of this.#selectedEditors) {
      editor.updateParams(type, value);
    }
    for (const editorType of this.#editorTypes) {
      editorType.updateDefaultParams(type, value);
    }
  }
  enableWaiting(mustWait = false) {
    if (this.#isWaiting === mustWait) {
      return;
    }
    this.#isWaiting = mustWait;
    for (const layer of this.#allLayers.values()) {
      if (mustWait) {
        layer.disableClick();
      } else {
        layer.enableClick();
      }
      layer.div.classList.toggle("waiting", mustWait);
    }
  }
  #enableAll() {
    if (!this.#isEnabled) {
      this.#isEnabled = true;
      for (const layer of this.#allLayers.values()) {
        layer.enable();
      }
    }
  }
  #disableAll() {
    this.unselectAll();
    if (this.#isEnabled) {
      this.#isEnabled = false;
      for (const layer of this.#allLayers.values()) {
        layer.disable();
      }
    }
  }
  getEditors(pageIndex) {
    const editors = [];
    for (const editor of this.#allEditors.values()) {
      if (editor.pageIndex === pageIndex) {
        editors.push(editor);
      }
    }
    return editors;
  }
  getEditor(id) {
    return this.#allEditors.get(id);
  }
  addEditor(editor) {
    this.#allEditors.set(editor.id, editor);
  }
  removeEditor(editor) {
    this.#allEditors.delete(editor.id);
    this.unselect(editor);
    if (!editor.annotationElementId || !this.#deletedAnnotationsElementIds.has(editor.annotationElementId)) {
      this.#annotationStorage?.remove(editor.id);
    }
  }
  addDeletedAnnotationElement(editor) {
    this.#deletedAnnotationsElementIds.add(editor.annotationElementId);
    editor.deleted = true;
  }
  isDeletedAnnotationElement(annotationElementId) {
    return this.#deletedAnnotationsElementIds.has(annotationElementId);
  }
  removeDeletedAnnotationElement(editor) {
    this.#deletedAnnotationsElementIds.delete(editor.annotationElementId);
    editor.deleted = false;
  }
  #addEditorToLayer(editor) {
    const layer = this.#allLayers.get(editor.pageIndex);
    if (layer) {
      layer.addOrRebuild(editor);
    } else {
      this.addEditor(editor);
    }
  }
  setActiveEditor(editor) {
    if (this.#activeEditor === editor) {
      return;
    }
    this.#activeEditor = editor;
    if (editor) {
      this.#dispatchUpdateUI(editor.propertiesToUpdate);
    }
  }
  toggleSelected(editor) {
    if (this.#selectedEditors.has(editor)) {
      this.#selectedEditors.delete(editor);
      editor.unselect();
      this.#dispatchUpdateStates({
        hasSelectedEditor: this.hasSelection
      });
      return;
    }
    this.#selectedEditors.add(editor);
    editor.select();
    this.#dispatchUpdateUI(editor.propertiesToUpdate);
    this.#dispatchUpdateStates({
      hasSelectedEditor: true
    });
  }
  setSelected(editor) {
    for (const ed of this.#selectedEditors) {
      if (ed !== editor) {
        ed.unselect();
      }
    }
    this.#selectedEditors.clear();
    this.#selectedEditors.add(editor);
    editor.select();
    this.#dispatchUpdateUI(editor.propertiesToUpdate);
    this.#dispatchUpdateStates({
      hasSelectedEditor: true
    });
  }
  isSelected(editor) {
    return this.#selectedEditors.has(editor);
  }
  unselect(editor) {
    editor.unselect();
    this.#selectedEditors.delete(editor);
    this.#dispatchUpdateStates({
      hasSelectedEditor: this.hasSelection
    });
  }
  get hasSelection() {
    return this.#selectedEditors.size !== 0;
  }
  undo() {
    this.#commandManager.undo();
    this.#dispatchUpdateStates({
      hasSomethingToUndo: this.#commandManager.hasSomethingToUndo(),
      hasSomethingToRedo: true,
      isEmpty: this.#isEmpty()
    });
  }
  redo() {
    this.#commandManager.redo();
    this.#dispatchUpdateStates({
      hasSomethingToUndo: true,
      hasSomethingToRedo: this.#commandManager.hasSomethingToRedo(),
      isEmpty: this.#isEmpty()
    });
  }
  addCommands(params) {
    this.#commandManager.add(params);
    this.#dispatchUpdateStates({
      hasSomethingToUndo: true,
      hasSomethingToRedo: false,
      isEmpty: this.#isEmpty()
    });
  }
  #isEmpty() {
    if (this.#allEditors.size === 0) {
      return true;
    }
    if (this.#allEditors.size === 1) {
      for (const editor of this.#allEditors.values()) {
        return editor.isEmpty();
      }
    }
    return false;
  }
  delete() {
    this.commitOrRemove();
    if (!this.hasSelection) {
      return;
    }
    const editors = [...this.#selectedEditors];
    const cmd = () => {
      for (const editor of editors) {
        editor.remove();
      }
    };
    const undo = () => {
      for (const editor of editors) {
        this.#addEditorToLayer(editor);
      }
    };
    this.addCommands({
      cmd,
      undo,
      mustExec: true
    });
  }
  commitOrRemove() {
    this.#activeEditor?.commitOrRemove();
  }
  hasSomethingToControl() {
    return this.#activeEditor || this.hasSelection;
  }
  #selectEditors(editors) {
    this.#selectedEditors.clear();
    for (const editor of editors) {
      if (editor.isEmpty()) {
        continue;
      }
      this.#selectedEditors.add(editor);
      editor.select();
    }
    this.#dispatchUpdateStates({
      hasSelectedEditor: true
    });
  }
  selectAll() {
    for (const editor of this.#selectedEditors) {
      editor.commit();
    }
    this.#selectEditors(this.#allEditors.values());
  }
  unselectAll() {
    if (this.#activeEditor) {
      this.#activeEditor.commitOrRemove();
      return;
    }
    if (!this.hasSelection) {
      return;
    }
    for (const editor of this.#selectedEditors) {
      editor.unselect();
    }
    this.#selectedEditors.clear();
    this.#dispatchUpdateStates({
      hasSelectedEditor: false
    });
  }
  translateSelectedEditors(x, y, noCommit = false) {
    if (!noCommit) {
      this.commitOrRemove();
    }
    if (!this.hasSelection) {
      return;
    }
    this.#translation[0] += x;
    this.#translation[1] += y;
    const [totalX, totalY] = this.#translation;
    const editors = [...this.#selectedEditors];
    const TIME_TO_WAIT = 1000;
    if (this.#translationTimeoutId) {
      clearTimeout(this.#translationTimeoutId);
    }
    this.#translationTimeoutId = setTimeout(() => {
      this.#translationTimeoutId = null;
      this.#translation[0] = this.#translation[1] = 0;
      this.addCommands({
        cmd: () => {
          for (const editor of editors) {
            if (this.#allEditors.has(editor.id)) {
              editor.translateInPage(totalX, totalY);
            }
          }
        },
        undo: () => {
          for (const editor of editors) {
            if (this.#allEditors.has(editor.id)) {
              editor.translateInPage(-totalX, -totalY);
            }
          }
        },
        mustExec: false
      });
    }, TIME_TO_WAIT);
    for (const editor of editors) {
      editor.translateInPage(x, y);
    }
  }
  setUpDragSession() {
    if (!this.hasSelection) {
      return;
    }
    this.disableUserSelect(true);
    this.#draggingEditors = new Map();
    for (const editor of this.#selectedEditors) {
      this.#draggingEditors.set(editor, {
        savedX: editor.x,
        savedY: editor.y,
        savedPageIndex: editor.pageIndex,
        newX: 0,
        newY: 0,
        newPageIndex: -1
      });
    }
  }
  endDragSession() {
    if (!this.#draggingEditors) {
      return false;
    }
    this.disableUserSelect(false);
    const map = this.#draggingEditors;
    this.#draggingEditors = null;
    let mustBeAddedInUndoStack = false;
    for (const [{
      x,
      y,
      pageIndex
    }, value] of map) {
      value.newX = x;
      value.newY = y;
      value.newPageIndex = pageIndex;
      mustBeAddedInUndoStack ||= x !== value.savedX || y !== value.savedY || pageIndex !== value.savedPageIndex;
    }
    if (!mustBeAddedInUndoStack) {
      return false;
    }
    const move = (editor, x, y, pageIndex) => {
      if (this.#allEditors.has(editor.id)) {
        const parent = this.#allLayers.get(pageIndex);
        if (parent) {
          editor._setParentAndPosition(parent, x, y);
        } else {
          editor.pageIndex = pageIndex;
          editor.x = x;
          editor.y = y;
        }
      }
    };
    this.addCommands({
      cmd: () => {
        for (const [editor, {
          newX,
          newY,
          newPageIndex
        }] of map) {
          move(editor, newX, newY, newPageIndex);
        }
      },
      undo: () => {
        for (const [editor, {
          savedX,
          savedY,
          savedPageIndex
        }] of map) {
          move(editor, savedX, savedY, savedPageIndex);
        }
      },
      mustExec: true
    });
    return true;
  }
  dragSelectedEditors(tx, ty) {
    if (!this.#draggingEditors) {
      return;
    }
    for (const editor of this.#draggingEditors.keys()) {
      editor.drag(tx, ty);
    }
  }
  rebuild(editor) {
    if (editor.parent === null) {
      const parent = this.getLayer(editor.pageIndex);
      if (parent) {
        parent.changeParent(editor);
        parent.addOrRebuild(editor);
      } else {
        this.addEditor(editor);
        this.addToAnnotationStorage(editor);
        editor.rebuild();
      }
    } else {
      editor.parent.addOrRebuild(editor);
    }
  }
  isActive(editor) {
    return this.#activeEditor === editor;
  }
  getActive() {
    return this.#activeEditor;
  }
  getMode() {
    return this.#mode;
  }
  get imageManager() {
    return (0, _util.shadow)(this, "imageManager", new ImageManager());
  }
}
exports.AnnotationEditorUIManager = AnnotationEditorUIManager;

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StatTimer = exports.RenderingCancelledException = exports.PixelsPerInch = exports.PageViewport = exports.PDFDateString = exports.DOMStandardFontDataFactory = exports.DOMSVGFactory = exports.DOMFilterFactory = exports.DOMCanvasFactory = exports.DOMCMapReaderFactory = void 0;
exports.deprecated = deprecated;
exports.getColorValues = getColorValues;
exports.getCurrentTransform = getCurrentTransform;
exports.getCurrentTransformInverse = getCurrentTransformInverse;
exports.getFilenameFromUrl = getFilenameFromUrl;
exports.getPdfFilenameFromUrl = getPdfFilenameFromUrl;
exports.getRGB = getRGB;
exports.getXfaPageViewport = getXfaPageViewport;
exports.isDataScheme = isDataScheme;
exports.isPdfFile = isPdfFile;
exports.isValidFetchUrl = isValidFetchUrl;
exports.loadScript = loadScript;
exports.noContextMenu = noContextMenu;
exports.setLayerDimensions = setLayerDimensions;
var _base_factory = __w_pdfjs_require__(7);
var _util = __w_pdfjs_require__(1);
const SVG_NS = "http://www.w3.org/2000/svg";
class PixelsPerInch {
  static CSS = 96.0;
  static PDF = 72.0;
  static PDF_TO_CSS_UNITS = this.CSS / this.PDF;
}
exports.PixelsPerInch = PixelsPerInch;
class DOMFilterFactory extends _base_factory.BaseFilterFactory {
  #_cache;
  #_defs;
  #docId;
  #document;
  #hcmFilter;
  #hcmKey;
  #hcmUrl;
  #hcmHighlightFilter;
  #hcmHighlightKey;
  #hcmHighlightUrl;
  #id = 0;
  constructor({
    docId,
    ownerDocument = globalThis.document
  } = {}) {
    super();
    this.#docId = docId;
    this.#document = ownerDocument;
  }
  get #cache() {
    return this.#_cache ||= new Map();
  }
  get #defs() {
    if (!this.#_defs) {
      const div = this.#document.createElement("div");
      const {
        style
      } = div;
      style.visibility = "hidden";
      style.contain = "strict";
      style.width = style.height = 0;
      style.position = "absolute";
      style.top = style.left = 0;
      style.zIndex = -1;
      const svg = this.#document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("width", 0);
      svg.setAttribute("height", 0);
      this.#_defs = this.#document.createElementNS(SVG_NS, "defs");
      div.append(svg);
      svg.append(this.#_defs);
      this.#document.body.append(div);
    }
    return this.#_defs;
  }
  addFilter(maps) {
    if (!maps) {
      return "none";
    }
    let value = this.#cache.get(maps);
    if (value) {
      return value;
    }
    let tableR, tableG, tableB, key;
    if (maps.length === 1) {
      const mapR = maps[0];
      const buffer = new Array(256);
      for (let i = 0; i < 256; i++) {
        buffer[i] = mapR[i] / 255;
      }
      key = tableR = tableG = tableB = buffer.join(",");
    } else {
      const [mapR, mapG, mapB] = maps;
      const bufferR = new Array(256);
      const bufferG = new Array(256);
      const bufferB = new Array(256);
      for (let i = 0; i < 256; i++) {
        bufferR[i] = mapR[i] / 255;
        bufferG[i] = mapG[i] / 255;
        bufferB[i] = mapB[i] / 255;
      }
      tableR = bufferR.join(",");
      tableG = bufferG.join(",");
      tableB = bufferB.join(",");
      key = `${tableR}${tableG}${tableB}`;
    }
    value = this.#cache.get(key);
    if (value) {
      this.#cache.set(maps, value);
      return value;
    }
    const id = `g_${this.#docId}_transfer_map_${this.#id++}`;
    const url = `url(#${id})`;
    this.#cache.set(maps, url);
    this.#cache.set(key, url);
    const filter = this.#createFilter(id);
    this.#addTransferMapConversion(tableR, tableG, tableB, filter);
    return url;
  }
  addHCMFilter(fgColor, bgColor) {
    const key = `${fgColor}-${bgColor}`;
    if (this.#hcmKey === key) {
      return this.#hcmUrl;
    }
    this.#hcmKey = key;
    this.#hcmUrl = "none";
    this.#hcmFilter?.remove();
    if (!fgColor || !bgColor) {
      return this.#hcmUrl;
    }
    const fgRGB = this.#getRGB(fgColor);
    fgColor = _util.Util.makeHexColor(...fgRGB);
    const bgRGB = this.#getRGB(bgColor);
    bgColor = _util.Util.makeHexColor(...bgRGB);
    this.#defs.style.color = "";
    if (fgColor === "#000000" && bgColor === "#ffffff" || fgColor === bgColor) {
      return this.#hcmUrl;
    }
    const map = new Array(256);
    for (let i = 0; i <= 255; i++) {
      const x = i / 255;
      map[i] = x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    }
    const table = map.join(",");
    const id = `g_${this.#docId}_hcm_filter`;
    const filter = this.#hcmHighlightFilter = this.#createFilter(id);
    this.#addTransferMapConversion(table, table, table, filter);
    this.#addGrayConversion(filter);
    const getSteps = (c, n) => {
      const start = fgRGB[c] / 255;
      const end = bgRGB[c] / 255;
      const arr = new Array(n + 1);
      for (let i = 0; i <= n; i++) {
        arr[i] = start + i / n * (end - start);
      }
      return arr.join(",");
    };
    this.#addTransferMapConversion(getSteps(0, 5), getSteps(1, 5), getSteps(2, 5), filter);
    this.#hcmUrl = `url(#${id})`;
    return this.#hcmUrl;
  }
  addHighlightHCMFilter(fgColor, bgColor, newFgColor, newBgColor) {
    const key = `${fgColor}-${bgColor}-${newFgColor}-${newBgColor}`;
    if (this.#hcmHighlightKey === key) {
      return this.#hcmHighlightUrl;
    }
    this.#hcmHighlightKey = key;
    this.#hcmHighlightUrl = "none";
    this.#hcmHighlightFilter?.remove();
    if (!fgColor || !bgColor) {
      return this.#hcmHighlightUrl;
    }
    const [fgRGB, bgRGB] = [fgColor, bgColor].map(this.#getRGB.bind(this));
    let fgGray = Math.round(0.2126 * fgRGB[0] + 0.7152 * fgRGB[1] + 0.0722 * fgRGB[2]);
    let bgGray = Math.round(0.2126 * bgRGB[0] + 0.7152 * bgRGB[1] + 0.0722 * bgRGB[2]);
    let [newFgRGB, newBgRGB] = [newFgColor, newBgColor].map(this.#getRGB.bind(this));
    if (bgGray < fgGray) {
      [fgGray, bgGray, newFgRGB, newBgRGB] = [bgGray, fgGray, newBgRGB, newFgRGB];
    }
    this.#defs.style.color = "";
    const getSteps = (fg, bg, n) => {
      const arr = new Array(256);
      const step = (bgGray - fgGray) / n;
      const newStart = fg / 255;
      const newStep = (bg - fg) / (255 * n);
      let prev = 0;
      for (let i = 0; i <= n; i++) {
        const k = Math.round(fgGray + i * step);
        const value = newStart + i * newStep;
        for (let j = prev; j <= k; j++) {
          arr[j] = value;
        }
        prev = k + 1;
      }
      for (let i = prev; i < 256; i++) {
        arr[i] = arr[prev - 1];
      }
      return arr.join(",");
    };
    const id = `g_${this.#docId}_hcm_highlight_filter`;
    const filter = this.#hcmHighlightFilter = this.#createFilter(id);
    this.#addGrayConversion(filter);
    this.#addTransferMapConversion(getSteps(newFgRGB[0], newBgRGB[0], 5), getSteps(newFgRGB[1], newBgRGB[1], 5), getSteps(newFgRGB[2], newBgRGB[2], 5), filter);
    this.#hcmHighlightUrl = `url(#${id})`;
    return this.#hcmHighlightUrl;
  }
  destroy(keepHCM = false) {
    if (keepHCM && (this.#hcmUrl || this.#hcmHighlightUrl)) {
      return;
    }
    if (this.#_defs) {
      this.#_defs.parentNode.parentNode.remove();
      this.#_defs = null;
    }
    if (this.#_cache) {
      this.#_cache.clear();
      this.#_cache = null;
    }
    this.#id = 0;
  }
  #addGrayConversion(filter) {
    const feColorMatrix = this.#document.createElementNS(SVG_NS, "feColorMatrix");
    feColorMatrix.setAttribute("type", "matrix");
    feColorMatrix.setAttribute("values", "0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0");
    filter.append(feColorMatrix);
  }
  #createFilter(id) {
    const filter = this.#document.createElementNS(SVG_NS, "filter");
    filter.setAttribute("color-interpolation-filters", "sRGB");
    filter.setAttribute("id", id);
    this.#defs.append(filter);
    return filter;
  }
  #appendFeFunc(feComponentTransfer, func, table) {
    const feFunc = this.#document.createElementNS(SVG_NS, func);
    feFunc.setAttribute("type", "discrete");
    feFunc.setAttribute("tableValues", table);
    feComponentTransfer.append(feFunc);
  }
  #addTransferMapConversion(rTable, gTable, bTable, filter) {
    const feComponentTransfer = this.#document.createElementNS(SVG_NS, "feComponentTransfer");
    filter.append(feComponentTransfer);
    this.#appendFeFunc(feComponentTransfer, "feFuncR", rTable);
    this.#appendFeFunc(feComponentTransfer, "feFuncG", gTable);
    this.#appendFeFunc(feComponentTransfer, "feFuncB", bTable);
  }
  #getRGB(color) {
    this.#defs.style.color = color;
    return getRGB(getComputedStyle(this.#defs).getPropertyValue("color"));
  }
}
exports.DOMFilterFactory = DOMFilterFactory;
class DOMCanvasFactory extends _base_factory.BaseCanvasFactory {
  constructor({
    ownerDocument = globalThis.document
  } = {}) {
    super();
    this._document = ownerDocument;
  }
  _createCanvas(width, height) {
    const canvas = this._document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
}
exports.DOMCanvasFactory = DOMCanvasFactory;
async function fetchData(url, asTypedArray = false) {
  if (isValidFetchUrl(url, document.baseURI)) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return asTypedArray ? new Uint8Array(await response.arrayBuffer()) : (0, _util.stringToBytes)(await response.text());
  }
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    if (asTypedArray) {
      request.responseType = "arraybuffer";
    }
    request.onreadystatechange = () => {
      if (request.readyState !== XMLHttpRequest.DONE) {
        return;
      }
      if (request.status === 200 || request.status === 0) {
        let data;
        if (asTypedArray && request.response) {
          data = new Uint8Array(request.response);
        } else if (!asTypedArray && request.responseText) {
          data = (0, _util.stringToBytes)(request.responseText);
        }
        if (data) {
          resolve(data);
          return;
        }
      }
      reject(new Error(request.statusText));
    };
    request.send(null);
  });
}
class DOMCMapReaderFactory extends _base_factory.BaseCMapReaderFactory {
  _fetchData(url, compressionType) {
    return fetchData(url, this.isCompressed).then(data => {
      return {
        cMapData: data,
        compressionType
      };
    });
  }
}
exports.DOMCMapReaderFactory = DOMCMapReaderFactory;
class DOMStandardFontDataFactory extends _base_factory.BaseStandardFontDataFactory {
  _fetchData(url) {
    return fetchData(url, true);
  }
}
exports.DOMStandardFontDataFactory = DOMStandardFontDataFactory;
class DOMSVGFactory extends _base_factory.BaseSVGFactory {
  _createSVG(type) {
    return document.createElementNS(SVG_NS, type);
  }
}
exports.DOMSVGFactory = DOMSVGFactory;
class PageViewport {
  constructor({
    viewBox,
    scale,
    rotation,
    offsetX = 0,
    offsetY = 0,
    dontFlip = false
  }) {
    this.viewBox = viewBox;
    this.scale = scale;
    this.rotation = rotation;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    const centerX = (viewBox[2] + viewBox[0]) / 2;
    const centerY = (viewBox[3] + viewBox[1]) / 2;
    let rotateA, rotateB, rotateC, rotateD;
    rotation %= 360;
    if (rotation < 0) {
      rotation += 360;
    }
    switch (rotation) {
      case 180:
        rotateA = -1;
        rotateB = 0;
        rotateC = 0;
        rotateD = 1;
        break;
      case 90:
        rotateA = 0;
        rotateB = 1;
        rotateC = 1;
        rotateD = 0;
        break;
      case 270:
        rotateA = 0;
        rotateB = -1;
        rotateC = -1;
        rotateD = 0;
        break;
      case 0:
        rotateA = 1;
        rotateB = 0;
        rotateC = 0;
        rotateD = -1;
        break;
      default:
        throw new Error("PageViewport: Invalid rotation, must be a multiple of 90 degrees.");
    }
    if (dontFlip) {
      rotateC = -rotateC;
      rotateD = -rotateD;
    }
    let offsetCanvasX, offsetCanvasY;
    let width, height;
    if (rotateA === 0) {
      offsetCanvasX = Math.abs(centerY - viewBox[1]) * scale + offsetX;
      offsetCanvasY = Math.abs(centerX - viewBox[0]) * scale + offsetY;
      width = (viewBox[3] - viewBox[1]) * scale;
      height = (viewBox[2] - viewBox[0]) * scale;
    } else {
      offsetCanvasX = Math.abs(centerX - viewBox[0]) * scale + offsetX;
      offsetCanvasY = Math.abs(centerY - viewBox[1]) * scale + offsetY;
      width = (viewBox[2] - viewBox[0]) * scale;
      height = (viewBox[3] - viewBox[1]) * scale;
    }
    this.transform = [rotateA * scale, rotateB * scale, rotateC * scale, rotateD * scale, offsetCanvasX - rotateA * scale * centerX - rotateC * scale * centerY, offsetCanvasY - rotateB * scale * centerX - rotateD * scale * centerY];
    this.width = width;
    this.height = height;
  }
  get rawDims() {
    const {
      viewBox
    } = this;
    return (0, _util.shadow)(this, "rawDims", {
      pageWidth: viewBox[2] - viewBox[0],
      pageHeight: viewBox[3] - viewBox[1],
      pageX: viewBox[0],
      pageY: viewBox[1]
    });
  }
  clone({
    scale = this.scale,
    rotation = this.rotation,
    offsetX = this.offsetX,
    offsetY = this.offsetY,
    dontFlip = false
  } = {}) {
    return new PageViewport({
      viewBox: this.viewBox.slice(),
      scale,
      rotation,
      offsetX,
      offsetY,
      dontFlip
    });
  }
  convertToViewportPoint(x, y) {
    return _util.Util.applyTransform([x, y], this.transform);
  }
  convertToViewportRectangle(rect) {
    const topLeft = _util.Util.applyTransform([rect[0], rect[1]], this.transform);
    const bottomRight = _util.Util.applyTransform([rect[2], rect[3]], this.transform);
    return [topLeft[0], topLeft[1], bottomRight[0], bottomRight[1]];
  }
  convertToPdfPoint(x, y) {
    return _util.Util.applyInverseTransform([x, y], this.transform);
  }
}
exports.PageViewport = PageViewport;
class RenderingCancelledException extends _util.BaseException {
  constructor(msg, extraDelay = 0) {
    super(msg, "RenderingCancelledException");
    this.extraDelay = extraDelay;
  }
}
exports.RenderingCancelledException = RenderingCancelledException;
function isDataScheme(url) {
  const ii = url.length;
  let i = 0;
  while (i < ii && url[i].trim() === "") {
    i++;
  }
  return url.substring(i, i + 5).toLowerCase() === "data:";
}
function isPdfFile(filename) {
  return typeof filename === "string" && /\.pdf$/i.test(filename);
}
function getFilenameFromUrl(url, onlyStripPath = false) {
  if (!onlyStripPath) {
    [url] = url.split(/[#?]/, 1);
  }
  return url.substring(url.lastIndexOf("/") + 1);
}
function getPdfFilenameFromUrl(url, defaultFilename = "document.pdf") {
  if (typeof url !== "string") {
    return defaultFilename;
  }
  if (isDataScheme(url)) {
    (0, _util.warn)('getPdfFilenameFromUrl: ignore "data:"-URL for performance reasons.');
    return defaultFilename;
  }
  const reURI = /^(?:(?:[^:]+:)?\/\/[^/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/;
  const reFilename = /[^/?#=]+\.pdf\b(?!.*\.pdf\b)/i;
  const splitURI = reURI.exec(url);
  let suggestedFilename = reFilename.exec(splitURI[1]) || reFilename.exec(splitURI[2]) || reFilename.exec(splitURI[3]);
  if (suggestedFilename) {
    suggestedFilename = suggestedFilename[0];
    if (suggestedFilename.includes("%")) {
      try {
        suggestedFilename = reFilename.exec(decodeURIComponent(suggestedFilename))[0];
      } catch {}
    }
  }
  return suggestedFilename || defaultFilename;
}
class StatTimer {
  started = Object.create(null);
  times = [];
  time(name) {
    if (name in this.started) {
      (0, _util.warn)(`Timer is already running for ${name}`);
    }
    this.started[name] = Date.now();
  }
  timeEnd(name) {
    if (!(name in this.started)) {
      (0, _util.warn)(`Timer has not been started for ${name}`);
    }
    this.times.push({
      name,
      start: this.started[name],
      end: Date.now()
    });
    delete this.started[name];
  }
  toString() {
    const outBuf = [];
    let longest = 0;
    for (const {
      name
    } of this.times) {
      longest = Math.max(name.length, longest);
    }
    for (const {
      name,
      start,
      end
    } of this.times) {
      outBuf.push(`${name.padEnd(longest)} ${end - start}ms\n`);
    }
    return outBuf.join("");
  }
}
exports.StatTimer = StatTimer;
function isValidFetchUrl(url, baseUrl) {
  try {
    const {
      protocol
    } = baseUrl ? new URL(url, baseUrl) : new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}
function noContextMenu(e) {
  e.preventDefault();
}
function loadScript(src, removeScriptElement = false) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = function (evt) {
      if (removeScriptElement) {
        script.remove();
      }
      resolve(evt);
    };
    script.onerror = function () {
      reject(new Error(`Cannot load script at: ${script.src}`));
    };
    (document.head || document.documentElement).append(script);
  });
}
function deprecated(details) {
  console.log("Deprecated API usage: " + details);
}
let pdfDateStringRegex;
class PDFDateString {
  static toDateObject(input) {
    if (!input || typeof input !== "string") {
      return null;
    }
    pdfDateStringRegex ||= new RegExp("^D:" + "(\\d{4})" + "(\\d{2})?" + "(\\d{2})?" + "(\\d{2})?" + "(\\d{2})?" + "(\\d{2})?" + "([Z|+|-])?" + "(\\d{2})?" + "'?" + "(\\d{2})?" + "'?");
    const matches = pdfDateStringRegex.exec(input);
    if (!matches) {
      return null;
    }
    const year = parseInt(matches[1], 10);
    let month = parseInt(matches[2], 10);
    month = month >= 1 && month <= 12 ? month - 1 : 0;
    let day = parseInt(matches[3], 10);
    day = day >= 1 && day <= 31 ? day : 1;
    let hour = parseInt(matches[4], 10);
    hour = hour >= 0 && hour <= 23 ? hour : 0;
    let minute = parseInt(matches[5], 10);
    minute = minute >= 0 && minute <= 59 ? minute : 0;
    let second = parseInt(matches[6], 10);
    second = second >= 0 && second <= 59 ? second : 0;
    const universalTimeRelation = matches[7] || "Z";
    let offsetHour = parseInt(matches[8], 10);
    offsetHour = offsetHour >= 0 && offsetHour <= 23 ? offsetHour : 0;
    let offsetMinute = parseInt(matches[9], 10) || 0;
    offsetMinute = offsetMinute >= 0 && offsetMinute <= 59 ? offsetMinute : 0;
    if (universalTimeRelation === "-") {
      hour += offsetHour;
      minute += offsetMinute;
    } else if (universalTimeRelation === "+") {
      hour -= offsetHour;
      minute -= offsetMinute;
    }
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }
}
exports.PDFDateString = PDFDateString;
function getXfaPageViewport(xfaPage, {
  scale = 1,
  rotation = 0
}) {
  const {
    width,
    height
  } = xfaPage.attributes.style;
  const viewBox = [0, 0, parseInt(width), parseInt(height)];
  return new PageViewport({
    viewBox,
    scale,
    rotation
  });
}
function getRGB(color) {
  if (color.startsWith("#")) {
    const colorRGB = parseInt(color.slice(1), 16);
    return [(colorRGB & 0xff0000) >> 16, (colorRGB & 0x00ff00) >> 8, colorRGB & 0x0000ff];
  }
  if (color.startsWith("rgb(")) {
    return color.slice(4, -1).split(",").map(x => parseInt(x));
  }
  if (color.startsWith("rgba(")) {
    return color.slice(5, -1).split(",").map(x => parseInt(x)).slice(0, 3);
  }
  (0, _util.warn)(`Not a valid color format: "${color}"`);
  return [0, 0, 0];
}
function getColorValues(colors) {
  const span = document.createElement("span");
  span.style.visibility = "hidden";
  document.body.append(span);
  for (const name of colors.keys()) {
    span.style.color = name;
    const computedColor = window.getComputedStyle(span).color;
    colors.set(name, getRGB(computedColor));
  }
  span.remove();
}
function getCurrentTransform(ctx) {
  const {
    a,
    b,
    c,
    d,
    e,
    f
  } = ctx.getTransform();
  return [a, b, c, d, e, f];
}
function getCurrentTransformInverse(ctx) {
  const {
    a,
    b,
    c,
    d,
    e,
    f
  } = ctx.getTransform().invertSelf();
  return [a, b, c, d, e, f];
}
function setLayerDimensions(div, viewport, mustFlip = false, mustRotate = true) {
  if (viewport instanceof PageViewport) {
    const {
      pageWidth,
      pageHeight
    } = viewport.rawDims;
    const {
      style
    } = div;
    const useRound = _util.FeatureTest.isCSSRoundSupported;
    const w = `var(--scale-factor) * ${pageWidth}px`,
      h = `var(--scale-factor) * ${pageHeight}px`;
    const widthStr = useRound ? `round(${w}, 1px)` : `calc(${w})`,
      heightStr = useRound ? `round(${h}, 1px)` : `calc(${h})`;
    if (!mustFlip || viewport.rotation % 180 === 0) {
      style.width = widthStr;
      style.height = heightStr;
    } else {
      style.width = heightStr;
      style.height = widthStr;
    }
  }
  if (mustRotate) {
    div.setAttribute("data-main-rotation", viewport.rotation);
  }
}

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseStandardFontDataFactory = exports.BaseSVGFactory = exports.BaseFilterFactory = exports.BaseCanvasFactory = exports.BaseCMapReaderFactory = void 0;
var _util = __w_pdfjs_require__(1);
class BaseFilterFactory {
  constructor() {
    if (this.constructor === BaseFilterFactory) {
      (0, _util.unreachable)("Cannot initialize BaseFilterFactory.");
    }
  }
  addFilter(maps) {
    return "none";
  }
  addHCMFilter(fgColor, bgColor) {
    return "none";
  }
  addHighlightHCMFilter(fgColor, bgColor, newFgColor, newBgColor) {
    return "none";
  }
  destroy(keepHCM = false) {}
}
exports.BaseFilterFactory = BaseFilterFactory;
class BaseCanvasFactory {
  constructor() {
    if (this.constructor === BaseCanvasFactory) {
      (0, _util.unreachable)("Cannot initialize BaseCanvasFactory.");
    }
  }
  create(width, height) {
    if (width <= 0 || height <= 0) {
      throw new Error("Invalid canvas size");
    }
    const canvas = this._createCanvas(width, height);
    return {
      canvas,
      context: canvas.getContext("2d")
    };
  }
  reset(canvasAndContext, width, height) {
    if (!canvasAndContext.canvas) {
      throw new Error("Canvas is not specified");
    }
    if (width <= 0 || height <= 0) {
      throw new Error("Invalid canvas size");
    }
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }
  destroy(canvasAndContext) {
    if (!canvasAndContext.canvas) {
      throw new Error("Canvas is not specified");
    }
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
  _createCanvas(width, height) {
    (0, _util.unreachable)("Abstract method `_createCanvas` called.");
  }
}
exports.BaseCanvasFactory = BaseCanvasFactory;
class BaseCMapReaderFactory {
  constructor({
    baseUrl = null,
    isCompressed = true
  }) {
    if (this.constructor === BaseCMapReaderFactory) {
      (0, _util.unreachable)("Cannot initialize BaseCMapReaderFactory.");
    }
    this.baseUrl = baseUrl;
    this.isCompressed = isCompressed;
  }
  async fetch({
    name
  }) {
    if (!this.baseUrl) {
      throw new Error('The CMap "baseUrl" parameter must be specified, ensure that ' + 'the "cMapUrl" and "cMapPacked" API parameters are provided.');
    }
    if (!name) {
      throw new Error("CMap name must be specified.");
    }
    const url = this.baseUrl + name + (this.isCompressed ? ".bcmap" : "");
    const compressionType = this.isCompressed ? _util.CMapCompressionType.BINARY : _util.CMapCompressionType.NONE;
    return this._fetchData(url, compressionType).catch(reason => {
      throw new Error(`Unable to load ${this.isCompressed ? "binary " : ""}CMap at: ${url}`);
    });
  }
  _fetchData(url, compressionType) {
    (0, _util.unreachable)("Abstract method `_fetchData` called.");
  }
}
exports.BaseCMapReaderFactory = BaseCMapReaderFactory;
class BaseStandardFontDataFactory {
  constructor({
    baseUrl = null
  }) {
    if (this.constructor === BaseStandardFontDataFactory) {
      (0, _util.unreachable)("Cannot initialize BaseStandardFontDataFactory.");
    }
    this.baseUrl = baseUrl;
  }
  async fetch({
    filename
  }) {
    if (!this.baseUrl) {
      throw new Error('The standard font "baseUrl" parameter must be specified, ensure that ' + 'the "standardFontDataUrl" API parameter is provided.');
    }
    if (!filename) {
      throw new Error("Font filename must be specified.");
    }
    const url = `${this.baseUrl}${filename}`;
    return this._fetchData(url).catch(reason => {
      throw new Error(`Unable to load font data at: ${url}`);
    });
  }
  _fetchData(url) {
    (0, _util.unreachable)("Abstract method `_fetchData` called.");
  }
}
exports.BaseStandardFontDataFactory = BaseStandardFontDataFactory;
class BaseSVGFactory {
  constructor() {
    if (this.constructor === BaseSVGFactory) {
      (0, _util.unreachable)("Cannot initialize BaseSVGFactory.");
    }
  }
  create(width, height, skipDimensions = false) {
    if (width <= 0 || height <= 0) {
      throw new Error("Invalid SVG dimensions");
    }
    const svg = this._createSVG("svg:svg");
    svg.setAttribute("version", "1.1");
    if (!skipDimensions) {
      svg.setAttribute("width", `${width}px`);
      svg.setAttribute("height", `${height}px`);
    }
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    return svg;
  }
  createElement(type) {
    if (typeof type !== "string") {
      throw new Error("Invalid SVG element type");
    }
    return this._createSVG(type);
  }
  _createSVG(type) {
    (0, _util.unreachable)("Abstract method `_createSVG` called.");
  }
}
exports.BaseSVGFactory = BaseSVGFactory;

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.MurmurHash3_64 = void 0;
var _util = __w_pdfjs_require__(1);
const SEED = 0xc3d2e1f0;
const MASK_HIGH = 0xffff0000;
const MASK_LOW = 0xffff;
class MurmurHash3_64 {
  constructor(seed) {
    this.h1 = seed ? seed & 0xffffffff : SEED;
    this.h2 = seed ? seed & 0xffffffff : SEED;
  }
  update(input) {
    let data, length;
    if (typeof input === "string") {
      data = new Uint8Array(input.length * 2);
      length = 0;
      for (let i = 0, ii = input.length; i < ii; i++) {
        const code = input.charCodeAt(i);
        if (code <= 0xff) {
          data[length++] = code;
        } else {
          data[length++] = code >>> 8;
          data[length++] = code & 0xff;
        }
      }
    } else if ((0, _util.isArrayBuffer)(input)) {
      data = input.slice();
      length = data.byteLength;
    } else {
      throw new Error("Wrong data format in MurmurHash3_64_update. " + "Input must be a string or array.");
    }
    const blockCounts = length >> 2;
    const tailLength = length - blockCounts * 4;
    const dataUint32 = new Uint32Array(data.buffer, 0, blockCounts);
    let k1 = 0,
      k2 = 0;
    let h1 = this.h1,
      h2 = this.h2;
    const C1 = 0xcc9e2d51,
      C2 = 0x1b873593;
    const C1_LOW = C1 & MASK_LOW,
      C2_LOW = C2 & MASK_LOW;
    for (let i = 0; i < blockCounts; i++) {
      if (i & 1) {
        k1 = dataUint32[i];
        k1 = k1 * C1 & MASK_HIGH | k1 * C1_LOW & MASK_LOW;
        k1 = k1 << 15 | k1 >>> 17;
        k1 = k1 * C2 & MASK_HIGH | k1 * C2_LOW & MASK_LOW;
        h1 ^= k1;
        h1 = h1 << 13 | h1 >>> 19;
        h1 = h1 * 5 + 0xe6546b64;
      } else {
        k2 = dataUint32[i];
        k2 = k2 * C1 & MASK_HIGH | k2 * C1_LOW & MASK_LOW;
        k2 = k2 << 15 | k2 >>> 17;
        k2 = k2 * C2 & MASK_HIGH | k2 * C2_LOW & MASK_LOW;
        h2 ^= k2;
        h2 = h2 << 13 | h2 >>> 19;
        h2 = h2 * 5 + 0xe6546b64;
      }
    }
    k1 = 0;
    switch (tailLength) {
      case 3:
        k1 ^= data[blockCounts * 4 + 2] << 16;
      case 2:
        k1 ^= data[blockCounts * 4 + 1] << 8;
      case 1:
        k1 ^= data[blockCounts * 4];
        k1 = k1 * C1 & MASK_HIGH | k1 * C1_LOW & MASK_LOW;
        k1 = k1 << 15 | k1 >>> 17;
        k1 = k1 * C2 & MASK_HIGH | k1 * C2_LOW & MASK_LOW;
        if (blockCounts & 1) {
          h1 ^= k1;
        } else {
          h2 ^= k1;
        }
    }
    this.h1 = h1;
    this.h2 = h2;
  }
  hexdigest() {
    let h1 = this.h1,
      h2 = this.h2;
    h1 ^= h2 >>> 1;
    h1 = h1 * 0xed558ccd & MASK_HIGH | h1 * 0x8ccd & MASK_LOW;
    h2 = h2 * 0xff51afd7 & MASK_HIGH | ((h2 << 16 | h1 >>> 16) * 0xafd7ed55 & MASK_HIGH) >>> 16;
    h1 ^= h2 >>> 1;
    h1 = h1 * 0x1a85ec53 & MASK_HIGH | h1 * 0xec53 & MASK_LOW;
    h2 = h2 * 0xc4ceb9fe & MASK_HIGH | ((h2 << 16 | h1 >>> 16) * 0xb9fe1a85 & MASK_HIGH) >>> 16;
    h1 ^= h2 >>> 1;
    return (h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0");
  }
}
exports.MurmurHash3_64 = MurmurHash3_64;

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.FontLoader = exports.FontFaceObject = void 0;
var _util = __w_pdfjs_require__(1);
class FontLoader {
  #systemFonts = new Set();
  constructor({
    ownerDocument = globalThis.document,
    styleElement = null
  }) {
    this._document = ownerDocument;
    this.nativeFontFaces = new Set();
    this.styleElement = null;
    this.loadingRequests = [];
    this.loadTestFontId = 0;
  }
  addNativeFontFace(nativeFontFace) {
    this.nativeFontFaces.add(nativeFontFace);
    this._document.fonts.add(nativeFontFace);
  }
  removeNativeFontFace(nativeFontFace) {
    this.nativeFontFaces.delete(nativeFontFace);
    this._document.fonts.delete(nativeFontFace);
  }
  insertRule(rule) {
    if (!this.styleElement) {
      this.styleElement = this._document.createElement("style");
      this._document.documentElement.getElementsByTagName("head")[0].append(this.styleElement);
    }
    const styleSheet = this.styleElement.sheet;
    styleSheet.insertRule(rule, styleSheet.cssRules.length);
  }
  clear() {
    for (const nativeFontFace of this.nativeFontFaces) {
      this._document.fonts.delete(nativeFontFace);
    }
    this.nativeFontFaces.clear();
    this.#systemFonts.clear();
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }
  async loadSystemFont(info) {
    if (!info || this.#systemFonts.has(info.loadedName)) {
      return;
    }
    (0, _util.assert)(!this.disableFontFace, "loadSystemFont shouldn't be called when `disableFontFace` is set.");
    if (this.isFontLoadingAPISupported) {
      const {
        loadedName,
        src,
        style
      } = info;
      const fontFace = new FontFace(loadedName, src, style);
      this.addNativeFontFace(fontFace);
      try {
        await fontFace.load();
        this.#systemFonts.add(loadedName);
      } catch {
        (0, _util.warn)(`Cannot load system font: ${info.baseFontName}, installing it could help to improve PDF rendering.`);
        this.removeNativeFontFace(fontFace);
      }
      return;
    }
    (0, _util.unreachable)("Not implemented: loadSystemFont without the Font Loading API.");
  }
  async bind(font) {
    if (font.attached || font.missingFile && !font.systemFontInfo) {
      return;
    }
    font.attached = true;
    if (font.systemFontInfo) {
      await this.loadSystemFont(font.systemFontInfo);
      return;
    }
    if (this.isFontLoadingAPISupported) {
      const nativeFontFace = font.createNativeFontFace();
      if (nativeFontFace) {
        this.addNativeFontFace(nativeFontFace);
        try {
          await nativeFontFace.loaded;
        } catch (ex) {
          (0, _util.warn)(`Failed to load font '${nativeFontFace.family}': '${ex}'.`);
          font.disableFontFace = true;
          throw ex;
        }
      }
      return;
    }
    const rule = font.createFontFaceRule();
    if (rule) {
      this.insertRule(rule);
      if (this.isSyncFontLoadingSupported) {
        return;
      }
      await new Promise(resolve => {
        const request = this._queueLoadingCallback(resolve);
        this._prepareFontLoadEvent(font, request);
      });
    }
  }
  get isFontLoadingAPISupported() {
    const hasFonts = !!this._document?.fonts;
    return (0, _util.shadow)(this, "isFontLoadingAPISupported", hasFonts);
  }
  get isSyncFontLoadingSupported() {
    let supported = false;
    if (_util.isNodeJS) {
      supported = true;
    } else if (typeof navigator !== "undefined" && /Mozilla\/5.0.*?rv:\d+.*? Gecko/.test(navigator.userAgent)) {
      supported = true;
    }
    return (0, _util.shadow)(this, "isSyncFontLoadingSupported", supported);
  }
  _queueLoadingCallback(callback) {
    function completeRequest() {
      (0, _util.assert)(!request.done, "completeRequest() cannot be called twice.");
      request.done = true;
      while (loadingRequests.length > 0 && loadingRequests[0].done) {
        const otherRequest = loadingRequests.shift();
        setTimeout(otherRequest.callback, 0);
      }
    }
    const {
      loadingRequests
    } = this;
    const request = {
      done: false,
      complete: completeRequest,
      callback
    };
    loadingRequests.push(request);
    return request;
  }
  get _loadTestFont() {
    const testFont = atob("T1RUTwALAIAAAwAwQ0ZGIDHtZg4AAAOYAAAAgUZGVE1lkzZwAAAEHAAAABxHREVGABQA" + "FQAABDgAAAAeT1MvMlYNYwkAAAEgAAAAYGNtYXABDQLUAAACNAAAAUJoZWFk/xVFDQAA" + "ALwAAAA2aGhlYQdkA+oAAAD0AAAAJGhtdHgD6AAAAAAEWAAAAAZtYXhwAAJQAAAAARgA" + "AAAGbmFtZVjmdH4AAAGAAAAAsXBvc3T/hgAzAAADeAAAACAAAQAAAAEAALZRFsRfDzz1" + "AAsD6AAAAADOBOTLAAAAAM4KHDwAAAAAA+gDIQAAAAgAAgAAAAAAAAABAAADIQAAAFoD" + "6AAAAAAD6AABAAAAAAAAAAAAAAAAAAAAAQAAUAAAAgAAAAQD6AH0AAUAAAKKArwAAACM" + "AooCvAAAAeAAMQECAAACAAYJAAAAAAAAAAAAAQAAAAAAAAAAAAAAAFBmRWQAwAAuAC4D" + "IP84AFoDIQAAAAAAAQAAAAAAAAAAACAAIAABAAAADgCuAAEAAAAAAAAAAQAAAAEAAAAA" + "AAEAAQAAAAEAAAAAAAIAAQAAAAEAAAAAAAMAAQAAAAEAAAAAAAQAAQAAAAEAAAAAAAUA" + "AQAAAAEAAAAAAAYAAQAAAAMAAQQJAAAAAgABAAMAAQQJAAEAAgABAAMAAQQJAAIAAgAB" + "AAMAAQQJAAMAAgABAAMAAQQJAAQAAgABAAMAAQQJAAUAAgABAAMAAQQJAAYAAgABWABY" + "AAAAAAAAAwAAAAMAAAAcAAEAAAAAADwAAwABAAAAHAAEACAAAAAEAAQAAQAAAC7//wAA" + "AC7////TAAEAAAAAAAABBgAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAD/gwAyAAAAAQAAAAAAAAAAAAAAAAAA" + "AAABAAQEAAEBAQJYAAEBASH4DwD4GwHEAvgcA/gXBIwMAYuL+nz5tQXkD5j3CBLnEQAC" + "AQEBIVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYAAABAQAADwACAQEEE/t3" + "Dov6fAH6fAT+fPp8+nwHDosMCvm1Cvm1DAz6fBQAAAAAAAABAAAAAMmJbzEAAAAAzgTj" + "FQAAAADOBOQpAAEAAAAAAAAADAAUAAQAAAABAAAAAgABAAAAAAAAAAAD6AAAAAAAAA==");
    return (0, _util.shadow)(this, "_loadTestFont", testFont);
  }
  _prepareFontLoadEvent(font, request) {
    function int32(data, offset) {
      return data.charCodeAt(offset) << 24 | data.charCodeAt(offset + 1) << 16 | data.charCodeAt(offset + 2) << 8 | data.charCodeAt(offset + 3) & 0xff;
    }
    function spliceString(s, offset, remove, insert) {
      const chunk1 = s.substring(0, offset);
      const chunk2 = s.substring(offset + remove);
      return chunk1 + insert + chunk2;
    }
    let i, ii;
    const canvas = this._document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    let called = 0;
    function isFontReady(name, callback) {
      if (++called > 30) {
        (0, _util.warn)("Load test font never loaded.");
        callback();
        return;
      }
      ctx.font = "30px " + name;
      ctx.fillText(".", 0, 20);
      const imageData = ctx.getImageData(0, 0, 1, 1);
      if (imageData.data[3] > 0) {
        callback();
        return;
      }
      setTimeout(isFontReady.bind(null, name, callback));
    }
    const loadTestFontId = `lt${Date.now()}${this.loadTestFontId++}`;
    let data = this._loadTestFont;
    const COMMENT_OFFSET = 976;
    data = spliceString(data, COMMENT_OFFSET, loadTestFontId.length, loadTestFontId);
    const CFF_CHECKSUM_OFFSET = 16;
    const XXXX_VALUE = 0x58585858;
    let checksum = int32(data, CFF_CHECKSUM_OFFSET);
    for (i = 0, ii = loadTestFontId.length - 3; i < ii; i += 4) {
      checksum = checksum - XXXX_VALUE + int32(loadTestFontId, i) | 0;
    }
    if (i < loadTestFontId.length) {
      checksum = checksum - XXXX_VALUE + int32(loadTestFontId + "XXX", i) | 0;
    }
    data = spliceString(data, CFF_CHECKSUM_OFFSET, 4, (0, _util.string32)(checksum));
    const url = `url(data:font/opentype;base64,${btoa(data)});`;
    const rule = `@font-face {font-family:"${loadTestFontId}";src:${url}}`;
    this.insertRule(rule);
    const div = this._document.createElement("div");
    div.style.visibility = "hidden";
    div.style.width = div.style.height = "10px";
    div.style.position = "absolute";
    div.style.top = div.style.left = "0px";
    for (const name of [font.loadedName, loadTestFontId]) {
      const span = this._document.createElement("span");
      span.textContent = "Hi";
      span.style.fontFamily = name;
      div.append(span);
    }
    this._document.body.append(div);
    isFontReady(loadTestFontId, () => {
      div.remove();
      request.complete();
    });
  }
}
exports.FontLoader = FontLoader;
class FontFaceObject {
  constructor(translatedData, {
    isEvalSupported = true,
    disableFontFace = false,
    ignoreErrors = false,
    inspectFont = null
  }) {
    this.compiledGlyphs = Object.create(null);
    for (const i in translatedData) {
      this[i] = translatedData[i];
    }
    this.isEvalSupported = isEvalSupported !== false;
    this.disableFontFace = disableFontFace === true;
    this.ignoreErrors = ignoreErrors === true;
    this._inspectFont = inspectFont;
  }
  createNativeFontFace() {
    if (!this.data || this.disableFontFace) {
      return null;
    }
    let nativeFontFace;
    if (!this.cssFontInfo) {
      nativeFontFace = new FontFace(this.loadedName, this.data, {});
    } else {
      const css = {
        weight: this.cssFontInfo.fontWeight
      };
      if (this.cssFontInfo.italicAngle) {
        css.style = `oblique ${this.cssFontInfo.italicAngle}deg`;
      }
      nativeFontFace = new FontFace(this.cssFontInfo.fontFamily, this.data, css);
    }
    this._inspectFont?.(this);
    return nativeFontFace;
  }
  createFontFaceRule() {
    if (!this.data || this.disableFontFace) {
      return null;
    }
    const data = (0, _util.bytesToString)(this.data);
    const url = `url(data:${this.mimetype};base64,${btoa(data)});`;
    let rule;
    if (!this.cssFontInfo) {
      rule = `@font-face {font-family:"${this.loadedName}";src:${url}}`;
    } else {
      let css = `font-weight: ${this.cssFontInfo.fontWeight};`;
      if (this.cssFontInfo.italicAngle) {
        css += `font-style: oblique ${this.cssFontInfo.italicAngle}deg;`;
      }
      rule = `@font-face {font-family:"${this.cssFontInfo.fontFamily}";${css}src:${url}}`;
    }
    this._inspectFont?.(this, url);
    return rule;
  }
  getPathGenerator(objs, character) {
    if (this.compiledGlyphs[character] !== undefined) {
      return this.compiledGlyphs[character];
    }
    let cmds;
    try {
      cmds = objs.get(this.loadedName + "_path_" + character);
    } catch (ex) {
      if (!this.ignoreErrors) {
        throw ex;
      }
      (0, _util.warn)(`getPathGenerator - ignoring character: "${ex}".`);
      return this.compiledGlyphs[character] = function (c, size) {};
    }
    if (this.isEvalSupported && _util.FeatureTest.isEvalSupported) {
      const jsBuf = [];
      for (const current of cmds) {
        const args = current.args !== undefined ? current.args.join(",") : "";
        jsBuf.push("c.", current.cmd, "(", args, ");\n");
      }
      return this.compiledGlyphs[character] = new Function("c", "size", jsBuf.join(""));
    }
    return this.compiledGlyphs[character] = function (c, size) {
      for (const current of cmds) {
        if (current.cmd === "scale") {
          current.args = [size, -size];
        }
        c[current.cmd].apply(c, current.args);
      }
    };
  }
}
exports.FontFaceObject = FontFaceObject;

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.NodeStandardFontDataFactory = exports.NodeFilterFactory = exports.NodeCanvasFactory = exports.NodeCMapReaderFactory = void 0;
var _base_factory = __w_pdfjs_require__(7);
var _util = __w_pdfjs_require__(1);
;
;
const fetchData = function (url) {
  return new Promise((resolve, reject) => {
    const fs = __webpack_require__(/*! fs */ "?fe90");
    fs.readFile(url, (error, data) => {
      if (error || !data) {
        reject(new Error(error));
        return;
      }
      resolve(new Uint8Array(data));
    });
  });
};
class NodeFilterFactory extends _base_factory.BaseFilterFactory {}
exports.NodeFilterFactory = NodeFilterFactory;
class NodeCanvasFactory extends _base_factory.BaseCanvasFactory {
  _createCanvas(width, height) {
    const Canvas = __webpack_require__(/*! canvas */ "?4a14");
    return Canvas.createCanvas(width, height);
  }
}
exports.NodeCanvasFactory = NodeCanvasFactory;
class NodeCMapReaderFactory extends _base_factory.BaseCMapReaderFactory {
  _fetchData(url, compressionType) {
    return fetchData(url).then(data => {
      return {
        cMapData: data,
        compressionType
      };
    });
  }
}
exports.NodeCMapReaderFactory = NodeCMapReaderFactory;
class NodeStandardFontDataFactory extends _base_factory.BaseStandardFontDataFactory {
  _fetchData(url) {
    return fetchData(url);
  }
}
exports.NodeStandardFontDataFactory = NodeStandardFontDataFactory;

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CanvasGraphics = void 0;
var _util = __w_pdfjs_require__(1);
var _display_utils = __w_pdfjs_require__(6);
var _pattern_helper = __w_pdfjs_require__(12);
var _image_utils = __w_pdfjs_require__(13);
const MIN_FONT_SIZE = 16;
const MAX_FONT_SIZE = 100;
const MAX_GROUP_SIZE = 4096;
const EXECUTION_TIME = 15;
const EXECUTION_STEPS = 10;
const MAX_SIZE_TO_COMPILE = 1000;
const FULL_CHUNK_HEIGHT = 16;
function mirrorContextOperations(ctx, destCtx) {
  if (ctx._removeMirroring) {
    throw new Error("Context is already forwarding operations.");
  }
  ctx.__originalSave = ctx.save;
  ctx.__originalRestore = ctx.restore;
  ctx.__originalRotate = ctx.rotate;
  ctx.__originalScale = ctx.scale;
  ctx.__originalTranslate = ctx.translate;
  ctx.__originalTransform = ctx.transform;
  ctx.__originalSetTransform = ctx.setTransform;
  ctx.__originalResetTransform = ctx.resetTransform;
  ctx.__originalClip = ctx.clip;
  ctx.__originalMoveTo = ctx.moveTo;
  ctx.__originalLineTo = ctx.lineTo;
  ctx.__originalBezierCurveTo = ctx.bezierCurveTo;
  ctx.__originalRect = ctx.rect;
  ctx.__originalClosePath = ctx.closePath;
  ctx.__originalBeginPath = ctx.beginPath;
  ctx._removeMirroring = () => {
    ctx.save = ctx.__originalSave;
    ctx.restore = ctx.__originalRestore;
    ctx.rotate = ctx.__originalRotate;
    ctx.scale = ctx.__originalScale;
    ctx.translate = ctx.__originalTranslate;
    ctx.transform = ctx.__originalTransform;
    ctx.setTransform = ctx.__originalSetTransform;
    ctx.resetTransform = ctx.__originalResetTransform;
    ctx.clip = ctx.__originalClip;
    ctx.moveTo = ctx.__originalMoveTo;
    ctx.lineTo = ctx.__originalLineTo;
    ctx.bezierCurveTo = ctx.__originalBezierCurveTo;
    ctx.rect = ctx.__originalRect;
    ctx.closePath = ctx.__originalClosePath;
    ctx.beginPath = ctx.__originalBeginPath;
    delete ctx._removeMirroring;
  };
  ctx.save = function ctxSave() {
    destCtx.save();
    this.__originalSave();
  };
  ctx.restore = function ctxRestore() {
    destCtx.restore();
    this.__originalRestore();
  };
  ctx.translate = function ctxTranslate(x, y) {
    destCtx.translate(x, y);
    this.__originalTranslate(x, y);
  };
  ctx.scale = function ctxScale(x, y) {
    destCtx.scale(x, y);
    this.__originalScale(x, y);
  };
  ctx.transform = function ctxTransform(a, b, c, d, e, f) {
    destCtx.transform(a, b, c, d, e, f);
    this.__originalTransform(a, b, c, d, e, f);
  };
  ctx.setTransform = function ctxSetTransform(a, b, c, d, e, f) {
    destCtx.setTransform(a, b, c, d, e, f);
    this.__originalSetTransform(a, b, c, d, e, f);
  };
  ctx.resetTransform = function ctxResetTransform() {
    destCtx.resetTransform();
    this.__originalResetTransform();
  };
  ctx.rotate = function ctxRotate(angle) {
    destCtx.rotate(angle);
    this.__originalRotate(angle);
  };
  ctx.clip = function ctxRotate(rule) {
    destCtx.clip(rule);
    this.__originalClip(rule);
  };
  ctx.moveTo = function (x, y) {
    destCtx.moveTo(x, y);
    this.__originalMoveTo(x, y);
  };
  ctx.lineTo = function (x, y) {
    destCtx.lineTo(x, y);
    this.__originalLineTo(x, y);
  };
  ctx.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
    destCtx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    this.__originalBezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  };
  ctx.rect = function (x, y, width, height) {
    destCtx.rect(x, y, width, height);
    this.__originalRect(x, y, width, height);
  };
  ctx.closePath = function () {
    destCtx.closePath();
    this.__originalClosePath();
  };
  ctx.beginPath = function () {
    destCtx.beginPath();
    this.__originalBeginPath();
  };
}
class CachedCanvases {
  constructor(canvasFactory) {
    this.canvasFactory = canvasFactory;
    this.cache = Object.create(null);
  }
  getCanvas(id, width, height) {
    let canvasEntry;
    if (this.cache[id] !== undefined) {
      canvasEntry = this.cache[id];
      this.canvasFactory.reset(canvasEntry, width, height);
    } else {
      canvasEntry = this.canvasFactory.create(width, height);
      this.cache[id] = canvasEntry;
    }
    return canvasEntry;
  }
  delete(id) {
    delete this.cache[id];
  }
  clear() {
    for (const id in this.cache) {
      const canvasEntry = this.cache[id];
      this.canvasFactory.destroy(canvasEntry);
      delete this.cache[id];
    }
  }
}
function drawImageAtIntegerCoords(ctx, srcImg, srcX, srcY, srcW, srcH, destX, destY, destW, destH) {
  const [a, b, c, d, tx, ty] = (0, _display_utils.getCurrentTransform)(ctx);
  if (b === 0 && c === 0) {
    const tlX = destX * a + tx;
    const rTlX = Math.round(tlX);
    const tlY = destY * d + ty;
    const rTlY = Math.round(tlY);
    const brX = (destX + destW) * a + tx;
    const rWidth = Math.abs(Math.round(brX) - rTlX) || 1;
    const brY = (destY + destH) * d + ty;
    const rHeight = Math.abs(Math.round(brY) - rTlY) || 1;
    ctx.setTransform(Math.sign(a), 0, 0, Math.sign(d), rTlX, rTlY);
    ctx.drawImage(srcImg, srcX, srcY, srcW, srcH, 0, 0, rWidth, rHeight);
    ctx.setTransform(a, b, c, d, tx, ty);
    return [rWidth, rHeight];
  }
  if (a === 0 && d === 0) {
    const tlX = destY * c + tx;
    const rTlX = Math.round(tlX);
    const tlY = destX * b + ty;
    const rTlY = Math.round(tlY);
    const brX = (destY + destH) * c + tx;
    const rWidth = Math.abs(Math.round(brX) - rTlX) || 1;
    const brY = (destX + destW) * b + ty;
    const rHeight = Math.abs(Math.round(brY) - rTlY) || 1;
    ctx.setTransform(0, Math.sign(b), Math.sign(c), 0, rTlX, rTlY);
    ctx.drawImage(srcImg, srcX, srcY, srcW, srcH, 0, 0, rHeight, rWidth);
    ctx.setTransform(a, b, c, d, tx, ty);
    return [rHeight, rWidth];
  }
  ctx.drawImage(srcImg, srcX, srcY, srcW, srcH, destX, destY, destW, destH);
  const scaleX = Math.hypot(a, b);
  const scaleY = Math.hypot(c, d);
  return [scaleX * destW, scaleY * destH];
}
function compileType3Glyph(imgData) {
  const {
    width,
    height
  } = imgData;
  if (width > MAX_SIZE_TO_COMPILE || height > MAX_SIZE_TO_COMPILE) {
    return null;
  }
  const POINT_TO_PROCESS_LIMIT = 1000;
  const POINT_TYPES = new Uint8Array([0, 2, 4, 0, 1, 0, 5, 4, 8, 10, 0, 8, 0, 2, 1, 0]);
  const width1 = width + 1;
  let points = new Uint8Array(width1 * (height + 1));
  let i, j, j0;
  const lineSize = width + 7 & ~7;
  let data = new Uint8Array(lineSize * height),
    pos = 0;
  for (const elem of imgData.data) {
    let mask = 128;
    while (mask > 0) {
      data[pos++] = elem & mask ? 0 : 255;
      mask >>= 1;
    }
  }
  let count = 0;
  pos = 0;
  if (data[pos] !== 0) {
    points[0] = 1;
    ++count;
  }
  for (j = 1; j < width; j++) {
    if (data[pos] !== data[pos + 1]) {
      points[j] = data[pos] ? 2 : 1;
      ++count;
    }
    pos++;
  }
  if (data[pos] !== 0) {
    points[j] = 2;
    ++count;
  }
  for (i = 1; i < height; i++) {
    pos = i * lineSize;
    j0 = i * width1;
    if (data[pos - lineSize] !== data[pos]) {
      points[j0] = data[pos] ? 1 : 8;
      ++count;
    }
    let sum = (data[pos] ? 4 : 0) + (data[pos - lineSize] ? 8 : 0);
    for (j = 1; j < width; j++) {
      sum = (sum >> 2) + (data[pos + 1] ? 4 : 0) + (data[pos - lineSize + 1] ? 8 : 0);
      if (POINT_TYPES[sum]) {
        points[j0 + j] = POINT_TYPES[sum];
        ++count;
      }
      pos++;
    }
    if (data[pos - lineSize] !== data[pos]) {
      points[j0 + j] = data[pos] ? 2 : 4;
      ++count;
    }
    if (count > POINT_TO_PROCESS_LIMIT) {
      return null;
    }
  }
  pos = lineSize * (height - 1);
  j0 = i * width1;
  if (data[pos] !== 0) {
    points[j0] = 8;
    ++count;
  }
  for (j = 1; j < width; j++) {
    if (data[pos] !== data[pos + 1]) {
      points[j0 + j] = data[pos] ? 4 : 8;
      ++count;
    }
    pos++;
  }
  if (data[pos] !== 0) {
    points[j0 + j] = 4;
    ++count;
  }
  if (count > POINT_TO_PROCESS_LIMIT) {
    return null;
  }
  const steps = new Int32Array([0, width1, -1, 0, -width1, 0, 0, 0, 1]);
  const path = new Path2D();
  for (i = 0; count && i <= height; i++) {
    let p = i * width1;
    const end = p + width;
    while (p < end && !points[p]) {
      p++;
    }
    if (p === end) {
      continue;
    }
    path.moveTo(p % width1, i);
    const p0 = p;
    let type = points[p];
    do {
      const step = steps[type];
      do {
        p += step;
      } while (!points[p]);
      const pp = points[p];
      if (pp !== 5 && pp !== 10) {
        type = pp;
        points[p] = 0;
      } else {
        type = pp & 0x33 * type >> 4;
        points[p] &= type >> 2 | type << 2;
      }
      path.lineTo(p % width1, p / width1 | 0);
      if (!points[p]) {
        --count;
      }
    } while (p0 !== p);
    --i;
  }
  data = null;
  points = null;
  const drawOutline = function (c) {
    c.save();
    c.scale(1 / width, -1 / height);
    c.translate(0, -height);
    c.fill(path);
    c.beginPath();
    c.restore();
  };
  return drawOutline;
}
class CanvasExtraState {
  constructor(width, height) {
    this.alphaIsShape = false;
    this.fontSize = 0;
    this.fontSizeScale = 1;
    this.textMatrix = _util.IDENTITY_MATRIX;
    this.textMatrixScale = 1;
    this.fontMatrix = _util.FONT_IDENTITY_MATRIX;
    this.leading = 0;
    this.x = 0;
    this.y = 0;
    this.lineX = 0;
    this.lineY = 0;
    this.charSpacing = 0;
    this.wordSpacing = 0;
    this.textHScale = 1;
    this.textRenderingMode = _util.TextRenderingMode.FILL;
    this.textRise = 0;
    this.fillColor = "#000000";
    this.strokeColor = "#000000";
    this.patternFill = false;
    this.fillAlpha = 1;
    this.strokeAlpha = 1;
    this.lineWidth = 1;
    this.activeSMask = null;
    this.transferMaps = "none";
    this.startNewPathAndClipBox([0, 0, width, height]);
  }
  clone() {
    const clone = Object.create(this);
    clone.clipBox = this.clipBox.slice();
    return clone;
  }
  setCurrentPoint(x, y) {
    this.x = x;
    this.y = y;
  }
  updatePathMinMax(transform, x, y) {
    [x, y] = _util.Util.applyTransform([x, y], transform);
    this.minX = Math.min(this.minX, x);
    this.minY = Math.min(this.minY, y);
    this.maxX = Math.max(this.maxX, x);
    this.maxY = Math.max(this.maxY, y);
  }
  updateRectMinMax(transform, rect) {
    const p1 = _util.Util.applyTransform(rect, transform);
    const p2 = _util.Util.applyTransform(rect.slice(2), transform);
    this.minX = Math.min(this.minX, p1[0], p2[0]);
    this.minY = Math.min(this.minY, p1[1], p2[1]);
    this.maxX = Math.max(this.maxX, p1[0], p2[0]);
    this.maxY = Math.max(this.maxY, p1[1], p2[1]);
  }
  updateScalingPathMinMax(transform, minMax) {
    _util.Util.scaleMinMax(transform, minMax);
    this.minX = Math.min(this.minX, minMax[0]);
    this.maxX = Math.max(this.maxX, minMax[1]);
    this.minY = Math.min(this.minY, minMax[2]);
    this.maxY = Math.max(this.maxY, minMax[3]);
  }
  updateCurvePathMinMax(transform, x0, y0, x1, y1, x2, y2, x3, y3, minMax) {
    const box = _util.Util.bezierBoundingBox(x0, y0, x1, y1, x2, y2, x3, y3);
    if (minMax) {
      minMax[0] = Math.min(minMax[0], box[0], box[2]);
      minMax[1] = Math.max(minMax[1], box[0], box[2]);
      minMax[2] = Math.min(minMax[2], box[1], box[3]);
      minMax[3] = Math.max(minMax[3], box[1], box[3]);
      return;
    }
    this.updateRectMinMax(transform, box);
  }
  getPathBoundingBox(pathType = _pattern_helper.PathType.FILL, transform = null) {
    const box = [this.minX, this.minY, this.maxX, this.maxY];
    if (pathType === _pattern_helper.PathType.STROKE) {
      if (!transform) {
        (0, _util.unreachable)("Stroke bounding box must include transform.");
      }
      const scale = _util.Util.singularValueDecompose2dScale(transform);
      const xStrokePad = scale[0] * this.lineWidth / 2;
      const yStrokePad = scale[1] * this.lineWidth / 2;
      box[0] -= xStrokePad;
      box[1] -= yStrokePad;
      box[2] += xStrokePad;
      box[3] += yStrokePad;
    }
    return box;
  }
  updateClipFromPath() {
    const intersect = _util.Util.intersect(this.clipBox, this.getPathBoundingBox());
    this.startNewPathAndClipBox(intersect || [0, 0, 0, 0]);
  }
  isEmptyClip() {
    return this.minX === Infinity;
  }
  startNewPathAndClipBox(box) {
    this.clipBox = box;
    this.minX = Infinity;
    this.minY = Infinity;
    this.maxX = 0;
    this.maxY = 0;
  }
  getClippedPathBoundingBox(pathType = _pattern_helper.PathType.FILL, transform = null) {
    return _util.Util.intersect(this.clipBox, this.getPathBoundingBox(pathType, transform));
  }
}
function putBinaryImageData(ctx, imgData) {
  if (typeof ImageData !== "undefined" && imgData instanceof ImageData) {
    ctx.putImageData(imgData, 0, 0);
    return;
  }
  const height = imgData.height,
    width = imgData.width;
  const partialChunkHeight = height % FULL_CHUNK_HEIGHT;
  const fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
  const totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
  const chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
  let srcPos = 0,
    destPos;
  const src = imgData.data;
  const dest = chunkImgData.data;
  let i, j, thisChunkHeight, elemsInThisChunk;
  if (imgData.kind === _util.ImageKind.GRAYSCALE_1BPP) {
    const srcLength = src.byteLength;
    const dest32 = new Uint32Array(dest.buffer, 0, dest.byteLength >> 2);
    const dest32DataLength = dest32.length;
    const fullSrcDiff = width + 7 >> 3;
    const white = 0xffffffff;
    const black = _util.FeatureTest.isLittleEndian ? 0xff000000 : 0x000000ff;
    for (i = 0; i < totalChunks; i++) {
      thisChunkHeight = i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
      destPos = 0;
      for (j = 0; j < thisChunkHeight; j++) {
        const srcDiff = srcLength - srcPos;
        let k = 0;
        const kEnd = srcDiff > fullSrcDiff ? width : srcDiff * 8 - 7;
        const kEndUnrolled = kEnd & ~7;
        let mask = 0;
        let srcByte = 0;
        for (; k < kEndUnrolled; k += 8) {
          srcByte = src[srcPos++];
          dest32[destPos++] = srcByte & 128 ? white : black;
          dest32[destPos++] = srcByte & 64 ? white : black;
          dest32[destPos++] = srcByte & 32 ? white : black;
          dest32[destPos++] = srcByte & 16 ? white : black;
          dest32[destPos++] = srcByte & 8 ? white : black;
          dest32[destPos++] = srcByte & 4 ? white : black;
          dest32[destPos++] = srcByte & 2 ? white : black;
          dest32[destPos++] = srcByte & 1 ? white : black;
        }
        for (; k < kEnd; k++) {
          if (mask === 0) {
            srcByte = src[srcPos++];
            mask = 128;
          }
          dest32[destPos++] = srcByte & mask ? white : black;
          mask >>= 1;
        }
      }
      while (destPos < dest32DataLength) {
        dest32[destPos++] = 0;
      }
      ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
    }
  } else if (imgData.kind === _util.ImageKind.RGBA_32BPP) {
    j = 0;
    elemsInThisChunk = width * FULL_CHUNK_HEIGHT * 4;
    for (i = 0; i < fullChunks; i++) {
      dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
      srcPos += elemsInThisChunk;
      ctx.putImageData(chunkImgData, 0, j);
      j += FULL_CHUNK_HEIGHT;
    }
    if (i < totalChunks) {
      elemsInThisChunk = width * partialChunkHeight * 4;
      dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
      ctx.putImageData(chunkImgData, 0, j);
    }
  } else if (imgData.kind === _util.ImageKind.RGB_24BPP) {
    thisChunkHeight = FULL_CHUNK_HEIGHT;
    elemsInThisChunk = width * thisChunkHeight;
    for (i = 0; i < totalChunks; i++) {
      if (i >= fullChunks) {
        thisChunkHeight = partialChunkHeight;
        elemsInThisChunk = width * thisChunkHeight;
      }
      destPos = 0;
      for (j = elemsInThisChunk; j--;) {
        dest[destPos++] = src[srcPos++];
        dest[destPos++] = src[srcPos++];
        dest[destPos++] = src[srcPos++];
        dest[destPos++] = 255;
      }
      ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
    }
  } else {
    throw new Error(`bad image kind: ${imgData.kind}`);
  }
}
function putBinaryImageMask(ctx, imgData) {
  if (imgData.bitmap) {
    ctx.drawImage(imgData.bitmap, 0, 0);
    return;
  }
  const height = imgData.height,
    width = imgData.width;
  const partialChunkHeight = height % FULL_CHUNK_HEIGHT;
  const fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
  const totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
  const chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
  let srcPos = 0;
  const src = imgData.data;
  const dest = chunkImgData.data;
  for (let i = 0; i < totalChunks; i++) {
    const thisChunkHeight = i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
    ({
      srcPos
    } = (0, _image_utils.convertBlackAndWhiteToRGBA)({
      src,
      srcPos,
      dest,
      width,
      height: thisChunkHeight,
      nonBlackColor: 0
    }));
    ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
  }
}
function copyCtxState(sourceCtx, destCtx) {
  const properties = ["strokeStyle", "fillStyle", "fillRule", "globalAlpha", "lineWidth", "lineCap", "lineJoin", "miterLimit", "globalCompositeOperation", "font", "filter"];
  for (const property of properties) {
    if (sourceCtx[property] !== undefined) {
      destCtx[property] = sourceCtx[property];
    }
  }
  if (sourceCtx.setLineDash !== undefined) {
    destCtx.setLineDash(sourceCtx.getLineDash());
    destCtx.lineDashOffset = sourceCtx.lineDashOffset;
  }
}
function resetCtxToDefault(ctx) {
  ctx.strokeStyle = ctx.fillStyle = "#000000";
  ctx.fillRule = "nonzero";
  ctx.globalAlpha = 1;
  ctx.lineWidth = 1;
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
  ctx.miterLimit = 10;
  ctx.globalCompositeOperation = "source-over";
  ctx.font = "10px sans-serif";
  if (ctx.setLineDash !== undefined) {
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
  }
  if (!_util.isNodeJS) {
    const {
      filter
    } = ctx;
    if (filter !== "none" && filter !== "") {
      ctx.filter = "none";
    }
  }
}
function composeSMaskBackdrop(bytes, r0, g0, b0) {
  const length = bytes.length;
  for (let i = 3; i < length; i += 4) {
    const alpha = bytes[i];
    if (alpha === 0) {
      bytes[i - 3] = r0;
      bytes[i - 2] = g0;
      bytes[i - 1] = b0;
    } else if (alpha < 255) {
      const alpha_ = 255 - alpha;
      bytes[i - 3] = bytes[i - 3] * alpha + r0 * alpha_ >> 8;
      bytes[i - 2] = bytes[i - 2] * alpha + g0 * alpha_ >> 8;
      bytes[i - 1] = bytes[i - 1] * alpha + b0 * alpha_ >> 8;
    }
  }
}
function composeSMaskAlpha(maskData, layerData, transferMap) {
  const length = maskData.length;
  const scale = 1 / 255;
  for (let i = 3; i < length; i += 4) {
    const alpha = transferMap ? transferMap[maskData[i]] : maskData[i];
    layerData[i] = layerData[i] * alpha * scale | 0;
  }
}
function composeSMaskLuminosity(maskData, layerData, transferMap) {
  const length = maskData.length;
  for (let i = 3; i < length; i += 4) {
    const y = maskData[i - 3] * 77 + maskData[i - 2] * 152 + maskData[i - 1] * 28;
    layerData[i] = transferMap ? layerData[i] * transferMap[y >> 8] >> 8 : layerData[i] * y >> 16;
  }
}
function genericComposeSMask(maskCtx, layerCtx, width, height, subtype, backdrop, transferMap, layerOffsetX, layerOffsetY, maskOffsetX, maskOffsetY) {
  const hasBackdrop = !!backdrop;
  const r0 = hasBackdrop ? backdrop[0] : 0;
  const g0 = hasBackdrop ? backdrop[1] : 0;
  const b0 = hasBackdrop ? backdrop[2] : 0;
  const composeFn = subtype === "Luminosity" ? composeSMaskLuminosity : composeSMaskAlpha;
  const PIXELS_TO_PROCESS = 1048576;
  const chunkSize = Math.min(height, Math.ceil(PIXELS_TO_PROCESS / width));
  for (let row = 0; row < height; row += chunkSize) {
    const chunkHeight = Math.min(chunkSize, height - row);
    const maskData = maskCtx.getImageData(layerOffsetX - maskOffsetX, row + (layerOffsetY - maskOffsetY), width, chunkHeight);
    const layerData = layerCtx.getImageData(layerOffsetX, row + layerOffsetY, width, chunkHeight);
    if (hasBackdrop) {
      composeSMaskBackdrop(maskData.data, r0, g0, b0);
    }
    composeFn(maskData.data, layerData.data, transferMap);
    layerCtx.putImageData(layerData, layerOffsetX, row + layerOffsetY);
  }
}
function composeSMask(ctx, smask, layerCtx, layerBox) {
  const layerOffsetX = layerBox[0];
  const layerOffsetY = layerBox[1];
  const layerWidth = layerBox[2] - layerOffsetX;
  const layerHeight = layerBox[3] - layerOffsetY;
  if (layerWidth === 0 || layerHeight === 0) {
    return;
  }
  genericComposeSMask(smask.context, layerCtx, layerWidth, layerHeight, smask.subtype, smask.backdrop, smask.transferMap, layerOffsetX, layerOffsetY, smask.offsetX, smask.offsetY);
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(layerCtx.canvas, 0, 0);
  ctx.restore();
}
function getImageSmoothingEnabled(transform, interpolate) {
  const scale = _util.Util.singularValueDecompose2dScale(transform);
  scale[0] = Math.fround(scale[0]);
  scale[1] = Math.fround(scale[1]);
  const actualScale = Math.fround((globalThis.devicePixelRatio || 1) * _display_utils.PixelsPerInch.PDF_TO_CSS_UNITS);
  if (interpolate !== undefined) {
    return interpolate;
  } else if (scale[0] <= actualScale || scale[1] <= actualScale) {
    return true;
  }
  return false;
}
const LINE_CAP_STYLES = ["butt", "round", "square"];
const LINE_JOIN_STYLES = ["miter", "round", "bevel"];
const NORMAL_CLIP = {};
const EO_CLIP = {};
class CanvasGraphics {
  constructor(canvasCtx, commonObjs, objs, canvasFactory, filterFactory, {
    optionalContentConfig,
    markedContentStack = null
  }, annotationCanvasMap, pageColors) {
    this.ctx = canvasCtx;
    this.current = new CanvasExtraState(this.ctx.canvas.width, this.ctx.canvas.height);
    this.stateStack = [];
    this.pendingClip = null;
    this.pendingEOFill = false;
    this.res = null;
    this.xobjs = null;
    this.commonObjs = commonObjs;
    this.objs = objs;
    this.canvasFactory = canvasFactory;
    this.filterFactory = filterFactory;
    this.groupStack = [];
    this.processingType3 = null;
    this.baseTransform = null;
    this.baseTransformStack = [];
    this.groupLevel = 0;
    this.smaskStack = [];
    this.smaskCounter = 0;
    this.tempSMask = null;
    this.suspendedCtx = null;
    this.contentVisible = true;
    this.markedContentStack = markedContentStack || [];
    this.optionalContentConfig = optionalContentConfig;
    this.cachedCanvases = new CachedCanvases(this.canvasFactory);
    this.cachedPatterns = new Map();
    this.annotationCanvasMap = annotationCanvasMap;
    this.viewportScale = 1;
    this.outputScaleX = 1;
    this.outputScaleY = 1;
    this.pageColors = pageColors;
    this._cachedScaleForStroking = [-1, 0];
    this._cachedGetSinglePixelWidth = null;
    this._cachedBitmapsMap = new Map();
  }
  getObject(data, fallback = null) {
    if (typeof data === "string") {
      return data.startsWith("g_") ? this.commonObjs.get(data) : this.objs.get(data);
    }
    return fallback;
  }
  beginDrawing({
    transform,
    viewport,
    transparency = false,
    background = null
  }) {
    const width = this.ctx.canvas.width;
    const height = this.ctx.canvas.height;
    const savedFillStyle = this.ctx.fillStyle;
    this.ctx.fillStyle = background || "#ffffff";
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.fillStyle = savedFillStyle;
    if (transparency) {
      const transparentCanvas = this.cachedCanvases.getCanvas("transparent", width, height);
      this.compositeCtx = this.ctx;
      this.transparentCanvas = transparentCanvas.canvas;
      this.ctx = transparentCanvas.context;
      this.ctx.save();
      this.ctx.transform(...(0, _display_utils.getCurrentTransform)(this.compositeCtx));
    }
    this.ctx.save();
    resetCtxToDefault(this.ctx);
    if (transform) {
      this.ctx.transform(...transform);
      this.outputScaleX = transform[0];
      this.outputScaleY = transform[0];
    }
    this.ctx.transform(...viewport.transform);
    this.viewportScale = viewport.scale;
    this.baseTransform = (0, _display_utils.getCurrentTransform)(this.ctx);
  }
  executeOperatorList(operatorList, executionStartIdx, continueCallback, stepper) {
    const argsArray = operatorList.argsArray;
    const fnArray = operatorList.fnArray;
    let i = executionStartIdx || 0;
    const argsArrayLen = argsArray.length;
    if (argsArrayLen === i) {
      return i;
    }
    const chunkOperations = argsArrayLen - i > EXECUTION_STEPS && typeof continueCallback === "function";
    const endTime = chunkOperations ? Date.now() + EXECUTION_TIME : 0;
    let steps = 0;
    const commonObjs = this.commonObjs;
    const objs = this.objs;
    let fnId;
    while (true) {
      if (stepper !== undefined && i === stepper.nextBreakPoint) {
        stepper.breakIt(i, continueCallback);
        return i;
      }
      fnId = fnArray[i];
      if (fnId !== _util.OPS.dependency) {
        this[fnId].apply(this, argsArray[i]);
      } else {
        for (const depObjId of argsArray[i]) {
          const objsPool = depObjId.startsWith("g_") ? commonObjs : objs;
          if (!objsPool.has(depObjId)) {
            objsPool.get(depObjId, continueCallback);
            return i;
          }
        }
      }
      i++;
      if (i === argsArrayLen) {
        return i;
      }
      if (chunkOperations && ++steps > EXECUTION_STEPS) {
        if (Date.now() > endTime) {
          continueCallback();
          return i;
        }
        steps = 0;
      }
    }
  }
  #restoreInitialState() {
    while (this.stateStack.length || this.inSMaskMode) {
      this.restore();
    }
    this.ctx.restore();
    if (this.transparentCanvas) {
      this.ctx = this.compositeCtx;
      this.ctx.save();
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.drawImage(this.transparentCanvas, 0, 0);
      this.ctx.restore();
      this.transparentCanvas = null;
    }
  }
  endDrawing() {
    this.#restoreInitialState();
    this.cachedCanvases.clear();
    this.cachedPatterns.clear();
    for (const cache of this._cachedBitmapsMap.values()) {
      for (const canvas of cache.values()) {
        if (typeof HTMLCanvasElement !== "undefined" && canvas instanceof HTMLCanvasElement) {
          canvas.width = canvas.height = 0;
        }
      }
      cache.clear();
    }
    this._cachedBitmapsMap.clear();
    this.#drawFilter();
  }
  #drawFilter() {
    if (this.pageColors) {
      const hcmFilterId = this.filterFactory.addHCMFilter(this.pageColors.foreground, this.pageColors.background);
      if (hcmFilterId !== "none") {
        const savedFilter = this.ctx.filter;
        this.ctx.filter = hcmFilterId;
        this.ctx.drawImage(this.ctx.canvas, 0, 0);
        this.ctx.filter = savedFilter;
      }
    }
  }
  _scaleImage(img, inverseTransform) {
    const width = img.width;
    const height = img.height;
    let widthScale = Math.max(Math.hypot(inverseTransform[0], inverseTransform[1]), 1);
    let heightScale = Math.max(Math.hypot(inverseTransform[2], inverseTransform[3]), 1);
    let paintWidth = width,
      paintHeight = height;
    let tmpCanvasId = "prescale1";
    let tmpCanvas, tmpCtx;
    while (widthScale > 2 && paintWidth > 1 || heightScale > 2 && paintHeight > 1) {
      let newWidth = paintWidth,
        newHeight = paintHeight;
      if (widthScale > 2 && paintWidth > 1) {
        newWidth = paintWidth >= 16384 ? Math.floor(paintWidth / 2) - 1 || 1 : Math.ceil(paintWidth / 2);
        widthScale /= paintWidth / newWidth;
      }
      if (heightScale > 2 && paintHeight > 1) {
        newHeight = paintHeight >= 16384 ? Math.floor(paintHeight / 2) - 1 || 1 : Math.ceil(paintHeight) / 2;
        heightScale /= paintHeight / newHeight;
      }
      tmpCanvas = this.cachedCanvases.getCanvas(tmpCanvasId, newWidth, newHeight);
      tmpCtx = tmpCanvas.context;
      tmpCtx.clearRect(0, 0, newWidth, newHeight);
      tmpCtx.drawImage(img, 0, 0, paintWidth, paintHeight, 0, 0, newWidth, newHeight);
      img = tmpCanvas.canvas;
      paintWidth = newWidth;
      paintHeight = newHeight;
      tmpCanvasId = tmpCanvasId === "prescale1" ? "prescale2" : "prescale1";
    }
    return {
      img,
      paintWidth,
      paintHeight
    };
  }
  _createMaskCanvas(img) {
    const ctx = this.ctx;
    const {
      width,
      height
    } = img;
    const fillColor = this.current.fillColor;
    const isPatternFill = this.current.patternFill;
    const currentTransform = (0, _display_utils.getCurrentTransform)(ctx);
    let cache, cacheKey, scaled, maskCanvas;
    if ((img.bitmap || img.data) && img.count > 1) {
      const mainKey = img.bitmap || img.data.buffer;
      cacheKey = JSON.stringify(isPatternFill ? currentTransform : [currentTransform.slice(0, 4), fillColor]);
      cache = this._cachedBitmapsMap.get(mainKey);
      if (!cache) {
        cache = new Map();
        this._cachedBitmapsMap.set(mainKey, cache);
      }
      const cachedImage = cache.get(cacheKey);
      if (cachedImage && !isPatternFill) {
        const offsetX = Math.round(Math.min(currentTransform[0], currentTransform[2]) + currentTransform[4]);
        const offsetY = Math.round(Math.min(currentTransform[1], currentTransform[3]) + currentTransform[5]);
        return {
          canvas: cachedImage,
          offsetX,
          offsetY
        };
      }
      scaled = cachedImage;
    }
    if (!scaled) {
      maskCanvas = this.cachedCanvases.getCanvas("maskCanvas", width, height);
      putBinaryImageMask(maskCanvas.context, img);
    }
    let maskToCanvas = _util.Util.transform(currentTransform, [1 / width, 0, 0, -1 / height, 0, 0]);
    maskToCanvas = _util.Util.transform(maskToCanvas, [1, 0, 0, 1, 0, -height]);
    const cord1 = _util.Util.applyTransform([0, 0], maskToCanvas);
    const cord2 = _util.Util.applyTransform([width, height], maskToCanvas);
    const rect = _util.Util.normalizeRect([cord1[0], cord1[1], cord2[0], cord2[1]]);
    const drawnWidth = Math.round(rect[2] - rect[0]) || 1;
    const drawnHeight = Math.round(rect[3] - rect[1]) || 1;
    const fillCanvas = this.cachedCanvases.getCanvas("fillCanvas", drawnWidth, drawnHeight);
    const fillCtx = fillCanvas.context;
    const offsetX = Math.min(cord1[0], cord2[0]);
    const offsetY = Math.min(cord1[1], cord2[1]);
    fillCtx.translate(-offsetX, -offsetY);
    fillCtx.transform(...maskToCanvas);
    if (!scaled) {
      scaled = this._scaleImage(maskCanvas.canvas, (0, _display_utils.getCurrentTransformInverse)(fillCtx));
      scaled = scaled.img;
      if (cache && isPatternFill) {
        cache.set(cacheKey, scaled);
      }
    }
    fillCtx.imageSmoothingEnabled = getImageSmoothingEnabled((0, _display_utils.getCurrentTransform)(fillCtx), img.interpolate);
    drawImageAtIntegerCoords(fillCtx, scaled, 0, 0, scaled.width, scaled.height, 0, 0, width, height);
    fillCtx.globalCompositeOperation = "source-in";
    const inverse = _util.Util.transform((0, _display_utils.getCurrentTransformInverse)(fillCtx), [1, 0, 0, 1, -offsetX, -offsetY]);
    fillCtx.fillStyle = isPatternFill ? fillColor.getPattern(ctx, this, inverse, _pattern_helper.PathType.FILL) : fillColor;
    fillCtx.fillRect(0, 0, width, height);
    if (cache && !isPatternFill) {
      this.cachedCanvases.delete("fillCanvas");
      cache.set(cacheKey, fillCanvas.canvas);
    }
    return {
      canvas: fillCanvas.canvas,
      offsetX: Math.round(offsetX),
      offsetY: Math.round(offsetY)
    };
  }
  setLineWidth(width) {
    if (width !== this.current.lineWidth) {
      this._cachedScaleForStroking[0] = -1;
    }
    this.current.lineWidth = width;
    this.ctx.lineWidth = width;
  }
  setLineCap(style) {
    this.ctx.lineCap = LINE_CAP_STYLES[style];
  }
  setLineJoin(style) {
    this.ctx.lineJoin = LINE_JOIN_STYLES[style];
  }
  setMiterLimit(limit) {
    this.ctx.miterLimit = limit;
  }
  setDash(dashArray, dashPhase) {
    const ctx = this.ctx;
    if (ctx.setLineDash !== undefined) {
      ctx.setLineDash(dashArray);
      ctx.lineDashOffset = dashPhase;
    }
  }
  setRenderingIntent(intent) {}
  setFlatness(flatness) {}
  setGState(states) {
    for (const [key, value] of states) {
      switch (key) {
        case "LW":
          this.setLineWidth(value);
          break;
        case "LC":
          this.setLineCap(value);
          break;
        case "LJ":
          this.setLineJoin(value);
          break;
        case "ML":
          this.setMiterLimit(value);
          break;
        case "D":
          this.setDash(value[0], value[1]);
          break;
        case "RI":
          this.setRenderingIntent(value);
          break;
        case "FL":
          this.setFlatness(value);
          break;
        case "Font":
          this.setFont(value[0], value[1]);
          break;
        case "CA":
          this.current.strokeAlpha = value;
          break;
        case "ca":
          this.current.fillAlpha = value;
          this.ctx.globalAlpha = value;
          break;
        case "BM":
          this.ctx.globalCompositeOperation = value;
          break;
        case "SMask":
          this.current.activeSMask = value ? this.tempSMask : null;
          this.tempSMask = null;
          this.checkSMaskState();
          break;
        case "TR":
          this.ctx.filter = this.current.transferMaps = this.filterFactory.addFilter(value);
          break;
      }
    }
  }
  get inSMaskMode() {
    return !!this.suspendedCtx;
  }
  checkSMaskState() {
    const inSMaskMode = this.inSMaskMode;
    if (this.current.activeSMask && !inSMaskMode) {
      this.beginSMaskMode();
    } else if (!this.current.activeSMask && inSMaskMode) {
      this.endSMaskMode();
    }
  }
  beginSMaskMode() {
    if (this.inSMaskMode) {
      throw new Error("beginSMaskMode called while already in smask mode");
    }
    const drawnWidth = this.ctx.canvas.width;
    const drawnHeight = this.ctx.canvas.height;
    const cacheId = "smaskGroupAt" + this.groupLevel;
    const scratchCanvas = this.cachedCanvases.getCanvas(cacheId, drawnWidth, drawnHeight);
    this.suspendedCtx = this.ctx;
    this.ctx = scratchCanvas.context;
    const ctx = this.ctx;
    ctx.setTransform(...(0, _display_utils.getCurrentTransform)(this.suspendedCtx));
    copyCtxState(this.suspendedCtx, ctx);
    mirrorContextOperations(ctx, this.suspendedCtx);
    this.setGState([["BM", "source-over"], ["ca", 1], ["CA", 1]]);
  }
  endSMaskMode() {
    if (!this.inSMaskMode) {
      throw new Error("endSMaskMode called while not in smask mode");
    }
    this.ctx._removeMirroring();
    copyCtxState(this.ctx, this.suspendedCtx);
    this.ctx = this.suspendedCtx;
    this.suspendedCtx = null;
  }
  compose(dirtyBox) {
    if (!this.current.activeSMask) {
      return;
    }
    if (!dirtyBox) {
      dirtyBox = [0, 0, this.ctx.canvas.width, this.ctx.canvas.height];
    } else {
      dirtyBox[0] = Math.floor(dirtyBox[0]);
      dirtyBox[1] = Math.floor(dirtyBox[1]);
      dirtyBox[2] = Math.ceil(dirtyBox[2]);
      dirtyBox[3] = Math.ceil(dirtyBox[3]);
    }
    const smask = this.current.activeSMask;
    const suspendedCtx = this.suspendedCtx;
    composeSMask(suspendedCtx, smask, this.ctx, dirtyBox);
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.restore();
  }
  save() {
    if (this.inSMaskMode) {
      copyCtxState(this.ctx, this.suspendedCtx);
      this.suspendedCtx.save();
    } else {
      this.ctx.save();
    }
    const old = this.current;
    this.stateStack.push(old);
    this.current = old.clone();
  }
  restore() {
    if (this.stateStack.length === 0 && this.inSMaskMode) {
      this.endSMaskMode();
    }
    if (this.stateStack.length !== 0) {
      this.current = this.stateStack.pop();
      if (this.inSMaskMode) {
        this.suspendedCtx.restore();
        copyCtxState(this.suspendedCtx, this.ctx);
      } else {
        this.ctx.restore();
      }
      this.checkSMaskState();
      this.pendingClip = null;
      this._cachedScaleForStroking[0] = -1;
      this._cachedGetSinglePixelWidth = null;
    }
  }
  transform(a, b, c, d, e, f) {
    this.ctx.transform(a, b, c, d, e, f);
    this._cachedScaleForStroking[0] = -1;
    this._cachedGetSinglePixelWidth = null;
  }
  constructPath(ops, args, minMax) {
    const ctx = this.ctx;
    const current = this.current;
    let x = current.x,
      y = current.y;
    let startX, startY;
    const currentTransform = (0, _display_utils.getCurrentTransform)(ctx);
    const isScalingMatrix = currentTransform[0] === 0 && currentTransform[3] === 0 || currentTransform[1] === 0 && currentTransform[2] === 0;
    const minMaxForBezier = isScalingMatrix ? minMax.slice(0) : null;
    for (let i = 0, j = 0, ii = ops.length; i < ii; i++) {
      switch (ops[i] | 0) {
        case _util.OPS.rectangle:
          x = args[j++];
          y = args[j++];
          const width = args[j++];
          const height = args[j++];
          const xw = x + width;
          const yh = y + height;
          ctx.moveTo(x, y);
          if (width === 0 || height === 0) {
            ctx.lineTo(xw, yh);
          } else {
            ctx.lineTo(xw, y);
            ctx.lineTo(xw, yh);
            ctx.lineTo(x, yh);
          }
          if (!isScalingMatrix) {
            current.updateRectMinMax(currentTransform, [x, y, xw, yh]);
          }
          ctx.closePath();
          break;
        case _util.OPS.moveTo:
          x = args[j++];
          y = args[j++];
          ctx.moveTo(x, y);
          if (!isScalingMatrix) {
            current.updatePathMinMax(currentTransform, x, y);
          }
          break;
        case _util.OPS.lineTo:
          x = args[j++];
          y = args[j++];
          ctx.lineTo(x, y);
          if (!isScalingMatrix) {
            current.updatePathMinMax(currentTransform, x, y);
          }
          break;
        case _util.OPS.curveTo:
          startX = x;
          startY = y;
          x = args[j + 4];
          y = args[j + 5];
          ctx.bezierCurveTo(args[j], args[j + 1], args[j + 2], args[j + 3], x, y);
          current.updateCurvePathMinMax(currentTransform, startX, startY, args[j], args[j + 1], args[j + 2], args[j + 3], x, y, minMaxForBezier);
          j += 6;
          break;
        case _util.OPS.curveTo2:
          startX = x;
          startY = y;
          ctx.bezierCurveTo(x, y, args[j], args[j + 1], args[j + 2], args[j + 3]);
          current.updateCurvePathMinMax(currentTransform, startX, startY, x, y, args[j], args[j + 1], args[j + 2], args[j + 3], minMaxForBezier);
          x = args[j + 2];
          y = args[j + 3];
          j += 4;
          break;
        case _util.OPS.curveTo3:
          startX = x;
          startY = y;
          x = args[j + 2];
          y = args[j + 3];
          ctx.bezierCurveTo(args[j], args[j + 1], x, y, x, y);
          current.updateCurvePathMinMax(currentTransform, startX, startY, args[j], args[j + 1], x, y, x, y, minMaxForBezier);
          j += 4;
          break;
        case _util.OPS.closePath:
          ctx.closePath();
          break;
      }
    }
    if (isScalingMatrix) {
      current.updateScalingPathMinMax(currentTransform, minMaxForBezier);
    }
    current.setCurrentPoint(x, y);
  }
  closePath() {
    this.ctx.closePath();
  }
  stroke(consumePath = true) {
    const ctx = this.ctx;
    const strokeColor = this.current.strokeColor;
    ctx.globalAlpha = this.current.strokeAlpha;
    if (this.contentVisible) {
      if (typeof strokeColor === "object" && strokeColor?.getPattern) {
        ctx.save();
        ctx.strokeStyle = strokeColor.getPattern(ctx, this, (0, _display_utils.getCurrentTransformInverse)(ctx), _pattern_helper.PathType.STROKE);
        this.rescaleAndStroke(false);
        ctx.restore();
      } else {
        this.rescaleAndStroke(true);
      }
    }
    if (consumePath) {
      this.consumePath(this.current.getClippedPathBoundingBox());
    }
    ctx.globalAlpha = this.current.fillAlpha;
  }
  closeStroke() {
    this.closePath();
    this.stroke();
  }
  fill(consumePath = true) {
    const ctx = this.ctx;
    const fillColor = this.current.fillColor;
    const isPatternFill = this.current.patternFill;
    let needRestore = false;
    if (isPatternFill) {
      ctx.save();
      ctx.fillStyle = fillColor.getPattern(ctx, this, (0, _display_utils.getCurrentTransformInverse)(ctx), _pattern_helper.PathType.FILL);
      needRestore = true;
    }
    const intersect = this.current.getClippedPathBoundingBox();
    if (this.contentVisible && intersect !== null) {
      if (this.pendingEOFill) {
        ctx.fill("evenodd");
        this.pendingEOFill = false;
      } else {
        ctx.fill();
      }
    }
    if (needRestore) {
      ctx.restore();
    }
    if (consumePath) {
      this.consumePath(intersect);
    }
  }
  eoFill() {
    this.pendingEOFill = true;
    this.fill();
  }
  fillStroke() {
    this.fill(false);
    this.stroke(false);
    this.consumePath();
  }
  eoFillStroke() {
    this.pendingEOFill = true;
    this.fillStroke();
  }
  closeFillStroke() {
    this.closePath();
    this.fillStroke();
  }
  closeEOFillStroke() {
    this.pendingEOFill = true;
    this.closePath();
    this.fillStroke();
  }
  endPath() {
    this.consumePath();
  }
  clip() {
    this.pendingClip = NORMAL_CLIP;
  }
  eoClip() {
    this.pendingClip = EO_CLIP;
  }
  beginText() {
    this.current.textMatrix = _util.IDENTITY_MATRIX;
    this.current.textMatrixScale = 1;
    this.current.x = this.current.lineX = 0;
    this.current.y = this.current.lineY = 0;
  }
  endText() {
    const paths = this.pendingTextPaths;
    const ctx = this.ctx;
    if (paths === undefined) {
      ctx.beginPath();
      return;
    }
    ctx.save();
    ctx.beginPath();
    for (const path of paths) {
      ctx.setTransform(...path.transform);
      ctx.translate(path.x, path.y);
      path.addToPath(ctx, path.fontSize);
    }
    ctx.restore();
    ctx.clip();
    ctx.beginPath();
    delete this.pendingTextPaths;
  }
  setCharSpacing(spacing) {
    this.current.charSpacing = spacing;
  }
  setWordSpacing(spacing) {
    this.current.wordSpacing = spacing;
  }
  setHScale(scale) {
    this.current.textHScale = scale / 100;
  }
  setLeading(leading) {
    this.current.leading = -leading;
  }
  setFont(fontRefName, size) {
    const fontObj = this.commonObjs.get(fontRefName);
    const current = this.current;
    if (!fontObj) {
      throw new Error(`Can't find font for ${fontRefName}`);
    }
    current.fontMatrix = fontObj.fontMatrix || _util.FONT_IDENTITY_MATRIX;
    if (current.fontMatrix[0] === 0 || current.fontMatrix[3] === 0) {
      (0, _util.warn)("Invalid font matrix for font " + fontRefName);
    }
    if (size < 0) {
      size = -size;
      current.fontDirection = -1;
    } else {
      current.fontDirection = 1;
    }
    this.current.font = fontObj;
    this.current.fontSize = size;
    if (fontObj.isType3Font) {
      return;
    }
    const name = fontObj.loadedName || "sans-serif";
    const typeface = fontObj.systemFontInfo?.css || `"${name}", ${fontObj.fallbackName}`;
    let bold = "normal";
    if (fontObj.black) {
      bold = "900";
    } else if (fontObj.bold) {
      bold = "bold";
    }
    const italic = fontObj.italic ? "italic" : "normal";
    let browserFontSize = size;
    if (size < MIN_FONT_SIZE) {
      browserFontSize = MIN_FONT_SIZE;
    } else if (size > MAX_FONT_SIZE) {
      browserFontSize = MAX_FONT_SIZE;
    }
    this.current.fontSizeScale = size / browserFontSize;
    this.ctx.font = `${italic} ${bold} ${browserFontSize}px ${typeface}`;
  }
  setTextRenderingMode(mode) {
    this.current.textRenderingMode = mode;
  }
  setTextRise(rise) {
    this.current.textRise = rise;
  }
  moveText(x, y) {
    this.current.x = this.current.lineX += x;
    this.current.y = this.current.lineY += y;
  }
  setLeadingMoveText(x, y) {
    this.setLeading(-y);
    this.moveText(x, y);
  }
  setTextMatrix(a, b, c, d, e, f) {
    this.current.textMatrix = [a, b, c, d, e, f];
    this.current.textMatrixScale = Math.hypot(a, b);
    this.current.x = this.current.lineX = 0;
    this.current.y = this.current.lineY = 0;
  }
  nextLine() {
    this.moveText(0, this.current.leading);
  }
  paintChar(character, x, y, patternTransform) {
    const ctx = this.ctx;
    const current = this.current;
    const font = current.font;
    const textRenderingMode = current.textRenderingMode;
    const fontSize = current.fontSize / current.fontSizeScale;
    const fillStrokeMode = textRenderingMode & _util.TextRenderingMode.FILL_STROKE_MASK;
    const isAddToPathSet = !!(textRenderingMode & _util.TextRenderingMode.ADD_TO_PATH_FLAG);
    const patternFill = current.patternFill && !font.missingFile;
    let addToPath;
    if (font.disableFontFace || isAddToPathSet || patternFill) {
      addToPath = font.getPathGenerator(this.commonObjs, character);
    }
    if (font.disableFontFace || patternFill) {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      addToPath(ctx, fontSize);
      if (patternTransform) {
        ctx.setTransform(...patternTransform);
      }
      if (fillStrokeMode === _util.TextRenderingMode.FILL || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
        ctx.fill();
      }
      if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
        ctx.stroke();
      }
      ctx.restore();
    } else {
      if (fillStrokeMode === _util.TextRenderingMode.FILL || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
        ctx.fillText(character, x, y);
      }
      if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
        ctx.strokeText(character, x, y);
      }
    }
    if (isAddToPathSet) {
      const paths = this.pendingTextPaths ||= [];
      paths.push({
        transform: (0, _display_utils.getCurrentTransform)(ctx),
        x,
        y,
        fontSize,
        addToPath
      });
    }
  }
  get isFontSubpixelAAEnabled() {
    const {
      context: ctx
    } = this.cachedCanvases.getCanvas("isFontSubpixelAAEnabled", 10, 10);
    ctx.scale(1.5, 1);
    ctx.fillText("I", 0, 10);
    const data = ctx.getImageData(0, 0, 10, 10).data;
    let enabled = false;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0 && data[i] < 255) {
        enabled = true;
        break;
      }
    }
    return (0, _util.shadow)(this, "isFontSubpixelAAEnabled", enabled);
  }
  showText(glyphs) {
    const current = this.current;
    const font = current.font;
    if (font.isType3Font) {
      return this.showType3Text(glyphs);
    }
    const fontSize = current.fontSize;
    if (fontSize === 0) {
      return undefined;
    }
    const ctx = this.ctx;
    const fontSizeScale = current.fontSizeScale;
    const charSpacing = current.charSpacing;
    const wordSpacing = current.wordSpacing;
    const fontDirection = current.fontDirection;
    const textHScale = current.textHScale * fontDirection;
    const glyphsLength = glyphs.length;
    const vertical = font.vertical;
    const spacingDir = vertical ? 1 : -1;
    const defaultVMetrics = font.defaultVMetrics;
    const widthAdvanceScale = fontSize * current.fontMatrix[0];
    const simpleFillText = current.textRenderingMode === _util.TextRenderingMode.FILL && !font.disableFontFace && !current.patternFill;
    ctx.save();
    ctx.transform(...current.textMatrix);
    ctx.translate(current.x, current.y + current.textRise);
    if (fontDirection > 0) {
      ctx.scale(textHScale, -1);
    } else {
      ctx.scale(textHScale, 1);
    }
    let patternTransform;
    if (current.patternFill) {
      ctx.save();
      const pattern = current.fillColor.getPattern(ctx, this, (0, _display_utils.getCurrentTransformInverse)(ctx), _pattern_helper.PathType.FILL);
      patternTransform = (0, _display_utils.getCurrentTransform)(ctx);
      ctx.restore();
      ctx.fillStyle = pattern;
    }
    let lineWidth = current.lineWidth;
    const scale = current.textMatrixScale;
    if (scale === 0 || lineWidth === 0) {
      const fillStrokeMode = current.textRenderingMode & _util.TextRenderingMode.FILL_STROKE_MASK;
      if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
        lineWidth = this.getSinglePixelWidth();
      }
    } else {
      lineWidth /= scale;
    }
    if (fontSizeScale !== 1.0) {
      ctx.scale(fontSizeScale, fontSizeScale);
      lineWidth /= fontSizeScale;
    }
    ctx.lineWidth = lineWidth;
    if (font.isInvalidPDFjsFont) {
      const chars = [];
      let width = 0;
      for (const glyph of glyphs) {
        chars.push(glyph.unicode);
        width += glyph.width;
      }
      ctx.fillText(chars.join(""), 0, 0);
      current.x += width * widthAdvanceScale * textHScale;
      ctx.restore();
      this.compose();
      return undefined;
    }
    let x = 0,
      i;
    for (i = 0; i < glyphsLength; ++i) {
      const glyph = glyphs[i];
      if (typeof glyph === "number") {
        x += spacingDir * glyph * fontSize / 1000;
        continue;
      }
      let restoreNeeded = false;
      const spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
      const character = glyph.fontChar;
      const accent = glyph.accent;
      let scaledX, scaledY;
      let width = glyph.width;
      if (vertical) {
        const vmetric = glyph.vmetric || defaultVMetrics;
        const vx = -(glyph.vmetric ? vmetric[1] : width * 0.5) * widthAdvanceScale;
        const vy = vmetric[2] * widthAdvanceScale;
        width = vmetric ? -vmetric[0] : width;
        scaledX = vx / fontSizeScale;
        scaledY = (x + vy) / fontSizeScale;
      } else {
        scaledX = x / fontSizeScale;
        scaledY = 0;
      }
      if (font.remeasure && width > 0) {
        const measuredWidth = ctx.measureText(character).width * 1000 / fontSize * fontSizeScale;
        if (width < measuredWidth && this.isFontSubpixelAAEnabled) {
          const characterScaleX = width / measuredWidth;
          restoreNeeded = true;
          ctx.save();
          ctx.scale(characterScaleX, 1);
          scaledX /= characterScaleX;
        } else if (width !== measuredWidth) {
          scaledX += (width - measuredWidth) / 2000 * fontSize / fontSizeScale;
        }
      }
      if (this.contentVisible && (glyph.isInFont || font.missingFile)) {
        if (simpleFillText && !accent) {
          ctx.fillText(character, scaledX, scaledY);
        } else {
          this.paintChar(character, scaledX, scaledY, patternTransform);
          if (accent) {
            const scaledAccentX = scaledX + fontSize * accent.offset.x / fontSizeScale;
            const scaledAccentY = scaledY - fontSize * accent.offset.y / fontSizeScale;
            this.paintChar(accent.fontChar, scaledAccentX, scaledAccentY, patternTransform);
          }
        }
      }
      const charWidth = vertical ? width * widthAdvanceScale - spacing * fontDirection : width * widthAdvanceScale + spacing * fontDirection;
      x += charWidth;
      if (restoreNeeded) {
        ctx.restore();
      }
    }
    if (vertical) {
      current.y -= x;
    } else {
      current.x += x * textHScale;
    }
    ctx.restore();
    this.compose();
    return undefined;
  }
  showType3Text(glyphs) {
    const ctx = this.ctx;
    const current = this.current;
    const font = current.font;
    const fontSize = current.fontSize;
    const fontDirection = current.fontDirection;
    const spacingDir = font.vertical ? 1 : -1;
    const charSpacing = current.charSpacing;
    const wordSpacing = current.wordSpacing;
    const textHScale = current.textHScale * fontDirection;
    const fontMatrix = current.fontMatrix || _util.FONT_IDENTITY_MATRIX;
    const glyphsLength = glyphs.length;
    const isTextInvisible = current.textRenderingMode === _util.TextRenderingMode.INVISIBLE;
    let i, glyph, width, spacingLength;
    if (isTextInvisible || fontSize === 0) {
      return;
    }
    this._cachedScaleForStroking[0] = -1;
    this._cachedGetSinglePixelWidth = null;
    ctx.save();
    ctx.transform(...current.textMatrix);
    ctx.translate(current.x, current.y);
    ctx.scale(textHScale, fontDirection);
    for (i = 0; i < glyphsLength; ++i) {
      glyph = glyphs[i];
      if (typeof glyph === "number") {
        spacingLength = spacingDir * glyph * fontSize / 1000;
        this.ctx.translate(spacingLength, 0);
        current.x += spacingLength * textHScale;
        continue;
      }
      const spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
      const operatorList = font.charProcOperatorList[glyph.operatorListId];
      if (!operatorList) {
        (0, _util.warn)(`Type3 character "${glyph.operatorListId}" is not available.`);
        continue;
      }
      if (this.contentVisible) {
        this.processingType3 = glyph;
        this.save();
        ctx.scale(fontSize, fontSize);
        ctx.transform(...fontMatrix);
        this.executeOperatorList(operatorList);
        this.restore();
      }
      const transformed = _util.Util.applyTransform([glyph.width, 0], fontMatrix);
      width = transformed[0] * fontSize + spacing;
      ctx.translate(width, 0);
      current.x += width * textHScale;
    }
    ctx.restore();
    this.processingType3 = null;
  }
  setCharWidth(xWidth, yWidth) {}
  setCharWidthAndBounds(xWidth, yWidth, llx, lly, urx, ury) {
    this.ctx.rect(llx, lly, urx - llx, ury - lly);
    this.ctx.clip();
    this.endPath();
  }
  getColorN_Pattern(IR) {
    let pattern;
    if (IR[0] === "TilingPattern") {
      const color = IR[1];
      const baseTransform = this.baseTransform || (0, _display_utils.getCurrentTransform)(this.ctx);
      const canvasGraphicsFactory = {
        createCanvasGraphics: ctx => {
          return new CanvasGraphics(ctx, this.commonObjs, this.objs, this.canvasFactory, this.filterFactory, {
            optionalContentConfig: this.optionalContentConfig,
            markedContentStack: this.markedContentStack
          });
        }
      };
      pattern = new _pattern_helper.TilingPattern(IR, color, this.ctx, canvasGraphicsFactory, baseTransform);
    } else {
      pattern = this._getPattern(IR[1], IR[2]);
    }
    return pattern;
  }
  setStrokeColorN() {
    this.current.strokeColor = this.getColorN_Pattern(arguments);
  }
  setFillColorN() {
    this.current.fillColor = this.getColorN_Pattern(arguments);
    this.current.patternFill = true;
  }
  setStrokeRGBColor(r, g, b) {
    const color = _util.Util.makeHexColor(r, g, b);
    this.ctx.strokeStyle = color;
    this.current.strokeColor = color;
  }
  setFillRGBColor(r, g, b) {
    const color = _util.Util.makeHexColor(r, g, b);
    this.ctx.fillStyle = color;
    this.current.fillColor = color;
    this.current.patternFill = false;
  }
  _getPattern(objId, matrix = null) {
    let pattern;
    if (this.cachedPatterns.has(objId)) {
      pattern = this.cachedPatterns.get(objId);
    } else {
      pattern = (0, _pattern_helper.getShadingPattern)(this.getObject(objId));
      this.cachedPatterns.set(objId, pattern);
    }
    if (matrix) {
      pattern.matrix = matrix;
    }
    return pattern;
  }
  shadingFill(objId) {
    if (!this.contentVisible) {
      return;
    }
    const ctx = this.ctx;
    this.save();
    const pattern = this._getPattern(objId);
    ctx.fillStyle = pattern.getPattern(ctx, this, (0, _display_utils.getCurrentTransformInverse)(ctx), _pattern_helper.PathType.SHADING);
    const inv = (0, _display_utils.getCurrentTransformInverse)(ctx);
    if (inv) {
      const {
        width,
        height
      } = ctx.canvas;
      const [x0, y0, x1, y1] = _util.Util.getAxialAlignedBoundingBox([0, 0, width, height], inv);
      this.ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    } else {
      this.ctx.fillRect(-1e10, -1e10, 2e10, 2e10);
    }
    this.compose(this.current.getClippedPathBoundingBox());
    this.restore();
  }
  beginInlineImage() {
    (0, _util.unreachable)("Should not call beginInlineImage");
  }
  beginImageData() {
    (0, _util.unreachable)("Should not call beginImageData");
  }
  paintFormXObjectBegin(matrix, bbox) {
    if (!this.contentVisible) {
      return;
    }
    this.save();
    this.baseTransformStack.push(this.baseTransform);
    if (Array.isArray(matrix) && matrix.length === 6) {
      this.transform(...matrix);
    }
    this.baseTransform = (0, _display_utils.getCurrentTransform)(this.ctx);
    if (bbox) {
      const width = bbox[2] - bbox[0];
      const height = bbox[3] - bbox[1];
      this.ctx.rect(bbox[0], bbox[1], width, height);
      this.current.updateRectMinMax((0, _display_utils.getCurrentTransform)(this.ctx), bbox);
      this.clip();
      this.endPath();
    }
  }
  paintFormXObjectEnd() {
    if (!this.contentVisible) {
      return;
    }
    this.restore();
    this.baseTransform = this.baseTransformStack.pop();
  }
  beginGroup(group) {
    if (!this.contentVisible) {
      return;
    }
    this.save();
    if (this.inSMaskMode) {
      this.endSMaskMode();
      this.current.activeSMask = null;
    }
    const currentCtx = this.ctx;
    if (!group.isolated) {
      (0, _util.info)("TODO: Support non-isolated groups.");
    }
    if (group.knockout) {
      (0, _util.warn)("Knockout groups not supported.");
    }
    const currentTransform = (0, _display_utils.getCurrentTransform)(currentCtx);
    if (group.matrix) {
      currentCtx.transform(...group.matrix);
    }
    if (!group.bbox) {
      throw new Error("Bounding box is required.");
    }
    let bounds = _util.Util.getAxialAlignedBoundingBox(group.bbox, (0, _display_utils.getCurrentTransform)(currentCtx));
    const canvasBounds = [0, 0, currentCtx.canvas.width, currentCtx.canvas.height];
    bounds = _util.Util.intersect(bounds, canvasBounds) || [0, 0, 0, 0];
    const offsetX = Math.floor(bounds[0]);
    const offsetY = Math.floor(bounds[1]);
    let drawnWidth = Math.max(Math.ceil(bounds[2]) - offsetX, 1);
    let drawnHeight = Math.max(Math.ceil(bounds[3]) - offsetY, 1);
    let scaleX = 1,
      scaleY = 1;
    if (drawnWidth > MAX_GROUP_SIZE) {
      scaleX = drawnWidth / MAX_GROUP_SIZE;
      drawnWidth = MAX_GROUP_SIZE;
    }
    if (drawnHeight > MAX_GROUP_SIZE) {
      scaleY = drawnHeight / MAX_GROUP_SIZE;
      drawnHeight = MAX_GROUP_SIZE;
    }
    this.current.startNewPathAndClipBox([0, 0, drawnWidth, drawnHeight]);
    let cacheId = "groupAt" + this.groupLevel;
    if (group.smask) {
      cacheId += "_smask_" + this.smaskCounter++ % 2;
    }
    const scratchCanvas = this.cachedCanvases.getCanvas(cacheId, drawnWidth, drawnHeight);
    const groupCtx = scratchCanvas.context;
    groupCtx.scale(1 / scaleX, 1 / scaleY);
    groupCtx.translate(-offsetX, -offsetY);
    groupCtx.transform(...currentTransform);
    if (group.smask) {
      this.smaskStack.push({
        canvas: scratchCanvas.canvas,
        context: groupCtx,
        offsetX,
        offsetY,
        scaleX,
        scaleY,
        subtype: group.smask.subtype,
        backdrop: group.smask.backdrop,
        transferMap: group.smask.transferMap || null,
        startTransformInverse: null
      });
    } else {
      currentCtx.setTransform(1, 0, 0, 1, 0, 0);
      currentCtx.translate(offsetX, offsetY);
      currentCtx.scale(scaleX, scaleY);
      currentCtx.save();
    }
    copyCtxState(currentCtx, groupCtx);
    this.ctx = groupCtx;
    this.setGState([["BM", "source-over"], ["ca", 1], ["CA", 1]]);
    this.groupStack.push(currentCtx);
    this.groupLevel++;
  }
  endGroup(group) {
    if (!this.contentVisible) {
      return;
    }
    this.groupLevel--;
    const groupCtx = this.ctx;
    const ctx = this.groupStack.pop();
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;
    if (group.smask) {
      this.tempSMask = this.smaskStack.pop();
      this.restore();
    } else {
      this.ctx.restore();
      const currentMtx = (0, _display_utils.getCurrentTransform)(this.ctx);
      this.restore();
      this.ctx.save();
      this.ctx.setTransform(...currentMtx);
      const dirtyBox = _util.Util.getAxialAlignedBoundingBox([0, 0, groupCtx.canvas.width, groupCtx.canvas.height], currentMtx);
      this.ctx.drawImage(groupCtx.canvas, 0, 0);
      this.ctx.restore();
      this.compose(dirtyBox);
    }
  }
  beginAnnotation(id, rect, transform, matrix, hasOwnCanvas) {
    this.#restoreInitialState();
    resetCtxToDefault(this.ctx);
    this.ctx.save();
    this.save();
    if (this.baseTransform) {
      this.ctx.setTransform(...this.baseTransform);
    }
    if (Array.isArray(rect) && rect.length === 4) {
      const width = rect[2] - rect[0];
      const height = rect[3] - rect[1];
      if (hasOwnCanvas && this.annotationCanvasMap) {
        transform = transform.slice();
        transform[4] -= rect[0];
        transform[5] -= rect[1];
        rect = rect.slice();
        rect[0] = rect[1] = 0;
        rect[2] = width;
        rect[3] = height;
        const [scaleX, scaleY] = _util.Util.singularValueDecompose2dScale((0, _display_utils.getCurrentTransform)(this.ctx));
        const {
          viewportScale
        } = this;
        const canvasWidth = Math.ceil(width * this.outputScaleX * viewportScale);
        const canvasHeight = Math.ceil(height * this.outputScaleY * viewportScale);
        this.annotationCanvas = this.canvasFactory.create(canvasWidth, canvasHeight);
        const {
          canvas,
          context
        } = this.annotationCanvas;
        this.annotationCanvasMap.set(id, canvas);
        this.annotationCanvas.savedCtx = this.ctx;
        this.ctx = context;
        this.ctx.save();
        this.ctx.setTransform(scaleX, 0, 0, -scaleY, 0, height * scaleY);
        resetCtxToDefault(this.ctx);
      } else {
        resetCtxToDefault(this.ctx);
        this.ctx.rect(rect[0], rect[1], width, height);
        this.ctx.clip();
        this.endPath();
      }
    }
    this.current = new CanvasExtraState(this.ctx.canvas.width, this.ctx.canvas.height);
    this.transform(...transform);
    this.transform(...matrix);
  }
  endAnnotation() {
    if (this.annotationCanvas) {
      this.ctx.restore();
      this.#drawFilter();
      this.ctx = this.annotationCanvas.savedCtx;
      delete this.annotationCanvas.savedCtx;
      delete this.annotationCanvas;
    }
  }
  paintImageMaskXObject(img) {
    if (!this.contentVisible) {
      return;
    }
    const count = img.count;
    img = this.getObject(img.data, img);
    img.count = count;
    const ctx = this.ctx;
    const glyph = this.processingType3;
    if (glyph) {
      if (glyph.compiled === undefined) {
        glyph.compiled = compileType3Glyph(img);
      }
      if (glyph.compiled) {
        glyph.compiled(ctx);
        return;
      }
    }
    const mask = this._createMaskCanvas(img);
    const maskCanvas = mask.canvas;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(maskCanvas, mask.offsetX, mask.offsetY);
    ctx.restore();
    this.compose();
  }
  paintImageMaskXObjectRepeat(img, scaleX, skewX = 0, skewY = 0, scaleY, positions) {
    if (!this.contentVisible) {
      return;
    }
    img = this.getObject(img.data, img);
    const ctx = this.ctx;
    ctx.save();
    const currentTransform = (0, _display_utils.getCurrentTransform)(ctx);
    ctx.transform(scaleX, skewX, skewY, scaleY, 0, 0);
    const mask = this._createMaskCanvas(img);
    ctx.setTransform(1, 0, 0, 1, mask.offsetX - currentTransform[4], mask.offsetY - currentTransform[5]);
    for (let i = 0, ii = positions.length; i < ii; i += 2) {
      const trans = _util.Util.transform(currentTransform, [scaleX, skewX, skewY, scaleY, positions[i], positions[i + 1]]);
      const [x, y] = _util.Util.applyTransform([0, 0], trans);
      ctx.drawImage(mask.canvas, x, y);
    }
    ctx.restore();
    this.compose();
  }
  paintImageMaskXObjectGroup(images) {
    if (!this.contentVisible) {
      return;
    }
    const ctx = this.ctx;
    const fillColor = this.current.fillColor;
    const isPatternFill = this.current.patternFill;
    for (const image of images) {
      const {
        data,
        width,
        height,
        transform
      } = image;
      const maskCanvas = this.cachedCanvases.getCanvas("maskCanvas", width, height);
      const maskCtx = maskCanvas.context;
      maskCtx.save();
      const img = this.getObject(data, image);
      putBinaryImageMask(maskCtx, img);
      maskCtx.globalCompositeOperation = "source-in";
      maskCtx.fillStyle = isPatternFill ? fillColor.getPattern(maskCtx, this, (0, _display_utils.getCurrentTransformInverse)(ctx), _pattern_helper.PathType.FILL) : fillColor;
      maskCtx.fillRect(0, 0, width, height);
      maskCtx.restore();
      ctx.save();
      ctx.transform(...transform);
      ctx.scale(1, -1);
      drawImageAtIntegerCoords(ctx, maskCanvas.canvas, 0, 0, width, height, 0, -1, 1, 1);
      ctx.restore();
    }
    this.compose();
  }
  paintImageXObject(objId) {
    if (!this.contentVisible) {
      return;
    }
    const imgData = this.getObject(objId);
    if (!imgData) {
      (0, _util.warn)("Dependent image isn't ready yet");
      return;
    }
    this.paintInlineImageXObject(imgData);
  }
  paintImageXObjectRepeat(objId, scaleX, scaleY, positions) {
    if (!this.contentVisible) {
      return;
    }
    const imgData = this.getObject(objId);
    if (!imgData) {
      (0, _util.warn)("Dependent image isn't ready yet");
      return;
    }
    const width = imgData.width;
    const height = imgData.height;
    const map = [];
    for (let i = 0, ii = positions.length; i < ii; i += 2) {
      map.push({
        transform: [scaleX, 0, 0, scaleY, positions[i], positions[i + 1]],
        x: 0,
        y: 0,
        w: width,
        h: height
      });
    }
    this.paintInlineImageXObjectGroup(imgData, map);
  }
  applyTransferMapsToCanvas(ctx) {
    if (this.current.transferMaps !== "none") {
      ctx.filter = this.current.transferMaps;
      ctx.drawImage(ctx.canvas, 0, 0);
      ctx.filter = "none";
    }
    return ctx.canvas;
  }
  applyTransferMapsToBitmap(imgData) {
    if (this.current.transferMaps === "none") {
      return imgData.bitmap;
    }
    const {
      bitmap,
      width,
      height
    } = imgData;
    const tmpCanvas = this.cachedCanvases.getCanvas("inlineImage", width, height);
    const tmpCtx = tmpCanvas.context;
    tmpCtx.filter = this.current.transferMaps;
    tmpCtx.drawImage(bitmap, 0, 0);
    tmpCtx.filter = "none";
    return tmpCanvas.canvas;
  }
  paintInlineImageXObject(imgData) {
    if (!this.contentVisible) {
      return;
    }
    const width = imgData.width;
    const height = imgData.height;
    const ctx = this.ctx;
    this.save();
    if (!_util.isNodeJS) {
      const {
        filter
      } = ctx;
      if (filter !== "none" && filter !== "") {
        ctx.filter = "none";
      }
    }
    ctx.scale(1 / width, -1 / height);
    let imgToPaint;
    if (imgData.bitmap) {
      imgToPaint = this.applyTransferMapsToBitmap(imgData);
    } else if (typeof HTMLElement === "function" && imgData instanceof HTMLElement || !imgData.data) {
      imgToPaint = imgData;
    } else {
      const tmpCanvas = this.cachedCanvases.getCanvas("inlineImage", width, height);
      const tmpCtx = tmpCanvas.context;
      putBinaryImageData(tmpCtx, imgData);
      imgToPaint = this.applyTransferMapsToCanvas(tmpCtx);
    }
    const scaled = this._scaleImage(imgToPaint, (0, _display_utils.getCurrentTransformInverse)(ctx));
    ctx.imageSmoothingEnabled = getImageSmoothingEnabled((0, _display_utils.getCurrentTransform)(ctx), imgData.interpolate);
    drawImageAtIntegerCoords(ctx, scaled.img, 0, 0, scaled.paintWidth, scaled.paintHeight, 0, -height, width, height);
    this.compose();
    this.restore();
  }
  paintInlineImageXObjectGroup(imgData, map) {
    if (!this.contentVisible) {
      return;
    }
    const ctx = this.ctx;
    let imgToPaint;
    if (imgData.bitmap) {
      imgToPaint = imgData.bitmap;
    } else {
      const w = imgData.width;
      const h = imgData.height;
      const tmpCanvas = this.cachedCanvases.getCanvas("inlineImage", w, h);
      const tmpCtx = tmpCanvas.context;
      putBinaryImageData(tmpCtx, imgData);
      imgToPaint = this.applyTransferMapsToCanvas(tmpCtx);
    }
    for (const entry of map) {
      ctx.save();
      ctx.transform(...entry.transform);
      ctx.scale(1, -1);
      drawImageAtIntegerCoords(ctx, imgToPaint, entry.x, entry.y, entry.w, entry.h, 0, -1, 1, 1);
      ctx.restore();
    }
    this.compose();
  }
  paintSolidColorImageMask() {
    if (!this.contentVisible) {
      return;
    }
    this.ctx.fillRect(0, 0, 1, 1);
    this.compose();
  }
  markPoint(tag) {}
  markPointProps(tag, properties) {}
  beginMarkedContent(tag) {
    this.markedContentStack.push({
      visible: true
    });
  }
  beginMarkedContentProps(tag, properties) {
    if (tag === "OC") {
      this.markedContentStack.push({
        visible: this.optionalContentConfig.isVisible(properties)
      });
    } else {
      this.markedContentStack.push({
        visible: true
      });
    }
    this.contentVisible = this.isContentVisible();
  }
  endMarkedContent() {
    this.markedContentStack.pop();
    this.contentVisible = this.isContentVisible();
  }
  beginCompat() {}
  endCompat() {}
  consumePath(clipBox) {
    const isEmpty = this.current.isEmptyClip();
    if (this.pendingClip) {
      this.current.updateClipFromPath();
    }
    if (!this.pendingClip) {
      this.compose(clipBox);
    }
    const ctx = this.ctx;
    if (this.pendingClip) {
      if (!isEmpty) {
        if (this.pendingClip === EO_CLIP) {
          ctx.clip("evenodd");
        } else {
          ctx.clip();
        }
      }
      this.pendingClip = null;
    }
    this.current.startNewPathAndClipBox(this.current.clipBox);
    ctx.beginPath();
  }
  getSinglePixelWidth() {
    if (!this._cachedGetSinglePixelWidth) {
      const m = (0, _display_utils.getCurrentTransform)(this.ctx);
      if (m[1] === 0 && m[2] === 0) {
        this._cachedGetSinglePixelWidth = 1 / Math.min(Math.abs(m[0]), Math.abs(m[3]));
      } else {
        const absDet = Math.abs(m[0] * m[3] - m[2] * m[1]);
        const normX = Math.hypot(m[0], m[2]);
        const normY = Math.hypot(m[1], m[3]);
        this._cachedGetSinglePixelWidth = Math.max(normX, normY) / absDet;
      }
    }
    return this._cachedGetSinglePixelWidth;
  }
  getScaleForStroking() {
    if (this._cachedScaleForStroking[0] === -1) {
      const {
        lineWidth
      } = this.current;
      const {
        a,
        b,
        c,
        d
      } = this.ctx.getTransform();
      let scaleX, scaleY;
      if (b === 0 && c === 0) {
        const normX = Math.abs(a);
        const normY = Math.abs(d);
        if (normX === normY) {
          if (lineWidth === 0) {
            scaleX = scaleY = 1 / normX;
          } else {
            const scaledLineWidth = normX * lineWidth;
            scaleX = scaleY = scaledLineWidth < 1 ? 1 / scaledLineWidth : 1;
          }
        } else if (lineWidth === 0) {
          scaleX = 1 / normX;
          scaleY = 1 / normY;
        } else {
          const scaledXLineWidth = normX * lineWidth;
          const scaledYLineWidth = normY * lineWidth;
          scaleX = scaledXLineWidth < 1 ? 1 / scaledXLineWidth : 1;
          scaleY = scaledYLineWidth < 1 ? 1 / scaledYLineWidth : 1;
        }
      } else {
        const absDet = Math.abs(a * d - b * c);
        const normX = Math.hypot(a, b);
        const normY = Math.hypot(c, d);
        if (lineWidth === 0) {
          scaleX = normY / absDet;
          scaleY = normX / absDet;
        } else {
          const baseArea = lineWidth * absDet;
          scaleX = normY > baseArea ? normY / baseArea : 1;
          scaleY = normX > baseArea ? normX / baseArea : 1;
        }
      }
      this._cachedScaleForStroking[0] = scaleX;
      this._cachedScaleForStroking[1] = scaleY;
    }
    return this._cachedScaleForStroking;
  }
  rescaleAndStroke(saveRestore) {
    const {
      ctx
    } = this;
    const {
      lineWidth
    } = this.current;
    const [scaleX, scaleY] = this.getScaleForStroking();
    ctx.lineWidth = lineWidth || 1;
    if (scaleX === 1 && scaleY === 1) {
      ctx.stroke();
      return;
    }
    const dashes = ctx.getLineDash();
    if (saveRestore) {
      ctx.save();
    }
    ctx.scale(scaleX, scaleY);
    if (dashes.length > 0) {
      const scale = Math.max(scaleX, scaleY);
      ctx.setLineDash(dashes.map(x => x / scale));
      ctx.lineDashOffset /= scale;
    }
    ctx.stroke();
    if (saveRestore) {
      ctx.restore();
    }
  }
  isContentVisible() {
    for (let i = this.markedContentStack.length - 1; i >= 0; i--) {
      if (!this.markedContentStack[i].visible) {
        return false;
      }
    }
    return true;
  }
}
exports.CanvasGraphics = CanvasGraphics;
for (const op in _util.OPS) {
  if (CanvasGraphics.prototype[op] !== undefined) {
    CanvasGraphics.prototype[_util.OPS[op]] = CanvasGraphics.prototype[op];
  }
}

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TilingPattern = exports.PathType = void 0;
exports.getShadingPattern = getShadingPattern;
var _util = __w_pdfjs_require__(1);
var _display_utils = __w_pdfjs_require__(6);
const PathType = {
  FILL: "Fill",
  STROKE: "Stroke",
  SHADING: "Shading"
};
exports.PathType = PathType;
function applyBoundingBox(ctx, bbox) {
  if (!bbox) {
    return;
  }
  const width = bbox[2] - bbox[0];
  const height = bbox[3] - bbox[1];
  const region = new Path2D();
  region.rect(bbox[0], bbox[1], width, height);
  ctx.clip(region);
}
class BaseShadingPattern {
  constructor() {
    if (this.constructor === BaseShadingPattern) {
      (0, _util.unreachable)("Cannot initialize BaseShadingPattern.");
    }
  }
  getPattern() {
    (0, _util.unreachable)("Abstract method `getPattern` called.");
  }
}
class RadialAxialShadingPattern extends BaseShadingPattern {
  constructor(IR) {
    super();
    this._type = IR[1];
    this._bbox = IR[2];
    this._colorStops = IR[3];
    this._p0 = IR[4];
    this._p1 = IR[5];
    this._r0 = IR[6];
    this._r1 = IR[7];
    this.matrix = null;
  }
  _createGradient(ctx) {
    let grad;
    if (this._type === "axial") {
      grad = ctx.createLinearGradient(this._p0[0], this._p0[1], this._p1[0], this._p1[1]);
    } else if (this._type === "radial") {
      grad = ctx.createRadialGradient(this._p0[0], this._p0[1], this._r0, this._p1[0], this._p1[1], this._r1);
    }
    for (const colorStop of this._colorStops) {
      grad.addColorStop(colorStop[0], colorStop[1]);
    }
    return grad;
  }
  getPattern(ctx, owner, inverse, pathType) {
    let pattern;
    if (pathType === PathType.STROKE || pathType === PathType.FILL) {
      const ownerBBox = owner.current.getClippedPathBoundingBox(pathType, (0, _display_utils.getCurrentTransform)(ctx)) || [0, 0, 0, 0];
      const width = Math.ceil(ownerBBox[2] - ownerBBox[0]) || 1;
      const height = Math.ceil(ownerBBox[3] - ownerBBox[1]) || 1;
      const tmpCanvas = owner.cachedCanvases.getCanvas("pattern", width, height, true);
      const tmpCtx = tmpCanvas.context;
      tmpCtx.clearRect(0, 0, tmpCtx.canvas.width, tmpCtx.canvas.height);
      tmpCtx.beginPath();
      tmpCtx.rect(0, 0, tmpCtx.canvas.width, tmpCtx.canvas.height);
      tmpCtx.translate(-ownerBBox[0], -ownerBBox[1]);
      inverse = _util.Util.transform(inverse, [1, 0, 0, 1, ownerBBox[0], ownerBBox[1]]);
      tmpCtx.transform(...owner.baseTransform);
      if (this.matrix) {
        tmpCtx.transform(...this.matrix);
      }
      applyBoundingBox(tmpCtx, this._bbox);
      tmpCtx.fillStyle = this._createGradient(tmpCtx);
      tmpCtx.fill();
      pattern = ctx.createPattern(tmpCanvas.canvas, "no-repeat");
      const domMatrix = new DOMMatrix(inverse);
      pattern.setTransform(domMatrix);
    } else {
      applyBoundingBox(ctx, this._bbox);
      pattern = this._createGradient(ctx);
    }
    return pattern;
  }
}
function drawTriangle(data, context, p1, p2, p3, c1, c2, c3) {
  const coords = context.coords,
    colors = context.colors;
  const bytes = data.data,
    rowSize = data.width * 4;
  let tmp;
  if (coords[p1 + 1] > coords[p2 + 1]) {
    tmp = p1;
    p1 = p2;
    p2 = tmp;
    tmp = c1;
    c1 = c2;
    c2 = tmp;
  }
  if (coords[p2 + 1] > coords[p3 + 1]) {
    tmp = p2;
    p2 = p3;
    p3 = tmp;
    tmp = c2;
    c2 = c3;
    c3 = tmp;
  }
  if (coords[p1 + 1] > coords[p2 + 1]) {
    tmp = p1;
    p1 = p2;
    p2 = tmp;
    tmp = c1;
    c1 = c2;
    c2 = tmp;
  }
  const x1 = (coords[p1] + context.offsetX) * context.scaleX;
  const y1 = (coords[p1 + 1] + context.offsetY) * context.scaleY;
  const x2 = (coords[p2] + context.offsetX) * context.scaleX;
  const y2 = (coords[p2 + 1] + context.offsetY) * context.scaleY;
  const x3 = (coords[p3] + context.offsetX) * context.scaleX;
  const y3 = (coords[p3 + 1] + context.offsetY) * context.scaleY;
  if (y1 >= y3) {
    return;
  }
  const c1r = colors[c1],
    c1g = colors[c1 + 1],
    c1b = colors[c1 + 2];
  const c2r = colors[c2],
    c2g = colors[c2 + 1],
    c2b = colors[c2 + 2];
  const c3r = colors[c3],
    c3g = colors[c3 + 1],
    c3b = colors[c3 + 2];
  const minY = Math.round(y1),
    maxY = Math.round(y3);
  let xa, car, cag, cab;
  let xb, cbr, cbg, cbb;
  for (let y = minY; y <= maxY; y++) {
    if (y < y2) {
      const k = y < y1 ? 0 : (y1 - y) / (y1 - y2);
      xa = x1 - (x1 - x2) * k;
      car = c1r - (c1r - c2r) * k;
      cag = c1g - (c1g - c2g) * k;
      cab = c1b - (c1b - c2b) * k;
    } else {
      let k;
      if (y > y3) {
        k = 1;
      } else if (y2 === y3) {
        k = 0;
      } else {
        k = (y2 - y) / (y2 - y3);
      }
      xa = x2 - (x2 - x3) * k;
      car = c2r - (c2r - c3r) * k;
      cag = c2g - (c2g - c3g) * k;
      cab = c2b - (c2b - c3b) * k;
    }
    let k;
    if (y < y1) {
      k = 0;
    } else if (y > y3) {
      k = 1;
    } else {
      k = (y1 - y) / (y1 - y3);
    }
    xb = x1 - (x1 - x3) * k;
    cbr = c1r - (c1r - c3r) * k;
    cbg = c1g - (c1g - c3g) * k;
    cbb = c1b - (c1b - c3b) * k;
    const x1_ = Math.round(Math.min(xa, xb));
    const x2_ = Math.round(Math.max(xa, xb));
    let j = rowSize * y + x1_ * 4;
    for (let x = x1_; x <= x2_; x++) {
      k = (xa - x) / (xa - xb);
      if (k < 0) {
        k = 0;
      } else if (k > 1) {
        k = 1;
      }
      bytes[j++] = car - (car - cbr) * k | 0;
      bytes[j++] = cag - (cag - cbg) * k | 0;
      bytes[j++] = cab - (cab - cbb) * k | 0;
      bytes[j++] = 255;
    }
  }
}
function drawFigure(data, figure, context) {
  const ps = figure.coords;
  const cs = figure.colors;
  let i, ii;
  switch (figure.type) {
    case "lattice":
      const verticesPerRow = figure.verticesPerRow;
      const rows = Math.floor(ps.length / verticesPerRow) - 1;
      const cols = verticesPerRow - 1;
      for (i = 0; i < rows; i++) {
        let q = i * verticesPerRow;
        for (let j = 0; j < cols; j++, q++) {
          drawTriangle(data, context, ps[q], ps[q + 1], ps[q + verticesPerRow], cs[q], cs[q + 1], cs[q + verticesPerRow]);
          drawTriangle(data, context, ps[q + verticesPerRow + 1], ps[q + 1], ps[q + verticesPerRow], cs[q + verticesPerRow + 1], cs[q + 1], cs[q + verticesPerRow]);
        }
      }
      break;
    case "triangles":
      for (i = 0, ii = ps.length; i < ii; i += 3) {
        drawTriangle(data, context, ps[i], ps[i + 1], ps[i + 2], cs[i], cs[i + 1], cs[i + 2]);
      }
      break;
    default:
      throw new Error("illegal figure");
  }
}
class MeshShadingPattern extends BaseShadingPattern {
  constructor(IR) {
    super();
    this._coords = IR[2];
    this._colors = IR[3];
    this._figures = IR[4];
    this._bounds = IR[5];
    this._bbox = IR[7];
    this._background = IR[8];
    this.matrix = null;
  }
  _createMeshCanvas(combinedScale, backgroundColor, cachedCanvases) {
    const EXPECTED_SCALE = 1.1;
    const MAX_PATTERN_SIZE = 3000;
    const BORDER_SIZE = 2;
    const offsetX = Math.floor(this._bounds[0]);
    const offsetY = Math.floor(this._bounds[1]);
    const boundsWidth = Math.ceil(this._bounds[2]) - offsetX;
    const boundsHeight = Math.ceil(this._bounds[3]) - offsetY;
    const width = Math.min(Math.ceil(Math.abs(boundsWidth * combinedScale[0] * EXPECTED_SCALE)), MAX_PATTERN_SIZE);
    const height = Math.min(Math.ceil(Math.abs(boundsHeight * combinedScale[1] * EXPECTED_SCALE)), MAX_PATTERN_SIZE);
    const scaleX = boundsWidth / width;
    const scaleY = boundsHeight / height;
    const context = {
      coords: this._coords,
      colors: this._colors,
      offsetX: -offsetX,
      offsetY: -offsetY,
      scaleX: 1 / scaleX,
      scaleY: 1 / scaleY
    };
    const paddedWidth = width + BORDER_SIZE * 2;
    const paddedHeight = height + BORDER_SIZE * 2;
    const tmpCanvas = cachedCanvases.getCanvas("mesh", paddedWidth, paddedHeight, false);
    const tmpCtx = tmpCanvas.context;
    const data = tmpCtx.createImageData(width, height);
    if (backgroundColor) {
      const bytes = data.data;
      for (let i = 0, ii = bytes.length; i < ii; i += 4) {
        bytes[i] = backgroundColor[0];
        bytes[i + 1] = backgroundColor[1];
        bytes[i + 2] = backgroundColor[2];
        bytes[i + 3] = 255;
      }
    }
    for (const figure of this._figures) {
      drawFigure(data, figure, context);
    }
    tmpCtx.putImageData(data, BORDER_SIZE, BORDER_SIZE);
    const canvas = tmpCanvas.canvas;
    return {
      canvas,
      offsetX: offsetX - BORDER_SIZE * scaleX,
      offsetY: offsetY - BORDER_SIZE * scaleY,
      scaleX,
      scaleY
    };
  }
  getPattern(ctx, owner, inverse, pathType) {
    applyBoundingBox(ctx, this._bbox);
    let scale;
    if (pathType === PathType.SHADING) {
      scale = _util.Util.singularValueDecompose2dScale((0, _display_utils.getCurrentTransform)(ctx));
    } else {
      scale = _util.Util.singularValueDecompose2dScale(owner.baseTransform);
      if (this.matrix) {
        const matrixScale = _util.Util.singularValueDecompose2dScale(this.matrix);
        scale = [scale[0] * matrixScale[0], scale[1] * matrixScale[1]];
      }
    }
    const temporaryPatternCanvas = this._createMeshCanvas(scale, pathType === PathType.SHADING ? null : this._background, owner.cachedCanvases);
    if (pathType !== PathType.SHADING) {
      ctx.setTransform(...owner.baseTransform);
      if (this.matrix) {
        ctx.transform(...this.matrix);
      }
    }
    ctx.translate(temporaryPatternCanvas.offsetX, temporaryPatternCanvas.offsetY);
    ctx.scale(temporaryPatternCanvas.scaleX, temporaryPatternCanvas.scaleY);
    return ctx.createPattern(temporaryPatternCanvas.canvas, "no-repeat");
  }
}
class DummyShadingPattern extends BaseShadingPattern {
  getPattern() {
    return "hotpink";
  }
}
function getShadingPattern(IR) {
  switch (IR[0]) {
    case "RadialAxial":
      return new RadialAxialShadingPattern(IR);
    case "Mesh":
      return new MeshShadingPattern(IR);
    case "Dummy":
      return new DummyShadingPattern();
  }
  throw new Error(`Unknown IR type: ${IR[0]}`);
}
const PaintType = {
  COLORED: 1,
  UNCOLORED: 2
};
class TilingPattern {
  static MAX_PATTERN_SIZE = 3000;
  constructor(IR, color, ctx, canvasGraphicsFactory, baseTransform) {
    this.operatorList = IR[2];
    this.matrix = IR[3] || [1, 0, 0, 1, 0, 0];
    this.bbox = IR[4];
    this.xstep = IR[5];
    this.ystep = IR[6];
    this.paintType = IR[7];
    this.tilingType = IR[8];
    this.color = color;
    this.ctx = ctx;
    this.canvasGraphicsFactory = canvasGraphicsFactory;
    this.baseTransform = baseTransform;
  }
  createPatternCanvas(owner) {
    const operatorList = this.operatorList;
    const bbox = this.bbox;
    const xstep = this.xstep;
    const ystep = this.ystep;
    const paintType = this.paintType;
    const tilingType = this.tilingType;
    const color = this.color;
    const canvasGraphicsFactory = this.canvasGraphicsFactory;
    (0, _util.info)("TilingType: " + tilingType);
    const x0 = bbox[0],
      y0 = bbox[1],
      x1 = bbox[2],
      y1 = bbox[3];
    const matrixScale = _util.Util.singularValueDecompose2dScale(this.matrix);
    const curMatrixScale = _util.Util.singularValueDecompose2dScale(this.baseTransform);
    const combinedScale = [matrixScale[0] * curMatrixScale[0], matrixScale[1] * curMatrixScale[1]];
    const dimx = this.getSizeAndScale(xstep, this.ctx.canvas.width, combinedScale[0]);
    const dimy = this.getSizeAndScale(ystep, this.ctx.canvas.height, combinedScale[1]);
    const tmpCanvas = owner.cachedCanvases.getCanvas("pattern", dimx.size, dimy.size, true);
    const tmpCtx = tmpCanvas.context;
    const graphics = canvasGraphicsFactory.createCanvasGraphics(tmpCtx);
    graphics.groupLevel = owner.groupLevel;
    this.setFillAndStrokeStyleToContext(graphics, paintType, color);
    let adjustedX0 = x0;
    let adjustedY0 = y0;
    let adjustedX1 = x1;
    let adjustedY1 = y1;
    if (x0 < 0) {
      adjustedX0 = 0;
      adjustedX1 += Math.abs(x0);
    }
    if (y0 < 0) {
      adjustedY0 = 0;
      adjustedY1 += Math.abs(y0);
    }
    tmpCtx.translate(-(dimx.scale * adjustedX0), -(dimy.scale * adjustedY0));
    graphics.transform(dimx.scale, 0, 0, dimy.scale, 0, 0);
    tmpCtx.save();
    this.clipBbox(graphics, adjustedX0, adjustedY0, adjustedX1, adjustedY1);
    graphics.baseTransform = (0, _display_utils.getCurrentTransform)(graphics.ctx);
    graphics.executeOperatorList(operatorList);
    graphics.endDrawing();
    return {
      canvas: tmpCanvas.canvas,
      scaleX: dimx.scale,
      scaleY: dimy.scale,
      offsetX: adjustedX0,
      offsetY: adjustedY0
    };
  }
  getSizeAndScale(step, realOutputSize, scale) {
    step = Math.abs(step);
    const maxSize = Math.max(TilingPattern.MAX_PATTERN_SIZE, realOutputSize);
    let size = Math.ceil(step * scale);
    if (size >= maxSize) {
      size = maxSize;
    } else {
      scale = size / step;
    }
    return {
      scale,
      size
    };
  }
  clipBbox(graphics, x0, y0, x1, y1) {
    const bboxWidth = x1 - x0;
    const bboxHeight = y1 - y0;
    graphics.ctx.rect(x0, y0, bboxWidth, bboxHeight);
    graphics.current.updateRectMinMax((0, _display_utils.getCurrentTransform)(graphics.ctx), [x0, y0, x1, y1]);
    graphics.clip();
    graphics.endPath();
  }
  setFillAndStrokeStyleToContext(graphics, paintType, color) {
    const context = graphics.ctx,
      current = graphics.current;
    switch (paintType) {
      case PaintType.COLORED:
        const ctx = this.ctx;
        context.fillStyle = ctx.fillStyle;
        context.strokeStyle = ctx.strokeStyle;
        current.fillColor = ctx.fillStyle;
        current.strokeColor = ctx.strokeStyle;
        break;
      case PaintType.UNCOLORED:
        const cssColor = _util.Util.makeHexColor(color[0], color[1], color[2]);
        context.fillStyle = cssColor;
        context.strokeStyle = cssColor;
        current.fillColor = cssColor;
        current.strokeColor = cssColor;
        break;
      default:
        throw new _util.FormatError(`Unsupported paint type: ${paintType}`);
    }
  }
  getPattern(ctx, owner, inverse, pathType) {
    let matrix = inverse;
    if (pathType !== PathType.SHADING) {
      matrix = _util.Util.transform(matrix, owner.baseTransform);
      if (this.matrix) {
        matrix = _util.Util.transform(matrix, this.matrix);
      }
    }
    const temporaryPatternCanvas = this.createPatternCanvas(owner);
    let domMatrix = new DOMMatrix(matrix);
    domMatrix = domMatrix.translate(temporaryPatternCanvas.offsetX, temporaryPatternCanvas.offsetY);
    domMatrix = domMatrix.scale(1 / temporaryPatternCanvas.scaleX, 1 / temporaryPatternCanvas.scaleY);
    const pattern = ctx.createPattern(temporaryPatternCanvas.canvas, "repeat");
    pattern.setTransform(domMatrix);
    return pattern;
  }
}
exports.TilingPattern = TilingPattern;

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.convertBlackAndWhiteToRGBA = convertBlackAndWhiteToRGBA;
exports.convertToRGBA = convertToRGBA;
exports.grayToRGBA = grayToRGBA;
var _util = __w_pdfjs_require__(1);
function convertToRGBA(params) {
  switch (params.kind) {
    case _util.ImageKind.GRAYSCALE_1BPP:
      return convertBlackAndWhiteToRGBA(params);
    case _util.ImageKind.RGB_24BPP:
      return convertRGBToRGBA(params);
  }
  return null;
}
function convertBlackAndWhiteToRGBA({
  src,
  srcPos = 0,
  dest,
  width,
  height,
  nonBlackColor = 0xffffffff,
  inverseDecode = false
}) {
  const black = _util.FeatureTest.isLittleEndian ? 0xff000000 : 0x000000ff;
  const [zeroMapping, oneMapping] = inverseDecode ? [nonBlackColor, black] : [black, nonBlackColor];
  const widthInSource = width >> 3;
  const widthRemainder = width & 7;
  const srcLength = src.length;
  dest = new Uint32Array(dest.buffer);
  let destPos = 0;
  for (let i = 0; i < height; i++) {
    for (const max = srcPos + widthInSource; srcPos < max; srcPos++) {
      const elem = srcPos < srcLength ? src[srcPos] : 255;
      dest[destPos++] = elem & 0b10000000 ? oneMapping : zeroMapping;
      dest[destPos++] = elem & 0b1000000 ? oneMapping : zeroMapping;
      dest[destPos++] = elem & 0b100000 ? oneMapping : zeroMapping;
      dest[destPos++] = elem & 0b10000 ? oneMapping : zeroMapping;
      dest[destPos++] = elem & 0b1000 ? oneMapping : zeroMapping;
      dest[destPos++] = elem & 0b100 ? oneMapping : zeroMapping;
      dest[destPos++] = elem & 0b10 ? oneMapping : zeroMapping;
      dest[destPos++] = elem & 0b1 ? oneMapping : zeroMapping;
    }
    if (widthRemainder === 0) {
      continue;
    }
    const elem = srcPos < srcLength ? src[srcPos++] : 255;
    for (let j = 0; j < widthRemainder; j++) {
      dest[destPos++] = elem & 1 << 7 - j ? oneMapping : zeroMapping;
    }
  }
  return {
    srcPos,
    destPos
  };
}
function convertRGBToRGBA({
  src,
  srcPos = 0,
  dest,
  destPos = 0,
  width,
  height
}) {
  let i = 0;
  const len32 = src.length >> 2;
  const src32 = new Uint32Array(src.buffer, srcPos, len32);
  if (_util.FeatureTest.isLittleEndian) {
    for (; i < len32 - 2; i += 3, destPos += 4) {
      const s1 = src32[i];
      const s2 = src32[i + 1];
      const s3 = src32[i + 2];
      dest[destPos] = s1 | 0xff000000;
      dest[destPos + 1] = s1 >>> 24 | s2 << 8 | 0xff000000;
      dest[destPos + 2] = s2 >>> 16 | s3 << 16 | 0xff000000;
      dest[destPos + 3] = s3 >>> 8 | 0xff000000;
    }
    for (let j = i * 4, jj = src.length; j < jj; j += 3) {
      dest[destPos++] = src[j] | src[j + 1] << 8 | src[j + 2] << 16 | 0xff000000;
    }
  } else {
    for (; i < len32 - 2; i += 3, destPos += 4) {
      const s1 = src32[i];
      const s2 = src32[i + 1];
      const s3 = src32[i + 2];
      dest[destPos] = s1 | 0xff;
      dest[destPos + 1] = s1 << 24 | s2 >>> 8 | 0xff;
      dest[destPos + 2] = s2 << 16 | s3 >>> 16 | 0xff;
      dest[destPos + 3] = s3 << 8 | 0xff;
    }
    for (let j = i * 4, jj = src.length; j < jj; j += 3) {
      dest[destPos++] = src[j] << 24 | src[j + 1] << 16 | src[j + 2] << 8 | 0xff;
    }
  }
  return {
    srcPos,
    destPos
  };
}
function grayToRGBA(src, dest) {
  if (_util.FeatureTest.isLittleEndian) {
    for (let i = 0, ii = src.length; i < ii; i++) {
      dest[i] = src[i] * 0x10101 | 0xff000000;
    }
  } else {
    for (let i = 0, ii = src.length; i < ii; i++) {
      dest[i] = src[i] * 0x1010100 | 0x000000ff;
    }
  }
}

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GlobalWorkerOptions = void 0;
const GlobalWorkerOptions = Object.create(null);
exports.GlobalWorkerOptions = GlobalWorkerOptions;
GlobalWorkerOptions.workerPort = null;
GlobalWorkerOptions.workerSrc = "";

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.MessageHandler = void 0;
var _util = __w_pdfjs_require__(1);
const CallbackKind = {
  UNKNOWN: 0,
  DATA: 1,
  ERROR: 2
};
const StreamKind = {
  UNKNOWN: 0,
  CANCEL: 1,
  CANCEL_COMPLETE: 2,
  CLOSE: 3,
  ENQUEUE: 4,
  ERROR: 5,
  PULL: 6,
  PULL_COMPLETE: 7,
  START_COMPLETE: 8
};
function wrapReason(reason) {
  if (!(reason instanceof Error || typeof reason === "object" && reason !== null)) {
    (0, _util.unreachable)('wrapReason: Expected "reason" to be a (possibly cloned) Error.');
  }
  switch (reason.name) {
    case "AbortException":
      return new _util.AbortException(reason.message);
    case "MissingPDFException":
      return new _util.MissingPDFException(reason.message);
    case "PasswordException":
      return new _util.PasswordException(reason.message, reason.code);
    case "UnexpectedResponseException":
      return new _util.UnexpectedResponseException(reason.message, reason.status);
    case "UnknownErrorException":
      return new _util.UnknownErrorException(reason.message, reason.details);
    default:
      return new _util.UnknownErrorException(reason.message, reason.toString());
  }
}
class MessageHandler {
  constructor(sourceName, targetName, comObj) {
    this.sourceName = sourceName;
    this.targetName = targetName;
    this.comObj = comObj;
    this.callbackId = 1;
    this.streamId = 1;
    this.streamSinks = Object.create(null);
    this.streamControllers = Object.create(null);
    this.callbackCapabilities = Object.create(null);
    this.actionHandler = Object.create(null);
    this._onComObjOnMessage = event => {
      const data = event.data;
      if (data.targetName !== this.sourceName) {
        return;
      }
      if (data.stream) {
        this.#processStreamMessage(data);
        return;
      }
      if (data.callback) {
        const callbackId = data.callbackId;
        const capability = this.callbackCapabilities[callbackId];
        if (!capability) {
          throw new Error(`Cannot resolve callback ${callbackId}`);
        }
        delete this.callbackCapabilities[callbackId];
        if (data.callback === CallbackKind.DATA) {
          capability.resolve(data.data);
        } else if (data.callback === CallbackKind.ERROR) {
          capability.reject(wrapReason(data.reason));
        } else {
          throw new Error("Unexpected callback case");
        }
        return;
      }
      const action = this.actionHandler[data.action];
      if (!action) {
        throw new Error(`Unknown action from worker: ${data.action}`);
      }
      if (data.callbackId) {
        const cbSourceName = this.sourceName;
        const cbTargetName = data.sourceName;
        new Promise(function (resolve) {
          resolve(action(data.data));
        }).then(function (result) {
          comObj.postMessage({
            sourceName: cbSourceName,
            targetName: cbTargetName,
            callback: CallbackKind.DATA,
            callbackId: data.callbackId,
            data: result
          });
        }, function (reason) {
          comObj.postMessage({
            sourceName: cbSourceName,
            targetName: cbTargetName,
            callback: CallbackKind.ERROR,
            callbackId: data.callbackId,
            reason: wrapReason(reason)
          });
        });
        return;
      }
      if (data.streamId) {
        this.#createStreamSink(data);
        return;
      }
      action(data.data);
    };
    comObj.addEventListener("message", this._onComObjOnMessage);
  }
  on(actionName, handler) {
    const ah = this.actionHandler;
    if (ah[actionName]) {
      throw new Error(`There is already an actionName called "${actionName}"`);
    }
    ah[actionName] = handler;
  }
  send(actionName, data, transfers) {
    this.comObj.postMessage({
      sourceName: this.sourceName,
      targetName: this.targetName,
      action: actionName,
      data
    }, transfers);
  }
  sendWithPromise(actionName, data, transfers) {
    const callbackId = this.callbackId++;
    const capability = new _util.PromiseCapability();
    this.callbackCapabilities[callbackId] = capability;
    try {
      this.comObj.postMessage({
        sourceName: this.sourceName,
        targetName: this.targetName,
        action: actionName,
        callbackId,
        data
      }, transfers);
    } catch (ex) {
      capability.reject(ex);
    }
    return capability.promise;
  }
  sendWithStream(actionName, data, queueingStrategy, transfers) {
    const streamId = this.streamId++,
      sourceName = this.sourceName,
      targetName = this.targetName,
      comObj = this.comObj;
    return new ReadableStream({
      start: controller => {
        const startCapability = new _util.PromiseCapability();
        this.streamControllers[streamId] = {
          controller,
          startCall: startCapability,
          pullCall: null,
          cancelCall: null,
          isClosed: false
        };
        comObj.postMessage({
          sourceName,
          targetName,
          action: actionName,
          streamId,
          data,
          desiredSize: controller.desiredSize
        }, transfers);
        return startCapability.promise;
      },
      pull: controller => {
        const pullCapability = new _util.PromiseCapability();
        this.streamControllers[streamId].pullCall = pullCapability;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.PULL,
          streamId,
          desiredSize: controller.desiredSize
        });
        return pullCapability.promise;
      },
      cancel: reason => {
        (0, _util.assert)(reason instanceof Error, "cancel must have a valid reason");
        const cancelCapability = new _util.PromiseCapability();
        this.streamControllers[streamId].cancelCall = cancelCapability;
        this.streamControllers[streamId].isClosed = true;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.CANCEL,
          streamId,
          reason: wrapReason(reason)
        });
        return cancelCapability.promise;
      }
    }, queueingStrategy);
  }
  #createStreamSink(data) {
    const streamId = data.streamId,
      sourceName = this.sourceName,
      targetName = data.sourceName,
      comObj = this.comObj;
    const self = this,
      action = this.actionHandler[data.action];
    const streamSink = {
      enqueue(chunk, size = 1, transfers) {
        if (this.isCancelled) {
          return;
        }
        const lastDesiredSize = this.desiredSize;
        this.desiredSize -= size;
        if (lastDesiredSize > 0 && this.desiredSize <= 0) {
          this.sinkCapability = new _util.PromiseCapability();
          this.ready = this.sinkCapability.promise;
        }
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.ENQUEUE,
          streamId,
          chunk
        }, transfers);
      },
      close() {
        if (this.isCancelled) {
          return;
        }
        this.isCancelled = true;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.CLOSE,
          streamId
        });
        delete self.streamSinks[streamId];
      },
      error(reason) {
        (0, _util.assert)(reason instanceof Error, "error must have a valid reason");
        if (this.isCancelled) {
          return;
        }
        this.isCancelled = true;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.ERROR,
          streamId,
          reason: wrapReason(reason)
        });
      },
      sinkCapability: new _util.PromiseCapability(),
      onPull: null,
      onCancel: null,
      isCancelled: false,
      desiredSize: data.desiredSize,
      ready: null
    };
    streamSink.sinkCapability.resolve();
    streamSink.ready = streamSink.sinkCapability.promise;
    this.streamSinks[streamId] = streamSink;
    new Promise(function (resolve) {
      resolve(action(data.data, streamSink));
    }).then(function () {
      comObj.postMessage({
        sourceName,
        targetName,
        stream: StreamKind.START_COMPLETE,
        streamId,
        success: true
      });
    }, function (reason) {
      comObj.postMessage({
        sourceName,
        targetName,
        stream: StreamKind.START_COMPLETE,
        streamId,
        reason: wrapReason(reason)
      });
    });
  }
  #processStreamMessage(data) {
    const streamId = data.streamId,
      sourceName = this.sourceName,
      targetName = data.sourceName,
      comObj = this.comObj;
    const streamController = this.streamControllers[streamId],
      streamSink = this.streamSinks[streamId];
    switch (data.stream) {
      case StreamKind.START_COMPLETE:
        if (data.success) {
          streamController.startCall.resolve();
        } else {
          streamController.startCall.reject(wrapReason(data.reason));
        }
        break;
      case StreamKind.PULL_COMPLETE:
        if (data.success) {
          streamController.pullCall.resolve();
        } else {
          streamController.pullCall.reject(wrapReason(data.reason));
        }
        break;
      case StreamKind.PULL:
        if (!streamSink) {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.PULL_COMPLETE,
            streamId,
            success: true
          });
          break;
        }
        if (streamSink.desiredSize <= 0 && data.desiredSize > 0) {
          streamSink.sinkCapability.resolve();
        }
        streamSink.desiredSize = data.desiredSize;
        new Promise(function (resolve) {
          resolve(streamSink.onPull?.());
        }).then(function () {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.PULL_COMPLETE,
            streamId,
            success: true
          });
        }, function (reason) {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.PULL_COMPLETE,
            streamId,
            reason: wrapReason(reason)
          });
        });
        break;
      case StreamKind.ENQUEUE:
        (0, _util.assert)(streamController, "enqueue should have stream controller");
        if (streamController.isClosed) {
          break;
        }
        streamController.controller.enqueue(data.chunk);
        break;
      case StreamKind.CLOSE:
        (0, _util.assert)(streamController, "close should have stream controller");
        if (streamController.isClosed) {
          break;
        }
        streamController.isClosed = true;
        streamController.controller.close();
        this.#deleteStreamController(streamController, streamId);
        break;
      case StreamKind.ERROR:
        (0, _util.assert)(streamController, "error should have stream controller");
        streamController.controller.error(wrapReason(data.reason));
        this.#deleteStreamController(streamController, streamId);
        break;
      case StreamKind.CANCEL_COMPLETE:
        if (data.success) {
          streamController.cancelCall.resolve();
        } else {
          streamController.cancelCall.reject(wrapReason(data.reason));
        }
        this.#deleteStreamController(streamController, streamId);
        break;
      case StreamKind.CANCEL:
        if (!streamSink) {
          break;
        }
        new Promise(function (resolve) {
          resolve(streamSink.onCancel?.(wrapReason(data.reason)));
        }).then(function () {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.CANCEL_COMPLETE,
            streamId,
            success: true
          });
        }, function (reason) {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.CANCEL_COMPLETE,
            streamId,
            reason: wrapReason(reason)
          });
        });
        streamSink.sinkCapability.reject(wrapReason(data.reason));
        streamSink.isCancelled = true;
        delete this.streamSinks[streamId];
        break;
      default:
        throw new Error("Unexpected stream case");
    }
  }
  async #deleteStreamController(streamController, streamId) {
    await Promise.allSettled([streamController.startCall?.promise, streamController.pullCall?.promise, streamController.cancelCall?.promise]);
    delete this.streamControllers[streamId];
  }
  destroy() {
    this.comObj.removeEventListener("message", this._onComObjOnMessage);
  }
}
exports.MessageHandler = MessageHandler;

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Metadata = void 0;
var _util = __w_pdfjs_require__(1);
class Metadata {
  #metadataMap;
  #data;
  constructor({
    parsedData,
    rawData
  }) {
    this.#metadataMap = parsedData;
    this.#data = rawData;
  }
  getRaw() {
    return this.#data;
  }
  get(name) {
    return this.#metadataMap.get(name) ?? null;
  }
  getAll() {
    return (0, _util.objectFromMap)(this.#metadataMap);
  }
  has(name) {
    return this.#metadataMap.has(name);
  }
}
exports.Metadata = Metadata;

/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.OptionalContentConfig = void 0;
var _util = __w_pdfjs_require__(1);
var _murmurhash = __w_pdfjs_require__(8);
const INTERNAL = Symbol("INTERNAL");
class OptionalContentGroup {
  #visible = true;
  constructor(name, intent) {
    this.name = name;
    this.intent = intent;
  }
  get visible() {
    return this.#visible;
  }
  _setVisible(internal, visible) {
    if (internal !== INTERNAL) {
      (0, _util.unreachable)("Internal method `_setVisible` called.");
    }
    this.#visible = visible;
  }
}
class OptionalContentConfig {
  #cachedGetHash = null;
  #groups = new Map();
  #initialHash = null;
  #order = null;
  constructor(data) {
    this.name = null;
    this.creator = null;
    if (data === null) {
      return;
    }
    this.name = data.name;
    this.creator = data.creator;
    this.#order = data.order;
    for (const group of data.groups) {
      this.#groups.set(group.id, new OptionalContentGroup(group.name, group.intent));
    }
    if (data.baseState === "OFF") {
      for (const group of this.#groups.values()) {
        group._setVisible(INTERNAL, false);
      }
    }
    for (const on of data.on) {
      this.#groups.get(on)._setVisible(INTERNAL, true);
    }
    for (const off of data.off) {
      this.#groups.get(off)._setVisible(INTERNAL, false);
    }
    this.#initialHash = this.getHash();
  }
  #evaluateVisibilityExpression(array) {
    const length = array.length;
    if (length < 2) {
      return true;
    }
    const operator = array[0];
    for (let i = 1; i < length; i++) {
      const element = array[i];
      let state;
      if (Array.isArray(element)) {
        state = this.#evaluateVisibilityExpression(element);
      } else if (this.#groups.has(element)) {
        state = this.#groups.get(element).visible;
      } else {
        (0, _util.warn)(`Optional content group not found: ${element}`);
        return true;
      }
      switch (operator) {
        case "And":
          if (!state) {
            return false;
          }
          break;
        case "Or":
          if (state) {
            return true;
          }
          break;
        case "Not":
          return !state;
        default:
          return true;
      }
    }
    return operator === "And";
  }
  isVisible(group) {
    if (this.#groups.size === 0) {
      return true;
    }
    if (!group) {
      (0, _util.warn)("Optional content group not defined.");
      return true;
    }
    if (group.type === "OCG") {
      if (!this.#groups.has(group.id)) {
        (0, _util.warn)(`Optional content group not found: ${group.id}`);
        return true;
      }
      return this.#groups.get(group.id).visible;
    } else if (group.type === "OCMD") {
      if (group.expression) {
        return this.#evaluateVisibilityExpression(group.expression);
      }
      if (!group.policy || group.policy === "AnyOn") {
        for (const id of group.ids) {
          if (!this.#groups.has(id)) {
            (0, _util.warn)(`Optional content group not found: ${id}`);
            return true;
          }
          if (this.#groups.get(id).visible) {
            return true;
          }
        }
        return false;
      } else if (group.policy === "AllOn") {
        for (const id of group.ids) {
          if (!this.#groups.has(id)) {
            (0, _util.warn)(`Optional content group not found: ${id}`);
            return true;
          }
          if (!this.#groups.get(id).visible) {
            return false;
          }
        }
        return true;
      } else if (group.policy === "AnyOff") {
        for (const id of group.ids) {
          if (!this.#groups.has(id)) {
            (0, _util.warn)(`Optional content group not found: ${id}`);
            return true;
          }
          if (!this.#groups.get(id).visible) {
            return true;
          }
        }
        return false;
      } else if (group.policy === "AllOff") {
        for (const id of group.ids) {
          if (!this.#groups.has(id)) {
            (0, _util.warn)(`Optional content group not found: ${id}`);
            return true;
          }
          if (this.#groups.get(id).visible) {
            return false;
          }
        }
        return true;
      }
      (0, _util.warn)(`Unknown optional content policy ${group.policy}.`);
      return true;
    }
    (0, _util.warn)(`Unknown group type ${group.type}.`);
    return true;
  }
  setVisibility(id, visible = true) {
    if (!this.#groups.has(id)) {
      (0, _util.warn)(`Optional content group not found: ${id}`);
      return;
    }
    this.#groups.get(id)._setVisible(INTERNAL, !!visible);
    this.#cachedGetHash = null;
  }
  get hasInitialVisibility() {
    return this.#initialHash === null || this.getHash() === this.#initialHash;
  }
  getOrder() {
    if (!this.#groups.size) {
      return null;
    }
    if (this.#order) {
      return this.#order.slice();
    }
    return [...this.#groups.keys()];
  }
  getGroups() {
    return this.#groups.size > 0 ? (0, _util.objectFromMap)(this.#groups) : null;
  }
  getGroup(id) {
    return this.#groups.get(id) || null;
  }
  getHash() {
    if (this.#cachedGetHash !== null) {
      return this.#cachedGetHash;
    }
    const hash = new _murmurhash.MurmurHash3_64();
    for (const [id, group] of this.#groups) {
      hash.update(`${id}:${group.visible}`);
    }
    return this.#cachedGetHash = hash.hexdigest();
  }
}
exports.OptionalContentConfig = OptionalContentConfig;

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PDFDataTransportStream = void 0;
var _util = __w_pdfjs_require__(1);
var _display_utils = __w_pdfjs_require__(6);
class PDFDataTransportStream {
  constructor({
    length,
    initialData,
    progressiveDone = false,
    contentDispositionFilename = null,
    disableRange = false,
    disableStream = false
  }, pdfDataRangeTransport) {
    (0, _util.assert)(pdfDataRangeTransport, 'PDFDataTransportStream - missing required "pdfDataRangeTransport" argument.');
    this._queuedChunks = [];
    this._progressiveDone = progressiveDone;
    this._contentDispositionFilename = contentDispositionFilename;
    if (initialData?.length > 0) {
      const buffer = initialData instanceof Uint8Array && initialData.byteLength === initialData.buffer.byteLength ? initialData.buffer : new Uint8Array(initialData).buffer;
      this._queuedChunks.push(buffer);
    }
    this._pdfDataRangeTransport = pdfDataRangeTransport;
    this._isStreamingSupported = !disableStream;
    this._isRangeSupported = !disableRange;
    this._contentLength = length;
    this._fullRequestReader = null;
    this._rangeReaders = [];
    this._pdfDataRangeTransport.addRangeListener((begin, chunk) => {
      this._onReceiveData({
        begin,
        chunk
      });
    });
    this._pdfDataRangeTransport.addProgressListener((loaded, total) => {
      this._onProgress({
        loaded,
        total
      });
    });
    this._pdfDataRangeTransport.addProgressiveReadListener(chunk => {
      this._onReceiveData({
        chunk
      });
    });
    this._pdfDataRangeTransport.addProgressiveDoneListener(() => {
      this._onProgressiveDone();
    });
    this._pdfDataRangeTransport.transportReady();
  }
  _onReceiveData({
    begin,
    chunk
  }) {
    const buffer = chunk instanceof Uint8Array && chunk.byteLength === chunk.buffer.byteLength ? chunk.buffer : new Uint8Array(chunk).buffer;
    if (begin === undefined) {
      if (this._fullRequestReader) {
        this._fullRequestReader._enqueue(buffer);
      } else {
        this._queuedChunks.push(buffer);
      }
    } else {
      const found = this._rangeReaders.some(function (rangeReader) {
        if (rangeReader._begin !== begin) {
          return false;
        }
        rangeReader._enqueue(buffer);
        return true;
      });
      (0, _util.assert)(found, "_onReceiveData - no `PDFDataTransportStreamRangeReader` instance found.");
    }
  }
  get _progressiveDataLength() {
    return this._fullRequestReader?._loaded ?? 0;
  }
  _onProgress(evt) {
    if (evt.total === undefined) {
      this._rangeReaders[0]?.onProgress?.({
        loaded: evt.loaded
      });
    } else {
      this._fullRequestReader?.onProgress?.({
        loaded: evt.loaded,
        total: evt.total
      });
    }
  }
  _onProgressiveDone() {
    this._fullRequestReader?.progressiveDone();
    this._progressiveDone = true;
  }
  _removeRangeReader(reader) {
    const i = this._rangeReaders.indexOf(reader);
    if (i >= 0) {
      this._rangeReaders.splice(i, 1);
    }
  }
  getFullReader() {
    (0, _util.assert)(!this._fullRequestReader, "PDFDataTransportStream.getFullReader can only be called once.");
    const queuedChunks = this._queuedChunks;
    this._queuedChunks = null;
    return new PDFDataTransportStreamReader(this, queuedChunks, this._progressiveDone, this._contentDispositionFilename);
  }
  getRangeReader(begin, end) {
    if (end <= this._progressiveDataLength) {
      return null;
    }
    const reader = new PDFDataTransportStreamRangeReader(this, begin, end);
    this._pdfDataRangeTransport.requestDataRange(begin, end);
    this._rangeReaders.push(reader);
    return reader;
  }
  cancelAllRequests(reason) {
    this._fullRequestReader?.cancel(reason);
    for (const reader of this._rangeReaders.slice(0)) {
      reader.cancel(reason);
    }
    this._pdfDataRangeTransport.abort();
  }
}
exports.PDFDataTransportStream = PDFDataTransportStream;
class PDFDataTransportStreamReader {
  constructor(stream, queuedChunks, progressiveDone = false, contentDispositionFilename = null) {
    this._stream = stream;
    this._done = progressiveDone || false;
    this._filename = (0, _display_utils.isPdfFile)(contentDispositionFilename) ? contentDispositionFilename : null;
    this._queuedChunks = queuedChunks || [];
    this._loaded = 0;
    for (const chunk of this._queuedChunks) {
      this._loaded += chunk.byteLength;
    }
    this._requests = [];
    this._headersReady = Promise.resolve();
    stream._fullRequestReader = this;
    this.onProgress = null;
  }
  _enqueue(chunk) {
    if (this._done) {
      return;
    }
    if (this._requests.length > 0) {
      const requestCapability = this._requests.shift();
      requestCapability.resolve({
        value: chunk,
        done: false
      });
    } else {
      this._queuedChunks.push(chunk);
    }
    this._loaded += chunk.byteLength;
  }
  get headersReady() {
    return this._headersReady;
  }
  get filename() {
    return this._filename;
  }
  get isRangeSupported() {
    return this._stream._isRangeSupported;
  }
  get isStreamingSupported() {
    return this._stream._isStreamingSupported;
  }
  get contentLength() {
    return this._stream._contentLength;
  }
  async read() {
    if (this._queuedChunks.length > 0) {
      const chunk = this._queuedChunks.shift();
      return {
        value: chunk,
        done: false
      };
    }
    if (this._done) {
      return {
        value: undefined,
        done: true
      };
    }
    const requestCapability = new _util.PromiseCapability();
    this._requests.push(requestCapability);
    return requestCapability.promise;
  }
  cancel(reason) {
    this._done = true;
    for (const requestCapability of this._requests) {
      requestCapability.resolve({
        value: undefined,
        done: true
      });
    }
    this._requests.length = 0;
  }
  progressiveDone() {
    if (this._done) {
      return;
    }
    this._done = true;
  }
}
class PDFDataTransportStreamRangeReader {
  constructor(stream, begin, end) {
    this._stream = stream;
    this._begin = begin;
    this._end = end;
    this._queuedChunk = null;
    this._requests = [];
    this._done = false;
    this.onProgress = null;
  }
  _enqueue(chunk) {
    if (this._done) {
      return;
    }
    if (this._requests.length === 0) {
      this._queuedChunk = chunk;
    } else {
      const requestsCapability = this._requests.shift();
      requestsCapability.resolve({
        value: chunk,
        done: false
      });
      for (const requestCapability of this._requests) {
        requestCapability.resolve({
          value: undefined,
          done: true
        });
      }
      this._requests.length = 0;
    }
    this._done = true;
    this._stream._removeRangeReader(this);
  }
  get isStreamingSupported() {
    return false;
  }
  async read() {
    if (this._queuedChunk) {
      const chunk = this._queuedChunk;
      this._queuedChunk = null;
      return {
        value: chunk,
        done: false
      };
    }
    if (this._done) {
      return {
        value: undefined,
        done: true
      };
    }
    const requestCapability = new _util.PromiseCapability();
    this._requests.push(requestCapability);
    return requestCapability.promise;
  }
  cancel(reason) {
    this._done = true;
    for (const requestCapability of this._requests) {
      requestCapability.resolve({
        value: undefined,
        done: true
      });
    }
    this._requests.length = 0;
    this._stream._removeRangeReader(this);
  }
}

/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PDFFetchStream = void 0;
var _util = __w_pdfjs_require__(1);
var _network_utils = __w_pdfjs_require__(20);
;
function createFetchOptions(headers, withCredentials, abortController) {
  return {
    method: "GET",
    headers,
    signal: abortController.signal,
    mode: "cors",
    credentials: withCredentials ? "include" : "same-origin",
    redirect: "follow"
  };
}
function createHeaders(httpHeaders) {
  const headers = new Headers();
  for (const property in httpHeaders) {
    const value = httpHeaders[property];
    if (value === undefined) {
      continue;
    }
    headers.append(property, value);
  }
  return headers;
}
function getArrayBuffer(val) {
  if (val instanceof Uint8Array) {
    return val.buffer;
  }
  if (val instanceof ArrayBuffer) {
    return val;
  }
  (0, _util.warn)(`getArrayBuffer - unexpected data format: ${val}`);
  return new Uint8Array(val).buffer;
}
class PDFFetchStream {
  constructor(source) {
    this.source = source;
    this.isHttp = /^https?:/i.test(source.url);
    this.httpHeaders = this.isHttp && source.httpHeaders || {};
    this._fullRequestReader = null;
    this._rangeRequestReaders = [];
  }
  get _progressiveDataLength() {
    return this._fullRequestReader?._loaded ?? 0;
  }
  getFullReader() {
    (0, _util.assert)(!this._fullRequestReader, "PDFFetchStream.getFullReader can only be called once.");
    this._fullRequestReader = new PDFFetchStreamReader(this);
    return this._fullRequestReader;
  }
  getRangeReader(begin, end) {
    if (end <= this._progressiveDataLength) {
      return null;
    }
    const reader = new PDFFetchStreamRangeReader(this, begin, end);
    this._rangeRequestReaders.push(reader);
    return reader;
  }
  cancelAllRequests(reason) {
    this._fullRequestReader?.cancel(reason);
    for (const reader of this._rangeRequestReaders.slice(0)) {
      reader.cancel(reason);
    }
  }
}
exports.PDFFetchStream = PDFFetchStream;
class PDFFetchStreamReader {
  constructor(stream) {
    this._stream = stream;
    this._reader = null;
    this._loaded = 0;
    this._filename = null;
    const source = stream.source;
    this._withCredentials = source.withCredentials || false;
    this._contentLength = source.length;
    this._headersCapability = new _util.PromiseCapability();
    this._disableRange = source.disableRange || false;
    this._rangeChunkSize = source.rangeChunkSize;
    if (!this._rangeChunkSize && !this._disableRange) {
      this._disableRange = true;
    }
    this._abortController = new AbortController();
    this._isStreamingSupported = !source.disableStream;
    this._isRangeSupported = !source.disableRange;
    this._headers = createHeaders(this._stream.httpHeaders);
    const url = source.url;
    fetch(url, createFetchOptions(this._headers, this._withCredentials, this._abortController)).then(response => {
      if (!(0, _network_utils.validateResponseStatus)(response.status)) {
        throw (0, _network_utils.createResponseStatusError)(response.status, url);
      }
      this._reader = response.body.getReader();
      this._headersCapability.resolve();
      const getResponseHeader = name => {
        return response.headers.get(name);
      };
      const {
        allowRangeRequests,
        suggestedLength
      } = (0, _network_utils.validateRangeRequestCapabilities)({
        getResponseHeader,
        isHttp: this._stream.isHttp,
        rangeChunkSize: this._rangeChunkSize,
        disableRange: this._disableRange
      });
      this._isRangeSupported = allowRangeRequests;
      this._contentLength = suggestedLength || this._contentLength;
      this._filename = (0, _network_utils.extractFilenameFromHeader)(getResponseHeader);
      if (!this._isStreamingSupported && this._isRangeSupported) {
        this.cancel(new _util.AbortException("Streaming is disabled."));
      }
    }).catch(this._headersCapability.reject);
    this.onProgress = null;
  }
  get headersReady() {
    return this._headersCapability.promise;
  }
  get filename() {
    return this._filename;
  }
  get contentLength() {
    return this._contentLength;
  }
  get isRangeSupported() {
    return this._isRangeSupported;
  }
  get isStreamingSupported() {
    return this._isStreamingSupported;
  }
  async read() {
    await this._headersCapability.promise;
    const {
      value,
      done
    } = await this._reader.read();
    if (done) {
      return {
        value,
        done
      };
    }
    this._loaded += value.byteLength;
    this.onProgress?.({
      loaded: this._loaded,
      total: this._contentLength
    });
    return {
      value: getArrayBuffer(value),
      done: false
    };
  }
  cancel(reason) {
    this._reader?.cancel(reason);
    this._abortController.abort();
  }
}
class PDFFetchStreamRangeReader {
  constructor(stream, begin, end) {
    this._stream = stream;
    this._reader = null;
    this._loaded = 0;
    const source = stream.source;
    this._withCredentials = source.withCredentials || false;
    this._readCapability = new _util.PromiseCapability();
    this._isStreamingSupported = !source.disableStream;
    this._abortController = new AbortController();
    this._headers = createHeaders(this._stream.httpHeaders);
    this._headers.append("Range", `bytes=${begin}-${end - 1}`);
    const url = source.url;
    fetch(url, createFetchOptions(this._headers, this._withCredentials, this._abortController)).then(response => {
      if (!(0, _network_utils.validateResponseStatus)(response.status)) {
        throw (0, _network_utils.createResponseStatusError)(response.status, url);
      }
      this._readCapability.resolve();
      this._reader = response.body.getReader();
    }).catch(this._readCapability.reject);
    this.onProgress = null;
  }
  get isStreamingSupported() {
    return this._isStreamingSupported;
  }
  async read() {
    await this._readCapability.promise;
    const {
      value,
      done
    } = await this._reader.read();
    if (done) {
      return {
        value,
        done
      };
    }
    this._loaded += value.byteLength;
    this.onProgress?.({
      loaded: this._loaded
    });
    return {
      value: getArrayBuffer(value),
      done: false
    };
  }
  cancel(reason) {
    this._reader?.cancel(reason);
    this._abortController.abort();
  }
}

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.createResponseStatusError = createResponseStatusError;
exports.extractFilenameFromHeader = extractFilenameFromHeader;
exports.validateRangeRequestCapabilities = validateRangeRequestCapabilities;
exports.validateResponseStatus = validateResponseStatus;
var _util = __w_pdfjs_require__(1);
var _content_disposition = __w_pdfjs_require__(21);
var _display_utils = __w_pdfjs_require__(6);
function validateRangeRequestCapabilities({
  getResponseHeader,
  isHttp,
  rangeChunkSize,
  disableRange
}) {
  const returnValues = {
    allowRangeRequests: false,
    suggestedLength: undefined
  };
  const length = parseInt(getResponseHeader("Content-Length"), 10);
  if (!Number.isInteger(length)) {
    return returnValues;
  }
  returnValues.suggestedLength = length;
  if (length <= 2 * rangeChunkSize) {
    return returnValues;
  }
  if (disableRange || !isHttp) {
    return returnValues;
  }
  if (getResponseHeader("Accept-Ranges") !== "bytes") {
    return returnValues;
  }
  const contentEncoding = getResponseHeader("Content-Encoding") || "identity";
  if (contentEncoding !== "identity") {
    return returnValues;
  }
  returnValues.allowRangeRequests = true;
  return returnValues;
}
function extractFilenameFromHeader(getResponseHeader) {
  const contentDisposition = getResponseHeader("Content-Disposition");
  if (contentDisposition) {
    let filename = (0, _content_disposition.getFilenameFromContentDispositionHeader)(contentDisposition);
    if (filename.includes("%")) {
      try {
        filename = decodeURIComponent(filename);
      } catch {}
    }
    if ((0, _display_utils.isPdfFile)(filename)) {
      return filename;
    }
  }
  return null;
}
function createResponseStatusError(status, url) {
  if (status === 404 || status === 0 && url.startsWith("file:")) {
    return new _util.MissingPDFException('Missing PDF "' + url + '".');
  }
  return new _util.UnexpectedResponseException(`Unexpected server response (${status}) while retrieving PDF "${url}".`, status);
}
function validateResponseStatus(status) {
  return status === 200 || status === 206;
}

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getFilenameFromContentDispositionHeader = getFilenameFromContentDispositionHeader;
var _util = __w_pdfjs_require__(1);
function getFilenameFromContentDispositionHeader(contentDisposition) {
  let needsEncodingFixup = true;
  let tmp = toParamRegExp("filename\\*", "i").exec(contentDisposition);
  if (tmp) {
    tmp = tmp[1];
    let filename = rfc2616unquote(tmp);
    filename = unescape(filename);
    filename = rfc5987decode(filename);
    filename = rfc2047decode(filename);
    return fixupEncoding(filename);
  }
  tmp = rfc2231getparam(contentDisposition);
  if (tmp) {
    const filename = rfc2047decode(tmp);
    return fixupEncoding(filename);
  }
  tmp = toParamRegExp("filename", "i").exec(contentDisposition);
  if (tmp) {
    tmp = tmp[1];
    let filename = rfc2616unquote(tmp);
    filename = rfc2047decode(filename);
    return fixupEncoding(filename);
  }
  function toParamRegExp(attributePattern, flags) {
    return new RegExp("(?:^|;)\\s*" + attributePattern + "\\s*=\\s*" + "(" + '[^";\\s][^;\\s]*' + "|" + '"(?:[^"\\\\]|\\\\"?)+"?' + ")", flags);
  }
  function textdecode(encoding, value) {
    if (encoding) {
      if (!/^[\x00-\xFF]+$/.test(value)) {
        return value;
      }
      try {
        const decoder = new TextDecoder(encoding, {
          fatal: true
        });
        const buffer = (0, _util.stringToBytes)(value);
        value = decoder.decode(buffer);
        needsEncodingFixup = false;
      } catch {}
    }
    return value;
  }
  function fixupEncoding(value) {
    if (needsEncodingFixup && /[\x80-\xff]/.test(value)) {
      value = textdecode("utf-8", value);
      if (needsEncodingFixup) {
        value = textdecode("iso-8859-1", value);
      }
    }
    return value;
  }
  function rfc2231getparam(contentDispositionStr) {
    const matches = [];
    let match;
    const iter = toParamRegExp("filename\\*((?!0\\d)\\d+)(\\*?)", "ig");
    while ((match = iter.exec(contentDispositionStr)) !== null) {
      let [, n, quot, part] = match;
      n = parseInt(n, 10);
      if (n in matches) {
        if (n === 0) {
          break;
        }
        continue;
      }
      matches[n] = [quot, part];
    }
    const parts = [];
    for (let n = 0; n < matches.length; ++n) {
      if (!(n in matches)) {
        break;
      }
      let [quot, part] = matches[n];
      part = rfc2616unquote(part);
      if (quot) {
        part = unescape(part);
        if (n === 0) {
          part = rfc5987decode(part);
        }
      }
      parts.push(part);
    }
    return parts.join("");
  }
  function rfc2616unquote(value) {
    if (value.startsWith('"')) {
      const parts = value.slice(1).split('\\"');
      for (let i = 0; i < parts.length; ++i) {
        const quotindex = parts[i].indexOf('"');
        if (quotindex !== -1) {
          parts[i] = parts[i].slice(0, quotindex);
          parts.length = i + 1;
        }
        parts[i] = parts[i].replaceAll(/\\(.)/g, "$1");
      }
      value = parts.join('"');
    }
    return value;
  }
  function rfc5987decode(extvalue) {
    const encodingend = extvalue.indexOf("'");
    if (encodingend === -1) {
      return extvalue;
    }
    const encoding = extvalue.slice(0, encodingend);
    const langvalue = extvalue.slice(encodingend + 1);
    const value = langvalue.replace(/^[^']*'/, "");
    return textdecode(encoding, value);
  }
  function rfc2047decode(value) {
    if (!value.startsWith("=?") || /[\x00-\x19\x80-\xff]/.test(value)) {
      return value;
    }
    return value.replaceAll(/=\?([\w-]*)\?([QqBb])\?((?:[^?]|\?(?!=))*)\?=/g, function (matches, charset, encoding, text) {
      if (encoding === "q" || encoding === "Q") {
        text = text.replaceAll("_", " ");
        text = text.replaceAll(/=([0-9a-fA-F]{2})/g, function (match, hex) {
          return String.fromCharCode(parseInt(hex, 16));
        });
        return textdecode(charset, text);
      }
      try {
        text = atob(text);
      } catch {}
      return textdecode(charset, text);
    });
  }
  return "";
}

/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PDFNetworkStream = void 0;
var _util = __w_pdfjs_require__(1);
var _network_utils = __w_pdfjs_require__(20);
;
const OK_RESPONSE = 200;
const PARTIAL_CONTENT_RESPONSE = 206;
function getArrayBuffer(xhr) {
  const data = xhr.response;
  if (typeof data !== "string") {
    return data;
  }
  return (0, _util.stringToBytes)(data).buffer;
}
class NetworkManager {
  constructor(url, args = {}) {
    this.url = url;
    this.isHttp = /^https?:/i.test(url);
    this.httpHeaders = this.isHttp && args.httpHeaders || Object.create(null);
    this.withCredentials = args.withCredentials || false;
    this.currXhrId = 0;
    this.pendingRequests = Object.create(null);
  }
  requestRange(begin, end, listeners) {
    const args = {
      begin,
      end
    };
    for (const prop in listeners) {
      args[prop] = listeners[prop];
    }
    return this.request(args);
  }
  requestFull(listeners) {
    return this.request(listeners);
  }
  request(args) {
    const xhr = new XMLHttpRequest();
    const xhrId = this.currXhrId++;
    const pendingRequest = this.pendingRequests[xhrId] = {
      xhr
    };
    xhr.open("GET", this.url);
    xhr.withCredentials = this.withCredentials;
    for (const property in this.httpHeaders) {
      const value = this.httpHeaders[property];
      if (value === undefined) {
        continue;
      }
      xhr.setRequestHeader(property, value);
    }
    if (this.isHttp && "begin" in args && "end" in args) {
      xhr.setRequestHeader("Range", `bytes=${args.begin}-${args.end - 1}`);
      pendingRequest.expectedStatus = PARTIAL_CONTENT_RESPONSE;
    } else {
      pendingRequest.expectedStatus = OK_RESPONSE;
    }
    xhr.responseType = "arraybuffer";
    if (args.onError) {
      xhr.onerror = function (evt) {
        args.onError(xhr.status);
      };
    }
    xhr.onreadystatechange = this.onStateChange.bind(this, xhrId);
    xhr.onprogress = this.onProgress.bind(this, xhrId);
    pendingRequest.onHeadersReceived = args.onHeadersReceived;
    pendingRequest.onDone = args.onDone;
    pendingRequest.onError = args.onError;
    pendingRequest.onProgress = args.onProgress;
    xhr.send(null);
    return xhrId;
  }
  onProgress(xhrId, evt) {
    const pendingRequest = this.pendingRequests[xhrId];
    if (!pendingRequest) {
      return;
    }
    pendingRequest.onProgress?.(evt);
  }
  onStateChange(xhrId, evt) {
    const pendingRequest = this.pendingRequests[xhrId];
    if (!pendingRequest) {
      return;
    }
    const xhr = pendingRequest.xhr;
    if (xhr.readyState >= 2 && pendingRequest.onHeadersReceived) {
      pendingRequest.onHeadersReceived();
      delete pendingRequest.onHeadersReceived;
    }
    if (xhr.readyState !== 4) {
      return;
    }
    if (!(xhrId in this.pendingRequests)) {
      return;
    }
    delete this.pendingRequests[xhrId];
    if (xhr.status === 0 && this.isHttp) {
      pendingRequest.onError?.(xhr.status);
      return;
    }
    const xhrStatus = xhr.status || OK_RESPONSE;
    const ok_response_on_range_request = xhrStatus === OK_RESPONSE && pendingRequest.expectedStatus === PARTIAL_CONTENT_RESPONSE;
    if (!ok_response_on_range_request && xhrStatus !== pendingRequest.expectedStatus) {
      pendingRequest.onError?.(xhr.status);
      return;
    }
    const chunk = getArrayBuffer(xhr);
    if (xhrStatus === PARTIAL_CONTENT_RESPONSE) {
      const rangeHeader = xhr.getResponseHeader("Content-Range");
      const matches = /bytes (\d+)-(\d+)\/(\d+)/.exec(rangeHeader);
      pendingRequest.onDone({
        begin: parseInt(matches[1], 10),
        chunk
      });
    } else if (chunk) {
      pendingRequest.onDone({
        begin: 0,
        chunk
      });
    } else {
      pendingRequest.onError?.(xhr.status);
    }
  }
  getRequestXhr(xhrId) {
    return this.pendingRequests[xhrId].xhr;
  }
  isPendingRequest(xhrId) {
    return xhrId in this.pendingRequests;
  }
  abortRequest(xhrId) {
    const xhr = this.pendingRequests[xhrId].xhr;
    delete this.pendingRequests[xhrId];
    xhr.abort();
  }
}
class PDFNetworkStream {
  constructor(source) {
    this._source = source;
    this._manager = new NetworkManager(source.url, {
      httpHeaders: source.httpHeaders,
      withCredentials: source.withCredentials
    });
    this._rangeChunkSize = source.rangeChunkSize;
    this._fullRequestReader = null;
    this._rangeRequestReaders = [];
  }
  _onRangeRequestReaderClosed(reader) {
    const i = this._rangeRequestReaders.indexOf(reader);
    if (i >= 0) {
      this._rangeRequestReaders.splice(i, 1);
    }
  }
  getFullReader() {
    (0, _util.assert)(!this._fullRequestReader, "PDFNetworkStream.getFullReader can only be called once.");
    this._fullRequestReader = new PDFNetworkStreamFullRequestReader(this._manager, this._source);
    return this._fullRequestReader;
  }
  getRangeReader(begin, end) {
    const reader = new PDFNetworkStreamRangeRequestReader(this._manager, begin, end);
    reader.onClosed = this._onRangeRequestReaderClosed.bind(this);
    this._rangeRequestReaders.push(reader);
    return reader;
  }
  cancelAllRequests(reason) {
    this._fullRequestReader?.cancel(reason);
    for (const reader of this._rangeRequestReaders.slice(0)) {
      reader.cancel(reason);
    }
  }
}
exports.PDFNetworkStream = PDFNetworkStream;
class PDFNetworkStreamFullRequestReader {
  constructor(manager, source) {
    this._manager = manager;
    const args = {
      onHeadersReceived: this._onHeadersReceived.bind(this),
      onDone: this._onDone.bind(this),
      onError: this._onError.bind(this),
      onProgress: this._onProgress.bind(this)
    };
    this._url = source.url;
    this._fullRequestId = manager.requestFull(args);
    this._headersReceivedCapability = new _util.PromiseCapability();
    this._disableRange = source.disableRange || false;
    this._contentLength = source.length;
    this._rangeChunkSize = source.rangeChunkSize;
    if (!this._rangeChunkSize && !this._disableRange) {
      this._disableRange = true;
    }
    this._isStreamingSupported = false;
    this._isRangeSupported = false;
    this._cachedChunks = [];
    this._requests = [];
    this._done = false;
    this._storedError = undefined;
    this._filename = null;
    this.onProgress = null;
  }
  _onHeadersReceived() {
    const fullRequestXhrId = this._fullRequestId;
    const fullRequestXhr = this._manager.getRequestXhr(fullRequestXhrId);
    const getResponseHeader = name => {
      return fullRequestXhr.getResponseHeader(name);
    };
    const {
      allowRangeRequests,
      suggestedLength
    } = (0, _network_utils.validateRangeRequestCapabilities)({
      getResponseHeader,
      isHttp: this._manager.isHttp,
      rangeChunkSize: this._rangeChunkSize,
      disableRange: this._disableRange
    });
    if (allowRangeRequests) {
      this._isRangeSupported = true;
    }
    this._contentLength = suggestedLength || this._contentLength;
    this._filename = (0, _network_utils.extractFilenameFromHeader)(getResponseHeader);
    if (this._isRangeSupported) {
      this._manager.abortRequest(fullRequestXhrId);
    }
    this._headersReceivedCapability.resolve();
  }
  _onDone(data) {
    if (data) {
      if (this._requests.length > 0) {
        const requestCapability = this._requests.shift();
        requestCapability.resolve({
          value: data.chunk,
          done: false
        });
      } else {
        this._cachedChunks.push(data.chunk);
      }
    }
    this._done = true;
    if (this._cachedChunks.length > 0) {
      return;
    }
    for (const requestCapability of this._requests) {
      requestCapability.resolve({
        value: undefined,
        done: true
      });
    }
    this._requests.length = 0;
  }
  _onError(status) {
    this._storedError = (0, _network_utils.createResponseStatusError)(status, this._url);
    this._headersReceivedCapability.reject(this._storedError);
    for (const requestCapability of this._requests) {
      requestCapability.reject(this._storedError);
    }
    this._requests.length = 0;
    this._cachedChunks.length = 0;
  }
  _onProgress(evt) {
    this.onProgress?.({
      loaded: evt.loaded,
      total: evt.lengthComputable ? evt.total : this._contentLength
    });
  }
  get filename() {
    return this._filename;
  }
  get isRangeSupported() {
    return this._isRangeSupported;
  }
  get isStreamingSupported() {
    return this._isStreamingSupported;
  }
  get contentLength() {
    return this._contentLength;
  }
  get headersReady() {
    return this._headersReceivedCapability.promise;
  }
  async read() {
    if (this._storedError) {
      throw this._storedError;
    }
    if (this._cachedChunks.length > 0) {
      const chunk = this._cachedChunks.shift();
      return {
        value: chunk,
        done: false
      };
    }
    if (this._done) {
      return {
        value: undefined,
        done: true
      };
    }
    const requestCapability = new _util.PromiseCapability();
    this._requests.push(requestCapability);
    return requestCapability.promise;
  }
  cancel(reason) {
    this._done = true;
    this._headersReceivedCapability.reject(reason);
    for (const requestCapability of this._requests) {
      requestCapability.resolve({
        value: undefined,
        done: true
      });
    }
    this._requests.length = 0;
    if (this._manager.isPendingRequest(this._fullRequestId)) {
      this._manager.abortRequest(this._fullRequestId);
    }
    this._fullRequestReader = null;
  }
}
class PDFNetworkStreamRangeRequestReader {
  constructor(manager, begin, end) {
    this._manager = manager;
    const args = {
      onDone: this._onDone.bind(this),
      onError: this._onError.bind(this),
      onProgress: this._onProgress.bind(this)
    };
    this._url = manager.url;
    this._requestId = manager.requestRange(begin, end, args);
    this._requests = [];
    this._queuedChunk = null;
    this._done = false;
    this._storedError = undefined;
    this.onProgress = null;
    this.onClosed = null;
  }
  _close() {
    this.onClosed?.(this);
  }
  _onDone(data) {
    const chunk = data.chunk;
    if (this._requests.length > 0) {
      const requestCapability = this._requests.shift();
      requestCapability.resolve({
        value: chunk,
        done: false
      });
    } else {
      this._queuedChunk = chunk;
    }
    this._done = true;
    for (const requestCapability of this._requests) {
      requestCapability.resolve({
        value: undefined,
        done: true
      });
    }
    this._requests.length = 0;
    this._close();
  }
  _onError(status) {
    this._storedError = (0, _network_utils.createResponseStatusError)(status, this._url);
    for (const requestCapability of this._requests) {
      requestCapability.reject(this._storedError);
    }
    this._requests.length = 0;
    this._queuedChunk = null;
  }
  _onProgress(evt) {
    if (!this.isStreamingSupported) {
      this.onProgress?.({
        loaded: evt.loaded
      });
    }
  }
  get isStreamingSupported() {
    return false;
  }
  async read() {
    if (this._storedError) {
      throw this._storedError;
    }
    if (this._queuedChunk !== null) {
      const chunk = this._queuedChunk;
      this._queuedChunk = null;
      return {
        value: chunk,
        done: false
      };
    }
    if (this._done) {
      return {
        value: undefined,
        done: true
      };
    }
    const requestCapability = new _util.PromiseCapability();
    this._requests.push(requestCapability);
    return requestCapability.promise;
  }
  cancel(reason) {
    this._done = true;
    for (const requestCapability of this._requests) {
      requestCapability.resolve({
        value: undefined,
        done: true
      });
    }
    this._requests.length = 0;
    if (this._manager.isPendingRequest(this._requestId)) {
      this._manager.abortRequest(this._requestId);
    }
    this._close();
  }
}

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PDFNodeStream = void 0;
var _util = __w_pdfjs_require__(1);
var _network_utils = __w_pdfjs_require__(20);
;
const fileUriRegex = /^file:\/\/\/[a-zA-Z]:\//;
function parseUrl(sourceUrl) {
  const url = __webpack_require__(/*! url */ "?9f5f");
  const parsedUrl = url.parse(sourceUrl);
  if (parsedUrl.protocol === "file:" || parsedUrl.host) {
    return parsedUrl;
  }
  if (/^[a-z]:[/\\]/i.test(sourceUrl)) {
    return url.parse(`file:///${sourceUrl}`);
  }
  if (!parsedUrl.host) {
    parsedUrl.protocol = "file:";
  }
  return parsedUrl;
}
class PDFNodeStream {
  constructor(source) {
    this.source = source;
    this.url = parseUrl(source.url);
    this.isHttp = this.url.protocol === "http:" || this.url.protocol === "https:";
    this.isFsUrl = this.url.protocol === "file:";
    this.httpHeaders = this.isHttp && source.httpHeaders || {};
    this._fullRequestReader = null;
    this._rangeRequestReaders = [];
  }
  get _progressiveDataLength() {
    return this._fullRequestReader?._loaded ?? 0;
  }
  getFullReader() {
    (0, _util.assert)(!this._fullRequestReader, "PDFNodeStream.getFullReader can only be called once.");
    this._fullRequestReader = this.isFsUrl ? new PDFNodeStreamFsFullReader(this) : new PDFNodeStreamFullReader(this);
    return this._fullRequestReader;
  }
  getRangeReader(start, end) {
    if (end <= this._progressiveDataLength) {
      return null;
    }
    const rangeReader = this.isFsUrl ? new PDFNodeStreamFsRangeReader(this, start, end) : new PDFNodeStreamRangeReader(this, start, end);
    this._rangeRequestReaders.push(rangeReader);
    return rangeReader;
  }
  cancelAllRequests(reason) {
    this._fullRequestReader?.cancel(reason);
    for (const reader of this._rangeRequestReaders.slice(0)) {
      reader.cancel(reason);
    }
  }
}
exports.PDFNodeStream = PDFNodeStream;
class BaseFullReader {
  constructor(stream) {
    this._url = stream.url;
    this._done = false;
    this._storedError = null;
    this.onProgress = null;
    const source = stream.source;
    this._contentLength = source.length;
    this._loaded = 0;
    this._filename = null;
    this._disableRange = source.disableRange || false;
    this._rangeChunkSize = source.rangeChunkSize;
    if (!this._rangeChunkSize && !this._disableRange) {
      this._disableRange = true;
    }
    this._isStreamingSupported = !source.disableStream;
    this._isRangeSupported = !source.disableRange;
    this._readableStream = null;
    this._readCapability = new _util.PromiseCapability();
    this._headersCapability = new _util.PromiseCapability();
  }
  get headersReady() {
    return this._headersCapability.promise;
  }
  get filename() {
    return this._filename;
  }
  get contentLength() {
    return this._contentLength;
  }
  get isRangeSupported() {
    return this._isRangeSupported;
  }
  get isStreamingSupported() {
    return this._isStreamingSupported;
  }
  async read() {
    await this._readCapability.promise;
    if (this._done) {
      return {
        value: undefined,
        done: true
      };
    }
    if (this._storedError) {
      throw this._storedError;
    }
    const chunk = this._readableStream.read();
    if (chunk === null) {
      this._readCapability = new _util.PromiseCapability();
      return this.read();
    }
    this._loaded += chunk.length;
    this.onProgress?.({
      loaded: this._loaded,
      total: this._contentLength
    });
    const buffer = new Uint8Array(chunk).buffer;
    return {
      value: buffer,
      done: false
    };
  }
  cancel(reason) {
    if (!this._readableStream) {
      this._error(reason);
      return;
    }
    this._readableStream.destroy(reason);
  }
  _error(reason) {
    this._storedError = reason;
    this._readCapability.resolve();
  }
  _setReadableStream(readableStream) {
    this._readableStream = readableStream;
    readableStream.on("readable", () => {
      this._readCapability.resolve();
    });
    readableStream.on("end", () => {
      readableStream.destroy();
      this._done = true;
      this._readCapability.resolve();
    });
    readableStream.on("error", reason => {
      this._error(reason);
    });
    if (!this._isStreamingSupported && this._isRangeSupported) {
      this._error(new _util.AbortException("streaming is disabled"));
    }
    if (this._storedError) {
      this._readableStream.destroy(this._storedError);
    }
  }
}
class BaseRangeReader {
  constructor(stream) {
    this._url = stream.url;
    this._done = false;
    this._storedError = null;
    this.onProgress = null;
    this._loaded = 0;
    this._readableStream = null;
    this._readCapability = new _util.PromiseCapability();
    const source = stream.source;
    this._isStreamingSupported = !source.disableStream;
  }
  get isStreamingSupported() {
    return this._isStreamingSupported;
  }
  async read() {
    await this._readCapability.promise;
    if (this._done) {
      return {
        value: undefined,
        done: true
      };
    }
    if (this._storedError) {
      throw this._storedError;
    }
    const chunk = this._readableStream.read();
    if (chunk === null) {
      this._readCapability = new _util.PromiseCapability();
      return this.read();
    }
    this._loaded += chunk.length;
    this.onProgress?.({
      loaded: this._loaded
    });
    const buffer = new Uint8Array(chunk).buffer;
    return {
      value: buffer,
      done: false
    };
  }
  cancel(reason) {
    if (!this._readableStream) {
      this._error(reason);
      return;
    }
    this._readableStream.destroy(reason);
  }
  _error(reason) {
    this._storedError = reason;
    this._readCapability.resolve();
  }
  _setReadableStream(readableStream) {
    this._readableStream = readableStream;
    readableStream.on("readable", () => {
      this._readCapability.resolve();
    });
    readableStream.on("end", () => {
      readableStream.destroy();
      this._done = true;
      this._readCapability.resolve();
    });
    readableStream.on("error", reason => {
      this._error(reason);
    });
    if (this._storedError) {
      this._readableStream.destroy(this._storedError);
    }
  }
}
function createRequestOptions(parsedUrl, headers) {
  return {
    protocol: parsedUrl.protocol,
    auth: parsedUrl.auth,
    host: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.path,
    method: "GET",
    headers
  };
}
class PDFNodeStreamFullReader extends BaseFullReader {
  constructor(stream) {
    super(stream);
    const handleResponse = response => {
      if (response.statusCode === 404) {
        const error = new _util.MissingPDFException(`Missing PDF "${this._url}".`);
        this._storedError = error;
        this._headersCapability.reject(error);
        return;
      }
      this._headersCapability.resolve();
      this._setReadableStream(response);
      const getResponseHeader = name => {
        return this._readableStream.headers[name.toLowerCase()];
      };
      const {
        allowRangeRequests,
        suggestedLength
      } = (0, _network_utils.validateRangeRequestCapabilities)({
        getResponseHeader,
        isHttp: stream.isHttp,
        rangeChunkSize: this._rangeChunkSize,
        disableRange: this._disableRange
      });
      this._isRangeSupported = allowRangeRequests;
      this._contentLength = suggestedLength || this._contentLength;
      this._filename = (0, _network_utils.extractFilenameFromHeader)(getResponseHeader);
    };
    this._request = null;
    if (this._url.protocol === "http:") {
      const http = __webpack_require__(/*! http */ "?d446");
      this._request = http.request(createRequestOptions(this._url, stream.httpHeaders), handleResponse);
    } else {
      const https = __webpack_require__(/*! https */ "?4c38");
      this._request = https.request(createRequestOptions(this._url, stream.httpHeaders), handleResponse);
    }
    this._request.on("error", reason => {
      this._storedError = reason;
      this._headersCapability.reject(reason);
    });
    this._request.end();
  }
}
class PDFNodeStreamRangeReader extends BaseRangeReader {
  constructor(stream, start, end) {
    super(stream);
    this._httpHeaders = {};
    for (const property in stream.httpHeaders) {
      const value = stream.httpHeaders[property];
      if (value === undefined) {
        continue;
      }
      this._httpHeaders[property] = value;
    }
    this._httpHeaders.Range = `bytes=${start}-${end - 1}`;
    const handleResponse = response => {
      if (response.statusCode === 404) {
        const error = new _util.MissingPDFException(`Missing PDF "${this._url}".`);
        this._storedError = error;
        return;
      }
      this._setReadableStream(response);
    };
    this._request = null;
    if (this._url.protocol === "http:") {
      const http = __webpack_require__(/*! http */ "?d446");
      this._request = http.request(createRequestOptions(this._url, this._httpHeaders), handleResponse);
    } else {
      const https = __webpack_require__(/*! https */ "?4c38");
      this._request = https.request(createRequestOptions(this._url, this._httpHeaders), handleResponse);
    }
    this._request.on("error", reason => {
      this._storedError = reason;
    });
    this._request.end();
  }
}
class PDFNodeStreamFsFullReader extends BaseFullReader {
  constructor(stream) {
    super(stream);
    let path = decodeURIComponent(this._url.path);
    if (fileUriRegex.test(this._url.href)) {
      path = path.replace(/^\//, "");
    }
    const fs = __webpack_require__(/*! fs */ "?fe90");
    fs.lstat(path, (error, stat) => {
      if (error) {
        if (error.code === "ENOENT") {
          error = new _util.MissingPDFException(`Missing PDF "${path}".`);
        }
        this._storedError = error;
        this._headersCapability.reject(error);
        return;
      }
      this._contentLength = stat.size;
      this._setReadableStream(fs.createReadStream(path));
      this._headersCapability.resolve();
    });
  }
}
class PDFNodeStreamFsRangeReader extends BaseRangeReader {
  constructor(stream, start, end) {
    super(stream);
    let path = decodeURIComponent(this._url.path);
    if (fileUriRegex.test(this._url.href)) {
      path = path.replace(/^\//, "");
    }
    const fs = __webpack_require__(/*! fs */ "?fe90");
    this._setReadableStream(fs.createReadStream(path, {
      start,
      end: end - 1
    }));
  }
}

/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SVGGraphics = void 0;
var _display_utils = __w_pdfjs_require__(6);
var _util = __w_pdfjs_require__(1);
;
const SVG_DEFAULTS = {
  fontStyle: "normal",
  fontWeight: "normal",
  fillColor: "#000000"
};
const XML_NS = "http://www.w3.org/XML/1998/namespace";
const XLINK_NS = "http://www.w3.org/1999/xlink";
const LINE_CAP_STYLES = ["butt", "round", "square"];
const LINE_JOIN_STYLES = ["miter", "round", "bevel"];
const createObjectURL = function (data, contentType = "", forceDataSchema = false) {
  if (URL.createObjectURL && typeof Blob !== "undefined" && !forceDataSchema) {
    return URL.createObjectURL(new Blob([data], {
      type: contentType
    }));
  }
  const digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let buffer = `data:${contentType};base64,`;
  for (let i = 0, ii = data.length; i < ii; i += 3) {
    const b1 = data[i] & 0xff;
    const b2 = data[i + 1] & 0xff;
    const b3 = data[i + 2] & 0xff;
    const d1 = b1 >> 2,
      d2 = (b1 & 3) << 4 | b2 >> 4;
    const d3 = i + 1 < ii ? (b2 & 0xf) << 2 | b3 >> 6 : 64;
    const d4 = i + 2 < ii ? b3 & 0x3f : 64;
    buffer += digits[d1] + digits[d2] + digits[d3] + digits[d4];
  }
  return buffer;
};
const convertImgDataToPng = function () {
  const PNG_HEADER = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const CHUNK_WRAPPER_SIZE = 12;
  const crcTable = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let h = 0; h < 8; h++) {
      c = c & 1 ? 0xedb88320 ^ c >> 1 & 0x7fffffff : c >> 1 & 0x7fffffff;
    }
    crcTable[i] = c;
  }
  function crc32(data, start, end) {
    let crc = -1;
    for (let i = start; i < end; i++) {
      const a = (crc ^ data[i]) & 0xff;
      const b = crcTable[a];
      crc = crc >>> 8 ^ b;
    }
    return crc ^ -1;
  }
  function writePngChunk(type, body, data, offset) {
    let p = offset;
    const len = body.length;
    data[p] = len >> 24 & 0xff;
    data[p + 1] = len >> 16 & 0xff;
    data[p + 2] = len >> 8 & 0xff;
    data[p + 3] = len & 0xff;
    p += 4;
    data[p] = type.charCodeAt(0) & 0xff;
    data[p + 1] = type.charCodeAt(1) & 0xff;
    data[p + 2] = type.charCodeAt(2) & 0xff;
    data[p + 3] = type.charCodeAt(3) & 0xff;
    p += 4;
    data.set(body, p);
    p += body.length;
    const crc = crc32(data, offset + 4, p);
    data[p] = crc >> 24 & 0xff;
    data[p + 1] = crc >> 16 & 0xff;
    data[p + 2] = crc >> 8 & 0xff;
    data[p + 3] = crc & 0xff;
  }
  function adler32(data, start, end) {
    let a = 1;
    let b = 0;
    for (let i = start; i < end; ++i) {
      a = (a + (data[i] & 0xff)) % 65521;
      b = (b + a) % 65521;
    }
    return b << 16 | a;
  }
  function deflateSync(literals) {
    if (!_util.isNodeJS) {
      return deflateSyncUncompressed(literals);
    }
    try {
      const input = parseInt(process.versions.node) >= 8 ? literals : Buffer.from(literals);
      const output = (__webpack_require__(/*! zlib */ "?afbb").deflateSync)(input, {
        level: 9
      });
      return output instanceof Uint8Array ? output : new Uint8Array(output);
    } catch (e) {
      (0, _util.warn)("Not compressing PNG because zlib.deflateSync is unavailable: " + e);
    }
    return deflateSyncUncompressed(literals);
  }
  function deflateSyncUncompressed(literals) {
    let len = literals.length;
    const maxBlockLength = 0xffff;
    const deflateBlocks = Math.ceil(len / maxBlockLength);
    const idat = new Uint8Array(2 + len + deflateBlocks * 5 + 4);
    let pi = 0;
    idat[pi++] = 0x78;
    idat[pi++] = 0x9c;
    let pos = 0;
    while (len > maxBlockLength) {
      idat[pi++] = 0x00;
      idat[pi++] = 0xff;
      idat[pi++] = 0xff;
      idat[pi++] = 0x00;
      idat[pi++] = 0x00;
      idat.set(literals.subarray(pos, pos + maxBlockLength), pi);
      pi += maxBlockLength;
      pos += maxBlockLength;
      len -= maxBlockLength;
    }
    idat[pi++] = 0x01;
    idat[pi++] = len & 0xff;
    idat[pi++] = len >> 8 & 0xff;
    idat[pi++] = ~len & 0xffff & 0xff;
    idat[pi++] = (~len & 0xffff) >> 8 & 0xff;
    idat.set(literals.subarray(pos), pi);
    pi += literals.length - pos;
    const adler = adler32(literals, 0, literals.length);
    idat[pi++] = adler >> 24 & 0xff;
    idat[pi++] = adler >> 16 & 0xff;
    idat[pi++] = adler >> 8 & 0xff;
    idat[pi++] = adler & 0xff;
    return idat;
  }
  function encode(imgData, kind, forceDataSchema, isMask) {
    const width = imgData.width;
    const height = imgData.height;
    let bitDepth, colorType, lineSize;
    const bytes = imgData.data;
    switch (kind) {
      case _util.ImageKind.GRAYSCALE_1BPP:
        colorType = 0;
        bitDepth = 1;
        lineSize = width + 7 >> 3;
        break;
      case _util.ImageKind.RGB_24BPP:
        colorType = 2;
        bitDepth = 8;
        lineSize = width * 3;
        break;
      case _util.ImageKind.RGBA_32BPP:
        colorType = 6;
        bitDepth = 8;
        lineSize = width * 4;
        break;
      default:
        throw new Error("invalid format");
    }
    const literals = new Uint8Array((1 + lineSize) * height);
    let offsetLiterals = 0,
      offsetBytes = 0;
    for (let y = 0; y < height; ++y) {
      literals[offsetLiterals++] = 0;
      literals.set(bytes.subarray(offsetBytes, offsetBytes + lineSize), offsetLiterals);
      offsetBytes += lineSize;
      offsetLiterals += lineSize;
    }
    if (kind === _util.ImageKind.GRAYSCALE_1BPP && isMask) {
      offsetLiterals = 0;
      for (let y = 0; y < height; y++) {
        offsetLiterals++;
        for (let i = 0; i < lineSize; i++) {
          literals[offsetLiterals++] ^= 0xff;
        }
      }
    }
    const ihdr = new Uint8Array([width >> 24 & 0xff, width >> 16 & 0xff, width >> 8 & 0xff, width & 0xff, height >> 24 & 0xff, height >> 16 & 0xff, height >> 8 & 0xff, height & 0xff, bitDepth, colorType, 0x00, 0x00, 0x00]);
    const idat = deflateSync(literals);
    const pngLength = PNG_HEADER.length + CHUNK_WRAPPER_SIZE * 3 + ihdr.length + idat.length;
    const data = new Uint8Array(pngLength);
    let offset = 0;
    data.set(PNG_HEADER, offset);
    offset += PNG_HEADER.length;
    writePngChunk("IHDR", ihdr, data, offset);
    offset += CHUNK_WRAPPER_SIZE + ihdr.length;
    writePngChunk("IDATA", idat, data, offset);
    offset += CHUNK_WRAPPER_SIZE + idat.length;
    writePngChunk("IEND", new Uint8Array(0), data, offset);
    return createObjectURL(data, "image/png", forceDataSchema);
  }
  return function convertImgDataToPng(imgData, forceDataSchema, isMask) {
    const kind = imgData.kind === undefined ? _util.ImageKind.GRAYSCALE_1BPP : imgData.kind;
    return encode(imgData, kind, forceDataSchema, isMask);
  };
}();
class SVGExtraState {
  constructor() {
    this.fontSizeScale = 1;
    this.fontWeight = SVG_DEFAULTS.fontWeight;
    this.fontSize = 0;
    this.textMatrix = _util.IDENTITY_MATRIX;
    this.fontMatrix = _util.FONT_IDENTITY_MATRIX;
    this.leading = 0;
    this.textRenderingMode = _util.TextRenderingMode.FILL;
    this.textMatrixScale = 1;
    this.x = 0;
    this.y = 0;
    this.lineX = 0;
    this.lineY = 0;
    this.charSpacing = 0;
    this.wordSpacing = 0;
    this.textHScale = 1;
    this.textRise = 0;
    this.fillColor = SVG_DEFAULTS.fillColor;
    this.strokeColor = "#000000";
    this.fillAlpha = 1;
    this.strokeAlpha = 1;
    this.lineWidth = 1;
    this.lineJoin = "";
    this.lineCap = "";
    this.miterLimit = 0;
    this.dashArray = [];
    this.dashPhase = 0;
    this.dependencies = [];
    this.activeClipUrl = null;
    this.clipGroup = null;
    this.maskId = "";
  }
  clone() {
    return Object.create(this);
  }
  setCurrentPoint(x, y) {
    this.x = x;
    this.y = y;
  }
}
function opListToTree(opList) {
  let opTree = [];
  const tmp = [];
  for (const opListElement of opList) {
    if (opListElement.fn === "save") {
      opTree.push({
        fnId: 92,
        fn: "group",
        items: []
      });
      tmp.push(opTree);
      opTree = opTree.at(-1).items;
      continue;
    }
    if (opListElement.fn === "restore") {
      opTree = tmp.pop();
    } else {
      opTree.push(opListElement);
    }
  }
  return opTree;
}
function pf(value) {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  const s = value.toFixed(10);
  let i = s.length - 1;
  if (s[i] !== "0") {
    return s;
  }
  do {
    i--;
  } while (s[i] === "0");
  return s.substring(0, s[i] === "." ? i : i + 1);
}
function pm(m) {
  if (m[4] === 0 && m[5] === 0) {
    if (m[1] === 0 && m[2] === 0) {
      if (m[0] === 1 && m[3] === 1) {
        return "";
      }
      return `scale(${pf(m[0])} ${pf(m[3])})`;
    }
    if (m[0] === m[3] && m[1] === -m[2]) {
      const a = Math.acos(m[0]) * 180 / Math.PI;
      return `rotate(${pf(a)})`;
    }
  } else if (m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1) {
    return `translate(${pf(m[4])} ${pf(m[5])})`;
  }
  return `matrix(${pf(m[0])} ${pf(m[1])} ${pf(m[2])} ${pf(m[3])} ${pf(m[4])} ` + `${pf(m[5])})`;
}
let clipCount = 0;
let maskCount = 0;
let shadingCount = 0;
class SVGGraphics {
  constructor(commonObjs, objs, forceDataSchema = false) {
    (0, _display_utils.deprecated)("The SVG back-end is no longer maintained and *may* be removed in the future.");
    this.svgFactory = new _display_utils.DOMSVGFactory();
    this.current = new SVGExtraState();
    this.transformMatrix = _util.IDENTITY_MATRIX;
    this.transformStack = [];
    this.extraStack = [];
    this.commonObjs = commonObjs;
    this.objs = objs;
    this.pendingClip = null;
    this.pendingEOFill = false;
    this.embedFonts = false;
    this.embeddedFonts = Object.create(null);
    this.cssStyle = null;
    this.forceDataSchema = !!forceDataSchema;
    this._operatorIdMapping = [];
    for (const op in _util.OPS) {
      this._operatorIdMapping[_util.OPS[op]] = op;
    }
  }
  getObject(data, fallback = null) {
    if (typeof data === "string") {
      return data.startsWith("g_") ? this.commonObjs.get(data) : this.objs.get(data);
    }
    return fallback;
  }
  save() {
    this.transformStack.push(this.transformMatrix);
    const old = this.current;
    this.extraStack.push(old);
    this.current = old.clone();
  }
  restore() {
    this.transformMatrix = this.transformStack.pop();
    this.current = this.extraStack.pop();
    this.pendingClip = null;
    this.tgrp = null;
  }
  group(items) {
    this.save();
    this.executeOpTree(items);
    this.restore();
  }
  loadDependencies(operatorList) {
    const fnArray = operatorList.fnArray;
    const argsArray = operatorList.argsArray;
    for (let i = 0, ii = fnArray.length; i < ii; i++) {
      if (fnArray[i] !== _util.OPS.dependency) {
        continue;
      }
      for (const obj of argsArray[i]) {
        const objsPool = obj.startsWith("g_") ? this.commonObjs : this.objs;
        const promise = new Promise(resolve => {
          objsPool.get(obj, resolve);
        });
        this.current.dependencies.push(promise);
      }
    }
    return Promise.all(this.current.dependencies);
  }
  transform(a, b, c, d, e, f) {
    const transformMatrix = [a, b, c, d, e, f];
    this.transformMatrix = _util.Util.transform(this.transformMatrix, transformMatrix);
    this.tgrp = null;
  }
  getSVG(operatorList, viewport) {
    this.viewport = viewport;
    const svgElement = this._initialize(viewport);
    return this.loadDependencies(operatorList).then(() => {
      this.transformMatrix = _util.IDENTITY_MATRIX;
      this.executeOpTree(this.convertOpList(operatorList));
      return svgElement;
    });
  }
  convertOpList(operatorList) {
    const operatorIdMapping = this._operatorIdMapping;
    const argsArray = operatorList.argsArray;
    const fnArray = operatorList.fnArray;
    const opList = [];
    for (let i = 0, ii = fnArray.length; i < ii; i++) {
      const fnId = fnArray[i];
      opList.push({
        fnId,
        fn: operatorIdMapping[fnId],
        args: argsArray[i]
      });
    }
    return opListToTree(opList);
  }
  executeOpTree(opTree) {
    for (const opTreeElement of opTree) {
      const fn = opTreeElement.fn;
      const fnId = opTreeElement.fnId;
      const args = opTreeElement.args;
      switch (fnId | 0) {
        case _util.OPS.beginText:
          this.beginText();
          break;
        case _util.OPS.dependency:
          break;
        case _util.OPS.setLeading:
          this.setLeading(args);
          break;
        case _util.OPS.setLeadingMoveText:
          this.setLeadingMoveText(args[0], args[1]);
          break;
        case _util.OPS.setFont:
          this.setFont(args);
          break;
        case _util.OPS.showText:
          this.showText(args[0]);
          break;
        case _util.OPS.showSpacedText:
          this.showText(args[0]);
          break;
        case _util.OPS.endText:
          this.endText();
          break;
        case _util.OPS.moveText:
          this.moveText(args[0], args[1]);
          break;
        case _util.OPS.setCharSpacing:
          this.setCharSpacing(args[0]);
          break;
        case _util.OPS.setWordSpacing:
          this.setWordSpacing(args[0]);
          break;
        case _util.OPS.setHScale:
          this.setHScale(args[0]);
          break;
        case _util.OPS.setTextMatrix:
          this.setTextMatrix(args[0], args[1], args[2], args[3], args[4], args[5]);
          break;
        case _util.OPS.setTextRise:
          this.setTextRise(args[0]);
          break;
        case _util.OPS.setTextRenderingMode:
          this.setTextRenderingMode(args[0]);
          break;
        case _util.OPS.setLineWidth:
          this.setLineWidth(args[0]);
          break;
        case _util.OPS.setLineJoin:
          this.setLineJoin(args[0]);
          break;
        case _util.OPS.setLineCap:
          this.setLineCap(args[0]);
          break;
        case _util.OPS.setMiterLimit:
          this.setMiterLimit(args[0]);
          break;
        case _util.OPS.setFillRGBColor:
          this.setFillRGBColor(args[0], args[1], args[2]);
          break;
        case _util.OPS.setStrokeRGBColor:
          this.setStrokeRGBColor(args[0], args[1], args[2]);
          break;
        case _util.OPS.setStrokeColorN:
          this.setStrokeColorN(args);
          break;
        case _util.OPS.setFillColorN:
          this.setFillColorN(args);
          break;
        case _util.OPS.shadingFill:
          this.shadingFill(args[0]);
          break;
        case _util.OPS.setDash:
          this.setDash(args[0], args[1]);
          break;
        case _util.OPS.setRenderingIntent:
          this.setRenderingIntent(args[0]);
          break;
        case _util.OPS.setFlatness:
          this.setFlatness(args[0]);
          break;
        case _util.OPS.setGState:
          this.setGState(args[0]);
          break;
        case _util.OPS.fill:
          this.fill();
          break;
        case _util.OPS.eoFill:
          this.eoFill();
          break;
        case _util.OPS.stroke:
          this.stroke();
          break;
        case _util.OPS.fillStroke:
          this.fillStroke();
          break;
        case _util.OPS.eoFillStroke:
          this.eoFillStroke();
          break;
        case _util.OPS.clip:
          this.clip("nonzero");
          break;
        case _util.OPS.eoClip:
          this.clip("evenodd");
          break;
        case _util.OPS.paintSolidColorImageMask:
          this.paintSolidColorImageMask();
          break;
        case _util.OPS.paintImageXObject:
          this.paintImageXObject(args[0]);
          break;
        case _util.OPS.paintInlineImageXObject:
          this.paintInlineImageXObject(args[0]);
          break;
        case _util.OPS.paintImageMaskXObject:
          this.paintImageMaskXObject(args[0]);
          break;
        case _util.OPS.paintFormXObjectBegin:
          this.paintFormXObjectBegin(args[0], args[1]);
          break;
        case _util.OPS.paintFormXObjectEnd:
          this.paintFormXObjectEnd();
          break;
        case _util.OPS.closePath:
          this.closePath();
          break;
        case _util.OPS.closeStroke:
          this.closeStroke();
          break;
        case _util.OPS.closeFillStroke:
          this.closeFillStroke();
          break;
        case _util.OPS.closeEOFillStroke:
          this.closeEOFillStroke();
          break;
        case _util.OPS.nextLine:
          this.nextLine();
          break;
        case _util.OPS.transform:
          this.transform(args[0], args[1], args[2], args[3], args[4], args[5]);
          break;
        case _util.OPS.constructPath:
          this.constructPath(args[0], args[1]);
          break;
        case _util.OPS.endPath:
          this.endPath();
          break;
        case 92:
          this.group(opTreeElement.items);
          break;
        default:
          (0, _util.warn)(`Unimplemented operator ${fn}`);
          break;
      }
    }
  }
  setWordSpacing(wordSpacing) {
    this.current.wordSpacing = wordSpacing;
  }
  setCharSpacing(charSpacing) {
    this.current.charSpacing = charSpacing;
  }
  nextLine() {
    this.moveText(0, this.current.leading);
  }
  setTextMatrix(a, b, c, d, e, f) {
    const current = this.current;
    current.textMatrix = current.lineMatrix = [a, b, c, d, e, f];
    current.textMatrixScale = Math.hypot(a, b);
    current.x = current.lineX = 0;
    current.y = current.lineY = 0;
    current.xcoords = [];
    current.ycoords = [];
    current.tspan = this.svgFactory.createElement("svg:tspan");
    current.tspan.setAttributeNS(null, "font-family", current.fontFamily);
    current.tspan.setAttributeNS(null, "font-size", `${pf(current.fontSize)}px`);
    current.tspan.setAttributeNS(null, "y", pf(-current.y));
    current.txtElement = this.svgFactory.createElement("svg:text");
    current.txtElement.append(current.tspan);
  }
  beginText() {
    const current = this.current;
    current.x = current.lineX = 0;
    current.y = current.lineY = 0;
    current.textMatrix = _util.IDENTITY_MATRIX;
    current.lineMatrix = _util.IDENTITY_MATRIX;
    current.textMatrixScale = 1;
    current.tspan = this.svgFactory.createElement("svg:tspan");
    current.txtElement = this.svgFactory.createElement("svg:text");
    current.txtgrp = this.svgFactory.createElement("svg:g");
    current.xcoords = [];
    current.ycoords = [];
  }
  moveText(x, y) {
    const current = this.current;
    current.x = current.lineX += x;
    current.y = current.lineY += y;
    current.xcoords = [];
    current.ycoords = [];
    current.tspan = this.svgFactory.createElement("svg:tspan");
    current.tspan.setAttributeNS(null, "font-family", current.fontFamily);
    current.tspan.setAttributeNS(null, "font-size", `${pf(current.fontSize)}px`);
    current.tspan.setAttributeNS(null, "y", pf(-current.y));
  }
  showText(glyphs) {
    const current = this.current;
    const font = current.font;
    const fontSize = current.fontSize;
    if (fontSize === 0) {
      return;
    }
    const fontSizeScale = current.fontSizeScale;
    const charSpacing = current.charSpacing;
    const wordSpacing = current.wordSpacing;
    const fontDirection = current.fontDirection;
    const textHScale = current.textHScale * fontDirection;
    const vertical = font.vertical;
    const spacingDir = vertical ? 1 : -1;
    const defaultVMetrics = font.defaultVMetrics;
    const widthAdvanceScale = fontSize * current.fontMatrix[0];
    let x = 0;
    for (const glyph of glyphs) {
      if (glyph === null) {
        x += fontDirection * wordSpacing;
        continue;
      } else if (typeof glyph === "number") {
        x += spacingDir * glyph * fontSize / 1000;
        continue;
      }
      const spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
      const character = glyph.fontChar;
      let scaledX, scaledY;
      let width = glyph.width;
      if (vertical) {
        let vx;
        const vmetric = glyph.vmetric || defaultVMetrics;
        vx = glyph.vmetric ? vmetric[1] : width * 0.5;
        vx = -vx * widthAdvanceScale;
        const vy = vmetric[2] * widthAdvanceScale;
        width = vmetric ? -vmetric[0] : width;
        scaledX = vx / fontSizeScale;
        scaledY = (x + vy) / fontSizeScale;
      } else {
        scaledX = x / fontSizeScale;
        scaledY = 0;
      }
      if (glyph.isInFont || font.missingFile) {
        current.xcoords.push(current.x + scaledX);
        if (vertical) {
          current.ycoords.push(-current.y + scaledY);
        }
        current.tspan.textContent += character;
      } else {}
      const charWidth = vertical ? width * widthAdvanceScale - spacing * fontDirection : width * widthAdvanceScale + spacing * fontDirection;
      x += charWidth;
    }
    current.tspan.setAttributeNS(null, "x", current.xcoords.map(pf).join(" "));
    if (vertical) {
      current.tspan.setAttributeNS(null, "y", current.ycoords.map(pf).join(" "));
    } else {
      current.tspan.setAttributeNS(null, "y", pf(-current.y));
    }
    if (vertical) {
      current.y -= x;
    } else {
      current.x += x * textHScale;
    }
    current.tspan.setAttributeNS(null, "font-family", current.fontFamily);
    current.tspan.setAttributeNS(null, "font-size", `${pf(current.fontSize)}px`);
    if (current.fontStyle !== SVG_DEFAULTS.fontStyle) {
      current.tspan.setAttributeNS(null, "font-style", current.fontStyle);
    }
    if (current.fontWeight !== SVG_DEFAULTS.fontWeight) {
      current.tspan.setAttributeNS(null, "font-weight", current.fontWeight);
    }
    const fillStrokeMode = current.textRenderingMode & _util.TextRenderingMode.FILL_STROKE_MASK;
    if (fillStrokeMode === _util.TextRenderingMode.FILL || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
      if (current.fillColor !== SVG_DEFAULTS.fillColor) {
        current.tspan.setAttributeNS(null, "fill", current.fillColor);
      }
      if (current.fillAlpha < 1) {
        current.tspan.setAttributeNS(null, "fill-opacity", current.fillAlpha);
      }
    } else if (current.textRenderingMode === _util.TextRenderingMode.ADD_TO_PATH) {
      current.tspan.setAttributeNS(null, "fill", "transparent");
    } else {
      current.tspan.setAttributeNS(null, "fill", "none");
    }
    if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
      const lineWidthScale = 1 / (current.textMatrixScale || 1);
      this._setStrokeAttributes(current.tspan, lineWidthScale);
    }
    let textMatrix = current.textMatrix;
    if (current.textRise !== 0) {
      textMatrix = textMatrix.slice();
      textMatrix[5] += current.textRise;
    }
    current.txtElement.setAttributeNS(null, "transform", `${pm(textMatrix)} scale(${pf(textHScale)}, -1)`);
    current.txtElement.setAttributeNS(XML_NS, "xml:space", "preserve");
    current.txtElement.append(current.tspan);
    current.txtgrp.append(current.txtElement);
    this._ensureTransformGroup().append(current.txtElement);
  }
  setLeadingMoveText(x, y) {
    this.setLeading(-y);
    this.moveText(x, y);
  }
  addFontStyle(fontObj) {
    if (!fontObj.data) {
      throw new Error("addFontStyle: No font data available, " + 'ensure that the "fontExtraProperties" API parameter is set.');
    }
    if (!this.cssStyle) {
      this.cssStyle = this.svgFactory.createElement("svg:style");
      this.cssStyle.setAttributeNS(null, "type", "text/css");
      this.defs.append(this.cssStyle);
    }
    const url = createObjectURL(fontObj.data, fontObj.mimetype, this.forceDataSchema);
    this.cssStyle.textContent += `@font-face { font-family: "${fontObj.loadedName}";` + ` src: url(${url}); }\n`;
  }
  setFont(details) {
    const current = this.current;
    const fontObj = this.commonObjs.get(details[0]);
    let size = details[1];
    current.font = fontObj;
    if (this.embedFonts && !fontObj.missingFile && !this.embeddedFonts[fontObj.loadedName]) {
      this.addFontStyle(fontObj);
      this.embeddedFonts[fontObj.loadedName] = fontObj;
    }
    current.fontMatrix = fontObj.fontMatrix || _util.FONT_IDENTITY_MATRIX;
    let bold = "normal";
    if (fontObj.black) {
      bold = "900";
    } else if (fontObj.bold) {
      bold = "bold";
    }
    const italic = fontObj.italic ? "italic" : "normal";
    if (size < 0) {
      size = -size;
      current.fontDirection = -1;
    } else {
      current.fontDirection = 1;
    }
    current.fontSize = size;
    current.fontFamily = fontObj.loadedName;
    current.fontWeight = bold;
    current.fontStyle = italic;
    current.tspan = this.svgFactory.createElement("svg:tspan");
    current.tspan.setAttributeNS(null, "y", pf(-current.y));
    current.xcoords = [];
    current.ycoords = [];
  }
  endText() {
    const current = this.current;
    if (current.textRenderingMode & _util.TextRenderingMode.ADD_TO_PATH_FLAG && current.txtElement?.hasChildNodes()) {
      current.element = current.txtElement;
      this.clip("nonzero");
      this.endPath();
    }
  }
  setLineWidth(width) {
    if (width > 0) {
      this.current.lineWidth = width;
    }
  }
  setLineCap(style) {
    this.current.lineCap = LINE_CAP_STYLES[style];
  }
  setLineJoin(style) {
    this.current.lineJoin = LINE_JOIN_STYLES[style];
  }
  setMiterLimit(limit) {
    this.current.miterLimit = limit;
  }
  setStrokeAlpha(strokeAlpha) {
    this.current.strokeAlpha = strokeAlpha;
  }
  setStrokeRGBColor(r, g, b) {
    this.current.strokeColor = _util.Util.makeHexColor(r, g, b);
  }
  setFillAlpha(fillAlpha) {
    this.current.fillAlpha = fillAlpha;
  }
  setFillRGBColor(r, g, b) {
    this.current.fillColor = _util.Util.makeHexColor(r, g, b);
    this.current.tspan = this.svgFactory.createElement("svg:tspan");
    this.current.xcoords = [];
    this.current.ycoords = [];
  }
  setStrokeColorN(args) {
    this.current.strokeColor = this._makeColorN_Pattern(args);
  }
  setFillColorN(args) {
    this.current.fillColor = this._makeColorN_Pattern(args);
  }
  shadingFill(args) {
    const {
      width,
      height
    } = this.viewport;
    const inv = _util.Util.inverseTransform(this.transformMatrix);
    const [x0, y0, x1, y1] = _util.Util.getAxialAlignedBoundingBox([0, 0, width, height], inv);
    const rect = this.svgFactory.createElement("svg:rect");
    rect.setAttributeNS(null, "x", x0);
    rect.setAttributeNS(null, "y", y0);
    rect.setAttributeNS(null, "width", x1 - x0);
    rect.setAttributeNS(null, "height", y1 - y0);
    rect.setAttributeNS(null, "fill", this._makeShadingPattern(args));
    if (this.current.fillAlpha < 1) {
      rect.setAttributeNS(null, "fill-opacity", this.current.fillAlpha);
    }
    this._ensureTransformGroup().append(rect);
  }
  _makeColorN_Pattern(args) {
    if (args[0] === "TilingPattern") {
      return this._makeTilingPattern(args);
    }
    return this._makeShadingPattern(args);
  }
  _makeTilingPattern(args) {
    const color = args[1];
    const operatorList = args[2];
    const matrix = args[3] || _util.IDENTITY_MATRIX;
    const [x0, y0, x1, y1] = args[4];
    const xstep = args[5];
    const ystep = args[6];
    const paintType = args[7];
    const tilingId = `shading${shadingCount++}`;
    const [tx0, ty0, tx1, ty1] = _util.Util.normalizeRect([..._util.Util.applyTransform([x0, y0], matrix), ..._util.Util.applyTransform([x1, y1], matrix)]);
    const [xscale, yscale] = _util.Util.singularValueDecompose2dScale(matrix);
    const txstep = xstep * xscale;
    const tystep = ystep * yscale;
    const tiling = this.svgFactory.createElement("svg:pattern");
    tiling.setAttributeNS(null, "id", tilingId);
    tiling.setAttributeNS(null, "patternUnits", "userSpaceOnUse");
    tiling.setAttributeNS(null, "width", txstep);
    tiling.setAttributeNS(null, "height", tystep);
    tiling.setAttributeNS(null, "x", `${tx0}`);
    tiling.setAttributeNS(null, "y", `${ty0}`);
    const svg = this.svg;
    const transformMatrix = this.transformMatrix;
    const fillColor = this.current.fillColor;
    const strokeColor = this.current.strokeColor;
    const bbox = this.svgFactory.create(tx1 - tx0, ty1 - ty0);
    this.svg = bbox;
    this.transformMatrix = matrix;
    if (paintType === 2) {
      const cssColor = _util.Util.makeHexColor(...color);
      this.current.fillColor = cssColor;
      this.current.strokeColor = cssColor;
    }
    this.executeOpTree(this.convertOpList(operatorList));
    this.svg = svg;
    this.transformMatrix = transformMatrix;
    this.current.fillColor = fillColor;
    this.current.strokeColor = strokeColor;
    tiling.append(bbox.childNodes[0]);
    this.defs.append(tiling);
    return `url(#${tilingId})`;
  }
  _makeShadingPattern(args) {
    if (typeof args === "string") {
      args = this.objs.get(args);
    }
    switch (args[0]) {
      case "RadialAxial":
        const shadingId = `shading${shadingCount++}`;
        const colorStops = args[3];
        let gradient;
        switch (args[1]) {
          case "axial":
            const point0 = args[4];
            const point1 = args[5];
            gradient = this.svgFactory.createElement("svg:linearGradient");
            gradient.setAttributeNS(null, "id", shadingId);
            gradient.setAttributeNS(null, "gradientUnits", "userSpaceOnUse");
            gradient.setAttributeNS(null, "x1", point0[0]);
            gradient.setAttributeNS(null, "y1", point0[1]);
            gradient.setAttributeNS(null, "x2", point1[0]);
            gradient.setAttributeNS(null, "y2", point1[1]);
            break;
          case "radial":
            const focalPoint = args[4];
            const circlePoint = args[5];
            const focalRadius = args[6];
            const circleRadius = args[7];
            gradient = this.svgFactory.createElement("svg:radialGradient");
            gradient.setAttributeNS(null, "id", shadingId);
            gradient.setAttributeNS(null, "gradientUnits", "userSpaceOnUse");
            gradient.setAttributeNS(null, "cx", circlePoint[0]);
            gradient.setAttributeNS(null, "cy", circlePoint[1]);
            gradient.setAttributeNS(null, "r", circleRadius);
            gradient.setAttributeNS(null, "fx", focalPoint[0]);
            gradient.setAttributeNS(null, "fy", focalPoint[1]);
            gradient.setAttributeNS(null, "fr", focalRadius);
            break;
          default:
            throw new Error(`Unknown RadialAxial type: ${args[1]}`);
        }
        for (const colorStop of colorStops) {
          const stop = this.svgFactory.createElement("svg:stop");
          stop.setAttributeNS(null, "offset", colorStop[0]);
          stop.setAttributeNS(null, "stop-color", colorStop[1]);
          gradient.append(stop);
        }
        this.defs.append(gradient);
        return `url(#${shadingId})`;
      case "Mesh":
        (0, _util.warn)("Unimplemented pattern Mesh");
        return null;
      case "Dummy":
        return "hotpink";
      default:
        throw new Error(`Unknown IR type: ${args[0]}`);
    }
  }
  setDash(dashArray, dashPhase) {
    this.current.dashArray = dashArray;
    this.current.dashPhase = dashPhase;
  }
  constructPath(ops, args) {
    const current = this.current;
    let x = current.x,
      y = current.y;
    let d = [];
    let j = 0;
    for (const op of ops) {
      switch (op | 0) {
        case _util.OPS.rectangle:
          x = args[j++];
          y = args[j++];
          const width = args[j++];
          const height = args[j++];
          const xw = x + width;
          const yh = y + height;
          d.push("M", pf(x), pf(y), "L", pf(xw), pf(y), "L", pf(xw), pf(yh), "L", pf(x), pf(yh), "Z");
          break;
        case _util.OPS.moveTo:
          x = args[j++];
          y = args[j++];
          d.push("M", pf(x), pf(y));
          break;
        case _util.OPS.lineTo:
          x = args[j++];
          y = args[j++];
          d.push("L", pf(x), pf(y));
          break;
        case _util.OPS.curveTo:
          x = args[j + 4];
          y = args[j + 5];
          d.push("C", pf(args[j]), pf(args[j + 1]), pf(args[j + 2]), pf(args[j + 3]), pf(x), pf(y));
          j += 6;
          break;
        case _util.OPS.curveTo2:
          d.push("C", pf(x), pf(y), pf(args[j]), pf(args[j + 1]), pf(args[j + 2]), pf(args[j + 3]));
          x = args[j + 2];
          y = args[j + 3];
          j += 4;
          break;
        case _util.OPS.curveTo3:
          x = args[j + 2];
          y = args[j + 3];
          d.push("C", pf(args[j]), pf(args[j + 1]), pf(x), pf(y), pf(x), pf(y));
          j += 4;
          break;
        case _util.OPS.closePath:
          d.push("Z");
          break;
      }
    }
    d = d.join(" ");
    if (current.path && ops.length > 0 && ops[0] !== _util.OPS.rectangle && ops[0] !== _util.OPS.moveTo) {
      d = current.path.getAttributeNS(null, "d") + d;
    } else {
      current.path = this.svgFactory.createElement("svg:path");
      this._ensureTransformGroup().append(current.path);
    }
    current.path.setAttributeNS(null, "d", d);
    current.path.setAttributeNS(null, "fill", "none");
    current.element = current.path;
    current.setCurrentPoint(x, y);
  }
  endPath() {
    const current = this.current;
    current.path = null;
    if (!this.pendingClip) {
      return;
    }
    if (!current.element) {
      this.pendingClip = null;
      return;
    }
    const clipId = `clippath${clipCount++}`;
    const clipPath = this.svgFactory.createElement("svg:clipPath");
    clipPath.setAttributeNS(null, "id", clipId);
    clipPath.setAttributeNS(null, "transform", pm(this.transformMatrix));
    const clipElement = current.element.cloneNode(true);
    if (this.pendingClip === "evenodd") {
      clipElement.setAttributeNS(null, "clip-rule", "evenodd");
    } else {
      clipElement.setAttributeNS(null, "clip-rule", "nonzero");
    }
    this.pendingClip = null;
    clipPath.append(clipElement);
    this.defs.append(clipPath);
    if (current.activeClipUrl) {
      current.clipGroup = null;
      for (const prev of this.extraStack) {
        prev.clipGroup = null;
      }
      clipPath.setAttributeNS(null, "clip-path", current.activeClipUrl);
    }
    current.activeClipUrl = `url(#${clipId})`;
    this.tgrp = null;
  }
  clip(type) {
    this.pendingClip = type;
  }
  closePath() {
    const current = this.current;
    if (current.path) {
      const d = `${current.path.getAttributeNS(null, "d")}Z`;
      current.path.setAttributeNS(null, "d", d);
    }
  }
  setLeading(leading) {
    this.current.leading = -leading;
  }
  setTextRise(textRise) {
    this.current.textRise = textRise;
  }
  setTextRenderingMode(textRenderingMode) {
    this.current.textRenderingMode = textRenderingMode;
  }
  setHScale(scale) {
    this.current.textHScale = scale / 100;
  }
  setRenderingIntent(intent) {}
  setFlatness(flatness) {}
  setGState(states) {
    for (const [key, value] of states) {
      switch (key) {
        case "LW":
          this.setLineWidth(value);
          break;
        case "LC":
          this.setLineCap(value);
          break;
        case "LJ":
          this.setLineJoin(value);
          break;
        case "ML":
          this.setMiterLimit(value);
          break;
        case "D":
          this.setDash(value[0], value[1]);
          break;
        case "RI":
          this.setRenderingIntent(value);
          break;
        case "FL":
          this.setFlatness(value);
          break;
        case "Font":
          this.setFont(value);
          break;
        case "CA":
          this.setStrokeAlpha(value);
          break;
        case "ca":
          this.setFillAlpha(value);
          break;
        default:
          (0, _util.warn)(`Unimplemented graphic state operator ${key}`);
          break;
      }
    }
  }
  fill() {
    const current = this.current;
    if (current.element) {
      current.element.setAttributeNS(null, "fill", current.fillColor);
      current.element.setAttributeNS(null, "fill-opacity", current.fillAlpha);
      this.endPath();
    }
  }
  stroke() {
    const current = this.current;
    if (current.element) {
      this._setStrokeAttributes(current.element);
      current.element.setAttributeNS(null, "fill", "none");
      this.endPath();
    }
  }
  _setStrokeAttributes(element, lineWidthScale = 1) {
    const current = this.current;
    let dashArray = current.dashArray;
    if (lineWidthScale !== 1 && dashArray.length > 0) {
      dashArray = dashArray.map(function (value) {
        return lineWidthScale * value;
      });
    }
    element.setAttributeNS(null, "stroke", current.strokeColor);
    element.setAttributeNS(null, "stroke-opacity", current.strokeAlpha);
    element.setAttributeNS(null, "stroke-miterlimit", pf(current.miterLimit));
    element.setAttributeNS(null, "stroke-linecap", current.lineCap);
    element.setAttributeNS(null, "stroke-linejoin", current.lineJoin);
    element.setAttributeNS(null, "stroke-width", pf(lineWidthScale * current.lineWidth) + "px");
    element.setAttributeNS(null, "stroke-dasharray", dashArray.map(pf).join(" "));
    element.setAttributeNS(null, "stroke-dashoffset", pf(lineWidthScale * current.dashPhase) + "px");
  }
  eoFill() {
    this.current.element?.setAttributeNS(null, "fill-rule", "evenodd");
    this.fill();
  }
  fillStroke() {
    this.stroke();
    this.fill();
  }
  eoFillStroke() {
    this.current.element?.setAttributeNS(null, "fill-rule", "evenodd");
    this.fillStroke();
  }
  closeStroke() {
    this.closePath();
    this.stroke();
  }
  closeFillStroke() {
    this.closePath();
    this.fillStroke();
  }
  closeEOFillStroke() {
    this.closePath();
    this.eoFillStroke();
  }
  paintSolidColorImageMask() {
    const rect = this.svgFactory.createElement("svg:rect");
    rect.setAttributeNS(null, "x", "0");
    rect.setAttributeNS(null, "y", "0");
    rect.setAttributeNS(null, "width", "1px");
    rect.setAttributeNS(null, "height", "1px");
    rect.setAttributeNS(null, "fill", this.current.fillColor);
    this._ensureTransformGroup().append(rect);
  }
  paintImageXObject(objId) {
    const imgData = this.getObject(objId);
    if (!imgData) {
      (0, _util.warn)(`Dependent image with object ID ${objId} is not ready yet`);
      return;
    }
    this.paintInlineImageXObject(imgData);
  }
  paintInlineImageXObject(imgData, mask) {
    const width = imgData.width;
    const height = imgData.height;
    const imgSrc = convertImgDataToPng(imgData, this.forceDataSchema, !!mask);
    const cliprect = this.svgFactory.createElement("svg:rect");
    cliprect.setAttributeNS(null, "x", "0");
    cliprect.setAttributeNS(null, "y", "0");
    cliprect.setAttributeNS(null, "width", pf(width));
    cliprect.setAttributeNS(null, "height", pf(height));
    this.current.element = cliprect;
    this.clip("nonzero");
    const imgEl = this.svgFactory.createElement("svg:image");
    imgEl.setAttributeNS(XLINK_NS, "xlink:href", imgSrc);
    imgEl.setAttributeNS(null, "x", "0");
    imgEl.setAttributeNS(null, "y", pf(-height));
    imgEl.setAttributeNS(null, "width", pf(width) + "px");
    imgEl.setAttributeNS(null, "height", pf(height) + "px");
    imgEl.setAttributeNS(null, "transform", `scale(${pf(1 / width)} ${pf(-1 / height)})`);
    if (mask) {
      mask.append(imgEl);
    } else {
      this._ensureTransformGroup().append(imgEl);
    }
  }
  paintImageMaskXObject(img) {
    const imgData = this.getObject(img.data, img);
    if (imgData.bitmap) {
      (0, _util.warn)("paintImageMaskXObject: ImageBitmap support is not implemented, " + "ensure that the `isOffscreenCanvasSupported` API parameter is disabled.");
      return;
    }
    const current = this.current;
    const width = imgData.width;
    const height = imgData.height;
    const fillColor = current.fillColor;
    current.maskId = `mask${maskCount++}`;
    const mask = this.svgFactory.createElement("svg:mask");
    mask.setAttributeNS(null, "id", current.maskId);
    const rect = this.svgFactory.createElement("svg:rect");
    rect.setAttributeNS(null, "x", "0");
    rect.setAttributeNS(null, "y", "0");
    rect.setAttributeNS(null, "width", pf(width));
    rect.setAttributeNS(null, "height", pf(height));
    rect.setAttributeNS(null, "fill", fillColor);
    rect.setAttributeNS(null, "mask", `url(#${current.maskId})`);
    this.defs.append(mask);
    this._ensureTransformGroup().append(rect);
    this.paintInlineImageXObject(imgData, mask);
  }
  paintFormXObjectBegin(matrix, bbox) {
    if (Array.isArray(matrix) && matrix.length === 6) {
      this.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    }
    if (bbox) {
      const width = bbox[2] - bbox[0];
      const height = bbox[3] - bbox[1];
      const cliprect = this.svgFactory.createElement("svg:rect");
      cliprect.setAttributeNS(null, "x", bbox[0]);
      cliprect.setAttributeNS(null, "y", bbox[1]);
      cliprect.setAttributeNS(null, "width", pf(width));
      cliprect.setAttributeNS(null, "height", pf(height));
      this.current.element = cliprect;
      this.clip("nonzero");
      this.endPath();
    }
  }
  paintFormXObjectEnd() {}
  _initialize(viewport) {
    const svg = this.svgFactory.create(viewport.width, viewport.height);
    const definitions = this.svgFactory.createElement("svg:defs");
    svg.append(definitions);
    this.defs = definitions;
    const rootGroup = this.svgFactory.createElement("svg:g");
    rootGroup.setAttributeNS(null, "transform", pm(viewport.transform));
    svg.append(rootGroup);
    this.svg = rootGroup;
    return svg;
  }
  _ensureClipGroup() {
    if (!this.current.clipGroup) {
      const clipGroup = this.svgFactory.createElement("svg:g");
      clipGroup.setAttributeNS(null, "clip-path", this.current.activeClipUrl);
      this.svg.append(clipGroup);
      this.current.clipGroup = clipGroup;
    }
    return this.current.clipGroup;
  }
  _ensureTransformGroup() {
    if (!this.tgrp) {
      this.tgrp = this.svgFactory.createElement("svg:g");
      this.tgrp.setAttributeNS(null, "transform", pm(this.transformMatrix));
      if (this.current.activeClipUrl) {
        this._ensureClipGroup().append(this.tgrp);
      } else {
        this.svg.append(this.tgrp);
      }
    }
    return this.tgrp;
  }
}
exports.SVGGraphics = SVGGraphics;

/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.XfaText = void 0;
class XfaText {
  static textContent(xfa) {
    const items = [];
    const output = {
      items,
      styles: Object.create(null)
    };
    function walk(node) {
      if (!node) {
        return;
      }
      let str = null;
      const name = node.name;
      if (name === "#text") {
        str = node.value;
      } else if (!XfaText.shouldBuildText(name)) {
        return;
      } else if (node?.attributes?.textContent) {
        str = node.attributes.textContent;
      } else if (node.value) {
        str = node.value;
      }
      if (str !== null) {
        items.push({
          str
        });
      }
      if (!node.children) {
        return;
      }
      for (const child of node.children) {
        walk(child);
      }
    }
    walk(xfa);
    return output;
  }
  static shouldBuildText(name) {
    return !(name === "textarea" || name === "input" || name === "option" || name === "select");
  }
}
exports.XfaText = XfaText;

/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextLayerRenderTask = void 0;
exports.renderTextLayer = renderTextLayer;
exports.updateTextLayer = updateTextLayer;
var _util = __w_pdfjs_require__(1);
var _display_utils = __w_pdfjs_require__(6);
const MAX_TEXT_DIVS_TO_RENDER = 100000;
const DEFAULT_FONT_SIZE = 30;
const DEFAULT_FONT_ASCENT = 0.8;
const ascentCache = new Map();
function getCtx(size, isOffscreenCanvasSupported) {
  let ctx;
  if (isOffscreenCanvasSupported && _util.FeatureTest.isOffscreenCanvasSupported) {
    ctx = new OffscreenCanvas(size, size).getContext("2d", {
      alpha: false
    });
  } else {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    ctx = canvas.getContext("2d", {
      alpha: false
    });
  }
  return ctx;
}
function getAscent(fontFamily, isOffscreenCanvasSupported) {
  const cachedAscent = ascentCache.get(fontFamily);
  if (cachedAscent) {
    return cachedAscent;
  }
  const ctx = getCtx(DEFAULT_FONT_SIZE, isOffscreenCanvasSupported);
  ctx.font = `${DEFAULT_FONT_SIZE}px ${fontFamily}`;
  const metrics = ctx.measureText("");
  let ascent = metrics.fontBoundingBoxAscent;
  let descent = Math.abs(metrics.fontBoundingBoxDescent);
  if (ascent) {
    const ratio = ascent / (ascent + descent);
    ascentCache.set(fontFamily, ratio);
    ctx.canvas.width = ctx.canvas.height = 0;
    return ratio;
  }
  ctx.strokeStyle = "red";
  ctx.clearRect(0, 0, DEFAULT_FONT_SIZE, DEFAULT_FONT_SIZE);
  ctx.strokeText("g", 0, 0);
  let pixels = ctx.getImageData(0, 0, DEFAULT_FONT_SIZE, DEFAULT_FONT_SIZE).data;
  descent = 0;
  for (let i = pixels.length - 1 - 3; i >= 0; i -= 4) {
    if (pixels[i] > 0) {
      descent = Math.ceil(i / 4 / DEFAULT_FONT_SIZE);
      break;
    }
  }
  ctx.clearRect(0, 0, DEFAULT_FONT_SIZE, DEFAULT_FONT_SIZE);
  ctx.strokeText("A", 0, DEFAULT_FONT_SIZE);
  pixels = ctx.getImageData(0, 0, DEFAULT_FONT_SIZE, DEFAULT_FONT_SIZE).data;
  ascent = 0;
  for (let i = 0, ii = pixels.length; i < ii; i += 4) {
    if (pixels[i] > 0) {
      ascent = DEFAULT_FONT_SIZE - Math.floor(i / 4 / DEFAULT_FONT_SIZE);
      break;
    }
  }
  ctx.canvas.width = ctx.canvas.height = 0;
  if (ascent) {
    const ratio = ascent / (ascent + descent);
    ascentCache.set(fontFamily, ratio);
    return ratio;
  }
  ascentCache.set(fontFamily, DEFAULT_FONT_ASCENT);
  return DEFAULT_FONT_ASCENT;
}
function appendText(task, geom, styles) {
  const textDiv = document.createElement("span");
  const textDivProperties = {
    angle: 0,
    canvasWidth: 0,
    hasText: geom.str !== "",
    hasEOL: geom.hasEOL,
    fontSize: 0
  };
  task._textDivs.push(textDiv);
  const tx = _util.Util.transform(task._transform, geom.transform);
  let angle = Math.atan2(tx[1], tx[0]);
  const style = styles[geom.fontName];
  if (style.vertical) {
    angle += Math.PI / 2;
  }
  const fontHeight = Math.hypot(tx[2], tx[3]);
  const fontAscent = fontHeight * getAscent(style.fontFamily, task._isOffscreenCanvasSupported);
  let left, top;
  if (angle === 0) {
    left = tx[4];
    top = tx[5] - fontAscent;
  } else {
    left = tx[4] + fontAscent * Math.sin(angle);
    top = tx[5] - fontAscent * Math.cos(angle);
  }
  const scaleFactorStr = "calc(var(--scale-factor)*";
  const divStyle = textDiv.style;
  if (task._container === task._rootContainer) {
    divStyle.left = `${(100 * left / task._pageWidth).toFixed(2)}%`;
    divStyle.top = `${(100 * top / task._pageHeight).toFixed(2)}%`;
  } else {
    divStyle.left = `${scaleFactorStr}${left.toFixed(2)}px)`;
    divStyle.top = `${scaleFactorStr}${top.toFixed(2)}px)`;
  }
  divStyle.fontSize = `${scaleFactorStr}${fontHeight.toFixed(2)}px)`;
  divStyle.fontFamily = style.fontFamily;
  textDivProperties.fontSize = fontHeight;
  textDiv.setAttribute("role", "presentation");
  textDiv.textContent = geom.str;
  textDiv.dir = geom.dir;
  if (task._fontInspectorEnabled) {
    textDiv.dataset.fontName = geom.fontName;
  }
  if (angle !== 0) {
    textDivProperties.angle = angle * (180 / Math.PI);
  }
  let shouldScaleText = false;
  if (geom.str.length > 1) {
    shouldScaleText = true;
  } else if (geom.str !== " " && geom.transform[0] !== geom.transform[3]) {
    const absScaleX = Math.abs(geom.transform[0]),
      absScaleY = Math.abs(geom.transform[3]);
    if (absScaleX !== absScaleY && Math.max(absScaleX, absScaleY) / Math.min(absScaleX, absScaleY) > 1.5) {
      shouldScaleText = true;
    }
  }
  if (shouldScaleText) {
    textDivProperties.canvasWidth = style.vertical ? geom.height : geom.width;
  }
  task._textDivProperties.set(textDiv, textDivProperties);
  if (task._isReadableStream) {
    task._layoutText(textDiv);
  }
}
function layout(params) {
  const {
    div,
    scale,
    properties,
    ctx,
    prevFontSize,
    prevFontFamily
  } = params;
  const {
    style
  } = div;
  let transform = "";
  if (properties.canvasWidth !== 0 && properties.hasText) {
    const {
      fontFamily
    } = style;
    const {
      canvasWidth,
      fontSize
    } = properties;
    if (prevFontSize !== fontSize || prevFontFamily !== fontFamily) {
      ctx.font = `${fontSize * scale}px ${fontFamily}`;
      params.prevFontSize = fontSize;
      params.prevFontFamily = fontFamily;
    }
    const {
      width
    } = ctx.measureText(div.textContent);
    if (width > 0) {
      transform = `scaleX(${canvasWidth * scale / width})`;
    }
  }
  if (properties.angle !== 0) {
    transform = `rotate(${properties.angle}deg) ${transform}`;
  }
  if (transform.length > 0) {
    style.transform = transform;
  }
}
function render(task) {
  if (task._canceled) {
    return;
  }
  const textDivs = task._textDivs;
  const capability = task._capability;
  const textDivsLength = textDivs.length;
  if (textDivsLength > MAX_TEXT_DIVS_TO_RENDER) {
    capability.resolve();
    return;
  }
  if (!task._isReadableStream) {
    for (const textDiv of textDivs) {
      task._layoutText(textDiv);
    }
  }
  capability.resolve();
}
class TextLayerRenderTask {
  constructor({
    textContentSource,
    container,
    viewport,
    textDivs,
    textDivProperties,
    textContentItemsStr,
    isOffscreenCanvasSupported
  }) {
    this._textContentSource = textContentSource;
    this._isReadableStream = textContentSource instanceof ReadableStream;
    this._container = this._rootContainer = container;
    this._textDivs = textDivs || [];
    this._textContentItemsStr = textContentItemsStr || [];
    this._isOffscreenCanvasSupported = isOffscreenCanvasSupported;
    this._fontInspectorEnabled = !!globalThis.FontInspector?.enabled;
    this._reader = null;
    this._textDivProperties = textDivProperties || new WeakMap();
    this._canceled = false;
    this._capability = new _util.PromiseCapability();
    this._layoutTextParams = {
      prevFontSize: null,
      prevFontFamily: null,
      div: null,
      scale: viewport.scale * (globalThis.devicePixelRatio || 1),
      properties: null,
      ctx: getCtx(0, isOffscreenCanvasSupported)
    };
    const {
      pageWidth,
      pageHeight,
      pageX,
      pageY
    } = viewport.rawDims;
    this._transform = [1, 0, 0, -1, -pageX, pageY + pageHeight];
    this._pageWidth = pageWidth;
    this._pageHeight = pageHeight;
    (0, _display_utils.setLayerDimensions)(container, viewport);
    this._capability.promise.finally(() => {
      this._layoutTextParams = null;
    }).catch(() => {});
  }
  get promise() {
    return this._capability.promise;
  }
  cancel() {
    this._canceled = true;
    if (this._reader) {
      this._reader.cancel(new _util.AbortException("TextLayer task cancelled.")).catch(() => {});
      this._reader = null;
    }
    this._capability.reject(new _util.AbortException("TextLayer task cancelled."));
  }
  _processItems(items, styleCache) {
    for (const item of items) {
      if (item.str === undefined) {
        if (item.type === "beginMarkedContentProps" || item.type === "beginMarkedContent") {
          const parent = this._container;
          this._container = document.createElement("span");
          this._container.classList.add("markedContent");
          if (item.id !== null) {
            this._container.setAttribute("id", `${item.id}`);
          }
          parent.append(this._container);
        } else if (item.type === "endMarkedContent") {
          this._container = this._container.parentNode;
        }
        continue;
      }
      this._textContentItemsStr.push(item.str);
      appendText(this, item, styleCache);
    }
  }
  _layoutText(textDiv) {
    const textDivProperties = this._layoutTextParams.properties = this._textDivProperties.get(textDiv);
    this._layoutTextParams.div = textDiv;
    layout(this._layoutTextParams);
    if (textDivProperties.hasText) {
      this._container.append(textDiv);
    }
    if (textDivProperties.hasEOL) {
      const br = document.createElement("br");
      br.setAttribute("role", "presentation");
      this._container.append(br);
    }
  }
  _render() {
    const capability = new _util.PromiseCapability();
    let styleCache = Object.create(null);
    if (this._isReadableStream) {
      const pump = () => {
        this._reader.read().then(({
          value,
          done
        }) => {
          if (done) {
            capability.resolve();
            return;
          }
          Object.assign(styleCache, value.styles);
          this._processItems(value.items, styleCache);
          pump();
        }, capability.reject);
      };
      this._reader = this._textContentSource.getReader();
      pump();
    } else if (this._textContentSource) {
      const {
        items,
        styles
      } = this._textContentSource;
      this._processItems(items, styles);
      capability.resolve();
    } else {
      throw new Error('No "textContentSource" parameter specified.');
    }
    capability.promise.then(() => {
      styleCache = null;
      render(this);
    }, this._capability.reject);
  }
}
exports.TextLayerRenderTask = TextLayerRenderTask;
function renderTextLayer(params) {
  if (!params.textContentSource && (params.textContent || params.textContentStream)) {
    (0, _display_utils.deprecated)("The TextLayerRender `textContent`/`textContentStream` parameters " + "will be removed in the future, please use `textContentSource` instead.");
    params.textContentSource = params.textContent || params.textContentStream;
  }
  const {
    container,
    viewport
  } = params;
  const style = getComputedStyle(container);
  const visibility = style.getPropertyValue("visibility");
  const scaleFactor = parseFloat(style.getPropertyValue("--scale-factor"));
  if (visibility === "visible" && (!scaleFactor || Math.abs(scaleFactor - viewport.scale) > 1e-5)) {
    console.error("The `--scale-factor` CSS-variable must be set, " + "to the same value as `viewport.scale`, " + "either on the `container`-element itself or higher up in the DOM.");
  }
  const task = new TextLayerRenderTask(params);
  task._render();
  return task;
}
function updateTextLayer({
  container,
  viewport,
  textDivs,
  textDivProperties,
  isOffscreenCanvasSupported,
  mustRotate = true,
  mustRescale = true
}) {
  if (mustRotate) {
    (0, _display_utils.setLayerDimensions)(container, {
      rotation: viewport.rotation
    });
  }
  if (mustRescale) {
    const ctx = getCtx(0, isOffscreenCanvasSupported);
    const scale = viewport.scale * (globalThis.devicePixelRatio || 1);
    const params = {
      prevFontSize: null,
      prevFontFamily: null,
      div: null,
      scale,
      properties: null,
      ctx
    };
    for (const div of textDivs) {
      params.properties = textDivProperties.get(div);
      params.div = div;
      layout(params);
    }
  }
}

/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AnnotationEditorLayer = void 0;
var _util = __w_pdfjs_require__(1);
var _editor = __w_pdfjs_require__(4);
var _freetext = __w_pdfjs_require__(28);
var _ink = __w_pdfjs_require__(33);
var _display_utils = __w_pdfjs_require__(6);
var _stamp = __w_pdfjs_require__(34);
class AnnotationEditorLayer {
  #accessibilityManager;
  #allowClick = false;
  #annotationLayer = null;
  #boundPointerup = this.pointerup.bind(this);
  #boundPointerdown = this.pointerdown.bind(this);
  #editors = new Map();
  #hadPointerDown = false;
  #isCleaningUp = false;
  #isDisabling = false;
  #uiManager;
  static _initialized = false;
  constructor({
    uiManager,
    pageIndex,
    div,
    accessibilityManager,
    annotationLayer,
    viewport,
    l10n
  }) {
    const editorTypes = [_freetext.FreeTextEditor, _ink.InkEditor, _stamp.StampEditor];
    if (!AnnotationEditorLayer._initialized) {
      AnnotationEditorLayer._initialized = true;
      for (const editorType of editorTypes) {
        editorType.initialize(l10n);
      }
    }
    uiManager.registerEditorTypes(editorTypes);
    this.#uiManager = uiManager;
    this.pageIndex = pageIndex;
    this.div = div;
    this.#accessibilityManager = accessibilityManager;
    this.#annotationLayer = annotationLayer;
    this.viewport = viewport;
    this.#uiManager.addLayer(this);
  }
  get isEmpty() {
    return this.#editors.size === 0;
  }
  updateToolbar(mode) {
    this.#uiManager.updateToolbar(mode);
  }
  updateMode(mode = this.#uiManager.getMode()) {
    this.#cleanup();
    if (mode === _util.AnnotationEditorType.INK) {
      this.addInkEditorIfNeeded(false);
      this.disableClick();
    } else {
      this.enableClick();
    }
    if (mode !== _util.AnnotationEditorType.NONE) {
      this.div.classList.toggle("freeTextEditing", mode === _util.AnnotationEditorType.FREETEXT);
      this.div.classList.toggle("inkEditing", mode === _util.AnnotationEditorType.INK);
      this.div.classList.toggle("stampEditing", mode === _util.AnnotationEditorType.STAMP);
      this.div.hidden = false;
    }
  }
  addInkEditorIfNeeded(isCommitting) {
    if (!isCommitting && this.#uiManager.getMode() !== _util.AnnotationEditorType.INK) {
      return;
    }
    if (!isCommitting) {
      for (const editor of this.#editors.values()) {
        if (editor.isEmpty()) {
          editor.setInBackground();
          return;
        }
      }
    }
    const editor = this.#createAndAddNewEditor({
      offsetX: 0,
      offsetY: 0
    }, false);
    editor.setInBackground();
  }
  setEditingState(isEditing) {
    this.#uiManager.setEditingState(isEditing);
  }
  addCommands(params) {
    this.#uiManager.addCommands(params);
  }
  enable() {
    this.div.style.pointerEvents = "auto";
    const annotationElementIds = new Set();
    for (const editor of this.#editors.values()) {
      editor.enableEditing();
      if (editor.annotationElementId) {
        annotationElementIds.add(editor.annotationElementId);
      }
    }
    if (!this.#annotationLayer) {
      return;
    }
    const editables = this.#annotationLayer.getEditableAnnotations();
    for (const editable of editables) {
      editable.hide();
      if (this.#uiManager.isDeletedAnnotationElement(editable.data.id)) {
        continue;
      }
      if (annotationElementIds.has(editable.data.id)) {
        continue;
      }
      const editor = this.deserialize(editable);
      if (!editor) {
        continue;
      }
      this.addOrRebuild(editor);
      editor.enableEditing();
    }
  }
  disable() {
    this.#isDisabling = true;
    this.div.style.pointerEvents = "none";
    const hiddenAnnotationIds = new Set();
    for (const editor of this.#editors.values()) {
      editor.disableEditing();
      if (!editor.annotationElementId || editor.serialize() !== null) {
        hiddenAnnotationIds.add(editor.annotationElementId);
        continue;
      }
      this.getEditableAnnotation(editor.annotationElementId)?.show();
      editor.remove();
    }
    if (this.#annotationLayer) {
      const editables = this.#annotationLayer.getEditableAnnotations();
      for (const editable of editables) {
        const {
          id
        } = editable.data;
        if (hiddenAnnotationIds.has(id) || this.#uiManager.isDeletedAnnotationElement(id)) {
          continue;
        }
        editable.show();
      }
    }
    this.#cleanup();
    if (this.isEmpty) {
      this.div.hidden = true;
    }
    this.#isDisabling = false;
  }
  getEditableAnnotation(id) {
    return this.#annotationLayer?.getEditableAnnotation(id) || null;
  }
  setActiveEditor(editor) {
    const currentActive = this.#uiManager.getActive();
    if (currentActive === editor) {
      return;
    }
    this.#uiManager.setActiveEditor(editor);
  }
  enableClick() {
    this.div.addEventListener("pointerdown", this.#boundPointerdown);
    this.div.addEventListener("pointerup", this.#boundPointerup);
  }
  disableClick() {
    this.div.removeEventListener("pointerdown", this.#boundPointerdown);
    this.div.removeEventListener("pointerup", this.#boundPointerup);
  }
  attach(editor) {
    this.#editors.set(editor.id, editor);
    const {
      annotationElementId
    } = editor;
    if (annotationElementId && this.#uiManager.isDeletedAnnotationElement(annotationElementId)) {
      this.#uiManager.removeDeletedAnnotationElement(editor);
    }
  }
  detach(editor) {
    this.#editors.delete(editor.id);
    this.#accessibilityManager?.removePointerInTextLayer(editor.contentDiv);
    if (!this.#isDisabling && editor.annotationElementId) {
      this.#uiManager.addDeletedAnnotationElement(editor);
    }
  }
  remove(editor) {
    this.detach(editor);
    this.#uiManager.removeEditor(editor);
    if (editor.div.contains(document.activeElement)) {
      setTimeout(() => {
        this.#uiManager.focusMainContainer();
      }, 0);
    }
    editor.div.remove();
    editor.isAttachedToDOM = false;
    if (!this.#isCleaningUp) {
      this.addInkEditorIfNeeded(false);
    }
  }
  changeParent(editor) {
    if (editor.parent === this) {
      return;
    }
    if (editor.annotationElementId) {
      this.#uiManager.addDeletedAnnotationElement(editor.annotationElementId);
      _editor.AnnotationEditor.deleteAnnotationElement(editor);
      editor.annotationElementId = null;
    }
    this.attach(editor);
    editor.parent?.detach(editor);
    editor.setParent(this);
    if (editor.div && editor.isAttachedToDOM) {
      editor.div.remove();
      this.div.append(editor.div);
    }
  }
  add(editor) {
    this.changeParent(editor);
    this.#uiManager.addEditor(editor);
    this.attach(editor);
    if (!editor.isAttachedToDOM) {
      const div = editor.render();
      this.div.append(div);
      editor.isAttachedToDOM = true;
    }
    editor.fixAndSetPosition();
    editor.onceAdded();
    this.#uiManager.addToAnnotationStorage(editor);
  }
  moveEditorInDOM(editor) {
    if (!editor.isAttachedToDOM) {
      return;
    }
    const {
      activeElement
    } = document;
    if (editor.div.contains(activeElement)) {
      editor._focusEventsAllowed = false;
      setTimeout(() => {
        if (!editor.div.contains(document.activeElement)) {
          editor.div.addEventListener("focusin", () => {
            editor._focusEventsAllowed = true;
          }, {
            once: true
          });
          activeElement.focus();
        } else {
          editor._focusEventsAllowed = true;
        }
      }, 0);
    }
    editor._structTreeParentId = this.#accessibilityManager?.moveElementInDOM(this.div, editor.div, editor.contentDiv, true);
  }
  addOrRebuild(editor) {
    if (editor.needsToBeRebuilt()) {
      editor.rebuild();
    } else {
      this.add(editor);
    }
  }
  addUndoableEditor(editor) {
    const cmd = () => editor._uiManager.rebuild(editor);
    const undo = () => {
      editor.remove();
    };
    this.addCommands({
      cmd,
      undo,
      mustExec: false
    });
  }
  getNextId() {
    return this.#uiManager.getId();
  }
  #createNewEditor(params) {
    switch (this.#uiManager.getMode()) {
      case _util.AnnotationEditorType.FREETEXT:
        return new _freetext.FreeTextEditor(params);
      case _util.AnnotationEditorType.INK:
        return new _ink.InkEditor(params);
      case _util.AnnotationEditorType.STAMP:
        return new _stamp.StampEditor(params);
    }
    return null;
  }
  pasteEditor(mode, params) {
    this.#uiManager.updateToolbar(mode);
    this.#uiManager.updateMode(mode);
    const {
      offsetX,
      offsetY
    } = this.#getCenterPoint();
    const id = this.getNextId();
    const editor = this.#createNewEditor({
      parent: this,
      id,
      x: offsetX,
      y: offsetY,
      uiManager: this.#uiManager,
      isCentered: true,
      ...params
    });
    if (editor) {
      this.add(editor);
    }
  }
  deserialize(data) {
    switch (data.annotationType ?? data.annotationEditorType) {
      case _util.AnnotationEditorType.FREETEXT:
        return _freetext.FreeTextEditor.deserialize(data, this, this.#uiManager);
      case _util.AnnotationEditorType.INK:
        return _ink.InkEditor.deserialize(data, this, this.#uiManager);
      case _util.AnnotationEditorType.STAMP:
        return _stamp.StampEditor.deserialize(data, this, this.#uiManager);
    }
    return null;
  }
  #createAndAddNewEditor(event, isCentered) {
    const id = this.getNextId();
    const editor = this.#createNewEditor({
      parent: this,
      id,
      x: event.offsetX,
      y: event.offsetY,
      uiManager: this.#uiManager,
      isCentered
    });
    if (editor) {
      this.add(editor);
    }
    return editor;
  }
  #getCenterPoint() {
    const {
      x,
      y,
      width,
      height
    } = this.div.getBoundingClientRect();
    const tlX = Math.max(0, x);
    const tlY = Math.max(0, y);
    const brX = Math.min(window.innerWidth, x + width);
    const brY = Math.min(window.innerHeight, y + height);
    const centerX = (tlX + brX) / 2 - x;
    const centerY = (tlY + brY) / 2 - y;
    const [offsetX, offsetY] = this.viewport.rotation % 180 === 0 ? [centerX, centerY] : [centerY, centerX];
    return {
      offsetX,
      offsetY
    };
  }
  addNewEditor() {
    this.#createAndAddNewEditor(this.#getCenterPoint(), true);
  }
  setSelected(editor) {
    this.#uiManager.setSelected(editor);
  }
  toggleSelected(editor) {
    this.#uiManager.toggleSelected(editor);
  }
  isSelected(editor) {
    return this.#uiManager.isSelected(editor);
  }
  unselect(editor) {
    this.#uiManager.unselect(editor);
  }
  pointerup(event) {
    const {
      isMac
    } = _util.FeatureTest.platform;
    if (event.button !== 0 || event.ctrlKey && isMac) {
      return;
    }
    if (event.target !== this.div) {
      return;
    }
    if (!this.#hadPointerDown) {
      return;
    }
    this.#hadPointerDown = false;
    if (!this.#allowClick) {
      this.#allowClick = true;
      return;
    }
    if (this.#uiManager.getMode() === _util.AnnotationEditorType.STAMP) {
      this.#uiManager.unselectAll();
      return;
    }
    this.#createAndAddNewEditor(event, false);
  }
  pointerdown(event) {
    if (this.#hadPointerDown) {
      this.#hadPointerDown = false;
      return;
    }
    const {
      isMac
    } = _util.FeatureTest.platform;
    if (event.button !== 0 || event.ctrlKey && isMac) {
      return;
    }
    if (event.target !== this.div) {
      return;
    }
    this.#hadPointerDown = true;
    const editor = this.#uiManager.getActive();
    this.#allowClick = !editor || editor.isEmpty();
  }
  findNewParent(editor, x, y) {
    const layer = this.#uiManager.findParent(x, y);
    if (layer === null || layer === this) {
      return false;
    }
    layer.changeParent(editor);
    return true;
  }
  destroy() {
    if (this.#uiManager.getActive()?.parent === this) {
      this.#uiManager.commitOrRemove();
      this.#uiManager.setActiveEditor(null);
    }
    for (const editor of this.#editors.values()) {
      this.#accessibilityManager?.removePointerInTextLayer(editor.contentDiv);
      editor.setParent(null);
      editor.isAttachedToDOM = false;
      editor.div.remove();
    }
    this.div = null;
    this.#editors.clear();
    this.#uiManager.removeLayer(this);
  }
  #cleanup() {
    this.#isCleaningUp = true;
    for (const editor of this.#editors.values()) {
      if (editor.isEmpty()) {
        editor.remove();
      }
    }
    this.#isCleaningUp = false;
  }
  render({
    viewport
  }) {
    this.viewport = viewport;
    (0, _display_utils.setLayerDimensions)(this.div, viewport);
    for (const editor of this.#uiManager.getEditors(this.pageIndex)) {
      this.add(editor);
    }
    this.updateMode();
  }
  update({
    viewport
  }) {
    this.#uiManager.commitOrRemove();
    this.viewport = viewport;
    (0, _display_utils.setLayerDimensions)(this.div, {
      rotation: viewport.rotation
    });
    this.updateMode();
  }
  get pageDimensions() {
    const {
      pageWidth,
      pageHeight
    } = this.viewport.rawDims;
    return [pageWidth, pageHeight];
  }
}
exports.AnnotationEditorLayer = AnnotationEditorLayer;

/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.FreeTextEditor = void 0;
var _util = __w_pdfjs_require__(1);
var _tools = __w_pdfjs_require__(5);
var _editor = __w_pdfjs_require__(4);
var _annotation_layer = __w_pdfjs_require__(29);
class FreeTextEditor extends _editor.AnnotationEditor {
  #boundEditorDivBlur = this.editorDivBlur.bind(this);
  #boundEditorDivFocus = this.editorDivFocus.bind(this);
  #boundEditorDivInput = this.editorDivInput.bind(this);
  #boundEditorDivKeydown = this.editorDivKeydown.bind(this);
  #color;
  #content = "";
  #editorDivId = `${this.id}-editor`;
  #fontSize;
  #initialData = null;
  static _freeTextDefaultContent = "";
  static _internalPadding = 0;
  static _defaultColor = null;
  static _defaultFontSize = 10;
  static get _keyboardManager() {
    const proto = FreeTextEditor.prototype;
    const arrowChecker = self => self.isEmpty();
    const small = _tools.AnnotationEditorUIManager.TRANSLATE_SMALL;
    const big = _tools.AnnotationEditorUIManager.TRANSLATE_BIG;
    return (0, _util.shadow)(this, "_keyboardManager", new _tools.KeyboardManager([[["ctrl+s", "mac+meta+s", "ctrl+p", "mac+meta+p"], proto.commitOrRemove, {
      bubbles: true
    }], [["ctrl+Enter", "mac+meta+Enter", "Escape", "mac+Escape"], proto.commitOrRemove], [["ArrowLeft", "mac+ArrowLeft"], proto._translateEmpty, {
      args: [-small, 0],
      checker: arrowChecker
    }], [["ctrl+ArrowLeft", "mac+shift+ArrowLeft"], proto._translateEmpty, {
      args: [-big, 0],
      checker: arrowChecker
    }], [["ArrowRight", "mac+ArrowRight"], proto._translateEmpty, {
      args: [small, 0],
      checker: arrowChecker
    }], [["ctrl+ArrowRight", "mac+shift+ArrowRight"], proto._translateEmpty, {
      args: [big, 0],
      checker: arrowChecker
    }], [["ArrowUp", "mac+ArrowUp"], proto._translateEmpty, {
      args: [0, -small],
      checker: arrowChecker
    }], [["ctrl+ArrowUp", "mac+shift+ArrowUp"], proto._translateEmpty, {
      args: [0, -big],
      checker: arrowChecker
    }], [["ArrowDown", "mac+ArrowDown"], proto._translateEmpty, {
      args: [0, small],
      checker: arrowChecker
    }], [["ctrl+ArrowDown", "mac+shift+ArrowDown"], proto._translateEmpty, {
      args: [0, big],
      checker: arrowChecker
    }]]));
  }
  static _type = "freetext";
  constructor(params) {
    super({
      ...params,
      name: "freeTextEditor"
    });
    this.#color = params.color || FreeTextEditor._defaultColor || _editor.AnnotationEditor._defaultLineColor;
    this.#fontSize = params.fontSize || FreeTextEditor._defaultFontSize;
  }
  static initialize(l10n) {
    _editor.AnnotationEditor.initialize(l10n, {
      strings: ["free_text2_default_content", "editor_free_text2_aria_label"]
    });
    const style = getComputedStyle(document.documentElement);
    this._internalPadding = parseFloat(style.getPropertyValue("--freetext-padding"));
  }
  static updateDefaultParams(type, value) {
    switch (type) {
      case _util.AnnotationEditorParamsType.FREETEXT_SIZE:
        FreeTextEditor._defaultFontSize = value;
        break;
      case _util.AnnotationEditorParamsType.FREETEXT_COLOR:
        FreeTextEditor._defaultColor = value;
        break;
    }
  }
  updateParams(type, value) {
    switch (type) {
      case _util.AnnotationEditorParamsType.FREETEXT_SIZE:
        this.#updateFontSize(value);
        break;
      case _util.AnnotationEditorParamsType.FREETEXT_COLOR:
        this.#updateColor(value);
        break;
    }
  }
  static get defaultPropertiesToUpdate() {
    return [[_util.AnnotationEditorParamsType.FREETEXT_SIZE, FreeTextEditor._defaultFontSize], [_util.AnnotationEditorParamsType.FREETEXT_COLOR, FreeTextEditor._defaultColor || _editor.AnnotationEditor._defaultLineColor]];
  }
  get propertiesToUpdate() {
    return [[_util.AnnotationEditorParamsType.FREETEXT_SIZE, this.#fontSize], [_util.AnnotationEditorParamsType.FREETEXT_COLOR, this.#color]];
  }
  #updateFontSize(fontSize) {
    const setFontsize = size => {
      this.editorDiv.style.fontSize = `calc(${size}px * var(--scale-factor))`;
      this.translate(0, -(size - this.#fontSize) * this.parentScale);
      this.#fontSize = size;
      this.#setEditorDimensions();
    };
    const savedFontsize = this.#fontSize;
    this.addCommands({
      cmd: () => {
        setFontsize(fontSize);
      },
      undo: () => {
        setFontsize(savedFontsize);
      },
      mustExec: true,
      type: _util.AnnotationEditorParamsType.FREETEXT_SIZE,
      overwriteIfSameType: true,
      keepUndo: true
    });
  }
  #updateColor(color) {
    const savedColor = this.#color;
    this.addCommands({
      cmd: () => {
        this.#color = this.editorDiv.style.color = color;
      },
      undo: () => {
        this.#color = this.editorDiv.style.color = savedColor;
      },
      mustExec: true,
      type: _util.AnnotationEditorParamsType.FREETEXT_COLOR,
      overwriteIfSameType: true,
      keepUndo: true
    });
  }
  _translateEmpty(x, y) {
    this._uiManager.translateSelectedEditors(x, y, true);
  }
  getInitialTranslation() {
    const scale = this.parentScale;
    return [-FreeTextEditor._internalPadding * scale, -(FreeTextEditor._internalPadding + this.#fontSize) * scale];
  }
  rebuild() {
    if (!this.parent) {
      return;
    }
    super.rebuild();
    if (this.div === null) {
      return;
    }
    if (!this.isAttachedToDOM) {
      this.parent.add(this);
    }
  }
  enableEditMode() {
    if (this.isInEditMode()) {
      return;
    }
    this.parent.setEditingState(false);
    this.parent.updateToolbar(_util.AnnotationEditorType.FREETEXT);
    super.enableEditMode();
    this.overlayDiv.classList.remove("enabled");
    this.editorDiv.contentEditable = true;
    this._isDraggable = false;
    this.div.removeAttribute("aria-activedescendant");
    this.editorDiv.addEventListener("keydown", this.#boundEditorDivKeydown);
    this.editorDiv.addEventListener("focus", this.#boundEditorDivFocus);
    this.editorDiv.addEventListener("blur", this.#boundEditorDivBlur);
    this.editorDiv.addEventListener("input", this.#boundEditorDivInput);
  }
  disableEditMode() {
    if (!this.isInEditMode()) {
      return;
    }
    this.parent.setEditingState(true);
    super.disableEditMode();
    this.overlayDiv.classList.add("enabled");
    this.editorDiv.contentEditable = false;
    this.div.setAttribute("aria-activedescendant", this.#editorDivId);
    this._isDraggable = true;
    this.editorDiv.removeEventListener("keydown", this.#boundEditorDivKeydown);
    this.editorDiv.removeEventListener("focus", this.#boundEditorDivFocus);
    this.editorDiv.removeEventListener("blur", this.#boundEditorDivBlur);
    this.editorDiv.removeEventListener("input", this.#boundEditorDivInput);
    this.div.focus({
      preventScroll: true
    });
    this.isEditing = false;
    this.parent.div.classList.add("freeTextEditing");
  }
  focusin(event) {
    if (!this._focusEventsAllowed) {
      return;
    }
    super.focusin(event);
    if (event.target !== this.editorDiv) {
      this.editorDiv.focus();
    }
  }
  onceAdded() {
    if (this.width) {
      this.#cheatInitialRect();
      return;
    }
    this.enableEditMode();
    this.editorDiv.focus();
    if (this._initialOptions?.isCentered) {
      this.center();
    }
    this._initialOptions = null;
  }
  isEmpty() {
    return !this.editorDiv || this.editorDiv.innerText.trim() === "";
  }
  remove() {
    this.isEditing = false;
    if (this.parent) {
      this.parent.setEditingState(true);
      this.parent.div.classList.add("freeTextEditing");
    }
    super.remove();
  }
  #extractText() {
    const divs = this.editorDiv.getElementsByTagName("div");
    if (divs.length === 0) {
      return this.editorDiv.innerText;
    }
    const buffer = [];
    for (const div of divs) {
      buffer.push(div.innerText.replace(/\r\n?|\n/, ""));
    }
    return buffer.join("\n");
  }
  #setEditorDimensions() {
    const [parentWidth, parentHeight] = this.parentDimensions;
    let rect;
    if (this.isAttachedToDOM) {
      rect = this.div.getBoundingClientRect();
    } else {
      const {
        currentLayer,
        div
      } = this;
      const savedDisplay = div.style.display;
      div.style.display = "hidden";
      currentLayer.div.append(this.div);
      rect = div.getBoundingClientRect();
      div.remove();
      div.style.display = savedDisplay;
    }
    if (this.rotation % 180 === this.parentRotation % 180) {
      this.width = rect.width / parentWidth;
      this.height = rect.height / parentHeight;
    } else {
      this.width = rect.height / parentWidth;
      this.height = rect.width / parentHeight;
    }
    this.fixAndSetPosition();
  }
  commit() {
    if (!this.isInEditMode()) {
      return;
    }
    super.commit();
    this.disableEditMode();
    const savedText = this.#content;
    const newText = this.#content = this.#extractText().trimEnd();
    if (savedText === newText) {
      return;
    }
    const setText = text => {
      this.#content = text;
      if (!text) {
        this.remove();
        return;
      }
      this.#setContent();
      this._uiManager.rebuild(this);
      this.#setEditorDimensions();
    };
    this.addCommands({
      cmd: () => {
        setText(newText);
      },
      undo: () => {
        setText(savedText);
      },
      mustExec: false
    });
    this.#setEditorDimensions();
  }
  shouldGetKeyboardEvents() {
    return this.isInEditMode();
  }
  enterInEditMode() {
    this.enableEditMode();
    this.editorDiv.focus();
  }
  dblclick(event) {
    this.enterInEditMode();
  }
  keydown(event) {
    if (event.target === this.div && event.key === "Enter") {
      this.enterInEditMode();
      event.preventDefault();
    }
  }
  editorDivKeydown(event) {
    FreeTextEditor._keyboardManager.exec(this, event);
  }
  editorDivFocus(event) {
    this.isEditing = true;
  }
  editorDivBlur(event) {
    this.isEditing = false;
  }
  editorDivInput(event) {
    this.parent.div.classList.toggle("freeTextEditing", this.isEmpty());
  }
  disableEditing() {
    this.editorDiv.setAttribute("role", "comment");
    this.editorDiv.removeAttribute("aria-multiline");
  }
  enableEditing() {
    this.editorDiv.setAttribute("role", "textbox");
    this.editorDiv.setAttribute("aria-multiline", true);
  }
  render() {
    if (this.div) {
      return this.div;
    }
    let baseX, baseY;
    if (this.width) {
      baseX = this.x;
      baseY = this.y;
    }
    super.render();
    this.editorDiv = document.createElement("div");
    this.editorDiv.className = "internal";
    this.editorDiv.setAttribute("id", this.#editorDivId);
    this.enableEditing();
    _editor.AnnotationEditor._l10nPromise.get("editor_free_text2_aria_label").then(msg => this.editorDiv?.setAttribute("aria-label", msg));
    _editor.AnnotationEditor._l10nPromise.get("free_text2_default_content").then(msg => this.editorDiv?.setAttribute("default-content", msg));
    this.editorDiv.contentEditable = true;
    const {
      style
    } = this.editorDiv;
    style.fontSize = `calc(${this.#fontSize}px * var(--scale-factor))`;
    style.color = this.#color;
    this.div.append(this.editorDiv);
    this.overlayDiv = document.createElement("div");
    this.overlayDiv.classList.add("overlay", "enabled");
    this.div.append(this.overlayDiv);
    (0, _tools.bindEvents)(this, this.div, ["dblclick", "keydown"]);
    if (this.width) {
      const [parentWidth, parentHeight] = this.parentDimensions;
      if (this.annotationElementId) {
        const {
          position
        } = this.#initialData;
        let [tx, ty] = this.getInitialTranslation();
        [tx, ty] = this.pageTranslationToScreen(tx, ty);
        const [pageWidth, pageHeight] = this.pageDimensions;
        const [pageX, pageY] = this.pageTranslation;
        let posX, posY;
        switch (this.rotation) {
          case 0:
            posX = baseX + (position[0] - pageX) / pageWidth;
            posY = baseY + this.height - (position[1] - pageY) / pageHeight;
            break;
          case 90:
            posX = baseX + (position[0] - pageX) / pageWidth;
            posY = baseY - (position[1] - pageY) / pageHeight;
            [tx, ty] = [ty, -tx];
            break;
          case 180:
            posX = baseX - this.width + (position[0] - pageX) / pageWidth;
            posY = baseY - (position[1] - pageY) / pageHeight;
            [tx, ty] = [-tx, -ty];
            break;
          case 270:
            posX = baseX + (position[0] - pageX - this.height * pageHeight) / pageWidth;
            posY = baseY + (position[1] - pageY - this.width * pageWidth) / pageHeight;
            [tx, ty] = [-ty, tx];
            break;
        }
        this.setAt(posX * parentWidth, posY * parentHeight, tx, ty);
      } else {
        this.setAt(baseX * parentWidth, baseY * parentHeight, this.width * parentWidth, this.height * parentHeight);
      }
      this.#setContent();
      this._isDraggable = true;
      this.editorDiv.contentEditable = false;
    } else {
      this._isDraggable = false;
      this.editorDiv.contentEditable = true;
    }
    return this.div;
  }
  #setContent() {
    this.editorDiv.replaceChildren();
    if (!this.#content) {
      return;
    }
    for (const line of this.#content.split("\n")) {
      const div = document.createElement("div");
      div.append(line ? document.createTextNode(line) : document.createElement("br"));
      this.editorDiv.append(div);
    }
  }
  get contentDiv() {
    return this.editorDiv;
  }
  static deserialize(data, parent, uiManager) {
    let initialData = null;
    if (data instanceof _annotation_layer.FreeTextAnnotationElement) {
      const {
        data: {
          defaultAppearanceData: {
            fontSize,
            fontColor
          },
          rect,
          rotation,
          id
        },
        textContent,
        textPosition,
        parent: {
          page: {
            pageNumber
          }
        }
      } = data;
      if (!textContent || textContent.length === 0) {
        return null;
      }
      initialData = data = {
        annotationType: _util.AnnotationEditorType.FREETEXT,
        color: Array.from(fontColor),
        fontSize,
        value: textContent.join("\n"),
        position: textPosition,
        pageIndex: pageNumber - 1,
        rect,
        rotation,
        id,
        deleted: false
      };
    }
    const editor = super.deserialize(data, parent, uiManager);
    editor.#fontSize = data.fontSize;
    editor.#color = _util.Util.makeHexColor(...data.color);
    editor.#content = data.value;
    editor.annotationElementId = data.id || null;
    editor.#initialData = initialData;
    return editor;
  }
  serialize(isForCopying = false) {
    if (this.isEmpty()) {
      return null;
    }
    if (this.deleted) {
      return {
        pageIndex: this.pageIndex,
        id: this.annotationElementId,
        deleted: true
      };
    }
    const padding = FreeTextEditor._internalPadding * this.parentScale;
    const rect = this.getRect(padding, padding);
    const color = _editor.AnnotationEditor._colorManager.convert(this.isAttachedToDOM ? getComputedStyle(this.editorDiv).color : this.#color);
    const serialized = {
      annotationType: _util.AnnotationEditorType.FREETEXT,
      color,
      fontSize: this.#fontSize,
      value: this.#content,
      pageIndex: this.pageIndex,
      rect,
      rotation: this.rotation,
      structTreeParentId: this._structTreeParentId
    };
    if (isForCopying) {
      return serialized;
    }
    if (this.annotationElementId && !this.#hasElementChanged(serialized)) {
      return null;
    }
    serialized.id = this.annotationElementId;
    return serialized;
  }
  #hasElementChanged(serialized) {
    const {
      value,
      fontSize,
      color,
      rect,
      pageIndex
    } = this.#initialData;
    return serialized.value !== value || serialized.fontSize !== fontSize || serialized.rect.some((x, i) => Math.abs(x - rect[i]) >= 1) || serialized.color.some((c, i) => c !== color[i]) || serialized.pageIndex !== pageIndex;
  }
  #cheatInitialRect(delayed = false) {
    if (!this.annotationElementId) {
      return;
    }
    this.#setEditorDimensions();
    if (!delayed && (this.width === 0 || this.height === 0)) {
      setTimeout(() => this.#cheatInitialRect(true), 0);
      return;
    }
    const padding = FreeTextEditor._internalPadding * this.parentScale;
    this.#initialData.rect = this.getRect(padding, padding);
  }
}
exports.FreeTextEditor = FreeTextEditor;

/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StampAnnotationElement = exports.InkAnnotationElement = exports.FreeTextAnnotationElement = exports.AnnotationLayer = void 0;
var _util = __w_pdfjs_require__(1);
var _display_utils = __w_pdfjs_require__(6);
var _annotation_storage = __w_pdfjs_require__(3);
var _scripting_utils = __w_pdfjs_require__(30);
var _displayL10n_utils = __w_pdfjs_require__(31);
var _xfa_layer = __w_pdfjs_require__(32);
const DEFAULT_TAB_INDEX = 1000;
const DEFAULT_FONT_SIZE = 9;
const GetElementsByNameSet = new WeakSet();
function getRectDims(rect) {
  return {
    width: rect[2] - rect[0],
    height: rect[3] - rect[1]
  };
}
class AnnotationElementFactory {
  static create(parameters) {
    const subtype = parameters.data.annotationType;
    switch (subtype) {
      case _util.AnnotationType.LINK:
        return new LinkAnnotationElement(parameters);
      case _util.AnnotationType.TEXT:
        return new TextAnnotationElement(parameters);
      case _util.AnnotationType.WIDGET:
        const fieldType = parameters.data.fieldType;
        switch (fieldType) {
          case "Tx":
            return new TextWidgetAnnotationElement(parameters);
          case "Btn":
            if (parameters.data.radioButton) {
              return new RadioButtonWidgetAnnotationElement(parameters);
            } else if (parameters.data.checkBox) {
              return new CheckboxWidgetAnnotationElement(parameters);
            }
            return new PushButtonWidgetAnnotationElement(parameters);
          case "Ch":
            return new ChoiceWidgetAnnotationElement(parameters);
          case "Sig":
            return new SignatureWidgetAnnotationElement(parameters);
        }
        return new WidgetAnnotationElement(parameters);
      case _util.AnnotationType.POPUP:
        return new PopupAnnotationElement(parameters);
      case _util.AnnotationType.FREETEXT:
        return new FreeTextAnnotationElement(parameters);
      case _util.AnnotationType.LINE:
        return new LineAnnotationElement(parameters);
      case _util.AnnotationType.SQUARE:
        return new SquareAnnotationElement(parameters);
      case _util.AnnotationType.CIRCLE:
        return new CircleAnnotationElement(parameters);
      case _util.AnnotationType.POLYLINE:
        return new PolylineAnnotationElement(parameters);
      case _util.AnnotationType.CARET:
        return new CaretAnnotationElement(parameters);
      case _util.AnnotationType.INK:
        return new InkAnnotationElement(parameters);
      case _util.AnnotationType.POLYGON:
        return new PolygonAnnotationElement(parameters);
      case _util.AnnotationType.HIGHLIGHT:
        return new HighlightAnnotationElement(parameters);
      case _util.AnnotationType.UNDERLINE:
        return new UnderlineAnnotationElement(parameters);
      case _util.AnnotationType.SQUIGGLY:
        return new SquigglyAnnotationElement(parameters);
      case _util.AnnotationType.STRIKEOUT:
        return new StrikeOutAnnotationElement(parameters);
      case _util.AnnotationType.STAMP:
        return new StampAnnotationElement(parameters);
      case _util.AnnotationType.FILEATTACHMENT:
        return new FileAttachmentAnnotationElement(parameters);
      default:
        return new AnnotationElement(parameters);
    }
  }
}
class AnnotationElement {
  #hasBorder = false;
  constructor(parameters, {
    isRenderable = false,
    ignoreBorder = false,
    createQuadrilaterals = false
  } = {}) {
    this.isRenderable = isRenderable;
    this.data = parameters.data;
    this.layer = parameters.layer;
    this.linkService = parameters.linkService;
    this.downloadManager = parameters.downloadManager;
    this.imageResourcesPath = parameters.imageResourcesPath;
    this.renderForms = parameters.renderForms;
    this.svgFactory = parameters.svgFactory;
    this.annotationStorage = parameters.annotationStorage;
    this.enableScripting = parameters.enableScripting;
    this.hasJSActions = parameters.hasJSActions;
    this._fieldObjects = parameters.fieldObjects;
    this.parent = parameters.parent;
    if (isRenderable) {
      this.container = this._createContainer(ignoreBorder);
    }
    if (createQuadrilaterals) {
      this._createQuadrilaterals();
    }
  }
  static _hasPopupData({
    titleObj,
    contentsObj,
    richText
  }) {
    return !!(titleObj?.str || contentsObj?.str || richText?.str);
  }
  get hasPopupData() {
    return AnnotationElement._hasPopupData(this.data);
  }
  _createContainer(ignoreBorder) {
    const {
      data,
      parent: {
        page,
        viewport
      }
    } = this;
    const container = document.createElement("section");
    container.setAttribute("data-annotation-id", data.id);
    if (!(this instanceof WidgetAnnotationElement)) {
      container.tabIndex = DEFAULT_TAB_INDEX;
    }
    container.style.zIndex = this.parent.zIndex++;
    if (this.data.popupRef) {
      container.setAttribute("aria-haspopup", "dialog");
    }
    if (data.noRotate) {
      container.classList.add("norotate");
    }
    const {
      pageWidth,
      pageHeight,
      pageX,
      pageY
    } = viewport.rawDims;
    if (!data.rect || this instanceof PopupAnnotationElement) {
      const {
        rotation
      } = data;
      if (!data.hasOwnCanvas && rotation !== 0) {
        this.setRotation(rotation, container);
      }
      return container;
    }
    const {
      width,
      height
    } = getRectDims(data.rect);
    const rect = _util.Util.normalizeRect([data.rect[0], page.view[3] - data.rect[1] + page.view[1], data.rect[2], page.view[3] - data.rect[3] + page.view[1]]);
    if (!ignoreBorder && data.borderStyle.width > 0) {
      container.style.borderWidth = `${data.borderStyle.width}px`;
      const horizontalRadius = data.borderStyle.horizontalCornerRadius;
      const verticalRadius = data.borderStyle.verticalCornerRadius;
      if (horizontalRadius > 0 || verticalRadius > 0) {
        const radius = `calc(${horizontalRadius}px * var(--scale-factor)) / calc(${verticalRadius}px * var(--scale-factor))`;
        container.style.borderRadius = radius;
      } else if (this instanceof RadioButtonWidgetAnnotationElement) {
        const radius = `calc(${width}px * var(--scale-factor)) / calc(${height}px * var(--scale-factor))`;
        container.style.borderRadius = radius;
      }
      switch (data.borderStyle.style) {
        case _util.AnnotationBorderStyleType.SOLID:
          container.style.borderStyle = "solid";
          break;
        case _util.AnnotationBorderStyleType.DASHED:
          container.style.borderStyle = "dashed";
          break;
        case _util.AnnotationBorderStyleType.BEVELED:
          (0, _util.warn)("Unimplemented border style: beveled");
          break;
        case _util.AnnotationBorderStyleType.INSET:
          (0, _util.warn)("Unimplemented border style: inset");
          break;
        case _util.AnnotationBorderStyleType.UNDERLINE:
          container.style.borderBottomStyle = "solid";
          break;
        default:
          break;
      }
      const borderColor = data.borderColor || null;
      if (borderColor) {
        this.#hasBorder = true;
        container.style.borderColor = _util.Util.makeHexColor(borderColor[0] | 0, borderColor[1] | 0, borderColor[2] | 0);
      } else {
        container.style.borderWidth = 0;
      }
    }
    container.style.left = `${100 * (rect[0] - pageX) / pageWidth}%`;
    container.style.top = `${100 * (rect[1] - pageY) / pageHeight}%`;
    const {
      rotation
    } = data;
    if (data.hasOwnCanvas || rotation === 0) {
      container.style.width = `${100 * width / pageWidth}%`;
      container.style.height = `${100 * height / pageHeight}%`;
    } else {
      this.setRotation(rotation, container);
    }
    return container;
  }
  setRotation(angle, container = this.container) {
    if (!this.data.rect) {
      return;
    }
    const {
      pageWidth,
      pageHeight
    } = this.parent.viewport.rawDims;
    const {
      width,
      height
    } = getRectDims(this.data.rect);
    let elementWidth, elementHeight;
    if (angle % 180 === 0) {
      elementWidth = 100 * width / pageWidth;
      elementHeight = 100 * height / pageHeight;
    } else {
      elementWidth = 100 * height / pageWidth;
      elementHeight = 100 * width / pageHeight;
    }
    container.style.width = `${elementWidth}%`;
    container.style.height = `${elementHeight}%`;
    container.setAttribute("data-main-rotation", (360 - angle) % 360);
  }
  get _commonActions() {
    const setColor = (jsName, styleName, event) => {
      const color = event.detail[jsName];
      const colorType = color[0];
      const colorArray = color.slice(1);
      event.target.style[styleName] = _scripting_utils.ColorConverters[`${colorType}_HTML`](colorArray);
      this.annotationStorage.setValue(this.data.id, {
        [styleName]: _scripting_utils.ColorConverters[`${colorType}_rgb`](colorArray)
      });
    };
    return (0, _util.shadow)(this, "_commonActions", {
      display: event => {
        const {
          display
        } = event.detail;
        const hidden = display % 2 === 1;
        this.container.style.visibility = hidden ? "hidden" : "visible";
        this.annotationStorage.setValue(this.data.id, {
          noView: hidden,
          noPrint: display === 1 || display === 2
        });
      },
      print: event => {
        this.annotationStorage.setValue(this.data.id, {
          noPrint: !event.detail.print
        });
      },
      hidden: event => {
        const {
          hidden
        } = event.detail;
        this.container.style.visibility = hidden ? "hidden" : "visible";
        this.annotationStorage.setValue(this.data.id, {
          noPrint: hidden,
          noView: hidden
        });
      },
      focus: event => {
        setTimeout(() => event.target.focus({
          preventScroll: false
        }), 0);
      },
      userName: event => {
        event.target.title = event.detail.userName;
      },
      readonly: event => {
        event.target.disabled = event.detail.readonly;
      },
      required: event => {
        this._setRequired(event.target, event.detail.required);
      },
      bgColor: event => {
        setColor("bgColor", "backgroundColor", event);
      },
      fillColor: event => {
        setColor("fillColor", "backgroundColor", event);
      },
      fgColor: event => {
        setColor("fgColor", "color", event);
      },
      textColor: event => {
        setColor("textColor", "color", event);
      },
      borderColor: event => {
        setColor("borderColor", "borderColor", event);
      },
      strokeColor: event => {
        setColor("strokeColor", "borderColor", event);
      },
      rotation: event => {
        const angle = event.detail.rotation;
        this.setRotation(angle);
        this.annotationStorage.setValue(this.data.id, {
          rotation: angle
        });
      }
    });
  }
  _dispatchEventFromSandbox(actions, jsEvent) {
    const commonActions = this._commonActions;
    for (const name of Object.keys(jsEvent.detail)) {
      const action = actions[name] || commonActions[name];
      action?.(jsEvent);
    }
  }
  _setDefaultPropertiesFromJS(element) {
    if (!this.enableScripting) {
      return;
    }
    const storedData = this.annotationStorage.getRawValue(this.data.id);
    if (!storedData) {
      return;
    }
    const commonActions = this._commonActions;
    for (const [actionName, detail] of Object.entries(storedData)) {
      const action = commonActions[actionName];
      if (action) {
        const eventProxy = {
          detail: {
            [actionName]: detail
          },
          target: element
        };
        action(eventProxy);
        delete storedData[actionName];
      }
    }
  }
  _createQuadrilaterals() {
    if (!this.container) {
      return;
    }
    const {
      quadPoints
    } = this.data;
    if (!quadPoints) {
      return;
    }
    const [rectBlX, rectBlY, rectTrX, rectTrY] = this.data.rect;
    if (quadPoints.length === 1) {
      const [, {
        x: trX,
        y: trY
      }, {
        x: blX,
        y: blY
      }] = quadPoints[0];
      if (rectTrX === trX && rectTrY === trY && rectBlX === blX && rectBlY === blY) {
        return;
      }
    }
    const {
      style
    } = this.container;
    let svgBuffer;
    if (this.#hasBorder) {
      const {
        borderColor,
        borderWidth
      } = style;
      style.borderWidth = 0;
      svgBuffer = ["url('data:image/svg+xml;utf8,", `<svg xmlns="http://www.w3.org/2000/svg"`, ` preserveAspectRatio="none" viewBox="0 0 1 1">`, `<g fill="transparent" stroke="${borderColor}" stroke-width="${borderWidth}">`];
      this.container.classList.add("hasBorder");
    }
    const width = rectTrX - rectBlX;
    const height = rectTrY - rectBlY;
    const {
      svgFactory
    } = this;
    const svg = svgFactory.createElement("svg");
    svg.classList.add("quadrilateralsContainer");
    svg.setAttribute("width", 0);
    svg.setAttribute("height", 0);
    const defs = svgFactory.createElement("defs");
    svg.append(defs);
    const clipPath = svgFactory.createElement("clipPath");
    const id = `clippath_${this.data.id}`;
    clipPath.setAttribute("id", id);
    clipPath.setAttribute("clipPathUnits", "objectBoundingBox");
    defs.append(clipPath);
    for (const [, {
      x: trX,
      y: trY
    }, {
      x: blX,
      y: blY
    }] of quadPoints) {
      const rect = svgFactory.createElement("rect");
      const x = (blX - rectBlX) / width;
      const y = (rectTrY - trY) / height;
      const rectWidth = (trX - blX) / width;
      const rectHeight = (trY - blY) / height;
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", rectWidth);
      rect.setAttribute("height", rectHeight);
      clipPath.append(rect);
      svgBuffer?.push(`<rect vector-effect="non-scaling-stroke" x="${x}" y="${y}" width="${rectWidth}" height="${rectHeight}"/>`);
    }
    if (this.#hasBorder) {
      svgBuffer.push(`</g></svg>')`);
      style.backgroundImage = svgBuffer.join("");
    }
    this.container.append(svg);
    this.container.style.clipPath = `url(#${id})`;
  }
  _createPopup() {
    const {
      container,
      data
    } = this;
    container.setAttribute("aria-haspopup", "dialog");
    const popup = new PopupAnnotationElement({
      data: {
        color: data.color,
        titleObj: data.titleObj,
        modificationDate: data.modificationDate,
        contentsObj: data.contentsObj,
        richText: data.richText,
        parentRect: data.rect,
        borderStyle: 0,
        id: `popup_${data.id}`,
        rotation: data.rotation
      },
      parent: this.parent,
      elements: [this]
    });
    this.parent.div.append(popup.render());
  }
  render() {
    (0, _util.unreachable)("Abstract method `AnnotationElement.render` called");
  }
  _getElementsByName(name, skipId = null) {
    const fields = [];
    if (this._fieldObjects) {
      const fieldObj = this._fieldObjects[name];
      if (fieldObj) {
        for (const {
          page,
          id,
          exportValues
        } of fieldObj) {
          if (page === -1) {
            continue;
          }
          if (id === skipId) {
            continue;
          }
          const exportValue = typeof exportValues === "string" ? exportValues : null;
          const domElement = document.querySelector(`[data-element-id="${id}"]`);
          if (domElement && !GetElementsByNameSet.has(domElement)) {
            (0, _util.warn)(`_getElementsByName - element not allowed: ${id}`);
            continue;
          }
          fields.push({
            id,
            exportValue,
            domElement
          });
        }
      }
      return fields;
    }
    for (const domElement of document.getElementsByName(name)) {
      const {
        exportValue
      } = domElement;
      const id = domElement.getAttribute("data-element-id");
      if (id === skipId) {
        continue;
      }
      if (!GetElementsByNameSet.has(domElement)) {
        continue;
      }
      fields.push({
        id,
        exportValue,
        domElement
      });
    }
    return fields;
  }
  show() {
    if (this.container) {
      this.container.hidden = false;
    }
    this.popup?.maybeShow();
  }
  hide() {
    if (this.container) {
      this.container.hidden = true;
    }
    this.popup?.forceHide();
  }
  getElementsToTriggerPopup() {
    return this.container;
  }
  addHighlightArea() {
    const triggers = this.getElementsToTriggerPopup();
    if (Array.isArray(triggers)) {
      for (const element of triggers) {
        element.classList.add("highlightArea");
      }
    } else {
      triggers.classList.add("highlightArea");
    }
  }
  _editOnDoubleClick() {
    const {
      annotationEditorType: mode,
      data: {
        id: editId
      }
    } = this;
    this.container.addEventListener("dblclick", () => {
      this.linkService.eventBus?.dispatch("switchannotationeditormode", {
        source: this,
        mode,
        editId
      });
    });
  }
}
class LinkAnnotationElement extends AnnotationElement {
  constructor(parameters, options = null) {
    super(parameters, {
      isRenderable: true,
      ignoreBorder: !!options?.ignoreBorder,
      createQuadrilaterals: true
    });
    this.isTooltipOnly = parameters.data.isTooltipOnly;
  }
  render() {
    const {
      data,
      linkService
    } = this;
    const link = document.createElement("a");
    link.setAttribute("data-element-id", data.id);
    let isBound = false;
    if (data.url) {
      linkService.addLinkAttributes(link, data.url, data.newWindow);
      isBound = true;
    } else if (data.action) {
      this._bindNamedAction(link, data.action);
      isBound = true;
    } else if (data.attachment) {
      this._bindAttachment(link, data.attachment);
      isBound = true;
    } else if (data.setOCGState) {
      this.#bindSetOCGState(link, data.setOCGState);
      isBound = true;
    } else if (data.dest) {
      this._bindLink(link, data.dest);
      isBound = true;
    } else {
      if (data.actions && (data.actions.Action || data.actions["Mouse Up"] || data.actions["Mouse Down"]) && this.enableScripting && this.hasJSActions) {
        this._bindJSAction(link, data);
        isBound = true;
      }
      if (data.resetForm) {
        this._bindResetFormAction(link, data.resetForm);
        isBound = true;
      } else if (this.isTooltipOnly && !isBound) {
        this._bindLink(link, "");
        isBound = true;
      }
    }
    this.container.classList.add("linkAnnotation");
    if (isBound) {
      this.container.append(link);
    }
    return this.container;
  }
  #setInternalLink() {
    this.container.setAttribute("data-internal-link", "");
  }
  _bindLink(link, destination) {
    link.href = this.linkService.getDestinationHash(destination);
    link.onclick = () => {
      if (destination) {
        this.linkService.goToDestination(destination);
      }
      return false;
    };
    if (destination || destination === "") {
      this.#setInternalLink();
    }
  }
  _bindNamedAction(link, action) {
    link.href = this.linkService.getAnchorUrl("");
    link.onclick = () => {
      this.linkService.executeNamedAction(action);
      return false;
    };
    this.#setInternalLink();
  }
  _bindAttachment(link, attachment) {
    link.href = this.linkService.getAnchorUrl("");
    link.onclick = () => {
      this.downloadManager?.openOrDownloadData(this.container, attachment.content, attachment.filename);
      return false;
    };
    this.#setInternalLink();
  }
  #bindSetOCGState(link, action) {
    link.href = this.linkService.getAnchorUrl("");
    link.onclick = () => {
      this.linkService.executeSetOCGState(action);
      return false;
    };
    this.#setInternalLink();
  }
  _bindJSAction(link, data) {
    link.href = this.linkService.getAnchorUrl("");
    const map = new Map([["Action", "onclick"], ["Mouse Up", "onmouseup"], ["Mouse Down", "onmousedown"]]);
    for (const name of Object.keys(data.actions)) {
      const jsName = map.get(name);
      if (!jsName) {
        continue;
      }
      link[jsName] = () => {
        this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
          source: this,
          detail: {
            id: data.id,
            name
          }
        });
        return false;
      };
    }
    if (!link.onclick) {
      link.onclick = () => false;
    }
    this.#setInternalLink();
  }
  _bindResetFormAction(link, resetForm) {
    const otherClickAction = link.onclick;
    if (!otherClickAction) {
      link.href = this.linkService.getAnchorUrl("");
    }
    this.#setInternalLink();
    if (!this._fieldObjects) {
      (0, _util.warn)(`_bindResetFormAction - "resetForm" action not supported, ` + "ensure that the `fieldObjects` parameter is provided.");
      if (!otherClickAction) {
        link.onclick = () => false;
      }
      return;
    }
    link.onclick = () => {
      otherClickAction?.();
      const {
        fields: resetFormFields,
        refs: resetFormRefs,
        include
      } = resetForm;
      const allFields = [];
      if (resetFormFields.length !== 0 || resetFormRefs.length !== 0) {
        const fieldIds = new Set(resetFormRefs);
        for (const fieldName of resetFormFields) {
          const fields = this._fieldObjects[fieldName] || [];
          for (const {
            id
          } of fields) {
            fieldIds.add(id);
          }
        }
        for (const fields of Object.values(this._fieldObjects)) {
          for (const field of fields) {
            if (fieldIds.has(field.id) === include) {
              allFields.push(field);
            }
          }
        }
      } else {
        for (const fields of Object.values(this._fieldObjects)) {
          allFields.push(...fields);
        }
      }
      const storage = this.annotationStorage;
      const allIds = [];
      for (const field of allFields) {
        const {
          id
        } = field;
        allIds.push(id);
        switch (field.type) {
          case "text":
            {
              const value = field.defaultValue || "";
              storage.setValue(id, {
                value
              });
              break;
            }
          case "checkbox":
          case "radiobutton":
            {
              const value = field.defaultValue === field.exportValues;
              storage.setValue(id, {
                value
              });
              break;
            }
          case "combobox":
          case "listbox":
            {
              const value = field.defaultValue || "";
              storage.setValue(id, {
                value
              });
              break;
            }
          default:
            continue;
        }
        const domElement = document.querySelector(`[data-element-id="${id}"]`);
        if (!domElement) {
          continue;
        } else if (!GetElementsByNameSet.has(domElement)) {
          (0, _util.warn)(`_bindResetFormAction - element not allowed: ${id}`);
          continue;
        }
        domElement.dispatchEvent(new Event("resetform"));
      }
      if (this.enableScripting) {
        this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
          source: this,
          detail: {
            id: "app",
            ids: allIds,
            name: "ResetForm"
          }
        });
      }
      return false;
    };
  }
}
class TextAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: true
    });
  }
  render() {
    this.container.classList.add("textAnnotation");
    const image = document.createElement("img");
    image.src = this.imageResourcesPath + "annotation-" + this.data.name.toLowerCase() + ".svg";
    image.alt = "[{{type}} Annotation]";
    image.dataset.l10nId = "text_annotation_type";
    image.dataset.l10nArgs = JSON.stringify({
      type: this.data.name
    });
    if (!this.data.popupRef && this.hasPopupData) {
      this._createPopup();
    }
    this.container.append(image);
    return this.container;
  }
}
class WidgetAnnotationElement extends AnnotationElement {
  render() {
    if (this.data.alternativeText) {
      this.container.title = this.data.alternativeText;
    }
    return this.container;
  }
  showElementAndHideCanvas(element) {
    if (this.data.hasOwnCanvas) {
      if (element.previousSibling?.nodeName === "CANVAS") {
        element.previousSibling.hidden = true;
      }
      element.hidden = false;
    }
  }
  _getKeyModifier(event) {
    const {
      isWin,
      isMac
    } = _util.FeatureTest.platform;
    return isWin && event.ctrlKey || isMac && event.metaKey;
  }
  _setEventListener(element, elementData, baseName, eventName, valueGetter) {
    if (baseName.includes("mouse")) {
      element.addEventListener(baseName, event => {
        this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
          source: this,
          detail: {
            id: this.data.id,
            name: eventName,
            value: valueGetter(event),
            shift: event.shiftKey,
            modifier: this._getKeyModifier(event)
          }
        });
      });
    } else {
      element.addEventListener(baseName, event => {
        if (baseName === "blur") {
          if (!elementData.focused || !event.relatedTarget) {
            return;
          }
          elementData.focused = false;
        } else if (baseName === "focus") {
          if (elementData.focused) {
            return;
          }
          elementData.focused = true;
        }
        if (!valueGetter) {
          return;
        }
        this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
          source: this,
          detail: {
            id: this.data.id,
            name: eventName,
            value: valueGetter(event)
          }
        });
      });
    }
  }
  _setEventListeners(element, elementData, names, getter) {
    for (const [baseName, eventName] of names) {
      if (eventName === "Action" || this.data.actions?.[eventName]) {
        if (eventName === "Focus" || eventName === "Blur") {
          elementData ||= {
            focused: false
          };
        }
        this._setEventListener(element, elementData, baseName, eventName, getter);
        if (eventName === "Focus" && !this.data.actions?.Blur) {
          this._setEventListener(element, elementData, "blur", "Blur", null);
        } else if (eventName === "Blur" && !this.data.actions?.Focus) {
          this._setEventListener(element, elementData, "focus", "Focus", null);
        }
      }
    }
  }
  _setBackgroundColor(element) {
    const color = this.data.backgroundColor || null;
    element.style.backgroundColor = color === null ? "transparent" : _util.Util.makeHexColor(color[0], color[1], color[2]);
  }
  _setTextStyle(element) {
    const TEXT_ALIGNMENT = ["left", "center", "right"];
    const {
      fontColor
    } = this.data.defaultAppearanceData;
    const fontSize = this.data.defaultAppearanceData.fontSize || DEFAULT_FONT_SIZE;
    const style = element.style;
    let computedFontSize;
    const BORDER_SIZE = 2;
    const roundToOneDecimal = x => Math.round(10 * x) / 10;
    if (this.data.multiLine) {
      const height = Math.abs(this.data.rect[3] - this.data.rect[1] - BORDER_SIZE);
      const numberOfLines = Math.round(height / (_util.LINE_FACTOR * fontSize)) || 1;
      const lineHeight = height / numberOfLines;
      computedFontSize = Math.min(fontSize, roundToOneDecimal(lineHeight / _util.LINE_FACTOR));
    } else {
      const height = Math.abs(this.data.rect[3] - this.data.rect[1] - BORDER_SIZE);
      computedFontSize = Math.min(fontSize, roundToOneDecimal(height / _util.LINE_FACTOR));
    }
    style.fontSize = `calc(${computedFontSize}px * var(--scale-factor))`;
    style.color = _util.Util.makeHexColor(fontColor[0], fontColor[1], fontColor[2]);
    if (this.data.textAlignment !== null) {
      style.textAlign = TEXT_ALIGNMENT[this.data.textAlignment];
    }
  }
  _setRequired(element, isRequired) {
    if (isRequired) {
      element.setAttribute("required", true);
    } else {
      element.removeAttribute("required");
    }
    element.setAttribute("aria-required", isRequired);
  }
}
class TextWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    const isRenderable = parameters.renderForms || !parameters.data.hasAppearance && !!parameters.data.fieldValue;
    super(parameters, {
      isRenderable
    });
  }
  setPropertyOnSiblings(base, key, value, keyInStorage) {
    const storage = this.annotationStorage;
    for (const element of this._getElementsByName(base.name, base.id)) {
      if (element.domElement) {
        element.domElement[key] = value;
      }
      storage.setValue(element.id, {
        [keyInStorage]: value
      });
    }
  }
  render() {
    const storage = this.annotationStorage;
    const id = this.data.id;
    this.container.classList.add("textWidgetAnnotation");
    let element = null;
    if (this.renderForms) {
      const storedData = storage.getValue(id, {
        value: this.data.fieldValue
      });
      let textContent = storedData.value || "";
      const maxLen = storage.getValue(id, {
        charLimit: this.data.maxLen
      }).charLimit;
      if (maxLen && textContent.length > maxLen) {
        textContent = textContent.slice(0, maxLen);
      }
      let fieldFormattedValues = storedData.formattedValue || this.data.textContent?.join("\n") || null;
      if (fieldFormattedValues && this.data.comb) {
        fieldFormattedValues = fieldFormattedValues.replaceAll(/\s+/g, "");
      }
      const elementData = {
        userValue: textContent,
        formattedValue: fieldFormattedValues,
        lastCommittedValue: null,
        commitKey: 1,
        focused: false
      };
      if (this.data.multiLine) {
        element = document.createElement("textarea");
        element.textContent = fieldFormattedValues ?? textContent;
        if (this.data.doNotScroll) {
          element.style.overflowY = "hidden";
        }
      } else {
        element = document.createElement("input");
        element.type = "text";
        element.setAttribute("value", fieldFormattedValues ?? textContent);
        if (this.data.doNotScroll) {
          element.style.overflowX = "hidden";
        }
      }
      if (this.data.hasOwnCanvas) {
        element.hidden = true;
      }
      GetElementsByNameSet.add(element);
      element.setAttribute("data-element-id", id);
      element.disabled = this.data.readOnly;
      element.name = this.data.fieldName;
      element.tabIndex = DEFAULT_TAB_INDEX;
      this._setRequired(element, this.data.required);
      if (maxLen) {
        element.maxLength = maxLen;
      }
      element.addEventListener("input", event => {
        storage.setValue(id, {
          value: event.target.value
        });
        this.setPropertyOnSiblings(element, "value", event.target.value, "value");
        elementData.formattedValue = null;
      });
      element.addEventListener("resetform", event => {
        const defaultValue = this.data.defaultFieldValue ?? "";
        element.value = elementData.userValue = defaultValue;
        elementData.formattedValue = null;
      });
      let blurListener = event => {
        const {
          formattedValue
        } = elementData;
        if (formattedValue !== null && formattedValue !== undefined) {
          event.target.value = formattedValue;
        }
        event.target.scrollLeft = 0;
      };
      if (this.enableScripting && this.hasJSActions) {
        element.addEventListener("focus", event => {
          if (elementData.focused) {
            return;
          }
          const {
            target
          } = event;
          if (elementData.userValue) {
            target.value = elementData.userValue;
          }
          elementData.lastCommittedValue = target.value;
          elementData.commitKey = 1;
          elementData.focused = true;
        });
        element.addEventListener("updatefromsandbox", jsEvent => {
          this.showElementAndHideCanvas(jsEvent.target);
          const actions = {
            value(event) {
              elementData.userValue = event.detail.value ?? "";
              storage.setValue(id, {
                value: elementData.userValue.toString()
              });
              event.target.value = elementData.userValue;
            },
            formattedValue(event) {
              const {
                formattedValue
              } = event.detail;
              elementData.formattedValue = formattedValue;
              if (formattedValue !== null && formattedValue !== undefined && event.target !== document.activeElement) {
                event.target.value = formattedValue;
              }
              storage.setValue(id, {
                formattedValue
              });
            },
            selRange(event) {
              event.target.setSelectionRange(...event.detail.selRange);
            },
            charLimit: event => {
              const {
                charLimit
              } = event.detail;
              const {
                target
              } = event;
              if (charLimit === 0) {
                target.removeAttribute("maxLength");
                return;
              }
              target.setAttribute("maxLength", charLimit);
              let value = elementData.userValue;
              if (!value || value.length <= charLimit) {
                return;
              }
              value = value.slice(0, charLimit);
              target.value = elementData.userValue = value;
              storage.setValue(id, {
                value
              });
              this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                source: this,
                detail: {
                  id,
                  name: "Keystroke",
                  value,
                  willCommit: true,
                  commitKey: 1,
                  selStart: target.selectionStart,
                  selEnd: target.selectionEnd
                }
              });
            }
          };
          this._dispatchEventFromSandbox(actions, jsEvent);
        });
        element.addEventListener("keydown", event => {
          elementData.commitKey = 1;
          let commitKey = -1;
          if (event.key === "Escape") {
            commitKey = 0;
          } else if (event.key === "Enter" && !this.data.multiLine) {
            commitKey = 2;
          } else if (event.key === "Tab") {
            elementData.commitKey = 3;
          }
          if (commitKey === -1) {
            return;
          }
          const {
            value
          } = event.target;
          if (elementData.lastCommittedValue === value) {
            return;
          }
          elementData.lastCommittedValue = value;
          elementData.userValue = value;
          this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
            source: this,
            detail: {
              id,
              name: "Keystroke",
              value,
              willCommit: true,
              commitKey,
              selStart: event.target.selectionStart,
              selEnd: event.target.selectionEnd
            }
          });
        });
        const _blurListener = blurListener;
        blurListener = null;
        element.addEventListener("blur", event => {
          if (!elementData.focused || !event.relatedTarget) {
            return;
          }
          elementData.focused = false;
          const {
            value
          } = event.target;
          elementData.userValue = value;
          if (elementData.lastCommittedValue !== value) {
            this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
              source: this,
              detail: {
                id,
                name: "Keystroke",
                value,
                willCommit: true,
                commitKey: elementData.commitKey,
                selStart: event.target.selectionStart,
                selEnd: event.target.selectionEnd
              }
            });
          }
          _blurListener(event);
        });
        if (this.data.actions?.Keystroke) {
          element.addEventListener("beforeinput", event => {
            elementData.lastCommittedValue = null;
            const {
              data,
              target
            } = event;
            const {
              value,
              selectionStart,
              selectionEnd
            } = target;
            let selStart = selectionStart,
              selEnd = selectionEnd;
            switch (event.inputType) {
              case "deleteWordBackward":
                {
                  const match = value.substring(0, selectionStart).match(/\w*[^\w]*$/);
                  if (match) {
                    selStart -= match[0].length;
                  }
                  break;
                }
              case "deleteWordForward":
                {
                  const match = value.substring(selectionStart).match(/^[^\w]*\w*/);
                  if (match) {
                    selEnd += match[0].length;
                  }
                  break;
                }
              case "deleteContentBackward":
                if (selectionStart === selectionEnd) {
                  selStart -= 1;
                }
                break;
              case "deleteContentForward":
                if (selectionStart === selectionEnd) {
                  selEnd += 1;
                }
                break;
            }
            event.preventDefault();
            this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
              source: this,
              detail: {
                id,
                name: "Keystroke",
                value,
                change: data || "",
                willCommit: false,
                selStart,
                selEnd
              }
            });
          });
        }
        this._setEventListeners(element, elementData, [["focus", "Focus"], ["blur", "Blur"], ["mousedown", "Mouse Down"], ["mouseenter", "Mouse Enter"], ["mouseleave", "Mouse Exit"], ["mouseup", "Mouse Up"]], event => event.target.value);
      }
      if (blurListener) {
        element.addEventListener("blur", blurListener);
      }
      if (this.data.comb) {
        const fieldWidth = this.data.rect[2] - this.data.rect[0];
        const combWidth = fieldWidth / maxLen;
        element.classList.add("comb");
        element.style.letterSpacing = `calc(${combWidth}px * var(--scale-factor) - 1ch)`;
      }
    } else {
      element = document.createElement("div");
      element.textContent = this.data.fieldValue;
      element.style.verticalAlign = "middle";
      element.style.display = "table-cell";
    }
    this._setTextStyle(element);
    this._setBackgroundColor(element);
    this._setDefaultPropertiesFromJS(element);
    this.container.append(element);
    return this.container;
  }
}
class SignatureWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: !!parameters.data.hasOwnCanvas
    });
  }
}
class CheckboxWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: parameters.renderForms
    });
  }
  render() {
    const storage = this.annotationStorage;
    const data = this.data;
    const id = data.id;
    let value = storage.getValue(id, {
      value: data.exportValue === data.fieldValue
    }).value;
    if (typeof value === "string") {
      value = value !== "Off";
      storage.setValue(id, {
        value
      });
    }
    this.container.classList.add("buttonWidgetAnnotation", "checkBox");
    const element = document.createElement("input");
    GetElementsByNameSet.add(element);
    element.setAttribute("data-element-id", id);
    element.disabled = data.readOnly;
    this._setRequired(element, this.data.required);
    element.type = "checkbox";
    element.name = data.fieldName;
    if (value) {
      element.setAttribute("checked", true);
    }
    element.setAttribute("exportValue", data.exportValue);
    element.tabIndex = DEFAULT_TAB_INDEX;
    element.addEventListener("change", event => {
      const {
        name,
        checked
      } = event.target;
      for (const checkbox of this._getElementsByName(name, id)) {
        const curChecked = checked && checkbox.exportValue === data.exportValue;
        if (checkbox.domElement) {
          checkbox.domElement.checked = curChecked;
        }
        storage.setValue(checkbox.id, {
          value: curChecked
        });
      }
      storage.setValue(id, {
        value: checked
      });
    });
    element.addEventListener("resetform", event => {
      const defaultValue = data.defaultFieldValue || "Off";
      event.target.checked = defaultValue === data.exportValue;
    });
    if (this.enableScripting && this.hasJSActions) {
      element.addEventListener("updatefromsandbox", jsEvent => {
        const actions = {
          value(event) {
            event.target.checked = event.detail.value !== "Off";
            storage.setValue(id, {
              value: event.target.checked
            });
          }
        };
        this._dispatchEventFromSandbox(actions, jsEvent);
      });
      this._setEventListeners(element, null, [["change", "Validate"], ["change", "Action"], ["focus", "Focus"], ["blur", "Blur"], ["mousedown", "Mouse Down"], ["mouseenter", "Mouse Enter"], ["mouseleave", "Mouse Exit"], ["mouseup", "Mouse Up"]], event => event.target.checked);
    }
    this._setBackgroundColor(element);
    this._setDefaultPropertiesFromJS(element);
    this.container.append(element);
    return this.container;
  }
}
class RadioButtonWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: parameters.renderForms
    });
  }
  render() {
    this.container.classList.add("buttonWidgetAnnotation", "radioButton");
    const storage = this.annotationStorage;
    const data = this.data;
    const id = data.id;
    let value = storage.getValue(id, {
      value: data.fieldValue === data.buttonValue
    }).value;
    if (typeof value === "string") {
      value = value !== data.buttonValue;
      storage.setValue(id, {
        value
      });
    }
    const element = document.createElement("input");
    GetElementsByNameSet.add(element);
    element.setAttribute("data-element-id", id);
    element.disabled = data.readOnly;
    this._setRequired(element, this.data.required);
    element.type = "radio";
    element.name = data.fieldName;
    if (value) {
      element.setAttribute("checked", true);
    }
    element.tabIndex = DEFAULT_TAB_INDEX;
    element.addEventListener("change", event => {
      const {
        name,
        checked
      } = event.target;
      for (const radio of this._getElementsByName(name, id)) {
        storage.setValue(radio.id, {
          value: false
        });
      }
      storage.setValue(id, {
        value: checked
      });
    });
    element.addEventListener("resetform", event => {
      const defaultValue = data.defaultFieldValue;
      event.target.checked = defaultValue !== null && defaultValue !== undefined && defaultValue === data.buttonValue;
    });
    if (this.enableScripting && this.hasJSActions) {
      const pdfButtonValue = data.buttonValue;
      element.addEventListener("updatefromsandbox", jsEvent => {
        const actions = {
          value: event => {
            const checked = pdfButtonValue === event.detail.value;
            for (const radio of this._getElementsByName(event.target.name)) {
              const curChecked = checked && radio.id === id;
              if (radio.domElement) {
                radio.domElement.checked = curChecked;
              }
              storage.setValue(radio.id, {
                value: curChecked
              });
            }
          }
        };
        this._dispatchEventFromSandbox(actions, jsEvent);
      });
      this._setEventListeners(element, null, [["change", "Validate"], ["change", "Action"], ["focus", "Focus"], ["blur", "Blur"], ["mousedown", "Mouse Down"], ["mouseenter", "Mouse Enter"], ["mouseleave", "Mouse Exit"], ["mouseup", "Mouse Up"]], event => event.target.checked);
    }
    this._setBackgroundColor(element);
    this._setDefaultPropertiesFromJS(element);
    this.container.append(element);
    return this.container;
  }
}
class PushButtonWidgetAnnotationElement extends LinkAnnotationElement {
  constructor(parameters) {
    super(parameters, {
      ignoreBorder: parameters.data.hasAppearance
    });
  }
  render() {
    const container = super.render();
    container.classList.add("buttonWidgetAnnotation", "pushButton");
    if (this.data.alternativeText) {
      container.title = this.data.alternativeText;
    }
    const linkElement = container.lastChild;
    if (this.enableScripting && this.hasJSActions && linkElement) {
      this._setDefaultPropertiesFromJS(linkElement);
      linkElement.addEventListener("updatefromsandbox", jsEvent => {
        this._dispatchEventFromSandbox({}, jsEvent);
      });
    }
    return container;
  }
}
class ChoiceWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: parameters.renderForms
    });
  }
  render() {
    this.container.classList.add("choiceWidgetAnnotation");
    const storage = this.annotationStorage;
    const id = this.data.id;
    const storedData = storage.getValue(id, {
      value: this.data.fieldValue
    });
    const selectElement = document.createElement("select");
    GetElementsByNameSet.add(selectElement);
    selectElement.setAttribute("data-element-id", id);
    selectElement.disabled = this.data.readOnly;
    this._setRequired(selectElement, this.data.required);
    selectElement.name = this.data.fieldName;
    selectElement.tabIndex = DEFAULT_TAB_INDEX;
    let addAnEmptyEntry = this.data.combo && this.data.options.length > 0;
    if (!this.data.combo) {
      selectElement.size = this.data.options.length;
      if (this.data.multiSelect) {
        selectElement.multiple = true;
      }
    }
    selectElement.addEventListener("resetform", event => {
      const defaultValue = this.data.defaultFieldValue;
      for (const option of selectElement.options) {
        option.selected = option.value === defaultValue;
      }
    });
    for (const option of this.data.options) {
      const optionElement = document.createElement("option");
      optionElement.textContent = option.displayValue;
      optionElement.value = option.exportValue;
      if (storedData.value.includes(option.exportValue)) {
        optionElement.setAttribute("selected", true);
        addAnEmptyEntry = false;
      }
      selectElement.append(optionElement);
    }
    let removeEmptyEntry = null;
    if (addAnEmptyEntry) {
      const noneOptionElement = document.createElement("option");
      noneOptionElement.value = " ";
      noneOptionElement.setAttribute("hidden", true);
      noneOptionElement.setAttribute("selected", true);
      selectElement.prepend(noneOptionElement);
      removeEmptyEntry = () => {
        noneOptionElement.remove();
        selectElement.removeEventListener("input", removeEmptyEntry);
        removeEmptyEntry = null;
      };
      selectElement.addEventListener("input", removeEmptyEntry);
    }
    const getValue = isExport => {
      const name = isExport ? "value" : "textContent";
      const {
        options,
        multiple
      } = selectElement;
      if (!multiple) {
        return options.selectedIndex === -1 ? null : options[options.selectedIndex][name];
      }
      return Array.prototype.filter.call(options, option => option.selected).map(option => option[name]);
    };
    let selectedValues = getValue(false);
    const getItems = event => {
      const options = event.target.options;
      return Array.prototype.map.call(options, option => {
        return {
          displayValue: option.textContent,
          exportValue: option.value
        };
      });
    };
    if (this.enableScripting && this.hasJSActions) {
      selectElement.addEventListener("updatefromsandbox", jsEvent => {
        const actions = {
          value(event) {
            removeEmptyEntry?.();
            const value = event.detail.value;
            const values = new Set(Array.isArray(value) ? value : [value]);
            for (const option of selectElement.options) {
              option.selected = values.has(option.value);
            }
            storage.setValue(id, {
              value: getValue(true)
            });
            selectedValues = getValue(false);
          },
          multipleSelection(event) {
            selectElement.multiple = true;
          },
          remove(event) {
            const options = selectElement.options;
            const index = event.detail.remove;
            options[index].selected = false;
            selectElement.remove(index);
            if (options.length > 0) {
              const i = Array.prototype.findIndex.call(options, option => option.selected);
              if (i === -1) {
                options[0].selected = true;
              }
            }
            storage.setValue(id, {
              value: getValue(true),
              items: getItems(event)
            });
            selectedValues = getValue(false);
          },
          clear(event) {
            while (selectElement.length !== 0) {
              selectElement.remove(0);
            }
            storage.setValue(id, {
              value: null,
              items: []
            });
            selectedValues = getValue(false);
          },
          insert(event) {
            const {
              index,
              displayValue,
              exportValue
            } = event.detail.insert;
            const selectChild = selectElement.children[index];
            const optionElement = document.createElement("option");
            optionElement.textContent = displayValue;
            optionElement.value = exportValue;
            if (selectChild) {
              selectChild.before(optionElement);
            } else {
              selectElement.append(optionElement);
            }
            storage.setValue(id, {
              value: getValue(true),
              items: getItems(event)
            });
            selectedValues = getValue(false);
          },
          items(event) {
            const {
              items
            } = event.detail;
            while (selectElement.length !== 0) {
              selectElement.remove(0);
            }
            for (const item of items) {
              const {
                displayValue,
                exportValue
              } = item;
              const optionElement = document.createElement("option");
              optionElement.textContent = displayValue;
              optionElement.value = exportValue;
              selectElement.append(optionElement);
            }
            if (selectElement.options.length > 0) {
              selectElement.options[0].selected = true;
            }
            storage.setValue(id, {
              value: getValue(true),
              items: getItems(event)
            });
            selectedValues = getValue(false);
          },
          indices(event) {
            const indices = new Set(event.detail.indices);
            for (const option of event.target.options) {
              option.selected = indices.has(option.index);
            }
            storage.setValue(id, {
              value: getValue(true)
            });
            selectedValues = getValue(false);
          },
          editable(event) {
            event.target.disabled = !event.detail.editable;
          }
        };
        this._dispatchEventFromSandbox(actions, jsEvent);
      });
      selectElement.addEventListener("input", event => {
        const exportValue = getValue(true);
        storage.setValue(id, {
          value: exportValue
        });
        event.preventDefault();
        this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
          source: this,
          detail: {
            id,
            name: "Keystroke",
            value: selectedValues,
            changeEx: exportValue,
            willCommit: false,
            commitKey: 1,
            keyDown: false
          }
        });
      });
      this._setEventListeners(selectElement, null, [["focus", "Focus"], ["blur", "Blur"], ["mousedown", "Mouse Down"], ["mouseenter", "Mouse Enter"], ["mouseleave", "Mouse Exit"], ["mouseup", "Mouse Up"], ["input", "Action"], ["input", "Validate"]], event => event.target.value);
    } else {
      selectElement.addEventListener("input", function (event) {
        storage.setValue(id, {
          value: getValue(true)
        });
      });
    }
    if (this.data.combo) {
      this._setTextStyle(selectElement);
    } else {}
    this._setBackgroundColor(selectElement);
    this._setDefaultPropertiesFromJS(selectElement);
    this.container.append(selectElement);
    return this.container;
  }
}
class PopupAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const {
      data,
      elements
    } = parameters;
    super(parameters, {
      isRenderable: AnnotationElement._hasPopupData(data)
    });
    this.elements = elements;
  }
  render() {
    this.container.classList.add("popupAnnotation");
    const popup = new PopupElement({
      container: this.container,
      color: this.data.color,
      titleObj: this.data.titleObj,
      modificationDate: this.data.modificationDate,
      contentsObj: this.data.contentsObj,
      richText: this.data.richText,
      rect: this.data.rect,
      parentRect: this.data.parentRect || null,
      parent: this.parent,
      elements: this.elements,
      open: this.data.open
    });
    const elementIds = [];
    for (const element of this.elements) {
      element.popup = popup;
      elementIds.push(element.data.id);
      element.addHighlightArea();
    }
    this.container.setAttribute("aria-controls", elementIds.map(id => `${_util.AnnotationPrefix}${id}`).join(","));
    return this.container;
  }
}
class PopupElement {
  #dateTimePromise = null;
  #boundKeyDown = this.#keyDown.bind(this);
  #boundHide = this.#hide.bind(this);
  #boundShow = this.#show.bind(this);
  #boundToggle = this.#toggle.bind(this);
  #color = null;
  #container = null;
  #contentsObj = null;
  #elements = null;
  #parent = null;
  #parentRect = null;
  #pinned = false;
  #popup = null;
  #rect = null;
  #richText = null;
  #titleObj = null;
  #wasVisible = false;
  constructor({
    container,
    color,
    elements,
    titleObj,
    modificationDate,
    contentsObj,
    richText,
    parent,
    rect,
    parentRect,
    open
  }) {
    this.#container = container;
    this.#titleObj = titleObj;
    this.#contentsObj = contentsObj;
    this.#richText = richText;
    this.#parent = parent;
    this.#color = color;
    this.#rect = rect;
    this.#parentRect = parentRect;
    this.#elements = elements;
    const dateObject = _display_utils.PDFDateString.toDateObject(modificationDate);
    if (dateObject) {
      this.#dateTimePromise = parent.l10n.get("annotation_date_string", {
        date: dateObject.toLocaleDateString(),
        time: dateObject.toLocaleTimeString()
      });
    }
    this.trigger = elements.flatMap(e => e.getElementsToTriggerPopup());
    for (const element of this.trigger) {
      element.addEventListener("click", this.#boundToggle);
      element.addEventListener("mouseenter", this.#boundShow);
      element.addEventListener("mouseleave", this.#boundHide);
      element.classList.add("popupTriggerArea");
    }
    for (const element of elements) {
      element.container?.addEventListener("keydown", this.#boundKeyDown);
    }
    this.#container.hidden = true;
    if (open) {
      this.#toggle();
    }
  }
  render() {
    if (this.#popup) {
      return;
    }
    const {
      page: {
        view
      },
      viewport: {
        rawDims: {
          pageWidth,
          pageHeight,
          pageX,
          pageY
        }
      }
    } = this.#parent;
    const popup = this.#popup = document.createElement("div");
    popup.className = "popup";
    if (this.#color) {
      const baseColor = popup.style.outlineColor = _util.Util.makeHexColor(...this.#color);
      if (CSS.supports("background-color", "color-mix(in srgb, red 30%, white)")) {
        popup.style.backgroundColor = `color-mix(in srgb, ${baseColor} 30%, white)`;
      } else {
        const BACKGROUND_ENLIGHT = 0.7;
        popup.style.backgroundColor = _util.Util.makeHexColor(...this.#color.map(c => Math.floor(BACKGROUND_ENLIGHT * (255 - c) + c)));
      }
    }
    const header = document.createElement("span");
    header.className = "header";
    const title = document.createElement("h1");
    header.append(title);
    ({
      dir: title.dir,
      str: title.textContent
    } = this.#titleObj);
    popup.append(header);
    if (this.#dateTimePromise) {
      const modificationDate = document.createElement("span");
      modificationDate.classList.add("popupDate");
      this.#dateTimePromise.then(localized => {
        modificationDate.textContent = localized;
      });
      header.append(modificationDate);
    }
    const contentsObj = this.#contentsObj;
    const richText = this.#richText;
    if (richText?.str && (!contentsObj?.str || contentsObj.str === richText.str)) {
      _xfa_layer.XfaLayer.render({
        xfaHtml: richText.html,
        intent: "richText",
        div: popup
      });
      popup.lastChild.classList.add("richText", "popupContent");
    } else {
      const contents = this._formatContents(contentsObj);
      popup.append(contents);
    }
    let useParentRect = !!this.#parentRect;
    let rect = useParentRect ? this.#parentRect : this.#rect;
    for (const element of this.#elements) {
      if (!rect || _util.Util.intersect(element.data.rect, rect) !== null) {
        rect = element.data.rect;
        useParentRect = true;
        break;
      }
    }
    const normalizedRect = _util.Util.normalizeRect([rect[0], view[3] - rect[1] + view[1], rect[2], view[3] - rect[3] + view[1]]);
    const HORIZONTAL_SPACE_AFTER_ANNOTATION = 5;
    const parentWidth = useParentRect ? rect[2] - rect[0] + HORIZONTAL_SPACE_AFTER_ANNOTATION : 0;
    const popupLeft = normalizedRect[0] + parentWidth;
    const popupTop = normalizedRect[1];
    const {
      style
    } = this.#container;
    style.left = `${100 * (popupLeft - pageX) / pageWidth}%`;
    style.top = `${100 * (popupTop - pageY) / pageHeight}%`;
    this.#container.append(popup);
  }
  _formatContents({
    str,
    dir
  }) {
    const p = document.createElement("p");
    p.classList.add("popupContent");
    p.dir = dir;
    const lines = str.split(/(?:\r\n?|\n)/);
    for (let i = 0, ii = lines.length; i < ii; ++i) {
      const line = lines[i];
      p.append(document.createTextNode(line));
      if (i < ii - 1) {
        p.append(document.createElement("br"));
      }
    }
    return p;
  }
  #keyDown(event) {
    if (event.altKey || event.shiftKey || event.ctrlKey || event.metaKey) {
      return;
    }
    if (event.key === "Enter" || event.key === "Escape" && this.#pinned) {
      this.#toggle();
    }
  }
  #toggle() {
    this.#pinned = !this.#pinned;
    if (this.#pinned) {
      this.#show();
      this.#container.addEventListener("click", this.#boundToggle);
      this.#container.addEventListener("keydown", this.#boundKeyDown);
    } else {
      this.#hide();
      this.#container.removeEventListener("click", this.#boundToggle);
      this.#container.removeEventListener("keydown", this.#boundKeyDown);
    }
  }
  #show() {
    if (!this.#popup) {
      this.render();
    }
    if (!this.isVisible) {
      this.#container.hidden = false;
      this.#container.style.zIndex = parseInt(this.#container.style.zIndex) + 1000;
    } else if (this.#pinned) {
      this.#container.classList.add("focused");
    }
  }
  #hide() {
    this.#container.classList.remove("focused");
    if (this.#pinned || !this.isVisible) {
      return;
    }
    this.#container.hidden = true;
    this.#container.style.zIndex = parseInt(this.#container.style.zIndex) - 1000;
  }
  forceHide() {
    this.#wasVisible = this.isVisible;
    if (!this.#wasVisible) {
      return;
    }
    this.#container.hidden = true;
  }
  maybeShow() {
    if (!this.#wasVisible) {
      return;
    }
    this.#wasVisible = false;
    this.#container.hidden = false;
  }
  get isVisible() {
    return this.#container.hidden === false;
  }
}
class FreeTextAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: true,
      ignoreBorder: true
    });
    this.textContent = parameters.data.textContent;
    this.textPosition = parameters.data.textPosition;
    this.annotationEditorType = _util.AnnotationEditorType.FREETEXT;
  }
  render() {
    this.container.classList.add("freeTextAnnotation");
    if (this.textContent) {
      const content = document.createElement("div");
      content.classList.add("annotationTextContent");
      content.setAttribute("role", "comment");
      for (const line of this.textContent) {
        const lineSpan = document.createElement("span");
        lineSpan.textContent = line;
        content.append(lineSpan);
      }
      this.container.append(content);
    }
    if (!this.data.popupRef && this.hasPopupData) {
      this._createPopup();
    }
    this._editOnDoubleClick();
    return this.container;
  }
}
exports.FreeTextAnnotationElement = FreeTextAnnotationElement;
class LineAnnotationElement extends AnnotationElement {
  #line = null;
  constructor(parameters) {
    super(parameters, {
      isRenderable: true,
      ignoreBorder: true
    });
  }
  render() {
    this.container.classList.add("lineAnnotation");
    const data = this.data;
    const {
      width,
      height
    } = getRectDims(data.rect);
    const svg = this.svgFactory.create(width, height, true);
    const line = this.#line = this.svgFactory.createElement("svg:line");
    line.setAttribute("x1", data.rect[2] - data.lineCoordinates[0]);
    line.setAttribute("y1", data.rect[3] - data.lineCoordinates[1]);
    line.setAttribute("x2", data.rect[2] - data.lineCoordinates[2]);
    line.setAttribute("y2", data.rect[3] - data.lineCoordinates[3]);
    line.setAttribute("stroke-width", data.borderStyle.width || 1);
    line.setAttribute("stroke", "transparent");
    line.setAttribute("fill", "transparent");
    svg.append(line);
    this.container.append(svg);
    if (!data.popupRef && this.hasPopupData) {
      this._createPopup();
    }
    return this.container;
  }
  getElementsToTriggerPopup() {
    return this.#line;
  }
  addHighlightArea() {
    this.container.classList.add("highlightArea");
  }
}
class SquareAnnotationElement extends AnnotationElement {
  #square = null;
  constructor(parameters) {
    super(parameters, {
      isRenderable: true,
      ignoreBorder: true
    });
  }
  render() {
    this.container.classList.add("squareAnnotation");
    const data = this.data;
    const {
      width,
      height
    } = getRectDims(data.rect);
    const svg = this.svgFactory.create(width, height, true);
    const borderWidth = data.borderStyle.width;
    const square = this.#square = this.svgFactory.createElement("svg:rect");
    square.setAttribute("x", borderWidth / 2);
    square.setAttribute("y", borderWidth / 2);
    square.setAttribute("width", width - borderWidth);
    square.setAttribute("height", height - borderWidth);
    square.setAttribute("stroke-width", borderWidth || 1);
    square.setAttribute("stroke", "transparent");
    square.setAttribute("fill", "transparent");
    svg.append(square);
    this.container.append(svg);
    if (!data.popupRef && this.hasPopupData) {
      this._createPopup();
    }
    return this.container;
  }
  getElementsToTriggerPopup() {
    return this.#square;
  }
  addHighlightArea() {
    this.container.classList.add("highlightArea");
  }
}
class CircleAnnotationElement extends AnnotationElement {
  #circle = null;
  constructor(parameters) {
    super(parameters, {
      isRenderable: true,
      ignoreBorder: true
    });
  }
  render() {
    this.container.classList.add("circleAnnotation");
    const data = this.data;
    const {
      width,
      height
    } = getRectDims(data.rect);
    const svg = this.svgFactory.create(width, height, true);
    const borderWidth = data.borderStyle.width;
    const circle = this.#circle = this.svgFactory.createElement("svg:ellipse");
    circle.setAttribute("cx", width / 2);
    circle.setAttribute("cy", height / 2);
    circle.setAttribute("rx", width / 2 - borderWidth / 2);
    circle.setAttribute("ry", height / 2 - borderWidth / 2);
    circle.setAttribute("stroke-width", borderWidth || 1);
    circle.setAttribute("stroke", "transparent");
    circle.setAttribute("fill", "transparent");
    svg.append(circle);
    this.container.append(svg);
    if (!data.popupRef && this.hasPopupData) {
      this._createPopup();
    }
    return this.container;
  }
  getElementsToTriggerPopup() {
    return this.#circle;
  }
  addHighlightArea() {
    this.container.classList.add("highlightArea");
  }
}
class PolylineAnnotationElement extends AnnotationElement {
  #polyline = null;
  constructor(parameters) {
    super(parameters, {
      isRenderable: true,
      ignoreBorder: true
    });
    this.containerClassName = "polylineAnnotation";
    this.svgElementName = "svg:polyline";
  }
  render() {
    this.container.classList.add(this.containerClassName);
    const data = this.data;
    const {
      width,
      height
    } = getRectDims(data.rect);
    const svg = this.svgFactory.create(width, height, true);
    let points = [];
    for (const coordinate of data.vertices) {
      const x = coordinate.x - data.rect[0];
      const y = data.rect[3] - coordinate.y;
      points.push(x + "," + y);
    }
    points = points.join(" ");
    const polyline = this.#polyline = this.svgFactory.createElement(this.svgElementName);
    polyline.setAttribute("points", points);
    polyline.setAttribute("stroke-width", data.borderStyle.width || 1);
    polyline.setAttribute("stroke", "transparent");
    polyline.setAttribute("fill", "transparent");
    svg.append(polyline);
    this.container.append(svg);
    if (!data.popupRef && this.hasPopupData) {
      this._createPopup();
    }
    return this.container;
  }
  getElementsToTriggerPopup() {
    return this.#polyline;
  }
  addHighlightArea() {
    this.container.classList.add("highlightArea");
  }
}
class PolygonAnnotationElement extends PolylineAnnotationElement {
  constructor(parameters) {
    super(parameters);
    this.containerClassName = "polygonAnnotation";
    this.svgElementName = "svg:polygon";
  }
}
class CaretAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: true,
      ignoreBorder: true
    });
  }
  render() {
    this.container.classList.add("caretAnnotation");
    if (!this.data.popupRef && this.hasPopupData) {
      this._createPopup();
    }
    return this.container;
  }
}
class InkAnnotationElement extends AnnotationElement {
  #polylines = [];
  constructor(parameters) {
    super(parameters, {
      isRenderable: true,
      ignoreBorder: true
    });
    this.containerClassName = "inkAnnotation";
    this.svgElementName = "svg:polyline";
    this.annotationEditorType = _util.AnnotationEditorType.INK;
  }
  render() {
    this.container.classList.add(this.containerClassName);
    const data = this.data;
    const {
      width,
      height
    } = getRectDims(data.rect);
    const svg = this.svgFactory.create(width, height, true);
    for (const inkList of data.inkLists) {
      let points = [];
      for (const coordinate of inkList) {
        const x = coordinate.x - data.rect[0];
        const y = data.rect[3] - coordinate.y;
        points.push(`${x},${y}`);
      }
      points = points.join(" ");
      const polyline = this.svgFactory.createElement(this.svgElementName);
      this.#polylines.push(polyline);
      polyline.setAttribute("points", points);
      polyline.setAttribute("stroke-width", data.borderStyle.width || 1);
      polyline.setAttribute("stroke", "transparent");
      polyline.setAttribute("fill", "transparent");
      if (!data.popupRef && this.hasPopupData) {
        this._createPopup();
      }
      svg.append(polyline);
    }
    this.container.append(svg);
    return this.container;
  }
  getElementsToTriggerPopup() {
    return this.#polylines;
  }
  addHighlightArea() {
    this.container.classList.add("highlightArea");
  }
}
exports.InkAnnotationElement = InkAnnotationElement;
class HighlightAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: true,
      ignoreBorder: true,
      createQuadrilaterals: true
    });
  }
  render() {
    if (!this.data.popupRef && this.hasPopupData) {
      this._createPopup();
    }
    this.container.classList.add("highlightAnnotation");
    return this.container;
  }
}
class UnderlineAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: true,
      ignoreBorder: true,
      createQuadrilaterals: true
    });
  }
  render() {
    if (!this.data.popupRef && this.hasPopupData) {
      this._createPopup();
    }
    this.container.classList.add("underlineAnnotation");
    return this.container;
  }
}
class SquigglyAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: true,
      ignoreBorder: true,
      createQuadrilaterals: true
    });
  }
  render() {
    if (!this.data.popupRef && this.hasPopupData) {
      this._createPopup();
    }
    this.container.classList.add("squigglyAnnotation");
    return this.container;
  }
}
class StrikeOutAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: true,
      ignoreBorder: true,
      createQuadrilaterals: true
    });
  }
  render() {
    if (!this.data.popupRef && this.hasPopupData) {
      this._createPopup();
    }
    this.container.classList.add("strikeoutAnnotation");
    return this.container;
  }
}
class StampAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: true,
      ignoreBorder: true
    });
  }
  render() {
    this.container.classList.add("stampAnnotation");
    if (!this.data.popupRef && this.hasPopupData) {
      this._createPopup();
    }
    return this.container;
  }
}
exports.StampAnnotationElement = StampAnnotationElement;
class FileAttachmentAnnotationElement extends AnnotationElement {
  #trigger = null;
  constructor(parameters) {
    super(parameters, {
      isRenderable: true
    });
    const {
      filename,
      content
    } = this.data.file;
    this.filename = (0, _display_utils.getFilenameFromUrl)(filename, true);
    this.content = content;
    this.linkService.eventBus?.dispatch("fileattachmentannotation", {
      source: this,
      filename,
      content
    });
  }
  render() {
    this.container.classList.add("fileAttachmentAnnotation");
    const {
      container,
      data
    } = this;
    let trigger;
    if (data.hasAppearance || data.fillAlpha === 0) {
      trigger = document.createElement("div");
    } else {
      trigger = document.createElement("img");
      trigger.src = `${this.imageResourcesPath}annotation-${/paperclip/i.test(data.name) ? "paperclip" : "pushpin"}.svg`;
      if (data.fillAlpha && data.fillAlpha < 1) {
        trigger.style = `filter: opacity(${Math.round(data.fillAlpha * 100)}%);`;
      }
    }
    trigger.addEventListener("dblclick", this.#download.bind(this));
    this.#trigger = trigger;
    const {
      isMac
    } = _util.FeatureTest.platform;
    container.addEventListener("keydown", evt => {
      if (evt.key === "Enter" && (isMac ? evt.metaKey : evt.ctrlKey)) {
        this.#download();
      }
    });
    if (!data.popupRef && this.hasPopupData) {
      this._createPopup();
    } else {
      trigger.classList.add("popupTriggerArea");
    }
    container.append(trigger);
    return container;
  }
  getElementsToTriggerPopup() {
    return this.#trigger;
  }
  addHighlightArea() {
    this.container.classList.add("highlightArea");
  }
  #download() {
    this.downloadManager?.openOrDownloadData(this.container, this.content, this.filename);
  }
}
class AnnotationLayer {
  #accessibilityManager = null;
  #annotationCanvasMap = null;
  #editableAnnotations = new Map();
  constructor({
    div,
    accessibilityManager,
    annotationCanvasMap,
    l10n,
    page,
    viewport
  }) {
    this.div = div;
    this.#accessibilityManager = accessibilityManager;
    this.#annotationCanvasMap = annotationCanvasMap;
    this.l10n = l10n;
    this.page = page;
    this.viewport = viewport;
    this.zIndex = 0;
    this.l10n ||= _displayL10n_utils.NullL10n;
  }
  #appendElement(element, id) {
    const contentElement = element.firstChild || element;
    contentElement.id = `${_util.AnnotationPrefix}${id}`;
    this.div.append(element);
    this.#accessibilityManager?.moveElementInDOM(this.div, element, contentElement, false);
  }
  async render(params) {
    const {
      annotations
    } = params;
    const layer = this.div;
    (0, _display_utils.setLayerDimensions)(layer, this.viewport);
    const popupToElements = new Map();
    const elementParams = {
      data: null,
      layer,
      linkService: params.linkService,
      downloadManager: params.downloadManager,
      imageResourcesPath: params.imageResourcesPath || "",
      renderForms: params.renderForms !== false,
      svgFactory: new _display_utils.DOMSVGFactory(),
      annotationStorage: params.annotationStorage || new _annotation_storage.AnnotationStorage(),
      enableScripting: params.enableScripting === true,
      hasJSActions: params.hasJSActions,
      fieldObjects: params.fieldObjects,
      parent: this,
      elements: null
    };
    for (const data of annotations) {
      if (data.noHTML) {
        continue;
      }
      const isPopupAnnotation = data.annotationType === _util.AnnotationType.POPUP;
      if (!isPopupAnnotation) {
        const {
          width,
          height
        } = getRectDims(data.rect);
        if (width <= 0 || height <= 0) {
          continue;
        }
      } else {
        const elements = popupToElements.get(data.id);
        if (!elements) {
          continue;
        }
        elementParams.elements = elements;
      }
      elementParams.data = data;
      const element = AnnotationElementFactory.create(elementParams);
      if (!element.isRenderable) {
        continue;
      }
      if (!isPopupAnnotation && data.popupRef) {
        const elements = popupToElements.get(data.popupRef);
        if (!elements) {
          popupToElements.set(data.popupRef, [element]);
        } else {
          elements.push(element);
        }
      }
      if (element.annotationEditorType > 0) {
        this.#editableAnnotations.set(element.data.id, element);
      }
      const rendered = element.render();
      if (data.hidden) {
        rendered.style.visibility = "hidden";
      }
      this.#appendElement(rendered, data.id);
    }
    this.#setAnnotationCanvasMap();
    await this.l10n.translate(layer);
  }
  update({
    viewport
  }) {
    const layer = this.div;
    this.viewport = viewport;
    (0, _display_utils.setLayerDimensions)(layer, {
      rotation: viewport.rotation
    });
    this.#setAnnotationCanvasMap();
    layer.hidden = false;
  }
  #setAnnotationCanvasMap() {
    if (!this.#annotationCanvasMap) {
      return;
    }
    const layer = this.div;
    for (const [id, canvas] of this.#annotationCanvasMap) {
      const element = layer.querySelector(`[data-annotation-id="${id}"]`);
      if (!element) {
        continue;
      }
      const {
        firstChild
      } = element;
      if (!firstChild) {
        element.append(canvas);
      } else if (firstChild.nodeName === "CANVAS") {
        firstChild.replaceWith(canvas);
      } else {
        firstChild.before(canvas);
      }
    }
    this.#annotationCanvasMap.clear();
  }
  getEditableAnnotations() {
    return Array.from(this.#editableAnnotations.values());
  }
  getEditableAnnotation(id) {
    return this.#editableAnnotations.get(id);
  }
}
exports.AnnotationLayer = AnnotationLayer;

/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ColorConverters = void 0;
function makeColorComp(n) {
  return Math.floor(Math.max(0, Math.min(1, n)) * 255).toString(16).padStart(2, "0");
}
function scaleAndClamp(x) {
  return Math.max(0, Math.min(255, 255 * x));
}
class ColorConverters {
  static CMYK_G([c, y, m, k]) {
    return ["G", 1 - Math.min(1, 0.3 * c + 0.59 * m + 0.11 * y + k)];
  }
  static G_CMYK([g]) {
    return ["CMYK", 0, 0, 0, 1 - g];
  }
  static G_RGB([g]) {
    return ["RGB", g, g, g];
  }
  static G_rgb([g]) {
    g = scaleAndClamp(g);
    return [g, g, g];
  }
  static G_HTML([g]) {
    const G = makeColorComp(g);
    return `#${G}${G}${G}`;
  }
  static RGB_G([r, g, b]) {
    return ["G", 0.3 * r + 0.59 * g + 0.11 * b];
  }
  static RGB_rgb(color) {
    return color.map(scaleAndClamp);
  }
  static RGB_HTML(color) {
    return `#${color.map(makeColorComp).join("")}`;
  }
  static T_HTML() {
    return "#00000000";
  }
  static T_rgb() {
    return [null];
  }
  static CMYK_RGB([c, y, m, k]) {
    return ["RGB", 1 - Math.min(1, c + k), 1 - Math.min(1, m + k), 1 - Math.min(1, y + k)];
  }
  static CMYK_rgb([c, y, m, k]) {
    return [scaleAndClamp(1 - Math.min(1, c + k)), scaleAndClamp(1 - Math.min(1, m + k)), scaleAndClamp(1 - Math.min(1, y + k))];
  }
  static CMYK_HTML(components) {
    const rgb = this.CMYK_RGB(components).slice(1);
    return this.RGB_HTML(rgb);
  }
  static RGB_CMYK([r, g, b]) {
    const c = 1 - r;
    const m = 1 - g;
    const y = 1 - b;
    const k = Math.min(c, m, y);
    return ["CMYK", c, m, y, k];
  }
}
exports.ColorConverters = ColorConverters;

/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.NullL10n = void 0;
exports.getL10nFallback = getL10nFallback;
const DEFAULT_L10N_STRINGS = {
  of_pages: "of {{pagesCount}}",
  page_of_pages: "({{pageNumber}} of {{pagesCount}})",
  document_properties_kb: "{{size_kb}} KB ({{size_b}} bytes)",
  document_properties_mb: "{{size_mb}} MB ({{size_b}} bytes)",
  document_properties_date_string: "{{date}}, {{time}}",
  document_properties_page_size_unit_inches: "in",
  document_properties_page_size_unit_millimeters: "mm",
  document_properties_page_size_orientation_portrait: "portrait",
  document_properties_page_size_orientation_landscape: "landscape",
  document_properties_page_size_name_a3: "A3",
  document_properties_page_size_name_a4: "A4",
  document_properties_page_size_name_letter: "Letter",
  document_properties_page_size_name_legal: "Legal",
  document_properties_page_size_dimension_string: "{{width}} × {{height}} {{unit}} ({{orientation}})",
  document_properties_page_size_dimension_name_string: "{{width}} × {{height}} {{unit}} ({{name}}, {{orientation}})",
  document_properties_linearized_yes: "Yes",
  document_properties_linearized_no: "No",
  additional_layers: "Additional Layers",
  page_landmark: "Page {{page}}",
  thumb_page_title: "Page {{page}}",
  thumb_page_canvas: "Thumbnail of Page {{page}}",
  find_reached_top: "Reached top of document, continued from bottom",
  find_reached_bottom: "Reached end of document, continued from top",
  "find_match_count[one]": "{{current}} of {{total}} match",
  "find_match_count[other]": "{{current}} of {{total}} matches",
  "find_match_count_limit[one]": "More than {{limit}} match",
  "find_match_count_limit[other]": "More than {{limit}} matches",
  find_not_found: "Phrase not found",
  page_scale_width: "Page Width",
  page_scale_fit: "Page Fit",
  page_scale_auto: "Automatic Zoom",
  page_scale_actual: "Actual Size",
  page_scale_percent: "{{scale}}%",
  loading_error: "An error occurred while loading the PDF.",
  invalid_file_error: "Invalid or corrupted PDF file.",
  missing_file_error: "Missing PDF file.",
  unexpected_response_error: "Unexpected server response.",
  rendering_error: "An error occurred while rendering the page.",
  annotation_date_string: "{{date}}, {{time}}",
  printing_not_supported: "Warning: Printing is not fully supported by this browser.",
  printing_not_ready: "Warning: The PDF is not fully loaded for printing.",
  web_fonts_disabled: "Web fonts are disabled: unable to use embedded PDF fonts.",
  free_text2_default_content: "Start typing…",
  editor_free_text2_aria_label: "Text Editor",
  editor_ink2_aria_label: "Draw Editor",
  editor_ink_canvas_aria_label: "User-created image",
  editor_alt_text_button_label: "Alt text",
  editor_alt_text_edit_button_label: "Edit alt text",
  editor_alt_text_decorative_tooltip: "Marked as decorative"
};
{
  DEFAULT_L10N_STRINGS.print_progress_percent = "{{progress}}%";
}
function getL10nFallback(key, args) {
  switch (key) {
    case "find_match_count":
      key = `find_match_count[${args.total === 1 ? "one" : "other"}]`;
      break;
    case "find_match_count_limit":
      key = `find_match_count_limit[${args.limit === 1 ? "one" : "other"}]`;
      break;
  }
  return DEFAULT_L10N_STRINGS[key] || "";
}
function formatL10nValue(text, args) {
  if (!args) {
    return text;
  }
  return text.replaceAll(/\{\{\s*(\w+)\s*\}\}/g, (all, name) => {
    return name in args ? args[name] : "{{" + name + "}}";
  });
}
const NullL10n = {
  async getLanguage() {
    return "en-us";
  },
  async getDirection() {
    return "ltr";
  },
  async get(key, args = null, fallback = getL10nFallback(key, args)) {
    return formatL10nValue(fallback, args);
  },
  async translate(element) {}
};
exports.NullL10n = NullL10n;

/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.XfaLayer = void 0;
var _xfa_text = __w_pdfjs_require__(25);
class XfaLayer {
  static setupStorage(html, id, element, storage, intent) {
    const storedData = storage.getValue(id, {
      value: null
    });
    switch (element.name) {
      case "textarea":
        if (storedData.value !== null) {
          html.textContent = storedData.value;
        }
        if (intent === "print") {
          break;
        }
        html.addEventListener("input", event => {
          storage.setValue(id, {
            value: event.target.value
          });
        });
        break;
      case "input":
        if (element.attributes.type === "radio" || element.attributes.type === "checkbox") {
          if (storedData.value === element.attributes.xfaOn) {
            html.setAttribute("checked", true);
          } else if (storedData.value === element.attributes.xfaOff) {
            html.removeAttribute("checked");
          }
          if (intent === "print") {
            break;
          }
          html.addEventListener("change", event => {
            storage.setValue(id, {
              value: event.target.checked ? event.target.getAttribute("xfaOn") : event.target.getAttribute("xfaOff")
            });
          });
        } else {
          if (storedData.value !== null) {
            html.setAttribute("value", storedData.value);
          }
          if (intent === "print") {
            break;
          }
          html.addEventListener("input", event => {
            storage.setValue(id, {
              value: event.target.value
            });
          });
        }
        break;
      case "select":
        if (storedData.value !== null) {
          html.setAttribute("value", storedData.value);
          for (const option of element.children) {
            if (option.attributes.value === storedData.value) {
              option.attributes.selected = true;
            } else if (option.attributes.hasOwnProperty("selected")) {
              delete option.attributes.selected;
            }
          }
        }
        html.addEventListener("input", event => {
          const options = event.target.options;
          const value = options.selectedIndex === -1 ? "" : options[options.selectedIndex].value;
          storage.setValue(id, {
            value
          });
        });
        break;
    }
  }
  static setAttributes({
    html,
    element,
    storage = null,
    intent,
    linkService
  }) {
    const {
      attributes
    } = element;
    const isHTMLAnchorElement = html instanceof HTMLAnchorElement;
    if (attributes.type === "radio") {
      attributes.name = `${attributes.name}-${intent}`;
    }
    for (const [key, value] of Object.entries(attributes)) {
      if (value === null || value === undefined) {
        continue;
      }
      switch (key) {
        case "class":
          if (value.length) {
            html.setAttribute(key, value.join(" "));
          }
          break;
        case "dataId":
          break;
        case "id":
          html.setAttribute("data-element-id", value);
          break;
        case "style":
          Object.assign(html.style, value);
          break;
        case "textContent":
          html.textContent = value;
          break;
        default:
          if (!isHTMLAnchorElement || key !== "href" && key !== "newWindow") {
            html.setAttribute(key, value);
          }
      }
    }
    if (isHTMLAnchorElement) {
      linkService.addLinkAttributes(html, attributes.href, attributes.newWindow);
    }
    if (storage && attributes.dataId) {
      this.setupStorage(html, attributes.dataId, element, storage);
    }
  }
  static render(parameters) {
    const storage = parameters.annotationStorage;
    const linkService = parameters.linkService;
    const root = parameters.xfaHtml;
    const intent = parameters.intent || "display";
    const rootHtml = document.createElement(root.name);
    if (root.attributes) {
      this.setAttributes({
        html: rootHtml,
        element: root,
        intent,
        linkService
      });
    }
    const stack = [[root, -1, rootHtml]];
    const rootDiv = parameters.div;
    rootDiv.append(rootHtml);
    if (parameters.viewport) {
      const transform = `matrix(${parameters.viewport.transform.join(",")})`;
      rootDiv.style.transform = transform;
    }
    if (intent !== "richText") {
      rootDiv.setAttribute("class", "xfaLayer xfaFont");
    }
    const textDivs = [];
    while (stack.length > 0) {
      const [parent, i, html] = stack.at(-1);
      if (i + 1 === parent.children.length) {
        stack.pop();
        continue;
      }
      const child = parent.children[++stack.at(-1)[1]];
      if (child === null) {
        continue;
      }
      const {
        name
      } = child;
      if (name === "#text") {
        const node = document.createTextNode(child.value);
        textDivs.push(node);
        html.append(node);
        continue;
      }
      const childHtml = child?.attributes?.xmlns ? document.createElementNS(child.attributes.xmlns, name) : document.createElement(name);
      html.append(childHtml);
      if (child.attributes) {
        this.setAttributes({
          html: childHtml,
          element: child,
          storage,
          intent,
          linkService
        });
      }
      if (child.children && child.children.length > 0) {
        stack.push([child, -1, childHtml]);
      } else if (child.value) {
        const node = document.createTextNode(child.value);
        if (_xfa_text.XfaText.shouldBuildText(name)) {
          textDivs.push(node);
        }
        childHtml.append(node);
      }
    }
    for (const el of rootDiv.querySelectorAll(".xfaNonInteractive input, .xfaNonInteractive textarea")) {
      el.setAttribute("readOnly", true);
    }
    return {
      textDivs
    };
  }
  static update(parameters) {
    const transform = `matrix(${parameters.viewport.transform.join(",")})`;
    parameters.div.style.transform = transform;
    parameters.div.hidden = false;
  }
}
exports.XfaLayer = XfaLayer;

/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.InkEditor = void 0;
var _util = __w_pdfjs_require__(1);
var _editor = __w_pdfjs_require__(4);
var _annotation_layer = __w_pdfjs_require__(29);
var _display_utils = __w_pdfjs_require__(6);
var _tools = __w_pdfjs_require__(5);
class InkEditor extends _editor.AnnotationEditor {
  #baseHeight = 0;
  #baseWidth = 0;
  #boundCanvasPointermove = this.canvasPointermove.bind(this);
  #boundCanvasPointerleave = this.canvasPointerleave.bind(this);
  #boundCanvasPointerup = this.canvasPointerup.bind(this);
  #boundCanvasPointerdown = this.canvasPointerdown.bind(this);
  #currentPath2D = new Path2D();
  #disableEditing = false;
  #hasSomethingToDraw = false;
  #isCanvasInitialized = false;
  #observer = null;
  #realWidth = 0;
  #realHeight = 0;
  #requestFrameCallback = null;
  static _defaultColor = null;
  static _defaultOpacity = 1;
  static _defaultThickness = 1;
  static _type = "ink";
  constructor(params) {
    super({
      ...params,
      name: "inkEditor"
    });
    this.color = params.color || null;
    this.thickness = params.thickness || null;
    this.opacity = params.opacity || null;
    this.paths = [];
    this.bezierPath2D = [];
    this.allRawPaths = [];
    this.currentPath = [];
    this.scaleFactor = 1;
    this.translationX = this.translationY = 0;
    this.x = 0;
    this.y = 0;
    this._willKeepAspectRatio = true;
  }
  static initialize(l10n) {
    _editor.AnnotationEditor.initialize(l10n, {
      strings: ["editor_ink_canvas_aria_label", "editor_ink2_aria_label"]
    });
  }
  static updateDefaultParams(type, value) {
    switch (type) {
      case _util.AnnotationEditorParamsType.INK_THICKNESS:
        InkEditor._defaultThickness = value;
        break;
      case _util.AnnotationEditorParamsType.INK_COLOR:
        InkEditor._defaultColor = value;
        break;
      case _util.AnnotationEditorParamsType.INK_OPACITY:
        InkEditor._defaultOpacity = value / 100;
        break;
    }
  }
  updateParams(type, value) {
    switch (type) {
      case _util.AnnotationEditorParamsType.INK_THICKNESS:
        this.#updateThickness(value);
        break;
      case _util.AnnotationEditorParamsType.INK_COLOR:
        this.#updateColor(value);
        break;
      case _util.AnnotationEditorParamsType.INK_OPACITY:
        this.#updateOpacity(value);
        break;
    }
  }
  static get defaultPropertiesToUpdate() {
    return [[_util.AnnotationEditorParamsType.INK_THICKNESS, InkEditor._defaultThickness], [_util.AnnotationEditorParamsType.INK_COLOR, InkEditor._defaultColor || _editor.AnnotationEditor._defaultLineColor], [_util.AnnotationEditorParamsType.INK_OPACITY, Math.round(InkEditor._defaultOpacity * 100)]];
  }
  get propertiesToUpdate() {
    return [[_util.AnnotationEditorParamsType.INK_THICKNESS, this.thickness || InkEditor._defaultThickness], [_util.AnnotationEditorParamsType.INK_COLOR, this.color || InkEditor._defaultColor || _editor.AnnotationEditor._defaultLineColor], [_util.AnnotationEditorParamsType.INK_OPACITY, Math.round(100 * (this.opacity ?? InkEditor._defaultOpacity))]];
  }
  #updateThickness(thickness) {
    const savedThickness = this.thickness;
    this.addCommands({
      cmd: () => {
        this.thickness = thickness;
        this.#fitToContent();
      },
      undo: () => {
        this.thickness = savedThickness;
        this.#fitToContent();
      },
      mustExec: true,
      type: _util.AnnotationEditorParamsType.INK_THICKNESS,
      overwriteIfSameType: true,
      keepUndo: true
    });
  }
  #updateColor(color) {
    const savedColor = this.color;
    this.addCommands({
      cmd: () => {
        this.color = color;
        this.#redraw();
      },
      undo: () => {
        this.color = savedColor;
        this.#redraw();
      },
      mustExec: true,
      type: _util.AnnotationEditorParamsType.INK_COLOR,
      overwriteIfSameType: true,
      keepUndo: true
    });
  }
  #updateOpacity(opacity) {
    opacity /= 100;
    const savedOpacity = this.opacity;
    this.addCommands({
      cmd: () => {
        this.opacity = opacity;
        this.#redraw();
      },
      undo: () => {
        this.opacity = savedOpacity;
        this.#redraw();
      },
      mustExec: true,
      type: _util.AnnotationEditorParamsType.INK_OPACITY,
      overwriteIfSameType: true,
      keepUndo: true
    });
  }
  rebuild() {
    if (!this.parent) {
      return;
    }
    super.rebuild();
    if (this.div === null) {
      return;
    }
    if (!this.canvas) {
      this.#createCanvas();
      this.#createObserver();
    }
    if (!this.isAttachedToDOM) {
      this.parent.add(this);
      this.#setCanvasDims();
    }
    this.#fitToContent();
  }
  remove() {
    if (this.canvas === null) {
      return;
    }
    if (!this.isEmpty()) {
      this.commit();
    }
    this.canvas.width = this.canvas.height = 0;
    this.canvas.remove();
    this.canvas = null;
    this.#observer.disconnect();
    this.#observer = null;
    super.remove();
  }
  setParent(parent) {
    if (!this.parent && parent) {
      this._uiManager.removeShouldRescale(this);
    } else if (this.parent && parent === null) {
      this._uiManager.addShouldRescale(this);
    }
    super.setParent(parent);
  }
  onScaleChanging() {
    const [parentWidth, parentHeight] = this.parentDimensions;
    const width = this.width * parentWidth;
    const height = this.height * parentHeight;
    this.setDimensions(width, height);
  }
  enableEditMode() {
    if (this.#disableEditing || this.canvas === null) {
      return;
    }
    super.enableEditMode();
    this._isDraggable = false;
    this.canvas.addEventListener("pointerdown", this.#boundCanvasPointerdown);
  }
  disableEditMode() {
    if (!this.isInEditMode() || this.canvas === null) {
      return;
    }
    super.disableEditMode();
    this._isDraggable = !this.isEmpty();
    this.div.classList.remove("editing");
    this.canvas.removeEventListener("pointerdown", this.#boundCanvasPointerdown);
  }
  onceAdded() {
    this._isDraggable = !this.isEmpty();
  }
  isEmpty() {
    return this.paths.length === 0 || this.paths.length === 1 && this.paths[0].length === 0;
  }
  #getInitialBBox() {
    const {
      parentRotation,
      parentDimensions: [width, height]
    } = this;
    switch (parentRotation) {
      case 90:
        return [0, height, height, width];
      case 180:
        return [width, height, width, height];
      case 270:
        return [width, 0, height, width];
      default:
        return [0, 0, width, height];
    }
  }
  #setStroke() {
    const {
      ctx,
      color,
      opacity,
      thickness,
      parentScale,
      scaleFactor
    } = this;
    ctx.lineWidth = thickness * parentScale / scaleFactor;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.miterLimit = 10;
    ctx.strokeStyle = `${color}${(0, _tools.opacityToHex)(opacity)}`;
  }
  #startDrawing(x, y) {
    this.canvas.addEventListener("contextmenu", _display_utils.noContextMenu);
    this.canvas.addEventListener("pointerleave", this.#boundCanvasPointerleave);
    this.canvas.addEventListener("pointermove", this.#boundCanvasPointermove);
    this.canvas.addEventListener("pointerup", this.#boundCanvasPointerup);
    this.canvas.removeEventListener("pointerdown", this.#boundCanvasPointerdown);
    this.isEditing = true;
    if (!this.#isCanvasInitialized) {
      this.#isCanvasInitialized = true;
      this.#setCanvasDims();
      this.thickness ||= InkEditor._defaultThickness;
      this.color ||= InkEditor._defaultColor || _editor.AnnotationEditor._defaultLineColor;
      this.opacity ??= InkEditor._defaultOpacity;
    }
    this.currentPath.push([x, y]);
    this.#hasSomethingToDraw = false;
    this.#setStroke();
    this.#requestFrameCallback = () => {
      this.#drawPoints();
      if (this.#requestFrameCallback) {
        window.requestAnimationFrame(this.#requestFrameCallback);
      }
    };
    window.requestAnimationFrame(this.#requestFrameCallback);
  }
  #draw(x, y) {
    const [lastX, lastY] = this.currentPath.at(-1);
    if (this.currentPath.length > 1 && x === lastX && y === lastY) {
      return;
    }
    const currentPath = this.currentPath;
    let path2D = this.#currentPath2D;
    currentPath.push([x, y]);
    this.#hasSomethingToDraw = true;
    if (currentPath.length <= 2) {
      path2D.moveTo(...currentPath[0]);
      path2D.lineTo(x, y);
      return;
    }
    if (currentPath.length === 3) {
      this.#currentPath2D = path2D = new Path2D();
      path2D.moveTo(...currentPath[0]);
    }
    this.#makeBezierCurve(path2D, ...currentPath.at(-3), ...currentPath.at(-2), x, y);
  }
  #endPath() {
    if (this.currentPath.length === 0) {
      return;
    }
    const lastPoint = this.currentPath.at(-1);
    this.#currentPath2D.lineTo(...lastPoint);
  }
  #stopDrawing(x, y) {
    this.#requestFrameCallback = null;
    x = Math.min(Math.max(x, 0), this.canvas.width);
    y = Math.min(Math.max(y, 0), this.canvas.height);
    this.#draw(x, y);
    this.#endPath();
    let bezier;
    if (this.currentPath.length !== 1) {
      bezier = this.#generateBezierPoints();
    } else {
      const xy = [x, y];
      bezier = [[xy, xy.slice(), xy.slice(), xy]];
    }
    const path2D = this.#currentPath2D;
    const currentPath = this.currentPath;
    this.currentPath = [];
    this.#currentPath2D = new Path2D();
    const cmd = () => {
      this.allRawPaths.push(currentPath);
      this.paths.push(bezier);
      this.bezierPath2D.push(path2D);
      this.rebuild();
    };
    const undo = () => {
      this.allRawPaths.pop();
      this.paths.pop();
      this.bezierPath2D.pop();
      if (this.paths.length === 0) {
        this.remove();
      } else {
        if (!this.canvas) {
          this.#createCanvas();
          this.#createObserver();
        }
        this.#fitToContent();
      }
    };
    this.addCommands({
      cmd,
      undo,
      mustExec: true
    });
  }
  #drawPoints() {
    if (!this.#hasSomethingToDraw) {
      return;
    }
    this.#hasSomethingToDraw = false;
    const thickness = Math.ceil(this.thickness * this.parentScale);
    const lastPoints = this.currentPath.slice(-3);
    const x = lastPoints.map(xy => xy[0]);
    const y = lastPoints.map(xy => xy[1]);
    const xMin = Math.min(...x) - thickness;
    const xMax = Math.max(...x) + thickness;
    const yMin = Math.min(...y) - thickness;
    const yMax = Math.max(...y) + thickness;
    const {
      ctx
    } = this;
    ctx.save();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const path of this.bezierPath2D) {
      ctx.stroke(path);
    }
    ctx.stroke(this.#currentPath2D);
    ctx.restore();
  }
  #makeBezierCurve(path2D, x0, y0, x1, y1, x2, y2) {
    const prevX = (x0 + x1) / 2;
    const prevY = (y0 + y1) / 2;
    const x3 = (x1 + x2) / 2;
    const y3 = (y1 + y2) / 2;
    path2D.bezierCurveTo(prevX + 2 * (x1 - prevX) / 3, prevY + 2 * (y1 - prevY) / 3, x3 + 2 * (x1 - x3) / 3, y3 + 2 * (y1 - y3) / 3, x3, y3);
  }
  #generateBezierPoints() {
    const path = this.currentPath;
    if (path.length <= 2) {
      return [[path[0], path[0], path.at(-1), path.at(-1)]];
    }
    const bezierPoints = [];
    let i;
    let [x0, y0] = path[0];
    for (i = 1; i < path.length - 2; i++) {
      const [x1, y1] = path[i];
      const [x2, y2] = path[i + 1];
      const x3 = (x1 + x2) / 2;
      const y3 = (y1 + y2) / 2;
      const control1 = [x0 + 2 * (x1 - x0) / 3, y0 + 2 * (y1 - y0) / 3];
      const control2 = [x3 + 2 * (x1 - x3) / 3, y3 + 2 * (y1 - y3) / 3];
      bezierPoints.push([[x0, y0], control1, control2, [x3, y3]]);
      [x0, y0] = [x3, y3];
    }
    const [x1, y1] = path[i];
    const [x2, y2] = path[i + 1];
    const control1 = [x0 + 2 * (x1 - x0) / 3, y0 + 2 * (y1 - y0) / 3];
    const control2 = [x2 + 2 * (x1 - x2) / 3, y2 + 2 * (y1 - y2) / 3];
    bezierPoints.push([[x0, y0], control1, control2, [x2, y2]]);
    return bezierPoints;
  }
  #redraw() {
    if (this.isEmpty()) {
      this.#updateTransform();
      return;
    }
    this.#setStroke();
    const {
      canvas,
      ctx
    } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.#updateTransform();
    for (const path of this.bezierPath2D) {
      ctx.stroke(path);
    }
  }
  commit() {
    if (this.#disableEditing) {
      return;
    }
    super.commit();
    this.isEditing = false;
    this.disableEditMode();
    this.setInForeground();
    this.#disableEditing = true;
    this.div.classList.add("disabled");
    this.#fitToContent(true);
    this.makeResizable();
    this.parent.addInkEditorIfNeeded(true);
    this.moveInDOM();
    this.div.focus({
      preventScroll: true
    });
  }
  focusin(event) {
    if (!this._focusEventsAllowed) {
      return;
    }
    super.focusin(event);
    this.enableEditMode();
  }
  canvasPointerdown(event) {
    if (event.button !== 0 || !this.isInEditMode() || this.#disableEditing) {
      return;
    }
    this.setInForeground();
    event.preventDefault();
    if (event.type !== "mouse") {
      this.div.focus();
    }
    this.#startDrawing(event.offsetX, event.offsetY);
  }
  canvasPointermove(event) {
    event.preventDefault();
    this.#draw(event.offsetX, event.offsetY);
  }
  canvasPointerup(event) {
    event.preventDefault();
    this.#endDrawing(event);
  }
  canvasPointerleave(event) {
    this.#endDrawing(event);
  }
  #endDrawing(event) {
    this.canvas.removeEventListener("pointerleave", this.#boundCanvasPointerleave);
    this.canvas.removeEventListener("pointermove", this.#boundCanvasPointermove);
    this.canvas.removeEventListener("pointerup", this.#boundCanvasPointerup);
    this.canvas.addEventListener("pointerdown", this.#boundCanvasPointerdown);
    setTimeout(() => {
      this.canvas.removeEventListener("contextmenu", _display_utils.noContextMenu);
    }, 10);
    this.#stopDrawing(event.offsetX, event.offsetY);
    this.addToAnnotationStorage();
    this.setInBackground();
  }
  #createCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.canvas.height = 0;
    this.canvas.className = "inkEditorCanvas";
    _editor.AnnotationEditor._l10nPromise.get("editor_ink_canvas_aria_label").then(msg => this.canvas?.setAttribute("aria-label", msg));
    this.div.append(this.canvas);
    this.ctx = this.canvas.getContext("2d");
  }
  #createObserver() {
    this.#observer = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      if (rect.width && rect.height) {
        this.setDimensions(rect.width, rect.height);
      }
    });
    this.#observer.observe(this.div);
  }
  get isResizable() {
    return !this.isEmpty() && this.#disableEditing;
  }
  render() {
    if (this.div) {
      return this.div;
    }
    let baseX, baseY;
    if (this.width) {
      baseX = this.x;
      baseY = this.y;
    }
    super.render();
    _editor.AnnotationEditor._l10nPromise.get("editor_ink2_aria_label").then(msg => this.div?.setAttribute("aria-label", msg));
    const [x, y, w, h] = this.#getInitialBBox();
    this.setAt(x, y, 0, 0);
    this.setDims(w, h);
    this.#createCanvas();
    if (this.width) {
      const [parentWidth, parentHeight] = this.parentDimensions;
      this.setAspectRatio(this.width * parentWidth, this.height * parentHeight);
      this.setAt(baseX * parentWidth, baseY * parentHeight, this.width * parentWidth, this.height * parentHeight);
      this.#isCanvasInitialized = true;
      this.#setCanvasDims();
      this.setDims(this.width * parentWidth, this.height * parentHeight);
      this.#redraw();
      this.div.classList.add("disabled");
    } else {
      this.div.classList.add("editing");
      this.enableEditMode();
    }
    this.#createObserver();
    return this.div;
  }
  #setCanvasDims() {
    if (!this.#isCanvasInitialized) {
      return;
    }
    const [parentWidth, parentHeight] = this.parentDimensions;
    this.canvas.width = Math.ceil(this.width * parentWidth);
    this.canvas.height = Math.ceil(this.height * parentHeight);
    this.#updateTransform();
  }
  setDimensions(width, height) {
    const roundedWidth = Math.round(width);
    const roundedHeight = Math.round(height);
    if (this.#realWidth === roundedWidth && this.#realHeight === roundedHeight) {
      return;
    }
    this.#realWidth = roundedWidth;
    this.#realHeight = roundedHeight;
    this.canvas.style.visibility = "hidden";
    const [parentWidth, parentHeight] = this.parentDimensions;
    this.width = width / parentWidth;
    this.height = height / parentHeight;
    this.fixAndSetPosition();
    if (this.#disableEditing) {
      this.#setScaleFactor(width, height);
    }
    this.#setCanvasDims();
    this.#redraw();
    this.canvas.style.visibility = "visible";
    this.fixDims();
  }
  #setScaleFactor(width, height) {
    const padding = this.#getPadding();
    const scaleFactorW = (width - padding) / this.#baseWidth;
    const scaleFactorH = (height - padding) / this.#baseHeight;
    this.scaleFactor = Math.min(scaleFactorW, scaleFactorH);
  }
  #updateTransform() {
    const padding = this.#getPadding() / 2;
    this.ctx.setTransform(this.scaleFactor, 0, 0, this.scaleFactor, this.translationX * this.scaleFactor + padding, this.translationY * this.scaleFactor + padding);
  }
  static #buildPath2D(bezier) {
    const path2D = new Path2D();
    for (let i = 0, ii = bezier.length; i < ii; i++) {
      const [first, control1, control2, second] = bezier[i];
      if (i === 0) {
        path2D.moveTo(...first);
      }
      path2D.bezierCurveTo(control1[0], control1[1], control2[0], control2[1], second[0], second[1]);
    }
    return path2D;
  }
  static #toPDFCoordinates(points, rect, rotation) {
    const [blX, blY, trX, trY] = rect;
    switch (rotation) {
      case 0:
        for (let i = 0, ii = points.length; i < ii; i += 2) {
          points[i] += blX;
          points[i + 1] = trY - points[i + 1];
        }
        break;
      case 90:
        for (let i = 0, ii = points.length; i < ii; i += 2) {
          const x = points[i];
          points[i] = points[i + 1] + blX;
          points[i + 1] = x + blY;
        }
        break;
      case 180:
        for (let i = 0, ii = points.length; i < ii; i += 2) {
          points[i] = trX - points[i];
          points[i + 1] += blY;
        }
        break;
      case 270:
        for (let i = 0, ii = points.length; i < ii; i += 2) {
          const x = points[i];
          points[i] = trX - points[i + 1];
          points[i + 1] = trY - x;
        }
        break;
      default:
        throw new Error("Invalid rotation");
    }
    return points;
  }
  static #fromPDFCoordinates(points, rect, rotation) {
    const [blX, blY, trX, trY] = rect;
    switch (rotation) {
      case 0:
        for (let i = 0, ii = points.length; i < ii; i += 2) {
          points[i] -= blX;
          points[i + 1] = trY - points[i + 1];
        }
        break;
      case 90:
        for (let i = 0, ii = points.length; i < ii; i += 2) {
          const x = points[i];
          points[i] = points[i + 1] - blY;
          points[i + 1] = x - blX;
        }
        break;
      case 180:
        for (let i = 0, ii = points.length; i < ii; i += 2) {
          points[i] = trX - points[i];
          points[i + 1] -= blY;
        }
        break;
      case 270:
        for (let i = 0, ii = points.length; i < ii; i += 2) {
          const x = points[i];
          points[i] = trY - points[i + 1];
          points[i + 1] = trX - x;
        }
        break;
      default:
        throw new Error("Invalid rotation");
    }
    return points;
  }
  #serializePaths(s, tx, ty, rect) {
    const paths = [];
    const padding = this.thickness / 2;
    const shiftX = s * tx + padding;
    const shiftY = s * ty + padding;
    for (const bezier of this.paths) {
      const buffer = [];
      const points = [];
      for (let j = 0, jj = bezier.length; j < jj; j++) {
        const [first, control1, control2, second] = bezier[j];
        const p10 = s * first[0] + shiftX;
        const p11 = s * first[1] + shiftY;
        const p20 = s * control1[0] + shiftX;
        const p21 = s * control1[1] + shiftY;
        const p30 = s * control2[0] + shiftX;
        const p31 = s * control2[1] + shiftY;
        const p40 = s * second[0] + shiftX;
        const p41 = s * second[1] + shiftY;
        if (j === 0) {
          buffer.push(p10, p11);
          points.push(p10, p11);
        }
        buffer.push(p20, p21, p30, p31, p40, p41);
        points.push(p20, p21);
        if (j === jj - 1) {
          points.push(p40, p41);
        }
      }
      paths.push({
        bezier: InkEditor.#toPDFCoordinates(buffer, rect, this.rotation),
        points: InkEditor.#toPDFCoordinates(points, rect, this.rotation)
      });
    }
    return paths;
  }
  #getBbox() {
    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;
    for (const path of this.paths) {
      for (const [first, control1, control2, second] of path) {
        const bbox = _util.Util.bezierBoundingBox(...first, ...control1, ...control2, ...second);
        xMin = Math.min(xMin, bbox[0]);
        yMin = Math.min(yMin, bbox[1]);
        xMax = Math.max(xMax, bbox[2]);
        yMax = Math.max(yMax, bbox[3]);
      }
    }
    return [xMin, yMin, xMax, yMax];
  }
  #getPadding() {
    return this.#disableEditing ? Math.ceil(this.thickness * this.parentScale) : 0;
  }
  #fitToContent(firstTime = false) {
    if (this.isEmpty()) {
      return;
    }
    if (!this.#disableEditing) {
      this.#redraw();
      return;
    }
    const bbox = this.#getBbox();
    const padding = this.#getPadding();
    this.#baseWidth = Math.max(_editor.AnnotationEditor.MIN_SIZE, bbox[2] - bbox[0]);
    this.#baseHeight = Math.max(_editor.AnnotationEditor.MIN_SIZE, bbox[3] - bbox[1]);
    const width = Math.ceil(padding + this.#baseWidth * this.scaleFactor);
    const height = Math.ceil(padding + this.#baseHeight * this.scaleFactor);
    const [parentWidth, parentHeight] = this.parentDimensions;
    this.width = width / parentWidth;
    this.height = height / parentHeight;
    this.setAspectRatio(width, height);
    const prevTranslationX = this.translationX;
    const prevTranslationY = this.translationY;
    this.translationX = -bbox[0];
    this.translationY = -bbox[1];
    this.#setCanvasDims();
    this.#redraw();
    this.#realWidth = width;
    this.#realHeight = height;
    this.setDims(width, height);
    const unscaledPadding = firstTime ? padding / this.scaleFactor / 2 : 0;
    this.translate(prevTranslationX - this.translationX - unscaledPadding, prevTranslationY - this.translationY - unscaledPadding);
  }
  static deserialize(data, parent, uiManager) {
    if (data instanceof _annotation_layer.InkAnnotationElement) {
      return null;
    }
    const editor = super.deserialize(data, parent, uiManager);
    editor.thickness = data.thickness;
    editor.color = _util.Util.makeHexColor(...data.color);
    editor.opacity = data.opacity;
    const [pageWidth, pageHeight] = editor.pageDimensions;
    const width = editor.width * pageWidth;
    const height = editor.height * pageHeight;
    const scaleFactor = editor.parentScale;
    const padding = data.thickness / 2;
    editor.#disableEditing = true;
    editor.#realWidth = Math.round(width);
    editor.#realHeight = Math.round(height);
    const {
      paths,
      rect,
      rotation
    } = data;
    for (let {
      bezier
    } of paths) {
      bezier = InkEditor.#fromPDFCoordinates(bezier, rect, rotation);
      const path = [];
      editor.paths.push(path);
      let p0 = scaleFactor * (bezier[0] - padding);
      let p1 = scaleFactor * (bezier[1] - padding);
      for (let i = 2, ii = bezier.length; i < ii; i += 6) {
        const p10 = scaleFactor * (bezier[i] - padding);
        const p11 = scaleFactor * (bezier[i + 1] - padding);
        const p20 = scaleFactor * (bezier[i + 2] - padding);
        const p21 = scaleFactor * (bezier[i + 3] - padding);
        const p30 = scaleFactor * (bezier[i + 4] - padding);
        const p31 = scaleFactor * (bezier[i + 5] - padding);
        path.push([[p0, p1], [p10, p11], [p20, p21], [p30, p31]]);
        p0 = p30;
        p1 = p31;
      }
      const path2D = this.#buildPath2D(path);
      editor.bezierPath2D.push(path2D);
    }
    const bbox = editor.#getBbox();
    editor.#baseWidth = Math.max(_editor.AnnotationEditor.MIN_SIZE, bbox[2] - bbox[0]);
    editor.#baseHeight = Math.max(_editor.AnnotationEditor.MIN_SIZE, bbox[3] - bbox[1]);
    editor.#setScaleFactor(width, height);
    return editor;
  }
  serialize() {
    if (this.isEmpty()) {
      return null;
    }
    const rect = this.getRect(0, 0);
    const color = _editor.AnnotationEditor._colorManager.convert(this.ctx.strokeStyle);
    return {
      annotationType: _util.AnnotationEditorType.INK,
      color,
      thickness: this.thickness,
      opacity: this.opacity,
      paths: this.#serializePaths(this.scaleFactor / this.parentScale, this.translationX, this.translationY, rect),
      pageIndex: this.pageIndex,
      rect,
      rotation: this.rotation,
      structTreeParentId: this._structTreeParentId
    };
  }
}
exports.InkEditor = InkEditor;

/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StampEditor = void 0;
var _util = __w_pdfjs_require__(1);
var _editor = __w_pdfjs_require__(4);
var _display_utils = __w_pdfjs_require__(6);
var _annotation_layer = __w_pdfjs_require__(29);
class StampEditor extends _editor.AnnotationEditor {
  #bitmap = null;
  #bitmapId = null;
  #bitmapPromise = null;
  #bitmapUrl = null;
  #bitmapFile = null;
  #canvas = null;
  #observer = null;
  #resizeTimeoutId = null;
  #isSvg = false;
  #hasBeenAddedInUndoStack = false;
  static _type = "stamp";
  constructor(params) {
    super({
      ...params,
      name: "stampEditor"
    });
    this.#bitmapUrl = params.bitmapUrl;
    this.#bitmapFile = params.bitmapFile;
  }
  static initialize(l10n) {
    _editor.AnnotationEditor.initialize(l10n);
  }
  static get supportedTypes() {
    const types = ["apng", "avif", "bmp", "gif", "jpeg", "png", "svg+xml", "webp", "x-icon"];
    return (0, _util.shadow)(this, "supportedTypes", types.map(type => `image/${type}`));
  }
  static get supportedTypesStr() {
    return (0, _util.shadow)(this, "supportedTypesStr", this.supportedTypes.join(","));
  }
  static isHandlingMimeForPasting(mime) {
    return this.supportedTypes.includes(mime);
  }
  static paste(item, parent) {
    parent.pasteEditor(_util.AnnotationEditorType.STAMP, {
      bitmapFile: item.getAsFile()
    });
  }
  #getBitmapFetched(data, fromId = false) {
    if (!data) {
      this.remove();
      return;
    }
    this.#bitmap = data.bitmap;
    if (!fromId) {
      this.#bitmapId = data.id;
      this.#isSvg = data.isSvg;
    }
    this.#createCanvas();
  }
  #getBitmapDone() {
    this.#bitmapPromise = null;
    this._uiManager.enableWaiting(false);
    if (this.#canvas) {
      this.div.focus();
    }
  }
  #getBitmap() {
    if (this.#bitmapId) {
      this._uiManager.enableWaiting(true);
      this._uiManager.imageManager.getFromId(this.#bitmapId).then(data => this.#getBitmapFetched(data, true)).finally(() => this.#getBitmapDone());
      return;
    }
    if (this.#bitmapUrl) {
      const url = this.#bitmapUrl;
      this.#bitmapUrl = null;
      this._uiManager.enableWaiting(true);
      this.#bitmapPromise = this._uiManager.imageManager.getFromUrl(url).then(data => this.#getBitmapFetched(data)).finally(() => this.#getBitmapDone());
      return;
    }
    if (this.#bitmapFile) {
      const file = this.#bitmapFile;
      this.#bitmapFile = null;
      this._uiManager.enableWaiting(true);
      this.#bitmapPromise = this._uiManager.imageManager.getFromFile(file).then(data => this.#getBitmapFetched(data)).finally(() => this.#getBitmapDone());
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = StampEditor.supportedTypesStr;
    this.#bitmapPromise = new Promise(resolve => {
      input.addEventListener("change", async () => {
        if (!input.files || input.files.length === 0) {
          this.remove();
        } else {
          this._uiManager.enableWaiting(true);
          const data = await this._uiManager.imageManager.getFromFile(input.files[0]);
          this.#getBitmapFetched(data);
        }
        resolve();
      });
      input.addEventListener("cancel", () => {
        this.remove();
        resolve();
      });
    }).finally(() => this.#getBitmapDone());
    input.click();
  }
  remove() {
    if (this.#bitmapId) {
      this.#bitmap = null;
      this._uiManager.imageManager.deleteId(this.#bitmapId);
      this.#canvas?.remove();
      this.#canvas = null;
      this.#observer?.disconnect();
      this.#observer = null;
    }
    super.remove();
  }
  rebuild() {
    if (!this.parent) {
      if (this.#bitmapId) {
        this.#getBitmap();
      }
      return;
    }
    super.rebuild();
    if (this.div === null) {
      return;
    }
    if (this.#bitmapId) {
      this.#getBitmap();
    }
    if (!this.isAttachedToDOM) {
      this.parent.add(this);
    }
  }
  onceAdded() {
    this._isDraggable = true;
    this.div.focus();
  }
  isEmpty() {
    return !(this.#bitmapPromise || this.#bitmap || this.#bitmapUrl || this.#bitmapFile);
  }
  get isResizable() {
    return true;
  }
  render() {
    if (this.div) {
      return this.div;
    }
    let baseX, baseY;
    if (this.width) {
      baseX = this.x;
      baseY = this.y;
    }
    super.render();
    this.div.hidden = true;
    if (this.#bitmap) {
      this.#createCanvas();
    } else {
      this.#getBitmap();
    }
    if (this.width) {
      const [parentWidth, parentHeight] = this.parentDimensions;
      this.setAt(baseX * parentWidth, baseY * parentHeight, this.width * parentWidth, this.height * parentHeight);
    }
    return this.div;
  }
  #createCanvas() {
    const {
      div
    } = this;
    let {
      width,
      height
    } = this.#bitmap;
    const [pageWidth, pageHeight] = this.pageDimensions;
    const MAX_RATIO = 0.75;
    if (this.width) {
      width = this.width * pageWidth;
      height = this.height * pageHeight;
    } else if (width > MAX_RATIO * pageWidth || height > MAX_RATIO * pageHeight) {
      const factor = Math.min(MAX_RATIO * pageWidth / width, MAX_RATIO * pageHeight / height);
      width *= factor;
      height *= factor;
    }
    const [parentWidth, parentHeight] = this.parentDimensions;
    this.setDims(width * parentWidth / pageWidth, height * parentHeight / pageHeight);
    this._uiManager.enableWaiting(false);
    const canvas = this.#canvas = document.createElement("canvas");
    div.append(canvas);
    div.hidden = false;
    this.#drawBitmap(width, height);
    this.#createObserver();
    if (!this.#hasBeenAddedInUndoStack) {
      this.parent.addUndoableEditor(this);
      this.#hasBeenAddedInUndoStack = true;
    }
    this._uiManager._eventBus.dispatch("reporttelemetry", {
      source: this,
      details: {
        type: "editing",
        subtype: this.editorType,
        data: {
          action: "inserted_image"
        }
      }
    });
    this.addAltTextButton();
  }
  #setDimensions(width, height) {
    const [parentWidth, parentHeight] = this.parentDimensions;
    this.width = width / parentWidth;
    this.height = height / parentHeight;
    this.setDims(width, height);
    if (this._initialOptions?.isCentered) {
      this.center();
    } else {
      this.fixAndSetPosition();
    }
    this._initialOptions = null;
    if (this.#resizeTimeoutId !== null) {
      clearTimeout(this.#resizeTimeoutId);
    }
    const TIME_TO_WAIT = 200;
    this.#resizeTimeoutId = setTimeout(() => {
      this.#resizeTimeoutId = null;
      this.#drawBitmap(width, height);
    }, TIME_TO_WAIT);
  }
  #scaleBitmap(width, height) {
    const {
      width: bitmapWidth,
      height: bitmapHeight
    } = this.#bitmap;
    let newWidth = bitmapWidth;
    let newHeight = bitmapHeight;
    let bitmap = this.#bitmap;
    while (newWidth > 2 * width || newHeight > 2 * height) {
      const prevWidth = newWidth;
      const prevHeight = newHeight;
      if (newWidth > 2 * width) {
        newWidth = newWidth >= 16384 ? Math.floor(newWidth / 2) - 1 : Math.ceil(newWidth / 2);
      }
      if (newHeight > 2 * height) {
        newHeight = newHeight >= 16384 ? Math.floor(newHeight / 2) - 1 : Math.ceil(newHeight / 2);
      }
      const offscreen = new OffscreenCanvas(newWidth, newHeight);
      const ctx = offscreen.getContext("2d");
      ctx.drawImage(bitmap, 0, 0, prevWidth, prevHeight, 0, 0, newWidth, newHeight);
      bitmap = offscreen.transferToImageBitmap();
    }
    return bitmap;
  }
  #drawBitmap(width, height) {
    width = Math.ceil(width);
    height = Math.ceil(height);
    const canvas = this.#canvas;
    if (!canvas || canvas.width === width && canvas.height === height) {
      return;
    }
    canvas.width = width;
    canvas.height = height;
    const bitmap = this.#isSvg ? this.#bitmap : this.#scaleBitmap(width, height);
    const ctx = canvas.getContext("2d");
    ctx.filter = this._uiManager.hcmFilter;
    ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, width, height);
  }
  #serializeBitmap(toUrl) {
    if (toUrl) {
      if (this.#isSvg) {
        const url = this._uiManager.imageManager.getSvgUrl(this.#bitmapId);
        if (url) {
          return url;
        }
      }
      const canvas = document.createElement("canvas");
      ({
        width: canvas.width,
        height: canvas.height
      } = this.#bitmap);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(this.#bitmap, 0, 0);
      return canvas.toDataURL();
    }
    if (this.#isSvg) {
      const [pageWidth, pageHeight] = this.pageDimensions;
      const width = Math.round(this.width * pageWidth * _display_utils.PixelsPerInch.PDF_TO_CSS_UNITS);
      const height = Math.round(this.height * pageHeight * _display_utils.PixelsPerInch.PDF_TO_CSS_UNITS);
      const offscreen = new OffscreenCanvas(width, height);
      const ctx = offscreen.getContext("2d");
      ctx.drawImage(this.#bitmap, 0, 0, this.#bitmap.width, this.#bitmap.height, 0, 0, width, height);
      return offscreen.transferToImageBitmap();
    }
    return structuredClone(this.#bitmap);
  }
  #createObserver() {
    this.#observer = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      if (rect.width && rect.height) {
        this.#setDimensions(rect.width, rect.height);
      }
    });
    this.#observer.observe(this.div);
  }
  static deserialize(data, parent, uiManager) {
    if (data instanceof _annotation_layer.StampAnnotationElement) {
      return null;
    }
    const editor = super.deserialize(data, parent, uiManager);
    const {
      rect,
      bitmapUrl,
      bitmapId,
      isSvg,
      accessibilityData
    } = data;
    if (bitmapId && uiManager.imageManager.isValidId(bitmapId)) {
      editor.#bitmapId = bitmapId;
    } else {
      editor.#bitmapUrl = bitmapUrl;
    }
    editor.#isSvg = isSvg;
    const [parentWidth, parentHeight] = editor.pageDimensions;
    editor.width = (rect[2] - rect[0]) / parentWidth;
    editor.height = (rect[3] - rect[1]) / parentHeight;
    if (accessibilityData) {
      editor.altTextData = accessibilityData;
    }
    return editor;
  }
  serialize(isForCopying = false, context = null) {
    if (this.isEmpty()) {
      return null;
    }
    const serialized = {
      annotationType: _util.AnnotationEditorType.STAMP,
      bitmapId: this.#bitmapId,
      pageIndex: this.pageIndex,
      rect: this.getRect(0, 0),
      rotation: this.rotation,
      isSvg: this.#isSvg,
      structTreeParentId: this._structTreeParentId
    };
    if (isForCopying) {
      serialized.bitmapUrl = this.#serializeBitmap(true);
      serialized.accessibilityData = this.altTextData;
      return serialized;
    }
    const {
      decorative,
      altText
    } = this.altTextData;
    if (!decorative && altText) {
      serialized.accessibilityData = {
        type: "Figure",
        alt: altText
      };
    }
    if (context === null) {
      return serialized;
    }
    context.stamps ||= new Map();
    const area = this.#isSvg ? (serialized.rect[2] - serialized.rect[0]) * (serialized.rect[3] - serialized.rect[1]) : null;
    if (!context.stamps.has(this.#bitmapId)) {
      context.stamps.set(this.#bitmapId, {
        area,
        serialized
      });
      serialized.bitmap = this.#serializeBitmap(false);
    } else if (this.#isSvg) {
      const prevData = context.stamps.get(this.#bitmapId);
      if (area > prevData.area) {
        prevData.area = area;
        prevData.serialized.bitmap.close();
        prevData.serialized.bitmap = this.#serializeBitmap(false);
      }
    }
    return serialized;
  }
}
exports.StampEditor = StampEditor;

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __w_pdfjs_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __w_pdfjs_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __nested_webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __nested_webpack_exports__;


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "AbortException", ({
  enumerable: true,
  get: function () {
    return _util.AbortException;
  }
}));
Object.defineProperty(exports, "AnnotationEditorLayer", ({
  enumerable: true,
  get: function () {
    return _annotation_editor_layer.AnnotationEditorLayer;
  }
}));
Object.defineProperty(exports, "AnnotationEditorParamsType", ({
  enumerable: true,
  get: function () {
    return _util.AnnotationEditorParamsType;
  }
}));
Object.defineProperty(exports, "AnnotationEditorType", ({
  enumerable: true,
  get: function () {
    return _util.AnnotationEditorType;
  }
}));
Object.defineProperty(exports, "AnnotationEditorUIManager", ({
  enumerable: true,
  get: function () {
    return _tools.AnnotationEditorUIManager;
  }
}));
Object.defineProperty(exports, "AnnotationLayer", ({
  enumerable: true,
  get: function () {
    return _annotation_layer.AnnotationLayer;
  }
}));
Object.defineProperty(exports, "AnnotationMode", ({
  enumerable: true,
  get: function () {
    return _util.AnnotationMode;
  }
}));
Object.defineProperty(exports, "CMapCompressionType", ({
  enumerable: true,
  get: function () {
    return _util.CMapCompressionType;
  }
}));
Object.defineProperty(exports, "DOMSVGFactory", ({
  enumerable: true,
  get: function () {
    return _display_utils.DOMSVGFactory;
  }
}));
Object.defineProperty(exports, "FeatureTest", ({
  enumerable: true,
  get: function () {
    return _util.FeatureTest;
  }
}));
Object.defineProperty(exports, "GlobalWorkerOptions", ({
  enumerable: true,
  get: function () {
    return _worker_options.GlobalWorkerOptions;
  }
}));
Object.defineProperty(exports, "ImageKind", ({
  enumerable: true,
  get: function () {
    return _util.ImageKind;
  }
}));
Object.defineProperty(exports, "InvalidPDFException", ({
  enumerable: true,
  get: function () {
    return _util.InvalidPDFException;
  }
}));
Object.defineProperty(exports, "MissingPDFException", ({
  enumerable: true,
  get: function () {
    return _util.MissingPDFException;
  }
}));
Object.defineProperty(exports, "OPS", ({
  enumerable: true,
  get: function () {
    return _util.OPS;
  }
}));
Object.defineProperty(exports, "PDFDataRangeTransport", ({
  enumerable: true,
  get: function () {
    return _api.PDFDataRangeTransport;
  }
}));
Object.defineProperty(exports, "PDFDateString", ({
  enumerable: true,
  get: function () {
    return _display_utils.PDFDateString;
  }
}));
Object.defineProperty(exports, "PDFWorker", ({
  enumerable: true,
  get: function () {
    return _api.PDFWorker;
  }
}));
Object.defineProperty(exports, "PasswordResponses", ({
  enumerable: true,
  get: function () {
    return _util.PasswordResponses;
  }
}));
Object.defineProperty(exports, "PermissionFlag", ({
  enumerable: true,
  get: function () {
    return _util.PermissionFlag;
  }
}));
Object.defineProperty(exports, "PixelsPerInch", ({
  enumerable: true,
  get: function () {
    return _display_utils.PixelsPerInch;
  }
}));
Object.defineProperty(exports, "PromiseCapability", ({
  enumerable: true,
  get: function () {
    return _util.PromiseCapability;
  }
}));
Object.defineProperty(exports, "RenderingCancelledException", ({
  enumerable: true,
  get: function () {
    return _display_utils.RenderingCancelledException;
  }
}));
Object.defineProperty(exports, "SVGGraphics", ({
  enumerable: true,
  get: function () {
    return _api.SVGGraphics;
  }
}));
Object.defineProperty(exports, "UnexpectedResponseException", ({
  enumerable: true,
  get: function () {
    return _util.UnexpectedResponseException;
  }
}));
Object.defineProperty(exports, "Util", ({
  enumerable: true,
  get: function () {
    return _util.Util;
  }
}));
Object.defineProperty(exports, "VerbosityLevel", ({
  enumerable: true,
  get: function () {
    return _util.VerbosityLevel;
  }
}));
Object.defineProperty(exports, "XfaLayer", ({
  enumerable: true,
  get: function () {
    return _xfa_layer.XfaLayer;
  }
}));
Object.defineProperty(exports, "build", ({
  enumerable: true,
  get: function () {
    return _api.build;
  }
}));
Object.defineProperty(exports, "createValidAbsoluteUrl", ({
  enumerable: true,
  get: function () {
    return _util.createValidAbsoluteUrl;
  }
}));
Object.defineProperty(exports, "getDocument", ({
  enumerable: true,
  get: function () {
    return _api.getDocument;
  }
}));
Object.defineProperty(exports, "getFilenameFromUrl", ({
  enumerable: true,
  get: function () {
    return _display_utils.getFilenameFromUrl;
  }
}));
Object.defineProperty(exports, "getPdfFilenameFromUrl", ({
  enumerable: true,
  get: function () {
    return _display_utils.getPdfFilenameFromUrl;
  }
}));
Object.defineProperty(exports, "getXfaPageViewport", ({
  enumerable: true,
  get: function () {
    return _display_utils.getXfaPageViewport;
  }
}));
Object.defineProperty(exports, "isDataScheme", ({
  enumerable: true,
  get: function () {
    return _display_utils.isDataScheme;
  }
}));
Object.defineProperty(exports, "isPdfFile", ({
  enumerable: true,
  get: function () {
    return _display_utils.isPdfFile;
  }
}));
Object.defineProperty(exports, "loadScript", ({
  enumerable: true,
  get: function () {
    return _display_utils.loadScript;
  }
}));
Object.defineProperty(exports, "noContextMenu", ({
  enumerable: true,
  get: function () {
    return _display_utils.noContextMenu;
  }
}));
Object.defineProperty(exports, "normalizeUnicode", ({
  enumerable: true,
  get: function () {
    return _util.normalizeUnicode;
  }
}));
Object.defineProperty(exports, "renderTextLayer", ({
  enumerable: true,
  get: function () {
    return _text_layer.renderTextLayer;
  }
}));
Object.defineProperty(exports, "setLayerDimensions", ({
  enumerable: true,
  get: function () {
    return _display_utils.setLayerDimensions;
  }
}));
Object.defineProperty(exports, "shadow", ({
  enumerable: true,
  get: function () {
    return _util.shadow;
  }
}));
Object.defineProperty(exports, "updateTextLayer", ({
  enumerable: true,
  get: function () {
    return _text_layer.updateTextLayer;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _api.version;
  }
}));
var _util = __w_pdfjs_require__(1);
var _api = __w_pdfjs_require__(2);
var _display_utils = __w_pdfjs_require__(6);
var _text_layer = __w_pdfjs_require__(26);
var _annotation_editor_layer = __w_pdfjs_require__(27);
var _tools = __w_pdfjs_require__(5);
var _annotation_layer = __w_pdfjs_require__(29);
var _worker_options = __w_pdfjs_require__(14);
var _xfa_layer = __w_pdfjs_require__(32);
const pdfjsVersion = '3.11.174';
const pdfjsBuild = 'ce8716743';
})();

/******/ 	return __nested_webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=pdf.js.map

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ (function(module) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
  defineProperty(
    GeneratorFunctionPrototype,
    "constructor",
    { value: GeneratorFunction, configurable: true }
  );
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    defineProperty(this, "_invoke", { value: enqueue });
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per GeneratorResume behavior specified since ES2015:
        // ES2015 spec, step 3: https://262.ecma-international.org/6.0/#sec-generatorresume
        // Latest spec, step 2: https://tc39.es/ecma262/#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method;
    var method = delegate.iterator[methodName];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method, or a missing .next method, always terminate the
      // yield* loop.
      context.delegate = null;

      // Note: ["return"] must be used for ES3 parsing compatibility.
      if (methodName === "throw" && delegate.iterator["return"]) {
        // If the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined;
        maybeInvokeDelegate(delegate, context);

        if (context.method === "throw") {
          // If maybeInvokeDelegate(context) changed context.method from
          // "return" to "throw", let that override the TypeError below.
          return ContinueSentinel;
        }
      }
      if (methodName !== "return") {
        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a '" + methodName + "' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(val) {
    var object = Object(val);
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable != null) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    throw new TypeError(typeof iterable + " is not iterable");
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ "./src/taskpane/taskpane.css":
/*!***********************************!*\
  !*** ./src/taskpane/taskpane.css ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

"use strict";


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

"use strict";


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

"use strict";


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

"use strict";


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

"use strict";


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

"use strict";


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

"use strict";
module.exports = "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2710%27 height=%2710%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%238C8E91%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E";

/***/ }),

/***/ "./assets/icon-80-v2.png":
/*!*******************************!*\
  !*** ./assets/icon-80-v2.png ***!
  \*******************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "assets/icon-80-v2.png";

/***/ }),

/***/ "?4a14":
/*!************************!*\
  !*** canvas (ignored) ***!
  \************************/
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ "?fe90":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ "?d446":
/*!**********************!*\
  !*** http (ignored) ***!
  \**********************/
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ "?4c38":
/*!***********************!*\
  !*** https (ignored) ***!
  \***********************/
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ "?9f5f":
/*!*********************!*\
  !*** url (ignored) ***!
  \*********************/
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ "?afbb":
/*!**********************!*\
  !*** zlib (ignored) ***!
  \**********************/
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ "./node_modules/core-js/internals/a-callable.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/a-callable.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ "./node_modules/core-js/internals/a-possible-prototype.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/a-possible-prototype.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPossiblePrototype = __webpack_require__(/*! ../internals/is-possible-prototype */ "./node_modules/core-js/internals/is-possible-prototype.js");

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ "./node_modules/core-js/internals/an-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/an-object.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-buffer-basic-detection.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/array-buffer-basic-detection.js ***!
  \************************************************************************/
/***/ (function(module) {

"use strict";

// eslint-disable-next-line es/no-typed-arrays -- safe
module.exports = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';


/***/ }),

/***/ "./node_modules/core-js/internals/array-buffer-view-core.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/array-buffer-view-core.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_ARRAY_BUFFER = __webpack_require__(/*! ../internals/array-buffer-basic-detection */ "./node_modules/core-js/internals/array-buffer-basic-detection.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js/internals/global-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js/internals/define-built-in-accessor.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var Int8Array = globalThis.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = globalThis.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var TypeError = globalThis.TypeError;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(globalThis.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQUIRED = false;
var NAME, Constructor, Prototype;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var getTypedArrayConstructor = function (it) {
  var proto = getPrototypeOf(it);
  if (!isObject(proto)) return;
  var state = getInternalState(proto);
  return (state && hasOwn(state, TYPED_ARRAY_CONSTRUCTOR)) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor(proto);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw new TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (isCallable(C) && (!setPrototypeOf || isPrototypeOf(TypedArray, C))) return C;
  throw new TypeError(tryToString(C) + ' is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced, options) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = globalThis[ARRAY];
    if (TypedArrayConstructor && hasOwn(TypedArrayConstructor.prototype, KEY)) try {
      delete TypedArrayConstructor.prototype[KEY];
    } catch (error) {
      // old WebKit bug - some methods are non-configurable
      try {
        TypedArrayConstructor.prototype[KEY] = property;
      } catch (error2) { /* empty */ }
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    defineBuiltIn(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = globalThis[ARRAY];
      if (TypedArrayConstructor && hasOwn(TypedArrayConstructor, KEY)) try {
        delete TypedArrayConstructor[KEY];
      } catch (error) { /* empty */ }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return defineBuiltIn(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = globalThis[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      defineBuiltIn(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  Constructor = globalThis[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
  else NATIVE_ARRAY_BUFFER_VIEWS = false;
}

for (NAME in BigIntArrayConstructorsList) {
  Constructor = globalThis[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw new TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (globalThis[NAME]) setPrototypeOf(globalThis[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (globalThis[NAME]) setPrototypeOf(globalThis[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !hasOwn(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQUIRED = true;
  defineBuiltInAccessor(TypedArrayPrototype, TO_STRING_TAG, {
    configurable: true,
    get: function () {
      return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
    }
  });
  for (NAME in TypedArrayConstructorsList) if (globalThis[NAME]) {
    createNonEnumerableProperty(globalThis[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

module.exports = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  getTypedArrayConstructor: getTypedArrayConstructor,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-fill.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/array-fill.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");

// `Array.prototype.fill` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.fill
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = lengthOfArrayLike(O);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-includes.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-includes.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-method-is-strict.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/array-method-is-strict.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-reduce.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/array-reduce.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");

var $TypeError = TypeError;

var REDUCE_EMPTY = 'Reduce of empty array with no initial value';

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = lengthOfArrayLike(O);
    aCallable(callbackfn);
    if (length === 0 && argumentsLength < 2) throw new $TypeError(REDUCE_EMPTY);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw new $TypeError(REDUCE_EMPTY);
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-slice.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/array-slice.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = uncurryThis([].slice);


/***/ }),

/***/ "./node_modules/core-js/internals/array-sort.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/array-sort.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var arraySlice = __webpack_require__(/*! ../internals/array-slice */ "./node_modules/core-js/internals/array-slice.js");

var floor = Math.floor;

var sort = function (array, comparefn) {
  var length = array.length;

  if (length < 8) {
    // insertion sort
    var i = 1;
    var element, j;

    while (i < length) {
      j = i;
      element = array[i];
      while (j && comparefn(array[j - 1], element) > 0) {
        array[j] = array[--j];
      }
      if (j !== i++) array[j] = element;
    }
  } else {
    // merge sort
    var middle = floor(length / 2);
    var left = sort(arraySlice(array, 0, middle), comparefn);
    var right = sort(arraySlice(array, middle), comparefn);
    var llength = left.length;
    var rlength = right.length;
    var lindex = 0;
    var rindex = 0;

    while (lindex < llength || rindex < rlength) {
      array[lindex + rindex] = (lindex < llength && rindex < rlength)
        ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
        : lindex < llength ? left[lindex++] : right[rindex++];
    }
  }

  return array;
};

module.exports = sort;


/***/ }),

/***/ "./node_modules/core-js/internals/classof-raw.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/classof-raw.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/classof.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/copy-constructor-properties.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/copy-constructor-properties.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var ownKeys = __webpack_require__(/*! ../internals/own-keys */ "./node_modules/core-js/internals/own-keys.js");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/correct-prototype-getter.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/correct-prototype-getter.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ "./node_modules/core-js/internals/create-non-enumerable-property.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/create-non-enumerable-property.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-property-descriptor.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-property-descriptor.js ***!
  \**********************************************************************/
/***/ (function(module) {

"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-built-in-accessor.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/define-built-in-accessor.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var makeBuiltIn = __webpack_require__(/*! ../internals/make-built-in */ "./node_modules/core-js/internals/make-built-in.js");
var defineProperty = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty.f(target, name, descriptor);
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-built-in.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/define-built-in.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var makeBuiltIn = __webpack_require__(/*! ../internals/make-built-in */ "./node_modules/core-js/internals/make-built-in.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-global-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/define-global-property.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js/internals/global-this.js");

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    globalThis[key] = value;
  } return value;
};


/***/ }),

/***/ "./node_modules/core-js/internals/descriptors.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/descriptors.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/document-create-element.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/document-create-element.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js/internals/global-this.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var document = globalThis.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js/internals/enum-bug-keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/enum-bug-keys.js ***!
  \*********************************************************/
/***/ (function(module) {

"use strict";

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ "./node_modules/core-js/internals/environment-ff-version.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/environment-ff-version.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__(/*! ../internals/environment-user-agent */ "./node_modules/core-js/internals/environment-user-agent.js");

var firefox = userAgent.match(/firefox\/(\d+)/i);

module.exports = !!firefox && +firefox[1];


/***/ }),

/***/ "./node_modules/core-js/internals/environment-is-ie-or-edge.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/environment-is-ie-or-edge.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var UA = __webpack_require__(/*! ../internals/environment-user-agent */ "./node_modules/core-js/internals/environment-user-agent.js");

module.exports = /MSIE|Trident/.test(UA);


/***/ }),

/***/ "./node_modules/core-js/internals/environment-is-node.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/environment-is-node.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ENVIRONMENT = __webpack_require__(/*! ../internals/environment */ "./node_modules/core-js/internals/environment.js");

module.exports = ENVIRONMENT === 'NODE';


/***/ }),

/***/ "./node_modules/core-js/internals/environment-user-agent.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/environment-user-agent.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js/internals/global-this.js");

var navigator = globalThis.navigator;
var userAgent = navigator && navigator.userAgent;

module.exports = userAgent ? String(userAgent) : '';


/***/ }),

/***/ "./node_modules/core-js/internals/environment-v8-version.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/environment-v8-version.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js/internals/global-this.js");
var userAgent = __webpack_require__(/*! ../internals/environment-user-agent */ "./node_modules/core-js/internals/environment-user-agent.js");

var process = globalThis.process;
var Deno = globalThis.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ "./node_modules/core-js/internals/environment-webkit-version.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/environment-webkit-version.js ***!
  \**********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__(/*! ../internals/environment-user-agent */ "./node_modules/core-js/internals/environment-user-agent.js");

var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);

module.exports = !!webkit && +webkit[1];


/***/ }),

/***/ "./node_modules/core-js/internals/environment.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/environment.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* global Bun, Deno -- detection */
var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js/internals/global-this.js");
var userAgent = __webpack_require__(/*! ../internals/environment-user-agent */ "./node_modules/core-js/internals/environment-user-agent.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

var userAgentStartsWith = function (string) {
  return userAgent.slice(0, string.length) === string;
};

module.exports = (function () {
  if (userAgentStartsWith('Bun/')) return 'BUN';
  if (userAgentStartsWith('Cloudflare-Workers')) return 'CLOUDFLARE';
  if (userAgentStartsWith('Deno/')) return 'DENO';
  if (userAgentStartsWith('Node.js/')) return 'NODE';
  if (globalThis.Bun && typeof Bun.version == 'string') return 'BUN';
  if (globalThis.Deno && typeof Deno.version == 'object') return 'DENO';
  if (classof(globalThis.process) === 'process') return 'NODE';
  if (globalThis.window && globalThis.document) return 'BROWSER';
  return 'REST';
})();


/***/ }),

/***/ "./node_modules/core-js/internals/export.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/export.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js/internals/global-this.js");
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js").f);
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");
var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "./node_modules/core-js/internals/copy-constructor-properties.js");
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js/internals/is-forced.js");

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = globalThis;
  } else if (STATIC) {
    target = globalThis[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = globalThis[TARGET] && globalThis[TARGET].prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/fails.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/internals/fails.js ***!
  \*************************************************/
/***/ (function(module) {

"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-bind-native.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-native.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ "./node_modules/core-js/internals/function-call.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-call.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var call = Function.prototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-name.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-name.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this-accessor.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this-accessor.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this-clause.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this-clause.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-built-in.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/get-built-in.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js/internals/global-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method];
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-method.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/get-method.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ "./node_modules/core-js/internals/global-this.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/global-this.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ "./node_modules/core-js/internals/has-own-property.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/has-own-property.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ "./node_modules/core-js/internals/hidden-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/hidden-keys.js ***!
  \*******************************************************/
/***/ (function(module) {

"use strict";

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/internals/ie8-dom-define.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/ie8-dom-define.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/indexed-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/indexed-object.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ "./node_modules/core-js/internals/inspect-source.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/inspect-source.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ "./node_modules/core-js/internals/internal-state.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/internal-state.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/weak-map-basic-detection */ "./node_modules/core-js/internals/weak-map-basic-detection.js");
var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js/internals/global-this.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var shared = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = globalThis.TypeError;
var WeakMap = globalThis.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-callable.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/is-callable.js ***!
  \*******************************************************/
/***/ (function(module) {

"use strict";

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-forced.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-forced.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ "./node_modules/core-js/internals/is-null-or-undefined.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/is-null-or-undefined.js ***!
  \****************************************************************/
/***/ (function(module) {

"use strict";

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-object.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-possible-prototype.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/is-possible-prototype.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

module.exports = function (argument) {
  return isObject(argument) || argument === null;
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-pure.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/is-pure.js ***!
  \***************************************************/
/***/ (function(module) {

"use strict";

module.exports = false;


/***/ }),

/***/ "./node_modules/core-js/internals/is-symbol.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-symbol.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/length-of-array-like.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/length-of-array-like.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/make-built-in.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/make-built-in.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js").CONFIGURABLE);
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ "./node_modules/core-js/internals/math-trunc.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/math-trunc.js ***!
  \******************************************************/
/***/ (function(module) {

"use strict";

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-define-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-property.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js/internals/v8-prototype-define-bug.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-descriptor.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-descriptor.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js/internals/object-property-is-enumerable.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-names.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-names.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-symbols.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-symbols.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-prototype-of.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(/*! ../internals/correct-prototype-getter */ "./node_modules/core-js/internals/correct-prototype-getter.js");

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-is-prototype-of.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-is-prototype-of.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ "./node_modules/core-js/internals/object-keys-internal.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys-internal.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var indexOf = (__webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js/internals/array-includes.js").indexOf);
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-property-is-enumerable.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-property-is-enumerable.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ "./node_modules/core-js/internals/object-set-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-set-prototype-of.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(/*! ../internals/function-uncurry-this-accessor */ "./node_modules/core-js/internals/function-uncurry-this-accessor.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");
var aPossiblePrototype = __webpack_require__(/*! ../internals/a-possible-prototype */ "./node_modules/core-js/internals/a-possible-prototype.js");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    requireObjectCoercible(O);
    aPossiblePrototype(proto);
    if (!isObject(O)) return O;
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ "./node_modules/core-js/internals/ordinary-to-primitive.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/ordinary-to-primitive.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js/internals/own-keys.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/own-keys.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js/internals/object-get-own-property-symbols.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ "./node_modules/core-js/internals/require-object-coercible.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/require-object-coercible.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared-key.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/shared-key.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared-store.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/shared-store.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js/internals/global-this.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");

var SHARED = '__core-js_shared__';
var store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

(store.versions || (store.versions = [])).push({
  version: '3.48.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2013–2025 Denis Pushkarev (zloirock.ru), 2025–2026 CoreJS Company (core-js.io). All rights reserved.',
  license: 'https://github.com/zloirock/core-js/blob/v3.48.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ "./node_modules/core-js/internals/shared.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/shared.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

module.exports = function (key, value) {
  return store[key] || (store[key] = value || {});
};


/***/ }),

/***/ "./node_modules/core-js/internals/symbol-constructor-detection.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/symbol-constructor-detection.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(/*! ../internals/environment-v8-version */ "./node_modules/core-js/internals/environment-v8-version.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js/internals/global-this.js");

var $String = globalThis.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ "./node_modules/core-js/internals/to-absolute-index.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-absolute-index.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-big-int.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/to-big-int.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");

var $TypeError = TypeError;

// `ToBigInt` abstract operation
// https://tc39.es/ecma262/#sec-tobigint
module.exports = function (argument) {
  var prim = toPrimitive(argument, 'number');
  if (typeof prim == 'number') throw new $TypeError("Can't convert number to bigint");
  // eslint-disable-next-line es/no-bigint -- safe
  return BigInt(prim);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-indexed-object.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-indexed-object.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-integer-or-infinity.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/to-integer-or-infinity.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var trunc = __webpack_require__(/*! ../internals/math-trunc */ "./node_modules/core-js/internals/math-trunc.js");

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-length.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-length.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-object.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-offset.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-offset.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toPositiveInteger = __webpack_require__(/*! ../internals/to-positive-integer */ "./node_modules/core-js/internals/to-positive-integer.js");

var $RangeError = RangeError;

module.exports = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw new $RangeError('Wrong offset');
  return offset;
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-positive-integer.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/to-positive-integer.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var $RangeError = RangeError;

module.exports = function (it) {
  var result = toIntegerOrInfinity(it);
  if (result < 0) throw new $RangeError("The argument can't be less than 0");
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-primitive.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/to-primitive.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var ordinaryToPrimitive = __webpack_require__(/*! ../internals/ordinary-to-primitive */ "./node_modules/core-js/internals/ordinary-to-primitive.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-property-key.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/to-property-key.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-string-tag-support.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/to-string-tag-support.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};
// eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ "./node_modules/core-js/internals/try-to-string.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/try-to-string.js ***!
  \*********************************************************/
/***/ (function(module) {

"use strict";

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/uid.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/internals/uid.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.1.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ "./node_modules/core-js/internals/use-symbol-as-uid.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/use-symbol-as-uid.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js/internals/symbol-constructor-detection.js");

module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ "./node_modules/core-js/internals/v8-prototype-define-bug.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/v8-prototype-define-bug.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


/***/ }),

/***/ "./node_modules/core-js/internals/weak-map-basic-detection.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/weak-map-basic-detection.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js/internals/global-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var WeakMap = globalThis.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js/internals/global-this.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js/internals/symbol-constructor-detection.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var Symbol = globalThis.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.reduce.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.reduce.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $reduce = (__webpack_require__(/*! ../internals/array-reduce */ "./node_modules/core-js/internals/array-reduce.js").left);
var arrayMethodIsStrict = __webpack_require__(/*! ../internals/array-method-is-strict */ "./node_modules/core-js/internals/array-method-is-strict.js");
var CHROME_VERSION = __webpack_require__(/*! ../internals/environment-v8-version */ "./node_modules/core-js/internals/environment-v8-version.js");
var IS_NODE = __webpack_require__(/*! ../internals/environment-is-node */ "./node_modules/core-js/internals/environment-is-node.js");

// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;
var FORCED = CHROME_BUG || !arrayMethodIsStrict('reduce');

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
$({ target: 'Array', proto: true, forced: FORCED }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var length = arguments.length;
    return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.fill.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.fill.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $fill = __webpack_require__(/*! ../internals/array-fill */ "./node_modules/core-js/internals/array-fill.js");
var toBigInt = __webpack_require__(/*! ../internals/to-big-int */ "./node_modules/core-js/internals/to-big-int.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var slice = uncurryThis(''.slice);

// V8 ~ Chrome < 59, Safari < 14.1, FF < 55, Edge <=18
var CONVERSION_BUG = fails(function () {
  var count = 0;
  // eslint-disable-next-line es/no-typed-arrays -- safe
  new Int8Array(2).fill({ valueOf: function () { return count++; } });
  return count !== 1;
});

// `%TypedArray%.prototype.fill` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
exportTypedArrayMethod('fill', function fill(value /* , start, end */) {
  var length = arguments.length;
  aTypedArray(this);
  var actualValue = slice(classof(this), 0, 3) === 'Big' ? toBigInt(value) : +value;
  return call($fill, this, actualValue, length > 1 ? arguments[1] : undefined, length > 2 ? arguments[2] : undefined);
}, CONVERSION_BUG);


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.set.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.set.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js/internals/global-this.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var toOffset = __webpack_require__(/*! ../internals/to-offset */ "./node_modules/core-js/internals/to-offset.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

var RangeError = globalThis.RangeError;
var Int8Array = globalThis.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var $set = Int8ArrayPrototype && Int8ArrayPrototype.set;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS = !fails(function () {
  // eslint-disable-next-line es/no-typed-arrays -- required for testing
  var array = new Uint8ClampedArray(2);
  call($set, array, { length: 1, 0: 3 }, 1);
  return array[1] !== 3;
});

// https://bugs.chromium.org/p/v8/issues/detail?id=11294 and other
var TO_OBJECT_BUG = WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS && ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS && fails(function () {
  var array = new Int8Array(2);
  array.set(1);
  array.set('2', 1);
  return array[0] !== 0 || array[1] !== 2;
});

// `%TypedArray%.prototype.set` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod('set', function set(arrayLike /* , offset */) {
  aTypedArray(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var src = toIndexedObject(arrayLike);
  if (WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS) return call($set, this, src, offset);
  var length = this.length;
  var len = lengthOfArrayLike(src);
  var index = 0;
  if (len + offset > length) throw new RangeError('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, !WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.sort.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.sort.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(/*! ../internals/global-this */ "./node_modules/core-js/internals/global-this.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js/internals/function-uncurry-this-clause.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var internalSort = __webpack_require__(/*! ../internals/array-sort */ "./node_modules/core-js/internals/array-sort.js");
var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var FF = __webpack_require__(/*! ../internals/environment-ff-version */ "./node_modules/core-js/internals/environment-ff-version.js");
var IE_OR_EDGE = __webpack_require__(/*! ../internals/environment-is-ie-or-edge */ "./node_modules/core-js/internals/environment-is-ie-or-edge.js");
var V8 = __webpack_require__(/*! ../internals/environment-v8-version */ "./node_modules/core-js/internals/environment-v8-version.js");
var WEBKIT = __webpack_require__(/*! ../internals/environment-webkit-version */ "./node_modules/core-js/internals/environment-webkit-version.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var Uint16Array = globalThis.Uint16Array;
var nativeSort = Uint16Array && uncurryThis(Uint16Array.prototype.sort);

// WebKit
var ACCEPT_INCORRECT_ARGUMENTS = !!nativeSort && !(fails(function () {
  nativeSort(new Uint16Array(2), null);
}) && fails(function () {
  nativeSort(new Uint16Array(2), {});
}));

var STABLE_SORT = !!nativeSort && !fails(function () {
  // feature detection can be too slow, so check engines versions
  if (V8) return V8 < 74;
  if (FF) return FF < 67;
  if (IE_OR_EDGE) return true;
  if (WEBKIT) return WEBKIT < 602;

  var array = new Uint16Array(516);
  var expected = Array(516);
  var index, mod;

  for (index = 0; index < 516; index++) {
    mod = index % 4;
    array[index] = 515 - index;
    expected[index] = index - 2 * mod + 3;
  }

  nativeSort(array, function (a, b) {
    return (a / 4 | 0) - (b / 4 | 0);
  });

  for (index = 0; index < 516; index++) {
    if (array[index] !== expected[index]) return true;
  }
});

var getSortCompare = function (comparefn) {
  return function (x, y) {
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (y !== y) return -1;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (x !== x) return 1;
    if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
    return x > y;
  };
};

// `%TypedArray%.prototype.sort` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
exportTypedArrayMethod('sort', function sort(comparefn) {
  if (comparefn !== undefined) aCallable(comparefn);
  if (STABLE_SORT) return nativeSort(this, comparefn);

  return internalSort(aTypedArray(this), getSortCompare(comparefn));
}, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);


/***/ })

}]);
//# sourceMappingURL=vendor.js.map