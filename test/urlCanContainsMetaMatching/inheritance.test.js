import { assert } from "@jsenv/assert"
import { urlCanContainsMetaMatching } from "@jsenv/url-meta"

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///src/",
    structuredMetaMap: {
      whatever: {
        "file:///**/*": 42,
        "file:///.git/": 43,
      },
    },
    predicate: ({ whatever }) => whatever === 42,
  })
  const expected = true
  assert({ actual, expected })
}

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///.git/",
    structuredMetaMap: {
      whatever: {
        "file:///**/*": 42,
        "file:///.git/": 43,
      },
    },
    predicate: ({ whatever }) => whatever === 42,
  })
  const expected = false
  assert({ actual, expected })
}

try {
  urlCanContainsMetaMatching({
    url: "file:///.git",
    structuredMetaMap: {
      whatever: {
        "file:///**/*": 42,
        "file:///.git/": 43,
      },
    },
    predicate: ({ whatever }) => whatever === 42,
  })
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new Error(`url should end with /, got file:///.git`)
  assert({ actual, expected })
}

try {
  urlCanContainsMetaMatching({
    url: "file:///.git/",
    structuredMetaMap: {
      whatever: {
        "file:///**/*": 42,
        "file:///.git/": 43,
      },
    },
    predicate: "I'm a string",
  })
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new TypeError(`predicate must be a function, got I'm a string`)
  assert({ actual, expected })
}

try {
  urlCanContainsMetaMatching({
    url: "file:///.git/",
    structuredMetaMap: {
      whatever: {
        "file:///**/*": 42,
        "file:///.git/": 43,
      },
    },
    predicate: ({ whatever }) => whatever === 42,
    otherParameter: "whatever",
  })
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new Error(`received more parameters than expected.
--- name of unexpected parameters ---
otherParameter
--- name of expected parameters ---
url, structuredMetaMap, predicate`)
  assert({ actual, expected })
}
