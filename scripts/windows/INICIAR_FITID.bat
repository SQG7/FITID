@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0\..\.."

if not exist "backend\.env" copy /Y "backend\.env.example" "backend\.env" >nul
if not exist "web\.env.local" (
  echo AVISO: web\.env.local ainda nao existe. Configure o Firebase antes de usar login.
)

start "FITID - Backend" /D "%CD%\backend" cmd /k "npm start"
start "FITID - Web" /D "%CD%\web" cmd /k "npm run dev"

timeout /t 3 >nul
start "" "http://localhost:5173"
