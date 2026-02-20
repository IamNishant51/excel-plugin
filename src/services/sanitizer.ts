/**
 * HTML Sanitizer Service
 * Uses DOMPurify to prevent XSS attacks in all HTML rendering
 */

import DOMPurify from 'dompurify';

// Configure DOMPurify with safe defaults
const purifyConfig: DOMPurify.Config = {
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
    'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'hr', 'mark', 'sub', 'sup', 'small', 'del', 'ins'
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'class', 'id', 'style', 'title',
    'aria-label', 'aria-hidden', 'role', 'tabindex'
  ],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ['target'], // Allow target attribute for links
  ADD_TAGS: [], // No additional tags
  USE_PROFILES: { html: true }, // Use HTML profile
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
};

// Strict config for user-generated content (like AI responses)
const strictConfig: DOMPurify.Config = {
  ...purifyConfig,
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'code', 'pre', 'span', 'div'],
  ALLOWED_ATTR: ['class'],
};

/**
 * Sanitize HTML content for safe rendering
 * @param dirty - Untrusted HTML string
 * @param strict - Use stricter sanitization (default: false)
 * @returns Sanitized HTML string
 */
export function sanitizeHTML(dirty: string, strict: boolean = false): string {
  if (!dirty || typeof dirty !== 'string') return '';
  
  const config = strict ? strictConfig : purifyConfig;
  return DOMPurify.sanitize(dirty, config);
}

/**
 * Sanitize and set innerHTML safely
 * @param element - DOM element to update
 * @param html - HTML content to set
 * @param strict - Use stricter sanitization
 */
export function setInnerHTMLSafe(
  element: HTMLElement | null,
  html: string,
  strict: boolean = false
): void {
  if (!element) return;
  element.innerHTML = sanitizeHTML(html, strict);
}

/**
 * Escape HTML entities for text display
 * Use this when you want to display code/text without rendering HTML
 */
export function escapeHTML(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Sanitize a URL to prevent javascript: and data: exploits
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  const trimmed = url.trim().toLowerCase();
  
  // Block dangerous protocols
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:')
  ) {
    return '';
  }
  
  return url;
}

/**
 * Create safe HTML from template literal
 * Use for trusted HTML with interpolated unsafe values
 */
export function safeHTML(
  strings: TemplateStringsArray,
  ...values: any[]
): string {
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += escapeHTML(String(values[i])) + strings[i + 1];
  }
  return result;
}

export default {
  sanitizeHTML,
  setInnerHTMLSafe,
  escapeHTML,
  sanitizeURL,
  safeHTML,
};
