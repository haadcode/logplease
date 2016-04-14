module.exports = {
  entry: './example/example.js',
  output: {
    filename: './example/bundle.js'
  },
  resolve: {
    alias: {
      fs: require.resolve('./src/fs-mock')
    }
  },
  node: {
    console: false,
    process: 'mock'
  }
};
