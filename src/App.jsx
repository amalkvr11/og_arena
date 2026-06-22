import React from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import { MemoryUpload } from "./components/MemoryUpload"
import { CompanionChat } from "./components/CompanionChat"
import { ContractInteraction } from "./components/contracts/ContractInteraction"
import { TimeCapsule } from "./components/TimeCapsule"
import { LegacyBeneficiary } from "./components/LegacyBeneficiary"
import { MemoryNFT } from "./components/MemoryNFT"
import { MemoryAssistant } from "./components/MemoryAssistant"
import { MediaUpload } from "./components/MediaUpload"
import { MemoryCollections } from "./components/MemoryCollections"
import { ParticleField, GlitchText, LiquidGradient } from "./components/Effects"
import { Web3Provider } from "./contexts/Web3Context"
import ErrorBoundary from "./components/Layout/ErrorBoundary"
import { Dashboard } from "./components/Dashboard"
import { PitchDeck } from "./components/Pitch"
import { initializeSampleData } from "./utils/sampleData"
import { getNetworkStatus } from "./utils/storageMetrics"
import WelcomeModal from "./components/Layout/WelcomeModal"
import { SocialProofSection } from "./components/Layout/SocialProofSection"
import "./App.css"

initializeSampleData()

function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { path: "/", label: "Home", icon: "home" },
    { path: "/memory-vault", label: "Memory Vault", icon: "vault" },
    { path: "/ai-companion", label: "AI Companion", icon: "ai" },
    { path: "/smart-contracts", label: "Smart Contracts", icon: "contract" }
  ]

  const dropdownItems = [
    { path: "/time-capsule", label: "Time Capsule", icon: "capsule", desc: "Schedule memory unlocks" },
    { path: "/legacy-beneficiary", label: "Legacy System", icon: "legacy", desc: "Digital inheritance" },
    { path: "/memory-nft", label: "Memory NFTs", icon: "nft", desc: "Mint memories as NFTs" },
    { path: "/memory-assistant", label: "Memory AI", icon: "assistant", desc: "Semantic memory search" },
    { path: "/media-upload", label: "Multi-Media", icon: "media", desc: "Photos, audio, video" },
    { path: "/collections", label: "Collections", icon: "collections", desc: "Organize into albums" },
    { path: "/dashboard", label: "Dashboard", icon: "dashboard", desc: "Analytics & stats" },
    { path: "/pitch", label: "Investor Pitch", icon: "pitch", desc: "Business overview" }
  ]

  const getIcon = (icon) => {
    switch(icon) {
      case 'home':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      case 'vault':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
      case 'ai':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      case 'contract':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      default:
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
        </svg>
    }
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo-section">
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="url(#navGradient)" strokeWidth="2"/>
              <path d="M20 8L12 20H28L20 8Z" fill="white"/>
              <path d="M20 32L12 20H28L20 32Z" fill="white" fillOpacity="0.7"/>
              <defs>
                <linearGradient id="navGradient" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="#00f5ff"/>
                  <stop offset="1" stopColor="#0066ff"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="logo-text">
            <h1>SoulChain</h1>
          </div>
        </Link>
        
        <nav className="main-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{getIcon(item.icon)}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
          
          <div className="nav-dropdown">
            <button className="nav-item dropdown-trigger">
              <span className="nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </span>
              <span className="nav-label">More</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-arrow">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            <div className="dropdown-content">
              {dropdownItems.map((item) => (
                <Link key={item.path} to={item.path} className="dropdown-item">
                  <span className="dropdown-icon">{getNavIcon(item.icon)}</span>
                  <div className="dropdown-text">
                    <span className="dropdown-label">{item.label}</span>
                    <span className="dropdown-desc">{item.desc}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="header-badge">
          <span className="badge-pulse"></span>
          <span>0G Arena</span>
        </div>
      </div>
    </header>
  )
}

function getNavIcon(icon) {
  switch(icon) {
    case 'capsule':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    case 'legacy':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    case 'nft':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
    case 'assistant':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
    case 'media':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
    case 'collections':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
    case 'dashboard':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    case 'pitch':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
    default:
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
  }
}

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
    <main className="page-container">
      <div className="page-content">
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

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="url(#footerGrad)" strokeWidth="1.5"/>
              <path d="M16 6L10 16H22L16 6Z" fill="currentColor"/>
              <path d="M16 26L10 16H22L16 26Z" fill="currentColor" fillOpacity="0.6"/>
              <defs>
                <linearGradient id="footerGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#00f5ff"/>
                  <stop offset="1" stopColor="#0066ff"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span>SoulChain</span>
        </div>
        <div className="footer-links">
          <a href="https://0g.ai" target="_blank" rel="noopener noreferrer">0G Labs</a>
          <span className="link-dot"></span>
          <a href="https://github.com/0glabs" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span className="link-dot"></span>
          <a href="#" target="_blank" rel="noopener noreferrer">Documentation</a>
        </div>
        <p className="footer-copyright">
          Built for 0G Arena Zero Cup 26
        </p>
      </div>
    </footer>
  )
}

function App() {
  return (
    <Web3Provider>
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
    </Web3Provider>
  )
}

export default App
