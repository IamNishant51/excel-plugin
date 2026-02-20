/**
 * Regex Extractor - Deterministic pattern-based extraction for structured fields
 * This module handles extraction of fields that follow predictable patterns:
 * - Email addresses
 * - Phone numbers
 * - Account numbers
 * - IFSC codes
 * - PAN numbers
 * - Dates
 * - Invoice numbers
 * - URLs
 */

export interface RegexPattern {
  name: string;
  pattern: RegExp;
  extract: (text: string) => string | null;
  extractAll?: (text: string) => string[];
  validate?: (value: string) => boolean;
}

/**
 * Email extraction and validation
 */
export const emailPattern: RegexPattern = {
  name: "email",
  pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
  extract: (text: string): string | null => {
    const match = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i);
    return match ? match[0].toLowerCase() : null;
  },
  extractAll: (text: string): string[] => {
    const matches = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi);
    return matches ? matches.map(m => m.toLowerCase()) : [];
  },
  validate: (value: string): boolean => {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(value);
  },
};

/**
 * Phone number extraction (supports multiple formats)
 * Formats: +1-555-123-4567, (555) 123-4567, 555.123.4567, 5551234567
 */
export const phonePattern: RegexPattern = {
  name: "phone",
  pattern: /(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g,
  extract: (text: string): string | null => {
    // Try to find phone numbers with various formats
    const patterns = [
      /\+\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/,  // International
      /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/,                 // Standard
      /\b\d{10}\b/,                                            // Plain 10 digits
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return normalizePhone(match[0]);
      }
    }
    return null;
  },
  extractAll: (text: string): string[] => {
    const matches = text.match(/(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g);
    return matches ? matches.map(normalizePhone) : [];
  },
  validate: (value: string): boolean => {
    const digitsOnly = value.replace(/\D/g, "");
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  },
};

/**
 * Normalize phone number to consistent format
 */
function normalizePhone(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  
  if (digitsOnly.length === 10) {
    return `+1-${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  } else if (digitsOnly.length === 11 && digitsOnly[0] === "1") {
    return `+${digitsOnly[0]}-${digitsOnly.slice(1, 4)}-${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }
  
  return phone; // Return original if can't normalize
}

/**
 * Bank account number extraction (9-18 digits)
 */
export const accountNumberPattern: RegexPattern = {
  name: "accountNumber",
  pattern: /\b\d{9,18}\b/g,
  extract: (text: string): string | null => {
    // Look for account number keywords nearby
    const accountMatch = text.match(/(?:account\s*(?:number|no\.?|#)?[\s:]*)?(\d{9,18})\b/i);
    if (accountMatch) return accountMatch[1];
    
    // Fallback to any 9-18 digit number
    const match = text.match(/\b\d{9,18}\b/);
    return match ? match[0] : null;
  },
  validate: (value: string): boolean => {
    return /^\d{9,18}$/.test(value);
  },
};

/**
 * IFSC code extraction (Indian bank code: 4 letters + 0 + 6 alphanumeric)
 */
export const ifscPattern: RegexPattern = {
  name: "ifsc",
  pattern: /\b[A-Z]{4}0[A-Z0-9]{6}\b/gi,
  extract: (text: string): string | null => {
    const match = text.match(/\b[A-Z]{4}0[A-Z0-9]{6}\b/i);
    return match ? match[0].toUpperCase() : null;
  },
  validate: (value: string): boolean => {
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase());
  },
};

/**
 * PAN number extraction (Indian tax ID: 5 letters + 4 digits + 1 letter)
 */
export const panPattern: RegexPattern = {
  name: "pan",
  pattern: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi,
  extract: (text: string): string | null => {
    const match = text.match(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/i);
    return match ? match[0].toUpperCase() : null;
  },
  validate: (value: string): boolean => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase());
  },
};

/**
 * Date extraction (supports multiple formats)
 */
export const datePattern: RegexPattern = {
  name: "date",
  pattern: /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/gi,
  extract: (text: string): string | null => {
    const patterns = [
      /\b\d{4}-\d{2}-\d{2}\b/,                                      // ISO: 2024-01-15
      /\b\d{1,2}[-/]\d{1,2}[-/]\d{4}\b/,                           // MM/DD/YYYY or DD/MM/YYYY
      /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/i, // January 15, 2024
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }
    return null;
  },
  extractAll: (text: string): string[] => {
    const matches = text.match(/\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/gi);
    return matches || [];
  },
};

/**
 * Invoice number extraction
 */
export const invoiceNumberPattern: RegexPattern = {
  name: "invoiceNumber",
  pattern: /\b(?:INV|INVOICE)[-#]?\s*\d{4,10}\b/gi,
  extract: (text: string): string | null => {
    const match = text.match(/\b(?:INV|INVOICE)[-#]?\s*(\d{4,10})\b/i);
    return match ? match[1] : null;
  },
};

/**
 * URL extraction
 */
export const urlPattern: RegexPattern = {
  name: "url",
  pattern: /https?:\/\/[^\s]+/gi,
  extract: (text: string): string | null => {
    const match = text.match(/https?:\/\/[^\s]+/i);
    return match ? match[0] : null;
  },
  extractAll: (text: string): string[] => {
    const matches = text.match(/https?:\/\/[^\s]+/gi);
    return matches || [];
  },
};

/**
 * LinkedIn URL extraction
 */
export const linkedinPattern: RegexPattern = {
  name: "linkedin",
  pattern: /https?:\/\/(www\.)?linkedin\.com\/in\/[^\s]+/gi,
  extract: (text: string): string | null => {
    const match = text.match(/https?:\/\/(www\.)?linkedin\.com\/in\/[^\s]+/i);
    return match ? match[0] : null;
  },
};

/**
 * SSN extraction (US Social Security Number: XXX-XX-XXXX)
 */
export const ssnPattern: RegexPattern = {
  name: "ssn",
  pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
  extract: (text: string): string | null => {
    const match = text.match(/\b\d{3}-\d{2}-\d{4}\b/);
    return match ? match[0] : null;
  },
  validate: (value: string): boolean => {
    return /^\d{3}-\d{2}-\d{4}$/.test(value);
  },
};

/**
 * All available regex patterns
 */
export const allPatterns: Record<string, RegexPattern> = {
  email: emailPattern,
  phone: phonePattern,
  accountNumber: accountNumberPattern,
  ifsc: ifscPattern,
  pan: panPattern,
  date: datePattern,
  invoiceNumber: invoiceNumberPattern,
  url: urlPattern,
  linkedin: linkedinPattern,
  ssn: ssnPattern,
};

/**
 * Extract value using a specific pattern
 * @param text - Text to extract from
 * @param patternName - Name of the pattern to use
 * @returns Extracted value or null
 */
export function extractWithPattern(text: string, patternName: string): string | null {
  const pattern = allPatterns[patternName];
  if (!pattern) {
    throw new Error(`Unknown pattern: ${patternName}`);
  }
  return pattern.extract(text);
}

/**
 * Extract all values using a specific pattern
 * @param text - Text to extract from
 * @param patternName - Name of the pattern to use
 * @returns Array of extracted values
 */
export function extractAllWithPattern(text: string, patternName: string): string[] {
  const pattern = allPatterns[patternName];
  if (!pattern) {
    throw new Error(`Unknown pattern: ${patternName}`);
  }
  return pattern.extractAll ? pattern.extractAll(text) : [];
}

/**
 * Intelligently extract structured fields from text based on field name
 * Maps common field names to appropriate regex patterns
 * @param text - Text to extract from
 * @param fieldName - Name of the field (e.g., "Email", "Phone", "Account Number")
 * @returns Extracted value or null
 */
export function smartExtract(text: string, fieldName: string): string | null {
  const normalizedField = fieldName.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  // Map field names to patterns
  if (normalizedField.includes("email")) {
    return extractWithPattern(text, "email");
  }
  if (normalizedField.includes("phone") || normalizedField.includes("mobile") || normalizedField.includes("contact")) {
    return extractWithPattern(text, "phone");
  }
  if (normalizedField.includes("account") && normalizedField.includes("number")) {
    return extractWithPattern(text, "accountNumber");
  }
  if (normalizedField.includes("ifsc")) {
    return extractWithPattern(text, "ifsc");
  }
  if (normalizedField.includes("pan")) {
    return extractWithPattern(text, "pan");
  }
  if (normalizedField.includes("date") || normalizedField.includes("dob") || normalizedField.includes("birth")) {
    return extractWithPattern(text, "date");
  }
  if (normalizedField.includes("invoice")) {
    return extractWithPattern(text, "invoiceNumber");
  }
  if (normalizedField.includes("linkedin")) {
    return extractWithPattern(text, "linkedin");
  }
  if (normalizedField.includes("url") || normalizedField.includes("website")) {
    return extractWithPattern(text, "url");
  }
  if (normalizedField.includes("ssn") || normalizedField.includes("social")) {
    return extractWithPattern(text, "ssn");
  }
  
  return null; // No pattern matched
}

/**
 * Extract multiple fields from text using smart matching
 * @param text - Text to extract from
 * @param fieldNames - Array of field names
 * @returns Object mapping field names to extracted values
 */
export function extractMultipleFields(text: string, fieldNames: string[]): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  
  for (const fieldName of fieldNames) {
    result[fieldName] = smartExtract(text, fieldName);
  }
  
  return result;
}

/**
 * Check if a field should use regex extraction (vs LLM)
 * @param fieldName - Name of the field
 * @returns True if regex extraction is recommended
 */
export function shouldUseRegex(fieldName: string): boolean {
  const normalizedField = fieldName.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  const regexFields = [
    "email", "phone", "mobile", "contact", "account", "ifsc", "pan",
    "date", "dob", "birth", "invoice", "linkedin", "url", "website", "ssn", "social"
  ];
  
  return regexFields.some(field => normalizedField.includes(field));
}
