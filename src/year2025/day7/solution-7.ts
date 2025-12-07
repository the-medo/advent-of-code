type D7Beams = Record<number, true>

exports.solution = (input: string[]) => {
    const t0 = performance.now();

    let beamPositions: D7Beams = {};
    let splitCounts = 0;
    input.forEach((row, i) => {
        if (i === 0) {
            const startingBeam = row.indexOf('S') ;
            if (startingBeam) beamPositions[startingBeam] = true;
            return;
        }

        const chars = row.split('');
        console.log(chars, beamPositions);
        chars.forEach((c, ci) => {
            if (c === '^' && beamPositions[ci]) {
                delete beamPositions[ci];
                beamPositions[ci + 1] = true;
                beamPositions[ci - 1] = true;
                splitCounts++;
            }
        })
    })

    console.log("Part 1: ", splitCounts);
    
    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}