import { assert } from "@jsenv/assert"
import { applyPatternMatching } from "@jsenv/url-meta"

{
  const actual = applyPatternMatching({
    pattern: "file:///.git/",
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
  applyPatternMatching({
    pattern: 10,
  })
  throw new Error("should throw")
} catch (actual) {
  const expected = new TypeError("pattern must be a url string, got 10")
  assert({ actual, expected })
}

try {
  applyPatternMatching({
    pattern: "C://Users/folder/file.js",
  })
  throw new Error("should throw")
} catch (actual) {
  const expected = new TypeError(
    "pattern must be a url but looks like a windows pathname, got C://Users/folder/file.js",
  )
  assert({ actual, expected })
}

try {
  applyPatternMatching({
    pattern: "hello",
  })
  throw new Error("should throw")
} catch (actual) {
  const expected = new TypeError("pattern must be a url and no scheme found, got hello")
  assert({ actual, expected })
}

try {
  applyPatternMatching({
    pattern: "http://",
    url: 10,
  })
  throw new Error("should throw")
} catch (actual) {
  const expected = new TypeError("url must be a url string, got 10")
  assert({ actual, expected })
}

{
  const actual = applyPatternMatching({
    pattern: "file:///foo.js",
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
  const actual = applyPatternMatching({
    pattern: "http:///foo.js",
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
  const actual = applyPatternMatching({
    pattern: "file:///bar.js",
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
  applyPatternMatching({
    pattern: "file:///bar.js",
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
pattern, url`)
  assert({ actual, expected })
}

try {
  applyPatternMatching(undefined)
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new TypeError(`pattern must be a url string, got undefined`)
  assert({ actual, expected })
}
