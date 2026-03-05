/* global console, Word, document, window, Office */
import "../taskpane/taskpane.css";
import { callLLM, getConfig, saveConfig, fetchOllamaModels, GROQ_MODELS, LLMConfig } from "../services/llm.service";
import { WORD_SYSTEM_PROMPT } from "../services/word-prompt";
import { WORD_CHAT_PROMPT } from "../services/word-chat-prompt";
import { getCachedResponse, cacheResponse } from "../services/cache";
import {
    runWordAgent,
    validateWordCode,
    executeWordWithRecovery,
    readDocumentContext,
    DocumentContext,
    WordAttachedFile,
} from "../services/word-orchestrator";
import { Icons } from "../services/icons";

// PDF.js is lazy-loaded on first PDF file attachment to avoid blocking initial load
let _pdfjsLib: typeof import("pdfjs-dist") | null = null;
let _extractTextFromPDFFile: typeof import("../services/pdfService").extractTextFromPDFFile | null = null;

async function getPdfJs() {
    if (!_pdfjsLib) {
        _pdfjsLib = await import("pdfjs-dist");
        _pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${_pdfjsLib.version}/pdf.worker.min.js`;
    }
    return _pdfjsLib;
}

async function getPdfExtractor() {
    if (!_extractTextFromPDFFile) {
        const mod = await import("../services/pdfService");
        _extractTextFromPDFFile = mod.extractTextFromPDFFile;
    }
    return _extractTextFromPDFFile;
}

// ─── Types ─────────────────────────────────────────────────────
type Mode = "planning" | "agent";
type WordActionCategory = "resume" | "writing" | "format" | "insert" | "layout" | "cleanup" | "templates" | "smart";

interface ChatMessage {
    role: "user" | "ai";
    content: string;
    timestamp: number;
}

// ─── State ─────────────────────────────────────────────────────
let currentMode: Mode = "planning";
let currentCategory: WordActionCategory = "resume";
const chatHistory: ChatMessage[] = [];
let chatConversation: { role: "system" | "user" | "assistant"; content: string }[] = [];
let isChatBusy = false;
let attachedFiles: { name: string; type: "image" | "pdf" | "docx"; data: string[]; extractedText?: string }[] = [];
let chatAbortController: AbortController | null = null;
let agentAbortController: AbortController | null = null;

// ─── Quick Actions by Category ─────────────────────────────────
const WORD_ACTIONS: Record<WordActionCategory, { icon: string; label: string; prompt: string }[]> = {

    // ── Resume & CV Tools ──
    resume: [
        { icon: "fileText", label: "Make ATS Friendly 🎯", prompt: "DO NOT use body.clear(). Read paragraphs with .load('items/text,items/font,items/style'). Sync. Modify in-place for a COMPACT 1-2 page resume. Rules: 1) Very first paragraph (Name) must be font.size=18, font.bold=true (DO NOT shrink the name!). 2) Other body text: font.name='Arial' or 'Calibri', font.size=10.5, lineSpacing=12 (single), spaceAfter=2, spaceBefore=0. 3) Section Headings (like WORK EXPERIENCE): Set font.size=12, font.bold=true, font.color='#000000', spaceBefore=12, spaceAfter=4. DO NOT use 'Heading 1' style as it adds massive blank gaps. Delete any extra empty paragraphs to save space. Keep all content." },
        { icon: "zap", label: "Optimize Keywords", prompt: "DO NOT use body.clear(). Read the document paragraphs. Identify the job role from the content. At the END of the document, insert a bolded paragraph 'Suggested Keywords', followed by a compact bullet list of recommended ATS keywords. Use font.size=10.5, lineSpacing=12. Do not modify existing content." },
        { icon: "paintbrush", label: "Professional Format", prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Make it a TIGHT, professional document. The very first paragraph (title/name) must stay large (font.size=18+). Body text: font.size=11, font.name='Calibri', lineSpacing=12 (single), spaceAfter=2. Section headings: font.size=12, font.bold=true, spaceBefore=10, spaceAfter=4. DO NOT use 'Heading 1' style to avoid massive spacing gaps. Delete empty lines. Sync." },
        { icon: "sortAsc", label: "Add Section Headers", prompt: "DO NOT use body.clear(). Identify paragraphs that look like resume sections ('Work Experience', 'Education', 'Skills'). Set their font.bold=true, font.size=12, text.toUpperCase(), spaceBefore=12, spaceAfter=4. DO NOT use 'Heading 1' style to prevent huge gaps. Keep existing text." },
        { icon: "checkSquare", label: "Resume Checklist ✅", prompt: "DO NOT use body.clear(). Read paragraphs. At the END, insert standard paragraphs (not Heading style) analyzing: Contact info ✅/❌, Summary ✅/❌, Experience ✅/❌, Education ✅/❌, Skills ✅/❌, Action verbs ✅/❌, Compact format ✅/❌. Use font.size=10.5, lineSpacing=12." },
        { icon: "trendUp", label: "Add Action Verbs", prompt: "DO NOT use body.clear(). Read all paragraphs. For bullet-point paragraphs in work experience sections, use search and replace to ensure each starts with a strong action verb. Use body.search() to find weak starts and replace with stronger alternatives via insertText with Word.InsertLocation.replace." },
        { icon: "users", label: "Add Summary", prompt: "DO NOT use body.clear(). Read the document to understand the background. Insert a 'Professional Summary' heading and 3-4 sentence summary paragraph at the START of the document (using Word.InsertLocation.start). Set the heading font to bold, size 12. Do NOT use 'Heading 1' style. Use industry-relevant keywords." },
        { icon: "barChart", label: "Quantify Achievements", prompt: "DO NOT use body.clear(). Read all paragraphs. At the END of the document, insert a section titled 'Suggested Metrics' (bold, size 12). For each work experience bullet that lacks numbers, insert a paragraph suggesting how to add quantified achievements. Example: 'Line: Managed team → Suggestion: Managed team of [X] members, achieving [Y]% growth'." },
        { icon: "scissors", label: "Trim to One Page", prompt: "DO NOT use body.clear(). Load all paragraphs. Make everything ultra-compact: font.size=10 for body, lineSpacing=11 (tight single), spaceAfter=1, spaceBefore=0. Delete ALL empty paragraphs. Name: font.size=16 (slightly smaller). Section headings: font.size=11, spaceBefore=8, spaceAfter=2. This forces content into minimum space." },
        { icon: "link", label: "Add LinkedIn/Portfolio", prompt: "DO NOT use body.clear(). Read the first few paragraphs (contact info area). After the name/contact paragraph, insert a new paragraph with 'LinkedIn: [your-linkedin-url] | Portfolio: [your-portfolio-url]' in font.size=10, font.color='#0563C1'. Set hyperlink on each URL placeholder." },
    ],

    // ── Writing Tools ──
    writing: [
        { icon: "brain", label: "Improve Writing ✍️", prompt: "DO NOT use body.clear(). Read all paragraphs. Use body.search() to find and replace weak phrases with stronger alternatives. For example, search for passive voice patterns and replace with active voice. Use insertText with Word.InsertLocation.replace for each match. Preserve all original meaning." },
        { icon: "sortAsc", label: "Make Formal", prompt: "DO NOT use body.clear(). Read all paragraphs. Use body.search() to find casual words/phrases and replace them with formal equivalents. Examples: 'got' → 'received', 'a lot' → 'significantly', 'things' → 'elements', 'stuff' → 'materials'. Use insertText with Word.InsertLocation.replace." },
        { icon: "columns", label: "Make Concise", prompt: "DO NOT use body.clear(). Read all paragraphs. Use body.search() to find and remove filler words: 'very', 'really', 'basically', 'actually', 'in order to' → 'to', 'due to the fact that' → 'because'. Use insertText with Word.InsertLocation.replace." },
        { icon: "trendUp", label: "Expand Content", prompt: "DO NOT use body.clear(). Read the document. At the END, insert new paragraphs expanding on the key topics identified. Add supporting details, examples, and transitions as new paragraphs using body.insertParagraph with Word.InsertLocation.end." },
        { icon: "search", label: "Proofread", prompt: "DO NOT use body.clear(). Read all paragraphs. At the END of the document, insert a 'Proofreading Report' section listing any spotted issues: potential spelling errors, grammar issues, inconsistent formatting. Use insertParagraph with Word.InsertLocation.end." },
        { icon: "barChart", label: "Summarize", prompt: "DO NOT use body.clear(). Read all paragraphs. Insert an 'Executive Summary' heading at the START (Word.InsertLocation.start) followed by 3-5 sentence summary paragraphs. Set heading font to bold, size 14. Do not modify existing content." },
        { icon: "copy", label: "Add Bullet Points", prompt: "DO NOT use body.clear(). Read paragraphs. Identify long paragraphs (text.length > 200) that contain lists of items. After each such paragraph, insert bullet-point style paragraphs breaking down the key points. Use startNewList() for bullet formatting." },
        { icon: "hash", label: "Add Headings", prompt: "DO NOT use body.clear(). Read all paragraphs. Every 3-5 paragraphs where a topic change is detected, insert a new paragraph BEFORE the topic change with style='Heading 2'. Use descriptive heading text based on the content that follows." },
        { icon: "highlight", label: "Highlight Key Points", prompt: "DO NOT use body.clear(). Read all paragraphs. For each paragraph, identify the most important sentence or phrase. Use body.search() to find those key phrases and set their font.bold=true and font.highlightColor='Yellow'. Sync after changes." },
        { icon: "type", label: "Fix Capitalization", prompt: "DO NOT use body.clear(). Read all paragraphs. For each paragraph, check if the first letter of the first word is capitalized. If not, use body.search() and insertText with Word.InsertLocation.replace to fix it. Also check for common capitalization issues: proper nouns, sentence beginnings after periods." },
    ],

    // ── Format Tools ──
    format: [
        { icon: "paintbrush", label: "Professional Style", prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Apply a compact, professional look. First paragraph (title) keeps font.size=16+. Headings: font.size=12, font.bold=true, spaceBefore=10, spaceAfter=4 (DO NOT use 'Heading 1' style). Body: font.size=11, font.name='Calibri', lineSpacing=12, spaceAfter=4. Delete purely empty paragraphs. Sync." },
        { icon: "paintbrush", label: "Academic Style", prompt: "DO NOT use body.clear(). Load all paragraphs. Body: font.name='Times New Roman', font.size=12, lineSpacing=24 (double-spaced), firstLineIndent=36. Headings: font.bold=true, firstLineIndent=0, alignment=Word.Alignment.centered. Remove empty gap paragraphs. Sync." },
        { icon: "paintbrush", label: "Modern Clean", prompt: "DO NOT use body.clear(). Load all paragraphs. Body: font.name='Arial', font.size=10.5, lineSpacing=13, spaceAfter=4. Headings: font.size=12, font.bold=true, font.color='#2563EB', spaceBefore=12, spaceAfter=4. Title/Name: font.size=18, font.bold=true. Sync." },
        { icon: "paintbrush", label: "Business Letter", prompt: "DO NOT use body.clear(). Load all paragraphs. Set all to font.name='Calibri', font.size=11, lineSpacing=15. Set spaceAfter=12 for paragraphs to add spacing between them. Ensure first paragraph is right-aligned (for sender info) using alignment=Word.Alignment.right." },
        { icon: "formula", label: "Consistent Fonts", prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Force EVERYTHING to font.name='Calibri', font.color='#000000'. First line font.size=18. Headings font.size=12. Body font.size=10.5. Fix spacing to lineSpacing=12, spaceAfter=2. Sync." },
        { icon: "table", label: "Format Tables", prompt: "DO NOT use body.clear(). Load body.tables with tables.load('items'). Sync. For each table: set table.styleBuiltIn = Word.BuiltInStyleName.gridTable5Dark_Accent1, then table.autoFitWindow(). Sync." },
        { icon: "snowflake", label: "Add Header/Footer", prompt: "DO NOT use body.clear(). Load context.document.sections, sections.load('items'), await context.sync(). Get header via sections.items[0].getHeader(Word.HeaderFooterType.primary). Insert a paragraph 'Document' with font.size=9, font.color='#888888', alignment=Word.Alignment.right. Get footer via sections.items[0].getFooter(Word.HeaderFooterType.primary). Insert 'Page' paragraph centered, font.size=9. Sync." },
        { icon: "hash", label: "Number Headings", prompt: "DO NOT use body.clear(). Load all paragraphs with styles. Sync. For each paragraph whose style includes 'Heading 1': prepend number using search and replace with a counter '1. ', '2. ', etc. For 'Heading 2' paragraphs: use '1.1', '1.2' etc." },
        { icon: "alignCenter", label: "Center Everything", prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Set every paragraph alignment = Word.Alignment.centered. Sync." },
        { icon: "indent", label: "Block Indent", prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. For all paragraphs that are not headings: set leftIndent=36 (0.5 inch). Keep headings at leftIndent=0. Sync." },
    ],

    // ── Insert Tools ──
    insert: [
        { icon: "divider", label: "Page Break", prompt: "Insert a page break at the end of the document using body.insertBreak(Word.BreakType.page, Word.InsertLocation.end). Then await context.sync()." },
        { icon: "table", label: "Blank Table 📊", prompt: "Insert a blank 4x3 table at the end of the document. Use body.insertTable(4, 3, Word.InsertLocation.end, [['Column 1','Column 2','Column 3'],['','',''],['','',''],['','',' ']]). Set table style: table.styleBuiltIn = Word.BuiltInStyleName.gridTable4_Accent1. Then table.autoFitWindow(). Sync." },
        { icon: "minus", label: "Horizontal Line", prompt: "Insert a horizontal rule at the end of the document. Use body.insertHtml('<hr style=\"border:none;border-top:2px solid #cccccc;margin:12px 0;\">', Word.InsertLocation.end). Sync." },
        { icon: "calendar", label: "Date & Time", prompt: "Insert today's date in a formatted paragraph at the end. Calculate the date: const now = new Date(); const dateStr = now.toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'}); Insert with body.insertParagraph(dateStr, Word.InsertLocation.end). Set font.size=11, alignment right. Sync." },
        { icon: "hash", label: "Page Numbers", prompt: "DO NOT use body.clear(). Load sections. Get footer via sections.items[0].getFooter(Word.HeaderFooterType.primary). Insert 'Page ' paragraph with font.size=9, alignment=Word.Alignment.centered, font.color='#666666'. Sync." },
        { icon: "footprint", label: "Footnote", prompt: "Get the current selection with context.document.getSelection(). Insert a footnote: selection.insertFootnote('Enter footnote text here.'). Sync." },
        { icon: "list", label: "Bullet List", prompt: "Insert a new bulleted list at the end with 5 items: const b1 = body.insertParagraph('First item', Word.InsertLocation.end); b1.startNewList(); body.insertParagraph('Second item', Word.InsertLocation.end); body.insertParagraph('Third item', Word.InsertLocation.end); body.insertParagraph('Fourth item', Word.InsertLocation.end); body.insertParagraph('Fifth item', Word.InsertLocation.end); Sync." },
        { icon: "hash", label: "Numbered List", prompt: "Insert a new numbered list at the end using HTML: body.insertHtml('<ol><li>First item</li><li>Second item</li><li>Third item</li><li>Fourth item</li><li>Fifth item</li></ol>', Word.InsertLocation.end). Sync." },
        { icon: "bookmark", label: "Table of Contents", prompt: "DO NOT use body.clear(). Read all paragraphs and their styles. Identify paragraphs with 'Heading' in their style name. At the START, insert 'Table of Contents' with style='Heading 1', then for each heading found, insert a paragraph with the heading text prefixed by its level number. Use Word.InsertLocation.start in reverse order. Sync." },
        { icon: "checkSquare", label: "Checkbox List ☑️", prompt: "Insert a checkbox-style list at the end using HTML. Use body.insertHtml('<p>☐ Task item 1</p><p>☐ Task item 2</p><p>☐ Task item 3</p><p>☐ Task item 4</p><p>☐ Task item 5</p>', Word.InsertLocation.end). Sync." },
    ],

    // ── Layout Tools ──
    layout: [
        { icon: "minimize", label: "Narrow Margins", prompt: "Load context.document.sections and sections.load('items'). Sync. Set narrow margins on all sections: for each section, load pageSetup and try to apply smaller margins. Insert a small note paragraph at the end: 'Margins adjusted to narrow.' Sync. Note: If pageSetup is read-only in your API version, insert the note explaining to manually set margins to 0.5 inch all around." },
        { icon: "maximize", label: "Wide Margins", prompt: "DO NOT use body.clear(). Insert a small note paragraph at the end explaining: 'For wide margins, go to Layout → Margins → Wide (1.27\" top/bottom, 2\" left/right). API margin control may be limited in your Word version.' Set font.size=10, font.italic=true, font.color='#666666'." },
        { icon: "rotateCw", label: "Landscape Note", prompt: "DO NOT use body.clear(). Insert a note paragraph at the end: 'To switch to Landscape orientation, go to Layout → Orientation → Landscape. For section-specific orientation changes, insert a Section Break first.' Set font.italic=true, font.color='#666666'. Sync." },
        { icon: "alignLeft", label: "Single Spacing", prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Set every paragraph: lineSpacing=12 (single spacing), spaceAfter=0, spaceBefore=0. Sync." },
        { icon: "alignCenter", label: "1.5 Spacing", prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Set every paragraph: lineSpacing=18 (1.5 spacing), spaceAfter=6, spaceBefore=0. Sync." },
        { icon: "columns", label: "Double Spacing", prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. Set every paragraph: lineSpacing=24 (double spacing), spaceAfter=0, spaceBefore=0. Sync." },
        { icon: "divider", label: "Section Break", prompt: "Insert a section break (next page) at the end using body.insertBreak(Word.BreakType.sectionNext, Word.InsertLocation.end). Sync." },
        { icon: "indent", label: "First Line Indent", prompt: "DO NOT use body.clear(). Load all paragraphs. Sync. For all paragraphs that are Normal style (not headings): set firstLineIndent=36 (0.5 inch). Sync." },
    ],

    // ── Cleanup Tools ──
    cleanup: [
        { icon: "eraser", label: "Smart Clean 🧹", prompt: "DO NOT use body.clear(). Load all paragraphs. For each paragraph: if text.trim() is empty and the next paragraph is also empty, delete the empty one with paragraph.delete(). For non-empty paragraphs: set font.name='Calibri', font.size=11, lineSpacing=15, spaceAfter=6. Use body.search('  ') to find double spaces and replace with single space via insertText(Word.InsertLocation.replace). Then await context.sync()." },
        { icon: "eraser", label: "Remove Formatting", prompt: "DO NOT use body.clear(). Load all paragraphs. For each: set style='Normal', font.name='Calibri', font.size=11, font.bold=false, font.italic=false, font.underline='None', font.color='#000000', lineSpacing=15, spaceAfter=6. Then await context.sync()." },
        { icon: "eraser", label: "Fix Spacing", prompt: "DO NOT use body.clear(). Load all paragraphs. For empty paragraphs that are consecutive, delete the extras (keep max 1 between sections). For all paragraphs: set lineSpacing=15, spaceAfter=6, spaceBefore=0. Then await context.sync()." },
        { icon: "search", label: "Find & Replace", prompt: "DO NOT use body.clear(). Use body.search() to find and replace: double spaces → single space, triple dots '...' → ellipsis '…'. For each search, load items, sync, then loop and use insertText with Word.InsertLocation.replace." },
        { icon: "eraser", label: "Remove Empty Lines", prompt: "DO NOT use body.clear(). Load all paragraphs. Loop through BACKWARDS and identify paragraphs where text.trim() === ''. Delete consecutive empty paragraphs but keep at most one between content sections using paragraph.delete(). Sync." },
        { icon: "eraser", label: "Fix Bullets", prompt: "DO NOT use body.clear(). Load all paragraphs. Identify paragraphs that start with '- ', '* ', '• '. Standardize them: use search to find the bullet character and replace with '• '. Ensure consistent font and spacing on all bullet paragraphs." },
        { icon: "paintbrush", label: "Normalize Fonts", prompt: "DO NOT use body.clear(). Load all paragraphs with font info. Sync. Force every paragraph to the same font family: font.name='Calibri'. Keep existing bold/italic/size but make the font family consistent. Sync." },
        { icon: "scissors", label: "Remove Hyperlinks", prompt: "DO NOT use body.clear(). Load all paragraphs. For each paragraph, search for text that contains URLs. When found, set the range's hyperlink to an empty string or remove it. This keeps the text but removes the clickable link. Sync." },
    ],

    // ── Templates (these are the ONLY prompts that may clear the document) ──
    templates: [
        { icon: "fileTemplate", label: "Modern Resume", prompt: "First clear the document with body.clear(), await context.sync(). Then create a resume template: Insert '[Your Name]' paragraph with font.size=18, font.bold=true, alignment=Word.Alignment.centered. Insert '[email] | [phone] | [city, state]' centered. Then insert section headings using font.bold=true, font.size=12: 'PROFESSIONAL SUMMARY', 'WORK EXPERIENCE', 'EDUCATION', 'SKILLS'. Under each heading, insert placeholder paragraphs with font.name='Calibri', font.size=11. Finish with await context.sync()." },
        { icon: "fileTemplate", label: "Cover Letter", prompt: "First clear the document with body.clear(), await context.sync(). Then create a cover letter: Insert today's date (calculate with new Date()), blank line, '[Hiring Manager Name]', '[Company Name]', '[Address]'. Then 'Dear [Hiring Manager]:'. Three body paragraphs with placeholder text about qualifications. 'Sincerely,' and '[Your Name]'. All in Calibri 11pt with lineSpacing=15. Finish with await context.sync()." },
        { icon: "fileTemplate", label: "Business Letter", prompt: "First clear the document with body.clear(), await context.sync(). Then create: Sender info (right-aligned), date, recipient info (left-aligned), subject line bold, salutation 'Dear Sir/Madam:', body (3 paragraphs), closing 'Yours faithfully,'. All Calibri 11pt. Finish with await context.sync()." },
        { icon: "fileTemplate", label: "Meeting Notes", prompt: "First clear the document with body.clear(), await context.sync(). Then create: 'Meeting Notes' in bold font.size=16, centered. Date/Time line. 'Attendees' heading (bold, size 12) with bullet list. 'Agenda' heading with numbered items. 'Discussion' heading with placeholder paragraphs. 'Action Items' heading with a table (columns: Action, Owner, Due Date, Status). All in Calibri. Finish with await context.sync()." },
        { icon: "fileTemplate", label: "Project Proposal", prompt: "First clear the document with body.clear(), await context.sync(). Then create sections with bold font.size=14 headings: Executive Summary, Problem Statement, Proposed Solution, Scope, Timeline (insert a table with Phase/Duration/Deliverable columns), Budget (insert a table with Item/Cost columns), Team, Conclusion. Add placeholder text under each. Calibri formatting. Finish with await context.sync()." },
        { icon: "fileTemplate", label: "Report Template", prompt: "First clear the document with body.clear(), await context.sync(). Then create: Title page (large centered title font.size=24, subtitle font.size=14). Insert page break. Sections with style='Heading 1': Executive Summary, Introduction, Methodology, Findings, Analysis, Recommendations, Conclusion, References. Add placeholder text. Calibri, lineSpacing=24 (double-spaced). Finish with await context.sync()." },
        { icon: "fileTemplate", label: "Invoice Template", prompt: "First clear the document with body.clear(), await context.sync(). Then create: 'INVOICE' title centered, font.size=24, font.bold=true. Company info line. Invoice # and date line right-aligned. Bill-To section. Then insert a table with columns: Description, Qty, Unit Price, Total. Add 3 sample rows. Below table: Subtotal, Tax, Total lines right-aligned. 'Thank you for your business!' at bottom. Sync." },
        { icon: "fileTemplate", label: "SOP Document", prompt: "First clear the document with body.clear(), await context.sync(). Then create a Standard Operating Procedure: 'Standard Operating Procedure' title centered, bold, size 16. Doc info table (SOP Number, Version, Date, Author). Then sections: 1. Purpose, 2. Scope, 3. Responsibilities, 4. Procedure (with numbered sub-steps), 5. Safety, 6. References, 7. Revision History (table). All Calibri 11pt. Sync." },
    ],

    // ── Smart Tools ──
    smart: [
        { icon: "brain", label: "Document Analyzer 🔬", prompt: "DO NOT use body.clear(). Read all paragraphs with body.paragraphs.load('items/text,items/style'). Sync. Calculate word count, paragraph count, estimated reading time (250 WPM), avg words per paragraph, sentence count (approx by counting periods). At the END, insert a styled 'Document Analysis Report' section with these stats as a formatted table using body.insertTable. Use Word.InsertLocation.end." },
        { icon: "zap", label: "Make Links Clickable 🔗", prompt: "DO NOT use body.clear(). DO NOT use getSelection(). DO NOT insert or append any URL text. DO NOT use body.search('http') because that only matches the 4-char substring, NOT the full URL. Instead: 1) Load paragraphs: const paras = body.paragraphs; paras.load('items/text'); await context.sync(); 2) Extract full URLs with JS regex: const urlRegex = /https?:\\/\\/[^\\s,)>\\]]+/g; const foundUrls = []; for (let i = 0; i < paras.items.length; i++) { const txt = paras.items[i].text || ''; let m; while ((m = urlRegex.exec(txt)) !== null) foundUrls.push(m[0]); } 3) For each URL, search and hyperlink: for (let j = 0; j < foundUrls.length; j++) { const sr = body.search(foundUrls[j], {matchCase:false, matchWholeWord:false}); sr.load('items'); await context.sync(); for (let k = 0; k < sr.items.length; k++) sr.items[k].hyperlink = foundUrls[j]; await context.sync(); } NEVER use insertText, insertParagraph, or insertHtml to write URL text." },
        { icon: "trendUp", label: "Readability Score", prompt: "DO NOT use body.clear(). Read all paragraphs. Count total words, total sentences (periods+exclamation+question marks), and total syllables (approximate: count vowel groups in each word). Calculate Flesch-Kincaid grade level and reading ease. At the END, insert a 'Readability Report' section with the scores and interpretation. Use insertParagraph with Word.InsertLocation.end." },
        { icon: "search", label: "Extract Key Points", prompt: "DO NOT use body.clear(). Read all paragraphs. At the START of the document, insert 'Key Takeaways' heading (bold, font.size=14) followed by numbered key points extracted from the content. Use insertParagraph with Word.InsertLocation.start. Insert in reverse order so they appear correctly." },
        { icon: "copy", label: "Compare Sections", prompt: "DO NOT use body.clear(). Read all paragraphs. Identify sections by headings. At the END, insert a comparison table using body.insertTable() showing: Section Name, Word Count, Paragraph Count, Avg Sentence Length. Style the table. Use Word.InsertLocation.end." },
        { icon: "shield", label: "Consistency Check", prompt: "DO NOT use body.clear(). Read all paragraphs with font info loaded. At the END, insert a 'Consistency Report' section listing any found issues: mixed fonts (list all unique font names found), inconsistent sizes, paragraphs with different spacing values, headings without consistent styling. Use insertParagraph with Word.InsertLocation.end." },
        { icon: "mail", label: "Extract Contacts", prompt: "DO NOT use body.clear(). Read all paragraphs. Search body text for email addresses (pattern with @), phone numbers (digits with dashes/spaces), and URLs (http/www). At the END, insert a 'Contact Information' table using body.insertTable() with columns: Type, Value. Use Word.InsertLocation.end." },
        { icon: "layers", label: "Create TOC", prompt: "DO NOT use body.clear(). Read all paragraphs and identify those with 'Heading' in their style. At the START of the document, insert 'Table of Contents' (bold, font.size=14) followed by a paragraph listing each heading found with indentation based on heading level. Use Word.InsertLocation.start, inserting in reverse order." },
        { icon: "dollarSign", label: "Word Count Stats", prompt: "DO NOT use body.clear(). Read all paragraphs. Count total words, total characters (with and without spaces), unique words (approximate), paragraphs, sentences. At the END, insert a stats table using body.insertTable() with these metrics. Style with gridTable4_Accent1. Use Word.InsertLocation.end." },
        { icon: "globe", label: "Translate Structure", prompt: "DO NOT use body.clear(). Read all paragraphs. At the END, insert a 'Document Structure Map' section. For each paragraph, insert a line showing: [Paragraph #] [Style: X] [Words: Y] [First 40 chars...]. This gives the user a complete structural overview. Use insertParagraph with Word.InsertLocation.end." },
    ],
};

// Chat Suggestions
const WORD_CHAT_SUGGESTIONS = [
    { icon: "fileText", text: "Make my resume ATS-friendly" },
    { icon: "brain", text: "Improve the writing in my document" },
    { icon: "paintbrush", text: "Format my document professionally" },
    { icon: "search", text: "Proofread and fix errors in my doc" },
    { icon: "sparkles", text: "What can you do? Show me your features" },
    { icon: "trendUp", text: "Analyze my document and suggest improvements" },
];

// ─── Initialization ────────────────────────────────────────────
window.onerror = function (msg, url, line) {
    const statusEl = document.getElementById("loading-status");
    if (statusEl) {
        statusEl.innerHTML += `<br><span style="color:#d32f2f;font-weight:bold;font-size:11px;">${msg} (Line ${line})</span>`;
        document.getElementById("sideload-msg").style.display = "none";
        document.getElementById("app-body").style.display = "flex";
    }
    return false;
};

Office.onReady((info) => {
    const sideloadMsg = document.getElementById("sideload-msg");
    const appBody = document.getElementById("app-body");

    // Show app immediately — don't block on anything
    if (sideloadMsg) sideloadMsg.style.display = "none";
    if (appBody) appBody.style.display = "flex";

    if (info.host === Office.HostType.Word) {
        console.log("Running in Word");
    } else {
        console.warn("Running outside Word — host:", info.host);
    }

    // ── CRITICAL PATH: Wire up interactive elements first ──
    // These are needed immediately for user interaction
    document.getElementById("run").onclick = () => {
        const input = document.getElementById("prompt-input") as HTMLTextAreaElement;
        if (input && (input.value.trim() || attachedFiles.length > 0)) {
            runWordAICommand();
        }
    };

    document.getElementById("mode-planning").onclick = () => switchMode("planning");
    document.getElementById("mode-agent").onclick = () => switchMode("agent");
    document.getElementById("chat-send").onclick = sendChatMessage;
    const clearBtn = document.getElementById("chat-clear");
    if (clearBtn) clearBtn.onclick = clearChat;

    setupChatInput();
    setupAgentKeyboardShortcut();

    // ── FAST PATH: Inject essential icons (header only) ──
    injectIcons();

    // ── DEFERRED: Non-critical UI work after first paint ──
    requestAnimationFrame(() => {
        // Settings & Docs toggles
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
        bindClick("agent-file-btn", () => document.getElementById("agent-file-input").click());
        bindChange("agent-file-input", (e) => handleFileSelect(e, true));

        // Category Tabs
        document.querySelectorAll(".category-tab").forEach((tab) => {
            (tab as HTMLElement).onclick = () => {
                const cat = (tab as HTMLElement).dataset.category as WordActionCategory;
                switchCategory(cat);
            };
        });

        setupScrollToBottom();
        setupDiffDismiss();

        // Build UI content and inject remaining icons
        injectDocIcons();
        injectCategoryIcons();
        buildQuickActions();
        buildChatSuggestions();
        loadSettingsUI();
    });
});

// ─── Icon Injection ────────────────────────────────────────────
function injectIcons(): void {
    const el = (id: string, html: string) => {
        const node = document.getElementById(id);
        if (node) node.innerHTML = html;
    };
    el("settings-toggle", Icons.settings);
    el("docs-toggle", Icons.helpCircle);
    el("run-icon", Icons.arrowRight);
    el("chevron-icon", Icons.chevronDown);
    el("refresh-models", Icons.refresh);
    el("mode-planning-icon", Icons.messageCircle);
    el("mode-agent-icon", Icons.zap);
    el("chat-send-icon", Icons.send);
    el("chat-clear-icon", Icons.trash);
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

    document.querySelectorAll(".mode-tab").forEach((tab) => {
        tab.classList.toggle("active", (tab as HTMLElement).dataset.mode === mode);
    });

    const indicator = document.getElementById("mode-indicator");
    if (mode === "agent") {
        indicator.classList.add("right");
    } else {
        indicator.classList.remove("right");
    }

    document.getElementById("planning-mode").classList.toggle("active", mode === "planning");
    document.getElementById("agent-mode").classList.toggle("active", mode === "agent");

    if (mode === "planning") {
        setTimeout(() => (document.getElementById("chat-input") as HTMLTextAreaElement).focus(), 200);
    } else {
        setTimeout(() => (document.getElementById("prompt-input") as HTMLTextAreaElement).focus(), 200);
    }
}

// ─── Category Switching ────────────────────────────────────────
function switchCategory(category: WordActionCategory): void {
    currentCategory = category;

    document.querySelectorAll(".category-tab").forEach((tab) => {
        tab.classList.toggle("active", (tab as HTMLElement).dataset.category === category);
    });

    buildQuickActions();
}

// ─── Quick Actions ────────────────────────────────────────────
function buildQuickActions(): void {
    const container = document.getElementById("quick-actions");
    if (!container) return;
    container.innerHTML = "";

    const actions = WORD_ACTIONS[currentCategory];
    if (!actions) return;

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
                const statusEl = document.getElementById("status-message");
                if (statusEl) statusEl.style.display = "none";
            }
        };
        container.appendChild(chip);
    });
}

// ─── Chat Suggestions ────────────────────────────────────────
function buildChatSuggestions(): void {
    const container = document.getElementById("chat-suggestions");
    if (!container) return;

    WORD_CHAT_SUGGESTIONS.forEach((s) => {
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

    const setVal = (id: string, val: string) => {
        const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
        if (el) el.value = val || "";
    };

    setVal("setting-api-key", config.apiKey);
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
    if (statusEl) { statusEl.textContent = ""; statusEl.className = "model-status"; }

    const models = await fetchOllamaModels(host);
    if (models.length === 0) {
        select.innerHTML = `<option value="" disabled selected>No models found</option>`;
        if (statusEl) { statusEl.textContent = "Ollama not running or no models installed"; statusEl.className = "model-status model-status-warn"; }
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
    if (statusEl) { statusEl.textContent = `${models.length} model${models.length > 1 ? "s" : ""} found`; statusEl.className = "model-status model-status-ok"; }
}

function handleSaveSettings(): void {
    const provider = (document.getElementById("setting-provider") as HTMLSelectElement)?.value as any;
    const current = getConfig();

    const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLSelectElement)?.value?.trim() || "";

    const newConfig: LLMConfig = {
        ...current,
        provider: provider,
        apiKey: getVal("setting-api-key"),
        groqModel: getVal("setting-groq-model"),
        geminiKey: getVal("setting-gemini-key"),
        geminiModel: getVal("setting-gemini-model"),
        openaiKey: getVal("setting-openai-key"),
        openaiModel: getVal("setting-openai-model"),
        anthropicKey: getVal("setting-anthropic-key"),
        anthropicModel: getVal("setting-anthropic-model"),
        openrouterKey: getVal("setting-openrouter-key"),
        openrouterModel: getVal("setting-openrouter-model"),
        baseUrl: getVal("setting-base-url") ? `${getVal("setting-base-url").replace(/\/v1.*$/, "")}/v1/chat/completions` : undefined,
        localModel: getVal("setting-local-model") || current.localModel
    };

    saveConfig(newConfig);

    const btn = document.getElementById("save-settings");
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = "✓ Saved";
        btn.classList.add("saved");
        setTimeout(() => { btn.textContent = originalText || "Save"; btn.classList.remove("saved"); }, 1500);
    }

    showToast("success", "Settings saved successfully");
    setTimeout(() => { const panel = document.getElementById("settings-panel"); if (panel) panel.style.display = "none"; }, 800);
}

// ═══════════════════════════════════════════════════════════════
// PLANNING MODE — Chat Functions
// ═══════════════════════════════════════════════════════════════

function setupChatInput(): void {
    const input = document.getElementById("chat-input") as HTMLTextAreaElement;
    if (!input) return;

    input.addEventListener("input", () => {
        input.style.height = "auto";
        input.style.height = Math.min(input.scrollHeight, 80) + "px";
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });
}

async function sendChatMessage(): Promise<void> {
    if (isChatBusy) {
        if (chatAbortController) chatAbortController.abort();
        return;
    }

    const input = document.getElementById("chat-input") as HTMLTextAreaElement;
    if (!input) return;
    const message = input.value.trim();
    if (!message) return;

    const welcome = document.querySelector(".chat-welcome") as HTMLElement;
    if (welcome) welcome.remove();

    addChatBubble("user", message);
    chatHistory.push({ role: "user", content: message, timestamp: Date.now() });

    // Build conversation context
    if (chatConversation.length === 0) {
        let initialPrompt = WORD_CHAT_PROMPT;
        try {
            const docCtx = await readDocumentContext();
            if (docCtx && docCtx.hasContent) {
                initialPrompt += "\n\n[INITIAL DOCUMENT OVERVIEW]\n";
                initialPrompt += `Document: "${docCtx.documentTitle}"\n`;
                initialPrompt += `Paragraphs: ${docCtx.paragraphCount}, Words: ~${docCtx.wordCount}\n`;
                initialPrompt += `Headings: ${docCtx.headings.join(", ") || "None"}\n`;
                initialPrompt += `Content preview: "${docCtx.sampleText.substring(0, 500)}"`;
            }
        } catch (e) {
            console.warn("Could not load document overview:", e);
        }
        chatConversation.push({ role: "system", content: initialPrompt });
    }

    // Context awareness for document queries
    const needsDocContext = /\b(this|my|current|opened?)\s+(doc|document|resume|letter|word|file|text)\b|\b(find|search|check|improve|fix|format|analyze|review|proofread|summarize)\b/i.test(message);

    if (needsDocContext) {
        try {
            const docCtx = await readDocumentContext();
            if (docCtx && docCtx.hasContent) {
                chatConversation.push({
                    role: "system",
                    content: `[DOCUMENT CONTEXT]\nTitle: "${docCtx.documentTitle}"\nParagraphs: ${docCtx.paragraphCount}\nWord count: ~${docCtx.wordCount}\nHeadings: ${docCtx.headings.join(", ") || "None"}\nContent:\n"${docCtx.sampleText}"`
                });

                const lastBubble = document.querySelector('.chat-msg.user:last-child .chat-bubble');
                if (lastBubble) {
                    const badge = document.createElement('span');
                    badge.className = 'context-badge';
                    badge.innerHTML = '📄 Document context loaded';
                    lastBubble.appendChild(badge);
                }
            }
        } catch (e) {
            console.warn('Could not load document context:', e);
        }
    }

    chatConversation.push({ role: "user", content: message });

    // Include attached file content in the conversation
    if (attachedFiles.length > 0) {
        const fileTexts: string[] = [];
        for (const file of attachedFiles) {
            if (file.extractedText) {
                fileTexts.push(`[ATTACHED FILE: "${file.name}"]\n${file.extractedText}`);
            }
        }
        if (fileTexts.length > 0) {
            chatConversation.push({
                role: "system",
                content: `[UPLOADED FILE CONTENT]\nThe user has attached ${attachedFiles.length} file(s). Here is the extracted text content:\n\n${fileTexts.join("\n\n---\n\n")}\n\nUse this data to answer the user's request. If they ask you to create a resume, use the information from these files as the source material.`
            });

            const lastBubble = document.querySelector('.chat-msg.user:last-child .chat-bubble');
            if (lastBubble) {
                const badge = document.createElement('span');
                badge.className = 'context-badge';
                badge.innerHTML = `📎 ${attachedFiles.length} file(s) attached`;
                lastBubble.appendChild(badge);
            }
        }
        // Clear attached files after including them
        attachedFiles = [];
        updateFilePreview(false, false);
    }

    input.value = "";
    input.style.height = "auto";

    const skeletonEl = showTypingIndicator();
    isChatBusy = true;

    const chatSendButton = document.getElementById("chat-send") as HTMLButtonElement;
    const chatSendIcon = document.getElementById("chat-send-icon");
    if (chatSendButton) {
        if (chatSendIcon) chatSendIcon.innerHTML = Icons.stop;
        chatSendButton.classList.add("is-busy");
    }

    chatAbortController = new AbortController();

    try {
        const response = await callLLM(chatConversation, undefined, chatAbortController.signal);
        const formattedResponse = formatChatResponse(response);

        if (skeletonEl) {
            const newBubble = createChatBubble("ai", formattedResponse, response);
            skeletonEl.replaceWith(newBubble);
        }

        chatConversation.push({ role: "assistant", content: response });
        chatHistory.push({ role: "ai", content: response, timestamp: Date.now() });

    } catch (error: any) {
        if (skeletonEl) skeletonEl.remove();
        if (error.name === 'AbortError') {
            addChatBubble("ai", `<p style="color:var(--text-3)"><i>Generation stopped.</i></p>`);
        } else {
            addChatBubble("ai", `<p style="color:var(--error)">⚠️ ${error.message}</p>`);
            showToast("error", error.message?.substring(0, 80) || "Something went wrong");
        }
    } finally {
        isChatBusy = false;
        chatAbortController = null;
        if (chatSendButton) {
            const sendIcon = document.getElementById("chat-send-icon");
            if (sendIcon) sendIcon.innerHTML = Icons.send;
            chatSendButton.classList.remove("is-busy");
        }
    }
}

