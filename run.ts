import getInput from "./src/utils/getInput";
import {downloadInput} from "./di";

(async () => {
    let day = new Date().getDate();
    let year = new Date().getFullYear();
    let testing = false;

    if (process.argv[2] !== undefined) {
        if (process.argv[2] === 't') {
            testing = true;
        } else if (process.argv[2] === 'd') {
            await downloadInput(day, year);
        } else {
            day = parseInt(process.argv[2]);

            if (process.argv[3] !== undefined) {
                year = parseInt(process.argv[3]);

                if (process.argv[4] === "t") {
                    testing = true;
                } else if (process.argv[4] === 'd') {
                    await downloadInput(day, year);
                }
            }
        }
    }
    require(`./src/${year}/day-${day}/solution-${day}.ts`).solution(getInput(day, year, testing));
})();

