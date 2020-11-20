cd %~dp0
@set path=%~dp0im;%path%
..\node-v14.15.0-win-x64\node.exe server.js -p 14762
node server.js -p 14762