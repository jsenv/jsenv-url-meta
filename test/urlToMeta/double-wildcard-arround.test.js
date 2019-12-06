import { assert } from "@jsenv/assert"
import { urlToMeta } from "../../index.js"

{
  const actual = urlToMeta({
    url: "file:///a",
    specifierMetaMap: {
      "file:///**/a/**": { a: true },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a/b",
    specifierMetaMap: {
      "file:///**/a/**": { a: true },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///b/a/c",
    specifierMetaMap: {
      "file:///**/a/**": { a: true },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}
