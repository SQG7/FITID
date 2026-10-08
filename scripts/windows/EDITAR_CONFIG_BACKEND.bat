@echo off
setlocal
cd /d "%~dp0\..\.."
if not exist "backend\.env" copy /Y "backend\.env.example" "backend\.env" >nul
notepad "backend\.env"
