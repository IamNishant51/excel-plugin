/* global console, Excel, document, window, Office */
import "./taskpane.css";
import { callLLM, getConfig, saveConfig, fetchOllamaModels, GROQ_MODELS, LLMConfig } from "../services/llm.service";
import { SYSTEM_PROMPT } from "../services/prompt";
import { CHAT_PROMPT } from "../services/chat-prompt";
import { getCachedResponse, cacheResponse } from "../services/cache";
import { getSchemaExtractionPrompt, parseExtractionResponse, generateExcelCode, buildEnhancedPrompt, normalizeColumnName } from "../services/document-extractor";
import {
  runAgent,
  validateCode,
  executeWithRecovery,
  readSheetContext,
  SheetContext
} from "../services/agent-orchestrator";
import * as pdfjsLib from 'pdfjs-dist';
import { Icons } from "../services/icons";

// Worker setup for PDF.js
try {
  // @ts-ignore
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
} catch (e) {
  console.warn("PDF Worker setup failed:", e);
}

// ─── Types ─────────────────────────────────────────────────────
type Mode = "planning" | "agent";
type ActionCategory = "cleanup" | "formulas" | "format" | "reports" | "templates" | "analysis" | "extract" | "smart";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

// ─── State ─────────────────────────────────────────────────────
let currentMode: Mode = "planning";
let currentCategory: ActionCategory = "cleanup";
let schemaExtractionMode: boolean = false; // When true, use column headers from Excel
const chatHistory: ChatMessage[] = [];
let chatConversation: { role: "system" | "user" | "assistant"; content: string }[] = [];
let isChatBusy = false;
let attachedFiles: { name: string; type: "image" | "pdf"; data: string[] }[] = []; // Array of attached files
let chatAbortController: AbortController | null = null;
let agentAbortController: AbortController | null = null;

