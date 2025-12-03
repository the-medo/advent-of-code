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
        return doubledId;
    }
    return 0;
}

const isInvalidIdForLength = (s: string[], len: number) => (s.length % len === 0 && s.length > len && !s.find((c, i) => c !== s[i % len]))

const checkValueAgainstRange2 = (value: number, r: D2Range): number => {
    const s = value.toString().split('');
    for (let i = 6; i > 0; i--) { //just assuming there are no more than 12 digit numbers (6*2)
        if (isInvalidIdForLength(s, i)) return value;
    }
    return 0
}

exports.solution = (input: string[]) => {
    const t0 = performance.now();

    const ranges: D2Range[] = [];

    input[0].split(",").forEach(i => {
        const number = i.split('-');
        const [min, max] = number.map(Number);
        ranges.push({ min, max });
    });

    // ------------------------------------------------------------------------
    let invalidIdsPart1 = 0;
    let sumPart1 = 0;

    ranges.forEach(r => {
        const minHalf = getFirstHalf(r.min, 'min');
        const maxHalf = getFirstHalf(r.max, 'max');

        for (let i = minHalf; i <= maxHalf; i++) {
            const invalid = checkValueAgainstRange(i, r);
            if (invalid > 0) {
                invalidIdsPart1++;
                sumPart1 += invalid;
            }
        }
        /**
         * Special case
         */
        if (maxHalf < minHalf) {
            let invalid = checkValueAgainstRange(minHalf, r);
            if (invalid > 0) {
                invalidIdsPart1++;
                sumPart1 += invalid;
            }
        }
    })

    console.log(`Part 1: ${sumPart1} (${invalidIdsPart1})`);
    const t1 = performance.now();
    console.log(`Execution time 1: ${t1 - t0} milliseconds.`);

    // ------------------------------------------------------------------------
    let invalidIdsPart2 = 0;
    let sumPart2 = 0;

    ranges.forEach(r => {
        for (let i = r.min; i <= r.max; i++) {
            const invalid = checkValueAgainstRange2(i, r);
            if (invalid > 0) {
                invalidIdsPart2++;
                sumPart2 += invalid;
            }
        }
    });

    console.log(`Part 2: ${sumPart2} (${invalidIdsPart2})`);
    // ------------------------------------------------------------------------

    const t2 = performance.now();
    console.log(`Execution time 2: ${t2 - t1} milliseconds.`);
}