const path = require('path')
const { startServer } = require('./src/libServer')

const root = path.resolve('.')

let port = 14762
const index = process.argv.indexOf('-p')
if (index !== -1) {
    port = parseInt(process.argv[index + 1])
}

startServer(root, port)