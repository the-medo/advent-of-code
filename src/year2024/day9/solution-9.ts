type D9Type = {
    id: number;
    size: number;
    type: string;
}

exports.solution = (input: string[]) => {
    const numbers = input[0].split('').map(Number);

    let result: D9Type[] = [];
    let id = 0;
    numbers.forEach((f,i) => {
        if (i % 2 === 0) {
            result.push({ id, size: f, type: 'file' });
            id++
        } else {
            result.push({ id: 0, size: f, type: 'space' });
        }
    })

    console.log(result);
    let nearestSpaceId = 1;
    for (let i = result.length - 1; i >= 0; i--) {
        if (nearestSpaceId > i) break;
        if (result[i].type === 'file') {
            const file = result[i];
            console.log("File on ", i, file);
            let remainingSize = file.size;
            while (remainingSize > 0 && nearestSpaceId < i) {
                console.log("== ", result[nearestSpaceId])
                if (result[nearestSpaceId].type === 'space') {
                    const space = result[nearestSpaceId];
                    if (space.size > remainingSize) {
                        console.log("== >", space.size, remainingSize)
                        space.size -= remainingSize;
                        result = [...result.splice(0, nearestSpaceId), {id: file.id, size: remainingSize, type: 'file'}, ...result.splice(0)]
                        file.id = 0;
                        file.type = 'space';
                        remainingSize = 0;
                    } else if (space.size === remainingSize) {
                        console.log("== ==", space.size, remainingSize)
                        remainingSize = 0;
                        space.id = file.id;
                        space.type = 'file';
                        file.id = 0;
                        file.type = 'space';
                    } else {
                        console.log("== <", space.size, remainingSize)
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

    let sum = 0;
    let i = 0;
    result.forEach(f => {
        if (f.type === 'file') {
            for (let l = i; l < i+f.size; l++) {
                sum += f.id * l
            }
            i+=f.size;
        }
    })

    console.log(sum);
}