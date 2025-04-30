import { useThree, useFrame } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const PlayerControls = ({ speed = 5 }: PlayerControlProps) => {
  const { camera } = useThree()
  const direction = new THREE.Vector3()
  const velocity = new THREE.Vector3()
  const keys = useRef<{ [key: string]: boolean }>({})

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => (keys.current[e.code] = true)
    const handleKeyUp = (e: KeyboardEvent) => (keys.current[e.code] = false)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((_, delta) => {
    direction.set(0, 0, 0)
    if (keys.current['KeyW']) direction.z -= 1
    if (keys.current['KeyS']) direction.z += 1
    if (keys.current['KeyA']) direction.x -= 1
    if (keys.current['KeyD']) direction.x += 1

    direction.normalize().applyEuler(camera.rotation)
    velocity.copy(direction).multiplyScalar(speed * delta)

    camera.position.add(velocity)
  })

  return <PointerLockControls />
}