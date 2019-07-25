const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const WebpackPwaManifest = require('webpack-pwa-manifest')

module.exports = {
  entry: {
    app: ['./src/js/minesweeper.js']
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'js/bundle.js'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'static' }
    ]),
    new WebpackPwaManifest({
      inject: false,
      fingerprints: false,
      filename: 'manifest.webmanifest',
      name: 'Sweeper',
      short_name: 'Sweeper',
      description: 'Web-based Minesweeper Clone',
      background_color: '#3d9dae',
      crossorigin: 'use-credentials',
      icons: [
        {
          src: path.resolve('src/assets/icons/icon.png'),
          sizes: [48, 72, 96, 128, 144, 168, 192, 256, 384, 512] // multiple sizes
        }
      ]
    })
  ],
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader', options: { importLoaders: 1 } },
        { loader: 'postcss-loader' }
      ]
    }, {
      test: /\.less$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
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
