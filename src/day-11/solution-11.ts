const _ = require('lodash');
type MonkeyOperationType = "*" | "+";
type MonkeyOperation = {
    type: MonkeyOperationType,
    value: bigint | "old",
}

type MonkeyTest = {
    divisible: number,
    true: number,
    false: number,
}

type Monkey = {
    items: bigint[],
    operation: MonkeyOperation;
    test: MonkeyTest;
    inspections: number;
}

const DefaultMonkey = (): Monkey => ({
    items: [],
    operation: {
        type: "*",
        value: BigInt('0'),
    },
    test: {
        divisible: 1,
        true: 0,
        false: 0,
    },
    inspections: 0,
});

const evaluateMonkeyOperation = (input: bigint, operation: MonkeyOperation, part: number = 1): bigint => {
    let result = (operation.value === "old" ? input : operation.value);
    if (operation.type === "*") result = result * input;
    if (operation.type === "+") result = result + input;
    return part === 1 ? result / BigInt(3) : result;
}

const evaluateMonkeyTest = (input: bigint, test: MonkeyTest): number => input % BigInt(test.divisible) === BigInt(0) ? test.true : test.false;

const monkeyRound = (monkeys: Monkey[], part: number = 1) => {
    for (let i = 0; i < monkeys.length; i++) {
        while (monkeys[i].items.length) {
            const item = evaluateMonkeyOperation(monkeys[i].items.shift() ?? BigInt(0), monkeys[i].operation, part);
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
        else if (i % 7 === 1) monkeys[id].items = l.replace("  Starting items: ", "").split(", ").map(i => BigInt(i));
        else if (i % 7 === 2) {
            const parsed = l.replace("  Operation: new = old ", "").split(" ");
            monkeys[id].operation = {
                type: parsed[0] as MonkeyOperationType,
                value: parsed[1] === "old" ? "old" : BigInt(parsed[1]),
            };
        }
        else  if (i % 7 === 3) monkeys[id].test.divisible = parseInt(l.replace("  Test: divisible by ", ""));
        else  if (i % 7 === 4) monkeys[id].test.true = parseInt(l.replace("    If true: throw to monkey ", ""));
        else  if (i % 7 === 5) monkeys[id].test.false = parseInt(l.replace("    If false: throw to monkey ", ""));
        else  if (i % 7 === 6) id++;
    });
    const monkeys2: Monkey[] = _.cloneDeep(monkeys);

    const roundCount1 = 20;
    for (let i = 0; i < roundCount1; i++) monkeyRound(monkeys, 1);
    console.log(monkeys.sort((a, b) => b.inspections - a.inspections).slice(0, 2).reduce((p, c) => p * c.inspections, 1));

    const roundCount2 = 10000;
    for (let i = 0; i < roundCount2; i++) monkeyRound(monkeys2, 2);
    console.log(monkeys2.sort((a, b) => b.inspections - a.inspections).slice(0, 2).reduce((p, c) => p * c.inspections, 1));
}