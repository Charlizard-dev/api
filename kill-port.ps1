# PowerShell script to kill process using port 5000
$port = 5000
Write-Host "Finding process using port $port..."

$connections = netstat -ano | findstr ":$port"
if ($connections) {
    $processIds = $connections | ForEach-Object {
        if ($_ -match '\s+(\d+)\s*$') {
            $matches[1]
        }
    } | Select-Object -Unique

    foreach ($pid in $processIds) {
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "Found process: $($process.ProcessName) (PID: $pid)"
            $process.Kill()
            Write-Host "✓ Process killed successfully"
        }
    }
} else {
    Write-Host "No process found using port $port"
}

