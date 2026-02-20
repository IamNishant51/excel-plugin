/**
 * Schema Reader - Dynamically reads Excel table headers to build extraction schema
 * This ensures AI extracts ONLY the fields that match existing columns
 */

/**
 * Get column headers from the active Excel table
 * @returns Array of column header names
 */
export async function getExcelHeaders(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    Excel.run(async (context) => {
      try {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        
        // Try to get the first table
        const tables = sheet.tables;
        tables.load("items");
        await context.sync();
        
        if (tables.items.length > 0) {
          // Use existing table
          const table = tables.items[0];
          const headerRange = table.getHeaderRowRange();
          headerRange.load("values");
          await context.sync();
          
          const headers = headerRange.values[0]
            .map((header: any) => String(header).trim())
            .filter((header: string) => header.length > 0);
          
          resolve(headers);
        } else {
          // No table exists - try to read first row as headers
          const usedRange = sheet.getUsedRange();
          usedRange.load("values, rowCount");
          await context.sync();
          
          if (usedRange.rowCount > 0) {
            const headers = usedRange.values[0]
              .map((header: any) => String(header).trim())
              .filter((header: string) => header.length > 0);
            
            if (headers.length > 0) {
              resolve(headers);
            } else {
              reject(new Error("No headers found. Please add column headers to the first row."));
            }
          } else {
            reject(new Error("Sheet is empty. Please add column headers."));
          }
        }
      } catch (error) {
        reject(new Error(`Failed to read Excel headers: ${error instanceof Error ? error.message : String(error)}`));
      }
    }).catch((error) => {
      reject(new Error(`Excel.run failed: ${error instanceof Error ? error.message : String(error)}`));
    });
  });
}

/**
 * Get headers from a specific table by name
 * @param tableName - Name of the table
 * @returns Array of column header names
 */
export async function getHeadersFromTable(tableName: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    Excel.run(async (context) => {
      try {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const table = sheet.tables.getItem(tableName);
        const headerRange = table.getHeaderRowRange();
        headerRange.load("values");
        await context.sync();
        
        const headers = headerRange.values[0]
          .map((header: any) => String(header).trim())
          .filter((header: string) => header.length > 0);
        
        resolve(headers);
      } catch (error) {
        reject(new Error(`Failed to read table "${tableName}": ${error instanceof Error ? error.message : String(error)}`));
      }
    }).catch((error) => {
      reject(new Error(`Excel.run failed: ${error instanceof Error ? error.message : String(error)}`));
    });
  });
}

/**
 * Get headers and detect column data types based on first few rows
 * @param sampleSize - Number of rows to sample for type detection
 * @returns Object mapping headers to detected types
 */
export async function getHeadersWithTypes(sampleSize: number = 5): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    Excel.run(async (context) => {
      try {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const tables = sheet.tables;
        tables.load("items");
        await context.sync();
        
        let dataRange: Excel.Range;
        let headers: string[];
        
        if (tables.items.length > 0) {
          const table = tables.items[0];
          const headerRange = table.getHeaderRowRange();
          headerRange.load("values");
          
          const bodyRange = table.getDataBodyRange();
          bodyRange.load("values, rowCount");
          await context.sync();
          
          headers = headerRange.values[0]
            .map((header: any) => String(header).trim())
            .filter((header: string) => header.length > 0);
          
          dataRange = bodyRange;
        } else {
          const usedRange = sheet.getUsedRange();
          usedRange.load("values, rowCount");
          await context.sync();
          
          headers = usedRange.values[0]
            .map((header: any) => String(header).trim())
            .filter((header: string) => header.length > 0);
          
          // Create a range for data rows (excluding header)
          dataRange = usedRange.getOffsetRange(1, 0).getResizedRange(Math.min(sampleSize - 1, usedRange.rowCount - 2), 0);
          dataRange.load("values");
          await context.sync();
        }
        
        const headerTypes: Record<string, string> = {};
        
        // Analyze data types
        const values = dataRange.values;
        headers.forEach((header, colIndex) => {
          const columnValues = values.map((row: any[]) => row[colIndex]).filter((val: any) => val !== null && val !== "");
          headerTypes[header] = detectDataType(columnValues);
        });
        
        resolve(headerTypes);
      } catch (error) {
        reject(new Error(`Failed to analyze headers: ${error instanceof Error ? error.message : String(error)}`));
      }
    }).catch((error) => {
      reject(new Error(`Excel.run failed: ${error instanceof Error ? error.message : String(error)}`));
    });
  });
}

