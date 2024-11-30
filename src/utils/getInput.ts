
const getInput = (day: number, year: number): string[] =>  require('fs').readFileSync(`./src/${year}/day-${day}/input-${day}.txt`, 'utf8').split(/\r?\n/);

export default getInput;