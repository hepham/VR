import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { Mesh, Group } from 'three'
import CameraController from './CameraController'
import InteractiveModel from './InteractiveModel'
import Lighting from './Lighting'
import Ground from './Ground'

interface ThreeSceneProps {
  selectedObject: string | null
  onObjectSelect: (objectName: string | null) => void
  cameraDisabled?: boolean
}

/**
 * ThreeScene Component - First Person Room Experience
 * 
 * This is the main 3D scene that contains:
 * 1. The 3D room model loaded from GLB
 * 2. Lighting setup optimized for interior spaces
 * 3. First-person camera controls (mouse + keyboard)
 * 4. Interactive elements within the room
 * 5. Environment suited for indoor scenes
 */
function ThreeScene({ selectedObject, onObjectSelect, cameraDisabled = false }: ThreeSceneProps) {
  // Ref for the main scene group
  const sceneRef = useRef<Group>(null)

  return (
    <group ref={sceneRef}>
      {/* First-Person Camera Controls - mouse look + keyboard movement */}
      <CameraController disabled={cameraDisabled} />
      
      {/* Lighting Setup optimized for indoor scenes */}
      <Lighting />
      
      {/* Environment - provides ambient lighting and reflections for interior */}
      <Environment preset="apartment" />
      
      {/* Interactive 3D Room Model */}
      <InteractiveModel 
        onObjectClick={onObjectSelect}
        selectedObject={selectedObject}
      />
      
      {/* Ground Plane (if needed - room model should have its own floor) */}
      <Ground />
      
      {/* Contact Shadows for more realistic ground shadows */}
      <ContactShadows
        opacity={0.3}
        scale={10}
        blur={1}
        far={5}
        resolution={256}
        color="#000000"
      />
    </group>
  )
}

export default ThreeScene 