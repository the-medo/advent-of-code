exports.solution = (input: string[]) => {
    const keys: number[][] = [];
    const locks: number[][] = [];
    let lastRowEmpty = true;
    let currentKeyOrLock: number[] = [0,0,0,0,0]
    input.forEach(row => {
        if (lastRowEmpty) {
            currentKeyOrLock = [0,0,0,0,0];
            (row[0] === '#' ? locks : keys).push(currentKeyOrLock);
            lastRowEmpty = false;
        }
        if (row === '') lastRowEmpty = true;
        row.split('').forEach((c, i) => {
            if (c === '#') currentKeyOrLock[i]++;
        })
    })

    let combinations = 0;
    locks.forEach((lock) => {
        keys.forEach((key) => {
            let validKey = true;
            for (let i = 0; i < 5; i++) {
                if (lock[i] + key[i] > 7) {
                    validKey = false;
                    break;
                }
            }
            if (validKey) combinations++
        })
    })

    console.log("Part 1: ", combinations)
}