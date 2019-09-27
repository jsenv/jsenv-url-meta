import { assert } from "@dmail/assert"
import { applySpecifierPatternMatching } from "../../index.js"

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///*.js",
    url: "file:///file.json",
  })
  const expected = {
    matched: false,
    index: 17,
    patternIndex: 12,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///**/*.js",
    url: "file:///folder/file.js",
  })
  const expected = {
    matched: true,
    index: 22,
    patternIndex: 15,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///**/*.js",
    url: "file:///folder/file.json",
  })
  const expected = {
    matched: false,
    index: 24,
    patternIndex: 15,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///a/b*/c",
    url: "file:///a/bZ",
  })
  const expected = {
    matched: false,
    index: 12,
    patternIndex: 12,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///**/*.test.*",
    url: "file:///folder/file.test.js",
  })
  const expected = {
    matched: true,
    index: 27,
    patternIndex: 19,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///**/*.js",
    url: "file:///file.es5.js/file.es5.js.map",
  })
  const expected = {
    matched: false,
    index: 35,
    patternIndex: 15,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///src/**/*.js",
    url: "file:///src/folder/file",
  })
  const expected = {
    matched: false,
    index: 23,
    patternIndex: 16,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///src/**/*.js",
    url: "file:///src/folder/file.js",
  })
  const expected = {
    matched: true,
    index: 26,
    patternIndex: 19,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///src/**/*.js",
    url: "file:///src/folder/file.json",
  })
  const expected = {
    matched: false,
    index: 28,
    patternIndex: 19,
  }
  assert({ actual, expected })
}

{
  const actual = applySpecifierPatternMatching({
    specifier: "file:///src/**/*.js",
    url: "file:///src/folder",
  })
  const expected = {
    matched: false,
    index: 18,
    patternIndex: 16,
  }
  assert({ actual, expected })
}
