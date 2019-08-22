import { assert } from "@dmail/assert"
import { pathnameMatch } from "../../index.js"

{
  const actual = pathnameMatch({ pattern: "/**/a", pathname: "/a" })
  const expected = {
    matched: true,
    patternIndex: 5,
    pathnameIndex: 2,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/**/a/", pathname: "/a" })
  const expected = {
    matched: false,
    patternIndex: 5,
    pathnameIndex: 2,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/**/a", pathname: "/b/a" })
  const expected = {
    matched: true,
    patternIndex: 5,
    pathnameIndex: 4,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/**/a", pathname: "/c/b/a" })
  const expected = {
    matched: true,
    patternIndex: 5,
    pathnameIndex: 6,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/**/a", pathname: "/a.js" })
  const expected = {
    matched: false,
    patternIndex: 5,
    pathnameIndex: 5,
  }
  assert({ actual, expected })
}
