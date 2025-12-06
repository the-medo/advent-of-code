type D6Math = {
    parts: number[];
    action: string;
    result: number;
}

const computeD6MathResult = (m: D6Math) => {
    m.result = m.parts.reduce((acc, curr) =>
        m.action === '*'
            ? acc * curr
            : acc + curr,
        m.action === '*'
            ? 1
            : 0
    )
}

const createD6Math = (): D6Math => ({
    parts: [],
    action: '',
    result: 0,
})

const d6Part1 = (input: string[]) => {
    const maths: D6Math[] = [];
    let totalSum = 0;
    input.forEach((row, rowNumber) => {
        const trimmedRow = row.replace(/\s+/g, ' ').replace(/^\s+/g, '');
        const mathProblemParts = trimmedRow.split(' ');
        mathProblemParts.forEach((part, colNumber) => {
            if (!maths[colNumber]) {
                maths.push(createD6Math())
            }
            if (rowNumber === input.length - 1) {
                maths[colNumber].action = part;
                computeD6MathResult(maths[colNumber]);
                totalSum += maths[colNumber].result;
                console.log(maths[colNumber])
            } else {
                maths[colNumber].parts.push(Number(part));
            }
        })
    })

    console.log("Part 1: ", totalSum);
}

const d6Part2 = (input: string[]) => {
    const maxCol = Math.max(...input.map(row => row.length)) - 1

    const maths: D6Math[] = [];
    let totalSum = 0;
    let currentMath = createD6Math();

    for (let colNumber = maxCol; colNumber >= 0; colNumber--) {
        let stringifiedNumber = '';
        let willBeNewMath = false;
        input.forEach((row, rowNumber) => {
            if (rowNumber === input.length - 1) {
                if (row[colNumber] === '*' || row[colNumber] === '+') {
                    currentMath.action = row[colNumber];
                    willBeNewMath = true; // action is always in the first column
                }
            } else {
                stringifiedNumber = `${stringifiedNumber}${row[colNumber] ?? ' '}`;
            }
        })
        currentMath.parts.push(Number(stringifiedNumber));

        if (willBeNewMath) {
            computeD6MathResult(currentMath);
            totalSum += currentMath.result;
            console.log(currentMath)
            colNumber--; // next column are just spaces
            maths.push({...currentMath})
            currentMath = createD6Math();
        }

    }

    console.log("Part 2: ", totalSum);
}

exports.solution = (input: string[]) => {
    const t0 = performance.now();

    d6Part1(input);
    d6Part2(input);

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}