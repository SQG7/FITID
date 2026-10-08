@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0\..\.."

echo =============================================
echo FITID - VERIFICACAO TECNICA
echo =============================================

pushd backend
call npm run check
if errorlevel 1 (popd & echo ERRO NO BACKEND & pause & exit /b 1)
popd

pushd web
call npm run check
if errorlevel 1 (popd & echo ERRO NO TYPESCRIPT WEB & pause & exit /b 1)
call npm run build
if errorlevel 1 (popd & echo ERRO NO BUILD WEB & pause & exit /b 1)
popd

pushd mobile
call npm run check
if errorlevel 1 (popd & echo ERRO NO TYPESCRIPT MOBILE & pause & exit /b 1)
popd

echo.
echo VERIFICACAO CONCLUIDA SEM ERROS.
pause
