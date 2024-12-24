import {stringSort, stringSortDesc} from "../../ts/utils/stringSort";

type D24Wire = {
    c: string;
    value: number;
}
type D24Operation = 0 | 1 | 2;
type D24Connections = {
    w1: string,
    w2: string,
    operation: D24Operation, // AND, OR, XOR respectively
    f: string;
}

const operationMap: Record<string, D24Operation> = {
    "AND": 0,
    "OR": 1,
    "XOR": 2,
};

exports.solution = (input: string[]) => {
    let wires: Record<string, number> = {};
    let commands: D24Connections[] = [];
    let fillingCommands = false;
    const finalResults: string[] = []
    input.forEach(row => {
        if (row === '') {
            fillingCommands = true;
            return;
        }
        if (fillingCommands) {
            const [command, resultInto] = row.split(" -> ");
            const [w1, operation, w2] = command.split(" ");
            const transformedOperation = 0;
            commands.push({
                w1,
                w2,
                operation: operationMap[operation]!,
                f: resultInto,
            })
            if (resultInto[0] === 'z') finalResults.push(resultInto);
        } else {
            const [wireName, wireValue] = row.split(': ');
            wires[wireName] = parseInt(wireValue);
        }
    })

    console.log(wires)
    console.log(commands)

    let stack: D24Connections[] = commands;

    while (stack.length > 0) {
        const c = stack.shift();
        if (c) {
            if (wires[c.w1] === undefined) console.log("Missing ", c.w1)
            if (wires[c.w2] === undefined) console.log("Missing ", c.w2)
            if (wires[c.w1] === undefined || wires[c.w2] === undefined) {
                stack.push(c);
                continue;
            }
            console.log("Computing..!!")
            if (c.operation === 1) { // OR
                wires[c.f] = wires[c.w1] || wires[c.w2] ? 1 : 0;
            } else if (c.operation === 2) { // XOR
                wires[c.f] = wires[c.w1] !== wires[c.w2] ? 1 : 0;
            } else if (c.operation === 0) { // XOR
                wires[c.f] = wires[c.w1] === 1 && wires[c.w2] === 1 ? 1 : 0;
            }
            if (c.f[0] === 'z') {
                const all = finalResults.find(z => wires[z] === undefined) === undefined;
                if (all) {
                    stack = [];
                }
            }
        }
    }

    const sortedWires = Object.keys(wires).sort(stringSortDesc);

    const keysStartingWithZ = sortedWires.filter(k => k[0] === 'z');
    const mappedToNumbers = keysStartingWithZ.map(z => wires[z]);
    const binary = mappedToNumbers.join('');
    const val = parseInt(binary, 2);
    console.log("Part 1: ", val);
}