package day9

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/t"
	"github.com/the-medo/go-advent-2021/utils"
	"sort"
)

/* input string:
2199943210
3987894921
9856789892
8767896789
9899965678
*/

type PointMap = map[string]int

func Solve(input string) {
	matrix, _ := utils.SplitToMatrix(input, false, false)
	lowPoints := make(PointMap)

	for row, matrixRow := range matrix {
		for col, cell := range matrixRow {
			checkLowPoint(matrix, col, row, cell, lowPoints)
		}
	}

	fmt.Println("First part: ", calculateRiskLevel(lowPoints))

	var basinSizes []int
	for pointKey, _ := range lowPoints {
		p := t.StringToPoint2D(pointKey)
		basinSizes = append(basinSizes, calculateBasin(matrix, p))
	}

	sort.Ints(basinSizes)

	lenBasin := len(basinSizes)
	result := basinSizes[lenBasin-1] * basinSizes[lenBasin-2] * basinSizes[lenBasin-3]

	fmt.Println("Second part: ", result)

}

func getPointsToCheck(matrix [][]int, col int, row int) []t.Point2D {
	var pointsToCheck []t.Point2D

	if col > 0 {
		pointsToCheck = append(pointsToCheck, t.Point2D{X: col - 1, Y: row})
	}
	if row > 0 {
		pointsToCheck = append(pointsToCheck, t.Point2D{X: col, Y: row - 1})
	}
	if col < len(matrix[row])-1 {
		pointsToCheck = append(pointsToCheck, t.Point2D{X: col + 1, Y: row})
	}
	if row < len(matrix)-1 {
		pointsToCheck = append(pointsToCheck, t.Point2D{X: col, Y: row + 1})
	}

	return pointsToCheck
}

func checkLowPoint(matrix [][]int, col int, row int, value int, lowPoints PointMap) {
	pointsToCheck := getPointsToCheck(matrix, col, row)

	isLowPoint := true
	for _, point := range pointsToCheck {
		if matrix[point.Y][point.X] <= value {
			isLowPoint = false
			break
		}
	}

	if isLowPoint {
		lowPoints[t.Point2D{X: col, Y: row}.ToString()] = value
	}
}

func calculateRiskLevel(lowPointMap PointMap) int {
	riskLevel := 0
	for _, value := range lowPointMap {
		riskLevel += value + 1
	}
	return riskLevel
}

func calculateBasin(matrix [][]int, point t.Point2D) int {
	pointsToCheck := []t.Point2D{point}
	alreadyChecked := make(PointMap)

	for len(pointsToCheck) > 0 {
		point := pointsToCheck[0]
		pointsToCheck = pointsToCheck[1:]

		if alreadyChecked[point.ToString()] == 1 {
			continue
		}

		var pointsToAppend []t.Point2D
		surroundingPoints := getPointsToCheck(matrix, point.X, point.Y)
		for _, p := range surroundingPoints {
			if matrix[p.Y][p.X] > matrix[point.Y][point.X] && matrix[p.Y][p.X] < 9 {
				pointsToAppend = append(pointsToAppend, p)
			}
		}

		pointsToCheck = append(pointsToCheck, pointsToAppend...)

		alreadyChecked[point.ToString()] = 1
	}

	return len(alreadyChecked)
}
