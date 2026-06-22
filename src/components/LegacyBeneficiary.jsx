import React, { useState } from 'react'

export const LegacyBeneficiary = () => {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [newBeneficiary, setNewBeneficiary] = useState({
    address: '',
    name: '',
    relationship: '',
    percentage: 0,
    category: 'all'
  })
  const [inactivityThreshold, setInactivityThreshold] = useState(12)
  const [lastActivity, setLastActivity] = useState(new Date().toISOString())
  const [isAdding, setIsAdding] = useState(false)
  const [showConfirm, setShowConfirm] = useState(null)

  const relationshipOptions = [
    'Spouse', 'Child', 'Parent', 'Sibling', 'Friend', 
    'Partner', 'Grandchild', 'Other'
  ]

  const categoryOptions = [
    { value: 'all', label: 'All Memories', icon: '📦' },
    { value: 'personal', label: 'Personal Journals', icon: '📔' },
    { value: 'family', label: 'Family Memories', icon: '👨‍👩‍👧' },
    { value: 'financial', label: 'Financial Records', icon: '💰' },
    { value: 'photos', label: 'Photo Albums', icon: '📷' },
    { value: 'journal', label: 'Journal Entries', icon: '📝' }
  ]

  const handleAddBeneficiary = async () => {
    if (!newBeneficiary.address || !newBeneficiary.name) return
    
    setIsAdding(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const beneficiary = {
      id: Date.now(),
      ...newBeneficiary,
      percentage: newBeneficiary.percentage || 100,
      addedAt: new Date().toISOString(),
      status: 'pending'
    }
    
    setBeneficiaries(prev => [...prev, beneficiary])
    setNewBeneficiary({
      address: '',
      name: '',
      relationship: '',
      percentage: 0,
      category: 'all'
    })
    setIsAdding(false)
  }

  const handleRemoveBeneficiary = (id) => {
    setBeneficiaries(prev => prev.filter(b => b.id !== id))
    setShowConfirm(null)
  }

  const totalPercentage = beneficiaries.reduce((sum, b) => sum + b.percentage, 0)

  const getDaysSinceActivity = () => {
    const diff = new Date() - new Date(lastActivity)
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  const getActivityStatus = () => {
    const days = getDaysSinceActivity()
    if (days < 30) return { status: 'active', color: 'green', text: 'Active' }
    if (days < inactivityThreshold * 30) return { status: 'warning', color: 'yellow', text: 'Checking...' }
    return { status: 'triggered', color: 'red', text: 'Claimable' }
  }

  return (
    <div className="legacy-beneficiary">
      <div className="feature-intro">
        <div className="intro-icon legacy">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div className="intro-content">
          <h3>Legacy Beneficiary System</h3>
          <p>Designate trusted individuals to inherit your memories. Your digital legacy passes to loved ones automatically after a period of inactivity.</p>
        </div>
      </div>

      <div className="activity-monitor">
        <div className="monitor-header">
          <h4>Dead Man's Switch Status</h4>
          <span className={`monitor-status ${getActivityStatus().status}`}>
            <span className="status-dot"></span>
            {getActivityStatus().text}
          </span>
        </div>
        <div className="monitor-body">
          <div className="monitor-item">
            <div className="monitor-label">Last Wallet Activity</div>
            <div className="monitor-value">{new Date(lastActivity).toLocaleString()}</div>
          </div>
          <div className="monitor-item">
            <div className="monitor-label">Days Since Activity</div>
            <div className="monitor-value">{getDaysSinceActivity()} days</div>
          </div>
          <div className="monitor-item">
            <div className="monitor-label">Inactivity Threshold</div>
            <div className="monitor-value">{inactivityThreshold} months</div>
          </div>
          <div className="monitor-item">
            <div className="monitor-label">Status</div>
            <div className={`monitor-status ${getActivityStatus().status}`}>
              <span className="status-dot"></span>
              {getActivityStatus().text}
            </div>
          </div>
        </div>
        <div className="threshold-selector">
          <label>Set Inactivity Threshold</label>
          <div className="threshold-options">
            {[3, 6, 12, 24].map(months => (
              <button
                key={months}
                onClick={() => setInactivityThreshold(months)}
                className={`threshold-btn ${inactivityThreshold === months ? 'active' : ''}`}
              >
                {months} months
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="add-beneficiary-section">
        <h4>Add Beneficiary</h4>
        <div className="beneficiary-form">
          <div className="form-section">
            <label>Wallet Address</label>
            <input
              type="text"
              value={newBeneficiary.address}
              onChange={(e) => setNewBeneficiary(prev => ({ ...prev, address: e.target.value }))}
              placeholder="0x..."
              disabled={isAdding}
            />
          </div>
          <div className="form-row">
            <div className="form-section">
              <label>Name</label>
              <input
                type="text"
                value={newBeneficiary.name}
                onChange={(e) => setNewBeneficiary(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
                disabled={isAdding}
              />
            </div>
            <div className="form-section">
              <label>Relationship</label>
              <select
                value={newBeneficiary.relationship}
                onChange={(e) => setNewBeneficiary(prev => ({ ...prev, relationship: e.target.value }))}
                disabled={isAdding}
              >
                <option value="">Select...</option>
                {relationshipOptions.map(rel => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-section">
              <label>Percentage of Memories</label>
              <input
                type="number"
                value={newBeneficiary.percentage}
                onChange={(e) => setNewBeneficiary(prev => ({ ...prev, percentage: parseInt(e.target.value) || 0 }))}
                placeholder="100"
                min="1"
                max="100"
                disabled={isAdding}
              />
            </div>
            <div className="form-section">
              <label>Memory Category</label>
              <select
                value={newBeneficiary.category}
                onChange={(e) => setNewBeneficiary(prev => ({ ...prev, category: e.target.value }))}
                disabled={isAdding}
              >
                {categoryOptions.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleAddBeneficiary}
            disabled={isAdding || !newBeneficiary.address || !newBeneficiary.name}
            className="add-btn"
          >
            {isAdding ? (
              <>
                <span className="spinner"></span>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                <span>Add Beneficiary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {beneficiaries.length > 0 && (
        <div className="beneficiaries-list">
          <div className="list-header">
            <h4>Your Beneficiaries ({beneficiaries.length})</h4>
            <div className="allocation-warning">
              {totalPercentage !== 100 && (
                <span className="warning-text">
                  Total allocation: {totalPercentage}% (should equal 100%)
                </span>
              )}
            </div>
          </div>
          <div className="beneficiaries-grid">
            {beneficiaries.map(b => (
              <div key={b.id} className="beneficiary-card">
                <div className="beneficiary-header">
                  <div className="beneficiary-avatar">
                    {b.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="beneficiary-info">
                    <h5>{b.name}</h5>
                    <span className="relationship">{b.relationship}</span>
                  </div>
                  <div className="beneficiary-percentage">{b.percentage}%</div>
                </div>
                <div className="beneficiary-details">
                  <div className="detail-item">
                    <span className="detail-label">Wallet:</span>
                    <code className="detail-value">{b.address.substring(0, 10)}...{b.address.slice(-6)}</code>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{categoryOptions.find(c => c.value === b.category)?.icon} {categoryOptions.find(c => c.value === b.category)?.label}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${b.status}`}>{b.status}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowConfirm(b.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="confirm-modal">
          <div className="modal-content">
            <h4>Remove Beneficiary?</h4>
            <p>Are you sure you want to remove this beneficiary? They will no longer inherit your memories.</p>
            <div className="modal-actions">
              <button onClick={() => setShowConfirm(null)} className="cancel-btn">Cancel</button>
              <button onClick={() => handleRemoveBeneficiary(showConfirm)} className="confirm-btn">Remove</button>
            </div>
          </div>
        </div>
      )}

      <div className="how-it-works">
        <h4>How It Works</h4>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h5>Designate Beneficiaries</h5>
              <p>Add trusted individuals who will receive your memories</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h5>Set Inactivity Threshold</h5>
              <p>Choose when memories should transfer or your wallet</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h5>Automatic Transfer</h5>
              <p>After threshold, beneficiaries can claim their inheritance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
