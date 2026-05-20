$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

Write-Host "Stopper eksisterende Next dev-servere for $repoRoot..."

$escapedRepoRoot = [regex]::Escape($repoRoot)
$processes = Get-CimInstance Win32_Process |
  Where-Object {
    $_.CommandLine -and
    $_.CommandLine -match "next dev|npm.*run.*dev" -and
    $_.CommandLine -match $escapedRepoRoot
  }

foreach ($process in $processes) {
  if ($process.ProcessId -ne $PID) {
    Write-Host "Stopper proces $($process.ProcessId)"
    Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
  }
}

Start-Sleep -Seconds 2

Write-Host "Starter BI Briefing på http://localhost:3000 ..."
npm run dev
