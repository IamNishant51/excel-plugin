
import { ISafeSheetOS } from "../../core/templates/safe-api";
import { SheetSchema } from "../../core/types/sheetos";

export interface AuditFinding {
    cell: string;
    issue: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    recommendation: string;
}

export interface AuditReport {
    score: number; // 0-100 (Higher is riskier)
    findings: AuditFinding[];
    summary: string;
}

export class RiskAuditService {
    async runAudit(sheetOS: ISafeSheetOS, schema: SheetSchema): Promise<AuditReport> {
        const findings: AuditFinding[] = [];

        // 1. Check for basic size risks
        if (schema.rowCount > 10000) {
            findings.push({
                cell: "Global",
                issue: "Large Dataset Performance Risk",
                severity: "MEDIUM",
                recommendation: "Consider splitting data across multiple sheets or using a database connector."
            });
        }

        // 2. Check for merged cells (Data Integrity Risk)
        if (schema.mergedCells && schema.mergedCells.length > 0) {
            findings.push({
                cell: schema.mergedCells.join(", "),
                issue: "Merged Cells in Data Range",
                severity: "HIGH",
                recommendation: "Unmerge cells and use 'Center Across Selection' to prevent sorting/filtering breaks."
            });
        }

        // 3. Deep Drill into Formulas
        const headers = await sheetOS.readHeaders();
        for (let i = 0; i < headers.length; i++) {
            const colLetter = this.getColumnLetter(i + 1);
            const rangeAddress = `${colLetter}1:${colLetter}${schema.rowCount}`;

            // In a real implementation, we would use a more efficient way to check formulas
            // For this blueprint, we represent the logic:
            // const formulas = await sheetOS.readFormulas(rangeAddress); 
            // checkInconsistency(formulas);
        }

        const score = this.calculateRiskScore(findings, schema);

        return {
            score,
            findings,
            summary: `Audit complete. Found ${findings.length} issues. Overall risk score: ${score}/100.`
        };
    }

    private calculateRiskScore(findings: AuditFinding[], schema: SheetSchema): number {
        let base = 0;
        findings.forEach(f => {
            if (f.severity === "CRITICAL") base += 40;
            if (f.severity === "HIGH") base += 20;
            if (f.severity === "MEDIUM") base += 10;
            if (f.severity === "LOW") base += 5;
        });
        return Math.min(base, 100);
    }

    private getColumnLetter(colIndex: number): string {
        let letter = "";
        while (colIndex > 0) {
            let temp = (colIndex - 1) % 26;
            letter = String.fromCharCode(65 + temp) + letter;
            colIndex = Math.floor((colIndex - temp) / 26);
        }
        return letter;
    }
}
