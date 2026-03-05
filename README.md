# SheetOS AI / DocOS AI

An Office add-in that brings AI-powered automation to Excel and Word. It handles everything from data cleaning and formula generation to resume parsing and document formatting -- all through natural language commands.

Built for professionals who want to get more done in Excel and Word without writing macros or memorizing complex formulas.

---

## What It Does

**SheetOS AI** (Excel) and **DocOS AI** (Word) sit inside your Office applications as a taskpane. You describe what you want in plain English, and the engine figures out how to do it safely -- generating code, validating it against a strict whitelist, previewing the changes, and only then executing.

There is no black box. Every action goes through intent classification, AST validation, and a dry-run preview before anything touches your spreadsheet or document.

---

## Table of Contents

- [Features](#features)
  - [Excel Capabilities](#excel-capabilities)
  - [Word Capabilities](#word-capabilities)
  - [Business Modules](#business-modules)
  - [Document Extraction Pipeline](#document-extraction-pipeline)
- [Architecture](#architecture)
- [LLM Providers](#llm-providers)
- [Security](#security)
- [Getting Started](#getting-started)
- [Available Commands](#available-commands)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Features

### Excel Capabilities

**Data Cleaning** -- Remove duplicates, trim whitespace, convert text-to-numbers, standardize casing, strip hyperlinks, clear empty rows. Handles the tedious cleanup work that eats up hours.

**Formula Generation** -- Auto-generate SUM, AVERAGE, VLOOKUP, SUMIF, conditional IF statements, running totals, and ranking formulas. Describe the calculation you need, and it writes the formula.

**Smart Formatting** -- Apply professional, executive, or minimal styling to your sheets. Handles header formatting, alternating row colors, column auto-fit, and consistent design.

**Data Analysis** -- Trend detection, pivot-like summaries, and a risk auditing system with a 0-100 scoring scale that flags data integrity issues.

**PDF Extraction** -- Parse resumes and documents into structured Excel data. Supports batch processing with schema-aware field mapping.

### Word Capabilities

**Resume Tools** -- ATS optimization, keyword injection, action verb enhancement, achievement quantification, section formatting, one-page compression, and LinkedIn/portfolio link insertion.

**Writing Enhancement** -- Grammar and style fixes, formality conversion, conciseness editing, content expansion, and proofreading. Works on selected text or the full document.

**Document Formatting** -- Professional, academic, modern, and business letter styles. Consistent fonts, table formatting, headers/footers, heading numbering.

**Content Insertion** -- Tables, page breaks, horizontal lines, dates, page numbers, footnotes, bullet lists, numbered lists, table of contents, and checkboxes.

**Layout Control** -- Margin adjustments, line spacing (single/1.5/double), section breaks, and first-line indentation.

**Cleanup** -- Remove hyperlinks, strip empty lines, standardize bullet and numbered list formatting.

**Templates** -- Pre-built templates for modern resumes, cover letters, business letters, meeting notes, project proposals, reports, invoices, and SOPs.

### Business Modules

Four specialized modules for common professional workflows:

**Risk Audit** -- Scans spreadsheets for data integrity issues: merged cells, formula inconsistencies, missing values. Produces a risk score (0-100) with severity levels (LOW, MEDIUM, HIGH, CRITICAL) and specific recommendations.

**Data Cleaning** -- Programmatic cleanup operations: whitespace trimming, case normalization, data type conversion, and deduplication. Goes beyond what the quick actions offer when you need fine-grained control.

**Reconciliation** -- Matches invoices against bank statements with configurable tolerance. Supports exact matching, amount tolerance (percentage-based), date proximity matching, and partial match detection. Each record gets a status: MATCHED, PARTIAL_MATCH, MISMATCH, or DUPLICATE.

**Resume Processing** -- Parses candidate resumes, extracts experience and skills, and scores candidates against a job description. Useful for recruitment teams processing high volumes of applications.

### Document Extraction Pipeline

The extraction system turns unstructured PDFs into structured Excel data:

1. Reads your Excel headers to understand what fields you want extracted
2. Classifies each field as regex-extractable (email, phone, dates, account numbers) or LLM-extractable (names, addresses, skills)
3. Runs regex extraction first for deterministic fields
4. Calls the LLM for semantic fields with explicit anti-hallucination instructions
5. Validates everything against Zod schemas
6. Writes results to Excel with confidence scoring -- rows below 0.8 confidence get flagged as "Needs Review"

Processes up to 5 documents concurrently. Each document is handled independently to prevent cross-contamination of extracted data.

---

## Architecture

The system follows a structured pipeline:

```
User Input
  --> Intent Classification (READ_ONLY, DATA_TRANSFORM, STRUCTURAL_CHANGE, FORMATTING_ONLY, DESTRUCTIVE_ACTION)
  --> Schema Extraction (headers, column types, frozen rows, tables, merges)
  --> Code Generation (LLM call with DSL-constrained prompt)
  --> AST Validation (banned method detection, whitelist enforcement)
  --> Dry Run Preview (simulated execution with impact warnings)
  --> Execution (sandboxed, with pre-execution snapshot for rollback)
  --> Post-Execution Verification (schema integrity check)
  --> Logging
```

Key architectural decisions:

- **Safe API Layer (SafeSheetOS)** -- LLM-generated code can only call a restricted set of methods: `readRange`, `readHeaders`, `updateValues`, `updateFormat`, `insertRows`, `deleteRows`, `batchUpdate`. No direct Office.js access.
- **Agent Loop** -- For complex tasks, a LangChain-inspired planner/coder/validator/executor/fixer loop retries up to 3 times with different approaches.
- **State Management** -- Observable store pattern with phase tracking (ANALYZE, PLAN, PREVIEW, EXECUTE, HISTORY, SETTINGS) and structured logging.
- **Deterministic Generation** -- Temperature 0, Top P 1 on all LLM calls. Same input should produce the same output.

---

## LLM Providers

The add-in supports multiple AI providers. You pick the one you have access to and configure it in the Settings panel.

| Provider | Models | Notes |
|----------|--------|-------|
| Groq | Llama 3.3 70B (default), Llama 4 Maverick, Gemma 2 9B, Mixtral 8x7B | Fast inference, free tier available |
| Google Gemini | 1.5 Flash (default), 1.5 Pro | Free tier, good for general use |
| OpenAI | GPT-4o Mini (default), GPT-4o | Paid, strong code generation |
| Anthropic | Claude 3.5 Sonnet, Claude 3.5 Haiku | Paid, excellent for structured output |
| OpenRouter | All major models via unified API | Single API key for multiple providers |
| Local (Ollama) | qwen2.5-coder:7b (default), any Ollama model | Self-hosted, no data leaves your machine |

All providers use the same interface. API keys are encrypted with AES-GCM before storage. Retry logic handles rate limits (429 errors) with exponential backoff up to 3 attempts.

---

## Security

This is not a "trust the AI and hope for the best" system. Multiple layers enforce safety:

**Code Validation** -- Every piece of generated code passes through an AST validator that checks for banned methods (eval, Function constructor, direct Office.js calls, Google Apps Script patterns). Only whitelisted API calls are allowed through.

**Sandboxed Execution** -- Generated code runs in a restricted Function scope with access only to the SafeSheetOS abstraction and the Excel/Word context. No direct DOM, window, or document access.

**Dry Run Preview** -- Before execution, changes are simulated. Warnings fire for large impact operations (50+ ranges, structural changes). You see what will happen before it happens.

**Automatic Rollback** -- A snapshot is taken before execution. If anything fails, the sheet reverts to its previous state.

**Integrity Verification** -- After execution, the system compares the before and after schema. If a read-only operation somehow changed row counts, it flags the issue.

**API Key Encryption** -- Keys are encrypted using AES-GCM with a device-specific salt derived from browser fingerprinting (user agent, language, screen resolution, timezone).

**HTML Sanitization** -- All LLM responses are sanitized through DOMPurify before rendering. Protocol-level blocking for javascript:, data:, and vbscript: URIs.

**Anti-Hallucination** -- LLM prompts explicitly instruct: return empty strings for missing data, never fabricate values. Schema locking ensures only columns defined in your spreadsheet are populated. Confidence scoring flags uncertain extractions.

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- Microsoft 365 subscription or Office 2016+ (desktop or web)
- An API key from at least one supported LLM provider (or a local Ollama instance)

### Installation

```bash
git clone <repository-url>
cd excel-plugin
npm install
```

### Running in Development

Start the interactive chooser to pick your debug environment:

```bash
npm start
```

Or launch directly for a specific app:

```bash
npm run start:excel    # Debug in Excel
npm run start:word     # Debug in Word
```

The dev server runs on `https://localhost:3000`. Office add-ins require HTTPS, so development certificates are generated automatically via `office-addin-dev-certs`.

### Configuration

1. Open the add-in taskpane in Excel or Word
2. Go to the Settings panel
3. Select your LLM provider
4. Enter your API key
5. Choose a model (or stick with the default)

---

## Available Commands

```bash
npm run build            # Production build
npm run build:dev        # Development build
npm run dev-server       # Start webpack dev server
npm run lint             # Check for linting issues
npm run lint:fix         # Auto-fix linting issues
npm run prettier         # Format code
npm start                # Interactive debug environment chooser
npm run start:excel      # Debug Excel add-in
npm run start:word       # Debug Word add-in
npm run stop             # Stop Excel debugging
npm run stop:word        # Stop Word debugging
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run validate         # Validate Excel manifest
npm run validate:word    # Validate Word manifest
npm run watch            # Development watch mode
npm run signin           # Sign into M365 account
npm run signout          # Sign out of M365 account
```

---

## Project Structure

```
src/
  core/                     # Pure business logic, no Office.js dependency
    executor/               # Dry-run simulation engine
    intent/                 # Natural language intent classification
    orchestrator/           # Main execution engine with rollback support
    schema/                 # Excel schema extraction (headers, types, tables)
    templates/              # SafeSheetOS -- the restricted API layer
    types/                  # TypeScript type definitions
    validator/              # AST-based code validation
  services/                 # Office.js integration, LLM calls, external APIs
    agent-orchestrator.ts   # LangChain-style planner/coder/validator/executor loop
    cache.ts                # Prompt/response caching (1hr expiry, 50 entries)
    document-extractor.ts   # Schema-aware document extraction
    excelWriter.ts          # Write extracted data to Excel tables
    llm.service.ts          # Multi-provider LLM abstraction with retry logic
    pdfService.ts           # PDF text extraction via pdf.js
    pipeline.ts             # End-to-end document processing pipeline
    regexExtractor.ts       # Pattern extraction (email, phone, IFSC, PAN, etc.)
    sanitizer.ts            # DOMPurify HTML sanitization
    security.ts             # AES-GCM API key encryption
    validator.ts            # Zod-based data validation
    word-orchestrator.ts    # Word-specific agent orchestration
  modules/                  # Domain-specific business modules
    audit/                  # Risk audit scoring and recommendations
    cleaning/               # Data cleaning operations
    reconciliation/         # Invoice-to-bank statement matching
    recruitment/            # Resume parsing and candidate scoring
  taskpane/                 # Excel UI
    components/             # UI components (Sidebar, Panels, Cards, etc.)
    state/                  # Observable state management
    styles/                 # CSS modules
  word-taskpane/            # Word UI
  commands/                 # Ribbon command handlers
tests/                      # Jest test suite
docs/                       # Built artifacts for production hosting
```

---

## Testing

Tests use Jest with a jsdom environment and ts-jest for TypeScript support.

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
```

Test coverage threshold is set at 50%. Test files cover the agent orchestrator, document extractor, regex extractor, and validator.

---

## Deployment

Production builds output to the `docs/` folder, which is configured for GitHub Pages hosting.

```bash
npm run build
```

The build process transforms manifest URLs from `https://localhost:3000` to the production domain. The production manifest (`manifest.prod.xml`) points to the deployed URL.

---

## Tech Stack

- **TypeScript 5.4** with strict compilation
- **Webpack 5** for bundling with code splitting across taskpane, word-taskpane, and commands entry points
- **Office.js** for Excel and Word API integration
- **Zod** for runtime schema validation
- **DOMPurify** for XSS prevention
- **pdf.js** for browser-side PDF parsing
- **Jest 30** for testing
- **Web Crypto API** for AES-GCM encryption

---

## License

MIT
