package day11

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/t"
	"github.com/the-medo/go-advent-2021/utils"
)

func Solve(input string) {
	matrix, _ := utils.SplitToMatrix(input, false, false)

	totalFlashCount := 0
	part1 := 0
	part2 := 0
	flashes := 0

	for i := 1; flashes < 100; i++ {
		flashes = processStep(matrix)
		totalFlashCount += flashes
		if i == 100 {
			part1 = totalFlashCount
		}
		if flashes == 100 {
			part2 = i
			break
		}
	}

	fmt.Println("First part: ", part1)
	fmt.Println("Second part: ", part2)

}

func processStep(matrix [][]int) int {
	var pointsToExplode []t.Point2D

	for row, matrixRow := range matrix {
		for col, _ := range matrixRow {
			matrix[row][col]++
			if matrix[row][col] == 10 {
				matrix[row][col] = 0
				pointsToExplode = append(pointsToExplode, t.Point2D{X: col, Y: row})
			}
		}
	}

	explodedPointCount := explodePoints(matrix, pointsToExplode)

	return explodedPointCount
}

func explodePoints(matrix [][]int, pointsToExplode []t.Point2D) (explodedPointCount int) {
	width, height := len(matrix[0]), len(matrix)

	explodedPoints := make(map[string]bool)

	for len(pointsToExplode) > 0 {
		point := pointsToExplode[0]
		pointsToExplode = pointsToExplode[1:]
		if explodedPoints[point.ToString()] {
			continue
		}
		explodedPoints[point.ToString()] = true
		surroundingPoints := point.SurroundingPoints(true, width, height)
		for _, surroundingPoint := range surroundingPoints {
			x, y := surroundingPoint.X, surroundingPoint.Y
			if matrix[y][x] > 0 {
				matrix[y][x]++
				if matrix[y][x] == 10 {
					matrix[y][x] = 0
					pointsToExplode = append(pointsToExplode, surroundingPoint)
				}
			}
		}
	}

	explodedPointCount = len(explodedPoints)
	return
}
