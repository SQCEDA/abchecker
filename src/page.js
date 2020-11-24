

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

function generateSolution() {
    let data = g.data
    let ret = xhrPostSync('/generateSolution', JSON.stringify(data))
    console.log(ret);
    g.data.extraCut[0].picString = ret
    ConfigJSONFunctions.parse(g.data)
}

function extraCut() {
    let data = g.data
    let ret = xhrPostSync('/extraCut', JSON.stringify(data))
    console.log(ret);
}

function testFunction(block) {
    let data = g.data
    let ret = xhrPostSync('/test', JSON.stringify(data))
    console.log(ret);
}

///////////////////////////////////////////////////////////////////////////////


function humanCheckPageInit() {

    g.timegap = 3000
    g.data = JSON.parse(localStorage.getItem('codeAreaStorage'))
    g.ab = JSON.parse(xhrPostSync('/humanCheckSetting', JSON.stringify(g.data)))
    g.count = g.ab.length
    g.pcount = g.data.viewRow * g.data.viewCol
    initDom()
    loadCheckProgress()
    goToPage(0)
    bindClick()
    console.log(g);

}

function initDom() {
    document.querySelector('.pics').innerHTML = Array.from({ length: g.pcount + 1 }).join(document.querySelector('.pics').innerHTML)
    let { cutPixelSize, viewPixelSize, viewRow, viewCol } = g.data
    let sp = 2
    let s2 = viewPixelSize + sp * 2
    let replaceMap = {
        '-30': (viewPixelSize - cutPixelSize) / 2,
        124: viewPixelSize - 20,
        140: viewPixelSize,
        144: s2,
        360: viewRow * s2 / 2,
        720: viewRow * s2,
        721: viewCol * s2 / 2 + 1,
        1440: viewCol * s2,
    }
    let str = picstyle.innerHTML + ''
    for (const key in replaceMap) {
        str = str.replace(new RegExp(key + 'px', 'g'), key + '_token')
    }
    for (const key in replaceMap) {
        const element = replaceMap[key];
        str = str.replace(new RegExp(key + '_token', 'g'), Math.ceil(element) + 'px')
    }
    picstyle.innerHTML = str
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
        var content = xhrGetSync('/workDir/progress.json')
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
    totalpage.innerText = Math.ceil(g.count / g.pcount)
    totalpic.innerText = g.count
    pid = parseInt(pid)
    g.pid = pid
    currentpid.innerText = g.pid
    topid.value = g.pid - 1
    g.spic = pid * g.pcount
    g.epic = pid * g.pcount + g.pcount - 1
    spic.innerText = g.spic
    epic.innerText = g.epic
    let piclist = Array.from(document.querySelectorAll('.pics img'))
    let boardlist = Array.from(document.querySelectorAll('.pics .board'))
    for (let i = 0; i < g.pcount; i++) {
        // fetch pic
        let picname = getPicName(i + g.spic)
        piclist[i].src = '/pictureOutputDir/' + picname
        piclist[i].style = `transform:rotate(${g.ab[i + g.spic]?.angle + Math.PI / 2}rad);`
        // reset classes
        boardlist[i].setAttribute('class', 'board ' + g.progress[i + g.spic]?.class)
    }
}

function doneThisPage(caller) {
    // update each as done
    for (let i = 0; i < g.pcount; i++) {
        g.progress[g.spic + i] = g.progress[g.spic + i] ?? {}
        if (g.progress[g.spic + i].class) continue
        if (g.spic + i >= g.count) {
            alert('已是最后一页,请保存进度')
            return
        }
        g.progress[g.spic + i].class = 'normalp'
    }
    caller.disabled = true
    setTimeout(() => {
        caller.disabled = false
    }, g.timegap)
    goToPage(g.pid + 1)
}

function bindClick() {

    let boardlist = Array.from(document.querySelectorAll('.pics .board'))
    Array.from(document.querySelectorAll('.pics .forclick')).forEach(
        (v, i) => v.onclick = (e) => {
            const SIZE = Math.ceil(g.data.viewPixelSize / 2)
            console.log('点击事件', e, e.offsetX, e.offsetY);
            console.log('图片编号', g.spic + i, `(${i})`);
            if (g.spic + i >= g.count) {
                return
            }
            console.log('AB信息', g.ab[g.spic + i]);
            let [x, y] = [e.offsetX, e.offsetY]
            g.progress[g.spic + i] = g.progress[g.spic + i] ?? {}
            do {


                if (x < SIZE && y < SIZE) {
                    g.progress[g.spic + i].class = 'warnp'
                    boardlist[i].setAttribute('class', 'board warnp')
                    break
                }
                if (x >= SIZE && y < SIZE) {
                    g.progress[g.spic + i].class = 'errorp'
                    boardlist[i].setAttribute('class', 'board errorp')
                    break
                }
                if (x >= SIZE && y >= SIZE) {
                    if (!/^[A-Za-z0-9_]+$/.test(commentstr.value)) {
                        console.error('请先填写注释(只允许字母数字和下滑线)');
                    } else {
                        g.progress[g.spic + i].class = 'infop'
                        boardlist[i].setAttribute('class', 'board infop')
                        g.progress[g.spic + i].comment = commentstr.value
                    }
                    break
                }
                g.progress[g.spic + i].class = 'normalp'
                boardlist[i].setAttribute('class', 'board normalp')
                g.progress[g.spic + i].comment = undefined
                break

            } while (true);
            console.log(g.progress[g.spic + i]);
        }
    )
}

// 改变css类  
// document.styleSheets[0].cssRules
// rule.style.setProperty('font-size','10px',null);