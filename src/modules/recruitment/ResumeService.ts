
import { ISafeSheetOS } from "../../core/templates/safe-api";

export interface Candidate {
    name: string;
    email: string;
    phone: string;
    experienceYears: number;
    skills: string[];
    score?: number;
}

export class ResumeService {
    async parseAndScore(sheetOS: ISafeSheetOS, rawTexts: string[], jobDescription: string): Promise<Candidate[]> {
        const jdKeywords = jobDescription.toLowerCase().split(/\W+/).filter(w => w.length > 3);
        const candidates: Candidate[] = [];

        for (const text of rawTexts) {
            const candidate = this.extractDetails(text);
            candidate.score = this.calculateScore(candidate.skills, jdKeywords);
            candidates.push(candidate);
        }

        return candidates;
    }

    private extractDetails(text: string): Candidate {
        // This would typically interface with the existing PDF extractor or a regex engine
        // For the blueprint, we show the extraction pattern:
        return {
            name: this.matchPattern(text, /Name:\s*(.*)/),
            email: this.matchPattern(text, /[\w.-]+@[\w.-]+\.\w+/),
            phone: this.matchPattern(text, /(\+?\d[\d\-\s]{8,}\d)/),
            experienceYears: parseInt(this.matchPattern(text, /(\d+)\s*years/)) || 0,
            skills: text.split(/\W+/).filter(w => w.length > 4).slice(0, 10) // Mock split
        };
    }

    private calculateScore(skills: string[], keywords: string[]): number {
        const matches = skills.filter(s => keywords.includes(s.toLowerCase()));
        return Math.round((matches.length / Math.max(keywords.length, 1)) * 100);
    }

    private matchPattern(text: string, regex: RegExp): string {
        const match = text.match(regex);
        return match ? match[1] || match[0] : "";
    }
}
