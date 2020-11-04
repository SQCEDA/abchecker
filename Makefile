.PHONT:all
all: page

.PHONY:page
page:target/ConfigJSON.js

target/ConfigJSON.js: src/ConfigJSON.g4 src/g4tojs.js
	node ./src/g4tojs