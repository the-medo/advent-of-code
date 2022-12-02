type HandShape = 'paper' | 'rock' | 'scissors';
type Outcome = 'win' | 'draw' | 'lose';
type Move = 'A' | 'B' | 'C' | 'X' | 'Y' | 'Z';

const MoveToHandShape: Record<Move, HandShape> = {
    A: 'rock',
    B: 'paper',
    C: 'scissors',
    X: 'rock',
    Y: 'paper',
    Z: 'scissors',
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

interface GameRound  {
    theirMove: HandShape;
    yourMove: HandShape;
    points: number;
    outcome?: Outcome;
}

const evaluateRound = (round: GameRound): GameRound => {
    if (round.theirMove === round.yourMove) {
        round.outcome = "draw";
    } else {
        switch (round.yourMove) {
            case "paper":
                round.outcome = round.theirMove === "scissors" ? "lose" : "win"  /* win in case of rock */;
                break;
            case "rock":
                round.outcome = round.theirMove === "paper" ? "lose" : "win"     /* win in case of scissors */;
                break;
            case "scissors":
                round.outcome = round.theirMove === "rock" ? "lose" : "win"  /* in case of paper */;
                break;
        }
    }

    if (round.outcome) {
        round.points = PointsForHandShape[round.yourMove] + PointsForOutcome[round.outcome];
    } else {
        throw Error("Undefined outcome should not happen! " + round.theirMove + " vs. " + round.yourMove);
    }
    return round;
}



const parseStrategyGuideInput = (input: string[]): GameRound[] => {
    const rounds: GameRound[] = [];

    input.forEach(line => {
        const round: string[] = line.split(" ");

        if (round.length === 2 && round[0].length === 1 && round[1].length === 1) {
            rounds.push(evaluateRound({
                theirMove: MoveToHandShape[round[0] as Move],
                yourMove: MoveToHandShape[round[1] as Move],
                points: 0,
            }));
        } else {
            throw Error("Input row doesn't have exactly two moves!")
        }
    });

    return rounds;
}

const partOne_d2 = (gameRounds: GameRound[]): number => gameRounds.reduce((sum, round) => sum + round.points, 0);

exports.solution = (input: string[]) => {
    const gameRounds = parseStrategyGuideInput(input);
    console.log(partOne_d2(gameRounds));
}