import {CircularLinkedList, Node} from "../../utils/CircularLinkedList";

type TileType = 'open' | 'wall';
type DirectionInstruction = 'R' | 'L';
type Instruction = number | DirectionInstruction;
type Direction = 0 | 1 | 2 | 3;

type Tile = {
    type: TileType,
    row: number,
    col: number,
}

const cubeSize = 50;

let tileRows: Record<number, CircularLinkedList<Tile>> = {}
let tileColumns: Record<number, CircularLinkedList<Tile>> = {}
let instructions: Instruction[] = [];
let direction: Direction = 0;
let currentPoint: Node<Tile> | null;

const setCurrentPointBasedOnDirection = () => {
    if (currentPoint) {
        if (direction === 0 || direction === 2) currentPoint = findTileInList(currentPoint.val.row, currentPoint.val.col, tileRows[currentPoint.val.row]);
        else if (direction === 1 || direction === 3) currentPoint = findTileInList(currentPoint.val.row, currentPoint.val.col, tileColumns[currentPoint.val.col]);
    }
}

const changeDirection = (inst: DirectionInstruction) => {
    const change = (inst === 'L') ? -1 : 1;
    if (direction + change > 3) direction = 0
    else if (direction + change < 0) direction = 3
    else direction += change;

    setCurrentPointBasedOnDirection();
}

const setDirection = (dir: Direction) => {
    direction = dir;
    setCurrentPointBasedOnDirection();
}

const getListRowOrCol = (l: CircularLinkedList<Tile>) => l.head?.val.row === l.tail?.val.row ? 'row' : 'col';
const getCurrentPointRowOrCol = () => {
    if (currentPoint) {
        if (currentPoint.next) return currentPoint.val.row === currentPoint.next.val.row ? 'row' : 'col';
        else if (currentPoint.prev) return currentPoint.val.row === currentPoint.prev.val.row ? 'row' : 'col';
        else throw Error("No next or prev!");
    }
};
const getSection = (i: number) =>  Math.ceil(i / cubeSize);

