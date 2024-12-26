package day10

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/utils"
	"sort"
)

var pointMapPart1 = map[rune]int{
	')': 3,
	']': 57,
	'}': 1197,
	'>': 25137,
}

var pointMapPart2 = map[rune]int{
	')': 1,
	']': 2,
	'}': 3,
	'>': 4,
}

var expectingMap = map[rune]rune{
	'(': ')',
	'[': ']',
	'{': '}',
	'<': '>',
}

func Solve(input string) {
	rows := utils.SplitRows(input)

	scorePart1 := 0
	var scoresPart2 []int
	for _, row := range rows {
		corruptedScore, completedScore := processRow(row)
		scorePart1 += corruptedScore
		if completedScore > 0 {
			scoresPart2 = append(scoresPart2, completedScore)
		}
	}

	sort.Ints(scoresPart2)

	fmt.Println("First part: ", scorePart1)
	fmt.Println("Second part: ", scoresPart2[(len(scoresPart2)/2)])
}

// processRow - first, checks if it is opening part - if so, adds it to expecting slice
// if it is closing part, checks if it is expected - if so, removes it from expecting slice
// if it is not expected, returns corrupted score
func processRow(row string) (int, int) {
	chars := []rune(row)
	var expecting []rune

	for _, char := range chars {
		if expectingMap[char] > 0 {
			expecting = append(expecting, expectingMap[char])
		} else {
			if expecting[len(expecting)-1] == char {
				expecting = expecting[:len(expecting)-1]
			} else {
				return pointMapPart1[char], 0
			}
		}
	}

	return 0, completeRowAndGetScore(expecting)
}

// completeRowAndGetScore - takes expecting slice and returns score
// because it starts from left to right, it needs to be reversed
func completeRowAndGetScore(expectingToComplete []rune) int {
	utils.SliceReverse(expectingToComplete)

	score := 0
	for _, char := range expectingToComplete {
		score = (score * 5) + pointMapPart2[char]
	}

	return score
}
