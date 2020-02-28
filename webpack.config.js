const path = require('path');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;


const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;


const optimization = () => {
   const config = {
      splitChunks: {
         chunks: 'all'
      }
   }
   
   if (isProd) {
      config.minimizer = [
         new OptimizeCssAssetsWebpackPlugin(),
         new TerserWebpackPlugin()
      ]
   }
}


const plugins = () => {
   const base = [
      new HTMLWebpackPlugin({
         template: './index.html',
         minify: {
            collapseWhitespace: isProd,
         }
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin([
         {
            from: path.resolve(__dirname, 'src/img'),
            to: path.resolve(__dirname, 'dist/img'),
         }
      ]),
      new MiniCssExtractPlugin({
         filename: filename('css'),
      }),
   ]

   return base;
}


const babelOptions = () => {
   const opts = {
      presets: [
         '@babel/preset-env'
      ],
      plugins: [
         '@babel/plugin-proposal-class-properties'
      ]
   }

   return opts;
}



module.exports = {
   context: path.resolve(__dirname, 'src'),
   entry: './scripts/mainGameScript.js',
   output: {
      filename: filename('js'),
      path: path.resolve(__dirname, 'dist'),
   },
   optimization: optimization(),
   devServer: {
      port: 4200,
      hot: isDev,
   },
   devtool: isDev ? 'source-map' : '',
   plugins: plugins(),
   module: {
      rules: [
         {
            test: /\.css$/,
            use: [
               {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                     hmr: isDev,
                     reloadAll: true,
                  }
               },
               'css-loader',
            ]
         },
         {
            test: /\.s[ac]ss$/,
            use: [
               {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                     hmr: isDev,
                     reloadAll: true,
                  }
               },
               'css-loader',
               'sass-loader'
            ]
         },
         {
            test: /\.(png|jpg|svg|gif)$/,
            use: 'file-loader'
         },
         {
            test: /\.js$/,
            exclude: /node-modules/,
            use: [{
               loader: 'babel-loader',
               options: babelOptions()
            }]
         }
      ]
   }
}