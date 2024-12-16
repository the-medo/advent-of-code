class PriorityQueueNode<T> {
    val: T;
    priority: number;

    constructor(val: T, priority: number){
        this.val = val;
        this.priority = priority;
    }
}

export class PriorityQueue<T> {
    #values: PriorityQueueNode<T>[];

    constructor(){
        this.#values = [];
    }

    enqueue(val: T, priority: number){
        let newNode = new PriorityQueueNode(val, priority);
        this.#values.push(newNode);
        this.bubbleUp();
    }

    bubbleUp(){
        let idx = this.#values.length - 1;
        const element = this.#values[idx];
        while(idx > 0){
            let parentIdx = Math.floor((idx - 1)/2);
            let parent = this.#values[parentIdx];
            if(element.priority >= parent.priority) break;
            this.#values[parentIdx] = element;
            this.#values[idx] = parent;
            idx = parentIdx;
        }
    }

    dequeue(){
        // console.log("HERE", this.#values)
        const min = this.#values[0];
        const end = this.#values.pop();
        if(this.#values.length > 0){
            // @ts-ignore
            this.#values[0] = end;
            this.sinkDown();
        }/* else {
            this.#values = [];
            return undefined;
        }*/
        return min;
    }

    sinkDown(){
        let idx = 0;
        const length = this.#values.length;
        const element = this.#values[0];
        while(true){
            let leftChildIdx = 2 * idx + 1;
            let rightChildIdx = 2 * idx + 2;
            let leftChild: PriorityQueueNode<T>, rightChild: PriorityQueueNode<T>;
            let swap = null;

            if(leftChildIdx < length){
                leftChild = this.#values[leftChildIdx];
                if(leftChild.priority < element.priority) {
                    swap = leftChildIdx;
                }
            }
            if(rightChildIdx < length){
                rightChild = this.#values[rightChildIdx];
                if(
                    (swap === null && rightChild.priority < element.priority) ||
                    // @ts-ignore
                    (swap !== null && rightChild.priority < leftChild?.priority)
                ) {
                    swap = rightChildIdx;
                }
            }
            if(swap === null) break;
            this.#values[idx] = this.#values[swap];
            this.#values[swap] = element;
            idx = swap;
        }
    }
}
