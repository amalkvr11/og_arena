import React, { useState } from 'react'
import { pitchContent, useCases, testimonials } from '../../utils/sampleData'

export const PitchDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    { id: 'intro', title: 'SoulChain', subtitle: 'Your Memories. Forever.' },
    { id: 'problem', title: pitchContent.problem.title },
    { id: 'solution', title: pitchContent.solution.title },
    { id: 'market', title: pitchContent.market.title },
    { id: 'business', title: pitchContent.businessModel.title },
    { id: 'roadmap', title: 'Roadmap' },
    { id: 'team', title: 'Team' },
    { id: 'ask', title: 'The Ask' }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const renderSlideContent = () => {
    switch (slides[currentSlide].id) {
      case 'intro':
        return (
          <div className="pitch-slide intro-slide">
            <div className="intro-logo">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="url(#pitchGrad)" strokeWidth="2"/>
                <path d="M20 8L12 20H28L20 8Z" fill="white"/>
                <path d="M20 32L12 20H28L20 32Z" fill="white" fillOpacity="0.7"/>
                <defs>
                  <linearGradient id="pitchGrad" x1="0" y1="0" x2="40" y2="40">
                    <stop stopColor="#00f5ff"/>
                    <stop offset="1" stopColor="#0066ff"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1>{slides[currentSlide].title}</h1>
            <p className="tagline">{slides[currentSlide].subtitle}</p>
            <p className="subtitle">AI-Powered Digital Legacy Platform on 0G Network</p>
            <div className="built-for">
              <span>Built for</span>
              <span className="og-badge">0G Arena Zero Cup 26</span>
            </div>
          </div>
        )

      case 'problem':
        return (
          <div className="pitch-slide problem-slide">
            <h2>{pitchContent.problem.title}</h2>
            <p className="problem-description">{pitchContent.problem.description}</p>
            <div className="stats-row">
              {pitchContent.problem.statistics.map((stat, i) => (
                <div key={i} className="problem-stat">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
            <div className="pain-points">
              <div className="pain-point">
                <span className="pain-icon">🗑️</span>
                <span>Cloud accounts get deleted after inactivity</span>
              </div>
              <div className="pain-point">
                <span className="pain-icon">💾</span>
                <span>Hard drives fail, devices get lost</span>
              </div>
              <div className="pain-point">
                <span className="pain-icon">🔒</span>
                <span>Privacy breaches expose personal data</span>
              </div>
              <div className="pain-point">
                <span className="pain-icon">💔</span>
                <span>Digital inheritance is confusing or nonexistent</span>
              </div>
            </div>
          </div>
        )

      case 'solution':
        return (
          <div className="pitch-slide solution-slide">
            <h2>{pitchContent.solution.title}</h2>
            <p className="solution-desc">{pitchContent.solution.description}</p>
            <div className="features-grid">
              {pitchContent.solution.features.map((feature, i) => (
                <div key={i} className="feature-item">
                  <span className="feature-number">{i + 1}</span>
                  <span className="feature-text">{feature}</span>
                </div>
              ))}
            </div>
            <div className="how-it-works">
              <h3>How It Works</h3>
              <div className="steps">
                <div className="step">Write</div>
                <div className="arrow">→</div>
                <div className="step">Encrypt</div>
                <div className="arrow">→</div>
                <div className="step">0G Store</div>
                <div className="arrow">→</div>
                <div className="step">Forever</div>
              </div>
            </div>
          </div>
        )

      case 'market':
        return (
          <div className="pitch-slide market-slide">
            <h2>Market Opportunity</h2>
            <div className="market-tam">
              <div className="market-card tam">
                <span className="market-label">TAM</span>
                <span className="market-value">{pitchContent.market.tam}</span>
                <span className="market-desc">Total Addressable</span>
              </div>
              <div className="market-card sam">
                <span className="market-label">SAM</span>
                <span className="market-value">{pitchContent.market.sam}</span>
                <span className="market-desc">Serviceable Addressable</span>
              </div>
              <div className="market-card som">
                <span className="market-label">SOM</span>
                <span className="market-value">{pitchContent.market.som}</span>
                <span className="market-desc">Serviceable Obtainable</span>
              </div>
            </div>
            <div className="growth-badge">
              {pitchContent.market.growth} Annual Growth
            </div>
            <div className="use-cases-grid">
              {useCases.slice(0, 4).map((uc, i) => (
                <div key={i} className="use-case-card">
                  <span className="use-case-icon">{uc.icon}</span>
                  <span className="use-case-title">{uc.title}</span>
                  <span className="use-case-stat">{uc.stats}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 'business':
        return (
          <div className="pitch-slide business-slide">
            <h2>{pitchContent.businessModel.title}</h2>
            <div className="pricing-grid">
              {pitchContent.businessModel.tiers.map((tier, i) => (
                <div key={i} className={`pricing-card ${tier.name.toLowerCase()}`}>
                  <h3>{tier.name}</h3>
                  <div className="price">{tier.price}</div>
                  <ul className="features-list">
                    {tier.features.map((f, j) => (
                      <li key={j}>✓ {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="revenue-model">
              <h4>Revenue Streams</h4>
              <div className="revenue-items">
                <div className="revenue-item">Subscription Revenue</div>
                <div className="revenue-item">Transaction Fees</div>
                <div className="revenue-item">Enterprise Licensing</div>
              </div>
            </div>
          </div>
        )

      case 'roadmap':
        return (
          <div className="pitch-slide roadmap-slide">
            <h2>Roadmap</h2>
            <div className="timeline">
              {pitchContent.roadmap.map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-marker">{i + 1}</div>
                  <div className="timeline-content">
                    <span className="timeline-date">{item.quarter}</span>
                    <span className="timeline-milestone">{item.milestone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'team':
        return (
          <div className="pitch-slide team-slide">
            <h2>Why Us?</h2>
            <div className="team-stats">
              <div className="team-stat">
                <span className="team-value">10+</span>
                <span className="team-label">Years Combined Experience</span>
              </div>
              <div className="team-stat">
                <span className="team-value">3</span>
                <span className="team-label">Full Stack Developers</span>
              </div>
              <div className="team-stat">
                <span className="team-value">Deep</span>
                <span className="team-label">Blockchain Expertise</span>
              </div>
            </div>
            <div className="testimonials">
              <h3>What Users Say</h3>
              {testimonials.slice(0, 2).map((t, i) => (
                <div key={i} className="testimonial">
                  <p>"{t.quote}"</p>
                  <div className="testimonial-author">
                    <span className="author-avatar">{t.avatar}</span>
                    <span className="author-info">
                      <span className="author-name">{t.author}</span>
                      <span className="author-role">{t.role}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'ask':
        return (
          <div className="pitch-slide ask-slide">
            <h2>The Ask</h2>
            <div className="ask-content">
              <div className="ask-item">
                <span className="ask-label">Recognition</span>
                <span className="ask-desc">Help us showcase at 0G Arena</span>
              </div>
              <div className="ask-item">
                <span className="ask-label">Feedback</span>
                <span className="ask-desc">Your insights help us improve</span>
              </div>
              <div className="ask-item">
                <span className="ask-label">Users</span>
                <span className="ask-desc">Try SoulChain and spread the word</span>
              </div>
            </div>
            <div className="cta-section">
              <h3>Thank You</h3>
              <p>Questions? Let's discuss!</p>
              <div className="contact-links">
                <span>📧 team@soulchain.io</span>
                <span>🔗 github.com/soulchain</span>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="pitch-deck">
      <div className="pitch-container">
        <div className="slide-content">
          {renderSlideContent()}
        </div>

        <div className="pitch-controls">
          <button onClick={prevSlide} className="pitch-nav-btn" aria-label="Previous slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div className="slide-indicators">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`indicator ${i === currentSlide ? 'active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button onClick={nextSlide} className="pitch-nav-btn" aria-label="Next slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <div className="slide-counter">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  )
}

export default PitchDeck
