package utils

import "sort"

func Median(numbers []int) float64 {
	sort.Ints(numbers)
	middle := len(numbers) / 2
	result := numbers[middle]
	if len(numbers)%2 == 0 {
		result = (result + numbers[middle-1]) / 2
	}
	return float64(result)
}
