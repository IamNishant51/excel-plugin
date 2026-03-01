
import { DryRunResult, DryRunChange, SheetSchema } from "../types/sheetos";

export class DryRunExecutor {
    private changes: DryRunChange[] = [];

    constructor(private schema: SheetSchema) { }

    recordChange(change: DryRunChange) {
        this.changes.push(change);
    }

    async generatePreview(): Promise<DryRunResult> {
        const warnings: string[] = [];

        // Check for large impacts
        if (this.changes.length > 50) {
            warnings.push(`Affecting ${this.changes.length} ranges. Potential performance impact.`);
        }

        // Check for structural changes
        const hasStructural = this.changes.some(c => c.type === "DELETE" || c.type === "INSERT");
        if (hasStructural) {
            warnings.push("Structural changes detected. Headers might be affected.");
        }

        return {
            isSafe: warnings.length === 0,
            changes: this.changes,
            warnings,
            estimatedImpact: this.changes.length > 20 ? "HIGH" : "LOW"
        };
    }
}
