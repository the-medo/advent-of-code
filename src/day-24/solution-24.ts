import {Coordinates} from "../utils/coords";

enum BLIZZARD {
    EMPTY,
    RIGHT,
    BOTTOM,
    LEFT,
    TOP,
    WALL,
}

const blizzardMovements: Record<BLIZZARD, Coordinates> = {
    [BLIZZARD.EMPTY]: {x: 0, y: 0},
    [BLIZZARD.WALL]: {x: 0, y: 0},
    [BLIZZARD.RIGHT]: {x: 1, y: 0},
    [BLIZZARD.BOTTOM]: {x: 0, y: 1},
    [BLIZZARD.LEFT]: {x: -1, y: 0},
    [BLIZZARD.TOP]: {x: 0, y: -1},
}

let valleyMap: Record<number, Record<number, BLIZZARD[]>>[] = [{}];
let round: number = 0;
let height: number = 0;
let width: number = 0;
let start: Coordinates = { x: 1, y: 0,}
let finish: Coordinates = { x: 0, y: 0,}
let shortestPath: number = Infinity;
let queue: {
    min: number,
    x: number,
    y: number,
}[] = [];
let positionCache: Record<string, boolean> = {};

const getCacheKey = (min: number, x: number, y: number) => `${min}x${x}y${y}`;

const drawValley = (min: number) => {

    for (let row = 0; row <= height + 1; row++) {
        let valleyRow = '';
        for (let col = 0; col <= width + 1; col++) {
            if (col === start.x && row === start.y) valleyRow += 'E'
            else if (col === finish.x && row === finish.y) valleyRow += '.'
            else if (col === 0 || col === width + 1 || row === 0 || row === height + 1) valleyRow += '#'
            else if (valleyMap[min][col][row].length > 1) valleyRow += valleyMap[min][col][row].length
            else if (valleyMap[min][col][row].length === 0) valleyRow += '.'
            else if (valleyMap[min][col][row][0] === BLIZZARD.RIGHT) valleyRow += '>'
            else if (valleyMap[min][col][row][0] === BLIZZARD.LEFT) valleyRow += '<'
            else if (valleyMap[min][col][row][0] === BLIZZARD.TOP) valleyRow += '^'
            else if (valleyMap[min][col][row][0] === BLIZZARD.BOTTOM) valleyRow += 'v'
        }
        console.log(valleyRow);
    }
}

const pointDistanceToFinish = (cur: Coordinates) => Math.abs(cur.x - finish.x) + Math.abs(cur.y-finish.y);

const stackMoves = (min: number, x: number, y: number) => {
    const cacheKey = getCacheKey(min, x, y);
    if (positionCache[cacheKey]) return;
    positionCache[cacheKey] = true;
    if (x === finish.x && y === finish.y) {
        if (min < shortestPath) {
            shortestPath = min;
            console.log("NEW SHORTEST PATH: ", shortestPath);
        }
        return;
    }
    if (min >= shortestPath) return;
    if (min + pointDistanceToFinish({x, y}) > shortestPath) return;

    const nextValleyMinute = (min + 1) % (width * height);
    if (x > 0 && canStackPoint(valleyMap[nextValleyMinute][x][y])) queue.push({min: min + 1, x, y});
    if (x - 1 > 0 && y > 0 && y < height + 1 && canStackPoint(valleyMap[nextValleyMinute][x - 1][y])) queue.push({min: min + 1, x: x - 1, y});
    if (y - 1 > 0 && x > 0 && x < width + 1 && canStackPoint(valleyMap[nextValleyMinute][x][y - 1])) queue.push({min: min + 1, x, y: y - 1});
    if (x + 1 < width + 1 && y > 0 && y < height + 1 && canStackPoint(valleyMap[nextValleyMinute][x + 1][y])) queue.push({min: min + 1, x: x + 1, y});
    if (y + 1 < height + 1 && x > 0 && x < width + 1 && canStackPoint(valleyMap[nextValleyMinute][x][y + 1])) queue.push({min: min + 1, x, y: y + 1});
    if (y + 1 === height + 1 && x === width && y + 1 === finish.y && x === finish.x) queue.push({min: min + 1, x, y: y + 1});
    else if (y - 1 === 0 && x === 1 && y - 1 === finish.y && x === finish.x) queue.push({min: min + 1, x, y: y - 1});
}

const canStackPoint = (point: BLIZZARD[] | undefined) => {
    if (point === undefined) return true;
    return point.length <= 0;
}

const fillValleyRound = (min: number) => {
    if (min === height * width ) return;

    if (!valleyMap[min]) valleyMap[min] = {};

    for (let col = 1; col <= width; col++) {
        if (!valleyMap[min - 1][col]) valleyMap[min - 1][col] = {};
        for (let row = 1; row <= height; row++) {
            if (!valleyMap[min - 1][col][row]) valleyMap[min - 1][col][row] = [];

            valleyMap[min - 1][col][row].forEach(blizzard => {
                let movedX = col + blizzardMovements[blizzard].x;
                let movedY = row + blizzardMovements[blizzard].y;
                if (movedX === 0) movedX = width;
                else if (movedX === width + 1) movedX = 1;
                if (movedY === 0) movedY = height;
                else if (movedY === height + 1) movedY = 1;
                if (!valleyMap[min][movedX]) valleyMap[min][movedX] = {};
                if (!valleyMap[min][movedX][movedY]) valleyMap[min][movedX][movedY] = [];
                valleyMap[min][movedX][movedY].push(blizzard);
            });
        }
    }

    fillValleyRound(min + 1);
}

const parseValley = (input: string[]) => {
    valleyMap = [{}];
    round = 0;
    height = input.length - 2;
    width = input[0].length - 2;
    queue = [{
        min: 0,
        x: start.x,
        y: start.y,
    }];


    input.forEach((row, rowId) => {
        row.split('').forEach((char, colId) => {
            let tile: BLIZZARD[] = [BLIZZARD.WALL];
            if (char === '.') tile = []; //BLIZZARD.EMPTY
            else if (char === '>') tile = [BLIZZARD.RIGHT];
            else if (char === '<') tile = [BLIZZARD.LEFT];
            else if (char === 'v') tile = [BLIZZARD.BOTTOM];
            else if (char === '^') tile = [BLIZZARD.TOP];

            if (!valleyMap[round][colId]) valleyMap[round][colId] = {}
            valleyMap[round][colId][rowId] = tile;
        });
    });
}

const run = (s: Coordinates, f: Coordinates, shortestBefore: number,) => {
    start = s;
    finish = f;
    shortestPath = Infinity;

    positionCache = {};
    queue = [];
    queue.push({min: shortestBefore, x: s.x, y: s.y});

    while (queue.length > 0) {
        const point = queue.shift();
        if (point) stackMoves(point.min, point.x, point.y);
    }

    console.log("Shortest time: ", shortestPath);
}

exports.solution = (input: string[]) => {

    parseValley(input);
    fillValleyRound(1);
    console.log(valleyMap.length);
    console.log(width, 'x', height);

    run({ x: 1, y: 0}, { x: width, y: height + 1}, 0);
    run({ x: width, y: height + 1}, { x: 1, y: 0}, shortestPath);
    run({ x: 1, y: 0}, { x: width, y: height + 1}, shortestPath);
}