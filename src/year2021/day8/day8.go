package day8

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/utils"
	"sort"
	"strings"
)

/*
	First thing to do - identify easy cases 1, 4, 7, 8
		=> 1 - number with 2 segments
		=> 4 - number with 4 segments
		=> 7 - number with 3 segments
		=> 8 - number with 7 segments
	Second thing to do - identify numbers with 6 segments: 0, 6, 9
		=> 9 - contains all segments from 4
		=> 0 - contains all segments from 1 and 7 (after we exclude 9)
		=> 6 - last unidentified number from 6 segmented numbers
	Third thing to do - identify numbers with 5 segments: 2, 3, 5
		=> 3 - only one has both segments from 1
		=> 5 - is missing only one segment from 4
		=> 2 - last unidentified number from 5 segmented numbers
*/

type IdentifiedNumber = map[int]string
type IdentifiedString = map[string]int

type SegmentGroup struct {
	numbers string
	screen  string
}

type ParsedSegmentGroup struct {
	numbers []string
	screen  []string
}

func Solve(input string) {
	rows := utils.SplitRows(input)

	segmentGroups := make([]SegmentGroup, len(rows))

	for i, row := range rows {
		numbersAndScreen := strings.Split(row, " | ")
		segmentGroups[i] = SegmentGroup{
			numbers: numbersAndScreen[0],
			screen:  numbersAndScreen[1],
		}
	}

	part1, part2 := run(segmentGroups, []int{1, 4, 7, 8})
	fmt.Println("First part: ", part1)
	fmt.Println("Second part: ", part2)
}

func run(segmentGroups []SegmentGroup, numbersToCheck []int) (int, int) {
	countPart1 := 0
	sumPart2 := 0
	for _, segmentGroup := range segmentGroups {
		computedGroup := computeParsedGroup(parseSegmentGroup(segmentGroup))
		countPart1 += countOccurrences(computedGroup, numbersToCheck)
		sumPart2 += utils.SliceConcatInts(computedGroup)
	}
	return countPart1, sumPart2
}

func countOccurrences(screenNumbers []int, numbersToCheck []int) int {
	count := 0
	for _, number := range numbersToCheck {
		for _, screenNumber := range screenNumbers {
			if number == screenNumber {
				count++
			}
		}
	}
	return count
}

func computeParsedGroup(group ParsedSegmentGroup) []int {
	if len(group.numbers) != 10 {
		panic("Count of numbers is not 10")
	}

	sort.Slice(group.numbers, func(i, j int) bool {
		return len(group.numbers[i]) < len(group.numbers[j])
	})

	identifiedNumbers := IdentifiedNumber{}
	identifiedString := IdentifiedString{}

	numberOne := group.numbers[0]
	identifiedNumbers[1] = numberOne
	identifiedString[numberOne] = 1

	numberSeven := group.numbers[1]
	identifiedNumbers[7] = numberSeven
	identifiedString[numberSeven] = 7

	numberFour := group.numbers[2]
	identifiedNumbers[4] = numberFour
	identifiedString[numberFour] = 4

	numberEight := group.numbers[9]
	identifiedNumbers[8] = numberEight
	identifiedString[numberEight] = 8

	fiveSegments := make([]string, 3)
	fiveSegments[0] = group.numbers[3]
	fiveSegments[1] = group.numbers[4]
	fiveSegments[2] = group.numbers[5]

	sixSegments := make([]string, 3)
	sixSegments[0] = group.numbers[6]
	sixSegments[1] = group.numbers[7]
	sixSegments[2] = group.numbers[8]

	//identification of 9
	for i, segment := range sixSegments {
		if utils.StringContainsAllCharsFromString(segment, identifiedNumbers[4]) == 0 {
			identifiedNumbers[9] = segment
			identifiedString[segment] = 9
			utils.SliceRemoveIndex(sixSegments, i)
			break
		}
	}

	//identification of 0
	for i, segment := range sixSegments {
		if utils.StringContainsAllCharsFromString(segment, identifiedNumbers[1]) == 0 {
			identifiedNumbers[0] = segment
			identifiedString[segment] = 0
			utils.SliceRemoveIndex(sixSegments, i)
			break
		}
	}

	//last one is number 6
	numberSix := sixSegments[0]
	identifiedNumbers[6] = numberSix
	identifiedString[numberSix] = 6

	//identification of 3
	for i, segment := range fiveSegments {
		if utils.StringContainsAllCharsFromString(segment, identifiedNumbers[1]) == 0 {
			identifiedNumbers[3] = segment
			identifiedString[segment] = 3
			utils.SliceRemoveIndex(fiveSegments, i)
			break
		}
	}

	//identification of 5
	for i, segment := range fiveSegments {
		if utils.StringContainsAllCharsFromString(segment, identifiedNumbers[4]) == 1 {
			identifiedNumbers[5] = segment
			identifiedString[segment] = 5
			utils.SliceRemoveIndex(fiveSegments, i)
			break
		}
	}

	//last one is number 2
	numberTwo := fiveSegments[0]
	identifiedNumbers[2] = numberTwo
	identifiedString[numberTwo] = 2

	result := make([]int, len(group.screen))
	for i, screen := range group.screen {
		result[i] = identifiedString[screen]
	}
	fmt.Println(identifiedNumbers, " => ", result)

	return result
}

func parseSegmentGroup(segmentGroup SegmentGroup) ParsedSegmentGroup {
	numbers, screen := strings.Fields(segmentGroup.numbers), strings.Fields(segmentGroup.screen)
	parsedGroup := ParsedSegmentGroup{
		numbers: make([]string, len(numbers)),
		screen:  make([]string, len(screen)),
	}

	for i, n := range numbers {
		parsedGroup.numbers[i] = utils.SortString(n)
	}
	for i, n := range screen {
		parsedGroup.screen[i] = utils.SortString(n)
	}

	return parsedGroup
}
