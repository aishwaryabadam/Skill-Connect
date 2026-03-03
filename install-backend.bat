@echo off
echo Installing SkillConnect backend...
cd /d "%~dp0backend"
call npm install
if %errorlevel% neq 0 (
  echo Backend install failed.
  pause
  exit /b 1
)
echo Backend dependencies installed.
if not exist .env (
  copy .env.example .env
  echo Created .env from .env.example - please edit and set MONGODB_URI and JWT_SECRET.
)
pause