function clearChat(): void {
    const container = document.getElementById("chat-messages");
    if (container) {
        container.innerHTML = `
      <div class="chat-welcome">
        <img src="../../assets/icon-80-v2.png" alt="DocOS Logo" style="width: 64px; height: 64px; margin-bottom: 16px;">
        <h2>What are you working on?</h2>
        <div class="welcome-suggestions" id="chat-suggestions"></div>
      </div>`;
        buildChatSuggestions();
    }
    chatHistory.length = 0;
    chatConversation = [];
}

// ─── Chat UI Helpers ──────────────────────────────────────────

function createChatBubble(role: "user" | "ai", htmlContent: string, rawContent?: string): HTMLElement {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${role}`;

    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "chat-bubble";
    bubbleDiv.innerHTML = htmlContent;

    if (role === "ai" && rawContent) {
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "chat-bubble-actions";

        const copyBtn = document.createElement("button");
        copyBtn.className = "btn-copy";
        copyBtn.innerHTML = `${Icons.copy} Copy`;
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(rawContent).then(() => {
                copyBtn.innerHTML = `${Icons.check} Copied`;
                copyBtn.classList.add("copied");
                setTimeout(() => { copyBtn.innerHTML = `${Icons.copy} Copy`; copyBtn.classList.remove("copied"); }, 2000);
            });
        };
        actionsDiv.appendChild(copyBtn);

        const execBtn = document.createElement("button");
        execBtn.className = "btn-execute-from-chat";
        execBtn.innerHTML = `${Icons.zap} Switch to Agent`;
        execBtn.onclick = () => {
            const agentPromptInput = document.getElementById("prompt-input") as HTMLTextAreaElement;
            if (agentPromptInput) {
                agentPromptInput.value = rawContent.substring(0, 500);
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
    container.scrollTop = container.scrollHeight;

    return msgDiv;
}

function showTypingIndicator(): HTMLElement | null {
    const template = document.getElementById("chat-skeleton-template") as HTMLTemplateElement;
    if (!template) return null;

    const container = document.getElementById("chat-messages");
    if (!container) return null;

    const skeleton = template.content.cloneNode(true) as DocumentFragment;
    const skeletonDiv = skeleton.querySelector(".chat-msg") as HTMLElement;
    container.appendChild(skeleton);
    container.scrollTop = container.scrollHeight;

    return skeletonDiv || container.lastElementChild as HTMLElement;
}

function formatChatResponse(text: string): string {
    let html = text;
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/^\s*[-•]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    html = html.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li>$2</li>');
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    if (!html.startsWith('<')) html = '<p>' + html + '</p>';
    return html;
}

function setupScrollToBottom(): void {
    const scrollBtn = document.getElementById("scroll-to-bottom");
    const chatContainer = document.getElementById("chat-messages");
    if (!scrollBtn || !chatContainer) return;

    chatContainer.addEventListener("scroll", () => {
        const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 100;
        scrollBtn.classList.toggle("visible", !isNearBottom);
    });

    scrollBtn.onclick = () => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };
}

// ═══════════════════════════════════════════════════════════════
// AGENT MODE — Word Execution
// ═══════════════════════════════════════════════════════════════

function setupAgentKeyboardShortcut(): void {
    const input = document.getElementById("prompt-input") as HTMLTextAreaElement;
    const button = document.getElementById("run") as HTMLButtonElement;
    if (!input) return;

    // Auto-resize textarea as user types
    input.addEventListener("input", () => {
        input.style.height = "auto";
        input.style.height = Math.min(input.scrollHeight, 80) + "px";
        // Enable/disable Execute button based on input content
        updateExecuteButtonState();
    });

    // Enter to submit (Shift+Enter for newline)
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.value.trim() || attachedFiles.length > 0) {
                runWordAICommand();
            }
        }
    });

    // Initial button state
    updateExecuteButtonState();
}

function updateExecuteButtonState(): void {
    const input = document.getElementById("prompt-input") as HTMLTextAreaElement;
    const button = document.getElementById("run") as HTMLButtonElement;
    if (!input || !button) return;

    const hasContent = input.value.trim().length > 0 || attachedFiles.length > 0;
    // Don't disable if agent is running (it becomes a Stop button)
    if (button.classList.contains("is-busy")) return;
    button.disabled = !hasContent;
    button.style.opacity = hasContent ? "1" : "0.5";
    button.style.cursor = hasContent ? "pointer" : "not-allowed";
}

// ─── Diff dismiss handler ──────────────────────────────────────
function setupDiffDismiss(): void {
    const dismissBtn = document.getElementById("ai-diff-dismiss");
    if (dismissBtn) {
        dismissBtn.onclick = () => {
            const diffView = document.getElementById("ai-diff-view");
            if (diffView) diffView.classList.remove("active");
        };
    }
}

// ─── Hardcoded Actions — deterministic code for well-defined ops (bypasses LLM) ──

/**
 * Some operations are too critical or specific to trust LLM generation.
 * This map intercepts known prompts and runs battle-tested code directly.
 * Returns the number of items affected, or -1 if the prompt is not hardcoded.
 */
async function tryHardcodedAction(userPrompt: string): Promise<{ handled: boolean; message?: string }> {
    const lower = userPrompt.toLowerCase();

    // Skip hardcoded actions when files are attached — user wants to CREATE content, not fix existing
    if (attachedFiles.length > 0) {
        return { handled: false };
    }

    // ── Make Links Clickable ──────────────────────────────────
    // Only match when the PRIMARY intent is about making links clickable,
    // not when "link" or "clickable" appear as part of a larger creation request
    const isLinkAction = (
        (lower.includes("clickable") || lower.includes("hyperlink")) &&
        !lower.includes("resume") && !lower.includes("create") &&
        !lower.includes("build") && !lower.includes("make me") &&
        !lower.includes("generate") && !lower.includes("write")
    ) || (
        lower.includes("link") && (lower.includes("make") || lower.includes("all")) &&
        !lower.includes("resume") && !lower.includes("create") &&
        !lower.includes("build") && !lower.includes("make me") &&
        !lower.includes("generate") && !lower.includes("write")
    );

    if (isLinkAction) {
        let count = 0;
        // @ts-ignore
        await Word.run(async (ctx: any) => {
            // Check if user has selected text — if so, only operate on the selection
            const selection = ctx.document.getSelection();
            selection.load("text");
            await ctx.sync();
            const selectedText = (selection.text || "").trim();

            if (selectedText.length > 0) {
                // SELECTION MODE: Only make the selected text clickable
                console.log(`[HardcodedAction] Selection mode — selected: "${selectedText}"`);

                // Extract URLs from the selected text
                const urlRegex = /https?:\/\/[^\s,)>\]"']+/g;
                const wwwRegex = /(?<![\/\/])www\.[^\s,)>\]"']+/g;
                const foundUrls: string[] = [];

                let m: RegExpExecArray | null;
                while ((m = urlRegex.exec(selectedText)) !== null) {
                    let url = m[0].replace(/[.,;:!?)]+$/, "");
                    if (!foundUrls.includes(url)) foundUrls.push(url);
                }
                while ((m = wwwRegex.exec(selectedText)) !== null) {
                    let url = m[0].replace(/[.,;:!?)]+$/, "");
                    if (!foundUrls.includes(url)) foundUrls.push(url);
                }

                if (foundUrls.length > 0) {
                    // Search within the selection for each URL
                    for (const url of foundUrls) {
                        const fullUrl = url.startsWith("http") ? url : "https://" + url;
                        const searchResults = selection.search(url, { matchCase: false, matchWholeWord: false });
                        searchResults.load("items");
                        await ctx.sync();
                        for (let k = 0; k < searchResults.items.length; k++) {
                            searchResults.items[k].hyperlink = fullUrl;
                            searchResults.items[k].font.color = "#0563C1";
                            searchResults.items[k].font.underline = "Single";
                            count++;
                        }
                        await ctx.sync();
                    }
                } else {
                    // The entire selection IS the URL (e.g. user selected "www.linkedin.com/in/nishant")
                    let linkUrl = selectedText;
                    if (!linkUrl.startsWith("http")) linkUrl = "https://" + linkUrl;
                    selection.hyperlink = linkUrl;
                    selection.font.color = "#0563C1";
                    selection.font.underline = "Single";
                    await ctx.sync();
                    count = 1;
                }
            } else {
                // NO SELECTION: Scan entire document
                const body = ctx.document.body;
                const paras = body.paragraphs;
                paras.load("items/text");
                await ctx.sync();

                const urlRegex = /https?:\/\/[^\s,)>\]"']+/g;
                const foundUrls: string[] = [];
                for (let i = 0; i < paras.items.length; i++) {
                    const txt = paras.items[i].text || "";
                    let m: RegExpExecArray | null;
                    while ((m = urlRegex.exec(txt)) !== null) {
                        let url = m[0].replace(/[.,;:!?)]+$/, "");
                        if (!foundUrls.includes(url)) foundUrls.push(url);
                    }
                }

                for (let j = 0; j < foundUrls.length; j++) {
                    const url = foundUrls[j];
                    const searchResults = body.search(url, { matchCase: false, matchWholeWord: false });
                    searchResults.load("items");
                    await ctx.sync();
                    for (let k = 0; k < searchResults.items.length; k++) {
                        searchResults.items[k].hyperlink = url;
                        searchResults.items[k].font.color = "#0563C1";
                        searchResults.items[k].font.underline = "Single";
                        count++;
                    }
                    await ctx.sync();
                }

                const wwwRegex = /(?<![\/\/])www\.[^\s,)>\]"']+/g;
                for (let i = 0; i < paras.items.length; i++) {
                    const txt = paras.items[i].text || "";
                    let m: RegExpExecArray | null;
                    while ((m = wwwRegex.exec(txt)) !== null) {
                        let url = m[0].replace(/[.,;:!?)]+$/, "");
                        const fullUrl = "https://" + url;
                        const searchResults = body.search(url, { matchCase: false, matchWholeWord: false });
                        searchResults.load("items");
                        await ctx.sync();
                        for (let k = 0; k < searchResults.items.length; k++) {
                            searchResults.items[k].hyperlink = fullUrl;
                            searchResults.items[k].font.color = "#0563C1";
                            searchResults.items[k].font.underline = "Single";
                            count++;
                        }
                        await ctx.sync();
                    }
                }
            }
        });

        if (count === 0) {
            return { handled: true, message: "⚠️ No URLs found. Make sure the text contains links starting with http://, https://, or www." };
        }
        return { handled: true, message: `✅ Made ${count} link${count !== 1 ? "s" : ""} clickable!` };
    }

    // Not a hardcoded action — fall through to LLM
    return { handled: false };
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXECUTION — Run AI Command
// ═══════════════════════════════════════════════════════════════

async function runWordAICommand(): Promise<void> {
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

    if (!userPrompt && attachedFiles.length === 0) {
        showStatus(statusEl, "info", "Please enter a command.");
        return;
    }

    if (!userPrompt && attachedFiles.length > 0) {
        userPrompt = "Analyze the attached file and extract relevant content into the document.";
    }

    // Cancel if already running
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
    hideEditingOverlay();
    hideDiffView();

    // Capture document text BEFORE execution for diff
    let beforeText = "";
    try {
        // @ts-ignore
        await Word.run(async (ctx: any) => {
            const b = ctx.document.body;
            b.load("text");
            await ctx.sync();
            beforeText = b.text || "";
        });
    } catch (e) { console.warn("[Diff] Could not capture before-text:", e); }

    try {
        // ═══ HARDCODED ACTIONS — bypass LLM for deterministic operations ═══
        try {
            const hardcoded = await tryHardcodedAction(userPrompt);
            if (hardcoded.handled) {
                skeletonEl.style.display = "none";
                debugEl.innerText = "// Executed via hardcoded action (no LLM needed)";
                hideEditingOverlay();
                const isError = hardcoded.message?.startsWith("⚠️") || hardcoded.message?.startsWith("❌");
                showStatus(statusEl, isError ? "info" : "success", hardcoded.message || "✅ Done!");
                if (!isError) showToast("success", hardcoded.message || "Done!");
                // Show diff
                try {
                    let afterText = "";
                    // @ts-ignore
                    await Word.run(async (ctx: any) => {
                        const b = ctx.document.body;
                        b.load("text");
                        await ctx.sync();
                        afterText = b.text || "";
                    });
                    if (beforeText || afterText) showDiffView(beforeText, afterText);
                } catch (e) { /* ignore diff errors */ }
                return;
            }
        } catch (hardcodedErr: any) {
            console.warn("[HardcodedAction] Failed, falling back to LLM:", hardcodedErr);
            // Fall through to normal LLM pipeline
        }

        let code: string;
        let fromCache = false;

        // Read document context
        let docContext: DocumentContext | null = null;
        try {
            docContext = await readDocumentContext();
            if (docContext?.hasContent) {
                console.log(`[WordAgent] Document context: ${docContext.paragraphCount} paragraphs, ~${docContext.wordCount} words`);
            }
        } catch (e) {
            console.warn("[WordAgent] Could not read document context:", e);
        }

        // Check cache
        const cached = getCachedResponse(userPrompt);
        if (cached) {
            code = cached;
            fromCache = true;
            cacheBadge.style.display = "inline-block";

            const validation = validateWordCode(code);
            if (!validation.isValid) {
                fromCache = false;
                code = "";
            } else {
                code = validation.sanitizedCode;
            }
        }

        // Generate code if not cached
        if (!fromCache) {
            if (runText) runText.innerText = "Generating...";

            const wordAttachedFiles: WordAttachedFile[] = attachedFiles.map(f => ({
                name: f.name,
                type: f.type as "image" | "pdf" | "docx",
                data: f.data,
                extractedText: f.extractedText
            }));

            const result = await runWordAgent(
                userPrompt,
                docContext,
                wordAttachedFiles,
                { enablePlanning: true, strictValidation: true },
                signal
            );

            // Clear attached files after use
            attachedFiles = [];
            updateFilePreview(false, true);

            if (!result.success) {
                throw new Error(result.error || "Code generation failed");
            }

            code = result.code;

            if (!fromCache) {
                cacheResponse(userPrompt, code);
            }
        }

        skeletonEl.style.display = "none";
        debugEl.innerText = code;

        if (runText) runText.innerText = "Executing...";

        // Show live editing animation
        showEditingOverlay(code);

        // Execute the code in Word
        // @ts-ignore
        const executionResult = await executeWordWithRecovery(code, async (codeToRun: string) => {
            // @ts-ignore
            await Word.run(async (ctx: any) => {
                const wordBody = ctx.document.body;

                const executeFn = new Function("context", "body", "Word", `return (async () => { ${codeToRun} })();`);
                // @ts-ignore
                await executeFn(ctx, wordBody, Word);

                await ctx.sync();
            });
        }, 2, signal);

        // Hide editing overlay
        hideEditingOverlay();

        if (executionResult.success) {
            showStatus(statusEl, "success", "✅ Done! Document updated successfully.");
            showToast("success", "Document updated!");

            // Capture AFTER text and show diff
            try {
                let afterText = "";
                // @ts-ignore
                await Word.run(async (ctx: any) => {
                    const b = ctx.document.body;
                    b.load("text");
                    await ctx.sync();
                    afterText = b.text || "";
                });
                if (beforeText || afterText) {
                    showDiffView(beforeText, afterText);
                }
            } catch (e) { console.warn("[Diff] Could not capture after-text:", e); }
        } else {
            showStatus(statusEl, "error", `❌ Error: ${executionResult.error}`);
            showToast("error", executionResult.error?.substring(0, 80) || "Execution failed");
        }

    } catch (error: any) {
        skeletonEl.style.display = "none";
        hideEditingOverlay();
        if (error.name === 'AbortError') {
            showStatus(statusEl, "info", "⏹ Agent stopped.");
        } else {
            showStatus(statusEl, "error", `❌ ${error.message}`);
            showToast("error", error.message?.substring(0, 80) || "Something went wrong");
        }
    } finally {
        agentAbortController = null;
        button.classList.remove("is-busy");
        button.classList.remove("btn-stop");
        if (runText) runText.innerText = originalText;
        if (runIcon) runIcon.innerHTML = originalIcon;
        updateExecuteButtonState();
    }
}

// ═══════════════════════════════════════════════════════════════
// AI EDITING ANIMATION SYSTEM
// ═══════════════════════════════════════════════════════════════

let editAnimInterval: ReturnType<typeof setInterval> | null = null;

/** Show the live editing overlay with animated code lines */
function showEditingOverlay(code: string): void {
    const overlay = document.getElementById("ai-editing-overlay");
    const linesEl = document.getElementById("ai-edit-lines");
    const phaseEl = document.getElementById("ai-edit-phase");
    const progressBar = document.getElementById("ai-edit-progress-bar");
    if (!overlay || !linesEl) return;

    linesEl.innerHTML = "";
    if (progressBar) progressBar.style.width = "0%";
    overlay.classList.add("active");

    // Parse the generated code into display lines
    const codeLines = code.split("\n").filter(l => l.trim().length > 0);
    const displayLines: { text: string; type: "added" | "removed" | "context" }[] = [];

    for (const line of codeLines) {
        const trimmed = line.trim();
        // Heuristic: lines with .delete(), search/replace removals = removed
        if (/\.delete\(\)/.test(trimmed) || /insertText\(.*replace/i.test(trimmed)) {
            displayLines.push({ text: trimmed, type: "removed" });
        }
        // Lines that set properties, insert text = added
        else if (/\.font\.|\.style|\.hyperlink|\.alignment|insertParagraph|insertText|insertTable|insertHtml|\.spaceAfter|\.spaceBefore|\.lineSpacing/i.test(trimmed)) {
            displayLines.push({ text: trimmed, type: "added" });
        }
        // Everything else is context
        else {
            displayLines.push({ text: trimmed, type: "context" });
        }
    }

    // Show only a subset (max 12 lines)
    const toShow = displayLines.slice(0, 12);
    let lineIndex = 0;

    const phases = ["Analyzing...", "Reading document...", "Applying changes...", "Formatting...", "Finalizing..."];
    let phaseIndex = 0;

    // Animate lines appearing one by one
    editAnimInterval = setInterval(() => {
        if (lineIndex < toShow.length) {
            const item = toShow[lineIndex];
            const lineDiv = document.createElement("div");
            lineDiv.className = `ai-edit-line ${item.type}`;
            lineDiv.style.animationDelay = "0ms";

            const gutter = document.createElement("span");
            gutter.className = "line-gutter";
            gutter.textContent = item.type === "added" ? "+" : item.type === "removed" ? "−" : " ";

            const content = document.createElement("span");
            content.className = "line-content";

            // Truncate long lines
            const displayText = item.text.length > 50 ? item.text.substring(0, 50) + "..." : item.text;
            content.textContent = displayText;

            // Add typing cursor to last added line
            if (item.type === "added" && lineIndex === toShow.length - 1) {
                const cursor = document.createElement("span");
                cursor.className = "typing-cursor";
                content.appendChild(cursor);
            }

            lineDiv.appendChild(gutter);
            lineDiv.appendChild(content);
            linesEl.appendChild(lineDiv);

            // Keep scrolled to bottom
            linesEl.scrollTop = linesEl.scrollHeight;

            lineIndex++;
        }

        // Update phase text
        phaseIndex++;
        if (phaseEl && phaseIndex % 4 === 0) {
            const pi = Math.min(Math.floor(phaseIndex / 4), phases.length - 1);
            phaseEl.textContent = phases[pi];
        }

        // Update progress bar
        if (progressBar) {
            const progress = Math.min(95, (lineIndex / Math.max(toShow.length, 1)) * 85 + 10);
            progressBar.style.width = progress + "%";
        }
    }, 250);
}

/** Hide the editing overlay and clean up */
function hideEditingOverlay(): void {
    if (editAnimInterval) {
        clearInterval(editAnimInterval);
        editAnimInterval = null;
    }

    const overlay = document.getElementById("ai-editing-overlay");
    const progressBar = document.getElementById("ai-edit-progress-bar");

    if (progressBar) progressBar.style.width = "100%";

    // Brief delay to show completion
    setTimeout(() => {
        if (overlay) overlay.classList.remove("active");
    }, 300);
}

// ═══════════════════════════════════════════════════════════════
// DIFF VIEW SYSTEM
// ═══════════════════════════════════════════════════════════════

/** Compute a simple line-level diff between two texts */
function computeSimpleDiff(before: string, after: string): { type: "added" | "removed" | "context" | "separator"; text: string }[] {
    const beforeLines = before.split(/\r?\n/).map(l => l.trimEnd());
    const afterLines = after.split(/\r?\n/).map(l => l.trimEnd());

    const result: { type: "added" | "removed" | "context" | "separator"; text: string }[] = [];

    // Simple LCS-based diff for reasonable-sized documents
    const beforeSet = new Map<string, number[]>();
    beforeLines.forEach((line, i) => {
        if (!beforeSet.has(line)) beforeSet.set(line, []);
        beforeSet.get(line)!.push(i);
    });

    const afterSet = new Map<string, number[]>();
    afterLines.forEach((line, i) => {
        if (!afterSet.has(line)) afterSet.set(line, []);
        afterSet.get(line)!.push(i);
    });

    // Find lines only in before (removed), only in after (added), in both (context)
    const usedBefore = new Set<number>();
    const usedAfter = new Set<number>();

    // Match identical lines in order
    let bIdx = 0;
    let aIdx = 0;
    while (bIdx < beforeLines.length && aIdx < afterLines.length) {
        if (beforeLines[bIdx] === afterLines[aIdx]) {
            usedBefore.add(bIdx);
            usedAfter.add(aIdx);
            bIdx++;
            aIdx++;
        } else {
            // Try to find next match
            let foundInAfter = -1;
            for (let j = aIdx; j < Math.min(aIdx + 10, afterLines.length); j++) {
                if (afterLines[j] === beforeLines[bIdx]) { foundInAfter = j; break; }
            }
            let foundInBefore = -1;
            for (let j = bIdx; j < Math.min(bIdx + 10, beforeLines.length); j++) {
                if (beforeLines[j] === afterLines[aIdx]) { foundInBefore = j; break; }
            }

            if (foundInAfter >= 0 && (foundInBefore < 0 || (foundInAfter - aIdx) <= (foundInBefore - bIdx))) {
                // Lines in after before match are additions
                for (let j = aIdx; j < foundInAfter; j++) {
                    usedAfter.add(j);
                }
                aIdx = foundInAfter;
            } else if (foundInBefore >= 0) {
                // Lines in before before match are removals
                for (let j = bIdx; j < foundInBefore; j++) {
                    usedBefore.add(j);
                }
                bIdx = foundInBefore;
            } else {
                usedBefore.add(bIdx);
                usedAfter.add(aIdx);
                bIdx++;
                aIdx++;
            }
        }
    }

    // Build diff output (simplified: walk both arrays)
    bIdx = 0;
    aIdx = 0;
    let contextCount = 0;
    const MAX_CONTEXT = 2; // Show max 2 unchanged lines between changes

    while (bIdx < beforeLines.length || aIdx < afterLines.length) {
        const bLine = bIdx < beforeLines.length ? beforeLines[bIdx] : null;
        const aLine = aIdx < afterLines.length ? afterLines[aIdx] : null;

        if (bLine !== null && aLine !== null && bLine === aLine) {
            // Context (matching line)
            contextCount++;
            if (contextCount <= MAX_CONTEXT) {
                result.push({ type: "context", text: bLine || " " });
            } else if (contextCount === MAX_CONTEXT + 1) {
                result.push({ type: "separator", text: "···" });
            }
            bIdx++;
            aIdx++;
        } else {
            contextCount = 0;
            // Check if current before line was removed
            if (bLine !== null && (aLine === null || bLine !== aLine)) {
                // Is this line NOT in the after set at roughly similar position?
                const afterOccurrences = afterSet.get(bLine) || [];
                const stillExists = afterOccurrences.some(j => j >= aIdx - 3 && j <= aIdx + 10);
                if (!stillExists && bLine.trim().length > 0) {
                    result.push({ type: "removed", text: bLine });
                }
                bIdx++;
            }
            if (aLine !== null && (bLine === null || aLine !== bLine)) {
                const beforeOccurrences = beforeSet.get(aLine) || [];
                const existedBefore = beforeOccurrences.some(j => j >= bIdx - 3 && j <= bIdx + 10);
                if (!existedBefore && aLine.trim().length > 0) {
                    result.push({ type: "added", text: aLine });
                }
                aIdx++;
            }
        }
    }

    // Limit total lines for display
    return result.slice(0, 30);
}

/** Show the diff view with before/after comparison */
function showDiffView(before: string, after: string): void {
    const diffView = document.getElementById("ai-diff-view");
    const diffBody = document.getElementById("ai-diff-body");
    const diffStats = document.getElementById("ai-diff-stats");
    if (!diffView || !diffBody) return;

    const diff = computeSimpleDiff(before, after);

    // Don't show if no meaningful changes
    const addedCount = diff.filter(d => d.type === "added").length;
    const removedCount = diff.filter(d => d.type === "removed").length;
    if (addedCount === 0 && removedCount === 0) return;

    // Stats
    if (diffStats) {
        diffStats.innerHTML = `
            <span class="stat-added">+${addedCount}</span>
            <span class="stat-removed">−${removedCount}</span>
        `;
    }

    // Build diff lines
    diffBody.innerHTML = "";
    diff.forEach((item, index) => {
        if (item.type === "separator") {
            const sep = document.createElement("div");
            sep.className = "diff-separator";
            sep.textContent = item.text;
            diffBody.appendChild(sep);
            return;
        }

        const lineEl = document.createElement("div");
        lineEl.className = `diff-line diff-${item.type}`;
        lineEl.style.animationDelay = `${index * 40}ms`;

        const gutter = document.createElement("span");
        gutter.className = "diff-gutter";
        gutter.textContent = item.type === "added" ? "+" : item.type === "removed" ? "−" : " ";

        const text = document.createElement("span");
        text.className = "diff-text";

        // For added lines, wrap in highlight span
        if (item.type === "added") {
            const highlight = document.createElement("span");
            highlight.className = "diff-highlight";
            highlight.textContent = item.text || " ";
            text.appendChild(highlight);
        } else {
            text.textContent = item.text || " ";
        }

        lineEl.appendChild(gutter);
        lineEl.appendChild(text);
        diffBody.appendChild(lineEl);
    });

    diffView.classList.add("active");
}

/** Hide the diff view */
function hideDiffView(): void {
    const diffView = document.getElementById("ai-diff-view");
    if (diffView) diffView.classList.remove("active");
}

// ─── Status & Toast ──────────────────────────────────────────

function showStatus(el: HTMLElement, type: string, message: string): void {
    el.style.display = "flex";
    el.className = `status-pill status-${type}`;
    el.innerHTML = message;
}

function showToast(type: string, message: string): void {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}</span>
    <span class="toast-text">${message}</span>
  `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("toast-exit");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ═══════════════════════════════════════════════════════════════
// FILE HANDLING — Attach PDFs, Images, and Word Documents
// ═══════════════════════════════════════════════════════════════

const PAPERCLIP_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`;

async function handleFileSelect(event: Event, isAgent: boolean = false): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const btnId = isAgent ? "agent-file-btn" : "file-upload-btn";
    const btn = document.getElementById(btnId);
    if (btn) btn.innerHTML = `<span class="btn-spinner"></span>`;

    try {
        const newFiles: typeof attachedFiles = [];

        for (let i = 0; i < input.files.length; i++) {
            const file = input.files[i];

            if (file.type === "application/pdf") {
                // Extract actual text from the PDF for content-based tasks
                let extractedText = "";
                try {
                    const extractFn = await getPdfExtractor();
                    const pdfResult = await extractFn(file);
                    extractedText = pdfResult.text;
                } catch (e) {
                    console.warn("PDF text extraction failed, falling back to image mode:", e);
                }

                // Also render pages as images for vision model fallback
                const arrayBuffer = await file.arrayBuffer();
                const images = await renderPdfToImages(arrayBuffer);
                newFiles.push({ name: file.name, type: "pdf", data: images, extractedText });

            } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
                // Extract text from DOCX using the Word API or manual parsing
                let extractedText = "";
                try {
                    extractedText = await extractTextFromDocx(file);
                } catch (e) {
                    console.warn("DOCX text extraction failed:", e);
                }
                newFiles.push({ name: file.name, type: "docx", data: [], extractedText });

            } else if (file.type.startsWith("image/")) {
                const base64 = await fileToBase64(file);
                newFiles.push({ name: file.name, type: "image", data: [base64] });
            }
        }

        if (newFiles.length > 0) {
            attachedFiles = [...attachedFiles, ...newFiles];
            updateFilePreview(true, isAgent);
        } else {
            showToast("error", "Unsupported file type. Use PDF, DOCX, or images.");
        }
    } catch (error: any) {
        console.error("File handling error:", error);
        showToast("error", "Error reading file: " + error.message);
    } finally {
        // Reset input so the same file can be selected again
        input.value = "";
        if (btn) btn.innerHTML = PAPERCLIP_SVG;
    }
}

/**
 * Extract text from a DOCX file.
 * DOCX is a ZIP archive with word/document.xml containing paragraph data.
 * We parse the ZIP structure, decompress the XML, and extract <w:t> text nodes.
 */
async function extractTextFromDocx(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    const entries = parseZipEntries(uint8);
    const docEntry = entries.find(e => e.name === "word/document.xml");

    if (!docEntry) {
        throw new Error("Not a valid DOCX file — word/document.xml not found.");
    }

    const xmlText = await decompressZipEntry(uint8, docEntry);

    // Extract text from <w:t> elements within <w:p> paragraphs
    const textParts: string[] = [];
    const paragraphRegex = /<w:p[\s>][\s\S]*?<\/w:p>/g;
    const textRunRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;

    let pMatch: RegExpExecArray | null;
    while ((pMatch = paragraphRegex.exec(xmlText)) !== null) {
        const paraXml = pMatch[0];
        const paraTexts: string[] = [];
        let tMatch: RegExpExecArray | null;
        textRunRegex.lastIndex = 0;
        while ((tMatch = textRunRegex.exec(paraXml)) !== null) {
            paraTexts.push(tMatch[1]);
        }
        if (paraTexts.length > 0) {
            textParts.push(paraTexts.join(""));
        }
    }

    return textParts.join("\n");
}

interface ZipEntry {
    name: string;
    compressionMethod: number;
    compressedSize: number;
    uncompressedSize: number;
    offset: number;
}

function parseZipEntries(data: Uint8Array): ZipEntry[] {
    const entries: ZipEntry[] = [];
    let pos = 0;
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

    while (pos < data.length - 4) {
        const sig = view.getUint32(pos, true);
        if (sig !== 0x04034b50) break;

        const compressionMethod = view.getUint16(pos + 8, true);
        const compressedSize = view.getUint32(pos + 18, true);
        const uncompressedSize = view.getUint32(pos + 22, true);
        const nameLength = view.getUint16(pos + 26, true);
        const extraLength = view.getUint16(pos + 28, true);

        const nameBytes = data.slice(pos + 30, pos + 30 + nameLength);
        const name = new TextDecoder("utf-8").decode(nameBytes);

        const dataOffset = pos + 30 + nameLength + extraLength;
        entries.push({ name, compressionMethod, compressedSize, uncompressedSize, offset: dataOffset });
        pos = dataOffset + compressedSize;
    }

    return entries;
}

async function decompressZipEntry(zipData: Uint8Array, entry: ZipEntry): Promise<string> {
    const raw = zipData.slice(entry.offset, entry.offset + entry.compressedSize);

    if (entry.compressionMethod === 0) {
        return new TextDecoder("utf-8").decode(raw);
    }

    if (entry.compressionMethod === 8 && typeof DecompressionStream !== "undefined") {
        const ds = new DecompressionStream("deflate-raw");
        const writer = ds.writable.getWriter();
        writer.write(raw);
        writer.close();

        const reader = ds.readable.getReader();
        const chunks: Uint8Array[] = [];
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
        const result = new Uint8Array(totalLength);
        let off = 0;
        for (const chunk of chunks) {
            result.set(chunk, off);
            off += chunk.length;
        }
        return new TextDecoder("utf-8").decode(result);
    }

    // Fallback for environments without DecompressionStream
    return new TextDecoder("utf-8", { fatal: false }).decode(raw);
}

function updateFilePreview(show: boolean, isAgent: boolean = false): void {
    const listId = isAgent ? "agent-file-preview-list" : "file-preview-list";
    const container = document.getElementById(listId);
    if (!container) return;

    container.innerHTML = "";

    if (attachedFiles.length === 0) {
        updateExecuteButtonState();
        return;
    }

    attachedFiles.forEach((file, index) => {
        const chip = document.createElement("div");
        chip.className = "file-chip";

        const icon = document.createElement("span");
        icon.className = "file-chip-icon";
        icon.textContent = file.type === "pdf" ? "PDF" : file.type === "docx" ? "DOC" : "IMG";

        const name = document.createElement("span");
        name.className = "file-chip-name";
        name.textContent = file.name;

        const remove = document.createElement("button");
        remove.className = "file-chip-remove";
        remove.innerHTML = "&times;";
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

    updateExecuteButtonState();
}

function removeFile(index: number, isAgent: boolean): void {
    attachedFiles.splice(index, 1);
    updateFilePreview(true, isAgent);
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
    const pdfjsLib = await getPdfJs();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const images: string[] = [];
    const maxPages = Math.min(pdf.numPages, 5);

    for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: ctx, viewport }).promise;
        images.push(canvas.toDataURL("image/png"));
    }
    return images;
}
