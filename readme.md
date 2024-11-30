# Advent of code
https://adventofcode.com/

1. Install packages (+global node installation needed as well):
`yarn install`
2. (optional - only if you want to use input autodownload feature) prepare .env file in the root directory 

_note: session cookie below is not valid_
 
```
SESSION_COOKIE="session=5fc1aasegasd8a8a549a46757e46a333db6fe9428ec7f5b85casd880deee8f60ddfd3467a939d5c44287f6f0a41b60d0aafd09e0061c703053616c7465g45f5"
```
To get your session, you need to be logged in on adventofcode page, then go to Devtools (F12) => Application tab => Cookies, and copy the "session" field.
You also need to include "session=" in the env variable.
 

## Prepare file structure for a year
`ts-node prepare-year 2024`
Creates full folder structure:
- /src/2024/
- folder for every day (day-1 to day-25)
- 3 files inside of every folder
  - input-X.txt (for real input data)
  - test-X.txt (for testing purposes, small data provided in assignments)
  - solution-1.ts with short mockup
```ts
exports.solution = (input: string[]) => {
    console.log("TODO: solution");
}
```


## Run
Multiple options how to run 
```ts
/* CURRENT DAY */
ts-node run //runs current day with real input (input-X.txt)
ts-node run t //runs current day with test input (test-X.txt)
ts-node run d //downloads real data for current day and runs solution on it (input-X.txt)

/* PAST DAYS */
ts-node run 1 //runs day 1 of current year
ts-node run 23 2022 //runs day 23 of year 2022 (real data)
ts-node run 23 2022 t //runs day 23 of year 2022 (test data)
ts-node run 23 2022 d //downloads real data for day 23 of year 2022 and runs solution on it (input-X.txt)
```

## My workflow
1. (optional) `ts-node run d` run at the start to download real data (input-X.txt)
2. (optional) fill current day test data if needed (test-X.txt) 
3. run tests till correct answer `ts-node run t`
4. run on real data `ts-node run`
5. submit and get a star!