import { useRef } from 'react';
import { useHelper } from '@react-three/drei';
import * as THREE from 'three';

export const SpotLight = ({ intensity, color, position, helper = false, decay, penumbra, angle, distance }: SpotLightProps) => {
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
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
  )
};