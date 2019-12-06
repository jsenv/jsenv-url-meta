import { assert } from "@jsenv/assert"
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

try {
  urlCanContainsMetaMatching({
    url: "file:///.git",
    specifierMetaMap: {
      "file:///**/*": meta,
      "file:///.git/": metaOverride,
    },
    predicate,
  })
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new Error(`url should end with /, got file:///.git`)
  assert({ actual, expected })
}

try {
  urlCanContainsMetaMatching({
    url: "file:///.git/",
    specifierMetaMap: {
      "file:///**/*": meta,
      "file:///.git/": metaOverride,
    },
    predicate: "I'm a string",
  })
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new TypeError(`predicate must be a function, got I'm a string`)
  assert({ actual, expected })
}

try {
  urlCanContainsMetaMatching({
    url: "file:///.git/",
    specifierMetaMap: {
      "file:///**/*": meta,
      "file:///.git/": metaOverride,
    },
    predicate,
    otherParameter: "whatever",
  })
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new Error(`received more parameters than expected.
--- name of unexpected parameters ---
otherParameter
--- name of expected parameters ---
url, specifierMetaMap, predicate`)
  assert({ actual, expected })
}
