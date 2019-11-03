# Url meta

[![github package](https://img.shields.io/github/package-json/v/jsenv/jsenv-url-meta.svg?logo=github&label=package)](https://github.com/jsenv/jsenv-url-meta/packages)
[![npm package](https://img.shields.io/npm/v/@jsenv/url-meta.svg?logo=npm&label=package)](https://www.npmjs.com/package/@jsenv/url-meta)
[![github ci](https://github.com/jsenv/jsenv-url-meta/workflows/ci/badge.svg)](https://github.com/jsenv/jsenv-url-meta/actions?workflow=ci)
[![codecov coverage](https://codecov.io/gh/jsenv/jsenv-url-meta/branch/master/graph/badge.svg)](https://codecov.io/gh/jsenv/jsenv-url-meta)

Associate data to urls using patterns.

## Table of contents

- [Presentation](#Presentation)
- [Code example](#code-example)
- [Pattern matching behaviour](#specifier-pattern-matching-behaviour)
- [api](#api)
  - [applySpecifierPatternMatching](#applySpecifierPatternMatching)
  - [metaMapToSpecifierMetaMap](#metaMapToSpecifierMetaMap)
  - [normalizeSpecifierMetaMap](#normalizeSpecifierMetaMap)
  - [urlCanContainsMetaMatching](#urlCanContainsMetaMatching)
  - [urlToMeta](#urlToMeta)
- [Installation](#installation)

## Presentation

`jsenv-url-meta` github repository corresponds to `@jsenv/url-meta` package published on github and npm package registries.

`@jsenv/url-meta` can be used to you associate any information to one or more url at once using pattern matching.

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

The table below gives an idea of how pattern matching behaves.

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

---

### applySpecifierPatternMatching

> `applySpecifierPatternMatching` is a function returning a `matchResult` indicating if and how a `specifier` matches an `url`.<br />

Implemented in [src/applySpecifierPatternMatching/applySpecifierPatternMatching.js](./src/applySpecifierPatternMatching/applySpecifierPatternMatching.js) and could be used as shown below.

```js
import { applySpecifierPatternMatching } from "@jsenv/url-meta"

const matchResult = applySpecifierPatternMatching({
  specifier: "file:///**/*",
  url: "file://Users/folder/file.js",
})
```

#### specifier

> `specifier` is a string looking like an url but where `*` and `**` can be used so that one specifier can match several url.

This parameter is **required**, an example value could be:

```js
"http://domain.com/**/*.js"
```

#### url

> `url` is a string representing a url.

This parameter is **required**, an example value could be:

```js
"http://domain.com/folder/file.js"
```

#### matchResult

> `matchResult` represents if and how `specifier` matches `url`.

It is returned by `applySpecifierPatternMatching`, an example value could be:

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

> `metaMapToSpecifierMetaMap` is a function used to convert a `metaMap` into a `specifierMetaMap`.<br />

Implemented in [src/metaMapToSpecifierMetaMap/metaMapToSpecifierMetaMap.js](./src/metaMapToSpecifierMetaMap/metaMapToSpecifierMetaMap.js), you can use it as shown below.

```js
import { metaMapToSpecifierMetaMap } from "@jsenv/url-meta"

const specifierMetaMap = metaMapToSpecifierMetaMap({
  visible: {
    "file:///**/*": true,
    "file://**/.git": false,
  },
})
```

#### metaMap

> `metaMap` is an object where values are conditionnaly applied by specifiers.

This parameter is **required**, an example value could be:

```js
{
  visible: {
    "file:///**/*": true,
    "file://**/.git": false,
  }
}
```

#### specifierMetaMap

> `specifierMetaMap` is an object where meta (other objects) are conditionnaly applied by specifier.

It is returned by `metaMapToSpecifierMetaMap`, an example value could be:

```js
{
  "file:///**/*": { visible: true },
  "file://**/.git": { visible: false },
}
```

---

### normalizeSpecifierMetaMap

> `normalizeSpecifierMetaMap` is a function resolving `specifierMetaMap` keys against an `url`

Implemented in [src/normalizeSpecifierMetaMap/normalizeSpecifierMetaMap.js](./src/normalizeSpecifierMetaMap/normalizeSpecifierMetaMap.js), you can use it as shown below.

```js
import { normalizeSpecifierMetaMap } from "@jsenv/url-meta"

const specifierMetaMapNormalized = normalizeSpecifierMetaMap(
  {
    "./**/*": { visible: true },
    "./**/.git": { visible: false },
  },
  "file:///Users/folder/",
)
```

### urlCanContainsMetaMatching

> `urlCanContainsMetaMatching` is a function designed to ignore folder content that would never have specific metas.

Implemented in [src/urlCanContainsMetaMatching/urlCanContainsMetaMatching.js](./src/urlCanContainsMetaMatching/urlCanContainsMetaMatching.js), you can use it as shown below.

```js
import { urlCanContainsMetaMatching } from "@jsenv/url-meta"

const specifierMetaMap = {
  "file:///**/*": {
    color: "blue",
  },
  "file:///**/node_modules": {
    color: "green",
  },
}
const bluePredicate = ({ color }) => color === "blue"

const urlA = "file:///src"
const urlB = "file:///node_modules/src"

console.log(
  `${urlA} can contains meta matching blue predicate: ${urlCanContainsMetaMatching({
    url: urlA,
    specifierMetaMap,
    predicate: bluePredicate,
  })}`,
)
console.log(
  `${urlB} can contains meta matching blue predicate: ${urlCanContainsMetaMatching({
    url: urlB,
    specifierMetaMap,
    predicate: bluePredicate,
  })}`,
)
```

Console output

```console
file:///src can contains meta matching blue predicate: true
file:///node_modules/src can contains meta matching blue predicate: false
```

### urlToMeta

> `urlToMeta` is a function returning an object being the composition of all object associated with a matching specifier.

Implemented in [src/urlToMeta/urlToMeta.js](./src/urlToMeta/urlToMeta.js), you can use it as shown below.

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

## Installation

If you have never installed a jsenv package, read [Installing a jsenv package](https://github.com/jsenv/jsenv-core/blob/master/docs/installing-jsenv-package.md#installing-a-jsenv-package) before going further.

This documentation is up-to-date with a specific version so prefer any of the following commands

```console
npm install --save-dev @jsenv/url-meta@4.0.0
```

```console
yarn add --dev @jsenv/url-meta@4.0.0
```
