import { assert } from "@dmail/assert"
import { pathnameMatch } from "../../index.js"

{
  const actual = pathnameMatch({ pattern: "/a*", pathname: "/a" })
  const expected = {
    matched: false,
    patternIndex: 2,
    pathnameIndex: 2,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/a*", pathname: "/aZ" })
  const expected = {
    matched: true,
    patternIndex: 3,
    pathnameIndex: 3,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/a*", pathname: "/aZZZ" })
  const expected = {
    matched: true,
    patternIndex: 3,
    pathnameIndex: 5,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/a*", pathname: "/Za" })
  const expected = {
    matched: false,
    patternIndex: 1,
    pathnameIndex: 1,
  }
  assert({ actual, expected })
}
