interface DirectionalLightProps {
    color: string;
    intensity: number;
    position: [number, number, number];
    helper?: boolean;
};

interface SpotLightProps {
    color: string;
    intensity: number;  
    position: [number, number, number];
    angle?: number;
    penumbra?: number;
    decay?: number;
    distance?: number;
    helper?: boolean;
};
