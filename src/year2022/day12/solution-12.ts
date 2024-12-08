type P = {
    elevation: number;
    neighbors: P[];
    distance: number;
}

type PVisit = {
    p: P,
    newDistance: number,
}

type ImportantPoints = {
    start: P;
    end: P;
}

const createPoint = (char?: string): P => ({
    elevation: char ? char.charCodeAt(0) : 0,
    neighbors: [],
    distance: -1,
});

const visitP = (stack: PVisit[]) => {
    const vp = stack.pop();
    if (!vp) return;
    vp.p.distance = vp.newDistance;
    vp.p.neighbors.forEach(n => {
        if (n.distance === -1 || n.distance > vp.p.distance + 1) stack.push({p: n, newDistance: vp.p.distance + 1});
    });
}

exports.solution = (input: string[]) => {
    const ip: ImportantPoints = {
        start: createPoint(),
        end: createPoint(),
    }

    const aPoints: P[] = [];

    const map: P[][] = input.map((l) =>  l.split("").map(x => {
        let c = x;
        if (x === 'S') c = 'a';
        if (x === 'E') c = 'z';
        const p = createPoint(c);
        if (c === 'a') aPoints.push(p);
        if (x === 'S') ip.start = p;
        if (x === 'E') ip.end = p;
        return p;
    }));

    map.forEach((row, y) => {
        row.forEach((p, x) => {
            if (x > 0 && row[x - 1].elevation - p.elevation <= 1)  p.neighbors.push(row[x - 1]);
            if (x < row.length - 1 && row[x + 1].elevation - p.elevation <= 1) p.neighbors.push(row[x + 1]);
            if (y > 0 && map[y - 1][x].elevation - p.elevation <= 1) p.neighbors.push(map[y - 1][x]);
            if (y < map.length - 1 && map[y + 1][x].elevation - p.elevation <= 1) p.neighbors.push(map[y + 1][x]);
        });
    });

    const stack1: PVisit[] = [{p: ip.start, newDistance: 0}];
    while (stack1.length > 0) visitP(stack1);
    console.log(`Part 1: ${ip.end.distance} steps`);

    const stack2: PVisit[] = aPoints.map(p => ({p, newDistance: 0}));
    while (stack2.length > 0) visitP(stack2);
    console.log(`Part 2: ${ip.end.distance} steps`);
}