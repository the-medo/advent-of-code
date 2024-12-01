exports.solution = (input: string[]) => {
    let list1: number[] = [];
    let list2: number[] = [];

    const nMap = {};
    input.forEach(i => {
        const numbers = i.split('   ');
        list1.push(parseInt(numbers[0]));
        list2.push(parseInt(numbers[1]));

    });
    list1.sort((a,b) => a-b)
    list2.sort((a,b) => a-b)

    let diff=0
    list1.forEach((n, i) => {
        diff += Math.abs(n-list2[i]);
    })

    console.log(diff);
}