/*
_________________1111011 // 123
111100100110111001001110
111110111011001000100000
____10000000101111110001
____10101100000000001100
___101111011010100010100
110000011000011110010100
101010010110000110000000
101110101110100110001100
_11101100100111011011000
_10110100010011100011110

__________________100000 //  32
_________________1000000 //  64
____________100000000000 //2048


111100100110111001001110
111110111011001000100000
====X==XXX=XXX===XX=XXX=

_________________1111011 // 123
      111101100000000000
111100100110111001001110

______111101100000000000 // 123 * 2048
111101100000000000000000 // 123 * 2048 * 64
_____1111011000000000000 // 123 * 2048 * 64 / 32

_________________1111011 // 123
___________1111011000000 // 123 * 64 = 7872
___________1111010111011 // XOR(123, 123 * 64) = 7867 = step1
________________11110101 // Math.floor(7867/32) = 245
___________1111001001110 // XOR(7867, 245) = 7758 = step2
111100100111000000000000 // 7758 * 2048 = 15888384
111100100110111001001110 // XOR(7758, 7758 * 2048) = step 3 = final number after process



 */

exports.solution = (input: string[]) => {
    const t0 = performance.now();
    const moduloBy = 16777216;

    const cache = new Map<number, number>();
    const processNumber = (n: number, x: number = 0): number => {
        if (cache.has(n)) {
            return cache.get(n)!
        }
        if (x === 10) {
            console.log("====== =======")
            return 0;
        }

        if (x === 0) {
            console.log(`======> ${n} [${n.toString(2)}]`)
        }

        const step1 = n ^ (n * 64 % moduloBy) ;
        // console.log(`${n} [${n.toString(2)}] ^ ${n * 64} [${(n * 64).toString(2)}] => ${step1} [${step1.toString(2)}]`)

        const step2 = step1 ^ (Math.floor(step1 / 32) % moduloBy) ;
        // console.log(`${step1} [${step1.toString(2)}] ^ ${Math.floor(step1 / 32)} [${(Math.floor(step1 / 32)).toString(2)}] => ${step2} [${step2.toString(2)}]`)

        const step3 = step2 ^ (step2 * 2048 % moduloBy);
        // console.log(`${step2} [${step2.toString(2)}] ^ ${step2 * 2048} [${(step2 * 2048).toString(2)}] => ${step3} [${step3.toString(2)}]`)

        cache.set(n, step3);
        console.log(step3, step3.toString(2))

        return processNumber(step3, x+1);
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

    // input.forEach(row => sum += processBuyer(parseInt(row)));

    let bestCombo = 0;
    changeMap.forEach(numbers => {
        const numSum = numbers.reduce((a, b) => a + b, 0)
        if (numSum > bestCombo) bestCombo = numSum
    })

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
    console.log("Part 1: ", sum)
    console.log("Part 2: ", bestCombo)

    processNumber(123);
    processNumber(123*64);
    processNumber(123*2048);
}