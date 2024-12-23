import {stringSort} from "../../ts/utils/stringSort";

exports.solution = (input: string[]) => {
    const t0 = performance.now();
    const getKey = (a: string[]) => a.sort(stringSort).join(',');

    /** Parse input - map all computer pairs */
    const compMap: Record<string, Record<string, boolean>> = {};
    input.forEach(row => {
        const [comp1, comp2] = row.split('-');
        if (!compMap[comp1]) compMap[comp1] = {};
        if (!compMap[comp2]) compMap[comp2] = {};
        compMap[comp1][comp2] = true;
        compMap[comp2][comp1] = true;
    })

    /** Get groups of three computers with at least one computer name starting with "t"
     * For each computer (c1):
     *    - For each c1-connected computer (c2):
     *          - For each c2-connected computer (c3):
     *                  Check, if c3 is connected to c1, if yes, check if any of them starts with "t" and add to result accordingly
     * */
    const allComps = Object.keys(compMap);
    const groupsWithT = new Map<string, boolean>();
    allComps.forEach(c1 => {
        const connectedComps = Object.keys(compMap[c1]);
        connectedComps.forEach(c2 => {
            const connectedComps2 = Object.keys(compMap[c2]);
            connectedComps2.forEach(c3 => {
                if (c3 === c1 || !compMap[c1][c3]) return;
                if ([c1[0], c2[0], c3[0]].includes('t')) {
                    groupsWithT.set(getKey([c1,c2,c3]), true);
                }
            });
        });
    });

    /**
     * For each computer (mainComputer):
     *      - create LAN with this computer, and one by one check if connected computers are part of this LAN
     *      - if that computer is connected to all on LAN so far, add it to lan and continue checking other connected computers
     */
    let largestLanSize = 0;
    let largestLanKey: string = '';
    allComps.forEach(mainComputer => {
        let compsOnThisLan = [mainComputer];
        const compsConnectedToMainComputer = Object.keys(compMap[mainComputer]);
        compsConnectedToMainComputer.forEach(cc => {
            const connected = compsOnThisLan.find(ccsf => !(compMap[cc][ccsf])) === undefined;
            if (connected) compsOnThisLan.push(cc);
        })

        const lanKey = getKey(compsOnThisLan);
        if (compsOnThisLan.length > largestLanSize) {
            largestLanSize = compsOnThisLan.length;
            largestLanKey = lanKey;
        }
    })

    console.log("Part 1: ", groupsWithT.size);
    console.log("Part 2: ", largestLanKey);

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}