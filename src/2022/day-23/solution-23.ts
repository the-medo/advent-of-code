import {Coordinates} from "../../utils/coords";

type ElfWithSeedling = {
    proposed?: Coordinates,
} & Coordinates;

type ElfField = {
    isElf: boolean,
    isProposed: number,
}

const elfDirections = [
    [{x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1}], //North => Y is getting smaller
    [{x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}, ], // South => Y is getting bigger
    [{x: -1, y: -1}, {x: -1, y: 0}, {x: -1, y: 1}, ], //West => X is getting smaller
    [{x: 1, y: -1}, {x: 1, y: 0}, {x: 1, y: 1}, ] //East => X is getting bigger
]

const intToElfCoord = (i: number) => (i >= 0) ? `p${i}` : `m${Math.abs(i)}`;

let elvesWithSeedlings: Record<string, Record<string, ElfField>> = {};
let elvesArray: ElfWithSeedling[] = [];
let round = 0;

const checkField = (x: number, y: number): ElfField => {
    const pX = intToElfCoord(x), pY = intToElfCoord(y);

    if (!elvesWithSeedlings[pX]) {
        elvesWithSeedlings[pX] = {};
    }

    if (!elvesWithSeedlings[pX][pY]) {
        elvesWithSeedlings[pX][pY] = {
            isElf: false,
            isProposed: 0,
        };
    }

    return elvesWithSeedlings[pX][pY];
}

const getProposed = (x: number, y: number, d: number): Coordinates | undefined => {
    let proposed: Coordinates | undefined = undefined;

    let isElfAround = false;

    //check all fields around
    for (let px = -1; px <= 1; px++){
        for (let py = -1; py <= 1; py++){
            if (px === 0 && py === 0) continue;
            const field = checkField(x + px, y + py);
            if (field.isElf) {
                isElfAround = true;
                break;
            }
        }
        if (isElfAround) break;
    }

    //if there is elf around, we need to propose new position
    if (isElfAround) {

        for (let i = 0; i < 4; i++) {
            const dir = (i + d) % 4;
            let canMoveToDir = true;
            elfDirections[dir].forEach(ed => {
                const elfField = checkField(ed.x + x, ed.y + y);
                if (elfField.isElf) canMoveToDir = false;
            });
            if (canMoveToDir) {
                proposed = {
                    x: x + elfDirections[dir][1].x,
                    y: y + elfDirections[dir][1].y,
                };
                break;
            }
        }
    }

    return proposed;
}

const doRound = (): boolean => {
    round++;
    proposeMovements();
    if (isMovementProposed()) {
        doMovements();
        return true;
    }
    return false;
}

const proposeMovements = () => {
    const dir = (round - 1) % elfDirections.length;
    elvesArray.forEach((e) => {
        e.proposed = getProposed(e.x, e.y, dir);
        if (e.proposed) elvesWithSeedlings[intToElfCoord(e.proposed.x)][intToElfCoord(e.proposed.y)].isProposed++;
    });
}

const drawMap = (minX: number, maxX: number, minY: number, maxY: number) => {
    for (let y = minY; y <= maxY; y++) {
        let row = '';
        for (let x = minX; x <= maxX; x++) {
            const field = checkField(x, y);
            row += field.isElf ? '#' : '.';
        }
        console.log(row);
    }
}

const isMovementProposed = (): boolean => elvesArray.find(e => e.proposed !== undefined) !== undefined;

const doMovements = () => {
    elvesArray.forEach((e) => {
        if (e.proposed) {
            const proposedElfField = checkField(e.proposed.x, e.proposed.y);
            if(proposedElfField.isProposed === 1) {
                const elfField = checkField(e.x, e.y);
                elfField.isElf = false;
                proposedElfField.isElf = true;
                proposedElfField.isProposed = 0;
                e.x = e.proposed.x;
                e.y = e.proposed.y;
            } else {
                proposedElfField.isProposed = 0;
            }
            e.proposed = undefined;
        }
    });
}

const getResult = (draw: boolean) => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    elvesArray.forEach(e => {
        if (e.x > maxX) maxX = e.x;
        if (e.y > maxY) maxY = e.y;
        if (e.x < minX) minX = e.x;
        if (e.y < minY) minY = e.y;
    });

    if (draw) {
        drawMap(minX, maxX, minY, maxY);
    }

    const area = (maxX - minX + 1) * (maxY - minY + 1);

    console.log(`MinX: ${minX} MaxX: ${maxX} MinY: ${minY} MaxY: ${maxY}  `);
    console.log(`Total area: ${area}`);
    console.log(`Free spaces: ${area - elvesArray.length}`);
    console.log(`Rounds: ${round}`);
}

const run = (roundCount: number, draw: boolean) => {
    let didSomething = true;
    while (didSomething && (roundCount === 0 || (roundCount > 0 && round < roundCount) )) {
        didSomething = doRound();
    }
    getResult(draw);
}

const parseElves = (input: string[]) => {
    elvesWithSeedlings = {};
    elvesArray = [];
    round = 0;

    input.forEach((row, rowId) => {
        const rowCoord = intToElfCoord(rowId);
        row.split('').forEach((c, colId) => {
            if (c === '#') {
                const colCoord = intToElfCoord(colId);
                if (!elvesWithSeedlings[colCoord]) elvesWithSeedlings[colCoord] = {};
                elvesWithSeedlings[colCoord][rowCoord] = {
                    isElf: true,
                    isProposed: 0,
                };
                elvesArray.push({
                    x: colId,
                    y: rowId,
                });
            }
        });
    });
}

exports.solution = (input: string[]) => {
    parseElves(input)
    console.log("============= PART 1 =============");
    run(10, false);

    console.log("============= PART 2 =============");
    parseElves(input);
    run(0, false);

}