type Cycle = {
    cycle: number,
    x: number,
}

type SignalStrengths = {
    importantSignals: number[],
    importantSignalStrengths: number[],
}

const doCycle = (c: Cycle, signals: SignalStrengths) => {
    c.cycle++;
    if (signals.importantSignals.includes(c.cycle)) {
        signals.importantSignalStrengths.push(c.cycle * c.x);
    }
}

const increaseX = (c: Cycle, val: number) => {
    c.x += val;
}

exports.solution = (input: string[]) => {

    const c: Cycle = {
        cycle: 0,
        x: 1,
    };

    const signals: SignalStrengths = {
        importantSignals: [20, 60, 100, 140, 180, 220],
        importantSignalStrengths: [],
    };

    input.forEach(l => {
        if (l === 'noop') {
            doCycle(c, signals);
        } else {
            const [, value] = l.split(" ");
            if (value) {
                doCycle(c, signals);
                doCycle(c, signals);
                increaseX(c, parseInt(value));
            }
        }
    });

    console.log(signals.importantSignalStrengths.reduce((prev, cur) => prev+cur, 0));
}