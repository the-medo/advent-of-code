exports.solution = (input: string[]) => {
    const t0 = performance.now();
    const [[xFrom, xTo], [yFrom, yTo]]= input[0].split(": ")[1].split(", ").map(a => a.split("=")[1].split("..").map(Number));

    let maxY = 0;
    const startVelocity = 0 - yFrom - 1;
    for (let i = startVelocity; i >= 0; i--) {
        maxY += i;
    }


    const xStart = 0, xEnd = xTo, yStart = yFrom, yEnd = startVelocity;

    const possibleStarts: [number, number][] = [];

    for (let x = xStart; x <= xEnd; x++) {
        for (let y = yStart; y <= yEnd; y++) {
            let velX = x;
            let velY = y;
            let curX = 0;
            let curY = 0;
            while (curX <= xTo && curY >= yFrom) {
                curX += velX;
                curY += velY;
                velX--;
                velY--;
                if (velX < 0) velX = 0;
                if (curX >= xFrom && curX <= xTo && curY >= yFrom && curY <= yTo) {
                    possibleStarts.push([x,y]);
                    break;
                }
            }
        }
    }

    console.log("Part 1: ", maxY);
    console.log("Part 2: ", possibleStarts.length);



    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}