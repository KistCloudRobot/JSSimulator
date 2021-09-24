### sample site
https://medium.com/@ahmadb/google-protocol-buffers-with-websockets-over-https-in-node-js-express-7ea78157394e
https://ko.javascript.info/websocket#ref-908
https://developers.google.com/protocol-buffers/docs/reference/javascript-generated

### protobufjs (deprecated ???)
https://semtax.tistory.com/27

### protobuf compile
```
protoc --js_out=import_style=commonjs,binary:. sample.proto
protoc --js_out=library=pbjs,binary:. sample.proto

cp sample_pb.js ./server/
cp sample_pb.js ./client/
```

### start server
```
node server.js
```


### build to web package
```
nvm install --lts
nvm use --lts
npm install webpack webpack-cli
# webpack.config.js 작성.
npm run build
```