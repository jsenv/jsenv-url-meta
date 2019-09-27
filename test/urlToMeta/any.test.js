import { assert } from "@dmail/assert"
import { urlToMeta } from "../../index.js"

{
  const actual = urlToMeta({
    url: "file:///a",
    specifierMetaMap: {
      "file:///**/*": { a: true },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///node_modules",
    specifierMetaMap: {
      "file:///**/*": { a: true },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a",
    specifierMetaMap: {
      "file:///a/**/*.test.js": { a: true },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a/b.test.js",
    specifierMetaMap: {
      "file:///a/**/*.test.js": { a: true },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a/b.js",
    specifierMetaMap: {
      "file:///a/**/*.test.js": { a: true },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a/b/c.test.js",
    specifierMetaMap: {
      "file:///a/**/*.test.js": { a: true },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///index.test.js",
    specifierMetaMap: {
      "file:///**/*.js": { a: true },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}
