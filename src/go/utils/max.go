package utils

import "golang.org/x/exp/constraints"

func Max[T constraints.Ordered](slice []T) T {
	max := slice[0]
	for _, v := range slice {
		if v > max {
			max = v
		}
	}
	return max
}
