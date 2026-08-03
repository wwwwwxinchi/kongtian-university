# 一键部署到 GitHub Pages
# 用法（需能访问 github.com，通常要开代理）：
#   powershell -ExecutionPolicy Bypass -File .\deploy-github-pages.ps1

$ErrorActionPreference = "Stop"
$gh = "${env:ProgramFiles}\GitHub CLI\gh.exe"
$git = "D:\Git\cmd\git.exe"
if (-not (Test-Path $gh)) { $gh = "gh" }
if (-not (Test-Path $git)) { $git = "git" }

Set-Location -LiteralPath $PSScriptRoot

Write-Host "==> 检查 GitHub 登录..." -ForegroundColor Cyan
& $gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "尚未登录。即将打开浏览器登录 GitHub..." -ForegroundColor Yellow
  & $gh auth login --hostname github.com --git-protocol https --web
  if ($LASTEXITCODE -ne 0) { throw "GitHub 登录失败，请检查网络/代理后重试。" }
}

$user = (& $gh api user --jq .login).Trim()
$repoName = "kongtian-university"
$full = "$user/$repoName"
Write-Host "==> 账号: $user  仓库: $full" -ForegroundColor Cyan

if (-not (Test-Path .git)) {
  & $git init
  & $git branch -M main
}

$remote = (& $git remote 2>$null)
if (-not ($remote -match "origin")) {
  $exists = $false
  try {
    & $gh repo view $full 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { $exists = $true }
  } catch { $exists = $false }

  if ($exists) {
    & $git remote add origin "https://github.com/$full.git"
  } else {
    Write-Host "==> 创建公开仓库并上传..." -ForegroundColor Cyan
    & $git add -A
    & $git -c user.name="$user" -c user.email="$user@users.noreply.github.com" commit -m "Deploy Kongtian University static site" 2>$null
    & $gh repo create $repoName --public --source=. --remote=origin --push
    if ($LASTEXITCODE -ne 0) { throw "创建仓库失败" }
  }
}

Write-Host "==> 提交并推送最新文件..." -ForegroundColor Cyan
& $git add -A
$status = & $git status --porcelain
if ($status) {
  & $git -c user.name="$user" -c user.email="$user@users.noreply.github.com" commit -m "Update site for GitHub Pages"
}
& $git push -u origin main
if ($LASTEXITCODE -ne 0) {
  # 若远端已有内容，尝试拉取后推送
  & $git pull origin main --rebase
  & $git push -u origin main
}

Write-Host "==> 开启 GitHub Pages (main / root)..." -ForegroundColor Cyan
& $gh api -X POST "repos/$full/pages" -f build_type=legacy -f source='{"branch":"main","path":"/"}' 2>$null
# 若已存在则改为更新
& $gh api -X PUT "repos/$full/pages" -f build_type=legacy -f source='{"branch":"main","path":"/"}' 2>$null

Start-Sleep -Seconds 3
$page = & $gh api "repos/$full/pages" | ConvertFrom-Json
$url = $page.html_url
if (-not $url) { $url = "https://$user.github.io/$repoName/" }

Write-Host ""
Write-Host "部署完成（首次可能要等 1～2 分钟生效）" -ForegroundColor Green
Write-Host "访问地址: $url" -ForegroundColor Green
Write-Host "仓库地址: https://github.com/$full" -ForegroundColor Green
