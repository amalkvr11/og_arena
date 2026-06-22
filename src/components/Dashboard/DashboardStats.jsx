import React from 'react'

export const StatsCard = ({ icon, value, label, trend, trendDirection, index = 0 }) => {
  return (
    <div 
      className="stat-card"
      style={{ '--delay': `${index * 0.1}s` }}
    >
      <div className="stat-card-icon">
        {typeof icon === 'string' ? (
          <span className="stat-emoji">{icon}</span>
        ) : (
          icon
        )}
      </div>
      <div className="stat-card-content">
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
        {trend && (
          <div className={`stat-card-trend ${trendDirection}`}>
            {trendDirection === 'up' ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
    </div>
  )
}

export const ActivityItem = ({ type, title, timestamp, hash, status }) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'upload':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
        )
      case 'download':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
        )
      case 'capsule':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        )
      case 'beneficiary':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        )
      case 'contract':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        )
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        )
    }
  }

  return (
    <div className="activity-item">
      <div className={`activity-icon activity-${type}`}>
        {getTypeIcon()}
      </div>
      <div className="activity-content">
        <div className="activity-title">{title}</div>
        <div className="activity-meta">
          <span className="activity-time">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {hash && (
            <span className="activity-hash">
              {hash.slice(0, 8)}...{hash.slice(-6)}
            </span>
          )}
        </div>
      </div>
      {status && (
        <div className={`activity-status status-${status}`}>
          {status}
        </div>
      )}
    </div>
  )
}

export const ProgressBar = ({ progress, label, showPercentage = true, color = 'default' }) => {
  return (
    <div className="progress-container">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-track">
        <div 
          className={`progress-bar-fill progress-color-${color}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="progress-percentage">{Math.round(progress)}%</div>
      )}
    </div>
  )
}

export const NetworkIndicator = ({ status, peers, blockHeight, latency }) => {
  return (
    <div className="network-indicator">
      <div className={`network-status-dot status-${status}`} />
      <div className="network-info">
        <span className="network-label">0G Network</span>
        <span className="network-detail">
          {blockHeight && `Block #${blockHeight.toLocaleString()}`}
          {latency && ` • ${latency}ms`}
        </span>
      </div>
    </div>
  )
}

export const AnimatedCounter = ({ value, duration = 2000, prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = React.useState(0)
  
  React.useEffect(() => {
    let start = 0
    const end = parseInt(value) || 0
    const increment = end / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        start = end
        clearInterval(timer)
      }
      setDisplayValue(Math.floor(start))
    }, 16)
    
    return () => clearInterval(timer)
  }, [value, duration])
  
  return (
    <span className="animated-counter">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  )
}

export default { StatsCard, ActivityItem, ProgressBar, NetworkIndicator, AnimatedCounter }