const computeAfterEdgeIndex = (newSection: number, prevRowOrCol: 'row' | 'col', reversed: boolean) => {
    let i = (prevRowOrCol === 'row') ? currentPoint?.val.row! : currentPoint?.val.col!;
    // console.log("After the edge index: ", (newSection - 1) * cubeSize + (reversed ? (cubeSize - i % cubeSize) : (i % cubeSize)), "newSection:", newSection, "prevRowOrCol: ", prevRowOrCol, "Reversed: ", reversed)
    let modulo = i % cubeSize;
    modulo = (modulo === 0 ? cubeSize : modulo);
    return (newSection - 1) * cubeSize + (reversed ? ((cubeSize + 1) - modulo) : modulo );

}
const moveOverTheEdge = () => {
    let newDirection = direction;
    let newPoint;

    const rowOrCol = getCurrentPointRowOrCol();
    const section = rowOrCol === 'row' ? getSection(currentPoint?.val.row!) : getSection(currentPoint?.val.col!);
    const row = tileRows[currentPoint?.val.row!];
    const col = tileColumns[currentPoint?.val.col!];

    // console.log("SECTION: ", section, " Row or col: ", rowOrCol);

    //A col-2-head row-4-head direction-right[0] -nonreversed
    if (rowOrCol === 'col' && section === 2 && col.head === currentPoint) {
        newPoint = tileRows[computeAfterEdgeIndex(4, rowOrCol, false)].head;
        newDirection = 0;
        //A row-4-head col-2-head direction-down[1]  -nonreversed
    } else if (rowOrCol === 'row' && section === 4 && row.head === currentPoint) {
        newPoint = tileColumns[computeAfterEdgeIndex(2, rowOrCol, false)].head;
        newDirection = 1;
        //B col-3-head col-1-tail direction-up[3]    -nonreversed
    } else if (rowOrCol === 'col' && section === 3 && col.head === currentPoint) {
        newPoint = tileColumns[computeAfterEdgeIndex(1, rowOrCol, false)].tail;
        newDirection = 3;

        //B col-1-tail col-3-head direction-down[1]  -nonreversed
    } else if (rowOrCol === 'col' && section === 1 && col.tail === currentPoint) {
        newPoint = tileColumns[computeAfterEdgeIndex(3, rowOrCol, false)].head;
        newDirection = 1;

        //C row-2-head col-1-head direction-down[1]  -nonreversed
    } else if (rowOrCol === 'row' && section === 2 && row.head === currentPoint) {
        newPoint = tileColumns[computeAfterEdgeIndex(1, rowOrCol, false)].head;
        newDirection = 1;

        //C col-1-head row-2-head direction-right[0] -nonreversed
    } else if (rowOrCol === 'col' && section === 1 && col.head === currentPoint) {
        newPoint = tileRows[computeAfterEdgeIndex(2, rowOrCol, false)].head;
        newDirection = 0;

        //D row-1-tail row-3-tail direction-left[2]  -reversed
    } else if (rowOrCol === 'row' && section === 1 && row.tail === currentPoint) {
        newPoint = tileRows[computeAfterEdgeIndex(3, rowOrCol, true)].tail;
        newDirection = 2;

        //D row-3-tail row-1-tail direction-left[2]  -reversed
    } else if (rowOrCol === 'row' && section === 3 && row.tail === currentPoint) {
        newPoint = tileRows[computeAfterEdgeIndex(1, rowOrCol, true)].tail;
        newDirection = 2;

        //E col-3-tail row-2-tail direction-left[2]  -nonreversed
    } else if (rowOrCol === 'col' && section === 3 && col.tail === currentPoint) {
        newPoint = tileRows[computeAfterEdgeIndex(2, rowOrCol, false)].tail;
        newDirection = 2;

        //E row-2-tail col-3-tail direction-up[3]    -nonreversed
    } else if (rowOrCol === 'row' && section === 2 && row.tail === currentPoint) {
        newPoint = tileColumns[computeAfterEdgeIndex(3, rowOrCol, false)].tail;
        newDirection = 3;

        //F row-1-head row-3-head direction-right[0] -reversed
    } else if (rowOrCol === 'row' && section === 1 && row.head === currentPoint) {
        newPoint = tileRows[computeAfterEdgeIndex(3, rowOrCol, true)].head;
        newDirection = 0;

        //F row-3-head row-1-head direction-right[0] -reversed
    } else if (rowOrCol === 'row' && section === 3 && row.head === currentPoint) {
        newPoint = tileRows[computeAfterEdgeIndex(1, rowOrCol, true)].head;
        newDirection = 0;

        //G row-4-tail col-2-tail direction-up[3] -nonreversed
    } else if (rowOrCol === 'row' && section === 4 && row.tail === currentPoint) {
        newPoint = tileColumns[computeAfterEdgeIndex(2, rowOrCol, false)].tail;
        newDirection = 3;

        //G col-2-tail row-4-tail direction-left[2] -nonreversed
    } else if (rowOrCol === 'col' && section === 2 && col.tail === currentPoint) {
        newPoint = tileRows[computeAfterEdgeIndex(4, rowOrCol, false)].tail;
        newDirection = 2;
    }

    return {
        newPoint,
        newDirection,
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
    const startPointRow = currentPoint?.val.row;
    const startPointCol = currentPoint?.val.col;
    const startDir = direction;
    if (inst === 'L' || inst === 'R') changeDirection(inst);
    else {
        let nextPoint;
        for (let i = 0; i < inst; i++) {
            if ((direction === 2 || direction === 3) && currentPoint?.prev) nextPoint = currentPoint?.prev;
            else if ((direction === 0 || direction === 1) && currentPoint?.next) nextPoint = currentPoint?.next;
            else nextPoint = null;

            if (nextPoint) {
                if (nextPoint?.val.type === 'wall') {
                    // console.log(`vv WALL after ${i} moves... Not going to ${nextPoint.val.row} ${nextPoint.val.col}`);
                    break;
                } else {
                    // console.log("=== going to ", nextPoint.val.row, nextPoint.val.col)
                    currentPoint = nextPoint;
                }
            } else {
                const overTheEdge = moveOverTheEdge();
                // console.log("Over the edge: ", overTheEdge);
                if (overTheEdge.newPoint) {
                    if (overTheEdge.newPoint.val.type === 'wall') {
                        // console.log("WALL! Not going to ", overTheEdge.newPoint.val.row, overTheEdge.newPoint.val.col)
                        break;
                    } else {
                        // console.log("=== going over the edge ", overTheEdge.newPoint.val.row, overTheEdge.newPoint.val.col)
                        currentPoint = overTheEdge.newPoint;
                        setDirection(overTheEdge.newDirection);
                    }
                } else {
                    throw Error("Should be over the edge but new point not found")
                }
            }
        }
    }
    // console.log(`Instruction: ${inst} Start point: r${startPointRow}, c${startPointCol} [d${startDir}] Finish point: r${currentPoint?.val.row} c${currentPoint?.val.col} [d${direction}]`)
}


const parseMapAndInstructions = (input: string[]) => {

    let mapOrInstructions = 'map'
    tileRows = {};
    tileColumns = {};
    instructions = [];
    direction = 0;

    input.forEach((row, x) => {
        const rowId = x + 1;
        if (row === '') {
            mapOrInstructions = 'instructions';
        } else if (mapOrInstructions === 'map') {
            row.split('').forEach((tile, y) => {
                const colId = y + 1;
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
    currentPoint = tileRows[1].head;
}

const runSolution = () => {
    console.log("START:", currentPoint?.val.row, currentPoint?.val.col);
    instructions.forEach(i => doInstruction(i));
    console.log("END:", currentPoint?.val.row, currentPoint?.val.col);
    console.log("PASSWORD:", currentPoint!.val.row * 1000 + currentPoint!.val.col * 4 + direction);
}

exports.solution = (input: string[]) => {

    //PART 1
    parseMapAndInstructions(input);
    Object.keys(tileRows).forEach(rowId => circulateLinkedList(tileRows[parseInt(rowId)]));
    Object.keys(tileColumns).forEach(colId => circulateLinkedList(tileColumns[parseInt(colId)]));
    console.log("========== PART 1 ================");
    runSolution();
    console.log("==================================");

    //PART 2
    console.log("========== PART 2 ================");
    parseMapAndInstructions(input);
    runSolution();
    console.log("==================================");
}