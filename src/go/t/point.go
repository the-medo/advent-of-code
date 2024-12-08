package t

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
	"strconv"
	"strings"
)

type Point2D struct {
	X int
	Y int
}

func (p Point2D) ToString() string {
	return strconv.Itoa(p.X) + ";" + strconv.Itoa(p.Y)
}

func (p Point2D) SurroundingPoints(includeDiagonal bool, matrixWidth int, matrixHeight int) []Point2D {
	surroundingPoints := make([]Point2D, 0)

	if p.X > 0 {
		surroundingPoints = append(surroundingPoints, Point2D{X: p.X - 1, Y: p.Y})
		if p.Y > 0 && includeDiagonal {
			surroundingPoints = append(surroundingPoints, Point2D{X: p.X - 1, Y: p.Y - 1})
		}
		if p.Y < matrixHeight-1 && includeDiagonal {
			surroundingPoints = append(surroundingPoints, Point2D{X: p.X - 1, Y: p.Y + 1})
		}
	}
	if p.X < matrixWidth-1 {
		surroundingPoints = append(surroundingPoints, Point2D{X: p.X + 1, Y: p.Y})
		if p.Y > 0 && includeDiagonal {
			surroundingPoints = append(surroundingPoints, Point2D{X: p.X + 1, Y: p.Y - 1})
		}
		if p.Y < matrixHeight-1 && includeDiagonal {
			surroundingPoints = append(surroundingPoints, Point2D{X: p.X + 1, Y: p.Y + 1})
		}
	}
	if p.Y > 0 {
		surroundingPoints = append(surroundingPoints, Point2D{X: p.X, Y: p.Y - 1})
	}
	if p.Y < matrixHeight-1 {
		surroundingPoints = append(surroundingPoints, Point2D{X: p.X, Y: p.Y + 1})
	}
	return surroundingPoints
}

func StringToPoint2D(s string) Point2D {
	coords := utils.StringsToInts(strings.Split(s, ";"))
	return Point2D{X: coords[0], Y: coords[1]}
}

func DisplayMapOfPoints(pointMap *map[string]bool, width int, height int) {
	displayPoint := &Point2D{
		X: 0,
		Y: 0,
	}

	for y := 0; y < height; y++ {
		displayPoint.Y = y
		for x := 0; x < width; x++ {
			displayPoint.X = x
			char := "."
			if (*pointMap)[displayPoint.ToString()] {
				char = "#"
			}

			fmt.Print(char)
		}
		fmt.Println()
	}
}

func LoadPoints(input []string) ([]*Point2D, map[string]bool, int, int) {
	points := make([]*Point2D, len(input))
	pointMap := make(map[string]bool, len(input))
	maxX, maxY := 0, 0

	for i, pointString := range input {
		splitPoint := utils.StringsToInts(strings.Split(pointString, ","))
		x, y := splitPoint[0], splitPoint[1]

		if x > maxX {
			maxX = x
		}
		if y > maxY {
			maxY = y
		}

		points[i] = &Point2D{
			X: x,
			Y: y,
		}

		pointMap[points[i].ToString()] = true
	}

	return points, pointMap, maxX, maxY
}
