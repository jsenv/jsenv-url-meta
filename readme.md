# url-meta

Associate data to urls using patterns.

[![github package](https://img.shields.io/github/package-json/v/jsenv/jsenv-url-meta.svg?logo=github&label=package)](https://github.com/jsenv/jsenv-url-meta/packages)
[![npm package](https://img.shields.io/npm/v/@jsenv/url-meta.svg?logo=npm&label=package)](https://www.npmjs.com/package/@jsenv/url-meta)
[![github ci](https://github.com/jsenv/jsenv-url-meta/workflows/ci/badge.svg)](https://github.com/jsenv/jsenv-url-meta/actions?workflow=ci)
[![codecov coverage](https://codecov.io/gh/jsenv/jsenv-url-meta/branch/master/graph/badge.svg)](https://codecov.io/gh/jsenv/jsenv-url-meta)

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

`@jsenv/url-meta` can be used to associate value to urls. You can associate a value to many urls using pattern matching.

## Code example

```js
import { urlToMeta } from "@jsenv/url-meta"

// note how specifierMetaMap object below associates object to urls
const specifierMetaMap = {
  "http://example.com/*": {
    color: "black",
  },
  "http://example.com/*.js": {
    color: "red",
  },
}

const urlA = "http://example.com/file.json"
const urlAMeta = urlToMeta({ specifierMetaMap, url: urlA }).color
const urlB = "http://example.com/file.js"
const urlBMeta = urlToMeta({ specifierMetaMap, url: urlB }).color

console.log(`${urlA} color is ${urlAMeta.color}`)
console.log(`${urlB} color is ${urlBMeta.color}`)
```

Code above logs

```console
http://example.com/file.json color is black
http://example.com/file.js color is red
```

## Pattern matching behaviour

The table below gives an idea of how pattern matching behaves.

| specifier                              | url                                   | matches |
| -------------------------------------- | ------------------------------------- | ------- |
| `http://example.com/whatever`          | `http://example.com/whatever/file.js` | false   |
| `http://example.com/whatever/`         | `http://example.com/whatever/file.js` | true    |
| `http://example.com/whatever/*.js`     | `http://example.com/whatever/file.js` | true    |
| `http://example.com/whatever/**/*.js`  | `http://example.com/whatever/file.js` | true    |
| `http://example.com/**/*.js`           | `http://example.com/whatever/file.js` | true    |
| `http://example.com/whatever/file.js`  | `http://example.com/whatever/file.js` | true    |
| `http://example.com/whatever/file.jsx` | `http://example.com/whatever/file.js` | false   |

## api

`@jsenv/url-meta` api is documented here.

---

### applySpecifierPatternMatching

> `applySpecifierPatternMatching` is a function returning a `matchResult` indicating if and how a `specifier` matches an `url`.<br />

Implemented in [src/applySpecifierPatternMatching.js](./src/applySpecifierPatternMatching.js) and could be used as shown below.

```js
import { applySpecifierPatternMatching } from "@jsenv/url-meta"

const matchResult = applySpecifierPatternMatching({
  specifier: "file:///**/*",
  url: "file://Users/directory/file.js",
})

console.log(matchResult.matched)
```

Logs

```console
true
```

#### specifier

> `specifier` is a string looking like an url but where `*` and `**` can be used so that one specifier can match several url.

This parameter is **required**, an example value could be:

```js
"http://example.com/**/*.js"
```

#### url

> `url` is a string representing a url.

This parameter is **required**, an example value could be:

```js
"http://example.com/directory/file.js"
```

#### matchResult

> `matchResult` represents if and how `specifier` matches `url`.

It is returned by `applySpecifierPatternMatching`, see below some example.

##### Matching example

```js
applySpecifierPatternMatching({
  specifier: "file:///**/*",
  url: "file://Users/directory/file.js",
})
```

Returns

```js
{
  matched: true,
  index: 31,
  patternIndex: 12,
}
```

Meaning `specifier` fully matched `url`.

##### Failing example

```js
applySpecifierPatternMatching({
  specifier: "file:///*.js",
  url: "file:///file.jsx",
})
```

Returns

```js
{
  matched: false,
  index: 14,
  patternIndex: 14,
}
```

Meaning `specifier` partially matched `url` until comparing `url[14]` with `specifier[14]`

---

### metaMapToSpecifierMetaMap

> `metaMapToSpecifierMetaMap` is a function used to convert a `metaMap` into a `specifierMetaMap`.<br />

Implemented in [src/metaMapToSpecifierMetaMap.js](./src/metaMapToSpecifierMetaMap.js), you can use it as shown below.

```js
import { metaMapToSpecifierMetaMap } from "@jsenv/url-meta"

metaMapToSpecifierMetaMap({
  show: {
    "file:///**/*": "yes",
    "file://**/.git/": "no",
  },
  format: {
    "file:///**/*.js": "yes",
    "file:///**/*.json": "yes",
    "file://**/.git/": "no",
  },
})
```

Returns

```js
{
  "file:///**/*": { show: "yes" },
  "file://**/.git": { show: "no", format: "no" },
  "file:///**/*.js": { show: "yes", format: "yes" },
  "file:///**/*.json": { show: "yes", format: "yes" },
}
```

#### metaMap

> `metaMap` is an object where values are conditionnaly applied by specifiers.

This parameter is **required**.

#### specifierMetaMap

> `specifierMetaMap` is an object where meta (other objects) are conditionnaly applied by specifier.

It is returned by `metaMapToSpecifierMetaMap`.

---

### normalizeSpecifierMetaMap

> `normalizeSpecifierMetaMap` is a function resolving `specifierMetaMap` keys against an `url`

Implemented in [src/normalizeSpecifierMetaMap.js](./src/normalizeSpecifierMetaMap.js), you can use it as shown below.

```js
import { normalizeSpecifierMetaMap } from "@jsenv/url-meta"

const specifierMetaMapNormalized = normalizeSpecifierMetaMap(
  {
    "./**/*/": { visible: true },
    "./**/.git/": { visible: false },
  },
  "file:///Users/directory/",
)
```

### urlCanContainsMetaMatching

> `urlCanContainsMetaMatching` is a function designed to ignore directory content that would never have specific metas.

Implemented in [src/urlCanContainsMetaMatching.js](./src/urlCanContainsMetaMatching.js), you can use it as shown below.

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

const urlA = "file:///src/"
const urlACan = urlCanContainsMetaMatching({
  url: urlA,
  specifierMetaMap,
  predicate: bluePredicate,
})
const urlB = "file:///node_modules/src/"
const urlBCan = urlCanContainsMetaMatching({
  url: urlB,
  specifierMetaMap,
  predicate: bluePredicate,
})

console.log(`${urlA} can contains meta matching blue predicate: ${urlACan}`)
console.log(`${urlB} can contains meta matching blue predicate: ${urlBCan}`)
```

Console output

```console
file:///src/ can contains meta matching blue predicate: true
file:///node_modules/src/ can contains meta matching blue predicate: false
```

### urlToMeta

> `urlToMeta` is a function returning an object being the composition of all object associated with a matching specifier.

Implemented in [src/urlToMeta.js](./src/urlToMeta.js), you can use it as shown below.

```js
import { urlToMeta } from "@jsenv/url-meta"

const specifierMetaMap = {
  "file:///src/": {
    insideSrc: true,
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
  "insideSrc": true,
  "extensionIsJs": true,
}
file:///src/file.json: {
  "insideSrc": true
}
```

## Installation

If you have never installed a jsenv package, read [Installing a jsenv package](https://github.com/jsenv/jsenv-core/blob/master/docs/installing-jsenv-package.md#installing-a-jsenv-package) before going further.

This documentation is up-to-date with a specific version so prefer any of the following commands

```console
npm install --save-dev @jsenv/url-meta@4.1.0
```

```console
yarn add --dev @jsenv/url-meta@4.1.0
```
