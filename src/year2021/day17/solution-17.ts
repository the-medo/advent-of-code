exports.solution = (input: string[]) => {
    const t0 = performance.now();
    const [[xFrom, xTo], [yFrom, yTo]]= input[0].split(": ")[1].split(", ").map(a => a.split("=")[1].split("..").map(Number));

    let maxY = 0;
    const startVelocity = 0 - yFrom - 1;
    for (let i = startVelocity; i >= 0; i--) {
        maxY += i;
    }

    console.log("Part 1: ", maxY)

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}