import { assert } from "@dmail/assert"
import { urlToMeta } from "../../index.js"

{
  const actual = urlToMeta({
    url: "file:///a",
    metaMap: {
      "file:///a/**": { a: true },
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
      "file:///a/**": { a: true },
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
    url: "file:///a/b/c",
    metaMap: {
      "file:///a/**": { a: true },
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
    url: "file:///a/a.js",
    metaMap: {
      "file:///a/**": { a: true },
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
      "file:///a/**": { a: true },
    },
  })
  const expected = {}
  assert({
    actual,
    expected,
  })
}
