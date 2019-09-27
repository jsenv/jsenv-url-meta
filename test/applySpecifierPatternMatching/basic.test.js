import { assert } from "@dmail/assert"
import { applySpecifierPatternMatching } from "../../index.js"

try {
  applySpecifierPatternMatching({
    specifier: 10,
  })
  throw new Error("should throw")
} catch (actual) {
  const expected = new TypeError("specifier must be a url string, got 10")
  assert({ actual, expected })
}

try {
  applySpecifierPatternMatching({
    specifier: "C://Users/folder/file.js",
  })
  throw new Error("should throw")
} catch (actual) {
  const expected = new TypeError(
    "specifier must be a url but looks like a windows pathname, got C://Users/folder/file.js",
  )
  assert({ actual, expected })
}

try {
  applySpecifierPatternMatching({
    specifier: "hello",
  })
  throw new Error("should throw")
} catch (actual) {
  const expected = new TypeError("specifier must be a url and no scheme found, got hello")
  assert({ actual, expected })
}

try {
  applySpecifierPatternMatching({
    specifier: "http://",
    url: 10,
  })
  throw new Error("should throw")
} catch (actual) {
  const expected = new TypeError("url must be a url string, got 10")
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///foo.js",
    url: "file:///foo.js",
  })
  const expected = {
    matched: true,
    index: 14,
    patternIndex: 14,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "http:///foo.js",
    url: "file:///foo.js",
  })
  const expected = {
    matched: false,
    index: 0,
    patternIndex: 0,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///bar.js",
    url: "file:///foo.js",
  })
  const expected = {
    matched: false,
    index: 8,
    patternIndex: 8,
  }
  assert({ actual, expected })
}
