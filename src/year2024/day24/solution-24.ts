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

type D24Node = {
    n: string;
    operation: string,
    operands: string[];
    operandNodes: D24Node[];
    usedIn: D24Node[];
    value: number;
}

exports.solution = (input: string[]) => {
    let wires: Record<string, number> = {};
    let commands: D24Connections[] = [];
    let graph: Record<string, D24Node> = {};
    let fillingCommands = false;
    const finalResults: string[] = [];
    const operationMap: Record<string, string> = {};
    input.forEach(row => {
        if (row === '') {
            fillingCommands = true;
            return;
        }
        if (fillingCommands) {
            const [command, resultInto] = row.split(" -> ");
            let [w1, operation, w2] = command.split(" ");
            [w1,w2] = [w1, w2].sort(stringSort)
            graph[resultInto] = {
                n: resultInto,
                operation: operation,
                operands: [w1, w2],
                operandNodes: [],
                usedIn: [],
                value: Infinity,
            }
            operationMap[`${w1}${operation}${w2}`] = resultInto;
            if (resultInto[0] === 'z') finalResults.push(resultInto);
        } else {
            const [wireName, wireValue] = row.split(': ');
            graph[wireName] = {
                n: wireName,
                operation: '',
                operands: [],
                operandNodes: [],
                usedIn: [],
                value: parseInt(wireValue),
            }
        }
    });

    Object.entries(graph).forEach(([name, node],i) => {
        node.operands.forEach((o) => {
            graph[o].usedIn.push(node);
            node.operandNodes.push(graph[o]);
        })
    });

    console.log(wires)
    console.log(commands)

    const processNode = (n: D24Node) => {
        if (n.value === Infinity) {
            n.operandNodes.forEach(on => {
                if (on.value === Infinity) processNode(on);
            })
            const [on1, on2] = n.operandNodes;
            if (n.operation === "OR") { // OR
                n.value = on1.value || on2.value ? 1 : 0;
            } else if (n.operation === "XOR") { // XOR
                n.value = on1.value !== on2.value ? 1 : 0;
            } else if (n.operation === "AND") { // AND
                n.value = on1.value === 1 && on2.value === 1 ? 1 : 0;
            }

            n.usedIn.forEach(un => processNode(un));
        }
    }

    const nodeRules = (n: D24Node, values: boolean, recursive: number): string => {
        if (n.operandNodes.length === 0) return values ? n.value.toString() : n.n;
        if (recursive === 0) return `(${n.operands[0]} ${n.operation} ${n.operands[1]} [${n.n}])`;
        return `(${nodeRules(n.operandNodes[0], values, recursive - 1)} ${n.operation} ${nodeRules(n.operandNodes[1], values, recursive - 1)}) [${n.n}]`
    }

    Object.values(graph).forEach(n => processNode(n));

    const sortedWires = Object.keys(graph).sort(stringSortDesc);

    const getKeysFromLetter = (letter: string) => sortedWires.filter(k => k[0] === letter[0]);
    const getBinaryValueFromLetter = (letter: string) => getKeysFromLetter(letter).map(z => graph[z].value).join('');

    const binaryZ = getBinaryValueFromLetter('z')
    const binaryX = getBinaryValueFromLetter('x')
    const binaryY = getBinaryValueFromLetter('y')
    const wantedZ = (parseInt(binaryX, 2) + parseInt(binaryY, 2)).toString(2);
    const zKeys = getKeysFromLetter('z');


    console.log("Part 1: ", parseInt(binaryZ, 2), binaryZ);
    console.log(binaryX);
    console.log(binaryY);
    console.log(wantedZ);
    // console.log(graph['z34']);

    zKeys.forEach((zKey) => {
        console.log(nodeRules(graph[zKey], false, 2));
    })
    console.log(nodeRules(graph["rkv"], false, 2));
    console.log(graph["sdj"]);

    // console.log(graph['y12'].value, ' AND', graph['x12'].value, ' = mqn', graph['mqn'].value)
    // console.log(graph['ksn'].value, ' XOR', graph['nft'].value, ' = jpj', graph['jpj'].value)

    const getCode = (x: string, n: number) => n < 10 ? `${x}0${n}` : `${x}${n}`;

    const check = (n: number, previousAndInto: string) => {
        const x = getCode('x', n);
        const y = getCode('y', n);
        const and = `${x}AND${y}`;
        const xor = `${x}XOR${y}`;

        const currentXor = operationMap[xor];
        const currentAnd = operationMap[and];

        if (currentXor + 'XOR' + previousAndInto)

        if (previousAndInto !== '') {

        }

    }

    console.log(nodeRules(graph['bvp'], false, 2))
    console.log(graph['bvp'].usedIn)
    console.log(nodeRules(graph['kgj'], false, 2))
    console.log(['rts','z07','vvw','chv','kgj','z26','z12','jpj'].sort(stringSort).join(','))
}