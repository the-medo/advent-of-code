
export const xor = (a: number, b: number) => {
    let aBin = a.toString(2);
    let bBin = b.toString(2);

    let result = '';
    for (let i = 0; i <= Math.max(aBin.length, bBin.length) - 1; i++) {
        const letterA = aBin[aBin.length - i - 1];
        const letterB = bBin[bBin.length - i - 1];
        if (letterA === "1" && letterB === "1") {
            result = "0" + result;
        } else if (letterA === "1" || letterB === "1") {
            result = "1" + result;
        } else {
            result = "0" + result;
        }
    }

    // console.log(aBin, bBin, result, parseInt(result, 2))
    return parseInt(result, 2)
}