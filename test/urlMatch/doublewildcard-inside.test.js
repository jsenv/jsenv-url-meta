import { assert } from "@dmail/assert"
import { urlMatch } from "../../index.js"

{
  const actual = urlMatch({ pattern: "file:///a/**/b/c", url: "file:///a/b/c" })
  const expected = {
    matched: true,
    index: 13,
    patternIndex: 16,
  }
  assert({ actual, expected })
}
