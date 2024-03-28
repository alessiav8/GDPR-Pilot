const path = require('path');

module.exports = {
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.bpmn$/,
        use: 'raw-loader',
      },
    ],
  },
};
