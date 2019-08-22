import { assert } from "@dmail/assert"
import { pathnameMatch } from "../../index.js"

{
  const actual = pathnameMatch({ pattern: "/a/**", pathname: "/a" })
  const expected = {
    matched: false,
    patternIndex: 2,
    pathnameIndex: 2,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/a/**", pathname: "/a/b" })
  const expected = {
    matched: true,
    patternIndex: 5,
    pathnameIndex: 4,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/a/**", pathname: "/a/b/c" })
  const expected = {
    matched: true,
    patternIndex: 5,
    pathnameIndex: 6,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/a/**", pathname: "/a/a.js" })
  const expected = {
    matched: true,
    patternIndex: 5,
    pathnameIndex: 7,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/a/**", pathname: "/a.js" })
  const expected = {
    matched: false,
    patternIndex: 2,
    pathnameIndex: 2,
  }
  assert({ actual, expected })
}
