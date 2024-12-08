package day14

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
	"math"
)

const ROUND = 'O'
const SQUARE = '#'
const EMPTY = '.'

type RockMap = [][]rune

func Solve(input string) {
	rows := utils.SplitRows(input)

	rockMap := make(RockMap, len(rows))
	for y, row := range rows {
		rockMap[y] = make([]rune, len(row))
		for x, c := range row {
			rockMap[y][x] = c
		}
	}
	rockMap2 := copyRockMap(rockMap)
	tiltMap(&rockMap, 0, -1)
	//printMap(&rockMap)
	fmt.Println("Part 1: ", computeTotalLoad(&rockMap))

	//printMap(&rockMap2)
	fmt.Println("Part 2: ", checkCycleMap(cycleMap(&rockMap2, 300)))

}

func checkCycleMap(cyclePoints []int) int {
	intMap := make(map[int][]int)
	for i := 0; i < len(cyclePoints); i++ {
		value := cyclePoints[i]
		_, exists := intMap[value]
		if !exists {
			intMap[value] = make([]int, 0, len(cyclePoints))
		}
		intMap[value] = append(intMap[value], i)
	}

	posDiffCounter := make(map[int]int)
	posDiffFirst := make(map[int]int)
	diffWithHighestCount := 0 //for example, 17 is the most-common difference between two positions of the value
	highestDiffCount := 0     //for example, diff 17 has 200 occurrences

	for _, positions := range intMap {
		if len(positions) > 1 {
			for i := 0; i < len(positions)-2; i++ {
				diff := positions[i+1] - positions[i]
				_, exists := posDiffCounter[diff]
				if !exists {
					posDiffCounter[diff] = 1
					posDiffFirst[diff] = math.MaxInt
				} else {
					posDiffCounter[diff]++
					if posDiffCounter[diff] > highestDiffCount {
						highestDiffCount = posDiffCounter[diff]
						diffWithHighestCount = diff
					}
					if posDiffFirst[diff] > positions[i] {
						posDiffFirst[diff] = positions[i]
					}
				}
			}
		}
	}

	cycleStart := posDiffFirst[diffWithHighestCount]

	result := cyclePoints[cycleStart+(1000000000-cycleStart)%diffWithHighestCount-1]
	return result
}

func cycleMap(rockMap *RockMap, count int) []int {
	result := make([]int, count)
	for i := 0; i < count; i++ {
		tiltMap(rockMap, 0, -1)
		tiltMap(rockMap, -1, 0)
		tiltMap(rockMap, 0, 1)
		tiltMap(rockMap, 1, 0)
		result[i] = computeTotalLoad(rockMap)
	}
	return result
}

func tiltMap(rockMap *RockMap, tiltX, tiltY int) {
	width := len((*rockMap)[0])
	height := len(*rockMap)

	startX, endX, incX := width-1, 0, -1
	startY, endY, incY := height-1, 0, -1

	if tiltX == -1 {
		startX, endX, incX = 0, width, 1
	}

	if tiltY == -1 {
		startY, endY, incY = 0, height, 1
	}

	for x := startX; cond(x, endX, incX); x += incX {
		for y := startY; cond(y, endY, incY); y += incY {
			c := (*rockMap)[y][x]
			if c == ROUND {
				moveSingleRock(rockMap, x, y, tiltX, tiltY)
			}
		}
	}
}

func cond(num, end, inc int) bool {
	if inc == 1 {
		return num < end
	}
	return num >= end
}

func moveSingleRock(rockMap *RockMap, x, y int, incX, incY int) {
	width := len((*rockMap)[0])
	height := len(*rockMap)
	if incY == -1 && y > 0 {
		for cY := y - 1; cY >= 0; cY-- {
			if (*rockMap)[cY][x] == EMPTY && (*rockMap)[cY+1][x] == ROUND {
				(*rockMap)[cY][x], (*rockMap)[cY+1][x] = (*rockMap)[cY+1][x], (*rockMap)[cY][x]
			}
		}
	} else if incX == -1 && x > 0 {
		for cX := x - 1; cX >= 0; cX-- {
			if (*rockMap)[y][cX] == EMPTY && (*rockMap)[y][cX+1] == ROUND {
				(*rockMap)[y][cX], (*rockMap)[y][cX+1] = (*rockMap)[y][cX+1], (*rockMap)[y][cX]
			}
		}
	} else if incX == 1 && x < width-1 {
		for cX := x + 1; cX < width; cX++ {
			if (*rockMap)[y][cX] == EMPTY && (*rockMap)[y][cX-1] == ROUND {
				(*rockMap)[y][cX], (*rockMap)[y][cX-1] = (*rockMap)[y][cX-1], (*rockMap)[y][cX]
			}
		}
	} else if incY == 1 && y < height-1 {
		for cY := y + 1; cY < height; cY++ {
			if (*rockMap)[cY][x] == EMPTY && (*rockMap)[cY-1][x] == ROUND {
				(*rockMap)[cY][x], (*rockMap)[cY-1][x] = (*rockMap)[cY-1][x], (*rockMap)[cY][x]
			}
		}
	}
}

func copyRockMap(rockMap RockMap) RockMap {
	rockMapCopy := make(RockMap, len(rockMap))
	for i, row := range rockMap {
		rockMapCopy[i] = make([]rune, len(row))
		copy(rockMapCopy[i], row)
	}
	return rockMapCopy
}

func computeTotalLoad(rockMap *RockMap) int {
	totalHeight := len(*rockMap)
	result := 0
	for y, row := range *rockMap {
		for _, c := range row {
			if c == ROUND {
				result += totalHeight - y
			}
		}
	}
	return result
}

func printMap(rockMap *RockMap) {
	for _, row := range *rockMap {
		for _, c := range row {
			fmt.Print(string(c))
		}
		fmt.Println()
	}
	fmt.Println("=======================")
}
