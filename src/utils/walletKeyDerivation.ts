import type { WalletDerivedKey } from '../types'

const SIGNATURE_MESSAGE = `Sign this message to unlock your encrypted memories on SoulChain.

This signature will be used to derive your encryption key. 
You must sign this message each session to access your encrypted data.

WARNING: Never sign this message on a site you don't trust.

Chain: 0G Testnet
App: SoulChain
Version: 1.0.0`

const KEY_CACHE_DURATION_MS = 30 * 60 * 1000

const keyCache = new Map<string, { key: Uint8Array; timestamp: number }>()

export function clearKeyCache(walletAddress?: string): void {
  if (walletAddress) {
    keyCache.delete(walletAddress.toLowerCase())
  } else {
    keyCache.clear()
  }
}

export function getCachedKey(walletAddress: string): Uint8Array | null {
  const cached = keyCache.get(walletAddress.toLowerCase())
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > KEY_CACHE_DURATION_MS) {
    keyCache.delete(walletAddress.toLowerCase())
    return null
  }
  
  return cached.key
}

export function cacheKey(walletAddress: string, key: Uint8Array): void {
  keyCache.set(walletAddress.toLowerCase(), {
    key,
    timestamp: Date.now()
  })
}

export async function requestWalletSignature(
  signer: { signMessage: (message: string) => Promise<string> },
  customMessage?: string
): Promise<string> {
  const message = customMessage || SIGNATURE_MESSAGE
  const signature = await signer.signMessage(message)
  return signature
}

export async function deriveKeyFromSignature(signature: string): Promise<Uint8Array> {
  const encoder = new TextEncoder()
  const signatureBytes = encoder.encode(signature)
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', signatureBytes)
  
  const key = new Uint8Array(hashBuffer)
  
  return key
}

export async function getWalletDerivedKey(
  walletAddress: string,
  signer: { signMessage: (message: string) => Promise<string> },
  forceNewSignature = false
): Promise<WalletDerivedKey> {
  const normalizedAddress = walletAddress.toLowerCase()
  
  if (!forceNewSignature) {
    const cachedKey = getCachedKey(normalizedAddress)
    if (cachedKey) {
      return {
        key: cachedKey,
        derived: true,
        cached: true
      }
    }
  }
  
  const signature = await requestWalletSignature(signer)
  
  const key = await deriveKeyFromSignature(signature)
  
  cacheKey(normalizedAddress, key)
  
  return {
    key,
    derived: true,
    cached: false
  }
}

export function hasCachedKey(walletAddress: string): boolean {
  return getCachedKey(walletAddress) !== null
}

export function verifyKeyDerivation(key: Uint8Array): boolean {
  if (!(key instanceof Uint8Array)) return false
  if (key.length !== 32) return false
  return true
}

export const SIGNATURE_PROMPT_MESSAGE = SIGNATURE_MESSAGE

export default {
  requestWalletSignature,
  deriveKeyFromSignature,
  getWalletDerivedKey,
  clearKeyCache,
  getCachedKey,
  cacheKey,
  hasCachedKey,
  verifyKeyDerivation,
  SIGNATURE_PROMPT_MESSAGE
}
