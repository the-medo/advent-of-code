package utils

import (
	"strconv"
	"strings"
)

func JoinIntsToString(numbers []int, separator string) string {
	strNumbers := make([]string, len(numbers))
	for i, num := range numbers {
		strNumbers[i] = strconv.Itoa(num)
	}

	return strings.Join(strNumbers, separator)
}
