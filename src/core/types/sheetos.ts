
export type IntentType =
    | "READ_ONLY"
    | "DATA_TRANSFORM"
    | "STRUCTURAL_CHANGE"
    | "FORMATTING_ONLY"
    | "DESTRUCTIVE_ACTION";

export interface UserIntent {
    type: IntentType;
    description: string;
    isDestructive: boolean;
    requiresConfirmation: boolean;
    affectedAspects: ("VALUES" | "FORMULAS" | "STRUCTURE" | "FORMATTING")[];
}

export interface SheetSchema {
    sheetName: string;
    usedRange: string;
    rowCount: number;
    columnCount: number;
    headers: string[];
    columnTypes: Record<string, "string" | "number" | "boolean" | "date" | "formula" | "empty">;
    mergedCells: string[];
    hasFilters: boolean;
    frozenRows: number;
    frozenColumns: number;
    tables: string[];
}

export interface TaskContext {
    action_id: string;
    user_prompt: string;
    intent: UserIntent;
    schema_before: SheetSchema;
    schema_after?: SheetSchema;
}

export interface DryRunChange {
    range: string;
    type: "UPDATE" | "DELETE" | "INSERT" | "FORMAT";
    oldValue?: any;
    newValue?: any;
    reason: string;
}

export interface DryRunResult {
    isSafe: boolean;
    changes: DryRunChange[];
    warnings: string[];
    estimatedImpact: "LOW" | "MEDIUM" | "HIGH";
}

export interface ValidationSummary {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    bannedCalls: string[];
}

export interface ExecutionSnapshot {
    timestamp: string;
    dataHash: string;
    schema: SheetSchema;
    rangeSnapshots: Record<string, any[][]>;
}
