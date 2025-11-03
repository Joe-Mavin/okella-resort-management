@echo off
echo ========================================
echo   OKELLA RESORT - Push to GitHub
echo ========================================
echo.

echo Step 1: Create GitHub Repository
echo ---------------------------------
echo 1. Go to: https://github.com/new
echo 2. Repository name: okella-resort-management
echo 3. Make it Public or Private
echo 4. DON'T initialize with README
echo 5. Click "Create repository"
echo.
pause

echo.
echo Step 2: Enter your GitHub username
echo -----------------------------------
set /p GITHUB_USERNAME="Enter your GitHub username: "

echo.
echo Step 3: Adding remote and pushing...
echo -------------------------------------

git remote add origin https://github.com/%GITHUB_USERNAME%/okella-resort-management.git
git branch -M main
git push -u origin main

echo.
echo ========================================
echo   SUCCESS! Code pushed to GitHub
echo ========================================
echo.
echo Your repository: https://github.com/%GITHUB_USERNAME%/okella-resort-management
echo.
echo Next Steps:
echo 1. Go to https://render.com and sign up
echo 2. Click "New +" then "Blueprint"
echo 3. Connect your GitHub repository
echo 4. Render will auto-deploy using render.yaml
echo 5. Add Cloudinary credentials in environment variables
echo.
echo See QUICK_DEPLOY.md for detailed instructions!
echo.
pause
