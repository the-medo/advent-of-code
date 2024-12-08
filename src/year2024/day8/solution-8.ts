type D8Point = {
    x: number;
    y: number;
}

type D8AntennaMap = Record<string, D8Point[] | undefined>
type D8AntinodeMap = Record<string, true | undefined>

exports.solution = (input: string[]) => {
    const antennaPoints: D8AntennaMap = {};
    let height = input.length, width = input[0].length;

    input.forEach((row, y) => {
        row.split('').forEach((c, x) => {
            if (c !== '.') {
                if (!antennaPoints[c]) antennaPoints[c] = [];
                antennaPoints[c]?.push({x,y})
            }
        })
    })

    const isOutOfBounds = (p: D8Point) => p.x < 0 || p.x >= width || p.y < 0 || p.y >= height;
    const getKey = (p: D8Point) => `${p.x};${p.y}`;

    const getPointsInLine = (point: D8Point, xDiff: number, yDiff: number, part: number): D8Point[] => {
        const result: D8Point[] = [];

        [1, -1].forEach(multiplier => {
            let p = {...point};
            while (true) {
                p.x += xDiff * multiplier;
                p.y += yDiff * multiplier;
                if (isOutOfBounds(p)) break;
                result.push({...p})
                if (part === 1) break;
            }
        })

        return result;
    }

    const run = (part: number): void => {
        const antinodeMap: D8AntinodeMap = {};
        Object.keys(antennaPoints).forEach(a => {
            antennaPoints[a]?.forEach(p1 => {
                antennaPoints[a]?.forEach(p2 => {
                    if (p1.x === p2.x && p1.y === p2.y) return;
                    let antinodes = getPointsInLine(p1, p1.x - p2.x, p1.y - p2.y, part)
                    if (part === 1) antinodes = antinodes.filter(p => !((p.x === p1.x && p.y === p1.y) || (p.x === p2.x && p.y === p2.y)));
                    antinodes.forEach(p => antinodeMap[getKey(p)] = true)
                })
            })
        })

        console.log(`Part ${part}: `, Object.keys(antinodeMap).length);
    }

    run(1);
    run(2);
}