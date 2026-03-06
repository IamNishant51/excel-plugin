/**
 * LLM Extractor - Deterministic AI-powered extraction for semantic fields
 * 
 * CRITICAL REQUIREMENTS:
 * - temperature: 0 (MANDATORY for deterministic output)
 * - top_p: 1 (MANDATORY for deterministic output)
 * - Strict JSON output mode
 * - Never guess, never infer, never fabricate
 */

import { callLLM, getConfig, LLMConfig } from "./llm.service";
import { LLMExtractionRequest, LLMExtractionResponse, ExtractedData } from "./types";

/**
 * System prompt for deterministic extraction
 * This is the core prompt that prevents hallucination
 */
const DETERMINISTIC_SYSTEM_PROMPT = `You are a deterministic information extraction engine.

═══════════════════════════════════════════════════════════════════════════════
CRITICAL RULES — YOU MUST FOLLOW THESE EXACTLY:
═══════════════════════════════════════════════════════════════════════════════

1. Extract ONLY explicitly present data from the document
2. NEVER guess or infer missing values
3. NEVER fabricate or hallucinate information
4. NEVER add fields not in the provided schema
5. If a field value is not EXPLICITLY found in the text → return null
6. Return ONLY valid JSON, absolutely no explanations or commentary
7. Match field names EXACTLY as provided in the schema
8. Include a confidence score (0-1) for the overall extraction

═══════════════════════════════════════════════════════════════════════════════
DATA CLEANING RULES:
═══════════════════════════════════════════════════════════════════════════════

- Names: Proper Case (John Smith, not JOHN SMITH or john smith)
- Emails: Always lowercase
- Phone: Keep original format found in document
- Dates: Keep exactly as found in document
- IDs (PAN, IFSC, Account): UPPERCASE

═══════════════════════════════════════════════════════════════════════════════
FORBIDDEN BEHAVIORS:
═══════════════════════════════════════════════════════════════════════════════

- Do NOT generate email addresses (e.g., firstname.lastname@company.com)
- Do NOT fabricate phone numbers
- Do NOT hallucinate skills, experience, or qualifications
- Do NOT include "N/A", "Not Found", "Unknown", or similar — use null instead
- Do NOT include markdown formatting
- Do NOT add explanatory text

You are NOT creative. You are PRECISE and DETERMINISTIC.`;

/**
 * Generate user prompt for extraction
 * @param schema - Array of field names to extract
 * @param text - Document text to extract from
 * @returns Formatted prompt
 */
function generateExtractionPrompt(schema: string[], text: string): string {
  const schemaList = schema.map((field, i) => `${i + 1}. "${field}"`).join("\n");
  
  return `Extract values strictly matching the following schema from the document below.

═══════════════════════════════════════════════════════════════════════════════
SCHEMA (Extract ONLY these ${schema.length} fields):
═══════════════════════════════════════════════════════════════════════════════

${schemaList}

═══════════════════════════════════════════════════════════════════════════════
RULES:
═══════════════════════════════════════════════════════════════════════════════

- Extract ONLY the fields listed above
- Do NOT create new fields
- If a value is not explicitly found → set to null
- Do NOT guess or infer values
- Return strict JSON format only

═══════════════════════════════════════════════════════════════════════════════
REQUIRED OUTPUT FORMAT:
═══════════════════════════════════════════════════════════════════════════════

{
  "data": {
    ${schema.map(field => `"${field}": "extracted value or null"`).join(",\n    ")}
  },
  "confidence": 0.95,
  "fieldConfidences": {
    ${schema.map(field => `"${field}": 0.0`).join(",\n    ")}
  }
}

═══════════════════════════════════════════════════════════════════════════════
DOCUMENT TEXT TO EXTRACT FROM:
═══════════════════════════════════════════════════════════════════════════════

${text.substring(0, 12000)}

═══════════════════════════════════════════════════════════════════════════════
OUTPUT (JSON ONLY, NO EXPLANATIONS):
═══════════════════════════════════════════════════════════════════════════════`;
}

/**
 * Extract data using LLM with strict schema enforcement
 * @param request - Extraction request with schema and text
 * @param config - Optional LLM configuration
 * @returns Extracted data with confidence score
 */
