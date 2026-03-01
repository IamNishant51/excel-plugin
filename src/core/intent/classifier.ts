
import { UserIntent, SheetSchema } from "../types/sheetos";

export class IntentClassifier {
    static async classify(prompt: string, schema: SheetSchema): Promise<UserIntent> {
        // This would normally call an LLM (e.g. GPT-4o-mini)
        // For blueprint, we show the logic

        const lowerPrompt = prompt.toLowerCase();

        let type: any = "READ_ONLY";
        let isDestructive = false;

        if (lowerPrompt.includes("delete") || lowerPrompt.includes("remove") || lowerPrompt.includes("clear")) {
            type = "DESTRUCTIVE_ACTION";
            isDestructive = true;
        } else if (lowerPrompt.includes("add row") || lowerPrompt.includes("insert")) {
            type = "STRUCTURAL_CHANGE";
        } else if (lowerPrompt.includes("format") || lowerPrompt.includes("color")) {
            type = "FORMATTING_ONLY";
        } else if (lowerPrompt.includes("calculate") || lowerPrompt.includes("update") || lowerPrompt.includes("set")) {
            type = "DATA_TRANSFORM";
        }

        return {
            type,
            description: `User wants to perform ${type}`,
            isDestructive,
            requiresConfirmation: isDestructive || type === "STRUCTURAL_CHANGE",
            affectedAspects: isDestructive ? ["STRUCTURE", "VALUES"] : ["VALUES"]
        };
    }
}
