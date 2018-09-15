var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  mode: 'development',
  entry: [
    "webpack-hot-middleware/client",
    "./src/app/App.tsx"
  ],

  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "../../build"),
    filename: "bundle.js",
    publicPath: "/"
  },

  resolve: {
    extensions: ["*", ".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
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
        test: /\.(jpg|png)$/,
        loader: 'file-loader' 
      },
      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            //outputPath: 'fonts/',    // where the fonts will go
            //publicPath: '../'       // override the default path
          }
        }]
      },
    ]
  },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'TPI Flow',
            template: './src/app/index.ejs',
            favicon: './src/app/favicon.ico'
        })]
};

module.exports = config;