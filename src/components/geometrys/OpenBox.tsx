import { RigidBody } from '@react-three/rapier';

const Plane = ({ position, size, color, rotation }: PlaneProps) => {
    return (
        <mesh position={position} rotation={rotation} receiveShadow>
            <boxGeometry args={[size[0], size[1], 0.1]} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
};

export const OpenBox = ({ floorColor, wallColor, ceilingColor, position, rotation, size = [3, 3, 3] }: OpenBoxProps) => {
    return (
        <RigidBody type="fixed" position={position} rotation={rotation} colliders="cuboid">
            <group>
                <Plane
                    position={[0, 0, -size[2] / 2]}
                    size={[size[0], size[1]]}
                    color={wallColor}
                    rotation={[0, 0, 0]}
                />
                <Plane
                    position={[-size[0] / 2, 0, 0]}
                    size={[size[2], size[1]]}
                    color={wallColor}
                    rotation={[0, Math.PI / 2, 0]}
                />
                <Plane
                    position={[size[0] / 2, 0, 0]}
                    size={[size[2], size[1]]}
                    color={wallColor}
                    rotation={[0, -Math.PI / 2, 0]}
                />
                <Plane
                    position={[0, size[1] / 2, 0]}
                    size={[size[0], size[2]]}
                    color={ceilingColor}
                    rotation={[Math.PI / 2, 0, 0]}
                />
                <RigidBody type="fixed" name="ground">
                    <Plane
                        position={[0, -size[1] / 2, 0]}
                        size={[size[0], size[2]]}
                        color={floorColor}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                </RigidBody>
            </group>
        </RigidBody>
    )
};