import {match} from "node:assert";

exports.solution = (input: string[]) => {
    let xmasDirections: [number, number][] = [[1,0], [1,1], [0,1], [-1,1], [-1,-1], [-1,0], [0,-1], [1,-1]];

    const matrix = input.map(i => i.split(''))
    let word = 'XMAS'.split('');

    let xmasCount = 0;
    for (let j = 0; j < matrix.length; j++) {
        for (let i = 0; i < matrix[j].length; i++) {
            if (matrix[j][i] === 'X') {
                xmasDirections.forEach((direction) => {
                    let isXmas = true;
                    for (let c = 1; c < word.length && isXmas; c++) {
                        let x = i + direction[0] * c;
                        let y = j + direction[1] * c;
                        if (y >= matrix[i].length || x < 0 || x >= matrix.length || y < 0) {
                            isXmas = false;
                        } else if ( matrix[y][x] !== word[c]) {
                            isXmas = false;
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


    // part2
    xmasDirections = [[1,1], [-1,1], [-1,-1], [1,-1]];
    word = 'MAS'.split('');
    let masXCount = 0;
    const positions: {
        x: number;
        y: number;
        direction: [number, number]
    }[] = []


    for (let j = 0; j < matrix.length; j++) {
        for (let i = 0; i < matrix[j].length; i++) {
            if (matrix[j][i] === 'M') {
                xmasDirections.forEach((direction) => {
                    let isXmas = true;
                    for (let c = 1; c < word.length && isXmas; c++) {
                        let x = i + direction[0] * c;
                        let y = j + direction[1] * c;
                        if (y >= matrix[i].length || x < 0 || x >= matrix.length || y < 0) {
                            isXmas = false;
                        } else if ( matrix[y][x] !== word[c]) {
                            isXmas = false;
                        }
                    }
                    if (isXmas) {
                        positions.push({x:i, y:j, direction})
                    }
                })
            }
        }
    }

    positions.forEach(pos => {
        const match = positions.find(p2 =>
            !(p2.x === pos.x && p2.y === pos.y) &&
            pos.x+pos.direction[0] === p2.x+p2.direction[0] &&
            pos.y+pos.direction[1] === p2.y+p2.direction[1]
        )
        if (match) {
            masXCount++;
        }
    })

    masXCount = masXCount / 2; //each consist of two, both of them got matched

    console.log("Part2:", masXCount);
}