// ─── Quick Actions by Category ─────────────────────────────────
const CATEGORIZED_ACTIONS: Record<ActionCategory, { icon: string; label: string; prompt: string }[]> = {

  // ── Data Cleanup ──
  cleanup: [
    { icon: "eraser", label: "Smart Clean 🧹", prompt: "Analyze the used range. Perform 'Smart Cleaning': (1) Trim all whitespace. (2) Convert text-numbers to real numbers. (3) Standardize dates to Short Date format. (4) Remove completely empty rows. (5) Remove duplicate rows. (6) Convert text columns to Proper Case. Write a summary of changes in a new cell comment." },
    { icon: "eraser", label: "Remove Duplicates", prompt: "Find and remove duplicate rows from the data, keeping the first occurrence of each." },
    { icon: "eraser", label: "Trim Spaces", prompt: "Trim all leading and trailing whitespace from every cell in the used range." },
    { icon: "eraser", label: "Fix Empty Rows", prompt: "Find and delete all completely empty rows within the used data range." },
    { icon: "search", label: "Find Blanks", prompt: "Highlight all blank cells in the used range with a light yellow background color (#FFF3CD)." },
    { icon: "hash", label: "Fix Number Format", prompt: "Detect columns with numbers stored as text and convert them back to proper numbers." },
    { icon: "eraser", label: "Standardize Case", prompt: "Convert all text in column A to proper case (first letter capitalized, rest lowercase)." },
    { icon: "eraser", label: "Clear Formatting", prompt: "Clear all formatting from the used range while keeping data, then auto-fit all columns." },
    { icon: "copy", label: "Split Column", prompt: "Split the data in column A by comma delimiter into separate columns B, C, D." },
    { icon: "eraser", label: "Remove Hyperlinks", prompt: "Find all cells in the used range. Remove all hyperlinks while keeping the cell values. Set the font color of all cells to black and remove any underlines to ensure a consistent, professional appearance." },
  ],

  // ── Natural Language Formula Generator ──
  formulas: [
    { icon: "formula", label: "Formula Doctor 🚑", prompt: "Analyze the active cell/formula. (1) Explain the logic in a cell note. (2) If there is an error (#VALUE, #REF), FIX it and explain the fix. (3) If it's a value, suggest a formula. Expertly debug." },
    { icon: "formula", label: "Auto SUM", prompt: "Add a SUM formula at the bottom of each numeric column with a bold TOTAL label in column A." },
    { icon: "formula", label: "AVERAGE Row", prompt: "Add an AVERAGE formula at the bottom of each numeric column with a bold AVERAGE label." },
    { icon: "formula", label: "COUNT & COUNTA", prompt: "Add COUNT and COUNTA formulas at the bottom to count numeric and non-empty cells in each column." },
    { icon: "formula", label: "VLOOKUP Setup", prompt: "Analyze the data and set up a VLOOKUP section: create a lookup area to the right of the data where user can type a search value in one cell, and VLOOKUP automatically returns matching data from the table. Add labels and formatting to make it clear how to use it." },
    { icon: "formula", label: "SUMIF by Category", prompt: "Detect the category column (text) and numeric columns in the data. Create a summary section below the data that uses SUMIF to total each unique category. Add labels, formatting, and a bold grand total row." },
    { icon: "formula", label: "IF Conditional", prompt: "Add a new Status column at the end of the data. Use an IF formula to classify each row: if the last numeric column value is above the average, mark it 'Above Average', otherwise 'Below Average'. Format green for above, red for below." },
    { icon: "trendUp", label: "Running Total", prompt: "Add a 'Running Total' column at the end of the data that calculates a cumulative sum of the main numeric column, row by row. Format it with a subtle blue background and number format with commas." },
    { icon: "sortAsc", label: "Rank Values", prompt: "Add a 'Rank' column at the end of the data that ranks each row by the primary numeric column (largest = rank 1). Highlight the top 3 with gold/green backgrounds. Auto-fit all columns." },
  ],

  // ── Smart Formatter (Canva for Excel) ──
  format: [
    {
      icon: "paintbrush", label: "Make Professional", prompt: `Apply professional formatting to the sheet. Use this EXACT safe pattern:

// Step 1: Get used range and load properties
const usedRange = sheet.getUsedRange();
usedRange.load("values,rowCount,columnCount,address");
await context.sync();

// Step 2: Check if sheet has data
if (!usedRange || usedRange.rowCount < 1 || usedRange.columnCount < 1) {
  throw new Error("Sheet appears empty. Add some data first.");
}

const rowCount = usedRange.rowCount;
const colCount = usedRange.columnCount;

// Step 3: Format header row (row 1)
const headerRow = usedRange.getRow(0);
headerRow.format.set({
  font: { bold: true, size: 11, color: "#FFFFFF" },
  fill: { color: "#1B2A4A" },
  horizontalAlignment: "Center",
  verticalAlignment: "Center",
  rowHeight: 28
});

// Step 4: Format data rows with alternating colors
for (let i = 1; i < rowCount; i++) {
  const row = usedRange.getRow(i);
  row.format.set({
    fill: { color: i % 2 === 0 ? "#F4F5F7" : "#FFFFFF" },
    rowHeight: 22
  });
}

// Step 5: Add borders and freeze pane
usedRange.format.borders.getItem("InsideHorizontal").style = "Thin";
usedRange.format.borders.getItem("InsideVertical").style = "Thin";
usedRange.format.borders.getItem("EdgeTop").style = "Thin";
usedRange.format.borders.getItem("EdgeBottom").style = "Thin";
usedRange.format.borders.getItem("EdgeLeft").style = "Thin";
usedRange.format.borders.getItem("EdgeRight").style = "Thin";

headerRow.format.borders.getItem("EdgeBottom").style = "Medium";
headerRow.format.borders.getItem("EdgeBottom").color = "#1B2A4A";

sheet.freezePanes.freezeRows(1);
usedRange.format.autofitColumns();
await context.sync();` },
    {
      icon: "paintbrush", label: "Executive Style", prompt: `Apply executive presentation style using this EXACT safe pattern:

const usedRange = sheet.getUsedRange();
usedRange.load("values,rowCount,columnCount");
await context.sync();

if (!usedRange || usedRange.rowCount < 1) {
  throw new Error("Sheet appears empty.");
}

const rowCount = usedRange.rowCount;

// Header styling
const headerRow = usedRange.getRow(0);
headerRow.format.font.bold = true;
headerRow.format.font.size = 11;
headerRow.format.font.color = "#FFFFFF";
headerRow.format.fill.color = "#34495E";
headerRow.format.horizontalAlignment = "Center";
headerRow.format.rowHeight = 30;

// Data rows with subtle alternating
for (let i = 1; i < rowCount; i++) {
  const row = usedRange.getRow(i);
  row.format.fill.color = i % 2 === 0 ? "#F8F9FA" : "#FFFFFF";
  row.format.rowHeight = 22;
}

// Light gray borders
usedRange.format.borders.getItem("InsideHorizontal").style = "Thin";
usedRange.format.borders.getItem("InsideHorizontal").color = "#DEE2E6";
usedRange.format.borders.getItem("InsideVertical").style = "Thin";
usedRange.format.borders.getItem("InsideVertical").color = "#DEE2E6";
usedRange.format.borders.getItem("EdgeTop").style = "Thin";
usedRange.format.borders.getItem("EdgeBottom").style = "Thin";
usedRange.format.borders.getItem("EdgeLeft").style = "Thin";
usedRange.format.borders.getItem("EdgeRight").style = "Thin";

// Freeze header
sheet.freezePanes.freezeRows(1);
usedRange.format.autofitColumns();
await context.sync();` },
    {
      icon: "paintbrush", label: "Minimal Clean", prompt: `Apply minimal modern formatting:

const usedRange = sheet.getUsedRange();
usedRange.load("rowCount,columnCount");
await context.sync();

if (!usedRange || usedRange.rowCount < 1) {
  throw new Error("Sheet appears empty.");
}

// Clear existing formatting
usedRange.format.fill.clear();
usedRange.format.borders.getItem("InsideHorizontal").style = "None";
usedRange.format.borders.getItem("InsideVertical").style = "None";
usedRange.format.borders.getItem("EdgeTop").style = "None";
usedRange.format.borders.getItem("EdgeBottom").style = "None";
usedRange.format.borders.getItem("EdgeLeft").style = "None";
usedRange.format.borders.getItem("EdgeRight").style = "None";

// Header: bold, dark text, bottom border only
const headerRow = usedRange.getRow(0);
headerRow.format.font.bold = true;
headerRow.format.font.size = 11;
headerRow.format.font.color = "#111827";
headerRow.format.borders.getItem("EdgeBottom").style = "Thin";
headerRow.format.borders.getItem("EdgeBottom").color = "#D1D5DB";
headerRow.format.rowHeight = 28;

// Data rows: smaller font, gray text
for (let i = 1; i < usedRange.rowCount; i++) {
  const row = usedRange.getRow(i);
  row.format.font.size = 10;
  row.format.font.color = "#374151";
  row.format.rowHeight = 22;
}

usedRange.format.autofitColumns();
await context.sync();` },
    {
      icon: "paintbrush", label: "Dark Theme", prompt: `Apply dark theme formatting:

const usedRange = sheet.getUsedRange();
usedRange.load("rowCount,columnCount");
await context.sync();

if (!usedRange || usedRange.rowCount < 1) {
  throw new Error("Sheet appears empty.");
}

const rowCount = usedRange.rowCount;

// All cells: dark background, light text
usedRange.format.fill.color = "#1E1E1E";
usedRange.format.font.color = "#CCCCCC";

// Header: gold text
const headerRow = usedRange.getRow(0);
headerRow.format.fill.color = "#2D2D2D";
headerRow.format.font.bold = true;
headerRow.format.font.color = "#F0C75E";
headerRow.format.rowHeight = 28;

// Alternating dark rows
for (let i = 1; i < rowCount; i++) {
  const row = usedRange.getRow(i);
  row.format.fill.color = i % 2 === 0 ? "#252525" : "#1E1E1E";
}

// Dark borders
usedRange.format.borders.getItem("InsideHorizontal").style = "Thin";
usedRange.format.borders.getItem("InsideHorizontal").color = "#3A3A3A";
usedRange.format.borders.getItem("InsideVertical").style = "Thin";
usedRange.format.borders.getItem("InsideVertical").color = "#3A3A3A";
usedRange.format.borders.getItem("EdgeTop").style = "Thin";
usedRange.format.borders.getItem("EdgeBottom").style = "Thin";
usedRange.format.borders.getItem("EdgeLeft").style = "Thin";
usedRange.format.borders.getItem("EdgeRight").style = "Thin";

usedRange.format.autofitColumns();
await context.sync();` },
    {
      icon: "paintbrush", label: "Colorful Teal", prompt: `Apply colorful teal formatting:

const usedRange = sheet.getUsedRange();
usedRange.load("rowCount");
await context.sync();

if (!usedRange || usedRange.rowCount < 1) {
  throw new Error("Sheet appears empty.");
}

// Header: teal background
const headerRow = usedRange.getRow(0);
headerRow.format.fill.color = "#0D7377";
headerRow.format.font.bold = true;
headerRow.format.font.color = "#FFFFFF";
headerRow.format.horizontalAlignment = "Center";
headerRow.format.rowHeight = 28;

// Alternating light teal and white
for (let i = 1; i < usedRange.rowCount; i++) {
  const row = usedRange.getRow(i);
  row.format.fill.color = i % 2 === 0 ? "#E8F6F3" : "#FFFFFF";
}

// Thin borders
usedRange.format.borders.getItem("InsideHorizontal").style = "Thin";
usedRange.format.borders.getItem("InsideVertical").style = "Thin";
usedRange.format.borders.getItem("EdgeTop").style = "Thin";
usedRange.format.borders.getItem("EdgeBottom").style = "Thin";
usedRange.format.borders.getItem("EdgeLeft").style = "Thin";
usedRange.format.borders.getItem("EdgeRight").style = "Thin";

sheet.freezePanes.freezeRows(1);
usedRange.format.autofitColumns();
await context.sync();` },
    {
      icon: "snowflake", label: "Freeze Header", prompt: `Freeze the first row:

sheet.freezePanes.freezeRows(1);
await context.sync();` },
    {
      icon: "table", label: "Excel Table", prompt: `Convert data to Excel Table:

const usedRange = sheet.getUsedRange();
usedRange.load("address");
await context.sync();

if (!usedRange) {
  throw new Error("No data found in sheet.");
}

const table = sheet.tables.add(usedRange, true);
table.style = "TableStyleMedium9";
usedRange.format.autofitColumns();
await context.sync();` },
    {
      icon: "paintbrush", label: "Borders All", prompt: `Add thin borders to all cells:

const usedRange = sheet.getUsedRange();
usedRange.format.borders.getItem("InsideHorizontal").style = "Thin";
usedRange.format.borders.getItem("InsideVertical").style = "Thin";
usedRange.format.borders.getItem("EdgeTop").style = "Thin";
usedRange.format.borders.getItem("EdgeBottom").style = "Thin";
usedRange.format.borders.getItem("EdgeLeft").style = "Thin";
usedRange.format.borders.getItem("EdgeRight").style = "Thin";
await context.sync();` },
    { icon: "hash", label: "Currency $", prompt: `Format numeric columns as currency. First read the data to detect numeric columns, then apply $#,##0.00 format.` },
    { icon: "hash", label: "Percentage %", prompt: `Format the last numeric column as percentage (0.00%) and auto-fit columns.` },
  ],

  // ── Report Automation Engine ──
  reports: [
    { icon: "barChart", label: "Instant Dashboard 📊", prompt: "Analyze the dataset. Create a new sheet 'Dashboard'. Generate 3 professional charts (Bar, Line, Pie) for key trends. Add 'Big Number' cards at top for Totals. Apply modern theme. Make it executive-ready." },
    { icon: "barChart", label: "Sales Report", prompt: "Generate a professional monthly sales report from the existing data. Do ALL of this: (1) Add a report title row at the top: 'Monthly Sales Report' in bold, font size 14, merged across all columns. (2) Add today's date below the title, right-aligned. (3) Format the data with professional headers (dark navy background, white bold text) and alternating row colors. (4) Add SUM, AVERAGE, MAX, and MIN summary rows at the bottom with labels. (5) Create a clustered column chart from the data showing performance by category. Position it below the summary. (6) Add thin borders throughout and auto-fit all columns." },
    { icon: "barChart", label: "Financial Summary", prompt: "Build a financial summary report from the data. (1) Add a 'Financial Summary' title merged at top, bold, font size 14. (2) Format headers professionally with dark green (#1B4D3E) background and white text. (3) Format all currency columns as $#,##0.00. (4) Add a TOTAL row with SUM formulas, bold, with a top border. (5) Add a 'Net' or 'Difference' calculation if applicable. (6) Apply conditional formatting: positive numbers in green, negative in red. (7) Create a pie chart showing the breakdown. (8) Auto-fit columns and freeze header row." },
    { icon: "trendUp", label: "Performance Review", prompt: "Create a team performance report from the data. (1) Add a 'Team Performance Report' title at top, merged, bold, font size 14. (2) Professional header formatting with indigo (#2B3A67) background, white text. (3) Add RANK column based on the primary numeric metric column. (4) Add conditional formatting: top 3 rows highlighted in light green (#E6F4EA), bottom 3 in light red (#FDE8E8). (5) Add AVERAGE, MAX, MIN summary rows at bottom. (6) Create a bar chart showing individual performance, sorted high to low. (7) Auto-fit and add borders." },
    { icon: "barChart", label: "Inventory Report", prompt: "Generate an inventory status report from the data. (1) Title: 'Inventory Status Report', merged, bold, size 14. (2) Professional formatting with teal (#0D7377) headers. (3) If there's a quantity column, add conditional formatting: red background for items ≤ 10 (low stock), yellow for 11-50 (medium), green for 50+ (healthy). (4) Add a status column with IF formula: 'Critical' for ≤ 10, 'Low' for 11-25, 'OK' for 26-50, 'Good' for 50+. (5) Add summary showing total items, total value (if price column exists), and count by status. (6) Create a pie chart showing stock level distribution." },
    { icon: "barChart", label: "Attendance Summary", prompt: "Generate an attendance summary report. (1) Title: 'Attendance Summary', merged, bold, size 14. (2) Count Present (P), Absent (A), Leave (L) for each person using COUNTIF. (3) Calculate attendance percentage. (4) Format: professional headers, alternating rows, percentage column formatted as percentage. (5) Conditional formatting on attendance %: green ≥ 90%, yellow 75-89%, red < 75%. (6) Add a column chart showing attendance by person. (7) Add class/team averages at bottom." },
    { icon: "fileTemplate", label: "Weekly Status", prompt: "Create a weekly status report template: (1) Title: 'Weekly Status Update — Week of [Date]', merged, bold. (2) Section 1: 'Completed This Week' — 5 rows with Task, Owner, Status columns. (3) Section 2: 'In Progress' — 5 rows with Task, Owner, % Complete, ETA columns. (4) Section 3: 'Blockers & Risks' — 3 rows with Issue, Impact, Action Needed columns. (5) Section 4: 'Next Week Plans' — 4 rows. (6) Format each section with colored headers (different subtle colors), thin borders, and auto-fit." },
  ],

  // ── Ready-Made Templates ──
  templates: [
    { icon: "fileTemplate", label: "Monthly Budget", prompt: "Create a monthly budget tracker with categories: Housing, Utilities, Food, Transport, Entertainment, Savings. Add columns for Budget, Actual, and Difference with SUM at bottom. Use professional formatting with green for under-budget and red for over-budget conditional formatting." },
    { icon: "fileTemplate", label: "Invoice", prompt: "Create a professional invoice template with: Company Name header, Invoice #, Date, Bill To section, items table with Description, Quantity, Unit Price, Total columns, Subtotal, Tax (10%), and Grand Total calculations. Apply clean formatting." },
    { icon: "fileTemplate", label: "Employee List", prompt: "Create an employee directory with 8 sample employees: Name, Department (HR/Engineering/Marketing/Sales), Email, Phone, Joining Date, Salary. Apply professional table formatting with alternating rows and currency format for salary." },
    { icon: "fileTemplate", label: "Project Tracker", prompt: "Create a project tracker with 6 sample tasks: Task Name, Assigned To, Priority (High/Medium/Low), Status (Not Started/In Progress/Complete), Start Date, Due Date. Add dropdown validation for Priority and Status. Use conditional formatting for status colors." },
    { icon: "fileTemplate", label: "Sales Dashboard", prompt: "Create a quarterly sales report with 5 products across Q1-Q4. Add Total column and row with SUM formulas. Create a column chart showing quarterly performance. Apply professional formatting." },
    { icon: "fileTemplate", label: "Attendance Sheet", prompt: "Create a monthly attendance sheet for 10 employees with dates as columns (1-31). Mark P for present, A for absent, L for leave. Add summary columns for Total Present, Absent, and Leave. Apply conditional formatting." },
    { icon: "fileTemplate", label: "Grade Book", prompt: "Create a student grade book for 8 students with 5 assignments, Midterm, Final, and Total/Grade columns. Add weighted average formulas and letter grade calculation (A/B/C/D/F). Apply professional formatting with conditional colors." },
    { icon: "fileTemplate", label: "Weekly Schedule", prompt: "Create a weekly schedule template with time slots from 8 AM to 6 PM (1-hour intervals) and columns for Mon-Fri. Add borders, colored header, and merge the title cell. Apply a clean, readable format." },
  ],

  // ── Advanced Analysis (Master Level) ──
  analysis: [
    { icon: "trendUp", label: "Pivot Analysis", prompt: "Create a new sheet named 'Pivot Analysis'. Select the entire current dataset. Insert a Pivot Table starting at A3. Automatically detect the categorical column for Rows and the numeric column for Values (Sum). Apply the 'PivotStyleMedium9' style." },
    { icon: "barChart", label: "Pareto Chart", prompt: "Create a Pareto analysis. (1) Copy the data to a new sheet 'Pareto'. (2) Sort by the numeric metric descending. (3) Calculate cumulative percentage. (4) Create a Pareto chart (combo chart: bars for values, line for cumulative %). Add data labels." },
    { icon: "search", label: "Find Outliers", prompt: "Analyze the numeric column. Calculate Mean and Standard Deviation. Highlight any cell that is more than 2 Standard Deviations away from the Mean in RED (#FFCCCC). Add a note to the cell 'Outlier'." },
    { icon: "sortAsc", label: "Correlation Matrix", prompt: "Analyze all numeric columns. Create a correlation matrix in a new sheet 'Correlations'. Calculate the correlation coefficient (CORREL) between every pair of numeric variables. Use Conditional Formatting (Color Scale) to highlight strong positive (green) and negative (red) correlations." },
    { icon: "calendar", label: "Date Intelligence", prompt: "Find the Date column. Insert 4 new columns to the right: Year, Quarter, Month Name, Week Number. Use formulas (=YEAR, =ROUNDUP(MONTH(.)/3,0), =TEXT(.,'mmmm'), =ISOWEEKNUM) to populate them for all rows. Copy and Paste Values to finalize." },
    { icon: "trendUp", label: "Forecast 12M", prompt: "Analyze the time-series data. Create a new sheet 'Forecast'. Use the FORECAST.ETS function to predict the next 12 months based on historical data. Create a Line Chart showing history (solid) and forecast (dotted) with confidence intervals." },
    { icon: "copy", label: "Transpose & Link", prompt: "Copy the selected table. Create a new sheet 'Transposed'. Paste the data linked/transposed (=TRANSPOSE(Original!Range)) so it updates automatically. Apply professional formatting." },
    { icon: "filter", label: "Advanced Filter", prompt: "Create a 'Search' area above the data. Set up a dynamic visual filter: when user types in cell B1, filter the main table rows where the text content contains that value (wildcard match). Use conditional formatting to hide non-matching rows if Filter function is not available." },
    { icon: "hash", label: "Frequency Dist", prompt: "Create a frequency distribution (histogram data) for the main numeric column. Create bins (groups) automatically. Count the frequency of items in each bin. Output a summary table and a Histogram chart in a new sheet." },
    { icon: "zap", label: "Regex Extract", prompt: "Analyze the text column. If it contains emails, extract them to a new column 'Email'. If it contains phone numbers, extract and format them. If it contains IDs (like #1234), extract them. Use Flash Fill logic or pattern matching formulas." },
  ],

  // ── Document Extraction (Resume/CV Import) ──
  extract: [
    { icon: "fileText", label: "📄 Import to Schema", prompt: "SCHEMA_EXTRACTION_MODE: Read the column headers in row 1 of the current sheet. For each attached PDF/resume, extract ONLY the data that matches those columns. If a column's data doesn't exist in the PDF, leave it blank. Append each candidate as a new row." },
    { icon: "users", label: "📋 Bulk Resume Import", prompt: "SCHEMA_EXTRACTION_MODE: Import all attached resumes/CVs. First read existing column headers. If no headers exist, create: Name, Email, Phone, Skills, Experience, Education. Extract data from each PDF and add one row per candidate. Never hallucinate — if data is missing, leave blank." },
    { icon: "fileTemplate", label: "📝 HR Database Setup", prompt: "Create a professional HR candidate database template with columns: Name, Email, Phone, LinkedIn, Current Company, Current Role, Skills, Years of Experience, Highest Education, Expected Salary, Notes. Apply formatting with filters and freeze header row." },
    { icon: "search", label: "🔍 Smart Extract", prompt: "SCHEMA_EXTRACTION_MODE: Intelligently analyze the attached documents. Read column headers from the sheet. Match document content to columns using smart aliases (e.g., 'Mobile No' matches 'Phone' column). Only extract what exists — no guessing." },
    { icon: "table", label: "📊 Create Schema First", prompt: "Before importing, set up your columns: Create header row with: Name, Email, Mobile No, Age, Address, Skills, Experience. Format as a proper table with filters. Now attach PDFs and click 'Import to Schema'." },
    { icon: "checkSquare", label: "✅ Validate & Clean", prompt: "Validate the extracted data: Check for blank required fields (Name, Email). Highlight rows with missing data in yellow. Add a 'Status' column marking 'Complete' or 'Incomplete' for each row." },
  ],

  // ── Smart Tools (Power User Headache Solvers) ──
  smart: [
    { icon: "brain", label: "Data Profiler 🔬", prompt: `Analyze the entire dataset and create a comprehensive Data Profile report on a NEW sheet called "Data Profile". For each column, calculate: (1) Column Name, (2) Data Type (text/number/date/mixed), (3) Total Count, (4) Blank Count, (5) Blank %, (6) Unique Values Count, (7) Most Common Value, (8) For numeric columns: Min, Max, Mean, Median. Create this as a formatted table with headers. Add a "Data Quality Score" at the top calculated as (100 - average blank %). Apply professional formatting: dark header row, alternating rows, conditional formatting on blank % (green < 5%, yellow 5-20%, red > 20%). Auto-fit all columns.` },
    {
      icon: "highlight", label: "Highlight Duplicates", prompt: `Find and highlight ALL duplicate values in the first data column (column A, excluding header).

const usedRange = sheet.getUsedRange();
usedRange.load("values,rowCount,columnCount");
await context.sync();

if (!usedRange || usedRange.rowCount < 2) throw new Error("Need at least 2 rows of data.");

const values = usedRange.values;
const col = 0; // Check column A
const seen = {};
const dupes = new Set();

// Pass 1: find duplicates
for (let i = 1; i < values.length; i++) {
  const val = String(values[i][col]).trim().toLowerCase();
  if (val === "") continue;
  if (seen[val] !== undefined) {
    dupes.add(val);
  }
  seen[val] = i;
}

// Pass 2: highlight them
let count = 0;
for (let i = 1; i < values.length; i++) {
  const val = String(values[i][col]).trim().toLowerCase();
  if (dupes.has(val)) {
    const cell = usedRange.getRow(i);
    cell.format.fill.color = "#FECACA";
    cell.format.font.color = "#991B1B";
    count++;
  }
}
await context.sync();
// Done: highlighted duplicates` },
    { icon: "columns", label: "Compare Columns", prompt: `Compare columns A and B to find differences. For each row, if A ≠ B, highlight both cells in light red (#FEE2E2). If they match, highlight in light green (#DCFCE7). Add a new column C with 'Match' or 'Mismatch' labels. Add a summary at the bottom showing total matches and mismatches. Format the summary row in bold.` },
    { icon: "formula", label: "Auto Summary Row ⚡", prompt: `Analyze ALL columns. For each NUMERIC column, add 4 summary rows at the bottom: SUM, AVERAGE, MIN, MAX — with formula labels in column A. Make the summary section visually distinct: add a thick top border, bold labels, and light blue (#EFF6FF) background. Format numbers with commas and 2 decimal places. Auto-fit all columns.` },
    { icon: "crosshair", label: "Top/Bottom 5 🎯", prompt: `Find the main numeric column in the data. Identify the Top 5 values and highlight their entire rows in green (#DCFCE7). Identify the Bottom 5 values and highlight their rows in red (#FEE2E2). Add a 'Rank' column at the end. Sort the data by the numeric column descending. Auto-fit columns.` },
    { icon: "mail", label: "Extract Emails & Phones", prompt: `Scan ALL cells in the used range. Extract any email addresses (containing @) and phone numbers (10+ digit patterns). Create a new sheet called "Contacts" with columns: Source Cell, Name (if adjacent), Email, Phone. Remove duplicates. Format as a professional table with filters. Auto-fit columns.` },
    { icon: "layers", label: "Unpivot Data", prompt: `Convert wide-format data to long format (unpivot). Take the first column as the ID column. Treat all remaining columns as value columns. Create a new sheet "Unpivoted" with 3 columns: the original ID, "Category" (original column header), and "Value" (the cell value). Skip blank values. Apply professional formatting.` },
    { icon: "shield", label: "Data Validation Rules", prompt: `Analyze column headers and add smart data validation rules. For columns that look like: (1) Email — add text validation requiring '@', (2) Phone — allow only numbers with length 10-15, (3) Date columns — add date validation, (4) Status/Type columns — create dropdown lists from unique existing values, (5) Numeric columns — add number validation (>= 0). Highlight validated columns with a subtle blue header to indicate protection is active.` },
    { icon: "dollarSign", label: "Number to Words 💰", prompt: `Add a new column next to the main numeric/currency column. For each row, convert the number to words in English (e.g., 1234 → "One Thousand Two Hundred Thirty Four"). This is useful for invoices and checks. Use a helper function that handles numbers up to 999,999,999. Format the words column with proper case and auto-fit.` },
    { icon: "copy", label: "Smart Merge Sheets", prompt: `Merge data from ALL worksheets in the workbook into a new sheet called "Merged Data". For each sheet: read the headers and data, align columns by header name (smart matching), and append all rows. Remove exact duplicate rows from the final merged data. Add a "Source Sheet" column to track where each row came from. Apply professional formatting with alternating rows.` },
  ],
};

