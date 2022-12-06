
const findMarker = (l: string, len: number): number => {
    for (let i = len - 1; i < l.length; i++) {

        const arr: Record<string, boolean> = {}
        let isOk = true;
        for (let j = 0; j < len; j++) {
            if (arr[l[i-j]]) {
                isOk = false;
                break;
            }
            arr[l[i-j]] = true;
        }

        if (isOk) {
            return i+1;
        }
    }
    return 0;
}

exports.solution = (input: string[]) => {
    const signal = input[0];

    console.log(findMarker(signal, 4));
    console.log(findMarker(signal, 14));
}