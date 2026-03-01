
import * as ts from "typescript";
import { ValidationSummary } from "../types/sheetos";

export class ASTValidator {
    private readonly BANNED_METHODS = [
        "delete", "clear", "clearFormats", "getRange", // getRange is banned in its raw form if we want to force DSL
        "SpreadsheetApp", "eval", "Function"
    ];

    validate(code: string): ValidationSummary {
        const sourceFile = ts.createSourceFile(
            "generated.ts",
            code,
            ts.ScriptTarget.Latest,
            true
        );

        const errors: string[] = [];
        const bannedCalls: string[] = [];

        const visitor = (node: ts.Node) => {
            // 1. Detect Direct Office.js usage (outside of DSL)
            if (ts.isPropertyAccessExpression(node)) {
                const methodName = node.name.text;
                if (this.BANNED_METHODS.includes(methodName)) {
                    // Check if it's called on 'sheet' or 'context' directly
                    bannedCalls.push(methodName);
                    errors.push(`Direct use of banned method '${methodName}' detected. Use the provided SheetOS abstraction instead.`);
                }
            }

            // 2. Detect A1 addressing (if policy is to force schema headers)
            if (ts.isStringLiteral(node)) {
                if (/^[A-Z]+\d+(:[A-Z]+\d+)?$/.test(node.text)) {
                    // Optional warning for hardcoded A1 addresses
                }
            }

            // 3. Detect infinite loops
            if (ts.isWhileStatement(node) || ts.isForStatement(node)) {
                // Simple heuristic: count iterations? 
                // Better: ensure loop body has progress
            }

            ts.forEachChild(node, visitor);
        };

        visitor(sourceFile);

        return {
            isValid: errors.length === 0,
            errors,
            warnings: [],
            bannedCalls
        };
    }
}
