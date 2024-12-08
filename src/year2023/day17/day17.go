package day17

import (
	"fmt"
	"github.com/the-medo/advent-of-code/src/go/utils"
	"math"
	"strconv"
)

type LowestValue = map[string]int

type Point struct {
	value       int
	lowestValue LowestValue
}

type QueueTask struct {
	x, y, incX, incY, value int
}

func Solve(input string) {
	rows := utils.SplitRows(input)

	height := len(rows)
	width := len(rows[0])

	layout := make([][]*Point, height)
	for y, row := range rows {
		layout[y] = make([]*Point, width)
		for x, c := range row {
			layout[y][x] = &Point{value: int(c - 48)}
		}
	}

	runPart(1, &layout, width, height)
	runPart(2, &layout, width, height)
}

func runPart(part int, layout *[][]*Point, width int, height int) {
	resetLayout(layout)
	minLength, maxLength := 1, 3
	if part == 2 {
		minLength, maxLength = 4, 10
	}

	queue := []QueueTask{{0, 0, 1, 0, 0}, {0, 0, 0, 1, 0}}

	counter := 0
	for len(queue) > 0 {
		task := queue[0]
		queue = queue[1:]
		newTasks := ProcessTask(layout, task.x, task.y, task.incX, task.incY, task.value, width, height, minLength, maxLength)
		queue = append(queue, newTasks...)
		counter++
		if counter%10000 == 0 {
			//fmt.Println("i: ", counter, " queue len: ", len(queue))
		}
	}

	minHeatLoss := math.MaxInt
	for _, value := range (*layout)[height-1][width-1].lowestValue {
		if value < minHeatLoss {
			minHeatLoss = value
		}
	}

	fmt.Println("Part ", part, ": [min: ", minLength, " max: ", maxLength, "] ", minHeatLoss)
}

func ProcessTask(m *[][]*Point, x, y, incX, incY, value int, width, height int, minLength, maxLength int) []QueueTask {
	newTasks := make([]QueueTask, 0)
	cacheKey := getCacheKey(incX, incY)
	_, exists := (*m)[y][x].lowestValue[cacheKey]

	if exists && (*m)[y][x].lowestValue[cacheKey] <= value {
		return newTasks
	}

	(*m)[y][x].lowestValue[cacheKey] = value

	if x == width-1 && y == height-1 {
		return newTasks
	}

	//left
	newLeftIncX, newLeftIncY := rotateLeft(incX, incY)
	newRightIncX, newRightIncY := rotateRight(incX, incY)
	val := value
	for i := 1; i <= maxLength; i++ {
		newX, newY := x+(incX*i), y+(incY*i)
		if !outOfBounds(newX, newY, width, height) {
			val += +(*m)[newY][newX].value
			if i < minLength {
				continue
			}
			newPosCacheKey := getCacheKey(newLeftIncX, newLeftIncY)
			cachedValue, exists := (*m)[newY][newX].lowestValue[newPosCacheKey]

			if (exists && cachedValue > val) || !exists {
				queueLeft := QueueTask{
					x:     newX,
					y:     newY,
					incX:  newLeftIncX,
					incY:  newLeftIncY,
					value: val,
				}

				queueRight := QueueTask{
					x:     newX,
					y:     newY,
					incX:  newRightIncX,
					incY:  newRightIncY,
					value: val,
				}
				newTasks = append(newTasks, queueLeft, queueRight)
			}
		}
	}

	return newTasks
}

func getCacheKey(incX, incY int) string {
	return strconv.Itoa(incX) + ";" + strconv.Itoa(incY)
}

func outOfBounds(x, y, width, height int) bool {
	return x < 0 || y < 0 || x >= width || y >= height
}

func rotateLeft(incX, incY int) (int, int) {
	if incX == -1 {
		return 0, 1
	} else if incY == -1 {
		return -1, 0
	} else if incY == 1 {
		return 1, 0
	} else {
		return 0, -1
	}
}

func rotateRight(incX, incY int) (int, int) {
	if incX == -1 {
		return 0, -1
	} else if incY == -1 {
		return 1, 0
	} else if incY == 1 {
		return -1, 0
	} else {
		return 0, 1
	}
}

func resetLayout(l *[][]*Point) {
	for y, _ := range *l {
		for x, _ := range (*l)[y] {
			(*l)[y][x].lowestValue = make(LowestValue)
		}
	}
}
