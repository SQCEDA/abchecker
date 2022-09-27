const gm = require('gm').subClass({ imageMagick: true })
const fs = require('fs')
const { getMNPQFromXY, extendMNPQ } = require('./transform')
// const sharp = require('sharp');

exports.test = function (data) {
    let debug = true
    // return testlib(data)
    // return testExtractFirstAB(data)
    return extractMainProcess(data, debug)
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
        gm(img).crop(cutPixelSize, cutPixelSize, 100, 50).write(pictureOutputDir + '/test2.jpg', () => {
            gm(pictureOutputDir + '/test2.jpg').crop(50, 50, 169, 169).write(pictureOutputDir + '/test7.jpg', logcb);
            gm(pictureOutputDir + '/test2.jpg').crop(50, 50, 170, 170).write(pictureOutputDir + '/test8.jpg', logcb);
        });

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
    return (n - 1) * col + (m - 1)
}

function collectPicConfigs(data) {
    let { workDir } = data
    let picConfigs = data.imageInformation.map(pic1Obj => JSON.parse(fs.readFileSync(workDir + '/' + pic1Obj.config + '.json', { encoding: 'utf8' })))
    return picConfigs
}

function extractOneAB(abinfo, outputPrefix, pictureOutputDir, picConfigs, callback) {
    let { imageGroup, mnpqwh } = abinfo
    imageGroup -= 1
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
        crop(mnpqwh[0][0], names[0])
            .then(callback)
    }

    if (mnpqwh.length + mnpqwh[0].length === 3) {
        // 截取出两个临时文件,再拼接
        let leftRight = mnpqwh.length === 1
        let mnpqwhs = mnpqwh[0]
        if (!leftRight) mnpqwhs = mnpqwhs.concat(mnpqwh[1]);

        let names = [
            `${pictureOutputDir}/P${outputPrefix}-0-P.jpg`,
            `${pictureOutputDir}/P${outputPrefix}-1-P.jpg`,
            `${pictureOutputDir}/${outputPrefix}-F.jpg`,
        ]

        Promise.all([
            crop(mnpqwhs[0], names[0]),
            crop(mnpqwhs[1], names[1]),
        ])
            .then(() => append(names[0], names[1], leftRight, names[2]))
            .then(callback)

    }

    if (mnpqwh.length + mnpqwh[0].length === 4) {
        // 截取出四个临时文件,再拼接出两个临时文件,再拼接
        let names = [
            `${pictureOutputDir}/P${outputPrefix}-0-P.jpg`,
            `${pictureOutputDir}/P${outputPrefix}-1-P.jpg`,
            `${pictureOutputDir}/P${outputPrefix}-2-P.jpg`,
            `${pictureOutputDir}/P${outputPrefix}-3-P.jpg`,
            `${pictureOutputDir}/A${outputPrefix}-0-A.jpg`,
            `${pictureOutputDir}/A${outputPrefix}-1-A.jpg`,
            `${pictureOutputDir}/${outputPrefix}-F.jpg`,
        ]

        Promise.all([
            crop(mnpqwh[0][0], names[0]),
            crop(mnpqwh[0][1], names[1]),
            crop(mnpqwh[1][0], names[2]),
            crop(mnpqwh[1][1], names[3]),
        ])
            .then(() => Promise.all([
                append(names[0], names[1], true, names[4]),
                append(names[2], names[3], true, names[5]),
            ]))
            .then(() => append(names[4], names[5], false, names[6]))
            .then(callback)
    }
}

function testExtractFirstAB(data) {
    let picConfigs = collectPicConfigs(data)
    let { pictureOutputDir } = data
    extractOneAB({
        imageGroup: 1,
        mnpqwh: [[{ m: 1, n: 1, p: 100, q: 50, w: 80, h: 100 }]]
    }, 'testExtractFirstAB1', pictureOutputDir, picConfigs)
    extractOneAB({
        imageGroup: 1,
        mnpqwh: [[
            { m: 1, n: 1, p: 100, q: 50, w: 80, h: 100 },
            { m: 1, n: 1, p: 100, q: 50, w: 80, h: 100 },
        ]]
    }, 'testExtractFirstAB2', pictureOutputDir, picConfigs)
    extractOneAB({
        imageGroup: 1,
        mnpqwh: [
            [{ m: 1, n: 1, p: 100, q: 50, w: 80, h: 100 }],
            [{ m: 1, n: 1, p: 100, q: 50, w: 80, h: 100 }],
        ]
    }, 'testExtractFirstAB3', pictureOutputDir, picConfigs)
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
    }, 'testExtractFirstAB4', pictureOutputDir, picConfigs)
    return 'submitted'
}


