import React, { useState, useEffect } from 'react'
import { getNetworkStatus } from '../../utils/storageMetrics'
import { Link } from 'react-router-dom'

export const NetworkStatusWidget = () => {
  const [status, setStatus] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const fetchStatus = async () => {
      const netStatus = await getNetworkStatus()
      setStatus(netStatus)
    }
    
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (!status) return null

  return (
    <div 
      className={`network-status-widget ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      role="status"
      aria-live="polite"
      aria-label="Network status"
    >
      <div className="widget-header">
        <div className={`status-indicator status-${status.status}`} />
        <span className="network-name">0G Network</span>
        {isExpanded && (
          <span className="block-height">#{status.blockHeight?.toLocaleString()}</span>
        )}
      </div>
      
      {isExpanded && (
        <div className="widget-details">
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className={`detail-value status-text status-${status.status}`}>
              {status.status === 'operational' ? '● Operational' : '● Issues'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Block Height</span>
            <span className="detail-value">{status.blockHeight?.toLocaleString()}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Block Time</span>
            <span className="detail-value">{status.avgBlockTime}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">RPC Latency</span>
            <span className="detail-value">{status.rpcLatency}ms</span>
          </div>
          <div className="widget-links">
            <a 
              href="https://faucet.0g.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="widget-link"
            >
              Get Testnet Tokens
            </a>
            <Link to="/dashboard" className="widget-link">
              View Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default NetworkStatusWidget
