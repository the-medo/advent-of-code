type D9Type = {
    id: number;
    size: number;
    type: string;
}

exports.solution = (input: string[]) => {
    const numbers = input[0].split('').map(Number);


    const run = (part: number): number => {
        const t0 = performance.now();
        let data: D9Type[] = [];
        let id = 0;

        numbers.forEach((f,i) => {
            if (i % 2 === 0) {
                data.push({ id, size: f, type: 'file' });
                id++
            } else {
                data.push({ id: 0, size: f, type: 'space' });
            }
        })

        let nearestSpaceId = 1;
        for (let i = data.length - 1; i >= 0; i--) {
            if (part === 2) nearestSpaceId = 1;
            if (nearestSpaceId > i) break;
            if (data[i].type === 'file') {
                const file = data[i];
                let remainingSize = file.size;
                while (remainingSize > 0 && nearestSpaceId < i) {
                    if (data[nearestSpaceId].type === 'space') {
                        const space = data[nearestSpaceId];
                        if (space.size > remainingSize) {
                            space.size -= remainingSize;
                            data = [...data.splice(0, nearestSpaceId), {id: file.id, size: remainingSize, type: 'file'}, ...data.splice(0)]
                            file.id = 0;
                            file.type = 'space';
                            remainingSize = 0;
                        } else if (space.size === remainingSize) {
                            remainingSize = 0;
                            space.id = file.id;
                            space.type = 'file';
                            file.id = 0;
                            file.type = 'space';
                        } else if (part === 1) { //checking of the smaller sizes is only in part 1
                            remainingSize -= space.size;
                            space.type = file.type;
                            space.id = file.id;
                            file.size -= space.size
                        }
                    }
                    nearestSpaceId++;
                }
            }
        }

        let sum = 0, i = 0;
        data.forEach(f => {
            if (f.type === 'space') {
                i += f.size;
                return;
            }

            const condition = i+f.size;
            for (; i < condition; i++) {
                sum += f.id * i
            }
        })

        const t1 = performance.now();
        console.log(`Execution time: ${t1 - t0} milliseconds.`);
        return sum;
    }

    console.log("Part 1", run(1));
    console.log("Part 2", run(2));
}