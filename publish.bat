@echo off
setlocal EnableDelayedExpansion

rem copy %~dp0*.js H:\web\seanloos.com\userscripts\
rem copy %~dp0user.css\*.* H:\web\seanloos.com\userscripts\user.css\

wsl rsync -av --info=progress2 --exclude=*.code-workspace --exclude=*.bat /mnt/c/MappingSolutions/development/userscripts/ rocky.seanloos.com:~/stacks/web/www/userscripts/
pause