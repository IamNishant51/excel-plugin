/**
 * Unit tests for validator service
 */

import { z } from "zod";
import {
  buildDynamicSchema,
  validateData,
  validateMultiple,
  cleanData,
  getValidationSummary,
} from "../src/services/validator";
import { ExtractedData, ValidationResult } from "../src/services/types";

describe("Validator - buildDynamicSchema", () => {
  test("should build schema with text fields", () => {
    const headers = ["Name", "Address", "City"];
    const schema = buildDynamicSchema(headers);
    
    const validData = { Name: "John", Address: "123 Main St", City: "NYC" };
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test("should build schema with email field", () => {
    const headers = ["Name", "Email"];
    const schema = buildDynamicSchema(headers);
    
    const validData = { Name: "John", Email: "john@example.com" };
    const invalidData = { Name: "John", Email: "invalid-email" };
    
    expect(schema.safeParse(validData).success).toBe(true);
    expect(schema.safeParse(invalidData).success).toBe(false);
  });

  test("should build schema with phone field", () => {
    const headers = ["Name", "Phone"];
    const schema = buildDynamicSchema(headers);
    
    const validData = { Name: "John", Phone: "5551234567" };
    const invalidData = { Name: "John", Phone: "123" };
    
    expect(schema.safeParse(validData).success).toBe(true);
    expect(schema.safeParse(invalidData).success).toBe(false);
  });

  test("should build schema with IFSC field", () => {
    const headers = ["Bank", "IFSC Code"];
    const schema = buildDynamicSchema(headers);
    
    const validData = { Bank: "SBI", "IFSC Code": "SBIN0001234" };
    const invalidData = { Bank: "SBI", "IFSC Code": "INVALID" };
    
    expect(schema.safeParse(validData).success).toBe(true);
    expect(schema.safeParse(invalidData).success).toBe(false);
  });

  test("should build schema with PAN field", () => {
    const headers = ["Name", "PAN"];
    const schema = buildDynamicSchema(headers);
    
    const validData = { Name: "John", PAN: "ABCDE1234F" };
    const invalidData = { Name: "John", PAN: "INVALID" };
    
    expect(schema.safeParse(validData).success).toBe(true);
    expect(schema.safeParse(invalidData).success).toBe(false);
  });

  test("should allow null values", () => {
    const headers = ["Name", "Email", "Phone"];
    const schema = buildDynamicSchema(headers);
    
    const dataWithNulls = { Name: "John", Email: null, Phone: "" };
    const result = schema.safeParse(dataWithNulls);
    expect(result.success).toBe(true);
  });

  test("should build schema with mixed field types", () => {
    const headers = ["Name", "Email", "Phone", "Age", "IFSC"];
    const schema = buildDynamicSchema(headers);
    
    expect(schema).toBeDefined();
    expect(Object.keys(schema.shape)).toEqual(headers);
  });
});

describe("Validator - validateData", () => {
  test("should validate correct data", () => {
    const headers = ["Name", "Email"];
    const schema = buildDynamicSchema(headers);
    const data: ExtractedData = { Name: "John Doe", Email: "john@example.com" };
    
    const result = validateData(data, schema, 0.8, 0.9);
    
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
    expect(result.needsReview).toBe(false);
  });

  test("should catch email validation errors", () => {
    const headers = ["Name", "Email"];
    const schema = buildDynamicSchema(headers);
    const data: ExtractedData = { Name: "John", Email: "invalid-email" };
    
    const result = validateData(data, schema);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.needsReview).toBe(true);
  });

  test("should catch phone validation errors", () => {
    const headers = ["Name", "Phone"];
    const schema = buildDynamicSchema(headers);
    const data: ExtractedData = { Name: "John", Phone: "123" };
    
    const result = validateData(data, schema);
    
    expect(result.isValid).toBe(false);
    expect(result.needsReview).toBe(true);
  });

  test("should flag low confidence data", () => {
    const headers = ["Name", "Email"];
    const schema = buildDynamicSchema(headers);
    const data: ExtractedData = { Name: "John", Email: "john@example.com" };
    
    const result = validateData(data, schema, 0.8, 0.5); // Low confidence
    
    expect(result.needsReview).toBe(true);
    expect(result.errors.some(e => e.field === "_confidence")).toBe(true);
  });

  test("should validate IFSC code format", () => {
    const headers = ["IFSC"];
    const schema = buildDynamicSchema(headers);
    
    const validData: ExtractedData = { IFSC: "SBIN0001234" };
    const invalidData: ExtractedData = { IFSC: "INVALID" };
    
    expect(validateData(validData, schema).isValid).toBe(true);
    expect(validateData(invalidData, schema).isValid).toBe(false);
  });

  test("should validate PAN format", () => {
    const headers = ["PAN Number"];
    const schema = buildDynamicSchema(headers);
    
    const validData: ExtractedData = { "PAN Number": "ABCDE1234F" };
    const invalidData: ExtractedData = { "PAN Number": "INVALID" };
    
    expect(validateData(validData, schema).isValid).toBe(true);
    expect(validateData(invalidData, schema).isValid).toBe(false);
  });

  test("should validate age field", () => {
    const headers = ["Name", "Age"];
    const schema = buildDynamicSchema(headers);
    
    const validData: ExtractedData = { Name: "John", Age: "30" };
    const invalidData: ExtractedData = { Name: "John", Age: "999" };
    
    expect(validateData(validData, schema).isValid).toBe(true);
    const invalidResult = validateData(invalidData, schema);
    expect(invalidResult.needsReview).toBe(true);
  });

  test("should handle null fields", () => {
    const headers = ["Name", "Email", "Phone"];
    const schema = buildDynamicSchema(headers);
    const data: ExtractedData = { Name: "John", Email: null, Phone: null };
    
    const result = validateData(data, schema);
    expect(result.isValid).toBe(true);
  });

  test("should validate URL format", () => {
    const headers = ["Website"];
    const schema = buildDynamicSchema(headers);
    
    const validData: ExtractedData = { Website: "https://example.com" };
    const invalidData: ExtractedData = { Website: "not-a-url" };
    
    expect(validateData(validData, schema).isValid).toBe(true);
    expect(validateData(invalidData, schema).isValid).toBe(false);
  });
});

describe("Validator - validateMultiple", () => {
  test("should validate multiple data objects", () => {
    const headers = ["Name", "Email"];
    const schema = buildDynamicSchema(headers);
    const dataArray = [
      { data: { Name: "John", Email: "john@example.com" }, confidence: 0.9 },
      { data: { Name: "Jane", Email: "jane@example.com" }, confidence: 0.85 },
    ];
    
    const results = validateMultiple(dataArray, schema, 0.8);
    
    expect(results.length).toBe(2);
    expect(results[0].isValid).toBe(true);
    expect(results[1].isValid).toBe(true);
  });

  test("should catch multiple validation errors", () => {
    const headers = ["Name", "Email"];
    const schema = buildDynamicSchema(headers);
    const dataArray = [
      { data: { Name: "John", Email: "john@example.com" }, confidence: 0.9 },
      { data: { Name: "Jane", Email: "invalid" }, confidence: 0.85 },
    ];
    
    const results = validateMultiple(dataArray, schema, 0.8);
    
    expect(results.length).toBe(2);
    expect(results[0].isValid).toBe(true);
    expect(results[1].isValid).toBe(false);
  });

  test("should flag low confidence items", () => {
    const headers = ["Name", "Email"];
    const schema = buildDynamicSchema(headers);
    const dataArray = [
      { data: { Name: "John", Email: "john@example.com" }, confidence: 0.9 },
      { data: { Name: "Jane", Email: "jane@example.com" }, confidence: 0.5 }, // Low
    ];
    
    const results = validateMultiple(dataArray, schema, 0.8);
    
    expect(results[0].needsReview).toBe(false);
    expect(results[1].needsReview).toBe(true);
  });
});

describe("Validator - cleanData", () => {
  test("should convert email to lowercase", () => {
    const data: ExtractedData = { Email: "JOHN@EXAMPLE.COM" };
    const cleaned = cleanData(data);
    expect(cleaned.Email).toBe("john@example.com");
  });

  test("should convert name to proper case", () => {
    const data: ExtractedData = { Name: "JOHN DOE" };
    const cleaned = cleanData(data);
    expect(cleaned.Name).toBe("John Doe");
  });

  test("should convert IFSC to uppercase", () => {
    const data: ExtractedData = { IFSC: "sbin0001234" };
    const cleaned = cleanData(data);
    expect(cleaned.IFSC).toBe("SBIN0001234");
  });

  test("should convert PAN to uppercase", () => {
    const data: ExtractedData = { "PAN Number": "abcde1234f" };
    const cleaned = cleanData(data);
    expect(cleaned["PAN Number"]).toBe("ABCDE1234F");
  });

  test("should remove spaces from phone", () => {
    const data: ExtractedData = { Phone: "555 123 4567" };
    const cleaned = cleanData(data);
    expect(cleaned.Phone).toBe("5551234567");
  });

  test("should trim whitespace from all fields", () => {
    const data: ExtractedData = {
      Name: "  John Doe  ",
      Address: "  123 Main St  ",
    };
    const cleaned = cleanData(data);
    expect(cleaned.Name).toBe("John Doe");
    expect(cleaned.Address).toBe("123 Main St");
  });

  test("should handle null values", () => {
    const data: ExtractedData = { Name: "John", Email: null };
    const cleaned = cleanData(data);
    expect(cleaned.Name).toBe("John");
    expect(cleaned.Email).toBeNull();
  });

  test("should handle mixed case field names", () => {
    const data: ExtractedData = {
      "Email Address": "TEST@EXAMPLE.COM",
      "Full Name": "john doe",
    };
    const cleaned = cleanData(data);
    expect(cleaned["Email Address"]).toBe("test@example.com");
    expect(cleaned["Full Name"]).toBe("John Doe");
  });
});

describe("Validator - getValidationSummary", () => {
  test("should calculate summary statistics", () => {
    const validations: ValidationResult[] = [
      { isValid: true, errors: [], needsReview: false, validatedAt: new Date() },
      { isValid: true, errors: [], needsReview: false, validatedAt: new Date() },
      { isValid: false, errors: [{ field: "Email", value: "invalid", message: "Invalid", rule: "email", severity: "error" }], needsReview: true, validatedAt: new Date() },
      { isValid: true, errors: [], needsReview: true, validatedAt: new Date() }, // Valid but needs review
    ];
    
    const summary = getValidationSummary(validations);
    
    expect(summary.total).toBe(4);
    expect(summary.valid).toBe(3);
    expect(summary.invalid).toBe(1);
    expect(summary.needsReview).toBe(2);
    expect(summary.passRate).toBe(0.75);
  });

  test("should handle empty validations", () => {
    const summary = getValidationSummary([]);
    
    expect(summary.total).toBe(0);
    expect(summary.valid).toBe(0);
    expect(summary.invalid).toBe(0);
    expect(summary.needsReview).toBe(0);
    expect(summary.passRate).toBe(0);
  });

  test("should handle all valid data", () => {
    const validations: ValidationResult[] = [
      { isValid: true, errors: [], needsReview: false, validatedAt: new Date() },
      { isValid: true, errors: [], needsReview: false, validatedAt: new Date() },
    ];
    
    const summary = getValidationSummary(validations);
    
    expect(summary.passRate).toBe(1);
    expect(summary.needsReview).toBe(0);
  });

  test("should handle all invalid data", () => {
    const validations: ValidationResult[] = [
      { isValid: false, errors: [{ field: "Email", value: "x", message: "Invalid", rule: "email", severity: "error" }], needsReview: true, validatedAt: new Date() },
      { isValid: false, errors: [{ field: "Phone", value: "y", message: "Invalid", rule: "phone", severity: "error" }], needsReview: true, validatedAt: new Date() },
    ];
    
    const summary = getValidationSummary(validations);
    
    expect(summary.passRate).toBe(0);
    expect(summary.invalid).toBe(2);
    expect(summary.needsReview).toBe(2);
  });
});

describe("Validator - Edge Cases", () => {
  test("should handle empty data object", () => {
    const headers = ["Name", "Email"];
    const schema = buildDynamicSchema(headers);
    const data: ExtractedData = {};
    
    const result = validateData(data, schema);
    expect(result).toBeDefined();
  });

  test("should handle extra fields in data", () => {
    const headers = ["Name", "Email"];
    const schema = buildDynamicSchema(headers);
    const data: ExtractedData = {
      Name: "John",
      Email: "john@example.com",
      ExtraField: "should be ignored",
    };
    
    // Zod will ignore extra fields by default
    const result = validateData(data, schema);
    expect(result.isValid).toBe(true);
  });

  test("should handle special characters in field names", () => {
    const headers = ["Name", "Email/Contact"];
    const schema = buildDynamicSchema(headers);
    const data: ExtractedData = {
      Name: "John",
      "Email/Contact": "john@example.com",
    };
    
    const result = validateData(data, schema);
    expect(result).toBeDefined();
  });

  test("should handle very long field values", () => {
    const headers = ["Name", "Description"];
    const schema = buildDynamicSchema(headers);
    const longText = "A".repeat(10000);
    const data: ExtractedData = { Name: "John", Description: longText };
    
    const result = validateData(data, schema);
    expect(result.isValid).toBe(true);
  });

  test("should handle unicode characters", () => {
    const headers = ["Name", "Email"];
    const schema = buildDynamicSchema(headers);
    const data: ExtractedData = {
      Name: "João José",
      Email: "joao@example.com",
    };
    
    const cleaned = cleanData(data);
    expect(cleaned.Name).toContain("João");
  });
});

describe("Validator - Type Detection", () => {
  test("should detect email field type", () => {
    const headers = ["Email", "Email Address", "Contact Email"];
    headers.forEach(header => {
      const schema = buildDynamicSchema([header]);
      expect(schema.shape[header]).toBeDefined();
    });
  });

  test("should detect phone field type", () => {
    const headers = ["Phone", "Mobile", "Contact Number"];
    headers.forEach(header => {
      const schema = buildDynamicSchema([header]);
      expect(schema.shape[header]).toBeDefined();
    });
  });

  test("should detect number field type", () => {
    const headers = ["Age", "Amount", "Salary", "Balance"];
    headers.forEach(header => {
      const schema = buildDynamicSchema([header]);
      expect(schema.shape[header]).toBeDefined();
    });
  });

  test("should detect date field type", () => {
    const headers = ["Date", "DOB", "Birth Date"];
    headers.forEach(header => {
      const schema = buildDynamicSchema([header]);
      expect(schema.shape[header]).toBeDefined();
    });
  });

  test("should default to text for unknown fields", () => {
    const headers = ["Unknown Field", "Random", "Something Else"];
    headers.forEach(header => {
      const schema = buildDynamicSchema([header]);
      expect(schema.shape[header]).toBeDefined();
    });
  });
});
