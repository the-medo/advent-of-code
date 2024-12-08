
const getInput = (day: number, year: number, testing: boolean): string[] =>
    require('fs')
        .readFileSync(`./src/year${year}/day${day}/${testing ? 'test' : 'input'}-${day}.txt`, 'utf8')
        .split(/\r?\n/);

export default getInput;