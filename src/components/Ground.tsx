import { useRef } from 'react'
import { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'

/**
 * Ground Component
 * 
 * This component creates:
 * 1. A large ground plane for the scene
 * 2. Receives shadows from objects above
 * 3. Has a subtle material with grid pattern
 */
function Ground() {
  const groundRef = useRef<Mesh>(null)

  return (
    <>
      {/* Main Ground Plane */}
      <mesh
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]} // Rotate to be horizontal
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#f0f0f0"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Optional: Grid Helper Plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.09, 0]}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial 
          color="#e0e0e0"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
    </>
  )
}

export default Ground 