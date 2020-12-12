import { assert } from "@jsenv/assert"
import { urlToMeta } from "@jsenv/url-meta"

{
  const actual = urlToMeta({
    url: "file:///file.js",
    structuredMetaMap: {
      whatever: {
        "file:///**/*": true,
        "file:///.git/": false,
      },
    },
  })
  const expected = { whatever: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///.git/file.js",
    structuredMetaMap: {
      whatever: {
        "file:///**/*": true,
        "file:///.git/": false,
      },
    },
  })
  const expected = { whatever: false }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///file.js",
    structuredMetaMap: {
      whatever: {
        "file:///**/*": false,
        "file:///*": true,
      },
    },
  })
  const expected = { whatever: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///.git/file.js",
    structuredMetaMap: {
      whatever: {
        "file:///**/*": false,
        "file:///*": true,
      },
    },
  })
  const expected = { whatever: false }
  assert({ actual, expected })
}
