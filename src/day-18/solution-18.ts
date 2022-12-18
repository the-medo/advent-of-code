type DropletPoint = {
    surface: number,
    filled: boolean,
    edgeAccess: boolean,
};

type DropletPointCoordinates = {
    x: number,
    y: number,
    z: number,
}
type RecordNumber<T> = Record<number, T>;
let dmap: RecordNumber<RecordNumber<RecordNumber<DropletPoint>>> = {};
let edgeX = 0;
let edgeY = 0;
let edgeZ = 0;
let part = 0;
let stack: DropletPointCoordinates[] = [];

const getDropletPoint = (x: number, y: number, z: number): DropletPoint => {
    if (!dmap[x]) dmap[x] = {};
    if (!dmap[x][y]) dmap[x][y] = {};
    if (!dmap[x][y][z]) dmap[x][y][z] = { surface: 0, filled: false, edgeAccess: part === 1,};

    return dmap[x][y][z];
}

const createDropletPoint = (x: number, y: number, z: number) => {
    const point = getDropletPoint(x, y, z);
    if (!point.filled) {
        point.filled = true;
        point.surface = 6;
    }
}

const checkDropletPoint = (originalPoint: DropletPoint, x: number, y: number, z: number) => {
    if (x < 0 || y < 0 || z < 0) return;

    //increasing by 1 so "x + 1" is actually empty border around droplet
    if (x >= edgeX) edgeX = x + 1;
    if (y >= edgeY) edgeY = y + 1;
    if (z >= edgeZ) edgeZ = z + 1;

    const point = getDropletPoint(x, y, z);
    if (point.filled || !point.edgeAccess) originalPoint.surface--;
}

const computeSurface = () => {
    let surface = 0;

    Object.keys(dmap).forEach(kx => {
        const x = parseInt(kx);
        Object.keys(dmap[x]).forEach(ky => {
            const y = parseInt(ky);
            Object.keys(dmap[x][y]).forEach(kz => {
                const z = parseInt(kz);
                const point = getDropletPoint(x, y, z);
                checkDropletPoint(point, x - 1, y, z);
                checkDropletPoint(point, x + 1, y, z);
                checkDropletPoint(point, x, y - 1, z);
                checkDropletPoint(point, x, y + 1, z);
                checkDropletPoint(point, x, y, z - 1);
                checkDropletPoint(point, x, y, z + 1);
                if (point.filled) surface += point.surface;
            });
        });
    });

    return surface;
}

const checkPointAccessToTheEdge = (x: number, y: number, z: number) => {
    if (dmap[x][y][z].edgeAccess || dmap[x][y][z].filled) return;
    dmap[x][y][z].edgeAccess = true;

    if (x > 0 && !dmap[x-1][y][z].edgeAccess && !dmap[x-1][y][z].filled) stack.push({x: x - 1, y, z})
    if (y > 0 && !dmap[x][y-1][z].edgeAccess && !dmap[x][y-1][z].filled) stack.push({x, y: y - 1, z})
    if (z > 0 && !dmap[x][y][z-1].edgeAccess && !dmap[x][y][z-1].filled)  stack.push({x, y, z: z - 1})
    if (x < edgeX && !dmap[x+1][y][z].edgeAccess && !dmap[x+1][y][z].filled) stack.push({x: x + 1, y, z})
    if (y < edgeY && !dmap[x][y+1][z].edgeAccess && !dmap[x][y+1][z].filled) stack.push({x, y: y + 1, z})
    if (z < edgeZ && !dmap[x][y][z+1].edgeAccess && !dmap[x][y][z+1].filled) stack.push({x, y, z: z + 1})
}

const checkAccessToTheEdge = () => {

    //fill whole 3D space with empty points, so we can start at the corners
    for (let x = 0; x <= edgeX; x++){
        for (let y = 0; y <= edgeY; y++){
            for (let z = 0; z <= edgeZ; z++){
                getDropletPoint(x, y, z);
            }
        }
    }

    //push all 8 corners into stack
    stack = [
        {x: 0, y: 0, z: 0},
        {x: edgeX, y: 0, z: 0},
        {x: edgeX, y: edgeY, z: 0},
        {x: edgeX, y: 0, z: edgeZ},
        {x: 0, y: edgeY, z: 0},
        {x: 0, y: edgeY, z: edgeZ},
        {x: 0, y: 0, z: edgeZ},
        {x: edgeX, y: edgeY, z: edgeZ},
    ];

    //check all points access to the edge
    while(stack.length > 0) {
        const {x, y, z} = stack.pop()!;
        checkPointAccessToTheEdge(x, y, z);
    }
}

const runScanner = (input: string[], problemPart: number) => {
    part = problemPart;
    dmap = {};
    input.forEach(l => {
        const [x, y, z] = l.split(",");
        //increasing by 1 so "0" is actually empty border around droplet
        createDropletPoint(parseInt(x) + 1, parseInt(y) + 1, parseInt(z) + 1);
    });
    checkAccessToTheEdge();
}

exports.solution = (input: string[]) => {
    runScanner(input, 1);
    console.log("Part 1 - surface with hollow parts: " , computeSurface());

    runScanner(input, 2);
    console.log("Part 2 - only surface: " , computeSurface());
}