/**
 * Detect data type from sample values
 */
function detectDataType(values: any[]): string {
  if (values.length === 0) return "text";
  
  const nonEmptyValues = values.filter(v => v !== null && v !== "");
  if (nonEmptyValues.length === 0) return "text";
  
  // Check if all values are numbers
  const allNumbers = nonEmptyValues.every(v => !isNaN(Number(v)));
  if (allNumbers) return "number";
  
  // Check if all values are dates
  const allDates = nonEmptyValues.every(v => !isNaN(Date.parse(String(v))));
  if (allDates) return "date";
  
  // Check for email pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const allEmails = nonEmptyValues.every(v => emailPattern.test(String(v)));
  if (allEmails) return "email";
  
  // Check for phone pattern
  const phonePattern = /^[\d\s\-\+\(\)]+$/;
  const allPhones = nonEmptyValues.every(v => phonePattern.test(String(v)) && String(v).replace(/\D/g, "").length >= 10);
  if (allPhones) return "phone";
  
  // Default to text
  return "text";
}

/**
 * Create a new table with given headers if none exists
 * @param headers - Array of column header names
 * @returns True if table was created
 */
export async function createTableWithHeaders(headers: string[]): Promise<boolean> {
  return new Promise((resolve, reject) => {
    Excel.run(async (context) => {
      try {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        
        // Check if tables already exist
        const tables = sheet.tables;
        tables.load("items");
        await context.sync();
        
        if (tables.items.length > 0) {
          resolve(false); // Table already exists
          return;
        }
        
        // Create table in A1
        const headerRange = sheet.getRange(`A1:${getColumnLetter(headers.length)}1`);
        headerRange.values = [headers];
        
        // Create table
        const table = sheet.tables.add(headerRange, true);
        table.name = "DataTable";
        await context.sync();
        
        resolve(true);
      } catch (error) {
        reject(new Error(`Failed to create table: ${error instanceof Error ? error.message : String(error)}`));
      }
    }).catch((error) => {
      reject(new Error(`Excel.run failed: ${error instanceof Error ? error.message : String(error)}`));
    });
  });
}

/**
 * Convert column index to Excel column letter (0 -> A, 25 -> Z, 26 -> AA)
 */
function getColumnLetter(columnNumber: number): string {
  let letter = "";
  let num = columnNumber;
  
  while (num > 0) {
    const remainder = (num - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    num = Math.floor((num - 1) / 26);
  }
  
  return letter;
}

/**
 * Validate if headers are suitable for extraction
 * @param headers - Array of headers to validate
 * @returns Validation result with warnings
 */
export function validateHeaders(headers: string[]): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  if (headers.length === 0) {
    return { valid: false, warnings: ["No headers found"] };
  }
  
  // Check for duplicate headers
  const duplicates = headers.filter((item, index) => headers.indexOf(item) !== index);
  if (duplicates.length > 0) {
    warnings.push(`Duplicate headers found: ${duplicates.join(", ")}`);
  }
  
  // Check for very short headers
  const shortHeaders = headers.filter(h => h.length < 2);
  if (shortHeaders.length > 0) {
    warnings.push(`Very short headers found: ${shortHeaders.join(", ")}`);
  }
  
  // Check for numeric-only headers
  const numericHeaders = headers.filter(h => /^\d+$/.test(h));
  if (numericHeaders.length > 0) {
    warnings.push(`Numeric-only headers found: ${numericHeaders.join(", ")} (consider using descriptive names)`);
  }
  
  return { valid: warnings.length === 0, warnings };
}
