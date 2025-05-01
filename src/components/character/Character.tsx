import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface CharacterProps {
  animation: string;
  [key: string]: any;
}

export const Character = forwardRef<THREE.Group, CharacterProps>(
  ({ animation: initialAnimation, ...props }, ref) => {
  const group = useRef<THREE.Group>(null);
  // État de l'animation courante
  const [currentAnimation, setCurrentAnimation] = useState(initialAnimation);
  // État pour suivre si le personnage est en train de bouger
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    if (typeof ref === 'function') {
      ref(group.current);
    } else if (ref) {
      ref.current = group.current;
    }
  }, [ref]);

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
  
  const keys = useRef({
    z: false,
    q: false,
    s: false,
    d: false
  });

  const movement = useRef({
    speed: 2,
    currentVelocity: new THREE.Vector3(0, 0, 0),
    acceleration: 8,
    deceleration: 8,
    rotationSpeed: 5
  });

  const playAnimation = (name: string) => {
    Object.values(actions).forEach(action => action?.stop());
    
    if (actions[name]) {
      actions[name].reset().fadeIn(0.2).play();
      setCurrentAnimation(name);
    }
  };

  const checkMoving = () => {
    const moving = keys.current.z || keys.current.q || keys.current.s || keys.current.d;
    
    if (moving !== isMoving) {
      setIsMoving(moving);
      playAnimation(moving ? "run" : "idle");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'z' || key === 'q' || key === 's' || key === 'd') {
        keys.current[key] = true;
        checkMoving();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'z' || key === 'q' || key === 's' || key === 'd') {
        keys.current[key] = false;
        checkMoving();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isMoving]);

  useEffect(() => {
    playAnimation(initialAnimation);
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;

    const character = group.current;
    const { speed, acceleration, deceleration, currentVelocity, rotationSpeed } = movement.current;

    let moveX = 0;
    let moveZ = 0;

    if (keys.current.z) moveZ -= 1;
    if (keys.current.s) moveZ += 1;
    if (keys.current.q) moveX -= 1;
    if (keys.current.d) moveX += 1;

    if (moveX !== 0 && moveZ !== 0) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= length;
      moveZ /= length;
    }

    const targetVelocityX = moveX * speed;
    const targetVelocityZ = moveZ * speed;

    if (Math.abs(targetVelocityX - currentVelocity.x) > 0.01) {
      currentVelocity.x += (targetVelocityX - currentVelocity.x) *
        (targetVelocityX !== 0 ? acceleration : deceleration) * delta;
    } else {
      currentVelocity.x = targetVelocityX;
    }

    if (Math.abs(targetVelocityZ - currentVelocity.z) > 0.01) {
      currentVelocity.z += (targetVelocityZ - currentVelocity.z) *
        (targetVelocityZ !== 0 ? acceleration : deceleration) * delta;
    } else {
      currentVelocity.z = targetVelocityZ;
    }

    character.position.x += currentVelocity.x * delta;
    character.position.z += currentVelocity.z * delta;

    const movementMagnitude = Math.sqrt(
      currentVelocity.x * currentVelocity.x + 
      currentVelocity.z * currentVelocity.z
    );
    
    if (movementMagnitude > 0.1) {
      const targetRotationY = Math.atan2(currentVelocity.x, currentVelocity.z);
      let angleDiff = targetRotationY - character.rotation.y;

      if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      character.rotation.y += angleDiff * rotationSpeed * delta;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
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
});

useGLTF.preload("/models/character.glb");