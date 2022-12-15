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

const mergeLines = (key: string, lines: CheckedLine[], mergedLines: CheckedLinesInRows) => {
    mergedLines[key] = [];
    lines.forEach((l, i) => {
        if (i === 0) mergedLines[key].push(l);
        const last = mergedLines[key][mergedLines[key].length-1];
        if (last.end + 1 >= l.start) {
            if (l.end > last.end) last.end = l.end;
        } else {
            mergedLines[key].push(l);
        }
    });
}

const createLines = (lines: CheckedLinesInRows, sensor: Coordinates, r: number, distance: number) => {
    if (sensor.y - distance <= r && sensor.y + distance >= r) {
        const y = sensor.y - r;
        const rowId = IntToRowId(r);
        if (!lines[rowId]) lines[rowId] = [];
        lines[rowId].push({
            start: sensor.x - Math.abs(Math.abs(y) - distance),
            end: sensor.x + Math.abs(Math.abs(y) - distance)
        });
    }
}

exports.solution = (input: string[]) => {

    const findRowId = 2_000_000;
    const boundaryMin = 0;
    const boundaryMax = 4_000_000;

    const sensorInfo: SensorBeaconPair[] = input.map(i => i.replace('Sensor at x=','').split(': closest beacon is at x=').map(a => a.split(", y=").map(b => parseInt(b)))).map(coords => ({sensor: {x: coords[0][0], y: coords[0][1]}, beacon: {x: coords[1][0], y: coords[1][1]}}))

    //create lines of sensor covered space
    const lines: CheckedLinesInRows = {}
    sensorInfo.forEach(si => {
        for (let r = boundaryMin; r <= boundaryMax; r++) createLines(lines, si.sensor, r, ManhattanDistance(si.sensor, si.beacon))
    } );

    //Sort lines
    Object.values(lines).forEach(l => l.sort((a, b) => a.start - b.start ))

    //Merge overlapping lines
    const mergedLines: CheckedLinesInRows = {};
    Object.entries(lines).forEach(([key, lines]) => mergeLines(key, lines, mergedLines));


    console.log(`Part 1: tiles that cannot contain beacon on row ${findRowId} = `, mergedLines[IntToRowId(findRowId)].reduce((p, c) => p + (c.end - c.start), 0));

    Object.entries(mergedLines).forEach(([key, line]) => {
        const found = line.find(l => (l.start > boundaryMin && l.start < boundaryMax) || (l.end >= boundaryMin && l.end <= boundaryMax) )
        if (found) {
            const x = found.end + 1, y = parseInt(key.replace('p',''));
            console.log("Part 2: ", x, y, "; Tuning frequency: ", x * 4_000_000 + y );
        }
    });
}