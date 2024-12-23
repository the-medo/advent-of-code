exports.solution = (input: string[]) => {
    const compMap: Record<string, Record<string, boolean>> = {};
    input.forEach(row => {
        const [comp1, comp2] = row.split('-');
        if (!compMap[comp1]) compMap[comp1] = {};
        if (!compMap[comp2]) compMap[comp2] = {};
        compMap[comp1][comp2] = true;
        compMap[comp2][comp1] = true;
    })

    const allComps = Object.keys(compMap);

    const groups: Record<string, boolean> = {};
    const groupsWithT: Record<string, boolean> = {};
    allComps.forEach(c1 => {
        const connectedComps = Object.keys(compMap[c1]);
        connectedComps.forEach(c2 => {
            const connectedComps2 = Object.keys(compMap[c2]);
            connectedComps2.forEach(c3 => {
                if (c3 !== c1) {
                    if (compMap[c1][c3]) {
                        const sortedKey = [c1,c2,c3].sort((a,b) => a.localeCompare(b)).join(',');
                        groups[sortedKey] = true;
                        if (c1.startsWith('t') || c2.startsWith('t') || c3.startsWith('t')) {
                            groupsWithT[sortedKey] = true;
                        }
                    }
                }
            })
        })
    })

    console.log(compMap);
    console.log(groups);
    console.log(groupsWithT);
    console.log("Part 1: ", Object.keys(groupsWithT).length)
}