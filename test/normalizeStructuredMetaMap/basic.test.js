import { assert } from "@jsenv/assert"
import { normalizeStructuredMetaMap } from "@jsenv/url-meta"

{
  const actual = normalizeStructuredMetaMap(
    {
      whatever: {
        "./a.js": true,
        "http://example.com/file.js": true,
      },
    },
    "file:///User/name/directory/",
  )
  const expected = {
    whatever: {
      "file:///User/name/directory/a.js": true,
      "http://example.com/file.js": true,
    },
  }
  assert({ actual, expected })
}

// ensure normalizeStructuredMetaMap does not sort by length
{
  const actual = normalizeStructuredMetaMap(
    {
      whatever: {
        "./a.js": 42,
        "./long.js": 42,
      },
    },
    "file:///",
  )
  const expected = {
    whatever: {
      "file:///a.js": 42,
      "file:///long.js": 42,
    },
  }
  assert({ actual, expected })
}

try {
  normalizeStructuredMetaMap(
    {
      whatever: {
        "./a.js": 42,
        "./long.js": 42,
      },
    },
    "file:///",
    "something else",
  )
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new Error(`received more arguments than expected.
--- number of arguments received ---
3
--- number of arguments expected ---
2`)
  assert({ actual, expected })
}
