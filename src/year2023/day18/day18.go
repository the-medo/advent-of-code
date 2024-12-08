package day18

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
	"strconv"
	"strings"
)

const (
	DirUp    = 'U'
	DirDown  = 'D'
	DirRight = 'R'
	DirLeft  = 'L'
)

func Solve(input string) {
	inputRows := utils.SplitRows(input)

	points1 := [][]int{}
	points2 := [][]int{}

	x, y := 0, 0
	x2, y2 := 0, 0

	for _, row := range inputRows {
		splitRow := strings.Split(row, " ")
		dir := splitRow[0][0]
		value, _ := strconv.Atoi(splitRow[1])
		dir2 := splitRow[2][len(splitRow[2])-2]
		value2, _ := strconv.ParseUint(splitRow[2][2:len(splitRow[2])-2], 16, 32)

		if dir == DirLeft {
			x -= value
		} else if dir == DirRight {
			x += value
		} else if dir == DirUp {
			y -= value
		} else if dir == DirDown {
			y += value
		}

		if dir2 == '0' { //right
			x2 += int(value2)
		} else if dir2 == '1' { // down
			y2 += int(value2)
		} else if dir2 == '2' { // left
			x2 -= int(value2)
		} else if dir2 == '3' { // up
			y2 -= int(value2)
		}

		points1 = append(points1, []int{x, y})
		points2 = append(points2, []int{x2, y2})

	}

	fmt.Println("Part1: ", calculateArea(points1))
	fmt.Println("Part2: ", calculateArea(points2))
}

func calculateArea(points [][]int) int {
	area := 0
	perimeter := 0
	n := len(points)

	for i := 0; i < n; i++ {
		j := (i + 1) % n
		area += points[i][0] * points[j][1]
		area -= points[j][0] * points[i][1]
		perimeter += utils.AbsInt(points[i][0]-points[j][0]) + utils.AbsInt(points[i][1]-points[j][1])
	}

	return utils.AbsInt(area/2) + (perimeter / 2) + 1
}
