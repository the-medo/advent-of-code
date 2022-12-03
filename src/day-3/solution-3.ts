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
const isCharInCompartment = (compartment: Compartment, char: string) => compartment[char.charCodeAt(0)] !== undefined;

const getBadgeFromGroup = (g: ElfGroup) => {
    const smallestBackpack = g.elves.reduce((acc, val, currentIndex) => {
        if (Object.keys(acc.leftCompartment).length < Object.keys(val.leftCompartment).length) {
            return val;
        }
        return acc;
    }, g.elves[0]);

    for (let charCodeString in {...smallestBackpack.leftCompartment, ...smallestBackpack.rightCompartment}) {
        const charCode = parseInt(charCodeString);
        const availableInGroups = g.elves.filter(e =>
            isCharCodeInCompartment(e.leftCompartment, charCode) ||
            isCharCodeInCompartment(e.rightCompartment, charCode)
        )

        if (availableInGroups.length === g.elves.length) {
            g.badge = String.fromCharCode(charCode);
        }
    }

    console.log("Smallest backpack from group: ", smallestBackpack);



}

const parseRucksackInput = (input: string[]): Backpack[] => {
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

const getPoints = (char: string = ''): number => {
    const charCode = char.charCodeAt(0);
    if (charCode >= 97) return charCode - 97 + 1; // a-z have 0-26
    if (charCode <= 90) return charCode - 65 + 27; //A-Z have 27-52
    return 0;
}

exports.solution = (input: string[]) => {
    const backpacks: Backpack[] = parseRucksackInput(input);
    console.log(backpacks.reduce((sum, round) => sum + getPoints(round.problematicItem), 0))
    // console.log('a'.charCodeAt(0), 'z'.charCodeAt(0), 'A'.charCodeAt(0), 'Z'.charCodeAt(0));
}