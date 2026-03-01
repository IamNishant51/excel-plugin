
import { ISafeSheetOS } from "../../core/templates/safe-api";

export interface CleaningConfig {
    trim: boolean;
    normalizeCase: "UPPER" | "LOWER" | "PROPER" | "NONE";
    removeDuplicates: boolean;
    dedupeColumn?: number;
}

export class DataCleaningService {
    async cleanData(sheetOS: ISafeSheetOS, address: string, config: CleaningConfig): Promise<any[][]> {
        const data = await sheetOS.readRange(address);
        if (data.length === 0) return [];

        let processed = data.map(row => row.map(cell => {
            let val = cell;

            // 1. Trim
            if (config.trim && typeof val === "string") {
                val = val.trim();
            }

            // 2. Normalize Case
            if (typeof val === "string" && config.normalizeCase !== "NONE") {
                if (config.normalizeCase === "UPPER") val = val.toUpperCase();
                else if (config.normalizeCase === "LOWER") val = val.toLowerCase();
                else if (config.normalizeCase === "PROPER") {
                    val = val.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
                }
            }

            // 3. Text to Number
            if (typeof val === "string" && !isNaN(Number(val)) && val.length > 0) {
                val = Number(val);
            }

            return val;
        }));

        // 4. Deduplication
        if (config.removeDuplicates) {
            const seen = new Set();
            const col = config.dedupeColumn || 0;
            processed = processed.filter(row => {
                const key = row[col];
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        }

        return processed;
    }
}
