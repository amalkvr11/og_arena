import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { MemoryUpload } from './components/MemoryUpload'
import { CompanionChat } from './components/CompanionChat'
import { ContractInteraction } from './components/contracts/ContractInteraction'
import { TimeCapsule } from './components/TimeCapsule'
import { LegacyBeneficiary } from './components/LegacyBeneficiary'
import { MemoryNFT } from './components/MemoryNFT'
import { MemoryAssistant } from './components/MemoryAssistant'
import { MediaUpload } from './components/MediaUpload'
import { MemoryCollections } from './components/MemoryCollections'
import { ParticleField, GlitchText, LiquidGradient } from './components/Effects'
import { Web3Provider } from './contexts/Web3Context'
import { ToastProvider } from './components/Layout/Toast'
import ErrorBoundary from './components/Layout/ErrorBoundary'
import { Dashboard } from './components/Dashboard'
import { PitchDeck } from './components/Pitch'
import { initializeSampleData } from './utils/sampleData'
import WelcomeModal from './components/Layout/WelcomeModal'
import { SocialProofSection } from './components/Layout/SocialProofSection'
import { Navigation } from './components/Layout/Navigation'
import { Footer } from './components/Layout/Footer'
import './App.css'

initializeSampleData()

function HomePage() {
  return (
    <main className="home-page">
      <section className="hero-section-full">
        <video className="hero-video-bg" autoPlay muted loop playsInline>
          <source src="/video_2ca20746-16f5-49cb-95f8-11b5f6474a6d.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay"></div>
        <ParticleField count={40} />
        <LiquidGradient />
        <div className="hero-bg-effects">
          <div className="hero-orb orb-1"></div>
          <div className="hero-orb orb-2"></div>
          <div className="hero-orb orb-3"></div>
          <div className="grid-bg"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </span>
            Built on 0G Network
          </div>
          
          <h1 className="hero-title">
            <span>Preserve Your</span>
            <GlitchText>
              <span className="gradient-text">Digital Legacy</span>
            </GlitchText>
            <span>Forever</span>
          </h1>
          
          <p className="hero-description">
            SoulChain combines blockchain immortality with AI companionship. 
            Store your most precious memories permanently on 0G's decentralized storage.
          </p>
          
          <div className="hero-cta">
            <Link to="/memory-vault" className="cta-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              Start Preserving
            </Link>
            <Link to="/ai-companion" className="cta-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Meet Your AI Companion
            </Link>
          </div>
          
          <div className="hero-stats-full">
            <div className="stat-box">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">256-bit</span>
                <span className="stat-desc">AES Encryption</span>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">0G</span>
                <span className="stat-desc">Decentralized Storage</span>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">Forever</span>
                <span className="stat-desc">Permanent Storage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-showcase">
        <div className="section-header">
          <h2>Advanced Features</h2>
          <p>Powerful tools to preserve your digital legacy</p>
        </div>
        
        <div className="features-grid-full">
          <div className="feature-card-full">
            <div className="feature-icon-large">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="24" cy="24" r="20"/>
                <path d="M24 10v4M24 34v4M10 24h4M34 24h4"/>
              </svg>
            </div>
            <h3>Time Capsule</h3>
            <p>Schedule memories to unlock at future dates. Perfect for birthdays and messages to your future self.</p>
            <Link to="/time-capsule" className="feature-link">
              Create Capsule
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          <div className="feature-card-full featured">
            <div className="feature-icon-large purple">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M24 10v28M10 24h28"/>
              </svg>
            </div>
            <h3>Legacy System</h3>
            <p>Designate beneficiaries to inherit your memories. Digital estate planning for your loved ones.</p>
            <Link to="/legacy-beneficiary" className="feature-link purple">
              Setup Legacy
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          <div className="feature-card-full">
            <div className="feature-icon-large green">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8l-9 12h7v8l9-12h-7z"/>
              </svg>
            </div>
            <h3>Memory NFTs</h3>
            <p>Mint your memories as NFTs. Monetize personal stories or create family heirlooms.</p>
            <Link to="/memory-nft" className="feature-link green">
              Mint NFT
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="more-features">
        <div className="section-header">
          <h2>More Features</h2>
        </div>
        <div className="mini-features-grid">
          <Link to="/media-upload" className="mini-feature">
            <span className="mini-icon">📷</span>
            <h4>Multi-Media</h4>
            <p>Store photos, audio, video</p>
          </Link>
          <Link to="/collections" className="mini-feature">
            <span className="mini-icon">📚</span>
            <h4>Collections</h4>
            <p>Organize into albums</p>
          </Link>
          <Link to="/memory-assistant" className="mini-feature">
            <span className="mini-icon">🔍</span>
            <h4>Memory AI</h4>
            <p>Semantic memory search</p>
          </Link>
          <Link to="/smart-contracts" className="mini-feature">
            <span className="mini-icon">📝</span>
            <h4>Smart Contracts</h4>
            <p>On-chain verification</p>
          </Link>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Preserve Your Legacy?</h2>
          <p>Start storing your memories on the blockchain today.</p>
          <Link to="/memory-vault" className="cta-button-large">
            Get Started Now
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      <SocialProofSection />

      <section className="faucet-section">
        <div className="faucet-content">
          <h3>🎮 Hackathon Judges</h3>
          <p>Get testnet tokens to try all features</p>
          <a href="https://faucet.0g.ai" target="_blank" rel="noopener noreferrer" className="faucet-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M2 12h20"/>
            </svg>
            0G Testnet Faucet
          </a>
        </div>
      </section>
    </main>
  )
}

