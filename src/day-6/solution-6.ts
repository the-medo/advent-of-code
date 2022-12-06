
/* This was first, using mapping object for characters */
const findMarker_v1 = (l: string, len: number): number => {
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

/* This is second, a lot cleaner, using sets */
const findMarker_v2 = (l: string, len: number): number => {
    for (let i = 0; i < l.length - len; i++) {
        const unique = new Set(l.slice(i, i+len));
        if (unique.size === len) return i + len;
    }
    return 0;
}



exports.solution = (input: string[]) => {
    const signal = input[0];

    console.log(findMarker_v2(signal, 4));
    console.log(findMarker_v2(signal, 14));
}