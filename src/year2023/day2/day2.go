package day2

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
	"strconv"
	"strings"
)

type ColorCounter = map[string]int

type GameRound = ColorCounter

type Game struct {
	id       int
	possible bool
	round    []GameRound
	minimums ColorCounter
}

func Solve(input string) {
	rows := utils.SplitRows(input)

	games := make([]Game, len(rows))

	for i, row := range rows {
		rowSplit := strings.Split(row, ": ")
		roundsSplit := strings.Split(rowSplit[1], "; ")

		games[i] = Game{
			id:       i + 1,
			possible: true,
			round:    make([]GameRound, len(roundsSplit)),
			minimums: ColorCounter{
				"red":   0,
				"green": 0,
				"blue":  0,
			},
		}

		maximumCounter := ColorCounter{
			"red":   12,
			"green": 13,
			"blue":  14,
		}

		for roundI, roundSplit := range roundsSplit {
			cubeSplit := strings.Split(roundSplit, ", ")
			gameRound := GameRound{}
			for _, cube := range cubeSplit {
				cubeParts := strings.Split(cube, " ")
				cubeColor := cubeParts[1]
				cubeCount, err := strconv.Atoi(cubeParts[0])
				if err != nil {
					fmt.Printf("Error in conversion: %v", err)
				}
				//================== part 1 =================
				gameRound[cubeColor] += cubeCount
				if cubeCount > maximumCounter[cubeColor] {
					games[i].possible = false
				}
				//================== part 2 =================
				if cubeCount > games[i].minimums[cubeColor] {
					games[i].minimums[cubeColor] = cubeCount
				}
			}
			games[i].round[roundI] = gameRound
		}
	}

	//================== part 1 =================
	part1 := 0
	for _, game := range games {
		if game.possible {
			part1 += game.id
		}
	}
	println("Part1: ", part1)

	//================== part 2 =================
	part2 := 0
	for _, game := range games {
		part2 += game.minimums["blue"] * game.minimums["green"] * game.minimums["red"]
	}
	println("Part2: ", part2)
}
