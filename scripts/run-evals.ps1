<#
.SYNOPSIS
    Run Promptfoo evaluation suites for EVA red teaming

.DESCRIPTION
    Executes Promptfoo test suites with optional backend health checks
    and evidence pack generation.

.PARAMETER Suite
    Suite to run: smoke, golden, atlas, or all (default: smoke)

.PARAMETER WaitForBackend
    Poll backend health endpoint before running tests

.PARAMETER HealthUrl
    Backend health check URL (default: $env:EVA_ASK_URL/health)

.PARAMETER BuildEvidence
    Generate evidence pack after completion

.PARAMETER ConfigPath
    Custom Promptfoo config file path

.EXAMPLE
    .\run-evals.ps1 -Suite smoke

.EXAMPLE
    .\run-evals.ps1 -Suite all -WaitForBackend -BuildEvidence

.NOTES
    Last Updated: 2026-02-17
#>

param(
    [Parameter()]
    [ValidateSet("smoke", "golden", "atlas", "all")]
    [string]$Suite = "smoke",

    [Parameter()]
    [switch]$WaitForBackend,

    [Parameter()]
    [string]$HealthUrl = "",

    [Parameter()]
    [switch]$BuildEvidence,

    [Parameter()]
    [string]$ConfigPath = ""
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

Write-Host "=== EVA Red Team Evaluation Runner ===" -ForegroundColor Cyan
Write-Host "Suite: $Suite" -ForegroundColor Green
Write-Host "Project Root: $projectRoot" -ForegroundColor Gray

# Validate environment variables
if (-not $env:EVA_ASK_URL) {
    Write-Error "EVA_ASK_URL environment variable is required"
    exit 1
}

Write-Host "`nBackend URL: $env:EVA_ASK_URL" -ForegroundColor Gray

# Wait for backend health check
if ($WaitForBackend) {
    if (-not $HealthUrl) {
        $HealthUrl = "$($env:EVA_ASK_URL)/health"
    }

    Write-Host "`nWaiting for backend health..." -ForegroundColor Yellow
    Write-Host "Health URL: $HealthUrl" -ForegroundColor Gray

    $maxAttempts = 30
    $attempt = 0
    $healthy = $false

    while ($attempt -lt $maxAttempts -and -not $healthy) {
        try {
            $response = Invoke-WebRequest -Uri $HealthUrl -Method GET -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                $healthy = $true
                Write-Host "[OK] Backend is healthy" -ForegroundColor Green
            }
        }
        catch {
            $attempt++
            Write-Host "." -NoNewline -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        }
    }

    if (-not $healthy) {
        Write-Error "Backend health check failed after $maxAttempts attempts"
        exit 1
    }
}

# Determine suites to run
$suitesToRun = @()
if ($Suite -eq "all") {
    $suitesToRun = @("smoke", "golden", "atlas-defense-evasion", "atlas-discovery", "atlas-exfiltration")
}
elseif ($Suite -eq "atlas") {
    $suitesToRun = @("atlas-defense-evasion", "atlas-discovery", "atlas-exfiltration")
}
else {
    $suitesToRun = @($Suite)
}

Write-Host "`nRunning suites: $($suitesToRun -join ', ')" -ForegroundColor Cyan

# Create results directory
$resultsDir = Join-Path $projectRoot "eval\promptfoo\results"
if (-not (Test-Path $resultsDir)) {
    New-Item -ItemType Directory -Force -Path $resultsDir | Out-Null
}

# Run each suite
$results = @{}
$totalTests = 0
$totalPassed = 0
$totalFailed = 0

foreach ($suiteName in $suitesToRun) {
    Write-Host "`n===================================================" -ForegroundColor Cyan
    Write-Host "Running suite: $suiteName" -ForegroundColor Cyan
    Write-Host "===================================================" -ForegroundColor Cyan

    $configFile = if ($ConfigPath) {
        $ConfigPath
    }
    else {
        Join-Path $projectRoot "eval\promptfoo\suites\$suiteName.yaml"
    }

    if (-not (Test-Path $configFile)) {
        Write-Warning "Config file not found: $configFile (skipping)"
        continue
    }

    $outputFile = Join-Path $resultsDir "$suiteName-output.json"

    try {
        # Run promptfoo eval
        $promptfooArgs = @(
            "eval",
            "-c", $configFile,
            "-o", $outputFile
        )

        & promptfoo @promptfooArgs

        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Suite $suiteName failed with exit code $LASTEXITCODE"
            $results[$suiteName] = @{
                status = "failed"
                exitCode = $LASTEXITCODE
            }
        }
        else {
            Write-Host "[OK] Suite $suiteName completed successfully" -ForegroundColor Green

            # Parse results
            if (Test-Path $outputFile) {
                $resultData = Get-Content $outputFile | ConvertFrom-Json
                $passed = ($resultData.results | Where-Object { $_.pass }).Count
                $failed = ($resultData.results | Where-Object { -not $_.pass }).Count
                $total = $resultData.results.Count

                $totalTests += $total
                $totalPassed += $passed
                $totalFailed += $failed

                $results[$suiteName] = @{
                    status = "passed"
                    total = $total
                    passed = $passed
                    failed = $failed
                }

                Write-Host "  Total: $total | Passed: $passed | Failed: $failed" -ForegroundColor Gray
            }
        }
    }
    catch {
        Write-Error "Error running suite $suiteName: $_"
        $results[$suiteName] = @{
            status = "error"
            error = $_.Exception.Message
        }
    }
}

# Summary
Write-Host "`n===================================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

foreach ($suiteName in $results.Keys) {
    $result = $results[$suiteName]
    if ($result.status -eq "passed") {
        Write-Host "[OK] $suiteName - $($result.passed)/$($result.total) passed" -ForegroundColor Green
    }
    elseif ($result.status -eq "failed") {
        Write-Host "[FAIL] $suiteName - Failed (exit code $($result.exitCode))" -ForegroundColor Red
    }
    else {
        Write-Host "[FAIL] $suiteName - Error: $($result.error)" -ForegroundColor Red
    }
}

Write-Host "`nTotal Tests: $totalTests" -ForegroundColor Gray
Write-Host "Total Passed: $totalPassed" -ForegroundColor Green
Write-Host "Total Failed: $totalFailed" -ForegroundColor Red

$passRate = if ($totalTests -gt 0) { [math]::Round(($totalPassed / $totalTests) * 100, 2) } else { 0 }
Write-Host "Pass Rate: $passRate%" -ForegroundColor $(if ($passRate -ge 90) { "Green" } elseif ($passRate -ge 75) { "Yellow" } else { "Red" })

# Build evidence pack
if ($BuildEvidence) {
    Write-Host "`n===================================================" -ForegroundColor Cyan
    Write-Host "Building evidence pack..." -ForegroundColor Cyan
    Write-Host "===================================================" -ForegroundColor Cyan

    $evidenceScript = Join-Path $scriptDir "build-evidence-pack.ps1"
    if (Test-Path $evidenceScript) {
        & $evidenceScript
    }
    else {
        Write-Warning "Evidence pack script not found: $evidenceScript"
    }
}

# Exit with appropriate code
if ($totalFailed -gt 0) {
    Write-Host "`n[FAIL] Evaluation failed with $totalFailed failing tests" -ForegroundColor Red
    exit 1
}
else {
    Write-Host "`n[OK] All evaluations passed!" -ForegroundColor Green
    exit 0
}
