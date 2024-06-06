#!/bin/bash

url="http://localhost:3000/api/iot"

if [[ "$1" == "-fixed" ]]; then
    jsonFile="./01-fixed-data.json"
    echo "Using fixed data from $jsonFile"
else
    node "./03-generate-random-data.js"
    jsonFile="./02-random-data.json"
fi

jsonContent=$(cat "$jsonFile")

curl -X POST -H "Content-Type: application/json" -d "$jsonContent" "$url"

