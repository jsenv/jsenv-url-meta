import { assert } from "@dmail/assert"
import { applySpecifierPatternMatching } from "../../index.js"

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///a/",
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
  const actual = applySpecifierPatternMatching({
    specifier: "file:///a",
    url: "file:///a/b",
  })
  const expected = {
    matched: false,
    index: 9,
    patternIndex: 9,
  }
  assert({ actual, expected })
}
