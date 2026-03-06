/**
 * Smart Cache — Multi-layer caching + in-flight request deduplication.
 *
 * Layer 1: In-memory LRU cache (instant, no I/O)
 * Layer 2: localStorage persistent cache (survives reload)
 * Layer 3: In-flight dedup — identical prompts sent concurrently share ONE API call
 *
 * This is the #1 rate-limit defense: if the same prompt is already in-flight,
 * every subsequent caller awaits the same Promise instead of firing again.
 */

const CACHE_KEY = "sheetcraft_cache";
const CACHE_VERSION_KEY = "sheetcraft_cache_ver";
const CACHE_VERSION = 5; // Bumped for new cache structure
const MAX_MEMORY_ENTRIES = 200;
const MAX_STORAGE_ENTRIES = 50;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// ═══════════════════════════════════════════════════
// FAST HASH — FNV-1a 32-bit for prompt fingerprinting
// ═══════════════════════════════════════════════════

function fnv1aHash(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

/**
 * Generate a stable cache key from messages array.
 * Hashes the full message content so system+user prompts are both considered.
 */
export function hashMessages(messages: Array<{ role: string; content: any }>): string {
  const raw = messages
    .map((m) => {
      const content = typeof m.content === "string"
        ? m.content
        : JSON.stringify(m.content);
      return `${m.role}:${content}`;
    })
    .join("|");
  return fnv1aHash(raw);
}

// ═══════════════════════════════════════════════════
// LAYER 1: In-Memory LRU Cache
// ═══════════════════════════════════════════════════

interface MemoryCacheEntry {
  response: string;
  timestamp: number;
}

/** LRU map — oldest entries evicted first when capacity exceeded */
const memoryCache = new Map<string, MemoryCacheEntry>();

function getFromMemory(key: string): string | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    memoryCache.delete(key);
    return null;
  }
  // Move to end (most recently used)
  memoryCache.delete(key);
  memoryCache.set(key, entry);
  return entry.response;
}

function setInMemory(key: string, response: string): void {
  // Evict oldest if at capacity
  if (memoryCache.size >= MAX_MEMORY_ENTRIES) {
    const oldest = memoryCache.keys().next().value;
    if (oldest !== undefined) memoryCache.delete(oldest);
  }
  memoryCache.set(key, { response, timestamp: Date.now() });
}

// ═══════════════════════════════════════════════════
// LAYER 2: localStorage Persistent Cache
// ═══════════════════════════════════════════════════

function ensureCacheVersion(): void {
  try {
    const ver = localStorage.getItem(CACHE_VERSION_KEY);
    if (ver !== String(CACHE_VERSION)) {
      localStorage.removeItem(CACHE_KEY);
      localStorage.setItem(CACHE_VERSION_KEY, String(CACHE_VERSION));
    }
  } catch {}
}

interface StorageCacheEntry {
  response: string;
  timestamp: number;
}

/** Storage format: object keyed by cache key for O(1) lookup */
interface StorageCacheData {
  [key: string]: StorageCacheEntry;
}

function getStorageCache(): StorageCacheData {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStorageCache(data: StorageCacheData): void {
  const keys = Object.keys(data);
  // If over limit, evict oldest entries by timestamp
  if (keys.length > MAX_STORAGE_ENTRIES) {
    const sorted = keys.sort((a, b) => data[a].timestamp - data[b].timestamp);
    const toRemove = sorted.slice(0, keys.length - MAX_STORAGE_ENTRIES);
    for (const key of toRemove) {
      delete data[key];
    }
  }
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full — keep only 10 most recent entries
    const allKeys = Object.keys(data);
    const recentKeys = allKeys
      .sort((a, b) => data[b].timestamp - data[a].timestamp)
      .slice(0, 10);
    const trimmed: StorageCacheData = {};
    for (const k of recentKeys) trimmed[k] = data[k];
    localStorage.removeItem(CACHE_KEY);
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed)); } catch {}
  }
}

function getFromStorage(key: string): string | null {
  ensureCacheVersion();
  const data = getStorageCache();
  const entry = data[key];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    // Lazy eviction: remove expired entry
    delete data[key];
    setStorageCache(data);
    return null;
  }
  return entry.response;
}

function setInStorage(key: string, response: string): void {
  const data = getStorageCache();
  data[key] = { response, timestamp: Date.now() };
  setStorageCache(data);
}

// ═══════════════════════════════════════════════════
// LAYER 3: In-Flight Request Deduplication
// ═══════════════════════════════════════════════════

/** Map of in-flight request keys to their pending Promise */
const inflightRequests = new Map<string, Promise<string>>();

/**
 * Deduplicate an async operation by cache key.
 * If the same key is already in-flight, returns the existing Promise.
 * Otherwise, executes the factory and shares the result.
 */
export function deduplicateRequest(
  key: string,
  factory: () => Promise<string>
): Promise<string> {
  const existing = inflightRequests.get(key);
  if (existing) return existing;

  const promise = factory().finally(() => {
    inflightRequests.delete(key);
  });

  inflightRequests.set(key, promise);
  return promise;
}

// ═══════════════════════════════════════════════════
// PUBLIC API — Drop-in compatible + new hash-based API
// ═══════════════════════════════════════════════════

/**
 * Look up a cached response by hash key.
 * Checks memory first (fast), then localStorage (persistent).
 */
export function getCachedResponse(promptOrKey: string): string | null {
  // Try memory cache first
  const memHit = getFromMemory(promptOrKey);
  if (memHit) return memHit;

  // Fall back to localStorage
  const storageHit = getFromStorage(promptOrKey);
  if (storageHit) {
    // Promote to memory cache for faster subsequent lookups
    setInMemory(promptOrKey, storageHit);
    return storageHit;
  }

  return null;
}

/**
 * Store a response in both memory and localStorage caches.
 */
export function cacheResponse(promptOrKey: string, response: string): void {
  setInMemory(promptOrKey, response);
  setInStorage(promptOrKey, response);
}

/**
 * Clear all caches (memory + localStorage).
 */
export function clearCache(): void {
  memoryCache.clear();
  inflightRequests.clear();
  localStorage.removeItem(CACHE_KEY);
}

/**
 * Get cache statistics for debugging/monitoring.
 */
export function getCacheStats(): { memorySize: number; storageSize: number; inflightCount: number } {
  return {
    memorySize: memoryCache.size,
    storageSize: getStorageCache().length,
    inflightCount: inflightRequests.size,
  };
}
