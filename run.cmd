cd %~dp0
@set path=%~dp0im;%path%
start http://127.0.0.1:14762/blockly.html
node server.js -p 14762