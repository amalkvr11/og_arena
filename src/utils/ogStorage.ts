import { Blob as ZgBlob, Indexer } from '@0gfoundation/0g-storage-ts-sdk'
import { BrowserProvider, Signer } from 'ethers'
import { getWalletDerivedKey, getCachedKey, clearKeyCache, hasCachedKey } from './walletKeyDerivation'
import type { UploadResult, DownloadResult, EncryptionStatus, VerificationResult, NetworkInfo, BalanceInfo, ExplorerUrls } from '../types'

const RPC_URL = import.meta.env.VITE_0G_RPC_URL || 'https://evmrpc-testnet.0g.ai'
const INDEXER_RPC = import.meta.env.VITE_0G_INDEXER_URL || 'https://indexer-storage-testnet-turbo.0g.ai'
const BLOCK_EXPLORER = import.meta.env.VITE_0G_BLOCK_EXPLORER || 'https://scan-testnet.0g.ai'
const STORAGE_EXPLORER = import.meta.env.VITE_0G_STORAGE_EXPLORER || 'https://storagescan.0g.ai'
const ENCRYPTION_ENABLED = import.meta.env.VITE_ENCRYPTION_ENABLED === 'true'

let indexerInstance: Indexer | null = null

export function getIndexer(): Indexer {
  if (!indexerInstance) {
    indexerInstance = new Indexer(INDEXER_RPC)
  }
  return indexerInstance
}

export function getExplorerUrls(txHash: string, rootHash?: string): ExplorerUrls {
  return {
    blockExplorer: `${BLOCK_EXPLORER}/tx/${txHash}`,
    storageExplorer: rootHash ? `${STORAGE_EXPLORER}/file/${rootHash}` : null
  }
}

export function getEncryptionKey(_walletAddress: string): Uint8Array | null {
  console.warn('getEncryptionKey is deprecated. Use wallet-derived keys instead.')
  return null
}

export function generateEncryptionKey(): Uint8Array {
  const key = new Uint8Array(32)
  crypto.getRandomValues(key)
  return key
}

export function storeEncryptionKey(_walletAddress: string, _key: Uint8Array): boolean {
  console.warn('storeEncryptionKey is deprecated. Keys are now derived from wallet signatures.')
  return false
}

export async function getSignerFromWallet(): Promise<Signer> {
  if (!window.ethereum) {
    throw new Error('No wallet detected. Please install MetaMask.')
  }
  
  const provider = new BrowserProvider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  const signer = await provider.getSigner()
  
  const chainId = Number((await signer.provider?.getNetwork())?.chainId)
  const expectedChainId = parseInt(import.meta.env.VITE_0G_CHAIN_ID || '16602')
  
  if (chainId !== expectedChainId) {
    throw new Error(`Wrong network. Please switch to 0G Testnet (Chain ID: ${expectedChainId})`)
  }
  
  return signer
}

export async function getEncryptionKeyForWallet(
  walletAddress: string,
  signer: Signer,
  forceNewSignature = false
): Promise<Uint8Array | null> {
  if (!ENCRYPTION_ENABLED) return null
  
  const result = await getWalletDerivedKey(walletAddress, signer as unknown as { signMessage: (message: string) => Promise<string> }, forceNewSignature)
  return result.key
}

export function checkEncryptionKeyCached(walletAddress: string): boolean {
  return hasCachedKey(walletAddress)
}

export function clearWalletEncryptionKey(walletAddress?: string): void {
  clearKeyCache(walletAddress)
}

interface UploadOptions {
  encryption?: {
    type: 'aes256'
    key: Uint8Array
  }
}

