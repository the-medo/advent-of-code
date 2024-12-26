package day7

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/utils"
	"math"
	"sort"
	"strings"
)

func Solve(input string) {
	crabs := utils.StringsToInts(strings.Split(input, ","))
	sort.Ints(crabs)

	part1 := processPart(crabs, false)
	fmt.Println("First part: ", part1)

	part2 := processPart(crabs, true)
	fmt.Println("Second part: ", part2)
}

func processPart(crabs []int, incremental bool) int {
	medianPosition := int(math.Floor(utils.Median(crabs)))
	medianFuel := computeFuel(crabs, medianPosition, incremental)
	higherMedianFuel := computeFuel(crabs, medianPosition+1, incremental)
	minimumFuel := medianFuel

	increment, startStep, endStep := 1, medianPosition+2, crabs[len(crabs)-1]

	if medianFuel < higherMedianFuel {
		increment = -1
		startStep = medianPosition - 1
		endStep = crabs[0]
	} else {
		minimumFuel = higherMedianFuel
	}

	for position := startStep; position != endStep; position += increment {
		fuel := computeFuel(crabs, position, incremental)
		if fuel < minimumFuel {
			minimumFuel = fuel
		} else {
			break
		}
	}

	return minimumFuel
}

func computeFuel(crabs []int, position int, incremental bool) int {
	fuel := 0
	for _, crab := range crabs {
		diff := utils.AbsInt(crab - position)
		if incremental {
			fuel += utils.SumToX(diff)
		} else {
			fuel += diff
		}
	}
	return fuel
}
