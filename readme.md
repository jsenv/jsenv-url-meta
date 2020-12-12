# url-meta

Associate data to urls using patterns.

[![github package](https://img.shields.io/github/package-json/v/jsenv/jsenv-url-meta.svg?logo=github&label=package)](https://github.com/jsenv/jsenv-url-meta/packages)
[![npm package](https://img.shields.io/npm/v/@jsenv/url-meta.svg?logo=npm&label=package)](https://www.npmjs.com/package/@jsenv/url-meta)
[![github ci](https://github.com/jsenv/jsenv-url-meta/workflows/ci/badge.svg)](https://github.com/jsenv/jsenv-url-meta/actions?workflow=ci)
[![codecov coverage](https://codecov.io/gh/jsenv/jsenv-url-meta/branch/master/graph/badge.svg)](https://codecov.io/gh/jsenv/jsenv-url-meta)

## Table of contents

- [Presentation](#Presentation)
- [Installation](#Installation)
- [Terminology](#Terminology)
- [Pattern matching](#pattern-matching)
- [applyPatternMatching](#applyPatternMatching)
- [normalizeStructuredMetaMap](#normalizeStructuredMetaMap)
- [urlCanContainsMetaMatching](#urlCanContainsMetaMatching)
- [urlToMeta](#urlToMeta)

# Presentation

`@jsenv/url-meta` allows to associate value to urls using pattern matching.

```js
import { urlToMeta } from "@jsenv/url-meta"

// conditionally associates url and values
const metaMap = {
  color: {
    "file:///*": "black",
    "file:///*.js": "red",
  },
}

const urlToColor = (url) => {
  return urlToMeta({ url, metaMap }).color
}

console.log(`file.json color is ${urlToColor("file:///file.json")}`)
console.log(`file.js color is ${urlToColor("file:///file.js")}`)
```

Code above logs

```console
file.json color is black
file.js color is red
```

# Installation

```console
npm install @jsenv/url-meta
```

Can be used in browsers and Node.js.

> Should work with node 12.8+. Other versions are not tested.

# Terminology

This part introduces some words used in this codebase and documentation.

## metaMap

A `metaMap` is an object composed by `pattern` and `meta`. A `pattern` is a string like `file:///*.js` and `meta` is an object where you can put what you want.

A `metaMap` object example:

```json
{
  "**/*": { "visible": true },
  "**/.git": { "visible": false }
}
```

> The object above can be translated into the following sentence: all files are visible except files in `.git` directory.

<details>
  <summary>metaMap namings</summary>

> Name of variables in the code below corresponds to terminology used in the codebase and documentation.

```js
const pattern = "**/*"
const meta = { visible: true }
const metaMap = {
  [pattern]: meta,
}
```

</details>

## structuredMetaMap

A `structuredMetaMap` is an object composed by `metaProperty` and `metaValueMap`. `metaValueMap` are themselves composed by `pattern` and `metaValue`. `structuredMetaMap` is an other way of associating ,meta to urls.

A `structuredMetaMap` example:

```json
{
  "visible": {
    "**/*/": true,
    "**/.git/": false
  }
}
```

> `structuredMetaMap` format helps to structure the logic. As a consequence, it is the format used by our apis.

<details>
  <summary>structuredMetaMap namings</summary>

> Name of variables in the code below corresponds to terminology used in the codebase and documentation.

```js
const pattern = "**/*/"
const metaProperty = "visible"
const metaValue = true
const metaValueMap = {
  [pattern]: metaValue,
}
const structuredMetaMap = {
  [metaProperty]: metaValueMap,
}
```

</details>

# Pattern matching

<details>
  <summary>Pattern matching example</summary>

Some example of pattern applied to `file:///whatever/file.js`

| pattern                     | matches |
| --------------------------- | ------- |
| `file:///whatever`          | false   |
| `file:///whatever/`         | true    |
| `file:///whatever/*.js`     | true    |
| `file:///whatever/**/*.js`  | true    |
| `file:///**/*.js`           | true    |
| `file:///whatever/file.js`  | true    |
| `file:///whatever/file.jsx` | false   |

</details>

<details>
  <summary>Common pattern example</summary>

| pattern            | Description                          |
| ------------------ | ------------------------------------ |
| `**/`              | Everything                           |
| `*/**/`            | Inside a directory                   |
| `**/.*/`           | Inside directory starting with a dot |
| `**/node_modules/` | Inside `node_modules` directory      |
| `**/*.map`         | Ending with `.map`                   |
| `**/*.test.*`      | Contains `test`                      |

> `**/` and `**/*` are equivalent

More examples that should be rarely used in practice:

| specifier | Description                   |
| --------- | ----------------------------- |
| `*/*`     | Inside a directory of depth 1 |

</details>

# applyPatternMatching

`applyPatternMatching` is a function returning a `matchResult` indicating if and how a `pattern` matches an `url`.

<details>
  <summary>applyPatternMatching code example</summary>

```js
import { applyPatternMatching } from "@jsenv/url-meta"

const matchResult = applyPatternMatching({
  pattern: "file:///**/*",
  url: "file://Users/directory/file.js",
})

matchResult.matched // true
```

— source code at [src/applyPatternMatching.js](./src/applyPatternMatching.js).

</details>

## pattern

`pattern` parameter is a string looking like an url but where `*` and `**` can be used so that one specifier can match several url. This parameter is **required**.

## url

`url` parameter is a string representing a url. This parameter is **required**.

## matchResult

`matchResult` represents if and how a `pattern` matches an `url`.

<details>
  <summary>matchResult example</summary>

```js
const fullMatch = applyPatternMatching({
  pattern: "file:///**/*",
  url: "file://Users/directory/file.js",
})
fullMatch // { matched: true, index: 31, patternIndex: 12 }
```

> fullMatch object indicates `pattern` fully matched `url`.

```js
const partialMatch = applyPatternMatching({
  pattern: "file:///*.js",
  url: "file:///file.jsx",
})
partialMatch // { matched: false, index: 14, patternIndex: 14 }
```

> partialMatch object indicates `pattern` matched `url` until comparing `url[14]` with `pattern[14]`.

</details>

# normalizeStructuredMetaMap

`normalizeStructuredMetaMap` is a function resolving a `structuredMetaMap` against an `url`.

<details>
  <summary>normalizeStructuredMetaMap code example</summary>

```js
import { normalizeStructuredMetaMap } from "@jsenv/url-meta"

const structuredMetaMapNormalized = normalizeStructuredMetaMap(
  {
    visible: {
      "**/*/": true,
      "**/.git/": false,
    },
  },
  "file:///Users/directory/",
)
console.log(JSON.stringify(structuredMetaMapNormalized, null, "  "))
```

```json
{
  "visible": {
    "file:///Users/directory/**/*/": true,
    "file:///Users/directory/**/.git/": false
  }
}
```

— source code at [src/normalizeStructuredMetaMap.js](./src/normalizeStructuredMetaMap.js).

</details>

# urlCanContainsMetaMatching

`urlCanContainsMetaMatching` is a function designed to ignore directory content that would never have specific metas.

<details>
  <summary>urlCanContainsMetaMatching code example</summary>

```js
import { urlCanContainsMetaMatching } from "@jsenv/url-meta"

const structuredMetaMap = {
  color: {
    "file:///**/*": "blue",
    "file:///**/node_modules/": "green",
  },
}

const firstUrlCanHaveFilesWithColorBlue = urlCanContainsMetaMatching({
  url: "file:///src/",
  specifierMetaMap,
  predicate: ({ color }) => color === "blue",
})
firstUrlCanHaveFilesWithColorBlue // true

const secondUrlCanHaveFileWithColorBlue = urlCanContainsMetaMatching({
  url: "file:///node_modules/src/",
  specifierMetaMap,
  predicate: ({ color }) => color === "blue",
})
secondUrlCanHaveFileWithColorBlue // false
```

— source code at [src/urlCanContainsMetaMatching.js](./src/urlCanContainsMetaMatching.js).

</details>

# urlToMeta

`urlToMeta` is a function returning an object being the composition of all meta where `pattern` matched the `url`.

<details>
  <summary>urlToMeta code example</summary>

```js
import { urlToMeta } from "@jsenv/url-meta"

const structuredMetaMap = {
  insideSrc: {
    "file:///src/": true,
  },
  extensionIsJs: {
    "file:///**/*.js": true,
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

— source code at [src/urlToMeta.js](./src/urlToMeta.js).

</details>