// Chat Suggestions (shown on welcome screen)
const CHAT_SUGGESTIONS = [
  { icon: "brain", text: "Analyze my data and tell me what's interesting" },
  { icon: "formula", text: "Which formula should I use for my use case?" },
  { icon: "paintbrush", text: "Make my sheet look professional in one click" },
  { icon: "barChart", text: "Generate a monthly report with charts" },
  { icon: "search", text: "Find all duplicates and inconsistencies" },
  { icon: "sparkles", text: "What can you do? Show me your best features" },
];

// ─── Initialization ────────────────────────────────────────────
// ─── Global Error Handler ───
window.onerror = function (msg, url, line) {
  const statusEl = document.getElementById("loading-status");
  if (statusEl) {
    statusEl.innerHTML += `<br><span style="color:#d32f2f;font-weight:bold;font-size:11px;">${msg} (Line ${line})</span>`;
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
  }
  return false;
};

// ─── Initialization ────────────────────────────────────────────
Office.onReady((info) => {
  // Always show app to prevent hang
  const sideloadMsg = document.getElementById("sideload-msg");
  const appBody = document.getElementById("app-body");
  if (sideloadMsg) sideloadMsg.style.display = "none";
  if (appBody) appBody.style.display = "flex";

  if (info.host === Office.HostType.Excel) {
    console.log("Running in Excel");
  } else {
    console.warn("Running outside Excel");
  }

  // Inject Icons
  injectIcons();
  injectDocIcons();
  injectCategoryIcons();

  // Wire up UI Actions
  document.getElementById("run").onclick = runAICommand;

  // Settings & Docs Toggles
  document.getElementById("settings-toggle").onclick = () => {
    const panel = document.getElementById("settings-panel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    document.getElementById("docs-panel").style.display = "none";
  };
  document.getElementById("docs-toggle").onclick = () => {
    const panel = document.getElementById("docs-panel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    document.getElementById("settings-panel").style.display = "none";
  };

  document.getElementById("save-settings").onclick = handleSaveSettings;
  document.getElementById("refresh-models").onclick = loadOllamaModels;

  // Mode Toggles
  document.getElementById("mode-planning").onclick = () => switchMode("planning");
  document.getElementById("mode-agent").onclick = () => switchMode("agent");

  // Chat Actions
  document.getElementById("chat-send").onclick = sendChatMessage;
  const clearBtn = document.getElementById("chat-clear");
  if (clearBtn) clearBtn.onclick = clearChat;

  setupChatInput();
  setupScrollToBottom();
  setupAgentKeyboardShortcut();
  setupCharCount();

  // File Upload Handlers
  const bindClick = (id: string, handler: () => void) => {
    const el = document.getElementById(id);
    if (el) el.onclick = handler;
  };
  const bindChange = (id: string, handler: (e: Event) => void) => {
    const el = document.getElementById(id);
    if (el) el.onchange = handler;
  };

  bindClick("file-upload-btn", () => document.getElementById("file-input").click());
  bindChange("file-input", (e) => handleFileSelect(e, false));
  bindClick("file-remove", () => clearFile(false));

  bindClick("agent-file-btn", () => document.getElementById("agent-file-input").click());
  bindChange("agent-file-input", (e) => handleFileSelect(e, true));
  bindClick("agent-file-remove", () => clearFile(true));

  // Category Tabs
  document.querySelectorAll(".category-tab").forEach((tab) => {
    (tab as HTMLElement).onclick = () => {
      const cat = (tab as HTMLElement).dataset.category as ActionCategory;
      switchCategory(cat);
    };
  });

  // Detect Columns Button (Extract Mode)
  bindClick("detect-columns-btn", detectAndShowColumns);

  // Initial UI Build
  buildQuickActions();
  buildChatSuggestions();
  loadSettingsUI();
});

// ─── Icon Injection ────────────────────────────────────────────
function injectIcons(): void {
  const el = (id: string, html: string) => {
    const node = document.getElementById(id);
    if (node) node.innerHTML = html;
  };
  el("logo-icon", Icons.fileText);
  el("settings-toggle", Icons.settings);
  el("docs-toggle", Icons.helpCircle);
  el("run-icon", Icons.arrowRight);
  el("chevron-icon", Icons.chevronDown);
  el("refresh-models", Icons.refresh);
  el("mode-planning-icon", Icons.messageCircle);
  el("mode-agent-icon", Icons.zap);
  el("chat-send-icon", Icons.send);
  el("chat-clear-icon", Icons.trash);
  el("welcome-sparkle", Icons.sparkles);
}

function injectDocIcons(): void {
  document.querySelectorAll(".doc-icon[data-icon]").forEach((el) => {
    const key = el.getAttribute("data-icon") as keyof typeof Icons;
    if (Icons[key]) el.innerHTML = Icons[key];
  });
}

function injectCategoryIcons(): void {
  document.querySelectorAll(".cat-icon[data-icon]").forEach((el) => {
    const key = el.getAttribute("data-icon") as keyof typeof Icons;
    if (Icons[key]) el.innerHTML = Icons[key];
  });
}

// ─── Mode Switching ────────────────────────────────────────────
function switchMode(mode: Mode): void {
  if (mode === currentMode) return;
  currentMode = mode;

  // Update tabs
  document.querySelectorAll(".mode-tab").forEach((tab) => {
    tab.classList.toggle("active", (tab as HTMLElement).dataset.mode === mode);
  });

  // Update indicator
  const indicator = document.getElementById("mode-indicator");
  if (mode === "agent") {
    indicator.classList.add("right");
  } else {
    indicator.classList.remove("right");
  }

  // Show/hide content
  document.getElementById("planning-mode").classList.toggle("active", mode === "planning");
  document.getElementById("agent-mode").classList.toggle("active", mode === "agent");

  // Focus appropriate input
  if (mode === "planning") {
    setTimeout(() => (document.getElementById("chat-input") as HTMLTextAreaElement).focus(), 200);
  } else {
    setTimeout(() => (document.getElementById("prompt-input") as HTMLTextAreaElement).focus(), 200);
  }
}

// ─── Category Switching ────────────────────────────────────────
function switchCategory(category: ActionCategory): void {
  currentCategory = category;

  document.querySelectorAll(".category-tab").forEach((tab) => {
    tab.classList.toggle("active", (tab as HTMLElement).dataset.category === category);
  });

  // Show/hide schema info banner for Extract mode
  const schemaInfo = document.getElementById("schema-info");
  const detectedColumns = document.getElementById("detected-columns");

  if (schemaInfo) {
    schemaInfo.style.display = category === "extract" ? "flex" : "none";
  }

  if (detectedColumns) {
    detectedColumns.style.display = category === "extract" && detectedColumns.innerHTML.trim() ? "block" : "none";
  }

  // Update extraction mode flag
  schemaExtractionMode = category === "extract";

  buildQuickActions();
}

// ─── Quick Actions (Agent Mode) ────────────────────────────────
function buildQuickActions(): void {
  const container = document.getElementById("quick-actions");
  if (!container) return;
  container.innerHTML = "";

  const actions = CATEGORIZED_ACTIONS[currentCategory];
  if (!actions) {
    console.warn(`No quick actions found for category: ${currentCategory}`);
    return;
  }

  actions.forEach((action) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    const iconKey = action.icon as keyof typeof Icons;
    chip.innerHTML = `${Icons[iconKey] || ""}<span>${action.label}</span>`;
    chip.onclick = () => {
      const input = document.getElementById("prompt-input") as HTMLTextAreaElement;
      if (input) {
        input.value = action.prompt;
        input.focus();
        // Clear status when switching action
        const statusEl = document.getElementById("status-message");
        if (statusEl) statusEl.style.display = "none";
      }
    };
    container.appendChild(chip);
  });
}


// ─── Chat Suggestions (Planning Mode) ──────────────────────────
function buildChatSuggestions(): void {
  const container = document.getElementById("chat-suggestions");
  if (!container) return;

  CHAT_SUGGESTIONS.forEach((s) => {
    const btn = document.createElement("button");
    btn.className = "suggestion-chip";
    const iconKey = s.icon as keyof typeof Icons;
    btn.innerHTML = `${Icons[iconKey] || ""}${s.text}`;
    btn.onclick = () => {
      const input = document.getElementById("chat-input") as HTMLTextAreaElement;
      if (input) {
        input.value = s.text;
        sendChatMessage();
      }
    };
    container.appendChild(btn);
  });
}

// ─── Panel Toggle ──────────────────────────────────────────────
function togglePanel(panelId: string): void {
  const panel = document.getElementById(panelId);
  const isHidden = panel?.style.display === "none" || !panel?.style.display;

  document.querySelectorAll(".panel").forEach((p: HTMLElement) => {
    p.style.display = "none";
  });

  if (isHidden && panel) {
    panel.style.display = "block";
    if (panelId === "settings-panel") {
      const providerSelect = document.getElementById("setting-provider") as HTMLSelectElement;
      if (providerSelect && providerSelect.value === "local") loadOllamaModels();
    }
  }
}

// ─── Settings ──────────────────────────────────────────────────
// ─── Settings ──────────────────────────────────────────────────
function loadSettingsUI(): void {
  const config = getConfig();
  const providerSelect = document.getElementById("setting-provider") as HTMLSelectElement;
  if (providerSelect) {
    providerSelect.value = config.provider;
    providerSelect.onchange = (e) => {
      const p = (e.target as HTMLSelectElement).value;
      updateProviderFields(p);
      if (p === "local") loadOllamaModels();
    };
  }

  // Populate inputs (safe checks)
  const setVal = (id: string, val: string) => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
    if (el) el.value = val || "";
  };

  setVal("setting-api-key", config.apiKey); // Groq
  setVal("setting-groq-model", config.groqModel || "llama-3.3-70b-versatile");

  setVal("setting-gemini-key", config.geminiKey);
  setVal("setting-gemini-model", config.geminiModel || "gemini-1.5-flash");

  setVal("setting-openai-key", config.openaiKey);
  setVal("setting-openai-model", config.openaiModel || "gpt-4o-mini");

  setVal("setting-anthropic-key", config.anthropicKey);
  setVal("setting-anthropic-model", config.anthropicModel || "claude-3-5-sonnet-20241022");

  setVal("setting-openrouter-key", config.openrouterKey);
  setVal("setting-openrouter-model", config.openrouterModel || "anthropic/claude-3.5-sonnet:beta");

  setVal("setting-base-url", config.baseUrl);
  // Local model is populated async

  updateProviderFields(config.provider);
}

