const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'custom.js'),
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'ify-loader',
          'transform-loader?plotly.js/tasks/compress_attributes.js'
        ]
      }
    ]
  }
};
