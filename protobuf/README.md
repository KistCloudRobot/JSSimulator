### sample site
https://medium.com/@ahmadb/google-protocol-buffers-with-websockets-over-https-in-node-js-express-7ea78157394e

### protobuf compile
```
protoc --js_out=import_style=commonjs,binary:. sample.proto
cp sample_pb.js ./server/
cp sample_pb.js ./client/
```