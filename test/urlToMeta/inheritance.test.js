import { assert } from "@dmail/assert"
import { urlToMeta } from "../../index.js"

{
  const actual = urlToMeta({
    url: "file:///file.js",
    metaMap: {
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
    metaMap: {
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
    metaMap: {
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
    metaMap: {
      "file:///**/*": { whatever: false },
      "file:///*": { whatever: true },
    },
  })
  const expected = { whatever: false }
  assert({ actual, expected })
}
