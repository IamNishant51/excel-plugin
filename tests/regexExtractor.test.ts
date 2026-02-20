/**
 * Unit tests for regexExtractor service
 */

import {
  emailPattern,
  phonePattern,
  accountNumberPattern,
  ifscPattern,
  panPattern,
  datePattern,
  invoiceNumberPattern,
  urlPattern,
  linkedinPattern,
  ssnPattern,
  extractWithPattern,
  extractAllWithPattern,
  smartExtract,
  extractMultipleFields,
  shouldUseRegex,
} from "../src/services/regexExtractor";

describe("RegexExtractor - Email Pattern", () => {
  test("should extract valid email", () => {
    const text = "Contact me at john.doe@example.com for more info";
    const result = emailPattern.extract(text);
    expect(result).toBe("john.doe@example.com");
  });

  test("should return null for no email", () => {
    const text = "This text has no email address";
    const result = emailPattern.extract(text);
    expect(result).toBeNull();
  });

  test("should extract multiple emails", () => {
    const text = "Email jane@test.com or admin@company.org";
    const result = emailPattern.extractAll!(text);
    expect(result).toContain("jane@test.com");
    expect(result).toContain("admin@company.org");
    expect(result.length).toBe(2);
  });

  test("should validate email format", () => {
    expect(emailPattern.validate!("test@example.com")).toBe(true);
    expect(emailPattern.validate!("invalid-email")).toBe(false);
    expect(emailPattern.validate!("@example.com")).toBe(false);
  });

  test("should convert email to lowercase", () => {
    const text = "CONTACT: JOHN.DOE@EXAMPLE.COM";
    const result = emailPattern.extract(text);
    expect(result).toBe("john.doe@example.com");
  });
});

describe("RegexExtractor - Phone Pattern", () => {
  test("should extract phone with format +1-555-123-4567", () => {
    const text = "Call me at +1-555-123-4567";
    const result = phonePattern.extract(text);
    expect(result).toBeTruthy();
    expect(result).toContain("555");
  });

  test("should extract phone with format (555) 123-4567", () => {
    const text = "Phone: (555) 123-4567";
    const result = phonePattern.extract(text);
    expect(result).toBeTruthy();
  });

  test("should extract plain 10-digit phone", () => {
    const text = "Mobile 5551234567";
    const result = phonePattern.extract(text);
    expect(result).toBeTruthy();
  });

  test("should validate phone length", () => {
    expect(phonePattern.validate!("5551234567")).toBe(true);
    expect(phonePattern.validate!("+1-555-123-4567")).toBe(true);
    expect(phonePattern.validate!("123")).toBe(false);
  });

  test("should return null for invalid phone", () => {
    const text = "No phone number here";
    const result = phonePattern.extract(text);
    expect(result).toBeNull();
  });
});

describe("RegexExtractor - Account Number Pattern", () => {
  test("should extract 10-digit account number", () => {
    const text = "Account Number: 1234567890";
    const result = accountNumberPattern.extract(text);
    expect(result).toBe("1234567890");
  });

  test("should extract 16-digit account number", () => {
    const text = "A/C No: 1234567890123456";
    const result = accountNumberPattern.extract(text);
    expect(result).toBe("1234567890123456");
  });

  test("should validate account number length", () => {
    expect(accountNumberPattern.validate!("123456789")).toBe(true);
    expect(accountNumberPattern.validate!("123456789012345678")).toBe(true);
    expect(accountNumberPattern.validate!("12345")).toBe(false);
  });
});

describe("RegexExtractor - IFSC Pattern", () => {
  test("should extract valid IFSC code", () => {
    const text = "IFSC Code: SBIN0001234";
    const result = ifscPattern.extract(text);
    expect(result).toBe("SBIN0001234");
  });

  test("should convert IFSC to uppercase", () => {
    const text = "ifsc: hdfc0001234";
    const result = ifscPattern.extract(text);
    expect(result).toBe("HDFC0001234");
  });

  test("should validate IFSC format", () => {
    expect(ifscPattern.validate!("SBIN0001234")).toBe(true);
    expect(ifscPattern.validate!("HDFC0ABCDEF")).toBe(true);
    expect(ifscPattern.validate!("INVALID123")).toBe(false);
    expect(ifscPattern.validate!("SBI0001234")).toBe(false); // Must be 4 letters
  });

  test("should return null for invalid IFSC", () => {
    const text = "No IFSC code here";
    const result = ifscPattern.extract(text);
    expect(result).toBeNull();
  });
});

describe("RegexExtractor - PAN Pattern", () => {
  test("should extract valid PAN number", () => {
    const text = "PAN: ABCDE1234F";
    const result = panPattern.extract(text);
    expect(result).toBe("ABCDE1234F");
  });

  test("should convert PAN to uppercase", () => {
    const text = "pan no: abcde1234f";
    const result = panPattern.extract(text);
    expect(result).toBe("ABCDE1234F");
  });

  test("should validate PAN format", () => {
    expect(panPattern.validate!("ABCDE1234F")).toBe(true);
    expect(panPattern.validate!("XYZPQ5678K")).toBe(true);
    expect(panPattern.validate!("ABCD1234F")).toBe(false); // Only 4 letters
    expect(panPattern.validate!("ABCDE12345")).toBe(false); // 5 digits
  });
});

describe("RegexExtractor - Date Pattern", () => {
  test("should extract ISO date format", () => {
    const text = "Date: 2024-01-15";
    const result = datePattern.extract(text);
    expect(result).toBe("2024-01-15");
  });

  test("should extract MM/DD/YYYY format", () => {
    const text = "DOB: 01/15/2024";
    const result = datePattern.extract(text);
    expect(result).toBe("01/15/2024");
  });

  test("should extract text date format", () => {
    const text = "Born on January 15, 2024";
    const result = datePattern.extract(text);
    expect(result).toMatch(/Jan.*15.*2024/i);
  });

  test("should extract multiple dates", () => {
    const text = "From 2024-01-01 to 2024-12-31";
    const result = datePattern.extractAll!(text);
    expect(result.length).toBeGreaterThanOrEqual(2);
  });
});

