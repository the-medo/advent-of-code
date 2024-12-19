exports.solution = (input: string[]) => {
    const t0 = performance.now();
    const availablePatterns = input[0].split(', ');
    const wantedPatterns = input.splice(2);

    const availablePatternsByLetter: Record<string, string[]> = {'w':[],'u':[],'b':[],'r':[],'g':[]}
    availablePatterns.forEach(wp => availablePatternsByLetter[wp[0]].push(wp));

    const cache: Record<string, number> = {}

    const solve = (s: string): number => {
        if (s === "") return 1;

        /**  ~~~~~~~~~ REMAINDER FOR SELF ~~~~~~~~
         * if (0) => false!
         * if (cache[s]) fails when cache[s] is zero
         * NEED TO CHECK cache[s] vs. undefined
         */
        if (cache[s] !== undefined) return cache[s];

        let count = 0;
        availablePatternsByLetter[s[0]].forEach(p => {
            if (s.startsWith(p)) count += solve(s.slice(p.length));
        })

        cache[s] = count;
        return count;
    }

    const result = wantedPatterns.map(wp => solve(wp)).filter(wp => wp > 0)

    console.log("Part 1: ", result.length)
    console.log("Part 2: ", result.reduce((a,b) => a + b, 0))

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}