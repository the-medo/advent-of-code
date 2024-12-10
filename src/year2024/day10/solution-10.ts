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

    const run = (part: number) => {
        const t0 = performance.now();
        const height = input.length, width = input[0].length;
        const isOutOfBoundsXY = (x: number, y: number) => x < 0 || x >= width || y < 0 || y >= height;
        const getKey = (p: D10Point) => `${p.x};${p.y}`;

        const m: D10Map = []
        const trailHeads: D10TrailHead[] = [];

        const addNeighbors = (p1: D10MapPoint, p2: D10MapPoint) => {
            if (p1.h === p2.h - 1) {
                p1.validHigherNeighbors.push(p2);
            } else if (p1.h - 1 === p2.h) {
                p2.validHigherNeighbors.push(p1);
            }
        }

        input.forEach((row, y) => row.split('').map(Number).forEach((height, x) => {
            if (!m[x]) m[x] = [];
            m[x][y] = { x, y, h: height, validHigherNeighbors: [] };
            if (!isOutOfBoundsXY(x-1, y)) addNeighbors(m[x][y], m[x-1][y])
            if (!isOutOfBoundsXY(x, y-1)) addNeighbors(m[x][y], m[x][y-1])
            if (height === 0) trailHeads.push({point: m[x][y], peaks: {}});
        }))



        const check = (p: D10StackPoint, th: D10TrailHead, stack: D10StackPoint[]) => {
            p.point.validHigherNeighbors.forEach(peak => {
                const key = `${p.tillNow}|${getKey(peak)}`;
                if (p.point.h === 8) {
                    th.peaks[key] = true;
                } else {
                    stack.push({point: peak, tillNow: part === 2 ? key : ''});
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

        const t1 = performance.now();
        console.log(`Part ${part}: ${score}  Execution time: ${t1 - t0} milliseconds.`);
    }

    run(1)
    run(2)

}