import {xor} from "../../ts/utils/xor";

exports.solution = (input: string[]) => {
    const moduloBy = 16777216;

    const cache = new Map<number, number>();
    const processNumber = (n: number) => {
        if (cache.has(n)) {
            return cache.get(n)!
        }
        // const step1 = (n ^ (n * 64)) % moduloBy;
        const step1 = xor(n, n * 64) % moduloBy;
        const step2 = xor(step1, Math.floor(step1 / 32)) % moduloBy;
        const step3 = xor(step2, step2 * 2048) % moduloBy;
        cache.set(n, step3);
        return step3;
    }

    let sum = 0;
    const changeMap = new Map<string, number[]>();
    input.forEach(row => {
        let n = parseInt(row)!;
        const changes: number[] = [0];
        const buyerChangeMap = new Map<string, boolean>();
        for (let i = 0; i < 2000; i++) {
            const newNumber = processNumber(n);
            if (i > 0) {
                changes[i] = (newNumber % 10) - (n % 10)
                if (i > 3) {
                    const key = `${changes[i - 3]};${changes[i - 2]};${changes[i - 1]};${changes[i]}`;
                    if (!buyerChangeMap.has(key)) {
                        if (changeMap.has(key)) {
                            changeMap.get(key)?.push(newNumber % 10);
                        } else {
                            changeMap.set(key, [newNumber % 10]);
                        }
                        buyerChangeMap.set(key, true);
                    }
                    changes.push(newNumber);
                }
            }
            n = newNumber;
        }
        sum += n;
    });

    let bestCombo = 0;
    changeMap.forEach(numbers => {
        const numSum = numbers.reduce((a, b) => a + b, 0)
        if (numSum > bestCombo) bestCombo = numSum
    })

    console.log("Part 1: ", sum)
    console.log("Part 2: ", bestCombo)
    console.log("Part 2: ", changeMap.get('-2;1;-1;3'))
}