package utils

func SliceRemoveIndex[T any](s []T, index int) []T {
	return append(s[:index], s[index+1:]...)
}
