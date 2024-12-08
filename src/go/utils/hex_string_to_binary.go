package utils

// HexStringToBinary converts a string of hexadecimal characters to their own binary representation.
func HexStringToBinary(hexString string) (string, error) {

	result := ""

	for _, x := range hexString {
		runeInBinaryString, err := HexRuneToBinary(rune(x))
		if err != nil {
			return "", err
		}
		result = result + runeInBinaryString
	}

	return result, nil
}
