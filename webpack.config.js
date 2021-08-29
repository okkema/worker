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
      umdNamedDefine: true,
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
        loader: "babel-loader",
      },
    ],
  },
}

module.exports = config
