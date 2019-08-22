import { assert } from "@dmail/assert"
import { urlMatch } from "../../index.js"

{
  const actual = urlMatch({ url: "file:///foo.js", pattern: "file:///foo.js" })
  const expected = {
    matched: true,
    index: 7,
    patternIndex: 7,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({ url: "file:///foo.js", pattern: "file:///bar.js" })
  const expected = {
    matched: false,
    index: 1,
    patternIndex: 1,
  }
  assert({ actual, expected })
}
