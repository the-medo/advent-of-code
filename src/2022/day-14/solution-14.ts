type CaveTile = "air" | "rock" | "sand";
type CavePoint = {x: number, y: number}
type RockLine = CavePoint[];
type Cave = Record<number, Record<number, CaveTile>>;

let caveMinX = 500, caveMinY = 0, caveMaxX = 500, caveMaxY = -1;
const startingPoint: CavePoint = {x: 500, y: 0};

const CaveTileToChar: Record<CaveTile, string> = {
    air: '.',
    rock: '#',
    sand: 'o',
}

const DrawCave = (cave: Cave) => {
    for (let y = caveMinY; y <= caveMaxY; y++) {
        let line = '';
        for (let x = caveMinX; x <= caveMaxX; x++) line += CaveTileToChar[cave[x][y]];
        console.log(line);
    }
}

const DrawLineVertical = (cave: Cave, start: number, end: number, x: number) => {for (let i = start; i <= end; i++) cave[x][i] = "rock"}
const DrawLineHorizontal = (cave: Cave, start: number, end: number, y: number) => {for (let i = start; i <= end; i++) cave[i][y] = "rock"}
const DrawLine = (cave: Cave, p1: CavePoint, p2: CavePoint) =>
    p1.x === p2.x
        ? DrawLineVertical(cave, (p1.y < p2.y ? p1.y : p2.y), (p1.y < p2.y ? p2.y : p1.y), p1.x )
        : DrawLineHorizontal(cave, (p1.x < p2.x ? p1.x : p2.x), (p1.x < p2.x ? p2.x : p1.x), p1.y );

const AddAirColumn = (cave: Cave, x: number) => {
    if (x < caveMinX) caveMinX = x;
    if (x > caveMaxX) caveMaxX = x;
    cave[x] = {};
    for (let y = caveMinY; y <= caveMaxY; y++) cave[x][y] = y === caveMaxY ? 'rock' : 'air';
}

const SandGravity = (cave: Cave, sand: CavePoint): boolean | undefined => {
    const {x,y} = sand;
    if (y === caveMaxY) return false;

    if (!cave[x-1]) AddAirColumn(cave, x - 1);
    if (!cave[x+1]) AddAirColumn(cave, x + 1);

    if (cave[x][y+1] === 'air') return SandGravity(cave, {x: x, y: y+1})
    else if (cave[x-1][y+1] === 'air') return SandGravity(cave, {x: x-1, y: y+1})
    else if (cave[x+1][y+1] === 'air') return SandGravity(cave, {x: x+1, y: y+1})
    else if (cave[x][y] !== 'sand') {
        cave[x][y] = 'sand';
        return true;
    }
    return false;
}

exports.solution = (input: string[]) => {

    const splitPoint = (coordinates: string) => {
        const ps = coordinates.split(","), x = parseInt(ps[0]), y = parseInt(ps[1]);
        if (x - 1 < caveMinX) caveMinX = x - 1;
        if (x + 1 > caveMaxX) caveMaxX = x + 1;
        if (y + 2 > caveMaxY) caveMaxY = y + 2;
        return {x, y}
    }

    const cave: Cave = {};
    const lines: RockLine[] = input.map(l => l.split(" -> ").map(p => splitPoint(p) ));


    for (let x = caveMinX; x <= caveMaxX; x++) {
        cave[x] = {};
        for (let y = caveMinY; y <= caveMaxY; y++) cave[x][y] = "air";
    }
    lines.forEach((l) => l.forEach((p, i) => i > 0 && DrawLine(cave, l[i-1], p))); //draws rock lines

    //part 1
    let sandCount = 0;
    while (SandGravity(cave, startingPoint)) sandCount++;
    console.log("Part 1 - endless void: ", sandCount);

    //part 2
    DrawLineHorizontal(cave, caveMinX, caveMaxX, caveMaxY);
    while (SandGravity(cave, startingPoint)) sandCount++;
    DrawCave(cave);
    console.log("Part 2 - with floor: ", sandCount);
}