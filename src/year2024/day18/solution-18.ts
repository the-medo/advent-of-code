import {PriorityQueue} from "../../ts/utils/PriorityQueue";
import console from "node:console";
import {DoublyLinkedList} from "../../ts/utils/DoublyLinkedList";

type D18VisitedMap = Record<string, boolean>;
type D18PqStep = {
    x: number;
    y: number;
    visited: D18VisitedMap;
    steps: number;

}

exports.solution = (input: string[]) => {
    // const width = 7, height = 7, start = "0,0", finish = "6,6", corruptedLimit = 12;
    const width = 71, height = 71, start = "0,0", finish = "70,70", corruptedLimit = 1024;

    const isOutOfBoundsXY = (x: number, y: number) => x < 0 || x >= width || y < 0 || y >= height;
    const getKey = (x: number, y: number) => `${x},${y}`;

    let visitedMap: D18VisitedMap = {};
    let corrupted: D18VisitedMap = {};
    let shortestMap: Record<string, number> = {};

    input.forEach((key, i) => {
        if (i >= corruptedLimit) return;
        corrupted[key] = true;
    })
    corrupted['0,0'] = true;

    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    let shortestPath = Infinity;

    const move = (step: D18PqStep): D18PqStep[] => {
        const skey = getKey(step.x, step.y);
        if (skey === finish) {
            if (shortestPath > step.steps) {
                shortestPath = step.steps;
                console.log("Shortest, ", shortestPath)
            }
            return []
        } else if (step.steps > shortestPath) {
            return []
        }
         else {
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
                if (!step.visited[key] && !corrupted[key] && (!sp || sp > step.steps + 1)) newPositions.push([newX, newY]);
            }
        })


        return newPositions.map(np => ({
            x: np[0],
            y: np[1],
            visited: {...step.visited, [getKey(np[0], np[1])]: true},
            steps: step.steps + 1
        }))
    }

    // const pq = new PriorityQueue<D18PqStep>();
    // pq.enqueue({ x: 0, y: 0, steps: 0, visited: visitedMap}, 1)
    //
    // while (true) {
    //     const step = pq.dequeue();
    //     if (step) {
    //         const newSteps = move(step.val);
    //         newSteps.forEach(s => pq.enqueue(s, 70*70 - s.steps))
    //     } else {
    //         break;
    //     }
    // }

    let i = 1;
    const queue = new DoublyLinkedList<D18PqStep>()
    queue.push({ x: 0, y: 0, steps: 0, visited: visitedMap})
    while (queue.length > 0) {
        const step = queue.pop();
        if (step) {
            if (i % 100000 === 0) {
                console.log(`${i} - queue: ${queue.length}`)
                // console.log(shortestMap);
                // break;
            }
            const newSteps = move(step.val);
            newSteps.forEach(s => queue.push(s))
            i++
        }
    }


    // let i = 1;
    // const stack: D18PqStep[] = [{ x: 0, y: 0, steps: 0, visited: visitedMap}]
    // while (stack.length > 0) {
    //     const step = stack.pop();
    //     if (step) {
    //         if (i % 100000 === 0) {
    //             console.log(`${i} - stack: ${stack.length}`)
    //             console.log(shortestMap);
    //             break;
    //         }
    //         const newSteps = move(step);
    //         stack.push(...newSteps);
    //         i++
    //     }
    // }

    console.log("Part 1: ", shortestPath)

}