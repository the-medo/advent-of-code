package day7

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
	"strconv"
	"strings"
)

type D7Equation struct {
	result   int
	operands []int
}

func (e *D7Equation) finish(position int, result int) bool {
	if result > e.result {
		return false
	}
	if position == len(e.operands)-1 {
		return result == e.result
	}
	return e.solve(position+1, result, "+") ||
		e.solve(position+1, result, "*") ||
		e.solve(position+1, result, "||")
}

func (e *D7Equation) solve(position int, resultTillNow int, nextOperator string) bool {
	if position >= len(e.operands) {
		return false
	}
	switch nextOperator {
	case "+":
		return e.finish(position, resultTillNow+e.operands[position])
	case "*":
		return e.finish(position, resultTillNow*e.operands[position])
	case "||":
		newNumber, _ := strconv.Atoi(strconv.Itoa(resultTillNow) + fmt.Sprintf("%d", e.operands[position]))
		return e.finish(position, newNumber)
	}
	return false
}

func Solve(input string) {
	rows := utils.SplitRows(input)

	equations := make([]D7Equation, len(rows))
	for i, row := range rows {
		equationParts := strings.Split(row, ": ")
		equationResult, _ := strconv.Atoi(equationParts[0])
		operands := utils.StringsToInts(strings.Split(equationParts[1], " "))
		equations[i] = D7Equation{
			result:   equationResult,
			operands: operands,
		}
	}

	sum := 0
	for i := range equations {
		eq := &equations[i]
		canBeSolved := eq.solve(1, eq.operands[0], "+") ||
			eq.solve(1, eq.operands[0], "*") ||
			eq.solve(1, eq.operands[0], "||")
		if canBeSolved {
			sum += eq.result
		}
	}

	fmt.Println("Part 2:", sum)
}
