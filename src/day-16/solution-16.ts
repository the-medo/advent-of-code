type ValveConnection = {
    distance: number;
    valve: Valve;
}

type Valve = {
    id: string;
    flowRate: number;
    connections: ValveConnection[];
}

let valveArray: Valve[] = [];
const valveRecord: Record<string, Valve> = {}
const valveDistances: Record<string, Record<string, number>> = {};
const connectionInfo: Record<string, string[]> = {};

const maxMinute = 30;

let counter = 0;

const actionPart1 = (currentValve: Valve, openedValves: string[], totalFlowRate: number, minute: number): number => {
    counter++;
    console.log(counter, " - ", currentValve.id, openedValves, totalFlowRate, minute);
    if (minute >= maxMinute) return totalFlowRate;

    const computedValveScore = valveArray.map(v => {
        if (openedValves.includes(v.id)) return {valve: v, distance: 1, score: 0};
        const distance = 1 + valveDistances[currentValve.id][v.id];
        return {
            valve: v,
            distance: distance ?? 1,
            score: (maxMinute - (minute + distance)) * v.flowRate,
        }
    }).filter(v => v.score > 0)
      .sort((a, b) => b.score - a.score);

    const results: number[] = [];

    computedValveScore.forEach(valveToOpen => results.push(actionPart1(valveToOpen.valve, [...openedValves, valveToOpen.valve.id], totalFlowRate + valveToOpen.score, minute + valveToOpen.distance)))
    if(results.length > 0) return Math.max(...results);
    return totalFlowRate;
}

const createValve = (id: string, flowRate: number): Valve => ({id, flowRate, connections: []})

exports.solution = (input: string[]) => {

    input.forEach(i => {
       const [valveId, flowRate, connections] = i.replace('Valve ', '')
           .replace(' has flow rate=', ';')
           .replace(' tunnels lead to valves ', '')
           .replace(' tunnel leads to valve ', '')
           .split(';');
       const valve = createValve(valveId, parseInt(flowRate));
       valveArray.push(valve);
       valveRecord[valveId] = valve;
       connectionInfo[valveId] = connections.split(', ');
    });

    Object.keys(connectionInfo).forEach(k => {
        connectionInfo[k].forEach(connection => {
            valveRecord[k].connections.push({distance: 1, valve: valveRecord[connection]});
        })
        console.log(k, valveRecord[k].connections);
    });

    valveArray.forEach(v => {
       if (v.flowRate === 0 && v.id !== 'AA') {
           console.log("Found valve with flow 0: ", v.id);

           v.connections.forEach(c1 => {
               v.connections.forEach(c2 => {
                   console.log("Checking... C1: ", c1.valve.id, "; C2: ", c2.valve.id );

                   if (c1.valve.id !== c2.valve.id) {
                       const hasConnection = c1.valve.connections.find(c => c2.valve.id === c.valve.id);
                       if (!hasConnection) {
                           console.log("HAS NO CONNECTION! Creating new ones...");
                           c1.valve.connections.push({distance: c1.distance + c2.distance, valve: c2.valve});
                           c2.valve.connections.push({distance: c1.distance + c2.distance, valve: c1.valve});
                       } else {
                           console.log("ALREADY HAS CONNECTION! Not creating anything");
                       }
                   }
               });
               c1.valve.connections = c1.valve.connections.filter(c => c.valve.id !== v.id);
           })

           v.connections = [];
       }
    });


    const startingValve: Valve = valveRecord['AA'];

    valveArray = valveArray.filter(v => v.flowRate > 0 || v.id === startingValve.id);

    valveArray.forEach(v1 => {
        valveDistances[v1.id] = {};
        valveArray.forEach(v2 => valveDistances[v1.id][v2.id] = v1.id !== v2.id ? Infinity : 0)
    });
    valveArray.forEach(v => {
        const stack: Valve[] = [];
        v.connections.forEach(c => {
            valveDistances[v.id][c.valve.id] = c.distance;
            stack.push(c.valve);
        });
        while(stack.length > 0) {
            const newValve = stack.pop();
            if (newValve) {
                newValve.connections.forEach(c => {
                    const distance = valveDistances[v.id][newValve.id] + c.distance;
                    if (distance < valveDistances[v.id][c.valve.id]) {
                        valveDistances[v.id][c.valve.id] = distance
                        stack.push(c.valve);
                    }
                });
            }
        }
    });

    console.log(valveDistances);

    const result = actionPart1(startingValve,  [startingValve.id], 0, 0);
    console.log("Result part 1: ", result);
}