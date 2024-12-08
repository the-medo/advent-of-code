const cloneDeep = require('lodash/cloneDeep');

type PacketData = {
    parent?: PacketData,
    data: (PacketData | number)[],
    isSpecial: boolean,
    stringInterpretation?: string,
}

type PacketPair = {
    id: number;
    left: PacketData;
    right: PacketData;
    correctOrder?: boolean;
}

const basePacket = (parent?: PacketData, isSpecial: boolean = false): PacketData => ({parent, data: [], isSpecial});

const parsePacket = (p: string, isSpecial: boolean = false): PacketData => {
    const pd = basePacket(undefined, isSpecial);
    pd.stringInterpretation = p;
    let activePd: PacketData = pd;
    const chars = p.split("");
    let numberChars = '';

    chars.forEach(c => {
        if (c === '[') {
            const newData = basePacket(activePd, isSpecial);
            activePd.data.push(newData);
            activePd = newData;
        }
        else if (c === ']' && activePd.parent)  {
            if (numberChars.length > 0) activePd.data.push(parseInt(numberChars));
            numberChars = '';
            activePd = activePd.parent;
        }
        else if (c === ',') {
            if (numberChars.length > 0) activePd.data.push(parseInt(numberChars));
            numberChars = '';
        } else {
            numberChars += c;
        }
    })

    return pd;
}

const comparePacketData = (l?: PacketData | number, r?: PacketData | number): boolean | undefined => {

    if (l === undefined) return r === undefined ? undefined : true;
    else if (r === undefined) return false;

    if (typeof l === "number") {
        if (typeof r === "number") {
            return l === r ? undefined : l < r;
        } else { // RIGHT is of type "PacketData"
            let size = r.data.length;
            let rightNum = r.data.shift();
            while (typeof rightNum !== "number" && rightNum !== undefined) {
                size = rightNum.data.length;
                rightNum = rightNum.data.shift();
            }
            const result = comparePacketData(l, rightNum);
            return result === undefined ? (size > 1 ? true : undefined) : result;
        }
    } else { // LEFT is of type "PacketData"
        if (typeof r === "number") {
            let size = l.data.length;
            let leftNum = l.data.shift();
            let result;
            while (typeof leftNum !== "number" && leftNum !== undefined) {
                size = leftNum.data.length;
                leftNum = leftNum.data.shift();
            }
            result = comparePacketData(leftNum, r);
            return result === undefined && size !== 1 ? false : result;
        } else { // both are of type "PacketData"
            let result;
            let leftNum;
            let rightNum;
            do {
                leftNum = l.data.shift();
                rightNum = r.data.shift();
                result = comparePacketData(leftNum, rightNum);
            } while (result === undefined && (leftNum !== undefined || rightNum !== undefined) );
            return result;
        }
    }
}

const comparePacketsAndKeepData = (l?: PacketData | number, r?: PacketData | number): boolean | undefined => comparePacketData(cloneDeep(l), cloneDeep(r));

const comparePacketPair = (pp: PacketPair) => pp.correctOrder = comparePacketsAndKeepData(pp.left, pp.right) ?? true;

exports.solution = (input: string[]) => {
    const packetPairs: PacketPair[] = [];
    const allPackets: PacketData[] = [];

    input.forEach((l, i) => {
        if (i % 3 === 0) packetPairs.push({id: Math.floor(i / 3) + 1, left: parsePacket(l), right: basePacket()});
        if (i % 3 === 1) packetPairs[ Math.floor(i / 3) ].right = parsePacket(l);
        if (i % 3 !== 2) allPackets.push(parsePacket(l));
    });

    allPackets.push(parsePacket('[[2]]', true));
    allPackets.push(parsePacket('[[6]]', true));

    packetPairs.forEach(pp => comparePacketPair(pp));
    console.log("Total sum of PacketPair IDs in right order: ", packetPairs.reduce((p, c) => p + (c.correctOrder ? c.id : 0), 0 ));

    allPackets.sort((a, b) => (comparePacketsAndKeepData(a, b) ? -1 : 1) );
    // allPackets.map((p) => console.log(p.stringInterpretation));
    console.log("Decoder key: ", allPackets.map((p, i) => p.isSpecial ? i + 1 : 0).reduce((p, c) => p * (c > 0 ? c : 1), 1));

}