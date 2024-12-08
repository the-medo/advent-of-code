package day7

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
	"sort"
	"strconv"
	"strings"
)

type Hand struct {
	hand          string
	handStrength  int
	cardStrengths []int
}

type HandWithBid struct {
	handPart1 *Hand
	handPart2 *Hand
	bid       int
	strength  int
}

func Solve(input string) {
	handRows := utils.SplitRows(input)
	hands := make([]HandWithBid, len(handRows))
	for i, h := range handRows {
		hSplit := strings.Split(h, " ")
		bid, _ := strconv.Atoi(hSplit[1])

		hands[i] = HandWithBid{
			handPart1: getHandStruct(hSplit[0], 1),
			handPart2: getHandStruct(hSplit[0], 2),
			bid:       bid,
		}
	}

	// ============ part 1
	sort.Slice(hands, func(i, j int) bool {
		return compareHandStrength(*hands[i].handPart1, *hands[j].handPart1) > 0
	})

	part1 := 0
	for i, j := range hands {
		part1 += j.bid * (len(hands) - i)
		fmt.Println(j, j.handPart1)
	}
	fmt.Println("Part 1: ", part1)

	// ============ part 2
	sort.Slice(hands, func(i, j int) bool {
		return compareHandStrength(*hands[i].handPart2, *hands[j].handPart2) > 0
	})

	part2 := 0
	for i, j := range hands {
		part2 += j.bid * (len(hands) - i)
		fmt.Println(j, j.handPart2)
	}
	fmt.Println("Part 2: ", part2)
}

func getHandStruct(handString string, part int) *Hand {
	handStrengths := map[string]int{
		"FiveOfAKind":  7,
		"FourOfAKind":  6,
		"FullHouse":    5,
		"ThreeOfAKind": 4,
		"TwoPairs":     3,
		"OnePair":      2,
		"HighCard":     1,
	}

	cards := make([]int, 5)
	availableCards := make(map[rune]int)
	highestAvailableCount := 0

	for i, x := range handString {
		cards[i] = getCardStrength(x, part)
		_, exists := availableCards[x]
		if exists {
			availableCards[x]++
		} else {
			availableCards[x] = 1
		}
		if availableCards[x] > highestAvailableCount && cards[i] > 0 && x != 'J' {
			highestAvailableCount = availableCards[x]
		}
	}

	if part == 2 {
		jokerCount := availableCards['J']
		if jokerCount > 0 && jokerCount != 5 {
			delete(availableCards, 'J')
			for i, j := range availableCards {
				if j == highestAvailableCount {
					availableCards[i] += jokerCount
				}
			}
		}
	}

	result := "HighCard"
	if len(availableCards) == 1 {
		result = "FiveOfAKind"
	} else if len(availableCards) == 2 { // 4 o k, full house
		result = "FullHouse"
		for _, v := range availableCards {
			if v == 4 {
				result = "FourOfAKind"
			}
		}
	} else if len(availableCards) == 3 { // 3 o k, two pairs
		result = "TwoPairs"
		for _, v := range availableCards {
			if v == 3 {
				result = "ThreeOfAKind"
			}
		}

	} else if len(availableCards) == 4 {
		result = "OnePair"
	}

	fmt.Println("Hand string: ", handString, result, availableCards, len(availableCards))

	return &Hand{
		hand:          handString,
		handStrength:  handStrengths[result],
		cardStrengths: cards,
	}
}

func compareHandStrength(hand1 Hand, hand2 Hand) int {
	if hand1.handStrength == hand2.handStrength {

		for i, _ := range hand1.cardStrengths {
			diff := hand1.cardStrengths[i] - hand2.cardStrengths[i]
			if diff != 0 {
				return diff
			}
		}
	}
	return hand1.handStrength - hand2.handStrength
}

func getCardStrength(card rune, part int) int {

	cardStrengths := map[rune]int{
		'A': 14,
		'K': 13,
		'Q': 12,
		'J': 11,
		'T': 10,
		'9': 9,
		'8': 8,
		'7': 7,
		'6': 6,
		'5': 5,
		'4': 4,
		'3': 3,
		'2': 2,
	}

	if part == 2 {
		cardStrengths['J'] = 1
	}

	return cardStrengths[card]
}
