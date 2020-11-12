const fs = require('fs')


function initHumanCheckSetting(data, workingConfig) {
    let { workDir, pictureOutputDir } = data
    let xyangles = JSON.parse(fs.readFileSync(workDir + '/ab.json', { encoding: 'utf8' }))
    let count = xyangles.length
    workingConfig.pictureOutputDir = pictureOutputDir
    workingConfig.workDir = workDir
    // workingConfig.count = count
    return JSON.stringify(xyangles)
}

exports.initHumanCheckSetting = initHumanCheckSetting