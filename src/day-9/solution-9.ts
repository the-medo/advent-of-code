type DirectionalMove = {
    x: number,
    y: number,
};

type Point = {
    x: number,
    y: number,
}

type Directions = 'U' | 'R' | 'D' | 'L';

const DirectionalMoves: Record<Directions, DirectionalMove> = {
    U: {
        x: 0,
        y: -1,
    },
    R: {
        x: 1,
        y: 0,
    },
    D: {
        x: 0,
        y: 1,
    },
    L: {
        x: -1,
        y: 0,
    }
}

const arePointsTouching = (p1: Point, p2: Point) => Math.abs(p1.x - p2.x) <= 1 && Math.abs(p1.y - p2.y) <= 1;
const moveHead = (h: Point, direction: Directions) => {
    h.x += DirectionalMoves[direction].x;
    h.y += DirectionalMoves[direction].y;
}
const moveTail = (h: Point, t: Point, v: Set<string>) => {
    if (!arePointsTouching(h, t)) {
        if (h.x > t.x) t.x += 1;
        if (h.x < t.x) t.x -= 1;
        if (h.y > t.y) t.y += 1;
        if (h.y < t.y) t.y -= 1;
    }

    v.add(`${t.x}_${t.y}`);
};

exports.solution = (input: string[]) => {
    const head: Point = {
        x: 0,
        y: 0,
    };
    const tail: Point = {
        x: 0,
        y: 0,
    };

    const visitedByTail = new Set<string>;

    input.forEach(l => {
        const [a, b] = l.split(" ");
        const direction = a as Directions;
        const moveCount = parseInt(b);

        for (let i = 1; i <= moveCount; i++) {
            moveHead(head, direction);
            moveTail(head, tail, visitedByTail);
        }
    });

    console.log(visitedByTail.size);


}