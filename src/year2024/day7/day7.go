package day7

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
	"math"
	"strconv"
	"strings"
)

type D7Equation struct {
	result   float64
	operands []float64
}

func (e *D7Equation) finish(position int, result float64) bool {
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

func (e *D7Equation) solve(position int, resultTillNow float64, nextOperator string) bool {
	if position >= len(e.operands) {
		return false
	}
	switch nextOperator {
	case "+":
		return e.finish(position, resultTillNow+e.operands[position])
	case "*":
		return e.finish(position, resultTillNow*e.operands[position])
	case "||":
		// VERSION 4 = full float math.Log => cca 45ms
		newNumber := resultTillNow*math.Pow(10, math.Floor(math.Log10(e.operands[position])+1.0)) + e.operands[position]

		// VERSION 3 = small integer loop => cca 23ms
		//temp := e.operands[position]
		//for temp > 0 {
		//	resultTillNow *= 10
		//	temp /= 10
		//}
		//newNumber := resultTillNow + e.operands[position]

		// VERSION 2 = math.Log => cca 40ms
		//newNumber := int(float64(resultTillNow)*math.Pow10(int(math.Floor(math.Log10(float64(e.operands[position]))+1)))) + e.operands[position]

		// VERSION 1 = string concatenation => cca 200ms
		//newNumber, _ := strconv.Atoi(strconv.Itoa(resultTillNow) + fmt.Sprintf("%d", e.operands[position]))

		return e.finish(position, newNumber)
	}
	return false
}

func Solve(input string) {
	rows := utils.SplitRows(input)

	equations := make([]D7Equation, len(rows))
	for i, row := range rows {
		equationParts := strings.Split(row, ": ")
		equationResult, _ := strconv.ParseFloat(equationParts[0], 64)
		operands := utils.StringsToFloats(strings.Split(equationParts[1], " "))
		equations[i] = D7Equation{
			result:   equationResult,
			operands: operands,
		}
	}

	sum := float64(0)
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
