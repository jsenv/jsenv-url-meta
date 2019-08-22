import { assert } from "@dmail/assert"
import { pathnameMatch } from "../../index.js"

{
  const actual = pathnameMatch({ pattern: "/**/a/**/", pathname: "/a" })
  const expected = {
    matched: false,
    patternIndex: 5,
    pathnameIndex: 2,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/**/a/**/", pathname: "/a/b/c.js" })
  const expected = {
    matched: true,
    patternIndex: 9,
    pathnameIndex: 9,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/**/a/**/", pathname: "/b/a/c.js" })
  const expected = {
    matched: true,
    patternIndex: 9,
    pathnameIndex: 9,
  }
  assert({ actual, expected })
}
