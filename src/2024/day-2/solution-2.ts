/* returns -1 if the report is "safe", otherwise returns index of error */
const isSafe = (r: number[]): number => {

    let lastValue = r[0];
    let direction = r[0] - r[r.length - 1] > 0 ? 1 : -1
    let safe = -1;
    r.find((v, i) => {
        if (i === 0) return;
        if (
            lastValue - v > 0 && direction < 0 ||
            lastValue - v < 0 && direction > 0 ||
            (lastValue - v === 0) ||
            Math.abs(lastValue - v) > 3
        ) {
            safe = i;
        }
        lastValue = v;
        return safe >= 0
    })

    return safe;
}

exports.solution = (input: string[]) => {
    const reports: number[][] = input.map(i => i.split(' ').map(i => parseInt(i)));

    let safeReportsPart1 = 0;
    let safeReportsPart2 = 0;
    reports.forEach(r => {
        let safe = isSafe(r)

        //if safe is -1, it means that report is safe
        if (safe >= 0) {
            //we know what position was "unsafe", so we can try to remove element at that position (or at position before)
            const try1 = [...r], try2 = [...r];
            try1.splice(safe, 1)
            const triesWithRemovedFloors = [try1]
            if (safe > 0) {
                try2.splice(safe-1, 1);
                triesWithRemovedFloors.push(try2);
            }

            //we check if at least one of these changes is safe
            const changeIsSafe = triesWithRemovedFloors.find(t =>  isSafe(t) === -1)

            if (changeIsSafe !== undefined) {
                safe = -1;
            }
        } else {
            safeReportsPart1++;
        }

        if (safe === -1) safeReportsPart2++;
    })

    console.log("Total safe reports in part 1:",  safeReportsPart1);
    console.log("Total safe reports in part 2:",  safeReportsPart2);
}