import React, { useState } from 'react';
import { useOpenGen1Pack } from '@/hooks/useGen1Packs';
import { Button } from '@/components/ui/button';
import { Loader2, PackageOpen, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BotaPackOpenerProps {
  packInstanceId: string;
  onClose: () => void;
  onRevealComplete?: (tools: any[]) => void;
}

export function BotaPackOpener({ packInstanceId, onClose, onRevealComplete }: BotaPackOpenerProps) {
  const { toast } = useToast();
  const openPackMutation = useOpenGen1Pack();
  
  const [step, setStep] = useState<'idle' | 'opening' | 'revealed'>('idle');
  const [revealedTools, setRevealedTools] = useState<any[]>([]);

  const handleOpenPack = () => {
    setStep('opening');
    openPackMutation.mutate(
      { packInstanceId, mode: 'manual' },
      {
        onSuccess: (data: any) => {
          // Assuming the backend returns an array of dropped tools in `data.result.drops`
          const drops = data?.result?.drops || [];
          setRevealedTools(drops);
          setTimeout(() => setStep('revealed'), 1500); // Artificial delay for animation
          
          if (onRevealComplete) {
            onRevealComplete(drops);
          }
        },
        onError: (err: any) => {
          toast({ title: 'Error opening pack', description: err.message, variant: 'destructive' });
          setStep('idle');
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {step === 'idle' && (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <PackageOpen size={80} className="text-primary mb-6 animate-pulse" />
          <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Tactical Supply Drop</h2>
          <p className="text-muted-foreground text-sm mb-8 text-center max-w-sm">
            Open this pack to reveal BOTA V2 Combat Tools. These tools can be equipped to your agents to enhance their capabilities in the Arena.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={onClose} className="px-8 font-black uppercase">Cancel</Button>
            <Button variant="default" onClick={handleOpenPack} className="px-8 font-black uppercase bg-primary hover:bg-primary/80 text-black">
              Reveal Content
            </Button>
          </div>
        </div>
      )}

      {step === 'opening' && (
        <div className="flex flex-col items-center">
          <Loader2 size={64} className="text-primary animate-spin mb-4" />
          <p className="text-white font-black uppercase tracking-widest animate-pulse">Decrypting Pack...</p>
        </div>
      )}

      {step === 'revealed' && (
        <div className="flex flex-col items-center w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="text-amber-400" size={24} />
            <h2 className="text-3xl font-black text-white uppercase tracking-widest">Supply Drop Revealed</h2>
            <Sparkles className="text-amber-400" size={24} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {revealedTools.length === 0 ? (
              <div className="col-span-3 text-center text-muted-foreground">Pack was empty or already opened.</div>
            ) : (
              revealedTools.map((tool, idx) => (
                <div 
                  key={idx} 
                  className={`relative flex flex-col rounded-xl border-2 p-6 bg-card overflow-hidden transition-all hover:scale-105 duration-300 ${
                    tool.tier === 'epic' ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 
                    tool.tier === 'rare' ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
                    'border-gray-500'
                  }`}
                >
                  <div className="absolute top-0 right-0 px-3 py-1 bg-black/60 rounded-bl-lg">
                    <span className={`text-xs font-black uppercase tracking-wider ${
                      tool.tier === 'epic' ? 'text-purple-400' : 
                      tool.tier === 'rare' ? 'text-blue-400' : 
                      'text-gray-400'
                    }`}>
                      {tool.tier || 'Common'}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white mt-2 mb-1">{tool.name || 'Unknown Tool'}</h3>
                  <div className="text-xs font-bold uppercase tracking-widest text-primary mb-4">{tool.role || 'Unknown'} Role</div>
                  
                  <div className="mt-auto space-y-2">
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-1">
                      <span className="text-muted-foreground uppercase text-[10px] font-bold">Power</span>
                      <span className="font-black text-white">{tool.powerRating || '-'}</span>
                    </div>
                    {tool.compatibleTrait && (
                      <div className="flex justify-between items-center text-sm border-b border-white/10 pb-1">
                        <span className="text-muted-foreground uppercase text-[10px] font-bold">Boosts</span>
                        <span className="font-black text-amber-400 capitalize">{tool.compatibleTrait}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <Button 
            variant="default" 
            onClick={onClose} 
            className="mt-12 px-12 py-6 text-lg font-black uppercase tracking-widest bg-white text-black hover:bg-slate-200"
          >
            Claim & Return
          </Button>
        </div>
      )}
    </div>
  );
}
