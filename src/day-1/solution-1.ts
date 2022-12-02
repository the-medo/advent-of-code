type Elves = number[];

const parseElvesFromInput = (input: string[]): Elves => {
    const elves: Elves = [0];
    let elfCounter = 0;

    input.forEach(line => {
        if (line === '') {
            elfCounter++;
            elves[elfCounter] = 0;
        } else {
            elves[elfCounter] += parseInt(line);
        }
    });

    return elves;
}

const sortElvesByCaloriesDesc = (elves: Elves) => elves.sort((a, b) => b - a);

const partOne_d1 = (sortedElves: Elves): number => sortedElves[0] ?? 0;
const partTwo_d1 = (sortedElves: Elves): number => sortedElves.slice(0, 3).reduce((sum, value) => sum + value, 0);

exports.solution = (input: string[]) => {
    const elves = parseElvesFromInput(input);
    sortElvesByCaloriesDesc(elves);
    console.log(partOne_d1(elves));
    console.log(partTwo_d1(elves));
}