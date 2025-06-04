import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Euler, PerspectiveCamera } from 'three'
import * as THREE from 'three'

interface CameraControllerProps {
  disabled?: boolean
}

/**
 * CameraController Component - First Person Navigation with Click-Drag Look
 * 
 * This component provides first-person movement like walking inside a room:
 * 1. Click and drag mouse to look around (no pointer lock)
 * 2. Arrow keys control movement (forward/backward/left/right)
 * 3. Mouse scroll for zoom (FOV adjustment for detail inspection)
 * 4. Human-like movement with realistic constraints
 * 5. Can be disabled when UI modals are open
 * 
 * Controls:
 * - Click + Drag Mouse: Look around (first-person view)
 * - Mouse Scroll: Zoom in/out to see details
 * - Arrow Up/W: Move forward
 * - Arrow Down/S: Move backward  
 * - Arrow Left/A: Strafe left
 * - Arrow Right/D: Strafe right
 * - Space: Move up (for debugging)
 * - Shift: Move down (for debugging)
 */
function CameraController({ disabled = false }: CameraControllerProps) {
  const { camera, gl } = useThree()
  
  // Movement state
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false
  })

  // Mouse look state
  const mouseState = useRef({
    isMouseDown: false,
    lastX: 0,
    lastY: 0,
    currentX: 0,
    currentY: 0
  })

  // Camera rotation
  const rotation = useRef({ x: 0, y: 0 })
  
  // Zoom state
  const zoomState = useRef({
    currentFOV: 75, // Default FOV
    targetFOV: 75,
    minFOV: 20,     // Maximum zoom in
    maxFOV: 90,     // Maximum zoom out
    zoomSpeed: 5    // How fast zoom responds
  })
  
  // Movement settings
  const moveSpeed = 3 // Human walking speed
  const lookSpeed = 0.005 // Mouse sensitivity (increased for click-drag)
  const maxLookUp = Math.PI / 2.1 // Limit how far up you can look (85 degrees - increased from 60)
  const maxLookDown = -Math.PI / 3 // Limit how far down you can look
  
  const velocity = useRef(new Vector3())
  const direction = useRef(new Vector3())

  // Log disabled state changes
  useEffect(() => {
    console.log('🎮 CameraController: disabled state changed to:', disabled)
    
    // Reset movement state when disabled
    if (disabled) {
      moveState.current = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false
      }
      mouseState.current.isMouseDown = false
      
      // Reset canvas cursor
      if (gl.domElement) {
        gl.domElement.style.cursor = 'default'
      }
      
      console.log('🎮 CameraController: Reset all movement states due to disabled=true')
    } else {
      // Restore cursor when re-enabled
      if (gl.domElement) {
        gl.domElement.style.cursor = 'grab'
      }
      console.log('🎮 CameraController: Re-enabled camera controls')
    }
  }, [disabled, gl])

  // Handle zoom with mouse wheel
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      // Don't handle wheel events if disabled
      if (disabled) {
        console.log('🎮 CameraController: Wheel event blocked (disabled)')
        return
      }
      
      event.preventDefault()
      
      // Determine zoom direction (scroll up = zoom in, scroll down = zoom out)
      const zoomDirection = event.deltaY > 0 ? 1 : -1
      const zoomAmount = zoomDirection * 5 // Zoom step size
      
      // Calculate new target FOV
      const newTargetFOV = zoomState.current.targetFOV + zoomAmount
      
      // Update target FOV with proper bounds
      zoomState.current.targetFOV = Math.max(
        zoomState.current.minFOV,
        Math.min(zoomState.current.maxFOV, newTargetFOV)
      )
      
      // Debug logging
      console.log(`🎮 Zoom: direction=${zoomDirection}, deltaY=${event.deltaY}, newFOV=${zoomState.current.targetFOV}`)
    }

    // Add wheel event listener to canvas
    const canvas = gl.domElement
    canvas.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      canvas.removeEventListener('wheel', handleWheel)
    }
  }, [gl, disabled])

  // Handle click and drag mouse look
  useEffect(() => {
    const canvas = gl.domElement

    const handleMouseDown = (event: MouseEvent) => {
      // Don't handle mouse events if disabled
      if (disabled) {
        console.log('🎮 CameraController: Mouse down blocked (disabled)')
        return
      }
      
      if (event.button === 0) { // Left mouse button only
        mouseState.current.isMouseDown = true
        mouseState.current.lastX = event.clientX
        mouseState.current.lastY = event.clientY
        canvas.style.cursor = 'grabbing'
        console.log('🎮 CameraController: Mouse look started')
      }
    }

    const handleMouseUp = (event: MouseEvent) => {
      // Don't handle mouse events if disabled
      if (disabled) {
        console.log('🎮 CameraController: Mouse up blocked (disabled)')
        return
      }
      
      if (event.button === 0) { // Left mouse button only
        mouseState.current.isMouseDown = false
        canvas.style.cursor = 'grab'
        console.log('🎮 CameraController: Mouse look stopped')
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      // Don't handle mouse events if disabled
      if (disabled || !mouseState.current.isMouseDown) {
        if (disabled) {
          console.log('🎮 CameraController: Mouse move blocked (disabled)')
        }
        return
      }

      // Calculate mouse movement delta
      const deltaX = event.clientX - mouseState.current.lastX
      const deltaY = event.clientY - mouseState.current.lastY

      // Update rotation based on mouse movement
      rotation.current.y -= deltaX * lookSpeed
      rotation.current.x -= deltaY * lookSpeed

      // Clamp vertical rotation to prevent over-rotation
      rotation.current.x = Math.max(maxLookDown, Math.min(maxLookUp, rotation.current.x))

      // Apply rotation to camera
      camera.rotation.order = 'YXZ'
      camera.rotation.y = rotation.current.y
      camera.rotation.x = rotation.current.x

      // Update last mouse position
      mouseState.current.lastX = event.clientX
      mouseState.current.lastY = event.clientY
    }

    const handleMouseLeave = () => {
      // Stop looking when mouse leaves canvas
      if (!disabled) {
        mouseState.current.isMouseDown = false
        canvas.style.cursor = 'grab'
      }
    }

    // Set initial cursor based on disabled state
    canvas.style.cursor = disabled ? 'default' : 'grab'

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    
    // Global mouse up to handle mouse release outside canvas
    window.addEventListener('mouseup', handleMouseUp)

    // Cleanup
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [camera, gl, lookSpeed, maxLookUp, maxLookDown, disabled])

  // Handle keyboard movement
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle keyboard events if disabled
      if (disabled) {
        console.log('🎮 CameraController: Key down blocked (disabled):', event.code)
        return
      }
      
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveState.current.forward = true
          break
        case 'ArrowDown':
        case 'KeyS':
          moveState.current.backward = true
          break
        case 'ArrowLeft':
        case 'KeyA':
          moveState.current.left = true
          break
        case 'ArrowRight':
        case 'KeyD':
          moveState.current.right = true
          break
        case 'Space':
          moveState.current.up = true
          event.preventDefault()
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          moveState.current.down = true
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      // Don't handle keyboard events if disabled
      if (disabled) {
        console.log('🎮 CameraController: Key up blocked (disabled):', event.code)
        return
      }
      
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveState.current.forward = false
          break
        case 'ArrowDown':
        case 'KeyS':
          moveState.current.backward = false
          break
        case 'ArrowLeft':
        case 'KeyA':
          moveState.current.left = false
          break
        case 'ArrowRight':
        case 'KeyD':
          moveState.current.right = false
          break
        case 'Space':
          moveState.current.up = false
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          moveState.current.down = false
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [disabled])

  // Update movement and zoom every frame
  useFrame((state, delta) => {
    // Early return if disabled - no camera updates at all
    if (disabled) {
      return
    }

    // Smooth zoom transition
    zoomState.current.currentFOV = THREE.MathUtils.lerp(
      zoomState.current.currentFOV,
      zoomState.current.targetFOV,
      delta * zoomState.current.zoomSpeed
    )
    
    // Apply FOV to camera (type-safe check for PerspectiveCamera)
    if (camera instanceof PerspectiveCamera) {
      camera.fov = zoomState.current.currentFOV
      camera.updateProjectionMatrix()
    }

    // Reset direction
    direction.current.set(0, 0, 0)

    // Get camera forward and right vectors (for first-person movement)
    const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
    const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
    
    // Only use horizontal movement for forward/backward (no flying)
    forward.y = 0
    forward.normalize()
    right.y = 0
    right.normalize()

    // Calculate movement direction
    if (moveState.current.forward) {
      direction.current.add(forward)
    }
    if (moveState.current.backward) {
      direction.current.add(forward.clone().multiplyScalar(-1))
    }
    if (moveState.current.left) {
      direction.current.add(right.clone().multiplyScalar(-1))
    }
    if (moveState.current.right) {
      direction.current.add(right)
    }
    
    // Vertical movement (for debugging - can be removed for realistic movement)
    if (moveState.current.up) {
      direction.current.y += 1
    }
    if (moveState.current.down) {
      direction.current.y -= 1
    }

    // Normalize direction to prevent faster diagonal movement
    if (direction.current.length() > 0) {
      direction.current.normalize()
    }

    // Apply smooth movement
    velocity.current.lerp(direction.current.multiplyScalar(moveSpeed), delta * 10)
    
    // Update camera position
    const newPosition = camera.position.clone().add(velocity.current.clone().multiplyScalar(delta))
    
    // Optional: Add collision detection or bounds checking here
    // For example, keep the camera above the ground:
    newPosition.y = Math.max(1.7, newPosition.y) // Human eye height
    
    camera.position.copy(newPosition)
  })

  return null
}

export default CameraController 