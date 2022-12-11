type MonkeyOperationType = "*" | "+";
type MonkeyOperation = {
    type: MonkeyOperationType,
    value: number | "old",
}

type MonkeyTest = {
    divisible: number,
    true: number,
    false: number,
}

type Monkey = {
    items: number[],
    operation: MonkeyOperation;
    test: MonkeyTest;
    inspections: number;
}

const DefaultMonkey = (): Monkey => ({
    items: [],
    operation: {
        type: "*",
        value: 0,
    },
    test: {
        divisible: 1,
        true: 0,
        false: 0,
    },
    inspections: 0,
});

const evaluateMonkeyOperation = (input: number, operation: MonkeyOperation): number => {
    let result = (operation.value === "old" ? input : operation.value);
    if (operation.type === "*") result *= input;
    if (operation.type === "+") result += input;
    return Math.floor(result / 3);
}

const evaluateMonkeyTest = (input: number, test: MonkeyTest): number => input % test.divisible === 0 ? test.true : test.false;

const monkeyRound = (monkeys: Monkey[]) => {
    for (let i = 0; i < monkeys.length; i++) {
        while (monkeys[i].items.length) {
            const item = evaluateMonkeyOperation(monkeys[i].items.shift() ?? 0, monkeys[i].operation);
            monkeys[i].inspections++;
            monkeys[evaluateMonkeyTest(item, monkeys[i].test)].items.push(item);
        }
    }
}

exports.solution = (input: string[]) => {
    let id = 0;
    const monkeys: Monkey[] = [];

    input.forEach((l, i) => {
        if (i % 7 === 0) monkeys[id] = DefaultMonkey();
        else if (i % 7 === 1) monkeys[id].items = l.replace("  Starting items: ", "").split(", ").map(i => parseInt(i));
        else if (i % 7 === 2) { //  Operation: new = old * 3
            const parsed = l.replace("  Operation: new = old ", "").split(" ");
            monkeys[id].operation = {
                type: parsed[0] as MonkeyOperationType,
                value: parsed[1] === "old" ? "old" : parseInt(parsed[1]),
            };
        }
        else  if (i % 7 === 3) monkeys[id].test.divisible = parseInt(l.replace("  Test: divisible by ", ""));
        else  if (i % 7 === 4) monkeys[id].test.true = parseInt(l.replace("    If true: throw to monkey ", ""));
        else  if (i % 7 === 5) monkeys[id].test.false = parseInt(l.replace("    If false: throw to monkey ", ""));
        else  if (i % 7 === 6) id++;
    });

    const roundCount = 20;
    for (let i = 0; i < roundCount; i++) monkeyRound(monkeys);

    console.log(monkeys.sort((a, b) => b.inspections - a.inspections).slice(0, 2).reduce((p, c) => p * c.inspections, 1));
}