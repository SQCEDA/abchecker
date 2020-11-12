const { execSync } = require('child_process');
const { platform } = require('os')

exports.extractABFromGDS = function (data) {
    let { klayoutPath, gdsPath, ABWidth, ABHeight, workDir } = data
    // let cmd = `set abcheckpythoninput=${ABWidth};${ABHeight};${gdsPath};${workDir}\\ab.json && python -c "import os;print(os.environ.get('abcheckpythoninput'))"`
    let cmd = `set abcheckpythoninput=${ABWidth};${ABHeight};${gdsPath};${workDir}\\ab.json && "${klayoutPath}" -r extractABFromGDS.py`
    if (platform()==='linux') {
        cmd = `abcheckpythoninput="${ABWidth};${ABHeight};${gdsPath};${workDir}/ab.json" "${klayoutPath}" -r extractABFromGDS.py`
    }
    console.log(cmd);
    let ret = execSync(cmd, { encoding: 'utf8' });
    return ret
}

exports.generateSolution = function (data) {
    let { klayoutPath, workDir } = data
    let cmd = `set abcheckpythoninput=${workDir} && "${klayoutPath}" -r generateSolution.py`
    if (platform()==='linux') {
        cmd = `abcheckpythoninput="${workDir}" "${klayoutPath}" -r generateSolution.py`
    }
    console.log(cmd);
    let ret = execSync(cmd, { encoding: 'utf8' });
    return ret
}