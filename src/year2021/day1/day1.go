package day1

import (
	"github.com/the-medo/go-advent-2021/utils"
)

func Solve(input string) {
	rows := utils.SplitRows(input)
	numbers := utils.StringsToInts(rows)

	// ============== Part 1
	increases := 0
	prevMeasurement := numbers[0]
	for _, n := range numbers {
		if n > prevMeasurement {
			increases++
		}
		prevMeasurement = n
	}

	println("First part: ", increases)

	// ============== Part  2

	increases = 0
	if len(numbers) > 2 {
		prevMeasurement = numbers[0] + numbers[1] + numbers[2]
		for i := 3; i < len(numbers); i++ {
			sum := numbers[i-2] + numbers[i-1] + numbers[i]
			if sum > prevMeasurement {
				increases++
			}
			prevMeasurement = sum
		}
	}

	println("Second part: ", increases)

}
