@echo off
echo Installing SkillConnect frontend...
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
  echo Frontend install failed.
  pause
  exit /b 1
)
echo Frontend dependencies installed.
pause
