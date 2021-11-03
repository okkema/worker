/* eslint-disable @typescript-eslint/no-var-requires */
const package = require("./package.json")

/** @type { import("@babel/core").TransformOptions } */
const config = {
  env: {
    production: {
      presets: [
        ["@babel/preset-env", { targets: { esmodules: true }, modules: false }],
      ],
      ignore: ["**/*.d.ts", "**/*.test.ts"],
      plugins: [["babel-plugin-add-import-extension", { extension: "js" }]],
    },
  },
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "babel-plugin-transform-builtin-extend",
      {
        globals: ["Error", "Array"],
      },
    ],
    [
      "babel-plugin-inline-replace-variables",
      {
        PACKAGE_NAME: package.name,
        PACKAGE_VERSION: package.version,
      },
    ],
  ],
}

module.exports = config
