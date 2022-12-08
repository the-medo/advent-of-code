type Tree = {
    h: number,
    visible?: boolean,
}

const countVisible = (map: Tree[][]) => {
    let visible = 0;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j].visible) visible++;
        }
    }
    return visible;
}

const getVisibility = (map: Tree[][]) => {

    const noOfRows = map.length;
    const noOfCols = map[0].length;

    for (let i = 0; i < noOfRows; i++) {
        let highestFromLeft = -1;
        for (let j = 0; j < noOfCols; j++) {
            if (map[i][j].h > highestFromLeft) {
                highestFromLeft = map[i][j].h;
                map[i][j].visible = true;
            }
        }

        let highestFromRight = -1;
        for (let j = noOfCols - 1; j >= 0; j--) {
            if (map[i][j].h > highestFromRight) {
                highestFromRight = map[i][j].h;
                map[i][j].visible = true;
            }
        }
    }

    for (let j = 0; j < noOfCols; j++) {
        let highestFromTop = -1;
        for (let i = 0; i < noOfRows; i++) {
            if (map[i][j].h > highestFromTop) {
                highestFromTop = map[i][j].h;
                map[i][j].visible = true;
            }
        }

        let highestFromBottom = -1;
        for (let i = noOfRows - 1; i >= 0 ; i--) {
            if (map[i][j].h > highestFromBottom) {
                highestFromBottom = map[i][j].h;
                map[i][j].visible = true;
            }
        }
    }
}

exports.solution = (input: string[]) => {
    const map: Tree[][] = [];

    let row = 0;

    input.forEach(l => {
        if (!map[row]) { map[row] = [];}
        for(let col = 0; col < l.length; col++) {
            map[row][col] = {
                h: parseInt(l[col]),
                visible: false,
            };
        }
        row++;
    })

    getVisibility(map);

    console.log(countVisible(map));
}