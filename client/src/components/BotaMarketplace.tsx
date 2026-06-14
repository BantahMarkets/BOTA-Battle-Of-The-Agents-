import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BotaFighterCard } from './BotaFighterCard';

export interface MarketplaceListing {
  id: string;
  sellerWallet: string;
  priceUsdt: number;
  fighter: any; // Using the shape expected by BotaFighterCard
}

export interface BotaMarketplaceProps {
  listings: MarketplaceListing[];
  currentWallet: string;
  onBuy?: (listingId: string) => void;
  onCancel?: (listingId: string) => void;
}

export function BotaMarketplace({ listings = [], currentWallet, onBuy, onCancel }: BotaMarketplaceProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Agent Marketplace</h2>
        <div className="text-sm text-muted-foreground bg-black/40 px-3 py-1 rounded-full border border-primary/20">
          5% Fee routes to BantCredit Pot
        </div>
      </div>

      {listings.length === 0 ? (
        <Card className="bg-black/40 border-primary/20 backdrop-blur-md">
          <CardContent className="py-12 text-center text-muted-foreground">
            No agents are currently listed on the marketplace.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {listings.map(listing => {
            const isOwner = listing.sellerWallet === currentWallet;
            
            return (
              <div key={listing.id} className="relative group">
                <BotaFighterCard fighter={listing.fighter} />
                
                {/* Marketplace Overlay/Controls */}
                <Card className="mt-2 bg-black/60 border-primary/50 backdrop-blur-md">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Price</span>
                      <span className="text-lg font-bold text-green-400">\${listing.priceUsdt}</span>
                    </div>
                    
                    {isOwner ? (
                      <Button 
                        variant="outline" 
                        className="border-red-500 text-red-500 hover:bg-red-500/10"
                        onClick={() => onCancel?.(listing.id)}
                      >
                        Cancel Listing
                      </Button>
                    ) : (
                      <Button 
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => onBuy?.(listing.id)}
                      >
                        Buy Agent
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
