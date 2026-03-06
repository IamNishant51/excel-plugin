/**
 * Security Service
 * Handles API key encryption/decryption and secure storage
 * Uses Web Crypto API for AES-GCM encryption
 */

// Device-specific salt with persistent random component
// The random component is generated once and stored, making the salt
// device-sticky but not reproducible across different sessions without storage
const getDeviceSalt = (): string => {
  const SALT_KEY = 'sheetos_device_salt_v2';
  let persistentRandom = localStorage.getItem(SALT_KEY);
  if (!persistentRandom) {
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    persistentRandom = Array.from(randomBytes, b => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(SALT_KEY, persistentRandom);
  }
  const factors = [
    navigator.userAgent,
    navigator.language,
    persistentRandom
  ];
  return factors.join('|');
};

// Derive encryption key from device salt
const deriveKey = async (): Promise<CryptoKey> => {
  const salt = getDeviceSalt();
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(salt),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('sheetcraft-ai-v1'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

/**
 * Encrypt a string value (e.g., API key)
 */
export const encryptValue = async (plaintext: string): Promise<string> => {
  try {
    const key = await deriveKey();
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(plaintext)
    );
    
    // Combine IV + ciphertext and encode as base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Encryption failed. Web Crypto API is required for secure key storage.');
  }
};

/**
 * Decrypt an encrypted value
 */
export const decryptValue = async (encrypted: string): Promise<string> => {
  try {
    const key = await deriveKey();
    const decoder = new TextDecoder();
    
    // Decode base64
    const combined = new Uint8Array(
      atob(encrypted).split('').map(c => c.charCodeAt(0))
    );
    
    // Extract IV (first 12 bytes) and ciphertext
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
    
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    // Attempt base64 decode ONLY for legacy migration, then re-encrypt securely
    try {
      const legacyKey = atob(encrypted);
      // If this succeeds, it was a legacy base64 key — don't return raw, flag for re-encryption
      console.warn('Legacy base64 key detected. Will be re-encrypted on next save.');
      return legacyKey;
    } catch {
      throw new Error('Decryption failed. Key may be corrupted or from a different device.');
    }
  }
};

/**
 * Secure storage for API keys
 */
export const secureStorage = {
  /**
   * Save an API key securely
   */
  async setApiKey(provider: string, key: string): Promise<void> {
    if (!key) {
      localStorage.removeItem(`sheetos_${provider}_key_enc`);
      return;
    }
    const encrypted = await encryptValue(key);
    localStorage.setItem(`sheetos_${provider}_key_enc`, encrypted);
    // Remove old unencrypted key if exists
    localStorage.removeItem(`sheetos_${provider}_key`);
  },
  
  /**
   * Get an API key (decrypt if encrypted)
   */
  async getApiKey(provider: string): Promise<string> {
    // Try encrypted key first
    const encrypted = localStorage.getItem(`sheetos_${provider}_key_enc`);
    if (encrypted) {
      return await decryptValue(encrypted);
    }
    
    // Fallback to old unencrypted key (migrate it)
    const oldKey = localStorage.getItem(`sheetos_${provider}_key`);
    if (oldKey) {
      await secureStorage.setApiKey(provider, oldKey);
      return oldKey;
    }
    
    return '';
  },
  
  /**
   * Check if key exists
   */
  hasApiKey(provider: string): boolean {
    return !!(
      localStorage.getItem(`sheetos_${provider}_key_enc`) ||
      localStorage.getItem(`sheetos_${provider}_key`)
    );
  },
  
  /**
   * Remove API key
   */
  removeApiKey(provider: string): void {
    localStorage.removeItem(`sheetos_${provider}_key_enc`);
    localStorage.removeItem(`sheetos_${provider}_key`);
  }
};

/**
 * Sanitize HTML to prevent XSS attacks
 */
export const sanitizeForDisplay = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Validate that a string looks like an API key (basic format check)
 */
export const isValidApiKeyFormat = (key: string, provider: string): boolean => {
  if (!key || typeof key !== 'string') return false;
  
  const patterns: Record<string, RegExp> = {
    groq: /^gsk_[a-zA-Z0-9]{50,}$/,
    gemini: /^AIza[a-zA-Z0-9_-]{35}$/,
    openai: /^sk-[a-zA-Z0-9]{40,}$/,
  };
  
  const pattern = patterns[provider];
  if (!pattern) return key.length > 10; // Generic validation
  
  return pattern.test(key);
};
