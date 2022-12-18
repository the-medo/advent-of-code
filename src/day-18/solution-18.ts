type DropletPoint = {
    surface: number,
    filled: boolean,
};

const map: Record<number, Record<number, Record<number, DropletPoint>>> = {};

const getDropletPoint = (x: number, y: number, z: number): DropletPoint => {
    if (!map[x]) map[x] = {};
    if (!map[x][y]) map[x][y] = {};
    if (!map[x][y][z]) map[x][y][z] = { surface: 0, filled: false, };

    return map[x][y][z];
}

const createDropletPoint = (x: number, y: number, z: number) => {
    const point = getDropletPoint(x, y, z);
    if (!point.filled) {
        point.filled = true;
        point.surface = 6;
        checkDropletPoint(point, x - 1, y, z);
        checkDropletPoint(point, x + 1, y, z);
        checkDropletPoint(point, x, y - 1, z);
        checkDropletPoint(point, x, y + 1, z);
        checkDropletPoint(point, x, y, z - 1);
        checkDropletPoint(point, x, y, z + 1);
    }
}

const checkDropletPoint = (originalPoint: DropletPoint, x: number, y: number, z: number) => {
    if (x < 0 || y < 0 || z < 0) return;
    const point = getDropletPoint(x, y, z);
    if (point.filled) {
        originalPoint.surface--;
        point.surface--;
    }
}

exports.solution = (input: string[]) => {
    input.forEach(l => {
        const [x, y, z] = l.split(",");
        createDropletPoint(parseInt(x), parseInt(y), parseInt(z));
    });

    let surface = 0;
    Object.keys(map).forEach(kx => {
        const x = parseInt(kx);
        Object.keys(map[x]).forEach(ky => {
            const y = parseInt(ky);
            Object.keys(map[x][y]).forEach(kz => {
                const z = parseInt(kz);
                if (map[x][y][z].filled) surface += map[x][y][z].surface;
            });
        });
    });

    console.log("Part 1 - surface: " , surface);
}