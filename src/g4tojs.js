const fs = require('fs')
const { Converter } = require('../antlr-blockly')

let grammarFile = fs.readFileSync('./src/ConfigJSON.g4', { encoding: 'utf-8' })
let option = {
    "type": "option",
    "defaultGenerating": "JSON",
    "blocklyRuntime": {
        "type": "blocklyRuntimeStatement",
        "path": "antlr-blockly/",
        "files": "blockly_compressed.js, blocks_compressed.js, javascript_compressed.js, zh-hans.js"
    },
    "blocklyDiv": {
        "type": "fixedSizeBlocklyDiv",
        "id": "blocklyDiv",
        "height": "550px",
        "width": "1000px"
    },
    "toolbox": {
        "type": "toolboxDefault",
        "id": "toolbox",
        "gap": 5
    },
    "codeArea": {
        "type": "codeAreaStatement",
        "output": "function(err,data){document.getElementById('codeArea').innerText=err?String(err):data}"
    },
    "target": {
        // "type": "independentFile"
        "type": "keepGrammar"
    }
}
let converter = Converter.withOption(grammarFile, option)

converter.html.bodyScripts_keepGrammar = `
<script src="antlr-blockly/Converter.bundle.min.js"></script>
<script src="target/ConfigJSON.js"></script>
`

fs.writeFileSync('blockly.html', converter.html.text(), { encoding: 'utf8' })
fs.writeFileSync('target/' + converter.js._name, converter.js.text(), { encoding: 'utf8' })


