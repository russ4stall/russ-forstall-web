const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');


const mainConfig = {
  entry: {
    'chip-shuffler': "./src/chip-shuffler",
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
    fallback: {
      "net": false,
      tls: false,
      dns: false

    }
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
  },
  plugins: [
		new NodePolyfillPlugin(),
	],
};

// // Multiple configs for multiple outputs
// var functionsConfig = Object.assign({}, mainConfig, {
//   name: "functionsConfig",
//   entry: { 
//     'ping-me': './src/functions/ping-me'
//   },
//   output: {
//     path: path.resolve(__dirname, 'functions'),
//   }
// });

// Return Array of Configurations
module.exports = [mainConfig];