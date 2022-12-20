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


export class DoublyLinkedList<T> {
  public head: Node<T> | null;
  public tail: Node<T> | null;
  public length: number;

    constructor(){
        this.head = null;
        this.tail = null;
        this.length = 0;
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