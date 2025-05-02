import { useGLTF } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"

export default function Museum(props: any) {

    const { scene } = useGLTF("/models/museum/scene.gltf")

    return (
        <RigidBody type="fixed" {...props} colliders="trimesh">
            <primitive object={scene} />
        </RigidBody>
    )
}

useGLTF.preload("/models/museum/scene.gltf")