'use client'

import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export type Gen1Tool = {
  tool_id: string;
  season_id: string | null;
  name: string;
  rarity: 'common' | 'rare' | 'epic';
  description: string | null;
  metadata: Record<string, unknown>;
  supply_total: number;
  created_at: string;
  updated_at: string;
};

export type Gen1Listing = {
  listing_id: string;
  seller_user_id: string;
  tool_id: string;
  quantity: number;
  price_native: string;
  token_symbol: string;
  status: string;
  created_at: string;
  expires_at: string | null;
  metadata: Record<string, unknown>;
};

export type Gen1InventoryRow = {
  owner_user_id: string;
  tool_id: string;
  quantity: number;
  updated_at: string;
};

export function useGen1Tools() {
  return useQuery<{ tools: Gen1Tool[] }, Error, { tools: Gen1Tool[] }>({
    queryKey: ['/api/bantahbro/gen1/tools'],
    queryFn: async () => apiRequest('GET', '/api/bantahbro/gen1/tools') as Promise<{ tools: Gen1Tool[] }>,
  });
}

export function useGen1Listings(status: string = 'open') {
  return useQuery<{ listings: Gen1Listing[] }, Error, { listings: Gen1Listing[] }>({
    queryKey: ['/api/bantahbro/gen1/listings', status],
    queryFn: async () =>
      apiRequest('GET', `/api/bantahbro/gen1/listings?status=${encodeURIComponent(status)}`) as Promise<{ listings: Gen1Listing[] }>,
  });
}

export function useGen1Inventory(ownerUserId: string | null) {
  return useQuery<{ inventory: Gen1InventoryRow[] }, Error, { inventory: Gen1InventoryRow[] }>({
    queryKey: ['/api/bantahbro/gen1/inventory', ownerUserId],
    queryFn: async () =>
      apiRequest('GET', `/api/bantahbro/gen1/inventory/${encodeURIComponent(ownerUserId || '')}`) as Promise<{ inventory: Gen1InventoryRow[] }>,
    enabled: Boolean(ownerUserId),
  });
}

export function useCreateGen1Listing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      listingId: string;
      toolId: string;
      quantity: number;
      priceNative: string;
      tokenSymbol?: string;
      expiresAt?: string | null;
      metadata?: Record<string, unknown>;
    }) => apiRequest('POST', '/api/bantahbro/gen1/listings', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bantahbro/gen1/listings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bantahbro/gen1/inventory'] });
    },
  });
}

export function useCancelGen1Listing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: string) => apiRequest('POST', `/api/bantahbro/gen1/listings/${encodeURIComponent(listingId)}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bantahbro/gen1/listings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bantahbro/gen1/inventory'] });
    },
  });
}

export function useBuyGen1Listing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: string) => apiRequest('POST', `/api/bantahbro/gen1/listings/${encodeURIComponent(listingId)}/buy`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bantahbro/gen1/listings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bantahbro/gen1/inventory'] });
    },
  });
}

export function useBuyGen1Tool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      toolId: string;
      purchaseId: string;
      quantity?: number;
      priceNative: string;
      tokenSymbol?: string;
      paymentTxHash?: string | null;
      metadata?: Record<string, unknown>;
    }) => apiRequest('POST', `/api/bantahbro/gen1/tools/${encodeURIComponent(payload.toolId)}/buy`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bantahbro/gen1/listings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bantahbro/gen1/inventory'] });
    },
  });
}

export function useCreateGen1Tool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      toolId: string;
      seasonId?: string | null;
      name: string;
      rarity: 'common' | 'rare' | 'epic';
      description?: string;
      metadata?: Record<string, unknown>;
      supplyTotal?: number;
    }) => apiRequest('POST', '/api/bantahbro/gen1/tools', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bantahbro/gen1/tools'] });
    },
  });
}

export function useInventoryByTool(ownerUserId: string | null) {
  const inventoryQuery = useGen1Inventory(ownerUserId);

  return useMemo(() => {
    const rows = Array.isArray(inventoryQuery.data?.inventory)
      ? inventoryQuery.data.inventory
      : [];
    return rows.reduce<Record<string, Gen1InventoryRow>>((acc, row) => {
      acc[row.tool_id] = row;
      return acc;
    }, {});
  }, [inventoryQuery.data?.inventory]);
}
