import React, { useState } from 'react'

export const TimeCapsule = () => {
  const [memory, setMemory] = useState("")
  const [title, setTitle] = useState("")
  const [unlockDate, setUnlockDate] = useState("")
  const [unlockType, setUnlockType] = useState("date")
  const [beneficiary, setBeneficiary] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [capsules, setCapsules] = useState([])
  const [error, setError] = useState(null)

  const presetDates = [
    { label: "1 Year", value: 1 },
    { label: "5 Years", value: 5 },
    { label: "10 Years", value: 10 },
    { label: "18th Birthday (for child)", value: 18, type: "birthday" },
    { label: "25th Anniversary", value: 25, type: "anniversary" },
  ]

  const calculateUnlockDate = (years) => {
    const date = new Date()
    date.setFullYear(date.getFullYear() + years)
    return date.toISOString().split('T')[0]
  }

  const handlePresetSelect = (preset) => {
    const today = new Date()
    let targetDate = new Date()
    targetDate.setFullYear(today.getFullYear() + preset.value)
    setUnlockDate(targetDate.toISOString().split('T')[0])
  }

  const handleCreateCapsule = async () => {
    if (!memory.trim() || !title.trim() || !unlockDate) {
      setError("Please fill in all fields")
      return
    }

    setIsCreating(true)
    setError(null)

    await new Promise(resolve => setTimeout(resolve, 1500))

    const newCapsule = {
      id: Date.now(),
      title,
      memory,
      unlockDate,
      beneficiary: beneficiary || "Self",
      createdAt: new Date().toISOString(),
      status: new Date(unlockDate) > new Date() ? "locked" : "unlocked",
      hash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    }

    setCapsules(prev => [...prev, newCapsule])
    setMemory("")
    setTitle("")
    setUnlockDate("")
    setBeneficiary("")
    setIsCreating(false)
  }

  const getDaysUntilUnlock = (date) => {
    const unlock = new Date(date)
    const today = new Date()
    const diff = unlock - today
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const getStatusBadge = (capsule) => {
    const days = getDaysUntilUnlock(capsule.unlockDate)
    if (days <= 0) {
      return { text: "UNLOCKED", class: "unlocked" }
    }
    if (days <= 30) {
      return { text: `${days} DAYS`, class: "soon" }
    }
    if (days <= 365) {
      return { text: `${Math.ceil(days / 30)} MONTHS`, class: "pending" }
    }
    return { text: `${Math.ceil(days / 365)} YEARS`, class: "locked" }
  }

  return (
    <div className="time-capsule">
      <div className="feature-intro">
        <div className="intro-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <div className="intro-content">
          <h3>Memorial Time Capsule</h3>
          <p>Create memories that unlock at specific future dates. Perfect for birthdays, anniversaries, or messages to your future self.</p>
        </div>
      </div>

      <div className="capsule-form">
        <div className="form-section">
          <label>Capsule Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Letter to my 18-year-old self"
            disabled={isCreating}
          />
        </div>

        <div className="form-section">
          <label>Your Memory Message</label>
          <textarea
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            placeholder="Write your message here... What would you want to say to your future self or loved ones?"
            disabled={isCreating}
            rows={6}
          />
        </div>

        <div className="form-row">
          <div className="form-section">
            <label>Unlock Type</label>
            <select value={unlockType} onChange={(e) => setUnlockType(e.target.value)}>
              <option value="date">Specific Date</option>
              <option value="event">Life Event</option>
            </select>
          </div>
          <div className="form-section">
            <label>Unlock Date</label>
            <input
              type="date"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              disabled={isCreating}
            />
          </div>
        </div>

        <div className="preset-buttons">
          <span className="preset-label">Quick Select:</span>
          {presetDates.map((preset, i) => (
            <button 
              key={i} 
              onClick={() => handlePresetSelect(preset)}
              className="preset-btn"
              disabled={isCreating}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="form-section">
          <label>Beneficiary Wallet (Optional)</label>
          <input
            type="text"
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
            placeholder="0x... (leave empty for self)"
            disabled={isCreating}
          />
          <span className="form-hint">The wallet address that will receive this capsule</span>
        </div>

        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4m0 4h.01"/>
            </svg>
            {error}
          </div>
        )}

        <button 
          onClick={handleCreateCapsule}
          disabled={isCreating || !memory.trim() || !title.trim() || !unlockDate}
          className="create-capsule-btn"
        >
          {isCreating ? (
            <>
              <span className="spinner"></span>
              <span>Creating Time Capsule...</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M12 8v8M8 12h8"/>
              </svg>
              <span>Create Time Capsule</span>
            </>
          )}
        </button>
      </div>

      {capsules.length > 0 && (
        <div className="capsules-list">
          <h4>Your Time Capsules</h4>
          <div className="capsules-grid">
            {capsules.map(capsule => {
              const status = getStatusBadge(capsule)
              const days = getDaysUntilUnlock(capsule.unlockDate)
              
              return (
                <div key={capsule.id} className={`capsule-card ${status.class}`}>
                  <div className="capsule-header">
                    <span className="capsule-title">{capsule.title}</span>
                    <span className={`capsule-status ${status.class}`}>{status.text}</span>
                  </div>
                  <div className="capsule-body">
                    <div className="capsule-info">
                      <div className="info-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2"/>
                          <path d="M16 2v4M8 2v4M3 10h18"/>
                        </svg>
                        <span>Created: {new Date(capsule.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="info-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 6v6l4 2"/>
                        </svg>
                        <span>Unlocks: {new Date(capsule.unlockDate).toLocaleDateString()}</span>
                      </div>
                      <div className="info-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span>For: {capsule.beneficiary}</span>
                      </div>
                    </div>
                    {days <= 0 && (
                      <div className="capsule-content">
                        <p>{capsule.memory}</p>
                      </div>
                    )}
                    <div className="capsule-hash">
                      <span>Hash: </span>
                      <code>{capsule.hash.substring(0, 20)}...</code>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="use-cases">
        <h4>Use Cases</h4>
        <div className="use-cases-grid">
          <div className="use-case">
            <div className="use-case-icon">👶</div>
            <div className="use-case-content">
              <h5>Parent to Child</h5>
              <p>Write letters to your child that unlock on their 18th birthday</p>
            </div>
          </div>
          <div className="use-case">
            <div className="use-case-icon">💌</div>
            <div className="use-case-content">
              <h5>Anniversary Surprises</h5>
              <p>Schedule love letters to unlock on future anniversaries</p>
            </div>
          </div>
          <div className="use-case">
            <div className="use-case-icon">🔮</div>
            <div className="use-case-content">
              <h5>Future Self</h5>
              <p>Send advice and hopes to yourself 10 years from now</p>
            </div>
          </div>
          <div className="use-case">
            <div className="use-case-icon">📚</div>
            <div className="use-case-content">
              <h5>Wisdom Transfer</h5>
              <p>Pass down family stories and life lessons to future generations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
