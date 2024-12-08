package utils

import (
	"strconv"
)

func BinaryToDecimal(binaryNumber string) int64 {
	decimal, err := strconv.ParseInt(binaryNumber, 2, 64)
	if err != nil {
		panic(err)
	}

	return decimal
}
