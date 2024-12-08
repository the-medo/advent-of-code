package utils

import (
	"strings"
)

// SplitRows takes a string and returns a slice of strings, each representing a line.
func SplitRows(s string) []string {
	s = strings.ReplaceAll(s, "\r\n", "\n") // Convert Windows line endings to Unix
	return strings.Split(strings.TrimSpace(s), "\n")
}
