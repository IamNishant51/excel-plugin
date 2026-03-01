/**
 * Extraction Integration - Connects the deterministic extraction pipeline with Office.js taskpane
 * 
 * This module provides the UI integration layer for:
 * - PDF file selection and upload
 * - Processing progress display
 * - Results summary with statistics
 * - Structured logging display
 * 
 * PROCESSING FLOW:
 * 1. User selects PDF files
 * 2. System reads Excel headers (schema)
 * 3. Each PDF is processed individually (never batched)
 * 4. Results are validated and written to Excel
 * 5. Rows needing review are highlighted in light yellow (#FFFF99)
 */

import { processDocuments, processSingleDocument, getPipelineStats } from "./pipeline";
import { DocumentProcessingStatus, PipelineConfig } from "./types";
import { getConfig, LLMConfig } from "./llm.service";

/**
 * Default pipeline configuration for production use
 */
const PRODUCTION_CONFIG: Partial<PipelineConfig> = {
  maxConcurrency: 5,        // Max 5 documents at a time
  confidenceThreshold: 0.8, // Mark for review if confidence < 0.8
  retryCount: 1,            // One retry on failure
  llmTemperature: 0,        // MUST be 0 for deterministic output
  topP: 1,                  // MUST be 1 for deterministic output
  enableStructuredLogging: true,
};

/**
 * Initialize the PDF upload and extraction UI
 * Call this function when the taskpane loads
 */
export function initializePDFExtraction(): void {
  const fileInput = document.getElementById("pdf-file-input") as HTMLInputElement;
  const processButton = document.getElementById("process-pdfs-btn") as HTMLButtonElement;
  const progressDiv = document.getElementById("extraction-progress") as HTMLDivElement;
  const resultsDiv = document.getElementById("extraction-results") as HTMLDivElement;

  // File selection handler
  fileInput?.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      processButton.disabled = false;
      processButton.textContent = `Process ${files.length} PDF${files.length > 1 ? "s" : ""}`;

      // Show file list
      if (progressDiv) {
        progressDiv.innerHTML = `<div class="file-list-preview">Selected: ${Array.from(files).map(f => f.name).join(", ")}</div>`;
      }
    }
  });

  // Process button handler
  processButton?.addEventListener("click", async () => {
    const files = fileInput?.files;
    if (!files || files.length === 0) return;

    processButton.disabled = true;
    processButton.textContent = "Processing...";
    progressDiv.innerHTML = "";
    resultsDiv.innerHTML = "";

    const startTime = Date.now();

    try {
      // Convert FileList to Array
      const fileArray = Array.from(files);

      // Process with production config and progress updates
      const statuses = await processDocuments(
        fileArray,
        PRODUCTION_CONFIG,
        getConfig(),
        (status) => {
          updateProgress(status, progressDiv);
        }
      );

      // Display results with timing
      const processingTime = Date.now() - startTime;
      displayResults(statuses, resultsDiv, processingTime);
    } catch (error) {
      resultsDiv.innerHTML = `
        <div class="error">
          <strong>Error:</strong> ${error instanceof Error ? error.message : String(error)}
        </div>
      `;
    } finally {
      processButton.disabled = false;
      processButton.textContent = "Process PDFs";
      fileInput.value = ""; // Clear input
    }
  });
}

/**
 * Update progress display for a single document
 */
function updateProgress(status: DocumentProcessingStatus, container: HTMLDivElement): void {
  const existingStatus = container.querySelector(`[data-doc-id="${status.documentId}"]`);

  if (existingStatus) {
    existingStatus.className = `status-item status-${status.status}`;
    existingStatus.innerHTML = getStatusHTML(status);
  } else {
    const statusElement = document.createElement("div");
    statusElement.className = `status-item status-${status.status}`;
    statusElement.setAttribute("data-doc-id", status.documentId);
    statusElement.innerHTML = getStatusHTML(status);
    container.appendChild(statusElement);
  }
}

/**
 * Get HTML for status display with detailed info
 */
