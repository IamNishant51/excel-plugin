/**
 * Document Extractor Service
 * Schema-aware extraction from PDFs/CVs that only extracts data for specified columns.
 * NO HALLUCINATION - if data doesn't exist, leave it blank.
 */

export interface ExtractionSchema {
  columns: string[];
  strict: boolean; // If true, only extract these columns. If false, suggest additional columns.
}

export interface ExtractedRow {
  [key: string]: string;
}

export interface ExtractionResult {
  success: boolean;
  data: ExtractedRow[];
  warnings: string[];
  unmappedFields: string[];
}

/**
 * Get the schema-aware extraction prompt
 */
export function getSchemaExtractionPrompt(schema: ExtractionSchema): string {
  const columnList = schema.columns.map((c, i) => `${i + 1}. "${c}"`).join("\n");
  
  return `You are a PRECISION DATA EXTRACTOR. Your job is to extract information from documents with ZERO hallucination.

═══════════════════════════════════════════════════════════════════════════════
CRITICAL RULES — MEMORIZE THESE:
═══════════════════════════════════════════════════════════════════════════════

1. **SCHEMA LOCKED**: The user has predefined these columns in Excel. You MUST ONLY extract data for these columns:
${columnList}

2. **NO FABRICATION**: If a piece of information is NOT explicitly present in the document, return an EMPTY STRING (""). Do NOT guess, infer, or make up data.

3. **EXACT MATCHING**: 
   - "Name" → Look for full name (first + last)
   - "Email" → Look for @email patterns
   - "Phone" / "Mobile" / "Contact" → Look for phone numbers
   - "Age" → Look for age OR calculate from DOB if present
   - "Address" → Full address if available
   - "Skills" → Technical skills, languages, tools
   - "Experience" → Years or job titles
   - "Education" → Degrees, institutions
   - "LinkedIn" → LinkedIn URLs only

4. **DATA CLEANING**:
   - Names: Proper Case (John Smith, not JOHN SMITH)
   - Phones: Keep original format or standardize to +1-XXX-XXX-XXXX
   - Emails: Lowercase
   - Dates: Keep as found (Jan 2020 - Dec 2022)

5. **ONE ROW PER DOCUMENT**: Each uploaded PDF/image represents ONE candidate/record. Output exactly one row of data per document.

═══════════════════════════════════════════════════════════════════════════════
OUTPUT FORMAT:
═══════════════════════════════════════════════════════════════════════════════

Return a JSON array of objects. Each object has keys matching the column names EXACTLY.

Example for columns ["Name", "Email", "Phone", "Skills"]:
[
  {"Name": "John Smith", "Email": "john@email.com", "Phone": "+1-555-123-4567", "Skills": "Python, Excel, SQL"},
  {"Name": "Jane Doe", "Email": "jane.doe@company.com", "Phone": "", "Skills": "JavaScript, React"}
]

Note: Jane Doe had no phone number visible in her resume, so it's left as "".

═══════════════════════════════════════════════════════════════════════════════
WHAT NOT TO DO:
═══════════════════════════════════════════════════════════════════════════════

❌ Do NOT add columns that aren't in the schema
❌ Do NOT guess email addresses (e.g., firstname.lastname@company.com)
❌ Do NOT fabricate phone numbers
❌ Do NOT hallucinate skills or experience not mentioned
❌ Do NOT include "N/A", "Not Found", "Unknown" — use "" instead
❌ Do NOT include markdown formatting — ONLY raw JSON

═══════════════════════════════════════════════════════════════════════════════
NOW EXTRACT FROM THE ATTACHED DOCUMENTS:
═══════════════════════════════════════════════════════════════════════════════
`;
}

/**
 * Generate Excel code that writes extracted data to the sheet
 */
export function generateExcelCode(columns: string[], data: ExtractedRow[]): string {
  // Serialize data for JS injection
  const serializedData = JSON.stringify(data, null, 2);
  const serializedColumns = JSON.stringify(columns);

  return `
// ─── Schema-Aware Resume Extraction ───
// Columns: ${columns.join(", ")}
// Records: ${data.length}

function writeData(sheet, startCell, data) {
    if (!data || data.length === 0) return null;
    const rows = data.length;
    const cols = Math.max(...data.map(r => r ? r.length : 0)); 
    if (cols === 0) return null;
    const normalized = data.map(r => {
        const row = r ? [...r] : [];
        while (row.length < cols) row.push("");
        return row;
    });
    try {
        const range = sheet.getRange(startCell).getResizedRange(rows - 1, cols - 1);
        range.values = normalized;
        range.format.font.name = "Segoe UI";
        range.format.font.size = 10;
        range.format.verticalAlignment = "Center";
        range.format.autofitColumns();
        return range;
    } catch (e) {
        console.error("writeData error:", e);
        return null;
    }
}

// Extracted Data
const columns = ${serializedColumns};
const extractedData = ${serializedData};

// Check if headers exist (row 1)
const headerRange = sheet.getRange("A1").getResizedRange(0, columns.length - 1);
headerRange.load("values");
await context.sync();

const existingHeaders = headerRange.values[0];
const hasHeaders = existingHeaders.some(h => h && h.toString().trim() !== "");

let startRow = 2; // Default: after headers

if (!hasHeaders) {
    // No headers — write them first
    const headerData = [columns];
    const headerWriteRange = writeData(sheet, "A1", headerData);
    if (headerWriteRange) {
        headerWriteRange.format.font.bold = true;
        headerWriteRange.format.fill.color = "#2D6A4F";
        headerWriteRange.format.font.color = "#FFFFFF";
        headerWriteRange.format.rowHeight = 28;
    }
} else {
    // Headers exist — find the last row with data
    const usedRange = sheet.getUsedRange();
    usedRange.load("rowCount");
    await context.sync();
    startRow = usedRange.rowCount + 1;
}

// Convert extracted objects to 2D array matching column order
const dataRows = extractedData.map(record => {
    return columns.map(col => {
        const value = record[col];
        return value !== undefined && value !== null ? String(value) : "";
    });
});

if (dataRows.length > 0) {
    const dataRange = writeData(sheet, "A" + startRow, dataRows);
    
    if (dataRange) {
        // Apply alternating row colors
        for (let i = 0; i < dataRows.length; i++) {
            const row = dataRange.getRow(i);
            if (i % 2 === 0) {
                row.format.fill.color = "#F0FAF5";
            }
        }
        
        // Apply borders
        const borderStyle = "Thin";
        dataRange.format.borders.getItem("InsideHorizontal").style = borderStyle;
        dataRange.format.borders.getItem("InsideVertical").style = borderStyle;
        dataRange.format.borders.getItem("EdgeTop").style = borderStyle;
        dataRange.format.borders.getItem("EdgeBottom").style = borderStyle;
        dataRange.format.borders.getItem("EdgeLeft").style = borderStyle;
        dataRange.format.borders.getItem("EdgeRight").style = borderStyle;
    }
}

// Final autofit
sheet.getUsedRange().format.autofitColumns();
`;
}

