type ShapeCoord = {
    x: number,
    y: number,
}

type Shape = ShapeCoord[];

const shapes: Shape[] = [
    // ####
    [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 3, y: 0},
    ],
    // .#.
    // ###
    // .#.
    [
        {x: 1, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 2, y: 1},
        {x: 1, y: 2},
    ],
    // ..#
    // ..#
    // ###
    [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 2, y: 1},
        {x: 2, y: 2},
    ],
    // #
    // #
    // #
    // #
    [
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 0, y: 2},
        {x: 0, y: 3},
    ],
    // ##
    // ##
    [
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 0},
        {x: 1, y: 1},
    ],
];

const tower: boolean[][] = [];

let numberOfRocks = 0;
let height = 0;
const chamberWidth = 7;

const currentPosition: ShapeCoord = {
    x: 2,
    y: 3
}

const moveToSide = (side: '<' | '>'): boolean => {
    const xModifier = side === '<' ? -1 : 1;

    if (currentPosition.x === 0 && xModifier < 0) return false;

    const shape = getRockShape();
    const width = shape.reduce((p, c) => c.x + 1 > p ? c.x + 1 : p, 0);

    if (currentPosition.x + width + xModifier > chamberWidth) return false;

    let canMove = true;
    shape.forEach(({x, y}) => {
        x += currentPosition.x;
        y += currentPosition.y;
        if (tower[y] !== undefined) {
            if (tower[y][x + xModifier]) {
                canMove = false;
            }
        } else {
            tower[y] = [];
        }
    });

    if (canMove) currentPosition.x += xModifier;

    return canMove;
}

const moveToBottom = (): boolean => {

    if (currentPosition.y === 0) return glueToTower();

    let canMove = true;
    const shape = getRockShape();
    shape.forEach(({x, y}) => {
        x += currentPosition.x;
        y = y + currentPosition.y - 1;
        if (y >= 0) {
            if (tower[y] === undefined) tower[y] = []
            if (tower[y][x]) canMove = false;
        } else canMove = false;
        if (!canMove) return;
    });

    if (!canMove) return glueToTower();

    currentPosition.y -= 1;

    return true;
}

const glueToTower = () => {
    const shape = getRockShape();

    let highestY = height - 1;

    shape.forEach(({x, y}) => {
        x += currentPosition.x;
        y += currentPosition.y;

        if (y > highestY) highestY = y;

        if (tower[y] === undefined) tower[y] = []
        tower[y][x] = true;
    });

    if (highestY + 1 > height) height = highestY + 1;
    return false;
}

const createRockShape = () => {
    numberOfRocks++;
    currentPosition.x = 2;
    currentPosition.y = height + 3;

    console.log("Created rock shape: ", numberOfRocks, currentPosition.x, currentPosition.y);
}

const getRockShape = () => shapes[(numberOfRocks - 1) % shapes.length]

const drawTower = () => {
    for (let y = height; y >= 0; y -- ) {
        let row = '';
        for (let x = 0; x < chamberWidth; x++) row += tower[y][x] ? '#' : '.';
        console.log(row, ` [row ${y}]`)
    }
}

exports.solution = (input: string[]) => {

    let rounds = 0;
    const directions = input[0];
    console.log(directions);

    createRockShape();
    while (numberOfRocks <= 2022 ) {
        rounds++;
        const direction = directions[(rounds - 1) % directions.length ] as "<" | ">";
        moveToSide(direction);
        if (!moveToBottom()) {
            createRockShape();
        }
    }

    // drawTower();

    console.log("Rounds: ", rounds);
    console.log("Height: ", height);
}