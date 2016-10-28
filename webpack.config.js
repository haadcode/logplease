const webpack = require('webpack')

module.exports = {
  entry: './src/index.js',
  output: {
    libraryTarget: 'var',
    library: 'Logger',
    filename: './dist/logplease.min.js'
  },
  node: {
    console: false,
    process: 'mock'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: { warnings: false }
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: require.resolve('babel-preset-es2015'),
        plugins: require.resolve('babel-plugin-transform-runtime')
      }
    }]
  }
}
