

function xhrPost(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                callback(null, xhr.responseText);
            } else {
                callback([xhr.status, xhr.responseText], null);
            }
        }
    }
    xhr.open('post', url);
    xhr.setRequestHeader('Content-Type', 'text/plain')
    xhr.send(data);
}

var _isset = function (val) {
    if (val == undefined || val == null || (typeof val == 'number' && isNaN(val))) {
        return false;
    }
    return true
}
var _httpSync = function (type, url, formData, mimeType, responseType) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, false);
    if (_isset(mimeType))
        xhr.overrideMimeType(mimeType);
    if (_isset(responseType))
        xhr.responseType = responseType;
    if (_isset(formData))
        xhr.send(formData);
    else xhr.send();
    if (xhr.status == 200) {
        return xhr.response
    }
    else {
        throw ("HTTP " + xhr.status);
    }
}

function xhrPostSync(url, data) {
    return _httpSync("POST", url, data, "text/plain; charset=x-user-defined");
}
function xhrGetSync(url) {
    return _httpSync("Get", url);
}

///////////////////////////////////////////////////////////////////////////////

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
    let dir = block.getFieldValue('workDir')
    let content = xhrPostSync('/loadfile', JSON.stringify({ path: dir + '/config.json' }))
    ConfigJSONFunctions.parse(JSON.parse(content))
}

function saveConfig() {
    let data = g.data
    let dir = data.workDir
    let ret = xhrPostSync('/savefile', JSON.stringify({ path: dir + '/config.json', content: JSON.stringify(data, null, 4) }))
    console.log(ret);
}

function calculateImageInformation() {
    let data = g.data
    let ret = xhrPostSync('/calculateImageInformation', JSON.stringify(data))
    console.log(ret);
}

function extractABFromGDS() {
    let data = g.data
    let ret = xhrPostSync('/extractABFromGDS', JSON.stringify(data))
    console.log(ret);
}

function extractMainProcess() {
    let data = g.data
    let ret = xhrPostSync('/extractMainProcess', JSON.stringify(data))
    console.log(ret);
}

function openHumanCheck() {
    window.open('/human_check.html', '__blank')
}

function testFunction(block) {
    let data = g.data
    let ret = xhrPostSync('/test', JSON.stringify(data))
    console.log(ret);
}

///////////////////////////////////////////////////////////////////////////////


function humanCheckPageInit() {

    g.data = JSON.parse(localStorage.getItem('codeAreaStorage'))
    g.ab = JSON.parse(xhrPostSync('/humanCheckSetting', JSON.stringify(g.data)))
    g.count = g.ab.length
    goToPage(0)
    bindClick()
    console.log(g);

}

function getPicName(i) {
    let prefixLength = String(g.count).length
    let outputPrefix = ('000000000000000000000000' + i).slice(-prefixLength)
    return outputPrefix + '-F.jpg'
}

function saveCheckProgress() {
    let data = g.data
    let dir = data.workDir
    let ret = xhrPostSync('/savefile', JSON.stringify({ path: dir + '/progress.json', content: JSON.stringify(g.progress, null, 4) }))
    console.log(ret);
}

function loadCheckProgress() {
    let data = g.data
    let dir = data.workDir
    try {
        var content = xhrGetSync('/progress.json')
    } catch (error) {
        if (error == 'HTTP 404') {
            content = JSON.stringify({})
        } else {
            throw error
        }
    }
    let obj = JSON.parse(content)
    g.progress = obj
    console.log('load done');
}

function goToPage(pid) {
    totalpage.innerText = Math.ceil(g.count/50)
    totalpic.innerText = g.count
    pid = parseInt(pid)
    g.pid = pid
    currentpid.innerText = g.pid
    topid.value = g.pid-1
    g.spic = pid*50
    g.epic = pid*50+49
    spic.innerText = g.spic
    epic.innerText = g.epic
    let piclist = Array.from(document.querySelectorAll('.pics img'))
    for (let i = 0; i < 50; i++) {
        let picname = getPicName(i+g.spic)
        piclist[i].src = '/pictureOutputDir/'+picname
        piclist[i].style=`transform:rotate(${g.ab[i+g.spic].angle+Math.PI/2}rad);`
        // reset classes
    }
}

// 02548 有bug

function doneThisPage() {
    // update each as done
    goToPage(g.pid+1)
}

function bindClick() {
    Array.from(document.querySelectorAll('.pics .forclick')).forEach(
        (v, i) => v.onclick = (e) => console.log(e, e.offsetX, e.offsetY, i)
    )
}