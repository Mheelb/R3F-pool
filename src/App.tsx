import { Canvas, useFrame } from '@react-three/fiber'
import './App.css'
import { Physics } from '@react-three/rapier'
import { CharacterController } from './components/character/CharacterController'
import { Helper, KeyboardControls, OrbitControls, SpotLight } from '@react-three/drei'
import { useState, useRef, useEffect } from 'react'
import Statue from './components/objects/Statue'
import Museum from './components/scenes/Museum'
import { SpotLightHelper } from 'three'

const keyboardMap = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "left", keys: ["KeyA", "ArrowLeft"] },
  { name: "right", keys: ["KeyD", "ArrowRight"] },
  { name: "run", keys: ["Shift"] },
  { name: "jump", keys: ["Space"] },
];

function CameraTargetController({ characterRef, setTarget }: { characterRef: any, setTarget: (position: [number, number, number]) => void }) {
  useFrame(() => {
    if (characterRef.current && characterRef.current.getPosition) {
      setTarget(characterRef.current.getPosition());
    }
  });
  return null;
}

const App = () => {
  const [map, setMap] = useState<string>("");
  const [target, setTarget] = useState<[number, number, number]>([0, 0, 0]);
  const characterRef = useRef<any>(null);
  const orbitRef = useRef<any>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement && orbitRef.current) {
        const sensitivity = 0.01;
        orbitRef.current.setAzimuthalAngle(orbitRef.current.getAzimuthalAngle() - event.movementX * sensitivity);
        orbitRef.current.setPolarAngle(
          Math.max(
            0.1,
            Math.min(Math.PI - 0.1, orbitRef.current.getPolarAngle() - event.movementY * sensitivity)
          )
        );
      }
    };

    const handleClick = () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.requestPointerLock();
      }
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('click', handleClick);
      canvas.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('click', handleClick);
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas
        style={{ touchAction: "none" }}
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
        <OrbitControls
          ref={orbitRef}
          target={[target[0], target[1], target[2]]}
          enableZoom={false}
          minDistance={18}
          maxDistance={18}
          enablePan={false}
          enableRotate={false}
        />
        <CameraTargetController characterRef={characterRef} setTarget={setTarget} />
        <Physics colliders="cuboid" gravity={[0, -30, 0]}>
          <Statue receiveShadow castShadow position={[4, 0, -37]} rotation={[0, 0, 0]} scale={3} />
          <CharacterController ref={characterRef} />
          <Museum position={[10, 0, 0]} receiveShadow castShadow scale={0.1} />
        </Physics>
      </Canvas>
    </KeyboardControls>
  )
}

export default App
