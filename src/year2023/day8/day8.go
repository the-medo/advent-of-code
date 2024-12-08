package day8

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
	"strings"
)

type Instruction struct {
	left  string
	right string
}

func Solve(input string) {
	sections := utils.SplitByEmptyRow(input)

	leftRights := sections[0]

	instructionRows := utils.SplitRows(sections[1])
	instructions := make(map[string]Instruction)

	for _, ins := range instructionRows {
		insSplit := strings.Split(ins, " = (")
		asdSplit := strings.Split(insSplit[1], ", ")
		instructions[insSplit[0]] = Instruction{
			left:  asdSplit[0],
			right: asdSplit[1][:3],
		}
	}

	i := 0
	currentIns := "AAA"
	for currentIns != "ZZZ" {
		if leftRights[i%len(leftRights)] == 'L' {
			currentIns = instructions[currentIns].left
		} else {
			currentIns = instructions[currentIns].right
		}
		i++
	}

	fmt.Println("Part 1: ", i)

	insPart2 := make([]string, 0)
	for k, _ := range instructions {
		if k[2] == 'A' {
			insPart2 = append(insPart2, k)
		}
	}

	correctPositions := make([]int, len(insPart2))
	for x, _ := range insPart2 {
		i = 0
		for insPart2[x][2] != 'Z' {
			if leftRights[i%len(leftRights)] == 'L' {
				insPart2[x] = instructions[insPart2[x]].left
			} else {
				insPart2[x] = instructions[insPart2[x]].right
			}
			i++
			correctPositions[x] = i
		}
	}

	result := 1
	for x, _ := range correctPositions {
		result = (result * correctPositions[x]) / gcd(result, correctPositions[x])
	}

	fmt.Println("Part 2: ", correctPositions, result)
}

func gcd(a int, b int) int {
	for b != 0 {
		a, b = b, a%b
	}
	return a
}
