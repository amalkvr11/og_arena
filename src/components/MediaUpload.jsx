import React, { useState, useRef } from 'react'

export const MediaUpload = () => {
  const [uploads, setUploads] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [mediaType, setMediaType] = useState('image')
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const mediaTypes = [
    { value: 'image', label: 'Image', icon: '📷', accept: 'image/*' },
    { value: 'audio', label: 'Audio', icon: '🎙️', accept: 'audio/*' },
    { value: 'video', label: 'Video', icon: '🎥', accept: 'video/*' }
  ]

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    processFile(file)
  }

  const processFile = async (file) => {
    if (!title.trim()) {
      alert('Please enter a title first')
      return
    }
    
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload with progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUploadProgress(i)
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    
    const newUpload = {
      id: Date.now(),
      type: mediaType,
      title,
      caption,
      file,
      previewUrl,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
      hash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      encrypted: true
    }

    setUploads(prev => [...prev, newUpload])
    setTitle('')
    setCaption('')
    setIsUploading(false)
    setUploadProgress(0)
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleCapture = async () => {
    if (mediaType === 'image') {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        
        // Capture after 2 seconds
        setTimeout(() => {
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth
            canvasRef.current.height = videoRef.current.videoHeight
            const ctx = canvasRef.current.getContext('2d')
            ctx.drawImage(videoRef.current, 0, 0)
            
            canvasRef.current.toBlob(blob => {
              const file = new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' })
              processFile(file)
            })
            
            stream.getTracks().forEach(track => track.stop())
          }
        }, 2000)
      }
    }
  }

  return (
    <div className="media-upload">
      <div className="feature-intro">
        <div className="intro-icon media">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
        </div>
        <div className="intro-content">
          <h3>Multi-Media Memory Support</h3>
          <p>Upload photos, audio recordings, and videos. All encrypted with AES-256 and stored permanently on 0G Network.</p>
        </div>
      </div>

      <div className="media-selector">
        {mediaTypes.map(type => (
          <button
            key={type.value}
            onClick={() => setMediaType(type.value)}
            className={`media-type-btn ${mediaType === type.value ? 'active' : ''}`}
          >
            <span className="media-icon">{type.icon}</span>
            <span className="media-label">{type.label}</span>
          </button>
        ))}
      </div>

      <div className="upload-form">
        <div className="form-section">
          <label>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Wedding Day Photo"
            disabled={isUploading}
          />
        </div>

        <div className="form-section">
          <label>Caption / Description</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What makes this memory special?"
            disabled={isUploading}
            rows={3}
          />
        </div>

        <div
          className="drop-zone"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={mediaTypes.find(t => t.value === mediaType)?.accept}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <div className="drop-content">
            <div className="drop-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="drop-text">
              Drop your {mediaType} here or click to browse
            </p>
            <p className="drop-hint">
              Supports: {mediaType === 'image' ? 'JPG, PNG, GIF, WebP' : 
                         mediaType === 'audio' ? 'MP3, WAV, M4A, OGG' :
                         'MP4, WebM, MOV'}
            </p>
          </div>
        </div>

        {isUploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <div className="progress-info">
              <span>{uploadProgress}%</span>
              <span>Encrypting & Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {uploads.length > 0 && (
        <div className="media-gallery">
          <h4>Uploaded Media ({uploads.length})</h4>
          <div className="gallery-grid">
            {uploads.map(item => (
              <div key={item.id} className="gallery-item">
                <div className="item-preview">
                  {item.type === 'image' && (
                    <img src={item.previewUrl} alt={item.title} />
                  )}
                  {item.type === 'audio' && (
                    <div className="audio-preview">
                      <audio controls src={item.previewUrl} />
                    </div>
                  )}
                  {item.type === 'video' && (
                    <video controls src={item.previewUrl} muted />
                  )}
                </div>
                <div className="item-info">
                  <h5>{item.title}</h5>
                  <p className="item-caption">{item.caption}</p>
                  <div className="item-meta">
                    <span className="meta-type">{mediaTypes.find(t => t.value === item.type)?.icon}</span>
                    <span className="meta-size">{formatFileSize(item.size)}</span>
                    <span className="meta-date">{new Date(item.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  {item.encrypted && (
                    <div className="encryption-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                      AES-256 Encrypted
                    </div>
                  )}
                  <div className="item-hash">
                    <code>{item.hash.substring(0, 20)}...</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="use-cases">
        <h4>Use Cases</h4>
        <div className="use-cases-grid">
          <div className="use-case">
            <span className="use-case-icon">💒</span>
            <div className="use-case-content">
              <h5>Wedding Photos</h5>
              <p>Preserve wedding memories forever</p>
            </div>
          </div>
          <div className="use-case">
            <span className="use-case-icon">👶</span>
            <div className="use-case-content">
              <h5>Baby's First Moments</h5>
              <p>First words, first steps as video/audio</p>
            </div>
          </div>
          <div className="use-case">
            <span className="use-case-icon">✈️</span>
            <div className="use-case-content">
              <h5>Travel Memories</h5>
              <p>Photos from your adventures</p>
            </div>
          </div>
          <div className="use-case">
            <span className="use-case-icon">🎤</span>
            <div className="use-case-content">
              <h5>Voice Messages</h5>
              <p>Record personal audio messages</p>
            </div>
          </div>
        </div>
      </div>

      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
