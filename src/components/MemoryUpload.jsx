import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useWeb3 } from "../contexts/Web3Context"
import { useToast } from "./Layout/Toast"
import { uploadToOGStorage, downloadFromOGStorage, getNetworkInfo } from "../utils/ogStorage"
import { uploadToMockStorage, downloadFromMockStorage } from "../utils/storageMetrics"

export const MemoryUpload = () => {
  const { account, isConnected, walletType, signer, isCorrectNetwork, switchToOGNetwork, balance, network, getExplorerUrl, getStorageExplorerUrl } = useWeb3()
  const toast = useToast()
  
  const [memory, setMemory] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState("")
  const [uploadResult, setUploadResult] = useState(null)
  const [downloadResult, setDownloadResult] = useState(null)
  const [error, setError] = useState(null)
  const [uploadedFileHash, setUploadedFileHash] = useState("")
  const [shareLink, setShareLink] = useState("")

  const handleUpload = async () => {
    if (!memory.trim()) {
      setError({ type: 'error', message: 'Please enter your memory content' })
      return
    }
    
    setIsUploading(true)
    setError(null)
    setUploadProgress(0)
    setUploadResult(null)
    setUploadStatus("")

    try {
      const memoryData = {
        content: memory,
        title: `Memory ${new Date().toLocaleDateString()}`,
        timestamp: new Date().toISOString(),
        size: memory.length
      }
      
      const jsonBlob = new Blob([JSON.stringify(memoryData, null, 2)], { type: 'application/json' })
      const file = new File([jsonBlob], `memory-${Date.now()}.json`, { type: 'application/json' })

      if (isConnected && walletType === 'metamask' && signer && isCorrectNetwork) {
        setUploadStatus("Connecting to 0G Network...")
        setUploadProgress(20)
        
        setUploadStatus("Calculating Merkle tree...")
        setUploadProgress(40)
        
        const result = await uploadToOGStorage(file, {}, signer)
        
        if (result.success) {
          setUploadProgress(100)
          setUploadResult({
            hash: result.txHash,
            rootHash: result.rootHash,
            size: result.size,
            encrypted: result.encrypted,
            blockExplorerUrl: result.blockExplorerUrl,
            storageExplorerUrl: result.storageExplorerUrl,
            walletAddress: result.walletAddress,
            filename: result.filename
          })
          setUploadedFileHash(result.rootHash)
          setUploadStatus("Upload complete!")
          setShareLink(`${window.location.origin}/memory-vault?hash=${result.rootHash}`)
          toast?.success("Memory uploaded to 0G successfully!")
          localStorage.setItem("lastMemoryHash", result.rootHash)
          localStorage.setItem("lastMemoryTxHash", result.txHash)
        } else {
          setError({ type: 'error', message: result.error || 'Upload failed' })
          toast?.error(result.error || 'Upload failed')
        }
      } else {
        setUploadStatus("Using mock storage (connect wallet for real 0G)...")
        setUploadProgress(30)
        
        const encryptedData = Array.from(new TextEncoder().encode(memory))
        const result = await uploadToMockStorage(encryptedData, { title: memoryData.title })
        
        setUploadProgress(100)
        setUploadResult({
          hash: result.hash,
          size: result.size,
          encrypted: true,
          mock: true
        })
        setUploadedFileHash(result.hash)
        setUploadStatus("Mock upload complete - connect wallet for real 0G storage")
        toast?.success("Memory stored (mock mode)")
        localStorage.setItem("lastMemoryHash", result.hash)
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError({ type: 'error', message: `Upload failed: ${err.message}` })
      toast?.error(`Upload failed: ${err.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async () => {
    if (!uploadedFileHash) {
      setError({ type: 'error', message: 'No file uploaded yet' })
      return
    }
    
    setIsDownloading(true)
    setError(null)
    setDownloadResult(null)

    try {
      let result
      
      if (isConnected && walletType === 'metamask' && isCorrectNetwork) {
        result = await downloadFromOGStorage(uploadedFileHash, account)
        
        if (result.success && result.blob) {
          const text = await result.blob.text()
          const data = JSON.parse(text)
          setDownloadResult({
            content: data.content,
            timestamp: data.timestamp,
            title: data.title
          })
        } else {
          setError({ type: 'error', message: result.error || 'Download failed' })
        }
      } else {
        result = await downloadFromMockStorage(uploadedFileHash)
        
        if (result && result.content) {
          const text = Array.isArray(result.content) 
            ? new TextDecoder().decode(new Uint8Array(result.content))
            : result.content
          setDownloadResult({
            content: text,
            mock: true
          })
        }
      }
    } catch (err) {
      setError({ type: 'error', message: `Download failed: ${err.message}` })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleClear = () => {
    setMemory("")
    setUploadResult(null)
    setDownloadResult(null)
    setError(null)
    setUploadedFileHash("")
    setUploadProgress(0)
    setUploadStatus("")
  }

  const needsWalletConnect = !isConnected
  const needsNetworkSwitch = isConnected && walletType === 'metamask' && !isCorrectNetwork
  const needsTokens = isConnected && walletType === 'metamask' && parseFloat(balance || '0') < 0.01

  return (
    <div className="memory-upload">
      {!isConnected && (
        <div className="wallet-prompt">
          <div className="prompt-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2"/>
              <path d="M1 10h22"/>
            </svg>
          </div>
          <div className="prompt-content">
            <h4>Connect Wallet for Real 0G Storage</h4>
            <p>Your memories will be encrypted and stored on the 0G blockchain with cryptographic verification.</p>
          </div>
          <Link to="/smart-contracts" className="prompt-btn">
            Connect Wallet
          </Link>
        </div>
      )}

      {needsNetworkSwitch && (
        <div className="network-warning">
          <div className="warning-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div className="warning-content">
            <p>Wrong network detected</p>
          </div>
          <button onClick={switchToOGNetwork} className="switch-btn">
            Switch to 0G
          </button>
        </div>
      )}

      {needsTokens && (
        <div className="balance-warning">
          <p>Low balance: {balance} 0G. Get tokens from the <a href="https://faucet.0g.ai" target="_blank" rel="noopener noreferrer">0G Faucet</a></p>
        </div>
      )}

      <div className="upload-header">
        <div className="char-counter">
          <span className="char-count">{memory.length}</span>
          <span className="char-label">characters</span>
        </div>
        <div className="storage-badge">
          {isConnected && walletType === 'metamask' && isCorrectNetwork ? (
            <>
              <span className="badge-dot live"></span>
              <span>Real 0G Storage</span>
            </>
          ) : (
            <>
              <span className="badge-dot mock"></span>
              <span>Mock Storage</span>
            </>
          )}
        </div>
      </div>

      <textarea
        value={memory}
        onChange={(e) => setMemory(e.target.value)}
        placeholder="Write your memory here... A thought, a moment, a story you want to preserve forever on the blockchain."
        className="memory-textarea"
        disabled={isUploading || isDownloading}
      />

      <div className="upload-actions">
        <button
          onClick={handleUpload}
          disabled={isUploading || !memory.trim() || isDownloading || needsNetworkSwitch}
          className="action-btn primary-btn"
        >
          {isUploading ? (
            <>
              <span className="spinner"></span>
              <span>{uploadStatus || "Uploading..."}</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              <span>Upload to {isConnected && walletType === 'metamask' && isCorrectNetwork ? '0G' : 'Mock'}</span>
            </>
          )}
        </button>

        <button
          onClick={handleDownload}
          disabled={!uploadedFileHash || isDownloading || isUploading}
          className="action-btn secondary-btn"
        >
          {isDownloading ? (
            <>
              <span className="spinner"></span>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              <span>Retrieve Memory</span>
            </>
          )}
        </button>

        <button onClick={handleClear} disabled={isUploading || isDownloading} className="action-btn ghost-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          <span>Clear</span>
        </button>
      </div>

      {isUploading && (
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {uploadStatus || `${uploadProgress}% complete`}
          </span>
        </div>
      )}

      {uploadResult && (
        <div className="result-card success-card">
          <div className="result-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div className="result-content">
            <h4>
              {uploadResult.mock ? 'Memory Stored (Mock)' : 'Memory Stored on 0G!'}
              {uploadResult.encrypted && <span className="encrypted-badge">Encrypted</span>}
            </h4>
            
            {uploadResult.rootHash && (
              <div className="hash-display">
                <span className="hash-label">Root Hash:</span>
                <code className="hash-value">{uploadResult.rootHash?.slice(0, 20)}...{uploadResult.rootHash?.slice(-10)}</code>
              </div>
            )}
            
            {uploadResult.hash && !uploadResult.rootHash && (
              <div className="hash-display">
                <span className="hash-label">Transaction:</span>
                <code className="hash-value">{uploadResult.hash}</code>
              </div>
            )}
            
            {uploadResult.size && (
              <span className="result-meta">{uploadResult.size} bytes encrypted</span>
            )}
            
            {uploadResult.blockExplorerUrl && (
              <a 
                href={uploadResult.blockExplorerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="explorer-link"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                </svg>
                View on Block Explorer
              </a>
            )}
            
            {uploadResult.storageExplorerUrl && (
              <a 
                href={uploadResult.storageExplorerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="explorer-link storage-link"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
                </svg>
                View on Storage Explorer
              </a>
            )}
            
            {shareLink && (
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(shareLink)
                  toast?.success("Share link copied!")
                }}
                className="share-button"
                style={{ marginTop: '12px' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
                </svg>
                Copy Share Link
              </button>
            )}
          </div>
        </div>
      )}

      {downloadResult && (
        <div className="result-card info-card">
          <div className="result-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div className="result-content">
            <h4>Memory Retrieved {downloadResult.mock && '(Mock)'}</h4>
            <p className="retrieved-content">{downloadResult.content}</p>
            {downloadResult.timestamp && (
              <span className="result-meta">Stored: {new Date(downloadResult.timestamp).toLocaleString()}</span>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className={`result-card ${error.type === 'success' ? 'success-card' : 'error-card'}`}>
          <div className="result-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {error.type === 'success' ? (
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              ) : (
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              )}
            </svg>
          </div>
          <div className="result-content">
            <p>{error.message}</p>
          </div>
          <button onClick={() => setError(null)} className="dismiss-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
