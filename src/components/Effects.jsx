import React, { useEffect, useRef, useState } from 'react'

export function ParticleField({ count = 50, className = '' }) {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resize()
    window.addEventListener('resize', resize)
    
    class Particle {
      constructor() {
        this.reset()
      }
      
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.2
        this.color = Math.random() > 0.5 ? '#0066ff' : '#00f5ff'
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
      }
      
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }
    
    for (let i = 0; i < count; i++) {
      particles.push(new Particle())
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })
      
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(0, 102, 255, ${0.1 * (1 - distance / 150)})`
            ctx.stroke()
          }
        })
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [count])
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`particle-field ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  )
}

export function GlitchText({ children, className = '' }) {
  const [glitch, setGlitch] = useState(false)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 150)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <span className={`glitch-text ${glitch ? 'glitching' : ''} ${className}`}>
      {children}
      {glitch && (
        <>
          <span className="glitch-text-before">{children}</span>
          <span className="glitch-text-after">{children}</span>
        </>
      )}
    </span>
  )
}

export function SuccessCelebration({ active, message = 'Success!', onComplete }) {
  const [particles, setParticles] = useState([])
  
  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: 50,
        y: 50,
        color: ['#0066ff', '#00f5ff', '#7c3aed', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)],
        size: Math.random() * 10 + 5,
        angle: (Math.PI * 2 * i) / 50,
        velocity: Math.random() * 100 + 50,
        rotation: Math.random() * 360,
        opacity: 1
      }))
      setParticles(newParticles)
      
      setTimeout(() => {
        setParticles([])
        if (onComplete) onComplete()
      }, 1500)
    }
  }, [active, onComplete])
  
  if (!active && particles.length === 0) return null
  
  return (
    <div className="success-celebration">
      {active && (
        <div className="success-content">
          <div className="success-checkmark">
            <svg viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path fill="none" stroke="currentColor" strokeWidth="3" d="M14 27l7 7 16-16"/>
            </svg>
          </div>
          <p className="success-message">{message}</p>
        </div>
      )}
      <div className="confetti-container">
        {particles.map(p => (
          <div
            key={p.id}
            className="confetti-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              transform: `rotate(${p.rotation}deg) translate(${Math.cos(p.angle) * p.velocity}px, ${Math.sin(p.angle) * p.velocity}px)`,
              opacity: p.opacity
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function EncryptionAnimation({ progress, isEncrypting }) {
  return (
    <div className={`encryption-animation ${isEncrypting ? 'active' : ''}`}>
      <div className="encryption-lock">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d={isEncrypting ? "M7 11V7a5 5 0 019.9-1" : "M7 11V7a5 5 0 0110 0v4"}/>
        </svg>
        {isEncrypting && (
          <div className="lock-spinner">
            <div className="spinner-ring"></div>
          </div>
        )}
      </div>
      <div className="binary-stream">
        {isEncrypting && Array.from({ length: 20 }, (_, i) => (
          <span 
            key={i} 
            className="binary-digit"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {Math.random() > 0.5 ? '0' : '1'}
          </span>
        ))}
      </div>
      <div className="progress-bar-encrypted">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        <span className="progress-text">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

export function FlipDigit({ value }) {
  const [currentValue, setCurrentValue] = useState(value)
  const [flipping, setFlipping] = useState(false)
  
  useEffect(() => {
    if (value !== currentValue) {
      setFlipping(true)
      setTimeout(() => {
        setCurrentValue(value)
        setTimeout(() => setFlipping(false), 150)
      }, 150)
    }
  }, [value, currentValue])
  
  return (
    <div className={`flip-digit ${flipping ? 'flipping' : ''}`}>
      <div className="digit-top">{currentValue}</div>
      <div className="digit-bottom">{currentValue}</div>
      {flipping && <div className="digit-flip">{value}</div>}
    </div>
  )
}

export function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }
    
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate])
  
  return (
    <div className="countdown-timer">
      <div className="countdown-unit">
        <FlipDigit value={Math.floor(timeLeft.days / 10)} />
        <FlipDigit value={timeLeft.days % 10} />
        <span className="unit-label">Days</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-unit">
        <FlipDigit value={Math.floor(timeLeft.hours / 10)} />
        <FlipDigit value={timeLeft.hours % 10} />
        <span className="unit-label">Hours</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-unit">
        <FlipDigit value={Math.floor(timeLeft.minutes / 10)} />
        <FlipDigit value={timeLeft.minutes % 10} />
        <span className="unit-label">Mins</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-unit">
        <FlipDigit value={Math.floor(timeLeft.seconds / 10)} />
        <FlipDigit value={timeLeft.seconds % 10} />
        <span className="unit-label">Secs</span>
      </div>
    </div>
  )
}

export function TypewriterEffect({ text, speed = 50, onComplete }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])
  
  return (
    <span className="typewriter">
      {displayedText}
      {currentIndex < text.length && <span className="cursor">|</span>}
    </span>
  )
}

export function FloatingCard({ children, className = '' }) {
  const cardRef = useRef(null)
  const [transform, setTransform] = useState('')
  
  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 20
      const rotateY = (centerX - x) / 20
      
      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
    }
    
    const handleMouseLeave = () => {
      setTransform('')
    }
    
    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])
  
  return (
    <div 
      ref={cardRef} 
      className={`floating-card ${className}`}
      style={{ transform }}
    >
      {children}
    </div>
  )
}

export function PulseGlow({ children, color = '#0066ff', className = '' }) {
  return (
    <div 
      className={`pulse-glow ${className}`}
      style={{ '--glow-color': color }}
    >
      {children}
      <div className="glow-ring" style={{ borderColor: color }}></div>
    </div>
  )
}

export function LiquidGradient({ className = '' }) {
  return (
    <div className={`liquid-gradient ${className}`}>
      <div className="liquid-blob blob-1"></div>
      <div className="liquid-blob blob-2"></div>
      <div className="liquid-blob blob-3"></div>
    </div>
  )
}

export function HashDisplay({ hash, label = 'Transaction Hash' }) {
  const [copied, setCopied] = useState(false)
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="hash-display">
      <span className="hash-label">{label}</span>
      <div className="hash-value" onClick={copyToClipboard}>
        <code>{hash.slice(0, 10)}...{hash.slice(-8)}</code>
        {copied ? <span className="copy-feedback">Copied!</span> : null}
      </div>
    </div>
  )
}

export function NFTMintAnimation({ isMinting, isComplete }) {
  return (
    <div className={`nft-mint-animation ${isMinting ? 'minting' : ''} ${isComplete ? 'complete' : ''}`}>
      <div className="diamond-container">
        <div className="diamond">
          <div className="diamond-face front"></div>
          <div className="diamond-face back"></div>
          <div className="diamond-face left"></div>
          <div className="diamond-face right"></div>
          <div className="diamond-face top"></div>
          <div className="diamond-face bottom"></div>
        </div>
      </div>
      {isMinting && (
        <div className="blockchain-blocks">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="block" style={{ animationDelay: `${i * 0.2}s` }}>
              <span className="block-hash">0x{Math.random().toString(16).slice(2, 8)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
