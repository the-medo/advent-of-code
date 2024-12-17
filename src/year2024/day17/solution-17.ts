import { xor } from "../../ts/utils/xor";

type D17Registers = [number, number, number]

exports.solution = (input: string[]) => {
    const t0 = performance.now();

    const registers = [0,1,2].map(i => parseInt(input[i].split(": ")[1])) as D17Registers;
    const program = input[4].split(": ")[1].split(",").map(Number)

    const compute = (registers: D17Registers): string[] => {
        let instructionPointer = 0;

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

        /**
         * This is really just based on the AoC instructions.
         *
         * Returns tuple: [
         *                  boolean - jumpAfter = true if instruction is still supposed to be increased by 2
         *                  string | undefined  = string if output is specified, otherwise undefined
         *                ]
         *
         */
        const instruction = (instructionP: number, log: boolean = false): [boolean, string | undefined] => {
            if (instructionP+1>=program.length) {
                console.log("HALT")
                return [false, undefined];
            }
            const opcode = program[instructionP];
            const operand = program[instructionP+1];
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

    /**
     * Assumptions:
     *   - based on instructions, we assume that powers of 8 are the key
     *   - probably wouldn't work without 0,3 instruction ( A = A/2^3 )
     *
     * Starting from the last digit,
     *
     */
    let knownResult = 0;
    for (let i = program.length - 1; i >= 0; i--) {
        for (let o = 0; o < 8; o++) {
            const semiResult = knownResult + Math.pow(8, i) * o;
            const output = compute([semiResult, 0, 0]);
            if (output[i] === program[i].toString()) {
                knownResult = semiResult
                break;
            }
        }
    }

    console.log("Part 1: ", compute(registers).join(","));
    console.log("Part 2: ", knownResult);

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}

