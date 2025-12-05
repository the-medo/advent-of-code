type D5Range = {
    from: number;
    to: number;
}

exports.solution = (input: string[]) => {
    const t0 = performance.now();

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

    let freshCount = 0;

    ids.forEach(id => {
        const isFresh = ranges.find( r => r.from <= id && r.to >= id)
        if (isFresh) freshCount++;
    })

    console.log({ranges, ids})
    
    console.log("Part 1:  ", freshCount);
    
    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}