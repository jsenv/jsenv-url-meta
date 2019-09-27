import { assert } from "@dmail/assert"
import { urlToMeta } from "../../index.js"

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
