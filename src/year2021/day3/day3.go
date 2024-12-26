package day3

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/utils"
)

func Solve(input string) {
	rows := utils.SplitRows(input)

	prevalentBits := make([]int32, len(rows[0]))

	for _, row := range rows {
		for i, bit := range row {
			if bit == '1' {
				prevalentBits[i]++
			} else {
				prevalentBits[i]--
			}
		}
	}

	prevalentBinaryArr := make([]byte, len(rows[0]))
	for i, bit := range prevalentBits {
		if bit > 0 {
			prevalentBinaryArr[i] = '1'
		} else {
			prevalentBinaryArr[i] = '0'
		}
	}

	gammaRateBinary := string(prevalentBinaryArr)
	epsilonRateBinary := utils.BinarySwap(gammaRateBinary)
	gammaRate := utils.BinaryToDecimal(gammaRateBinary)
	epsilonRate := utils.BinaryToDecimal(epsilonRateBinary)

	fmt.Println("First part: ", gammaRateBinary, epsilonRateBinary, gammaRate, epsilonRate, " => ", gammaRate*epsilonRate)

	oxygenGeneratorRatingArr := filterRowsBasedOnPrevalentBits(rows, 0, false)
	co2ScrubberRatingArr := filterRowsBasedOnPrevalentBits(rows, 0, true)

	oxygenGeneratorRating := utils.BinaryToDecimal(oxygenGeneratorRatingArr[0])
	co2ScrubberRating := utils.BinaryToDecimal(co2ScrubberRatingArr[0])

	fmt.Println("Second part: ", oxygenGeneratorRating*co2ScrubberRating)

}

func getPrevalentBitsFromStringRows(rows []string) []int32 {
	prevalentBits := make([]int32, len(rows[0]))

	for _, row := range rows {
		for i, bit := range row {
			if bit == '1' {
				prevalentBits[i]++
			} else {
				prevalentBits[i]--
			}
		}
	}

	return prevalentBits
}

func filterRowsBasedOnPrevalentBits(rows []string, position int32, reversed bool) []string {
	//fmt.Println("==================")
	//fmt.Println("filterRowsBasedOnPrevalentBits", rows, position)
	if len(rows) == 1 {
		return rows
	}
	if position == int32(len(rows[0])) {
		return rows
	}

	prevalentBits := getPrevalentBitsFromStringRows(rows)

	bit := intToBit(prevalentBits[position], reversed)
	//keep only ones with prevalent bit
	var newRows []string
	rowCount := 0
	for _, row := range rows {
		if string(row[position]) == bit {
			newRows = append(newRows, row)
			rowCount++
		}
	}

	return filterRowsBasedOnPrevalentBits(newRows, position+1, reversed)
}

func intToBit(number int32, reversed bool) string {
	if number >= 0 {
		if reversed {
			return "0"
		}
		return "1"
	} else {
		if reversed {
			return "1"
		}
		return "0"
	}
}
