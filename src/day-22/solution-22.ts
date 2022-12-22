import {CircularLinkedList, Node} from "../utils/CircularLinkedList";

type TileType = 'empty' | 'open' | 'wall';
type DirectionInstruction = 'R' | 'L';
type Instruction = number | DirectionInstruction;
type Direction = 0 | 1 | 2 | 3;

type Tile = {
    type: TileType,
    row: number,
    col: number,
}

const tileRows: Record<number, CircularLinkedList<Tile>> = {}
const tileColumns: Record<number, CircularLinkedList<Tile>> = {}
const instructions: Instruction[] = [];
let direction: Direction = 0;
let currentPoint: Node<Tile> | null;

const changeDirection = (inst: DirectionInstruction) => {
    const change = (inst === 'L') ? -1 : 1;
    if (direction + change > 3) direction = 0
    else if (direction + change < 0) direction = 3
    else direction += change;

    if (currentPoint) {
        if (direction === 0 || direction === 2) currentPoint = findTileInList(currentPoint.val.row, currentPoint.val.col, tileRows[currentPoint.val.row]);
        else if (direction === 1 || direction === 3) currentPoint = findTileInList(currentPoint.val.row, currentPoint.val.col, tileColumns[currentPoint.val.col]);
    }
}

const findTileInList = (row: number, col: number, l: CircularLinkedList<Tile>): Node<Tile> | null => {
    let curr = l.head;
    while (curr?.val.row !== row || curr?.val.col !== col) {
        if (!curr?.next) break;
        curr = curr?.next;
    }
    return curr;
}

const circulateLinkedList = (l: CircularLinkedList<Tile>) => {
    if (l.tail && l.head) {
        l.tail.next = l.head;
        l.head.prev = l.tail;
    }
}

const doInstruction = (inst: Instruction) => {
    if (inst === 'L' || inst === 'R') changeDirection(inst);
    else {
        let nextPoint;
        for (let i = 0; i < inst; i++) {
            if ((direction === 2 || direction === 3) && currentPoint?.prev) nextPoint = currentPoint?.prev;
            else if (currentPoint?.next) nextPoint = currentPoint?.next;
            if (nextPoint) {
                if (nextPoint?.val.type === 'wall') break;
                currentPoint = nextPoint;
            }
        }
    }
    console.log("Instruction: ", inst, " Current point: ", currentPoint?.val.row, currentPoint?.val.col)
}

exports.solution = (input: string[]) => {
    let mapOrInstructions = 'map';
    input.forEach((row, rowId) => {
        if (row === '') {
            mapOrInstructions = 'instructions';
        } else if (mapOrInstructions === 'map') {
            row.split('').forEach((tile, colId) => {
                if (!tileRows[rowId]) tileRows[rowId] = new CircularLinkedList<Tile>();
                if (!tileColumns[colId]) tileColumns[colId] = new CircularLinkedList<Tile>();
                if (tile !== ' ') {
                    const t: Tile = {
                        type: tile === '.' ? 'open' : 'wall',
                        row: rowId,
                        col: colId,
                    };
                    tileRows[rowId].push(t);
                    tileColumns[colId].push(t);
                }
            });
            circulateLinkedList(tileRows[rowId]);
        } else if (mapOrInstructions === 'instructions') {
            let numb = '';
            row.split('').forEach(inst => {
                if (inst === 'L' || inst === 'R') {
                    instructions.push(parseInt(numb));
                    instructions.push(inst);
                    numb = '';
                } else {
                    numb += inst;
                }
            });
            if (numb !== '') instructions.push(parseInt(numb));
        }
    });

    Object.keys(tileColumns).forEach(colId => circulateLinkedList(tileColumns[parseInt(colId)]));

    currentPoint = tileRows[0].head
    // console.log("START:", currentPoint);

    instructions.forEach(i => {
        doInstruction(i);
    })

    // console.log(instructions);
    //10R5L5R10L4R5L5
    console.log("END:", currentPoint?.val.row, currentPoint?.val.col);
    console.log("PASSWORD:", (currentPoint!.val.row + 1) * 1000 + (currentPoint!.val.col + 1) * 4 + direction);

}