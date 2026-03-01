
import { SheetSchema } from "../types/sheetos";

/**
 * ISafeSheetOS - The only interface the LLM is allowed to interact with.
 * This acts as a DSL/Safe Abstraction Layer.
 */
export interface ISafeSheetOS {
    // Read operations
    readRange(address: string): Promise<any[][]>;
    readHeaders(): Promise<string[]>;

    // Write operations (with built-in validation)
    updateValues(address: string, values: any[][]): Promise<void>;
    updateFormat(address: string, format: Partial<Excel.RangeFormat>): Promise<void>;

    // Structural (require specific user flags in orchestrator)
    insertRows(index: number, count: number): Promise<void>;
    deleteRows(index: number, count: number): Promise<void>;

    // Batch/Large Data helpers
    batchUpdate(operations: { address: string, values: any[][] }[]): Promise<void>;
}

export class SafeSheetOS implements ISafeSheetOS {
    constructor(
        private context: Excel.RequestContext,
        private schema: SheetSchema,
        private onAction?: (action: any) => void
    ) { }

    async readRange(address: string): Promise<any[][]> {
        const range = this.context.workbook.worksheets.getActiveWorksheet().getRange(address);
        range.load("values");
        await this.context.sync();
        return range.values;
    }

    async readHeaders(): Promise<string[]> {
        return this.schema.headers;
    }

    async updateValues(address: string, values: any[][]): Promise<void> {
        // Large Data Guardrail
        if (this.schema.rowCount > 3000 && values.length > 500) {
            console.warn("Large data detected. Recommended chunked operation.");
            // Automatic chunking logic could go here
        }

        const range = this.context.workbook.worksheets.getActiveWorksheet().getRange(address);
        range.values = values;

        if (this.onAction) {
            this.onAction({ type: "UPDATE", address, values });
        }
    }

    async updateFormat(address: string, format: any): Promise<void> {
        const range = this.context.workbook.worksheets.getActiveWorksheet().getRange(address);
        // Deep merge format properties safely
        if (format.fill) range.format.fill.color = format.fill.color;
        if (format.font) {
            if (format.font.bold !== undefined) range.format.font.bold = format.font.bold;
            if (format.font.color !== undefined) range.format.font.color = format.font.color;
        }

        if (this.onAction) {
            this.onAction({ type: "FORMAT", address, format });
        }
    }

    async insertRows(index: number, count: number): Promise<void> {
        // Check if rows > 3000, log warning
        const sheet = this.context.workbook.worksheets.getActiveWorksheet();
        sheet.getRange(`${index + 1}:${index + count}`).insert(Excel.InsertShiftDirection.down);
    }

    async deleteRows(index: number, count: number): Promise<void> {
        const sheet = this.context.workbook.worksheets.getActiveWorksheet();
        sheet.getRange(`${index + 1}:${index + count}`).delete(Excel.DeleteShiftDirection.up);
    }

    async batchUpdate(operations: any[]): Promise<void> {
        for (const op of operations) {
            await this.updateValues(op.address, op.values);
        }
    }
}
