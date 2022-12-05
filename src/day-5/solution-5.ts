exports.solution = (inp: string[]) => {
    // const a = in.map(line => ({elves: line.split(",").map(e => parseIdsToElfAssignment(e.split("-")))}));

    // const a:any = inp.map(l => l);
    let stacks: any[] = [];
    let moves: any[] = [];

    let isStack = true;

    inp.forEach((l: string) => {
        if (l === '') {
            isStack = false
            return;
        }

        if (isStack) {
            for (let i = 0; i <= l.length / 4; i++) {
                const char: any = l[(i * 4) + 1];
                if (char !== ' ') {
                    if (!stacks[i]) stacks[i] = [];
                    stacks[i].push(char);
                }
            }
        }

        if (!isStack) {
            const s: any[] = l.split(" ");
            moves.push([parseInt(s[1]), parseInt(s[3]), parseInt(s[5])]);
        }
    });

    stacks = stacks.map(stack => stack.filter((s: any,i:any) => i < stack.length - 1).reverse());
    console.log(stacks);
    let stacks2 = [...stacks.map(x => [...x])];

    moves.forEach(m => {
        const fromStack = m[1] - 1;
        const toStack = m[2] - 1;
        for (let i = 1; i <= m[0]; i++) {
            stacks[toStack].push(stacks[fromStack].pop());
        }
    });
    console.log(stacks2);

    // console.log(stacks2);

    moves.forEach(m => {
        const fromStack = m[1] - 1;
        const toStack = m[2] - 1;
        const pickup = [];
        for (let i = 1; i <= m[0]; i++) {
            pickup.push(stacks2[fromStack].pop());
        }
        pickup.reverse().forEach(p => stacks2[toStack].push(p));
    });



    // console.log(stacks);
    console.log(stacks2);
    // console.log(moves);
    // console.log(stacks.map(s => s[s.length-1]).join(""));
    console.log(stacks2.map(s => s[s.length-1]).join(""));
}

