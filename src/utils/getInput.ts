
const getInput = (day: number): string[] =>  require('fs').readFileSync(`./src/day-${day}/input-${day}.txt`, 'utf8').split(/\r?\n/);

export default getInput;