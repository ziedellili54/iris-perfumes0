@echo off
REM ═════════════════════════════════════════════════════
REM 🚀 Secure Deployment Script for Iris Perfumes
REM ═════════════════════════════════════════════════════

echo.
echo ═════════════════════════════════════════════════════
echo 🚀 Iris Perfumes - Secure Deployment
echo ═════════════════════════════════════════════════════
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git detected
echo.

REM Check if we're in a Git repository
if not exist ".git" (
    echo ⚠️  WARNING: Not a Git repository
    echo.
    echo Initializing Git repository...
    git init
    echo.
)

REM Check for sensitive files
echo 🔍 Checking for sensitive files...
if exist ".env" (
    echo ✅ .env file found ^(will be ignored by .gitignore^)
)
if exist "firebase-admin-key.json" (
    echo ⚠️  WARNING: firebase-admin-key.json found!
    echo Make sure this file is in .gitignore
)
echo.

REM Show current branch
for /f "delims=" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo 📍 Current branch: %CURRENT_BRANCH%
echo.

REM Check for uncommitted changes
git diff-index --quiet HEAD -- >nul 2>&1
if errorlevel 1 (
    echo 📝 Uncommitted changes detected
    echo.
    
    REM Show status
    echo Current changes:
    git status --short
    echo.
    
    REM Ask for commit message
    set /p COMMIT_MSG="📝 Enter commit message (or press Enter to cancel): "
    
    if "!COMMIT_MSG!"=="" (
        echo ❌ Deployment cancelled - no commit message provided
        pause
        exit /b 1
    )
    
    echo.
    echo 📦 Staging files...
    git add .
    
    echo ✅ Files staged
    echo.
    
    echo 💾 Creating commit...
    git commit -m "!COMMIT_MSG!"
    
    if errorlevel 1 (
        echo ❌ ERROR: Commit failed
        pause
        exit /b 1
    )
    
    echo ✅ Commit created
    echo.
) else (
    echo ✅ No uncommitted changes
    echo.
)

REM Check if remote exists
git remote -v | findstr origin >nul 2>&1
if errorlevel 1 (
    echo ⚠️  WARNING: No remote 'origin' configured
    echo.
    set /p REMOTE_URL="Enter your GitHub repository URL: "
    
    if "!REMOTE_URL!"=="" (
        echo ❌ Deployment cancelled - no remote URL provided
        pause
        exit /b 1
    )
    
    echo Adding remote...
    git remote add origin !REMOTE_URL!
    echo ✅ Remote added
    echo.
)

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push -u origin %CURRENT_BRANCH%

if errorlevel 1 (
    echo.
    echo ❌ ERROR: Push failed
    echo.
    echo Common solutions:
    echo 1. Make sure you have push access to the repository
    echo 2. Check your GitHub credentials
    echo 3. Try: git push -u origin %CURRENT_BRANCH% --force ^(use with caution!^)
    echo.
    pause
    exit /b 1
)

echo.
echo ═════════════════════════════════════════════════════
echo ✅ DEPLOYMENT SUCCESSFUL!
echo ═════════════════════════════════════════════════════
echo.
echo Your changes have been pushed to GitHub
echo.
echo 📍 Next steps:
echo 1. Go to your GitHub repository
echo 2. Check GitHub Pages settings
echo 3. Your site should be live at:
echo    https://YOUR_USERNAME.github.io/YOUR_REPO
echo.
echo 🔐 Security reminders:
echo - Never commit .env files
echo - Keep your Firebase credentials secret
echo - Use strong passwords for admin accounts
echo - Enable 2FA on your GitHub account
echo.
pause
