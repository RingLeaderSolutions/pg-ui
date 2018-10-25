var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin  = require('mini-css-extract-plugin');

var config = {
  mode: 'development',
  entry: [
    "webpack-hot-middleware/client",
    "./src/app/App.tsx"
  ],

  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "../../build"),
    filename: "bundle.[hash].js",
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
        use: [
        // {
        //     loader: MiniCssExtractPlugin.loader
        // },
        {
            // Adds CSS to the DOM via <link /> or inline <style /> elements
            loader: "style-loader",
            options: { sourceMap: true }
        }, {
            // Interpets `@import` and `url()` like `import/require()` and resolves dependencies
            loader: "css-loader",
            options: { sourceMap: true }
        },{
            loader: "postcss-loader",
            options: { sourceMap : true }
        },        
        {
            // Loads .scss files and compiles to CSS
            loader: "sass-loader",
            options: { sourceMap: true }
        }]
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
            template: './src/app/assets/index.html',
            favicon: './src/app/assets/favicon.ico'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css' //[name].[hash].css
            // chunkFilename: '[id].css' //[id].[hash].css
        })]
};

module.exports = config;