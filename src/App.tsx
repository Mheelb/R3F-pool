import { Canvas } from '@react-three/fiber'
import './App.css'
import { PerspectiveCamera } from '@react-three/drei'
import { OpenBox } from './components/geometrys/OpenBox'
import { SpotLight } from './components/lights/SpotLight'
import { PlayerControls } from './components/controls/PlayerControls'
import { Physics } from '@react-three/cannon'

const App = () => {

  return (
    <Canvas>
      <PerspectiveCamera
        makeDefault
        position={[0, 0.7, 0]}
        fov={75}
        near={0.1}
        far={1000}
      />
      <ambientLight intensity={0.5} />
      <SpotLight
        position={[0, 5, 0]}
        intensity={10}
        color="white"
        angle={1}
        penumbra={0.5}
      />
      <Physics gravity={[0, -9.81, 0]}>
        <PlayerControls speed={5} />
        <OpenBox
          floorColor="green"
          wallColor="blue"
          ceilingColor="red"
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          size={[100, 50, 100]}
        />
      </Physics>
    </Canvas>
  )
}

export default App
