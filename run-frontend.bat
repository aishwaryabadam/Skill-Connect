@echo off
cd /d "%~dp0frontend"
echo Starting frontend on http://localhost:3000
call npm run dev
