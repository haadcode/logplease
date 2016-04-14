module.exports = {
  entry: './src/index.js',
  output: {
    filename: './dist/index.js'
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
