type D19Node = {
    c: string;
    nodes: D19Node[];
    end: string | false;
    id: number;
}

type D19Step = {
    p: string,
    stringTillNow: string,
    node: D19Node,
}


exports.solution = (input: string[]) => {
    const availablePatterns = input[0].split(', ');
    const wantedPatterns = input.splice(2);

    const solve = (availablePatterns: string[], wantedPatterns: string[]): string[] => {

        const tree: Record<string, D19Node> = {
            w: {c: 'w', nodes: [], end: false, id: 1},
            u: {c: 'u', nodes: [], end: false, id: 2},
            b: {c: 'b', nodes: [], end: false, id: 3},
            r: {c: 'r', nodes: [], end: false, id: 4},
            g: {c: 'g', nodes: [], end: false, id: 5},
        }
        const allNodes: D19Node[] = [tree.w, tree.u, tree.b, tree.r, tree.g]

        let id = 6;
        availablePatterns.forEach(ap => {
            let lastNode = tree[ap[0]];
            for (let i = 1; i < ap.length; i++) {
                const exists = lastNode.nodes.find(n => n.c === ap[i]);
                if (exists) {
                    lastNode = exists;
                } else {
                    const newNode: D19Node = {
                        c: ap[i],
                        nodes: [],
                        end: false,
                        id: id++,
                    }
                    lastNode.nodes.push(newNode);
                    allNodes.push(newNode);
                    lastNode = newNode;
                }
            }
            lastNode.end = ap;
        });


        const solvedMap: Record<string, boolean> = {};

        const solveStep = (step: D19Step): D19Step[] | boolean => {
            const {p, stringTillNow, node} = step;

            if (!!node.end) solvedMap[stringTillNow] = true;
            if (p === '') {
                return !!node.end;
            }

            const nextChar = p[0];

            const charPossibilities = node.nodes.filter(n => n.c === nextChar);
            const nextSteps: D19Step[] = charPossibilities.map(pos => ({
                p: p.slice(1),
                stringTillNow: stringTillNow + nextChar,
                node: pos,
            }))

            if (!!node.end) {
                nextSteps.push({
                    p: p.slice(1),
                    stringTillNow: stringTillNow + nextChar,
                    node: tree[nextChar],
                })
            }

            return nextSteps;
        }

        const possibleWantedPatterns = wantedPatterns.map((wp, n) => {
            const stack: D19Step[] = [{p: wp.slice(1), stringTillNow: wp[0], node: tree[wp[0]]}];

            let i = 0;
            while (stack.length > 0) {
                i++;
                const step = stack.pop();
                if (step) {
                    if (i % 100000 === 0) {
                        console.log(i, stack.length)
                        // if (i === 20000000) {
                        //     console.log(stack);
                        //     break;
                        // }
                    }
                    const nextStepsOrResult = solveStep(step);

                    if (nextStepsOrResult === true) {
                        console.log("WP ", wp, " POSSIBLE!");
                        return wp;
                    } else if (nextStepsOrResult === false) {

                    } else {
                        stack.push(...nextStepsOrResult);
                    }
                }
            }

            console.log("WP ", wp, " not possible!");
            return false;
        }).filter(Boolean);

        return possibleWantedPatterns as string[];
    }

    const maxAvailablePatternLength = Math.max(...availablePatterns.map(ap => ap.length))
    let stayingAvailablePatterns = availablePatterns.filter(ap => ap.length === 1);
    for (let i = 2; i <= maxAvailablePatternLength; i++) {
        const patternsToTry = availablePatterns.filter(ap => ap.length === i);
        const solvablePatterns = solve(stayingAvailablePatterns, patternsToTry)
        stayingAvailablePatterns.push(...patternsToTry.filter(ptt => !solvablePatterns.includes(ptt)))
    }

    console.log({stayingAvailablePatterns})

    const result = solve(stayingAvailablePatterns, wantedPatterns);
    console.log("Part 1: ", result, result.length)
}