import { assert } from "@dmail/assert"
import { urlToMeta } from "../../index.js"

{
  const actual = urlToMeta({
    url: "file:///a",
    specifierMetaMap: {
      "file:///**/a": { a: true },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///b/a",
    specifierMetaMap: {
      "file:///**/a": { a: true },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///c/b/a",
    specifierMetaMap: {
      "file:///**/a": { a: true },
    },
  })
  const expected = { a: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///a.js",
    specifierMetaMap: {
      "file:///**/a": { a: true },
    },
  })
  const expected = {}
  assert({ actual, expected })
}