function updateProviderFields(p: string): void {
  const setDisplay = (id: string, show: boolean) => {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? "block" : "none";
  };
  setDisplay("groq-fields", p === "groq");
  setDisplay("gemini-fields", p === "gemini");
  setDisplay("openai-fields", p === "openai");
  setDisplay("anthropic-fields", p === "anthropic");
  setDisplay("openrouter-fields", p === "openrouter");
  setDisplay("local-fields", p === "local");
}

async function loadOllamaModels(): Promise<void> {
  const select = document.getElementById("setting-local-model") as HTMLSelectElement;
  const statusEl = document.getElementById("model-status");
  const host = (document.getElementById("setting-base-url") as HTMLInputElement)?.value?.trim() || "http://localhost:11434";

  if (!select) return;

  select.innerHTML = `<option value="" disabled selected>Loading...</option>`;
  if (statusEl) {
    statusEl.textContent = "";
    statusEl.className = "model-status";
  }

  const models = await fetchOllamaModels(host);
  if (models.length === 0) {
    select.innerHTML = `<option value="" disabled selected>No models found</option>`;
    if (statusEl) {
      statusEl.textContent = "Ollama not running or no models installed";
      statusEl.className = "model-status model-status-warn";
    }
    return;
  }

  const config = getConfig();
  select.innerHTML = "";
  models.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m.name;
    opt.textContent = `${m.name} (${(m.size / 1e9).toFixed(1)}GB)`;
    if ((config.localModel || config.model) === m.name) opt.selected = true;
    select.appendChild(opt);
  });
  if (statusEl) {
    statusEl.textContent = `${models.length} model${models.length > 1 ? "s" : ""} found`;
    statusEl.className = "model-status model-status-ok";
  }
}

