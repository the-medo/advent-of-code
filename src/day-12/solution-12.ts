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

const createPoint = (char: string): P => ({
    elevation: char.charCodeAt(0),
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
        start: createPoint("A"),
        end: createPoint("Z"),
    }

    const map: P[][] = input.map((l) =>  l.split("").map(x => {
        let c = x;
        if (x === 'S') c = 'a';
        if (x === 'E') c = 'z';
        const p = createPoint(c);
        if (x === 'S') ip.start = p;
        if (x === 'E') ip.end = p;
        return p;
    }));

    map.forEach((row, y) => {
        row.forEach((p, x) => {
            if (x > 0 && row[x - 1].elevation - p.elevation <= 1)  p.neighbors.push(row[x - 1]);
            if (x < row.length - 1 && row[x + 1].elevation - p.elevation <= 1) p.neighbors.push(row[x + 1]);
            if (y > 0 && map[y - 1][x].elevation  - p.elevation <= 1) p.neighbors.push(map[y - 1][x]);
            if (y < map.length - 1 && map[y + 1][x].elevation - p.elevation <= 1) p.neighbors.push(map[y + 1][x]);
        });
    });

    const stack: PVisit[] = [{p: ip.start, newDistance: 0}];
    while (stack.length > 0) visitP(stack);

    console.log(ip.end);
}