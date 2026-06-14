import fs from "fs";

const filePath = "client/src/components/bantahbro/FightingGameArenaEmbed.tsx";
let content = fs.readFileSync(filePath, "utf8");

// Add React hooks if missing
if (!content.includes("useState")) {
  content = content.replace("import React, { useEffect, useRef }", "import React, { useEffect, useRef, useState }");
}

// Add MOCK tools
const MOCK_TOOLS_CODE = `
import { Hammer, Shield, Zap, Flame, Droplet, Wind, Crosshair, Heart } from "lucide-react";

const MOCK_LEFT_TOOLS = [
  { id: '1', name: 'Plasma Cutter', icon: Zap, color: 'text-blue-400' },
  { id: '2', name: 'Energy Shield', icon: Shield, color: 'text-cyan-300' },
  { id: '3', name: 'Napalm Grenade', icon: Flame, color: 'text-orange-500' },
];

const MOCK_RIGHT_TOOLS = [
  { id: '4', name: 'Gravity Hammer', icon: Hammer, color: 'text-purple-500' },
  { id: '5', name: 'Acid Vial', icon: Droplet, color: 'text-green-500' },
  { id: '6', name: 'Sonic Pulse', icon: Wind, color: 'text-gray-300' },
];
`;

if (!content.includes("MOCK_LEFT_TOOLS")) {
  content = content.replace("export function FightingGameArenaEmbed(", MOCK_TOOLS_CODE + "\nexport function FightingGameArenaEmbed(");
}

// Add state
const STATE_CODE = `
  const [activatingTool, setActivatingTool] = useState<{ id: string, side: 'left' | 'right' } | null>(null);
  const [usedTools, setUsedTools] = useState<Set<string>>(new Set());
`;

if (!content.includes("activatingTool")) {
  content = content.replace("const arenaRootRef = useRef<HTMLDivElement | null>(null);", "const arenaRootRef = useRef<HTMLDivElement | null>(null);" + STATE_CODE);
}

// Add useEffect
const EFFECT_CODE = `
  useEffect(() => {
    if (!arenaState || !syncedBattle) return;
    
    // Simulate periodic tool activation
    const interval = setInterval(() => {
      const isLeft = Math.random() > 0.5;
      const leftActualTools = syncedBattle?.sides[0]?.loadoutTools;
      const rightActualTools = syncedBattle?.sides[1]?.loadoutTools;
      const tools = isLeft ? leftActualTools : !isLeft ? rightActualTools : [];
      if (tools && tools.length > 0) {
        const toolToUse = tools[Math.floor(Math.random() * tools.length)];
        setActivatingTool({ id: toolToUse.id, side: isLeft ? 'left' : 'right' });
        setTimeout(() => {
          setUsedTools(prev => new Set([...prev, toolToUse.id]));
          setActivatingTool(null);
        }, 1500);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [arenaState, syncedBattle]);
`;

if (!content.includes("Simulate periodic tool activation")) {
  content = content.replace("useEffect(() => {\n    if (!arenaState || !syncedBattle) return;", EFFECT_CODE + "\n  useEffect(() => {\n    if (!arenaState || !syncedBattle) return;");
}

// Add prediction overlay and toolboxes inside arenaRootRef
const OVERLAYS = `
          {syncedBattle?.winnerLogic ? (
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <div className="bg-gradient-to-r from-red-900/90 to-black border border-red-500/50 p-6 rounded-2xl text-center shadow-2xl animate-pulse transform scale-110">
                 <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-yellow-500 uppercase tracking-widest drop-shadow-md mb-2">CHALLENGE PREDICTION</h2>
                 <p className="text-red-200 text-lg">{syncedBattle.winnerLogic}</p>
                 <div className="mt-4 flex gap-4 justify-center">
                   <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg font-bold">YES: 65%</div>
                   <div className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg font-bold">NO: 35%</div>
                 </div>
              </div>
            </div>
          ) : null}

          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10 pointer-events-auto">
            {(() => {
              const actualTools = syncedBattle?.sides[0]?.loadoutTools;
              const toolsToRender = actualTools?.length ? actualTools : MOCK_LEFT_TOOLS.map(t => ({ id: t.id, name: t.name, imageUrl: '', type: 'mock', _icon: t.icon, _color: t.color }));
              
              return toolsToRender.map((tool: any) => {
                const isActivating = activatingTool?.id === tool.id && activatingTool?.side === 'left';
                const IconComp = tool._icon;
                
                return (
                  <div 
                    key={tool.id} 
                    className={\`relative w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] border border-[#1e293b] bg-gradient-to-b from-[#1e293b] to-[#0f172a] overflow-hidden flex items-center justify-center transition-all duration-300 \${isActivating ? 'animate-tool-pulse text-[#4ade80] ring-1 ring-[#4ade80]/60' : ''}\`}
                    title={tool.name}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="relative z-10 flex items-center justify-center w-full h-full">
                      {tool.imageUrl ? (
                        <img src={tool.imageUrl} alt={tool.name} className="w-4/5 h-4/5 object-contain drop-shadow-md" />
                      ) : IconComp ? (
                        <IconComp className={\`w-3/5 h-3/5 drop-shadow-lg \${tool._color}\`} />
                      ) : (
                        <div className="text-[10px] font-black uppercase text-center leading-tight p-1 break-words opacity-80 text-white">{tool.name}</div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10 pointer-events-auto">
            {(() => {
              const actualTools = syncedBattle?.sides[1]?.loadoutTools;
              const toolsToRender = actualTools?.length ? actualTools : MOCK_RIGHT_TOOLS.map(t => ({ id: t.id, name: t.name, imageUrl: '', type: 'mock', _icon: t.icon, _color: t.color }));
              
              return toolsToRender.map((tool: any) => {
                const isActivating = activatingTool?.id === tool.id && activatingTool?.side === 'right';
                const IconComp = tool._icon;

                return (
                  <div 
                    key={tool.id} 
                    className={\`relative w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] border border-[#1e293b] bg-gradient-to-b from-[#1e293b] to-[#0f172a] overflow-hidden flex items-center justify-center transition-all duration-300 \${isActivating ? 'animate-tool-pulse text-[#f87171] ring-1 ring-[#f87171]/60' : ''}\`}
                    title={tool.name}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="relative z-10 flex items-center justify-center w-full h-full">
                      {tool.imageUrl ? (
                        <img src={tool.imageUrl} alt={tool.name} className="w-4/5 h-4/5 object-contain drop-shadow-md" />
                      ) : IconComp ? (
                        <IconComp className={\`w-3/5 h-3/5 drop-shadow-lg \${tool._color}\`} />
                      ) : (
                        <div className="text-[10px] font-black uppercase text-center leading-tight p-1 break-words opacity-80 text-white">{tool.name}</div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
`;

if (!content.includes("absolute left-2")) {
  content = content.replace("<div className=\"top-indicator\">", OVERLAYS + "\n          <div className=\"top-indicator\">");
}

fs.writeFileSync(filePath, content, "utf8");
console.log("Restored successfully");
