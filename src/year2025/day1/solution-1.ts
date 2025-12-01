exports.solution = (input: string[]) => {
    let dial = 50;
    let steps = 0;

    input.forEach(line => {
        const direction = line[0];
        const count = parseInt(line.slice(1));

        dial += direction === "R" ? count : -count;
        dial = dial % 100;
        if  (dial < 0) {
            dial += 100;
        }

        console.log(direction, count, dial);
        if (dial === 0) {
            steps++;
        }
    })


    const t0 = performance.now();
    
    console.log("Step 1", steps);
    
    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}