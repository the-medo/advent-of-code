type D14Point = {
    x: number;
    y: number;
}

type D14Robot = {
    start: D14Point,
    p: D14Point,
    v: D14Point
}

exports.solution = (input: string[]) => {
    const robots: D14Robot[] = [];

    const width = 101, height = 103;
    // const width = 11, height = 7;

    input.forEach((row) => {
        const [px,py,vx,vy] = (row.split(" ").map(pv => pv.split("=")[1]).map(nums => nums.split(",").map(Number)).flat())
        robots.push({
            start: {
                x: px,
                y: py,
            },
            p: {
                x: px,
                y: py,
            },
            v: {
                x: vx,
                y: vy,
            }
        })
    })

    const moveRobotXTimes = (r: D14Robot, times: number) => {
        r.p.x += r.v.x * times;
        r.p.x = r.p.x < 0 ? width + (r.p.x % width) : r.p.x % width;
        if (r.p.x === width) r.p.x = 0

        r.p.y += r.v.y * times;
        r.p.y = r.p.y < 0 ? height + (r.p.y % height) : r.p.y % height;
        if (r.p.y === height) r.p.y = 0
    }



    //part1
    let inQuadrants = [0,0,0,0]
    const widthHalf = Math.floor(width / 2);
    const heightHalf = Math.floor(height / 2);
    robots.forEach(r => {
        moveRobotXTimes(r, 100);
        if ( r.p.x < widthHalf ) {
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
        r.p.x = r.start.x
        r.p.y = r.start.y
    })
    console.log("Robots: ", robots)
    console.log("InQuadrants: ", inQuadrants )
    console.log("Result: ", inQuadrants[0] * inQuadrants[1] * inQuadrants[2] * inQuadrants[3] )



    let map: Record<number, Record<number, boolean>> = {}

    const displayRobots = () => {
        console.log("=====================================")
        for (let i = 0; i < height; i++) {
            let row = '';
            for (let j = 0; j < width; j++) {
                if (map[i] && map[i][j]) {
                    row += 'X';
                } else {
                    row += '.';
                }
            }
            console.log(row);
        }
        console.log("=====================================")
    }

    const checkForTreeSymmetrical = (): boolean => {
        for (let i = 0; i < height; i++) {
            for (let x1 = 0; x1 < width / 2; x1++) {
                let x2 = width - x1 - 1;
                if (!map[i][x1] || !map[i][x2]) {
                    return false;
                }
            }
        }
        return true;
    }

    const checkForTreeByRows = (): boolean => {
        let longestNeighbors = 0;
        let rowLongestNeighbors: Record<number, number> = {}
        for (let i = 0; i < height; i++) {
            rowLongestNeighbors[i] = 0;
            let len = 0;
            for (let x = 0; x < width; x++) {
                if (map[i] && map[i][x]) {
                    len++
                } else {
                    if (len > rowLongestNeighbors[i]) rowLongestNeighbors[i] = len;
                    if (len > longestNeighbors) longestNeighbors = len;
                    len = 0;
                }
            }
        }
        // console.log("Longest neighbors: ", longestNeighbors)
        return longestNeighbors > 10;
    }

    /*
        for (let i = 1; i<100; i++) {
            map = {};
            robots.forEach(r => {
                moveRobotXTimes(r, 1);
                if (!map[r.p.y]) map[r.p.y] = {}
                map[r.p.y][r.p.x] = true;
            })
            displayRobots()
        }*/


    inQuadrants = [0,0,0,0]
    let haveTree = false, seconds = 0;
    while (!haveTree) {
        seconds++;
        map = {};
        robots.forEach(r => {
            moveRobotXTimes(r, 1);
            if (!map[r.p.y]) map[r.p.y] = {}
            map[r.p.y][r.p.x] = true;
            /*if (r.p.x < widthHalf) {
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
            }*/
        })
        if (seconds % 1000 === 0 ) {
            console.log("SECONDS: ", seconds)
        }
        if (checkForTreeByRows()) {
            haveTree = true;
            console.log("TREE SECONDS: ", seconds)
            displayRobots()
        }

        /*if (inQuadrants[0] === inQuadrants[1] && inQuadrants[2] === inQuadrants[3]) {
            console.log("Checking!!", seconds)
            displayRobots()
            if (checkForTreeSymmetrical()) {
                haveTree = true;
                console.log("SECONDS: ", seconds)
            }
        }*/
    }
}