
import { SheetSchema, UserIntent, DryRunResult } from "../../core/types/sheetos";

export type UIPhase = "ANALYZE" | "PLAN" | "PREVIEW" | "EXECUTE" | "HISTORY" | "SETTINGS";

export interface RiskReport {
    score: number; // 0-100
    level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    findings: string[];
}

export interface ActionNode {
    id: string;
    label: string;
    type: "READ" | "WRITE" | "FORMAT" | "STRUCTURAL";
    details: string;
    dependencies?: string[];
}

export interface ExecutionMetrics {
    startTime: number;
    endTime?: number;
    syncCount: number;
    cellsProcessed: number;
    durationMs?: number;
}

export interface HistoryEntry {
    actionId: string;
    timestamp: Date;
    prompt: string;
    intent: UserIntent;
    metrics: ExecutionMetrics;
    status: "SUCCESS" | "FAILED" | "ROLLBACK";
}

export interface TaskpaneState {
    phase: UIPhase;
    schema?: SheetSchema;
    intent?: UserIntent;
    riskReport?: RiskReport;
    dryRun?: DryRunResult;
    metrics?: ExecutionMetrics;
    history: HistoryEntry[];
    currentLog: string[];
    lastPrompt?: string;
    tempProvider?: "groq" | "local" | "gemini" | "openai";
}
