type D16Coordinate = {
    x: number;
    y: number;
}

type D16Point = D16Coordinate & {
    c: string;
    neighbors: D16Point[];
}

type D16Direction = D16Coordinate;
type D16Map = Record<string, D16Point>;
type D16Score = { lowestEntranceScore: number; nodeKeys: Set<string> };
/**                    [point,    score,  direction index, parent key]    */
type D16TraverseStep = [D16Point, number, number,          string];

exports.solution = (input: string[]) => {
    const t0 = performance.now();

    const m: D16Map = {};
    const dirs: D16Direction[] = [
        {x: -1, y: 0},
        {x: 0, y: -1},
        {x: 1, y: 0},
        {x: 0, y: 1}
    ];
    let direction = 2; //east
    const rotateLeft = (d: number): number => d === 0 ? 3 : d-1;
    const rotateRight = (d: number): number => d === 3 ? 0 : d+1;
    const getKey = (x: number, y: number) => `${x};${y}`;

    let start: D16Point | undefined;
    let end: D16Point | undefined;
    let height = input.length, width = input[0].length;

    /** Parse input, every point has its own valid neighbors saved */
    input.forEach((row, y) => row.split('').forEach((c, x) => {
        const point: D16Point = {x, y, c, neighbors: []};
        m[getKey(x, y)] = point;
        if (c === 'S') {
            point.c = '.'
            start = point;
        } else if (c === 'E') {
            point.c = '.'
            end = point;
        }
        if (point.c === '.') {
            const leftPoint = m[getKey(x-1,y)];
            if (leftPoint?.c === '.') {
                leftPoint.neighbors.push(point);
                point.neighbors.push(leftPoint);
            }
            const topPoint = m[getKey(x,y-1)];
            if (topPoint?.c === '.') {
                topPoint.neighbors.push(point);
                point.neighbors.push(topPoint);
            }
        }
    }));

    //additional after-input checks
    if (!start || !end) throw new Error("No starting or ending point!")
    const startKey = getKey(start.x, start.y);
    const endKey = getKey(end.x, end.y);

    let lowestScore = Infinity;
    let scoreMap: Record<string, D16Score> = {}

    /** Traverse method - returns array of next Traverse steps
     *  - step is a touple in this format: [point, score, direction index, parent key]
     * @param step
     */
    const traverse = (step: D16TraverseStep): D16TraverseStep[] => {
        const [p, score, d, parentNodeKey] = step;

        if (score > lowestScore) return [];

        const scoreMapKey = `${p.x};${p.y};${d}`;


        // check and update scoreMap
        const hasResult = scoreMap[scoreMapKey];
        if (hasResult) {
            if (hasResult.lowestEntranceScore < score) {
                return [];
            } else if (hasResult.lowestEntranceScore === score) {
                hasResult.nodeKeys.add(parentNodeKey);
            } else {
                scoreMap[scoreMapKey] = {
                    lowestEntranceScore: score,
                    nodeKeys: new Set<string>().add(parentNodeKey),
                }
            }
        } else {
            scoreMap[scoreMapKey] = {
                lowestEntranceScore: score,
                nodeKeys: new Set<string>().add(parentNodeKey),
            }
        }

        if (p.x === end!.x && p.y === end!.y) {
            if (score < lowestScore) lowestScore = score;
            return [];
        }

        const rLeft = rotateLeft(d);
        const rRight = rotateRight(d);

        const pStraightKey = getKey(p.x + dirs[d].x, p.y + dirs[d].y);
        const pLeftKey = getKey(p.x + dirs[rLeft].x, p.y + dirs[rLeft].y);
        const pRightKey = getKey(p.x + dirs[rRight].x, p.y + dirs[rRight].y);

        let nextSteps: D16TraverseStep[] = [];

        p.neighbors.forEach(n => {
            const nKey = getKey(n.x, n.y)
            if (pStraightKey === nKey) {
                const newScore = score+1;
                const smk = scoreMap[`${nKey};${d}`];
                if (!smk || smk.lowestEntranceScore >= newScore) nextSteps.push([m[nKey], newScore, d, `${p.x};${p.y};${d}`]);
            } else if (pLeftKey === nKey || pRightKey === nKey) {
                let dir = pLeftKey === nKey ? rLeft : rRight;
                const newScore = score+1000;
                const smk = scoreMap[`${p.x};${p.y};${dir}`];
                if (!smk || smk.lowestEntranceScore >= newScore) nextSteps.push([m[`${p.x};${p.y}`], newScore, dir, `${p.x};${p.y};${d}`])
            }
        })

        return nextSteps;
    }




    let i = 0;
    let traverseStack: D16TraverseStep[] = [ [start, 0, direction, `-`] ]
    while (traverseStack.length) {
        const step = traverseStack.pop();
        if (step) {
            i++;
            if (i % 10000000 === 0) console.log(i, traverseStack.length);
            traverseStack.push(...traverse(step));
        }
    }

    const showFromScoreMap = (x: number, y: number) => console.log([0,1,2,3].map(d => scoreMap[`${x};${y};${d}`]));
    const getAllDirKeys = (x: number, y: number) => [0,1,2,3].map(d => `${x};${y};${d}`);
    const removeDirectionFromKey = (key: string): string => key.split(';').splice(0, 2).join(';');

    const uniqueKeys = new Set<string>();


    /** backtrack the steps to get all possible ways */
    const endingKeys = getAllDirKeys(end.x, end.y).map(dirKey => scoreMap[dirKey]).filter(a => a !== undefined && a.lowestEntranceScore === lowestScore).map(a => [...a.nodeKeys]).flat();
    console.log(endingKeys);
    const backtrackStack: string[] = [...endingKeys];
    while (backtrackStack.length) {
        const step = backtrackStack.pop();
        if (!step) continue;
        if (uniqueKeys.has(step)) continue;
        uniqueKeys.add(step);
        const nk = scoreMap[step];
        if (nk) backtrackStack.push(...nk.nodeKeys)
    }

    const uniqueKeysWithoutDirection = new Set([...uniqueKeys].map(uqd => removeDirectionFromKey(uqd)));

    const drawMap = () => {
        console.log("=========================");
        for (let row = 0; row < height; row++) {
            let rowString = '';
            for (let col = 0; col < width; col++) {
                const k = getKey(col, row);
                let char = m[k].c;
                if (char === '.') {
                    char = uniqueKeysWithoutDirection.has(k) ? 'O' : '.';
                }
                rowString += char;
            }
            console.log(rowString);
        }
    }

    // drawMap();
    console.log("Part 1:", lowestScore)
    console.log("Part 2:", uniqueKeysWithoutDirection.size)

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}