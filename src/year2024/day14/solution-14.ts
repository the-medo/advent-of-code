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
    })

    console.log("Robots: ", robots)
    console.log("InQuadrants: ", inQuadrants )
    console.log("Result: ", inQuadrants[0] * inQuadrants[1] * inQuadrants[2] * inQuadrants[3] )
}