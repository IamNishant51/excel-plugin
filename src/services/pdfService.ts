/**
 * PDF Service - Extracts plain text from PDFs using pdf-parse
 * This provides clean text extraction before LLM processing
 */

import * as pdfjsLib from "pdfjs-dist";
import { PDFExtractionResult } from "./types";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extract text from a PDF file using PDF.js (browser-compatible)
 * @param fileBuffer - ArrayBuffer of the PDF file
 * @returns Extracted text and metadata
 */
export async function extractTextFromPDF(fileBuffer: ArrayBuffer): Promise<PDFExtractionResult> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
    const pdf = await loadingTask.promise;

    const totalPages = pdf.numPages;
    let fullText = "";

    // Extract text from each page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items with proper spacing
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      
      fullText += pageText + "\n\n";
    }

    // Extract metadata
    const metadata = await pdf.getMetadata();
    const info = metadata.info as any;
    
    return {
      text: cleanExtractedText(fullText),
      pages: totalPages,
      metadata: {
        title: info?.Title,
        author: info?.Author,
        subject: info?.Subject,
        creator: info?.Creator,
      },
    };
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract text from a PDF file (File object from input)
 * @param file - File object from file input
 * @returns Extracted text and metadata
 */
export async function extractTextFromPDFFile(file: File): Promise<PDFExtractionResult> {
  const arrayBuffer = await file.arrayBuffer();
  return extractTextFromPDF(arrayBuffer);
}

/**
 * Extract text from a base64-encoded PDF string
 * @param base64String - Base64-encoded PDF data
 * @returns Extracted text and metadata
 */
export async function extractTextFromBase64PDF(base64String: string): Promise<PDFExtractionResult> {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:application\/pdf;base64,/, "");
  
  // Convert base64 to ArrayBuffer
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return extractTextFromPDF(bytes.buffer);
}

/**
 * Clean and normalize extracted text
 * @param text - Raw extracted text
 * @returns Cleaned text
 */
function cleanExtractedText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, " ")
    // Remove control characters except newlines
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "")
    // Normalize line breaks
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Remove multiple consecutive newlines (keep max 2)
    .replace(/\n{3,}/g, "\n\n")
    // Trim leading/trailing whitespace
    .trim();
}

/**
 * Validate if a buffer is a valid PDF
 * @param buffer - ArrayBuffer to validate
 * @returns True if valid PDF
 */
export function isValidPDF(buffer: ArrayBuffer): boolean {
  const uint8Array = new Uint8Array(buffer);
  // PDF files start with %PDF-
  return (
    uint8Array.length >= 5 &&
    uint8Array[0] === 0x25 && // %
    uint8Array[1] === 0x50 && // P
    uint8Array[2] === 0x44 && // D
    uint8Array[3] === 0x46 && // F
    uint8Array[4] === 0x2d    // -
  );
}

/**
 * Extract text from multiple PDFs in parallel
 * @param files - Array of File objects
 * @param maxConcurrency - Maximum parallel extractions
 * @returns Array of extraction results
 */
export async function extractTextFromMultiplePDFs(
  files: File[],
  maxConcurrency: number = 5
): Promise<Array<{ file: File; result?: PDFExtractionResult; error?: string }>> {
  const results: Array<{ file: File; result?: PDFExtractionResult; error?: string }> = [];
  
  for (let i = 0; i < files.length; i += maxConcurrency) {
    const batch = files.slice(i, i + maxConcurrency);
    
    const batchResults = await Promise.allSettled(
      batch.map(async (file) => {
        try {
          const result = await extractTextFromPDFFile(file);
          return { file, result };
        } catch (error) {
          return {
            file,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      })
    );
    
    batchResults.forEach((settled) => {
      if (settled.status === "fulfilled") {
        results.push(settled.value);
      } else {
        results.push({
          file: batch[results.length % maxConcurrency],
          error: settled.reason,
        });
      }
    });
  }
  
  return results;
}
