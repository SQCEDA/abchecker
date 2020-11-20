const { solve, getPixelPositionFromMNPQ } = require('./transform')
const { getImageInformationFromDir } = require('./imageInformation')
const fs = require('fs')

function processOneDir(data, workDir, imageInformationBlock, index) {
    const { width, height, col, row, files } = getImageInformationFromDir(imageInformationBlock.dir)
    let output = { files, width, height, col, row }
    let config = workDir + '/' + imageInformationBlock.config + '.json'
    if (imageInformationBlock.positionTransfrom.type === 'positionPairs') {
        let x, y, u, v, m, n, p, q;
        let objs = imageInformationBlock.positionTransfrom.positionPair
        x = objs.map(v => v.x)
        y = objs.map(v => v.y)
        m = objs.map(v => v.m)
        n = objs.map(v => v.n)
        p = objs.map(v => v.p)
        q = objs.map(v => v.q)
        let uv = objs.map((v, i) => getPixelPositionFromMNPQ(m[i], n[i], p[i], q[i], width, height))
        u = uv.map(v => v[0])
        v = uv.map(v => v[1])
        Object.assign(output, { x, y, m, n, p, q, u, v })
        Object.assign(output, solve(x, y, u, v))
    } else {
        let { A, B, C, D, E, F } = imageInformationBlock.positionTransfrom
        Object.assign(output, { A, B, C, D, E, F })
    }
    fs.writeFileSync(config, JSON.stringify(output, null, 4), { encoding: 'utf8' })
    return output
}

exports.calculate = function (data) {
    let workDir = data.workDir
    fs.mkdirSync(workDir, { recursive: true })
    let infos = data.imageInformation.map((imageInformationBlock, index) => {
        processOneDir(data, workDir, imageInformationBlock, index)
    });
    return infos
}
