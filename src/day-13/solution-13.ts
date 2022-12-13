type PacketData = {
    parent: null | PacketData,
    data: (PacketData | number)[]
}

type PacketPair = {
    id: number;
    left: PacketData;
    right: PacketData;
    correct?: boolean;
}

const basePacket = (parent: null | PacketData = null): PacketData => ({parent, data: []})
const parsePacket = (p: string): PacketData => {
    const pd = basePacket();
    let activePd: PacketData = pd;
    const chars = p.split("");
    let numberChars = '';

    chars.forEach(c => {
        if (c === '[') {
            const newData = basePacket(activePd);
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

const comparePacketData = (l: PacketData | number | undefined, r: PacketData | number | undefined): boolean | undefined => {
    console.log("==========")
    console.log("Left: ", typeof l === "number" ? l : l?.data)
    console.log("Right: ", typeof r === "number" ? r : r?.data)

    if (l === undefined) {
        if (r === undefined) return undefined;
        return true;
    } else if (r === undefined) {
        return false;
    }

    if (typeof l === "number") {
        if (typeof r === "number") {
            console.log("NUMBER VS NUMBER"); //compare 6 with 6
            return l === r ? undefined : l < r;
        } else {
            console.log("NUMBER VS DATA"); //compare 6 with [[6,7,8]]
            let rightNum = r.data.shift(); //[6,7,8]
            while (typeof rightNum !== "number" && rightNum !== undefined) {
                rightNum = rightNum.data.shift();
            }
            const result = comparePacketData(l, rightNum);
            return result === undefined ? true : result;
        }
    } else {
        if (typeof r === "number") {
            console.log("DATA VS NUMBER"); //compare [[6,7,8]] with 6
            let leftNum = l.data.shift();
            while (typeof leftNum !== "number" && leftNum !== undefined) {
                leftNum = leftNum.data.shift(); //[6,7,8]
            }
            const result = comparePacketData(leftNum, r);
            return result === undefined ? false : result;

        } else {
            console.log("DATA VS DATA"); //compare [[6,7,8]] with [6,7,8]
            let result;
            let leftNum;
            let rightNum;
            do {
                leftNum = l.data.shift();
                rightNum = r.data.shift();
                result = comparePacketData(leftNum, rightNum);
            } while (result === undefined && (leftNum !== undefined || rightNum !== undefined ) );
            return result;
        }
    }
}

const comparePacketPair = (pp: PacketPair) => pp.correct = comparePacketData(pp.left, pp.right) ?? true;

exports.solution = (input: string[]) => {

    const packetPairs: PacketPair[] = [];
    input.forEach((l, i) => {
        if (i % 3 === 0) packetPairs.push({id: Math.floor(i / 3) + 1, left: parsePacket(l), right: basePacket()});
        if (i % 3 === 1) packetPairs[ Math.floor(i / 3) ].right = parsePacket(l);
        if (i % 3 === 2) return;
    });

    packetPairs.forEach(pp => comparePacketPair(pp));

    console.log("Total sum of PacketPair IDs in right order: ", packetPairs.reduce((p, c) => p + (c.correct ? c.id : 0), 0 ))


}