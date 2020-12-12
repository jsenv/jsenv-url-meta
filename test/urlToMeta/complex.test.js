import { assert } from "@jsenv/assert"
import { urlToMeta } from "@jsenv/url-meta"

{
  const actual = urlToMeta({
    url: "file:///file.es5.js/file.es5.js.map",
    structuredMetaMap: {
      js: {
        "file:///**/*.js": true,
      },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///file.es5.js/file.es5.js.map",
    structuredMetaMap: {
      js: {
        "file:///**/*.js": true,
        "file:///**/*.js/**": false,
      },
    },
  })
  const expected = { js: false }
  assert({ actual, expected })
}

{
  const actual = urlToMeta({
    url: "file:///file.js.map",
    structuredMetaMap: {
      js: {
        "file:///**/*.js": true,
      },
    },
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const structuredMetaMap = {
    format: {
      "file:///**/*.js": true,
      "file:///**/*.jsx": true,
      "file:///build": false,
      "file:///src/exception.js": false,
    },
  }

  {
    const actual = urlToMeta({ url: "file:///index.js", structuredMetaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///src/file.js", structuredMetaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///src/folder/file.js", structuredMetaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///index.test.js", structuredMetaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///src/file.test.js", structuredMetaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///src/folder/file.test.js", structuredMetaMap })
    const expected = { format: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ url: "file:///src/exception.js", structuredMetaMap })
    const expected = { format: false }
    assert({ actual, expected })
  }
}

{
  const structuredMetaMap = {
    cover: {
      "file:///index.js": true,
      "file:///src/**/*.js": true,
      "file:///src/**/*.jsx": true,
      "file:///**/*.test.js": false,
      "file:///**/*.test.jsx": false,
      "file:///build/": false,
      "file:///src/exception.js": false,
    },
  }

  {
    const actual = urlToMeta({ structuredMetaMap, url: "file:///index.js" })
    const expected = { cover: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ structuredMetaMap, url: "file:///src/file.js" })
    const expected = { cover: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ structuredMetaMap, url: "file:///src/folder/file.js" })
    const expected = { cover: true }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ structuredMetaMap, url: "file:///index.test.js" })
    const expected = { cover: false }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ structuredMetaMap, url: "file:///src/file.test.js" })
    const expected = { cover: false }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ structuredMetaMap, url: "file:///src/folder/file.test.js" })
    const expected = { cover: false }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ structuredMetaMap, url: "file:///build/index.js" })
    const expected = { cover: false }
    assert({ actual, expected })
  }

  {
    const actual = urlToMeta({ structuredMetaMap, url: "file:///src/exception.js" })
    const expected = { cover: false }
    assert({ actual, expected })
  }
}
