var path = require('path');
module.exports = {
  // Specify the entry point for our app.
  entry: [
    path.join(__dirname, 'robo_simul_pb.js')
  ],
  // Specify the output file containing our bundled code
  output: {
    path: __dirname,
    filename: 'robo_simul.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },  
}