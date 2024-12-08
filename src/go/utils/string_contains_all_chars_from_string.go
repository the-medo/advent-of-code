package utils

import "strings"

// StringContainsAllCharsFromString returns how much characters from needle are missing in haystack
func StringContainsAllCharsFromString(haystack string, needle string) int {
	missing := 0
	for _, char := range needle {
		if !strings.ContainsRune(haystack, char) {
			missing++
		}
	}
	return missing
}
