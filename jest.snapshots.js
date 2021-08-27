const config = {
  testPathForConsistencyCheck: "some/example.test.js",

  resolveSnapshotPath: (testPath, snapshotExtension) =>
    testPath.replace(/\.test\.([tj]sx?)/, `.test.$1${snapshotExtension}`),

  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath.replace(snapshotExtension, ""),
}

module.exports = config
