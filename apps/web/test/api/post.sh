#!/bin/bash

url="http://localhost:3000/api/iot"

# Check if the -fixed flag is provided
if [[ "$1" == "-fixed" ]]; then
    jsonFile="./fixed-data.json"
    echo "Using fixed data from $jsonFile"
else
    node "./generate-random-data.js"
    jsonFile="./random-data.json"
fi

# Ensure the JSON file exists
if [[ ! -f "$jsonFile" ]]; then
    echo "Error: JSON file $jsonFile not found"
    exit 1
fi

# Infinite loop to repeatedly send JSON objects
while true; do
    # Read the JSON array and iterate over each object
    jq -c '.[]' "$jsonFile" | while IFS= read -r jsonObject; do
        echo "Sending JSON object: $jsonObject"
        curl -X POST -H "Content-Type: application/json" -d "$jsonObject" "$url"
        sleep 5  # Wait for 5 seconds before sending the next object
    done
    echo "Reached end of JSON array, restarting from the first object..."
done