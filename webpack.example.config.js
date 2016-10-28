module.exports = {
  entry: './example/example.js',
  output: {
    filename: './example/bundle.js'
  },
  node: {
    console: false,
    process: 'mock'
  },
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
      test: /\.json$/,
      loader: 'json'
    }]
  }
}
