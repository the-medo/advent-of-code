/**
 * https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
 */

export type NeighborMapForBronKerbosch<T extends string | number> = Record<T, T[]>;

const bkLogging = false;

export const BronKerbosch = <T extends string | number>(
    nm: NeighborMapForBronKerbosch<T>,
    r: Set<T>,
    p: Set<T>,
    x: Set<T>
): Set<T> | undefined => {
    if (p.size === 0 && x.size === 0) {
        if (bkLogging) console.log("End: ", r, p, x, " => ", r);
        return r;
    }
    const result = [...p].map(v => {
        const bkResult = BronKerbosch(
            nm,
            new Set<T>([...r, v]),
            new Set(nm[v].filter(n => p.has(n))),
            new Set(nm[v].filter(n => x.has(n)))
        );
        p.delete(v);
        x.add(v);
        return bkResult;
    }).filter(Boolean).sort((a, b) => b!.size - a!.size);
    if (bkLogging) console.log("Result: ", r, p, x, " => ", result[0]);
    return result[0];
}

/** same example as in wiki, should result in 1,2,5 */
export const bkTestMap: NeighborMapForBronKerbosch<number> = {
    1: [2, 5],
    2: [1, 3, 5],
    3: [2, 4],
    4: [3, 5, 6],
    5: [1, 2, 4],
    6: [4],
};

