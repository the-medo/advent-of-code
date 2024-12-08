package day12

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
	"strings"
)

type Template struct {
	template    string
	arrangement []int
	length      int
}

type Key struct {
	pos, rc, rl int //pos = current position, rc = # range count, rl = current # range length
}

type CountMap = map[Key]int

func Solve(input string) {
	rows := utils.SplitRows(input)
	templates := make([]Template, len(rows))
	comboSum := 0

	for i, row := range rows {
		rowSplit := strings.Split(row, " ")
		templates[i] = Template{
			template:    rowSplit[0],
			arrangement: utils.StringsToInts(strings.Split(rowSplit[1], ",")),
			length:      len(rowSplit[0]),
		}
		mp := make(CountMap)
		value := compute(&Key{0, 0, 0}, templates[i].arrangement, templates[i].template, &mp, '.')
		//fmt.Println("Template: ", templates[i], value)

		comboSum += value
	}

	fmt.Println("Part 1:", comboSum)

	//part2
	comboSum = 0
	for i, _ := range templates {
		arrangements := templates[i].arrangement
		templates[i].template = templates[i].template + "?" + templates[i].template + "?" + templates[i].template + "?" + templates[i].template + "?" + templates[i].template
		templates[i].arrangement = make([]int, 0)
		for x := 0; x < 5; x++ {
			templates[i].arrangement = append(templates[i].arrangement, arrangements...)
		}
		mp := make(CountMap)
		value := compute(&Key{0, 0, 0}, templates[i].arrangement, templates[i].template, &mp, '.')
		//fmt.Println("Template: ", templates[i], value)

		comboSum += value
	}

	fmt.Println("Part 2:", comboSum)
}

func compute(key *Key, amounts []int, template string, cMap *CountMap, lastChar rune) int {
	val, exists := (*cMap)[*key]
	if exists {
		return val
	}

	if key.pos == len(template) {
		if key.rc != len(amounts) || !(key.rl == 0 || amounts[key.rc-1] == key.rl) {
			return 0
		}
		return 1
	}

	sum := 0
	char := template[key.pos]
	newPos := key.pos + 1

	if char == '#' || char == '?' {
		newCurrentRangeLength := key.rl + 1
		newRangeCount := key.rc
		if lastChar == '.' {
			newRangeCount++
		}

		sum += compute(&Key{
			pos: newPos,
			rc:  newRangeCount,
			rl:  newCurrentRangeLength,
		}, amounts, template, cMap, '#')
	}

	if (char == '.' || char == '?') && key.rl == 0 {
		sum += compute(&Key{
			pos: newPos,
			rc:  key.rc,
			rl:  0,
		}, amounts, template, cMap, '.')
	} else if (char == '.' || char == '?') && key.rl > 0 && key.rc <= len(amounts) && amounts[key.rc-1] == key.rl {
		sum += compute(&Key{
			pos: newPos,
			rc:  key.rc,
			rl:  0,
		}, amounts, template, cMap, '.')
	}

	(*cMap)[*key] = sum

	return sum
}
