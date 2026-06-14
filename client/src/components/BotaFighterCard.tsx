import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface BotaFighterCardProps {
  fighter: {
    id: string;
    name: string;
    teamLabel?: string;
    combatProfile?: {
      aggression: number;
      defense: number;
      intelligence: number;
      speed: number;
      luck: number;
      hp: number;
    };
    tools?: Array<{
      id: string;
      name: string;
      tier: string;
      role: string;
    }>;
  };
}

export function BotaFighterCard({ fighter }: BotaFighterCardProps) {
  const profile = fighter.combatProfile || {
    aggression: 50, defense: 50, intelligence: 50, speed: 50, luck: 50, hp: 100
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'epic': return 'text-purple-400 border-purple-500';
      case 'rare': return 'text-blue-400 border-blue-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-sm bg-black/40 border-primary/20 backdrop-blur-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>{fighter.name}</span>
          <span className="text-sm font-normal text-muted-foreground">{fighter.teamLabel}</span>
        </CardTitle>
        <div className="text-sm text-primary">HP: {profile.hp}</div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Traits */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Combat Traits</h4>
          
          <div className="grid gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span>Aggression</span>
                <span>{profile.aggression}</span>
              </div>
              <Progress value={profile.aggression} className="h-1.5" />
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span>Defense</span>
                <span>{profile.defense}</span>
              </div>
              <Progress value={profile.defense} className="h-1.5" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span>Intelligence</span>
                <span>{profile.intelligence}</span>
              </div>
              <Progress value={profile.intelligence} className="h-1.5" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span>Speed</span>
                <span>{profile.speed}</span>
              </div>
              <Progress value={profile.speed} className="h-1.5" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span>Luck</span>
                <span>{profile.luck}</span>
              </div>
              <Progress value={profile.luck} className="h-1.5" />
            </div>
          </div>
        </div>

        {/* Loadout */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Loadout</h4>
          {fighter.tools && fighter.tools.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {fighter.tools.map(tool => (
                <div key={tool.id} className={`text-xs px-2 py-1 rounded border ${getTierColor(tool.tier)}`}>
                  {tool.name} ({tool.role})
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground italic">No tools equipped</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
