const path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js', 
    path: path.resolve(__dirname, 'public'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/',
    },
    port: 8080,
    open: true,
    hot: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.bpmn$/,
        use: 'raw-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  mode: 'development',
  resolve: {
    fallback: {
      vm: require.resolve("vm-browserify"),
      stream: require.resolve("stream-browserify")
    }
  }
};
