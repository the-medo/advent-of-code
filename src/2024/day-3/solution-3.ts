exports.solution = (input: string[]) => {
    let line = input.join('');
    const splitline = line.split('');

    // let regex = /mul\([0-9]+,[0-9]+\)/g
    // const match = regex.exec(line)

    // console.log(match)


    let index = 0
    let totalResult = 0;
    let occurences = 0;
    let enabled = true;

    while (index > -1) {
        if (enabled) {
            index = line.search(/mul\(|don't\(\)/);
            // console.log(index)

            let pos = index + 4;
            if (line[index] === 'd') {
                enabled = false;
                pos += 2;
            }

            splitline.splice(0, pos)
            line = line.substring(pos)
            if (!enabled) continue;

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
        } else {
            index = line.search(/do\(\)/);

            const pos = index + 4;
            splitline.splice(0, pos)
            line = line.substring(pos)

            enabled = true;
        }
    }

    console.log("Part 2:", totalResult, "Occurences: ", occurences)

}