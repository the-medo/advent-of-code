exports.solution = (input: string[]) => {
    // ================ Regex solution... previous one was without regex,

    let part1 = 0, part2 = 0;
    const matches = input.join('').matchAll(/mul\((\d{1,3}),(\d{1,3})\)|don't\(\)|do\(\)/g);

    let isEnabled = true;
    for (let [fullMatch, val1, val2] of matches) {
        console.log({fullMatch, val1, val2});
        if (fullMatch[0] === 'm') {
            const v = parseInt(val1) * parseInt(val2)
            part1 += v;
            if (isEnabled) {
                part2 += v;
            }
        } else {
            isEnabled = fullMatch === 'do()';
        }
    }

    console.log("Part 1: ", part1);
    console.log("Part 2: ", part2);

    // ================ One-liner solution...
    console.log([...input.join('').matchAll(/mul\((\d{1,3}),(\d{1,3})\)|don't\(\)|do\(\)/g)].map(m => [m[0], (m[1] ? Number(m[1]) * Number(m[2]) : 0)] as const).reduce((p, c) => c[1] === 0 ? {...p, e: c[0] === 'do()' ? 1 : 0} : {p1: p.p1 + c[1], p2: p.p2 + (c[1] * p.e), e: p.e }, {p1: 0, p2: 0, e: 1}));
}