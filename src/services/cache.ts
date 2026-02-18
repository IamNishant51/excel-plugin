/**
 * Simple prompt-response cache using localStorage.
 * Avoids redundant API calls for identical prompts.
 */

const CACHE_KEY = "sheetcraft_cache";
const CACHE_VERSION_KEY = "sheetcraft_cache_ver";
const CACHE_VERSION = 2; // Bump this when prompt changes significantly
const MAX_ENTRIES = 50;

// Auto-clear cache if version changed (prompt was updated)
function ensureCacheVersion(): void {
  try {
    const ver = localStorage.getItem(CACHE_VERSION_KEY);
    if (ver !== String(CACHE_VERSION)) {
      localStorage.removeItem(CACHE_KEY);
      localStorage.setItem(CACHE_VERSION_KEY, String(CACHE_VERSION));
    }
  } catch {}
}

interface CacheEntry {
  prompt: string;
  response: string;
  timestamp: number;
}

function getCache(): CacheEntry[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCache(entries: CacheEntry[]): void {
  // Keep only the most recent entries
  const trimmed = entries.slice(-MAX_ENTRIES);
  localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
}

/**
 * Look up a cached response for the given prompt.
 * Returns null if not found or expired (>1 hour).
 */
export function getCachedResponse(prompt: string): string | null {
  ensureCacheVersion();
  const entries = getCache();
  const key = prompt.trim().toLowerCase();
  const match = entries.find((e) => e.prompt === key);

  if (!match) return null;

  // Expire after 1 hour
  const ONE_HOUR = 60 * 60 * 1000;
  if (Date.now() - match.timestamp > ONE_HOUR) return null;

  return match.response;
}

/**
 * Store a prompt-response pair in the cache.
 */
export function cacheResponse(prompt: string, response: string): void {
  const entries = getCache();
  const key = prompt.trim().toLowerCase();

  // Remove existing entry for same prompt
  const filtered = entries.filter((e) => e.prompt !== key);
  filtered.push({ prompt: key, response, timestamp: Date.now() });

  setCache(filtered);
}

/**
 * Clear the entire cache.
 */
export function clearCache(): void {
  localStorage.removeItem(CACHE_KEY);
}
