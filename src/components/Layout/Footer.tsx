import React from 'react'

const FooterLogo: React.FC = () => (
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
)

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <FooterLogo />
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

export default Footer
