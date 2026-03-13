# Check if git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Git is not installed or not in your PATH. Please install Git from https://git-scm.com/" -ForegroundColor Red
    exit
}

# Initialize repository if .git doesn't exist
if (!(Test-Path .git)) {
    Write-Host "Initializing Git repository..."
    git init
}

# Add remote if it doesn't exist
$remoteUrl = "https://github.com/Its-karan/JEC_HELP_DESK"
$currentRemote = git remote get-url origin 2>$null
if ($currentRemote -ne $remoteUrl) {
    if ($currentRemote) {
        Write-Host "Updating remote origin to $remoteUrl..."
        git remote set-url origin $remoteUrl
    } else {
        Write-Host "Adding remote origin $remoteUrl..."
        git remote add origin $remoteUrl
    }
}

# Add all changes
Write-Host "Staging changes..."
git add .

# Commit
$commitMsg = "Hackathon Demo Ready: Supabase Integration & Hybrid Dual-Write Fallback Implementation"
Write-Host "Committing changes..."
git commit -m $commitMsg

# Push
Write-Host "Pushing to GitHub..."
git push -u origin main

Write-Host "Done! Your code is now live on GitHub." -ForegroundColor Green
