const USE_BINARY_PROTOCOL = true;
function connectSimulator(webSocketUrl, monitor) {

    const ws = new WebSocket(webSocketUrl)
    if (USE_BINARY_PROTOCOL) {
        ws.binaryType = 'arraybuffer' // <- 중요! binary 사용 시 지정 필수
    }

    var initialized = false;

    ws.onopen= function open() { 
        console.log('connected')
    }

    ws.onclose = function close() {
        console.log('disconnected')
    }

    ws.onerror = function error(err) {
        console.log('Error: ' + err)
    }

    ws.onmessage = function incoming(data, flags) {

        if (USE_BINARY_PROTOCOL) {
        var bytes = data.data.slice(0); 
        var type;
        var message;
        // console.log("incoming " + bytes + " " + bytes.byteLength);
        if (!initialized) {
            type = 'onConnected'
            message = proto.kr.ac.uos.ai.mcmonitor.InitializeEnvironment.deserializeBinary(bytes)
            initialized = true;
        }
        else if (bytes.byteLength < 100) {
            type = 'onChanged'
            message = proto.kr.ac.uos.ai.mcmonitor.Changeness.deserializeBinary(bytes)
        }
        else {
            type = 'onModified'
            message = proto.kr.ac.uos.ai.mcmonitor.DumpEnvironment.deserializeBinary(bytes)
        }
        //console.log(type);
        //console.log(message.toObject());
        monitor[type](message.toObject())

        }
    }

    console.log("ready!");    
}