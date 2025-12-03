
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

const computeFinalJoltage = (joltages: D3Joltages[]): number => {
    return joltages.map(j => parseInt(j.join(''))).reduce((acc, curr) => acc + curr, 0);
}

const computePart = (part: number, input: string[], digits: number) => {
    const t0 = performance.now();
    let joltages: D3Joltages[] = [];
    input.forEach(row => {
        const numbers = row.split('').map(Number);
        const joltage1 = computeJoltage(digits, numbers);
        joltages.push(joltage1);
    });

    const result = computeFinalJoltage(joltages);
    const t1 = performance.now();
    console.log(`Part ${part}: ${result} [${t1 - t0} ms]`)
}

exports.solution = (input: string[]) => {
    computePart(1, input, 2);
    computePart(2, input, 12);
}