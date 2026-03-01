export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RiskReport {
  score: number; // 0-100
  level: RiskLevel;
  findings: string[];
}

export interface ActionGraphNode {
  id: string;
  label: string;
  type: "READ" | "WRITE" | "FORMAT" | "STRUCTURAL";
  children?: ActionGraphNode[];
  details?: string;
}

export interface ExecutionSummary {
  cellsAffected: number;
  percentAffected: number;
  dryRunSafe: boolean;
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  durationMs?: number;
}

export interface EngineState {
  provider: string;
  stage: "ANALYZE" | "PLAN" | "PREVIEW" | "EXECUTE" | "HISTORY";
  status: "READY" | "ANALYZING" | "RISK" | "EXECUTING";
  sheetName?: string;
  rowCount?: number;
  columnCount?: number;
  tables?: string[];
  hiddenRows?: number;
  filtersDetected?: boolean;
  risk?: RiskReport;
  schemaSnapshot?: any;
  actionGraph?: ActionGraphNode[];
  execution?: ExecutionSummary;
}

export interface UIEvents {
  onRunPrompt?: (prompt: string) => void;
  onConfirmExecute?: () => void;
  onRefresh?: () => void;
  onToggleConsole?: () => void;
}
