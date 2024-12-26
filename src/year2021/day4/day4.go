package day4

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/utils"
	"strings"
)

func Solve(input string) {
	rows := utils.SplitByEmptyRow(input)

	numbersString, boardsString := utils.ArrayExtractOne(rows)
	numbers := utils.StringsToInts(strings.Split(numbersString, ","))

	boards := make([][][]int, len(boardsString))
	hitNumbers := make([][][]bool, len(boardsString))
	boardSum := make([]int, len(boardsString))
	boardScore := make([]int, len(boardsString))
	for i, boardString := range boardsString {
		boards[i], hitNumbers[i], boardSum[i] = prepareBoards(boardString)
		boardScore[i] = -1
	}

	firstScore := -1
	lastScore := -1

	for n, number := range numbers {
		fmt.Println("============ Running for number ", number, " ============ [", n, "]")
		for i, board := range boards {
			fmt.Print("--- Board ", i, " = ")
			hitResult := markHitNumber(number, &board, &hitNumbers[i], &boardSum[i])
			if boardScore[i] > -1 {
				fmt.Println("already finished! ", boardScore[i])
			} else {
				if hitResult {
					score := number * boardSum[i]
					if firstScore == -1 {
						firstScore = score
					}
					lastScore = score
					boardScore[i] = score
					fmt.Println("finish! ", number, " * ", boardSum[i], " = ", score)
				} else {
					fmt.Println("false")
				}
			}
		}
	}

	fmt.Println("First part: ", firstScore)
	fmt.Println("Second part: ", lastScore)
}

func prepareBoards(boardString string) ([][]int, [][]bool, int) {
	board, boardSum := utils.SplitToMatrix(boardString, true, true)

	emptyBoard := make([][]bool, len(board))
	for i := range emptyBoard {
		emptyBoard[i] = make([]bool, len(board[i]))
	}

	return board, emptyBoard, boardSum
}

func checkRowAndColumn(hitNumbers *[][]bool, row int, column int) bool {
	rowNumbers := (*hitNumbers)[row]

	allCells := true
	for _, cell := range rowNumbers {
		if !cell {
			allCells = false
			break
		}
	}

	if allCells {
		return true
	}

	for _, row := range *hitNumbers {
		if !row[column] {
			return false
		}
	}

	return true
}

func markHitNumber(hit int, board *[][]int, hitNumbers *[][]bool, boardSum *int) bool {
	for i, row := range *board {
		for j, cell := range row {
			if cell == hit {
				(*hitNumbers)[i][j] = true
				*boardSum -= hit
				return checkRowAndColumn(hitNumbers, i, j)
			}
		}
	}

	return false
}
