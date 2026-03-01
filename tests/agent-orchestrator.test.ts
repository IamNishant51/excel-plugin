/**
 * Tests for Agent Orchestrator
 * Tests validateCode() function for banned patterns and API validation
 */

import { validateCode, ValidationResult } from '../src/services/agent-orchestrator';

describe('Agent Orchestrator - validateCode', () => {
  describe('Banned Pattern Detection', () => {
    test('should detect getValues() as banned', () => {
      const code = `
        const range = sheet.getRange("A1:B10");
        const values = range.getValues();
      `;
      const result = validateCode(code);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes("getValues()"))).toBe(true);
    });

    test('should detect getRowCount() as banned', () => {
      const code = `
        const usedRange = sheet.getUsedRange();
        const rows = usedRange.getRowCount();
      `;
      const result = validateCode(code);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes("getRowCount()"))).toBe(true);
    });

    test('should detect setValues() as banned', () => {
      const code = `
        const range = sheet.getRange("A1:B2");
        range.setValues([["A", "B"], ["C", "D"]]);
      `;
      const result = validateCode(code);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes("setValues()"))).toBe(true);
    });

    test('should detect Google Apps Script contamination', () => {
      const code = `
        const sheet = SpreadsheetApp.getActiveSpreadsheet();
        Logger.log("Test");
      `;
      const result = validateCode(code);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes("Google Apps Script"))).toBe(true);
    });

    test('should detect alert() as banned', () => {
      const code = `
        const range = sheet.getRange("A1");
        alert("Done!");
      `;
      const result = validateCode(code);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes("alert()"))).toBe(true);
    });
  });

  describe('Valid Code Patterns', () => {
    test('should accept valid range value assignment', () => {
      const code = `
        const range = sheet.getRange("A1:B2");
        range.values = [["Hello", "World"], ["Test", "Data"]];
        await context.sync();
      `;
      const result = validateCode(code);
      
      expect(result.isValid).toBe(true);
    });

    test('should accept valid formatting code', () => {
      const code = `
        const range = sheet.getRange("A1:D1");
        range.format.font.bold = true;
        range.format.fill.color = "#4472C4";
        range.format.font.color = "#FFFFFF";
        await context.sync();
      `;
      const result = validateCode(code);
      
      expect(result.isValid).toBe(true);
    });

    test('should accept valid load and sync pattern', () => {
      const code = `
        const usedRange = sheet.getUsedRange();
        usedRange.load("rowCount, columnCount, values");
        await context.sync();
        const rows = usedRange.rowCount;
      `;
      const result = validateCode(code);
      
      expect(result.isValid).toBe(true);
    });
  });

  describe('Missing sync() Detection', () => {
    test('should error when load() is used without sync()', () => {
      const code = `
        const range = sheet.getUsedRange();
        range.load("values");
        const data = range.values;
      `;
      const result = validateCode(code);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.type === 'missing_sync')).toBe(true);
    });
  });

  describe('Type Error Detection', () => {
    test('should detect values assigned as non-array', () => {
      const code = `
        const range = sheet.getRange("A1");
        range.values = "Hello";
        await context.sync();
      `;
      const result = validateCode(code);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.type === 'type_error')).toBe(true);
    });

    test('should detect formulas assigned as non-array', () => {
      const code = `
        const range = sheet.getRange("A1");
        range.formulas = "=SUM(A1:A10)";
        await context.sync();
      `;
      const result = validateCode(code);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.type === 'type_error')).toBe(true);
    });
  });

  describe('Markdown Fence Removal', () => {
    test('should remove JavaScript markdown fences', () => {
      const code = '```javascript\nconst x = 1;\n```';
      const result = validateCode(code);
      
      expect(result.sanitizedCode).not.toContain('```');
      expect(result.sanitizedCode).toContain('const x = 1');
    });

    test('should remove TypeScript markdown fences', () => {
      const code = '```ts\nconst x: number = 1;\n```';
      const result = validateCode(code);
      
      expect(result.sanitizedCode).not.toContain('```');
    });
  });

  describe('Syntax Error Detection', () => {
    test('should detect missing closing bracket', () => {
      const code = `
        const range = sheet.getRange("A1";
        await context.sync();
      `;
      const result = validateCode(code);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.type === 'syntax')).toBe(true);
    });
  });

  describe('API Detection', () => {
    test('should detect used API patterns', () => {
      const code = `
        const range = sheet.getRange("A1:B10");
        const usedRange = sheet.getUsedRange();
        range.format.font.bold = true;
        await context.sync();
      `;
      const result = validateCode(code);
      
      expect(result.apiCallsDetected.length).toBeGreaterThan(0);
      expect(result.apiCallsDetected.some(api => api.includes('getRange'))).toBe(true);
    });
  });
});

describe('Agent Orchestrator - Edge Cases', () => {
  test('should handle empty code', () => {
    const result = validateCode('');
    expect(result.sanitizedCode).toBe('');
  });

  test('should handle code with only comments', () => {
    const code = '// This is a comment\n/* Multi-line */';
    const result = validateCode(code);
    expect(result.isValid).toBe(true);
  });

  test('should handle valid complex code', () => {
    const code = `
      // Get used range and load properties
      const usedRange = sheet.getUsedRange();
      usedRange.load("rowCount, columnCount, values");
      await context.sync();
      
      // Format header row
      if (usedRange.rowCount > 0) {
        const headerRange = sheet.getRange("A1").getResizedRange(0, usedRange.columnCount - 1);
        headerRange.format.font.bold = true;
        headerRange.format.fill.color = "#4472C4";
        headerRange.format.font.color = "#FFFFFF";
        await context.sync();
      }
    `;
    const result = validateCode(code);
    expect(result.isValid).toBe(true);
  });
});
