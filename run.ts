import getInput from "./src/utils/getInput";

if (process.argv[2] !== undefined) {
    const solutionId: number = parseInt(process.argv[2]);
    require(`./src/day-${solutionId}/solution-${solutionId}.ts`).solution(getInput(solutionId));
} else {
    throw Error("Please insert Day as first parameter");
}



