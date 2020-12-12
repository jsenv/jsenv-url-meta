import { assert } from "@jsenv/assert"
import { urlToMeta } from "@jsenv/url-meta"

{
  const actual = urlToMeta({
    url: "file:///a",
    structuredMetaMap: {
      a: {
        "file:///**/a": true,
      },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///b/a",
    structuredMetaMap: {
      a: {
        "file:///**/a": true,
      },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///c/b/a",
    structuredMetaMap: {
      a: {
        "file:///**/a": true,
      },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a.js",
    structuredMetaMap: {
      a: {
        "file:///**/a": true,
      },
    },
  })
  const expected = {}
  assert({ actual, expected })
}
