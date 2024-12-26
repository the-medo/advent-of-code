package day6

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/utils"
	"strings"
)

func Solve(input string) {
	fish := utils.StringsToInts(strings.Split(input, ","))

	fishMap := make(map[int]int)

	for _, fish := range fish {
		fishMap[fish]++
	}

	totalCountPart1Days18 := countFish(18, fishMap)
	totalCountPart1Days80 := countFish(80, fishMap)

	totalCountPart2Days256 := countFish(256, fishMap)

	fmt.Println("First part - 18 days: ", totalCountPart1Days18)
	fmt.Println("First part - 80 days: ", totalCountPart1Days80)
	fmt.Println("Second part: ", totalCountPart2Days256)

}

func simulateDay(fishMap map[int]int, fishMapNext map[int]int) (map[int]int, map[int]int) {
	fmt.Println("Simulation: Current: ", fishMap, " Next: ", fishMapNext)

	for i, count := range fishMap {
		if i == 0 {
			fishMapNext[8] += count
			fishMapNext[6] += count
		} else {
			fishMapNext[i-1] += count
		}
	}

	for i := range fishMap {
		fishMap[i] = 0
	}

	return fishMapNext, fishMap
}

func countFish(dayCount int, fishMap map[int]int) int {
	fishMapCurrent := make(map[int]int, len(fishMap))
	for key, value := range fishMap {
		fishMapCurrent[key] = value
	}

	fishMapNext := make(map[int]int)
	for day := 0; day < dayCount; day++ {
		fishMapCurrent, fishMapNext = simulateDay(fishMapCurrent, fishMapNext)

	}

	totalCount := 0
	for _, count := range fishMapCurrent {
		totalCount += count
	}

	return totalCount
}
