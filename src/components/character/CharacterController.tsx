import { RigidBody, CapsuleCollider, RapierRigidBody } from "@react-three/rapier"
import { Character } from "./Character"
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useKeyboardControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { lerpAngle } from "../../utils/Math";

export const CharacterController = forwardRef((props: any, ref) => {

    const isClicking = useRef<boolean>(false);
    const [wasJumping, setWasJumping] = useState(false);
    const [isGrounded, setIsGrounded] = useState(true);

    const container = useRef<THREE.Group>(null);
    const rb = useRef<RapierRigidBody>(null);
    const character = useRef<THREE.Group>(null);

    const characterRotationTarget = useRef<number>(0);
    const cameraTarget = useRef<THREE.Group>(null);
    const rotationTarget = useRef<number>(0);
    const cameraposition = useRef<THREE.Group>(null);
    const cameraWorldPosition = useRef<THREE.Vector3>(new THREE.Vector3());
    const cameraLookAtWorldPosition = useRef<THREE.Vector3>(new THREE.Vector3());
    const cameraLookAt = useRef<THREE.Vector3>(new THREE.Vector3());

    const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED, JUMP_SPEED } = {
        WALK_SPEED: 6,
        RUN_SPEED: 12,
        ROTATION_SPEED: degToRad(0.5),
        JUMP_SPEED: 15,
    }

    const [, get] = useKeyboardControls();

    const [animation, setAnimation] = useState<string>("idle");

    useEffect(() => {
        const onMouseDown = () => {
            isClicking.current = true;
        }

        const onMouseUp = () => {
            isClicking.current = false;
        }

        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);

        document.addEventListener("touchstart", onMouseDown);
        document.addEventListener("touchend", onMouseUp);

        return () => {
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("touchstart", onMouseDown);
            window.removeEventListener("touchend", onMouseUp);
        }
    }, []);

    useFrame(({ camera, mouse }) => {
        if (rb.current) {
            const vel = rb.current.linvel();
            let moveForward = 0;
            let moveRight = 0;

            if (get().forward) moveForward += 1;
            if (get().backward) moveForward -= 1;
            if (get().right) moveRight += 1;
            if (get().left) moveRight -= 1;

            // Direction de la caméra projetée sur le sol
            const cameraDirection = new THREE.Vector3();
            camera.getWorldDirection(cameraDirection);
            cameraDirection.y = 0;
            cameraDirection.normalize();

            // Vecteur droite par produit vectoriel
            const cameraRight = new THREE.Vector3();
            cameraRight.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0)).normalize();

            // Calcul du mouvement
            const moveDir = new THREE.Vector3();
            moveDir.addScaledVector(cameraDirection, moveForward);
            moveDir.addScaledVector(cameraRight, moveRight);
            if (moveDir.length() > 0) moveDir.normalize();

            let speed = get().run ? RUN_SPEED : WALK_SPEED;
            vel.x = moveDir.x * speed;
            vel.z = moveDir.z * speed;

            // Animation et rotation du personnage
            if (moveDir.length() > 0) {
                characterRotationTarget.current = Math.atan2(moveDir.x, moveDir.z);
                if (speed === RUN_SPEED && isGrounded)
                    setAnimation("run");
                else if (isGrounded)
                    setAnimation("walk");
            } else if (isGrounded) {
                setAnimation("idle");
            }

            if (character.current) {
                character.current.rotation.y = lerpAngle(
                    character.current.rotation.y,
                    characterRotationTarget.current,
                    0.1
                );
            }

            // JUMP
            const isJumpPressed = get().jump;
            if (isJumpPressed && isGrounded && !wasJumping) {
                vel.y = JUMP_SPEED;
                setWasJumping(true);
                setIsGrounded(false);
                setAnimation("jump_air");
            }
            setWasJumping(isJumpPressed);
            rb.current.setLinvel(vel, true);
        }
    });

    useImperativeHandle(ref, () => ({
        getPosition: () => {
            if (rb.current) {
                const pos = rb.current.translation();
                return [pos.x, pos.y, pos.z];
            }
            return [0, 0, 0];
        }
    }));

    return (
        <RigidBody
            colliders={false}
            lockRotations
            ref={rb}
            friction={0.5}
            restitution={0.2}
            linearDamping={0.5}
            angularDamping={0.5}
            onCollisionEnter={({ other }) => {
                setIsGrounded(true);
            }}>
            <group ref={container}>
                <group ref={cameraTarget} position-z={10} />
                <group ref={cameraposition} position-z={-15} position-y={10} />
                <group ref={character}>
                    <Character
                        scale={2}
                        position={[0, -2.1, 0]}
                        animation={animation}
                    />
                </group>
            </group>
            <CapsuleCollider args={[1.5, 1.7]} friction={0.5} restitution={0.2} position={[0, 1, 0]}/>
        </RigidBody>
    )
});