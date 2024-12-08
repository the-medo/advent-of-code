package utils

func ArrayExtractTwo[K comparable](arr []K) (K, K, []K) {
	return arr[0], arr[1], arr[2:]
}
