exports.solution = (input: string[]) => {
    const t0 = performance.now();
    const moduloBy = 16777216;

    const cache = new Map<number, number>();
    const processNumber = (n: number) => {
        if (cache.has(n)) {
            return cache.get(n)!
        }
        const step1 = n ^ (n * 64 % moduloBy) ;
        const step2 = step1 ^ (Math.floor(step1 / 32) % moduloBy) ;
        const step3 = step2 ^ (step2 * 2048 % moduloBy);
        cache.set(n, step3);
        return step3;
    }

    let sum = 0;
    const changeMap = new Map<number, number[]>();

    const processBuyer = (n: number) => {
        const changes: number[] = [0];
        const buyerChangeMap = new Map<number, boolean>();

        for (let i = 0; i < 2000; i++) {
            const newNumber = processNumber(n);
            changes[i] = (newNumber % 10) - (n % 10)
            n = newNumber;
            if (i <= 3) continue;
            changes.push(newNumber);

            /** using number key instead of string key takes the runtime down from 1,5s to 1s */
                //const key = `${changes[i - 3]};${changes[i - 2]};${changes[i - 1]};${changes[i]}`;
            const key =  changes[i - 3] * 1000000 + changes[i - 2] * 10000 + changes[i - 1] * 100 + changes[i];

            if (buyerChangeMap.has(key)) continue; // one buyer can sell only one number, so for each buyer we save only the first one in that changes
            buyerChangeMap.set(key, true);

            if (changeMap.has(key)) {
                changeMap.get(key)?.push(newNumber % 10);
            } else {
                changeMap.set(key, [newNumber % 10]);
            }
        }

        return n;
    }

    input.forEach(row => sum += processBuyer(parseInt(row)));

    let bestCombo = 0;
    changeMap.forEach(numbers => {
        const numSum = numbers.reduce((a, b) => a + b, 0)
        if (numSum > bestCombo) bestCombo = numSum
    })

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
    console.log("Part 1: ", sum)
    console.log("Part 2: ", bestCombo)
}