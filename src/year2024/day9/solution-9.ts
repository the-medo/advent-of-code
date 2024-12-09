import {DoublyLinkedList} from "../../ts/utils/DoublyLinkedList";

enum D9DataType {
    FILE,
    SPACE
}

type D9Type = {
    id: number;
    size: number;
    type: D9DataType;
}

exports.solution = (input: string[]) => {
    const numbers = input[0].split('').map(Number);


    const run = (part: number): number => {
        const t0 = performance.now();
        let dll = new DoublyLinkedList<D9Type>();
        let id = 0;

        numbers.forEach((f,i) => {
            if (i % 2 === 0) {
                dll.push({ id, size: f, type: D9DataType.FILE });
                id++
            } else {
                dll.push({ id: 0, size: f, type: D9DataType.SPACE });
            }
        })

        let nearestSpacePosition = 0;
        let nearestSpace = dll.head;

        let lowestSpacePosition = 0;
        let lowestSpace = dll.head;

        let o = 0;
        let s = 0;

        const getNearestSpace = (requiredSize: number): void => {
            // if (!nearestSpace) return;
            const s0 = performance.now();
            while (nearestSpace!.val.type !== D9DataType.SPACE || nearestSpace!.val.size < requiredSize ) {
                // if (!nearestSpace?.next) break;
                nearestSpace = nearestSpace!.next;
                nearestSpacePosition++;
            }
            const s1 = performance.now();
            s += s1-s0;
        }

        let current = dll.tail;
        let currentPosition = dll.length - 1;

        while (current?.prev) {
            if (current.val.type === D9DataType.FILE) {
                const file = current;
                let remainingSize = file.val.size;

                if (part === 2) {
                    nearestSpacePosition = 0;
                    nearestSpace = dll.head;
                }
                getNearestSpace(part === 2 ? remainingSize : 0);

                while (remainingSize > 0 && currentPosition > nearestSpacePosition) {
                    const o0 = performance.now();
                    if (nearestSpace?.val.type === D9DataType.SPACE) {
                        if (nearestSpace.val.size > remainingSize) {
                            nearestSpace.val.size -= remainingSize;
                            dll.insert(nearestSpacePosition, {id: file.val.id, size: remainingSize, type: D9DataType.FILE})
                            file.val.id = 0;
                            file.val.type = D9DataType.SPACE;
                            remainingSize = 0;
                            currentPosition++;
                            nearestSpacePosition++;
                        } else if (nearestSpace.val.size === remainingSize) {
                            nearestSpace.val.type = D9DataType.FILE;
                            nearestSpace.val.id = file.val.id;
                            remainingSize = 0;
                            file.val.id = 0;
                            file.val.type = D9DataType.SPACE;
                        } else if (part === 1) { //checking of the smaller sizes is only in part 1
                            nearestSpace.val.type = D9DataType.FILE;
                            nearestSpace.val.id = file.val.id;
                            remainingSize -= nearestSpace.val.size;
                            file.val.size -= nearestSpace.val.size;
                            getNearestSpace(0);
                        }
                    }
                    const o1 = performance.now();
                    o += o1-o0;
                }
            }
            current = current.prev;
            currentPosition--;
        }

        let sum = 0, i = 0;

        current = dll.head;
        while(current !== null){
            if (current.val.type === D9DataType.SPACE) {
                i += current.val.size;
            } else {
                const condition = i+current.val.size;
                for (; i < condition; i++) {
                    sum += current.val.id * i
                }
            }
            current = current.next;
        }

        const t1 = performance.now();
        console.log(`Operations time: ${o} milliseconds.`);
        console.log(`Space time: ${s} milliseconds.`);
        console.log(`Execution time: ${t1 - t0} milliseconds.`);
        return sum;
    }

    console.log("Part 1", run(1));
    console.log("Part 2", run(2));
}