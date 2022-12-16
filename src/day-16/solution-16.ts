type Valve = {
    id: string;
    flowRate: number;
    valves: Valve[];
}



const createValve = (id: string, flowRate: number): Valve => ({id, flowRate, valves: []})

exports.solution = (input: string[]) => {
    //Valve II has flow rate=0; tunnels lead to valves AA, JJ
    const valveArray: Valve[] = [];
    const valveRecord: Record<string, Valve> = {}
    const connectionInfo: Record<string, string[]> = {};

    input.forEach(i => {
       const [valveId, flowRate, connections] = i.replace('Valve ', '')
           .replace(' has flow rate=', ';')
           .replace(' tunnels lead to valves ', '')
           .replace(' tunnel leads to valve ', '')
           .split(';')
       const valve = createValve(valveId, parseInt(flowRate));
       valveArray.push(valve);
       valveRecord[valveId] = valve;
       connectionInfo[valveId] = connections.split(', ');
    });

    Object.keys(connectionInfo).forEach(k => {
        connectionInfo[k].forEach(connection => {
            valveRecord[k].valves.push(valveRecord[connection]);
        })
        console.log(k, valveRecord[k].valves);
    });

    console.log(valveArray);
    console.log(valveRecord);
}