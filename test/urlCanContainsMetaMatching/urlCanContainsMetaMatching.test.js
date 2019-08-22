import { assert } from "@dmail/assert"
import { urlCanContainsMetaMatching } from "../../index.js"

{
  const metaMap = {
    "file:///a/b": { a: true },
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a",
      metaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/c",
      metaMap,
      predicate: (meta) => meta.a,
    })
    const expected = false
    assert({ actual, expected })
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/b",
      metaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }
}

{
  const metaMap = {
    "file:///a/b*/c": { a: true },
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/bZ",
      metaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/bZ/c",
      metaMap,
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
  const metaMap = {
    "file:///a/**/b.js": { a: true },
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/b/c",
      metaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }
}

{
  const metaMap = {
    "file:///**/*": { a: true },
    "file:///node_modules/": { a: false }, // eslint-disable-line camelcase
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///node_modules",
      metaMap,
      predicate: (meta) => meta.a,
    })
    const expected = false
    assert({ actual, expected })
  }
}

{
  const metaMap = {
    "file:///**/*.js": { a: true },
    "file:///**/*.md": { a: false },
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///src",
      metaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }
}

{
  const metaMap = {
    "file:///**/*.js": { a: true },
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///src/folder",
      metaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///src/folder/subfolder",
      metaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }
}

{
  const metaMap = {
    "file:///src/**/*.js": { a: true },
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///src/jsCreateCompileService/compile",
      metaMap,
      predicate: (meta) => meta.a,
    })
    const expected = true
    assert({ actual, expected })
  }
}
