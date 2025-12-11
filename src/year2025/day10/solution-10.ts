type D10LightDiagram = number[];
type D10Button = number[];
type D10Joltage = number[];

type D10Machine = {
    finalLightDiagram: D10LightDiagram;
    buttons: D10Button[];
    joltages: D10Joltage;
}

type D10Step = {
    stepNumber: number;
    buttonPressMap: number[];
    currentValues: number[];
}

type D10UsedButtonPressMap = Record<string, boolean>;

const transformLightDiagramToNums = (stringLightDiagram: string): number[] => stringLightDiagram.split('').map(char => char === '.' ? 0 : 1);

const compareDiagramAndCurrentValues = (diagram: D10LightDiagram, currentValues: number[]): boolean => {
    return diagram.every((diagramValue, index) => diagramValue === currentValues[index] % 2 );
}

const doStepPart1 = (step: D10Step, m: D10Machine, usedButtonPressMap: D10UsedButtonPressMap): true | D10Step[] => {
    if (compareDiagramAndCurrentValues(m.finalLightDiagram, step.currentValues)) {
        return true;
    }
    const stringifiedButtonPressMap = step.buttonPressMap.join('');
    if (usedButtonPressMap[stringifiedButtonPressMap]) return [];
    usedButtonPressMap[stringifiedButtonPressMap] = true;

    const newSteps: D10Step[] = [];
    m.buttons.forEach((b, i) => {
        if (step.buttonPressMap[i] === 1) return;
        const newStep: D10Step = {
            stepNumber: step.stepNumber + 1,
            buttonPressMap: [...step.buttonPressMap],
            currentValues: [...step.currentValues],
        };

        newStep.buttonPressMap[i] = 1;
        b.forEach((buttonPress, j) => {
            newStep.currentValues[buttonPress]++;
        })
        newSteps.push(newStep);
    });

    return newSteps;
}

const compareJoltagesAndCurrentValues = (joltages: D10Joltage, currentValues: number[]) => {
    let hasHigherValues = false;
    let hasOnlyEqualValues = true;
    joltages.forEach((joltageValue, index) => {
        if (joltageValue < currentValues[index]) {
            hasHigherValues = true;
        }
        if (joltageValue !== currentValues[index]) {
            hasOnlyEqualValues = false;
        }
    });

    return {
        hasHigherValues,
        hasOnlyEqualValues
    }
}

const doStepPart2 = (step: D10Step, m: D10Machine, usedButtonPressMap: D10UsedButtonPressMap): true | D10Step[] => {
    const stringifiedButtonPressMap = step.buttonPressMap.join('-');
    if (usedButtonPressMap[stringifiedButtonPressMap]) return [];
    usedButtonPressMap[stringifiedButtonPressMap] = true;
    const { hasHigherValues, hasOnlyEqualValues } = compareJoltagesAndCurrentValues(m.joltages, step.currentValues);
    if (hasHigherValues) return [];
    if (hasOnlyEqualValues) return true;

    const newSteps: D10Step[] = [];
    m.buttons.forEach((b, i) => {
        const newStep: D10Step = {
            stepNumber: step.stepNumber + 1,
            buttonPressMap: [...step.buttonPressMap],
            currentValues: [...step.currentValues],
        };

        newStep.buttonPressMap[i]++;
        b.forEach((buttonPress, j) => {
            newStep.currentValues[buttonPress]++;
        })
        newSteps.push(newStep);
    });

    return newSteps;
}

const computeMachine = (m: D10Machine, part: 1 | 2) => {
    const stack: D10Step[] = [];
    let lowestValue = Infinity;
    m.buttons.forEach((b, i) => {
        const newStep: D10Step = {
            stepNumber: 1,
            buttonPressMap: m.buttons.map((x, j) => i === j ? 1 : 0),
            currentValues: m.finalLightDiagram.map(() => 0)
        };
        b.forEach((buttonPress, j) => {
            newStep.currentValues[buttonPress] = 1;
        })
        stack.push(newStep);
    });

    let step = stack.pop();
    const usedButtonPressMap = {};

    while (step !== undefined) {
        const stepResult = part === 1 ? doStepPart1(step, m, usedButtonPressMap) : doStepPart2(step, m, usedButtonPressMap);
        if (stepResult === true) {
            if (step.stepNumber < lowestValue) lowestValue = step.stepNumber;
        } else {
            stack.push(...stepResult);
        }
        step = stack.pop();
    }

    console.log("Machine: ", part === 1 ? m.finalLightDiagram : m.joltages, ' Result: ', lowestValue)

    return lowestValue;
}

exports.solution = (input: string[]) => {
    const t0 = performance.now();

    const machines: D10Machine[] = []

    input.forEach((row) => {
        const newMachine: D10Machine = {
            finalLightDiagram: [],
            buttons: [],
            joltages: [],
        }
        const rowParts = row.split(' ');
        rowParts.forEach((rowPart, i) => {
            const rowPartSubstring = rowPart.substring(1, rowPart.length - 1);
            const trimmedRowParts = rowPartSubstring.split(',');
            if (i === 0) { // light diagram
                newMachine.finalLightDiagram = transformLightDiagramToNums(rowPartSubstring);
            } else if (i === rowParts.length - 1) {
                newMachine.joltages = trimmedRowParts.map(Number);
            } else {
                newMachine.buttons.push(trimmedRowParts.map(Number));
            }
        })
        machines.push(newMachine)
    })


    const machineResults1 = machines.map((m) => computeMachine(m, 1));
    const part1 = machineResults1.reduce((acc, curr) => acc + curr, 0);
    console.log("Part 1: ", part1);

    const machineResults2 = machines.map((m) => computeMachine(m, 2));
    const part2 = machineResults2.reduce((acc, curr) => acc + curr, 0);
    console.log("Part 2: ", part2);
    
    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}