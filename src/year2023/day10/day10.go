package day10

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
)

type Dirs struct {
	x, y int
}

type Neighbors = map[rune][]Dirs
type TileMap = map[string]*Point

type Point struct {
	x, y        int
	value       rune
	inside      bool
	polygonEdge bool
}

var NeighborMap = Neighbors{
	'F': []Dirs{{0, 1}, {1, 0}},
	'L': []Dirs{{0, -1}, {1, 0}},
	'J': []Dirs{{-1, 0}, {0, -1}},
	'7': []Dirs{{-1, 0}, {0, 1}},
	'-': []Dirs{{-1, 0}, {1, 0}},
	'|': []Dirs{{0, -1}, {0, 1}},
	',': []Dirs{},
}

func Solve(input string) {
	rows := utils.SplitRows(input)

	var startingPoint *Point
	tiles := &TileMap{}

	height := len(rows)
	width := len(rows[0])

	for y, row := range rows {
		for x, c := range row {
			(*tiles)[key(x, y)] = &Point{
				x:     x,
				y:     y,
				value: c,
			}
			if c == 'S' {
				startingPoint = (*tiles)[key(x, y)]
			}
		}
	}

	fmt.Println("Start: ", startingPoint)

	startingPoint.value = getStartingShape(tiles, startingPoint.x, startingPoint.y)
	fmt.Println("Part1: ", loopNeighbors(startingPoint, tiles, startingPoint, startingPoint, 0)/2)

	inside := 0
	for y := 0; y < height; y++ {
		for x := 0; x < width; x++ {
			point := (*tiles)[key(x, y)]
			if !point.polygonEdge {
				edges := 0
				started := '.'
				for xC := 0; xC < x; xC++ {
					tile := (*tiles)[key(xC, y)]
					if tile.polygonEdge {
						if tile.value == '|' || tile.value == 'L' || tile.value == 'F' {
							started = tile.value
							edges++
						} else if tile.value == 'J' || tile.value == '7' {
							if !(started == 'F' && tile.value == 'J' || started == 'L' && tile.value == '7') {
								edges++
							}
							started = '.'
						}
					}
				}
				if edges%2 == 1 {
					inside++
					point.inside = true
				}
			}
		}
	}
	fmt.Println("Part2: ", inside)
}

func loopNeighbors(start *Point, tiles *TileMap, cp *Point, pp *Point, length int) int {
	if cp.x == start.x && cp.y == start.y && length > 0 {
		return length
	}
	diffX, diffY := pp.x-cp.x, pp.y-cp.y
	neighbors := NeighborMap[cp.value]
	for _, n := range neighbors {
		if n.x != diffX || n.y != diffY {
			// && cp.value != '7' && cp.value != 'J'
			//cp.polygonEdge = cp.value != '-' //for part 2, we are checking horizontal edges, we dont want dash because its not an edge
			cp.polygonEdge = true //for part 2, we are checking horizontal edges, we dont want dash because its not an edge
			return loopNeighbors(start, tiles, (*tiles)[key(cp.x+n.x, cp.y+n.y)], cp, length+1)
		}
	}
	return length
}

func getStartingShape(tiles *TileMap, x, y int) rune {
	n, e, s, w := false, false, false, false
	if x > 0 {
		for _, neighbor := range NeighborMap[(*tiles)[key(x-1, y)].value] {
			if neighbor.x == 1 {
				w = true
			}
		}
	}
	if y > 0 {
		for _, neighbor := range NeighborMap[(*tiles)[key(x, y-1)].value] {
			if neighbor.y == 1 {
				n = true
			}
		}
	}

	for _, neighbor := range NeighborMap[(*tiles)[key(x+1, y)].value] {
		if neighbor.x == -1 {
			e = true
		}
	}
	for _, neighbor := range NeighborMap[(*tiles)[key(x, y+1)].value] {
		if neighbor.y == -1 {
			s = true
		}
	}

	if w && n {
		return 'J'
	}
	if w && s {
		return '7'
	}
	if e && n {
		return 'L'
	}
	if e && s {
		return 'F'
	}
	if e && w {
		return '-'
	}
	if n && s {
		return '|'
	}
	return '.'
}

func key(x, y int) string {
	return fmt.Sprintf("%d-%d", x, y)
}
