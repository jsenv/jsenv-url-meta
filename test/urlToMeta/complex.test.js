import { assert } from "@dmail/assert"
import { urlToMeta } from "../../index.js"

{
  const actual = urlToMeta({
    url: "file:///file.es5.js/file.es5.js.map",
    metaMap: {
      "file:///**/*.js": { js: true },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///file.es5.js/file.es5.js.map",
    metaMap: {
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
    metaMap: {
      "file:///**/*.js": { js: true },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const metaMap = {
    "file:///**/*.js": { format: true },
    "file:///**/*.jsx": { format: true },
    "file:///build": { format: false },
    "file:///src/exception.js": { format: false },
  }

  {
    const actual = urlToMeta({ url: "file:///index.js", metaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///src/file.js", metaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///src/folder/file.js", metaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///index.test.js", metaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///src/file.test.js", metaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///src/folder/file.test.js", metaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///src/exception.js", metaMap })
    const expected = { format: false }
    assert({ actual, expected })
  }
}

{
  const metaMap = {
    "file:///index.js": { cover: true },
    "file:///src/**/*.js": { cover: true },
    "file:///src/**/*.jsx": { cover: true },
    "file:///**/*.test.js": { cover: false },
    "file:///**/*.test.jsx": { cover: false },
    "file:///build/": { cover: false },
    "file:///src/exception.js": { cover: false },
  }

  {
    const actual = urlToMeta({ metaMap, url: "file:///index.js" })
    const expected = { cover: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ metaMap, url: "file:///src/file.js" })
    const expected = { cover: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ metaMap, url: "file:///src/folder/file.js" })
    const expected = { cover: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ metaMap, url: "file:///index.test.js" })
    const expected = { cover: false }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ metaMap, url: "file:///src/file.test.js" })
    const expected = { cover: false }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ metaMap, url: "file:///src/folder/file.test.js" })
    const expected = { cover: false }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ metaMap, url: "file:///build/index.js" })
    const expected = { cover: false }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ metaMap, url: "file:///src/exception.js" })
    const expected = { cover: false }
    assert({ actual, expected })
  }
}
