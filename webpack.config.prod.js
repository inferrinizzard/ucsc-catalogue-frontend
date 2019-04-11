const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname+ '/dist'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.css']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      }
    ]
  },
  plugins: [
    new FaviconsWebpackPlugin({
      logo: path.join(__dirname, 'misc/UCSC_seal_logo.png')
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html')
    }),
    new CopyWebpackPlugin([{
      from: 'public'
    }])
  ]
};
