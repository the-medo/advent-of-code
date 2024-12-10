type D10Point = {
    x: number;
    y: number;
}

type D10MapPoint = D10Point & {
    x: number;
    y: number;
    h: number;
    validHigherNeighbors: D10MapPoint[];
}

type D10Directions = [number, number][];
type D10Map = D10MapPoint[][]
type D10TrailHead = {
    point: D10MapPoint,
    peaks: Record<string, boolean | undefined>
}
type D10StackPoint = {
    point: D10MapPoint;
    tillNow: string;
}

exports.solution = (input: string[]) => {
    console.log(input);

    const height = input.length, width = input[0].length;
    const isOutOfBounds = (p: D10Point) => p.x < 0 || p.x >= width || p.y < 0 || p.y >= height;
    const isOutOfBoundsXY = (x: number, y: number) => x < 0 || x >= width || y < 0 || y >= height;
    const getKey = (p: D10Point) => `${p.x};${p.y}`;

    let directions: D10Directions = [[1,0], [0,1],[-1,0], [0,-1]];

    const m: D10Map = []
    const trailHeads: D10TrailHead[] = [];

    input.forEach((row, y) => row.split('').map(Number).forEach((height, x) => {
        if (!m[x]) m[x] = [];
        const point: D10MapPoint = { x, y, h: height, validHigherNeighbors: [] }

        if (!isOutOfBoundsXY(x-1, y)) {
            const leftP = m[x-1][y]!
            if (leftP.h === height - 1) {
                leftP.validHigherNeighbors.push(point);
            } else if (leftP.h - 1 === height) {
                point.validHigherNeighbors.push(leftP);
            }
        }
        if (!isOutOfBoundsXY(x, y-1)) {
            const topP = m[x][y-1]!
            if (topP.h === height - 1) {
                topP.validHigherNeighbors.push(point);
            } else if (topP.h - 1 === height) {
                point.validHigherNeighbors.push(topP);
            }
        }

        m[x][y] = point;
        if (height === 0) trailHeads.push({point, peaks: {}});
    }))




    const check = (p: D10StackPoint, th: D10TrailHead, stack: D10StackPoint[]) => {
            p.point.validHigherNeighbors.forEach(peak => {
                const key = `${p.tillNow}|${getKey(peak)}`;
                if (p.point.h === 8) {
                    th.peaks[key] = true;
                } else {
                    stack.push({point: peak, tillNow: key});
                }
            })
    }

    let score = 0;
    trailHeads.forEach((th) => {
        const stack: D10StackPoint[] = [{point: th.point, tillNow: ''}];
        while (stack.length) {
            const p = stack.pop();
            if (p) {
                check(p, th, stack)
            }
        }
        score += Object.keys(th.peaks).length;
    })

    console.log(trailHeads);
    console.log("Part 2:", score);

}