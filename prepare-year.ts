import * as fs from 'fs';

if (process.argv[2] !== undefined) {
    const year = parseInt(process.argv[2]);
    if (year < 2015 || year > 2100 ) {
        console.error('Invalid year input');
        throw new Error('Invalid year input');
    }

    fs.mkdir(`src/year${year}`, (err) => {
        if (err) {
            if (err.code === "EEXIST") {
                return console.error("Folder for this year already exists. Aborting.");
            } else {
                return console.error(err);
            }
        }
        for (let i = 1; i <= 25; i++) {
            const dayDir = `src/year${year}/day${i}`
            fs.mkdir(dayDir, (err) => {
                if (!err) {
                    fs.writeFile(`${dayDir}/solution-${i}.ts`, `exports.solution = (input: string[]) => {
    const t0 = performance.now();
    
    console.log("TODO: solution");
    
    const t1 = performance.now();
    console.log(\`Execution time: \${t1 - t0} milliseconds.\`);
}`, err => {
                        if (err) return console.error(err);
                    });
                    fs.writeFile(`${dayDir}/input-${i}.txt`, ``, err => {
                        if (err) return console.error(err);
                    });
                    fs.writeFile(`${dayDir}/test-${i}.txt`, ``, err => {
                        if (err) return console.error(err);
                    });
                }
            })
        }
    } )

} else {
    console.error("Provide year as first argument.");
}