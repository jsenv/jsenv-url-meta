import { assert } from "@jsenv/assert"
import { urlCanContainsMetaMatching } from "@jsenv/url-meta"

const meta = { whatever: 42 }
const metaOverride = { whatever: 43 }
const predicate = ({ whatever }) => whatever === 42

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///.github/",
    structuredMetaMap: {
      "file:///**/.github/": { source: true },
      "file:///**/.git/": { source: false },
    },
    predicate: ({ source }) => source,
  })
  const expected = true
  assert({ actual, expected })
}

{
  const structuredMetaMap = {
    "file:///a/b/": meta,
  }

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
    "file:///a/b*/c/": meta,
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
    structuredMetaMap: { "file:///a/**/b.js": meta },
    predicate,
  })
  const expected = true
  assert({ actual, expected })
}

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///node_modules/",
    structuredMetaMap: {
      "file:///**/*": meta,
      "file:///node_modules/": metaOverride,
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
      "file:///**/*.js": meta,
      "file:///**/*.md": metaOverride,
    },
    predicate,
  })
  const expected = true
  assert({ actual, expected })
}

{
  const structuredMetaMap = {
    "file:///**/*.js": meta,
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
      "file:///src/**/*.js": meta,
    },
    predicate,
  })
  const expected = true
  assert({ actual, expected })
}
