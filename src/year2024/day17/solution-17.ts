exports.solution = (input: string[]) => {
    const registers = [0,1,2].map(i => parseInt(input[i].split(": ")[1]));
    const program = input[4].split(": ")[1].split(",").map(Number)

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
        console.log("Reserved???")
        return 0;
    }

    let instructionPointer = 0;

    /**
     * returns [JUMP AFTER?]
     * @param ip
     */
    const instruction = (ip: number): [boolean, string|undefined] => {
        if (ip+1>=program.length) {
            console.log("HALT")
            return [false, undefined];
        }
        const opcode = program[ip];
        const operand = program[ip+1];
        const comboOperand = getComboOperand(operand);

        if (opcode === 0) { //ADV instruction - division
            const numenator = registers[0];
            const denominator = Math.pow(2,comboOperand);
            const result = Math.floor(numenator / denominator);
            console.log(`Opcode: ${opcode}; ADV: ${numenator} / ${denominator} = ${result} [A]`)
            registers[0] = result;
        } else if (opcode === 1) { // BXL - XOR
            const xorResult = xor(registers[1], operand)
            console.log(`Opcode: ${opcode}; XOR: ${registers[1]} and ${operand} = ${xorResult} [B]`)
            registers[1] = xorResult
        } else if (opcode === 2) { // BST - modulo
            const moduloResult = comboOperand % 8;
            console.log(`Opcode: ${opcode}; MODULO: ${comboOperand} % 8 = ${moduloResult} [B]`)
            registers[1] = moduloResult
        } else if (opcode === 3) { // JNZ
            if (registers[0] === 0) {
                console.log(`Opcode: ${opcode}; NOT Jumping - register A = 0`)
                return [true, undefined];
            }
            instructionPointer = operand;
            console.log(`Opcode: ${opcode}; Jumping instruction pointer to ${operand}`)
            return [false, undefined]
        } else if (opcode === 4) { // XOR of B and C
            const xorResult = xor(registers[1], registers[2])
            console.log(`Opcode: ${opcode}; XOR: A ${registers[1]} and N ${registers[2]} = ${xorResult} [B]`)
            registers[1] = xorResult
        } else if (opcode === 5) { // output modulo
            const result = comboOperand % 8;
            console.log(`Opcode: ${opcode}; combo ${comboOperand} % 8 = ${result} => output`)
            return [true, result.toString()]
        } else if (opcode === 6) { //ADV instruction - division
            const numenator = registers[0];
            const denominator = Math.pow(2,comboOperand);
            const result = Math.floor(numenator / denominator);
            console.log(`Opcode: ${opcode}; ADV: ${numenator} / ${denominator} = ${result} [B]`)
            registers[1] = result;
        } else if (opcode === 7) { //ADV instruction - division
            const numenator = registers[0];
            const denominator = Math.pow(2,comboOperand);
            const result = Math.floor(numenator / denominator);
            console.log(`Opcode: ${opcode}; ADV: ${numenator} / ${denominator} = ${result} [C]`)
            registers[2] = result;
        }
        return [true, undefined]
    }



    const xor = (a: number, b: number) => {
        let aBin = a.toString(2);
        let bBin = b.toString(2);

        let result = '';
        for (let i = 0; i <= Math.max(aBin.length, bBin.length) - 1; i++) {
            const letterA = aBin[aBin.length - i - 1];
            const letterB = bBin[bBin.length - i - 1];
            if (letterA === "1" && letterB === "1") {
                result = "0" + result;
            } else if (letterA === "1" || letterB === "1") {
                result = "1" + result;
            } else {
                result = "0" + result;
            }
        }

        console.log(aBin, bBin, result, parseInt(result, 2))
        return parseInt(result, 2)
    }

    let outputs: string[] = []
    while (instructionPointer < program.length) {
        const [jumpAfter, output] = instruction(instructionPointer)
        if (jumpAfter) {
            instructionPointer += 2;
        }
        if (output) outputs.push(output)
    }

    console.log(registers, program)

    console.log("Part 1: ", outputs.join(","))
}