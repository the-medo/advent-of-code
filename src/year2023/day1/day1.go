package day1

import (
	"github.com/the-medo/advent-of-code/src/go/utils"
	"strings"
)

func Solve(input string) {
	rows := utils.SplitRows(input)

	println("Part1: ", computeSum(rows))

	//string digits for part 2 can overlap, so I added first and last characters of the "digit" around the replacements, because... i can
	//for example: "oneighthree" becomes o183e in the end
	mapping := map[string]string{
		"one":   "o1e",
		"two":   "t2o",
		"three": "t3e",
		"four":  "f4r",
		"five":  "f5e",
		"six":   "s6x",
		"seven": "s7n",
		"eight": "e8t",
		"nine":  "n9e",
	}

	for i, _ := range rows {
		for k, v := range mapping {
			rows[i] = strings.Replace(rows[i], k, v, -1)
		}
	}

	println("Part2: ", computeSum(rows))

}

func computeSum(rows []string) int32 {
	sum := int32(0)
	for _, row := range rows {
		firstDigit := int32(-1)
		lastDigit := int32(-1)
		for _, c := range row {
			//rune for "0" is 48, rune for "9" is 57, so by subtracting 48 we get digit 0-9
			if c >= 48 && c <= 57 {
				digit := c - 48
				if firstDigit == -1 {
					firstDigit = digit
				}
				lastDigit = digit
			}
		}
		if firstDigit != -1 {
			sum += (firstDigit * 10) + lastDigit
		}
	}

	return sum
}
