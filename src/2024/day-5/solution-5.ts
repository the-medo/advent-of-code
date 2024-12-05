type D5Rules = [number, number][];
type D5Rules2 = Record<number, Record<number, boolean | undefined> | undefined>
type D5Update = number[];
type D5Presence = Record<number, boolean | undefined>;

exports.solution = (input: string[]) => {
    const gap = input.findIndex(x => x === '')

    const rules: D5Rules2 = input.splice(0, gap).map(x => x.split('|').map(Number) as [number, number]).reduce((p,c) => ({
        ...p,
        [c[1]]: {
            ...p[c[1]],
            [c[0]]:true,
        }
    }), {} as D5Rules2)
    const updates: D5Update[] = input.splice(1).map(x => x.split(',').map(Number));

    const checkRulesForUpdate = (rules: D5Rules2, update: D5Update): [true, undefined] | [false, [number, number]] => {
        const presence: D5Presence = update.reduce((p, v) => ({...p, [v]: true}), {})
        const includes: Record<number, boolean> = {}
        let correct = true;
        let brokenRule: [number, number] = [0, 0];
        console.log("===update:", update);

        update.forEach(u => {
            includes[u] = true;
            // console.log("u:" , u)
            if (rules[u] !== undefined) {
                // console.log("rules:" , rules[u])
                const containsMistake = Object.keys(rules[u] ?? {}).findIndex(x => {
                    const prev = parseInt(x);
                    // console.log("x", x, "includes", includes[prev], "presence ", presence[prev]);
                    //x must be present
                    if (presence[prev]) {
                        if (includes[prev]) {
                            return false;
                        }
                        brokenRule = [u, prev];
                        return true;
                    }
                    return false;
                });
                // console.log("Contains: ", containsMistake)
                if (containsMistake >= 0) {
                    correct = false
                }
            }
        })
        return correct ? [true, undefined] : [false, brokenRule];
    }

    const fixBrokenRule = (brokenRule: [number, number], update: D5Update): D5Update => {
        const uIndex = update.findIndex(u => u === brokenRule[0])
        const prevValue = update.splice(update.findIndex(u => u === brokenRule[1]), 1)[0];
        console.log({uIndex, prevValue})
        return [...update.slice(0, uIndex), prevValue, brokenRule[0], ...update.slice(uIndex+1)];
    }
    console.log(rules)
    console.log(updates)


    let correctCount = 0;
    let sumPart1 = 0;
    let sumPart2 = 0;
    updates.forEach(u => {
        const result = checkRulesForUpdate(rules, u)
        console.log(" ========= ", result, " ========= ")
        if (result[0]) {
            correctCount++;
            console.log("Update: ", u[Math.ceil(u.length / 2)])
            sumPart1 += u[Math.floor(u.length / 2)]
        } else {
            let isRuleFixed = false;
            let newRule = [...u];
            let brokenRule = [...result[1]] as [number, number];
            let i = 0;
            while (!isRuleFixed) {
                i++
                console.log("New rule: (before) ", newRule)
                newRule = fixBrokenRule(brokenRule, newRule);
                console.log("New rule: (after) ", newRule)
                const f = checkRulesForUpdate(rules, newRule);
                isRuleFixed = f[0];
                if (!isRuleFixed) brokenRule = f[1]!;
                console.log(f);
            }
            sumPart2 += newRule[Math.floor(newRule.length / 2)]
            console.log("Fixed rule:", newRule)
        }
    })

    console.log("Part1: ", correctCount, "sum: ", sumPart1)
    console.log("Part2: ", sumPart2)

}