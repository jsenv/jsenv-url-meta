import { assert } from "@dmail/assert"
import { pathnameMatch } from "../../index.js"

{
  const actual = pathnameMatch({ pattern: "/a*bc", pathname: "/abc" })
  const expected = {
    matched: false,
    patternIndex: 2,
    pathnameIndex: 2,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/a*bc", pathname: "/aZZbc" })
  const expected = {
    matched: true,
    patternIndex: 5,
    pathnameIndex: 6,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/a*bc", pathname: "/aZZbd" })
  const expected = {
    matched: false,
    patternIndex: 4,
    pathnameIndex: 6,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/a/b*/c", pathname: "/a/bZ/c" })
  const expected = {
    matched: true,
    patternIndex: 7,
    pathnameIndex: 7,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/a/b*/c", pathname: "/a/b/c" })
  const expected = {
    matched: false,
    patternIndex: 4,
    pathnameIndex: 4,
  }
  assert({ actual, expected })
}
