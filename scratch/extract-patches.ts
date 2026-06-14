import fs from "fs";

const transcriptPath = "C:/Users/olusegun/.gemini/antigravity-ide/brain/8c17ec30-8d99-4292-89c4-2f75ab7eb5b0/.system_generated/logs/transcript.jsonl";
const lines = fs.readFileSync(transcriptPath, "utf8").split("\n");

console.log("Found " + lines.length + " lines in transcript.");
for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const step = JSON.parse(line);
    if (step.tool_calls) {
      for (const call of step.tool_calls) {
        if (call.name === "replace_file_content" || call.name === "multi_replace_file_content" || call.name === "write_to_file") {
          if (call.args && call.args.TargetFile && call.args.TargetFile.includes("FightingGameArenaEmbed.tsx")) {
             console.log("PATCH in step " + step.step_index);
             console.log("INSTRUCTION: " + call.args.Instruction);
             console.log("TARGET: " + call.args.TargetContent);
             console.log("REPLACEMENT: " + call.args.ReplacementContent);
             console.log("----------------------");
          }
        }
      }
    }
  } catch(e) {}
}
