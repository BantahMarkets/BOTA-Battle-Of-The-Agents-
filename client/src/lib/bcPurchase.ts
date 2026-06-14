import { apiRequest } from '@/lib/queryClient'
import { executeBantahBroPreparedWalletAction } from '@/lib/walletActions'
import type { OnchainPublicConfig } from '@shared/onchainConfig'
import type { BantahBroPreparedWalletAction, BantahBroWalletAction } from '@shared/bantahBroWallet'

export type PurchaseBcWithWalletOptions = {
  ensureOnchainWallet: (purpose?: string) => Promise<{ walletAddress: string }>
  wallets: any
  usdAmount: number
  nativeAmount: string // string representation of native token amount (e.g. '0.05')
  tokenSymbol?: string // 'USDT' or 'BNB'
}

export async function purchaseBcWithWallet(opts: PurchaseBcWithWalletOptions) {
  const { ensureOnchainWallet, wallets, usdAmount, nativeAmount } = opts
  const tokenSymbol = (opts.tokenSymbol || 'BNB')

  const { walletAddress } = await ensureOnchainWallet('purchase BantCredit')

  const onchainConfig = (await apiRequest('GET', '/api/onchain/config')) as OnchainPublicConfig

  const walletAction: BantahBroWalletAction = {
    kind: 'send',
    chainId: onchainConfig.defaultChainId,
    chainLabel: onchainConfig.defaultChainId === 8453 ? 'Base' : 'BNB Chain',
    tokenQuery: tokenSymbol === 'USDT' ? 'USDT' : (onchainConfig.defaultChainId === 8453 ? 'ETH' : 'BNB'),
    amount: String(nativeAmount),
    recipientAddress: 'bantah.bro',
    recipientLabel: 'Bantah.bro',
    summary: `Purchase ${usdAmount} USD → BantCredit`,
  }

  const preparedResponse = (await apiRequest('POST', '/api/bantahbro/wallet-actions/prepare', {
    action: walletAction,
    walletAddress,
  })) as { action: BantahBroPreparedWalletAction }

  const result = await executeBantahBroPreparedWalletAction({
    wallets,
    preferredWalletAddress: walletAddress,
    onchainConfig,
    action: preparedResponse.action,
  })

  // Call backend to mint BC (requires usdAmount provided by client)
  const resp = await apiRequest('POST', '/api/bantahbro/gen1/buy-bc', {
    txHash: result.txHash,
    chainId: onchainConfig.defaultChainId,
    usdAmount,
    tokenSymbol,
  })

  return { result, resp }
}
