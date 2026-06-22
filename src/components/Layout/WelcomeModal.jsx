import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { testimonials, useCases } from '../../utils/sampleData'

export const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTip, setCurrentTip] = useState(0)

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('soulchain_welcomed')
    if (!hasSeenWelcome) {
      setTimeout(() => setIsOpen(true), 1500)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('soulchain_welcomed', 'true')
  }

  const tips = [
    { icon: '📦', title: 'Store Memories', desc: 'Encrypted forever on 0G Network' },
    { icon: '🤖', title: 'Chat with Nova AI', desc: 'Real-time crypto & web data' },
    { icon: '🕜', title: 'Time Capsules', desc: 'Messages for your future self' },
    { icon: '👥', title: 'Legacy Planning', desc: 'Digital inheritance system' }
  ]

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isOpen, tips.length])

  if (!isOpen) return null

  return (
    <div className="welcome-modal-overlay" onClick={handleClose}>
      <div className="welcome-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div className="modal-header">
          <div className="modal-logo">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="url(#welcomeGrad)" strokeWidth="2"/>
              <path d="M20 8L12 20H28L20 8Z" fill="white"/>
              <path d="M20 32L12 20H28L20 32Z" fill="white" fillOpacity="0.7"/>
              <defs>
                <linearGradient id="welcomeGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="#00f5ff"/>
                  <stop offset="1" stopColor="#0066ff"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2>Welcome to SoulChain</h2>
          <p>Your memories deserve forever</p>
        </div>

        <div className="modal-features">
          <h3>What you can do:</h3>
          <div className="feature-tips">
            {tips.map((tip, i) => (
              <div 
                key={i} 
                className={`feature-tip ${i === currentTip ? 'active' : ''}`}
              >
                <span className="tip-icon">{tip.icon}</span>
                <div className="tip-content">
                  <span className="tip-title">{tip.title}</span>
                  <span className="tip-desc">{tip.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-demo">
          <h3>Demo Mode Active</h3>
          <p>Sample memories are pre-loaded for you to explore</p>
        </div>

        <div className="modal-actions">
          <Link to="/memory-vault" className="modal-btn primary" onClick={handleClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
            Start Storing
          </Link>
          <Link to="/dashboard" className="modal-btn secondary" onClick={handleClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            View Dashboard
          </Link>
        </div>

        <div className="modal-footer">
          <span>Built for 0G Arena Zero Cup 26</span>
          <a href="https://faucet.0g.ai" target="_blank" rel="noopener noreferrer" className="faucet-link">
            Get 0G Testnet Tokens →
          </a>
        </div>
      </div>
    </div>
  )
}

export default WelcomeModal
