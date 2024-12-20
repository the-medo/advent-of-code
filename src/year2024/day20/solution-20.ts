type D20Coordinate = {
    x: number;
    y: number;
}

type D20Point = D20Coordinate & {
    c: string;
    neighbors: D20Point[];
    lowestTime: number;
}

type D20Map = Record<string, D20Point>;
type D20TraverseStep = [D20Point, number];

exports.solution = (input: string[], testing: boolean) => {
    const run = (part: number) => {
        const t0 = performance.now();
        const scoreDiffNeeded = part === 1 ? (testing ? 2 : 100) : (testing ? 50 : 100);
        const maxCheatDistance = part === 1 ? 2 : 20;

        const m: D20Map = {};
        let start: D20Point | undefined;
        let end: D20Point | undefined;
        const getKey = (x: number, y: number) => `${x};${y}`;

        const addNeighbors = (p1: D20Point, p2: D20Point) => {
            if (p1.c !== p2.c) return;
            p1.neighbors.push(p2);
            p2.neighbors.push(p1);
        }

        input.forEach((row, y) => row.split('').forEach((c, x) => {
            const point: D20Point = {x, y, c, neighbors: [], lowestTime: Infinity};
            m[getKey(x, y)] = point;

            if (c === 'S' || c === 'E') {
                point.c = '.';
                if (c === 'S') start = point;
                if (c === 'E') end = point;
            }

            if (point.c === '.') {
                addNeighbors(point, m[getKey(x - 1, y)])
                addNeighbors(point, m[getKey(x, y - 1)])
            }
        }));

        if (!start || !end) {
            throw new Error('Start or end point not found');
        }

        const timeMap: Record<number, D20Point> = {}
        const possibleCheats: [D20Point, D20Point, number][] = []

        const traverse = (step: D20TraverseStep): D20TraverseStep[] => {
            const [p, score] = step;
            p.lowestTime = score;
            timeMap[score] = p;

            if (score >= scoreDiffNeeded) {
                for (let i = 0; i <= score - scoreDiffNeeded; i++) {
                    const distance = Math.abs(p.x - timeMap[i].x) + Math.abs(p.y - timeMap[i].y);
                    if (distance <= maxCheatDistance) {
                        const newScore = i + distance;
                        const cheatSize = score - newScore;
                        possibleCheats.push([timeMap[i], p, cheatSize])
                    }
                }
            }

            if (p.x === end!.x && p.y === end!.y) {
                return [];
            }
            const result: D20TraverseStep[] = [];

            p.neighbors.forEach(n => {
                if (n.lowestTime > score) {
                    result.push([n, score + 1]);
                }
            })

            return result;
        }

        const stack: D20TraverseStep[] = [[start, 0]];
        while (stack.length > 0) {
            const step = stack.pop();
            if (step) {
                const newSteps = traverse(step)
                stack.push(...newSteps);
            }
        }

        const cheatResults = possibleCheats.map(([, , scoreDiff]) => scoreDiff)//;.reduce((p, c) => ({...p, [c]: p[c] ? p[c] + 1 : 1}), {} as Record<number, number>);;
        const atLeast100 = cheatResults.filter(s => s >= scoreDiffNeeded);

        console.log(`Part ${part}: ${atLeast100.length}`);

        const t1 = performance.now();
        console.log(`Execution time: ${t1 - t0} milliseconds.`);
    }

    run(1);
    run(2);
}