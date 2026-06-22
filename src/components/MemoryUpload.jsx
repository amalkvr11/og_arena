import React, { useState } from "react";
import { uploadTo0GStorage, downloadFrom0GStorage } from "./0gStorage";

export const MemoryUpload = () => {
  const [memory, setMemory] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState(null)
  const [downloadResult, setDownloadResult] = useState(null)
  const [error, setError] = useState(null)
  const [uploadedFileHash, setUploadedFileHash] = useState("")
  const [encryptionKey, setEncryptionKey] = useState(null)
  const [iv, setIv] = useState(null)
  const [contractAddress, setContractAddress] = useState("")
  const [isContractInteracting, setIsContractInteracting] = useState(false)

  const handleUpload = async () => {
    if (!memory.trim()) {
      setError({ type: 'error', message: 'Please enter your memory content' })
      return
    }
    setIsUploading(true)
    setError(null)
    setUploadProgress(0)
    setUploadResult(null)
    
    try {
      const key = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      )
      const exportedKey = await window.crypto.subtle.exportKey("raw", key)
      setEncryptionKey(Array.from(new Uint8Array(exportedKey)))

      const ivArray = new Uint8Array(12)
      window.crypto.getRandomValues(ivArray)
      setIv(Array.from(ivArray))

      const encoded = new TextEncoder().encode(memory)
      setUploadProgress(25)
      
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: ivArray },
        key,
        encoded
      )
      setUploadProgress(50)
      
      const encryptedArray = Array.from(new Uint8Array(encryptedBuffer))
      const result = await uploadTo0GStorage(encryptedArray)
      setUploadProgress(100)
      
      setUploadResult(result)
      setUploadedFileHash(result.hash)
      
      localStorage.setItem("lastMemoryHash", result.hash)
    } catch (err) {
      setError({ type: 'error', message: `Upload failed: ${err.message}` })
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
    setDownloadProgress(0)
    setDownloadResult(null)
    
    try {
      setDownloadProgress(25)
      const result = await downloadFrom0GStorage(uploadedFileHash)
      setDownloadProgress(50)
      setDownloadResult(result)
      setDownloadProgress(75)
      
      if (encryptionKey && iv) {
        const encryptedBuffer = Uint8Array.from(result.content)
        const decryptedBuffer = await window.crypto.subtle.decrypt(
          { name: "AES-GCM", iv: Uint8Array.from(iv) },
          await window.crypto.subtle.importKey(
            "raw",
            Uint8Array.from(encryptionKey),
            { name: "AES-GCM" },
            false,
            ["decrypt"]
          ),
          encryptedBuffer
        )
        const decryptedText = new TextDecoder().decode(decryptedBuffer)
        setDownloadResult({ ...result, content: decryptedText })
      }
      setDownloadProgress(100)
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
    setEncryptionKey(null)
    setIv(null)
    setUploadProgress(0)
    setDownloadProgress(0)
  }

  return (
    <div className="memory-upload">
      <div className="upload-header">
        <div className="char-counter">
          <span className="char-count">{memory.length}</span>
          <span className="char-label">characters</span>
        </div>
        <div className="encryption-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span>256-bit AES</span>
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
          disabled={isUploading || !memory.trim() || isDownloading}
          className="action-btn primary-btn"
        >
          {isUploading ? (
            <>
              <span className="spinner"></span>
              <span>Encrypting...</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              <span>Upload to 0G</span>
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
              <span>Decrypting...</span>
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

      {(isUploading || isDownloading) && (
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${isUploading ? uploadProgress : downloadProgress}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {isUploading ? uploadProgress : downloadProgress}% complete
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
            <h4>Memory Stored Successfully</h4>
            {uploadResult.hash && (
              <div className="hash-display">
                <span className="hash-label">Transaction Hash:</span>
                <code className="hash-value">{uploadResult.hash}</code>
              </div>
            )}
            {uploadResult.size && (
              <span className="result-meta">{uploadResult.size} bytes encrypted</span>
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
            <h4>Memory Retrieved</h4>
            <p className="retrieved-content">{downloadResult.content}</p>
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

      <div className="contract-section">
        <div className="contract-header">
          <h4>Smart Contract Integration</h4>
          <span className="contract-badge">Optional</span>
        </div>
        <div className="contract-input-group">
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="Enter SoulChain contract address (0x...)"
            disabled={isUploading || isDownloading}
          />
          <button
            disabled={!uploadedFileHash || !contractAddress || isUploading || isDownloading || isContractInteracting}
            className="action-btn primary-btn small"
          >
            {isContractInteracting ? (
              <span className="spinner small"></span>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            )}
            <span>Activate on Chain</span>
          </button>
        </div>
      </div>
    </div>
  )
}
