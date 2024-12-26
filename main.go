package main

import (
	"flag"
	"github.com/the-medo/advent-of-code/src/year2021"
	"github.com/the-medo/advent-of-code/src/year2023"
	"github.com/the-medo/advent-of-code/src/year2024"
)

func main() {
	year := flag.Int("year", 1, "Which year's solution to run")
	day := flag.Int("day", 1, "Which day's solution to run")
	realInput := flag.Bool("real", false, "Use real input")
	flag.Parse()

	switch *year {
	case 2021:
		year2021.Solve(*day, *realInput)
	case 2023:
		year2023.Solve(*day, *realInput)
	case 2024:
		year2024.Solve(*day, *realInput)
	}
}
