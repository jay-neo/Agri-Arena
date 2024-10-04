param(
    [switch]$fixed
)

$url = "http://localhost:3000/api/iot"

if ($fixed) {
    $jsonContent = Get-Content -Path "$PSScriptRoot/fixed-data.json" -Raw
} else {
    $randomDataJsonPath = "$PSScriptRoot/random-data.json"
    if (-not (Test-Path -Path $randomDataJsonPath)) {
        New-Item -Path $randomDataJsonPath -ItemType File
    }
    node "$PSScriptRoot/generate-random-data.js"
    $jsonContent = Get-Content -Path $randomDataJsonPath -Raw
}

Invoke-RestMethod -Uri $url -Method Post -Body $jsonContent -ContentType "application/json"

