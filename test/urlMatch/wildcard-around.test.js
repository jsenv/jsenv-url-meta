import { assert } from "@dmail/assert"
import { pathnameMatch } from "../../index.js"

{
  const actual = pathnameMatch({ pattern: "/*a*", pathname: "/abc" })
  const expected = {
    matched: false,
    patternIndex: 1,
    pathnameIndex: 1,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/*a*", pathname: "/Za" })
  const expected = {
    matched: false,
    patternIndex: 3,
    pathnameIndex: 3,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/*a*", pathname: "/aZ" })
  const expected = {
    matched: false,
    patternIndex: 1,
    pathnameIndex: 1,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/*a*", pathname: "/ZZa" })
  const expected = {
    matched: false,
    patternIndex: 3,
    pathnameIndex: 4,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/*a*", pathname: "/aZZ" })
  const expected = {
    matched: false,
    patternIndex: 1,
    pathnameIndex: 1,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/*a*", pathname: "/ZaZ" })
  const expected = {
    matched: true,
    patternIndex: 4,
    pathnameIndex: 4,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/*a*", pathname: "/ZZaZZ" })
  const expected = {
    matched: true,
    patternIndex: 4,
    pathnameIndex: 6,
  }
  assert({ actual, expected })
}
