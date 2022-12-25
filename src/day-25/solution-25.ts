type SnafuInterval = {
    start: number,
    end: number,
    sign: number,
    result: number,
}

const fifths: number[] = [];
const results: number[] = [];
const maxDigits: number = 21;



const snafuIntervals: SnafuInterval[] = [
    {
        start: 0,
        end: 0.5,
        sign: 1,
        result: 0,
    },
    {
        start: 0.5,
        end: 1,
        sign: -1,
        result: 1,
    },
    {
        start: 1,
        end: 1.5,
        sign: 1,
        result: 1,
    },
    {
        start: 1.5,
        end: 2,
        sign: -1,
        result: 2,
    },
    {
        start: 2,
        end: 2.5,
        sign: 1,
        result: 2,
    },
];

const getInterval = (x: number, n: number): SnafuInterval => {
    let intervalId = -1;
    snafuIntervals.forEach((interval, i) => {
        if (x >= interval.start * fifths[n] && x < interval.end * fifths[n] ) intervalId = i;
    });
    if (intervalId === -1) throw Error("intervalId stayed -1!");
    return snafuIntervals[intervalId];
}

const getSnafu = (sign: number, intervalResult: number): string => {
    switch (intervalResult * sign) {
        case -2: return '=';
        case -1: return '-';
        case 1: return '1';
        case 2: return '2';
        default: return '0';
    }
}

const numberToSnafu = (x: number, snafuResult: string = '', thisSign: number = 1, n: number = maxDigits ): string => {
    if (n === 0) return snafuResult;

    const interval = getInterval(x, n);

    return numberToSnafu(Math.abs(fifths[n] * interval.result - x), (snafuResult === '0' ? '' : snafuResult) + getSnafu(thisSign, interval.result), interval.sign * thisSign, n - 1);
}

const parseFifths = (input: string[]) => {
    for (let i = 1; i <= maxDigits; i++) fifths[i] = i === 1 ? 1 : fifths[i - 1] * 5;

    input.forEach((wholeNumber, rowId) => {
        results[rowId] = 0;
        wholeNumber.split('').forEach((num, i) => {
            const place = wholeNumber.length - i;
            const realNum = num === '=' ? -2 : (num === '-' ? - 1 : parseInt(num));
            results[rowId] += realNum * fifths[place];
        });
    })
}

exports.solution = (input: string[]) => {
    parseFifths(input);

    const sum = results.reduce((p, c) => p + c, 0);
    console.log(sum);

    console.log(numberToSnafu(sum));

}