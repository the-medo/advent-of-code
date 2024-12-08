package utils

func SliceContainsCount[T comparable](haystack []T, needle T) int {
	count := 0
	for _, value := range haystack {
		if value == needle {
			count++
		}
	}
	return count
}
