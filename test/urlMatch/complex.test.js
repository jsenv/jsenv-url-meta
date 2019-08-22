import { assert } from "@dmail/assert"
import { urlMatch } from "../../index.js"

{
  const actual = urlMatch({ url: "file:///file.json", pattern: "file:///*.js" })
  const expected = {
    matched: false,
    index: 17,
    patternIndex: 12,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({ url: "file:///folder/file.js", pattern: "file:///**/*.js" })
  const expected = {
    matched: true,
    index: 22,
    patternIndex: 15,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({ url: "file:///folder/file.json", pattern: "file:///**/*.js" })
  const expected = {
    matched: false,
    index: 24,
    patternIndex: 15,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({ pattern: "file:///a/b*/c", url: "file:///a/bZ" })
  const expected = {
    matched: false,
    index: 12,
    patternIndex: 12,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({ url: "file:///folder/file.test.js", pattern: "file:///**/*.test.*" })
  const expected = {
    matched: true,
    index: 27,
    patternIndex: 19,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({
    url: "file:///file.es5.js/file.es5.js.map",
    pattern: "file:///**/*.js",
  })
  const expected = {
    matched: false,
    index: 35,
    patternIndex: 15,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({
    url: "file:///src/folder/file",
    pattern: "file:///src/**/*.js",
  })
  const expected = {
    matched: false,
    index: 23,
    patternIndex: 16,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({
    url: "file:///src/folder/file.js",
    pattern: "file:///src/**/*.js",
  })
  const expected = {
    matched: true,
    index: 26,
    patternIndex: 19,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({
    url: "file:///src/folder/file.json",
    pattern: "file:///src/**/*.js",
  })
  const expected = {
    matched: false,
    index: 28,
    patternIndex: 19,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({
    url: "file:///src/folder",
    pattern: "file:///src/**/*.js",
  })
  const expected = {
    matched: false,
    index: 18,
    patternIndex: 16,
  }
  assert({ actual, expected })
}
