@echo off
rem ============================================================
rem  SMART DISASTER RELIEF MANAGEMENT SYSTEM - compile and run
rem  Double-click this file on Windows to start the console app.
rem ============================================================
cd /d "%~dp0"

echo Compiling Java source files...
javac src\*.java -d bin
if errorlevel 1 (
    echo.
    echo Compilation FAILED. Make sure the Java JDK is installed
    echo and the "javac" command works in Command Prompt.
    pause
    exit /b 1
)

echo Starting the system...
java -cp bin Main
echo.
pause
