import { assert } from "@dmail/assert"
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
