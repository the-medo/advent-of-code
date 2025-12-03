
type D3Joltage = {
    n1: number;
    n2: number;
}

type D3Joltages = number[];

const computeJoltage = (digits: number, numbers: number[]): D3Joltages => {
    if (digits === 0) return [];
    let max = numbers[0]
    let resultingIndex = 0;
    numbers.forEach((n, i) => {
        if (i > numbers.length - digits) return;
        if (n > max) {
            max = n;
            resultingIndex = i;
        }
    })

    return [max, ...computeJoltage(digits - 1, numbers.slice(resultingIndex + 1))]
}

exports.solution = (input: string[]) => {
    const t0 = performance.now();

    let joltages1: D3Joltages[] = [];
    let joltages2: D3Joltages[] = [];
    input.forEach(row => {
        const numbers = row.split('').map(Number);
        const joltage1 = computeJoltage(2, numbers)
        const joltage2 = computeJoltage(12, numbers)
        joltages1.push(joltage1);
        joltages2.push(joltage2);
        console.log("Row: ", row, "J:", joltage1)
    })

    const part1 = joltages1.map(j => parseInt(j.join(''))).reduce((acc, curr) => acc + curr, 0);
    const part2 = joltages2.map(j => parseInt(j.join(''))).reduce((acc, curr) => acc + curr, 0);

    console.log(`Part 1: ${part1}`)
    console.log(`Part 2: ${part2}`)

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}