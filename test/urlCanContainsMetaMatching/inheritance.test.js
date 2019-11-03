import { assert } from "@dmail/assert"
import { urlToMeta } from "../../index.js"

const urlCanContainsMetaMatching = ({ url, specifierMetaMap, predicate }) => {
  const meta = urlToMeta({ url, specifierMetaMap })
  return predicate(meta)
}
{
  const actual = urlCanContainsMetaMatching({
    url: "file:///src/",
    specifierMetaMap: {
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
    url: "file:///.git/",
    specifierMetaMap: {
      "file:///**/*": { whatever: true },
      "file:///.git/": { whatever: false },
    },
    predicate: ({ whatever }) => whatever,
  })
  const expected = false
  assert({ actual, expected })
}
