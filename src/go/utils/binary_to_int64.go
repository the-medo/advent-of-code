package utils

import (
	"strconv"
)

func BinaryToInt64(binaryNumber string) int64 {
	number, err := strconv.ParseInt(binaryNumber, 2, 64)
	if err != nil {
		panic(err)
	}

	return number
}
