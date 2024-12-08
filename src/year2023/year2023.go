package year2023

import (
	"fmt"
	"time"

	"github.com/the-medo/advent-of-code/src/go/utils"
	"github.com/the-medo/advent-of-code/src/year2023/day1"
	"github.com/the-medo/advent-of-code/src/year2023/day10"
	"github.com/the-medo/advent-of-code/src/year2023/day11"
	"github.com/the-medo/advent-of-code/src/year2023/day12"
	"github.com/the-medo/advent-of-code/src/year2023/day13"
	"github.com/the-medo/advent-of-code/src/year2023/day14"
	"github.com/the-medo/advent-of-code/src/year2023/day15"
	"github.com/the-medo/advent-of-code/src/year2023/day16"
	"github.com/the-medo/advent-of-code/src/year2023/day17"
	"github.com/the-medo/advent-of-code/src/year2023/day18"
	"github.com/the-medo/advent-of-code/src/year2023/day19"
	"github.com/the-medo/advent-of-code/src/year2023/day2"
	"github.com/the-medo/advent-of-code/src/year2023/day20"
	"github.com/the-medo/advent-of-code/src/year2023/day21"
	"github.com/the-medo/advent-of-code/src/year2023/day22"
	"github.com/the-medo/advent-of-code/src/year2023/day23"
	"github.com/the-medo/advent-of-code/src/year2023/day24"
	"github.com/the-medo/advent-of-code/src/year2023/day25"
	"github.com/the-medo/advent-of-code/src/year2023/day3"
	"github.com/the-medo/advent-of-code/src/year2023/day4"
	"github.com/the-medo/advent-of-code/src/year2023/day5"
	"github.com/the-medo/advent-of-code/src/year2023/day6"
	"github.com/the-medo/advent-of-code/src/year2023/day7"
	"github.com/the-medo/advent-of-code/src/year2023/day8"
	"github.com/the-medo/advent-of-code/src/year2023/day9"
	"path"
)

func Solve(day int, real bool) {
	fileName := fmt.Sprintf("%s-%d.txt", getInputType(real), day)
	filePath := path.Join("src", "year2023", fmt.Sprintf("day%d", day), fileName)

	inputData := utils.ReadFile(filePath)

	fmt.Printf("======= Running Day %d =========", day)
	fmt.Println()
	start := time.Now()

	switch day {
	case 1:
		day1.Solve(inputData)
	case 2:
		day2.Solve(inputData)
	case 3:
		day3.Solve(inputData)
	case 4:
		day4.Solve(inputData)
	case 5:
		day5.Solve(inputData)
	case 6:
		day6.Solve(inputData)
	case 7:
		day7.Solve(inputData)
	case 8:
		day8.Solve(inputData)
	case 9:
		day9.Solve(inputData)
	case 10:
		day10.Solve(inputData)
	case 11:
		day11.Solve(inputData)
	case 12:
		day12.Solve(inputData)
	case 13:
		day13.Solve(inputData)
	case 14:
		day14.Solve(inputData)
	case 15:
		day15.Solve(inputData)
	case 16:
		day16.Solve(inputData)
	case 17:
		day17.Solve(inputData)
	case 18:
		day18.Solve(inputData)
	case 19:
		day19.Solve(inputData)
	case 20:
		day20.Solve(inputData)
	case 21:
		day21.Solve(inputData)
	case 22:
		day22.Solve(inputData)
	case 23:
		day23.Solve(inputData)
	case 24:
		day24.Solve(inputData)
	case 25:
		day25.Solve(inputData)
	}
	duration := time.Since(start)
	fmt.Println("Execution Time: ", duration)
}

func getInputType(isReal bool) string {
	if isReal {
		return "input"
	}
	return "test"
}
