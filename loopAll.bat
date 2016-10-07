@echo off
cls
:start
echo next iteration
call start.bat
ping 127.0.0.1 -n 120 > nul
goto start
