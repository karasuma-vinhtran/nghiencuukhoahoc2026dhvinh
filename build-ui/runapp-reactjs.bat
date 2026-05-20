@echo off
setlocal

set /p "choice=Run Project ReactJS Now? (y/n): "
if /i "%choice%"=="y" (
    echo Running ReactJS Project...
    npm run dev
) else if /i "%choice%"=="n" (
    echo Exiting...
    exit
) else (
    echo Invalid input. Please enter Y or N.
    pause
    exit
)
endlocal
