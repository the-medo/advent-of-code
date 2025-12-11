import {DoublyLinkedList} from "../../ts/utils/DoublyLinkedList";

type D11Server = {
    connections: string[]
    inPoints: string[]
}
type D11ServerRack = Record<string, D11Server>;


const d11Part1 = (rack: D11ServerRack) => {

    const queue = new DoublyLinkedList<string>();
    queue.push('you');

    let counter = 0;
    let element = queue.pop();
    while (element !== null && element !== undefined) {
        if (element.val === "out") {
            counter++;
        } else {
            rack[element.val].connections.forEach(c => queue.push(c));
        }
        element = queue.pop();
    }

    console.log(`Part 1: ${counter}`);
}


const findWaysFromToWithout = (rack: D11ServerRack, start: string, end: string, without: Record<string, true>)=> {
    const queue = new DoublyLinkedList<string>();
    queue.push(start);

    let visited: Record<string, number> = {};

    let element = queue.pop();
    while (element !== null && element !== undefined) {
        if (element.val !== end && !without[element.val]) {
            rack[element.val].connections.forEach(c => {
                if (!visited[c]) {
                    visited[c] = 0;
                    queue.push(c)
                }
                visited[c]++;
            });
        }
        element = queue.pop();
    }

    const cache: Record<string, number> = {};

    const computeTotalVisited = (server: string) => {
        if (cache[server]) return cache[server];
        if (server === start) return 1;
        let total = 0;
        rack[server].inPoints.forEach(p => {
            if (visited[server]) total += computeTotalVisited(p);
        })
        cache[server] = total;
        return cache[server];
    }

    const result = computeTotalVisited(end);

    // console.log({result})
    return result;
}

const d11Part2 = (rack: D11ServerRack) => {
    const c1 = findWaysFromToWithout(rack, 'svr', 'dac', { 'fft': true, 'out': true }); // svr => fft
    const c2 = findWaysFromToWithout(rack, 'dac', 'fft', { 'srv': true, 'out': true }); // dac => fft
    const c3 = findWaysFromToWithout(rack, 'fft', 'out', { 'srv': true, 'dac': true }); // fft => out

    const c4 = findWaysFromToWithout(rack, 'svr', 'fft', { 'dac': true, 'out': true }); // svr => dac
    const c5 = findWaysFromToWithout(rack, 'fft', 'dac', { 'srv': true, 'out': true }); // fft => dac
    const c6 = findWaysFromToWithout(rack, 'dac', 'out', { 'fft': true, 'srv': true }); // dac => out
    console.log("Part 2:", (c1 * c2 * c3) + (c4 * c5 * c6));
}

exports.solution = (input: string[]) => {
    const t0 = performance.now();
    const rack: D11ServerRack = {};

    input.forEach(row => {
        const [serverName, connectionString] = row.split(': ');
        const connections = connectionString.split(' ');

        if (!rack[serverName]) {
            rack[serverName] = { connections, inPoints: [] };
        } else {
            rack[serverName].connections = connections;
        }

        connections.forEach(c => {
            if (!rack[c]) rack[c] = { connections: [], inPoints: []}
            rack[c].inPoints.push(serverName);
        })
    })

    d11Part1(rack);
    d11Part2(rack);


    const t1 = performance.now();
    console.log(`Execution time: ${t1 - t0} milliseconds.`);
}