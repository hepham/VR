import { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh, Material } from 'three'
import * as THREE from 'three'
import InfoButton from './InfoButton'

// Configuration for info button positions on objects
const infoButtonConfigs = [
  { objectName: 'chair', position: [2, 1.5, 0] as [number, number, number] },
  { objectName: 'table', position: [0, 1.2, -2] as [number, number, number] },
  { objectName: 'sofa', position: [-3, 1.3, 1] as [number, number, number] },
  { objectName: 'painting', position: [0, 2.5, -4] as [number, number, number] },
  { objectName: 'fireplace', position: [4, 1.8, 0] as [number, number, number] },
  { objectName: 'lamp', position: [1, 3, 1] as [number, number, number] },
  { objectName: 'vase', position: [-2, 1.4, -1] as [number, number, number] },
  { objectName: 'sculpture', position: [-4, 1.6, -2] as [number, number, number] }
]

interface InteractiveModelProps {
  onObjectClick: (objectName: string | null) => void
  selectedObject: string | null
}

/**
 * InteractiveModel Component
 * 
 * This component:
 * 1. Loads the GLB model using useGLTF hook
 * 2. Makes all meshes in the model clickable
 * 3. Highlights clicked objects
 * 4. Provides object information on click
 * 5. Fixes texture and material issues from Blender export
 * 6. Handles material uniform errors with fallbacks
 */
