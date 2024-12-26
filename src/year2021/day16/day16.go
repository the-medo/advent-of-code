package day16

import (
	"fmt"
	"github.com/the-medo/go-advent-2021/utils"
)

type Packet struct {
	Version      int
	TypeId       int
	LengthTypeId int
	LiteralValue int64
	PacketString string
	Subpackets   []Packet
}

func Solve(input string) {
	binaryString, err := utils.HexStringToBinary(input)
	if err != nil {
		fmt.Println(err)
		return
	}

	transmission := processBinaryPacket(binaryString)

	part1 := runPart1(*transmission)

	fmt.Println("Part 1 = ", part1)
	fmt.Println("Part 2 = ", transmission.LiteralValue)
}

func runPart1(packet Packet) int {
	versionSumOfSubpackets := 0
	for _, subpacket := range packet.Subpackets {
		versionSumOfSubpackets += runPart1(subpacket)
	}
	return packet.Version + versionSumOfSubpackets
}

func processBinaryPacket(binaryPacket string) *Packet {
	fmt.Println("===============================")
	fmt.Println("Binary packet:", binaryPacket)

	binaryPacketVersion := binaryPacket[0:3]
	fmt.Println("Computing packet version from:", binaryPacketVersion)
	packetVersion := utils.BinaryToInt(binaryPacketVersion)
	fmt.Println("Packet version:", packetVersion)

	binaryPacketTypeId := binaryPacket[3:6]
	fmt.Println("Computing packet type id:", binaryPacketTypeId)
	packetTypeId := utils.BinaryToInt(binaryPacketTypeId)
	fmt.Println("Packet type ID:", packetTypeId)

	rsp := &Packet{
		Version: packetVersion,
		TypeId:  packetTypeId,
	}

	//Literal value!
	if packetTypeId == 4 {
		loop := true
		startingPoint := 6
		value := ""
		for loop {
			infoPart := binaryPacket[startingPoint]
			valuePart := binaryPacket[startingPoint+1 : startingPoint+5]
			startingPoint += 5
			value = value + valuePart
			if infoPart == '0' {
				loop = false
			}
		}

		fmt.Println("Literal binary value:", value)
		rsp.LiteralValue = utils.BinaryToInt64(value)
		fmt.Println("Literal value:", rsp.LiteralValue)

		rsp.PacketString = binaryPacket[0:startingPoint]
	} else {
		//operator = not literal value
		binaryLengthTypeId := binaryPacket[6:7]
		fmt.Println("Computing binary length type id:", binaryLengthTypeId)
		lengthTypeId := utils.BinaryToInt(binaryLengthTypeId)
		fmt.Println("Binary length type ID:", lengthTypeId)
		rsp.LengthTypeId = lengthTypeId

		totalLengthOfThisPacket := 0

		if lengthTypeId == 0 { // next 15 bits are a number that represents the total length in bits of the sub-packets contained by this packet
			binaryTotalLengthOfSubPackets := binaryPacket[7:22]
			fmt.Println("Binary total length of sub packets:", binaryTotalLengthOfSubPackets)
			totalLengthOfSubPackets := utils.BinaryToInt(binaryTotalLengthOfSubPackets)
			fmt.Println("Total length of sub packets:", totalLengthOfSubPackets)

			startingPosition := 22
			totalLengthOfThisPacket = startingPosition + totalLengthOfSubPackets
			rsp.PacketString = binaryPacket[0:totalLengthOfThisPacket]

			for startingPosition < totalLengthOfThisPacket {
				subpacket := processBinaryPacket(binaryPacket[startingPosition:])
				startingPosition += len(subpacket.PacketString)
				rsp.Subpackets = append(rsp.Subpackets, *subpacket)
			}

		} else if lengthTypeId == 1 { //next 11 bits are a number that represents the number of sub-packets immediately contained by this packet
			binaryNumberOfSubPackets := binaryPacket[7:18]
			fmt.Println("Binary Number sub packets:", binaryNumberOfSubPackets)
			numberOfSubPackets := utils.BinaryToInt(binaryNumberOfSubPackets)
			fmt.Println("Number sub packets:", numberOfSubPackets)

			totalLengthOfThisPacket = 18

			for i := 0; i < numberOfSubPackets; i++ {
				subpacket := processBinaryPacket(binaryPacket[totalLengthOfThisPacket:])
				totalLengthOfThisPacket += len(subpacket.PacketString)
				rsp.Subpackets = append(rsp.Subpackets, *subpacket)
			}
			rsp.PacketString = binaryPacket[0:totalLengthOfThisPacket]
		}

		result := int64(0)
		if packetTypeId == 0 {
			//sum packet
			for _, x := range rsp.Subpackets {
				result += x.LiteralValue
			}

		} else if packetTypeId == 1 {
			//product packet (multiply)
			result = 1
			for _, x := range rsp.Subpackets {
				result *= x.LiteralValue
			}

		} else if packetTypeId == 2 {
			//minimum packet
			result = rsp.Subpackets[0].LiteralValue
			for _, x := range rsp.Subpackets {
				if x.LiteralValue < result {
					result = x.LiteralValue
				}
			}
		} else if packetTypeId == 3 {
			//maximum packet
			result = rsp.Subpackets[0].LiteralValue
			for _, x := range rsp.Subpackets {
				if x.LiteralValue > result {
					result = x.LiteralValue
				}
			}
		} else if packetTypeId == 5 {
			//greater than packet - their value is 1 if the value of the first sub-packet is greater than the value of the second sub-packet; otherwise, their value is 0
			if rsp.Subpackets[0].LiteralValue > rsp.Subpackets[1].LiteralValue {
				result = 1
			}

		} else if packetTypeId == 6 {
			//less than packets - their value is 1 if the value of the first sub-packet is less than the value of the second sub-packet; otherwise, their value is 0
			if rsp.Subpackets[0].LiteralValue < rsp.Subpackets[1].LiteralValue {
				result = 1
			}

		} else if packetTypeId == 7 {
			//equal packet
			if rsp.Subpackets[0].LiteralValue == rsp.Subpackets[1].LiteralValue {
				result = 1
			}
		}

		rsp.LiteralValue = result
	}

	fmt.Println("===============================")
	return rsp
}
