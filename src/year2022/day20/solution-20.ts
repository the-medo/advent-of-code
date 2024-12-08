import {CircularLinkedList} from "../../ts/utils/CircularLinkedList";

const runOnInput = (input: string[], encryptionKey: number, repetitions: number) => {
    const arr = input.map(Number)
    const List = new CircularLinkedList<number>();
    const linkedArray = arr.map(e => {
        List.push(e * encryptionKey);
        return List.tail;
    });

    for (let rep = 0; rep < repetitions; rep++) {
        linkedArray.forEach((current, i) => {
            if (current) {
                let distance = (current.val % (linkedArray.length - 1));
                if (distance < 0) distance = (linkedArray.length - 1) + distance;

                const distantNode = List.find(current, distance);
                List.removeAndInsertAfter(current, distantNode);
            }
        });
    }

    const zeroNode = linkedArray.find(c => c?.val === 0);

    const finalArray = [];
    let current = List.head;
    while(current) {
        finalArray.push(current.val);
        current = current.next;
    }

    if (zeroNode) {
        const oneThousand = List.find(zeroNode, 1000);
        const twoThousand = List.find(zeroNode, 2000);
        const threeThousand = List.find(zeroNode, 3000);
        console.log("Coordinates: ", oneThousand.val, twoThousand.val, threeThousand.val, " => ", oneThousand.val + twoThousand.val + threeThousand.val);
    }
}

exports.solution = (input: string[]) => {

    //part 1:
    runOnInput(input, 1, 1);

    //part 2:
    runOnInput(input, 811589153, 10);



}