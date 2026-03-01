/**
 * Excel Writer - Writes validated extraction data to Excel with status tracking
 * 
 * EXCEL WRITE LOGIC:
 * - Detect existing table dynamically
 * - Map fields by header name (case insensitive)
 * - Insert row only after validation
 * - If flagged:
 *   - Add or ensure column "Status"
 *   - Set value "Needs Review"
 *   - Highlight row light yellow (#FFFF99)
 */

import { ExtractedData, ValidationResult, ExcelWriteOptions } from "./types";

// Default highlight color for rows needing review (light yellow)
const DEFAULT_HIGHLIGHT_COLOR = "#FFFF99";

/**
 * Write extracted data to Excel table with validation status
 * 
 * @param dataRows - Array of extracted data objects
 * @param validations - Corresponding validation results
 * @param options - Write options (highlighting, status column, etc.)
 */
export async function writeToExcel(
  dataRows: ExtractedData[],
  validations?: ValidationResult[],
  options?: ExcelWriteOptions
): Promise<void> {
  // Use default highlight color if not specified
  const writeOptions: ExcelWriteOptions = {
    highlightColor: options?.highlightColor || DEFAULT_HIGHLIGHT_COLOR,
    addStatusColumn: options?.addStatusColumn ?? true,
    skipInvalid: options?.skipInvalid ?? false,
    tableName: options?.tableName,
  };
  
  return new Promise((resolve, reject) => {
    Excel.run(async (context) => {
      try {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        
        // Try to get existing table
        const tables = sheet.tables;
        tables.load("items");
        await context.sync();
        
        let table: Excel.Table;
        let headers: string[];
        
        if (tables.items.length > 0) {
          // Use existing table
          table = tables.items[0];
          const headerRange = table.getHeaderRowRange();
          headerRange.load("values");
          await context.sync();
          headers = headerRange.values[0].map((h: any) => String(h).trim());
        } else {
          // Create new table from data headers
          headers = Object.keys(dataRows[0] || {});
          if (headers.length === 0) {
            reject(new Error("No data to write"));
            return;
          }
          
          const headerRange = sheet.getRange(`A1:${getColumnLetter(headers.length)}1`);
          headerRange.values = [headers];
          table = sheet.tables.add(headerRange, true);
          table.name = "ExtractedDataTable";
          await context.sync();
        }
        
        // Add Status column if needed and not present
        if (writeOptions.addStatusColumn && !headers.includes("Status")) {
          table.columns.add(-1, [["Status"]]);
          await context.sync();
          headers.push("Status");
        }
        
        // Map data to table columns
        const mappedRows = mapDataToColumns(dataRows, headers, validations, writeOptions);
        
        // Add rows to table
        for (let i = 0; i < mappedRows.length; i++) {
          const row = mappedRows[i];
          table.rows.add(-1, [row.values]);
          
          // Highlight row if needs review (light yellow by default)
          if (row.needsReview && writeOptions.highlightColor) {
            await context.sync();
            const addedRow = table.rows.getItemAt(table.rows.items.length - 1);
            addedRow.load("index");
            await context.sync();
            
            const rowRange = sheet.getRangeByIndexes(
              addedRow.index,
              0,
              1,
              headers.length
            );
            rowRange.format.fill.color = writeOptions.highlightColor;
          }
        }
        
        await context.sync();
        resolve();
      } catch (error) {
        reject(new Error(`Failed to write to Excel: ${error instanceof Error ? error.message : String(error)}`));
      }
    }).catch((error) => {
      reject(new Error(`Excel.run failed: ${error instanceof Error ? error.message : String(error)}`));
    });
  });
}

/**
 * Map extracted data to table columns with case-insensitive matching
 * Status column shows "Needs Review" for flagged rows, "OK" otherwise
 * 
 * @param dataRows - Array of data objects
 * @param headers - Table header names
 * @param validations - Validation results
 * @param options - Write options
 * @returns Mapped rows with values and flags
 */
