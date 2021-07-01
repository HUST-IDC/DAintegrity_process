const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './app/javascripts/app.js',
    borrower: './app/javascripts/borrower.js',
    lender: './app/javascripts/lender.js',
    verify: './app/javascripts/verify.js',
    verify1: './app/javascripts/verify1.js',
    verify2: './app/javascripts/verify2.js',
    verify8: './app/javascripts/verify8.js',
    verify4: './app/javascripts/verify4.js',
    verifyroot: './app/javascripts/verifyroot.js',
    client2: './app/javascripts/client2.js',
    client8: './app/javascripts/client8.js',
    client4: './app/javascripts/client4.js',
    servers: './app/javascripts/servers.js',
    cloud: './app/javascripts/cloud.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" },
      { from: './app/borrower.html', to: "borrower.html" },
      { from: './app/lender.html', to: "lender.html" },
      { from: './app/client.html', to: "client.html" },
      { from: './app/verify.html', to: "verify.html" },
      { from: './app/servers.html', to: "servers.html" },
      { from: './app/cloud.html', to: "cloud.html" },
      { from: './app/lib/jquery-3.6.0.slim.min.js', to: "jquery-3.6.0.min.js" },
      { from: './app/lib/jquery.cookie.js', to: "jquery.cookie.js" },
      { from: './app/lib/bootstrap.min.js', to: "bootstrap.min.js" },
      { from: './app/lib/popper.min.js', to: "popper.min.js" }
    ])
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  },

  devServer: {
    compress: true,
    disableHostCheck: true
  }
}
