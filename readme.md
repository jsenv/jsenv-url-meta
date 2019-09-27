# Url meta

[![npm package](https://img.shields.io/npm/v/@jsenv/url-meta.svg)](https://www.npmjs.com/package/@jsenv/url-meta)
[![build](https://travis-ci.com/jsenv/jsenv-url-meta.svg?branch=master)](http://travis-ci.com/jsenv/jsenv-url-meta)
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
