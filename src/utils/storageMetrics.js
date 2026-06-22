import { openDB } from 'idb'

const DB_NAME = 'soulchain_storage'
const DB_VERSION = 1
const STORE_NAME = 'memories'

let dbPromise = null

const getDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'hash' })
          store.createIndex('uploadedAt', 'uploadedAt')
          store.createIndex('category', 'category')
        }
      }
    })
  }
  return dbPromise
}

window.getDB = getDB

const generateRealisticHash = () => {
  const bytes = new Uint8Array(32)
  window.crypto.getRandomValues(bytes)
  return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

const generateTransactionHash = () => {
  return generateRealisticHash()
}

const generateBlockHash = () => {
  return generateRealisticHash()
}

let blockHeight = 12845623
const getBlockHeight = () => {
  blockHeight += Math.floor(Math.random() * 5) + 1
  return blockHeight
}

const simulateNetworkLatency = async (minMs = 500, maxMs = 2000) => {
  const delay = Math.floor(Math.random() * (maxMs - minMs)) + minMs
  await new Promise(resolve => setTimeout(resolve, delay))
}

export const uploadToMockStorage = async (dataArray, metadata = {}) => {
  const startTime = Date.now()
  
  await simulateNetworkLatency(800, 2500)
  
  const hash = generateRealisticHash()
  const txHash = generateTransactionHash()
  const blockNumber = getBlockHeight()
  const blockHash = generateBlockHash()
  
  const storedData = {
    hash,
    txHash,
    blockNumber,
    blockHash,
    size: dataArray.length,
    uploadedAt: new Date().toISOString(),
    confirmations: 1,
    network: '0G Testnet (Mock)',
    chunkCount: Math.ceil(dataArray.length / 1024),
    mimeType: metadata.mimeType || 'application/octet-stream',
    encrypted: metadata.encrypted !== false,
    category: metadata.category || 'personal',
    tags: metadata.tags || [],
    title: metadata.title || 'Untitled Memory',
    userIdentification: metadata.userId || 'anonymous',
    mock: true
  }

  try {
    const db = await getDB()
    await db.put(STORE_NAME, {
      ...storedData,
      data: Array.from(dataArray),
      raw: dataArray
    })
  } catch (e) {
    console.warn('IndexedDB storage failed, using localStorage fallback')
    const memories = JSON.parse(localStorage.getItem('soulchain_memories') || '[]')
    memories.push(storedData)
    localStorage.setItem('soulchain_memories', JSON.stringify(memories))
  }

  localStorage.setItem('lastMemoryHash', hash)
  localStorage.setItem('lastMemoryTxHash', txHash)
  localStorage.setItem('lastMemoryBlock', blockNumber.toString())

  return storedData
}

export const uploadTo0GStorage = uploadToMockStorage

export const downloadFromMockStorage = async (hash) => {
  const startTime = Date.now()
  
  await simulateNetworkLatency(600, 1800)

  try {
    const db = await getDB()
    const record = await db.get(STORE_NAME, hash)
    
    if (record && record.data) {
      return {
        hash: record.hash,
        content: record.data,
        size: record.size,
        downloadedAt: new Date().toISOString(),
        downloadTimestamp: Date.now(),
        txHash: record.txHash,
        blockNumber: record.blockNumber,
        verified: true,
        mock: true
      }
    }
  } catch (e) {
    console.warn('IndexedDB lookup failed')
  }

  const memories = JSON.parse(localStorage.getItem('soulchain_memories') || '[]')
  const memory = memories.find(m => m.hash === hash)
  
  if (memory) {
    return {
      hash: memory.hash,
      content: [],
      size: memory.size,
      downloadedAt: new Date().toISOString(),
      downloadTimestamp: Date.now(),
      txHash: memory.txHash,
      blockNumber: memory.blockNumber,
      verified: true,
      mock: true
    }
  }

  return null
}

export const downloadFrom0GStorage = downloadFromMockStorage

export const verifyStorageProof = async (hash) => {
  await simulateNetworkLatency(400, 1200)
  
  try {
    const db = await getDB()
    const record = await db.get(STORE_NAME, hash)
    
    if (record) {
      return {
        verified: true,
        hash: record.hash,
        blockNumber: record.blockNumber,
        blockHash: record.blockHash,
        confirmations: Math.floor(Math.random() * 100) + 50,
        verifyTime: new Date().toISOString(),
        proofType: 'merkle',
        nodeCount: Math.floor(Math.random() * 10) + 5
      }
    }
  } catch (e) {
    console.warn('Verification lookup failed')
  }

  return {
    verified: false,
    hash,
    error: 'Hash not found in local storage'
  }
}

export const getStorageStats = async () => {
  let totalSize = 0
  let count = 0

  try {
    const db = await getDB()
    const allRecords = await db.getAll(STORE_NAME)
    count = allRecords.length
    totalSize = allRecords.reduce((sum, r) => sum + (r.size || 0), 0)
  } catch (e) {
    const memories = JSON.parse(localStorage.getItem('soulchain_memories') || '[]')
    count = memories.length
    totalSize = memories.reduce((sum, m) => sum + (m.size || 0), 0)
  }

  return {
    totalMemories: count,
    totalBytes: totalSize,
    totalMB: (totalSize / (1024 * 1024)).toFixed(2),
    lastUpdated: new Date().toISOString()
  }
}

export const getNetworkStatus = async () => {
  await simulateNetworkLatency(100, 300)
  
  return {
    status: 'operational',
    blockHeight: getBlockHeight(),
    avgBlockTime: (2 + Math.random() * 0.5).toFixed(2) + 's',
    peersConnected: Math.floor(Math.random() * 20) + 30,
    networkLoad: Math.floor(Math.random() * 30) + 10,
    rpcLatency: Math.floor(Math.random() * 100) + 50,
    lastUpdated: new Date().toISOString()
  }
}

export const getAllMemories = async () => {
  try {
    const db = await getDB()
    return await db.getAll(STORE_NAME)
  } catch (e) {
    return JSON.parse(localStorage.getItem('soulchain_memories') || '[]')
  }
}

export const deleteMemory = async (hash) => {
  try {
    const db = await getDB()
    await db.delete(STORE_NAME, hash)
  } catch (e) {
    const memories = JSON.parse(localStorage.getItem('soulchain_memories') || '[]')
    const filtered = memories.filter(m => m.hash !== hash)
    localStorage.setItem('soulchain_memories', JSON.stringify(filtered))
  }
}

export const getBlockExplorerUrl = (hash, type = 'tx') => {
  const baseUrl = 'https://scan-testnet.0g.ai'
  return `${baseUrl}/${type}/${hash}`
}

export default {
  uploadTo0GStorage,
  downloadFrom0GStorage,
  verifyStorageProof,
  getStorageStats,
  getNetworkStatus,
  getAllMemories,
  deleteMemory,
  getBlockExplorerUrl
}