function mapDataToColumns(
  dataRows: ExtractedData[],
  headers: string[],
  validations?: ValidationResult[],
  options?: ExcelWriteOptions
): Array<{ values: any[]; needsReview: boolean }> {
  return dataRows.map((data, index) => {
    const values: any[] = [];
    const validation = validations?.[index];
    const needsReview = validation?.needsReview || false;
    
    // Map each header to corresponding data field (case-insensitive)
    headers.forEach((header) => {
      if (header === "Status" && options?.addStatusColumn) {
        values.push(needsReview ? "Needs Review" : "OK");
      } else {
        const value = findFieldCaseInsensitive(data, header);
        values.push(value !== null && value !== undefined ? value : "");
      }
    });
    
    return { values, needsReview };
  });
}

/**
 * Find field value with case-insensitive matching
 * @param data - Data object
 * @param fieldName - Field name to find
 * @returns Field value or null
 */
function findFieldCaseInsensitive(data: ExtractedData, fieldName: string): any {
  // Try exact match first
  if (fieldName in data) {
    return data[fieldName];
  }
  
  // Try case-insensitive match
  const normalizedField = fieldName.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const [key, value] of Object.entries(data)) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normalizedKey === normalizedField) {
      return value;
    }
  }
  
  return null;
}

/**
 * Write single row to Excel
 * @param data - Data object for single row
 * @param validation - Optional validation result
 * @param options - Write options
 */
export async function writeSingleRow(
  data: ExtractedData,
  validation?: ValidationResult,
  options?: ExcelWriteOptions
): Promise<void> {
  return writeToExcel([data], validation ? [validation] : undefined, options);
}

/**
 * Update existing row in Excel
 * @param rowIndex - Index of row to update (0-based for data rows, not including header)
 * @param data - New data for the row
 * @param validation - Optional validation result
 * @param options - Write options
 */
export async function updateRow(
  rowIndex: number,
  data: ExtractedData,
  validation?: ValidationResult,
  options?: ExcelWriteOptions
): Promise<void> {
  return new Promise((resolve, reject) => {
    Excel.run(async (context) => {
      try {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const tables = sheet.tables;
        tables.load("items");
        await context.sync();
        
        if (tables.items.length === 0) {
          reject(new Error("No table found"));
          return;
        }
        
        const table = tables.items[0];
        const headerRange = table.getHeaderRowRange();
        headerRange.load("values");
        await context.sync();
        
        const headers = headerRange.values[0].map((h: any) => String(h).trim());
        const mappedRow = mapDataToColumns([data], headers, validation ? [validation] : undefined, options)[0];
        
        // Update row values
        const targetRow = table.rows.getItemAt(rowIndex);
        targetRow.load("values");
        await context.sync();
        
        targetRow.values = [mappedRow.values];
        
        // Update highlighting
        if (mappedRow.needsReview && options?.highlightColor) {
          targetRow.load("index");
          await context.sync();
          
          const rowRange = sheet.getRangeByIndexes(
            targetRow.index,
            0,
            1,
            headers.length
          );
          rowRange.format.fill.color = options.highlightColor;
        }
        
        await context.sync();
        resolve();
      } catch (error) {
        reject(new Error(`Failed to update row: ${error instanceof Error ? error.message : String(error)}`));
      }
    }).catch((error) => {
      reject(new Error(`Excel.run failed: ${error instanceof Error ? error.message : String(error)}`));
    });
  });
}

/**
 * Clear all data rows (keep headers)
 */
export async function clearDataRows(): Promise<void> {
  return new Promise((resolve, reject) => {
    Excel.run(async (context) => {
      try {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const tables = sheet.tables;
        tables.load("items");
        await context.sync();
        
        if (tables.items.length > 0) {
          const table = tables.items[0];
          const dataRange = table.getDataBodyRange();
          dataRange.delete("Up");
          await context.sync();
        }
        
        resolve();
      } catch (error) {
        reject(new Error(`Failed to clear rows: ${error instanceof Error ? error.message : String(error)}`));
      }
    }).catch((error) => {
      reject(new Error(`Excel.run failed: ${error instanceof Error ? error.message : String(error)}`));
    });
  });
}

/**
 * Highlight rows that need review with light yellow background
 * @param rowIndices - Array of row indices to highlight
 * @param color - Highlight color (default: #FFFF99 light yellow)
 */
