
type D3Joltage = {
    n1: number;
    n2: number;
}

exports.solution = (input: string[]) => {
    const t0 = performance.now();

    let joltages: D3Joltage[] = [];
    input.forEach(row => {
        const numbers = row.split('').map(Number);
        let n1 = numbers[0], n2 = numbers[1];

        numbers.forEach((n, i) => {
            if (i < 1) return;
            if (i === numbers.length -1) {
                if (n > n2) n2 = n;
                return;
            }
            if (n > n1) {
                n1 = n;
                n2 = numbers[i+1];
            } else if (n > n2) {
                n2 = n;
            }
        });
        const joltage = {n1, n2};
        joltages.push(joltage);
        console.log("Row: ", row, "J:", joltage)
    })

    const part1 = joltages.map(j => j.n1 * 10 + j.n2).reduce((acc, curr) => acc + curr, 0);

    console.log(`Part 1: ${part1}`)

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}