package utils

func BinaryReverse(binaryNumber string) string {
	reversed := make([]byte, len(binaryNumber))
	for i := 0; i < len(binaryNumber); i++ {
		reversed[i] = binaryNumber[len(binaryNumber)-i-1]
	}
	return string(reversed)
}
