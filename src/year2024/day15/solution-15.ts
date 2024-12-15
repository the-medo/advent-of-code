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
    const run = (part: number) => {
        const t0 = performance.now();

        const m: Record<string, D15Point> = {};
        const boxM: Record<string, D15BoxPosition> = {};
        const commands: D15Direction[] = [];

        let currentPosition: D15Point | undefined;
        let height = 0, width = input[0].length * part;

        const getKey = (x: number, y: number) => `${x};${y}`;

        /**
         * Parsing input
         * - for part 2, width of all elements is doubled, except robot, which becomes '@.'
         */
        input.forEach((row, y) => {
            if (row === '') {
                height = y;
            } else if (height === 0) {
                row.split('').forEach((cell, x) => {

                    const key1 = getKey(x * part, y);
                    const point1: D15Point = {x: x * part, y, c: cell};
                    m[key1] = point1;
                    if (cell === '@') currentPosition = point1;
                    if (cell === 'O') boxM[key1] = {isStart: true, isValid: true};

                    if (part === 2) {
                        const key2 = getKey(x * 2 + 1, y);
                        m[key2] = {x: x * 2 + 1, y, c: cell === '@' ? '.' : cell};
                        if (cell === 'O') boxM[key2] = {isStart: false, isValid: true};
                    }
                })
            } else {
                commands.push(...row.split('').map(d => DirectionMap[d]));
            }
        });

        /**
         * Function returns a tuple:
         *      [
         *          - D15Point[] - all box points affected in direction, started at point x,y,
         *          - true/false - returns true, if it is possible to move
         *      ]
         *
         * Returned points can be duplicated, it is needed to handle duplicates afterwards!
         * @param x
         * @param y
         * @param dir
         */
        const getAllAffectedBoxes = (x: number, y: number, dir: D15Direction): [D15Point[], boolean] => {
            const posKey = getKey(x, y)
            if (m[posKey].c === 'O') {
                if (!boxM[posKey].isValid) throw new Error("Should not happen");
                /* we would like to know, if the checked position is start or end of the box, and we save positions of start/end */
                const startPosX = x + (boxM[posKey].isStart ? 0 : -1);
                const endPosX = x + (boxM[posKey].isStart ? 1 : 0);

                const [boxesAboveStartPos, canMoveAboveStartPos] = getAllAffectedBoxes(startPosX, y + dir.y, dir);
                const [boxesAboveEndPos, canMoveAboveEndPos] = getAllAffectedBoxes(endPosX, y + dir.y, dir);
                const canMove = canMoveAboveStartPos && canMoveAboveEndPos;
                return canMove ? [
                    [
                        m[getKey(startPosX, y)],
                        m[getKey(endPosX, y)],
                        ...boxesAboveStartPos,
                        ...boxesAboveEndPos
                    ],
                    true
                ] : [[], false];
            } else if (m[posKey].c === '.') {
                return [[], true];
            } else if (m[posKey].c === '#') {
                return [[], false];
            } else {
                throw new Error("Unexpected character in the map.")
            }
        }

        /**
         * Moves the robot and all necessary boxes in given direction, if possible.
         * Returns new current position.
         * @param x
         * @param y
         * @param dir
         */
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

                /**
                 * - horizontal movement for part 2 is the same as any-directional movement for part 1 (except some bonus box start-end handling)
                 * - vertical movement for part 2 is completely different
                 */
                if (dir.x !== 0 || part === 1) {
                    //for part 1 or horizontal part2, we just find nearest "." in the direction
                    let found = false;
                    let nfs = {x: x + 2 * dir.x, y: y + 2 * dir.y};
                    while (true) {
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
                        boxM[nextPosKey] = { isStart: false, isValid: false };
                        boxM[nearestEmptySpaceKey] = { isStart: part === 1, isValid: true };

                        //in part two, we need to update box start/ends
                        if (part === 2) {
                            let isStart = true;
                            const startX = (x + 2 * dir.x > nfs.x) ? nfs.x : x + 2 * dir.x;
                            const endX = (x + 2 * dir.x > nfs.x) ? x + 2 * dir.x : nfs.x;
                            for (let i = startX; i <= endX; i++) {
                                boxM[`${i};${y}`] = { isStart, isValid: true }
                                isStart = !isStart;
                            }
                        }
                        return m[nextPosKey];
                    } else {
                        return m[currentPosKey];
                    }

                    /**
                     * For part 2, we use our getAllAffectedBoxes function to get all affected points, get only the unique ones and handle the moves
                     */
                } else if (dir.y !== 0 && part === 2) {
                    const [affectedBoxPoints, canMove] = getAllAffectedBoxes(x, y + dir.y, dir)

                    if (canMove) {
                        //function returns duplicated points, we need to select the unique ones
                        const uniqueKeys = [...new Set(affectedBoxPoints.map(b => getKey(b.x, b.y)))]

                        //we iterate throught the points two times

                        //first, we just reset the fields to empty "." spaces and set it in box map as invalid
                        uniqueKeys.forEach(uq => {
                            m[uq].c = '.';
                            boxM[uq].isValid = false;
                        });


                        //second, we create temporary box map, with only the moved boxes, and set original map tiles back to 'O' for moved boxes
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

                        //we go through our temp box map and set our original box map points based on the temporary ones
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

        /**
         * Draw!
         * @param command - optional, adds the command into header row
         */
        const drawMap = (command?: D15Direction) => {
            console.log("=========================", command);
            for (let row = 0; row < height; row++) {
                let rowString = '';
                for (let col = 0; col < width; col++) {
                    const k = getKey(col, row);
                    let char = m[k].c;
                    if (char === 'O' && part === 2) {
                        char = boxM[k].isStart ? '[' : ']';
                    }
                    rowString += char;
                }
                console.log(rowString);
            }
        }

        /**
         * Real steps!
         *
         * 1. go through all commands
         * 2. go through all valid boxes and sum values of their starting points
         */

        let sum = 0;
        commands.forEach(c => currentPosition = move(currentPosition!.x, currentPosition!.y, c))

        if (part === 1) {
            drawMap()
            console.log(boxM);
        }

        Object.keys(boxM).forEach(k => {
            if (boxM[k] && boxM[k].isValid && boxM[k].isStart) sum += m[k].y * 100 + m[k].x
        })

        const t1 = performance.now();
        console.log(`Execution time: ${t1 - t0} milliseconds.`);
        console.log(`Part ${part}: ${sum}`)
    }

    run(1);
    run(2);
}