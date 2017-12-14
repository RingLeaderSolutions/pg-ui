var path = require("path");
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  entry: [
    "webpack/hot/dev-server",
    "webpack-hot-middleware/client",
    "./src/App.tsx"],

  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
    publicPath: "/"
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
      },
      { 
        test: /\.(jpg|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader' 
      }
    ]
  },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'TPI Flow',
            template: './index.ejs'
        })]
};

module.exports = config;