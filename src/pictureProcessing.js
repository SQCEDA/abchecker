const gm = require('gm').subClass({ imageMagick: true })
const fs = require('fs')
// const sharp = require('sharp');
// gm('img.png').crop(width, height, x, y)

exports.test = function (data) {
    // return testlib(data)
    return testExtractFirstAB(data)
}


function testlib(data) {
    let { workDir, pictureOutputDir, cutPixelSize } = data
    let pic1Obj = data.imageInformation[0]
    let pic1Config = JSON.parse(fs.readFileSync(workDir + '/' + pic1Obj.config + '.json', { encoding: 'utf8' }))
    let { files, width, height, col, row } = pic1Config
    let img = files[0]

    function testgm() {

        // 旋转后的尺寸飘动了2~3像素
        gm(img).rotate('black', 45).write(pictureOutputDir + '/test1.jpg', logcb);

        // 截取
        gm(img).crop(cutPixelSize, cutPixelSize, 100, 50).write(pictureOutputDir + '/test2.jpg', logcb);

        // appends another.jpg to img.png from top-to-bottom
        // appends another.jpg to img.png from left-to-right: ,true

        let a1 = gm(files[0]).append(files[1], true)
        let a2 = gm(files[col]).append(files[col + 1], true)
        a1.append(a2).write(pictureOutputDir + '/test3.jpg', logcb);
        // 2*2的拼接必须要存两个中间文件来实现,这样做是无效的,要用下面的做法

        // const delay = ms => new Promise(res => setTimeout(res, ms));
        let p1 = new Promise(res => { gm(files[0]).append(files[1], true).write(pictureOutputDir + '/test4.jpg', res) })
        let p2 = new Promise(res => { gm(files[col]).append(files[col + 1], true).write(pictureOutputDir + '/test5.jpg', res) })
        Promise.all([p1, p2]).then(() => {
            gm(pictureOutputDir + '/test4.jpg').append(pictureOutputDir + '/test5.jpg').write(pictureOutputDir + '/test6.jpg', logcb)
        })
    }
    testgm()

    async function testsharp() {
        await sharp(img).extract({ left: 100, top: 50, width: cutPixelSize, height: cutPixelSize }).toFile(pictureOutputDir + '/stest4.jpg')
    }
    // testsharp()

    return [img]
}

function logcb(err) {
    if (!err) console.log('done'); else console.log(err);
}

function emptycb(err) {

}

function mntoi(m, n, row, col) {
    return (m - 1) * col + (n - 1)
}

function collectPicConfigs(data) {
    let { workDir } = data
    let picConfigs = data.imageInformation.map(pic1Obj => JSON.parse(fs.readFileSync(workDir + '/' + pic1Obj.config + '.json', { encoding: 'utf8' })))
    return picConfigs
}

function extractOneAB(abinfo, outputPrefix, data, picConfigs, callback) {
    let { imageGroup, mnpqwh } = abinfo
    imageGroup -= 1
    let { pictureOutputDir } = data
    let picConfig = picConfigs[imageGroup]
    let { files, width, height, col, row } = picConfig

    let crop = (mnpqwh_one, filename) => {
        let { m, n, p, q, w, h } = mnpqwh_one
        let imgI = mntoi(m, n, row, col)
        let img = files[imgI]
        return new Promise(res => gm(img).crop(w, h, p, q).write(filename, res))
    }
    let append = (file1, file2, leftRight, filename) => {
        if (leftRight) {
            return new Promise(res => { gm(file1).append(file2, true).write(filename, res) })
        } else {
            return new Promise(res => { gm(file1).append(file2).write(filename, res) })
        }
    }

    if (mnpqwh.length + mnpqwh[0].length === 2) {
        // 直接截取
        let names = [
            `${pictureOutputDir}/${outputPrefix}-F.jpg`,
        ]
        crop(mnpqwh[0][0], names[0]).then(callback)
    }

    if (mnpqwh.length + mnpqwh[0].length === 3) {
        // 截取出两个临时文件,再拼接
        let leftRight = mnpqwh.length === 1
        let mnpqwhs = mnpqwh[0]
        if (!leftRight) mnpqwhs = mnpqwhs.concat(mnpqwh[1]);

        let names = [
            `${pictureOutputDir}/${outputPrefix}-P0-P.jpg`,
            `${pictureOutputDir}/${outputPrefix}-P1-P.jpg`,
            `${pictureOutputDir}/${outputPrefix}-F.jpg`,
        ]

        Promise.all([
            crop(mnpqwhs[0], names[0]),
            crop(mnpqwhs[1], names[1]),
        ]).then(() => {
            append(names[0], names[1], leftRight, names[2]).then(callback)
        })
    }

    if (mnpqwh.length + mnpqwh[0].length === 4) {
        // 截取出四个临时文件,再拼接出两个临时文件,再拼接
        let names = [
            `${pictureOutputDir}/${outputPrefix}-P0-P.jpg`,
            `${pictureOutputDir}/${outputPrefix}-P1-P.jpg`,
            `${pictureOutputDir}/${outputPrefix}-P2-P.jpg`,
            `${pictureOutputDir}/${outputPrefix}-P3-P.jpg`,
            `${pictureOutputDir}/${outputPrefix}-A0-A.jpg`,
            `${pictureOutputDir}/${outputPrefix}-A1-A.jpg`,
            `${pictureOutputDir}/${outputPrefix}-F.jpg`,
        ]

        Promise.all([
            crop(mnpqwh[0][0], names[0]),
            crop(mnpqwh[0][1], names[1]),
            crop(mnpqwh[1][0], names[2]),
            crop(mnpqwh[1][1], names[3]),
        ]).then(() => {
            Promise.all([
                append(names[0], names[1], true, names[4]),
                append(names[2], names[3], true, names[5]),
            ]).then(() => {
                append(names[4], names[5], false, names[6]).then(callback)
            })
        })
    }
}

function testExtractFirstAB(data) {
    let picConfigs = collectPicConfigs(data)

    extractOneAB({
        imageGroup: 1,
        mnpqwh: [[{ m: 1, n: 1, p: 100, q: 50, w: 80, h: 100 }]]
    }, 'testExtractFirstAB1', data, picConfigs)
    extractOneAB({
        imageGroup: 1,
        mnpqwh: [[
            { m: 1, n: 1, p: 100, q: 50, w: 80, h: 100 },
            { m: 1, n: 1, p: 100, q: 50, w: 80, h: 100 },
        ]]
    }, 'testExtractFirstAB2', data, picConfigs)
    extractOneAB({
        imageGroup: 1,
        mnpqwh: [
            [{ m: 1, n: 1, p: 100, q: 50, w: 80, h: 100 }],
            [{ m: 1, n: 1, p: 100, q: 50, w: 80, h: 100 }],
        ]
    }, 'testExtractFirstAB3', data, picConfigs)
    extractOneAB({
        imageGroup: 1,
        mnpqwh: [
            [
                { m: 1, n: 1, p: 100, q: 50, w: 80, h: 100 },
                { m: 1, n: 1, p: 100, q: 50, w: 80, h: 100 },
            ],
            [
                { m: 1, n: 1, p: 100, q: 50, w: 80, h: 100 },
                { m: 1, n: 1, p: 100, q: 50, w: 80, h: 100 },
            ],
        ]
    }, 'testExtractFirstAB4', data, picConfigs)
    return 'submitted'
}