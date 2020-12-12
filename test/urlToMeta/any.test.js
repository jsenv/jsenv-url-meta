import { assert } from "@jsenv/assert"
import { urlToMeta } from "@jsenv/url-meta"

{
  const actual = urlToMeta({
    url: "file:///a",
    structuredMetaMap: {
      a: {
        "file:///**/*": true,
      },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///node_modules",
    structuredMetaMap: {
      a: {
        "file:///**/*": true,
      },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a",
    structuredMetaMap: {
      a: {
        "file:///a/**/*.test.js": true,
      },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a/b.test.js",
    structuredMetaMap: {
      a: {
        "file:///a/**/*.test.js": true,
      },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a/b.js",
    structuredMetaMap: {
      a: {
        "file:///a/**/*.test.js": true,
      },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a/b/c.test.js",
    structuredMetaMap: {
      a: {
        "file:///a/**/*.test.js": true,
      },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///index.test.js",
    structuredMetaMap: {
      a: {
        "file:///**/*.js": true,
      },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}
