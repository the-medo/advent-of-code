type Compartment = Record<number, number | undefined>;

type Backpack = {
    leftCompartment: Compartment,
    rightCompartment: Compartment,
    problematicItem?: string,
}

type ElfGroup = {
    elves: Backpack[],
    badge?: string,
};

const addCharToCompartment = (compartment: Compartment, char: string) => {
    const charCode = char.charCodeAt(0);
    compartment[charCode] = (compartment[charCode] ?? 0) + 1;
}

const isCharCodeInCompartment = (compartment: Compartment, charCode: number) => compartment[charCode] !== undefined;
const isCharCodeInBackpack = (b: Backpack, charCode: number) => isCharCodeInCompartment(b.leftCompartment, charCode) || isCharCodeInCompartment(b.rightCompartment, charCode);
const isCharInCompartment = (compartment: Compartment, char: string) => compartment[char.charCodeAt(0)] !== undefined;

/*
    Finding badge from elf group is done in two steps:
        1. find backpack with the least amount of items
        2. iterate through the smallest backpack to find item, that's in all of them
    It is not necessary, just a bit of optimization - we don't need to iterate through backpack with 100 items, when there is one backpack with 5 items.
 */

const findBadgeInGroup = (g: ElfGroup) => {
    const smallestBackpack = g.elves.reduce((acc, val) => Object.keys(acc.leftCompartment).length < Object.keys(val.leftCompartment).length ? val : acc, g.elves[0]);

    for (let charCode in {...smallestBackpack.leftCompartment, ...smallestBackpack.rightCompartment}) {
        const availableInGroups = g.elves.filter(e => isCharCodeInBackpack(e, parseInt(charCode)))
        if (availableInGroups.length === g.elves.length) {
            g.badge = String.fromCharCode(parseInt(charCode));
            return;
        }
    }
}

const parseBackpackInput = (input: string[]): Backpack[] => {
    return input.map(line => {
        const halfLength = line.length / 2;
        const leftCompartment: Compartment = {};
        const rightCompartment: Compartment = {};
        let problematicItem: string | undefined;

        for (let i = 0; i < halfLength; i++) {
            const charLeftHalf = line[i];
            const charRightHalf = line[i+halfLength];

            addCharToCompartment(leftCompartment, charLeftHalf);
            if (isCharInCompartment(rightCompartment, charLeftHalf)){
                problematicItem = charLeftHalf;
            }

            addCharToCompartment(rightCompartment, charRightHalf);
            if (isCharInCompartment(leftCompartment, charRightHalf)){
                problematicItem = charRightHalf;
            }
        }

        return {
            leftCompartment,
            rightCompartment,
            problematicItem,
        }
    });
}

const getPointsFromChar = (char: string = ''): number => {
    const charCode = char.charCodeAt(0);
    if (charCode >= 97) return charCode - 97 + 1; // a-z have 0-26
    if (charCode <= 90) return charCode - 65 + 27; //A-Z have 27-52
    return 0;
}

const createGroupsFromElves = (backpacks: Backpack[], groupSize: number = 3): ElfGroup[] => {
    const groups: ElfGroup[] = [];

    backpacks.forEach((b, i) => {
        if (i % groupSize === 0) groups.push({elves: []});
        groups[Math.floor(i / groupSize)].elves.push(b);
    });

    return groups;
}

exports.solution = (input: string[]) => {
    const elves: Backpack[] = parseBackpackInput(input);
    console.log(elves.reduce((sum, elf) => sum + getPointsFromChar(elf.problematicItem), 0));

    const groups = createGroupsFromElves(elves);
    groups.forEach(g => findBadgeInGroup(g));
    console.log(groups.reduce((sum, group) => sum + getPointsFromChar(group.badge), 0));
}