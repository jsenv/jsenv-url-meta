import { assert } from "@jsenv/assert"
import { applySpecifierPatternMatching } from "../../index.js"

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///**/a",
    url: "file:///a",
  })
  const expected = {
    matched: true,
    index: 9,
    patternIndex: 12,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///**/a/",
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
  const actual = applySpecifierPatternMatching({
    specifier: "file:///**/a",
    url: "file:///b/a",
  })
  const expected = {
    matched: true,
    index: 11,
    patternIndex: 12,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///**/a",
    url: "file:///c/b/a",
  })
  const expected = {
    matched: true,
    index: 13,
    patternIndex: 12,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///**/a",
    url: "file:///a.js",
  })
  const expected = {
    matched: false,
    index: 12,
    patternIndex: 12,
  }
  assert({ actual, expected })
}
