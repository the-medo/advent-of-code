package day15

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/t"
	"github.com/the-medo/go-advent-2021/utils"
	"math"
)

type RiskFactorMap map[string]int

type QueueTask struct {
	point         t.Point2D
	riskFactor    int
	riskFactorMap RiskFactorMap
}

func Solve(input string) {
	matrix, _ := utils.SplitToMatrix(input, false, false)
	ProcessPart(&matrix, 1)

	gridMultiplier := 5
	baseRowCount := len(matrix)
	baseColCount := len(matrix[0])
	part2RowCount := baseRowCount * gridMultiplier
	part2ColCount := baseColCount * gridMultiplier

	newMatrix := make([][]int, part2RowCount)
	for i, _ := range newMatrix {
		matrixRow := make([]int, part2ColCount)
		rowIncrement := i / baseRowCount
		baseRow := i % baseRowCount
		for j, _ := range matrixRow {
			colIncrement := j / baseColCount
			baseCol := j % baseColCount
			baseValue := matrix[baseRow][baseCol]
			newValue := baseValue + rowIncrement + colIncrement
			for newValue > 9 {
				newValue = newValue - 9
			}
			matrixRow[j] = newValue
		}
		newMatrix[i] = matrixRow
	}

	ProcessPart(&newMatrix, 2)
}

func ProcessPart(matrix *[][]int, part int) {
	rowCount := len(*matrix)
	colCount := len((*matrix)[0])

	startingPoint := t.Point2D{X: 0, Y: 0}
	endingPoint := t.Point2D{X: colCount - 1, Y: rowCount - 1}
	riskFactorMap := RiskFactorMap{}

	for Y, matrixRow := range *matrix {
		for X, _ := range matrixRow {
			riskFactorMap[t.Point2D{X: X, Y: Y}.ToString()] = math.MaxInt
		}
	}

	riskFactorMap[startingPoint.ToString()] = 0

	queue := []QueueTask{QueueTask{
		point:         startingPoint,
		riskFactor:    0,
		riskFactorMap: riskFactorMap,
	}}

	counter := 0
	for len(queue) > 0 {
		task := queue[0]
		queue = queue[1:]
		newTasks := ProcessTask(task, matrix, rowCount, colCount)
		queue = append(queue, newTasks...)
		counter++
	}

	fmt.Println("Part", part, "=", riskFactorMap[endingPoint.ToString()], "; counter = ", counter)
}

func ProcessTask(task QueueTask, matrix *[][]int, rowCount int, colCount int) []QueueTask {
	newTasks := make([]QueueTask, 0)
	riskFactorMap := task.riskFactorMap

	taskRiskFactor := task.riskFactor
	currentRiskFactor := riskFactorMap[task.point.ToString()]

	if currentRiskFactor < taskRiskFactor {
		/*   === we've already been here with lower risk factor! we don't really need to compute from this point again
		 === Before ===
		Part 1 = 458 ; counter =  1 747 242
		Part 2 = 2800 ; counter =  221 965 260

		 === After ===
		Part 1 = 458 ; counter =  55 316
		Part 2 = 2800 ; counter =  3 275 331
		*/
		return newTasks
	}

	neighbors := task.point.SurroundingPoints(false, colCount, rowCount)

	for _, n := range neighbors {
		nRiskValue := (*matrix)[n.Y][n.X]
		nLowestRiskValue := riskFactorMap[n.ToString()]

		newRiskValue := nRiskValue + taskRiskFactor
		if newRiskValue < nLowestRiskValue {
			riskFactorMap[n.ToString()] = newRiskValue
			queue := QueueTask{
				point:         n,
				riskFactor:    newRiskValue,
				riskFactorMap: riskFactorMap,
			}
			newTasks = append(newTasks, queue)
		}
	}

	return newTasks
}
