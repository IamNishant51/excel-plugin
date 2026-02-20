/**
 * Validator - Schema validation using Zod with field-specific rules
 * 
 * VALIDATION LAYER (runs BEFORE writing to Excel):
 * - Email format validation
 * - Phone validation (10-15 digits)
 * - Bank account numeric validation (9-18 digits)
 * - IFSC format validation ([A-Z]{4}0[A-Z0-9]{6})
 * - PAN format validation ([A-Z]{5}[0-9]{4}[A-Z]{1})
 * - Date format validation
 * - Confidence scoring (0-1, threshold: 0.8)
 */

import { z } from "zod";
import { ExtractedData, ValidationResult, ValidationError } from "./types";

/**
 * Build dynamic Zod schema based on Excel headers
 * @param headers - Array of column header names
 * @param headerTypes - Optional type hints for each header
 * @returns Zod schema object
 */
export function buildDynamicSchema(
  headers: string[],
  headerTypes?: Record<string, string>
): z.ZodObject<any> {
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  
  headers.forEach((header) => {
    const fieldType = headerTypes?.[header] || detectFieldType(header);
    schemaShape[header] = buildFieldValidator(header, fieldType);
  });
  
  return z.object(schemaShape);
}

/**
 * Detect expected field type from header name
 * @param header - Column header name
 * @returns Detected type
 */
function detectFieldType(header: string): string {
  const normalized = header.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  // Email patterns
  if (normalized.includes("email") || normalized.includes("mail")) {
    return "email";
  }
  
  // Phone patterns
  if (normalized.includes("phone") || normalized.includes("mobile") || normalized.includes("contact")) {
    return "phone";
  }
  
  // Number patterns
  if (
    normalized.includes("age") ||
    normalized.includes("amount") ||
    normalized.includes("price") ||
    normalized.includes("cost") ||
    normalized.includes("salary") ||
    normalized.includes("balance") ||
    normalized.includes("account") && normalized.includes("number")
  ) {
    return "number";
  }
  
  // Date patterns
  if (
    normalized.includes("date") ||
    normalized.includes("dob") ||
    normalized.includes("birth")
  ) {
    return "date";
  }
  
  // URL patterns
  if (normalized.includes("url") || normalized.includes("website") || normalized.includes("linkedin")) {
    return "url";
  }
  
  // IFSC code
  if (normalized.includes("ifsc")) {
    return "ifsc";
  }
  
  // PAN number
  if (normalized.includes("pan")) {
    return "pan";
  }
  
  // Default to text
  return "text";
}

/**
 * Build field-specific validator
 * @param fieldName - Name of the field
 * @param fieldType - Type of validation to apply
 * @returns Zod validator
 */
function buildFieldValidator(fieldName: string, fieldType: string): z.ZodTypeAny {
  switch (fieldType) {
    case "email":
      return z.string().email(`Invalid email format in ${fieldName}`).nullable().or(z.literal(""));
    
    case "phone":
      return z.string()
        .refine(
          (val) => !val || /^[\d\s\-\+\(\)]+$/.test(val),
          `Invalid phone format in ${fieldName}`
        )
        .refine(
          (val) => !val || val.replace(/\D/g, "").length >= 10,
          `Phone number too short in ${fieldName}`
        )
        .nullable()
        .or(z.literal(""));
    
    case "number":
      return z.union([
        z.number(),
        z.string().regex(/^[\d,\.]+$/, `Must be a valid number in ${fieldName}`),
        z.null(),
        z.literal(""),
      ]);
    
    case "date":
      return z.union([
        z.string().refine(
          (val) => !val || !isNaN(Date.parse(val)),
          `Invalid date format in ${fieldName}`
        ),
        z.null(),
        z.literal(""),
      ]);
    
    case "url":
      return z.union([
        z.string().url(`Invalid URL format in ${fieldName}`),
        z.null(),
        z.literal(""),
      ]);
    
    case "ifsc":
      return z.union([
        z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/i, `Invalid IFSC code format in ${fieldName}`),
        z.null(),
        z.literal(""),
      ]);
    
    case "pan":
      return z.union([
        z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, `Invalid PAN format in ${fieldName}`),
        z.null(),
        z.literal(""),
      ]);
    
    case "text":
    default:
      return z.string().nullable().or(z.literal(""));
  }
}

