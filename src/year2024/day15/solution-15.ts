type D15Point = {
    x: number;
    y: number;
    c: string;
}

type D15Direction = {
    x: number;
    y: number;
}

const DirectionMap: Record<string, D15Direction> = {
    '<': {x: -1, y: 0},
    '^': {x: 0, y: -1},
    '>': {x: 1, y: 0},
    'v': {x: 0, y: 1},
}

exports.solution = (input: string[]) => {
    const m: Record<string, D15Point> = {};
    const boxM: Record<string, boolean> = {};
    const commands: D15Direction[] = [];
    let currentPosition: D15Point | undefined;
    let height = 0, width = input[0].length * 2;

    const isOutOfBoundsXY = (x: number, y: number) => x < 0 || x >= width || y < 0 || y >= height;
    const getKey = (x: number, y: number) => `${x};${y}`;

    input.forEach((row, y) => {
        if (row === '') {
            height = y;
        } else if (height === 0) {
            row.split('').forEach((cell, x) => {

                const key = getKey(x, y);
                const point: D15Point = {x, y, c: cell};
                m[key] = point;
                if (cell === '@') currentPosition = point;
                if (cell === 'O') boxM[key] = true;
            })
        } else {
            commands.push(...row.split('').map(d => DirectionMap[d]));
        }
    });

    //return true when box is moved OR there is no box on the position
    const move = (x: number, y: number, dir: D15Direction): D15Point => {
        const currentPosKey = getKey(x, y)
        const nextPosKey = getKey(x + dir.x, y + dir.y);
        const doubleNextPosKey = getKey(x + 2*dir.x, y + 2*dir.y);
        if (m[nextPosKey].c === '.') {
            m[nextPosKey].c = '@';
            m[currentPosKey].c = '.';
            return m[nextPosKey];
        } else if (m[nextPosKey].c === '#') {
            return m[currentPosKey];
        } else if (m[nextPosKey].c === 'O') {
            //find nearest "." in the direction
            let found = false;
            let nfs = {x: x +2 * dir.x, y: y +2 * dir.y};
            while(true) {
                const key = getKey(nfs.x, nfs.y);
                if (!m[key]) break;
                if (m[key].c === 'O') {
                    nfs.x += dir.x;
                    nfs.y += dir.y;
                    continue;
                }
                if (m[key].c === '.') {
                    found = true;
                    break;
                } else if (m[key].c === '#') {
                    break;
                }
            }

            if (found) {
                const nearestEmptySpaceKey = getKey(nfs.x, nfs.y);
                m[nearestEmptySpaceKey].c = 'O';
                m[nextPosKey].c = '@';
                m[currentPosKey].c = '.';
                boxM[nextPosKey] = false;
                boxM[nearestEmptySpaceKey] = true;
                return m[nextPosKey];
            } else {
                return m[currentPosKey];
            }
        } else {
            throw new Error("Unexpected character in the map.")
        }
    }

    let sum = 0;

    commands.forEach(c => {
        currentPosition = move(currentPosition!.x, currentPosition!.y, c)
        console.log("Current: ", currentPosition)
    })

    Object.keys(boxM).forEach(k => {
        if (boxM[k]) sum += m[k].y * 100 + m[k].x
    })

    console.log("Map", m)
    console.log("boxM", boxM)
    console.log("Part 1", sum)

}