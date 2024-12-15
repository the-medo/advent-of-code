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

type D15BoxPosition = {
    isStart: boolean;
    isValid: boolean;
}

exports.solution = (input: string[]) => {
    const m: Record<string, D15Point> = {};
    const boxM: Record<string, D15BoxPosition> = {};
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

                const key1 = getKey(x*2, y);
                const point1: D15Point = {x: x*2, y, c: cell};
                m[key1] = point1;

                const key2 = getKey(x*2+1, y);
                const cell2 = cell === '@' ? '.' : cell;
                const point2: D15Point = {x: x*2 + 1, y, c: cell2};
                m[key2] = point2;
                if (cell === '@') currentPosition = point1;
                if (cell === 'O') {
                    boxM[key1] = {isStart: true, isValid: true};
                    boxM[key2] = {isStart: false, isValid: true};
                }
            })
        } else {
            commands.push(...row.split('').map(d => DirectionMap[d]));
        }
    });

    const getAllAffectedBoxes = (x: number, y: number, dir: D15Direction): [D15Point[], boolean] => {
        const posKey = getKey(x, y)
        if (m[posKey].c === 'O') {
            if (!boxM[posKey].isValid) throw new Error("Should not happen");
            let startPosX = x, posY = y, secondPosX = x;
            if (boxM[posKey].isStart) {
                secondPosX++;
            } else {
                startPosX--;
            }
            const aboveStartPos = getAllAffectedBoxes(startPosX, y + dir.y, dir);
            const aboveSecondPos = getAllAffectedBoxes(secondPosX, y + dir.y, dir);
            console.log(aboveStartPos, aboveSecondPos)
            return aboveStartPos[1] && aboveSecondPos[1] ? [[m[getKey(startPosX, y)], m[getKey(secondPosX, y)], ...aboveStartPos[0], ...aboveSecondPos[0]], true] : [[], false];
        } else if (m[posKey].c === '.') {
            return [[], true];
        } else if (m[posKey].c === '#') {
            return [[], false];
        } else {
            throw new Error("Unexpected character in the map.")
        }
    }

    //return true when box is moved OR there is no box on the position
    const move = (x: number, y: number, dir: D15Direction): D15Point => {
        const currentPosKey = getKey(x, y)
        const nextPosKey = getKey(x + dir.x, y + dir.y);
        if (m[nextPosKey].c === '.') {
            m[nextPosKey].c = '@';
            m[currentPosKey].c = '.';
            return m[nextPosKey];
        } else if (m[nextPosKey].c === '#') {
            return m[currentPosKey];
        } else if (m[nextPosKey].c === 'O') {

            if (dir.x !== 0) { // Horizontally, we can move no problemo
                //find nearest "." in the direction
                let found = false;
                let nfs = {x: x + 2 * dir.x, y};
                while (true) {
                    const key = getKey(nfs.x, nfs.y);
                    if (!m[key]) break;
                    if (m[key].c === 'O') {
                        nfs.x += dir.x;
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
                    boxM[nextPosKey] = {
                        isStart: false,
                        isValid: false,
                    };
                    boxM[nearestEmptySpaceKey] = {
                        isStart: false,
                        isValid: true,
                    };

                    let isStart = true;
                    const startX = (x + 2*dir.x > nfs.x) ? nfs.x : x + 2*dir.x;
                    const endX = (x + 2*dir.x > nfs.x) ? x + 2*dir.x : nfs.x;
                    for (let i = startX ; i <= endX; i++) {
                        boxM[`${i};${y}`] = {
                            isStart,
                            isValid: true,
                        }
                        isStart = !isStart;
                    }

                    return m[nextPosKey];
                } else {
                    return m[currentPosKey];
                }
            } else if (dir.y !== 0) {
                const [affectedBoxes, canMove] = getAllAffectedBoxes(x, y + dir.y, dir)

                if (canMove) {

                    const uniqueKeys = [...new Set(affectedBoxes.map(b => getKey(b.x, b.y)))]
                    uniqueKeys.forEach(uq => {
                        m[uq].c = '.';
                        boxM[uq].isValid = false;
                    });
                    let tempBoxM: Record<string, D15BoxPosition> = {}
                    uniqueKeys.forEach(uq => {
                        const point = m[uq];
                        const boxPoint = boxM[uq];
                        const newY = point.y + dir.y;
                        const newKey = getKey(point.x, newY);
                        m[newKey].c = 'O';
                        tempBoxM[newKey] = {
                            isValid: true,
                            isStart: boxPoint.isStart,
                        }
                    })

                    Object.keys(tempBoxM).forEach(tbm => boxM[tbm] = {...tempBoxM[tbm]})
                    m[nextPosKey].c = '@';
                    m[currentPosKey].c = '.';
                    return m[nextPosKey];
                }

                return m[currentPosKey];
            }
            throw new Error("Should not happen - direction missing?.")
        } else {
            console.log(m[nextPosKey])
            throw new Error("Unexpected character in the map.")
        }
    }

    const drawMap = (command?: D15Direction) => {
        console.log("=========================", command);
        for (let row = 0; row < height; row++) {
            let rowString = '';
            for (let col = 0; col < width; col++) {
                const k = getKey(col, row);
                let char = m[k].c;
                if (char === 'O') {
                    char = boxM[k].isStart ? '[' : ']';
                }
                rowString += char;
            }
            console.log(rowString);
        }
    }

    let sum = 0;

    drawMap();
    commands.forEach(c => {
        currentPosition = move(currentPosition!.x, currentPosition!.y, c)
        // drawMap(c);
    })

    Object.keys(boxM).forEach(k => {
        if (boxM[k] && boxM[k].isValid && boxM[k].isStart) sum += m[k].y * 100 + m[k].x
    })

    console.log("Part 2", sum)

}