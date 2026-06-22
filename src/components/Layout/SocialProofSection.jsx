import React from 'react'
import { testimonials, useCases } from '../../utils/sampleData'

export const SocialProofSection = () => {
  return (
    <section className="social-proof-section">
      <div className="section-header">
        <h2>Why People Love SoulChain</h2>
        <p>Trusted by families, creators, and institutions</p>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial-card">
            <div className="quote-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>
            <p className="testimonial-quote">"{t.quote}"</p>
            <div className="testimonial-author-info">
              <div className="author-avatar-large">{t.avatar}</div>
              <div className="author-details">
                <span className="author-name">{t.author}</span>
                <span className="author-role">{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="use-cases-section">
        <h3>Who Uses SoulChain</h3>
        <div className="use-cases-grid-large">
          {useCases.map((uc, i) => (
            <div key={i} className="use-case-large">
              <span className="use-case-icon-large">{uc.icon}</span>
              <div className="use-case-info">
                <h4>{uc.title}</h4>
                <p>{uc.description}</p>
                <span className="use-case-stats">{uc.stats}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SocialProofSection