/**
 * Validate extracted data against schema
 * @param data - Extracted data object
 * @param schema - Zod schema to validate against
 * @param confidenceThreshold - Minimum confidence required (0-1), default: 0.8
 * @param confidence - Actual confidence score from extraction
 * @returns Validation result with errors and review flag
 */
export function validateData(
  data: ExtractedData,
  schema: z.ZodObject<any>,
  confidenceThreshold: number = 0.8,
  confidence?: number
): ValidationResult {
  const errors: ValidationError[] = [];
  let needsReview = false;
  
  // Check confidence threshold - if below 0.8, mark for review
  if (confidence !== undefined && confidence < confidenceThreshold) {
    needsReview = true;
    errors.push({
      field: "_confidence",
      value: confidence,
      message: `Confidence ${confidence.toFixed(2)} below threshold ${confidenceThreshold}`,
      rule: "confidence_threshold",
      severity: "warning",
    });
  }
  
  // Validate with Zod schema
  const result = schema.safeParse(data);
  
  if (!result.success) {
    result.error.issues.forEach((err) => {
      const fieldName = err.path.join(".");
      errors.push({
        field: fieldName,
        value: data[fieldName],
        message: err.message,
        rule: "schema_validation",
        severity: "error",
      });
    });
  }
  
  // Additional custom validations for each field
  Object.entries(data).forEach(([field, value]) => {
    if (value === null || value === "") return;
    
    const customErrors = runCustomValidations(field, value);
    errors.push(...customErrors);
  });
  
  // If any errors exist, mark for review
  if (errors.length > 0) {
    needsReview = true;
  }
  
  return {
    isValid: errors.filter(e => e.severity === "error").length === 0,
    errors,
    needsReview,
    validatedAt: new Date(),
  };
}

/**
 * Run custom validation rules for specific field types
 * @param field - Field name
 * @param value - Field value
 * @returns Array of validation errors with severity
 */
function runCustomValidations(field: string, value: any): ValidationError[] {
  const errors: ValidationError[] = [];
  const normalized = field.toLowerCase().replace(/[^a-z0-9]/g, "");
  const strValue = String(value);
  
  // Email validation
  if (normalized.includes("email")) {
    if (!isValidEmail(strValue)) {
      errors.push({
        field,
        value,
        message: "Invalid email format",
        rule: "email_validation",
        severity: "error",
      });
    }
  }
  
  // Phone validation
  if (normalized.includes("phone") || normalized.includes("mobile")) {
    if (!isValidPhone(strValue)) {
      errors.push({
        field,
        value,
        message: "Invalid phone format (must be 10-15 digits)",
        rule: "phone_validation",
        severity: "error",
      });
    }
  }
  
  // Account number validation
  if (normalized.includes("account") && normalized.includes("number")) {
    if (!isValidAccountNumber(strValue)) {
      errors.push({
        field,
        value,
        message: "Invalid account number format (must be 9-18 digits)",
        rule: "account_validation",
        severity: "error",
      });
    }
  }
  
  // IFSC validation
  if (normalized.includes("ifsc")) {
    if (!isValidIFSC(strValue)) {
      errors.push({
        field,
        value,
        message: "Invalid IFSC code format (must be [A-Z]{4}0[A-Z0-9]{6})",
        rule: "ifsc_validation",
        severity: "error",
      });
    }
  }
  
  // PAN validation
  if (normalized.includes("pan")) {
    if (!isValidPAN(strValue)) {
      errors.push({
        field,
        value,
        message: "Invalid PAN format (must be [A-Z]{5}[0-9]{4}[A-Z]{1})",
        rule: "pan_validation",
        severity: "error",
      });
    }
  }
  
  // Age validation
  if (normalized.includes("age")) {
    const age = parseInt(strValue);
    if (isNaN(age) || age < 0 || age > 150) {
      errors.push({
        field,
        value,
        message: "Invalid age value (must be 0-150)",
        rule: "age_validation",
        severity: "warning",
      });
    }
  }
  
  // URL validation
  if (normalized.includes("url") || normalized.includes("website") || normalized.includes("linkedin")) {
    if (!isValidURL(strValue)) {
      errors.push({
        field,
        value,
        message: "Invalid URL format",
        rule: "url_validation",
        severity: "warning",
      });
    }
  }
  
  // Date validation
  if (normalized.includes("date") || normalized.includes("dob") || normalized.includes("birth")) {
    if (!isValidDate(strValue)) {
      errors.push({
        field,
        value,
        message: "Invalid date format",
        rule: "date_validation",
        severity: "warning",
      });
    }
  }
  
  return errors;
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(email);
}

