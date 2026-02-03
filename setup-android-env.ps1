# Setup Android Environment Variables for RideShare Lite
# This script sets ANDROID_HOME and updates PATH permanently

Write-Host "Setting up Android SDK environment variables..." -ForegroundColor Green

# Android SDK path (update if your SDK is in a different location)
$androidSdkPath = "C:\Users\Shashank Goel\AppData\Local\Android\Sdk"

# Verify SDK exists
if (-Not (Test-Path $androidSdkPath)) {
    Write-Host "ERROR: Android SDK not found at: $androidSdkPath" -ForegroundColor Red
    Write-Host "Please update the path in this script or install Android SDK" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found Android SDK at: $androidSdkPath" -ForegroundColor Cyan

# Set ANDROID_HOME as a system environment variable
Write-Host "Setting ANDROID_HOME..." -ForegroundColor Yellow
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', $androidSdkPath, [System.EnvironmentVariableTarget]::User)

# Get current PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', [System.EnvironmentVariableTarget]::User)

# Add Android SDK paths to PATH if not already present
$pathsToAdd = @(
    "$androidSdkPath\platform-tools",
    "$androidSdkPath\tools",
    "$androidSdkPath\tools\bin",
    "$androidSdkPath\emulator"
)

$pathUpdated = $false
foreach ($pathToAdd in $pathsToAdd) {
    if ($currentPath -notlike "*$pathToAdd*") {
        Write-Host "Adding to PATH: $pathToAdd" -ForegroundColor Yellow
        $currentPath = "$currentPath;$pathToAdd"
        $pathUpdated = $true
    } else {
        Write-Host "Already in PATH: $pathToAdd" -ForegroundColor Gray
    }
}

if ($pathUpdated) {
    [System.Environment]::SetEnvironmentVariable('Path', $currentPath, [System.EnvironmentVariableTarget]::User)
    Write-Host "PATH updated successfully!" -ForegroundColor Green
} else {
    Write-Host "PATH already contains all Android SDK directories" -ForegroundColor Green
}

Write-Host ""
Write-Host "IMPORTANT: You need to RESTART your terminal/IDE for changes to take effect!" -ForegroundColor Yellow
Write-Host ""
Write-Host "To verify, open a NEW terminal and run:" -ForegroundColor Cyan
Write-Host "  echo `$env:ANDROID_HOME" -ForegroundColor White
Write-Host "  adb --version" -ForegroundColor White
Write-Host ""
