const { solve } = require('./fitTransform')
const { getImageInformationFromDir } = require('./imageInformation')

function processOneDir(data, workDir, imageInformationBlock, index) {
    const { width, height, col, row, files } = getImageInformationFromDir(imageInformationBlock.dir)
}

function calculateImageInformation(data) {
    let workDir = data.workDir
    let infos = data.imageInformation.map((imageInformationBlock, index) => {
        processOneDir(data, workDir, imageInformationBlock, index)
    });
}

exports.calculateImageInformation = calculateImageInformation