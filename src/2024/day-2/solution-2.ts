const isSafe = (r: number[]): number => {

    let lastValue = r[0];
    let direction = r[0] - r[r.length - 1] > 0 ? 1 : -1
    let safe = -1;
    r.forEach((v, i) => {
        if (
            lastValue - v > 0 && direction < 0 ||
            lastValue - v < 0 && direction > 0 ||
            (lastValue - v === 0 && i > 0) ||
            Math.abs(lastValue - v) > 3
        ) {
            safe = i;
        }
        lastValue = v;
    })

    return safe;
}

exports.solution = (input: string[]) => {
    const reports: number[][] = input.map(i => i.split(' ').map(i => parseInt(i)));

    let safeReports = 0;
    reports.forEach(r => {
        console.log("==================");
        let safe = isSafe(r)

        if (safe >= 0) {
            const array1 = [...r], array2 = [...r];
            array1.splice(safe,1)
            if (safe > 0) {
                array2.splice(safe-1, 1);
            }
            const tries = [array1, array2]
            console.log(safe, "gonna try", tries)
            const changeIsSafe = tries.find(t => {
                const changeSafe = isSafe(t)
                console.log("=== change: ", changeSafe);
                return changeSafe === -1;
            })
            if (changeIsSafe !== undefined) {
                safe = -1;
            }
        }

        console.log(safe);
        if (safe === -1) safeReports++;
        console.log("==================");
    })

    console.log(safeReports);




}