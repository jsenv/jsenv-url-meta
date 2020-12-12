import { assert } from "@jsenv/assert"
import { urlCanContainsMetaMatching } from "@jsenv/url-meta"

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///.github/",
    structuredMetaMap: {
      source: {
        "file:///**/.github/": true,
        "file:///**/.git/": false,
      },
    },
    predicate: ({ source }) => source,
  })
  const expected = true
  assert({ actual, expected })
}

const predicate = ({ whatever }) => whatever === 42

{
  const structuredMetaMap = {
    whatever: {
      "file:///a/b/": 42,
    },
  }
  const predicate = ({ whatever }) => whatever === 42

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/",
      structuredMetaMap,
      predicate,
    })
    const expected = true
    assert({ actual, expected })
  }
  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/b/",
      structuredMetaMap,
      predicate,
    })
    const expected = true
    assert({ actual, expected })
  }
  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/c/",
      structuredMetaMap,
      predicate,
    })
    const expected = false
    assert({ actual, expected })
  }
}

{
  const structuredMetaMap = {
    whatever: {
      "file:///a/b*/c/": 42,
    },
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/bZ/",
      structuredMetaMap,
      predicate,
    })
    const expected = true
    assert({ actual, expected })
  }
  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/bZ/c/",
      structuredMetaMap,
      predicate,
    })
    const expected = true
    assert({ actual, expected })
  }
}

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///a/b/c/",
    structuredMetaMap: {
      whatever: {
        "file:///a/**/b.js": 42,
      },
    },
    predicate,
  })
  const expected = true
  assert({ actual, expected })
}

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///node_modules/",
    structuredMetaMap: {
      whatever: {
        "file:///**/*": 42,
        "file:///node_modules/": 43,
      },
    },
    predicate,
  })
  const expected = false
  assert({ actual, expected })
}

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///src/",
    structuredMetaMap: {
      whatever: {
        "file:///**/*.js": 42,
        "file:///**/*.md": 43,
      },
    },
    predicate,
  })
  const expected = true
  assert({ actual, expected })
}

{
  const structuredMetaMap = {
    whatever: {
      "file:///**/*.js": 42,
    },
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///src/folder/",
      structuredMetaMap,
      predicate,
    })
    const expected = true
    assert({ actual, expected })
  }
  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///src/folder/subfolder/",
      structuredMetaMap,
      predicate,
    })
    const expected = true
    assert({ actual, expected })
  }
}

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///src/jsCreateCompileService/compile/",
    structuredMetaMap: {
      whatever: {
        "file:///src/**/*.js": 42,
      },
    },
    predicate,
  })
  const expected = true
  assert({ actual, expected })
}