function handleSaveSettings(): void {
  const provider = (document.getElementById("setting-provider") as HTMLSelectElement)?.value as any;
  const current = getConfig();

  // Helper to read val
  const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLSelectElement)?.value?.trim() || "";

  const newConfig: LLMConfig = {
    ...current,
    provider: provider,

    // Groq
    apiKey: getVal("setting-api-key"),
    groqModel: getVal("setting-groq-model"),

    // Gemini
    geminiKey: getVal("setting-gemini-key"),
    geminiModel: getVal("setting-gemini-model"),

    // OpenAI
    openaiKey: getVal("setting-openai-key"),
    openaiModel: getVal("setting-openai-model"),

    // Anthropic
    anthropicKey: getVal("setting-anthropic-key"),
    anthropicModel: getVal("setting-anthropic-model"),

    // OpenRouter
    openrouterKey: getVal("setting-openrouter-key"),
    openrouterModel: getVal("setting-openrouter-model"),

    // Local
    baseUrl: getVal("setting-base-url") ? `${getVal("setting-base-url").replace(/\/v1.*$/, "")}/v1/chat/completions` : undefined,
    localModel: getVal("setting-local-model") || current.localModel
  };

  saveConfig(newConfig);

  // Animated save feedback
  const btn = document.getElementById("save-settings");
  if (btn) {
    const originalText = btn.textContent;
    btn.textContent = "✓ Saved";
    btn.classList.add("saved");
    setTimeout(() => {
      btn.textContent = originalText || "Save";
      btn.classList.remove("saved");
    }, 1500);
  }

  showToast("success", "Settings saved successfully");

  setTimeout(() => {
    const panel = document.getElementById("settings-panel");
    if (panel) panel.style.display = "none";
  }, 800);
}


// ═══════════════════════════════════════════════════════════════
// PLANNING MODE — Chat Functions
// ═══════════════════════════════════════════════════════════════

function setupChatInput(): void {
  const input = document.getElementById("chat-input") as HTMLTextAreaElement;
  if (!input) return;

  // Auto-resize textarea
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 80) + "px";
  });

  // Enter to send (Shift+Enter for newline)
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
}

async function sendChatMessage(): Promise<void> {
  if (isChatBusy) {
    stopChatGeneration();
    return;
  }

  const input = document.getElementById("chat-input") as HTMLTextAreaElement;
  if (!input) return;
  const message = input.value.trim();
  if (!message) return;

  // Clear welcome screen on first message
  const welcome = document.querySelector(".chat-welcome") as HTMLElement;
  if (welcome) welcome.remove();

  // Add user message
  addChatBubble("user", message);
  chatHistory.push({ role: "user", content: message, timestamp: Date.now() });

  // Build conversation context with initial sheet overview
  if (chatConversation.length === 0) {
    let initialPrompt = CHAT_PROMPT;
    try {
      // Proactively give the AI an overview of the sheet columns at the start
      const overview = await getSheetContext();
      if (overview && overview.hits === 0 && overview.text.length > 20) {
        initialPrompt += "\n\n[INITIAL SHEET OVERVIEW]\n" + overview.text;
      }
    } catch (e) {
      console.warn("Could not load initial sheet overview:", e);
    }
    chatConversation.push({ role: "system", content: initialPrompt });
  }

  // 🔥 CONTEXT AWARENESS: Auto-detect if user is asking about their sheet or searching for data
  const needsSheetContext = /\b(this|my|current|opened?)\s+(sheet|data|table|workbook|excel|spreadsheet|sheeet|spreadsheat)\b|\b(find|search|where|is|check|lookup|contains?|exist|details|about|located|who|tell|give)\b|what\s+(do|can|should)|improve|analyze|suggest|help|better|optimize|\b\d{5,}\b|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(message) ||
    /\b[A-Z]{2,}(?:\s+[A-Z]{2,})+\b/.test(message) || // ALL CAPS sequences (Names/IDs)
    /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/.test(message); // Title Case sequences (Names)

  if (needsSheetContext) {
    try {
      const contextResult = await getSheetContext(message);
      if (contextResult) {
        const { text, hits } = contextResult;

        // Add to persistent conversation context
        chatConversation.push({
          role: "system",
          content: `The following data was retrieved from the user's sheet for this query:\n${text}`
        });

        // Show context indicator
        const lastBubble = document.querySelector('.chat-msg.user:last-child .chat-bubble');
        if (lastBubble) {
          const badge = document.createElement('span');
          badge.className = 'context-badge';
          badge.innerHTML = hits > 0 ? `🔍 Found ${hits} search hits in sheet` : '📊 Sheet context loaded';
          lastBubble.appendChild(badge);
        }
      }
    } catch (e) {
      console.warn('Could not load sheet context:', e);
    }
  }

  chatConversation.push({ role: "user", content: message });

  // Clear input
  input.value = "";
  input.style.height = "auto";

  // Show skeleton loader
  const skeletonEl = showTypingIndicator();
  isChatBusy = true;

  // Toggle button to Stop
  const chatSendButton = document.getElementById("chat-send") as HTMLButtonElement;
  const chatSendIcon = document.getElementById("chat-send-icon");
  if (chatSendButton) {
    if (chatSendIcon) chatSendIcon.innerHTML = Icons.stop;
    chatSendButton.classList.add("is-busy");
  }

  // Create AbortController
  chatAbortController = new AbortController();

  try {
    const response = await callLLM(chatConversation, undefined, chatAbortController.signal);

    // Format AI response
    const formattedResponse = formatChatResponse(response);

    // Create the real bubble
    const newBubble = createChatBubble("ai", "", response);

    // Replace skeleton with the real bubble
    if (skeletonEl) skeletonEl.replaceWith(newBubble);

    // Find the content part of the new bubble to apply the typewriter effect
    const bubbleContent = newBubble.querySelector('.chat-bubble') as HTMLElement;

    // Stream content
    if (bubbleContent) {
      await typewriterEffect(bubbleContent, formattedResponse);
    }

    chatConversation.push({ role: "assistant", content: response });
    chatHistory.push({ role: "ai", content: response, timestamp: Date.now() });

  } catch (error: any) {
    if (error.name === 'AbortError') {
      if (skeletonEl) skeletonEl.remove();
      addChatBubble("ai", `<p style="color:var(--text-3)"><i>Generation stopped.</i></p>`);
    } else {
      if (skeletonEl) skeletonEl.remove();
      addChatBubble("ai", `<p style="color:var(--error)">⚠️ ${error.message}</p>`);
      showToast("error", error.message?.substring(0, 80) || "Something went wrong");
    }
  } finally {
    isChatBusy = false;
    chatAbortController = null;
    // Reuse outer chatSendButton reference (avoid redeclaring)
    if (chatSendButton) {
      const sendIcon = document.getElementById("chat-send-icon");
      if (sendIcon) sendIcon.innerHTML = Icons.send;
      chatSendButton.classList.remove("is-busy");
    }
  }
}

async function stopChatGeneration() {
  if (chatAbortController) {
    chatAbortController.abort();
  }
}

async function typewriterEffect(element: HTMLElement, html: string): Promise<void> {
  // 1. Reveal element immediately
  element.innerHTML = "";

  // 2. Parse into tokens (simple tag-preserving tokenizer)
  // We split by tags so we can print text content progressively, but print tags instantly.
  const tokens = html.split(/(<[^>]+>)/g);

  for (const token of tokens) {
    if (token.startsWith("<") && token.endsWith(">")) {
      // It's a tag, append immediately
      element.innerHTML += token;
    } else if (token.trim().length > 0) {
      // It's text, type it out word by word for speed
      const words = token.split(/(\s+)/); // Keep spaces
      for (const word of words) {
        element.innerHTML += word;
        // Scroll to bottom
        const container = document.getElementById("chat-messages");
        if (container) container.scrollTop = container.scrollHeight;
        // Variable delay for realism
        await new Promise(r => setTimeout(r, Math.random() * 10 + 5));
      }
    }
  }
}

function createChatBubble(role: "user" | "ai", htmlContent: string, rawContent?: string): HTMLElement {
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-msg ${role}`;

  const bubbleDiv = document.createElement("div");
  bubbleDiv.className = "chat-bubble";
  bubbleDiv.innerHTML = htmlContent;

  // If AI message, add action buttons
  if (role === "ai" && rawContent) {
    // Actions bar with copy + switch to agent
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "chat-bubble-actions";

    // Copy button
    const copyBtn = document.createElement("button");
    copyBtn.className = "btn-copy";
    copyBtn.innerHTML = `${Icons.copy} Copy`;
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(rawContent).then(() => {
        copyBtn.innerHTML = `${Icons.check} Copied`;
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.innerHTML = `${Icons.copy} Copy`;
          copyBtn.classList.remove("copied");
        }, 2000);
      }).catch(() => {
        showToast("error", "Failed to copy");
      });
    };
    actionsDiv.appendChild(copyBtn);

    // Execute in Agent button
    const execBtn = document.createElement("button");
    execBtn.className = "btn-execute-from-chat";
    execBtn.innerHTML = `${Icons.zap} Switch to Agent`;
    execBtn.onclick = () => {
      const agentPromptInput = document.getElementById("prompt-input") as HTMLTextAreaElement;
      if (agentPromptInput) {
        agentPromptInput.value = extractActionablePrompt(rawContent);
        switchMode("agent");
        agentPromptInput.focus();
      }
    };

    const actionBar = document.createElement("div");
    actionBar.className = "chat-action-bar";
    actionBar.appendChild(execBtn);

    bubbleDiv.appendChild(actionsDiv);
    bubbleDiv.appendChild(actionBar);
  }

  msgDiv.appendChild(bubbleDiv);

  return msgDiv;
}


function addChatBubble(role: "user" | "ai", htmlContent: string, rawContent?: string): HTMLElement {
  const container = document.getElementById("chat-messages");
  if (!container) throw new Error("Chat messages container not found.");

  const msgDiv = createChatBubble(role, htmlContent, rawContent);
  container.appendChild(msgDiv);

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;

  return msgDiv.querySelector('.chat-bubble'); // Return bubble for typewriter
}

function showTypingIndicator(): HTMLElement {
  const container = document.getElementById("chat-messages");
  if (!container) throw new Error("Chat messages container not found.");

  const template = document.getElementById("chat-skeleton-template") as HTMLTemplateElement;

  // Fallback to old indicator if template is missing
  if (!template) {
    const oldIndicator = document.createElement("div");
    oldIndicator.className = "chat-msg ai";
    oldIndicator.id = "typing-msg";
    oldIndicator.innerHTML = `<div class="chat-avatar">${Icons.bot}</div><div class="chat-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
    container.appendChild(oldIndicator);
    container.scrollTop = container.scrollHeight;
    return oldIndicator;
  }

  const skeleton = template.content.cloneNode(true) as DocumentFragment;
  const skeletonElement = skeleton.firstElementChild as HTMLElement;
  if (skeletonElement) {
    skeletonElement.id = 'typing-msg';
    container.appendChild(skeletonElement);
    container.scrollTop = container.scrollHeight;
    return skeletonElement;
  }

  return null; // Should not happen
}

