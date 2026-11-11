@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在啟動 佛光大學應科院 3D 微縮島嶼伺服器...
node server.js
if errorlevel 1 (
    echo.
    echo 若未啟動，您也可以直接雙擊 open_directly.bat 離線遊玩！
    pause
)
