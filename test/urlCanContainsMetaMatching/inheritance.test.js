import { assert } from "@dmail/assert"
import { urlCanContainsMetaMatching } from "../../index.js"

const meta = { whatever: 42 }
const metaOverride = { whatever: 43 }
const predicate = ({ whatever }) => whatever === 42

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///src/",
    specifierMetaMap: {
      "file:///**/*": meta,
      "file:///.git/": metaOverride,
    },
    predicate,
  })
  const expected = true
  assert({ actual, expected })
}

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///.git/",
    specifierMetaMap: {
      "file:///**/*": meta,
      "file:///.git/": metaOverride,
    },
    predicate,
  })
  const expected = false
  assert({ actual, expected })
}
