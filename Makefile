.PHONT:all
all: page

.PHONY:page
page:ConfigJSON.js

ConfigJSON.js: ConfigJSON.g4 g4tojs.js
	node g4tojs.js