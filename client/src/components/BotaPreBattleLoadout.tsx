import React, { useState } from 'react';
import { useBotaInventory } from '@/hooks/useBotaInventory';
import { BotaInventoryBrowser } from './BotaInventoryBrowser';
import { Button } from '@/components/ui/button';
import { Swords, ArrowRight } from 'lucide-react';

interface BotaPreBattleLoadoutProps {
  viewerWallet: string | null;
  challengerAgentId: string;
  opponentAgentName: string;
  opponentAvatarUrl: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BotaPreBattleLoadout({ 
  viewerWallet, 
  challengerAgentId, 
  opponentAgentName, 
  opponentAvatarUrl, 
  onConfirm, 
  onCancel 
}: BotaPreBattleLoadoutProps) {
  const { tools: inventoryTools, equipTool, unequipTool } = useBotaInventory(viewerWallet);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    onConfirm();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-card border-b border-border p-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-black text-foreground">Pre-Battle Loadout</h2>
          <p className="text-xs text-muted-foreground">Strategize your tools against {opponentAgentName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isConfirming}>Back</Button>
          <Button onClick={handleConfirm} disabled={isConfirming} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black">
            {isConfirming ? 'Initiating...' : 'Confirm Challenge'} <Swords className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-y-auto flex-1">
        <div className="md:col-span-1 rounded-xl border border-border bg-card p-4 flex flex-col items-center">
            <h3 className="text-xs font-black uppercase text-muted-foreground mb-4">Opponent</h3>
            <img src={opponentAvatarUrl} alt={opponentAgentName} className="w-24 h-24 rounded-lg object-cover mb-2" />
            <span className="font-black text-lg text-center">{opponentAgentName}</span>
            <span className="text-xs text-muted-foreground text-center mt-1">Their Combat Traits are hidden until the match starts. Equip versatile tools!</span>
        </div>
        
        <div className="md:col-span-2">
          <BotaInventoryBrowser
            walletAddress={viewerWallet || ''}
            tools={inventoryTools}
            onEquip={(inventoryId) => equipTool({ inventoryId, fighterId: challengerAgentId, slot: 'primary' })}
            onUnequip={() => unequipTool({ fighterId: challengerAgentId, slot: 'primary' })}
          />
        </div>
      </div>
    </div>
  );
}
