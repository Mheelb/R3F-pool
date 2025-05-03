import { Canvas } from '@react-three/fiber'
import './App.css'
import { Physics } from '@react-three/rapier'
import { CharacterController } from './components/character/CharacterController'
import { Helper, KeyboardControls, OrbitControls, SpotLight } from '@react-three/drei'
import { useState } from 'react'
import Statue from './components/objects/Statue'
import Museum from './components/scenes/Museum'
import { SpotLightHelper } from 'three'


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
      <Canvas 
        style={{touchAction: "none"}} 
        shadows 
        camera={{ position: [0, 5, 10], fov: 50 }}
      >
        <color attach="background" args={['dark']} />
        <ambientLight intensity={0.9} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          shadow-camera-far={200}
          color={"white"}
        />
        <group>
          <spotLight
            position={[8, 10, -30]}
            target-position={[4, 5, -37]}
            angle={0.7}
            penumbra={0.5}
            intensity={50}
            color={"white"}
            castShadow
            shadow-mapSize={[1024, 1024]}
          >
          </spotLight>
          <spotLight
            position={[0, 10, -30]}
            target-position={[4, 5, -37]}
            angle={0.7}
            penumbra={0.5}
            intensity={50}
            color={"white"}
            castShadow
            shadow-mapSize={[1024, 1024]}
          >
          </spotLight>
        </group>
        {/* <OrbitControls target={[4, 5, -37]}/> */}
        <Physics colliders="cuboid" gravity={[0, -30, 0]}>
          <Statue receiveShadow castShadow position={[4, 0, -37]} rotation={[0, 0, 0]} scale={3}/>
          <CharacterController />
          <Museum position={[10, 0, 0]} receiveShadow castShadow scale={0.1}/>
        </Physics>
      </Canvas>
    </KeyboardControls>
  )
}

export default App
