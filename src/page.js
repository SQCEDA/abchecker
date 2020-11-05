function setBlocklyOutput(err, data) {
    document.getElementById('codeArea').innerText = err ? String(err) : data
    err ? 0 : localStorage.setItem('codeAreaStorage', data)
}

function blocklyInitDone() {
    let input = localStorage.getItem('codeAreaStorage')
    input ? ConfigJSONFunctions.parse(eval('(' + input + ')')) : 0
}
