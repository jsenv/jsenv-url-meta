import { assert } from "@dmail/assert"
import { normalizeSpecifierMetaMap } from "../../index.js"

{
  const actual = normalizeSpecifierMetaMap(
    {
      "./a.js": { whatever: true },
      "http://example.com/file.js": { whatever: true },
    },
    "file:///User/name/directory/",
  )
  const expected = {
    "file:///User/name/directory/a.js": { whatever: true },
    "http://example.com/file.js": { whatever: true },
  }
  assert({ actual, expected })
}

// ensure normalizeSpecifierMetaMap does not sort by length
{
  const actual = normalizeSpecifierMetaMap(
    {
      "./a.js": 42,
      "./long.js": 42,
    },
    "file:///",
  )
  const expected = {
    "file:///a.js": 42,
    "file:///long.js": 42,
  }
  assert({ actual, expected })
}
