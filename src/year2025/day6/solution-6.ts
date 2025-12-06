type D6Math = {
    parts: number[];
    action: string;
    result: number;
}

exports.solution = (input: string[]) => {
    const t0 = performance.now();

    const maths: D6Math[] = [];
    let totalSum = 0;
    input.forEach((row, rowNumber) => {
        const trimmedRow = row.replace(/\s+/g, ' ').replace(/^\s+/g, '');
        const mathProblemParts = trimmedRow.split(' ');
        mathProblemParts.forEach((part, colNumber) => {
            if (!maths[colNumber]) {
                maths.push({
                    parts: [],
                    action: '',
                    result: 0,
                })
            }
            if (rowNumber === input.length - 1) {
                maths[colNumber].action = part;
                maths[colNumber].result = maths[colNumber].parts.reduce((acc, curr) =>
                    maths[colNumber].action === '*'
                        ? acc * curr
                        : acc + curr,
                    maths[colNumber].action === '*'
                        ? 1
                        : 0
                )
                totalSum += maths[colNumber].result;
                console.log(maths[colNumber])
            } else {
                maths[colNumber].parts.push(Number(part));
            }
        })
    })
    
    console.log("Part 1: ", totalSum);
    
    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}