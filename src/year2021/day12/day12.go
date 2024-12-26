package day12

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/utils"
	"strings"
	"unicode"
)

type CaveRoom struct {
	Name              string
	Neighbors         []*CaveRoom
	MaxNumberOfVisits int
	IsEnd             bool
	IsUsable          bool
}

type CaveGraph = map[string]*CaveRoom

func Solve(input string) {
	rows := utils.SplitRows(input)
	caveRooms := make(CaveGraph)

	startRoom := &CaveRoom{
		Name:              "start",
		MaxNumberOfVisits: 1,
	}

	endRoom := &CaveRoom{
		Name:              "end",
		IsEnd:             true,
		MaxNumberOfVisits: 1,
	}

	caveRooms["start"] = startRoom
	caveRooms["end"] = endRoom

	for _, row := range rows {
		splitName := strings.Split(row, "-")
		room1, room2 := splitName[0], splitName[1]
		checkRoom(room1, &caveRooms)
		checkRoom(room2, &caveRooms)
		caveRooms[room1].Neighbors = append(caveRooms[room1].Neighbors, caveRooms[room2])
		caveRooms[room2].Neighbors = append(caveRooms[room2].Neighbors, caveRooms[room1])
	}

	partTwoRouteMap := make(map[string]bool, len(rows)^3)

	for _, roomToDoubleVisit := range caveRooms {
		//if its big room or END, we can skip it
		if roomToDoubleVisit.MaxNumberOfVisits == 0 || roomToDoubleVisit.IsEnd == true {
			continue
		}

		//if its small room that is NOT a start, we can double visit it
		// start = special case, usable only for part 1
		if roomToDoubleVisit.Name != "start" {
			roomToDoubleVisit.MaxNumberOfVisits = 2
		}

		allRoutes := traverseCave([]string{"start"}, &caveRooms)

		//fmt.Println("===================================")
		//for _, route := range allRoutes {
		//	fmt.Println(strings.Join(route, "-"))
		//}
		//fmt.Println("===================================")
		for _, route := range allRoutes {
			partTwoRouteMap[strings.Join(route, "-")] = true
		}

		if roomToDoubleVisit.Name == "start" { //room is START => part 1
			fmt.Println("Part 1 - found", len(allRoutes), "routes")
		}

		//we return the room to its original state
		roomToDoubleVisit.MaxNumberOfVisits = 1
	}

	fmt.Println("Part 2 - found ", len(partTwoRouteMap), "routes")

}

func checkRoom(s string, caveRooms *CaveGraph) {
	if (*caveRooms)[s] == nil {
		(*caveRooms)[s] = &CaveRoom{Name: s, MaxNumberOfVisits: 0}
		if unicode.IsLower(rune(s[0])) {
			(*caveRooms)[s].MaxNumberOfVisits = 1
		}
	}
}

func traverseCave(visited []string, graph *CaveGraph) (result [][]string) {
	visitedCopy := make([]string, len(visited))
	copy(visitedCopy, visited)

	node := (*graph)[visitedCopy[len(visitedCopy)-1]]
	if node.IsEnd {
		result = [][]string{visitedCopy}
		return
	}

	for _, neighbor := range node.Neighbors {
		canVisit := utils.SliceContainsCount(visitedCopy, neighbor.Name) < neighbor.MaxNumberOfVisits || neighbor.MaxNumberOfVisits == 0 || neighbor.IsEnd
		if canVisit {
			newVisited := append(visitedCopy, neighbor.Name)
			result = append(result, traverseCave(newVisited, graph)...)
		}
	}

	return
}
