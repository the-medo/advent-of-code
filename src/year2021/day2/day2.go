package day2

import (
	"github.com/the-medo/go-advent-2021/utils"
	"strconv"
	"strings"
)

const (
	FORWARD = "forward"
	UP      = "up"
	DOWN    = "down"
)

func parseCommand(row string) (string, int) {
	commandValue := strings.Split(row, " ")
	command := commandValue[0]
	value, err := strconv.Atoi(commandValue[1])
	if err != nil {
		panic(err)
	}
	return command, value
}

func Solve(input string) {
	rows := utils.SplitRows(input)

	horizontalPosition, depth := 0, 0

	for _, row := range rows {
		command, value := parseCommand(row)
		switch command {
		case FORWARD:
			horizontalPosition += value
		case UP:
			depth -= value
		case DOWN:
			depth += value
		}
	}

	println("First part: ", horizontalPosition, depth, " => ", horizontalPosition*depth)

	horizontalPosition, depth, aim := 0, 0, 0

	for _, row := range rows {
		command, value := parseCommand(row)
		switch command {
		case FORWARD:
			horizontalPosition += value
			depth += aim * value
		case UP:
			aim -= value
		case DOWN:
			aim += value
		}
	}

	println("Second part: ", horizontalPosition, depth, aim, " => ", horizontalPosition*depth)
}
