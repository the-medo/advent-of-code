type CaveTile = "air" | "rock" | "sand";
type CavePoint = {x: number, y: number}
type RockLine = CavePoint[];
type Cave = Record<number, Record<number, CaveTile>>;

let caveMinX = 500, caveMinY = 0, caveMaxX = 500, caveMaxY = -1;

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

const SandGravity = (cave: Cave, sand: CavePoint): boolean | undefined => {
    if (sand.y === caveMaxY) return false;
    if (cave[sand.x][sand.y+1] === 'air') {
        return SandGravity(cave, {x: sand.x, y: sand.y+1})
    } else if (cave[sand.x-1][sand.y+1] === 'air') {
        return SandGravity(cave, {x: sand.x-1, y: sand.y+1})
    } else if (cave[sand.x+1][sand.y+1] === 'air') {
        return SandGravity(cave, {x: sand.x+1, y: sand.y+1})
    } else {
        cave[sand.x][sand.y] = 'sand';
        return true;
    }
}

exports.solution = (input: string[]) => {

    const splitPoint = (coordinates: string) => {
        const ps = coordinates.split(","), x = parseInt(ps[0]), y = parseInt(ps[1]);
        if (x - 1 < caveMinX) caveMinX = x - 1;
        if (x + 1 > caveMaxX) caveMaxX = x + 1;
        if (y - 1 < caveMinY) caveMinY = y - 1;
        if (y + 1 > caveMaxY) caveMaxY = y + 1;
        return {x, y}
    }

    const cave: Cave = {};
    const lines: RockLine[] = input.map(l => l.split(" -> ").map(p => splitPoint(p) ));

    console.log(caveMinX, caveMaxX, caveMinY, caveMaxY);
    for (let x = caveMinX; x <= caveMaxX; x++) {
        cave[x] = {};
        for (let y = caveMinY; y <= caveMaxY; y++) cave[x][y] = "air";
    }
    lines.forEach((l) => l.forEach((p, i) => i > 0 && DrawLine(cave, l[i-1], p))); //draws rock lines

    let sandCount = 0;
    while (SandGravity(cave, {x: 500, y: 0})) sandCount++;

    DrawCave(cave);
    console.log(sandCount);

}