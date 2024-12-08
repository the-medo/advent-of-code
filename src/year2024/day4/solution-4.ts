type D4WordPosDir = {
    x: number;
    y: number;
    direction: [number, number]
};

type D4Directions = [number, number][];

exports.solution = (input: string[]) => {

    const findWords = (matrix: string[][], directions: D4Directions, word: string): D4WordPosDir[] => {
        const positions: D4WordPosDir[] = [];

        matrix.forEach((row, j) => {
            row.forEach((c, i) => {
                if (c === word[0]) {
                    xmasDirections.forEach((direction) => {
                        let isXmas = true;
                        for (let c = 1; c < word.length && isXmas; c++) {
                            let x = i + direction[0] * c, y = j + direction[1] * c;
                            if (y >= matrix[i].length || x < 0 || x >= matrix.length || y < 0 || matrix[y][x] !== word[c]) {
                                isXmas = false;
                            }
                        }
                        if (isXmas) {
                            positions.push({x:i, y:j, direction})
                        }
                    })
                }
            })
        })

        return positions;
    }

    let xmasDirections: D4Directions = [[1,0], [1,1], [0,1], [-1,1], [-1,-1], [-1,0], [0,-1], [1,-1]];
    const matrix = input.map(i => i.split(''))
    const part1 = findWords(matrix, xmasDirections, 'XMAS');
    console.log("Part1:", part1.length)


    // part2
    xmasDirections = [[1,1], [-1,1], [-1,-1], [1,-1]]; //only diagonals
    const positions = findWords(matrix, xmasDirections, 'MAS');

    let masXCount = 0;
    positions.forEach(pos => {
        const match = positions.find(p2 =>
            !(p2.x === pos.x && p2.y === pos.y) &&
            pos.x + pos.direction[0] === p2.x + p2.direction[0] &&
            pos.y + pos.direction[1] === p2.y + p2.direction[1]
        )
        if (match) masXCount++;
    })

    masXCount = masXCount / 2; //each consist of two, both of them got matched

    console.log("Part2:", masXCount);
}