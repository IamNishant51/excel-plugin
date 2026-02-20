/**
 * Shared TypeScript interfaces for the deterministic extraction pipeline
 * 
 * CORE PRINCIPLE: The Excel sheet defines the schema.
 * The AI must extract ONLY values that match existing column headers.
 * It must NEVER invent fields. It must NEVER infer missing values.
 * If a value is not explicitly found → return null.
 */

/**
 * Extracted data for a single document
 */
export interface ExtractedData {
  [field: string]: string | null;
}

/**
 * Extraction result with confidence score and metadata
 */
export interface ExtractionResult {
  data: ExtractedData;
  confidence: number; // 0-1
  documentId: string;
  extractionMethod: "regex" | "llm" | "hybrid";
  fieldConfidences?: Record<string, number>; // Per-field confidence scores
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  needsReview: boolean;
  validatedAt: Date;
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  value: any;
  message: string;
  rule: string;
  severity: "error" | "warning";
}

/**
 * Structured log entry for document processing
 */
export interface ProcessingLogEntry {
  documentId: string;
  timestamp: Date;
  phase: "pdf_extraction" | "regex_extraction" | "llm_extraction" | "validation" | "excel_write";
  status: "started" | "success" | "failed" | "warning";
  duration?: number;
  details?: Record<string, any>;
  error?: string;
}

/**
 * Processing status for a document (enhanced)
 */
export interface DocumentProcessingStatus {
  documentId: string;
  fileName: string;
  status: "pending" | "processing" | "completed" | "failed" | "needs_review";
  extractedData?: ExtractedData;
  regexExtractedFields?: string[];
  llmExtractedFields?: string[];
  validation?: ValidationResult;
  confidence: number;
  error?: string;
  timestamp: Date;
  logs: ProcessingLogEntry[];
  rowIndex?: number; // Row index in Excel after write
}

/**
 * Pipeline configuration (stricter defaults)
 */
export interface PipelineConfig {
  maxConcurrency: number; // Default: 5
  retryCount: number; // Default: 1
  llmTemperature: number; // MUST be 0 for determinism
  topP: number; // MUST be 1 for determinism
  confidenceThreshold: number; // Default: 0.8
  enableStructuredLogging: boolean;
}

/**
 * Field extraction configuration
 */
export interface FieldConfig {
  name: string;
  type: "regex" | "llm" | "both";
  regexPattern?: RegExp;
  validation?: (value: string) => boolean;
  transform?: (value: string) => string;
  priority: "regex" | "llm"; // Which extraction method takes precedence
}

/**
 * Excel write options
 */
export interface ExcelWriteOptions {
  highlightColor?: string; // Default: #FFFF99 (light yellow)
  addStatusColumn?: boolean;
  skipInvalid?: boolean;
  tableName?: string;
}

/**
 * PDF extraction result
 */
export interface PDFExtractionResult {
  text: string;
  pages: number;
  wordCount: number;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    creationDate?: string;
  };
}

/**
 * LLM extraction request (strict parameters)
 */
export interface LLMExtractionRequest {
  schema: string[];
  text: string;
  systemPrompt?: string;
  temperature?: number; // Should always be 0
  topP?: number; // Should always be 1
  documentType?: "resume" | "invoice" | "bank_statement" | "financial_report" | "kyc" | "general";
}

/**
 * LLM extraction response with per-field confidence
 */
export interface LLMExtractionResponse {
  data: ExtractedData;
  confidence: number;
  fieldConfidences?: Record<string, number>;
  raw?: string;
  tokensUsed?: number;
}

/**
 * Batch processing result
 */
export interface BatchProcessingResult {
  total: number;
  completed: number;
  failed: number;
  needsReview: number;
  statuses: DocumentProcessingStatus[];
  summary: ProcessingSummary;
}

/**
 * Processing summary statistics
 */
export interface ProcessingSummary {
  totalDocuments: number;
  successfulExtractions: number;
  failedExtractions: number;
  needsReviewCount: number;
  averageConfidence: number;
  fieldExtractionRates: Record<string, number>;
  processingTimeMs: number;
}
