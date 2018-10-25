const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const merge = require('webpack-merge')
const base = require('./webpack.config');

var config = merge.smartStrategy({
    entry: "replace",
    plugins: "replace",
    "module.rules.use": "replace"
})(base, {
  mode: 'production',
  entry: "./src/app/App.tsx",
  module: {
      rules: [
        { 
            test: /\.s?css$/, 
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader",
                "postcss-loader",
                "sass-loader"
            ]
        }
      ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'TPI Flow',
      template: './src/app/assets/index.html',
      favicon: './src/app/assets/favicon.ico'
  }),
  new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css' 
  })],
  optimization: {
    minimizer: [
      new TerserPlugin({
          parallel: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
})

module.exports = config;