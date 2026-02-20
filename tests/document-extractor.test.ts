/**
 * Tests for Document Extractor
 * Tests parseExtractionResponse() and normalizeColumnName()
 */

import { 
  parseExtractionResponse, 
  normalizeColumnName,
  validateExtraction,
  ExtractionSchema
} from '../src/services/document-extractor';

describe('Document Extractor - parseExtractionResponse', () => {
  test('should parse valid JSON array response', () => {
    const response = `[
      {"Name": "John Smith", "Email": "john@email.com", "Phone": "+1-555-1234", "Skills": "Python, Excel"},
      {"Name": "Jane Doe", "Email": "jane@test.com", "Phone": "", "Skills": "JavaScript"}
    ]`;
    
    const result = parseExtractionResponse(response);
    
    expect(result).toHaveLength(2);
    expect(result[0]['Name']).toBe('John Smith');
    expect(result[0]['Email']).toBe('john@email.com');
    expect(result[1]['Phone']).toBe('');
  });

  test('should handle response with markdown code fence', () => {
    const response = '```json\n[{"Name": "Test User", "Email": "test@test.com", "Phone": "", "Skills": "Testing"}]\n```';
    
    const result = parseExtractionResponse(response);
    
    expect(result).toHaveLength(1);
    expect(result[0]['Name']).toBe('Test User');
  });

  test('should handle empty string values', () => {
    const response = '[{"Name": "User One", "Email": "", "Phone": "", "Skills": ""}]';
    
    const result = parseExtractionResponse(response);
    
    expect(result).toHaveLength(1);
    expect(result[0]['Email']).toBe('');
  });

  test('should return empty array for invalid JSON input', () => {
    const response = 'This is not JSON at all';
    
    const result = parseExtractionResponse(response);
    
    expect(result).toEqual([]);
  });

  test('should handle malformed JSON with trailing commas gracefully', () => {
    const response = '[{"Name": "Test",}]';
    
    const result = parseExtractionResponse(response);
    
    expect(result).toEqual([]);
  });

  test('should return empty array for response wrapped in object (non-array root)', () => {
    const response = '{"data": [{"Name": "Wrapped User", "Email": "wrap@test.com", "Phone": "", "Skills": ""}]}';
    
    const result = parseExtractionResponse(response);
    
    expect(result).toEqual([]);
  });

  test('should parse a large valid JSON response', () => {
    const records = Array.from({ length: 100 }, (_, i) => ({
      Name: `User ${i}`,
      Email: `user${i}@test.com`,
      Phone: '',
      Skills: 'Test'
    }));
    const response = JSON.stringify(records);
    
    const result = parseExtractionResponse(response);
    
    expect(result).toHaveLength(100);
    expect(result[0]['Name']).toBe('User 0');
    expect(result[99]['Email']).toBe('user99@test.com');
  });

  test('should return empty array for empty or whitespace response', () => {
    expect(parseExtractionResponse('')).toEqual([]);
    expect(parseExtractionResponse('   \n\n   ')).toEqual([]);
  });
});

describe('Document Extractor - validateExtraction', () => {
  const schema: ExtractionSchema = {
    columns: ['Name', 'Email', 'Phone', 'Skills'],
    strict: true,
  };

  test('should validate mapped data successfully', () => {
    const data = [
      { Name: 'John', Email: 'john@test.com', Phone: '123', Skills: 'Excel' },
    ];

    const result = validateExtraction(data, schema);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.unmappedFields).toEqual([]);
  });

  test('should detect unmapped fields and report warnings', () => {
    const data = [
      { Name: 'User', Email: 'user@test.com', Phone: '', Skills: '', ExtraField: 'value' },
    ];

    const result = validateExtraction(data, schema);

    expect(result.success).toBe(true);
    expect(result.unmappedFields).toContain('ExtraField');
    expect(result.warnings.some(w => w.includes('columns not in schema'))).toBe(true);
  });

  test('should warn for empty schema columns', () => {
    const data = [
      { Name: 'User', Email: '', Phone: '', Skills: '' },
    ];

    const result = validateExtraction(data, schema);

    expect(result.success).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  test('should fail when data array is empty', () => {
    const result = validateExtraction([], schema);

    expect(result.success).toBe(false);
    expect(result.data).toEqual([]);
  });
});

describe('Document Extractor - normalizeColumnName', () => {
  test('should preserve exact standard column names after trimming', () => {
    expect(normalizeColumnName('  Name  ')).toBe('Name');
    expect(normalizeColumnName('Email')).toBe('Email');
  });

  test('should map known aliases to standard names (case-insensitive)', () => {
    expect(normalizeColumnName('email address')).toBe('Email');
    expect(normalizeColumnName('PHONE NUMBER')).toBe('Phone');
    expect(normalizeColumnName('Current Role')).toBe('Position');
  });

  test('should handle empty strings', () => {
    expect(normalizeColumnName('')).toBe('');
    expect(normalizeColumnName('   ')).toBe('');
  });

  test('should return unknown columns trimmed without remapping', () => {
    expect(normalizeColumnName('Email-Address')).toBe('Email-Address');
    expect(normalizeColumnName('Custom_Field')).toBe('Custom_Field');
  });
});
