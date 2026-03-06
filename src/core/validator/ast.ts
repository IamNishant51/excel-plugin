
import * as ts from "typescript";
import { ValidationSummary } from "../types/sheetos";

/**
 * AST-based code validator for LLM-generated Excel automation code.
 *
 * Uses the TypeScript compiler to parse code and walk the AST,
 * detecting dangerous patterns that regex alone would miss
 * (e.g., aliased eval, computed property access, nested calls).
 *
 * Banned categories:
 *  1. Code execution primitives (eval, Function constructor)
 *  2. Platform contamination (Google Apps Script APIs)
 *  3. Network/IO escape (fetch, XMLHttpRequest, import())
 *  4. Dangerous globals (alert, confirm, prompt — blocked in add-ins)
 *  5. Non-existent Office.js methods (common LLM hallucinations)
 */

export class ASTValidator {
    /** Methods that are security-critical — never allowed regardless of receiver */
    private static readonly HARD_BANNED_IDENTIFIERS = new Set([
        "eval", "Function", "setTimeout", "setInterval",
        "SpreadsheetApp", "Logger",
        "importScripts", "require",
    ]);

    /** Call expressions banned on any object (common hallucinations) */
    private static readonly BANNED_METHOD_CALLS = new Set([
        "getRowCount", "getColumnCount", "getAddress", "getValues",
        "setValues", "setValue", "setFormula",
        "clearFormats", "clearFormat", "clearValues", "clearValue",
    ]);

    /** Property access on `window`/`globalThis`/`self` that indicates escape attempts */
    private static readonly BANNED_GLOBALS = new Set([
        "fetch", "XMLHttpRequest", "WebSocket",
        "localStorage", "sessionStorage", "indexedDB",
        "alert", "confirm", "prompt",
        "open", "close", "postMessage",
    ]);

    /** Maximum allowed AST depth to prevent stack overflow from deeply nested code */
    private static readonly MAX_AST_DEPTH = 40;

    validate(code: string): ValidationSummary {
        const errors: string[] = [];
        const warnings: string[] = [];
        const bannedCalls: string[] = [];

        // Parse code through TypeScript compiler
        let sourceFile: ts.SourceFile;
        try {
            sourceFile = ts.createSourceFile(
                "generated.ts",
                code,
                ts.ScriptTarget.Latest,
                true
            );
        } catch {
            errors.push("Failed to parse generated code — possible syntax error.");
            return { isValid: false, errors, warnings, bannedCalls };
        }

        const visitor = (node: ts.Node, depth: number) => {
            // Guard against degenerate AST depth
            if (depth > ASTValidator.MAX_AST_DEPTH) {
                errors.push("Code exceeds maximum nesting depth — potential infinite recursion or obfuscation.");
                return;
            }

            // 1. Detect dangerous identifiers used as call targets
            if (ts.isCallExpression(node)) {
                const callee = node.expression;

                // Direct identifier call: eval(...), Function(...)
                if (ts.isIdentifier(callee)) {
                    const name = callee.text;
                    if (ASTValidator.HARD_BANNED_IDENTIFIERS.has(name)) {
                        bannedCalls.push(name);
                        errors.push(`Banned call '${name}()' detected — security violation.`);
                    }
                }

                // Method call: obj.method(...)
                if (ts.isPropertyAccessExpression(callee)) {
                    const methodName = callee.name.text;

                    // Check hallucinated Office.js methods
                    if (ASTValidator.BANNED_METHOD_CALLS.has(methodName)) {
                        bannedCalls.push(methodName);
                        errors.push(`'${methodName}()' does not exist in the Excel JS API. Use the property-based equivalent.`);
                    }
                }
            }

            // 2. Detect `new Function(...)` constructor
            if (ts.isNewExpression(node) && ts.isIdentifier(node.expression)) {
                if (node.expression.text === "Function") {
                    bannedCalls.push("new Function");
                    errors.push("'new Function()' is banned — dynamic code execution not allowed.");
                }
            }

            // 3. Detect global escape: direct reference to window/globalThis APIs
            if (ts.isPropertyAccessExpression(node)) {
                const obj = node.expression;
                const prop = node.name.text;

                if (
                    ts.isIdentifier(obj) &&
                    (obj.text === "window" || obj.text === "globalThis" || obj.text === "self")
                ) {
                    if (ASTValidator.BANNED_GLOBALS.has(prop)) {
                        bannedCalls.push(`${obj.text}.${prop}`);
                        errors.push(`Access to '${obj.text}.${prop}' is not allowed in generated code.`);
                    }
                }

                // Also catch bare global calls (fetch, XMLHttpRequest without window.)
                if (ts.isIdentifier(obj) && ASTValidator.BANNED_GLOBALS.has(obj.text)) {
                    // Only flag if it's the root object being accessed
                    warnings.push(`Suspicious use of global '${obj.text}' — network/IO not allowed.`);
                }
            }

            // 4. Detect bare global identifiers used as call expressions (e.g. `fetch(...)`)
            if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
                const name = node.expression.text;
                if (ASTValidator.BANNED_GLOBALS.has(name)) {
                    bannedCalls.push(name);
                    errors.push(`Direct call to '${name}()' is not allowed — no network or UI calls permitted.`);
                }
            }

            // 5. Detect dynamic import(): import("...")
            if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
                bannedCalls.push("import()");
                errors.push("Dynamic import() is not allowed in generated code.");
            }

            // 6. Detect while(true) / for(;;) — infinite loop heuristic
            if (ts.isWhileStatement(node)) {
                if (node.expression.kind === ts.SyntaxKind.TrueKeyword) {
                    // while(true) without break is suspect — only warn
                    const bodyText = node.statement.getText(sourceFile);
                    if (!bodyText.includes("break") && !bodyText.includes("return")) {
                        warnings.push("Potential infinite loop detected: while(true) without break/return.");
                    }
                }
            }
            if (ts.isForStatement(node) && !node.condition) {
                const bodyText = node.statement.getText(sourceFile);
                if (!bodyText.includes("break") && !bodyText.includes("return")) {
                    warnings.push("Potential infinite loop detected: for(;;) without break/return.");
                }
            }

            // 7. Detect A1 hardcoded addresses — warning only
            if (ts.isStringLiteral(node)) {
                if (/^[A-Z]+\d+(:[A-Z]+\d+)?$/.test(node.text)) {
                    warnings.push(`Hardcoded cell address '${node.text}' — consider using dynamic ranges.`);
                }
            }

            ts.forEachChild(node, (child) => visitor(child, depth + 1));
        };

        visitor(sourceFile, 0);

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            bannedCalls
        };
    }
}
