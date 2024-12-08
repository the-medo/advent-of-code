package day4

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
	"strconv"
	"strings"
)

type Card struct {
	winningNumbers []int
	myNumbers      []int
	overlapNumbers []int
	points         int
	matchingCount  int
	count          int
}

func Solve(input string) {
	cardsSplit := utils.SplitRows(input)
	cards := make([]*Card, len(cardsSplit))

	for i := range cardsSplit {
		cards[i] = &Card{
			count: 1,
		}
	}

	for i, card := range cardsSplit {
		cardSplit := strings.Split(card, ": ")
		winningAndMyNumbers := strings.Split(cardSplit[1], " | ")

		cards[i].winningNumbers = splitByTwo(winningAndMyNumbers[0])
		cards[i].myNumbers = splitByTwo(winningAndMyNumbers[1])
		Overlap(cards[i])

		for j := i + 1; j < cards[i].matchingCount+i+1 && j < len(cardsSplit); j++ {
			cards[j].count += cards[i].count
		}
	}

	cardSum := 0
	scratchcardCount := 0
	for _, card := range cards {
		cardSum += card.points
		scratchcardCount += card.count
		fmt.Println("Card", card)
	}

	fmt.Println("Part 1: ", cardSum)
	fmt.Println("Part 2: ", scratchcardCount)

}

func Overlap(card *Card) {
	for _, i1 := range card.winningNumbers {
		for _, i2 := range card.myNumbers {
			if i1 == i2 {
				card.overlapNumbers = append(card.overlapNumbers, i1)
				if card.points == 0 {
					card.points = 1
					card.matchingCount = 1
				} else {
					card.points *= 2
					card.matchingCount++
				}
			}
		}
	}
}

func splitByTwo(s string) (result []int) {
	substrings := strings.Split(s, " ")
	for _, x := range substrings {
		if x != "" {
			a, _ := strconv.Atoi(x)
			result = append(result, a)
		}
	}
	return
}
