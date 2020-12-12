import { assert } from "@jsenv/assert"
import { normalizeStructuredMetaMap } from "@jsenv/url-meta"

{
  const actual = normalizeStructuredMetaMap(
    {
      "./a.js": { whatever: true },
      "http://example.com/file.js": { whatever: true },
    },
    "file:///User/name/directory/",
  )
  const expected = {
    "file:///User/name/directory/a.js": { whatever: true },
    "http://example.com/file.js": { whatever: true },
  }
  assert({ actual, expected })
}

// ensure normalizeStructuredMetaMap does not sort by length
{
  const actual = normalizeStructuredMetaMap(
    {
      "./a.js": 42,
      "./long.js": 42,
    },
    "file:///",
  )
  const expected = {
    "file:///a.js": 42,
    "file:///long.js": 42,
  }
  assert({ actual, expected })
}

try {
  normalizeStructuredMetaMap(
    {
      "./a.js": 42,
      "./long.js": 42,
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
