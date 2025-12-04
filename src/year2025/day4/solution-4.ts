type D4Pos = {
    x: number;
    y: number;
}

exports.solution = (input: string[]) => {
    const t0 = performance.now();

    const m: string[] = [];
    input.forEach((i) => {
        m.push(i);
    });

    console.log(m)

    const rowLength = m![0].length

    let accessiblePaperRolls = 0;


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
                    accessiblePaperRolls++;
                    finalRow += 'x';
                } else {
                    finalRow += m[row][col];
                }
            } else {
                finalRow += '.'
            }
        }
        console.log(finalRow)
    }

    console.log("Part 1: ", accessiblePaperRolls);
    
    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}