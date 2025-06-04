import { useState, useEffect } from 'react'

// Database of object information with video support
const objectInfoDatabase: Record<string, {
  name: string
  description: string
  details: string[]
  category: string
  historicalInfo?: string
  videoUrl?: string
  imageUrl?: string
}> = {
  // Furniture
  'chair': {
    name: '🪑 Ghế Cổ Điển',
    description: 'Một chiếc ghế gỗ được chế tác tinh xảo từ thời Victoria.',
    details: [
      'Làm từ gỗ mahogany nguyên khối',
      'Khắc tay các chi tiết trang trí',
      'Bọc nhung với viền vàng',
      'Tuổi đời ước tính: hơn 150 năm'
    ],
    category: 'Nội Thất',
    historicalInfo: 'Phong cách này phổ biến trong các ngôi nhà giàu có ở Anh trong những năm 1870.',
    videoUrl: 'https://example.com/videos/victorian-chair.mp4',
    imageUrl: 'https://example.com/images/victorian-chair.jpg'
  },
  'table': {
    name: '🪞 Bàn Cẩm Thạch',
    description: 'Bàn trang nhã với mặt đá cẩm thạch và chân đồng thau.',
    details: [
      'Mặt bàn đá cẩm thạch Carrara',
      'Chân đồng thau với hoa văn tinh xảo',
      'Chiều cao: 75cm, Chiều rộng: 60cm',
      'Trọng lượng: khoảng 45kg'
    ],
    category: 'Nội Thất',
    historicalInfo: 'Nội thất đá cẩm thạch trở nên thời thượng trong các cung điện châu Âu thế kỷ 18.',
    imageUrl: 'https://example.com/images/marble-table.jpg'
  },
  'sofa': {
    name: '🛋️ Ghế Sofa Chesterfield',
    description: 'Ghế sofa da kinh điển của Anh với đặc trưng đệm nút sâu.',
    details: [
      'Bọc da thật',
      'Đệm nút sâu đặc trưng',
      'Tay vịn và lưng ghế cuộn tròn',
      'Khung gỗ rắn chắc'
    ],
    category: 'Nội Thất',
    historicalInfo: 'Thiết kế Chesterfield được Philip Stanhope, Bá tước thứ 4 của Chesterfield đặt hàng đầu tiên.',
    videoUrl: 'https://example.com/videos/chesterfield-making.mp4',
    imageUrl: 'https://example.com/images/chesterfield.jpg'
  },
  
  // Art Objects
  'painting': {
    name: '🖼️ Tranh Chân Dung Sơn Dầu',
    description: 'Bức tranh sơn dầu trang nghiêm miêu tả một thành viên gia đình quý tộc.',
    details: [
      'Sơn dầu trên vải canvas',
      'Kích thước: 120cm x 90cm',
      'Khung vàng cầu kỳ',
      'Họa sĩ: Danh sư vô danh'
    ],
    category: 'Nghệ Thuật',
    historicalInfo: 'Tranh chân dung rất quan trọng để ghi lại dòng dõi gia đình trong các gia tộc quý tộc.',
    imageUrl: 'https://example.com/images/portrait.jpg'
  },
  'sculpture': {
    name: '🗿 Tượng Bán Thân Cẩm Thạch',
    description: 'Tượng cẩm thạch cổ điển theo phong cách nghệ thuật La Mã.',
    details: [
      'Khắc từ đá cẩm thạch trắng Carrara',
      'Chiều cao: 65cm',
      'Phong cách La Mã cổ điển',
      'Đặt trên bệ tượng'
    ],
    category: 'Nghệ Thuật',
    historicalInfo: 'Phong trào phục hưng điêu khắc tân cổ điển đạt đỉnh cao trong thế kỷ 18-19.',
    videoUrl: 'https://example.com/videos/marble-sculpting.mp4',
    imageUrl: 'https://example.com/images/marble-bust.jpg'
  },

  // Decorative Items
  'vase': {
    name: '🏺 Bình Sứ',
    description: 'Bình sứ tinh xảo vẽ tay với họa tiết hoa lá.',
    details: [
      'Sứ xương cao cấp',
      'Vẽ tay họa tiết hoa',
      'Chiều cao: 35cm',
      'Chi tiết viền vàng'
    ],
    category: 'Trang Trí',
    historicalInfo: 'Kỹ thuật sứ Trung Quốc được đánh giá cao trong các bộ sưu tập châu Âu.',
    imageUrl: 'https://example.com/images/porcelain-vase.jpg'
  },
  'lamp': {
    name: '💎 Đèn Chùm Pha Lê',
    description: 'Đèn chùm pha lê tráng lệ chiếu sáng căn phòng hoành tráng.',
    details: [
      'Pha lê cắt thủ công',
      '12 bóng đèn',
      'Khung đồng mạ vàng',
      'Đường kính: 1.2 mét'
    ],
    category: 'Trang Trí',
    historicalInfo: 'Đèn chùm pha lê tượng trưng cho sự giàu có và tinh tế trong các ngôi nhà lớn.',
    videoUrl: 'https://example.com/videos/chandelier-restoration.mp4',
    imageUrl: 'https://example.com/images/chandelier.jpg'
  },

  // Architecture
  'fireplace': {
    name: '🔥 Lò Sưởi Georgian',
    description: 'Lò sưởi cẩm thạch hoành tráng là điểm nhấn của căn phòng.',
    details: [
      'Lò sưởi cẩm thạch khắc nổi',
      'Chi tiết trang trí cầu kỳ',
      'Hệ thống ống khói hoạt động',
      'Vỉ nướng theo đúng thời kỳ'
    ],
    category: 'Kiến Trúc',
    historicalInfo: 'Lò sưởi Georgian được thiết kế vừa có chức năng vừa là biểu tượng địa vị.',
    videoUrl: 'https://example.com/videos/georgian-fireplace.mp4',
    imageUrl: 'https://example.com/images/fireplace.jpg'
  },
  
  // Default fallback
  'default': {
    name: '🏛️ Vật Thể Phòng',
    description: 'Một vật thể thú vị trong căn phòng lịch sử này.',
    details: [
      'Là một phần của bộ sưu tập lịch sử',
      'Góp phần tạo nên bầu không khí thời kỳ',
      'Được bảo tồn trong tình trạng nguyên bản'
    ],
    category: 'Chung',
    historicalInfo: 'Mọi vật thể trong căn phòng này đều được tuyển chọn cẩn thận để đại diện cho thời kỳ.',
    imageUrl: 'https://example.com/images/room-object.jpg'
  }
}

