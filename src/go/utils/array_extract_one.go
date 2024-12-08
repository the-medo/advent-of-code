package utils

func ArrayExtractOne[K comparable](arr []K) (K, []K) {
	return arr[0], arr[1:]
}
