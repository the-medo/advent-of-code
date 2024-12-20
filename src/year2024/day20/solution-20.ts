type D20Coordinate = {
    x: number;
    y: number;
}

type D20Point = D20Coordinate & {
    c: string;
    neighbors: D20Point[];
    lowestTime: number;
}

type D20Direction = D20Coordinate;
type D20Map = Record<string, D20Point>;
type D20TraverseStep = [D20Point, number];

exports.solution = (input: string[]) => {
    const m: D20Map = {};
    const dirs: D20Direction[] = [
        {x: -1, y: 0},
        {x: 0, y: -1},
        {x: 1, y: 0},
        {x: 0, y: 1}
    ];

    let start: D20Point | undefined;
    let end: D20Point | undefined;
    let height = input.length, width = input[0].length;
    const getKey = (x: number, y: number) => `${x};${y}`;
    const isOutOfBoundsXY = (x: number, y: number) => x < 0 || x >= width || y < 0 || y >= height;

    /** Parse input, every point has its own valid neighbors saved */
    input.forEach((row, y) => row.split('').forEach((c, x) => {
        const point: D20Point = {x, y, c, neighbors: [], lowestTime: Infinity};
        m[getKey(x, y)] = point;
        if (c === 'S') {
            point.c = '.'
            start = point;
        } else if (c === 'E') {
            point.c = '.'
            end = point;
        }
        if (point.c === '.' || point.c === '#') {
            const leftPoint = m[getKey(x-1,y)];
            if (leftPoint?.c === point.c) {
                leftPoint.neighbors.push(point);
                point.neighbors.push(leftPoint);
            }
            const topPoint = m[getKey(x,y-1)];
            if (topPoint?.c ===  point.c) {
                topPoint.neighbors.push(point);
                point.neighbors.push(topPoint);
            }
        }
    }));

    if (!start || !end) {
        throw new Error('Start or end point not found');
    }

    const traverse = (step: D20TraverseStep): D20TraverseStep[] => {
        const [p, score] = step;
        p.lowestTime = score;
        if (p.x === end!.x && p.y === end!.y) {
            return [];
        }
        const result: D20TraverseStep[] = [];

        p.neighbors.forEach(n => {
            if (n.lowestTime > score) {
                result.push([n, score+1]);
            }
        })

        return result;
    }

    const cheatForPointInDirection = (point: D20Point, direction: D20Direction): number => {
        const p1: D20Coordinate = {x: point.x + direction.x, y: point.y + direction.y}, p1Key = getKey(p1.x, p1.y);
        const p2: D20Coordinate = {x: point.x + direction.x * 2, y: point.y + direction.y * 2}, p2Key = getKey(p2.x, p2.y);
        const oob = isOutOfBoundsXY(p2.x, p2.y);

        if (oob) return 0;
        if (m[p1Key].c === '#' || m[p2Key].c === '#') {
            if (m[p2Key].c === '.') {
                return Math.max(m[p2Key].lowestTime - point.lowestTime - 2, 0);
            }
        }

        return 0;
    }

    const cheatForPoint = (point: D20Point): number[] => {
        return dirs.map(d => cheatForPointInDirection(point, d));
    }

    const stack: D20TraverseStep[] = [[start, 0]];
    const racePoints: D20TraverseStep[] = [...stack];
    while (stack.length > 0) {
        const step = stack.pop();
        if (step) {
            const newSteps = traverse(step)
            stack.push(...newSteps);
            racePoints.push(...newSteps);
        }
    }

    const cheatResults = racePoints.map(([point]) => cheatForPoint(point)).flat().filter(s => s > 0);
    //.reduce((p, c) => ({...p, [c]: p[c] ? p[c] + 1 : 1}), {} as Record<number, number>);
    const atLeast100 = cheatResults.filter(s => s >= 100);


    console.log("Part 1: ", atLeast100.length);
}