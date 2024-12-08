package utils

import "strings"

func SplitToMatrix(s string, splitByFields bool, sumBoard bool) ([][]int, int) {
	boardSum := 0
	rows := SplitRows(s)

	rsp := make([][]int, len(rows))

	for i, row := range rows {
		if splitByFields {
			rsp[i] = StringsToInts(strings.Fields(row))
		} else {
			rsp[i] = StringsToInts(strings.Split(row, ""))
		}
		if sumBoard {
			for _, cell := range rsp[i] {
				boardSum += cell
			}
		}
	}

	return rsp, boardSum
}
