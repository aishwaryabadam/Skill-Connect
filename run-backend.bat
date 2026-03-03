@echo off
cd /d "%~dp0backend"
echo Starting backend on http://localhost:5000
call npm run dev
