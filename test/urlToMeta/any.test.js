import { assert } from "@dmail/assert"
import { urlToMeta } from "../../index.js"

{
  const actual = urlToMeta({
    url: "file:///a",
    metaMap: {
      "file:///**/*": { a: true },
    },
  })
  const expected = { a: true }
  assert({
    actual,
    expected,
  })
}

{
  const actual = urlToMeta({
    url: "file:///node_modules",
    metaMap: {
      "file:///**/*": { a: true },
    },
  })
  const expected = { a: true }
  assert({
    actual,
    expected,
  })
}

{
  const actual = urlToMeta({
    url: "file:///a",
    metaMap: {
      "file:///a/**/*.test.js": { a: true },
    },
  })
  const expected = {}
  assert({
    actual,
    expected,
  })
}

{
  const actual = urlToMeta({
    url: "file:///a/b.test.js",
    metaMap: {
      "file:///a/**/*.test.js": { a: true },
    },
  })
  const expected = { a: true }
  assert({
    actual,
    expected,
  })
}

{
  const actual = urlToMeta({
    url: "file:///a/b.js",
    metaMap: {
      "file:///a/**/*.test.js": { a: true },
    },
  })
  const expected = {}
  assert({
    actual,
    expected,
  })
}

{
  const actual = urlToMeta({
    url: "file:///a/b/c.test.js",
    metaMap: {
      "file:///a/**/*.test.js": { a: true },
    },
  })
  const expected = { a: true }
  assert({
    actual,
    expected,
  })
}

{
  const actual = urlToMeta({
    url: "file:///index.test.js",
    metaMap: {
      "file:///**/*.js": { a: true },
    },
  })
  const expected = { a: true }
  assert({
    actual,
    expected,
  })
}
