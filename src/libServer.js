const fs = require('fs')
const http = require('http')
const url = require('url')
const path = require('path')

// const root = path.resolve('.');
// var port = 14762

exports.startServer = function (root, port) {



    const getTime = function () {
        return (function (fmt, dateobj) {
            let o = {
                "M+": dateobj.getMonth() + 1,
                "d+": dateobj.getDate(),
                "H+": dateobj.getHours(),
                "m+": dateobj.getMinutes(),
                "s+": dateobj.getSeconds(),
                "q+": Math.floor((dateobj.getMonth() + 3) / 3),
                "S": dateobj.getMilliseconds()
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (dateobj.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (let k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        })('[yyyy-MM-dd HH:mm:ss] ', new Date());
    }



    console.log('Static root dir: ' + root);

    const mainpost = function (request, response) {
        console.log(getTime() + 'POST 200 ' + request.url);

        // request.setEncoding('utf-8')
        var postDataList = [];
        request.on("data", function (postDataChunk) {
            postDataList.push(postDataChunk);
        })
        request.on("end", function () {
            var body = postDataList.join('');
            var urlstr = request.url;
            if (urlstr === '/') {
                console.log(urlstr, body);
            }
            response.writeHead(200);
            response.end('no service this url');
        })
    }

    const mainget = function (request, response) {
        var pathname = url.parse(request.url).pathname;
        var filepath = path.join(root, pathname);
        if (filepath.endsWith('/') || filepath.endsWith('\\')) {
            filepath += 'index.html';
        }
        fs.stat(filepath, function (err, stats) {
            if (!err && stats.isFile()) {
                console.log(getTime() + '200 ' + request.url);
                response.writeHead(200);
                fs.createReadStream(filepath).pipe(response);
            } else {
                console.log(getTime() + '404 ' + request.url);
                response.writeHead(404);
                response.end('404 Not Found');
                // fs.readFile(path.join(root, '404.html'), function(error, content) {
                //     response.writeHead(404, { 'Content-Type': 'text/html' });
                //     response.end(content, 'utf-8');
                // });
            }
        });
    }

    const server = http.createServer(function (request, response) {
        //POST
        if (request.method === 'POST') {
            mainpost(request, response);
            return;
        }
        //GET
        if (request.method === 'GET') {
            mainget(request, response);
            return;
        }
        response.writeHead(403);
        response.end('no service');
    });



    server.listen(port);
    console.log(getTime() + 'Starting server on port ' + port + '. http://127.0.0.1:' + port + '/');


} 