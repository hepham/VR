import { useState, useEffect } from 'react'
import './InfoModal.css' // We'll create this CSS file

interface InfoModalProps {
  isOpen: boolean
  objectInfo: {
    name: string
    description: string
    details: string[]
    category: string
    historicalInfo?: string
    videoUrl?: string
    imageUrl?: string
  } | null
  onClose: () => void
}

/**
 * InfoModal Component - Detailed Object Information Display
 * 
 * This component creates a beautiful modal that displays:
 * 1. Object name and category
 * 2. Detailed description and technical specs
 * 3. Historical information
 * 4. Embedded videos or images
 * 5. Interactive close button
 */
function InfoModal({ isOpen, objectInfo, onClose }: InfoModalProps) {
  const [videoError, setVideoError] = useState(false)

  // Debug log to check if modal is being rendered
  console.log('InfoModal render - isOpen:', isOpen, 'objectInfo:', objectInfo)

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen || !objectInfo) return null

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div className="info-modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="info-modal-header">
          <div>
            <h2>{objectInfo.name}</h2>
            <span className="category-badge">{objectInfo.category}</span>
          </div>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="info-modal-body">
          {/* Media Section */}
          {(objectInfo.videoUrl || objectInfo.imageUrl) && (
            <div className="media-section">
              {objectInfo.videoUrl && !videoError ? (
                <div className="video-container">
                  <video
                    controls
                    poster={objectInfo.imageUrl}
                    onError={() => setVideoError(true)}
                    style={{ width: '100%', borderRadius: '8px' }}
                  >
                    <source src={objectInfo.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : objectInfo.imageUrl ? (
                <div className="image-container">
                  <img 
                    src={objectInfo.imageUrl} 
                    alt={objectInfo.name}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </div>
              ) : null}
            </div>
          )}

          {/* Description */}
          <div className="description-section">
            <h3>📖 Description</h3>
            <p>{objectInfo.description}</p>
          </div>

          {/* Technical Details */}
          {objectInfo.details.length > 0 && (
            <div className="details-section">
              <h3>⚙️ Technical Details</h3>
              <ul>
                {objectInfo.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Historical Information */}
          {objectInfo.historicalInfo && (
            <div className="historical-section">
              <h3>🏛️ Historical Context</h3>
              <p>{objectInfo.historicalInfo}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="info-modal-footer">
          <button className="close-btn" onClick={onClose}>
            Close Information
          </button>
        </div>
      </div>
    </div>
  )
}

export default InfoModal 