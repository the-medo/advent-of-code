type P = {
    elevation: number;
    neighbors: P[];
    visited: boolean;
}

const createPoint = (char: string): P => ({
    elevation: char.charCodeAt(0),
    neighbors: [],
    visited: false,
})

exports.solution = (input: string[]) => {
    console.log("TODO: solution");
    let start: P;
    let end: P;

    const map: P[][] = input.map((l) =>  l.split("").map(x => {
        let c = x;
        if (x === 'S') c = 'a';
        if (x === 'E') c = 'z';
        const p = createPoint(c);
        if (x === 'S') start = p;
        if (x === 'E') end = p;
        return p;
    }));

    console.log(map);
    console.log(start!);
    console.log(end!);
}