package utils

import (
	"log"
	"os"
	"path/filepath"
)

// ReadFile reads the contents of the file from the given filePath.
func ReadFile(filePath string) string {
	data, err := os.ReadFile(filePath)
	if err != nil {
		absPath, _ := filepath.Abs(filePath)
		log.Fatalf("Failed to read file at %s: %v", absPath, err)
	}
	return string(data)
}
