const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"),
  webpack = require("webpack"),
  path = require("path");

module.exports = (env, options) => ({
  entry: ["babel-polyfill", "./src/index.js"],
  output: {
    path: path.join(__dirname, "public"),
    filename: `app.js?${(+new Date()).toString(32).substr(-5)}`,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
    devMiddleware: {
      writeToDisk: true,
    },
    proxy: {
      "/**": {
        target: "chrome-extension://ggkmpjploiogmbbmnohfkalaonmgmcno",
        secure: false,
        changeOrigin: true,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
      { test: /\.css?$/, use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new webpack.DefinePlugin({
      "process.env.BUILD_MODE": JSON.stringify(options.mode),
    }),
  ],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  devtool: "cheap-module-source-map",
});
