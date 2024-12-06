type D6Point = {
    x: number,
    y: number,
}
type D6Direction = D6Point

type D6MapPoint = D6Point & {
    x: number,
    y: number,
    type: string,
    visited: boolean;
}

type D6Map = D6MapPoint[][];

exports.solution = (input: string[]) => {
    const m: D6Map = [];
    let startingPosition: D6Point = {
        x: 0, y: 0
    };
    const height = input.length, width = input[0].length;

    input.forEach((row, y) => {
        row.split('').forEach((type, x) => {
            if (!m[x]) m[x] = [];
            m[x][y] = {
                x,y,type,visited: false,
            };
            if (type === '^') {
                startingPosition = m[x][y];
                m[x][y].type = '.';
            }
        })
    })

    if (startingPosition === undefined) {
        return;
    }
    let direction: D6Direction = {x: 0, y: -1};
    let position: D6Point = {...startingPosition};
    let visited = 0;
    let possibleObstructions = 0;

    const isOutOfBounds = (p: D6Point) => p.x < 0 || p.x >= width || p.y < 0 || p.y >= height;

    const turnRight = (dir: D6Direction): D6Direction => {
        if (dir.y === -1) return {x: 1, y: 0}
        if (dir.y === 1) return {x: -1, y: 0}
        if (dir.x === 1) return {x: 0, y: 1}
        return {x: 0, y: -1}
    }
    const obstructionMap: Record<string, boolean> = {};

    const getKey = (p: D6Point, dir?: D6Direction) => `${p.x};${p.y}${dir ? `|${dir.x};${dir.y}` : ''}`;

    const move = (map:D6Map, pos: D6Point, dir: D6Direction): false | [D6Point, D6Direction] => {
        const newPos = {
            x: pos.x + dir.x,
            y: pos.y + dir.y,
        }
        if (isOutOfBounds(newPos)) return false;
        const mapPoint = map[newPos.x][newPos.y];
        if (mapPoint.type === '.') {
            if (!mapPoint.visited) {
                visited++;
                mapPoint.visited = true;
                if (!obstructionMap[getKey(newPos)] && checkForObstructionPlacement(map, pos, dir)){
                    possibleObstructions++;
                    obstructionMap[getKey(newPos)] = true;
                }
            }
            // const obstructionPlacement = {
            //     x: pos.x + dir.x,
            //     y: pos.y + dir.y,
            // }
            return [newPos, dir]
        } else if (mapPoint.type === '#') {
            return [pos, turnRight(dir)]
        } else {
            throw new Error("Other.")
        }
    }

    /**
     * returns last GUARD point
     */
    const checkForNearestObstruction = (map:D6Map, pos: D6Point, dir: D6Direction, fakeObstruction?: D6Point): D6Point | false => {
        let newPos = {...pos}
        while (true) {
            newPos.x +=dir.x;
            newPos.y +=dir.y;
            if (isOutOfBounds(newPos)) return false;
            if (map[newPos.x][newPos.y].type === '#') {
                return {x: newPos.x-dir.x, y: newPos.y-dir.y};
            }
            if (fakeObstruction && fakeObstruction.x === newPos.x && fakeObstruction.y === newPos.y) {
                return {x: newPos.x-dir.x, y: newPos.y-dir.y};
            }
        }
    }



    /**
     * puts obstacle IN FRONT OF position
     */
    const checkForObstructionPlacement = (map: D6Map, pos: D6Point, dir: D6Direction): boolean => {
        const newObstructionPosition = {
            x: pos.x + dir.x,
            y: pos.y + dir.y,
        }

        if (isOutOfBounds(newObstructionPosition)) return false;
        if (map[newObstructionPosition.x][newObstructionPosition.y].type === '#') return false;

        let newPos: D6Point | false = {...pos};
        let newDir = {...dir}

        const obstructionHitMap: Record<string, boolean> = {};

        while(true) {
            newPos = checkForNearestObstruction(map, newPos, newDir, newObstructionPosition); //GUARD position
            if (!newPos) return false;
            const k = getKey({x: newPos.x + newDir.x, y: newPos.y + newDir.y}, newDir); //key of OBSTACLE point
            if (obstructionHitMap[k]) {
                return true;
            } else {
                obstructionHitMap[k] = true;
            }
            newDir = turnRight(newDir);
        }
    }

    let moved = move(m, position, direction);
    while (moved !== false) {
        moved = move(m, moved[0], moved[1]);
    }

    console.log("Start: ", startingPosition);
    console.log("Obstacle on start : ", !!obstructionMap[getKey(startingPosition)]);
    if (obstructionMap[getKey(startingPosition)]) {
        possibleObstructions--;
        console.log("Reducted 1 from possible obstructions");
    }

    console.log("Part 1: ", visited);
    console.log("Part 2: ", possibleObstructions);
}