type Cycle = {
    cycle: number,
    x: number,
}

type SignalResults = {
    importantSignals: number[],
    importantSignalStrengths: number[],
    screen: string[];
}

const doCycle = (c: Cycle, signals: SignalResults) => {
    const row = Math.floor(c.cycle / 40);
    if (!signals.screen[row]) signals.screen[row] = '';
    signals.screen[row] += Math.abs((c.cycle % 40) - c.x) <= 1 ? '#' : '.';

    c.cycle++;
    if (signals.importantSignals.includes(c.cycle)) signals.importantSignalStrengths.push(c.cycle * c.x);
}

const increaseX = (c: Cycle, val: number) => c.x += val;

exports.solution = (input: string[]) => {

    const c: Cycle = {
        cycle: 0,
        x: 1,
    };

    const signals: SignalResults = {
        importantSignals: [20, 60, 100, 140, 180, 220],
        importantSignalStrengths: [],
        screen: [],
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
    console.log(signals.screen);
}