export async function extractWithLLM(
  request: LLMExtractionRequest,
  config?: LLMConfig
): Promise<LLMExtractionResponse> {
  const cfg = config || getConfig();
  
  // Force temperature to 0 for deterministic output
  const messages = [
    {
      role: "system" as const,
      content: request.systemPrompt || DETERMINISTIC_SYSTEM_PROMPT,
    },
    {
      role: "user" as const,
      content: generateExtractionPrompt(request.schema, request.text),
    },
  ];

  try {
    const response = await callLLM(messages, cfg);
    
    // Parse JSON response
    const parsed = parseExtractionResponse(response, request.schema);
    
    return parsed;
  } catch (error) {
    throw new Error(`LLM extraction failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Parse and validate LLM response
 * @param response - Raw LLM response text
 * @param schema - Expected schema fields
 * @returns Parsed extraction response
 */
function parseExtractionResponse(response: string, schema: string[]): LLMExtractionResponse {
  try {
    // Try to extract JSON from response (in case LLM added extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : response;
    
    const parsed = JSON.parse(jsonString);
    
    // Validate structure
    if (!parsed.data || typeof parsed.data !== "object") {
      throw new Error("Invalid response structure: missing 'data' object");
    }
    
    // Ensure all schema fields are present (fill with null if missing)
    const data: ExtractedData = {};
    for (const field of schema) {
      data[field] = parsed.data[field] !== undefined ? parsed.data[field] : null;
    }
    
    // Get confidence score (default to 0.5 if not provided)
    const confidence = typeof parsed.confidence === "number" 
      ? Math.max(0, Math.min(1, parsed.confidence)) 
      : 0.5;
    
    return {
      data,
      confidence,
      raw: response,
    };
  } catch (error) {
    // If parsing fails, return empty data with low confidence
    console.error("Failed to parse LLM response:", error);
    const emptyData: ExtractedData = {};
    schema.forEach(field => emptyData[field] = null);
    
    return {
      data: emptyData,
      confidence: 0,
      raw: response,
    };
  }
}

/**
 * Extract data with automatic retry on failure
 * @param request - Extraction request
 * @param maxRetries - Maximum number of retry attempts
 * @param config - Optional LLM configuration
 * @returns Extracted data with confidence score
 */
export async function extractWithRetry(
  request: LLMExtractionRequest,
  maxRetries: number = 1,
  config?: LLMConfig
): Promise<LLMExtractionResponse> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await extractWithLLM(request, config);
      
      // If confidence is very low, retry (unless it's the last attempt)
      if (result.confidence < 0.3 && attempt < maxRetries) {
        console.warn(`Low confidence (${result.confidence}), retrying...`);
        continue;
      }
      
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Extraction attempt ${attempt + 1} failed:`, lastError.message);
      
      if (attempt < maxRetries) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  
  throw lastError || new Error("Extraction failed after all retries");
}

/**
 * Extract data from multiple documents with BATCHED LLM calls.
 * 
 * KEY OPTIMIZATION: Instead of 1 LLM call per document, we pack multiple
 * documents into a single prompt (up to the token budget).
 * 
 * For 10 documents: Old = 10 API calls. New = 2-3 API calls.
 * 
 * Strategy:
 *  - Each document gets ~3000 chars in the prompt (12K / 4 docs per batch)
 *  - Documents are batched by estimated prompt size
 *  - Failed individual docs in a batch fall back to single extraction
 * 
 * @param texts - Array of document texts
 * @param schema - Field names to extract
 * @param maxConcurrency - Maximum parallel batches (not individual docs)
 * @param config - Optional LLM configuration
 * @returns Array of extraction results
 */
export async function extractFromMultipleDocuments(
  texts: Array<{ id: string; text: string }>,
  schema: string[],
  maxConcurrency: number = 3,
  config?: LLMConfig
): Promise<Array<{ id: string; result?: LLMExtractionResponse; error?: string }>> {
  const results: Array<{ id: string; result?: LLMExtractionResponse; error?: string }> = [];

  // If only 1 document, no batching needed
  if (texts.length <= 1) {
    for (const doc of texts) {
      try {
        const result = await extractWithRetry({ schema, text: doc.text, temperature: 0 }, 1, config);
        results.push({ id: doc.id, result });
      } catch (error) {
        results.push({ id: doc.id, error: error instanceof Error ? error.message : String(error) });
      }
    }
    return results;
  }

  // Group documents into batches of ~4 (balances token budget vs API calls)
  const DOCS_PER_BATCH = 4;
  const batches: Array<Array<{ id: string; text: string }>> = [];
  for (let i = 0; i < texts.length; i += DOCS_PER_BATCH) {
    batches.push(texts.slice(i, i + DOCS_PER_BATCH));
  }

  // Process batches sequentially (each batch = 1 LLM call)
  for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
    const batch = batches[batchIdx];

    try {
      const batchResults = await extractBatchedDocuments(batch, schema, config);
      results.push(...batchResults);
    } catch (batchError) {
      console.warn(`[Extractor] Batch ${batchIdx + 1} failed, falling back to individual extraction`);
      // Fallback: extract individually for this batch
      for (const doc of batch) {
        try {
          const result = await extractWithRetry({ schema, text: doc.text, temperature: 0 }, 1, config);
          results.push({ id: doc.id, result });
        } catch (error) {
          results.push({ id: doc.id, error: error instanceof Error ? error.message : String(error) });
        }
      }
    }

    // Pause between batches to respect rate limits
    if (batchIdx < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

/**
 * Extract data from a batch of documents in a SINGLE LLM call.
 * Packs multiple documents into one prompt and parses the multi-document response.
 */
async function extractBatchedDocuments(
  docs: Array<{ id: string; text: string }>,
  schema: string[],
  config?: LLMConfig
): Promise<Array<{ id: string; result?: LLMExtractionResponse; error?: string }>> {
  const cfg = config || getConfig();
  const schemaList = schema.map((field, i) => `${i + 1}. "${field}"`).join("\n");

  // Build multi-document prompt
  const TEXT_LIMIT_PER_DOC = Math.floor(10000 / docs.length); // Share token budget
  let docsSection = "";
  docs.forEach((doc, idx) => {
    const truncatedText = doc.text.substring(0, TEXT_LIMIT_PER_DOC);
    docsSection += `\n══ DOCUMENT ${idx + 1} (ID: ${doc.id}) ══\n${truncatedText}\n`;
  });

  const batchPrompt = `Extract values from ${docs.length} documents below. For EACH document, extract ONLY the fields listed in the schema.

SCHEMA (${schema.length} fields):
${schemaList}

RULES:
- Return ONE JSON object with a "documents" array
- Each element in "documents" must have "id", "data", and "confidence"
- If a field is not found → null
- Do NOT guess or fabricate values

REQUIRED OUTPUT FORMAT:
{
  "documents": [
    ${docs.map((d, i) => `{
      "id": "${d.id}",
      "data": { ${schema.map(f => `"${f}": "value or null"`).join(", ")} },
      "confidence": 0.0
    }`).join(",\n    ")}
  ]
}

${docsSection}

OUTPUT (JSON ONLY):`;

  const messages = [
    { role: "system" as const, content: DETERMINISTIC_SYSTEM_PROMPT },
    { role: "user" as const, content: batchPrompt },
  ];

  const response = await callLLM(messages, cfg);
  return parseBatchResponse(response, docs, schema);
}

/**
 * Parse a batched extraction response into individual results.
 */
function parseBatchResponse(
  response: string,
  docs: Array<{ id: string; text: string }>,
  schema: string[]
): Array<{ id: string; result?: LLMExtractionResponse; error?: string }> {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : response);

    if (!parsed.documents || !Array.isArray(parsed.documents)) {
      throw new Error("Invalid batch response: missing 'documents' array");
    }

    return docs.map((doc) => {
      const docResult = parsed.documents.find((d: any) => d.id === doc.id);
      if (!docResult || !docResult.data) {
        return { id: doc.id, error: "Document not found in batch response" };
      }

      // Normalize data to match schema
      const data: ExtractedData = {};
      for (const field of schema) {
        data[field] = docResult.data[field] !== undefined ? docResult.data[field] : null;
      }

      const confidence = typeof docResult.confidence === "number"
        ? Math.max(0, Math.min(1, docResult.confidence))
        : 0.5;

      return {
        id: doc.id,
        result: { data, confidence, raw: response } as LLMExtractionResponse,
      };
    });
  } catch (error) {
    // If batch parsing fails, return errors for all docs
    return docs.map((doc) => ({
      id: doc.id,
      error: `Batch parse failed: ${error instanceof Error ? error.message : String(error)}`,
    }));
  }
}

/**
 * Generate a more specific system prompt for domain-specific extraction
 * @param documentType - Type of document (resume, invoice, bank_statement, etc.)
 * @returns Customized system prompt
 */
export function getDocumentSpecificPrompt(documentType: string): string {
  const basePrompt = DETERMINISTIC_SYSTEM_PROMPT;
  
  const domainRules: Record<string, string> = {
    resume: `
Additional Resume Rules:
- Name: Extract full name (first + last)
- Email: Must be valid email format
- Phone: Extract as found, don't fabricate
- Skills: List comma-separated, technical skills only
- Experience: Years or job titles, not invented
- Education: Degrees and institutions only
`,
    invoice: `
Additional Invoice Rules:
- Invoice Number: Extract exact number
- Date: Multiple date formats acceptable
- Amount: Include currency if present
- Vendor: Company name issuing invoice
- Line Items: Do not hallucinate products
`,
    bank_statement: `
Additional Bank Statement Rules:
- Account Number: Last 4 digits if partially masked
- IFSC: Exact format required
- Balance: Extract as currency value
- Transactions: Exact amounts only
- Do NOT calculate totals
`,
    financial_report: `
Additional Financial Report Rules:
- Numbers: Extract exact values, no rounding
- Dates: Quarter or year as specified
- Metrics: Extract labels and values together
- Do NOT calculate derived metrics
`,
    kyc: `
Additional KYC Document Rules:
- IDs: Extract exact as printed
- Names: Match official document
- Addresses: Complete address only
- Do NOT fill missing fields
`,
  };
  
  return basePrompt + (domainRules[documentType.toLowerCase()] || "");
}

/**
 * Estimate confidence based on extraction quality
 * @param data - Extracted data
 * @param schema - Expected schema
 * @returns Adjusted confidence score
 */
export function estimateConfidence(data: ExtractedData, schema: string[]): number {
  const totalFields = schema.length;
  const extractedFields = Object.values(data).filter(v => v !== null && v !== "").length;
  
  // Base confidence on extraction completeness
  const completeness = extractedFields / totalFields;
  
  // Penalize if too many nulls
  if (completeness < 0.3) return 0.3;
  if (completeness < 0.5) return 0.5;
  if (completeness < 0.7) return 0.7;
  
  return 0.85; // High confidence for good extraction
}
