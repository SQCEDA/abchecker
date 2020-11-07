
function test1(data) {
    const fs = require('fs')
    const { getMNPQFromXY } = require('./transform')
    let workDir = data.workDir
    let pic1Obj = data.imageInformation[0]
    let pic1Config = JSON.parse(fs.readFileSync(workDir + '/' + pic1Obj.config + '.json', { encoding: 'utf8' }))
    let { A, B, C, D, E, F, width, height } = pic1Config
    return [
        getMNPQFromXY(0, 0, A, B, C, D, E, F, width, height),
        getMNPQFromXY(-4700000, 4781000, A, B, C, D, E, F, width, height),
        getMNPQFromXY(4560000, 4500000, A, B, C, D, E, F, width, height),
        getMNPQFromXY(4560000, -4500000, A, B, C, D, E, F, width, height),
    ]
}

function test2(data) {
    const { extractABFromGDS } = require('./execGDSScripts')
    console.log('run extractABFromGDS');
    let ret = extractABFromGDS(data)
    console.log(ret);
    return ret
}

function test3(data) {
    const { test } = require('./pictureProcessing')
    let ret = test(data)
    console.log(ret);
    return ret
}

if (typeof exports === 'undefined') this.exports = {}
exports.test = function (data) {

    return test3(data)
}
