package day3

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
)

const RuneDot = rune('.')
const RuneStar = rune('*')
const RuneDigitStart = rune('0')
const RuneDigitEnd = rune('9')

type SchemaRow = []rune
type Schema = []SchemaRow

type PartNumber struct {
	number          int
	adjacentSymbols []rune
}

type Gear struct {
	adjacentNumbers []*PartNumber
}

type GearMap map[string]*Gear

func Solve(input string) {
	rows := utils.SplitRows(input)

	schema := make(Schema, len(rows))

	for i, row := range rows {
		schema[i] = make(SchemaRow, len(row))
		for j, r := range row {
			schema[i][j] = r
		}
	}

	// ========== part 1
	var numbers []PartNumber
	gearMap := &GearMap{}

	for y, _ := range schema {
		isNumber := false
		num := &PartNumber{
			adjacentSymbols: make([]rune, 0),
		}
		for x, c := range schema[y] {
			if c >= RuneDigitStart && c <= RuneDigitEnd {
				if isNumber { //it is not first digit of a number, we adjust the existing number
					num.number = num.number*10 + runeNumber(c)
				} else { //it is first digit of a number, we check for symbols on x-1 and x
					isNumber = true
					num.number = runeNumber(c)

					// xx.
					// xN.
					// xx.
					checkSymbol(&schema, y-1, x-1, num, gearMap)
					checkSymbol(&schema, y, x-1, num, gearMap)
					checkSymbol(&schema, y+1, x-1, num, gearMap)

					checkSymbol(&schema, y-1, x, num, gearMap)
					checkSymbol(&schema, y+1, x, num, gearMap)

				}

				//we always check for symbols on x+1
				// ..x
				// .Nx
				// ..x
				checkSymbol(&schema, y-1, x+1, num, gearMap)
				checkSymbol(&schema, y, x+1, num, gearMap)
				checkSymbol(&schema, y+1, x+1, num, gearMap)
			} else if isNumber {
				//if rune is not a digit but we had a number before, we finish it and create new
				isNumber = false
				numbers = append(numbers, *num)
				num = &PartNumber{
					adjacentSymbols: make([]rune, 0),
				}
			}
		}

		//add number at the end of the row, if we still have it
		if isNumber {
			numbers = append(numbers, *num)
			num = &PartNumber{
				adjacentSymbols: make([]rune, 0),
			}
		}
	}

	// sum all numbers that have adjacent symbols
	part1 := 0
	for _, num := range numbers {
		if len(num.adjacentSymbols) > 0 {
			part1 += num.number
		}
	}
	fmt.Println("Part 1:", part1)

	//sum all gears (star symbols) that have exactly 2 adjacent numbers
	part2 := 0
	for _, g := range *gearMap {
		if len(g.adjacentNumbers) == 2 {
			gearRatio := 1
			for _, gPartNum := range g.adjacentNumbers {
				gearRatio *= gPartNum.number
			}
			part2 += gearRatio
		}
	}

	fmt.Println("Part 2:", part2)
}

func runeNumber(r rune) int {
	return int(r - RuneDigitStart)
}

/*
*
  - if the character is symbol, link it with the number
  - if the character is a star and exists
*/
func checkSymbol(schema *Schema, y int, x int, partNum *PartNumber, gearMap *GearMap) {
	if x < 0 || y < 0 || y >= len(*schema) || x >= len((*schema)[0]) {
		return
	}

	c := (*schema)[y][x]

	if isSymbol(c) {
		partNum.adjacentSymbols = append(partNum.adjacentSymbols, (*schema)[y][x])
	}

	if c == RuneStar {
		key := fmt.Sprintf("%d-%d", x, y)
		gear, exists := (*gearMap)[key]

		if exists {
			gear.adjacentNumbers = append(gear.adjacentNumbers, partNum)
		} else {
			gear = &Gear{
				adjacentNumbers: []*PartNumber{partNum},
			}
			(*gearMap)[key] = gear
		}
	}
}

func isSymbol(r rune) bool {
	return r != RuneDot && (r < RuneDigitStart || r > RuneDigitEnd)
}