function formatChatResponse(text: string): string {
  let html = text.trim();

  // 1. Headers (### Heading)
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // 2. Tables (| col | col |)
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  const processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHtml = '<table>';
      }

      // Skip separator row (|---|---|)
      if (line.includes('---')) continue;

      const cells = line.split('|').filter(c => c.trim() !== '' || line.indexOf('|' + c + '|') !== -1);
      // Clean cells of leading/trailing pipes
      const cleanCells = line.split('|').slice(1, -1).map(c => c.trim());

      tableHtml += '<tr>' + cleanCells.map(c => i === 0 || (lines[i - 1] && !lines[i - 1].includes('|')) ? `<th>${c}</th>` : `<td>${c}</td>`).join('') + '</tr>';
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</table>';
        processedLines.push(tableHtml);
        tableHtml = '';
      }
      processedLines.push(lines[i]);
    }
  }
  if (inTable) {
    tableHtml += '</table>';
    processedLines.push(tableHtml);
  }
  html = processedLines.join('\n');

  // 3. Code blocks (``` ... ```)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre style="margin:6px 0;padding:8px;background:rgba(0,0,0,0.06);border-radius:6px;font-family:var(--mono);font-size:10px;overflow-x:auto"><code>$2</code></pre>');

  // 4. Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 5. Bold (**bold**)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // 5.1 Italic (*italic*)
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 6. Lists
  // 6.1 Unordered lists (- or * or •)
  html = html.replace(/^[-*•]\s+(.+)$/gm, '<li>$1</li>');

  // 6.2 Numbered lists (1.)
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ol-item">$1</li>');

  // 6.3 Wrap consecutive li items
  html = html.replace(/((?:<li>.*?<\/li>\n?)+)/g, '<ul>$1</ul>');
  html = html.replace(/((?:<li class="ol-item">.*?<\/li>\n?)+)/g, match => {
    return `<ol>${match.replace(/ class="ol-item"/g, '')}</ol>`;
  });

  // 7. Paragraphs
  const blocks = html.split(/\n\n+/);
  html = blocks
    .map(block => {
      const b = block.trim();
      if (!b) return '';
      // If it starts with a tag already, don't wrap in <p>
      if (/^<(h1|h2|h3|ul|ol|table|pre|p|li|div)/i.test(b)) return b;
      // Otherwise wrap in <p> and handle single newlines as <br>
      return `<p>${b.replace(/\n/g, '<br>')}</p>`;
    })
    .join('');

  // 8. Visual Polish: Cleanup bullet and paragraph spacing
  html = html.replace(/<p>\s*<ul>/g, '<ul>').replace(/<\/ul>\s*<\/p>/g, '</ul>');
  html = html.replace(/<li>\s*<p>/g, '<li>').replace(/<\/p>\s*<\/li>/g, '</li>');

  return html;
}

function extractActionablePrompt(aiResponse: string): string {
  // Try to build a useful prompt from the AI's response for agent mode
  // Look for formula mentions or action keywords
  const lines = aiResponse.split('\n');
  for (const line of lines) {
    if (line.includes('=') && line.includes('(') && !line.startsWith('#')) {
      // Looks like a formula mention
      return `Apply this formula: ${line.trim()}`;
    }
  }
  // Default: use a summary
  const firstSentence = aiResponse.split(/[.!?]/)[0];
  return firstSentence.length > 120 ? firstSentence.substring(0, 120) : firstSentence;
}

function clearChat(): void {
  const container = document.getElementById("chat-messages");
  container.innerHTML = "";
  chatHistory.length = 0;
  chatConversation = [];
  isChatBusy = false;

  // Re-add welcome screen
  const welcomeHTML = `
    <div class="chat-welcome">
      <img src="assets/icon-80-v2.png" alt="SheetOS Logo" style="width: 64px; height: 64px; margin-bottom: 16px;">
      <h2>What are you working on?</h2>
      <div class="welcome-suggestions" id="chat-suggestions"></div>
    </div>
  `;
  container.innerHTML = welcomeHTML;
  buildChatSuggestions();
}


// ═══════════════════════════════════════════════════════════════
// TOAST NOTIFICATION SYSTEM
// ═══════════════════════════════════════════════════════════════
function showToast(type: "success" | "error" | "info", message: string, duration: number = 3000): void {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: Icons.check,
    error: Icons.alertCircle,
    info: Icons.helpCircle,
  };

  toast.innerHTML = `${iconMap[type] || ""}<span>${message}</span>`;
  container.appendChild(toast);

  // Auto-dismiss
  setTimeout(() => {
    toast.classList.add("toast-out");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}


// ═══════════════════════════════════════════════════════════════
// SCROLL-TO-BOTTOM BUTTON
// ═══════════════════════════════════════════════════════════════
function setupScrollToBottom(): void {
  const chatMessages = document.getElementById("chat-messages");
  const scrollBtn = document.getElementById("scroll-to-bottom");
  if (!chatMessages || !scrollBtn) return;

  // Show/hide based on scroll position
  chatMessages.addEventListener("scroll", () => {
    const isNearBottom = chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight < 100;
    scrollBtn.classList.toggle("visible", !isNearBottom);
  });

  // Click to scroll
  scrollBtn.onclick = () => {
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: "smooth" });
  };
}


// ═══════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════════
function setupAgentKeyboardShortcut(): void {
  const promptInput = document.getElementById("prompt-input") as HTMLTextAreaElement;
  if (!promptInput) return;

  promptInput.addEventListener("keydown", (e) => {
    // Ctrl+Enter to execute
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runAICommand();
    }
  });
}


// ═══════════════════════════════════════════════════════════════
// CHARACTER COUNT INDICATOR
// ═══════════════════════════════════════════════════════════════
function setupCharCount(): void {
  const promptInput = document.getElementById("prompt-input") as HTMLTextAreaElement;
  if (!promptInput) return;

  // Create and insert char count element
  const charCount = document.createElement("span");
  charCount.className = "char-count";
  charCount.textContent = "";

  const footerLeft = promptInput.closest(".input-card")?.querySelector(".footer-left");
  if (footerLeft) {
    footerLeft.appendChild(charCount);
  }

  promptInput.addEventListener("input", () => {
    const len = promptInput.value.length;
    if (len === 0) {
      charCount.textContent = "";
      charCount.className = "char-count";
    } else {
      charCount.textContent = `${len}`;
      if (len > 3000) {
        charCount.className = "char-count danger";
      } else if (len > 2000) {
        charCount.className = "char-count warning";
      } else {
        charCount.className = "char-count";
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// CONTEXT AWARENESS — Read Excel Sheet Data
// ═══════════════════════════════════════════════════════════════

/**
 * Get comprehensive sheet context for AI analysis
 * Returns { text: string, hits: number }
 */
async function getSheetContext(query?: string): Promise<{ text: string, hits: number } | null> {
  try {
    return await Excel.run(async (context) => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      sheet.load("name");

      // Use getUsedRangeOrNullObject for robustness
      const usedRange = sheet.getUsedRangeOrNullObject();
      usedRange.load("rowCount,columnCount,address,isNullObject");
      await context.sync();

      if (usedRange.isNullObject || usedRange.rowCount === 0 || usedRange.columnCount === 0) {
        return { text: "Sheet is empty.", hits: 0 };
      }

      // 1. Get Headers (Row 1)
      const headerRange = usedRange.getRow(0);
      headerRange.load("values");
      await context.sync();
      const headers = headerRange.values[0].map(h => String(h || "").trim());

      // 2. Perform Deep Search if query contains potential search terms
      let deepSearchContext = "";
      let hitsCount = 0;
      if (query) {
        const searchTerms = new Set<string>();
        // 1. ALL CAPS sequences (e.g., MD PRAVEJ ALAM)
        (query.match(/\b[A-Z]{2,}(?:\s+[A-Z]{2,})+\b/g) || []).forEach(t => searchTerms.add(t));

        // 2. Title Case sequences
        (query.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g) || []).forEach(t => searchTerms.add(t));

        // 3. Numbers, Quoted strings, and Emails
        (query.match(/\b\d{5,}\b/g) || []).forEach(t => searchTerms.add(t));
        (query.match(/"([^"]+)"/g) || []).forEach(t => searchTerms.add(t.replace(/"/g, '')));
        (query.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi) || []).forEach(t => searchTerms.add(t));

        // 4. Fallback: Generic phrases
        (query.match(/\b[A-Za-z]{3,}(?:\s+[A-Za-z]{3,}){1,2}\b/g) || []).forEach(t => {
          const commonWords = /^(this|that|sheet|data|name|about|find|search|where|exist|check|lookup|improve|analyze|suggest|help|better|optimize|what|when|where|there|from|with|tell|your|mine|ours|will|shall|should|could|would|please|show|list|their|details|contact|given|into|some|those|these)$/i;
          if (!t.split(/\s+/).every(word => commonWords.test(word))) {
            searchTerms.add(t);
          }
        });

        if (searchTerms.size > 0) {
          const termsArray = Array.from(searchTerms);

          for (const term of termsArray) {
            // Ignore common query words
            if (/^(Name|Sheet|Data|Candidate|Find|Is|This|My|Current|Column|Details|About)$/i.test(term)) continue;

            let foundRange = usedRange.find(term, { completeMatch: false, matchCase: false });
            foundRange.load("address,isNullObject");
            await context.sync();

            // If full term not found, try searching for the longest word in the term
            if (foundRange.isNullObject && term.includes(" ")) {
              const words = term.split(/\s+/).sort((a, b) => b.length - a.length);
              const bestWord = words[0];
              if (bestWord.length > 3) {
                foundRange = usedRange.find(bestWord, { completeMatch: false, matchCase: false });
                foundRange.load("address,isNullObject");
                await context.sync();
              }
            }

            if (!foundRange.isNullObject && hitsCount < 10) {
              hitsCount++;
              const row = foundRange.getEntireRow().getIntersection(usedRange);
              row.load("values");
              await context.sync();

              const rowData = row.values[0].map((v, idx) => {
                const header = headers[idx] || `Col ${idx + 1}`;
                const val = (v === "" || v === null) ? "(empty)" : String(v);
                return `${header}: ${val}`;
              }).join(" | ");

              deepSearchContext += `📌 MATCH [${term}] at ${foundRange.address}:\n   >> ${rowData}\n`;
            }
          }
          if (hitsCount > 0) {
            deepSearchContext += "=".repeat(40) + "\n";
          } else {
            deepSearchContext = "\n(I searched the sheet for your mentioned terms, but no exact matches were found in the current sheet.)\n";
          }
        }

        // 3. Sample data (max 10 rows for general context)
        const sampleSize = Math.min(10, usedRange.rowCount);
        const sampleRange = usedRange.getResizedRange(sampleSize - 1, 0); // Headers included
        sampleRange.load("values");
        await context.sync();
        const sampleData = sampleRange.values;

        // Data type detection
        const columnTypes: string[] = [];
        if (sampleData.length > 1) {
          for (let col = 0; col < usedRange.columnCount; col++) {
            const columnValues = sampleData.slice(1).map(row => row[col]).filter(v => v !== null && v !== "");
            if (columnValues.length === 0) {
              columnTypes.push("empty");
            } else if (columnValues.every(v => !isNaN(Number(v)))) {
              columnTypes.push("number");
            } else if (columnValues.every(v => /^\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}/.test(String(v)))) {
              columnTypes.push("date");
            } else {
              columnTypes.push("text");
            }
          }
        }

        // Build context string
        let contextStr = "";
        if (deepSearchContext && deepSearchContext.length > 50) {
          contextStr += `🚨 [CRITICAL DATA HIT] 🚨\n${deepSearchContext}\n\n`;
        }

        contextStr += `--- GENERAL SHEET INFO ---\n`;
        contextStr += `Sheet: "${sheet.name}" (${usedRange.rowCount} rows × ${usedRange.columnCount} columns)\n`;
        contextStr += `Location: ${usedRange.address}\n\n`;

        contextStr += `COLUMNS:\n`;
        headers.forEach((h, i) => {
          const type = columnTypes[i] || "unknown";
          contextStr += `  ${i + 1}. "${h || `Column${i + 1}`}" (${type})\n`;
        });

        contextStr += `\nDATA SAMPLE (First ${sampleSize} rows):\n`;
        sampleData.forEach((row, i) => {
          if (i === 0) {
            contextStr += `  [Headers] ${row.map(c => `"${c}"`).join(" | ")}\n`;
          } else {
            contextStr += `  Row ${i}: ${row.map(c => c === null || c === "" ? "(empty)" : `"${c}"`).join(" | ")}\n`;
          }
        });

        if (usedRange.rowCount > sampleSize) {
          contextStr += `  ... (${usedRange.rowCount - sampleSize} more rows not shown)\n`;
        }

        return { text: contextStr, hits: hitsCount };
      }

      // Even without a query, return a general sheet overview
      const overviewHeaders = headers.filter(h => h.length > 0);
      if (overviewHeaders.length > 0) {
        return {
          text: `Sheet: "${sheet.name}" (${usedRange.rowCount} rows × ${usedRange.columnCount} columns)\nColumns: ${overviewHeaders.join(", ")}`,
          hits: 0
        };
      }
      return null;
    });
  } catch (error) {
    console.error("Error reading sheet context:", error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// SCHEMA-AWARE EXTRACTION — Read Column Headers from Excel
// ═══════════════════════════════════════════════════════════════

/**
 * Read existing column headers from row 1 of the active Excel sheet
 * Returns array of non-empty header names
 */
async function getExcelColumnHeaders(): Promise<string[]> {
  return Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();

    // Read first row (A1:Z1) for headers - covers up to 26 columns
    const headerRange = sheet.getRange("A1:Z1");
    headerRange.load("values");
    await context.sync();

    const headers = headerRange.values[0]
      .map((cell: any) => (cell ? String(cell).trim() : ""))
      .filter((header: string) => header !== "");

    return headers;
  });
}