describe("RegexExtractor - Invoice Number Pattern", () => {
  test("should extract invoice with INV prefix", () => {
    const text = "Invoice: INV-12345";
    const result = invoiceNumberPattern.extract(text);
    expect(result).toBe("12345");
  });

  test("should extract invoice with INVOICE prefix", () => {
    const text = "INVOICE#987654";
    const result = invoiceNumberPattern.extract(text);
    expect(result).toBe("987654");
  });
});

describe("RegexExtractor - URL Pattern", () => {
  test("should extract HTTP URL", () => {
    const text = "Visit http://example.com for more";
    const result = urlPattern.extract(text);
    expect(result).toBe("http://example.com");
  });

  test("should extract HTTPS URL", () => {
    const text = "Website: https://www.example.com/page";
    const result = urlPattern.extract(text);
    expect(result).toMatch(/^https:\/\//);
  });
});

describe("RegexExtractor - LinkedIn Pattern", () => {
  test("should extract LinkedIn profile URL", () => {
    const text = "Profile: https://www.linkedin.com/in/johndoe";
    const result = linkedinPattern.extract(text);
    expect(result).toBe("https://www.linkedin.com/in/johndoe");
  });

  test("should return null for non-LinkedIn URL", () => {
    const text = "Website: https://example.com";
    const result = linkedinPattern.extract(text);
    expect(result).toBeNull();
  });
});

describe("RegexExtractor - SSN Pattern", () => {
  test("should extract SSN with dashes", () => {
    const text = "SSN: 123-45-6789";
    const result = ssnPattern.extract(text);
    expect(result).toBe("123-45-6789");
  });

  test("should validate SSN format", () => {
    expect(ssnPattern.validate!("123-45-6789")).toBe(true);
    expect(ssnPattern.validate!("12-345-6789")).toBe(false);
    expect(ssnPattern.validate!("123456789")).toBe(false);
  });
});

describe("RegexExtractor - extractWithPattern", () => {
  test("should extract using pattern name", () => {
    const text = "Email: test@example.com";
    const result = extractWithPattern(text, "email");
    expect(result).toBe("test@example.com");
  });

  test("should throw error for unknown pattern", () => {
    expect(() => extractWithPattern("text", "unknown")).toThrow("Unknown pattern");
  });
});

describe("RegexExtractor - smartExtract", () => {
  test("should auto-detect email field", () => {
    const text = "Contact: john@example.com";
    const result = smartExtract(text, "Email Address");
    expect(result).toBe("john@example.com");
  });

  test("should auto-detect phone field", () => {
    const text = "Phone: 5551234567";
    const result = smartExtract(text, "Mobile Number");
    expect(result).toBeTruthy();
  });

  test("should auto-detect IFSC field", () => {
    const text = "IFSC: SBIN0001234";
    const result = smartExtract(text, "IFSC Code");
    expect(result).toBe("SBIN0001234");
  });

  test("should return null for unmatched field", () => {
    const text = "Some random text";
    const result = smartExtract(text, "Unknown Field");
    expect(result).toBeNull();
  });
});

describe("RegexExtractor - extractMultipleFields", () => {
  test("should extract multiple fields at once", () => {
    const text = `
      Name: John Doe
      Email: john@example.com
      Phone: 5551234567
      IFSC: SBIN0001234
    `;
    const fields = ["Email", "Phone", "IFSC"];
    const result = extractMultipleFields(text, fields);
    
    expect(result.Email).toBe("john@example.com");
    expect(result.Phone).toBeTruthy();
    expect(result.IFSC).toBe("SBIN0001234");
  });

  test("should return null for missing fields", () => {
    const text = "Email: test@example.com";
    const fields = ["Email", "Phone"];
    const result = extractMultipleFields(text, fields);
    
    expect(result.Email).toBe("test@example.com");
    expect(result.Phone).toBeNull();
  });
});

describe("RegexExtractor - shouldUseRegex", () => {
  test("should return true for email field", () => {
    expect(shouldUseRegex("Email")).toBe(true);
    expect(shouldUseRegex("Email Address")).toBe(true);
  });

  test("should return true for phone field", () => {
    expect(shouldUseRegex("Phone")).toBe(true);
    expect(shouldUseRegex("Mobile Number")).toBe(true);
    expect(shouldUseRegex("Contact")).toBe(true);
  });

  test("should return true for account number", () => {
    expect(shouldUseRegex("Account Number")).toBe(true);
  });

  test("should return false for name field", () => {
    expect(shouldUseRegex("Name")).toBe(false);
    expect(shouldUseRegex("Full Name")).toBe(false);
  });

  test("should return false for address field", () => {
    expect(shouldUseRegex("Address")).toBe(false);
  });

  test("should return false for skills field", () => {
    expect(shouldUseRegex("Skills")).toBe(false);
  });
});

describe("RegexExtractor - Edge Cases", () => {
  test("should handle empty text", () => {
    expect(emailPattern.extract("")).toBeNull();
    expect(phonePattern.extract("")).toBeNull();
  });

  test("should handle text with multiple matches", () => {
    const text = "Email 1: test1@example.com, Email 2: test2@example.com";
    const result = emailPattern.extract(text);
    expect(result).toBeTruthy(); // Should extract at least one
  });

  test("should handle malformed patterns", () => {
    const text = "Email: invalid@";
    const result = emailPattern.extract(text);
    expect(result).toBeNull();
  });
});
