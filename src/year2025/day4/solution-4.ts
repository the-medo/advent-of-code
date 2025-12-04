const removeRolls = (m: string[], draw: boolean) => {

    const rowLength = m![0].length

    let accessiblePaperRolls = 0;
    let newMap: string[] = [];

    for (let row = 0; row < m.length; row++) {
        let finalRow = '';
        for (let col = 0; col < rowLength; col++) {
            if (m[row][col] === '@') {
                let rollsAround = 0;
                if (row > 0) {
                    if (col > 0 && m[row-1][col-1] === '@') rollsAround++;
                    if (m[row-1][col] === '@') rollsAround++;
                    if (col < rowLength - 1 && m[row-1][col+1] === '@') rollsAround++;
                }
                if (row < m.length - 1) {
                    if (col > 0 && m[row+1][col-1] === '@') rollsAround++;
                    if (m[row+1][col] === '@') rollsAround++;
                    if (col < rowLength - 1 && m[row+1][col+1] === '@') rollsAround++;
                }
                if (col > 0 && m[row][col-1] === '@') rollsAround++
                if (col < rowLength - 1 && m[row][col+1] === '@') rollsAround++

                if (rollsAround < 4) {
                    finalRow += 'x';
                    accessiblePaperRolls++;
                } else {
                    finalRow += m[row][col];
                }
            } else {
                finalRow += '.'
            }
        }
        newMap.push(finalRow.replace('x', '.'));
        if (draw) console.log(finalRow)
    }

    m.forEach((_, i) => {
        m[i] = newMap[i];
    })


    return accessiblePaperRolls;
}

exports.solution = (input: string[]) => {
    const t0 = performance.now();

    const m: string[] = [];
    input.forEach((i) => {
        m.push(i);
    });


    const part1 = removeRolls([...m], false);
    console.log("Part 1: ", part1);

    let part2 = 0;
    let removedRolls = 0;
    let rollMap = [...m]
    do {
        removedRolls = removeRolls(rollMap, false);
        part2 += removedRolls;
    } while (removedRolls > 0)

    console.log("Part 2: ", part2);
    
    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}