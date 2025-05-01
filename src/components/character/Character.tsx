import { useAnimations, useGLTF } from "@react-three/drei";
import { forwardRef, useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface CharacterProps {
  animation: string;
  [key: string]: any;
}

export const Character = ({ animation: initialAnimation, ...props }: CharacterProps) => {
    const group = useRef<THREE.Group>(null);
    const [currentAnimation, setCurrentAnimation] = useState(initialAnimation);

    const { nodes, materials, animations } = useGLTF("/models/character.glb") as unknown as {
      nodes: {
        _rootJoint: THREE.Bone;
        body: THREE.SkinnedMesh;
        eye: THREE.SkinnedMesh;
        "hand-": THREE.SkinnedMesh;
        leg: THREE.SkinnedMesh;
      };
      materials: { [key: string]: THREE.Material };
      animations: THREE.AnimationClip[];
    };

    const { actions } = useAnimations(animations, group);

    useEffect(() => {
      if (!actions[initialAnimation]) return

      Object.values(actions).forEach(action => action?.stop());
      actions[initialAnimation]?.reset().fadeIn(0.2).play();
      setCurrentAnimation(initialAnimation);
    }, [actions, initialAnimation]);

    return (
      <group ref={group} {...props}>
        <group name="Scene">
          <group name="fall_guys">
            <primitive object={nodes._rootJoint} />
            <skinnedMesh
              name="body"
              geometry={nodes.body.geometry}
              material={materials.Material}
              skeleton={nodes.body.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="eye"
              geometry={nodes.eye.geometry}
              material={materials.Material}
              skeleton={nodes.eye.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="hand-"
              geometry={nodes["hand-"].geometry}
              material={materials.Material}
              skeleton={nodes["hand-"].skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="leg"
              geometry={nodes.leg.geometry}
              material={materials.Material}
              skeleton={nodes.leg.skeleton}
              castShadow
              receiveShadow
            />
          </group>
        </group>
      </group>
    );
  };

useGLTF.preload("/models/character.glb");