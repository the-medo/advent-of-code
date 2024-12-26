Your solution is clear and you've modularized the logic into separate functions, which is great. Here are some suggestions to further improve the code:

1. **Avoid Magic Numbers**: Instead of using magic numbers like `0` and `1` for bits, you can define them as constants. This makes the code more readable and less error-prone.

2. **Simplify `intToBit` Function**: The `intToBit` function can be simplified using a ternary-like approach.

3. **Use Descriptive Variable Names**: Instead of using names like `bit`, you can use more descriptive names like `targetBit`.

4. **Optimize `filterRowsBasedOnPrevalentBits`**: Instead of recursively calling `filterRowsBasedOnPrevalentBits`, you can use a loop. This will make the logic clearer and avoid potential stack overflow issues for large inputs.

Here's a revised version of your solution:

```go
package day3

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/utils"
)

const (
	BIT_ONE = "1"
	BIT_ZERO = "0"
)

func Solve(input string) {
	rows := utils.SplitRows(input)

	prevalentBits := getPrevalentBitsFromStringRows(rows)

	gammaRateBinary := prevalentBitsToBinary(prevalentBits, false)
	epsilonRateBinary := utils.BinarySwap(gammaRateBinary)
	gammaRate := utils.BinaryToDecimal(gammaRateBinary)
	epsilonRate := utils.BinaryToDecimal(epsilonRateBinary)

	fmt.Println("First part: ", gammaRateBinary, epsilonRateBinary, gammaRate, epsilonRate, " => ", gammaRate*epsilonRate)

	oxygenGeneratorRatingArr := filterRowsBasedOnPrevalentBits(rows, false)
	co2ScrubberRatingArr := filterRowsBasedOnPrevalentBits(rows, true)

	oxygenGeneratorRating := utils.BinaryToDecimal(oxygenGeneratorRatingArr[0])
	co2ScrubberRating := utils.BinaryToDecimal(co2ScrubberRatingArr[0])

	fmt.Println("Second part: ", oxygenGeneratorRating*co2ScrubberRating)
}

func prevalentBitsToBinary(prevalentBits []int32, reversed bool) string {
	binaryArr := make([]byte, len(prevalentBits))
	for i, bitCount := range prevalentBits {
		binaryArr[i] = []byte(intToBit(bitCount, reversed))[0]
	}
	return string(binaryArr)
}

func intToBit(number int32, reversed bool) string {
	if number >= 0 {
		return reversed ? BIT_ZERO : BIT_ONE
	}
	return reversed ? BIT_ONE : BIT_ZERO
}

func filterRowsBasedOnPrevalentBits(rows []string, reversed bool) []string {
	for position := 0; position < len(rows[0]); position++ {
		prevalentBits := getPrevalentBitsFromStringRows(rows)
		targetBit := intToBit(prevalentBits[position], reversed)

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
```

This version is more readable and avoids potential pitfalls of recursion.

---------------

I apologize for the oversight. In Go, we don't have a ternary operator like in some other languages. Instead, we use the `if-else` construct. Let's correct the `intToBit` function:

```go
func intToBit(number int32, reversed bool) string {
	if number >= 0 {
		if reversed {
			return BIT_ZERO
		}
		return BIT_ONE
	} else {
		if reversed {
			return BIT_ONE
		}
		return BIT_ZERO
	}
}
```

This should resolve the type mismatch issue.