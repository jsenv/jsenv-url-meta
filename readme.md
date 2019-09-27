# Url meta

[![github package](https://img.shields.io/github/package-json/v/jsenv/jsenv-url-meta.svg?label=package&logo=github)](https://github.com/jsenv/jsenv-url-meta/packages)
[![ci status](https://github.com/jsenv/jsenv-url-meta/workflows/ci/badge.svg)](https://github.com/jsenv/jsenv-url-meta/actions)
[![codecov](https://codecov.io/gh/jsenv/jsenv-url-meta/branch/master/graph/badge.svg)](https://codecov.io/gh/jsenv/jsenv-url-meta)

> Associate meta to url using pattern.

## Example

```js
import { urlToMeta } from "@jsenv/url-meta"

const specifierMetaMap = {
  "file:///**/*.js": {
    extension: "js",
  },
  "file:///**/*.json": {
    extension: "json",
  },
  "file:///file.js": {
    foo: true,
  },
}

urlToMeta({ url: "file:///file.js", specifierMetaMap }) // { extension: "js", foo: true }
urlToMeta({ url: "file:///file.json", specifierMetaMap }) // { extension: "json" }
```
