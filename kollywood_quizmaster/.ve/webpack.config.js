/**
 * Kollywood QuizMaster - Webpack config
 * 
 * devServer.allowedHosts and disableHostCheck are configured to allow remote/cloud/vscode access 
 * and to resolve 'Invalid Host header' errors when using Webpack Dev Server in cloud/remote dev environments.
 * Only use these options in trusted dev environments! See https://webpack.js.org/configuration/dev-server/
 */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../dist"),
    clean: true,
    publicPath: ".",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  devtool: "cheap-module-source-map",
  // Accept all hosts/host headers to support remote/cloud development (resolves 'Invalid Host header' errors)
  // See: https://webpack.js.org/configuration/dev-server/#devserverallowedhosts
  // If running older webpack-dev-server, disableHostCheck may be required.
  devServer: {
    allowedHosts: "all",
    // disableHostCheck is deprecated as of webpack-dev-server v4+, but kept for backwards compatibility if your npm start flags require it
    disableHostCheck: true
  }
};
