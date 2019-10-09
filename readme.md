# Url meta

[![github package](https://img.shields.io/github/package-json/v/jsenv/jsenv-url-meta.svg?label=package&logo=github)](https://github.com/jsenv/jsenv-url-meta/packages)
[![workflow status](https://github.com/jsenv/jsenv-url-meta/workflows/continuous%20testing/badge.svg)](https://github.com/jsenv/jsenv-url-meta/actions?workflow=continuous+testing)
[![codecov](https://codecov.io/gh/jsenv/jsenv-url-meta/branch/master/graph/badge.svg)](https://codecov.io/gh/jsenv/jsenv-url-meta)

## Table of contents

- [Specifier pattern matching behaviour](#specifier-pattern-matching-behaviour)
- [applySpecifierPatternMatching](#applySpecifierPatternMatching)
  - [specifier](#specifier)
  - [url](#url)
  - [matchResult](#matchResult)
- [metaMapToSpecifierMetaMap](#metaMapToSpecifierMetaMap)
  - [metaMap](#metaMap)
- [normalizeSpecifierMetaMap](#normalizeSpecifierMetaMap)
  - [forceHttpResolutionForFile](#forceHttpResolutionForFile)
- [urlCanContainsMetaMatching](#urlCanContainsMetaMatching)
  - [predicate](#predicate)
- [urlToMeta](#urlToMeta)
- [Installation](#installation)

## Specifier pattern matching behaviour

The table below gives an idea of pattern matching behaviour.<br />
You may also read associated [unit tests](./test/applySpecifierPatternMatching/) to understand how it behaves.

| specifier          | url                                | matches |
| ------------------ | ---------------------------------- | ------- |
| `/folder`          | `http://domain.com/folder/file.js` | false   |
| `/folder/*.js`     | `http://domain.com/folder/file.js` | true    |
| `/folder/**/*.js`  | `http://domain.com/folder/file.js` | true    |
| `/**/*.js`         | `http://domain.com/folder/file.js` | true    |
| `/folder/file.js`  | `http://domain.com/folder/file.js` | true    |
| `/folder/file.jsx` | `http://domain.com/folder/file.js` | false   |

## applySpecifierPatternMatching

> `applySpecifierPatternMatching` is a function returning a `matchResult` object representing if a `specifier` matches an `url`.

```js
import { applySpecifierPatternMatching } from "@jsenv/url-meta"

const matchResult = applySpecifierPatternMatching({
  specifier: "file:///**/*",
  url: "file://Users/folder/file.js",
})
```

— see [source code on github](./src/applySpecifierPatternMatching/applySpecifierPatternMatching.js)

### specifier

> `specifier` parameter is a string looking like an url but where `*` and `**` can be used so that one specifier can match several url.

This parameter is **required**, an example value could be:

```js
"http://domain.com/**/*.js"
```

---

### url

> `url` parameter is a string representing a url.

This parameter is **required**, an example value could be:

```js
"http://domain.com/folder/file.js"
```

---

### matchResult

> `matchResult` is an object returned by `applySpecifierPatternMatching` representing if and how `specifier` matches `url`.

A `matchResult` could be:

```js
{
  matched: false,
  index: 4,
  patternIndex: 1
}
```

Meaning `url` partially matched `specifier` until character at index 4 that failed to match `specifier` character at index 1.

Or

```js
{
  matched: true,
  index: 4,
  patternIndex: 1
}
```

Meaning `url` fully matched `specifier`.

---

## metaMapToSpecifierMetaMap

> `metaMapToSpecifierMetaMap` is a function returning a `specifierMetaMap` from a `metaMap`.

```js
import { metaMapToSpecifierMetaMap } from "@jsenv/url-meta"

const specifierMetaMap = metaMapToSpecifierMetaMap({
  visible: {
    "file:///**/*": true,
    "file://**/.git": false,
  },
})
```

— see [source code on github](./src/metaMapToSpecifierMetaMap/metaMapToSpecifierMetaMap.js)

This function is an helper to convert a `metaMap` into a `specifierMetaMap`.

### metaMap

> `metaMap` parameter is an object where values are conditionnaly applied by specifiers.

This parameter is **required**, an example value could be:

```js
{
  visible: {
    "file:///**/*": true,
    "file://**/.git": false,
  }
}
```

---

### specifierMetaMap

> `specifierMetaMap` is an object returned by `metaMapToSpecifierMetaMap` where meta (other objects) are conditionnaly apply by specifier.

A `specifierMetaMap` could be

```js
{
  "file:///**/*": { visible: true },
  "file://**/.git": { visible: false },
}
```

## normalizeSpecifierMetaMap

> `normalizeSpecifierMetaMap` is a function taking (`specifierMetaMap`, `url`) and returning a `specifierMetaMapNormalized` which is a `specifierMetaMap` resolved against `url`.

```js
import { normalizeSpecifierMetaMap } from "@jsenv/url-meta"

const specifierMetaMapNormalized = normalizeSpecifierMetaMap(
  {
    "/**/*": { visible: true },
    "/**/.git": { visible: false },
  },
  "file:///Users/folder",
  { forceHttpResolutionForFile: true },
)
```

— see [source code on github](./src/normalizeSpecifierMetaMap/normalizeSpecifierMetaMap.js)

This function allow you have a relative `specifierMetaMap` that you can resolve when you want against an `url`.

### forceHttpResolutionForFile

> `forceHttpResolutionForFile` parameter controls if http resolution method should be used even if the `url` scheme is `file`.

This parameter is optionnal, the default value is:

```js
false
```

| specifier | url                  | resolution forced to http    | standard resolution |
| --------- | -------------------- | ---------------------------- | ------------------- |
| /file.js  | file:///Users/folder | file:///Users/folder/file.js | file:///file.js     |

## Installation

If you never installed a jsenv package, read [Installing a jsenv package](https://github.com/jsenv/jsenv-core/blob/master/docs/installing-jsenv-package.md#installing-a-jsenv-package) before going further.

This documentation is up-to-date with a specific version so prefer any of the following commands

```console
npm install --save-dev @jsenv/import-map@5.8.2
```

```console
yarn add --dev @jsenv/import-map@5.8.2
```
