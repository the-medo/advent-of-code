import console from "node:console";

type D21Button = {
    c: string;
    n: { b: D21Button, d: string; }[];
}

type D21Keypad = Record<string, D21Button>;

exports.solution = (input: string[]) => {
    const numButtons: D21Keypad = {
        'A': {c: 'A', n: []},
        '0': {c: '0', n: []},
        '1': {c: '1', n: []},
        '2': {c: '2', n: []},
        '3': {c: '3', n: []},
        '4': {c: '4', n: []},
        '5': {c: '5', n: []},
        '6': {c: '6', n: []},
        '7': {c: '7', n: []},
        '8': {c: '8', n: []},
        '9': {c: '9', n: []},
    }

    numButtons['A'].n.push({b: numButtons['0'], d: '<'}, {b: numButtons['3'], d: '^'});
    numButtons['0'].n.push({b: numButtons['A'], d: '>'}, {b: numButtons['2'], d: '^'});
    numButtons['1'].n.push({b: numButtons['2'], d: '>'}, {b: numButtons['4'], d: '^'});
    numButtons['2'].n.push({b: numButtons['0'], d: 'v'}, {b: numButtons['3'], d: '>'}, {b: numButtons['5'], d: '^'}, {b: numButtons['1'], d: '<'});
    numButtons['3'].n.push({b: numButtons['A'], d: 'v'}, {b: numButtons['2'], d: '<'}, {b: numButtons['6'], d: '^'});
    numButtons['4'].n.push({b: numButtons['1'], d: 'v'}, {b: numButtons['5'], d: '>'}, {b: numButtons['7'], d: '^'});
    numButtons['5'].n.push({b: numButtons['2'], d: 'v'}, {b: numButtons['6'], d: '>'}, {b: numButtons['8'], d: '^'}, {b: numButtons['4'], d: '<'});
    numButtons['6'].n.push({b: numButtons['3'], d: 'v'}, {b: numButtons['5'], d: '<'}, {b: numButtons['9'], d: '^'});
    numButtons['7'].n.push({b: numButtons['4'], d: 'v'}, {b: numButtons['8'], d: '>'});
    numButtons['8'].n.push({b: numButtons['5'], d: 'v'}, {b: numButtons['9'], d: '>'}, {b: numButtons['7'], d: '<'});
    numButtons['9'].n.push({b: numButtons['6'], d: 'v'}, {b: numButtons['8'], d: '<'});

    const dirButtons: D21Keypad = {
        '^': {c: '^', n: []},
        '<': {c: '<', n: []},
        'v': {c: 'v', n: []},
        '>': {c: '>', n: []},
        'A': {c: 'A', n: []},
    }

    dirButtons['A'].n.push({b: dirButtons['^'], d: '<'}, {b: dirButtons['>'], d: 'v'});
    dirButtons['^'].n.push({b: dirButtons['A'], d: '>'}, {b: dirButtons['v'], d: 'v'});
    dirButtons['<'].n.push({b: dirButtons['v'], d: '>'});
    dirButtons['v'].n.push({b: dirButtons['>'], d: '>'}, {b: dirButtons['<'], d: '<'}, {b: dirButtons['^'], d: '^'});
    dirButtons['>'].n.push({b: dirButtons['v'], d: '<'}, {b: dirButtons['A'], d: '^'});

    const globalShortestMap: Record<string, string[]> = {};

    const findShortest = (keypad: D21Keypad, start: string) => {
        const a = keypad[start];
        const queue = [{p: start, c: ''}];
        const shortestMap: Record<string, string[]> = {[start]: []};

        const traverse = (p: string, commands: string) => {
            if (shortestMap[p] === undefined) shortestMap[p] = [];
            shortestMap[p].push(commands);

            keypad[p].n.forEach(n => {
                if (shortestMap[n.b.c] === undefined || shortestMap[n.b.c].length > commands.length + 1) {
                    queue.push({p: n.b.c, c: commands + n.d});
                }
            })
        }

        while (queue.length > 0) {
            const step = queue.shift();
            if (step) traverse(step.p, step.c)
        }

        Object.keys(shortestMap).forEach(k => {
            globalShortestMap[`${start};${k}`] = shortestMap[k];
        })
    }

    Object.keys(dirButtons).forEach(k => findShortest(dirButtons, k));
    Object.keys(numButtons).forEach(k => findShortest(numButtons, k));

    console.log("Part 1: ", globalShortestMap)

    console.log(globalShortestMap['A;0'], globalShortestMap['0;2'], globalShortestMap['2;9'], globalShortestMap['9;A']);

    const groupCharacters = (s: string): string[] => {
        let result1 = '';
        let result2 = '';
        const counter: Record<string, number> = {}
        s.split('').forEach(c => {
            if (!counter[c]) counter[c] = 0;
            counter[c]++
        })
        Object.entries(counter).forEach(([k, c]) => {
            for(let i = 0; i < c; i++) result1 += k;
            for(let i = 0; i < c; i++) result2 = k + result2;
        })

        return [result1, result2];
    }

    let part1 = 0;
    input.forEach((row, i) => {
        const numValue = parseInt(row);
        const string = 'A' + row;
        console.log("Row", string)

        const splitToCommands = (s: string): string[] => {
            const commands: string[] = [];
            for (let i = 0; i < s.length - 1; i++) {
                const key = s[i] + ';' + s[i + 1];
                let found: string | undefined = undefined;
                for (let j = 0; j < globalShortestMap[key].length; j++) {
                    const [possibleWay1, possibleWay2] = groupCharacters(globalShortestMap[key][j]);
                    if (globalShortestMap[key].includes(possibleWay2)) {
                        found = possibleWay2;
                    } else if (globalShortestMap[key].includes(possibleWay1)) {
                        found = possibleWay1;
                    }
                }
                if (!found) found = globalShortestMap[key][0];

                commands.push(found);
            }

            return commands;
        }

        const step1 = splitToCommands(string).join('A') + 'A';
        console.log(step1, `[${step1.length}]`)

        let cmds = step1;

        for (let robot = 1; robot <= 2; robot++) {
            const robotStep = splitToCommands('A' + cmds).join('A') + 'A';
            console.log(robot, ":", robotStep, `[${robotStep.length}]`)
            cmds = robotStep;
        }

        part1 += cmds.length * numValue;
        console.log(`${cmds.length} * ${numValue} = ${cmds.length * numValue}`)
    })

    console.log("Part 1: ", part1)


}