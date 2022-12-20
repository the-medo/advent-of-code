export class Node<T>{
  public val: T;
  public next: Node<T> | null;
  public prev: Node<T> | null;

  constructor(val: T){
      this.val = val;
      this.next = null;
      this.prev = null;
  }
}


export class CircularLinkedList<T> {
  public head: Node<T> | null;
  public tail: Node<T> | null;
  public length: number;

    constructor(){
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    find (node: Node<T>, positions: number, after: boolean = true) {
      let i = 0;
      if (positions < 0 && after) positions--;
      if (Math.abs(positions) === this.length) return node;

      if (this.head && this.tail) {
        if (positions > 0) {
          for (i = 0; i < positions; i++) node = node.next ?? this.head
        } else if (positions < 0) {
          for (i = 0; i > positions; i--) node = node.prev ?? this.tail
        }
      }
      return node;
    }

    swap (node1: Node<T>, node2: Node<T>) {
      const n1prev = node1.prev, n1next = node1.next, n2prev = node2.prev, n2next = node2.next;

      console.log("SWAPPING...");
      console.log(node1);
      console.log(node2);
      console.log(n1next === node2);
      console.log(n2next === node1);

      console.log("n1prev?.prev", n1prev?.prev);

      if (n1next === node2 || n1prev === node2) { //they are after each other
        node1.next = n2next;
        node1.prev = node2;
        node2.next = node1;
        node2.prev = n1prev;
      } else {
        if (n1prev) n1prev.next = node2;
        if (n1next) n1next.prev = node2;
        if (n2prev) n2prev.next = node1;
        if (n2next) n2next.prev = node1;

        node2.prev = n1prev;
        node2.next = n1next;
        node1.prev = n2prev;
        node1.next = n2next;
      }

      if (!node1.prev) this.head = node1;
      if (!node1.next) this.tail = node1;
      if (!node2.prev) this.head = node2;
      if (!node2.next) this.tail = node2;
    }

    removeAndInsertAfter(nodeToRemove: Node<T>, nodeToInsertAfter: Node<T>) {
      if (nodeToRemove === nodeToInsertAfter) return;
      const prevNode1 = nodeToRemove.prev;
      const nextNode1 = nodeToRemove.next;
      if (prevNode1) prevNode1.next = nextNode1;
      if (nextNode1) nextNode1.prev = prevNode1;

      if (!nodeToRemove.prev) this.head = nextNode1;
      if (!nodeToRemove.next) this.tail = prevNode1;
      if (!nodeToInsertAfter.prev) this.head = nodeToInsertAfter;
      if (!nodeToInsertAfter.next) this.tail = nodeToInsertAfter;

      nodeToRemove.prev = nodeToInsertAfter;
      nodeToRemove.next = nodeToInsertAfter.next;
      if (nodeToInsertAfter.next) nodeToInsertAfter.next.prev = nodeToRemove;
      nodeToInsertAfter.next = nodeToRemove
    }

    push(val: T){
        const newNode = new Node(val);
        if(!this.tail){
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.length++;
        return this;
    }

    pop(){
        if(!this.head) return undefined;
        const poppedNode = this.tail;

        if(this.length === 1){
            this.head = null;
            this.tail = null;
        } else {
            this.tail = poppedNode!.prev;
            this.tail!.next = null;
            poppedNode!.prev = null;
        }
        this.length--;
        return poppedNode;
    }

    shift(){
        if(this.length === 0) return undefined;
        const oldHead = this.head;
        if(this.length === 1){
            this.head = null;
            this.tail = null;
        } else {
            this.head = oldHead!.next;
            this.head!.prev = null;
            oldHead!.next = null;
        }
        this.length--;
        return oldHead;
    }

    unshift(val: T){
        const newNode = new Node(val);
        if(this.length === 0) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.head!.prev = newNode;
            newNode.next = this.head;
            this.head = newNode;
        }
        this.length++;
        return this;
    }
    get(index: number){
        if(index < 0 || index >= this.length) return null;

        let count, current;
        if(index <= this.length/2){
            count = 0;
            current = this.head;
            while(count !== index){
                current = current!.next;
                count++;
            }
        } else {
            count = this.length - 1;
            current = this.tail;
            while(count !== index){
                current = current!.prev;
                count--;
            }
        }
        return current;
    }
    set(index: number, val: T){
        const foundNode = this.get(index);
        if(foundNode != null){
            foundNode.val = val;
            return true;
        }
        return false;
    }
    insert(index: number, val: T){
        if(index < 0 || index > this.length) return false;
        if(index === 0) return !!this.unshift(val);
        if(index === this.length) return !!this.push(val);

        const newNode = new Node(val);
        const beforeNode = this.get(index-1);
        const afterNode = beforeNode!.next;

        beforeNode!.next = newNode, newNode.prev = beforeNode;
        newNode.next = afterNode, afterNode!.prev = newNode;
        this.length++;
        return true;
    }
}