/**
 * Get count of existing data rows (excluding header)
 */
async function getExistingDataRowCount(): Promise<number> {
  return Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const usedRange = sheet.getUsedRange();
    usedRange.load("rowCount");
    await context.sync();
    return Math.max(0, usedRange.rowCount - 1); // Subtract header row
  });
}

/**
 * Detect and display column headers in the UI
 */
async function detectAndShowColumns(): Promise<void> {
  const btn = document.getElementById("detect-columns-btn") as HTMLButtonElement;
  const detectedSection = document.getElementById("detected-columns");
  const columnChips = document.getElementById("column-chips");
  const columnCount = document.getElementById("column-count");

  if (!detectedSection || !columnChips || !columnCount) return;

  // Show loading state
  if (btn) btn.innerHTML = "⏳ Loading...";

  try {
    const columns = await getExcelColumnHeaders();

    if (columns.length === 0) {
      // No columns found
      columnChips.innerHTML = '<span class="column-chip empty-warning">⚠️ No headers in Row 1 — add columns first</span>';
      columnCount.textContent = "0";
      detectedSection.style.display = "block";
    } else {
      // Show detected columns as chips
      columnChips.innerHTML = columns.map(col =>
        `<span class="column-chip">${col}</span>`
      ).join("");
      columnCount.textContent = String(columns.length);
      detectedSection.style.display = "block";
    }
  } catch (e) {
    console.error("Error detecting columns:", e);
    columnChips.innerHTML = '<span class="column-chip empty-warning">⚠️ Error reading Excel</span>';
    columnCount.textContent = "0";
    detectedSection.style.display = "block";
  } finally {
    if (btn) btn.innerHTML = "🔍 Detect";
  }
}

/**
 * Build the schema-aware extraction prompt with existing column headers
 */
function buildSchemaExtractionDirective(columns: string[]): string {
  const columnList = columns.map((c, i) => `${i + 1}. "${c}"`).join("\n");
  const enhancedHints = buildEnhancedPrompt(columns);

  return `
═══════════════════════════════════════════════════════════════════════════════
🔒 SCHEMA-LOCKED EXTRACTION MODE — CRITICAL INSTRUCTIONS
═══════════════════════════════════════════════════════════════════════════════

The user has PRE-DEFINED these columns in their Excel sheet. You MUST extract data ONLY for these columns:

${columnList}

${enhancedHints}

EXTRACTION RULES (MEMORIZE THESE):
1. ONE ROW PER DOCUMENT: Each attached PDF/image represents ONE candidate/record.
2. EXACT COLUMN MATCHING: Only fill data for the columns listed above.
3. NO HALLUCINATION: If information for a column is NOT visible in the document, use "" (empty string).
4. NO NEW COLUMNS: Do NOT add any columns that aren't in the list above.
5. PROPER FORMATTING:
   - Names: Proper Case (John Smith)
   - Emails: lowercase
   - Phones: Keep original format or +X-XXX-XXX-XXXX
   - Skills: Comma-separated list

BANNED BEHAVIORS:
❌ Guessing email addresses (e.g., firstname@company.com)
❌ Fabricating phone numbers
❌ Making up skills not explicitly listed
❌ Using "N/A", "Not Found", "Unknown" — use "" instead
❌ Adding extra columns

OUTPUT: Generate Excel JS code that writes the extracted data starting from the first empty row.
The code should use the writeData helper function and format the data professionally.

═══════════════════════════════════════════════════════════════════════════════
`;
}


// ═══════════════════════════════════════════════════════════════
// AGENT MODE — Execute Functions (Enhanced with Orchestrator)
// ═══════════════════════════════════════════════════════════════

const MAX_EXECUTION_RETRIES = 3;

