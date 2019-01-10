const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname + '/dist'),
    publicPath: '/'
  },

  // enable source-map output
  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.css']
  },

  module: {
    rules: [
      // load .ts and .tsx via 'awesome-typescript-loader'
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },

      // use source-map-loader
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },

      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html')
    }),
    new CopyWebpackPlugin([{
      from: 'public'
    }])
  ],

  devServer: {
    historyApiFallback: true
  }
};
