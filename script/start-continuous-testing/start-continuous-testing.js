const { startContinuousTesting } = require("@jsenv/testing")
const {
  projectPath,
  babelPluginMap,
  convertMap,
  testDescription,
} = require("../../jsenv.config.js")

startContinuousTesting({
  projectPath,
  babelPluginMap,
  convertMap,
  executeDescription: testDescription,
})
