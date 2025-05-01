import { Canvas } from '@react-three/fiber'
import './App.css'
import { OpenBox } from './components/geometrys/OpenBox'
import { SpotLight } from './components/lights/SpotLight'
import { Character } from './components/character/Character'
import { CameraFollower } from './components/character/CameraFollower'
import { Physics } from '@react-three/rapier'
import { useRef } from 'react'
import * as THREE from 'three'

const App = () => {

  const characterRef = useRef<THREE.Group>(null);

  return (
    <Canvas>
      <CameraFollower target={characterRef} offset={[0, 1, 3]} />
      <ambientLight intensity={0.5} />
      <SpotLight
        position={[0, 5, 0]}
        intensity={10}
        color="white"
        angle={1}
        penumbra={0.5}
      />
      <Physics debug gravity={[0, -9.81, 0]}>
        <Character
          ref={characterRef}
          scale={0.18}
          position-y={-2.5}
          animation={"idle"}
        />
        <OpenBox
          floorColor="green"
          wallColor="blue"
          ceilingColor="red"
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          size={[10, 5, 10]}
        />
        </Physics>
    </Canvas>
  )
}

export default App
