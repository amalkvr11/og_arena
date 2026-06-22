import React from 'react'

export const SkeletonText = ({ lines = 3, lineHeight = 16, marginBottom = 8 }) => {
  return (
    <div className="skeleton-text-container">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{
            height: `${lineHeight}px`,
            width: `${Math.random() * 30 + 70}%`,
            marginBottom: `${marginBottom}px`
          }}
        />
      ))}
    </div>
  )
}

export const SkeletonCard = ({ height = 200, className = '' }) => {
  return (
    <div 
      className={`skeleton-card ${className}`}
      style={{ height: `${height}px` }}
    >
      <div className="skeleton-shimmer" />
    </div>
  )
}

export const SkeletonAvatar = ({ size = 48 }) => {
  return (
    <div 
      className="skeleton-avatar"
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  )
}

export const SkeletonButton = ({ width = 120, height = 40 }) => {
  return (
    <div 
      className="skeleton-button"
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  )
}

export const MemoryUploadSkeleton = () => {
  return (
    <div className="memory-upload skeleton-mode">
      <div className="upload-header">
        <SkeletonCard height={30} className="header-skeleton" />
      </div>
      <SkeletonText lines={6} lineHeight={20} />
      <div className="upload-actions-skeleton">
        <SkeletonButton width={150} height={44} />
        <SkeletonButton width={150} height={44} />
        <SkeletonButton width={80} height={44} />
      </div>
    </div>
  )
}

export const ChatMessageSkeleton = () => {
  return (
    <div className="message skeleton-message">
      <SkeletonAvatar size={40} />
      <div className="message-bubble-skeleton">
        <SkeletonText lines={2} lineHeight={14} marginBottom={6} />
      </div>
    </div>
  )
}

export const DashboardCardSkeleton = () => {
  return (
    <div className="stat-box skeleton-stat-box">
      <div className="stat-icon-skeleton">
        <SkeletonAvatar size={48} />
      </div>
      <div className="stat-info-skeleton">
        <SkeletonText lines={2} lineHeight={16} marginBottom={4} />
      </div>
    </div>
  )
}

export const TimeCapsuleSkeleton = () => {
  return (
    <div className="time-capsule skeleton-mode">
      <div className="feature-intro-skeleton">
        <SkeletonAvatar size={60} />
        <div className="intro-content-skeleton">
          <SkeletonText lines={3} lineHeight={18} />
        </div>
      </div>
      <SkeletonCard height={300} className="form-skeleton" />
    </div>
  )
}

export const BeneficiaryCardSkeleton = () => {
  return (
    <div className="beneficiary-card skeleton-beneficiary">
      <div className="beneficiary-header-skeleton">
        <SkeletonAvatar size={48} />
        <div style={{ flex: 1 }}>
          <SkeletonText lines={2} lineHeight={14} marginBottom={4} />
        </div>
      </div>
      <SkeletonText lines={3} lineHeight={12} marginBottom={6} />
    </div>
  )
}

export const TransactionSkeleton = () => {
  return (
    <div className="result-card skeleton-result">
      <div className="result-icon-skeleton">
        <SkeletonAvatar size={40} />
      </div>
      <div className="result-content-skeleton">
        <SkeletonText lines={4} lineHeight={14} />
      </div>
    </div>
  )
}

export const PageSkeleton = ({ type = 'default' }) => {
  const getPageSkeleton = () => {
    switch (type) {
      case 'memory-vault':
        return <MemoryUploadSkeleton />
      case 'ai-companion':
        return (
          <div className="companion-chat skeleton-mode">
            <div className="ai-avatar-section-skeleton">
              <SkeletonAvatar size={100} />
              <div className="ai-info-skeleton">
                <SkeletonText lines={2} lineHeight={14} />
              </div>
            </div>
            <div className="messages-container-skeleton">
              {[1, 2, 3].map((i) => (
                <ChatMessageSkeleton key={i} />
              ))}
            </div>
          </div>
        )
      case 'time-capsule':
        return <TimeCapsuleSkeleton />
      case 'dashboard':
        return (
          <div className="dashboard-skeleton">
            {[1, 2, 3, 4].map((i) => (
              <DashboardCardSkeleton key={i} />
            ))}
          </div>
        )
      default:
        return (
          <div className="page-skeleton">
            <SkeletonCard height={100} className="header-skeleton" />
            <SkeletonText lines={5} />
            <div className="cards-grid-skeleton">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} height={200} />
              ))}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="skeleton-wrapper">
      {getPageSkeleton()}
    </div>
  )
}

export default SkeletonText
