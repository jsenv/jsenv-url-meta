import { assert } from "@jsenv/assert"
import { urlToMeta } from "../../index.js"

{
  const actual = urlToMeta({
    url: "file:///file.js",
    specifierMetaMap: {
      "file:///**/*": { whatever: true },
      "file:///.git/": { whatever: false },
    },
  })
  const expected = { whatever: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///.git/file.js",
    specifierMetaMap: {
      "file:///**/*": { whatever: true },
      "file:///.git/": { whatever: false },
    },
  })
  const expected = { whatever: false }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///file.js",
    specifierMetaMap: {
      "file:///**/*": { whatever: false },
      "file:///*": { whatever: true },
    },
  })
  const expected = { whatever: true }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///.git/file.js",
    specifierMetaMap: {
      "file:///**/*": { whatever: false },
      "file:///*": { whatever: true },
    },
  })
  const expected = { whatever: false }
  assert({ actual, expected })
}
