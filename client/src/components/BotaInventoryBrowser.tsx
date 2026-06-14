import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface BotaTool {
  id: string;
  name: string;
  tier: string;
  role: string;
  powerRating: number;
  effectDesc: string;
  isEquipped: boolean;
}

export interface BotaInventoryBrowserProps {
  walletAddress: string;
  tools: BotaTool[];
  onEquip?: (toolId: string) => void;
  onUnequip?: (toolId: string) => void;
}

export function BotaInventoryBrowser({ tools, onEquip, onUnequip }: BotaInventoryBrowserProps) {
  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'epic': return 'border-purple-500 text-purple-400 bg-purple-500/10';
      case 'rare': return 'border-blue-500 text-blue-400 bg-blue-500/10';
      default: return 'border-gray-500 text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Tool Inventory</h2>
      
      {tools.length === 0 ? (
        <Card className="bg-black/40 border-primary/20 backdrop-blur-md">
          <CardContent className="py-8 text-center text-muted-foreground">
            No tools found in your inventory. Open packs to find tools!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(tool => (
            <Card key={tool.id} className={`bg-black/60 backdrop-blur-md border ${getTierColor(tool.tier).split(' ')[0]}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{tool.name}</span>
                  <span className={`text-xs uppercase px-2 py-0.5 rounded ${getTierColor(tool.tier)}`}>
                    {tool.tier}
                  </span>
                </CardTitle>
                <div className="text-xs text-muted-foreground uppercase">{tool.role} Slot</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <span className="font-semibold text-primary">Power Rating:</span> {tool.powerRating}
                </div>
                <div className="text-sm italic text-muted-foreground min-h-[40px]">
                  {tool.effectDesc}
                </div>
                <div className="flex justify-end pt-2">
                  {tool.isEquipped ? (
                    <Button 
                      variant="outline" 
                      className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
                      onClick={() => onUnequip?.(tool.id)}
                    >
                      Unequip
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => onEquip?.(tool.id)}
                    >
                      Equip
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
