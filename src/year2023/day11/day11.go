package day11

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
)

type Galaxy struct {
	x, y int
}

func (g *Galaxy) key() string {
	return fmt.Sprintf("%d-%d", g.x, g.y)
}

func (g *Galaxy) doubleKey(g2 *Galaxy) string {
	if g.x < g2.x || (g.x == g2.x && g.y < g2.y || g.y == g2.y) {
		return fmt.Sprintf("%s-%s", g.key(), g2.key())
	}
	return fmt.Sprintf("%s-%s", g2.key(), g.key())
}

func (g *Galaxy) isDiff(g2 *Galaxy) bool {
	return g.x != g2.x || g.y != g2.y
}

func (g *Galaxy) dist(g2 *Galaxy) int {
	return utils.AbsInt(g2.x-g.x) + utils.AbsInt(g2.y-g.y)
}

func Solve(input string) {
	solvePart(input, 1)
	solvePart(input, 2)
}

func solvePart(input string, part int) {
	emptySpaceIncrease := 1
	if part == 2 {
		emptySpaceIncrease = 999999
	}

	rows := utils.SplitRows(input)
	colsHaveGalaxy := make([]bool, len(rows[0]))

	increaseY := 0
	galaxies := make([]*Galaxy, 0)
	for y, row := range rows {
		rowHasGalaxy := false
		for x, c := range row {
			if c == '#' {
				rowHasGalaxy = true
				colsHaveGalaxy[x] = true
				galaxies = append(galaxies, &Galaxy{
					x: x,
					y: y + increaseY,
				})
			}
		}
		if !rowHasGalaxy {
			increaseY += emptySpaceIncrease
		}
	}

	increaseX := 0
	for _, galaxy := range galaxies {
		increaseX = 0
		for x, col := range colsHaveGalaxy {
			if x < galaxy.x {
				if !col {
					increaseX += emptySpaceIncrease
				}
			} else {
				break
			}
		}
		galaxy.x += increaseX
	}

	totalDist := 0
	paths := make(map[string]int)
	for _, g1 := range galaxies {
		for _, g2 := range galaxies {
			key := g1.doubleKey(g2)
			_, exists := paths[key]
			if !exists && g1.isDiff(g2) {
				dist := g1.dist(g2)
				paths[key] = dist
				totalDist += dist
			}
		}
	}

	fmt.Println("Part ", part, ": ", totalDist)
}
