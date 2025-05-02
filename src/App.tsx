import { Canvas } from '@react-three/fiber'
import './App.css'
import { OpenBox } from './components/scenes/OpenBox'
import { SpotLight } from './components/lights/SpotLight'
import { Physics } from '@react-three/rapier'
import { CharacterController } from './components/character/CharacterController'
import { KeyboardControls } from '@react-three/drei'
import { useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import Statue from './components/objects/Statue'
import Museum from './components/scenes/Museum'
const keyboardMap = [
  {name: "forward", keys: ["KeyW", "ArrowUp"]},
  {name: "backward", keys: ["KeyS", "ArrowDown"]},
  {name: "left", keys: ["KeyA", "ArrowLeft"]},
  {name: "right", keys: ["KeyD", "ArrowRight"]},
  {name: "run", keys: ["Shift"]},
  {name: "jump", keys: ["Space"]},
];

const App = () => {

  const [map, setMap] = useState<string>("");

  return (
    <KeyboardControls map={keyboardMap}>
    <Canvas style={{touchAction: "none"}} shadows>
      {/* <OrbitControls /> */}
      <directionalLight position={[0, 10, 0]} intensity={2} castShadow shadow-mapSize={[4000, 4000]} />
      <ambientLight intensity={1} />
      {/* <SpotLight
        position={[0, 5, 0]}
        intensity={50}
        color="white"
        angle={1}
        penumbra={2}
      /> */}
      <Physics 
        key={map} 
        colliders="cuboid"
      >
        <Statue receiveShadow castShadow position={[4, 0, -37]} rotation={[0, 0, 0]} scale={3}/>
        <CharacterController />
        <Museum position={[10, 0, 0]} receiveShadow scale={0.1}/>
        {/* <OpenBox
          floorColor="green"
          wallColor="blue"
          ceilingColor="red"
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          size={[10, 5, 10]}
        /> */}
      </Physics>
    </Canvas>
    </KeyboardControls>
  )
}

export default App
