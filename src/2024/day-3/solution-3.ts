exports.solution = (input: string[]) => {
    let line = input.join('');
    const splitline = line.split('');

    // let regex = /mul\([0-9]+,[0-9]+\)/g
    // const match = regex.exec(line)

    // console.log(match)


    let index = 0
    let totalResult = 0;
    let occurences = 0;

    while (index > -1) {

        index = line.search(/mul\(/);
        // console.log(index)

        const pos = index + 4;
        splitline.splice(0,pos)
        line = line.substring(pos)
        // console.log(splitline)
        let valid = true;
        const c = splitline.findIndex(c => {
            if (c === ')' ||
            !(
                c === ')' ||
                (c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57) ||
                c.charCodeAt(0) == 44
            )) {
                if (c !== ')') {
                    valid = false;
                }
                return true;
            }
        });
        if (c === -1) {
            valid = false;
        }

        const result = splitline.splice(0, c)
        if (valid) {
             const resultNumbers = result.join('').split(',').map(Number);
             if (resultNumbers.length === 2) {
                 totalResult += resultNumbers[0] * resultNumbers[1];
                 occurences++;
                 console.log(result.join(''), '=', resultNumbers[0] * resultNumbers[1]);
             }
        }
        line = line.substring(c)

    }

    console.log("Part 1:", totalResult, "Occurences: ", occurences)

}