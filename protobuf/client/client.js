'use strict'
const VirtualObject = require('./sample_pb')
const WebSocket = require('ws')
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const ws = new WebSocket('ws://localhost:7070/')
// const ws = new WebSocket('wss://localhost:7070/', {
//     origin: 'https://localhost:7070'
// })
ws.binaryType = 'buffer'
ws.on('open', function open() {
    console.log('connected')
})
ws.on('close', function close() {
    console.log('disconnected')
})
ws.on('message', function incoming(data, flags) {
    console.log('message')
    console.log(data)
    for (var p in data) {
      console.log(p + " = " + data[p])
    }
  
    var bytes = Array.prototype.slice.call(data, 0)
    var message = proto.VirtualObject.deserializeBinary(bytes)
    console.log(message.toObject());
    console.log(message.getName())
    console.log(message.getPos().getX() + ", " + message.getPos().getY());
    console.log(message.getSize().getX() + ", " + message.getSize().getY());
    ws.close()
})