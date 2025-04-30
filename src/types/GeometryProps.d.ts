interface PlaneProps {
    position: [number, number, number];
    size: [number, number];
    color: string;
    rotation?: [number, number, number];
};

interface OpenBoxProps
{
    floorColor: string;
    wallColor: string;
    ceilingColor: string;
    position: [number, number, number];
    rotation?: [number, number, number];
    size?: [number, number, number];
};

interface OpenBoxRef {
    walls: THREE.Mesh[];
};