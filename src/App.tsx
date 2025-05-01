import { Canvas, useFrame } from '@react-three/fiber'
import './App.css'
import { PerspectiveCamera } from '@react-three/drei'
import { OpenBox } from './components/geometrys/OpenBox'
import { SpotLight } from './components/lights/SpotLight'
import { Character } from './components/character/Character'
import { Physics } from '@react-three/rapier'
import { useRef } from 'react'
import * as THREE from 'three'

// Composant qui gère le suivi de la caméra
const CameraFollower = ({ target, offset = [0, 1.5, 5] }: { target: React.RefObject<THREE.Object3D | THREE.Group | null>, offset?: [number, number, number] }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(() => {
    if (target.current && cameraRef.current) {
      // Position cible = position du personnage + offset
      const targetPosition = new THREE.Vector3(
        target.current.position.x + offset[0],
        target.current.position.y + offset[1],
        target.current.position.z + offset[2]
      );
      
      // Déplace progressivement la caméra vers la position cible
      cameraRef.current.position.lerp(targetPosition, 0.1);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, -1.8 + offset[1], 5]}
      fov={75}
      near={0.1}
      far={1000}
    />
  );
};

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
