const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/js/minesweeper.js',
  output: {
    path: __dirname + '/dist/',
    filename: 'js/bundle.js'
  },
  watch: true,
  plugins: [
    new CopyWebpackPlugin([
      { from: 'static' }
    ])
  ],
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' }
      ]
    }, {
      test: /\.less$/,
      use: [
        { loader: 'less-loader' }
      ]
    }, {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  }
}
