#!/bin/bash

url="http://localhost:3000/api/iot"

jsonFile="./groundnut.json"
echo "Using groundnut data"

# Ensure the JSON file exists
if [[ ! -f "$jsonFile" ]]; then
    echo "Error: JSON file $jsonFile not found"
    exit 1
fi

# Infinite loop to repeatedly send JSON objects
# while true; do
#     jq -c '.[]' "$jsonFile" | while IFS= read -r jsonObject; do
#         echo "Sending JSON object..."
#         curl -X POST -H "Content-Type: application/json" -d "$jsonObject" "$url"
#         sleep 5 
#     done
#     echo "Reached end of JSON array, restarting from the first object..."
# done

jq -c '.[]' "$jsonFile" | while IFS= read -r jsonObject; do
    echo "Sending JSON object..."
    curl -X POST -H "Content-Type: application/json" -d "$jsonObject" "$url"
    sleep 5
done