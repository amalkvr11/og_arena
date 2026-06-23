import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3 } from '../contexts/Web3Context'
import { getAllMemories } from '../utils/storageMetrics'

export const MemoryTimeline = ({ limit = 10 }) => {
  const { account, getExplorerUrl, getStorageExplorerUrl } = useWeb3()
  const [memories, setMemories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMemories = async () => {
      try {
        const stored = await getAllMemories()
        const sorted = (stored || [])
          .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
          .slice(0, limit)
        setMemories(sorted)
      } catch (e) {
        console.error('Failed to load memories:', e)
      } finally {
        setIsLoading(false)
      }
    }
    loadMemories()
  }, [limit])

  if (isLoading) {
    return (
      <div className="memory-timeline">
        {[1, 2, 3].map(i => (
          <div key={i} className="timeline-item">
            <div className="skeleton skeleton-text medium"></div>
            <div className="skeleton skeleton-text short"></div>
          </div>
        ))}
      </div>
    )
  }

  if (memories.length === 0) {
    return (
      <div className="empty-timeline">
        <p>No memories stored yet</p>
        <Link to="/memory-vault" className="start-btn">Store Your First Memory</Link>
      </div>
    )
  }

  return (
    <div className="memory-timeline">
      <div className="timeline-line"></div>
      {memories.map((memory, index) => (
        <div key={memory.hash || index} className="timeline-item">
          <div className="timeline-dot"></div>
          <div className="timeline-date">
            {new Date(memory.uploadedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <div className="timeline-title">
            {memory.title || `Memory #${memories.length - index}`}
          </div>
          {memory.size && (
            <div className="timeline-preview">
              {(memory.size / 1024).toFixed(1)} KB stored on 0G
            </div>
          )}
          {memory.hash && (
            <div className="timeline-hash">
              {memory.hash.slice(0, 10)}...{memory.hash.slice(-8)}
            </div>
          )}
          {memory.txHash && getExplorerUrl && (
            <a 
              href={getExplorerUrl(memory.txHash)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="timeline-link"
              style={{ fontSize: '0.75rem', color: '#00f5ff', marginTop: '4px', display: 'inline-block' }}
            >
              View on Explorer →
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

export default MemoryTimeline
