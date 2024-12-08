package day5

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
	"math"
	"strconv"
	"strings"
)

type ReplaceRule struct {
	sourceStart int
	targetStart int
	rangeSize   int
}

type SeedReplacementRules = []ReplaceRule

type SeedWithRange struct {
	start  int
	length int
}

func Solve(input string) {

	// ======================= PARSE START ===================
	sections := utils.SplitByEmptyRow(input)
	seeds, _ := parseSeeds(strings.Split(sections[0], ": ")[1])

	seedMaps := make([]SeedReplacementRules, len(sections)-1)
	for i, section := range sections[1:] {
		seedMaps[i], _ = parseSeedMap(section)
	}
	// ======================= PARSE END ===================

	fmt.Println("Part 1: ", findMinimum(computeRanges(createSeedsWithRange(seeds, 1), seedMaps, 0)))
	fmt.Println("Part 2: ", findMinimum(computeRanges(createSeedsWithRange(seeds, 2), seedMaps, 0)))
}

// for the first part, we take all the seeds and give them range with length 1
// for the second part, every second number is set as the range
func createSeedsWithRange(seeds []int, part int) []SeedWithRange {
	seedsWithRange := make([]SeedWithRange, len(seeds)/part)
	if part != 1 && part != 2 {
		panic("Wrong part!")
	}

	for i, seed := range seeds {
		if part == 2 && i%2 == 1 {
			seedsWithRange[i/2].length = seed
		} else {
			seedsWithRange[i/part] = SeedWithRange{
				start:  seed,
				length: 1,
			}
		}
	}

	return seedsWithRange
}

func computeRanges(seedsWithRange []SeedWithRange, seedMaps []SeedReplacementRules, index int) []SeedWithRange {
	if index >= len(seedMaps) {
		return seedsWithRange
	}

	seedMap := seedMaps[index]
	newSeedRanges := make([]SeedWithRange, 0)

	for _, swr := range seedsWithRange {
		leftover := swr.length
		tmpValue := swr.start
		for leftover > 0 {
			found := false
			nearestRangeStart := math.MaxInt
			for _, x := range seedMap {
				if x.sourceStart > tmpValue && x.sourceStart < nearestRangeStart {
					nearestRangeStart = x.sourceStart
				}
				if x.sourceStart <= tmpValue && x.sourceStart+x.rangeSize > tmpValue {
					found = true
					diff := tmpValue - x.sourceStart
					diffTillEnd := x.rangeSize - diff
					newLength := leftover
					leftover -= diffTillEnd
					if leftover > 1 {
						newLength = diffTillEnd
						tmpValue = x.sourceStart + x.rangeSize
					}
					newValue := x.targetStart + diff
					newSeedRanges = append(newSeedRanges, SeedWithRange{
						start:  newValue,
						length: newLength,
					})
					break
				}
			}
			if !found {
				newSeedRanges = append(newSeedRanges, SeedWithRange{
					start:  tmpValue,
					length: leftover,
				})
				leftover = 0
				tmpValue += leftover
			}
		}
	}
	return computeRanges(newSeedRanges, seedMaps, index+1)
}

func findMinimum(seedsWithRange []SeedWithRange) int {
	lowest := math.MaxInt
	for _, seedWithRange := range seedsWithRange {
		if seedWithRange.start < lowest {
			lowest = seedWithRange.start
		}
	}
	return lowest
}

func parseSeeds(seedstring string) ([]int, error) {
	seedsSplit := strings.Split(seedstring, " ")
	seeds := []int{}

	for _, s := range seedsSplit {
		seed, err := strconv.Atoi(s)
		if err != nil {
			return nil, err
		}
		seeds = append(seeds, seed)
	}
	return seeds, nil
}

func parseMapRange(sectionRow string) (ReplaceRule, error) {
	rangeSplit := strings.Split(sectionRow, " ")
	oneStart, err := strconv.Atoi(rangeSplit[1])
	if err != nil {
		return ReplaceRule{}, err
	}
	twoStart, err := strconv.Atoi(rangeSplit[0])
	if err != nil {
		return ReplaceRule{}, err
	}
	rangeSize, err := strconv.Atoi(rangeSplit[2])
	if err != nil {
		return ReplaceRule{}, err
	}
	return ReplaceRule{
		sourceStart: oneStart,
		targetStart: twoStart,
		rangeSize:   rangeSize,
	}, nil
}

func parseSeedMap(section string) (SeedReplacementRules, error) {
	sectionRows := utils.SplitRows(section)
	seedMap := make(SeedReplacementRules, len(sectionRows)-1)
	for j, sectionRow := range sectionRows[1:] {
		seedRange, err := parseMapRange(sectionRow)
		if err != nil {
			return nil, err
		}
		seedMap[j] = seedRange
	}
	return seedMap, nil
}
