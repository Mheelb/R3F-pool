import { Canvas } from '@react-three/fiber'
import './App.css'
import { OrbitControls } from '@react-three/drei'
import { OpenBox } from './components/geometrys/OpenBox'
import { SpotLight } from './components/lights/SpotLight'

const App = () => {

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <SpotLight
        position={[0, 2, 0]}
        intensity={3}
        color="white"
        helper={true}
        angle={1}
        penumbra={0.5}
      />
      <OrbitControls enableRotate={true} />
      <OpenBox
        color="white"
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        size={[3, 3, 3]}
      />
    </Canvas>
  )
}

export default App
