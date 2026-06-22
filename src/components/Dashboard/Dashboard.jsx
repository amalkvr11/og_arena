import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3 } from '../../contexts/Web3Context'
import { getStorageStats, getNetworkStatus, getAllMemories } from '../../utils/storageMetrics'
import { sampleMemories, sampleTimeCapsules, sampleBeneficiaries, networkStats } from '../../utils/sampleData'
import { StatsCard, ActivityItem, ProgressBar, NetworkIndicator, AnimatedCounter } from './DashboardStats'

export const Dashboard = () => {
  const { account, isConnected, network } = useWeb3()
  const [stats, setStats] = useState(null)
  const [networkData, setNetworkData] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true)
      
      try {
        const [storageStats, netStatus] = await Promise.all([
          getStorageStats(),
          getNetworkStatus()
        ])
        
        setStats(storageStats)
        setNetworkData(netStatus)
        
        const memories = await getAllMemories()
        const activities = generateActivityFeed(memories)
        setRecentActivity(activities)
      } catch (e) {
        console.error('Failed to load dashboard:', e)
        setStats(networkStats)
        setNetworkData(networkStats)
      }
      
      setIsLoading(false)
    }
    
    loadDashboard()
  }, [])

  const generateActivityFeed = (memories) => {
    const activity = []
    
    if (memories && memories.length > 0) {
      memories.slice(-5).reverse().forEach(m => {
        activity.push({
          type: 'upload',
          title: m.title || 'Memory uploaded',
          timestamp: m.uploadedAt || new Date().toISOString(),
          hash: m.hash,
          status: 'complete'
        })
      })
    }
    
    sampleTimeCapsules.slice(-3).forEach(c => {
      activity.push({
        type: 'capsule',
        title: c.title,
        timestamp: c.createdAt,
        status: c.status
      })
    })
    
    return activity.slice(0, 8)
  }

  const dashboardStats = [
    { 
      icon: '📦', 
      value: stats?.totalMemories || sampleMemories.length, 
      label: 'Memories Stored',
      trend: '+12%',
      trendDirection: 'up'
    },
    { 
      icon: '📊', 
      value: `${stats?.totalMB || '1.2'} MB`, 
      label: 'Total on 0G',
      trend: '+8%',
      trendDirection: 'up'
    },
    { 
      icon: '🕘', 
      value: sampleTimeCapsules.length, 
      label: 'Time Capsules',
      trend: 'Active'
    },
    { 
      icon: '👥', 
      value: sampleBeneficiaries.length, 
      label: 'Beneficiaries',
      trend: 'Configured'
    }
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Dashboard</h1>
          <p>Your SoulChain analytics and activity</p>
        </div>
        {networkData && (
          <NetworkIndicator 
            status={networkData.status}
            blockHeight={networkData.blockHeight}
            latency={networkData.rpcLatency}
          />
        )}
      </div>

      {isConnected && account && (
        <div className="wallet-status-card">
          <div className="wallet-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2"/>
              <path d="M1 10h22"/>
            </svg>
          </div>
          <div className="wallet-info-text">
            <span className="wallet-label-text">Connected to {network?.name}</span>
            <span className="wallet-address-text">{account.slice(0, 6)}...{account.slice(-4)}</span>
          </div>
          <Link to="/smart-contracts" className="view-contracts-btn">
            View Contract
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      )}

      <div className="stats-grid">
        {dashboardStats.map((stat, index) => (
          <StatsCard 
            key={index}
            {...stat}
            index={index}
          />
        ))}
      </div>

      {stats && (
        <div className="storage-progress-section">
          <h3>Storage Usage</h3>
          <div className="storage-bars">
            <ProgressBar 
              progress={Math.min(100, (stats.totalBytes / (10 * 1024 * 1024)) * 100)} 
              label="0G Storage"
              color="blue"
            />
            <ProgressBar 
              progress={Math.min(100, (stats.totalBytes / (100 * 1024 * 1024)) * 100)} 
              label="Encryption Layer"
              color="purple"
            />
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-card activity-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <Link to="/memory-vault" className="see-all-link">See All</Link>
          </div>
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((item, i) => (
                <ActivityItem key={i} {...item} />
              ))
            ) : (
              <div className="empty-activity">
                <p>No recent activity</p>
                <Link to="/memory-vault" className="start-btn">Start Storing</Link>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card quick-actions-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions-grid">
            <Link to="/memory-vault" className="quick-action-btn">
              <span className="action-icon">📝</span>
              <span>Store Memory</span>
            </Link>
            <Link to="/time-capsule" className="quick-action-btn">
              <span className="action-icon">🕜</span>
              <span>Create Capsule</span>
            </Link>
            <Link to="/ai-companion" className="quick-action-btn">
              <span className="action-icon">🤖</span>
              <span>Ask Nova AI</span>
            </Link>
            <Link to="/legacy-beneficiary" className="quick-action-btn">
              <span className="action-icon">👥</span>
              <span>Set Beneficiary</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-card network-card">
          <div className="card-header">
            <h3>0G Network Status</h3>
            <span className={`status-badge ${networkData?.status || 'operational'}`}>
                  {networkData?.status || 'Operational'}
                </span>
          </div>
          <div className="network-stats-grid">
            <div className="network-stat">
              <span className="network-stat-label">Block Height</span>
              <span className="network-stat-value">
                <AnimatedCounter value={networkData?.blockHeight || 12845623} />
              </span>
            </div>
            <div className="network-stat">
              <span className="network-stat-label">Block Time</span>
              <span className="network-stat-value">{networkData?.avgBlockTime || '2.1s'}</span>
            </div>
            <div className="network-stat">
              <span className="network-stat-label">Network Load</span>
              <span className="network-stat-value">{networkData?.networkLoad || 15}%</span>
            </div>
            <div className="network-stat">
              <span className="network-stat-label">Peers</span>
              <span className="network-stat-value">{networkData?.peersConnected || 42}</span>
            </div>
          </div>
        </div>
      </div>

      {!isConnected && (
        <div className="connect-prompt">
          <h3>Connect Your Wallet</h3>
          <p>Unlock full features by connecting your 0G testnet wallet</p>
          <Link to="/smart-contracts" className="connect-btn">Connect Wallet</Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard
