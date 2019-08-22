import { assert } from "@dmail/assert"
import { pathnameMatch } from "../../index.js"

{
  const actual = pathnameMatch({ pathname: "/file.json", pattern: "/*.js" })
  const expected = {
    matched: false,
    patternIndex: 5,
    pathnameIndex: 10,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pathname: "/folder/file.js", pattern: "/**/*.js" })
  const expected = {
    matched: true,
    patternIndex: 8,
    pathnameIndex: 15,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pathname: "/folder/file.json", pattern: "/**/*.js" })
  const expected = {
    matched: false,
    patternIndex: 8,
    pathnameIndex: 17,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pattern: "/a/b*/c", pathname: "/a/bZ" })
  const expected = {
    matched: false,
    patternIndex: 5,
    pathnameIndex: 5,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pathname: "/folder/file.test.js", pattern: "/**/*.test.*" })
  const expected = {
    matched: true,
    patternIndex: 12,
    pathnameIndex: 20,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pathname: "/file.es5.js/file.es5.js.map", pattern: "/**/*.js" })
  const expected = {
    matched: false,
    patternIndex: 8,
    pathnameIndex: 28,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({
    pathname: "/src/folder/file",
    pattern: "/src/**/*.js",
  })
  const expected = {
    matched: false,
    patternIndex: 9,
    pathnameIndex: 16,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({
    pathname: "/src/folder/file.js",
    pattern: "/src/**/*.js",
  })
  const expected = {
    matched: true,
    patternIndex: 12,
    pathnameIndex: 19,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({
    pathname: "/src/folder/file.json",
    pattern: "/src/**/*.js",
  })
  const expected = {
    matched: false,
    patternIndex: 12,
    pathnameIndex: 21,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({
    pathname: "/src/folder",
    pattern: "/src/**/*.js",
  })
  const expected = {
    matched: false,
    patternIndex: 9,
    pathnameIndex: 11,
  }
  assert({ actual, expected })
}
