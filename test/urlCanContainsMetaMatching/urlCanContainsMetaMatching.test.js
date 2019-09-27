import { assert } from "@dmail/assert"
import { urlCanContainsMetaMatching } from "../../index.js"

{
  const specifierMetaMap = {
    "file:///a/b": { a: true },
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a",
      specifierMetaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/c",
      specifierMetaMap,
      predicate: (meta) => meta.a,
    })
    const expected = false
    assert({ actual, expected })
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/b",
      specifierMetaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }
}

{
  const specifierMetaMap = {
    "file:///a/b*/c": { a: true },
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/bZ",
      specifierMetaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/bZ/c",
      specifierMetaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({
      actual,
      expected,
    })
  }
}

{
  const specifierMetaMap = {
    "file:///a/**/b.js": { a: true },
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/b/c",
      specifierMetaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }
}

{
  const specifierMetaMap = {
    "file:///**/*": { a: true },
    "file:///node_modules/": { a: false }, // eslint-disable-line camelcase
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///node_modules",
      specifierMetaMap,
      predicate: (meta) => meta.a,
    })
    const expected = false
    assert({ actual, expected })
  }
}

{
  const specifierMetaMap = {
    "file:///**/*.js": { a: true },
    "file:///**/*.md": { a: false },
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///src",
      specifierMetaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }
}

{
  const specifierMetaMap = {
    "file:///**/*.js": { a: true },
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///src/folder",
      specifierMetaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///src/folder/subfolder",
      specifierMetaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }
}

{
  const specifierMetaMap = {
    "file:///src/**/*.js": { a: true },
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///src/jsCreateCompileService/compile",
      specifierMetaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }
}
