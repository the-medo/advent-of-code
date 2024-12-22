import console from "node:console";

type D21Button = {
    c: string;
    n: { b: D21Button, d: string; }[];
}

type D21Keypad = Record<string, D21Button>;

exports.solution = (input: string[]) => {

    const run = (part: number) => {
        const t0 = performance.now();
        /**
         * Keypad mapping - numeric keypad
         */
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

        /**
         * Keypad mapping - directional keypad
         */
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


        /**
         * Finding shortest paths from every key to every key
         */
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


        /**
         * Grouping the same directional values together (so robot doesn't need to go from side to side)
         */
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


        /**
         * Command mapping and caching - divides a command to subcommands based on directions that need to be pressed
         */
        const commandCache: Record<string, string[][]> = {}
        const processCommand = (c: string): string[][] => {
            if (commandCache[c] !== undefined) return commandCache[c];
            const command = 'A' + c;
            let splitCommands: string[][] = [];

            for (let i = 0; i < command.length - 1; i++) {
                const key = command[i] + ';' + command[i + 1];

                const possibleCommands = globalShortestMap[key];

                /* This next line is possible as well, but there will be more overhead */
                // ======== possibility 1 START ==========
                // splitCommands.push([...possibleCommands.map(pc => pc + 'A')])
                // ======== possibility 1 END ==========

                // ======== possibility 2 START ==========
                if (possibleCommands.length > 1) {
                    //command can be only from 2 characters, we need to group them the same characters (so we dont go "<v<v<", but "<<<vv")
                    const [possibleWay1, possibleWay2] = groupCharacters(possibleCommands[0]);
                    if (possibleWay1 === possibleWay2) {
                        splitCommands.push([possibleWay1 + "A"]);
                    } else if (possibleCommands.includes(possibleWay2)) {
                        if (possibleCommands.includes(possibleWay1)) { //if both grouped possibilities are in possible commands, we need to check for different lengths of their "parents"
                            splitCommands.push([possibleWay1 + "A", possibleWay2 + "A"]);
                        } else {
                            splitCommands.push([possibleWay2 + "A"]);
                        }
                    } else if (possibleCommands.includes(possibleWay1)) {
                        splitCommands.push([possibleWay1 + "A"]);
                    }
                } else {
                    splitCommands.push([possibleCommands[0] + "A"]);
                }
                // ======== possibility 2 END ==========
            }

            commandCache[c] = splitCommands;
            return splitCommands;
        }


        /**
         * Sums the lengths of commands after X steps
         */
        const resultCache: Record<string, number> = {};
        const getFinalValue = (command: string, step: number, wantedRobotCount: number): number => {
            const cacheKey = `${command};${step}`;

            if (resultCache[cacheKey] !== undefined) return resultCache[cacheKey];

            const nextCommands = processCommand(command);
            if (step === wantedRobotCount) {
                const mappedLengthsOfDifferentCommands = nextCommands.map(nc => Math.min(...nc.map(c => c.length)));
                const result = mappedLengthsOfDifferentCommands.reduce((a, b) => a + b, 0);
                resultCache[cacheKey] = result;
                // console.log("done", command, result, {nextCommands, mappedLengthsOfDifferentCommands})
                return result;
            } else {
                const mappedDifferentCommands = nextCommands.map(nc => nc.map(c => getFinalValue(c, step + 1, wantedRobotCount)));
                // console.log("working...", command, {nextCommands, mappedDifferentCommands})
                const result = mappedDifferentCommands.map(ns => Math.min(...ns)).reduce((a, b) => a + b, 0);
                resultCache[cacheKey] = result;
                return result;
            }
        }

        let totalComplexity = 0;
        const middleRobotCount = part === 1 ? 2 : 25;

        input.forEach((command, i) => {
            const numericValue = parseInt(command);
            const commandResult = getFinalValue(command, 0, middleRobotCount);
            const commandComplexity = commandResult * numericValue;
            totalComplexity += commandComplexity;
        })


        const t1 = performance.now();
        console.log(`Execution time: ${t1 - t0} milliseconds.`);
        console.log(`Part ${part}: `, totalComplexity)
    }

    // run(1);
    run(2);
}