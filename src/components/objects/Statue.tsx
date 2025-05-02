import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export default function Statue(props: any) {
    const { scene } = useGLTF("/models/statue.gltf");

    scene.traverse((node: THREE.Object3D) => {
        if ((node as THREE.Mesh).isMesh) {
            (node as THREE.Mesh).castShadow = true;
            (node as THREE.Mesh).receiveShadow = true;
        }
    });

    return (
        <RigidBody colliders="hull" {...props} lockRotations>
            <primitive object={scene} castShadow receiveShadow/>
        </RigidBody>
    );
}

useGLTF.preload("/models/statue.gltf");
