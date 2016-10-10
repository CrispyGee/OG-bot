@echo off
cls
start server.bat
ping 127.0.0.1 -n 3 > nul
:start
echo next iteration
call start.bat
ping 127.0.0.1 -n 1200 > nul
goto start
