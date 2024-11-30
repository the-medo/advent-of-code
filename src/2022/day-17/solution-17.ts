type ShapePoints = {
    x: number,
    y: number,
}

type Shape = ShapePoints[];

type IterationStat = {
    rounds: number,
    height: number,
    rocks: number,
};

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

const createRockShape = (): boolean => {
    //before actually creating new rock, we check for pattern (if pattern is found, no need to continue with creating rocks)
    if (patternInfo === undefined && checkForPattern()) return true;

    numberOfRocks++;
    currentPosition.x = 2;
    currentPosition.y = height + 3;
    return false;
}

const getRockShape = () => shapes[(numberOfRocks - 1) % shapes.length]

const drawTower = () => {
    for (let y = height; y >= 0; y -- ) {
        let row = '';
        for (let x = 0; x < chamberWidth; x++) row += tower[y][x] ? '#' : '.';
        console.log(row, ` [row ${y}]`)
    }
}

const checkForPattern = (): boolean => {
    if (height === 0) return false;
    const step = directions.length;

    //we will save stats for all rocks, will be used later after patter is found
    iterationStats[numberOfRocks] = {
        height,
        rocks: numberOfRocks,
        rounds,
    };

    //we want to check for pattern only in case the cycle of stones ended = in cycles of 5
    if (numberOfRocks % shapes.length === 0) {
        const iterationNumber = numberOfRocks;

        for (let i = 1; i < iterationNumber / (shapes.length * 2); i++) {
            const baseI = iterationNumber;
            const stepOneI = baseI - (i * shapes.length);
            const stepTwoI = baseI - (i * shapes.length * 2);

            //difference in rounds needs to be size of the "gas flow" cycle (and of course it also needs to be the same)
            const diff_rounds1 = iterationStats[baseI].rounds - iterationStats[stepOneI].rounds;
            const diff_rounds2 = iterationStats[stepOneI].rounds - iterationStats[stepTwoI].rounds;
            if (diff_rounds1 % step === 0 && diff_rounds1 === diff_rounds2) {

                //rock count difference should always be the same - just to be sure
                const diff_rocks1 = iterationStats[baseI].rocks - iterationStats[stepOneI].rocks;
                const diff_rocks2 = iterationStats[stepOneI].rocks - iterationStats[stepTwoI].rocks;
                if (diff_rocks1 === diff_rocks2) {

                    //height difference needs to be the same
                    const diff_height1 = iterationStats[baseI].height - iterationStats[stepOneI].height;
                    const diff_height2 = iterationStats[stepOneI].height - iterationStats[stepTwoI].height;
                    if (diff_height1 === diff_height2) {

                        patternInfo = {
                            rocks: diff_rocks1,
                            height: diff_height1,
                            rounds: diff_rounds1,
                        }

                        prePatternStats = {...iterationStats[stepTwoI]};

                        console.log("PATTERN FOUND!");
                        console.log("====================");
                        console.log(baseI, stepOneI, stepTwoI);
                        console.log(iterationStats[baseI]);
                        console.log(iterationStats[stepOneI]);
                        console.log(iterationStats[stepTwoI]);

                        return true;
                    }
                }
            }
        }
    }
    return false;
}



const tower: boolean[][] = [];

let numberOfRocks = 0;
let height = 0;
let rounds = 0;
let directions = '';
const chamberWidth = 7;
let iterationStats: Record<number, IterationStat> = {};

let patternInfo: IterationStat;
let prePatternStats: IterationStat;

const currentPosition: ShapePoints = {
    x: 2,
    y: 3
}

exports.solution = (input: string[]) => {

    directions = input[0];

    const elephantCondition: number = 1_000_000_000_000;
    // const elephantCondition: number = 2022;

    createRockShape();
    while (numberOfRocks <= elephantCondition ) {
        rounds++;
        const direction = directions[(rounds - 1) % directions.length ] as "<" | ">";
        moveToSide(direction);
        if (!moveToBottom()) {
            if (createRockShape()) {
                console.log("======================");
                const repeatPatternCount = Math.floor((elephantCondition - numberOfRocks) / patternInfo.rocks);
                console.log("Pattern needs to be repeated", repeatPatternCount, "times");

                console.log("Number of rocks: ", numberOfRocks, " + ", (repeatPatternCount * patternInfo.rocks));
                numberOfRocks += (repeatPatternCount * patternInfo.rocks);
                console.log("  == ", numberOfRocks);

                console.log("Number of rounds: ", rounds, " + ", (repeatPatternCount * patternInfo.rounds));
                rounds += (repeatPatternCount * patternInfo.rounds);
                console.log("  == ", rounds);

                console.log("Height: ", height, " + ", (repeatPatternCount * patternInfo.height));
                height += (repeatPatternCount * patternInfo.height);
                console.log("  == ", height);

                const rocksLeft = (elephantCondition - numberOfRocks);

                console.log("======================");
                console.log("Rocks left to fill: ", rocksLeft);

                if (rocksLeft > 0) {
                    numberOfRocks += iterationStats[prePatternStats.rocks + rocksLeft].rocks - prePatternStats.rocks;
                    rounds += iterationStats[prePatternStats.rocks + rocksLeft].rounds - prePatternStats.rounds;
                    height += iterationStats[prePatternStats.rocks + rocksLeft].height - prePatternStats.height;
                }
                break;
            }
        }
    }

    console.log("======================");
    console.log("Elephant condition: ", elephantCondition);
    if (prePatternStats !== undefined) {
        console.log("Stats before pattern started: ");
        console.log("  == rock count before pattern started: ", prePatternStats.rocks);
        console.log("  == height before pattern started: ", prePatternStats.height);
        console.log("  == rounds before pattern started: ", prePatternStats.rounds);
        console.log("Found pattern: ");
        console.log("  == rocks increase by ", patternInfo.rocks);
        console.log("  == height increases by ", patternInfo.height);
        console.log("  == increase occurs every ", patternInfo.rounds, "rounds");
    }
    console.log("======================");
    console.log("RESULT ");
    console.log("  == rounds: ", rounds);
    console.log("  == height: ", height);
}