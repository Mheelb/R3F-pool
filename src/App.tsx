import { Canvas } from '@react-three/fiber'
import './App.css'
import { OrbitControls, ScrollControls, useHelper } from '@react-three/drei'
import * as THREE from 'three'
import {useRef} from 'react'

const Plane = ({ position, size, color, rotation }: PlaneProps) => {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
};

const OpenBox = ({ color, position, rotation, size = [3, 3, 3]}: OpenBoxProps) => {
  return (
    <group position={position} rotation={rotation}>
      <Plane
        position={[0, 0, -size[2] / 2]}
        size={[size[0], size[1]]}
        color={color}
        rotation={[0, 0, 0]}
      />
      <Plane
        position={[-size[0] / 2, 0, 0]}
        size={[size[2], size[1]]}
        color={color}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Plane
        position={[size[0] / 2, 0, 0]}
        size={[size[2], size[1]]}
        color={color}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <Plane
        position={[0, size[1] / 2, 0]}
        size={[size[0], size[2]]}
        color={color}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <Plane
        position={[0, -size[1] / 2, 0]}
        size={[size[0], size[2]]}
        color={color}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  )
};
const DirectionalLight = ({ intensity, color, position, helper = false }: DirectionalLightProps) => {
  const lightRef = useRef<THREE.DirectionalLight>(null!);
  

  helper ? useHelper(lightRef, THREE.DirectionalLightHelper, 1, 'red') : null;
  
  return (
      <directionalLight
        ref={lightRef}
        position={position}
        intensity={intensity}
        color={color}
        castShadow
      />
  )
};

const SpotLight = ({ intensity, color, position, helper = false, decay, penumbra, angle, distance }: SpotLightProps) => {
  const lightRef = useRef<THREE.SpotLight>(null!);
  helper ? useHelper(lightRef, THREE.SpotLightHelper, 'RED') : null;
  
  return (
      <spotLight
        ref={lightRef}
        position={position}
        angle={angle}
        penumbra={penumbra}
        decay={decay}
        distance={distance}
        intensity={intensity}
        color={color}
        castShadow={true}
      />
  )
};

const App = () => {

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <SpotLight
        position={[0, 2, 0]}
        intensity={1}
        color="white"
        helper={true}
        angle={1}
        penumbra={1}
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
