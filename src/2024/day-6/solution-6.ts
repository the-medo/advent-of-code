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

    console.log(input)

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

    const isOutOfBounds = (p: D6Point) => p.x < 0 || p.x >= width || p.y < 0 || p.y >= height;

    const turnRight = (dir: D6Direction): D6Direction => {
        if (dir.y === -1) return {x: 1, y: 0}
        if (dir.y === 1) return {x: -1, y: 0}
        if (dir.x === 1) return {x: 0, y: 1}
        return {x: 0, y: -1}
    }

    const move = (map:D6Map, pos: D6Point, dir: D6Direction): false | [D6Point, D6Direction] => {
        const newPos = {
            x: pos.x + dir.x,
            y: pos.y + dir.y,
        }
        if (isOutOfBounds(newPos)) return false;
        const mapPoint = map[newPos.x][newPos.y]
        if (mapPoint.type === '.') {
            if (!mapPoint.visited) {
                visited++;
                mapPoint.visited = true;
            }
            console.log("Going forward", mapPoint.type)
            return [newPos, dir]
        } else if (mapPoint.type === '#') {
            console.log("Turning right")
            return [pos, turnRight(dir)]
        } else {
            throw new Error("Other.")
        }
    }

    let moved = move(m, position, direction);
    let i = 0;
    while (moved !== false) { // && i < 10
        i++;
        moved = move(m, moved[0], moved[1]);

        console.log("moved", moved, i);
    }


    console.log("Part 1: ", visited);
}