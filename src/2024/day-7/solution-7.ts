type D7Equation = {
    result: number;
    operands: number[];
    canBeSolved: boolean;
}

exports.solution = (input: string[]) => {
    let maxNums = 0;
    const lines: D7Equation[] = input.map(i => {
        const split = i.split(': ');
        return {
            result: parseInt(split[0]),
            operands: split[1].split(' ').map(Number),
            canBeSolved: true,
        }
    })
    lines.forEach(l => {if (maxNums < l.operands.length) maxNums = l.operands.length})

    const finish = (x: D7Equation, position: number, result: number): boolean => {
        if (result > x.result) return false;
        if (position === x.operands.length - 1) {
            return result === x.result;
        }
        return solveEquation(x, position + 1, result, '+') || solveEquation(x, position + 1, result, '*') || solveEquation(x, position + 1, result, '||')
    }

    const solveEquation = (x: D7Equation, position: number, resultTillNow: number, nextOperator: string): boolean => {
        if (position < x.operands.length) {
            if (nextOperator === '+') {
                return finish(x, position, resultTillNow + x.operands[position]);
            } else if (nextOperator === '*') {
                return finish(x, position, resultTillNow * x.operands[position]);
            } else if (nextOperator === '||') {
                let arr = '';
                for (let i = 0; i < x.operands[position].toString().length; i++) arr += '0';
                const result = parseInt(resultTillNow.toString() + arr )  + x.operands[position];
                return finish(x, position, result);
            }
        }
        return false;
    }

    let sum = 0;
    lines.forEach(l => {
        l.canBeSolved = solveEquation(l, 1, l.operands[0], '+') || solveEquation(l, 1, l.operands[0], '*') || solveEquation(l, 1, l.operands[0], '||');
        if (l.canBeSolved) {
            sum += l.result;
        }
    })

    console.log("Part 2: ", sum);
}