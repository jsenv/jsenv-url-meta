import { assert } from "@dmail/assert"
import { urlCanContainsMetaMatching } from "../../index.js"

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///src",
    metaMap: {
      "file:///**/*": { whatever: true },
      "file:///.git/": { whatever: false },
    },
    predicate: ({ whatever }) => whatever,
  })
  const expected = true
  assert({ actual, expected })
}

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///.git",
    metaMap: {
      "file:///**/*": { whatever: true },
      "file:///.git/": { whatever: false },
    },
    predicate: ({ whatever }) => whatever,
  })
  const expected = false
  assert({ actual, expected })
}
