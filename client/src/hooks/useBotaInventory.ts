import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { BotaTool } from '@/components/BotaInventoryBrowser';

export function useBotaInventory(walletAddress: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const inventoryQuery = useQuery({
    queryKey: ['/api/bantahbro/inventory', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return { tools: [] };
      return apiRequest('GET', `/api/bantahbro/inventory/${walletAddress}`);
    },
    enabled: !!walletAddress,
  });

  const equipMutation = useMutation({
    mutationFn: async ({ inventoryId, fighterId, slot }: { inventoryId: string, fighterId: string, slot: string }) => {
      return apiRequest('POST', '/api/bantahbro/inventory/equip', {
        walletAddress,
        inventoryId,
        fighterId,
        slot,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bantahbro/inventory', walletAddress] });
      toast({ title: 'Tool Equipped', description: 'Your tool has been added to the fighter loadout.' });
    },
    onError: (error: any) => {
      toast({ title: 'Equip Failed', description: error.message, variant: 'destructive' });
    }
  });

  const unequipMutation = useMutation({
    mutationFn: async ({ fighterId, slot }: { fighterId: string, slot: string }) => {
      return apiRequest('POST', '/api/bantahbro/inventory/unequip', {
        walletAddress,
        fighterId,
        slot,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bantahbro/inventory', walletAddress] });
      toast({ title: 'Tool Unequipped', description: 'Your tool has been removed from the fighter loadout.' });
    },
    onError: (error: any) => {
      toast({ title: 'Unequip Failed', description: error.message, variant: 'destructive' });
    }
  });

  return {
    tools: (inventoryQuery.data as any)?.tools || [] as BotaTool[],
    isLoading: inventoryQuery.isLoading,
    equipTool: equipMutation.mutate,
    unequipTool: unequipMutation.mutate,
    isEquipping: equipMutation.isPending,
    isUnequipping: unequipMutation.isPending,
  };
}
