const webpack = require('webpack')

const isProd = process.env.NODE_ENV === 'production'

module.exports =  {
  entry: [
    './src/dashboard.js',
    !isProd && 'webpack-hot-middleware/client'
  ].filter( x => x ),
  output: { path: '/' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: { presets: ['es2015', 'react'] }
      },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.png$/, loader: "url" },
      { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' }
    ]
  },
  plugins: [
    isProd ? new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': "'production'" } }) : function() {},
    isProd ? new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }) : function() {},
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  devtool: !isProd && 'source-map'
}
