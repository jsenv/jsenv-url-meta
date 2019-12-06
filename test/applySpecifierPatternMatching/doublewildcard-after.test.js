import { assert } from "@jsenv/assert"
import { applySpecifierPatternMatching } from "../../index.js"

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///a/**",
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
  const actual = applySpecifierPatternMatching({
    specifier: "file:///a/**",
    url: "file:///a/b",
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
    specifier: "file:///a/**",
    url: "file:///a/b/c",
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
    specifier: "file:///a/**",
    url: "file:///a/a.js",
  })
  const expected = {
    matched: true,
    index: 14,
    patternIndex: 12,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///a/**",
    url: "file:///a.js",
  })
  const expected = {
    matched: false,
    index: 9,
    patternIndex: 9,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///**",
    url: "file:///",
  })
  const expected = {
    matched: true,
    index: 8,
    patternIndex: 10,
  }
  assert({ actual, expected })
}
