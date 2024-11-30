type HandShape = 'paper' | 'rock' | 'scissors';
type Outcome = 'win' | 'draw' | 'lose';
type TheirMove = 'A' | 'B' | 'C';
type YourMove = 'X' | 'Y' | 'Z';
type Move = TheirMove | YourMove;

const MoveToHandShape: Record<Move, HandShape> = {
    A: 'rock',
    B: 'paper',
    C: 'scissors',
    X: 'rock',
    Y: 'paper',
    Z: 'scissors',
}

const YourMoveToOutcome: Record<YourMove, Outcome> = {
    X: "lose",
    Y: "draw",
    Z: "win"
}

const OutcomeMatrix: Record<HandShape, Record<HandShape, Outcome>> = {
    rock: {
        rock: "draw",
        paper: "win",
        scissors: "lose"
    },
    paper: {
        rock: "lose",
        paper: "draw",
        scissors: "win"
    },
    scissors: {
        rock: "win",
        paper: "lose",
        scissors: "draw"
    },
}

const PointsForHandShape: Record<HandShape, number> = {
    rock: 1,
    paper: 2,
    scissors: 3,
}

const PointsForOutcome: Record<Outcome, number> = {
    lose: 0,
    draw: 3,
    win: 6,
}

interface GameInputs  {
    theirMove: TheirMove;
    yourMove: YourMove;
}

interface GameRound  {
    theirMove: HandShape;
    yourMove: HandShape;
    points: number;
    outcome: Outcome;
}

const parseGameInputsForPartOne = (gi: GameInputs): Pick<GameRound, 'theirMove' | 'yourMove'> => ({
    theirMove: MoveToHandShape[gi.theirMove],
    yourMove: MoveToHandShape[gi.yourMove],
})

const evaluateRoundsForPartOne = (i: GameInputs ): GameRound => {
    const round = parseGameInputsForPartOne(i);
    let outcome: Outcome = OutcomeMatrix[round.theirMove][round.yourMove];

    return {
        ...round,
        outcome,
        points: PointsForHandShape[round.yourMove] + PointsForOutcome[outcome],
    };
}

const parseGameInputsForPartTwo = (gi: GameInputs): Pick<GameRound, 'theirMove' | 'outcome'> => ({
    theirMove: MoveToHandShape[gi.theirMove],
    outcome: YourMoveToOutcome[gi.yourMove],
});

const evaluateRoundsForPartTwo = (i: GameInputs ): GameRound => {
    const round = parseGameInputsForPartTwo(i);
    const yourMove = (Object.keys(OutcomeMatrix[round.theirMove]) as Array<HandShape>).find(yourMove => OutcomeMatrix[round.theirMove][yourMove] === round.outcome);

    if (yourMove) {
        return {
            ...round,
            yourMove,
            points: PointsForHandShape[yourMove] + PointsForOutcome[round.outcome],
        };
    }

    throw Error("Your move not found.");
}

const parseStrategyGuideInput = (input: string[]): GameInputs[] => {
    const rounds: GameInputs[] = [];

    input.forEach(line => {
        const round: string[] = line.split(" ");

        if (round.length === 2 && round[0].length === 1 && round[1].length === 1) {
            rounds.push({
                theirMove: round[0] as TheirMove,
                yourMove: round[1] as YourMove,
            });
        } else {
            throw Error("Input row doesn't have exactly two moves!")
        }
    });

    return rounds;
}

const sumPointsFromGameRounds = (gameRounds: GameRound[]): number => gameRounds.reduce((sum, round) => sum + round.points, 0);

exports.solution = (input: string[]) => {
    const gameInputs = parseStrategyGuideInput(input);

    const gameRoundsPartOne = gameInputs.map(i => evaluateRoundsForPartOne(i));
    const gameRoundsPartTwo = gameInputs.map(i => evaluateRoundsForPartTwo(i));

    console.log(sumPointsFromGameRounds(gameRoundsPartOne));
    console.log(sumPointsFromGameRounds(gameRoundsPartTwo));
}