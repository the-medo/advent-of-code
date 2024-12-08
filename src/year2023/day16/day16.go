package day16

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
)

type Beam struct {
	x, y  int
	dir   Dir
	alive bool
}

type Dir struct {
	x, y int
}

type Point struct {
	x, y        int
	c           rune
	energized   int
	enteredDirs []Dir
}

type Layout = [][]Point

func Solve(input string) {
	rows := utils.SplitRows(input)

	height := len(rows)
	width := len(rows[0])

	layout := make(Layout, height)
	for y, row := range rows {
		layout[y] = make([]Point, width)
		for x, c := range row {
			layout[y][x] = Point{
				x:         x,
				y:         y,
				c:         c,
				energized: 0,
			}
		}
	}

	part1 := runFromPoint(0, 0, Dir{x: 1, y: 0}, &layout, width, height)
	fmt.Println("Part 1: ", part1)

	best := 0

	for x := 0; x < width; x++ {
		result := runFromPoint(x, 0, Dir{x: 0, y: 1}, &layout, width, height)
		if result > best {
			best = result
		}
		result = runFromPoint(x, height-1, Dir{x: 0, y: -1}, &layout, width, height)
		if result > best {
			best = result
		}
	}
	for y := 0; y < height; y++ {
		result := runFromPoint(0, y, Dir{x: 1, y: 0}, &layout, width, height)
		if result > best {
			best = result
		}
		result = runFromPoint(width-1, y, Dir{x: -1, y: 0}, &layout, width, height)
		if result > best {
			best = result
		}
	}

	fmt.Println("Part 2: ", best)
}

func runFromPoint(startX int, startY int, startDir Dir, layout *Layout, width int, height int) int {
	resetLayout(layout)

	(*layout)[startY][startX].energized++

	dirs := getDir((*layout)[startY][startX].c, startDir)
	beams := make([]*Beam, len(dirs))

	for i, dir := range dirs {
		beams[i] = &Beam{startX, startY, dir, true}
	}

	aliveBeams := 1
	i := 0

	for aliveBeams > 0 {
		i++
		aliveBeams = 0
		newBeams := make([]*Beam, 0)
		for _, beam := range beams {
			if beam.alive {
				aliveBeams++
			}
			beamsToAdd := moveBeam(beam, layout, width, height, true)
			if beam.alive {
				newBeams = append(newBeams, beam)
			}
			for _, bta := range beamsToAdd {
				if bta.alive {
					newBeams = append(newBeams, &bta)
				}
			}
		}
		beams = newBeams
	}

	//printMap(&layout, false)
	return computeAndPrintMap(layout, false, false)
}

func moveBeam(b *Beam, layout *Layout, width int, height int, end bool) []Beam {
	if !b.alive {
		return []Beam{}
	}

	b.x += b.dir.x
	b.y += b.dir.y

	if b.x >= width || b.x < 0 {
		if end {
			b.alive = false
		}
	} else if b.y >= height || b.y < 0 {
		if end {
			b.alive = false
		}
	} else {
		for _, enteredDir := range (*layout)[b.y][b.x].enteredDirs {
			if enteredDir == b.dir {
				b.alive = false
				return []Beam{}
			}
		}

		(*layout)[b.y][b.x].energized++
		(*layout)[b.y][b.x].enteredDirs = append((*layout)[b.y][b.x].enteredDirs, b.dir)
		dirs := getDir((*layout)[b.y][b.x].c, b.dir)
		b.dir = dirs[0]
		if len(dirs) > 1 {
			beams := []Beam{}
			for _, dir := range dirs[1:] {
				beams = append(beams, Beam{
					x:     b.x,
					y:     b.y,
					dir:   dir,
					alive: true,
				})
			}
			return beams
		}
	}

	return []Beam{}
}

func getDir(c rune, curDir Dir) []Dir {
	if c == '.' {
		return []Dir{curDir}
	} else if c == '|' {
		if curDir.y == 1 || curDir.y == -1 {
			return []Dir{curDir}
		} else {
			return []Dir{{x: 0, y: -1}, {x: 0, y: 1}}
		}
	} else if c == '-' {
		if curDir.x == 1 || curDir.x == -1 {
			return []Dir{curDir}
		} else {
			return []Dir{{x: 1, y: 0}, {x: -1, y: 0}}
		}
	} else if c == '/' {
		if curDir.x == 1 {
			return []Dir{{x: 0, y: -1}}
		} else if curDir.x == -1 {
			return []Dir{{x: 0, y: 1}}
		} else if curDir.y == -1 {
			return []Dir{{x: 1, y: 0}}
		} else if curDir.y == 1 {
			return []Dir{{x: -1, y: 0}}
		}
	} else if c == '\\' {
		if curDir.x == 1 {
			return []Dir{{x: 0, y: 1}}
		} else if curDir.x == -1 {
			return []Dir{{x: 0, y: -1}}
		} else if curDir.y == -1 {
			return []Dir{{x: -1, y: 0}}
		} else if curDir.y == 1 {
			return []Dir{{x: 1, y: 0}}
		}
	}
	return []Dir{}
}

func computeAndPrintMap(layout *Layout, print bool, energized bool) int {
	totalEnergized := 0
	for _, row := range *layout {
		for _, c := range row {
			if c.energized > 0 {
				totalEnergized++
			}
			if print {
				if energized {
					if c.energized > 0 {
						if c.energized > 9 {
							fmt.Print("9")
						} else {
							fmt.Print(c.energized)
						}
					} else {
						fmt.Print(".")
					}
				} else {
					fmt.Print(string(c.c))
				}
			}
		}
		if print {
			fmt.Println()
		}
	}
	if print {
		fmt.Println("=======================")
	}
	return totalEnergized
}

func resetLayout(l *Layout) {
	for y, _ := range *l {
		for x, _ := range (*l)[y] {
			(*l)[y][x].energized = 0
			(*l)[y][x].enteredDirs = []Dir{}
		}
	}
}
