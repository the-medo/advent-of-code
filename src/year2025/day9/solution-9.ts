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

exports.solution = (input: string[]) => {
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
                console.log("New max area: ", maxArea, oldRedTile, newRedTile)
            }
        })

        redTiles.push(newRedTile);
    })

    console.log("Part 1: ", maxArea)
    
    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}