function extractMainProcess(data, debug) {
    let testSome = !!debug
    let { workDir, cutPixelSize, cutParallel, pictureOutputDir, switchPosition } = data
    fs.mkdirSync(pictureOutputDir, { recursive: true })
    let xyangles = JSON.parse(fs.readFileSync(workDir + '/ab.json', { encoding: 'utf8' }))
    if (testSome) xyangles = xyangles.slice(2548 - 2, 2548 + 2);
    let picConfigs = collectPicConfigs(data)
    let prefixLength = String(xyangles.length).length
    let infos = []
    let calculateImageGroup = (switchPosition, x, y) => {
        // return 1
        let evalExpr = (exprStr, x, y) => {
            if(/[^xy0-9 +\-*<>=.()&|]/.test(exprStr)) throw "condition expression not support";
            return eval(exprStr)
        }
        let parseConditionBlock = (block) => {
            if (block.type=='valueConditionExpr') {
                return evalExpr(block.a, x, y)
            }
            if (block.type=='opConditionExpr') {
                let a=parseConditionBlock(block.a)
                let b=parseConditionBlock(block.b)
                return block.op=='and'?a&&b:(block.op=='or'?a||b:true)
            }
            return true
        }
        let doAction = (block) => {
            if (block.type=='returnAction') {
                return block.pictureId
            }
            if (block.type=='ifAction') {
                if (parseConditionBlock(block.condition)){
                    return doAction(block.trueCase[0])
                } else {
                    return doAction(block.falseCase[0])

                }
            }
            throw "something wrong happen in block type";
        }
        return doAction(switchPosition.switchPositionAction_0[0]);
    }
    let submitOne = (xyangle_i) => {
        let [xyangle, i] = xyangle_i
        let { x, y, angle } = xyangle
        let imageGroup = calculateImageGroup(switchPosition, x, y)
        let { A, B, C, D, E, F, width, height, row, col, files } = picConfigs[imageGroup - 1]
        let [m, n, p, q] = getMNPQFromXY(x, y, A, B, C, D, E, F, width, height)
        let mnpqwh = extendMNPQ(m, n, p, q, width, height, cutPixelSize, cutPixelSize)
        let abinfo = { mnpqwh, imageGroup }

        let outputPrefix = ('000000000000000000000000' + i).slice(-prefixLength)

        let imgI = mntoi(m, n, row, col)
        let img = files[imgI]
        infos.push({ x, y, angle, imageGroup, m, n, p, q, mnpqwh, imgI, img, outputPrefix })
        return new Promise(res => extractOneAB(abinfo, outputPrefix, pictureOutputDir, picConfigs, res))
    }
    let xyangles_withindex = xyangles.map((v, i) => [v, i])
    // xyangles_withindex.map(submitOne)
    let mainProcess = async () => {
        let total = xyangles_withindex.length
        let t1 = new Date();
        while (xyangles_withindex.length > 0) {
            let task = xyangles_withindex.splice(0, cutParallel)
            console.log(`process ${task[0][1]}~${task.slice(-1)[0][1]} of ${total}`);
            await Promise.all(task.map(submitOne))
        }
        let t2 = new Date();
        console.log(`time: ${(t2 - t1) / 1000}s`);
        // process 50436~50439 of 50440
        // time: 3429.032s (before fix 4->1 bug)
    }
    mainProcess()
    let ret = 'submitted: ' + xyangles.length
    if (testSome) ret = infos;
    return ret
}
exports.extractMainProcess = extractMainProcess

function extraCutProcess(data) {
    let { extraCut, cutParallel, extraCutPixelSize: cutPixelSize, extraCutPictureOutputDir: pictureOutputDir } = data
    fs.mkdirSync(pictureOutputDir, { recursive: true })
    let xystring = []
    extraCut.forEach(v => v.picString.replace(/{[^}]*}/g, s => xystring.push(s)));
    let xy_withindex = xystring.map((v, i) => [JSON.parse(v.replace(/'/g, '"')), i])
    let picConfigs = collectPicConfigs(data)
    let prefixLength = String(xy_withindex.length).length
    let infos = []
    let submitOne = (xy_i) => {
        let [xy, i] = xy_i
        let { x, y } = xy
        let imageGroup = 1
        let { A, B, C, D, E, F, width, height, row, col, files } = picConfigs[imageGroup - 1]
        let [m, n, p, q] = getMNPQFromXY(x, y, A, B, C, D, E, F, width, height)
        let mnpqwh = extendMNPQ(m, n, p, q, width, height, cutPixelSize, cutPixelSize)
        let abinfo = { mnpqwh, imageGroup }

        let outputPrefix = ('000000000000000000000000' + i).slice(-prefixLength)

        let imgI = mntoi(m, n, row, col)
        let img = files[imgI]
        infos.push({ x, y, imageGroup, m, n, p, q, mnpqwh, imgI, img, outputPrefix })
        return new Promise(res => extractOneAB(abinfo, outputPrefix, pictureOutputDir, picConfigs, res))
    }
    let mainProcess = async () => {
        let total = xy_withindex.length
        let t1 = new Date();
        while (xy_withindex.length > 0) {
            let task = xy_withindex.splice(0, cutParallel)
            console.log(`process ${task[0][1]}~${task.slice(-1)[0][1]} of ${total}`);
            await Promise.all(task.map(submitOne))
        }
        let t2 = new Date();
        console.log(`time: ${(t2 - t1) / 1000}s`);
    }
    mainProcess()
    return 'submitted: ' + xystring.length
}
exports.extraCutProcess = extraCutProcess