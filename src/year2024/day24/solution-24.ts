import {stringSort, stringSortDesc} from "../../ts/utils/stringSort";

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
    const t0 = performance.now();
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

    /**
     * Recursively process operand nodes to get final value of node "n"
     * @param n
     */
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

    Object.values(graph).forEach(n => processNode(n));

    /**
     * Helper function to recursively write-out the rules
     *
     * Results in something like this, if "recursive" param is 2:
     *
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
    const nodeRules = (n: D24Node, values: boolean, recursive: number): string => {
        if (n.operandNodes.length === 0) return values ? n.value.toString() : n.n;
        if (recursive === 0) return `(${n.operands[0]} ${n.operation} ${n.operands[1]} [${n.n}])`;
        return `(${nodeRules(n.operandNodes[0], values, recursive - 1)} ${n.operation} ${nodeRules(n.operandNodes[1], values, recursive - 1)}) [${n.n}]`
    }


    const sortedWires = Object.keys(graph).sort(stringSortDesc);
    const getKeysFromLetter = (letter: string) => sortedWires.filter(k => k[0] === letter[0]);
    const getBinaryValueFromLetter = (letter: string) => getKeysFromLetter(letter).map(z => graph[z].value).join('');
    const getCode = (x: string, n: number) => n < 10 ? `${x}0${n}` : `${x}${n}`;

    /** Result of part 1 */
    const binaryZ = getBinaryValueFromLetter('z')

    /**
     * Simple swap function to swap position of two nodes in a graph and in "operationMap"
     * Used to "fix" errors in the main loop, so the loop can continue correctly finding next errors.
     * @param a
     * @param b
     */
    const swap = (a: string, b: string): boolean => {
        let ga = graph[a], gb = graph[b], gbTemp = {...gb};
        let oa = ga.operands.join(ga.operation), ob = gb.operands.join(gb.operation);
        graph[b] = {...ga};
        graph[a] = gbTemp;
        operationMap[oa] = b;
        operationMap[ob] = a;
        return true;
    }

    /**
     * Preprocess of the main loop
     * Assumption (by checking the input) that the first two steps and last step (containing the last ripple) are correct
     */
    const x00ANDy00 = operationMap[`x00ANDy00`];
    const x01XORy01 = operationMap[`x01XORy01`];

    let lowerCondition = getOperationCode(x01XORy01, x00ANDy00, 'AND');
    let lowerLevelAnd = `x01ANDy01`;
    let mismatchedOperations: string[] = [];

    /**
     * Main loop of the second part
     */
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

        //Part 1: // lowerLevelAndResult (x01 AND y01 [bdf]) OR lowerConditionResult (jjd AND whb [wbw])
        const part1 = getOperationCode(lowerLevelAndResult, lowerConditionResult, 'OR');
        let part1Result = operationMap[part1];
        //Part 2: // currectXorResult (x02 XOR y02) [wsv];
        let part2Result = currentXorResult;
        // Part1 XOR Part 2
        const mainXor = getOperationCode(part1Result, part2Result, 'XOR');
        const mainXorResult = operationMap[mainXor];

        const part1Node = z.operandNodes.find(on => on.n === part1Result);
        const part2Node = z.operandNodes.find(on => on.n === part2Result);

        let swapped = false;
        if (z.operation !== 'XOR' || (!part1Node && !part2Node)) { //check for the main XOR
            mismatchedOperations.push(zCode, mainXorResult);
            swapped = swap(zCode, mainXorResult);
        } else if (!part1Node && part2Node) { //find part 1
            const theOtherNode = z.operandNodes.find(on => on.n !== part2Node.n)!;
            mismatchedOperations.push(part1Result, theOtherNode.n);
            swapped = swap(part1Result, theOtherNode.n);
        } else if (part1Node && !part2Node) { // find part 2
            const theOtherNode = z.operandNodes.find(on => on.n !== part1Node.n)!;
            mismatchedOperations.push(part2Result, theOtherNode.n);
            swapped = swap(part2Result, theOtherNode.n);
        }

        //we need to get new, correct values for these parts, in case we found the swap
        if (swapped) {
            part1Result = operationMap[part1];
            part2Result = operationMap[currentXor];
        }

        lowerLevelAnd = getOperationCode(getCode('x', i), getCode('y', i), 'AND');
        lowerCondition = getOperationCode(part1Result, part2Result, 'AND');
    }

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
    console.log("Part 1: ", parseInt(binaryZ, 2), binaryZ);
    console.log("Part 2: ", mismatchedOperations.sort(stringSort).join(","));
}