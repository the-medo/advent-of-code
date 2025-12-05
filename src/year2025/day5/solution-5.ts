type D5Range = {
    from: number;
    to: number;
}

const parseInput = (input: string[]) => {
    const ranges: D5Range[] = [];
    const ids: number[] = [];

    let isRange = true;
    input.forEach(i => {
        if (i === '') {
            isRange = false
            return;
        }
        if (isRange) {
            const r = i.split('-').map(Number);
            ranges.push({from: r[0], to: r[1]})
        } else {
            ids.push(Number(i))
        }
    })

    return { ranges, ids };
}

const part1 = (input: string[]) => {
    const {ranges, ids} = parseInput(input);

    let freshCount = 0;

    ids.forEach(id => {
        const isFresh = ranges.find( r => r.from <= id && r.to >= id)
        if (isFresh) freshCount++;
    })

    console.log("Part 1:  ", freshCount);
}

const part2 = (input: string[]) => {
    const { ranges, ids } = parseInput(input);

    let mergedRanges: D5Range[] = [];

    ranges.forEach((r, i) => {
        const validRangesToMerge = mergedRanges.filter(mr =>
            (r.from >= mr.from && r.from <= mr.to ) ||
            (r.from <= mr.from && r.to >= mr.from )
        );
        console.log("Step ", i, {r, validRangesToMerge})
        if (validRangesToMerge.length !== 0) {
            mergedRanges = mergedRanges.filter(mr => !validRangesToMerge.includes(mr));
            mergedRanges.push({
                from: Math.min(r.from, ...validRangesToMerge.map(mr => mr.from)),
                to: Math.max(r.to, ...validRangesToMerge.map(mr => mr.to)),
            });
        } else {
            mergedRanges.push(r);
        }
    })

    let sum = mergedRanges.reduce((acc, arr) => acc + (arr.to - arr.from + 1), 0);

    console.log("Part 2: ", sum)

}

exports.solution = (input: string[]) => {
    const t0 = performance.now();

    part1(input);
    part2(input);

    
    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}