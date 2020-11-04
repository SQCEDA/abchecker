const fs = require('fs');
const sizeOf = require('image-size');

export function getImageInformationFromDir(dir){
    dir = dir.endsWith('/') ? dir : dir + '/';
    let files = fs.readdirSync(dir);
    files = files.map((item) => {
        return item = dir + item;
    })

    if (/\d+-\d+.JPG$/.test(files[0])) {
        files=files.sort((a,b)=>{
            let pa=/(\d+)-(\d+).JPG$/
            let am=pa.exec(a)
            let bm=pa.exec(b)
            if (am[1]!=bm[1]) {
                return am[1]-bm[1]
            }
            return am[2]-bm[2]
        })
    }

    const dimensions = sizeOf(files[0]);
    console.log(files);
    console.log(files.length);
    console.log(dimensions);
    return {
        width:dimensions.width,
        height:dimensions.height,
        col:Math.ceil(Math.sqrt(files.length)),
        row:Math.ceil(Math.sqrt(files.length)),
        files,
    }
}