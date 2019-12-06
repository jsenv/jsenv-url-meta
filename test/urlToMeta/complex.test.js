import { assert } from "@jsenv/assert"
import { urlToMeta } from "../../index.js"

{
  const actual = urlToMeta({
    url: "file:///file.es5.js/file.es5.js.map",
    specifierMetaMap: {
      "file:///**/*.js": { js: true },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///file.es5.js/file.es5.js.map",
    specifierMetaMap: {
      "file:///**/*.js": { js: true },
      "file:///**/*.js/**": { js: false },
    },
  })
  const expected = { js: false }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///file.js.map",
    specifierMetaMap: {
      "file:///**/*.js": { js: true },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const specifierMetaMap = {
    "file:///**/*.js": { format: true },
    "file:///**/*.jsx": { format: true },
    "file:///build": { format: false },
    "file:///src/exception.js": { format: false },
  }

  {
    const actual = urlToMeta({ url: "file:///index.js", specifierMetaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///src/file.js", specifierMetaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///src/folder/file.js", specifierMetaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///index.test.js", specifierMetaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///src/file.test.js", specifierMetaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///src/folder/file.test.js", specifierMetaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///src/exception.js", specifierMetaMap })
    const expected = { format: false }
    assert({ actual, expected })
  }
}

{
  const specifierMetaMap = {
    "file:///index.js": { cover: true },
    "file:///src/**/*.js": { cover: true },
    "file:///src/**/*.jsx": { cover: true },
    "file:///**/*.test.js": { cover: false },
    "file:///**/*.test.jsx": { cover: false },
    "file:///build/": { cover: false },
    "file:///src/exception.js": { cover: false },
  }

  {
    const actual = urlToMeta({ specifierMetaMap, url: "file:///index.js" })
    const expected = { cover: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ specifierMetaMap, url: "file:///src/file.js" })
    const expected = { cover: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ specifierMetaMap, url: "file:///src/folder/file.js" })
    const expected = { cover: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ specifierMetaMap, url: "file:///index.test.js" })
    const expected = { cover: false }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ specifierMetaMap, url: "file:///src/file.test.js" })
    const expected = { cover: false }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ specifierMetaMap, url: "file:///src/folder/file.test.js" })
    const expected = { cover: false }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ specifierMetaMap, url: "file:///build/index.js" })
    const expected = { cover: false }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ specifierMetaMap, url: "file:///src/exception.js" })
    const expected = { cover: false }
    assert({ actual, expected })
  }
}
