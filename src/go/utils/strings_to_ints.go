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

func StringsToFloats(strs []string) []float64 {
	float64s := make([]float64, len(strs))

	for i, s := range strs {
		val, err := strconv.ParseFloat(strings.TrimSpace(s), 64)
		if err != nil {
			panic(err)
		}
		float64s[i] = val
	}

	return float64s
}
