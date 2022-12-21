type MathOperation =  "*" | "/" | "+" | "-";

type MathMonkey = {
    id: string,
    value?: number,
    formula?: {
        operand1?: MathMonkey,
        operation: MathOperation,
        operand2?: MathMonkey,
    },
    neededMonkeyIds: string[],
}

const solveMonkey = (m: MathMonkey): number => {
    if (m.value !== undefined) return m.value;
    const f = m.formula;
    if (f && f.operand1 && f.operand2) {
        if (f.operation === '*') m.value = solveMonkey(f.operand1) * solveMonkey(f.operand2);
        if (f.operation === '/') m.value = solveMonkey(f.operand1) / solveMonkey(f.operand2);
        if (f.operation === '+') m.value = solveMonkey(f.operand1) + solveMonkey(f.operand2);
        if (f.operation === '-') m.value = solveMonkey(f.operand1) - solveMonkey(f.operand2);
        return m.value!;
    }
    throw Error ("No value, no formula!");
}

const parseMathMonkeys = (monkeys: Record<string, MathMonkey>, input: string[]) => {
    input.forEach(i => {
        const [id, formula] = i.split(': ');
        const [operand1, operation, operand2] = formula.split(' ');
        let value;
        if (operation === undefined) value = parseInt(operand1);

        const monkey: MathMonkey = {
            id,
            value,
            formula: operation === undefined ? undefined : {operation: operation as MathOperation},
            neededMonkeyIds: [],
        }

        if (operation !== undefined) {
            monkey.neededMonkeyIds.push(operand1);
            monkey.neededMonkeyIds.push(operand2);
        }

        monkeys[id] = monkey;
    });

    Object.keys(monkeys).forEach(id => {
        const monkey = monkeys[id];
        if (monkey.neededMonkeyIds.length > 0 && monkey.formula) {
            monkey.formula.operand1 = monkeys[monkey.neededMonkeyIds[0]];
            monkey.formula.operand2 = monkeys[monkey.neededMonkeyIds[1]];
        }
    })
}

exports.solution = (input: string[]) => {
    const monkeys: Record<string, MathMonkey> = {};
    parseMathMonkeys(monkeys, input);

    solveMonkey(monkeys['root']);

    console.log(monkeys['root']);

}