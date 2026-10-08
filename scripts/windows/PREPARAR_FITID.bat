@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0\..\.."

echo =============================================
echo FITID - PREPARAR AMBIENTE
echo =============================================
where node >nul 2>nul || (echo ERRO: Node.js nao encontrado. & pause & exit /b 1)
where npm >nul 2>nul || (echo ERRO: npm nao encontrado. & pause & exit /b 1)

for %%D in (backend web mobile) do (
  echo.
  echo Instalando dependencias de %%D...
  pushd "%%D"
  call npm ci --no-audit --no-fund
  if errorlevel 1 call npm install --no-audit --no-fund
  if errorlevel 1 (popd & echo ERRO em %%D. & pause & exit /b 1)
  popd
)

echo.
echo Preparacao concluida.
echo Configure os arquivos .env locais antes de iniciar.
pause
