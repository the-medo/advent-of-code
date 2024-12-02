exports.solution = (input: string[]) => {
    const reports: number[][] = input.map(i => i.split(' ').map(i => parseInt(i)));

    let safeReports = 0;
    reports.forEach(r => {
        let lastValue = r[0];
        let direction = r[0] - r[r.length - 1] > 0 ? 1 : -1
        let safe = true;
        r.forEach((v, i) => {
            if (
                lastValue - v > 0 && direction < 0 ||
                lastValue - v < 0 && direction > 0 ||
                (lastValue - v === 0 && i > 0) ||
                Math.abs(lastValue - v) > 3
            ) {
                safe = false;
            }
            lastValue = v;
        })
        console.log(safe);
        if (safe) safeReports++;
    })

    console.log(safeReports);




}