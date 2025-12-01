exports.solution = (input: string[]) => {
    let dial = 50;
    let steps1 = 0;
    let steps2 = 0;

    input.forEach(line => {
        const direction = line[0];
        const count = parseInt(line.slice(1));

        let diff = dial === 0 && direction === "L" ? -1 : 0;
        dial += direction === "R" ? count : -count;
        diff += Math.abs(Math.floor(dial / 100)); // Math.floor(-0.2) = -1
        dial = dial % 100;                        // -20 % 100 = -20

        if  (dial < 0) {
            dial += 100;
        } else if (dial === 0) {
            steps1++;
            if (diff === 0 || direction === "L") diff++;
        }
        steps2 += diff;
    })

    const t0 = performance.now();
    
    console.log("Step 1", steps1);
    console.log("Step 2", steps2);

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}