function getStatusHTML(status: DocumentProcessingStatus): string {
  const icon = getStatusIcon(status.status);
  const fileName = status.fileName || status.documentId.split("_").slice(2).join("_");

  let html = `
    <div class="status-header">
      <span class="status-icon">${icon}</span>
      <span class="file-name">${fileName}</span>
      <span class="status-text">${formatStatus(status.status)}</span>
      ${status.confidence > 0 ? `<span class="confidence-badge">${(status.confidence * 100).toFixed(0)}%</span>` : ""}
    </div>
  `;

  if (status.error) {
    html += `<div class="error-message">${status.error}</div>`;
  }

  if (status.validation) {
    const { isValid, needsReview, errors } = status.validation;
    html += `
      <div class="validation-info">
        <span class="validation-badge ${isValid ? 'valid' : 'invalid'}">
          ${isValid ? '✓ Valid' : '✗ Invalid'}
        </span>
        ${needsReview ? '<span class="review-badge">⚠ Needs Review</span>' : ''}
        ${errors.length > 0 ? `<span class="error-count">${errors.length} issue(s)</span>` : ''}
      </div>
    `;
  }

  // Show extraction method breakdown
  if (status.regexExtractedFields || status.llmExtractedFields) {
    html += `
      <div class="extraction-info">
        ${status.regexExtractedFields?.length ? `<span class="regex-count">Regex: ${status.regexExtractedFields.length}</span>` : ''}
        ${status.llmExtractedFields?.length ? `<span class="llm-count">LLM: ${status.llmExtractedFields.length}</span>` : ''}
      </div>
    `;
  }

  return html;
}

/**
 * Format status for display
 */
function formatStatus(status: string): string {
  switch (status) {
    case "needs_review": return "Needs Review";
    case "completed": return "Completed";
    case "processing": return "Processing...";
    case "failed": return "Failed";
    case "pending": return "Pending";
    default: return status;
  }
}

/**
 * Get status icon for visual feedback
 */
function getStatusIcon(status: string): string {
  switch (status) {
    case "completed": return "✓";
    case "needs_review": return "⚠";
    case "processing": return "⏳";
    case "failed": return "✗";
    case "pending": return "⋯";
    default: return "•";
  }
}

/**
 * Display final results with comprehensive statistics
 */
function displayResults(statuses: DocumentProcessingStatus[], container: HTMLDivElement, processingTimeMs?: number): void {
  const stats = getPipelineStats(statuses);

  const html = `
    <div class="results-summary">
      <h3>Extraction Complete</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Total Documents</span>
          <span class="stat-value">${stats.total}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Completed</span>
          <span class="stat-value success">${stats.completed}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Failed</span>
          <span class="stat-value error">${stats.failed}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Needs Review</span>
          <span class="stat-value warning">${stats.needsReviewCount}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Success Rate</span>
          <span class="stat-value">${(stats.successRate * 100).toFixed(1)}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Avg Confidence</span>
          <span class="stat-value">${(stats.avgConfidence * 100).toFixed(0)}%</span>
        </div>
      </div>
      ${processingTimeMs ? `<p class="processing-time">Processing time: ${(processingTimeMs / 1000).toFixed(1)}s</p>` : ''}
      <p class="results-message">
        Data has been written to Excel. 
        ${stats.needsReviewCount > 0 ? `<strong>${stats.needsReviewCount} row(s)</strong> highlighted in yellow for review.` : 'All rows passed validation.'}
      </p>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Process a single file (for testing or individual uploads)
 */
export async function processSingleFile(file: File): Promise<DocumentProcessingStatus> {
  const status = await processSingleDocument(
    file,
    PRODUCTION_CONFIG,
    getConfig()
  );

  console.log("═══════════════════════════════════════════════════════════════════════════════");
  console.log("SINGLE DOCUMENT PROCESSING RESULT");
  console.log("═══════════════════════════════════════════════════════════════════════════════");
  console.log(`File: ${file.name}`);
  console.log(`Status: ${status.status}`);
  console.log(`Confidence: ${(status.confidence * 100).toFixed(0)}%`);

  if (status.status === "completed" || status.status === "needs_review") {
    console.log("Extracted data:", status.extractedData);
    console.log(`Regex fields: ${status.regexExtractedFields?.join(", ") || "none"}`);
    console.log(`LLM fields: ${status.llmExtractedFields?.join(", ") || "none"}`);
    if (status.validation) {
      console.log(`Validation: ${status.validation.isValid ? "PASSED" : "FAILED"}`);
      console.log(`Needs Review: ${status.validation.needsReview ? "YES" : "NO"}`);
      if (status.validation.errors.length > 0) {
        console.log("Validation errors:", status.validation.errors);
      }
    }
  } else if (status.error) {
    console.error("Processing failed:", status.error);
  }

  console.log("═══════════════════════════════════════════════════════════════════════════════");

  return status;
}

/**
 * Process multiple files with custom progress UI elements
 */
export async function processWithCustomProgress(files: File[]): Promise<DocumentProcessingStatus[]> {
  const progressBar = document.getElementById("progress-bar") as HTMLProgressElement;
  const statusText = document.getElementById("status-text") as HTMLSpanElement;

  let completed = 0;
  const total = files.length;

  const statuses = await processDocuments(
    files,
    PRODUCTION_CONFIG,
    getConfig(),
    (status) => {
      if (status.status === "completed" || status.status === "needs_review" || status.status === "failed") {
        completed++;
        if (progressBar) {
          progressBar.value = completed;
          progressBar.max = total;
        }
        if (statusText) {
          statusText.textContent = `Processing: ${completed} / ${total}`;
        }
      }
    }
  );

  if (statusText) {
    const stats = getPipelineStats(statuses);
    statusText.textContent = `Complete! ${stats.completed} successful, ${stats.failed} failed, ${stats.needsReviewCount} need review`;
  }

  return statuses;
}

/**
 * CSS styles for the extraction UI (add to your taskpane.css)
 */
export const extractionCSS = `
/* Status Items */
.status-item {
  padding: 12px;
  margin: 8px 0;
  border-radius: 4px;
  border-left: 4px solid #ccc;
  background-color: #fafafa;
  transition: all 0.2s ease;
}

.status-item.status-completed {
  background-color: #f0f9f0;
  border-left-color: #4caf50;
}

.status-item.status-needs_review {
  background-color: #fff9e6;
  border-left-color: #ff9800;
}

.status-item.status-processing {
  background-color: #e3f2fd;
  border-left-color: #2196f3;
}

.status-item.status-failed {
  background-color: #ffebee;
  border-left-color: #f44336;
}

.status-item.status-pending {
  background-color: #fafafa;
  border-left-color: #9e9e9e;
}

/* Status Header */
.status-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.status-icon {
  font-weight: bold;
  font-size: 16px;
  min-width: 20px;
}

.file-name {
  flex: 1;
  font-weight: 500;
  word-break: break-word;
  min-width: 100px;
}

.status-text {
  text-transform: capitalize;
  font-size: 12px;
  color: #666;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
}

.confidence-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 8px;
  background: #e0e0e0;
  font-weight: 600;
}

