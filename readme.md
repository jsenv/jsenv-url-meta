# Url meta

[![github package](https://img.shields.io/github/package-json/v/jsenv/jsenv-url-meta.svg?label=package&logo=github)](https://github.com/jsenv/jsenv-url-meta/packages)
[![workflow status](https://github.com/jsenv/jsenv-url-meta/workflows/continuous%20testing/badge.svg)](https://github.com/jsenv/jsenv-url-meta/actions?workflow=continuous+testing)
[![codecov](https://codecov.io/gh/jsenv/jsenv-url-meta/branch/master/graph/badge.svg)](https://codecov.io/gh/jsenv/jsenv-url-meta)

## Introduction

`@jsenv/url-meta` let you associate some information to one or more url at once using pattern matching.

## Table of contents

- [Code example](#code-example)
- [Pattern matching behaviour](#specifier-pattern-matching-behaviour)
- [api](#api)
  - [applySpecifierPatternMatching](#applySpecifierPatternMatching)
  - [metaMapToSpecifierMetaMap](#metaMapToSpecifierMetaMap)
  - [normalizeSpecifierMetaMap](#normalizeSpecifierMetaMap)
  - [urlCanContainsMetaMatching](#urlCanContainsMetaMatching)
  - [urlToMeta](#urlToMeta)
- [Installation](#installation)

## Code example

```js
import { urlToMeta } from "@jsenv/url-meta"

const specifierMetaMap = {
  "http://your-domain.com/*": {
    fromYourDomain: true,
    color: "black",
  },
  "http://your-domain.com/*.js": {
    color: "red",
  },
}

const urlA = "http://your-domain.com/file.json"
const urlB = "http://your-domain.com/file.js"

const urlAMeta = urlToMeta({ specifierMetaMap, url: urlA })
const urlBMeta = urlToMeta({ specifierMetaMap, url: urlB })

console.log(`${urlA}: ${JSON.stringify(urlAMeta, null, "  ")}`)
console.log(`${urlB}: ${JSON.stringify(urlBMeta, null, "  ")}`)
```

Code above logs

```console
http://your-domain.com/file.json: {
  "fromYourDomain": true,
  "color": "black",
}
http://your-domain.com/file.js: {
  "fromYourDomain": true,
  "color": "red",
}
```

## Pattern matching behaviour

The table below gives an idea of how pattern matching behaves.<br />
You may also read associated [unit tests](./test/applySpecifierPatternMatching/) to see the possibilities.

| specifier          | url                                | matches |
| ------------------ | ---------------------------------- | ------- |
| `/folder`          | `http://domain.com/folder/file.js` | false   |
| `/folder/*.js`     | `http://domain.com/folder/file.js` | true    |
| `/folder/**/*.js`  | `http://domain.com/folder/file.js` | true    |
| `/**/*.js`         | `http://domain.com/folder/file.js` | true    |
| `/folder/file.js`  | `http://domain.com/folder/file.js` | true    |
| `/folder/file.jsx` | `http://domain.com/folder/file.js` | false   |

## api

`@jsenv/url-meta` api is documented here.

### applySpecifierPatternMatching

> `applySpecifierPatternMatching` can be used to know if and how a `specifier` matches an `url`.

```js
import { applySpecifierPatternMatching } from "@jsenv/url-meta"

const matchResult = applySpecifierPatternMatching({
  specifier: "file:///**/*",
  url: "file://Users/folder/file.js",
})
```

— see [source code on github](./src/applySpecifierPatternMatching/applySpecifierPatternMatching.js)

#### specifier

> `specifier` parameter is a string looking like an url but where `*` and `**` can be used so that one specifier can match several url.

This parameter is **required**, an example value could be:

```js
"http://domain.com/**/*.js"
```

---

#### url

> `url` parameter is a string representing a url.

This parameter is **required**, an example value could be:

```js
"http://domain.com/folder/file.js"
```

---

#### matchResult

> `matchResult` are returned by `applySpecifierPatternMatching` to represent if and how `specifier` matches `url`.

A `matchResult` could be:

```js
{
  matched: false,
  index: 4,
  patternIndex: 1
}
```

Meaning `specifier` partially matched `url`.

Or

```js
{
  matched: true,
  index: 4,
  patternIndex: 1
}
```

Meaning `specifier` full matched `url`.

---

### metaMapToSpecifierMetaMap

> `metaMapToSpecifierMetaMap` is an helper to convert a `metaMap` into a `specifierMetaMap`.

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

#### metaMap

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

#### specifierMetaMap

> `specifierMetaMap` is an object returned by `metaMapToSpecifierMetaMap` where meta (other objects) are conditionnaly apply by specifier.

A `specifierMetaMap` could be

```js
{
  "file:///**/*": { visible: true },
  "file://**/.git": { visible: false },
}
```

### normalizeSpecifierMetaMap

> `normalizeSpecifierMetaMap` allow you have a relative `specifierMetaMap` that you can resolve when you want against an `url`.

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

#### forceHttpResolutionForFile

> `forceHttpResolutionForFile` parameter controls if http resolution method should be used even if the `url` scheme is `file`.

This parameter is optionnal, the default value is:

```js
false
```

| specifier | url                  | resolution forced to http    | standard resolution |
| --------- | -------------------- | ---------------------------- | ------------------- |
| /file.js  | file:///Users/folder | file:///Users/folder/file.js | file:///file.js     |

### urlCanContainsMetaMatching

> `urlCanContainsMetaMatching` was designed to ignore folder content that would never have specific metas.

```js
import { urlCanContainsMetaMatching } from "@jsenv/url-meta"

const specifierMetaMap = {
  "file:///**/*": {
    source: true,
  },
  "file:///**/node_modules": {
    source: false,
  },
}
const predicate = ({ source }) => source === true

const urlA = "file:///node_modules/src"
const urlB = "file:///src"

console.log(
  `${urlA} can contains meta matching source: ${urlCanContainsMetaMatching({
    url: urlA,
    specifierMetaMap,
    predicate,
  })}`,
)
console.log(
  `${urlB} can contains meta matching source: ${urlCanContainsMetaMatching({
    url: urlB,
    specifierMetaMap,
    predicate,
  })}`,
)
```

Console output

```console
file:///node_modules/src can contains meta matching source: false
file:///src can contains meta matching source: true
```

— see [source code on github](./src/urlCanContainsMetaMatching/urlCanContainsMetaMatching.js)

### urlCanContainsMetaMatching

> `urlToMeta` returns an object being the composition of all object associated with a matching specifier.

```js
import { urlToMeta } from "@jsenv/url-meta"

const specifierMetaMap = {
  "file:///src": {
    insideSrcDirectory: true,
  },
  "file:///**/*.js": {
    extensionIsJs: true,
  },
}

const urlA = "file:///src/file.js"
const urlB = "file:///src/file.json"

console.log(`${urlA}: ${JSON.stringify(urlToMeta({ url: urlA, specifierMetaMap }), null, "  ")}`)
console.log(`${urlB}: ${JSON.stringify(urlToMeta({ url: urlB, specifierMetaMap }), null, "  ")}`)
```

Console output

```console
file:///src/file.js: {
  "insideSrcDirectory": true,
  "extensionIsJs": true,
}
file:///src/file.json: {
  "insideSrcDirectory": true
}
```

— see [source code on github](./src/urlToMeta/urlToMeta.js)

## Installation

If you never installed a jsenv package, read [Installing a jsenv package](https://github.com/jsenv/jsenv-core/blob/master/docs/installing-jsenv-package.md#installing-a-jsenv-package) before going further.

This documentation is up-to-date with a specific version so prefer any of the following commands

```console
npm install --save-dev @jsenv/import-map@5.8.2
```

```console
yarn add --dev @jsenv/import-map@5.8.2
```
