import { assert } from "@jsenv/assert"
import { urlCanContainsMetaMatching } from "../../index.js"

const meta = { whatever: 42 }
const metaOverride = { whatever: 43 }
const predicate = ({ whatever }) => whatever === 42

{
  const specifierMetaMap = {
    "file:///a/b/": meta,
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/",
      specifierMetaMap,
      predicate,
    })
    const expected = true
    assert({ actual, expected })
  }
  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/b/",
      specifierMetaMap,
      predicate,
    })
    const expected = true
    assert({ actual, expected })
  }
  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/c/",
      specifierMetaMap,
      predicate,
    })
    const expected = false
    assert({ actual, expected })
  }
}

{
  const specifierMetaMap = {
    "file:///a/b*/c/": meta,
  }
  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/bZ/",
      specifierMetaMap,
      predicate,
    })
    const expected = true
    assert({ actual, expected })
  }
  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///a/bZ/c/",
      specifierMetaMap,
      predicate,
    })
    const expected = true
    assert({ actual, expected })
  }
}

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///a/b/c/",
    specifierMetaMap: { "file:///a/**/b.js": meta },
    predicate,
  })
  const expected = true
  assert({ actual, expected })
}

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///node_modules/",
    specifierMetaMap: {
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
    specifierMetaMap: {
      "file:///**/*.js": meta,
      "file:///**/*.md": metaOverride,
    },
    predicate,
  })
  const expected = true
  assert({ actual, expected })
}

{
  const specifierMetaMap = {
    "file:///**/*.js": meta,
  }

  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///src/folder/",
      specifierMetaMap,
      predicate,
    })
    const expected = true
    assert({ actual, expected })
  }
  {
    const actual = urlCanContainsMetaMatching({
      url: "file:///src/folder/subfolder/",
      specifierMetaMap,
      predicate,
    })
    const expected = true
    assert({ actual, expected })
  }
}

{
  const actual = urlCanContainsMetaMatching({
    url: "file:///src/jsCreateCompileService/compile/",
    specifierMetaMap: {
      "file:///src/**/*.js": meta,
    },
    predicate,
  })
  const expected = true
  assert({ actual, expected })
}
