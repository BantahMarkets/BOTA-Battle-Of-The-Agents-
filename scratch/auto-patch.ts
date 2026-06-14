import fs from "fs";

const transcriptPath = "C:/Users/olusegun/.gemini/antigravity-ide/brain/8c17ec30-8d99-4292-89c4-2f75ab7eb5b0/.system_generated/logs/transcript.jsonl";
const filePath = "client/src/components/bantahbro/FightingGameArenaEmbed.tsx";

const lines = fs.readFileSync(transcriptPath, "utf8").split("\n");
let content = fs.readFileSync(filePath, "utf8");

let count = 0;
for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const step = JSON.parse(line);
    if (step.tool_calls) {
      for (const call of step.tool_calls) {
        if (call.name === "replace_file_content") {
          if (call.args && call.args.TargetFile && call.args.TargetFile.includes("FightingGameArenaEmbed.tsx")) {
             const target = call.args.TargetContent;
             const replacement = call.args.ReplacementContent;
             
             if (content.includes(target)) {
               content = content.replace(target, replacement);
               count++;
               console.log("Applied patch from step " + step.step_index);
             } else {
               // fuzzy match or skip
               console.log("Failed to apply patch from step " + step.step_index + " (Target not found)");
             }
          }
        }
      }
    }
  } catch(e) {}
}

fs.writeFileSync(filePath, content, "utf8");
console.log("Applied " + count + " patches successfully.");
