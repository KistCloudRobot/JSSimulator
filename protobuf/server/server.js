'use strict'
const VirtualObject = require('./sample_pb')
const Express = require('express')
const Https = require('http')
const WebSocket = require('ws')
const FileSystem = require('fs')
const app = Express()
app.use(function (req, res) {
    res.send({ msg: 'hello' })
})

const server = Https.createServer({
    // key: FileSystem.readFileSync('key.pem'),
    // cert: FileSystem.readFileSync('cert.pem'),
    // passphrase: 'qwer12#$'
}, app)

function VPoint(x, y) {
    // 상속 3) super constructor call. 
    // 아래 코드와 동일.
    // var pos = new proto.Point();
    // pos.setX(10);
    // pos.setY(20);
    proto.Point.call(this);
    this.setX(x)
    this.setY(y)
}
// 상속 1) prototype 변경.
VPoint.prototype = Object.create(proto.Point.prototype);
// 상속 2) constructor 값을 제대로 설정.
VPoint.prototype.constructor = VPoint;

const wss = new WebSocket.Server({ server })
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message)
    })
    console.log('new client connected')
    var message = new proto.VirtualObject();
    message.setName('Hello Protocol Buffers')
    message.setPos(new VPoint(11, 22));
    var size = new proto.Point();
    size.setX(300);
    size.setY(500);
    message.setSize(size);
    message.addFlags(proto.Flag.COLLIDABLE);
    message.addFlags(proto.Flag.GRABBABLE);
    message.getPropertiesMap().set("p1", "aaaa");
    
    var bytes = message.serializeBinary()
    ws.send(bytes)
})

console.log('Server starting')

server.listen(7070, function listening() {
    console.log('Listening on %d', server.address().port)
})