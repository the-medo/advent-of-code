package utils

func SliceConcatInts(numbers []int) int {
	result := 0

	for _, num := range numbers {
		result = result*10 + num
	}

	return result
}
