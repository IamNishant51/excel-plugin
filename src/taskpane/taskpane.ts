/* global console, document, Excel, Office */

// Store the API key securely (in a real app, use a backend proxy)
const GROQ_API_KEY = "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";

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("app-body").style.flexDirection = "column";
    
    document.getElementById("run").onclick = runAICommand;
  }
});

export async function runAICommand() {
  const statusElement = document.getElementById("status-message");
  const debugElement = document.getElementById("debug-code");
  const promptInput = document.getElementById("prompt-input") as HTMLTextAreaElement;
  
  if (!promptInput.value.trim()) {
    statusElement.innerText = "Please enter a command.";
    return;
  }

  statusElement.innerText = "Thinking...";
  statusElement.style.color = "#0078d4"; // Office Blue
  debugElement.innerText = "";

  try {
    // 1. Get the code from Groq User
    const generatedCode = await generateExcelCode(promptInput.value);
    
    // Display generated code for debugging/transparency
    debugElement.innerText = generatedCode;

    // 2. Execute the code against Excel
    statusElement.innerText = "Executing...";
    await executeExcelCode(generatedCode);

    statusElement.innerText = "Done! ✅";
    statusElement.style.color = "green";
  } catch (error) {
    console.error(error);
    statusElement.innerText = `Error: ${error.message}`;
    statusElement.style.color = "red";
  }
}

async function generateExcelCode(userPrompt: string): Promise<string> {
  const systemPrompt = `
You are an expert Office JS (Excel Javascript API) developer.
Your task is to generate VALID JavaScript code that runs inside an \`Excel.run(async (context) => { ... })\` block.
The context has already been created.
A variable \`const sheet = context.workbook.worksheets.getActiveWorksheet();\` is ALREADY available via argument.
Do NOT redeclare \`sheet\`. use it directly.
Do NOT wrap the code in \`Excel.run\`.
Do NOT output markdown.
Output ONLY the executable lines of code.

Key Behaviors:
1. **Selection**: ALWAYS end your script by selecting the modified range: \`range.select();\`. This is CRITICAL so the user sees the change.
2. **Formatting**: If writing headers or important data, bold them or autofit columns.
3. **Formulas**: Usage \`range.formulas = [["=SUM(...)"]]\`.

Examples:
User: "Write Hello in A1"
Code: 
const range = sheet.getRange("A1");
range.values = [["Hello"]];
range.format.font.bold = true;
range.format.autofitColumns();
range.select();

User: "Sum A1:A10 into B1"
Code:
const range = sheet.getRange("B1");
range.formulas = [["=SUM(A1:A10)"]];
range.format.fill.color = "yellow"; // Highlight result
range.select();

User: "Create a chart for data in A1:B10"
Code:
const range = sheet.getRange("A1:B10");
const chart = sheet.charts.add(Excel.ChartType.columnClustered, range, Excel.ChartSeriesBy.auto);
chart.title.text = "Data Chart";
range.select();
`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Groq API Error:", response.status, errorText);
    throw new Error(`AI API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  let content = data.choices[0].message.content.trim();
  
  // Clean up markdown
  content = content.replace(/^```(javascript|js)?/i, "").replace(/```$/, "").trim();
  
  // Remove accidental sheet redeclarations to prevent errors
  content = content.replace(/const\s+sheet\s*=\s*.*?;/g, "// sheet redeclaration removed by system");
  
  return content;
}

async function executeExcelCode(code: string) {
  await Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    
    // Create a function from the string code and execute it with the context and sheet
    // We pass 'context' and 'sheet' as arguments to the dynamic function
    // const dynamicFunction = new Function("context", "sheet", "Excel", `return (async () => { ${code} })();`);
    // await dynamicFunction(context, sheet, Excel);
    
    // Safer alternative using simple eval in local scope or similar, but Function constructor is standard for this dynamic execution
    // To allow 'await', we wrap it in an async IIFE
    
    try {
        await new Function('context', 'sheet', 'Excel', `return (async () => { 
            ${code} 
            await context.sync(); 
        })()`)(context, sheet, Excel);
    } catch (e) {
        console.error("Execution Error", e);
        throw e;
    }
    
    await context.sync();
  });
}