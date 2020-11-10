const fs = require('fs')


function initHumanCheckSetting(data, workingConfig) {
    let { workDir, pictureOutputDir } = data
    let xyangles = JSON.parse(fs.readFileSync(workDir + '/ab.json', { encoding: 'utf8' }))
    let count = xyangles.length
    workingConfig.pictureOutputDir = pictureOutputDir
    workingConfig.count = count
    return count+''
}

exports.initHumanCheckSetting = initHumanCheckSetting