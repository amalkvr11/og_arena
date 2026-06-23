import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { NavItem, DropdownNavItem } from '../../types'

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/memory-vault', label: 'Memory Vault', icon: 'vault' },
  { path: '/ai-companion', label: 'AI Companion', icon: 'ai' },
  { path: '/smart-contracts', label: 'Smart Contracts', icon: 'contract' }
]

const dropdownItems: DropdownNavItem[] = [
  { path: '/time-capsule', label: 'Time Capsule', icon: 'capsule', desc: 'Schedule memory unlocks' },
  { path: '/legacy-beneficiary', label: 'Legacy System', icon: 'legacy', desc: 'Digital inheritance' },
  { path: '/memory-nft', label: 'Memory NFTs', icon: 'nft', desc: 'Mint memories as NFTs' },
  { path: '/memory-assistant', label: 'Memory AI', icon: 'assistant', desc: 'Semantic memory search' },
  { path: '/media-upload', label: 'Multi-Media', icon: 'media', desc: 'Photos, audio, video' },
  { path: '/collections', label: 'Collections', icon: 'collections', desc: 'Organize into albums' },
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard', desc: 'Analytics & stats' },
  { path: '/pitch', label: 'Investor Pitch', icon: 'pitch', desc: 'Business overview' }
]

const getNavIcon = (icon: string): React.ReactElement => {
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

const getMainNavIcon = (icon: string): React.ReactElement => {
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

const LogoIcon: React.FC = () => (
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
)

export const Navigation: React.FC = () => {
  const location = useLocation()

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo-section">
          <div className="logo-icon">
            <LogoIcon />
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
              <span className="nav-icon">{getMainNavIcon(item.icon)}</span>
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

export default Navigation
