var HtmlWebpackPlugin = require('html-webpack-plugin');

var merge = require('webpack-merge')
var base = require('./webpack.config');

var config = merge(base, {
  mode: 'production',
  entry: "./src/app/App.tsx",
  plugins: [
    new HtmlWebpackPlugin({
      title: 'TPI Flow',
      template: './src/app/index.ejs',
      favicon: './src/app/favicon.ico'
  })]
})

module.exports = config;