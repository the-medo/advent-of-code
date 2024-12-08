package year2024

import (
	"fmt"
	"time"

	"github.com/the-medo/advent-of-code/src/go/utils"
	"github.com/the-medo/advent-of-code/src/year2024/day7"
	"path"
)

func Solve(day int, real bool) {
	fileName := fmt.Sprintf("%s-%d.txt", getInputType(real), day)
	filePath := path.Join("src", "year2024", fmt.Sprintf("day%d", day), fileName)

	inputData := utils.ReadFile(filePath)

	fmt.Printf("======= Running Day %d =========", day)
	fmt.Println()
	start := time.Now()

	switch day {
	case 7:
		day7.Solve(inputData)
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
