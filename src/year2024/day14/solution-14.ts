import console from "node:console";

type D14Point = {
    x: number;
    y: number;
}

type D14Robot = {
    p: D14Point,
    v: D14Point
}

exports.solution = (input: string[]) => {

    const parseInput = (): { robots: D14Robot[], width: number, height: number } => {
        const robots: D14Robot[] = [];
        let width = 0, height = 0;
        input.forEach((row, i) => {
            if (i === 0) { //I've manually added dimensions of the field as first row of my input!
                [width, height] = row.split(",").map(Number)
            } else {
                const [px, py, vx, vy] = (row.split(" ").map(pv => pv.split("=")[1]).map(nums => nums.split(",").map(Number)).flat())
                robots.push({
                    p: {
                        x: px,
                        y: py,
                    },
                    v: {
                        x: vx,
                        y: vy,
                    }
                })
            }
        })

        return {
            robots,
            width,
            height
        }
    }

    const moveRobotXTimes = (r: D14Robot, times: number, width: number, height: number) => {
        r.p.x += r.v.x * times;
        r.p.x = r.p.x < 0 ? width + (r.p.x % width) : r.p.x % width;
        if (r.p.x === width) r.p.x = 0

        r.p.y += r.v.y * times;
        r.p.y = r.p.y < 0 ? height + (r.p.y % height) : r.p.y % height;
        if (r.p.y === height) r.p.y = 0
    }

    const runPart1 = () => {
        const t0 = performance.now();
        const { robots, width, height } = parseInput();
        let inQuadrants = [0, 0, 0, 0]
        const widthHalf = Math.floor(width / 2);
        const heightHalf = Math.floor(height / 2);
        robots.forEach(r => {
            moveRobotXTimes(r, 100, width, height);
            if (r.p.x < widthHalf) {
                if (r.p.y < heightHalf) {
                    inQuadrants[0]++
                } else if (r.p.y > heightHalf) {
                    inQuadrants[2]++
                }
            } else if (r.p.x > widthHalf) {
                if (r.p.y < heightHalf) {
                    inQuadrants[1]++
                } else if (r.p.y > heightHalf) {
                    inQuadrants[3]++
                }
            }
        })
        console.log(`Part 1: `, inQuadrants[0] * inQuadrants[1] * inQuadrants[2] * inQuadrants[3])
        const t1 = performance.now();
        console.log(`Execution time: ${t1 - t0} milliseconds.`);
    }

    const runPart2 = () => {
        const t0 = performance.now();
        const { robots, width, height } = parseInput();
        let map: Record<number, Record<number, boolean>> = {}

        const displayRobots = () => {
            console.log("=====================================")
            for (let i = 0; i < height; i++) {
                let row = '';
                for (let j = 0; j < width; j++) row += map[i] && map[i][j] ? 'X' : '.';
                console.log(row);
            }
            console.log("=====================================")
        }

        const checkForTreeByLongestNeighbors = (): boolean => {
            let longestLine = 0;
            for (let i = 0; i < height; i++) {
                let len = 0;
                for (let x = 0; x < width; x++) {
                    if (map[i] && map[i][x]) {
                        len++
                    } else {
                        if (len > longestLine) longestLine = len;
                        len = 0;
                    }
                }
                if (longestLine > 10) return true;
            }
            return false;
        }

        let haveTree = false, seconds = 0;
        while (!haveTree) {
            seconds++;
            map = {};
            robots.forEach(r => {
                moveRobotXTimes(r, 1, width, height);
                if (!map[r.p.y]) map[r.p.y] = {}
                map[r.p.y][r.p.x] = true;
            })
            if (checkForTreeByLongestNeighbors()) {
                haveTree = true;
                displayRobots();
                console.log("Part 2: ", seconds, " seconds")
            }
        }

        const t1 = performance.now();
        console.log(`Execution time: ${t1 - t0} milliseconds.`);
    }

    runPart2();
    runPart1();
}