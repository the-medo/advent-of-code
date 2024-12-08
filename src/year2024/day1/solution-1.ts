exports.solution = (input: string[]) => {
    let list1: number[] = [];
    let list2: number[] = [];

    const nMap: Record<number, number | undefined> = {};
    input.forEach(i => {
        const numbers = i.split('   ');
        list1.push(parseInt(numbers[0]));
        const rightNumber = parseInt(numbers[1]);
        list2.push(rightNumber);

        if (nMap[rightNumber] === undefined) {
            nMap[rightNumber] = 1;
        } else {
            nMap[rightNumber]!++;
        }
    });
    list1.sort((a,b) => a-b)
    list2.sort((a,b) => a-b)

    let diff=0
    let diff2=0
    list1.forEach((n, i) => {
        diff += Math.abs(n-list2[i]);
        diff2 += n * (nMap[n] ?? 0);
    })

    console.log(diff);
    console.log(diff2);
}