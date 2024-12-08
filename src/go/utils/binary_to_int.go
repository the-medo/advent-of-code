package utils

import (
	"strconv"
)

func BinaryToInt(binaryNumber string) int {
	decimal, err := strconv.ParseInt(binaryNumber, 2, 32)
	if err != nil {
		panic(err)
	}

	return int(decimal)
}
