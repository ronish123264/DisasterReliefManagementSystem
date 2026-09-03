#!/bin/bash
# Smart Disaster Relief Management System - compile and run (Linux / macOS)
cd "$(dirname "$0")"
echo "Compiling Java source files..."
javac src/*.java -d bin || exit 1
echo "Starting the system..."
java -cp bin Main