function InteractiveModel({ onObjectClick, selectedObject }: InteractiveModelProps) {
  // Load the GLB model - useGLTF automatically suspends until loaded
  const { scene, nodes, materials } = useGLTF('/the_great_drawing_room.glb')
  
  // Ref for the model group
  const modelRef = useRef<Group>(null)
  
  // State for hovered object
  const [hoveredObject, setHoveredObject] = useState<string | null>(null)

  // Clone the scene to avoid modifying the original
  const clonedScene = scene.clone()

  // Create fallback materials for when original materials fail
  const createFallbackMaterial = (originalMaterial: any) => {
    try {
      // Create a basic material as fallback
      const fallback = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.7,
        metalness: 0.1
      })
      
      // Try to copy basic properties if they exist
      if (originalMaterial) {
        if (originalMaterial.color) fallback.color = originalMaterial.color.clone()
        if (originalMaterial.map) fallback.map = originalMaterial.map
        if (originalMaterial.roughness !== undefined) fallback.roughness = originalMaterial.roughness
        if (originalMaterial.metalness !== undefined) fallback.metalness = originalMaterial.metalness
      }
      
      return fallback
    } catch (error) {
      console.warn('Fallback material creation failed, using basic material')
      return new THREE.MeshStandardMaterial({ color: 0x888888 })
    }
  }

  // Fix texture and material issues
  useEffect(() => {
    console.log('🔧 Fixing textures and materials...')
    console.log('Available materials:', Object.keys(materials))
    
    // Function to safely fix material issues
    const fixMaterial = (material: any) => {
      if (!material) return
      
      try {
        // Ensure proper material settings for textures
        if (material.map) {
          material.map.flipY = false
          material.map.generateMipmaps = true
          material.map.minFilter = THREE.LinearMipmapLinearFilter
          material.map.magFilter = THREE.LinearFilter
          material.map.needsUpdate = true
        }
        
        // Fix material properties with safety checks
        if (typeof material.side !== 'undefined') {
          material.side = THREE.FrontSide
        }
        if (typeof material.opacity !== 'undefined') {
          material.transparent = material.opacity < 1
        }
        if (typeof material.alphaTest !== 'undefined') {
          material.alphaTest = 0.1
        }
        if (typeof material.depthWrite !== 'undefined') {
          material.depthWrite = true
        }
        
        // Force material update
        material.needsUpdate = true
        
        // Log material info for debugging
        console.log(`Fixed material: ${material.name || 'unnamed'}`, {
          hasMap: !!material.map,
          hasNormal: !!material.normalMap,
          opacity: material.opacity,
          transparent: material.transparent,
          type: material.type
        })
      } catch (error) {
        console.warn('Failed to fix material:', material.name, error)
      }
    }
    
    // Function to recursively fix all materials in the scene
    const fixSceneMaterials = (object: any) => {
      if (object.isMesh && object.material) {
        try {
          if (Array.isArray(object.material)) {
            // Check and fix each material in array
            object.material = object.material.map((mat: any) => {
              try {
                fixMaterial(mat)
                return mat
              } catch (error) {
                console.warn('Material corrupted, replacing with fallback:', error)
                return createFallbackMaterial(mat)
              }
            })
          } else {
            try {
              fixMaterial(object.material)
            } catch (error) {
              console.warn('Material corrupted, replacing with fallback:', error)
              object.material = createFallbackMaterial(object.material)
            }
          }
          
          // Ensure proper geometry
          if (object.geometry) {
            object.geometry.computeVertexNormals()
            object.geometry.computeBoundingBox()
          }
        } catch (error) {
          console.warn('Failed to fix object materials, using fallback:', object.name, error)
          // As a last resort, assign a basic fallback material
          object.material = createFallbackMaterial(null)
        }
      }
      
      // Process children
      if (object.children) {
        object.children.forEach(fixSceneMaterials)
      }
    }
    
    try {
      // Fix all materials in loaded materials object
      Object.values(materials).forEach(fixMaterial)
      
      // Fix all materials in the scene
      fixSceneMaterials(clonedScene)
      
      console.log('✅ Texture fixing complete!')
    } catch (error) {
      console.error('Material fixing failed:', error)
    }
  }, [materials, clonedScene])

  // Function to handle click on any mesh in the model
  const handleMeshClick = (event: any, meshName: string) => {
    event.stopPropagation()
    console.log('Clicked on:', meshName)
    onObjectClick(meshName)
  }

  // Function to handle hover on any mesh
  const handleMeshHover = (event: any, meshName: string) => {
    event.stopPropagation()
    setHoveredObject(meshName)
    document.body.style.cursor = 'pointer'
  }

  // Function to handle hover out
  const handleMeshHoverOut = () => {
    setHoveredObject(null)
    document.body.style.cursor = 'auto'
  }

  // Safely clone material with proper error handling
  const safeMaterialClone = (material: any, emissiveColor: number) => {
    try {
      if (!material) return createFallbackMaterial(null)
      
      if (Array.isArray(material)) {
        return material.map(mat => {
          try {
            const cloned = mat.clone()
            if (cloned.emissive) {
              cloned.emissive = new THREE.Color(emissiveColor)
            }
            return cloned
          } catch (error) {
            console.warn('Individual material clone failed, using fallback')
            const fallback = createFallbackMaterial(mat)
            if (fallback.emissive) {
              fallback.emissive = new THREE.Color(emissiveColor)
            }
            return fallback
          }
        })
      } else {
        const cloned = material.clone()
        if (cloned.emissive) {
          cloned.emissive = new THREE.Color(emissiveColor)
        }
        return cloned
      }
    } catch (error) {
      console.warn('Material clone failed completely, using fallback:', error)
      const fallback = createFallbackMaterial(material)
      if (fallback.emissive) {
        fallback.emissive = new THREE.Color(emissiveColor)
      }
      return fallback
    }
  }

  // Recursively make all meshes in the model interactive
  const makeInteractive = (object: any, parentName = '') => {
    if (object.isMesh) {
      const meshName = object.name || `${parentName}_mesh_${Math.random()}`
      
      try {
        // Store original material
        const originalMaterial = object.material
        
        // Create hover and select materials with safe cloning
        const hoverMaterial = safeMaterialClone(originalMaterial, 0x444444)
        const selectMaterial = safeMaterialClone(originalMaterial, 0x00ff88)

        // Apply material based on state
        if (selectedObject === meshName) {
          object.material = selectMaterial
        } else if (hoveredObject === meshName) {
          object.material = hoverMaterial
        } else {
          object.material = originalMaterial
        }

        // Add click and hover handlers
        object.onClick = (event: any) => handleMeshClick(event, meshName)
        object.onPointerOver = (event: any) => handleMeshHover(event, meshName)
        object.onPointerOut = handleMeshHoverOut
        
        // Store original properties for restoration
        object.userData = {
          originalMaterial,
          hoverMaterial,
          selectMaterial,
          meshName
        }
      } catch (error) {
        console.warn('Failed to make object interactive:', meshName, error)
      }
    }

    // Recursively process children
    if (object.children) {
      object.children.forEach((child: any) => 
        makeInteractive(child, object.name || parentName)
      )
    }
  }

  // Apply interactivity to the cloned scene
  makeInteractive(clonedScene)

  // Animation loop for any dynamic effects
  useFrame((state, delta) => {
    if (modelRef.current) {
      // Add subtle rotation or animation here if desired
      // modelRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group ref={modelRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
      <primitive 
        object={clonedScene}
        onClick={(event: any) => {
          // Handle clicks on the model
          const intersectedObject = event.intersections[0]?.object
          if (intersectedObject && intersectedObject.userData.meshName) {
            handleMeshClick(event, intersectedObject.userData.meshName)
          }
        }}
        onPointerOver={(event: any) => {
          // Handle hover on the model
          const intersectedObject = event.intersections[0]?.object
          if (intersectedObject && intersectedObject.userData.meshName) {
            handleMeshHover(event, intersectedObject.userData.meshName)
          }
        }}
        onPointerOut={handleMeshHoverOut}
      />
      
      {/* Info buttons positioned on key objects */}
      {infoButtonConfigs.map((config, index) => (
        <InfoButton
          key={`info-${config.objectName}-${index}`}
          position={config.position}
          objectName={config.objectName}
        />
      ))}
    </group>
  )
}

// Preload the model for better performance
useGLTF.preload('/the_great_drawing_room.glb')

export default InteractiveModel 