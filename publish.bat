@echo off
setlocal EnableDelayedExpansion

rem copy %~dp0*.js H:\web\seanloos.com\userscripts\
rem copy %~dp0user.css\*.* H:\web\seanloos.com\userscripts\user.css\

wsl rsync -ah --info=progress2 --exclude=*.code-workspace --exclude=.git --exclude=*.bat --exclude=*.code-workspace /mnt/c/development/userscripts/ rocky:~/stacks/web/www/userscripts/
