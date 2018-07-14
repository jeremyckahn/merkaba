/* global __dirname */
const commonConfig = require('./webpack.common.config');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const dist = 'dist';

module.exports = Object.assign(commonConfig, {
  entry: {
    demo: './demo/index.js'
  },
  mode: 'development',
  output: {
    path: path.join(__dirname, `${dist}`),
    filename: '[name].js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'index.html' }
    ])
  ]
});
