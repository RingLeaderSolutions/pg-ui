var path = require("path");
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  entry: [
    "webpack/hot/dev-server",
    "webpack-hot-middleware/client",
    "./src/App.tsx"],

  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },

  resolve: {
    extensions: ["*", ".ts", ".tsx", ".js"]
  },

  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
      { 
        test: /\.s?css$/, 
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'Portfolio Generation',
            template: './index.ejs'
        })]
};

module.exports = config;