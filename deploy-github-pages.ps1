# Deploy website/ to GitHub Pages via SSH (no HTTPS gh login required).
# Prerequisites:
#   1) ssh -T git@github.com   works
#   2) Create an empty public repo named kongtian-university on GitHub
#      https://github.com/new  (Public, NO README / .gitignore / license)
# Run:
#   powershell -ExecutionPolicy Bypass -File .\deploy-github-pages.ps1

$ErrorActionPreference = "Stop"

$gitCandidates = @(
  "D:\Git\cmd\git.exe",
  "${env:ProgramFiles}\Git\cmd\git.exe",
  "git"
)
$git = $gitCandidates | Where-Object {
  $_ -eq "git" -or (Test-Path $_)
} | Select-Object -First 1
if (-not $git) { throw "git not found." }

$ssh = "ssh"
Set-Location -LiteralPath $PSScriptRoot

Write-Host "==> Checking SSH auth to GitHub..." -ForegroundColor Cyan
$sshOut = ""
$old = $ErrorActionPreference
$ErrorActionPreference = "Continue"
$sshOut = (& $ssh -T -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15 git@github.com 2>&1 | Out-String)
$ErrorActionPreference = $old

if ($sshOut -notmatch "successfully authenticated") {
  Write-Host $sshOut
  throw "SSH auth failed. Run: ssh -T git@github.com"
}

if ($sshOut -match "Hi ([^!]+)!") {
  $user = $Matches[1].Trim()
} else {
  $user = "wwwwwxinchi"
}
$repoName = "kongtian-university"
$full = "$user/$repoName"
$sshUrl = "git@github.com:$full.git"
Write-Host "==> Account: $user" -ForegroundColor Cyan
Write-Host "==> Remote : $sshUrl" -ForegroundColor Cyan

if (-not (Test-Path -LiteralPath ".git")) {
  & $git init
  & $git branch -M main
}

$remotes = @(& $git remote 2>$null)
if ($remotes -notcontains "origin") {
  & $git remote add origin $sshUrl
} else {
  & $git remote set-url origin $sshUrl
}

Write-Host "==> Commit latest files..." -ForegroundColor Cyan
& $git add -A
$pending = & $git status --porcelain
if ($pending) {
  & $git -c user.name="$user" -c user.email="$user@users.noreply.github.com" commit -m "Update site for GitHub Pages"
}

Write-Host "==> Push to GitHub via SSH..." -ForegroundColor Cyan
$ErrorActionPreference = "Continue"
& $git push -u origin main 2>&1 | ForEach-Object { Write-Host $_ }
$pushCode = $LASTEXITCODE
$ErrorActionPreference = "Stop"

if ($pushCode -ne 0) {
  Write-Host ""
  Write-Host "Push failed. Most likely the repo does not exist yet." -ForegroundColor Yellow
  Write-Host "Do this once in browser (VPN if needed):" -ForegroundColor Yellow
  Write-Host "  1) Open https://github.com/new" -ForegroundColor Yellow
  Write-Host "  2) Repository name: kongtian-university" -ForegroundColor Yellow
  Write-Host "  3) Public, create WITHOUT README/gitignore/license" -ForegroundColor Yellow
  Write-Host "  4) Re-run this script" -ForegroundColor Yellow
  throw "git push failed (exit $pushCode)."
}

Write-Host ""
Write-Host "Code uploaded." -ForegroundColor Green
Write-Host "Enable Pages (one-time, in browser):" -ForegroundColor Cyan
Write-Host "  1) Open https://github.com/$full/settings/pages"
Write-Host "  2) Source: Deploy from a branch"
Write-Host "  3) Branch: main , folder: / (root) , Save"
Write-Host ""
Write-Host "Site URL (after 1-2 min): https://$user.github.io/$repoName/" -ForegroundColor Green
Write-Host "Repo URL: https://github.com/$full" -ForegroundColor Green
