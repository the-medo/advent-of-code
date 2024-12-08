package day6

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
	"strconv"
	"strings"
)

type Race struct {
	time           int
	recordDistance int
	breakRecord    []int
}

func Solve(input string) {
	timeAndDistanceRows := utils.SplitRows(input)

	//=========== parsing for part 1
	races := make([]*Race, 0)
	times := parseRowPart1(timeAndDistanceRows[0])
	distances := parseRowPart1(timeAndDistanceRows[1])

	for i, t := range times {
		races = append(races, &Race{
			time:           t,
			recordDistance: distances[i],
		})
	}

	//=========== part 1 computations
	part1 := 1
	fmt.Print("Part 1: (1) ")
	for _, r := range races {
		computeRace(r)
		part1 *= len(r.breakRecord)
		fmt.Print(" * ", len(r.breakRecord))
	}
	fmt.Println(" = ", part1)

	//========== parsing and compute for part 2
	part2Race := &Race{
		time:           parseRowPart2(timeAndDistanceRows[0]),
		recordDistance: parseRowPart2(timeAndDistanceRows[1]),
	}

	computeRace(part2Race)
	fmt.Println("Part 2: ", len(part2Race.breakRecord))
}

func computeRace(r *Race) {
	for i := 1; i <= r.time; i++ {
		if i*(r.time-i) > r.recordDistance {
			r.breakRecord = append(r.breakRecord, i)
		}
	}
}

func parseRowPart1(s string) []int {
	rowSideSplit := strings.Split(s, ": ")
	values := strings.Split(rowSideSplit[1], " ")
	result := make([]int, 0)
	for _, j := range values {
		if j != "" {
			num, _ := strconv.Atoi(j)
			result = append(result, num)
		}
	}
	return result
}

func parseRowPart2(s string) int {
	rowSideSplit := strings.Split(s, ": ")
	oneBigNumber := strings.Replace(rowSideSplit[1], " ", "", -1)
	num, _ := strconv.Atoi(oneBigNumber)
	return num
}
