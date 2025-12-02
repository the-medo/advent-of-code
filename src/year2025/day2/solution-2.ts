type D2Range = {
    min: number,
    max: number,
}

const getFirstHalf = (rangePart: number, minMax: 'min' | 'max'): number => {
    let s = rangePart.toString();
    const halfLength = minMax === 'min' ? Math.floor(s.length / 2) : Math.ceil(s.length / 2);
    const firstHalf = s.substring(0, halfLength);
    return firstHalf.length === 0 ? 0 : parseInt(firstHalf);
}

const checkValueAgainstRange = (value: number, r: D2Range): number => {
    let doubledId = parseInt(`${value}${value}`);
    if (doubledId >= r.min && doubledId <= r.max) {
        console.log(doubledId)
        return doubledId;
    }
    return 0;
}

exports.solution = (input: string[]) => {
    const t0 = performance.now();

    const ranges: D2Range[] = [];

    input[0].split(",").forEach(i => {
        const number = i.split('-');
        const [min, max] = number.map(Number);
        ranges.push({ min, max });
        console.log({min, max})
    });

    let invalidIds = 0;
    let sum = 0;

    ranges.forEach(r => {
        const minHalf = getFirstHalf(r.min, 'min');
        const maxHalf = getFirstHalf(r.max, 'max');

        console.log({minHalf, maxHalf}, { min: r.min, max: r.max})

        for (let i = minHalf; i <= maxHalf; i++) {
            const invalid = checkValueAgainstRange(i, r);
            if (invalid > 0) {
                invalidIds++;
                sum += invalid;
            }
        }
        /**
         * Special case
         */
        if (maxHalf < minHalf) {
            let invalid = checkValueAgainstRange(minHalf, r);
            if (invalid > 0) {
                invalidIds++;
                sum += invalid;
            }
        }
    })
    
    console.log("Part 1: ", sum);
    
    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}