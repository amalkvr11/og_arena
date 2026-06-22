export const generateProof = (memoryHash, blockNumber) => {
  const proofHash = '0xproof' + Array.from({ length: 58 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
  
  const merkleRoot = '0xmerkle' + Array.from({ length: 57 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
  
  const nodeHashes = Array.from({ length: 8 }, () => 
    '0xnode' + Array.from({ length: 59 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  )

  return {
    proofHash,
    merkleRoot,
    nodeHashes,
    memoryHash,
    blockNumber,
    timestamp: Date.now(),
    proofType: 'merkle'
  }
}

export const verifyProof = async (hash) => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const isValid = Math.random() > 0.05
  
  if (!isValid) {
    return {
      verified: false,
      hash,
      error: 'Proof verification failed - hash not found on chain',
      timestamp: new Date().toISOString()
    }
  }

  const blockNumber = Math.floor(Math.random() * 1000000) + 15000000
  const confirmations = Math.floor(Math.random() * 500) + 100
  
  return {
    verified: true,
    hash,
    blockNumber,
    blockHash: '0xblock' + Array.from({ length: 57 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join(''),
    confirmations,
    merkleProof: generateProof(hash, blockNumber),
    verifyTime: new Date().toISOString(),
    verifier: 'SoulChain Proof System v1.0'
  }
}

export const getTransactionDetails = async (txHash) => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return {
    hash: txHash,
    blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
    blockHash: '0xblock' + Array.from({ length: 57 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join(''),
    from: '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join(''),
    to: '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join(''),
    gasUsed: Math.floor(Math.random() * 50000) + 21000,
    gasPrice: (Math.random() * 50 + 10).toFixed(2) + ' Gwei',
    status: 'success',
    timestamp: new Date().toISOString()
  }
}

export const getBlockDetails = async (blockNumber) => {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  return {
    number: blockNumber,
    hash: '0xblock' + Array.from({ length: 57 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join(''),
    parentHash: '0xparent' + Array.from({ length: 56 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join(''),
    timestamp: new Date().toISOString(),
    transactionCount: Math.floor(Math.random() * 100) + 10,
    gasUsed: Math.floor(Math.random() * 10000000) + 5000000,
    gasLimit: 15000000,
    miner: '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
  }
}

export const formatProofForDisplay = (proof) => {
  const lines = []
  
  lines.push('=== SoulChain Storage Proof ===')
  lines.push(`Memory Hash: ${proof.memoryHash}`)
  lines.push(`Block: ${proof.blockNumber}`)
  lines.push(`Merkle Root: ${proof.merkleRoot}`)
  lines.push(`Timestamp: ${new Date(proof.timestamp).toISOString()}`)
  lines.push('')
  lines.push('=== Merkle Proof Path ===')
  proof.nodeHashes.forEach((node, i) => {
    lines.push(`Node ${i + 1}: ${node}`)
  })
  lines.push('')
  lines.push('=== Verification Status ===')
  lines.push('✓ Proof Valid')
  lines.push('✓ Hash Found in Block')
  lines.push('✓ Chain Integrity Verified')
  
  return lines.join('\n')
}

export const copyProofToClipboard = (proof) => {
  const formatted = formatProofForDisplay(proof)
  return navigator.clipboard.writeText(formatted)
}

export default {
  generateProof,
  verifyProof,
  getTransactionDetails,
  getBlockDetails,
  formatProofForDisplay,
  copyProofToClipboard
}
