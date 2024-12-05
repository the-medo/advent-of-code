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

    const checkRulesForUpdate = (rules: D5Rules2, update: D5Update): boolean => {
        const presence: D5Presence = update.reduce((p, v) => ({...p, [v]: true}), {})
        const includes: Record<number, boolean> = {}
        let correct = true;
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

        return correct
    }
    console.log(rules)
    console.log(updates)


    let correctCount = 0;
    let sum = 0;
    updates.forEach(u => {
        const result = checkRulesForUpdate(rules, u)
        console.log(" ========= ", result, " ========= ")
        if (result) {
            correctCount++;
            console.log("Update: ", u[Math.ceil(u.length / 2)])
            sum += u[Math.floor(u.length / 2)]
        }
    })

    console.log("Part1: ", correctCount, "sum: ", sum)

}