// Function to get object info, with improved fuzzy matching
function getObjectInfo(clickedName: string | null) {
  if (!clickedName) return null
  
  const lowerName = clickedName.toLowerCase()
  
  // Direct match
  if (objectInfoDatabase[lowerName]) {
    return objectInfoDatabase[lowerName]
  }
  
  // Fuzzy matching - check if the clicked name contains any of our keywords
  for (const [key, info] of Object.entries(objectInfoDatabase)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return info
    }
  }
  
  // Extended fuzzy matching for common variations
  const matchPatterns = [
    { pattern: /chair|seat/i, key: 'chair' },
    { pattern: /table|desk/i, key: 'table' },
    { pattern: /sofa|couch/i, key: 'sofa' },
    { pattern: /painting|picture|art/i, key: 'painting' },
    { pattern: /vase|pot|urn/i, key: 'vase' },
    { pattern: /lamp|light/i, key: 'lamp' },
    { pattern: /mirror|glass/i, key: 'mirror' },
    { pattern: /statue|sculpture/i, key: 'statue' },
    { pattern: /clock|time/i, key: 'clock' },
    { pattern: /book|tome|volume/i, key: 'book' },
    { pattern: /candle|stick/i, key: 'candlestick' },
    { pattern: /fire|hearth/i, key: 'fireplace' },
    { pattern: /window|glass/i, key: 'window' },
    { pattern: /door|entrance/i, key: 'door' },
    { pattern: /column|pillar/i, key: 'pillar' },
    { pattern: /ceiling|roof/i, key: 'ceiling' },
    { pattern: /floor|ground/i, key: 'floor' },
    { pattern: /carpet|rug/i, key: 'carpet' },
    { pattern: /curtain|drape/i, key: 'curtain' }
  ]
  
  for (const { pattern, key } of matchPatterns) {
    if (pattern.test(lowerName)) {
      return objectInfoDatabase[key]
    }
  }
  
  // If no match, return generic info
  return {
    name: clickedName,
    description: 'An interesting object in this Victorian drawing room.',
    details: [
      'Part of the room\'s authentic Victorian decoration',
      'Carefully preserved historical piece',
      'Contributes to the room\'s elegant atmosphere'
    ],
    category: 'Room Element'
  }
}

