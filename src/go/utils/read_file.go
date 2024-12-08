package utils

import (
	"log"
	"os"
)

// ReadFile reads the contents of the file from the given filePath.
func ReadFile(filePath string) string {
	data, err := os.ReadFile(filePath)
	if err != nil {
		log.Fatalf("Failed to read file at %s: %v", filePath, err)
	}
	return string(data)
}
