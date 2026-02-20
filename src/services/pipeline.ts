/**
 * Pipeline - Orchestrates the entire deterministic extraction process
 * 
 * PROCESSING FLOW:
 * 1. PDF extraction (pdf-parse/pdfjs) → plain text
 * 2. Schema reading (Office.js) → Excel headers
 * 3. Hybrid extraction:
 *    - REGEX for: email, phone, account numbers, IFSC, PAN, dates, invoice numbers
 *    - LLM for: semantic fields (Name, Address, Summary, Skills, etc.)
 * 4. Validation (Zod) → schema validation + field-specific rules
 * 5. Excel writing → with status column and highlighting
 * 
 * CRITICAL CONFIGURATIONS:
 * - Max concurrency: 5 documents at a time
 * - LLM temperature: 0 (deterministic)
 * - LLM top_p: 1 (deterministic)
 * - Confidence threshold: 0.8 (mark for review if below)
 */

import { extractTextFromPDFFile, extractTextFromMultiplePDFs } from "./pdfService";
import { getExcelHeaders, validateHeaders } from "./schemaReader";
import { extractMultipleFields, shouldUseRegex, smartExtract } from "./regexExtractor";
import { extractWithRetry, extractFromMultipleDocuments } from "./llmExtractor";
import { buildDynamicSchema, validateData, cleanData, validateMultiple, getValidationSummary } from "./validator";
import { writeToExcel, formatTable } from "./excelWriter";
import {
  PipelineConfig,
  DocumentProcessingStatus,
  ExtractedData,
  ValidationResult,
  ExcelWriteOptions,
  ProcessingLogEntry,
} from "./types";
import { LLMConfig } from "./llm.service";

/**
 * Default pipeline configuration - STRICT DETERMINISTIC SETTINGS
 */
const DEFAULT_CONFIG: PipelineConfig = {
  maxConcurrency: 5,      // Max 5 documents at a time
  retryCount: 1,          // One retry on failure
  llmTemperature: 0,      // MUST be 0 for determinism
  topP: 1,                // MUST be 1 for determinism
  confidenceThreshold: 0.8,
  enableStructuredLogging: true,
};

/**
 * Structured logger for document processing
 */
class PipelineLogger {
  private logs: ProcessingLogEntry[] = [];

  log(entry: Omit<ProcessingLogEntry, "timestamp">): void {
    const fullEntry: ProcessingLogEntry = {
      ...entry,
      timestamp: new Date(),
    };
    this.logs.push(fullEntry);
    
    // Also log to console for debugging
    const prefix = `[${entry.documentId}][${entry.phase}]`;
    if (entry.status === "failed") {
      console.error(prefix, entry.error || "Unknown error", entry.details);
    } else if (entry.status === "warning") {
      console.warn(prefix, entry.details);
    } else {
      console.log(prefix, entry.status, entry.details || "");
    }
  }

  getLogsForDocument(documentId: string): ProcessingLogEntry[] {
    return this.logs.filter(l => l.documentId === documentId);
  }

  getAllLogs(): ProcessingLogEntry[] {
    return [...this.logs];
  }

  clear(): void {
    this.logs = [];
  }
}

/**
 * Process multiple PDF documents through the complete extraction pipeline
 * 
 * IMPORTANT: Each PDF is processed individually, never batched into one LLM call
 * 
 * @param files - Array of PDF files to process
 * @param config - Pipeline configuration
 * @param llmConfig - LLM configuration
 * @param onProgress - Progress callback
 * @returns Array of processing statuses
 */