/**
 * UI Component - First Person Room Navigation with Click-Drag Look
 * 
 * This component provides:
 * 1. First-person control instructions with click-drag look
 * 2. Object information panel for room interactions
 * 3. Click and drag instructions
 * 4. Room exploration guidance with zoom capability
 * 5. Crosshair for targeting
 */
interface UIProps {
  selectedObject?: string | null
  onCloseObjectInfo?: () => void
  onInfoButtonClick?: (objectName: string) => void
  onCameraDisableChange?: (disabled: boolean) => void
}

function UI({ selectedObject = null, onCloseObjectInfo, onInfoButtonClick, onCameraDisableChange }: UIProps) {
  const [showInstructions, setShowInstructions] = useState(true)
  const [showMouseHint, setShowMouseHint] = useState(true)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [modalObjectInfo, setModalObjectInfo] = useState<any>(null)
  
  // Debug: Check if callback is received
  console.log('UI: onInfoButtonClick callback available:', !!onInfoButtonClick)
  
  // Get detailed object information
  const objectInfo = getObjectInfo(selectedObject)

  // Hide instructions after a longer time for first-time users
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false)
    }, 15000) // Hide after 15 seconds for room exploration

    return () => clearTimeout(timer)
  }, [])

  // Hide mouse hint after user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      setShowMouseHint(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Hide hint on any movement key
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(event.code)) {
        setShowMouseHint(false)
      }
    }

    const handleMouseMove = () => {
      setShowMouseHint(false)
    }

    const handleMouseDown = () => {
      setShowMouseHint(false)
    }

    const handleWheel = () => {
      setShowMouseHint(false)
    }

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('wheel', handleWheel)

    // Auto-hide after 8 seconds even without interaction
    const autoHideTimer = setTimeout(() => {
      setShowMouseHint(false)
    }, 8000)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('wheel', handleWheel)
      clearTimeout(autoHideTimer)
    }
  }, [])

  // Find object info with fuzzy matching
  const findObjectInfo = (objectName: string) => {
    if (!objectName) return null
    
    const normalizedName = objectName.toLowerCase()
    
    // Direct match
    if (objectInfoDatabase[normalizedName]) {
      return objectInfoDatabase[normalizedName]
    }
    
    // Fuzzy matching
    for (const [key, info] of Object.entries(objectInfoDatabase)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return info
      }
    }
    
    // Check if name contains common furniture/object terms
    const keywords = ['chair', 'table', 'sofa', 'painting', 'vase', 'lamp', 'fireplace']
    for (const keyword of keywords) {
      if (normalizedName.includes(keyword) && objectInfoDatabase[keyword]) {
        return objectInfoDatabase[keyword]
      }
    }
    
    return objectInfoDatabase.default
  }

  // Handle info button click (use callback from App.tsx or local handler)
  const handleInfoButtonClick = (objectName: string) => {
    console.log('🔍 UI: handleInfoButtonClick called with:', objectName)
    console.log('🔍 UI: onInfoButtonClick available:', !!onInfoButtonClick)
    
    // If parent provides callback, use it
    if (onInfoButtonClick) {
      console.log('🔍 UI: Calling parent callback')
      onInfoButtonClick(objectName)
    }
    
    // Show info card locally
    const info = findObjectInfo(objectName)
    console.log('🔍 UI: Found info for object:', info)
    if (info) {
      console.log('🔍 UI: Setting modal info and showing modal')
      setModalObjectInfo(info)
      setShowInfoModal(true)
    } else {
      console.log('❌ UI: No info found for object:', objectName)
    }
  }

  // Close info modal function with enhanced debugging and cleanup
  const closeInfoModal = () => {
    console.log('🔴 UI: closeInfoModal function called')
    
    try {
      // Update states
      setShowInfoModal(false)
      setModalObjectInfo(null)
      
      // Re-enable camera controls
      if (onCameraDisableChange) {
        console.log('🔴 UI: Re-enabling camera controls')
        onCameraDisableChange(false)
      }
      
      // Call parent close handler if available
      if (onCloseObjectInfo) {
        console.log('🔴 UI: Calling parent close handler')
        onCloseObjectInfo()
      }
      
      console.log('🔴 UI: Modal successfully closed')
    } catch (error) {
      console.error('🔴 UI: Error closing modal:', error)
    }
  }

  // Enhanced ESC key listener with better event handling
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showInfoModal) {
        console.log('🔴 UI: ESC key pressed, closing modal')
        event.preventDefault()
        event.stopPropagation()
        closeInfoModal()
      }
    }

    if (showInfoModal) {
      // Add to document for global capture
      document.addEventListener('keydown', handleEscapeKey, true)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey, true)
      document.body.style.overflow = 'auto'
    }
  }, [showInfoModal])

  // Global click debugging when modal is open
  useEffect(() => {
    if (showInfoModal) {
      const globalClickDebug = (event: MouseEvent) => {
        console.log('🔍 Global click detected:', {
          target: event.target,
          clientX: event.clientX,
          clientY: event.clientY,
          button: event.button
        })
      }

      document.addEventListener('click', globalClickDebug, true)
      
      return () => {
        document.removeEventListener('click', globalClickDebug, true)
      }
    }
  }, [showInfoModal])

  // Enhanced modal state and camera disable logic
  useEffect(() => {
    console.log('🔴 UI: Modal state changed - showInfoModal:', showInfoModal, 'modalObjectInfo:', !!modalObjectInfo)
    
    // Disable camera controls when modal is open
    if (onCameraDisableChange) {
      console.log('🔴 UI: Setting camera disabled to:', showInfoModal)
      onCameraDisableChange(showInfoModal)
    }

    // Prevent body interactions when modal is open but DON'T disable canvas pointer events
    // The CameraController will handle the disabling internally
    if (showInfoModal) {
      console.log('🔴 UI: Modal opened - camera controls disabled via props')
    } else {
      console.log('🔴 UI: Modal closed - camera controls re-enabled')
    }
  }, [showInfoModal, modalObjectInfo, onCameraDisableChange])

  // Listen for info button clicks via custom events
  useEffect(() => {
    const handleInfoButtonEvent = (event: CustomEvent) => {
      const { objectName } = event.detail
      console.log('🔍 UI: Received info button event for:', objectName)
      handleInfoButtonClick(objectName)
    }

    // Add event listener
    window.addEventListener('infoButtonClick', handleInfoButtonEvent as EventListener)

    // Cleanup
    return () => {
      window.removeEventListener('infoButtonClick', handleInfoButtonEvent as EventListener)
    }
  }, [])

  return (
    <div className="ui-overlay">
      {/* Crosshair for first-person targeting */}
      <div className="crosshair"></div>
      
      {/* Instructions Panel */}
      {showInstructions && (
        <div className="ui-panel instructions">
          <h3>🏠 Room Navigation & Detail Inspection</h3>
          <p><strong>Getting Started:</strong></p>
          <p>• Ready to explore immediately!</p>
          <p>• Click and drag to look around</p>
          
          <p><strong>Camera Control:</strong></p>
          <p>• <strong>Click + Drag:</strong> Look around the room</p>
          <p>• Hold left mouse button and move to rotate view</p>
          <p>• Release mouse to stop looking</p>
          
          <p><strong>Movement:</strong></p>
          <p>• Arrow Keys or WASD to walk</p>
          <p>• ↑/W: Walk forward</p>
          <p>• ↓/S: Walk backward</p>
          <p>• ←/A: Strafe left</p>
          <p>• →/D: Strafe right</p>
          
          <p><strong>🔍 Detail Inspection:</strong></p>
          <p>• <strong>Mouse Scroll:</strong> Zoom in/out</p>
          <p>• Zoom in to examine objects closely</p>
          <p>• Zoom out for wider room view</p>
          <p>• Perfect for inspecting artwork, details, textures</p>
          
          <p><strong>Interaction:</strong></p>
          <p>• Click on objects to examine them</p>
          <p>• Use zoom + click for detailed inspection</p>
          <p>• Explore every corner of the room!</p>
          
          <button 
            onClick={() => setShowInstructions(false)}
            style={{
              marginTop: '10px',
              padding: '8px 12px',
              background: '#00ff88',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Start Exploring!
          </button>
        </div>
      )}

      {/* Object Information Panel */}
      {selectedObject && objectInfo && (
        <div className="ui-panel info-panel visible">
          <h3>🔍 {objectInfo.name}</h3>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ 
              display: 'inline-block',
              padding: '2px 8px', 
              background: 'rgba(0, 255, 136, 0.2)', 
              color: '#00ff88',
              borderRadius: '12px',
              fontSize: '0.75em',
              fontWeight: 'bold'
            }}>
              {objectInfo.category}
            </span>
          </div>
          
          <p style={{ marginBottom: '15px', lineHeight: '1.4' }}>
            {objectInfo.description}
          </p>
          
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#00ff88', fontSize: '0.9em' }}>Details:</h4>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85em' }}>
              {objectInfo.details.map((detail, index) => (
                <li key={index} style={{ marginBottom: '4px', lineHeight: '1.3' }}>
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          {objectInfo.historicalInfo && (
            <div style={{ 
              marginBottom: '15px',
              padding: '10px',
              background: 'rgba(0, 255, 136, 0.1)',
              borderRadius: '4px',
              borderLeft: '3px solid #00ff88'
            }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#00ff88', fontSize: '0.85em' }}>
                📚 Historical Context:
              </h4>
              <p style={{ margin: 0, fontSize: '0.8em', lineHeight: '1.3', fontStyle: 'italic' }}>
                {objectInfo.historicalInfo}
              </p>
            </div>
          )}
          
          <div style={{ margin: '15px 0 10px 0', fontSize: '0.75em', opacity: 0.8 }}>
            <p>💡 <strong>Tip:</strong> Use mouse scroll to zoom in and examine fine details closely</p>
          </div>
          
          <button
            onClick={() => setShowInstructions(true)}
            style={{
              marginTop: '10px',
              padding: '8px 15px',
              background: '#ff4444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ✕ Close Details
          </button>
        </div>
      )}

      {/* Toggle Instructions Button */}
      {!showInstructions && (
        <button
          onClick={() => setShowInstructions(true)}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            padding: '10px 15px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#00ff88',
            border: '1px solid #00ff88',
            borderRadius: '4px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          📖 Show Controls
        </button>
      )}

      {/* Mouse Control Indicator */}
      <div 
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '8px 12px',
          background: 'rgba(0, 0, 0, 0.6)',
          color: '#00ff88',
          borderRadius: '4px',
          fontSize: '0.8em',
          fontFamily: 'monospace',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(0, 255, 136, 0.3)'
        }}
      >
        <div>🖱️ Mouse Controls</div>
        <div style={{ fontSize: '0.7em', opacity: 0.8, marginTop: '2px' }}>
          Click + Drag: Look | Scroll: Zoom
        </div>
      </div>

      {/* Mouse Control Hint */}
      {showMouseHint && (
        <div 
          style={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '15px 20px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '1em',
            pointerEvents: 'none',
            opacity: 0.7,
            transition: 'opacity 0.3s ease',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          className="mouse-control-hint"
        >
          <p>🖱️ Click and drag to look around</p>
          <p style={{ fontSize: '0.85em', opacity: 0.8, marginTop: '5px' }}>Scroll wheel to zoom in/out</p>
          <p style={{ fontSize: '0.75em', opacity: 0.6, marginTop: '5px' }}>Use WASD or arrow keys to move</p>
        </div>
      )}

      {/* Test Button for InfoModal */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log('🧪 Test button clicked - triggering modal')
          const testInfo = findObjectInfo('sofa')
          console.log('🧪 Test info found:', testInfo)
          setModalObjectInfo(testInfo)
          setShowInfoModal(true)
        }}
        onMouseEnter={() => console.log('🧪 Test button mouse enter')}
        onMouseLeave={() => console.log('🧪 Test button mouse leave')}
        onMouseDown={() => console.log('🧪 Test button mouse down')}
        onMouseUp={() => console.log('🧪 Test button mouse up')}
        style={{
          position: 'absolute',
          top: '60px',
          right: '20px',
          padding: '10px 15px',
          background: '#ff8800',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          zIndex: 1000
        }}
      >
        🧪 Test Modal
      </button>

      {/* Room Experience Info */}
      <div 
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '10px',
          background: 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
          borderRadius: '4px',
          fontSize: '0.8em',
          fontFamily: 'monospace'
        }}
      >
        <div>🏠 Virtual Room Experience</div>
        <div>Click-Drag Look + Detail Zoom</div>
      </div>

      {/* Enhanced Info Modal with better event handling */}
      {showInfoModal && modalObjectInfo && (
        <>
          {/* Enhanced Overlay to close modal when clicking outside */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              zIndex: 15000,
              cursor: 'pointer'
            }}
            onClick={(e) => {
              console.log('🔴 UI: Overlay clicked, closing modal')
              e.stopPropagation()
              closeInfoModal()
            }}
            onMouseDown={() => console.log('🔴 UI: Overlay mouse down')}
            onMouseUp={() => console.log('🔴 UI: Overlay mouse up')}
          />
          
          {/* Modal Content */}
          <div 
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              border: '2px solid #00ff88',
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '400px',
              maxHeight: '80vh',
              overflowY: 'auto',
              zIndex: 20000,
              boxShadow: '0 10px 30px rgba(0, 255, 136, 0.3)',
              color: '#fff',
              pointerEvents: 'auto'
            }}
            onClick={(e) => {
              console.log('🔴 Modal content clicked - preventing propagation')
              e.stopPropagation()
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#00ff88', fontSize: '1.3em' }}>
                {modalObjectInfo.name}
              </h3>
              <button
                onClick={(e) => {
                  console.log('🔴 UI: X Close button clicked')
                  e.stopPropagation()
                  closeInfoModal()
                }}
                onMouseEnter={(e) => {
                  console.log('🔴 UI: X button mouse enter')
                  const button = e.target as HTMLButtonElement
                  button.style.background = 'rgba(255, 0, 0, 0.3)'
                }}
                onMouseLeave={(e) => {
                  console.log('🔴 UI: X button mouse leave')
                  const button = e.target as HTMLButtonElement
                  button.style.background = 'transparent'
                }}
                onMouseDown={() => console.log('🔴 UI: X button mouse down')}
                onMouseUp={() => console.log('🔴 UI: X button mouse up')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease',
                  pointerEvents: 'auto',
                  zIndex: 21000
                }}
              >
                ✕
              </button>
            </div>

            {/* Category Badge */}
            <div style={{ marginBottom: '15px' }}>
              <span style={{
                background: 'rgba(0, 255, 136, 0.2)',
                color: '#00ff88',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.8em',
                fontWeight: 'bold'
              }}>
                {modalObjectInfo.category}
              </span>
            </div>

            {/* Description */}
            <p style={{ lineHeight: 1.5, marginBottom: '15px', fontSize: '0.95em' }}>
              {modalObjectInfo.description}
            </p>

            {/* Details */}
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ color: '#00ff88', margin: '0 0 8px 0', fontSize: '1em' }}>
                Chi tiết:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9em' }}>
                {modalObjectInfo.details.map((detail: string, index: number) => (
                  <li key={index} style={{ marginBottom: '5px', lineHeight: 1.4 }}>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Historical Info */}
            {modalObjectInfo.historicalInfo && (
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                borderLeft: '3px solid #00ff88',
                marginBottom: '15px'
              }}>
                <h4 style={{ color: '#00ff88', margin: '0 0 8px 0', fontSize: '0.9em' }}>
                  📚 Lịch sử:
                </h4>
                <p style={{ margin: 0, fontSize: '0.85em', lineHeight: 1.4, fontStyle: 'italic' }}>
                  {modalObjectInfo.historicalInfo}
                </p>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={(e) => {
                console.log('🔴 UI: Main close button clicked')
                e.stopPropagation()
                closeInfoModal()
              }}
              onMouseEnter={(e) => {
                console.log('🔴 UI: Main button mouse enter')
                const button = e.target as HTMLButtonElement
                button.style.transform = 'translateY(-2px)'
                button.style.boxShadow = '0 4px 12px rgba(0, 255, 136, 0.3)'
              }}
              onMouseLeave={(e) => {
                console.log('🔴 UI: Main button mouse leave')
                const button = e.target as HTMLButtonElement
                button.style.transform = 'translateY(0)'
                button.style.boxShadow = 'none'
              }}
              onMouseDown={() => console.log('🔴 UI: Main button mouse down')}
              onMouseUp={() => console.log('🔴 UI: Main button mouse up')}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #00ff88 0%, #00cc70 100%)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.95em',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                pointerEvents: 'auto',
                zIndex: 21000
              }}
            >
              Đóng thông tin
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default UI 