type D12Point = {
    x: number;
    y: number;
    c: string;
    neighborsOfSameType: D12Point[];
    plotted: boolean;
}
type D12Map = D12Point[][]

type D12Plot = {
    c: string;
    points: D12Point[];
    area: number;
    perimeter: number;
    sides: number;
}



exports.solution = (input: string[]) => {

    const run = (part: number) => {
        const t0 = performance.now();
        const height = input.length, width = input[0].length;
        const isOutOfBoundsXY = (x: number, y: number) => x < 0 || x >= width || y < 0 || y >= height;
        const m: D12Map = [];
        const plots: D12Plot[] = [];

        const addNeighbors = (p1: D12Point, p2: D12Point) => {
            if (p1.c === p2.c) {
                p1.neighborsOfSameType.push(p2);
                p2.neighborsOfSameType.push(p1);
            }
        }

        input.forEach((row, y) => {
            row.split('').forEach((c, x) => {
                if (!m[x]) m[x] = [];
                m[x][y] = {x, y, c, neighborsOfSameType: [], plotted: false};
                if (!isOutOfBoundsXY(x - 1, y)) addNeighbors(m[x][y], m[x - 1][y])
                if (!isOutOfBoundsXY(x, y - 1)) addNeighbors(m[x][y], m[x][y - 1])
            })
        })

        const getNumberOfSides = (pl: D12Plot): number => {
            let sides = 0;

            const cornerMap: Record<string, number | undefined> = {}

            const addToCornerMap = (x: number, y: number) => {
                const k = `${x};${y}`;
                if (!cornerMap[k]) cornerMap[k] = 0;
                cornerMap[k]!++;
            }

            // - every point has 4 corners
            // - every point corner has its own "corner position"
            // - we want to know total number of occurrences of these point corner positions of this plot
            pl.points.forEach(p => {
                addToCornerMap(p.x, p.y);
                addToCornerMap(p.x, p.y+1);
                addToCornerMap(p.x+1, p.y);
                addToCornerMap(p.x+1, p.y+1);
            })

            // - if corner position occurred 1 or 3 times in the plot, it means that its a corner, so number of sides increases
            // - if it occurred 2 times, it is continuous side (or edge case, read later)
            // - if it occurred 4 times, it is inside the area of a plot
            // EDGE CASE: in case of 2 times, it can also be the same plot but touching corners (topLeft with bottomRight or topRight with bottomLeft)
            //            - if that is the case, we just increase sides by 2 instead
            Object.keys(cornerMap).forEach(k => {
                const touchingCorners = cornerMap[k];
                if (!touchingCorners) return;
                if (touchingCorners % 2 === 1) { // 1 or 3 times === valid corner => side increase
                    sides++;
                } else if (touchingCorners === 2) { // edge case check
                    let [x, y] = k.split(';').map(Number)
                    const topLeft = (x > 0 && y > 0) ? m[x - 1][y - 1].c : '';
                    const topRight = (y > 0 && x < width) ? m[x][y - 1].c : '';
                    const bottomLeft = (x > 0 && y < height) ? m[x - 1][y].c : '';
                    const bottomRight = (x < width && y < height) ? m[x][y].c : '';

                    if (topLeft === bottomRight && topLeft === pl.c && topLeft != '') {
                        sides += 2;
                    } else if (bottomLeft === topRight && bottomLeft === pl.c && bottomLeft != '') {
                        sides += 2;
                    }
                }
            })

            return sides;
        }

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const point = m[x][y];
                if (!point.plotted) {
                    const newPlot: D12Plot = {
                        c: point.c,
                        points: [],
                        area: 0,
                        perimeter: 0,
                        sides: 0,
                    }

                    const stack = [point]
                    while (stack.length > 0) {
                        const p = stack.pop();
                        if (p && !p.plotted) {
                            p.plotted = true;
                            newPlot.points.push(p)
                            newPlot.area++;
                            newPlot.perimeter += (4 - p.neighborsOfSameType.length);
                            p.neighborsOfSameType.forEach(n => {
                                if (!n.plotted && n.c === point.c) {
                                    stack.push(n)
                                }
                            })
                        }
                    }

                    if (part === 2) newPlot.sides = getNumberOfSides(newPlot);

                    plots.push(newPlot);
                }
            }
        }

        if (part === 1) console.log("Part 1: ", plots.reduce((p,c) => p + c.area * c.perimeter, 0))
        if (part === 2) console.log("Part 2: ", plots.reduce((p,c) => p + c.area * c.sides, 0))
        const t1 = performance.now();
        console.log(`Execution time: ${t1 - t0} milliseconds.`);
    }

    run(1)
    run(2);
}