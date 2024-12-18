import { DoublyLinkedList } from "../../ts/utils/DoublyLinkedList";

type D18VisitedMap = Record<string, boolean>;
type D18Step = {
    x: number;
    y: number;
    steps: number;
}

exports.solution = (input: string[]) => {
    const width = 71, height = 71, start = "0,0", finish = "70,70";

    const isOutOfBoundsXY = (x: number, y: number) => x < 0 || x >= width || y < 0 || y >= height;
    const getKey = (x: number, y: number) => `${x},${y}`;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    const runWithCorruptedLimit = (corruptedLimit: number): number => {
        let corrupted: D18VisitedMap = {};
        let shortestMap: Record<string, number> = {
            "0,0": 0,
        };

        input.forEach((key, i) => {
            if (i >= corruptedLimit) return;
            corrupted[key] = true;
        })

        let shortestPath = Infinity;

        const move = (step: D18Step): D18Step[] => {
            const sKey = getKey(step.x, step.y);
            if (sKey === finish) {
                if (shortestPath > step.steps) shortestPath = step.steps;
                return []
            }
            if (step.steps > shortestPath) return [];
            shortestMap[sKey] = step.steps;

            const newSteps: D18Step[] = [];

            directions.forEach(d => {
                const newX = step.x + d[0], newY = step.y + d[1];
                if (isOutOfBoundsXY(newX, newY)) return;
                const key = getKey(newX, newY);
                const sp = shortestMap[key];
                if (!corrupted[key] && (!sp || sp > step.steps + 1)) newSteps.push({
                    x: newX,
                    y: newY,
                    steps: step.steps + 1
                });
            });

            return newSteps;
        }

        const stack = new DoublyLinkedList<D18Step>()
        stack.push({x: 0, y: 0, steps: 0})
        while (stack.length > 0) {
            const step = stack.pop();
            if (step) move(step.val).forEach(s => stack.push(s))
        }

        return shortestPath;
    }

    /**
     * Part 1 returns result (shortest path after 1024 corrupted spaces)
     * Part 2 returns index of byte that destroys last possible path
     * @param part
     */
    const run = (part: number) => {
        const t0 = performance.now();
        if (part === 1) console.log("Part 1: ", runWithCorruptedLimit(1024));
        if (part === 2) {
            let lowerLimit = 1025;
            let upperLimit = 3450;

            //we loop till we get the breaking point between Infinity (not possible) and normal number (possible)
            while (lowerLimit < upperLimit) {
                const corruptedLimit = lowerLimit + Math.ceil((upperLimit - lowerLimit) / 2)
                // console.log("Running with: ", {corruptedLimit, lowerLimit, upperLimit})
                const result = runWithCorruptedLimit(corruptedLimit)
                if (result === Infinity) {
                    upperLimit = corruptedLimit - 1;
                } else {
                    lowerLimit = corruptedLimit + 1;
                }
            }
            console.log("Part 2: ", input[lowerLimit]);
        }
        const t1 = performance.now();
        console.log(`Execution time: ${t1 - t0} milliseconds.`);
    }

    run(1);
    run(2);
}