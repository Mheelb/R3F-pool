import { Canvas } from '@react-three/fiber'
import './App.css'
import { OpenBox } from './components/geometrys/OpenBox'
import { SpotLight } from './components/lights/SpotLight'
import { Physics } from '@react-three/rapier'
import { CharacterController } from './components/character/CharacterController'
import { KeyboardControls } from '@react-three/drei'
import { useState } from 'react'

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
    <Canvas style={{touchAction: "none"}}>
      <ambientLight intensity={0.5} />
      <SpotLight
        position={[0, 5, 0]}
        intensity={10}
        color="white"
        angle={1}
        penumbra={0.5}
      />
      <Physics key={map}>
        <CharacterController />
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
    </KeyboardControls>
  )
}

export default App
