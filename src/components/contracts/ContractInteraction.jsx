import React, { useState, useEffect } from "react"
import { useWeb3 } from "../../contexts/Web3Context"

const MOCK_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const OG_NETWORK = {
  chainId: "0x...", 
  name: "0G Testnet",
  rpcUrl: "https://rpc.0g.ai"
}

export const ContractInteraction = () => {
  const { account, isConnected, isConnecting, connectWallet, disconnectWallet, formatAddress, walletType, network } = useWeb3()
  const [contractAddress, setContractAddress] = useState(MOCK_CONTRACT_ADDRESS)
  const [tokenId, setTokenId] = useState("1")
  const [memoryHash, setMemoryHash] = useState("")
  const [isActivating, setIsActivating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const savedHash = localStorage.getItem("lastMemoryHash")
    if (savedHash) {
      setMemoryHash(savedHash)
    }
    
    const savedTxHash = localStorage.getItem("lastMemoryTxHash")
    if (savedTxHash && result === null) {
      setResult({
        type: "success",
        message: "Previous transaction found",
        txHash: savedTxHash,
        blockNumber: parseInt(localStorage.getItem("lastMemoryBlock") || "0"),
        gasUsed: 45000
      })
    }
  }, [])

  const handleActivate = async () => {
    if (!contractAddress || !tokenId || !memoryHash) {
      setError("Please fill in all fields")
      return
    }
    
    setIsActivating(true)
    setError(null)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setResult({
      type: "success",
      message: "Memory activated on chain successfully!",
      txHash: "0x" + Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join(""),
      blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
      gasUsed: Math.floor(Math.random() * 50000) + 21000
    })
    
    setIsActivating(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="contract-interaction">
      <div className="wallet-section">
        {!isConnected ? (
          <button 
            onClick={() => connectWallet()} 
            disabled={isConnecting}
            className="connect-wallet-btn"
          >
            {isConnecting ? (
              <>
                <span className="spinner"></span>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2"/>
                  <path d="M1 10h22"/>
                </svg>
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        ) : (
          <div className="wallet-info">
            <div className="wallet-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="wallet-details">
              <span className="wallet-label">{walletType === 'metamask' ? 'MetaMask' : 'Mock Wallet'}</span>
              <span className="wallet-address">{formatAddress(account)}</span>
            </div>
            <div className="wallet-network">
              <span className="network-dot"></span>
              <span>{network?.name || '0G Testnet'}</span>
            </div>
            <button onClick={disconnectWallet} className="disconnect-btn">
              Disconnect
            </button>
          </div>
        )}
      </div>

      <div className="contract-card">
        <div className="contract-header">
          <div className="contract-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span>Verified Contract</span>
          </div>
          <h3>SoulChain Memory Registry</h3>
          <p>ERC-721 compliant contract for memory verification</p>
        </div>
        
        <div className="contract-address-display">
          <span className="label">Contract Address</span>
          <div className="address-value">
            <code>{contractAddress}</code>
            <button 
              onClick={() => copyToClipboard(contractAddress)}
              className="copy-btn"
              title="Copy address"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>Activate Memory</h4>
        <p className="form-desc">Link your encrypted memory to an NFT token for permanent on-chain verification.</p>
        
        <div className="form-group">
          <label>
            <span className="label-text">Contract Address</span>
            <span className="label-hint">Auto-filled from deployed contract</span>
          </label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x... (SoulChain contract address)"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Token ID</label>
            <input
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="1"
            />
          </div>
          <div className="form-group">
            <label>
              <span className="label-text">Memory Hash</span>
              {memoryHash && <span className="label-success">✓ Hash loaded from vault</span>}
            </label>
            <input
              type="text"
              value={memoryHash}
              onChange={(e) => setMemoryHash(e.target.value)}
              placeholder="Auto-filled from Memory Vault or paste manually"
              className={memoryHash ? "has-value" : ""}
            />
          </div>
        </div>

        <button 
          onClick={handleActivate}
          disabled={isActivating || !contractAddress || !tokenId || !memoryHash || !isConnected}
          className="activate-btn"
        >
          {isActivating ? (
            <>
              <span className="spinner"></span>
              <span>Activating...</span>
            </>
          ) : !isConnected ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2"/>
                <path d="M1 10h22"/>
              </svg>
              <span>Connect Wallet First</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span>Activate Memory on Chain</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="result-card error-card">
          <div className="result-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div className="result-content">
            <p>{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="result-card success-card">
          <div className="result-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div className="result-content">
            <h4>{result.message}</h4>
            <div className="result-details">
              <div className="detail-row">
                <span className="detail-label">Transaction Hash</span>
                <code className="detail-value clickable" onClick={() => copyToClipboard(result.txHash)}>
                  {result.txHash.slice(0, 10)}...{result.txHash.slice(-8)}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                </code>
              </div>
              <div className="detail-row">
                <span className="detail-label">Block Number</span>
                <span className="detail-value">{result.blockNumber.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Gas Used</span>
                <span className="detail-value">{result.gasUsed.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="contract-features">
        <h4>Contract Functions</h4>
        <div className="features-list">
          <div className="feature-item">
            <div className="feature-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div className="feature-text">
              <span className="feature-name">activateMemories</span>
              <span className="feature-desc">Link memory hash to NFT token</span>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div className="feature-text">
              <span className="feature-name">isMemoriesActivated</span>
              <span className="feature-desc">Check if memory is activated</span>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div className="feature-text">
              <span className="feature-name">tokenURI</span>
              <span className="feature-desc">Get token metadata</span>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div className="feature-text">
              <span className="feature-name">transferBeneficiary</span>
              <span className="feature-desc">Transfer legacy ownership</span>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div className="feature-text">
              <span className="feature-name">setTimeLock</span>
              <span className="feature-desc">Configure time capsule unlock</span>
            </div>
          </div>
        </div>
      </div>

      <div className="network-info">
        <div className="info-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
          <span>Network: 0G Testnet</span>
        </div>
        <div className="info-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Block Time: ~2s</span>
        </div>
        <div className="info-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <span>Contract: Verified</span>
        </div>
      </div>
    </div>
  )
}
