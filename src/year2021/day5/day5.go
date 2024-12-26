package day5

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/utils"
	"strconv"
	"strings"
)

type Point2D struct {
	x int
	y int
}

func (p Point2D) toString() string {
	return strconv.Itoa(p.x) + ";" + strconv.Itoa(p.y)
}

type Line2D struct {
	start Point2D
	end   Point2D
}

func (p Line2D) toString() string {
	return p.start.toString() + " -> " + p.end.toString()
}

func Solve(input string) {
	rows := utils.SplitRows(input)

	lines := make([]Line2D, len(rows))
	filledPointsPart1 := make(map[string]int)
	overlapCountPart1 := 0
	filledPointsPart2 := make(map[string]int)
	overlapCountPart2 := 0

	for i, row := range rows {
		linePoints := strings.Split(row, " -> ")
		startPoint := utils.StringsToInts(strings.Split(linePoints[0], ","))
		endPoint := utils.StringsToInts(strings.Split(linePoints[1], ","))
		lines[i] = Line2D{
			start: Point2D{
				x: startPoint[0],
				y: startPoint[1],
			},
			end: Point2D{
				x: endPoint[0],
				y: endPoint[1],
			},
		}

	}

	for _, line := range lines {
		processLine(&line, &filledPointsPart1, &overlapCountPart1, false)
	}
	fmt.Println("First part: ", overlapCountPart1)

	for _, line := range lines {
		processLine(&line, &filledPointsPart2, &overlapCountPart2, true)
	}
	fmt.Println("Second part: ", overlapCountPart2)
}

func getLinePoints(line *Line2D, diagonal bool) []Point2D {
	result := make([]Point2D, 0)

	startX := line.start.x
	endX := line.end.x
	startY := line.start.y
	endY := line.end.y

	fmt.Print(line)

	if startX != endX && startY != endY && !diagonal {
		fmt.Println(" is diagonal - we dont want it")
		return result
	}

	incrementX := 0
	incrementY := 0

	if startX > endX {
		incrementX = -1
	} else if startX < endX {
		incrementX = 1
	}

	if startY > endY {
		incrementY = -1
	} else if startY < endY {
		incrementY = 1
	}

	for x, y := startX, startY; x != endX+incrementX || y != endY+incrementY; x, y = x+incrementX, y+incrementY {
		fmt.Print(Point2D{
			x: x,
			y: y,
		})
		result = append(result, Point2D{
			x: x,
			y: y,
		})
	}
	fmt.Println()

	return result
}

func processLine(line *Line2D, filledPoints *map[string]int, overlapCount *int, diagonal bool) {
	points := getLinePoints(line, diagonal)

	for _, point := range points {
		(*filledPoints)[point.toString()]++
		if (*filledPoints)[point.toString()] == 2 {
			*overlapCount++
		}
	}

}
