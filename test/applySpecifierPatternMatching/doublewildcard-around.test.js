import { assert } from "@jsenv/assert"
import { applyPatternMatching } from "@jsenv/url-meta"

{
  const actual = applyPatternMatching({
    pattern: "file:///**/a/**/",
    url: "file:///a",
  })
  const expected = {
    matched: false,
    index: 9,
    patternIndex: 12,
  }
  assert({ actual, expected })
}

{
  const actual = applyPatternMatching({
    pattern: "file:///**/a/**/",
    url: "file:///a/b/c.js",
  })
  const expected = {
    matched: true,
    index: 16,
    patternIndex: 16,
  }
  assert({ actual, expected })
}

{
  const actual = applyPatternMatching({
    pattern: "file:///**/a/**/",
    url: "file:///b/a/c.js",
  })
  const expected = {
    matched: true,
    index: 16,
    patternIndex: 16,
  }
  assert({ actual, expected })
}
