import { assert } from "@jsenv/assert"
import { applySpecifierPatternMatching } from "../../index.js"

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///a*",
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
    specifier: "file:///a*",
    url: "file:///aZ",
  })
  const expected = {
    matched: true,
    index: 10,
    patternIndex: 10,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///a*",
    url: "file:///aZZZ",
  })
  const expected = {
    matched: true,
    index: 12,
    patternIndex: 10,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///a*",
    url: "file:///Za",
  })
  const expected = {
    matched: false,
    index: 8,
    patternIndex: 8,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///a*",
    url: "file:///a/",
  })
  const expected = {
    matched: false,
    index: 9,
    patternIndex: 10,
  }
  assert({ actual, expected })
}
