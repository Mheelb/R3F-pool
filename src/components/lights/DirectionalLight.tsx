import { useRef } from 'react';
import { useHelper } from '@react-three/drei';
import * as THREE from 'three';

export const DirectionalLight = ({ intensity, color, position, helper = false }: DirectionalLightProps) => {
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