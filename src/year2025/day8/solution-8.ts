type D8JunctionBox = {
    x: number;
    y: number;
    z: number;
    circuit: D8Circuit | undefined;
}

type D8Circuit = {
    id: number;
    boxes: D8JunctionBox[];
}

type D8Distance = {
    distance: number;
    box1: D8JunctionBox;
    box2: D8JunctionBox;
}

const computeJunctionBoxDistance = (box1: D8JunctionBox, box2: D8JunctionBox) => {
    return Math.sqrt(Math.pow(box1.x - box2.x, 2) + Math.pow(box1.y - box2.y, 2) + Math.pow(box1.z - box2.z, 2))
}

const mergeCircuits = (c1: D8Circuit, c2: D8Circuit) => {
    if (c1.id === c2.id) return false;
    c1.boxes.push(...c2.boxes);
    c2.boxes.forEach(box => box.circuit = c1);
    c2.boxes = [];
    return true;
}

const parseD8Input = (input: string[]) => {

    const boxes: D8JunctionBox[] = [];
    input.forEach((row) => {
        const [ x, y, z ] = row.split(",").map(Number);
        boxes.push({ x, y, z, circuit: undefined });
    })

    const distanceArray: D8Distance[] = [];
    for (let i = 0; i < boxes.length - 1; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            const boxDistance: D8Distance = { distance: computeJunctionBoxDistance(boxes[i], boxes[j]), box1: boxes[i], box2: boxes[j] }
            distanceArray.push(boxDistance);
        }
    }

    distanceArray.sort((a, b) => a.distance - b.distance);

    return { boxes, distanceArray };
}

const computePart1 = (input: string[], testing: boolean) => {

    const t0 = performance.now();

    const { boxes, distanceArray } = parseD8Input(input);

    let circuitCount = 0;
    const circuits: D8Circuit[] = [];
    const part1StepCount = testing ? 10 : 1000;
    distanceArray.slice(0, part1StepCount).forEach((boxDistance, i) => {
        console.log(boxDistance)
        if (boxDistance.box1.circuit && boxDistance.box2.circuit) {
            console.log(i, "Merging...")
            mergeCircuits(boxDistance.box1.circuit, boxDistance.box2.circuit);
        } else if (boxDistance.box1.circuit) {
            console.log(i, "Box1 available, adding box2")
            boxDistance.box1.circuit.boxes.push(boxDistance.box2);
            boxDistance.box2.circuit = boxDistance.box1.circuit;
        } else if (boxDistance.box2.circuit) {
            console.log(i, "Box2 available, adding box1")
            boxDistance.box2.circuit.boxes.push(boxDistance.box1);
            boxDistance.box1.circuit = boxDistance.box2.circuit;
        } else {
            console.log(i, "Creating new circuit...")
            circuitCount++;
            const newCircuit: D8Circuit = { id: circuitCount,  boxes: [boxDistance.box1, boxDistance.box2] };
            circuits.push(newCircuit);
            boxDistance.box1.circuit = newCircuit;
            boxDistance.box2.circuit = newCircuit;
        }
    })

    circuits.sort((a, b) => b.boxes.length - a.boxes.length)

    const part1Result = circuits.slice(0,3).reduce((acc, circuit) => acc * circuit.boxes.length, 1)

    console.log("Part 1: ", part1Result)

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}


const computePart2 = (input: string[], testing: boolean, log: boolean = false) => {

    const t0 = performance.now();
    const { boxes, distanceArray } = parseD8Input(input);


    let circuitCount = 0;
    let circuitId = 0;


    const circuits: D8Circuit[] = [];
    const part1StepCount = testing ? 10 : 1000; //this is minimum step count
    let finalBoxDistance: D8Distance | undefined;

    const checkForTheUltimateConnection = (i: number, circuitCount: number, boxDistance: D8Distance) => {
        if (i >= part1StepCount && circuitCount === 1 && boxDistance.box1.circuit?.boxes.length === boxes.length) {
            finalBoxDistance = boxDistance;
            console.log("FOUND THE ULTIMATE, FINISHING BOX PAIR!");
            console.log("Boxes in circuit: ", boxDistance.box1.circuit.boxes.length);
            console.log("Total boxes available: ", boxes.length);
            console.log({finalBoxDistance})
        }
    }

    distanceArray.forEach((boxDistance, i) => {
        if (finalBoxDistance) return;
        if (boxDistance.box1.circuit && boxDistance.box2.circuit) {
            if (mergeCircuits(boxDistance.box1.circuit, boxDistance.box2.circuit)) circuitCount--;
            if (log) console.log(i, "Merging...", circuitCount)
            checkForTheUltimateConnection(i, circuitCount, boxDistance);
        } else if (boxDistance.box1.circuit) {
            if (log) console.log(i, "Box1 available, adding box2")
            boxDistance.box1.circuit.boxes.push(boxDistance.box2);
            boxDistance.box2.circuit = boxDistance.box1.circuit;
            checkForTheUltimateConnection(i, circuitCount, boxDistance);
        } else if (boxDistance.box2.circuit) {
            if (log) console.log(i, "Box2 available, adding box1")
            boxDistance.box2.circuit.boxes.push(boxDistance.box1);
            boxDistance.box1.circuit = boxDistance.box2.circuit;
            checkForTheUltimateConnection(i, circuitCount, boxDistance);
        } else {
            circuitId++;
            circuitCount++;
            if (log) console.log(i, "Creating new circuit...", circuitCount)
            const newCircuit: D8Circuit = { id: circuitId,  boxes: [boxDistance.box1, boxDistance.box2] };
            circuits.push(newCircuit);
            boxDistance.box1.circuit = newCircuit;
            boxDistance.box2.circuit = newCircuit;
        }
    })

    circuits.sort((a, b) => b.boxes.length - a.boxes.length)

    const part2Result = finalBoxDistance ? finalBoxDistance.box1.x * finalBoxDistance.box2.x : 0;
    console.log("Part 2: ", part2Result)

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);

}

exports.solution = (input: string[], testing: boolean) => {
    computePart1(input, testing);
    computePart2(input, testing);
}