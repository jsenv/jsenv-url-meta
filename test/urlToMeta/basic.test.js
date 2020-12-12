import { assert } from "@jsenv/assert"
import { urlToMeta } from "@jsenv/url-meta"

{
  const url = "file:///file"
  const structuredMetaMap = {
    "/file": true,
  }
  try {
    urlToMeta({
      url,
      structuredMetaMap,
    })
  } catch (actual) {
    const expected = new TypeError(
      `structuredMetaMap key must be a url and no scheme found, got /file`,
    )
    assert({ actual, expected })
  }
}

{
  const url = "file:///"
  const structuredMetaMap = {
    "file:///foo": true,
  }
  try {
    urlToMeta({
      url,
      structuredMetaMap,
    })
  } catch (actual) {
    const expected = new TypeError(
      `structuredMetaMap value must be a plain object or null, got true under key file:///foo`,
    )
    assert({ actual, expected })
  }
}

{
  const url = "file:///file"
  const structuredMetaMap = {
    whatever: {
      "file:///*.js": true,
      "file:///file.js": null,
    },
  }

  const actual = urlToMeta({
    url,
    structuredMetaMap,
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///",
    structuredMetaMap: {
      a: {
        "file:///foo": true,
      },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///foo",
    structuredMetaMap: {
      a: {
        "file:///foo": true,
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
        "file:///a": true,
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
        "file:///a": true,
      },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a/b",
    structuredMetaMap: {
      a: {
        "file:///a": true,
      },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a/b.js",
    structuredMetaMap: {
      a: {
        "file:///a": true,
      },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///b/a",
    structuredMetaMap: {
      a: {
        "file:///b/a": true,
      },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///b/a.js",
    structuredMetaMap: {
      a: {
        "file:///b/a": true,
      },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///b/c",
    structuredMetaMap: {
      a: {
        "file:///b/a": true,
      },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///b/a/c",
    structuredMetaMap: {
      a: {
        "file:///b/a": true,
      },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///dist",
    structuredMetaMap: {
      a: {
        "file:///dist": 0,
      },
    },
  })
  const expected = { a: 0 }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a/dist",
    structuredMetaMap: {
      a: {
        "file:///dist": 0,
      },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

// ensure urlToMeta overrides in order (without sorting specifier keys by length)
{
  const actual = urlToMeta({
    url: "file:///abcd/",
    structuredMetaMap: {
      whatever: {
        "file:///a*/": 41,
        "file:///abcd/": 42,
      },
    },
  })
  const expected = { whatever: 42 }
  assert({ actual, expected })
}

try {
  urlToMeta({
    url: "file:///a/dist",
    structuredMetaMap: {
      a: {
        "file:///dist": 0,
      },
    },
    otherParameter: "whatever",
  })
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new Error(`received more parameters than expected.
--- name of unexpected parameters ---
otherParameter
--- name of expected parameters ---
url, structuredMetaMap`)
  assert({ actual, expected })
}

try {
  urlToMeta(undefined)
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new TypeError(`url must be a url string, got undefined`)
  assert({ actual, expected })
}
