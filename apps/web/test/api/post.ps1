param(
    [switch]$fixed
)

$url = "http://localhost:3000/api/iot"

if ($fixed) {
    $jsonContent = Get-Content -Path "$PSScriptRoot/01-fixed-data.json" -Raw
} else {
    node "$PSScriptRoot/03-generate-random-data.js"
    $jsonContent = Get-Content -Path "$PSScriptRoot/02-random-data.json" -Raw
}

Invoke-RestMethod -Uri $url -Method Post -Body $jsonContent -ContentType "application/json"

