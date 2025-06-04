import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'

interface InfoButtonProps {
  position: [number, number, number]
  objectName: string
}

/**
 * InfoButton Component - 3D Information Button
 * 
 * This component creates a white spherical button that:
 * 1. Hovers slightly above objects
 * 2. Has an "i" icon for information
 * 3. Glows and animates on hover
 * 4. Triggers info display when clicked using custom events
 */
function InfoButton({ position, objectName }: InfoButtonProps) {
  const buttonRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Animation for floating effect
  useFrame((state) => {
    if (buttonRef.current) {
      // Gentle floating animation
      buttonRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05
      
      // Gentle rotation
      buttonRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  const handleClick = (event: any) => {
    event.stopPropagation()
    setClicked(true)
    
    // Debug logging
    console.log('🔍 Info button clicked for object:', objectName)
    
    // Dispatch custom event để UI có thể listen
    const customEvent = new CustomEvent('infoButtonClick', {
      detail: { objectName }
    })
    window.dispatchEvent(customEvent)
    
    // Reset click state after animation
    setTimeout(() => setClicked(false), 200)
  }

  const handlePointerOver = (event: any) => {
    event.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  return (
    <group 
      ref={buttonRef}
      position={position}
      scale={hovered ? [1.2, 1.2, 1.2] : clicked ? [0.9, 0.9, 0.9] : [1, 1, 1]}
    >
      {/* Outer glow effect */}
      <Sphere args={[0.08, 16, 16]}>
        <meshBasicMaterial 
          color={hovered ? "#00ff88" : "#ffffff"} 
          transparent 
          opacity={hovered ? 0.3 : 0.1}
        />
      </Sphere>
      
      {/* Main button */}
      <Sphere 
        args={[0.06, 16, 16]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial 
          color={hovered ? "#e0e0e0" : "#ffffff"}
          emissive={hovered ? "#444444" : "#000000"}
          roughness={0.1}
          metalness={0.1}
        />
      </Sphere>
      
      {/* Info icon "i" */}
      <Text
        position={[0, 0, 0.07]}
        fontSize={0.08}
        color={hovered ? "#00ff88" : "#333333"}
        anchorX="center"
        anchorY="middle"
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        i
      </Text>
      
      {/* Pulsing effect when hovered */}
      {hovered && (
        <Sphere args={[0.1, 16, 16]}>
          <meshBasicMaterial 
            color="#00ff88" 
            transparent 
            opacity={0.1}
          />
        </Sphere>
      )}
    </group>
  )
}

export default InfoButton 