'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'

export function useGen1Packs() {
  return useQuery({
    queryKey: ['/api/bantahbro/gen1/packs'],
    queryFn: async () => apiRequest('GET', '/api/bantahbro/gen1/packs') as Promise<{ packs: any[] }>,
  })
}

export function useBuyGen1Pack() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { packId: string; txHash?: string; chainId?: number; tokenSymbol?: string; metadata?: Record<string, unknown> }) => apiRequest('POST', `/api/bantahbro/gen1/packs/${encodeURIComponent(payload.packId)}/buy`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/bantahbro/gen1/packs'] })
      qc.invalidateQueries({ queryKey: ['/api/auth/user'] })
    },
  })
}

export function useOpenGen1Pack() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { packInstanceId: string; mode?: 'manual'|'autonomous'; agentMetrics?: Record<string, unknown>; autoEquip?: boolean }) => apiRequest('POST', `/api/bantahbro/gen1/packs/${encodeURIComponent(payload.packInstanceId)}/open`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/bantahbro/gen1/inventory'] })
      qc.invalidateQueries({ queryKey: ['/api/bantahbro/inventory'] })
      qc.invalidateQueries({ queryKey: ['/api/bantahbro/gen1/packs'] })
      qc.invalidateQueries({ queryKey: ['/api/auth/user'] })
    },
  })
}

export function useUnopenedPacks(walletAddress: string | null) {
  return useQuery({
    queryKey: ['/api/bantahbro/gen1/packs/inventory', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return { unopenedPacks: [] };
      return apiRequest('GET', `/api/bantahbro/gen1/packs/inventory/${walletAddress}`) as Promise<{ unopenedPacks: any[] }>;
    },
    enabled: !!walletAddress,
  });
}

export function usePackHistory(walletAddress: string | null) {
  return useQuery({
    queryKey: ['/api/bantahbro/gen1/packs/history', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return { history: [] };
      return apiRequest('GET', `/api/bantahbro/gen1/packs/history/${walletAddress}`) as Promise<{ history: any[] }>;
    },
    enabled: !!walletAddress,
  });
}

export default useGen1Packs
