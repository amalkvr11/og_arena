import React, { useState } from 'react'

export const MemoryCollections = () => {
  const [collections, setCollections] = useState([
    {
      id: 1,
      name: "Wedding Memories",
      description: "Our special day captured forever",
      icon: "💒",
      color: "#e91e63",
      memoryCount: 24,
      coverImage: null,
      contributors: ["me", "spouse"],
      createdAt: "2024-01-15",
      lastUpdated: new Date().toISOString()
    },
    {
      id: 2,
      name: "Baby's First Year",
      description: "Documenting every precious moment",
      icon: "👶",
      color: "#2196f3",
      memoryCount: 156,
      coverImage: null,
      contributors: ["me", "partner"],
      createdAt: "2024-03-01",
      lastUpdated: new Date().toISOString()
    }
  ])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    icon: '📚',
    color: '#0066ff',
    isShared: false
  })
  const [activeCollection, setActiveCollection] = useState(null)
  const [memories, setMemories] = useState([
    { id: 1, title: "Wedding Vows", content: "The day I promised forever...", date: "2024-01-15" },
    { id: 2, title: "First Dance", content: "Our song played and time stood still", date: "2024-01-15" },
    { id: 3, title: "Baby smiled", content: "First real smile today!", date: "2024-03-15" }
  ])

  const iconOptions = ['📚', '💒', '👶', '✈️', '🎯', '❤️', '🌟', '🎂', '🏠', '💼', '🎨', '🎵']
  const colorOptions = ['#e91e63', '#f44336', '#ff5722', '#ff9800', '#ffc107', '#8bc34a', '#4caf50', '#00bcd4', '#2196f3', '#673ab7', '#9c27b0', '#0066ff']

  const handleCreateCollection = () => {
    if (!newCollection.name.trim()) return

    const collection = {
      id: Date.now(),
      ...newCollection,
      memoryCount: 0,
      contributors: ['me'],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }

    setCollections(prev => [...prev, collection])
    setShowCreateModal(false)
    setNewCollection({
      name: '',
      description: '',
      icon: '📚',
      color: '#0066ff',
      isShared: false
    })
  }

  const openCollection = (collection) => {
    setActiveCollection(collection)
  }

  const closeCollection = () => {
    setActiveCollection(null)
  }

  const handleDeleteCollection = (id) => {
    setCollections(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="memory-collections">
      <div className="feature-intro">
        <div className="intro-icon collections">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
          </svg>
        </div>
        <div className="intro-content">
          <h3>Memory Collections & Albums</h3>
          <p>Organize your memories into thematic collections. Create albums for weddings, family, travel, and more.</p>
        </div>
      </div>

      {!activeCollection ? (
        <>
          <div className="collections-actions">
            <button onClick={() => setShowCreateModal(true)} className="create-collection-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Collection
            </button>
          </div>

          <div className="collections-grid">
            {collections.map(collection => (
              <div 
                key={collection.id} 
                className="collection-card"
                onClick={() => openCollection(collection)}
                style={{ '--collection-color': collection.color }}
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteCollection(collection.id) }}
                  className="delete-collection-btn"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
                <div className="collection-icon" style={{ background: collection.color }}>
                  <span>{collection.icon}</span>
                </div>
                <div className="collection-info">
                  <h4>{collection.name}</h4>
                  <p className="collection-desc">{collection.description}</p>
                  <div className="collection-meta">
                    <div className="meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12h6m-6 4h6"/>
                        <path d="M17.5,3.5l3,3-10,10H7v-3.5l10-10z"/>
                      </svg>
                      <span>{collection.memoryCount} memories</span>
                    </div>
                    <div className="meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span>{new Date(collection.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="collaboration-info">
            <h4>Share & Collaborate</h4>
            <div className="collaboration-grid">
              <div className="collab-item">
                <span className="collab-icon">👫</span>
                <div className="collab-content">
                  <h5>Share with Family</h5>
                  <p>Invite family members to view and contribute</p>
                </div>
              </div>
              <div className="collab-item">
                <span className="collab-icon">🔗</span>
                <div className="collab-content">
                  <h5>Shareable Links</h5>
                  <p>Generate links for specific collections</p>
                </div>
              </div>
              <div className="collab-item">
                <span className="collab-icon">🔐</span>
                <div className="collab-content">
                  <h5>Access Control</h5>
                  <p>Control who can view or edit</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="collection-detail">
          <button onClick={closeCollection} className="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Collections
          </button>

          <div className="collection-header" style={{ borderBottom: `4px solid ${activeCollection.color}` }}>
            <span className="collection-icon-large">{activeCollection.icon}</span>
            <div className="collection-title">
              <h2>{activeCollection.name}</h2>
              <p>{activeCollection.description}</p>
            </div>
            <div className="collection-stats">
              <span className="stat">{activeCollection.memoryCount} memories</span>
              <span className="stat">{activeCollection.contributors.length} contributors</span>
            </div>
          </div>

          <div className="collection-memories">
            <div className="memories-header">
              <h4>Memories</h4>
              <button className="add-memory-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Add Memory
              </button>
            </div>

            {memories.map(memory => (
              <div key={memory.id} className="memory-item">
                <div className="memory-date">{new Date(memory.date).toLocaleDateString()}</div>
                <div className="memory-content">
                  <h5>{memory.title}</h5>
                  <p>{memory.content}</p>
                </div>
              </div>
            ))}

            {memories.length === 0 && (
              <div className="no-memories">
                <p>No memories in this collection yet.</p>
                <button className="add-memory-btn">Add Your First Memory</button>
              </div>
            )}
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="create-modal">
            <div className="modal-header">
              <h3>Create New Collection</h3>
              <button onClick={() => setShowCreateModal(false)} className="close-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-section">
                <label>Collection Name *</label>
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Wedding Memories"
                />
              </div>

              <div className="form-section">
                <label>Description</label>
                <textarea
                  value={newCollection.description}
                  onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What's this collection about?"
                  rows={2}
                />
              </div>

              <div className="form-section">
                <label>Icon</label>
                <div className="icon-selector">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewCollection(prev => ({ ...prev, icon }))}
                      className={`icon-btn ${newCollection.icon === icon ? 'active' : ''}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label>Color</label>
                <div className="color-selector">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewCollection(prev => ({ ...prev, color }))}
                      className={`color-btn ${newCollection.color === color ? 'active' : ''}`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowCreateModal(false)} className="cancel-btn">Cancel</button>
              <button onClick={handleCreateCollection} className="create-btn">Create Collection</button>
            </div>
          </div>
        </div>
      )}

      <div className="example-collections">
        <h4>Popular Collection Ideas</h4>
        <div className="ideas-grid">
          <div className="idea-card">
            <span className="idea-icon">💒</span>
            <h5>Wedding Album</h5>
            <p>Photos, vows, and memories from your special day</p>
          </div>
          <div className="idea-card">
            <span className="idea-icon">👶</span>
            <h5>Baby's First Year</h5>
            <p>Document milestones and precious moments</p>
          </div>
          <div className="idea-card">
            <span className="idea-icon">✈️</span>
            <h5>Travel Journal</h5>
            <p>Adventures and experiences around the world</p>
          </div>
          <div className="idea-card">
            <span className="idea-icon">💼</span>
            <h5>Career Milestones</h5>
            <p>Professional achievements and memories</p>
          </div>
        </div>
      </div>
    </div>
  )
}
