type ElfAssignment = {
    start: number;
    end: number;
}

type ElfPair = {
    elves: ElfAssignment[],
}

const parseIdsToElfAssignment = (idInput: string[]): ElfAssignment => ({start: parseInt(idInput[0]), end: parseInt(idInput[1])})

const parseElfAssignmentsFromInput = (input: string[]): ElfPair[] => input.map(line => ({elves: line.split(",").map(e => parseIdsToElfAssignment(e.split("-")))}));

const isAssignmentOverlappingFully = (a1: ElfAssignment, a2: ElfAssignment) => a1.start >= a2.start && a1.end <= a2.end;
const isPairOverlappingFully = (pair: ElfPair): boolean => isAssignmentOverlappingFully(pair.elves[0], pair.elves[1]) || isAssignmentOverlappingFully(pair.elves[1], pair.elves[0])

const isAssignmentOverlappingPartially = (a1: ElfAssignment, a2: ElfAssignment) => a1.start <= a2.start && a1.end >= a2.start;
const isPairOverlappingPartially = (pair: ElfPair): boolean => isAssignmentOverlappingPartially(pair.elves[0], pair.elves[1]) || isAssignmentOverlappingPartially(pair.elves[1], pair.elves[0])

exports.solution = (input: string[]) => {
    const elfPairs = parseElfAssignmentsFromInput(input);

    console.log(elfPairs.filter(ep => isPairOverlappingFully(ep)).length);
    console.log(elfPairs.filter(ep => isPairOverlappingPartially(ep)).length);
}