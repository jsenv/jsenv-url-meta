import { assert } from "@dmail/assert"
import { urlMatch } from "../../index.js"

{
  const actual = urlMatch({ pattern: "file:///a/", url: "file:///a/b" })
  const expected = {
    matched: true,
    index: 11,
    patternIndex: 10,
  }
  assert({ actual, expected })
}
