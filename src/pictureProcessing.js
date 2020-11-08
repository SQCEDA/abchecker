const gm = require('gm').subClass({ imageMagick: true })
const fs = require('fs')
// const sharp = require('sharp');
// gm('img.png').crop(width, height, x, y)

exports.test = function testlib(data) {
    let { workDir, pictureOutputDir, cutPixelSize } = data
    let pic1Obj = data.imageInformation[0]
    let pic1Config = JSON.parse(fs.readFileSync(workDir + '/' + pic1Obj.config + '.json', { encoding: 'utf8' }))
    let { files, width, height, col, row } = pic1Config
    let img = files[0]

    function testgm() {

        // 旋转后的尺寸飘动了2~3像素
        gm(img).rotate('black', 45).write(pictureOutputDir + '/test1.jpg', (err) => { if (!err) console.log('done') });

        // 截取
        gm(img).crop(cutPixelSize, cutPixelSize, 100, 50).write(pictureOutputDir + '/test2.jpg', (err) => { if (!err) console.log('done') });

        // appends another.jpg to img.png from top-to-bottom
        // appends another.jpg to img.png from left-to-right: ,true

        let a1 = gm(files[0]).append(files[1], true)
        let a2 = gm(files[col]).append(files[col + 1], true)
        a1.append(a2).write(pictureOutputDir + '/test3.jpg', (err) => { if (!err) console.log('done'); else console.log(err); });
        // 2*2的拼接必须要存两个中间文件来实现,这样做是无效的,要用下面的做法

        // const delay = ms => new Promise(res => setTimeout(res, ms));
        let p1 = new Promise(res => { gm(files[0]).append(files[1], true).write(pictureOutputDir + '/test4.jpg', res) })
        let p2 = new Promise(res => { gm(files[col]).append(files[col + 1], true).write(pictureOutputDir + '/test5.jpg', res) })
        Promise.all([p1, p2]).then(() => {
            gm(pictureOutputDir + '/test4.jpg').append(pictureOutputDir + '/test5.jpg').write(pictureOutputDir + '/test6.jpg', (err) => { if (!err) console.log('done'); else console.log(err); })
        })
    }
    testgm()

    async function testsharp() {
        await sharp(img).extract({ left: 100, top: 50, width: cutPixelSize, height: cutPixelSize }).toFile(pictureOutputDir + '/stest4.jpg')
    }
    // testsharp()

    return [img]
}

function emptycb(err) {

}

function mntoi(m, n, row, col) {
    return m * col + n
}

function extractOneAB(abinfo, outputPrefix, data, picConfigs) {
    let { imageGroup, mnpqwh } = abinfo
    imageGroup -= 1
    let { pictureOutputDir } = data
    let picConfig = picConfigs[imageGroup]
    let { files, width, height, col, row } = picConfig

    if (mnpqwh.length + mnpqwh[0].length === 2) {
        let { m, n, p, q, w, h } = mnpqwh[0][0]
        let imgI = mntoi(m, n, row, col)
        let img = files[imgI]
        gm(img).crop(w, h, p, q).write(`${pictureOutputDir}/${outputPrefix}-F.jpg`, emptycb);
    }
}