package utils

import (
	"fmt"
	"strconv"
)

// HexRuneToBinary converts a single hexadecimal character to its binary representation.
func HexRuneToBinary(hexChar rune) (string, error) {
	// Convert the hex character to an integer
	value, err := strconv.ParseInt(string(hexChar), 16, 64)
	if err != nil {
		return "", err
	}

	// Convert the integer to a binary string and return it
	// Using fmt.Sprintf with %04b to ensure 4 binary digits are always returned
	return fmt.Sprintf("%04b", value), nil
}
