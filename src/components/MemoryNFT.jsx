import React, { useState } from 'react'

export const MemoryNFT = () => {
  const [memory, setMemory] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [nftSettings, setNftSettings] = useState({
    royaltyPercentage: 5,
    maxSupply: 1,
    price: '',
    isPrivate: true,
    allowSecondarySales: true,
    category: 'personal'
  })
  const [isMinting, setIsMinting] = useState(false)
  const [mintedNFTs, setMintedNFTs] = useState([])
  const [error, setError] = useState(null)

  const categories = [
    { value: 'personal', label: 'Personal Story', icon: '📖' },
    { value: 'milestone', label: 'Life Milestone', icon: '🎯' },
    { value: 'advice', label: 'Wisdom/Lessons', icon: '💡' },
    { value: 'creative', label: 'Creative Work', icon: '🎨' },
    { value: 'relationship', label: 'Relationship', icon: '💕' },
    { value: 'achievement', label: 'Achievement', icon: '🏆' }
  ]

  const handleMintNFT = async () => {
    if (!memory.trim() || !title.trim()) {
      setError("Please fill in all required fields")
      return
    }

    setIsMinting(true)
    setError(null)

    await new Promise(resolve => setTimeout(resolve, 2000))

    const newNFT = {
      id: Date.now(),
      title,
      description,
      memory,
      category: nftSettings.category,
      royaltyPercentage: nftSettings.royaltyPercentage,
      maxSupply: nftSettings.maxSupply,
      price: nftSettings.price || 'Not for sale',
      isPrivate: nftSettings.isPrivate,
      allowSecondarySales: nftSettings.allowSecondarySales,
      tokenId: Math.floor(Math.random() * 10000),
      contractAddress: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      mintedAt: new Date().toISOString(),
      owner: 'Your Wallet',
      status: 'minted'
    }

    setMintedNFTs(prev => [...prev, newNFT])
    setMemory("")
    setTitle("")
    setDescription("")
    setIsMinting(false)
  }

  const getCategoryIcon = (cat) => {
    return categories.find(c => c.value === cat)?.icon || '📦'
  }

  const getCategoryLabel = (cat) => {
    return categories.find(c => c.value === cat)?.label || 'Memory'
  }

  return (
    <div className="memory-nft">
      <div className="feature-intro">
        <div className="intro-icon nft">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            <polyline points="7.5,4.21 12,6.81 16.5,4.21"/>
            <polyline points="7.5,19.79 7.5,14.6 3,12"/>
            <polyline points="21,12 16.5,14.6 16.5,19.79"/>
            <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <div className="intro-content">
          <h3>Memory NFT Minting</h3>
          <p>Convert your cherished memories into tradeable NFTs. Preserve your story on-chain and optionally monetize your personal experiences.</p>
        </div>
      </div>

      <div className="nft-form">
        <div className="form-section">
          <label>NFT Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., My First Day at College"
            disabled={isMinting}
          />
        </div>

        <div className="form-section">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the significance of this memory..."
            disabled={isMinting}
            rows={3}
          />
        </div>

        <div className="form-section">
          <label>Memory Content *</label>
          <textarea
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            placeholder="Write your memory here. This will be stored on 0G and made accessible only to NFT holders..."
            disabled={isMinting}
            rows={6}
          />
          <span className="char-count">{memory.length} characters</span>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label>Category</label>
            <select
              value={nftSettings.category}
              onChange={(e) => setNftSettings(prev => ({ ...prev, category: e.target.value }))}
              disabled={isMinting}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
              ))}
            </select>
          </div>
          <div className="form-section">
            <label>Royalty (%)</label>
            <input
              type="number"
              value={nftSettings.royaltyPercentage}
              onChange={(e) => setNftSettings(prev => ({ ...prev, royaltyPercentage: parseInt(e.target.value) || 0 }))}
              min="0"
              max="50"
              disabled={isMinting}
            />
            <span className="form-hint">You earn this % on secondary sales</span>
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label>Price (ETH)</label>
            <input
              type="text"
              value={nftSettings.price}
              onChange={(e) => setNftSettings(prev => ({ ...prev, price: e.target.value }))}
              placeholder="Leave empty for not-for-sale"
              disabled={isMinting}
            />
          </div>
          <div className="form-section">
            <label>Max Supply</label>
            <input
              type="number"
              value={nftSettings.maxSupply}
              onChange={(e) => setNftSettings(prev => ({ ...prev, maxSupply: parseInt(e.target.value) || 1 }))}
              min="1"
              max="10000"
              disabled={isMinting}
            />
            <span className="form-hint">1 = unique NFT</span>
          </div>
        </div>

        <div className="advanced-settings">
          <h4>Access Settings</h4>
          <div className="setting-item">
            <label className="switch-label">
              <span className="switch">
                <input
                  type="checkbox"
                  checked={nftSettings.isPrivate}
                  onChange={(e) => setNftSettings(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  disabled={isMinting}
                />
                <span className="slider"></span>
              </span>
              <span className="label-text">
                <strong>Private Viewing</strong>
                <span>Only NFT holders can view content</span>
              </span>
            </label>
          </div>
          <div className="setting-item">
            <label className="switch-label">
              <span className="switch">
                <input
                  type="checkbox"
                  checked={nftSettings.allowSecondarySales}
                  onChange={(e) => setNftSettings(prev => ({ ...prev, allowSecondarySales: e.target.checked }))}
                  disabled={isMinting}
                />
                <span className="slider"></span>
              </span>
              <span className="label-text">
                <strong>Allow Secondary Sales</strong>
                <span>Enable trading on marketplaces</span>
              </span>
            </label>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4m0 4h.01"/>
            </svg>
            {error}
          </div>
        )}

        <button
          onClick={handleMintNFT}
          disabled={isMinting || !title.trim() || !memory.trim()}
          className="mint-btn"
        >
          {isMinting ? (
            <>
              <span className="spinner"></span>
              <span>Minting NFT...</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              </svg>
              <span>Mint Memory NFT</span>
            </>
          )}
        </button>
      </div>

      {mintedNFTs.length > 0 && (
        <div className="nft-gallery">
          <h4>Your Minted NFTs</h4>
          <div className="nft-grid">
            {mintedNFTs.map(nft => (
              <div key={nft.id} className="nft-card">
                <div className="nft-image">
                  <div className="nft-placeholder">
                    <span>{getCategoryIcon(nft.category)}</span>
                  </div>
                  <div className="nft-badge">{getCategoryLabel(nft.category)}</div>
                </div>
                <div className="nft-info">
                  <h5>{nft.title}</h5>
                  <p className="nft-description">{nft.description || 'No description'}</p>
                  <div className="nft-meta">
                    <div className="meta-item">
                      <span className="meta-label">Token ID</span>
                      <span className="meta-value">#{nft.tokenId}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Royalty</span>
                      <span className="meta-value">{nft.royaltyPercentage}%</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Price</span>
                      <span className="meta-value">{nft.price}</span>
                    </div>
                  </div>
                  <div className="nft-access">
                    {nft.isPrivate ? (
                      <span className="access-private">🔒 Private</span>
                    ) : (
                      <span className="access-public">🌍 Public</span>
                    )}
                  </div>
                  <div className="nft-hash">
                    <code>{nft.txHash.substring(0, 16)}...</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="use-cases">
        <h4>Use Cases for Memory NFTs</h4>
        <div className="use-cases-grid">
          <div className="use-case">
            <span className="use-case-icon">✨</span>
            <div className="use-case-content">
              <h5>Personal Collectibles</h5>
              <p>Turn life moments into unique digital collectibles</p>
            </div>
          </div>
          <div className="use-case">
            <span className="use-case-icon">👱</span>
            <div className="use-case-content">
              <h5>Influencer Content</h5>
              <p>Sell exclusive personal stories to fans</p>
            </div>
          </div>
          <div className="use-case">
            <span className="use-case-icon">👨‍👩‍👧</span>
            <div className="use-case-content">
              <h5>Family Heirlooms</h5>
              <p>Pass stories through generations digitally</p>
            </div>
          </div>
          <div className="use-case">
            <span className="use-case-icon">📝</span>
            <div className="use-case-content">
              <h5>Creator Monetization</h5>
              <p>Monetize your life experiences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
