import console from "node:console";

type D9RedTile = {
    x: number;
    y: number;
}

type D9Rectangle = {
    start: D9RedTile;
    end: D9RedTile;
    area: number;
}

const d9Part1 = (input: string[]) => {
    const t0 = performance.now();

    const redTiles: D9RedTile[] = [];
    const rectangles: D9Rectangle[] = [];
    let maxArea = 0;
    input.forEach((row) => {
        const [colIndex, rowIndex] = row.split(',').map(Number);
        const newRedTile: D9RedTile = { x: colIndex, y: rowIndex }

        redTiles.forEach(oldRedTile => {
            const area = (Math.abs(newRedTile.x - oldRedTile.x) + 1) * (Math.abs(newRedTile.y - oldRedTile.y) + 1);

            rectangles.push({
                start: newRedTile,
                end: oldRedTile,
                area,
            })

            if (area > maxArea) {
                maxArea = area;
            }
        })

        redTiles.push(newRedTile);
    })

    console.log("Part 1: ", maxArea)

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}

const d9Part2 = (input: string[]) => {
    const t0 = performance.now();
    const m: Record<number, Record<number, string>> = {}
    const redTiles: D9RedTile[] = [];
    const rectangles: D9Rectangle[] = [];
    let maxX = 0
    let maxY = 0

    input.forEach(row => {
        const [colIndex, rowIndex] = row.split(',').map(Number);

        const newRedTile: D9RedTile = { x: colIndex, y: rowIndex }

        if (colIndex > maxX) maxX = colIndex;
        if (rowIndex > maxY) maxY = rowIndex;
        if (!m[newRedTile.y]) m[newRedTile.y] = {};
        m[newRedTile.y][newRedTile.x] = '#';


        redTiles.forEach(oldRedTile => {
            const area = (Math.abs(newRedTile.x - oldRedTile.x) + 1) * (Math.abs(newRedTile.y - oldRedTile.y) + 1);

            rectangles.push({
                start: newRedTile,
                end: oldRedTile,
                area,
            })
        })

        redTiles.push(newRedTile);
    })

    rectangles.sort((a,b) => b.area - a.area);

    const checkedIfCheckedBefore = (x: number, y: number) => {
        if (!m[y]) {
            m[y] = {};
            return 'not-checked';
        }
        if (m[y][x] === 'X') return false; // checked before and failed
        if (m[y][x] === '#') return true;  // checked before and succeeded
        return 'not-checked';
    }

    const checkPointInPolygon = (p: D9RedTile, polygon: D9RedTile[]) => {
        const { x, y } = p;
        let windingNumber = 0
        for (let i = 0; i < polygon.length; i++) {
            const { x: x1, y: y1 } = polygon[i];
            const { x: x2, y: y2 } = polygon[ (i + 1) % polygon.length];

            if (x1 === x2 && p.x === x1 && p.y >= Math.min(y1, y2) && p.y <= Math.max(y1, y2)) return true;
            if (y1 === y2 && p.y === y1 && p.x >= Math.min(x1, x2) && p.x <= Math.max(x1, x2)) return true;

            if (y1 <= y) {
                if (y2 > y && ((x2 - x1) * (y - y1) - (x - x1) * (y2 - y1)) > 0) {
                    windingNumber++;
                }
            } else {
                if (y2 <= y && ((x2 - x1) * (y - y1) - (x - x1) * (y2 - y1)) < 0) {
                    windingNumber--;
                }
            }
        }

        return windingNumber !== 0;
    }

    const checkRectangle = (r: D9Rectangle, polygon: D9RedTile[]) => {
        const startX = Math.min(r.start.x, r.end.x)
        const endX = Math.max(r.start.x, r.end.x)
        const startY = Math.min(r.start.y, r.end.y)
        const endY = Math.max(r.start.y, r.end.y)

        const pointsToCheck: D9RedTile[] = [];

        for (let currentX = startX; currentX <= endX; currentX++) {
            let checkedBefore = checkedIfCheckedBefore(currentX, startY)
            if (checkedBefore === 'not-checked') {
                pointsToCheck.push({x: currentX, y: startY})
            } else if (checkedBefore === false) {
                return false;
            }

            checkedBefore = checkedIfCheckedBefore(currentX, endY)
            if (checkedBefore === 'not-checked') {
                pointsToCheck.push({x: currentX, y: endY})
            } else if (checkedBefore === false) {
                return false;
            }
        }
        for (let currentY = startY; currentY <= endY; currentY++) {

            let checkedBefore = checkedIfCheckedBefore(startX, currentY)
            if (checkedBefore === 'not-checked') {
                pointsToCheck.push({x: startX, y: currentY})
            } else if (checkedBefore === false) {
                return false;
            }

            checkedBefore = checkedIfCheckedBefore(endX, currentY)
            if (checkedBefore === 'not-checked') {
                pointsToCheck.push({x: endX, y: currentY})
            } else if (checkedBefore === false) {
                return false;
            }
        }

        const pointThatsNotInPolygon = pointsToCheck.find(p => {
            const isInPolygon = checkPointInPolygon(p, polygon);
            if (isInPolygon) {
                m[p.y][p.x] = '#';
            } else {
                m[p.y][p.x] = 'X';
            }
            return !isInPolygon;
        });

        return pointThatsNotInPolygon === undefined;
    }

    const finalRectangle = rectangles.find(r => checkRectangle(r, redTiles));


    console.log("Part 2: ", finalRectangle)

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}

exports.solution = (input: string[]) => {
    d9Part1(input)
    d9Part2(input)
}