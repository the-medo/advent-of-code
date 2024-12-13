import * as console from "node:console";

type D13Button = {
    cost: number;
    x: number;
    y: number;
}

type D13Prize = {
    x: number;
    y: number;
}

type D13Machine = {
    buttons: D13Button[];
    prize: D13Prize;
}

type D13Cache = {
    x: number;
    y: number;
    totalCost: number;
}


exports.solution = (input: string[]) => {
    const m: D13Machine[] = [];

    const createNewMachine = (): D13Machine => ({
        buttons: [],
        prize: {
            x: 0,
            y: 0,
        }
    })

    let newMachine = createNewMachine();

    input.forEach((row, i) => {
        if (i % 4 === 3 || i === 0) {
            newMachine = createNewMachine();
            m.push(newMachine);
        }
        if (i % 4 === 0 || i % 4 === 1) {
            const [x, y] = row.split(': ')[1].split(', ').map(xy => xy.split('+')[1]).map(Number)
            newMachine.buttons.push({
                cost: i % 4 === 0 ? 3 : 1,
                x,
                y,
            })
        } else if(i % 4 === 2) {
            const [x, y] = row.split(': ')[1].split(', ').map(xy => xy.split('=')[1]).map(Number)
            newMachine.prize = {x,y}
        }
    })

    const solveMachine = (mch: D13Machine): number | false => {
        const cache: Record<string, D13Cache> = {};
        const solutionCacheKeys = new Set<string>();

        const pressButton = (buttonPresses: number[]): D13Cache | false => {
            const cacheKey = buttonPresses.join(';');
            if (cache[cacheKey]) return false;
            cache[cacheKey] = buttonPresses.map((b, bID) => ({
                x: mch.buttons[bID].x * b,
                y: mch.buttons[bID].y * b,
                totalCost: mch.buttons[bID].cost * b
            })).reduce((p, c) => ({x: p.x + c.x, y: p.y + c.y, totalCost: p.totalCost + c.totalCost}), {x: 0, y: 0, totalCost: 0})
            return cache[cacheKey];
        }

        const stack: [number, number][] = [[1, 0], [0, 1]];

        while (stack.length > 0) {
            const buttonPresses = stack.pop();
            if (buttonPresses) {
                const value = pressButton(buttonPresses)
                if (value !== false) {
                    if (value.x === mch.prize.x && value.y === mch.prize.y) {
                        solutionCacheKeys.add(buttonPresses.join(';'))
                    } else if (value.x < mch.prize.x && value.y < mch.prize.y) {
                        stack.push([buttonPresses[0] + 1, buttonPresses[1]]);
                        stack.push([buttonPresses[0], buttonPresses[1] + 1]);
                    }
                }
            }
        }

        const arrayKeys = [...solutionCacheKeys];


        return arrayKeys.length > 0 ? Math.min(...arrayKeys.map(k => cache[k].totalCost)) : false;
    }

    const part1 = m.map((machine) => solveMachine(machine)).reduce((p, c) => (p ? p : 0) + (c ? c : 0), 0);

    console.log("Part 1: ", part1)
}

