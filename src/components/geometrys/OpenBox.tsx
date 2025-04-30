const Plane = ({ position, size, color, rotation }: PlaneProps) => {
    return (
      <mesh position={position} rotation={rotation}>
        <planeGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
    )
  };
  
export const OpenBox = ({ color, position, rotation, size = [3, 3, 3]}: OpenBoxProps) => {
    return (
      <group position={position} rotation={rotation}>
        <Plane
          position={[0, 0, -size[2] / 2]}
          size={[size[0], size[1]]}
          color={color}
          rotation={[0, 0, 0]}
        />
        <Plane
          position={[-size[0] / 2, 0, 0]}
          size={[size[2], size[1]]}
          color={color}
          rotation={[0, Math.PI / 2, 0]}
        />
        <Plane
          position={[size[0] / 2, 0, 0]}
          size={[size[2], size[1]]}
          color={color}
          rotation={[0, -Math.PI / 2, 0]}
        />
        <Plane
          position={[0, size[1] / 2, 0]}
          size={[size[0], size[2]]}
          color={color}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <Plane
          position={[0, -size[1] / 2, 0]}
          size={[size[0], size[2]]}
          color={color}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </group>
    )
  };