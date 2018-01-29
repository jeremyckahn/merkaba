const path = require('path');
const Webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: path.join(__dirname, 'node_modules')
      }, {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'url-loader'
        }]
      }, {
        test: /\.(sass|scss|css)$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }]
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules'
    ]
  }
};
