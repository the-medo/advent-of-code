package utils

import (
	"strconv"
	"strings"
)

func StringsToInts(strs []string) []int {
	ints := make([]int, len(strs))

	for i, s := range strs {
		val, err := strconv.Atoi(strings.TrimSpace(s))
		if err != nil {
			panic(err)
		}
		ints[i] = val
	}

	return ints
}
