type MathOperation =  "*" | "/" | "+" | "-";

type MathMonkeyFormula = {
    operand1?: MathMonkey,
    operation: MathOperation,
    operand2?: MathMonkey,
};

type MathMonkey = {
    id: string,
    value?: number,
    containsMe?: boolean,
    formula?: MathMonkeyFormula,
    neededMonkeyIds: string[],
}

const logFormula = (f: MathMonkeyFormula | undefined, containsMeAsX: boolean = false): string => {
    if (f === undefined) return `Formula: undefined`

    let o1 = `${f.operand1?.value}`;
    let o2 = `${f.operand2?.value}`;
    if (containsMeAsX) {
        if (f.operand1?.containsMe) o1 = 'x';
        if (f.operand2?.containsMe) o2 = 'x';
    }
    return `Formula: (${o1} ${f.operation} ${o2})`
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

const containsMe = (m: MathMonkey) => {
    if (m.value !== undefined) m.containsMe = m.id === 'humn';
    if (m.formula && m.formula.operand1 && m.formula.operand2) {
        containsMe(m.formula.operand1);
        containsMe(m.formula.operand2);
        m.containsMe = m.formula.operand1.containsMe || m.formula.operand2.containsMe;
    }
}

const reverseSolve = (wantedAnswer: number, f: MathMonkeyFormula ) => {
    console.log("Wanted answer: ", wantedAnswer, "Formula: ", logFormula(f, true));
    if (f.operand1?.containsMe && !f.operand1.formula && f.operand2) { // ITS ME
        f.operand1.value = computeNewValue(1, wantedAnswer, f.operand2.value!, f.operation);
    } else if (f.operand2?.containsMe && !f.operand2.formula && f.operand1) {  // ITS ME
        f.operand2.value = computeNewValue(2, wantedAnswer, f.operand1.value!, f.operation);
    } else if (f.operand1?.value && f.operand2?.value) {
        if (f.operand1?.containsMe && f.operand1.formula) reverseSolve(computeNewValue(1, wantedAnswer, f.operand2.value, f.operation), f.operand1.formula);
        else if (f.operand2?.containsMe && f.operand2.formula) reverseSolve(computeNewValue(2, wantedAnswer, f.operand1.value, f.operation), f.operand2.formula);
    }
}

const computeNewValue = (operandPosition: number, wantedAnswer: number, correctNumber: number, operation: MathOperation): number => {
    if (operandPosition === 1) {
        /*  current wanted answer = 100
                formula = X - 2000 => ([2100] - 2000 = 100) => new wanted answer = 100 + 2000 = 2100
                formula = X +   50 => (  [50] +   50 = 100) => new wanted answer = 100 - 50 = 50
                formula = X *    2 => (  [50] *    2 = 100) => new wanted answer = 100 / 2 = 50
                formula = X /   10 => ([1000] /   10 = 100) => new wanted answer = 100 * 10 = 1000         */
        if (operation === '-') return wantedAnswer + correctNumber;
        else if (operation === '+') return wantedAnswer - correctNumber;
        else if (operation === '*') return wantedAnswer / correctNumber;
        else if (operation === '/') return wantedAnswer * correctNumber;
    } else if (operandPosition === 2) {
        /*  current wanted answer = 100
                formula = 2000 - X => (2000 -  100 = [1900]) => new wanted answer = 1900
                formula = 1000 + X => ( 100 - 1000 = [-900]) => new wanted answer = -900
                formula =    5 * X => ( 100 /    5 =   [20]) => new wanted answer =   20
                formula = 3000 / X => (3000 /  100 =   [30]) => new wanted answer =   30         */
        if (operation === '-') return correctNumber - wantedAnswer;
        else if (operation === '+') return wantedAnswer - correctNumber;
        else if (operation === '*') return wantedAnswer / correctNumber;
        else if (operation === '/') return correctNumber / wantedAnswer;
    }
    throw Error("Incorrect operand position and operation")
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
            containsMe: undefined,
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
    console.log("PART 1 - final root monkey value: ", monkeys['root'].value);

    console.log("PART 2");
    console.log("My value before: ", monkeys['humn'].value);
    containsMe(monkeys['root']);
    const rf = monkeys['root'].formula;
    if (rf && rf.operand1 && rf.operand2) {
        if (rf.operand1.containsMe && rf.operand2.value && rf.operand1.formula) {
            console.log("Reverse solving to match operand 2 ", rf.operand2.value, " => ", logFormula(rf.operand1.formula, true));
            reverseSolve(rf.operand2.value, rf.operand1.formula);
        }
        else if (rf.operand2.containsMe && rf.operand1.value && rf.operand2.formula) {
            console.log("Reverse solving to match operand 1 ", rf.operand1.value, " => ", logFormula(rf.operand2.formula, true));
            reverseSolve(rf.operand1.value, rf.operand2.formula);
        }
        else throw Error("Something is wrong");
    }
    console.log("My value after: ", monkeys['humn'].value);

}