@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0\..\..\mobile"
call npx expo start
pause
