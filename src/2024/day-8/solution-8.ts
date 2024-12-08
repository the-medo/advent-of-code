type D8Point = {
    x: number;
    y: number;
    type?: string;
}

type D8AntennaMap = Record<string, D8Point[] | undefined>
type D8AntinodeMap = Record<string, string[] | undefined>

exports.solution = (input: string[]) => {
    const aMap: D8AntennaMap = {};
    const antinodeMap: D8AntinodeMap = {};
    let height = input.length, width = input[0].length;

    input.forEach((row, y) => {
        row.split('').forEach((c, x) => {
            if (c !== '.') {
                if (!aMap[c]) aMap[c] = [];
                aMap[c]?.push({
                    x,
                    y,
                    type: c
                })
            }
        })
    })

    const isOutOfBounds = (p: D8Point) => p.x < 0 || p.x >= width || p.y < 0 || p.y >= height;
    const getKey = (p: D8Point) => `${p.x};${p.y}`;

    const antenas = Object.keys(aMap);

    antenas.forEach(a => {
        aMap[a]?.forEach(p1 => {
            aMap[a]?.forEach(p2 => {
                if (p1.x === p2.x && p1.y === p2.y) return;
                // if (!antinodeMap[a]) antinodeMap[a] = [];
                const xDiff = p1.x - p2.x;
                const yDiff = p1.y - p2.y;
                const antiP = [{x: p1.x - xDiff, y: p1.y - yDiff}, {x: p1.x + xDiff, y: p1.y + yDiff},{x: p2.x + xDiff, y: p2.y + yDiff},{x: p2.x - xDiff, y: p2.y - yDiff}]

                const antinodes = antiP.filter(p => !((p.x === p1.x && p.y === p1.y) || (p.x === p2.x && p.y === p2.y)));

                antinodes.forEach(p => {
                    if (!isOutOfBounds(p)) {
                        antinodeMap[getKey(p)] = [a];
                    }
                })
            })
        })
    })


    console.log("Part 1: ", Object.keys(antinodeMap).length);
}