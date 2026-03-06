
import { SheetSchema } from "../types/sheetos";

export class SchemaExtractor {
    async extract(context: Excel.RequestContext): Promise<SheetSchema> {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const usedRange = sheet.getUsedRangeOrNullObject();
        const frozenLocation = sheet.freezePanes.getLocationOrNullObject();

        sheet.load("name");
        usedRange.load("address,rowCount,columnCount,values,numberFormat,isNullObject");
        frozenLocation.load("rowCount,columnCount,isNullObject");

        // Load tables
        const tables = sheet.tables;
        tables.load("items/name");

        await context.sync();

        const frozenRows = frozenLocation.isNullObject ? 0 : frozenLocation.rowCount;
        const frozenCols = frozenLocation.isNullObject ? 0 : frozenLocation.columnCount;

        if (usedRange.isNullObject) {
            return {
                sheetName: sheet.name,
                usedRange: "A1",
                rowCount: 0,
                columnCount: 0,
                headers: [],
                columnTypes: {},
                mergedCells: [],
                hasFilters: false,
                frozenRows,
                frozenColumns: frozenCols,
                tables: tables.items.map(t => t.name)
            };
        }

        const values = usedRange.values;
        const headers = values.length > 0 ? values[0].map(h => String(h || "")) : [];

        const columnTypes: Record<string, any> = {};
        if (values.length > 1) {
            // Sample up to 5 data rows for more reliable type detection
            const sampleCount = Math.min(values.length - 1, 5);
            headers.forEach((h, i) => {
                const typeCounts: Record<string, number> = {};
                for (let row = 1; row <= sampleCount; row++) {
                    const t = this.detectType(values[row][i]);
                    typeCounts[t] = (typeCounts[t] || 0) + 1;
                }
                // Pick the most common non-empty type
                let bestType = "empty";
                let bestCount = 0;
                for (const [type, count] of Object.entries(typeCounts)) {
                    if (type !== "empty" && count > bestCount) {
                        bestType = type;
                        bestCount = count;
                    }
                }
                columnTypes[h] = bestType === "empty" ? (typeCounts["empty"] ? "empty" : "string") : bestType;
            });
        }

        return {
            sheetName: sheet.name,
            usedRange: usedRange.address,
            rowCount: usedRange.rowCount,
            columnCount: usedRange.columnCount,
            headers,
            columnTypes,
            mergedCells: [],
            hasFilters: false,
            frozenRows,
            frozenColumns: frozenCols,
            tables: tables.items.map(t => t.name)
        };
    }

    private detectType(value: any): "string" | "number" | "boolean" | "date" | "formula" | "empty" {
        if (value === null || value === undefined || value === "") return "empty";
        if (typeof value === "number") return "number";
        if (typeof value === "boolean") return "boolean";
        if (String(value).startsWith("=")) return "formula";
        return "string";
    }
}
