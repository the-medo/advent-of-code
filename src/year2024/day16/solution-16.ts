
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
type D16VisitedMap = Record<string, boolean>;

exports.solution = (input: string[]) => {
    const m: D16Map = {};
    const dirs: D16Direction[] = [{x: -1, y: 0},    {x: 0, y: -1},    {x: 1, y: 0},    {x: 0, y: 1}];
    const rotateLeft = (d: number): number => d === 0 ? 3 : d-1;
    const rotateRight = (d: number): number => d === 3 ? 0 : d+1;

    let start: D16Point | undefined;
    let end: D16Point | undefined;
    let direction = 2; //east
    let height = input.length, width = input[0].length;
    const getKey = (x: number, y: number) => `${x};${y}`;

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

    let lowestScore = Infinity;
    let scoreMap: Record<string, {lowestEntranceScore: number; finalScore: number}> = {}

    const move = (p: D16Point, visitedKeys: D16VisitedMap, score: number, d: number): number => {
        const scoreMapKey = `${p.x};${p.y};${d}`;
        if (score > lowestScore) return -1;
        if (p.x === end!.x && p.y === end!.y) {
            if (score < lowestScore) {
                lowestScore = score
            }
            return score;
        }
        if (scoreMap[scoreMapKey]) {
            if (score < scoreMap[scoreMapKey].lowestEntranceScore) {
                scoreMap[scoreMapKey].finalScore -= scoreMap[scoreMapKey].lowestEntranceScore - score;
                scoreMap[scoreMapKey].lowestEntranceScore = score;
            } else {
                return scoreMap[scoreMapKey].finalScore;
            }
        }

        const rLeft = rotateLeft(d);
        const rRight = rotateRight(d);

        const pStraightKey = getKey(p.x + dirs[d].x, p.y + dirs[d].y);
        const pLeftKey = getKey(p.x + dirs[rLeft].x, p.y + dirs[rLeft].y);
        const pRightKey = getKey(p.x + dirs[rRight].x, p.y + dirs[rRight].y);

        let scores: number[] = [];
        p.neighbors.forEach(n => {
            const nKey = getKey(n.x, n.y)
            if (!visitedKeys[nKey]) {
                if (pStraightKey === nKey) {
                    const s = move(m[nKey], {...visitedKeys, [nKey]: true}, score+1, d);
                    scores.push(s)
                } else if (pLeftKey === nKey || pRightKey === nKey) {
                    let dir = pLeftKey === nKey ? rLeft : rRight;
                    const s = move(m[nKey], {...visitedKeys, [nKey]: true}, score+1001, dir)
                    scores.push(s)
                }
            }
        })

        const filteredScores = scores.filter(s => s > -1);
        if (filteredScores.length === 0) {
            scoreMap[scoreMapKey] = {lowestEntranceScore: score, finalScore: -1};
            return -1;
        }

        scoreMap[scoreMapKey] = {lowestEntranceScore: score, finalScore: Math.min(...filteredScores)};
        return Math.min(...filteredScores);
    }

    if (!start) throw new Error("No start point!")
    const test = move(start, {[getKey(start.x, start.y)]: true}, 0, direction)

    console.log(scoreMap)
    console.log(test)
}