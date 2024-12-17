import { xor } from "../../ts/utils/xor";

type D17Registers = [number, number, number]

exports.solution = (input: string[]) => {
    const registers = [0,1,2].map(i => parseInt(input[i].split(": ")[1])) as D17Registers;
    const program = input[4].split(": ")[1].split(",").map(Number)

    let instructionPointer = 0;


    const compute = (registers: D17Registers): string[] => {

        const getComboOperand = (o: number): number => {
            if (o <= 3) {
                return o;
            } else if (o === 4) {
                return registers[0];
            } else if (o === 5) {
                return registers[1];
            } else if (o === 6) {
                return registers[2];
            }
            return 0;
        }

        const instruction = (ip: number, log: boolean = false): [boolean, string|undefined] => {
            if (ip+1>=program.length) {
                console.log("HALT")
                return [false, undefined];
            }
            const opcode = program[ip];
            const operand = program[ip+1];
            const comboOperand = getComboOperand(operand);

            if (opcode === 0) { //ADV instruction - division
                const numerator = registers[0];
                const denominator = Math.pow(2,comboOperand);
                const result = Math.floor(numerator / denominator);
                if (log) console.log(`Opcode: ${opcode}; ADV: ${numerator} / ${denominator} = ${result} [A]`)
                registers[0] = result;
            } else if (opcode === 1) { // BXL - XOR
                const xorResult = xor(registers[1], operand)
                if (log) console.log(`Opcode: ${opcode}; XOR: ${registers[1]} and ${operand} = ${xorResult} [B]`)
                registers[1] = xorResult
            } else if (opcode === 2) { // BST - modulo
                const moduloResult = comboOperand % 8;
                if (log) console.log(`Opcode: ${opcode}; MODULO: ${comboOperand} % 8 = ${moduloResult} [B]`)
                registers[1] = moduloResult
            } else if (opcode === 3) { // JNZ
                if (registers[0] === 0) {
                    if (log) console.log(`Opcode: ${opcode}; NOT Jumping - register A = 0`)
                    return [true, undefined];
                }
                instructionPointer = operand;
                if (log) console.log(`Opcode: ${opcode}; Jumping instruction pointer to ${operand}`)
                return [false, undefined]
            } else if (opcode === 4) { // XOR of B and C
                const xorResult = xor(registers[1], registers[2])
                if (log) console.log(`Opcode: ${opcode}; XOR: A ${registers[1]} and N ${registers[2]} = ${xorResult} [B]`)
                registers[1] = xorResult
            } else if (opcode === 5) { // output modulo
                const result = comboOperand % 8;
                if (log) console.log(`Opcode: ${opcode}; combo ${comboOperand} % 8 = ${result} => output`)
                return [true, result.toString()]
            } else if (opcode === 6) { //ADV instruction - division
                const numerator = registers[0];
                const denominator = Math.pow(2,comboOperand);
                const result = Math.floor(numerator / denominator);
                if (log) console.log(`Opcode: ${opcode}; ADV: ${numerator} / ${denominator} = ${result} [B]`)
                registers[1] = result;
            } else if (opcode === 7) { //ADV instruction - division
                const numerator = registers[0];
                const denominator = Math.pow(2,comboOperand);
                const result = Math.floor(numerator / denominator);
                if (log) console.log(`Opcode: ${opcode}; ADV: ${numerator} / ${denominator} = ${result} [C]`)
                registers[2] = result;
            }
            return [true, undefined]
        }

        instructionPointer = 0;
        let outputs: string[] = []
        while (instructionPointer < program.length) {
            const [jumpAfter, output] = instruction(instructionPointer)
            if (jumpAfter) {
                instructionPointer += 2;
            }
            if (output) outputs.push(output)
        }
        return outputs;
    }

    let combinations: number[][] = []
    for (let i = 0; i < 16; i++) {
        if (!combinations[i]) combinations[i] = [];
        Array(8).fill(0).forEach((_, a) => {
            combinations[i].push(Math.pow(8, i) * a);
        })
    }

    let knownSemiResult = 0;
    for (let i = combinations.length - 1; i >= 0; i--) {
        for (let o = 0; o < combinations[i].length; o++) {
            const semiResult = knownSemiResult + combinations[i][o];
            const output = compute([semiResult, 0, 0]);
            if (output[i] === program[i].toString()) {
                knownSemiResult += combinations[i][o]
                break;
            }
        }
    }

    console.log("Part 1: ", compute(registers).join(","));
    console.log("Part 2: ", knownSemiResult);
}

