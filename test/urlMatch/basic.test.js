import { assert } from "@dmail/assert"
import { urlMatch } from "../../index.js"

try {
  urlMatch({ pattern: 10 })
  throw new Error("should throw")
} catch (actual) {
  const expected = new TypeError("pattern must be a string, got 10")
  assert({ actual, expected })
}

try {
  urlMatch({ pattern: "hello" })
  throw new Error("should throw")
} catch (actual) {
  const expected = new Error("pattern must have a scheme, got hello")
  assert({ actual, expected })
}

try {
  urlMatch({ pattern: "http://", url: 10 })
  throw new Error("should throw")
} catch (actual) {
  const expected = new TypeError("url must be a string, got 10")
  assert({ actual, expected })
}

try {
  urlMatch({ pattern: "http://", url: "hello" })
  throw new Error("should throw")
} catch (actual) {
  const expected = new Error("url must have a scheme, got hello")
  assert({ actual, expected })
}

{
  const actual = urlMatch({ pattern: "file:///foo.js", url: "file:///foo.js" })
  const expected = {
    matched: true,
    index: 14,
    patternIndex: 14,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({ pattern: "http:///foo.js", url: "file:///foo.js" })
  const expected = {
    matched: false,
    index: 0,
    patternIndex: 0,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({ pattern: "file:///bar.js", url: "file:///foo.js" })
  const expected = {
    matched: false,
    index: 8,
    patternIndex: 8,
  }
  assert({ actual, expected })
}
