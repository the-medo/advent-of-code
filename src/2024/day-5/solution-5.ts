type D5Rules = Record<number, Record<number, boolean | undefined> | undefined>
type D5UpdateLine = number[];
type D5Presence = Record<number, boolean | undefined>;

exports.solution = (input: string[]) => {
    const gap = input.findIndex(x => x === '')

    const rules: D5Rules = input.splice(0, gap).map(x => x.split('|').map(Number) as [number, number]).reduce((p, c) => ({
        ...p,
        [c[1]]: {
            ...p[c[1]],
            [c[0]]:true,
        }
    }), {} as D5Rules)
    const updateLines: D5UpdateLine[] = input.splice(1).map(x => x.split(',').map(Number));

    const checkRules = (rules: D5Rules, updateLine: D5UpdateLine): [true, undefined] | [false, [number, number]] => {
        const presence: D5Presence = updateLine.reduce((p, v) => ({...p, [v]: true}), {})
        const includes: Record<number, boolean> = {}
        let correct = true;
        let brokenRule: [number, number] = [0, 0];

        updateLine.forEach(u => {
            includes[u] = true;

            if (rules[u] !== undefined) {
                const containsMistake = Object.keys(rules[u] ?? {}).findIndex(x => {
                    const prev = parseInt(x);

                    if (presence[prev]) {
                        if (includes[prev]) {
                            return false;
                        }
                        brokenRule = [u, prev];
                        return true;
                    }
                    return false;
                });

                if (containsMistake >= 0) {
                    correct = false
                }
            }
        })

        return correct ? [true, undefined] : [false, brokenRule];
    }

    const fixBrokenRule = (brokenRule: [number, number], updateLine: D5UpdateLine): D5UpdateLine => {
        const uIndex = updateLine.findIndex(u => u === brokenRule[0])
        const prevValue = updateLine.splice(updateLine.findIndex(u => u === brokenRule[1]), 1)[0];
        return [...updateLine.slice(0, uIndex), prevValue, brokenRule[0], ...updateLine.slice(uIndex+1)];
    }

    let sumPart1 = 0;
    let sumPart2 = 0;

    updateLines.forEach(u => {
        const result = checkRules(rules, u)
        if (result[0]) {
            sumPart1 += u[Math.floor(u.length / 2)]
        } else {
            let newUpdateLine = [...u];
            let brokenRule = [...result[1]] as [number, number] | undefined;
            while (brokenRule) {
                newUpdateLine = fixBrokenRule(brokenRule, newUpdateLine);
                [, brokenRule] = checkRules(rules, newUpdateLine);
            }
            sumPart2 += newUpdateLine[Math.floor(newUpdateLine.length / 2)]
        }
    })

    console.log("Part1: ", sumPart1)
    console.log("Part2: ", sumPart2)

}