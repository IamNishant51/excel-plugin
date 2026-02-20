@echo off
echo ========================================
echo Office Add-in Network Isolation Fix
echo ========================================
echo.
echo This will allow the Office Add-in to connect to localhost.
echo.
pause

CheckNetIsolation.exe LoopbackExempt -a -n="Microsoft.Win32WebViewHost_cw5n1h2txyewy"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Success! Network isolation exemption added.
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Close this window
    echo 2. Restart Excel
    echo 3. Reload your add-in
    echo.
) else (
    echo.
    echo ========================================
    echo Error: Failed to add exemption
    echo ========================================
    echo.
    echo Make sure you ran this script as Administrator.
    echo Right-click fix-loopback.bat and select "Run as administrator"
    echo.
)

pause
