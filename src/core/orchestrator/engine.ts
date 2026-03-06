
import { SchemaExtractor } from "../schema/extractor";
import { IntentClassifier } from "../intent/classifier";
import { ASTValidator } from "../validator/ast";
import { SafeSheetOS } from "../templates/safe-api";
import { DryRunExecutor } from "../executor/dry-run";
import { TaskContext, ExecutionSnapshot, SheetSchema, UserIntent, ValidationSummary, DryRunResult } from "../types/sheetos";
import { callLLM } from "../../services/llm.service";

export interface OrchestratorEvents {
    onAnalyze?: (schema: SheetSchema) => void;
    onIntent?: (intent: UserIntent) => void;
    onPlan?: (code: string, validation: ValidationSummary) => void;
    onPreview?: (dryRun: DryRunResult) => void;
    onExecute?: (metrics: any) => void;
    onError?: (error: any) => void;
}

export class SheetOSOrchestrator {
    private extractor = new SchemaExtractor();
    private validator = new ASTValidator();

    private static readonly EXECUTION_TIMEOUT_MS = 30_000; // 30 seconds max

    async run(prompt: string, events?: OrchestratorEvents): Promise<any> {
        const action_id = `act_${Date.now()}`;

        try {
            return await Excel.run(async (context) => {
                // 1. Schema Extraction
                const schema = await this.extractor.extract(context);
                if (events?.onAnalyze) events.onAnalyze(schema);

                // 2. Intent Classification
                const intent = await IntentClassifier.classify(prompt, schema);
                if (events?.onIntent) events.onIntent(intent);

                const taskContext: TaskContext = { action_id, user_prompt: prompt, intent, schema_before: schema };

                // 3. Snapshot for Rollback
                const snapshot = await this.createSnapshot(context, schema);

                // 4. Code Generation
                const generatedCode = await this.generateCodeWithTemplate(taskContext);

                // 5. AST Validation
                const validation = this.validator.validate(generatedCode);
                if (events?.onPlan) events.onPlan(generatedCode, validation);

                if (!validation.isValid) {
                    throw new Error(`Security Violation: ${validation.errors.join(", ")}`);
                }

                // 6. Dry Run — actually simulate and collect changes
                const dryRunner = new DryRunExecutor(schema);
                const safeOS = new SafeSheetOS(context, schema, (change) => dryRunner.recordChange(change));

                // Generate preview from recorded changes
                const dryRunResult = await dryRunner.generatePreview();
                if (events?.onPreview) {
                    events.onPreview(dryRunResult);
                }

                // Bail if dry run found the operation unsafe
                if (!dryRunResult.isSafe && intent.isDestructive) {
                    throw new Error(`Dry run flagged unsafe operation: ${dryRunResult.warnings.join(", ")}`);
                }

                // 8. Execution with timeout
                const startTime = Date.now();
                try {
                    await Promise.race([
                        this.executeCode(generatedCode, safeOS),
                        new Promise<never>((_, reject) =>
                            setTimeout(() => reject(new Error("Execution timed out after 30 seconds")),
                            SheetOSOrchestrator.EXECUTION_TIMEOUT_MS)
                        )
                    ]);

                    // 9. Post-Execution Verification
                    const schemaAfter = await this.extractor.extract(context);
                    await this.verify(schema, schemaAfter, intent);

                    if (events?.onExecute) {
                        events.onExecute({
                            startTime,
                            durationMs: Date.now() - startTime,
                            syncCount: 0, // Would be tracked in SafeSheetOS
                            cellsProcessed: 0
                        });
                    }

                } catch (err) {
                    await this.rollback(context, snapshot);
                    throw err;
                }

                this.logAction(taskContext, generatedCode, validation);
                return { success: true, action_id };
            });
        } catch (error) {
            if (events?.onError) events.onError(error);
            throw error;
        }
    }

    private async createSnapshot(context: Excel.RequestContext, schema: SheetSchema): Promise<ExecutionSnapshot> {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const range = sheet.getUsedRangeOrNullObject();
        range.load("address,values,isNullObject");
        await context.sync();

        if (range.isNullObject) {
            return { timestamp: new Date().toISOString(), dataHash: "", schema, rangeSnapshots: {} };
        }

        return {
            timestamp: new Date().toISOString(),
            dataHash: "",
            schema,
            rangeSnapshots: { [range.address]: JSON.parse(JSON.stringify(range.values)) }
        };
    }

    private async generateCodeWithTemplate(ctx: TaskContext): Promise<string> {
        const systemPrompt = `You are an Excel automation expert. 
Generate a TypeScript function body that uses the 'sheetOS' object.
INTERFACE:
export interface ISafeSheetOS {
  readRange(address: string): Promise<any[][]>;
  readHeaders(): Promise<string[]>;
  updateValues(address: string, values: any[][]): Promise<void>;
  updateFormat(address: string, format: any): Promise<void>;
}

TASK: ${ctx.user_prompt}
CONTEXT: ${JSON.stringify(ctx.schema_before)}

RULES:
- ONLY output the function body content.
- Use 'await sheetOS...' for all operations.
- Do NOT use 'Excel' or 'context' directly.
- Ensure 2D arrays for values.
`;

        const messages = [
            { role: "system" as const, content: systemPrompt },
            { role: "user" as const, content: ctx.user_prompt }
        ];

        return await callLLM(messages);
    }

    private async executeCode(code: string, safeOS: SafeSheetOS) {
        const cleanCode = code.trim();
        const dynamicFunction = new Function("sheetOS", `return (async (sheetOS) => { ${cleanCode} })(sheetOS)`);
        await dynamicFunction(safeOS);
    }

    private async verify(before: SheetSchema, after: SheetSchema, intent: UserIntent) {
        if (intent.type === "READ_ONLY" && before.rowCount !== after.rowCount) {
            throw new Error("Integrity check failed: Read-only action modified cell count");
        }
    }

    private async rollback(context: Excel.RequestContext, snapshot: ExecutionSnapshot) {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        for (const [address, values] of Object.entries(snapshot.rangeSnapshots)) {
            sheet.getRange(address).values = values;
        }
        await context.sync();
    }

    private logAction(ctx: TaskContext, code: string, validation: any) {
        console.log(`[SheetOS Log] ${JSON.stringify({ ...ctx, code, validation })}`);
    }
}
