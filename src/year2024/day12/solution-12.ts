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
}



exports.solution = (input: string[]) => {
    const height = input.length, width = input[0].length;
    const isOutOfBoundsXY = (x: number, y: number) => x < 0 || x >= width || y < 0 || y >= height;
    const getKey = (p: D12Point) => `${p.x};${p.y}`;
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
            m[x][y] = { x, y, c, neighborsOfSameType: [], plotted: false };
            if (!isOutOfBoundsXY(x-1, y)) addNeighbors(m[x][y], m[x-1][y])
            if (!isOutOfBoundsXY(x, y-1)) addNeighbors(m[x][y], m[x][y-1])
        })
    })

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const point = m[x][y];
            if (!point.plotted) {
                const newPlot: D12Plot = {
                    c: point.c,
                    points: [],
                    area: 0,
                    perimeter: 0,
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

                plots.push(newPlot);
            }
        }
    }

    let sum = 0;
    plots.forEach(p => {
        sum += p.area * p.perimeter
    })

    console.log(plots);
    console.log(m[1][1].neighborsOfSameType);
    console.log("Part 1: ", sum)

}