import { DoublyLinkedList } from "../../ts/utils/DoublyLinkedList";

type D18VisitedMap = Record<string, boolean>;
type D18PqStep = {
    x: number;
    y: number;
    steps: number;

}

exports.solution = (input: string[]) => {
    // const width = 7, height = 7, start = "0,0", finish = "6,6", corruptedLimit = 12;
    const width = 71, height = 71, start = "0,0", finish = "70,70", corruptedLimit = 2024;

    const isOutOfBoundsXY = (x: number, y: number) => x < 0 || x >= width || y < 0 || y >= height;
    const getKey = (x: number, y: number) => `${x},${y}`;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    const runWithCorruptedLimit = (corruptedLimit: number): number => {
        let corrupted: D18VisitedMap = {};
        let shortestMap: Record<string, number> = {};
        shortestMap["0,0"] = 0;

        input.forEach((key, i) => {
            if (i >= corruptedLimit) return;
            corrupted[key] = true;
        })

        let shortestPath = Infinity;

        const move = (step: D18PqStep): D18PqStep[] => {
            const skey = getKey(step.x, step.y);
            if (skey === finish) {
                if (shortestPath > step.steps) {
                    shortestPath = step.steps;
                }
                return []
            } else if (step.steps > shortestPath) {
                return []
            } else {
                if (shortestMap[skey]) {
                    if (shortestMap[skey] < step.steps) {
                        return [];
                    }
                }
                shortestMap[skey] = step.steps;
            }

            const newPositions: [number, number][] = [];

            directions.forEach(d => {
                const newX = step.x + d[0], newY = step.y + d[1];
                if (!isOutOfBoundsXY(newX, newY)) {
                    const key = getKey(newX, newY);
                    const sp = shortestMap[key];
                    if (!corrupted[key] && (!sp || sp > step.steps + 1)) newPositions.push([newX, newY]);
                }
            })

            return newPositions.map(np => ({
                x: np[0],
                y: np[1],
                steps: step.steps + 1
            }))
        }

        let i = 1;
        const stack = new DoublyLinkedList<D18PqStep>()
        stack.push({x: 0, y: 0, steps: 0})
        while (stack.length > 0) {
            const step = stack.pop();
            if (step) {
                // if (i % 100000 === 0) console.log(`${i} - stack: ${stack.length}`)
                const newSteps = move(step.val);
                newSteps.forEach(s => stack.push(s))
                i++
            }
        }

        return shortestPath;
    }

    /**
     * Part 1 returns result (shortest path after 1024 corrupted spaces)
     * Part 2 returns index of byte that destroys last possible path
     * @param part
     */
    const run = (part: number): number => {
        if (part === 1) return runWithCorruptedLimit(1024);
        let lowerLimit = 1025;
        let upperLimit = 3450;

        //we loop till we get the breaking point between Infinity (not possible) and normal number (possible)
        while (lowerLimit < upperLimit) {
            const corruptedLimit = lowerLimit + Math.ceil((upperLimit - lowerLimit) / 2)
            console.log("Running with: ", {corruptedLimit, lowerLimit, upperLimit})
            const result = runWithCorruptedLimit(corruptedLimit)
            if (result === Infinity) {
                upperLimit = corruptedLimit - 1;
            } else {
                lowerLimit = corruptedLimit + 1;
            }
        }

        return lowerLimit;
    }

    console.log("Part 1: ", run(1) )
    console.log("Part 2: ", input[run(2)])

}