/**
 * Validate phone number
 */
function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

/**
 * Validate account number (9-18 digits)
 */
function isValidAccountNumber(account: string): boolean {
  return /^\d{9,18}$/.test(account);
}

/**
 * Validate IFSC code
 */
function isValidIFSC(ifsc: string): boolean {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifsc);
}

/**
 * Validate PAN number
 */
function isValidPAN(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(pan);
}

/**
 * Validate URL format
 */
function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    // Also accept URLs without protocol
    return /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i.test(url);
  }
}

/**
 * Validate date format
 */
function isValidDate(dateStr: string): boolean {
  // Try parsing as date
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) return true;
  
  // Accept common date patterns
  const datePatterns = [
    /^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/,     // DD/MM/YYYY, MM/DD/YYYY
    /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/,        // YYYY-MM-DD
    /^[A-Za-z]+\s+\d{1,2},?\s+\d{4}$/,      // Month DD, YYYY
    /^\d{1,2}\s+[A-Za-z]+\s+\d{4}$/,        // DD Month YYYY
  ];
  
  return datePatterns.some(pattern => pattern.test(dateStr));
}

/**
 * Validate multiple data objects
 * @param dataArray - Array of extracted data objects
 * @param schema - Zod schema
 * @param confidenceThreshold - Minimum confidence threshold
 * @returns Array of validation results
 */
export function validateMultiple(
  dataArray: Array<{ data: ExtractedData; confidence?: number }>,
  schema: z.ZodObject<any>,
  confidenceThreshold: number = 0.8
): ValidationResult[] {
  return dataArray.map(({ data, confidence }) => 
    validateData(data, schema, confidenceThreshold, confidence)
  );
}

/**
 * Clean and sanitize extracted data
 * @param data - Raw extracted data
 * @returns Cleaned data
 */
export function cleanData(data: ExtractedData): ExtractedData {
  const cleaned: ExtractedData = {};
  
  Object.entries(data).forEach(([field, value]) => {
    if (value === null || value === undefined) {
      cleaned[field] = null;
      return;
    }
    
    const strValue = String(value).trim();
    const normalized = field.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    // Clean email - lowercase
    if (normalized.includes("email")) {
      cleaned[field] = strValue.toLowerCase();
    }
    // Clean name - proper case
    else if (normalized.includes("name")) {
      cleaned[field] = toProperCase(strValue);
    }
    // Clean IFSC - uppercase
    else if (normalized.includes("ifsc")) {
      cleaned[field] = strValue.toUpperCase();
    }
    // Clean PAN - uppercase
    else if (normalized.includes("pan")) {
      cleaned[field] = strValue.toUpperCase();
    }
    // Clean phone - remove spaces
    else if (normalized.includes("phone") || normalized.includes("mobile")) {
      cleaned[field] = strValue.replace(/\s+/g, "");
    }
    // Default - trim only
    else {
      cleaned[field] = strValue;
    }
  });
  
  return cleaned;
}

/**
 * Convert string to proper case (Title Case)
 */
function toProperCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get validation summary statistics
 * @param validations - Array of validation results
 * @returns Summary statistics
 */
export function getValidationSummary(validations: ValidationResult[]): {
  total: number;
  valid: number;
  invalid: number;
  needsReview: number;
  passRate: number;
} {
  const total = validations.length;
  const valid = validations.filter(v => v.isValid).length;
  const invalid = validations.filter(v => !v.isValid).length;
  const needsReview = validations.filter(v => v.needsReview).length;
  const passRate = total > 0 ? valid / total : 0;
  
  return { total, valid, invalid, needsReview, passRate };
}
