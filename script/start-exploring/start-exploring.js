const { startExploring } = require("@jsenv/core")
const jsenvConfig = require("../../jsenv.config.js")

startExploring({
  ...jsenvConfig,
  watchDescription: {
    "./**/*": false,
    "./*": true,
    "./src/**/*": true,
    "./test/**/*": true,
  },
  port: 3456,
  forcePort: true,
  livereloading: true,
})
