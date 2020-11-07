const gm = require('gm').subClass({ imageMagick: true })
const fs = require('fs')
const sharp = require('sharp');
// gm('img.png').crop(width, height, x, y)

exports.test = function (data) {
    let { workDir, pictureOutputDir, cutPixelSize } = data
    let pic1Obj = data.imageInformation[0]
    let pic1Config = JSON.parse(fs.readFileSync(workDir + '/' + pic1Obj.config + '.json', { encoding: 'utf8' }))
    let { files, width, height, col, row } = pic1Config
    let img = files[0]

    function testgm() {
        
        gm(img).rotate('black', 45).write(pictureOutputDir + '/test1.jpg', (err) => { if (!err) console.log('done') });
    
        gm(img).crop(cutPixelSize, cutPixelSize, 100, 50).write(pictureOutputDir + '/test2.jpg', (err) => { if (!err) console.log('done') });
    
        // appends another.jpg to img.png from top-to-bottom
        // appends another.jpg to img.png from left-to-right: ,true
    
        let a1 = gm(files[0]).append(files[1], true)
        let a2 = gm(files[col]).append(files[col + 1], true)
        a1.append(a2).write(pictureOutputDir + '/test3.jpg', (err) => { if (!err) console.log('done') });
    }
    testgm()

    function testsharp() {
        
    }
    testsharp()
    
    return [img]
}