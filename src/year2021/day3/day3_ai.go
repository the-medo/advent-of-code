package day3

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/utils"
)

const (
	BitOne  = "1"
	BitZero = "0"
)

func SolveAi(input string) {
	fmt.Println("[running AI - improved solution]")
	rows := utils.SplitRows(input)

	prevalentBits := getPrevalentBitsFromStringRows(rows)

	gammaRateBinary := prevalentBitsToBinary(prevalentBits, false)
	epsilonRateBinary := utils.BinarySwap(gammaRateBinary)
	gammaRate := utils.BinaryToDecimal(gammaRateBinary)
	epsilonRate := utils.BinaryToDecimal(epsilonRateBinary)

	fmt.Println("First part: ", gammaRateBinary, epsilonRateBinary, gammaRate, epsilonRate, " => ", gammaRate*epsilonRate)

	oxygenGeneratorRatingArr := _filterRowsBasedOnPrevalentBits(rows, false)
	co2ScrubberRatingArr := _filterRowsBasedOnPrevalentBits(rows, true)

	oxygenGeneratorRating := utils.BinaryToDecimal(oxygenGeneratorRatingArr[0])
	co2ScrubberRating := utils.BinaryToDecimal(co2ScrubberRatingArr[0])

	fmt.Println("Second part: ", oxygenGeneratorRating*co2ScrubberRating)
}

func prevalentBitsToBinary(prevalentBits []int32, reversed bool) string {
	binaryArr := make([]byte, len(prevalentBits))
	for i, bitCount := range prevalentBits {
		binaryArr[i] = []byte(_intToBit(bitCount, reversed))[0]
	}
	return string(binaryArr)
}

func _intToBit(number int32, reversed bool) string {
	if number >= 0 {
		if reversed {
			return BitZero
		}
		return BitOne
	} else {
		if reversed {
			return BitOne
		}
		return BitZero
	}
}

func _filterRowsBasedOnPrevalentBits(rows []string, reversed bool) []string {
	for position := 0; position < len(rows[0]); position++ {
		prevalentBits := getPrevalentBitsFromStringRows(rows)
		targetBit := _intToBit(prevalentBits[position], reversed)

		var newRows []string
		for _, row := range rows {
			if string(row[position]) == targetBit {
				newRows = append(newRows, row)
			}
		}
		rows = newRows
		if len(rows) == 1 {
			break
		}
	}
	return rows
}
