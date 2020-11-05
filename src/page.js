g = {}

function setBlocklyOutput(err, data) {
    document.getElementById('codeArea').innerText = err ? String(err) : data
    err ? 0 : g.data = JSON.parse(data)
    err ? 0 : localStorage.setItem('codeAreaStorage', data)
}

function blocklyInitDone() {
    let input = localStorage.getItem('codeAreaStorage')
    input ? ConfigJSONFunctions.parse(JSON.parse(input)) : 0
}

function loadConfig(block) {
    alert("加载配置-功能尚未实现")
    console.log(
        block.getFieldValue('workDir')
    );
}

function generateConfigFile(block) {
    alert("生成配置文件-功能尚未实现")
    block.setFieldValue('123','config')
}