/* Validation Info */
.validation-info {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.validation-badge, .review-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.validation-badge.valid {
  background-color: #4caf50;
  color: white;
}

.validation-badge.invalid {
  background-color: #f44336;
  color: white;
}

.review-badge {
  background-color: #ff9800;
  color: white;
}

.error-count {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  background-color: #ffcdd2;
  color: #c62828;
}

/* Extraction Info */
.extraction-info {
  margin-top: 6px;
  display: flex;
  gap: 8px;
  font-size: 11px;
}

.regex-count, .llm-count {
  padding: 2px 6px;
  border-radius: 4px;
  background: #e8eaf6;
  color: #3f51b5;
}

/* Error Message */
.error-message {
  margin-top: 8px;
  padding: 8px;
  background-color: #ffebee;
  border-radius: 4px;
  font-size: 12px;
  color: #c62828;
}

/* Results Summary */
.results-summary {
  padding: 16px;
  background: linear-gradient(to bottom, #f5f5f5, #ffffff);
  border-radius: 8px;
  margin-top: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.results-summary h3 {
  margin: 0 0 16px 0;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-value.success { color: #4caf50; }
.stat-value.error { color: #f44336; }
.stat-value.warning { color: #ff9800; }

.processing-time {
  text-align: center;
  font-size: 12px;
  color: #888;
  margin: 8px 0;
}

.results-message {
  text-align: center;
  margin-top: 16px;
  color: #666;
  line-height: 1.5;
}

/* File List Preview */
.file-list-preview {
  padding: 8px 12px;
  background: #e8f5e9;
  border-radius: 4px;
  font-size: 12px;
  color: #2e7d32;
  word-break: break-word;
}

/* Upload Section */
.upload-section {
  text-align: center;
  padding: 20px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  margin-bottom: 16px;
}

.file-label {
  display: block;
  margin-bottom: 12px;
  cursor: pointer;
  color: #666;
}

.file-input {
  display: none;
}

.process-btn {
  padding: 10px 24px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.process-btn:hover:not(:disabled) {
  background: #1976d2;
}

.process-btn:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
}
`;

/**
 * Example HTML for taskpane (add to your taskpane.html)
 */
export const exampleHTML = `
<div class="pdf-extraction-container">
  <h2>Document Extraction</h2>
  
  <div class="upload-section">
    <label for="pdf-file-input" class="file-label">
      📄 Select PDF files to extract data
    </label>
    <input 
      type="file" 
      id="pdf-file-input" 
      accept=".pdf" 
      multiple 
      class="file-input"
    />
    <button 
      id="process-pdfs-btn" 
      class="process-btn" 
      disabled
    >
      Select files to begin
    </button>
  </div>

  <div id="extraction-progress" class="progress-container"></div>
  <div id="extraction-results" class="results-container"></div>
</div>
`;
