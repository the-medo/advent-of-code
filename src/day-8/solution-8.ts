type Tree = {
    h: number,
    visible: boolean,
    score: number,
}

const compareAndSetVisible = (map: Tree[][], i: number, j: number, highest: number): number => {
    if (map[i][j].h > highest) {
        highest = map[i][j].h;
        map[i][j].visible = true;
    }
    return highest
}

const getVisibility = (map: Tree[][]) => {
    const noOfRows = map.length;
    const noOfCols = map[0].length;

    for (let i = 0; i < noOfRows; i++) {
        let highestFromLeft = -1;
        let highestFromRight = -1;
        for (let j = 0; j < noOfCols; j++) highestFromLeft = compareAndSetVisible(map, i, j, highestFromLeft);
        for (let j = noOfCols - 1; j >= 0; j--) highestFromRight = compareAndSetVisible(map, i, j, highestFromRight);
    }

    for (let j = 0; j < noOfCols; j++) {
        let highestFromTop = -1;
        let highestFromBottom = -1;
        for (let i = 0; i < noOfRows; i++) highestFromTop = compareAndSetVisible(map, i, j, highestFromTop);
        for (let i = noOfRows - 1; i >= 0 ; i--) highestFromBottom = compareAndSetVisible(map, i, j, highestFromBottom);
    }
}

const getScoreForTree = (row: number, col: number, map: Tree[][]) => {
    const tree = map[row][col];
    const noOfRows = map.length;
    const noOfCols = map[0].length;
    let leftScore = 0;
    let rightScore = 0;
    let topScore = 0;
    let bottomScore = 0;

    for (let j = col - 1; j >= 0; j--) {
        leftScore++;
        if (map[row][j].h >= tree.h) break;
    }

    for (let j = col + 1; j < noOfCols; j++) {
        rightScore++;
        if (map[row][j].h >= tree.h) break;
    }

    for (let i = row - 1; i >= 0; i--) {
        topScore++;
        if (map[i][col].h >= tree.h) break;
    }

    for (let i = row + 1; i < noOfRows; i++) {
        bottomScore++;
        if (map[i][col].h >= tree.h) break;
    }

    tree.score = leftScore * rightScore * topScore * bottomScore;
}

const getScores = (map: Tree[][]) => {
    for (let i = 1; i < map.length - 1; i++) {
        for (let j = 1; j < map[0].length - 1; j++) {
            getScoreForTree(i, j, map);
        }
    }
}

const getVisibleTreeCount = (map: Tree[][]): number =>  map.map(m => m.reduce( (p, cTree) =>  p + (cTree.visible ? 1 : 0), 0 )).reduce((p, c) => p + c, 0 );
const getMaxScore = (map: Tree[][]): number =>  Math.max.apply(null, map.map(m => m.reduce( (prev, current) =>  current.score > prev ? current.score : prev, 0 )));

exports.solution = (input: string[]) => {
    const map: Tree[][] = [];

    let row = 0;

    input.forEach(l => {
        if (!map[row]) { map[row] = [];}
        for(let col = 0; col < l.length; col++) {
            map[row][col] = {
                h: parseInt(l[col]),
                visible: false,
                score: 0,
            };
        }
        row++;
    });

    getVisibility(map);
    getScores(map);

    console.log(getVisibleTreeCount(map));
    console.log(getMaxScore(map));
}