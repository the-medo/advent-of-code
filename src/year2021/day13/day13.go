package day13

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/t"
	"github.com/the-medo/go-advent-2021/utils"
	"strconv"
	"strings"
)

type FoldingInstructionType string

const (
	FoldLeft FoldingInstructionType = "x"
	FoldUp   FoldingInstructionType = "y"
)

type FoldingInstruction struct {
	direction FoldingInstructionType
	position  int
}

func Solve(input string) {
	sections := utils.SplitByEmptyRow(input)
	pointString, foldingInstructionString := sections[0], sections[1]

	pointRows := utils.SplitRows(pointString)
	foldingInstructionRows := utils.SplitRows(foldingInstructionString)

	points := make([]*t.Point2D, len(pointRows))
	pointMap := make(map[string]bool, len(pointRows))
	instructions := make([]FoldingInstruction, len(foldingInstructionRows))
	finalWidth, finalHeight := 0, 0

	points, pointMap, maxWidth, maxHeight := t.LoadPoints(pointRows)

	for i, foldingString := range foldingInstructionRows {
		instructionSplit := strings.Split(foldingString, "=")
		instruction := FoldingInstruction{}

		instruction.position, _ = strconv.Atoi(instructionSplit[1])

		lastChar := instructionSplit[0][len(instructionSplit[0])-1]

		switch lastChar {
		case 'x':
			instruction.direction = FoldLeft
			finalWidth = instruction.position
		case 'y':
			instruction.direction = FoldUp
			finalHeight = instruction.position
		}

		instructions[i] = instruction
	}

	//in case there is no fold on X or Y axis, we have to set it to max, otherwise it should be fine
	if finalWidth == 0 {
		finalWidth = maxWidth
	}

	if finalHeight == 0 {
		finalHeight = maxHeight
	}

	for i, instruction := range instructions {
		foldPaper(instruction, points, &pointMap)
		if i == 0 {
			fmt.Println("Part 1: ", len(pointMap))
		}
	}

	fmt.Println("Part 2 - final paper: ")
	t.DisplayMapOfPoints(&pointMap, finalWidth, finalHeight)
}

func foldPaper(instruction FoldingInstruction, points []*t.Point2D, pointMap *map[string]bool) {
	for i, point := range points {
		var value *int
		if instruction.direction == FoldUp {
			value = &point.Y
		} else if instruction.direction == FoldLeft {
			value = &point.X
		}

		if *value > instruction.position {
			delete(*pointMap, point.ToString())
			if (*pointMap)[point.ToString()] == true {
				utils.SliceRemoveIndex(points, i)
			} else {
				newValue := instruction.position - (*value - instruction.position)
				*value = newValue
				(*pointMap)[point.ToString()] = true
			}
		}
	}
}
