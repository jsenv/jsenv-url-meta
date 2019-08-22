import { assert } from "@dmail/assert"
import { urlToMeta } from "../../index.js"

{
  const actual = urlToMeta({
    url: "file:///",
    metaMap: {
      "file:///foo": { a: true },
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
    url: "file:///foo",
    metaMap: {
      "file:///foo": { a: true },
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
      "file:///a": { a: true },
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
    url: "file:///a.js",
    metaMap: {
      "file:///a": { a: true },
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
    url: "file:///a/b",
    metaMap: {
      "file:///a": { a: true },
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
    url: "file:///a/b.js",
    metaMap: {
      "file:///a": { a: true },
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
    url: "file:///b/a",
    metaMap: {
      "file:///b/a": { a: true },
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
    url: "file:///b/a.js",
    metaMap: {
      "file:///b/a": { a: true },
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
    url: "file:///b/c",
    metaMap: {
      "file:///b/a": { a: true },
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
    url: "file:///b/a/c",
    metaMap: {
      "file:///b/a": { a: true },
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
    url: "file:///dist",
    metaMap: {
      "file:///dist": { a: 0 },
    },
  })
  const expected = { a: 0 }
  assert({
    actual,
    expected,
  })
}

{
  const actual = urlToMeta({
    url: "file:///a/dist",
    metaMap: {
      "file:///dist": { a: 0 },
    },
  })
  const expected = {}
  assert({
    actual,
    expected,
  })
}
