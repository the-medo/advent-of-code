package utils

import (
	"sort"
	"strings"
)

func SortString(s string) string {
	r := strings.Split(s, "")
	sort.Strings(r)
	return strings.Join(r, "")
}
