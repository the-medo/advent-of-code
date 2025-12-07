type D7Beams = Record<number, number>

exports.solution = (input: string[]) => {
    const t0 = performance.now();

    let beamPositions: D7Beams = {};
    let splitCounts = 0;
    let timelineCounts = 1;
    input.forEach((row, i) => {
        if (i === 0) {
            const startingBeam = row.indexOf('S') ;
            if (startingBeam) beamPositions[startingBeam] = 1;
            return;
        }

        const chars = row.split('');
        console.log(chars, beamPositions);
        chars.forEach((c, ci) => {
            if (c === '^' && beamPositions[ci] > 0) {
                beamPositions[ci + 1] = (beamPositions[ci + 1] ?? 0) + beamPositions[ci];
                beamPositions[ci - 1] = (beamPositions[ci - 1] ?? 0) + beamPositions[ci];
                splitCounts++;
                timelineCounts += beamPositions[ci];
                beamPositions[ci] = 0;
            }
        })
    })

    console.log("Part 1: ", splitCounts);
    console.log("Part 2: ", timelineCounts);
    
    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}