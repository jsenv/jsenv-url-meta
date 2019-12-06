import { assert } from "@jsenv/assert"
import { applySpecifierPatternMatching } from "../../index.js"

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///a/**/b/c",
    url: "file:///a/b/c",
  })
  const expected = {
    matched: true,
    index: 13,
    patternIndex: 16,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///**.js",
    url: "file:///a.js",
  })
  const expected = {
    matched: true,
    index: 12,
    patternIndex: 13,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///**.js",
    url: "file:///.js",
  })
  const expected = {
    matched: true,
    index: 11,
    patternIndex: 13,
  }
  assert({ actual, expected })
}
