export const normalizeAngle = (angle: number) => {
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
}

export const lerpAngle = (start: number, end: number, t: any) => {
    start = normalizeAngle(start);
    end = normalizeAngle(end);
    
    if (Math.abs(end - start) > Math.PI) {
        if (end > start)
            start += 2 * Math.PI;
        else
            end += 2 * Math.PI;
    }

    return normalizeAngle(start + (end - start) * t);
}