function MemoryVaultPage() {
  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Memory Vault</h1>
        <p>Store your precious memories permanently on 0G's decentralized network</p>
      </div>
      <div className="page-content">
        <MemoryUpload />
      </div>
    </main>
  )
}

function AICompanionPage() {
  return (
    <main className="page-container">
      <div className="page-header">
        <h1>AI Companion</h1>
        <p>Your intelligent memory assistant with real-time web access</p>
      </div>
      <div className="page-content">
        <CompanionChat />
      </div>
    </main>
  )
}

function SmartContractsPage() {
  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Smart Contracts</h1>
        <p>Interact with SoulChain blockchain contracts on 0G network</p>
      </div>
      <div className="page-content">
        <ContractInteraction />
      </div>
    </main>
  )
}

function TimeCapsulePage() {
  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Memorial Time Capsule</h1>
        <p>Schedule memories to unlock at specific future dates</p>
      </div>
      <div className="page-content">
        <TimeCapsule />
      </div>
    </main>
  )
}

function LegacyPage() {
  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Legacy Beneficiary System</h1>
        <p>Designate who inherits your memories</p>
      </div>
      <div className="page-content">
        <LegacyBeneficiary />
      </div>
    </main>
  )
}

function NFTPage() {
  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Memory NFT Minting</h1>
        <p>Convert memories into tradeable NFTs</p>
      </div>
      <div className="page-content">
        <MemoryNFT />
      </div>
    </main>
  )
}

function MediaPage() {
  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Multi-Media Upload</h1>
        <p>Store photos, audio, and video memories</p>
      </div>
      <div className="page-content">
        <MediaUpload />
      </div>
    </main>
  )
}

function CollectionsPage() {
  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Memory Collections</h1>
        <p>Organize memories into themed albums</p>
      </div>
      <div className="page-content">
        <MemoryCollections />
      </div>
    </main>
  )
}

function MemoryAssistantPage() {
  return (
    <main className="page-container">
      <div className="page-header">
        <h1>AI Memory Assistant</h1>
        <p>Semantic search through your stored memories</p>
      </div>
      <div className="page-content">
        <MemoryAssistant />
      </div>
    </main>
  )
}

function DashboardPage() {
  return (
    <main className="page-container dashboard-page">
      <div className="page-content" style={{padding: 0, maxWidth: '100%'}}>
        <Dashboard />
      </div>
    </main>
  )
}

function PitchPage() {
  return (
    <main className="page-container pitch-page">
      <div className="page-content">
        <PitchDeck />
      </div>
    </main>
  )
}

function App() {
  return (
    <Web3Provider>
      <ToastProvider>
        <Router>
          <div className="App">
            <ErrorBoundary>
              <WelcomeModal />
              <Navigation />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/memory-vault" element={<MemoryVaultPage />} />
                <Route path="/ai-companion" element={<AICompanionPage />} />
                <Route path="/smart-contracts" element={<SmartContractsPage />} />
                <Route path="/time-capsule" element={<TimeCapsulePage />} />
                <Route path="/legacy-beneficiary" element={<LegacyPage />} />
                <Route path="/memory-nft" element={<NFTPage />} />
                <Route path="/memory-assistant" element={<MemoryAssistantPage />} />
                <Route path="/media-upload" element={<MediaPage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/pitch" element={<PitchPage />} />
              </Routes>
              <Footer />
            </ErrorBoundary>
          </div>
        </Router>
      </ToastProvider>
    </Web3Provider>
  )
}

export default App
