# Bulletproof HTTP Server with dynamic port fallback
$ports = @(3000, 5173, 8000, 8088, 8888, 9000, 9999, 8081, 8082)
$listener = $null
$activePort = $null

foreach ($p in $ports) {
    try {
        $l = New-Object System.Net.HttpListener
        $l.Prefixes.Add("http://127.0.0.1:$p/")
        $l.Start()
        $listener = $l
        $activePort = $p
        break
    } catch {
        if ($l) {
            $l.Close()
        }
    }
}

if (-not $listener) {
    Write-Host "[ERROR] Could not bind to any test port." -ForegroundColor Red
    exit 1
}

try {
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "[OK] FGU 3D Island Server is running on port $activePort" -ForegroundColor Yellow
    Write-Host "URL: http://127.0.0.1:$activePort" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop server" -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Cyan

    Start-Process "http://127.0.0.1:$activePort"

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath
        if ($path -eq "/" -or $path -eq "") {
            $path = "/index.html"
        }

        $localPath = Join-Path (Get-Location) ($path.TrimStart('/').Replace('/', '\'))

        if (Test-Path $localPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $mime = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                default { "application/octet-stream" }
            }

            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    }
} finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
        $listener.Close()
    }
}
