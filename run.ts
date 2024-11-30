import getInput from "./src/utils/getInput";

if (process.argv[2] !== undefined) {
    let year = new Date().getFullYear();
    if (process.argv[3] !== undefined) {
        year = parseInt(process.argv[3]);
    }

    const solutionId: number = parseInt(process.argv[2]);
    require(`./src/${year}/day-${solutionId}/solution-${solutionId}.ts`).solution(getInput(solutionId, year));
} else {
    throw Error("Please insert Day as first parameter");
}



