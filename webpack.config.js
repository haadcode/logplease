const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    libraryTarget: 'var',
    library: 'Logger',
    filename: './dist/logplease.min.js'
  },
  resolve: {
    alias: {
      fs: require.resolve('./src/fs-mock')
    }
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
        presets: ['es2015'],
        plugins: ['transform-runtime']
      }
    }, {
      test: /\.js$/,
      include: /node_modules\/(hoek|qs|wreck|boom)/,
      loader: 'babel',
      query: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
      }
    }, {
      test: /\.json$/,
      loader: 'json'
    }]
  }
};
