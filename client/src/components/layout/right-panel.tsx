'use client';

import AgentBattle from '@/components/sections/agent-battle';
import { ArrowUpRight, Megaphone } from 'lucide-react';
import type { AppSection } from '@/app/page';
import { useQuery } from '@tanstack/react-query';
import type { AgentBattleFeed } from '@/types/agentBattle';
import { getBattleTimeRemainingSeconds } from '@/lib/bantahbro/battleTiming';

interface RightPanelProps {
  selectedToken: string;
  defaultTab?: string;
  activeSection?: AppSection;
  onNavigate?: (section: AppSection) => void;
  onOpenBattle?: (battleId: string) => void;
}

function currentLiveBattle(feed: AgentBattleFeed | undefined) {
  return (feed?.battles || []).find(
    (entry) => getBattleTimeRemainingSeconds(entry.endsAt, entry.timeRemainingSeconds) > 0,
  );
}

function ChallengePredictionCard({ winnerLogic }: { winnerLogic?: string }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-border bg-background px-3 py-2 flex items-center justify-between shrink-0">
        <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-yellow-500 uppercase tracking-widest drop-shadow-sm">PREDICTION</span>
        <span className="rounded bg-red-500/20 border border-red-500/30 px-1.5 py-0.5 text-[10px] font-black text-red-400 animate-pulse">LIVE</span>
      </div>
      <div className="flex-1 p-3 flex flex-col justify-center bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.15),transparent_60%),linear-gradient(135deg,rgba(9,9,9,0.98),rgba(18,18,18,0.95))]">
        <div className="text-xs font-black text-white/80 mb-3 text-center leading-relaxed">
          {winnerLogic || "BOTA Arena Engine: agent profile rank, reputation, battle record, watch activity, and deterministic round RNG decide the live simulation."}
        </div>
        <div className="flex gap-2 justify-center">
          <div className="flex-1 bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-2 rounded font-black text-center text-sm shadow-[0_0_15px_rgba(34,197,94,0.1)]">YES 65%</div>
          <div className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-2 rounded font-black text-center text-sm shadow-[0_0_15px_rgba(239,68,68,0.1)]">NO 35%</div>
        </div>
      </div>
    </div>
  );
}

function AdsPlacementCard({ onNavigate }: { onNavigate?: (section: AppSection) => void }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-border bg-background px-3 py-2 flex items-center justify-between shrink-0">
        <span className="text-xs font-bold text-muted-foreground tracking-wider">ADS PLACEMENT</span>
        <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-black text-primary">SPONSOR</span>
      </div>

      <button
        type="button"
        onClick={() => onNavigate?.('ads')}
        className="group flex-1 p-3 text-left"
      >
        <div className="relative h-full min-h-[10.5rem] overflow-hidden rounded border border-primary/25 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.28),transparent_42%),linear-gradient(135deg,rgba(9,9,9,0.98),rgba(18,18,18,0.92))] p-3 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex size-9 items-center justify-center rounded bg-primary/20 text-primary">
              <Megaphone size={18} />
            </div>
            <span className="rounded-full border border-primary/35 bg-primary/15 px-2 py-0.5 text-[10px] font-black text-primary">
              SPONSORED
            </span>
          </div>

          <div className="mt-3 max-w-[12.5rem]">
            <div className="text-lg font-black leading-tight text-white">Promote your coin</div>
            <div className="mt-1 text-xs leading-snug text-white/65">
              Sidebar ads, feed boosts, and sponsored battle hosting.
            </div>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
            <div className="min-w-0 flex-1 rounded border border-white/10 bg-white/10 px-2 py-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wide text-white/50">Battle hosting</div>
              <div className="truncate text-xs font-black text-white">Sponsored host slots</div>
            </div>
            <div className="flex size-9 items-center justify-center rounded bg-primary text-primary-foreground transition group-hover:opacity-90">
              <ArrowUpRight size={15} />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default function RightPanel({ activeSection, onNavigate, onOpenBattle }: RightPanelProps) {
  const { data } = useQuery<AgentBattleFeed>({
    queryKey: ['/api/bantahbro/agent-battles/live', { limit: '3' }],
  });
  const liveBattle = currentLiveBattle(data);
  const isChallenge = liveBattle?.isChallenge;

  return (
    <div className="w-full lg:w-72 flex flex-col gap-0.5 overflow-hidden shrink-0">
      {activeSection === 'battles' && isChallenge ? (
        <div className="h-auto lg:flex-[3] bg-card border border-border rounded overflow-hidden flex flex-col min-h-0">
          <ChallengePredictionCard winnerLogic={liveBattle.winnerLogic} />
        </div>
      ) : activeSection !== 'marketplace' ? (
        <div className="h-auto lg:flex-[5] bg-card border border-border rounded overflow-hidden flex flex-col min-h-0">
          <AdsPlacementCard onNavigate={onNavigate} />
        </div>
      ) : null}

      {/* AGENT BATTLE - compact */}
      {activeSection === 'battles' && (
        <div className="h-auto lg:flex-[4] bg-card border border-border rounded overflow-hidden flex flex-col min-h-0">
          <AgentBattle onViewBattle={(battleId) => onOpenBattle?.(battleId) ?? onNavigate?.('battles')} />
        </div>
      )}

    </div>
  );
}