/**
 * Parse LLM response to extract JSON data
 */
export function parseExtractionResponse(response: string): ExtractedRow[] {
  // Clean the response - remove markdown code blocks
  let cleaned = response.trim();
  cleaned = cleaned.replace(/^```json?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");
  cleaned = cleaned.trim();
  
  // Try to find JSON array in the response
  const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.warn("No JSON array found in response:", cleaned.substring(0, 200));
    return [];
  }
  
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) {
      console.warn("Parsed result is not an array");
      return [];
    }
    return parsed as ExtractedRow[];
  } catch (e) {
    console.error("JSON parse error:", e);
    return [];
  }
}

/**
 * Validate extracted data against schema
 */
export function validateExtraction(data: ExtractedRow[], schema: ExtractionSchema): ExtractionResult {
  const warnings: string[] = [];
  const unmappedFields: string[] = [];
  
  // Check each row for unmapped fields
  data.forEach((row, index) => {
    Object.keys(row).forEach(key => {
      if (!schema.columns.includes(key) && !unmappedFields.includes(key)) {
        unmappedFields.push(key);
      }
    });
    
    // Check for empty required fields
    schema.columns.forEach(col => {
      if (!row[col] || row[col].toString().trim() === "") {
        warnings.push(`Row ${index + 1}: "${col}" is empty`);
      }
    });
  });
  
  if (unmappedFields.length > 0) {
    warnings.push(`Found data for columns not in schema: ${unmappedFields.join(", ")}`);
  }
  
  return {
    success: data.length > 0,
    data,
    warnings,
    unmappedFields
  };
}

/**
 * Common column name mappings for intelligent matching
 */
export const COLUMN_ALIASES: Record<string, string[]> = {
  "Name": ["Full Name", "Candidate Name", "Applicant Name", "First Name", "First", "Naam"],
  "Email": ["E-mail", "Email Address", "E-Mail", "Mail", "Contact Email"],
  "Phone": ["Mobile", "Mobile No", "Mobile Number", "Contact", "Contact No", "Phone Number", "Tel", "Telephone"],
  "Age": ["Years", "DOB", "Date of Birth", "Birth Date"],
  "Address": ["Location", "City", "Current Location", "Residence"],
  "Skills": ["Technical Skills", "Key Skills", "Skillset", "Expertise", "Technologies"],
  "Experience": ["Work Experience", "Total Experience", "Years of Experience", "Professional Experience"],
  "Education": ["Qualification", "Degree", "Academic", "Educational Qualification"],
  "LinkedIn": ["LinkedIn URL", "LinkedIn Profile", "Profile URL"],
  "Company": ["Current Company", "Organization", "Employer", "Current Employer"],
  "Position": ["Role", "Job Title", "Designation", "Current Role", "Title"],
  "Summary": ["Profile Summary", "About", "Objective", "Career Objective"],
};

/**
 * Normalize column name to standard form
 */
export function normalizeColumnName(columnName: string): string {
  const normalized = columnName.trim();
  
  // Check direct match first
  if (COLUMN_ALIASES[normalized]) {
    return normalized;
  }
  
  // Check aliases
  for (const [standard, aliases] of Object.entries(COLUMN_ALIASES)) {
    if (aliases.some(alias => alias.toLowerCase() === normalized.toLowerCase())) {
      return standard;
    }
  }
  
  return normalized;
}

/**
 * Build extraction prompt with column aliases for better matching
 */
export function buildEnhancedPrompt(columns: string[]): string {
  const columnDetails = columns.map(col => {
    const aliases = COLUMN_ALIASES[col] || [];
    const aliasHint = aliases.length > 0 ? ` (also look for: ${aliases.slice(0, 3).join(", ")})` : "";
    return `• "${col}"${aliasHint}`;
  }).join("\n");
  
  return `
COLUMNS TO EXTRACT:
${columnDetails}

Remember: If you cannot find data for a column, return "". Never guess or fabricate.
`;
}