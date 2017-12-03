const path = require("path");
const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");


module.exports = {
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new UglifyJSPlugin({ sourceMap: true }),
    new CopyWebpackPlugin([{
      from: "src/assets/*",
      to: "assets",
      flatten: true,
    }]),
    new CopyWebpackPlugin([{ from: "src/index.html", to: "." }]),
  ],
  entry: path.join(__dirname, "src", "main.js"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: require.resolve("snapsvg/dist/snap.svg.js"),
        use: "imports-loader?this=>window,fix=>module.exports=0",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["es2015"],
        },
      },
    ],
  },
  resolve: {
    alias: {
      snapsvg: "snapsvg/dist/snap.svg.js",
    },
  },
};
