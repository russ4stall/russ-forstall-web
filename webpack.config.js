const path = require('path');

module.exports = {
  entry: {
    'chip-shuffler': "./src/chip-shuffler",
    'matrix': "./src/matrix/index",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
  }
};