import { assert } from "@jsenv/assert"
import { urlToMeta } from "../../index.js"

{
  const url = "file:///file"
  const specifierMetaMap = {
    "/file": true,
  }
  try {
    urlToMeta({
      url,
      specifierMetaMap,
    })
  } catch (actual) {
    const expected = new TypeError(
      `specifierMetaMap key must be a url and no scheme found, got /file`,
    )
    assert({ actual, expected })
  }
}

{
  const url = "file:///"
  const specifierMetaMap = {
    "file:///foo": true,
  }
  try {
    urlToMeta({
      url,
      specifierMetaMap,
    })
  } catch (actual) {
    const expected = new TypeError(
      `specifierMetaMap value must be a plain object or null, got true under key file:///foo`,
    )
    assert({ actual, expected })
  }
}

{
  const url = "file:///file"
  const specifierMetaMap = {
    "file:///*.js": { whatever: true },
    "file:///file.js": null,
  }

  const actual = urlToMeta({
    url,
    specifierMetaMap,
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///",
    specifierMetaMap: {
      "file:///foo": { a: true },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///foo",
    specifierMetaMap: {
      "file:///foo": { a: true },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a",
    specifierMetaMap: {
      "file:///a": { a: true },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a.js",
    specifierMetaMap: {
      "file:///a": { a: true },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a/b",
    specifierMetaMap: {
      "file:///a": { a: true },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a/b.js",
    specifierMetaMap: {
      "file:///a": { a: true },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///b/a",
    specifierMetaMap: {
      "file:///b/a": { a: true },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///b/a.js",
    specifierMetaMap: {
      "file:///b/a": { a: true },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///b/c",
    specifierMetaMap: {
      "file:///b/a": { a: true },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///b/a/c",
    specifierMetaMap: {
      "file:///b/a": { a: true },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///dist",
    specifierMetaMap: {
      "file:///dist": { a: 0 },
    },
  })
  const expected = { a: 0 }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a/dist",
    specifierMetaMap: {
      "file:///dist": { a: 0 },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

// ensure urlToMeta overrides in order (without sorting specifier keys by length)
{
  const actual = urlToMeta({
    url: "file:///abcd/",
    specifierMetaMap: {
      "file:///a*/": { whatever: 41 },
      "file:///abcd/": { whatever: 42 },
    },
  })
  const expected = { whatever: 42 }
  assert({ actual, expected })
}

try {
  urlToMeta({
    url: "file:///a/dist",
    specifierMetaMap: {
      "file:///dist": { a: 0 },
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
url, specifierMetaMap`)
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
