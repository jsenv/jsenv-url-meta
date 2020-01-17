import { assert } from "@jsenv/assert"
import { applySpecifierPatternMatching } from "../../index.js"

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///.git/",
    url: "file:///.github/",
  })
  const expected = {
    matched: false,
    index: 12,
    patternIndex: 12,
  }
  assert({ actual, expected })
}

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

try {
  applySpecifierPatternMatching({
    specifier: "file:///bar.js",
    url: "file:///foo.js",
    foo: "foo",
  })
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new Error(`received more parameters than expected.
--- name of unexpected parameters ---
foo
--- name of expected parameters ---
specifier, url`)
  assert({ actual, expected })
}

try {
  applySpecifierPatternMatching(undefined)
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new TypeError(`specifier must be a url string, got undefined`)
  assert({ actual, expected })
}
