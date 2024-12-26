package day14

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/utils"
	"strings"
)

type RunePair struct {
	r1 rune
	r2 rune
}

type Counter map[RunePair]int
type InsertionRules map[RunePair][]RunePair
type RuneCounter map[rune]int

type StepState struct {
	step    int
	counter Counter
}

func (stepState *StepState) processStep(rules InsertionRules) *StepState {
	newCounter := make(Counter)

	for runePair, count := range stepState.counter {
		for _, insertedPair := range rules[runePair] {
			newCounter[insertedPair] += count
		}
	}

	return &StepState{
		step:    stepState.step + 1,
		counter: newCounter,
	}
}

func (stepState *StepState) countRunes(template []rune) (runeCounter RuneCounter, minRune rune, maxRune rune, minRuneCount int, maxRuneCount int) {

	runeCounter = make(RuneCounter)

	for runePair, count := range stepState.counter {
		runeCounter[runePair.r1] += count
		runeCounter[runePair.r2] += count
	}

	//because we have
	for r, _ := range runeCounter {
		runeCounter[r] = runeCounter[r] / 2
	}

	firstRune := template[0]
	lastRune := template[len(template)-1]

	runeCounter[lastRune]++
	if firstRune != lastRune {
		runeCounter[firstRune]++
	}

	minRune = firstRune
	maxRune = firstRune
	minRuneCount = runeCounter[firstRune]
	maxRuneCount = runeCounter[firstRune]

	for r, count := range runeCounter {
		if count < minRuneCount {
			minRune = r
			minRuneCount = count
		} else if count > maxRuneCount {
			maxRune = r
			maxRuneCount = count
		}
	}

	return
}

func Solve(input string) {
	sections := utils.SplitByEmptyRow(input)
	insertionRules := make(InsertionRules)

	template, insertionRuleStrings, stepCount := []rune(sections[0]), utils.SplitRows(sections[1]), 40

	for _, insertionRule := range insertionRuleStrings {
		split := strings.Split(insertionRule, " -> ")

		rune1 := rune(split[0][0])
		rune2 := rune(split[0][1])
		inserted := rune(split[1][0])

		mainRunePair := RunePair{r1: rune1, r2: rune2}
		inserted1 := RunePair{r1: rune1, r2: inserted}
		inserted2 := RunePair{r1: inserted, r2: rune2}

		if insertionRules[mainRunePair] == nil {
			insertionRules[mainRunePair] = []RunePair{inserted1, inserted2}
		}
	}

	baseCounter := make(Counter)

	var lastRune rune
	for _, thisRune := range template {
		if lastRune != 0 {
			baseCounter[RunePair{r1: lastRune, r2: thisRune}]++
		}
		lastRune = thisRune
	}

	fmt.Println("Template: ", template)
	fmt.Println("Map of insertions", insertionRules)

	baseStepState := &StepState{
		step:    0,
		counter: baseCounter,
	}

	states := make([]StepState, stepCount+1)

	states[1] = *baseStepState.processStep(insertionRules)
	for step := 2; step <= stepCount; step++ {
		states[step] = *states[step-1].processStep(insertionRules)

		_, _, _, minCount, maxCount := states[step].countRunes(template)

		if step == 10 {
			fmt.Println("Part 1: ", maxCount, " - ", minCount, " = ", maxCount-minCount)
		} else if step == 40 {
			fmt.Println("Part 2: ", maxCount, " - ", minCount, " = ", maxCount-minCount)
		} else {
			fmt.Println("Step ", step, ": ", maxCount, " - ", minCount, " = ", maxCount-minCount)
		}
	}
}
