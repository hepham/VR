import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import ThreeScene from './components/ThreeScene'
import LoadingScreen from './components/LoadingScreen'
import UI from './components/UI'
import './App.css'

/**
 * Main App Component
 * 
 * This is the root component that sets up:
 * 1. Canvas - The main Three.js rendering context from @react-three/fiber
 * 2. Suspense - For handling async loading of 3D models
 * 3. ThreeScene - Our custom 3D scene component
 * 4. UI - Overlay UI for instructions and interactions
 * 5. Object selection state management
 * 6. Info button modal handling
 */
function App() {
  // State for tracking selected objects for detailed information
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  // State for tracking when camera should be disabled (when modal is open)
  const [cameraDisabled, setCameraDisabled] = useState(false)

  // Handler to close object information panel
  const handleCloseObjectInfo = () => {
    setSelectedObject(null)
  }

  return (
    <div className="App">
      {/* Three.js Canvas - Main 3D Rendering Context */}
      <Canvas
        camera={{ 
          position: [0, 1.6, 5], // Human eye height (1.6m) starting 5 units back
          fov: 75,               // Field of view for natural perspective
          near: 0.1,            // Near clipping plane
          far: 1000             // Far clipping plane for large rooms
        }}
        style={{ width: '100vw', height: '100vh' }}
      >
        {/* Suspense for 3D model loading */}
        <Suspense fallback={<LoadingScreen />}>
          <ThreeScene 
            selectedObject={selectedObject}
            onObjectSelect={setSelectedObject}
            cameraDisabled={cameraDisabled}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay - Controls, Instructions, and Object Information */}
      <UI 
        selectedObject={selectedObject}
        onCloseObjectInfo={handleCloseObjectInfo}
        onCameraDisableChange={setCameraDisabled}
      />
    </div>
  )
}

export default App
