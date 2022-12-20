import {CircularLinkedList} from "../utils/CircularLinkedList";

exports.solution = (input: string[]) => {
    const arr = input.map(Number)
    const List = new CircularLinkedList<number>();

    const linkedArray = arr.map(e => {
        List.push(e);
        return List.tail;
    });

    linkedArray.forEach((current, i) => {
        if (current) {
            let distance =  (current.val % (linkedArray.length - 1));
            if (distance < 0) distance = (linkedArray.length - 1) + distance;

            const distantNode = List.find(current, distance);
            List.removeAndInsertAfter(current, distantNode);

            console.log("Distance: ", distance);
        }
    });

    const zeroNode = linkedArray.find(c => c?.val === 0);

    if (zeroNode) {
        const oneThousand = List.find(zeroNode, 1000);
        const twoThousand = List.find(zeroNode, 2000);
        const threeThousand = List.find(zeroNode, 3000);
        console.log("One thousand el: ", oneThousand.val);
        console.log("Two Thousand el: ", twoThousand.val);
        console.log("Three Thousand el: ", threeThousand.val);
        console.log("Total: ", oneThousand.val + twoThousand.val + threeThousand.val);
    }

    const finalArray = [];
    let current = List.head;
    while(current) {
        finalArray.push(current.val);
        current = current.next;
    }

    console.log("Start: ", linkedArray.map(l => l?.val))
    console.log("Final: ", finalArray);
}