import {DoublyLinkedList} from "../../ts/utils/DoublyLinkedList";

type D11Server = {
    connections: string[]
}
type D11ServerRack = Record<string, D11Server>;


exports.solution = (input: string[]) => {
    const t0 = performance.now();
    const rack: D11ServerRack = {};

    input.forEach(row => {
        const [serverName, connections] = row.split(': ');
        rack[serverName] = { connections: connections.split(' ') };
    })

    const queue = new DoublyLinkedList<string>();
    queue.push('you');

    let counter = 0;
    let element = queue.pop();
    while (element !== null && element !== undefined) {
        console.log(element.val)
        if (element.val === "out") {
            counter++;
        } else {
            rack[element.val].connections.forEach(c => queue.push(c));
        }
        element = queue.pop();
    }

    console.log(`Part 1: ${counter}`);

    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}