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

const getOperationCode = (k1: string, k2: string, operation: string) => [k1,k2].sort(stringSort).join(operation);

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
            operationMap[getOperationCode(w1, w2, operation)] = resultInto;
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

    const x00XORy00 = operationMap[`x00XORy00`]; // has to be z00
    const x00ANDy00 = operationMap[`x00ANDy00`];
    const x01XORy01 = operationMap[`x01XORy01`];

    // let lowerCondition = x00ANDy00;
    let lowerCondition = getOperationCode(x01XORy01, x00ANDy00, 'AND');
    // let lowerLevelXor = x01XORy01;
    let lowerLevelAnd = `x01ANDy01`;
    let mismatchedOperations: string[] = [];

    /**
     * (((pnn OR whj [bmp]) AND (x44 XOR y44 [rrq])) [cbv] OR (x44 AND y44) [gqr]) [z45]
     * (((x43 AND y43 [pnn]) OR (sch AND srj [whj])) [bmp] XOR (x44 XOR y44) [rrq]) [z44]
     * (((ksp AND pvj [dkc]) OR (x42 AND y42 [mkg])) [sch] XOR (x43 XOR y43) [srj]) [z43]
     * ...
     * ((x04 XOR y04) [cjb] XOR ((x03 AND y03 [htr]) OR (bcj AND bkh [rhq])) [rjc]) [z04]
     * ((x03 XOR y03) [bcj] XOR ((qkf AND wsv [pqc]) OR (x02 AND y02 [vdf])) [bkh]) [z03]
     * (((x01 AND y01 [bdf]) OR (jjd AND whb [wbw])) [qkf] XOR (x02 XOR y02) [wsv]) [z02]
     * ((x01 XOR y01) [jjd] XOR (x00 AND y00) [whb]) [z01]
     * (x00 XOR y00) [z00]
     */
    console.log("----------------------------------------")
    for (let i = 2; i <= 42; i++) {
        const xCode = getCode('x', i);
        const yCode = getCode('y', i);
        const zCode = getCode('z', i);
        const z = graph[zCode];
        if (!z) throw new Error(zCode + " doesnt exist, weird");

        let currentXor = getOperationCode(xCode, yCode, "XOR");
        let currentXorResult = operationMap[currentXor];
        let lowerLevelAndResult = operationMap[lowerLevelAnd];
        let lowerConditionResult = operationMap[lowerCondition];
        console.log({lowerLevelAnd, lowerCondition, lowerLevelAndResult, lowerConditionResult})

        //Part 1: // lowerLevelAndResult (x01 AND y01 [bdf]) OR lowerConditionResult (jjd AND whb [wbw])
        const part1 = getOperationCode(lowerLevelAndResult, lowerConditionResult, 'OR');
        const part1Result = operationMap[part1];
        //Part 2: // currectXorResult (x02 XOR y02) [wsv];
        const part2Result = currentXorResult;
        // Part1 XOR Part 2
        const mainXor = getOperationCode(part1Result, part2Result, 'XOR');
        const mainXorResult = operationMap[mainXor];

        console.log(i, { part1, part1Result, part2Result})

        const part1Node = z.operandNodes.find(on => on.n === part1Result);
        const part2Node = z.operandNodes.find(on => on.n === part2Result);

        //check for XOR;
        if (z.operation !== 'XOR' || (!part1Node && !part2Node)) {
            mismatchedOperations.push(zCode, mainXorResult);
            lowerLevelAnd = getOperationCode(getCode('x', i), getCode('y', i), 'AND');
            lowerCondition = getOperationCode(part1Result, part2Result, 'AND');
            continue;
        }
        //find part 1:
        if (!part1Node && part2Node) {
            const theOtherNode = z.operandNodes.find(on => on.n !== part2Node.n)!;
            mismatchedOperations.push(part1Result, theOtherNode.n);
        } else if (part1Node && !part2Node) {
            const theOtherNode = z.operandNodes.find(on => on.n !== part1Node.n)!;
            mismatchedOperations.push(part2Result, theOtherNode.n);
        }
        lowerLevelAnd = getOperationCode(getCode('x', i), getCode('y', i), 'AND');
        lowerCondition = getOperationCode(part1Result, part2Result, 'AND');

    }

    // console.log(mismatchedOperations);
    // console.log(operationMap);

    // console.log(['rts','z07','vvw','chv','kgj','z26','z12','jpj'].sort(stringSort).join(','))
}