export async function highlightRows(rowIndices: number[], color: string = DEFAULT_HIGHLIGHT_COLOR): Promise<void> {
  return new Promise((resolve, reject) => {
    Excel.run(async (context) => {
      try {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const tables = sheet.tables;
        tables.load("items");
        await context.sync();
        
        if (tables.items.length === 0) {
          reject(new Error("No table found"));
          return;
        }
        
        const table = tables.items[0];
        const headerRange = table.getHeaderRowRange();
        headerRange.load("columnCount");
        await context.sync();
        
        const columnCount = headerRange.columnCount;
        
        for (const rowIndex of rowIndices) {
          const row = table.rows.getItemAt(rowIndex);
          row.load("index");
          await context.sync();
          
          const rowRange = sheet.getRangeByIndexes(row.index, 0, 1, columnCount);
          rowRange.format.fill.color = color;
        }
        
        await context.sync();
        resolve();
      } catch (error) {
        reject(new Error(`Failed to highlight rows: ${error instanceof Error ? error.message : String(error)}`));
      }
    }).catch((error) => {
      reject(new Error(`Excel.run failed: ${error instanceof Error ? error.message : String(error)}`));
    });
  });
}

/**
 * Add or update Status column values
 * @param statuses - Array of status values for each row
 */
export async function updateStatusColumn(statuses: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    Excel.run(async (context) => {
      try {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const tables = sheet.tables;
        tables.load("items");
        await context.sync();
        
        if (tables.items.length === 0) {
          reject(new Error("No table found"));
          return;
        }
        
        const table = tables.items[0];
        const headerRange = table.getHeaderRowRange();
        headerRange.load("values");
        await context.sync();
        
        const headers = headerRange.values[0].map((h: any) => String(h).trim());
        let statusColumnIndex = headers.findIndex(h => h.toLowerCase() === "status");
        
        // Add Status column if it doesn't exist
        if (statusColumnIndex === -1) {
          table.columns.add(-1, [["Status"]]);
          await context.sync();
          statusColumnIndex = headers.length;
        }
        
        // Update status values
        for (let i = 0; i < statuses.length; i++) {
          const row = table.rows.getItemAt(i);
          const cell = row.getRange().getCell(0, statusColumnIndex);
          cell.values = [[statuses[i]]];
        }
        
        await context.sync();
        resolve();
      } catch (error) {
        reject(new Error(`Failed to update status column: ${error instanceof Error ? error.message : String(error)}`));
      }
    }).catch((error) => {
      reject(new Error(`Excel.run failed: ${error instanceof Error ? error.message : String(error)}`));
    });
  });
}

/**
 * Get row count (excluding header)
 */
export async function getRowCount(): Promise<number> {
  return new Promise((resolve, reject) => {
    Excel.run(async (context) => {
      try {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const tables = sheet.tables;
        tables.load("items");
        await context.sync();
        
        if (tables.items.length === 0) {
          resolve(0);
          return;
        }
        
        const table = tables.items[0];
        const dataRange = table.getDataBodyRange();
        dataRange.load("rowCount");
        await context.sync();
        
        resolve(dataRange.rowCount);
      } catch (error) {
        // If no data body, return 0
        resolve(0);
      }
    }).catch(() => {
      resolve(0);
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
 * Format table with professional styling
 */
export async function formatTable(): Promise<void> {
  return new Promise((resolve, reject) => {
    Excel.run(async (context) => {
      try {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const tables = sheet.tables;
        tables.load("items");
        await context.sync();
        
        if (tables.items.length === 0) {
          reject(new Error("No table found"));
          return;
        }
        
        const table = tables.items[0];
        
        // Apply table style
        table.style = "TableStyleMedium2";
        table.showFilterButton = true;
        
        // Auto-fit columns
        const range = table.getRange();
        range.format.autofitColumns();
        range.format.autofitRows();
        
        await context.sync();
        resolve();
      } catch (error) {
        reject(new Error(`Failed to format table: ${error instanceof Error ? error.message : String(error)}`));
      }
    }).catch((error) => {
      reject(new Error(`Excel.run failed: ${error instanceof Error ? error.message : String(error)}`));
    });
  });
}
