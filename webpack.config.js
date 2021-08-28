/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const webpack = require("webpack")
const package = require("./package.json")

/** @type { import("webpack").Configuration } */
const config = {
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist"),
    library: {
      name: package.name,
      type: "umd",
    },
  },
  mode: "production",
  devtool: "source-map",
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
      {
        exclude: /\.test.d.ts$/,
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      PACKAGE_VERSION: package.version,
      PACKAGE_NAME: package.name,
    }),
  ],
}

module.exports = config
