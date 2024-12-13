export const gcd = (a: number, b: number) => {
    while (b !== 0) {
        const t = b;
        b = a % b
        a = t;
    }
    return a;
};