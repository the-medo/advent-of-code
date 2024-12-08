package utils

import (
	"strings"
)

// SplitByEmptyRow takes a string and returns a slice of strings, split by empty row.
func SplitByEmptyRow(s string) []string {
	s = strings.ReplaceAll(s, "\r\n", "\n") // Convert Windows line endings to Unix
	return strings.Split(strings.TrimSpace(s), "\n\n")
}
