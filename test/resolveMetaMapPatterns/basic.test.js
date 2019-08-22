import { assert } from "@dmail/assert"
import { resolveMetaMapPatterns } from "../../index.js"

{
  const actual = resolveMetaMapPatterns(
    {
      "/a.js": { whatever: true },
      "http://example.com/file.js": { whatever: true },
    },
    "file:///User/name/folder",
  )
  const expected = {
    "file:///User/name/folder/a.js": { whatever: true },
    "http://example.com/file.js": { whatever: true },
  }
  assert({ actual, expected })
}
