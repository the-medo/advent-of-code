package day15

import (
	"fmt"
	"strconv"
	"strings"
)

type BoxValue struct {
	label string
	value int
}

func Solve(input string) {
	inputs := strings.Split(input, ",")
	total := 0

	for _, s := range inputs {
		total += hashString(s)
	}

	fmt.Println("Part 1: ", total)

	boxMap := make(map[int][]BoxValue)

	for _, s := range inputs {
		if strings.Contains(s, "=") {
			splits := strings.Split(s, "=")
			label := splits[0]
			value, _ := strconv.Atoi(splits[1])
			boxId := hashString(label)
			boxVal := BoxValue{label: label, value: value}

			box, exists := boxMap[boxId]
			if exists {
				found := false
				for i, b := range box {
					if b.label == label {
						box[i].value = value
						found = true
						break
					}
				}
				if !found {
					boxMap[boxId] = append(box, boxVal)
				}
			} else {
				boxMap[boxId] = []BoxValue{boxVal}
			}

		} else if strings.Contains(s, "-") {
			splits := strings.Split(s, "-")
			label := splits[0]
			boxId := hashString(label)
			box, exists := boxMap[boxId]
			if exists {
				for i, b := range box {
					if b.label == label {
						boxMap[boxId] = append(boxMap[boxId][:i], boxMap[boxId][i+1:]...)
					}
				}
			}

		}
	}

	total = 0
	for k, v := range boxMap {
		for i, bv := range v {
			total += (k + 1) * bv.value * (i + 1)
		}
	}

	fmt.Println("Part 2: ", total)

}

func hashString(s string) int {
	currVal := 0
	for _, c := range s {
		currVal += int(c)
		currVal *= 17
		currVal = currVal % 256
	}

	return currVal
}
