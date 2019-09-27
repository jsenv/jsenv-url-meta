import { assert } from "@dmail/assert"
import { metaMapToSpecifierMetaMap } from "../../index.js"

{
  const actual = metaMapToSpecifierMetaMap({
    visible: {
      "file:///a.js": true,
      "file:///b.js": false,
    },
  })
  const expected = {
    "file:///a.js": {
      visible: true,
    },
    "file:///b.js": {
      visible: false,
    },
  }
  assert({ actual, expected })
}

{
  const actual = metaMapToSpecifierMetaMap({
    visible: {
      "file:///a.js": true,
    },
    whatever: {
      "file:///a.js": true,
    },
  })
  const expected = {
    "file:///a.js": {
      visible: true,
      whatever: true,
    },
  }
  assert({ actual, expected })
}
