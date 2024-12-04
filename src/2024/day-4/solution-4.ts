

exports.solution = (input: string[]) => {
    const matrix = input.map(i => i.split(''))
    const word = 'XMAS'.split('');
    const xmasDirections = [[1,0], [1,1], [0,1], [-1,1], [-1,-1], [-1,0], [0,-1], [1,-1]];

    let xmasCount = 0;
    for (let j = 0; j < matrix.length; j++) {
        for (let i = 0; i < matrix[j].length; i++) {
            if (matrix[j][i] === 'X') {
                xmasDirections.forEach((direction) => {
                    console.log(direction);
                    let isXmas = true;
                    for (let c = 1; c < word.length && isXmas; c++) {
                        let x = i + direction[0] * c;
                        let y = j + direction[1] * c;
                        console.log("Letter ", c, ":", word[c], x, y)
                        if (y >= matrix[i].length || x < 0 || x >= matrix.length || y < 0) {
                            console.log("Out of bounds", x, y, matrix.length, matrix[i].length);
                            isXmas = false;
                        } else if ( matrix[y][x] !== word[c]) {
                            console.log(word[c] ,"!==", matrix[y][x]);
                            isXmas = false;
                        } else {
                            console.log("OK!", matrix[y][x]);
                        }
                    }
                    if (isXmas) {
                        xmasCount++;
                    }
                })
            }
        }
    }

    console.log("Part1:", xmasCount)
}