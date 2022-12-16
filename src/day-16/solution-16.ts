type ValveConnection = {
    distance: number;
    valve: Valve;
}

type Valve = {
    id: string;
    flowRate: number;
    connections: ValveConnection[];
}

const volcanoAction = () => {
    //openedValves: string[];
    //totalFlowRate: number
    //minute: number

    //ACTION - MOVE through all connection tunnels
    // -> openedValves - copy
    // -> totalFlowRate - keep
    // -> minute - increment by DISTANCE


    //if flow rate is greater than 0 and valve is closed
    //ACTION - OPEN VALVE
    // -> openedValves - copy and add valve id
    // -> totalFlowRate - increase by (minute * flow rate)
    // -> minute - increment by 1
}

const createValve = (id: string, flowRate: number): Valve => ({id, flowRate, connections: []})

exports.solution = (input: string[]) => {
    const cloneDeep = require('lodash/cloneDeep.js');

    //Valve II has flow rate=0; tunnels lead to valves AA, JJ
    const valveArray: Valve[] = [];
    const valveRecord: Record<string, Valve> = {}
    const connectionInfo: Record<string, string[]> = {};

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

    //TODO: dont remove first point
    valveArray.forEach(v => {
       if (v.flowRate === 0) {
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

    console.log(valveRecord);
    console.log("------------");
    console.log(valveRecord['E'].connections);
}