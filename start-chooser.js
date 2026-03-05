#!/usr/bin/env node
/**
 * SheetOS AI — Start Chooser
 * Prompts user to select which Office host to debug (Excel or Word)
 * then launches the appropriate manifest with the correct --app flag.
 */

const { spawn } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("");
console.log("╔══════════════════════════════════════════════╗");
console.log("║          SheetOS AI — Launch Chooser         ║");
console.log("╠══════════════════════════════════════════════╣");
console.log("║                                              ║");
console.log("║   1)  📊  Excel  — SheetOS AI for Excel      ║");
console.log("║   2)  📝  Word   — SheetOS AI for Word       ║");
console.log("║                                              ║");
console.log("╚══════════════════════════════════════════════╝");
console.log("");

rl.question("Select host [1/2]: ", (answer) => {
    rl.close();

    const choice = answer.trim();

    let manifest, hostName, appFlag;

    if (choice === "2" || choice.toLowerCase() === "word" || choice.toLowerCase() === "w") {
        manifest = "manifest-word.xml";
        hostName = "Word";
        appFlag = "word";
    } else {
        manifest = "manifest.xml";
        hostName = "Excel";
        appFlag = "excel";
    }

    console.log("");
    console.log(`🚀 Launching SheetOS AI for ${hostName}...`);
    console.log(`   Manifest: ${manifest}`);
    console.log(`   App:      ${appFlag}`);
    console.log("");

    // Launch with explicit --app flag so office-addin-debugging opens the correct Office host
    const child = spawn(
        "npx",
        ["office-addin-debugging", "start", manifest, "--app", appFlag],
        {
            stdio: "inherit",
            shell: true,
            cwd: process.cwd(),
        }
    );

    child.on("error", (err) => {
        console.error("Failed to start:", err.message);
        process.exit(1);
    });

    child.on("exit", (code) => {
        process.exit(code || 0);
    });
});
