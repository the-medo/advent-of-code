
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

    const findRowId = 2000000;

    const sensorInfo: SensorBeaconPair[] = input.map(i => i.replace('Sensor at x=','').split(': closest beacon is at x=').map(a => a.split(", y=").map(b => parseInt(b)))).map(coords => ({sensor: {x: coords[0][0], y: coords[0][1]}, beacon: {x: coords[1][0], y: coords[1][1]}}))

    const lines: CheckedLinesInRows = {}

    sensorInfo.forEach(si => {
        const distance = ManhattanDistance(si.sensor, si.beacon);
        const r = findRowId;
        if (si.sensor.y - distance <= r && si.sensor.y + distance >= r) {
            const y = si.sensor.y - r;
            const rowId = IntToRowId(r);
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

    console.log(mergedLines[IntToRowId(findRowId)].reduce((p, c) => p + (c.end - c.start), 0));

}