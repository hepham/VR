import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DirectionalLight } from 'three'

/**
 * Lighting Component
 * 
 * This component sets up the lighting for the 3D scene:
 * 1. Ambient Light - provides overall illumination
 * 2. Directional Light - simulates sunlight with shadows
 * 3. Point Lights - for additional accent lighting
 */
function Lighting() {
  const directionalLightRef = useRef<DirectionalLight>(null)

  // Optional: animate the directional light
  useFrame((state) => {
    if (directionalLightRef.current) {
      // Subtle movement of the sun position
      const time = state.clock.elapsedTime * 0.1
      directionalLightRef.current.position.x = Math.sin(time) * 10
      directionalLightRef.current.position.z = Math.cos(time) * 10
    }
  })

  return (
    <>
      {/* Ambient Light - provides soft overall illumination */}
      <ambientLight 
        intensity={0.4} 
        color="#ffffff"
      />
      
      {/* Directional Light - simulates sun/main light source */}
      <directionalLight
        ref={directionalLightRef}
        position={[10, 10, 5]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />
      
      {/* Additional Point Lights for accent lighting */}
      <pointLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#ffaa77"
        distance={20}
        decay={2}
      />
      
      <pointLight
        position={[5, 3, 5]}
        intensity={0.2}
        color="#77aaff"
        distance={15}
        decay={2}
      />
      
      {/* Hemisphere Light for natural sky-ground lighting */}
      <hemisphereLight
        args={['#87CEEB', '#8B4513', 0.3]} // sky color, ground color, intensity
      />
    </>
  )
}

export default Lighting 