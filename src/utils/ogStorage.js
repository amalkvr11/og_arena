import { Blob as ZgBlob, Indexer } from '@0gfoundation/0g-storage-ts-sdk'
import { BrowserProvider } from 'ethers'

const RPC_URL = import.meta.env.VITE_0G_RPC_URL || 'https://evmrpc-testnet.0g.ai'
const INDEXER_RPC = import.meta.env.VITE_0G_INDEXER_URL || 'https://indexer-storage-testnet-turbo.0g.ai'
const BLOCK_EXPLORER = import.meta.env.VITE_0G_BLOCK_EXPLORER || 'https://scan-testnet.0g.ai'
const STORAGE_EXPLORER = import.meta.env.VITE_0G_STORAGE_EXPLORER || 'https://storagescan.0g.ai'
const ENCRYPTION_ENABLED = import.meta.env.VITE_ENCRYPTION_ENABLED === 'true'

let indexerInstance = null

export function getIndexer() {
  if (!indexerInstance) {
    indexerInstance = new Indexer(INDEXER_RPC)
  }
  return indexerInstance
}

export function getExplorerUrls(txHash, rootHash) {
  return {
    blockExplorer: `${BLOCK_EXPLORER}/tx/${txHash}`,
    storageExplorer: rootHash ? `${STORAGE_EXPLORER}/file/${rootHash}` : null
  }
}

export function generateEncryptionKey() {
  const key = new Uint8Array(32)
  crypto.getRandomValues(key)
  return key
}

export function storeEncryptionKey(walletAddress, key) {
  try {
    const keys = JSON.parse(localStorage.getItem('og_encryption_keys') || '{}')
    keys[walletAddress.toLowerCase()] = Array.from(key)
    localStorage.setItem('og_encryption_keys', JSON.stringify(keys))
    return true
  } catch (e) {
    console.error('Failed to store encryption key:', e)
    return false
  }
}

export function getEncryptionKey(walletAddress) {
  try {
    const keys = JSON.parse(localStorage.getItem('og_encryption_keys') || '{}')
    const keyArray = keys[walletAddress.toLowerCase()]
    return keyArray ? new Uint8Array(keyArray) : null
  } catch (e) {
    console.error('Failed to get encryption key:', e)
    return null
  }
}

export async function getSignerFromWallet() {
  if (!window.ethereum) {
    throw new Error('No wallet detected. Please install MetaMask.')
  }
  
  const provider = new BrowserProvider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  const signer = await provider.getSigner()
  
  const chainId = await signer.provider.getChainId()
  const expectedChainId = parseInt(import.meta.env.VITE_0G_CHAIN_ID || '16602')
  
  if (chainId !== expectedChainId) {
    throw new Error(`Wrong network. Please switch to 0G Testnet (Chain ID: ${expectedChainId})`)
  }
  
  return signer
}

export async function uploadToOGStorage(file, metadata = {}, signer = null) {
  try {
    const activeSigner = signer || await getSignerFromWallet()
    const walletAddress = await activeSigner.getAddress()
    
    const indexer = getIndexer()
    
    let encryptionKey = null
    if (ENCRYPTION_ENABLED) {
      encryptionKey = getEncryptionKey(walletAddress)
      if (!encryptionKey) {
        encryptionKey = generateEncryptionKey()
        storeEncryptionKey(walletAddress, encryptionKey)
        console.log('Generated new encryption key for:', walletAddress)
      }
    }
    
    const zgBlob = new ZgBlob(file)
    
    const [tree, treeErr] = await zgBlob.merkleTree()
    if (treeErr) {
      throw new Error(`Merkle tree error: ${treeErr}`)
    }
    
    const rootHash = tree?.rootHash()
    console.log('Root hash:', rootHash)
    
    const uploadOptions = ENCRYPTION_ENABLED && encryptionKey
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
      storageExplorerUrl: urls.storageExplorer,
      encrypted: ENCRYPTION_ENABLED && encryptionKey,
      size: file.size,
      filename: file.name,
      uploadedAt: new Date().toISOString(),
      walletAddress
    }
  } catch (error) {
    console.error('Upload failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export async function uploadJSONToOG(data, filename = 'memory.json', signer = null) {
  try {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const file = new File([blob], filename, { type: 'application/json' })
    
    return await uploadToOGStorage(file, {}, signer)
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

export async function downloadFromOGStorage(rootHash, walletAddress = null) {
  try {
    const indexer = getIndexer()
    
    let decryptionOptions = {}
    
    if (ENCRYPTION_ENABLED && walletAddress) {
      const encryptionKey = getEncryptionKey(walletAddress)
      if (encryptionKey) {
        decryptionOptions = {
          proof: true,
          decryption: { symmetricKey: encryptionKey }
        }
      }
    }
    
    const [blob, dlErr] = await indexer.downloadToBlob(rootHash, {
      proof: true,
      ...decryptionOptions
    })
    
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
      error: error.message
    }
  }
}

export async function checkEncryptionStatus(rootHash) {
  try {
    const indexer = getIndexer()
    const [header, err] = await indexer.peekHeader(rootHash)
    
    if (err || !header) {
      return { encrypted: false }
    }
    
    return {
      encrypted: true,
      type: header.version === 1 ? 'aes256' : header.version === 2 ? 'ecies' : 'unknown'
    }
  } catch (error) {
    return { encrypted: false }
  }
}

export async function verifyOnOGStorage(rootHash) {
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
      error: error.message
    }
  }
}

export async function getNetworkInfo() {
  return {
    rpcUrl: RPC_URL,
    indexerUrl: INDEXER_RPC,
    blockExplorer: BLOCK_EXPLORER,
    storageExplorer: STORAGE_EXPLORER,
    encryptionEnabled: ENCRYPTION_ENABLED
  }
}

export async function checkWalletBalance(address, provider = null) {
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
      error: error.message
    }
  }
}

export default {
  getIndexer,
  getExplorerUrls,
  generateEncryptionKey,
  storeEncryptionKey,
  getEncryptionKey,
  getSignerFromWallet,
  uploadToOGStorage,
  uploadJSONToOG,
  downloadFromOGStorage,
  checkEncryptionStatus,
  verifyOnOGStorage,
  getNetworkInfo,
  checkWalletBalance
}