export async function processDocuments(
  files: File[],
  config: Partial<PipelineConfig> = {},
  llmConfig?: LLMConfig,
  onProgress?: (status: DocumentProcessingStatus) => void
): Promise<DocumentProcessingStatus[]> {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  // ENFORCE max concurrency of 5
  fullConfig.maxConcurrency = Math.min(fullConfig.maxConcurrency, 5);
  
  const statuses: DocumentProcessingStatus[] = [];
  const logger = new PipelineLogger();
  const startTime = Date.now();
  
  try {
    // Step 1: Read Excel schema (headers define what we extract)
    const headers = await getExcelHeaders();
    const headerValidation = validateHeaders(headers);
    
    logger.log({
      documentId: "system",
      phase: "pdf_extraction",
      status: "started",
      details: { totalFiles: files.length, headers, headerValidation },
    });
    
    if (!headerValidation.valid) {
      throw new Error(`Invalid headers: ${headerValidation.warnings.join(", ")}`);
    }
    
    // Classify fields into regex vs LLM extraction
    const regexFields = headers.filter(h => shouldUseRegex(h));
    const llmFields = headers.filter(h => !shouldUseRegex(h));
    
    logger.log({
      documentId: "system",
      phase: "pdf_extraction",
      status: "success",
      details: { regexFields, llmFields, totalHeaders: headers.length },
    });
    
    // Step 2: Build Zod validation schema dynamically from headers
    const validationSchema = buildDynamicSchema(headers);
    
    // Step 3: Extract text from all PDFs with controlled concurrency
    const pdfExtractions = await extractTextFromMultiplePDFs(files, fullConfig.maxConcurrency);
    
    // Step 4: Process each document INDIVIDUALLY (never batch LLM calls)
    const extractionResults: Array<{
      documentId: string;
      data: ExtractedData;
      confidence: number;
      file: File;
      regexExtractedFields: string[];
      llmExtractedFields: string[];
    }> = [];
    
    // Process documents in batches with controlled concurrency
    for (let batchStart = 0; batchStart < pdfExtractions.length; batchStart += fullConfig.maxConcurrency) {
      const batchEnd = Math.min(batchStart + fullConfig.maxConcurrency, pdfExtractions.length);
      const batch = pdfExtractions.slice(batchStart, batchEnd);
      
      // Process batch using Promise.allSettled for fault tolerance
      const batchPromises = batch.map(async (extraction, batchIndex) => {
        const globalIndex = batchStart + batchIndex;
        const documentId = `doc_${globalIndex + 1}_${extraction.file.name}`;
        
        // Initialize status
        const status: DocumentProcessingStatus = {
          documentId,
          fileName: extraction.file.name,
          status: "processing",
          confidence: 0,
          timestamp: new Date(),
          logs: [],
        };
        statuses.push(status);
        onProgress?.(status);
        
        const docStartTime = Date.now();
        
        // Log PDF extraction status
        if (extraction.error || !extraction.result) {
          logger.log({
            documentId,
            phase: "pdf_extraction",
            status: "failed",
            error: extraction.error || "PDF extraction failed",
          });
          status.status = "failed";
          status.error = extraction.error || "PDF extraction failed";
          status.logs = logger.getLogsForDocument(documentId);
          onProgress?.(status);
          return null;
        }
        
        logger.log({
          documentId,
          phase: "pdf_extraction",
          status: "success",
          duration: Date.now() - docStartTime,
          details: { pages: extraction.result.pages, textLength: extraction.result.text.length },
        });
        
        try {
          const extractionStartTime = Date.now();
          
          // Step 4a: REGEX extraction for structured fields (deterministic)
          logger.log({
            documentId,
            phase: "regex_extraction",
            status: "started",
            details: { fields: regexFields },
          });
          
          const regexData = extractMultipleFields(extraction.result.text, headers);
          const regexExtractedFields = Object.entries(regexData)
            .filter(([_, v]) => v !== null)
            .map(([k]) => k);
          
          logger.log({
            documentId,
            phase: "regex_extraction",
            status: "success",
            duration: Date.now() - extractionStartTime,
            details: { extractedFields: regexExtractedFields, extractedCount: regexExtractedFields.length },
          });
          
          // Step 4b: LLM extraction for semantic fields (if any remain)
          let llmData: ExtractedData = {};
          let confidence = 1.0;
          const llmExtractedFields: string[] = [];
          
          // Only call LLM for fields not extracted by regex
          const fieldsNeedingLLM = llmFields.filter(f => regexData[f] === null);
          
          if (fieldsNeedingLLM.length > 0) {
            logger.log({
              documentId,
              phase: "llm_extraction",
              status: "started",
              details: { fields: fieldsNeedingLLM },
            });
            
            const llmStartTime = Date.now();
            
            try {
              const llmResult = await extractWithRetry(
                {
                  schema: fieldsNeedingLLM,
                  text: extraction.result.text,
                  temperature: 0, // FORCE deterministic
                  topP: 1,        // FORCE deterministic
                },
                fullConfig.retryCount,
                llmConfig
              );
              llmData = llmResult.data;
              confidence = llmResult.confidence;
              
              // Track which fields LLM actually extracted
              Object.entries(llmData).forEach(([k, v]) => {
                if (v !== null) llmExtractedFields.push(k);
              });
              
              logger.log({
                documentId,
                phase: "llm_extraction",
                status: "success",
                duration: Date.now() - llmStartTime,
                details: { 
                  extractedFields: llmExtractedFields, 
                  confidence: confidence.toFixed(2),
                },
              });
            } catch (llmError) {
              logger.log({
                documentId,
                phase: "llm_extraction",
                status: "failed",
                duration: Date.now() - llmStartTime,
                error: llmError instanceof Error ? llmError.message : String(llmError),
              });
              // Continue with regex-only data
              confidence = 0.5;
            }
          }
          
          // Step 4c: Merge regex and LLM data (REGEX TAKES PRECEDENCE)
          const mergedData: ExtractedData = {};
          headers.forEach(header => {
            if (regexData[header] !== null) {
              mergedData[header] = regexData[header]; // Regex wins
            } else if (llmData[header] !== null) {
              mergedData[header] = llmData[header]; // LLM fallback
            } else {
              mergedData[header] = null; // Field not found
            }
          });
          
          // Step 4d: Clean and sanitize data
          const cleanedData = cleanData(mergedData);
          
          extractionResults.push({
            documentId,
            data: cleanedData,
            confidence,
            file: extraction.file,
            regexExtractedFields,
            llmExtractedFields,
          });
          
          status.extractedData = cleanedData;
          status.confidence = confidence;
          status.regexExtractedFields = regexExtractedFields;
          status.llmExtractedFields = llmExtractedFields;
          status.status = "completed";
          status.logs = logger.getLogsForDocument(documentId);
          onProgress?.(status);
          
          return { status, result: { documentId, data: cleanedData, confidence, file: extraction.file, regexExtractedFields, llmExtractedFields } };
        } catch (error) {
          status.status = "failed";
          status.error = error instanceof Error ? error.message : String(error);
          status.logs = logger.getLogsForDocument(documentId);
          onProgress?.(status);
          
          logger.log({
            documentId,
            phase: "llm_extraction",
            status: "failed",
            error: status.error,
          });
          
          return null;
        }
      });
      
      // Wait for batch to complete
      await Promise.allSettled(batchPromises);
      
      // Brief pause between batches to avoid rate limiting
      if (batchEnd < pdfExtractions.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Step 5: Validate all extracted data against Zod schema
    const validations = extractionResults.map(({ data, confidence, documentId }) => {
      logger.log({
        documentId,
        phase: "validation",
        status: "started",
      });
      
      const validation = validateData(data, validationSchema, fullConfig.confidenceThreshold, confidence);
      
      logger.log({
        documentId,
        phase: "validation",
        status: validation.isValid ? "success" : "warning",
        details: { 
          isValid: validation.isValid, 
          needsReview: validation.needsReview,
          errorCount: validation.errors.length,
        },
      });
      
      return validation;
    });
    
    // Add validation results to statuses
    extractionResults.forEach((result, i) => {
      const status = statuses.find(s => s.documentId === result.documentId);
      if (status) {
        status.validation = validations[i];
        if (validations[i].needsReview) {
          status.status = "needs_review";
        }
        status.logs = logger.getLogsForDocument(result.documentId);
      }
    });
    
    // Step 6: Write to Excel with status column and highlighting
    const dataToWrite = extractionResults.map(r => r.data);
    const writeOptions: ExcelWriteOptions = {
      highlightColor: "#FFFF99", // Light yellow for needs review (as per spec)
      addStatusColumn: true,
      skipInvalid: false,
    };
    
    logger.log({
      documentId: "system",
      phase: "excel_write",
      status: "started",
      details: { rowCount: dataToWrite.length },
    });
    
    try {
      await writeToExcel(dataToWrite, validations, writeOptions);
      await formatTable();
      
      logger.log({
        documentId: "system",
        phase: "excel_write",
        status: "success",
        duration: Date.now() - startTime,
        details: { rowsWritten: dataToWrite.length },
      });
    } catch (writeError) {
      logger.log({
        documentId: "system",
        phase: "excel_write",
        status: "failed",
        error: writeError instanceof Error ? writeError.message : String(writeError),
      });
      throw writeError;
    }
    
    // Step 7: Generate and log summary
    const summary = getValidationSummary(validations);
    const processingTime = Date.now() - startTime;
    
    console.log("═══════════════════════════════════════════════════════════════════════════════");
    console.log("EXTRACTION PIPELINE SUMMARY");
    console.log("═══════════════════════════════════════════════════════════════════════════════");
    console.log(`Total Documents: ${summary.total}`);
    console.log(`Valid: ${summary.valid} (${(summary.passRate * 100).toFixed(1)}%)`);
    console.log(`Invalid: ${summary.invalid}`);
    console.log(`Needs Review: ${summary.needsReview}`);
    console.log(`Processing Time: ${processingTime}ms`);
    console.log("═══════════════════════════════════════════════════════════════════════════════");
    
    return statuses;
  } catch (error) {
    throw new Error(`Pipeline failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Process a single PDF document
 * @param file - PDF file to process
 * @param config - Pipeline configuration
 * @param llmConfig - LLM configuration
 * @returns Processing status with logs
 */
export async function processSingleDocument(
  file: File,
  config: Partial<PipelineConfig> = {},
  llmConfig?: LLMConfig
): Promise<DocumentProcessingStatus> {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const documentId = `doc_${file.name}`;
  const logger = new PipelineLogger();
  
  const status: DocumentProcessingStatus = {
    documentId,
    fileName: file.name,
    status: "processing",
    confidence: 0,
    timestamp: new Date(),
    logs: [],
  };
  
  try {
    // Extract text from PDF
    logger.log({ documentId, phase: "pdf_extraction", status: "started" });
    const pdfResult = await extractTextFromPDFFile(file);
    logger.log({ 
      documentId, 
      phase: "pdf_extraction", 
      status: "success",
      details: { pages: pdfResult.pages, textLength: pdfResult.text.length },
    });
    
    // Get Excel headers (these define our schema)
    const headers = await getExcelHeaders();
    
    // Hybrid extraction: regex first, then LLM for remaining
    logger.log({ documentId, phase: "regex_extraction", status: "started" });
    const regexData = extractMultipleFields(pdfResult.text, headers);
    const regexExtractedFields = Object.entries(regexData)
      .filter(([_, v]) => v !== null)
      .map(([k]) => k);
    logger.log({ 
      documentId, 
      phase: "regex_extraction", 
      status: "success",
      details: { extractedFields: regexExtractedFields },
    });
    
    const semanticFields = headers.filter(header => !shouldUseRegex(header));
    
    let llmData: ExtractedData = {};
    let confidence = 1.0;
    const llmExtractedFields: string[] = [];
    
    // Only use LLM for fields not extracted by regex
    const fieldsNeedingLLM = semanticFields.filter(f => regexData[f] === null);
    
    if (fieldsNeedingLLM.length > 0) {
      logger.log({ documentId, phase: "llm_extraction", status: "started", details: { fields: fieldsNeedingLLM } });
      
      try {
        const llmResult = await extractWithRetry(
          {
            schema: fieldsNeedingLLM,
            text: pdfResult.text,
            temperature: 0,  // FORCE deterministic
            topP: 1,         // FORCE deterministic
          },
          fullConfig.retryCount,
          llmConfig
        );
        llmData = llmResult.data;
        confidence = llmResult.confidence;
        
        Object.entries(llmData).forEach(([k, v]) => {
          if (v !== null) llmExtractedFields.push(k);
        });
        
        logger.log({ 
          documentId, 
          phase: "llm_extraction", 
          status: "success",
          details: { extractedFields: llmExtractedFields, confidence: confidence.toFixed(2) },
        });
      } catch (llmError) {
        logger.log({ 
          documentId, 
          phase: "llm_extraction", 
          status: "failed",
          error: llmError instanceof Error ? llmError.message : String(llmError),
        });
        confidence = 0.5;
      }
    }
    
    // Merge and clean (regex takes precedence)
    const mergedData: ExtractedData = {};
    headers.forEach(header => {
      mergedData[header] = regexData[header] ?? llmData[header] ?? null;
    });
    const cleanedData = cleanData(mergedData);
    
    // Validate
    logger.log({ documentId, phase: "validation", status: "started" });
    const validationSchema = buildDynamicSchema(headers);
    const validation = validateData(cleanedData, validationSchema, fullConfig.confidenceThreshold, confidence);
    logger.log({ 
      documentId, 
      phase: "validation", 
      status: validation.isValid ? "success" : "warning",
      details: { isValid: validation.isValid, needsReview: validation.needsReview },
    });
    
    status.extractedData = cleanedData;
    status.validation = validation;
    status.confidence = confidence;
    status.regexExtractedFields = regexExtractedFields;
    status.llmExtractedFields = llmExtractedFields;
    status.status = validation.needsReview ? "needs_review" : "completed";
    status.logs = logger.getLogsForDocument(documentId);
    
    return status;
  } catch (error) {
    status.status = "failed";
    status.error = error instanceof Error ? error.message : String(error);
    status.logs = logger.getLogsForDocument(documentId);
    return status;
  }
}

/**
 * Batch process with controlled concurrency (max 5 documents at a time)
 * Uses Promise.allSettled for fault tolerance
 * 
 * @param files - Array of PDF files
 * @param batchSize - Number of files to process in parallel (max 5)
 * @param config - Pipeline configuration
 * @param llmConfig - LLM configuration
 * @param onBatchComplete - Callback after each batch
 * @returns Array of processing statuses
 */
export async function processBatched(
  files: File[],
  batchSize: number = 5,
  config: Partial<PipelineConfig> = {},
  llmConfig?: LLMConfig,
  onBatchComplete?: (batchResults: DocumentProcessingStatus[]) => void
): Promise<DocumentProcessingStatus[]> {
  // ENFORCE max concurrency of 5
  const effectiveBatchSize = Math.min(batchSize, 5);
  const allStatuses: DocumentProcessingStatus[] = [];
  
  for (let i = 0; i < files.length; i += effectiveBatchSize) {
    const batch = files.slice(i, i + effectiveBatchSize);
    const batchStatuses = await processDocuments(batch, config, llmConfig);
    allStatuses.push(...batchStatuses);
    onBatchComplete?.(batchStatuses);
    
    // Brief pause between batches to avoid rate limiting
    if (i + effectiveBatchSize < files.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return allStatuses;
}

/**
 * Reprocess failed documents
 * @param statuses - Previous processing statuses
 * @param files - Original files array
 * @param config - Pipeline configuration
 * @param llmConfig - LLM configuration
 * @returns Updated statuses
 */
export async function reprocessFailed(
  statuses: DocumentProcessingStatus[],
  files: File[],
  config: Partial<PipelineConfig> = {},
  llmConfig?: LLMConfig
): Promise<DocumentProcessingStatus[]> {
  const failedIndices = statuses
    .map((status, index) => (status.status === "failed" ? index : -1))
    .filter(index => index >= 0);
  
  const failedFiles = failedIndices.map(index => files[index]).filter(Boolean);
  
  if (failedFiles.length === 0) {
    return statuses;
  }
  
  const reprocessedStatuses = await processDocuments(failedFiles, config, llmConfig);
  
  // Update original statuses
  failedIndices.forEach((originalIndex, i) => {
    statuses[originalIndex] = reprocessedStatuses[i];
  });
  
  return statuses;
}

/**
 * Extract specific field from text (utility function)
 * @param text - Document text
 * @param fieldName - Field to extract
 * @returns Extracted value or null
 */
export function extractField(text: string, fieldName: string): string | null {
  // Try regex first
  const regexResult = smartExtract(text, fieldName);
  if (regexResult) return regexResult;
  
  // If regex fails, return null (don't use LLM for single field)
  return null;
}

/**
 * Validate pipeline configuration
 */
export function validatePipelineConfig(config: Partial<PipelineConfig>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config.maxConcurrency !== undefined) {
    if (config.maxConcurrency < 1 || config.maxConcurrency > 10) {
      errors.push("maxConcurrency must be between 1 and 10");
    }
  }
  
  if (config.confidenceThreshold !== undefined) {
    if (config.confidenceThreshold < 0 || config.confidenceThreshold > 1) {
      errors.push("confidenceThreshold must be between 0 and 1");
    }
  }
  
  if (config.llmTemperature !== undefined) {
    if (config.llmTemperature < 0 || config.llmTemperature > 1) {
      errors.push("llmTemperature must be between 0 and 1");
    }
  }
  
  if (config.retryCount !== undefined) {
    if (config.retryCount < 0 || config.retryCount > 5) {
      errors.push("retryCount must be between 0 and 5");
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Get pipeline statistics with detailed metrics
 */
export function getPipelineStats(statuses: DocumentProcessingStatus[]): {
  total: number;
  completed: number;
  failed: number;
  processing: number;
  needsReview: number;
  successRate: number;
  avgConfidence: number;
  needsReviewCount: number;
  fieldExtractionRates: Record<string, number>;
} {
  const total = statuses.length;
  const completed = statuses.filter(s => s.status === "completed" || s.status === "needs_review").length;
  const failed = statuses.filter(s => s.status === "failed").length;
  const processing = statuses.filter(s => s.status === "processing").length;
  const needsReview = statuses.filter(s => s.status === "needs_review" || s.validation?.needsReview).length;
  const successRate = total > 0 ? completed / total : 0;
  
  // Calculate average confidence
  const completedStatuses = statuses.filter(s => s.status === "completed" || s.status === "needs_review");
  const avgConfidence = completedStatuses.length > 0
    ? completedStatuses.reduce((sum, s) => sum + (s.confidence || 0), 0) / completedStatuses.length
    : 0;
  
  // Calculate field extraction rates
  const fieldExtractionRates: Record<string, number> = {};
  if (completedStatuses.length > 0 && completedStatuses[0]?.extractedData) {
    const fields = Object.keys(completedStatuses[0].extractedData);
    fields.forEach(field => {
      const extractedCount = completedStatuses.filter(
        s => s.extractedData?.[field] !== null && s.extractedData?.[field] !== undefined
      ).length;
      fieldExtractionRates[field] = total > 0 ? extractedCount / total : 0;
    });
  }
  
  return {
    total,
    completed,
    failed,
    processing,
    needsReview,
    successRate,
    avgConfidence,
    needsReviewCount: needsReview,
    fieldExtractionRates,
  };
}
