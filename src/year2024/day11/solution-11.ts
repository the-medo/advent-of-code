type D11Type = {
    stones: number[];
    length: number;
}

exports.solution = (input: string[]) => {
    const run = (part: number ) => {
        let stones = input[0].split(' ').map(Number);

        const after5Blinks: Record<number, number[]> = {}

        const blinkLimit = part === 1 ? 25 : 75

        const blink5 = (stone: number): number[] => {
            if (after5Blinks[stone]) return after5Blinks[stone];

            let stones = [stone];
            for (let blinks = 1; blinks <= 5; blinks++) {
                let newStones: number[] = [];
                stones.forEach(stone => {
                    if (stone === 0) {
                        newStones.push(1)
                        return;
                    }
                    const stringStone = `${stone}`;
                    if (stringStone.length % 2 === 0) {
                        newStones.push(parseInt(stringStone.slice(0, stringStone.length / 2)), parseInt(stringStone.slice(stringStone.length / 2)));
                    } else {
                        newStones.push(stone * 2024);
                    }
                })
                stones = newStones;
            }
            return stones;
        }


        stones.forEach(s => {
            if (!after5Blinks[s]) {
                after5Blinks[s] = blink5(s);
            }
        })



        for (let blinks = 1; blinks < blinkLimit; blinks += 5) {
            console.log("Step", blinks)
            Object.keys(after5Blinks).map(Number).forEach(k => {
                after5Blinks[k].forEach(s => {
                    if (!after5Blinks[s]) {
                        after5Blinks[s] = blink5(s);
                    }
                })
            })
        }

        const keyCounts: Record<number, number> = stones.reduce((p, c) => ({...p, [c]: (p[c] ?? 0) + 1}), {} as Record<number, number>);

        console.log(keyCounts)

        for (let blinks = 0; blinks < blinkLimit; blinks += 5) {
            console.log("======")
            console.log("Step", blinks)
            const copy = {...keyCounts}
            Object.keys(keyCounts).map(Number).forEach(stone => {
                const count = copy[stone];
                if (count === 0) return;
                after5Blinks[stone].forEach(s => {
                    if (keyCounts[s]) {
                        keyCounts[s] += count;
                    } else {
                        keyCounts[s] = count;
                    }
                })
                keyCounts[stone]-=count;
            })
            console.log(keyCounts)
            console.log("======")
        }

        console.log("======")
        // console.log(keyCounts)
        let sum = 0;
        Object.keys(keyCounts).forEach(k => sum += keyCounts[parseInt(k)]);
        console.log(`Part ${part}: ${sum}`)
    }

    run(1)
    run(2)
}