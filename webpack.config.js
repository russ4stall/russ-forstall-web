const { watch } = require('fs');
const path = require('path');

module.exports = {
  entry: {
    'chip-shuffler': "./src/chip-shuffler"
  },
  devtool: 'eval-source-map',
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
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),

  },
};