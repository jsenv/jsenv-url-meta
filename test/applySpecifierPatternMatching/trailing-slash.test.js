import { assert } from "@jsenv/assert"
import { applyPatternMatching } from "@jsenv/url-meta"

{
  const actual = applyPatternMatching({
    pattern: "file:///a/",
    url: "file:///a/",
  })
  const expected = {
    matched: true,
    index: 10,
    patternIndex: 10,
  }
  assert({ actual, expected })
}

{
  const actual = applyPatternMatching({
    pattern: "file:///a/",
    url: "file:///a/b",
  })
  const expected = {
    matched: true,
    index: 11,
    patternIndex: 10,
  }
  assert({ actual, expected })
}

{
  const actual = applyPatternMatching({
    pattern: "file:///a/",
    url: "file:///a",
  })
  const expected = {
    matched: false,
    index: 9,
    patternIndex: 9,
  }
  assert({ actual, expected })
}

{
  const actual = applyPatternMatching({
    pattern: "file:///a",
    url: "file:///a/b.js",
  })
  const expected = {
    matched: false,
    index: 9,
    patternIndex: 9,
  }
  assert({ actual, expected })
}
