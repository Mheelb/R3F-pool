import { RigidBody, CapsuleCollider, RapierRigidBody } from "@react-three/rapier"
import { Character } from "./Character"
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useKeyboardControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { lerpAngle } from "../../utils/Math";

export const CharacterController = () => {

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
        WALK_SPEED: 20,
        RUN_SPEED: 40,
        ROTATION_SPEED: degToRad(0.5),
        JUMP_SPEED: 50,
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
            const movement = {
                x: 0,
                z: 0
            }

            if (get().forward)
                movement.z = 1;

            if (get().backward)
                movement.z = -1;

            let speed = get().run ? RUN_SPEED : WALK_SPEED;

            if (isClicking.current) {
                if (Math.abs(mouse.x) > 0.1)
                    movement.x = -mouse.x;
                movement.z = mouse.y + 0.4;
                if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5)
                    speed = RUN_SPEED;

            }

            if (get().left)
                movement.x = 1;

            if (get().right)
                movement.x = -1;

            if (movement.x !== 0)
                rotationTarget.current += movement.x * ROTATION_SPEED;

            if (movement.x !== 0 || movement.z !== 0) {
                characterRotationTarget.current = Math.atan2(movement.x, movement.z);
                vel.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed;
                vel.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed;
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
            console.log(rb.current.translation()); // Using translation() instead of position
            
        }

        // CAMERA

        if (container.current) {
            container.current.rotation.y = THREE.MathUtils.lerp(
                container.current.rotation.y,
                rotationTarget.current,
                0.1
            );
        }
        cameraposition.current?.getWorldPosition(cameraWorldPosition.current);
        camera.position.lerp(cameraWorldPosition.current, 0.1);

        if (cameraTarget.current) {
            cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
            cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);

            camera.lookAt(cameraLookAt.current);
        }
    });

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
                <group ref={cameraTarget} position-z={20} />
                <group ref={cameraposition} position-z={-30} position-y={30} />
                <group ref={character}>
                    <Character
                        scale={7}
                        position={[0, -10, 0]}
                        animation={animation}
                    />
                </group>
            </group>
            <CapsuleCollider args={[2, 7]} friction={0.5} restitution={0.2} />
        </RigidBody>
    )
}