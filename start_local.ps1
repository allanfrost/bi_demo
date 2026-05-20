param(
  [switch]$NoStart
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

Write-Host "Stopping existing Next dev servers for $repoRoot..."

$escapedRepoRoot = [regex]::Escape($repoRoot)
$processIds = New-Object "System.Collections.Generic.HashSet[int]"

try {
  $repoProcesses = Get-CimInstance Win32_Process |
    Where-Object {
      $_.CommandLine -and
      $_.CommandLine -match "next dev|npm.*run.*dev|next\\dist\\server\\lib\\start-server\.js" -and
      $_.CommandLine -match $escapedRepoRoot
    }
} catch {
  Write-Host "Could not inspect process command lines; falling back to port cleanup."
  $repoProcesses = @()
}

foreach ($process in $repoProcesses) {
  if ($process.ProcessId -ne $PID) {
    [void]$processIds.Add([int]$process.ProcessId)
  }
}

# Next can keep an old dev server on 3000 even when its command line no longer contains "next dev".
foreach ($port in 3000..3009) {
  $listeners = netstat -ano |
    Select-String "LISTENING" |
    Where-Object { $_.Line -match "[:.]$port\s" }

  foreach ($listener in $listeners) {
    $parts = $listener.Line.Trim() -split "\s+"
    $listenerPid = [int]$parts[-1]

    if ($listenerPid -ne $PID -and $listenerPid -gt 0) {
      $listenerProcess = Get-Process -Id $listenerPid -ErrorAction SilentlyContinue

      if (
        $listenerProcess -and
        $listenerProcess.ProcessName -eq "node"
      ) {
        [void]$processIds.Add($listenerPid)
      }
    }
  }
}

foreach ($processId in $processIds) {
  Write-Host "Stopping process $processId"
  Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 2

if ($NoStart) {
  Write-Host "NoStart selected; server was not started."
  exit 0
}

Write-Host "Starting BI Briefing on http://localhost:3000 ..."
npm run dev
