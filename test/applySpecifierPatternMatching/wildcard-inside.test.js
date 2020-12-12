import { assert } from "@jsenv/assert"
import { applyPatternMatching } from "@jsenv/url-meta"

{
  const actual = applyPatternMatching({
    pattern: "file:///a*bc",
    url: "file:///abc",
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
    pattern: "file:///a*bc",
    url: "file:///aZZbc",
  })
  const expected = {
    matched: true,
    index: 13,
    patternIndex: 12,
  }
  assert({ actual, expected })
}

{
  const actual = applyPatternMatching({
    pattern: "file:///a*bc",
    url: "file:///aZZbd",
  })
  const expected = {
    matched: false,
    index: 13,
    patternIndex: 11,
  }
  assert({ actual, expected })
}

{
  const actual = applyPatternMatching({
    pattern: "file:///a/b*/c",
    url: "file:///a/bZ/c",
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
    pattern: "file:///a/b*/c",
    url: "file:///a/b/c",
  })
  const expected = {
    matched: false,
    index: 11,
    patternIndex: 11,
  }
  assert({ actual, expected })
}
