import console from "node:console";

type D9RedTile = {
    x: number;
    y: number;
    nextPointDirection?: 'up' | 'down' | 'left' | 'right' | undefined;
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

    const mRows: Record<number, D9RedTile[] | undefined> = {}
    const mCols: Record<number, D9RedTile[] | undefined> = {}
    const redTiles: D9RedTile[] = [];
    const rectangles: D9Rectangle[] = [];

    let mostRecentRedTile: D9RedTile | undefined;

    const updateNextPointDirection = (mostRecentTile: D9RedTile, newTile: D9RedTile) => {
        if (newTile.x === mostRecentTile.x) {
            mostRecentTile.nextPointDirection = newTile.y > mostRecentTile.y ? 'down' : 'up';
        } else if (newTile.y === mostRecentTile.y) {
            mostRecentTile.nextPointDirection = newTile.x > mostRecentTile.x ? 'right' : 'left';
        } else {
            console.error("This shouldn't happen!")
        }
    }

    input.forEach(row => {
        const [colIndex, rowIndex] = row.split(',').map(Number);

        const newRedTile: D9RedTile = { x: colIndex, y: rowIndex }

        if (mostRecentRedTile) {
            updateNextPointDirection(mostRecentRedTile, newRedTile);
        }
        mostRecentRedTile = newRedTile;
        if (!mRows[newRedTile.y]) mRows[newRedTile.y] = [];
        if (!mCols[newRedTile.x]) mCols[newRedTile.x] = [];
        mRows[newRedTile.y]!.push(newRedTile);
        mCols[newRedTile.x]!.push(newRedTile);

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

    updateNextPointDirection(redTiles[0], mostRecentRedTile!);

    rectangles.sort((a,b) => b.area - a.area);
    console.log("Rectangles: ", rectangles)



    const checkRectangle = (r: D9Rectangle): boolean => {
        const startX = Math.min(r.start.x, r.end.x)
        const endX = Math.max(r.start.x, r.end.x)
        const startY = Math.min(r.start.y, r.end.y)
        const endY = Math.max(r.start.y, r.end.y)
        const log = r.start.x === 2 && r.start.y === 3 && r.end.x === 11 && r.end.y === 1

        if (log) console.log({startX, endX, startY, endY})

        // top row: startX -> endX; startY              --not allowed: 'down'
        // right column: startY -> endY; endX           --not allowed: 'left'
        // bottom row: endX -> startX; endY             --not allowed: 'up'
        // left column: endY -> startY; startX          --not allowed: 'right'

        const checkDirection = (rowOrCol: 'row' | 'col', start: number, end: number, index: number, notAllowedDirection: D9RedTile['nextPointDirection']) => {
            const redTilesOnLine = rowOrCol === 'row' ? mRows[index] : mCols[index];
            const tileWithNotAllowedDirection = redTilesOnLine?.find(rtol => {
                if (log) console.log({rtol})
                if (rowOrCol === 'row' && rtol.x > start && rtol.x < end) {
                    if (log) console.log("valid for check")
                    if (rtol.nextPointDirection === notAllowedDirection) return true;
                } else if (rowOrCol === 'col' && rtol.y > start && rtol.y < end) {
                    if (log) console.log("valid for check")
                    if (rtol.nextPointDirection === notAllowedDirection) return true;
                }
                return false;
            })
            if (log) console.log({tileWithNotAllowedDirection})
            return tileWithNotAllowedDirection === undefined;
        }

        const topLineCheck = checkDirection('row', startX, endX, startY, 'down');
        const rightLineCheck = checkDirection('col', startY, endY, endX, 'left');
        const bottomLineCheck = checkDirection('row', startX, endX, endY, 'up');
        const leftLineCheck = checkDirection('col', startY, endY, startX, 'right');

        return topLineCheck && rightLineCheck && bottomLineCheck && leftLineCheck;
    }

    const finalRectangle = rectangles.find(checkRectangle);


    console.log("Part 2: ", finalRectangle)

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}

exports.solution = (input: string[]) => {
    d9Part1(input)
    d9Part2(input)
}