export async function runAICommand(): Promise<void> {
  const statusEl = document.getElementById("status-message");
  const debugEl = document.getElementById("debug-code");
  const skeletonEl = document.getElementById("skeleton");
  const cacheBadge = document.getElementById("cache-badge");
  const promptInput = document.getElementById("prompt-input") as HTMLTextAreaElement;
  const button = document.getElementById("run") as HTMLButtonElement;

  if (!statusEl || !debugEl || !skeletonEl || !cacheBadge || !promptInput || !button) {
    console.error("Agent UI elements not found");
    return;
  }

  let userPrompt = promptInput.value.trim();

  // Handle File Input
  if (!userPrompt && attachedFiles.length === 0) {
    showStatus(statusEl, "info", "Please enter a command or attach a file.");
    return;
  }

  // Default prompt for files
  if (attachedFiles.length > 0 && !userPrompt) {
    userPrompt = attachedFiles.length > 1
      ? `Analyze the ${attachedFiles.length} attached files. Extract and merge all tabular data into a single master table. Standardize headers and columns.`
      : `Analyze the attached ${attachedFiles[0].type}. Extract all tabular data and write valid Excel JS code to populate the active sheet. Format headers and auto-fit columns.`;
  }

  // Detect Schema Extraction Mode
  const isSchemaMode = userPrompt.includes("SCHEMA_EXTRACTION_MODE") || currentCategory === "extract";

  // UI: loading
  if (agentAbortController) {
    agentAbortController.abort();
    return;
  }

  agentAbortController = new AbortController();
  const signal = agentAbortController.signal;

  const runText = document.getElementById("run-text");
  const runIcon = document.getElementById("run-icon");
  const originalText = runText ? runText.innerText : "Execute";
  const originalIcon = runIcon ? runIcon.innerHTML : "";

  button.classList.add("is-busy");
  button.classList.add("btn-stop");

  if (runText) runText.innerText = "Stop Agent";
  if (runIcon) runIcon.innerHTML = Icons.stop;

  statusEl.style.display = "none";
  skeletonEl.style.display = "flex";
  cacheBadge.style.display = "none";
  debugEl.innerText = "";

  try {
    let code: string;
    let fromCache = false;

    // ─── Read Sheet Context for Intelligent Assistance ───
    let sheetContext: SheetContext | null = null;
    try {
      sheetContext = await readSheetContext();
      if (sheetContext?.hasData) {
        console.log(`[Agent] Sheet context: ${sheetContext.rowCount}x${sheetContext.columnCount}`);
      }
    } catch (e) {
      console.warn("[Agent] Could not read sheet context:", e);
    }

    // ─── Schema Extraction Mode ───
    let existingColumns: string[] = [];
    if (isSchemaMode && attachedFiles.length > 0) {
      try {
        existingColumns = await getExcelColumnHeaders();
        console.log("[Agent] Schema columns detected:", existingColumns);

        if (existingColumns.length === 0) {
          showStatus(statusEl, "info", "⚠️ No column headers found in Row 1. Add headers first or use 'HR Database Setup' to create them.");
          skeletonEl.style.display = "none";
          return;
        }

        if (runText) runText.innerText = `Extracting (${existingColumns.length} cols)...`;
      } catch (e) {
        console.warn("[Agent] Could not read Excel headers:", e);
      }
    }

    // ─── Check Cache (Skip for files/schema mode) ───
    const cached = (attachedFiles.length === 0 && !isSchemaMode) ? getCachedResponse(userPrompt) : null;

    if (cached) {
      code = cached;
      fromCache = true;
      cacheBadge.style.display = "inline-block";

      // Still validate cached code
      const validation = validateCode(code);
      if (!validation.isValid) {
        console.warn("[Agent] Cached code failed validation, regenerating...");
        fromCache = false;
        code = ""; // Will regenerate
      } else {
        code = validation.sanitizedCode;
      }
    }

    // ─── Generate Code (if not from cache) ───
    if (!fromCache) {
      if (isSchemaMode && attachedFiles.length > 0) {
        if (runText) runText.innerText = "Generating...";

        const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];
        const schemaDirective = buildSchemaExtractionDirective(existingColumns);
        const cleanPrompt = userPrompt.replace("SCHEMA_EXTRACTION_MODE:", "").trim();

        const contentText = `${cleanPrompt}\n\nEXISTING_COLUMNS: ${JSON.stringify(existingColumns)}\n\n${schemaDirective}`;
        const contentParts: any[] = [{ type: "text", text: contentText }];

        let totalImages = 0;
        attachedFiles.forEach((file) => {
          file.data.forEach((url) => {
            if (totalImages < 20) {
              contentParts.push({ type: "image_url", image_url: { url } });
              totalImages++;
            }
          });
        });

        messages.push({ role: "user", content: contentParts });
        code = await callLLM(messages, undefined, signal);

        if (runText) runText.innerText = "Validating...";
        let validation = validateCode(code);
        let validationAttempts = 0;
        const MAX_VALIDATION_FIXES = 2;

        while (!validation.isValid && validationAttempts < MAX_VALIDATION_FIXES) {
          console.warn(`[Agent] Validation failed (attempt ${validationAttempts + 1}):`, validation.errors);
          const errorSummary = validation.errors.map((e) => `${e.message} → ${e.suggestion}`).join("\n");

          code = await callLLM(
            [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userPrompt },
              { role: "assistant", content: code },
              { role: "user", content: `VALIDATION ERRORS:\n${errorSummary}\n\nFix these errors. Output ONLY the corrected code.` },
            ],
            undefined,
            signal
          );

          validation = validateCode(code);
          validationAttempts++;
        }

        code = validation.sanitizedCode;
        if (validation.warnings.length > 0) {
          console.log("[Agent] Validation warnings:", validation.warnings);
        }
      } else {
        if (runText) runText.innerText = "Planning...";

        const orchestratorResult = await runAgent(
          userPrompt,
          sheetContext,
          attachedFiles,
          {
            maxRetries: 2,
            enablePlanning: true,
            strictValidation: true,
          },
          signal
        );

        if (!orchestratorResult.success) {
          throw new Error(orchestratorResult.error || "Agent failed to generate valid code");
        }

        code = orchestratorResult.code;
      }
    }

    debugEl.innerText = code;
    skeletonEl.style.display = "none";

    // ─── EXECUTION PHASE with Advanced Recovery ───
    if (runText) runText.innerText = "Running...";
    showStatus(statusEl, "info", `<div class="spinner"></div><span>Executing code...</span>`);

    const recovery = await executeWithRecovery(
      code,
      async (candidateCode: string) => {
        await executeExcelCode(candidateCode);
      },
      MAX_EXECUTION_RETRIES,
      signal
    );

    if (recovery.success) {
      code = recovery.finalCode;
      debugEl.innerText = code;
      if (!fromCache && attachedFiles.length === 0 && !isSchemaMode) {
        cacheResponse(userPrompt, code);
      }
      showStatus(statusEl, "success", `${Icons.check}<span>Done</span>`);
      showToast("success", "Executed successfully \u2713 (Press Ctrl+Z to undo)");
    } else {
      throw new Error(recovery.error || "Execution failed after retries");
    }

  } catch (error: any) {
    console.error("[Agent] Fatal error:", error);
    skeletonEl.style.display = "none";

    if (error.name === 'AbortError') {
      showStatus(statusEl, "info", "Agent stopped by user.");
      showToast("info", "Agent stopped");
    } else {
      showStatus(statusEl, "error", error.message || String(error));
      showToast("error", (error.message || "Execution failed").substring(0, 80));
    }
  } finally {
    button.disabled = false;
    if (runText) runText.innerText = originalText;
    if (runIcon) runIcon.innerHTML = originalIcon;
    button.classList.remove("btn-stop");
    button.classList.remove("is-busy");
    agentAbortController = null;
  }
}

// ─── Helpers ───────────────────────────────────────────────────
function showStatus(el: HTMLElement, type: "info" | "success" | "error", html: string): void {
  el.innerHTML = html;
  el.className = `status-pill ${type}`;
  el.style.display = "flex";
}

/**
 * Execute AI-generated Excel JavaScript code with safety wrappers.
 * Provides:
 * - Pre-declared context, sheet, Excel variables
 * - writeData helper function
 * - Auto-fit columns on completion
 * - Enhanced error messages
 */
async function executeExcelCode(code: string): Promise<void> {
  await Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();

    // Mandatory writeData helper that all generated code can use
    const writeDataHelper = `
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
    return range;
  } catch (e) {
    console.error("writeData error:", e);
    return null;
  }
}
`;

    const wrappedCode = `
      ${writeDataHelper}
      
      try {
        // ═══ AI Generated Code ═══
        ${code}
        
        // ═══ Safety Finalization ═══
        try {
          sheet.getUsedRange().format.autofitColumns();
        } catch(_) { /* Sheet might be empty */ }
        
      } catch(_innerErr) {
        console.error("[Agent] Runtime Error:", _innerErr);
        try { await context.sync(); } catch(_) {}
        throw _innerErr;
      }
    `;

    try {
      await new Function(
        "context", "sheet", "Excel",
        `return (async () => { 
          try {
            ${wrappedCode}
            await context.sync();
          } catch (inner) {
            // Enhance error messages for common issues
            if (inner.code === "InvalidArgument") {
              const original = inner.message || "";
              if (original.includes("A0") || original.includes("row 0")) {
                inner.message = "Invalid range: Row 0 doesn't exist. Excel rows start at 1.";
              } else if (original.includes("getResizedRange")) {
                inner.message = "Invalid range size: Check that data dimensions match the range.";
              } else {
                inner.message = "Invalid argument: " + original;
              }
            } else if (inner.message?.includes("is not a function")) {
              const fnMatch = inner.message.match(/(\\w+) is not a function/);
              const fn = fnMatch ? fnMatch[1] : (inner.stack?.match(/at\\s+.*\\.(.*)\\s+\\(/)?.[1] || "method");
              inner.message = "API Error: ." + fn + "() doesn't exist. Use correct Excel JS API methods.";
            } else if (inner.message?.includes("is not defined")) {
              const varMatch = inner.message.match(/(\\w+) is not defined/);
              const v = varMatch ? varMatch[1] : "variable";
              inner.message = "Undefined: '" + v + "' was used before being declared.";
            } else if (inner.message?.includes("Cannot read property")) {
              inner.message = "Null reference: Tried to read property of undefined. Add null checks or ensure .load() was called.";
            }
            throw inner;
          }
        })()`
      )(context, sheet, Excel);
    } catch (e: any) {
      console.error("[Agent] Execution Error:", e);
      try { await context.sync(); } catch (_) { }
      throw e;
    }

    await context.sync();
  });
}
// ─── File Handling Logic ───────────────────────────────────────
async function handleFileSelect(event: Event, isAgent: boolean = false) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const btnId = isAgent ? "agent-file-btn" : "file-upload-btn";
  const btn = document.getElementById(btnId);
  if (btn) btn.innerHTML = `<span class="btn-spinner"></span>`;

  try {
    const newFiles = [];

    // Process all selected files
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const images = await renderPdfToImages(arrayBuffer);
        newFiles.push({ name: file.name, type: "pdf", data: images });
      } else if (file.type.startsWith("image/")) {
        const base64 = await fileToBase64(file);
        newFiles.push({ name: file.name, type: "image", data: [base64] });
      }
    }

    if (newFiles.length > 0) {
      // Append to existing files
      attachedFiles = [...attachedFiles, ...newFiles];
      updateFilePreview(true, isAgent);
    } else {
      throw new Error("Unsupported file type. Please upload PDF or Image.");
    }
  } catch (error: any) {
    console.error(error);
    showStatus(document.getElementById("status-message"), "error", "Error reading file: " + error.message);
  } finally {
    // Reset input so same file can be selected again if needed
    input.value = "";
    if (btn) {
      // Restore icon
      const icon = isAgent
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`;
      btn.innerHTML = icon;
    }
  }
}

function updateFilePreview(show: boolean, isAgent: boolean = false) {
  const listId = isAgent ? "agent-file-preview-list" : "file-preview-list";
  const container = document.getElementById(listId);

  if (!container) return;
  container.innerHTML = "";

  if (attachedFiles.length === 0) {
    return;
  }

  // Render chips
  attachedFiles.forEach((file, index) => {
    const chip = document.createElement("div");
    chip.className = "file-chip";

    const icon = document.createElement("span");
    icon.className = "file-chip-icon";
    icon.innerHTML = file.type === "pdf" ? "📄" : "🖼️";

    const name = document.createElement("span");
    name.className = "file-chip-name";
    name.innerText = file.name;

    const remove = document.createElement("button");
    remove.className = "file-chip-remove";
    remove.innerHTML = "×";
    remove.title = "Remove file";
    remove.onclick = (e) => {
      e.stopPropagation();
      removeFile(index, isAgent);
    };

    chip.appendChild(icon);
    chip.appendChild(name);
    chip.appendChild(remove);
    container.appendChild(chip);
  });
}

function removeFile(index: number, isAgent: boolean) {
  attachedFiles.splice(index, 1);
  updateFilePreview(true, isAgent);
}

function clearFile(isAgent: boolean = false) {
  attachedFiles = [];
  updateFilePreview(false, isAgent);
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function renderPdfToImages(buffer: ArrayBuffer): Promise<string[]> {
  // @ts-ignore
  const pdf = await pdfjsLib.getDocument(buffer).promise;
  const images: string[] = [];
  // Limit to 5 pages per PDF for better coverage of long CVs
  const maxPages = Math.min(pdf.numPages, 5);

  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    // Use 1.0 scale to keep image size manageable for local vision models
    const viewport = page.getViewport({ scale: 1.0 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) continue;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport }).promise;
    images.push(canvas.toDataURL("image/png"));
  }
  return images;
}
