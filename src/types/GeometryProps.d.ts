interface PlaneProps {
    position: [number, number, number];
    size: [number, number];
    color: string;
    rotation?: [number, number, number];
};

interface OpenBoxProps
{
    color: string;
    position: [number, number, number];
    rotation?: [number, number, number];
    size?: [number, number, number];
};