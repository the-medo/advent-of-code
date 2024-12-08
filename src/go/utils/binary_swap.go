package utils

func BinarySwap(binaryNumber string) string {
	swapped := make([]byte, len(binaryNumber))
	for i := 0; i < len(binaryNumber); i++ {
		if binaryNumber[i] == '0' {
			swapped[i] = '1'
		} else {
			swapped[i] = '0'
		}
	}
	return string(swapped)
}
