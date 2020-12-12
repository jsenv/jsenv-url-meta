import { assert } from "@jsenv/assert"
import { structuredMetaMapToMetaMap } from "@jsenv/url-meta/src/internal/structuredMetaMapToMetaMap.js"

{
  const actual = structuredMetaMapToMetaMap({
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
  const actual = structuredMetaMapToMetaMap({
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

try {
  structuredMetaMapToMetaMap("foo")
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new TypeError(`structuredMetaMap must be a plain object, got foo`)
  assert({ actual, expected })
}

try {
  structuredMetaMapToMetaMap({}, "foo")
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new Error(`received more arguments than expected.
--- number of arguments received ---
2
--- number of arguments expected ---
1`)
  assert({ actual, expected })
}

try {
  structuredMetaMapToMetaMap({
    visible: "foo",
    whatever: {
      "file:///a.js": true,
    },
  })
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new TypeError(`metaValueMap must be plain object, got foo for visible`)
  assert({ actual, expected })
}
