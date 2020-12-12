import { buildProject } from "@jsenv/core"
import * as jsenvConfig from "../../jsenv.config.js"

buildProject({
  ...jsenvConfig,
  entryPointMap: {
    "./index.js": "./main.js",
  },
})
