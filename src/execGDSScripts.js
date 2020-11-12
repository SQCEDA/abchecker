const { execSync } = require('child_process');
const { platform } = require('os')

exports.extractABFromGDS = function (data) {
    let { klayoutPath, gdsPath, ABWidth, ABHeight, workDir } = data
    // let cmd = `set abcheckpythoninput=${ABWidth};${ABHeight};${gdsPath};${workDir}\\ab.json && python -c "import os;print(os.environ.get('abcheckpythoninput'))"`
    let cmd = `set abcheckpythoninput=${ABWidth};${ABHeight};${gdsPath};${workDir}\\ab.json && "${klayoutPath}" -r extractABFromGDS.py`
    if (platform() === 'linux') {
        cmd = `abcheckpythoninput="${ABWidth};${ABHeight};${gdsPath};${workDir}/ab.json" "${klayoutPath}" -r extractABFromGDS.py`
    }
    console.log(cmd);
    let ret = execSync(cmd, { encoding: 'utf8' });
    return ret
}

exports.generateSolution = function (data) {
    let { klayoutPath, ABWidth, ABHeight, workDir } = data
    let cmd = `set abcheckpythoninput=${ABWidth};${ABHeight};${workDir} && "${klayoutPath}" -r generateSolution.py`
    if (platform() === 'linux') {
        cmd = `abcheckpythoninput="${ABWidth};${ABHeight};${workDir}" "${klayoutPath}" -r generateSolution.py`
    }
    console.log(cmd);
    let ret = execSync(cmd, { encoding: 'utf8' });
    return ret
}

// abcheckpythoninput="8000;28000;/media/zhaouv/DATA/Study/C_explore/weijiagong/abpicture/output" "/usr/bin/klayout" -r generateSolution.py
// python -c "import os;print(os.environ.get('abcheckpythoninput'))"