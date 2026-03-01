import { ISafeSheetOS } from "../../core/templates/safe-api";

export interface ReconOptions {
    tolerance: number; // e.g. 0.01 for 1%
    dateProximityDays: number; // e.g. 3
}

export interface ReconMatch {
    invoiceId: string;
    amount: number;
    status: "MATCHED" | "PARTIAL_MATCH" | "MISMATCH" | "DUPLICATE";
    bankRow?: any[];
    reason?: string;
}

export class ReconciliationService {
    async reconcile(
        sheetOS: ISafeSheetOS,
        invoiceAddress: string,
        bankAddress: string,
        options: ReconOptions
    ): Promise<ReconMatch[]> {
        const invoices = await sheetOS.readRange(invoiceAddress);
        const bankStatements = await sheetOS.readRange(bankAddress);

        const results: ReconMatch[] = [];

        // Simple Indexing for performance
        const bankMap = new Map<number, any[]>();
        bankStatements.forEach(row => {
            const amt = parseFloat(row[1]); // Assuming Amount is in col 2
            if (!isNaN(amt)) bankMap.set(amt, row);
        });

        // Matching Logic
        for (const invRow of invoices) {
            const invId = String(invRow[0]);
            const invAmt = parseFloat(invRow[1]);

            if (isNaN(invAmt)) continue;

            // 1. Exact Match
            const exactMatch = bankMap.get(invAmt);
            if (exactMatch && String(exactMatch[0]) === invId) {
                results.push({ invoiceId: invId, amount: invAmt, status: "MATCHED", bankRow: exactMatch });
                continue;
            }

            // 2. Tolerance Match (±1%)
            let foundFuzzy = false;
            bankMap.forEach((bankRow, bankAmt) => {
                if (foundFuzzy) return;
                const diff = Math.abs(invAmt - bankAmt) / invAmt;
                if (diff <= options.tolerance) {
                    results.push({
                        invoiceId: invId,
                        amount: invAmt,
                        status: "PARTIAL_MATCH",
                        bankRow,
                        reason: `Amount difference of ${(diff * 100).toFixed(2)}%`
                    });
                    foundFuzzy = true;
                }
            });

            if (!foundFuzzy) {
                results.push({ invoiceId: invId, amount: invAmt, status: "MISMATCH", reason: "No matching amount found in bank statement" });
            }
        }

        return results;
    }
}
