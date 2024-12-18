import * as console from "node:console";
import {Matrix} from "../../ts/utils/Matrix";
import {equationsByCramersRule} from "../../ts/utils/algos/equationsByCramersRule";

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

exports.solution = (input: string[]) => {
    const run = (part: number) => {
        const t0 = performance.now();
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
                newMachine.buttons.push({cost: i % 4 === 0 ? 3 : 1, x, y})
            } else if (i % 4 === 2) {
                const [x, y] = row.split(': ')[1].split(', ').map(xy => xy.split('=')[1]).map(Number)
                newMachine.prize = {
                    x: x + (part === 2 ? 10000000000000 : 0),
                    y: y + (part === 2 ? 10000000000000 : 0),
                }
            }
        })

        const solveMachine = (mch: D13Machine): number | false => {
            const {x: x1, y: y1} = mch.buttons[0];
            const {x: x2, y: y2} = mch.buttons[1];
            const {x: n1, y: n2} = mch.prize;

            /*
             Variables to resolve:
                b1 = ButtonA presses
                b2 = ButtonB presses

             Known values:
                x1 = ButtonA x value
                y1 = ButtonA y value
                x2 = ButtonB x value
                y2 = ButtonB y value
                n1 = Prize x value
                n2 = Prize y value

             Equations:
                x1 * b1  + x2 * b2 = n1
                y1 * b1  + y2 * b2 = n2

             Matrix from known values for these equations:
                | x1  x2  n1 |
                | y1  y2  n2 |
             */
            const matrix = new Matrix<number>().addRow([x1,x2,n1]).addRow([y1,y2,n2])
            const [b1, b2] = equationsByCramersRule(matrix)

            // My old, equation-on-paper solution, a lot shorter:
            // const b2 = (x1 * n2 - y1 * n1) / (x1 * y2 - y1 * x2);
            // const b1 = (n1 - b2 * x2) / x1;
            return (Number.isInteger(b1) && Number.isInteger(b2) ? b1 * 3 + b2 : false);
        }

        const result = m.map((machine) => solveMachine(machine)).reduce((p, c) => (p ? p : 0) + (c ? c : 0), 0);
        console.log(`Part ${part}: `, result)

        const t1 = performance.now();
        console.log(`Execution time: ${t1 - t0} milliseconds.`);
    }

    run(1);
    run(2);
}

