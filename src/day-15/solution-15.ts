
type Coordinates = {
    x: number;
    y: number;
}

type SensorBeaconPair = {
    sensor: Coordinates;
    beacon: Coordinates;
}

type CheckedLine = {
    start: number;
    end: number;
};
type CheckedLinesInRows = Record<string, CheckedLine[]>;

const IntToRowId = (n: number) => n >= 0 ? `p${n}` : `m${-n}`;
const ManhattanDistance = (p1: Coordinates, p2: Coordinates) => Math.abs(p1.x - p2.x) + Math.abs(p1.y-p2.y);

exports.solution = (input: string[]) => {
 //Sensor at x=2, y=18: closest beacon is at x=-2, y=15
    const sensorInfo: SensorBeaconPair[] = input.map(i => i.replace('Sensor at x=','').split(': closest beacon is at x=').map(a => a.split(", y=").map(b => parseInt(b)))).map(coords => ({sensor: {x: coords[0][0], y: coords[0][1]}, beacon: {x: coords[1][0], y: coords[1][1]}}))

    const lines: CheckedLinesInRows = {}

    sensorInfo.forEach(si => {
        const distance = ManhattanDistance(si.sensor, si.beacon);
        for (let y = -distance; y <=  distance; y++) {
            const rowId = IntToRowId(si.sensor.y + y);
            if (!lines[rowId]) lines[rowId] = [];
            lines[rowId].push({
                start: si.sensor.x - Math.abs(Math.abs(y) - distance),
                end: si.sensor.x + Math.abs(Math.abs(y) - distance)
            });
        }
    });

    //Sort lines
    Object.values(lines).forEach(l => l.sort((a, b) => a.start - b.start ))

    //Merge overlapping lines
    const mergedLines: CheckedLinesInRows = {};
    Object.entries(lines).map(([key, line]) => {
        mergedLines[key] = [];
        line.forEach((l, i) => {
           if (i === 0) mergedLines[key].push(l);
           const last = mergedLines[key][mergedLines[key].length-1];
           if (last.end >= l.start) {
               if (l.end > last.end) last.end = l.end;
           } else {
               mergedLines[key].push(l);
           }
        });
    } );

    const rowId = 2000000;
    console.log(mergedLines[IntToRowId(rowId)].reduce((p, c) => p + (c.end - c.start), 0));

}