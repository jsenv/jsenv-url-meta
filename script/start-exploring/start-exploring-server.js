const { startExploringServer } = require("@jsenv/exploring-server")
const { projectPath } = require("../../jsenv.config.js")

startExploringServer({
  projectPath,
  watchDescription: {
    "/**/*": false,
    "/*": true,
    "/src/**/*": true,
    "/test/**/*": true,
  },
  port: 3456,
  forcePort: true,
  livereloading: true,
})
