import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'

/**
 * LoadingScreen Component - 3D Loading Display
 * 
 * This component shows while:
 * 1. The GLB model is loading
 * 2. Three.js is initializing
 * 3. Textures are being processed
 * 
 * Uses 3D elements compatible with React Three Fiber
 */
function LoadingScreen() {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)

  // Animate the loading spinner
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.elapsedTime * 2
      sphereRef.current.rotation.y = state.clock.elapsedTime * 1.5
    }
    
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      {/* Animated loading spinner */}
      <Sphere ref={sphereRef} args={[0.5, 16, 16]} position={[0, 1, 0]}>
        <meshStandardMaterial 
          color="#00ff88" 
          emissive="#004422"
          wireframe 
        />
      </Sphere>
      
      {/* Loading text */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Loading 3D Scene...
      </Text>
      
      {/* Subtitle */}
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.15}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
      >
        Please wait while we load the experience
      </Text>
      
      {/* Progress indicators */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.1}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
      >
        • Loading 3D model • Initializing WebGL • Setting up interactions
      </Text>
      
      {/* Background sphere for ambient lighting */}
      <Sphere args={[10, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#111111" 
          transparent 
          opacity={0.3} 
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Basic lighting for the loading screen */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00ff88" />
    </group>
  )
}

export default LoadingScreen 