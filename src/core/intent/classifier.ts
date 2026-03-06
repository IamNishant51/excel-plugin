
import { UserIntent, IntentType, SheetSchema } from "../types/sheetos";

/**
 * Intent classifier using weighted keyword scoring.
 *
 * Approach: Instead of first-match-wins, each intent accumulates
 * a weighted score from ALL matching keywords. The intent with the
 * highest score wins. Ties are broken by a priority ordering.
 *
 * This avoids false positives like "remove formatting" being classified
 * as DESTRUCTIVE_ACTION when it's really FORMATTING_ONLY.
 */

interface ScoredKeyword {
    pattern: RegExp;
    weight: number;
}

const INTENT_KEYWORDS: Record<IntentType, ScoredKeyword[]> = {
    DESTRUCTIVE_ACTION: [
        { pattern: /\bdelete\s+(all|everything|sheet|data|rows?|columns?)\b/i, weight: 3 },
        { pattern: /\bremove\s+(all|everything|data|rows?|columns?)\b/i, weight: 3 },
        { pattern: /\bclear\s+(all|everything|data|contents?|sheet)\b/i, weight: 3 },
        { pattern: /\bdrop\b/i, weight: 2 },
        { pattern: /\bwipe\b/i, weight: 3 },
        { pattern: /\berase\b/i, weight: 2 },
        { pattern: /\btruncate\b/i, weight: 3 },
    ],
    STRUCTURAL_CHANGE: [
        { pattern: /\badd\s+(row|column|sheet|header|table)\b/i, weight: 2 },
        { pattern: /\binsert\s+(row|column|sheet)\b/i, weight: 2 },
        { pattern: /\bmerge\s+(cell|row|column)\b/i, weight: 2 },
        { pattern: /\bunmerge\b/i, weight: 2 },
        { pattern: /\bsplit\s+(cell|column)\b/i, weight: 2 },
        { pattern: /\bcreate\s+(table|chart|pivot|sheet)\b/i, weight: 2 },
        { pattern: /\bresize\b/i, weight: 1 },
        { pattern: /\bappend\b/i, weight: 1 },
    ],
    FORMATTING_ONLY: [
        { pattern: /\bformat\b/i, weight: 2 },
        { pattern: /\bstyle\b/i, weight: 2 },
        { pattern: /\bbold\b/i, weight: 2 },
        { pattern: /\bitalic\b/i, weight: 2 },
        { pattern: /\bunderline\b/i, weight: 2 },
        { pattern: /\bcolor\b/i, weight: 2 },
        { pattern: /\bfont\b/i, weight: 2 },
        { pattern: /\bhighlight\b/i, weight: 2 },
        { pattern: /\bborder\b/i, weight: 2 },
        { pattern: /\balign(ment)?\b/i, weight: 2 },
        { pattern: /\btheme\b/i, weight: 1 },
        { pattern: /\bautofit\b/i, weight: 2 },
        { pattern: /\bfreeze\b/i, weight: 1 },
        { pattern: /\bwrap\b/i, weight: 1 },
        { pattern: /\bnumber\s+format\b/i, weight: 2 },
        { pattern: /\bcurrency\b/i, weight: 1 },
        { pattern: /\bpercentage\b/i, weight: 1 },
        // Negative signal: "remove formatting" is formatting, not destructive
        { pattern: /\b(remove|clear|delete)\s+format/i, weight: 3 },
    ],
    DATA_TRANSFORM: [
        { pattern: /\bcalculate\b/i, weight: 2 },
        { pattern: /\bcompute\b/i, weight: 2 },
        { pattern: /\bupdate\b/i, weight: 1 },
        { pattern: /\bset\b/i, weight: 1 },
        { pattern: /\bsum\b/i, weight: 2 },
        { pattern: /\baverage\b/i, weight: 2 },
        { pattern: /\bformula\b/i, weight: 2 },
        { pattern: /\bvlookup\b/i, weight: 2 },
        { pattern: /\bsort\b/i, weight: 2 },
        { pattern: /\bfilter\b/i, weight: 2 },
        { pattern: /\bfind\s+and\s+replace\b/i, weight: 2 },
        { pattern: /\breplace\b/i, weight: 1 },
        { pattern: /\bfill\s+(down|across|series)\b/i, weight: 2 },
        { pattern: /\bconvert\b/i, weight: 2 },
        { pattern: /\btransform\b/i, weight: 2 },
        { pattern: /\bextract\b/i, weight: 1 },
        { pattern: /\bcount\b/i, weight: 1 },
        { pattern: /\bmax\b/i, weight: 1 },
        { pattern: /\bmin\b/i, weight: 1 },
        { pattern: /\bconcatenate\b/i, weight: 2 },
        { pattern: /\bif\s*\(/i, weight: 1 },
    ],
    READ_ONLY: [
        { pattern: /\bshow\b/i, weight: 1 },
        { pattern: /\bdisplay\b/i, weight: 1 },
        { pattern: /\blist\b/i, weight: 1 },
        { pattern: /\bread\b/i, weight: 2 },
        { pattern: /\banalyze\b/i, weight: 2 },
        { pattern: /\bsummarize\b/i, weight: 2 },
        { pattern: /\bdescribe\b/i, weight: 2 },
        { pattern: /\bwhat\b/i, weight: 1 },
        { pattern: /\bhow\s+many\b/i, weight: 2 },
    ],
};

/** Priority order for tie-breaking: safest intent wins */
const INTENT_PRIORITY: IntentType[] = [
    "READ_ONLY",
    "FORMATTING_ONLY",
    "DATA_TRANSFORM",
    "STRUCTURAL_CHANGE",
    "DESTRUCTIVE_ACTION",
];

export class IntentClassifier {
    static async classify(prompt: string, schema: SheetSchema): Promise<UserIntent> {
        const scores: Record<IntentType, number> = {
            READ_ONLY: 0,
            DATA_TRANSFORM: 0,
            STRUCTURAL_CHANGE: 0,
            FORMATTING_ONLY: 0,
            DESTRUCTIVE_ACTION: 0,
        };

        // Score each intent by summing weights of all matching keywords
        for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS) as [IntentType, ScoredKeyword[]][]) {
            for (const kw of keywords) {
                if (kw.pattern.test(prompt)) {
                    scores[intent] += kw.weight;
                }
            }
        }

        // Find max score
        let maxScore = 0;
        let bestIntent: IntentType = "READ_ONLY";
        for (const intent of INTENT_PRIORITY) {
            if (scores[intent] > maxScore) {
                maxScore = scores[intent];
                bestIntent = intent;
            }
        }

        // Default to READ_ONLY when no keywords match (safest)
        const type = maxScore > 0 ? bestIntent : "READ_ONLY";
        const isDestructive = type === "DESTRUCTIVE_ACTION";

        return {
            type,
            description: `Classified as ${type} (score: ${maxScore})`,
            isDestructive,
            requiresConfirmation: isDestructive || type === "STRUCTURAL_CHANGE",
            affectedAspects: IntentClassifier.getAffectedAspects(type),
        };
    }

    private static getAffectedAspects(type: IntentType): ("VALUES" | "FORMULAS" | "STRUCTURE" | "FORMATTING")[] {
        switch (type) {
            case "DESTRUCTIVE_ACTION": return ["STRUCTURE", "VALUES"];
            case "STRUCTURAL_CHANGE": return ["STRUCTURE"];
            case "FORMATTING_ONLY": return ["FORMATTING"];
            case "DATA_TRANSFORM": return ["VALUES", "FORMULAS"];
            case "READ_ONLY": return [];
        }
    }
}