export async function uploadToOGStorage(
  file: File,
  metadata: Record<string, unknown> = {},
  signer: Signer | null = null
): Promise<UploadResult> {
  try {
    const activeSigner = signer || await getSignerFromWallet()
    const walletAddress = await activeSigner.getAddress()
    
    const indexer = getIndexer()
    
    let encryptionKey: Uint8Array | null = null
    if (ENCRYPTION_ENABLED) {
      encryptionKey = await getEncryptionKeyForWallet(walletAddress, activeSigner)
      if (encryptionKey) {
        console.log('Derived encryption key from wallet signature')
      }
    }
    
    const zgBlob = new ZgBlob(file)
    
    const [tree, treeErr] = await zgBlob.merkleTree()
    if (treeErr) {
      throw new Error(`Merkle tree error: ${treeErr}`)
    }
    
    const rootHash = tree?.rootHash()
    console.log('Root hash:', rootHash)
    
    const uploadOptions: UploadOptions = ENCRYPTION_ENABLED && encryptionKey
      ? { encryption: { type: 'aes256', key: encryptionKey } }
      : {}
    
    const [tx, uploadErr] = await indexer.upload(zgBlob, RPC_URL, activeSigner, uploadOptions)
    
    if (uploadErr) {
      throw new Error(`Upload error: ${uploadErr}`)
    }
    
    const txHash = tx.txHash || (tx.txHashes && tx.txHashes[0])
    const finalRootHash = tx.rootHash || (tx.rootHashes && tx.rootHashes[0]) || rootHash
    
    const urls = getExplorerUrls(txHash, finalRootHash)
    
    return {
      success: true,
      txHash,
      rootHash: finalRootHash,
      blockExplorerUrl: urls.blockExplorer,
      storageExplorerUrl: urls.storageExplorer || undefined,
      encrypted: ENCRYPTION_ENABLED && !!encryptionKey,
      size: file.size,
      filename: file.name,
      uploadedAt: new Date().toISOString(),
      walletAddress
    }
  } catch (error) {
    console.error('Upload failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function uploadJSONToOG(
  data: Record<string, unknown>,
  filename = 'memory.json',
  signer: Signer | null = null
): Promise<UploadResult> {
  try {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const file = new File([blob], filename, { type: 'application/json' })
    
    return await uploadToOGStorage(file, {}, signer)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

interface DownloadOptions {
  proof?: boolean
  decryption?: {
    symmetricKey: Uint8Array
  }
}

export async function downloadFromOGStorage(
  rootHash: string,
  walletAddress: string | null = null,
  signer: Signer | null = null
): Promise<DownloadResult> {
  try {
    const indexer = getIndexer()
    
    let decryptionOptions: DownloadOptions = { proof: true }
    
    if (ENCRYPTION_ENABLED && walletAddress && signer) {
      const encryptionKey = await getEncryptionKeyForWallet(walletAddress, signer)
      if (encryptionKey) {
        decryptionOptions = {
          proof: true,
          decryption: { symmetricKey: encryptionKey }
        }
      }
    }
    
    const [blob, dlErr] = await indexer.downloadToBlob(rootHash, decryptionOptions)
    
    if (dlErr) {
      throw new Error(`Download error: ${dlErr}`)
    }
    
    return {
      success: true,
      blob,
      data: blob
    }
  } catch (error) {
    console.error('Download failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function checkEncryptionStatus(rootHash: string): Promise<EncryptionStatus> {
  try {
    const indexer = getIndexer()
    const [header, err] = await indexer.peekHeader(rootHash)
    
    if (err || !header) {
      return { encrypted: false }
    }
    
    type HeaderVersion = { version?: number }
    const headerVersion = (header as HeaderVersion).version
    
    return {
      encrypted: true,
      type: headerVersion === 1 ? 'aes256' : headerVersion === 2 ? 'ecies' : 'unknown'
    }
  } catch {
    return { encrypted: false }
  }
}

export async function verifyOnOGStorage(rootHash: string): Promise<VerificationResult> {
  try {
    const indexer = getIndexer()
    const [header, err] = await indexer.peekHeader(rootHash)
    
    if (err) {
      return {
        verified: false,
        error: err
      }
    }
    
    return {
      verified: true,
      exists: !!header,
      header
    }
  } catch (error) {
    return {
      verified: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getNetworkInfo(): Promise<NetworkInfo> {
  return {
    rpcUrl: RPC_URL,
    indexerUrl: INDEXER_RPC,
    blockExplorer: BLOCK_EXPLORER,
    storageExplorer: STORAGE_EXPLORER,
    encryptionEnabled: ENCRYPTION_ENABLED
  }
}

export async function checkWalletBalance(address: string, provider: BrowserProvider | null = null): Promise<BalanceInfo> {
  try {
    const activeProvider = provider || new BrowserProvider(window.ethereum)
    const balance = await activeProvider.getBalance(address)
    return {
      balance: balance.toString(),
      balanceEth: Number(balance) / 1e18
    }
  } catch (error) {
    return {
      balance: '0',
      balanceEth: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export default {
  getIndexer,
  getExplorerUrls,
  generateEncryptionKey,
  getEncryptionKey,
  storeEncryptionKey,
  getEncryptionKeyForWallet,
  checkEncryptionKeyCached,
  clearWalletEncryptionKey,
  getSignerFromWallet,
  uploadToOGStorage,
  uploadJSONToOG,
  downloadFromOGStorage,
  checkEncryptionStatus,
  verifyOnOGStorage,
  getNetworkInfo,
  checkWalletBalance
}
