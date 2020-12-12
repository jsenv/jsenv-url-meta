import { assert } from "@jsenv/assert"
import { applyPatternMatching } from "@jsenv/url-meta"

{
  const actual = applyPatternMatching({
    pattern: "file:///*a",
    url: "file:///a",
  })
  const expected = {
    matched: false,
    index: 8,
    patternIndex: 8,
  }
  assert({ actual, expected })
}

{
  const actual = applyPatternMatching({
    pattern: "file:///*a",
    url: "file:///Za",
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
    pattern: "file:///*a",
    url: "file:///ZZZa",
  })
  const expected = {
    matched: true,
    index: 12,
    patternIndex: 10,
  }
  assert({ actual, expected })
}

{
  const actual = applyPatternMatching({
    pattern: "file:///*a",
    url: "file:///aZ",
  })
  const expected = {
    matched: false,
    index: 8,
    patternIndex: 8,
  }
  assert({ actual, expected })
}
