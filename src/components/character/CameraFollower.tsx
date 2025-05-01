import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

export const CameraFollower = ({ target, offset = [0, 1.5, 5] }: { target: React.RefObject<THREE.Object3D | THREE.Group | null>, offset?: [number, number, number] }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(() => {
    if (target.current && cameraRef.current) {
      const targetPosition = new THREE.Vector3(
        target.current.position.x + offset[0],
        target.current.position.y + offset[1],
        target.current.position.z + offset[2]
      );
      
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