var HtmlWebpackPlugin = require('html-webpack-plugin');

var merge = require('webpack-merge')
var base = require('./webpack.config');

var config = merge(base, {
  mode: 'production',
  entry: './src/App.tsx',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'TPI Flow',
      template: './index.ejs',
      favicon: 'favicon.ico'
  })]
})

module.exports = config;