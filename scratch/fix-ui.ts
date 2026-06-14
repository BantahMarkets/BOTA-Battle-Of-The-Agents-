import fs from "fs";

const file = "client/src/components/bantahbro/FightingGameArenaEmbed.tsx";
let content = fs.readFileSync(file, "utf8");

content = content.replace(/<div className="absolute left-2 top-1\/2 -translate-y-1\/2 flex flex-col gap-3 z-10">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\);\s*}\);\s*}\)\(\)}\s*<\/div>\s*<div className="absolute right-2 top-1\/2 -translate-y-1\/2 flex flex-col gap-3 z-10">[\s\S]*?<\/div>/m, 
`<div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
            {(() => {
              const actualTools = syncedBattle?.sides[0]?.loadoutTools;
              const toolsToRender = actualTools?.length ? actualTools : MOCK_LEFT_TOOLS.map(t => ({ id: t.id, name: t.name, imageUrl: '', type: 'mock', _icon: t.icon, _color: t.color }));
              
              return toolsToRender.map((tool) => {
                const isActivating = activatingTool?.id === tool.id && activatingTool?.side === 'left';
                const IconComp = (tool as any)._icon;
                
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
                        <IconComp className={\`w-3/5 h-3/5 drop-shadow-lg \${(tool as any)._color}\`} />
                      ) : (
                        <div className="text-[10px] font-black uppercase text-center leading-tight p-1 break-words opacity-80 text-white">{tool.name}</div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
            {(() => {
              const actualTools = syncedBattle?.sides[1]?.loadoutTools;
              const toolsToRender = actualTools?.length ? actualTools : MOCK_RIGHT_TOOLS.map(t => ({ id: t.id, name: t.name, imageUrl: '', type: 'mock', _icon: t.icon, _color: t.color }));
              
              return toolsToRender.map((tool) => {
                const isActivating = activatingTool?.id === tool.id && activatingTool?.side === 'right';
                const IconComp = (tool as any)._icon;

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
                        <IconComp className={\`w-3/5 h-3/5 drop-shadow-lg \${(tool as any)._color}\`} />
                      ) : (
                        <div className="text-[10px] font-black uppercase text-center leading-tight p-1 break-words opacity-80 text-white">{tool.name}</div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>`);

fs.writeFileSync(file, content, "utf8");
console.log("Replaced UI block.");
