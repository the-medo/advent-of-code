type ElfAssignment = {
    start: number;
    end: number;
}

type ElfPair = {
    elves: ElfAssignment[],
}

const parseIdsToElfAssignment = (idInput: string[]): ElfAssignment => ({start: parseInt(idInput[0]), end: parseInt(idInput[1])})

const parseElfAssignmentsFromInput = (input: string[]): ElfPair[] => input.map(line => ({elves: line.split(",").map(e => parseIdsToElfAssignment(e.split("-")))}));

const isAssignmentOverlapping = (a1: ElfAssignment, a2: ElfAssignment) => a1.start >= a2.start && a1.end <= a2.end;
const isPairOverlapping = (pair: ElfPair): boolean => isAssignmentOverlapping(pair.elves[0], pair.elves[1]) || isAssignmentOverlapping(pair.elves[1], pair.elves[0])

exports.solution = (input: string[]) => {
    const elfPairs = parseElfAssignmentsFromInput(input);

    console.log(elfPairs.filter(ep => isPairOverlapping(ep)).length);
}