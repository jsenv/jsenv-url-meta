# Server

[![npm package](https://img.shields.io/npm/v/@dmail/server.svg)](https://www.npmjs.com/package/@dmail/server)
[![build](https://travis-ci.com/dmail/server.svg?branch=master)](http://travis-ci.com/dmail/server)
[![codecov](https://codecov.io/gh/dmail/server/branch/master/graph/badge.svg)](https://codecov.io/gh/dmail/server)

> Simplified api to create server using node.js.

## Introduction

`@dmail/server` is used to start a node.js server.<br />

The main exports are:

- `startServer`
- `firstService`
- `serveFile`

## `startServer` Example

The following code starts a server listening to `http://127.0.0.1:8080` responding `Hello world` as plain text.

```js
import { startServer } from "@dmail/server"

startServer({
  protocol: "http",
  ip: "127.0.0.1",
  port: 8080,
  requestToResponse: () => {
    return {
      status: 200,
      headers: {
        "content-type": "text/plain",
      },
      body: "Hello world",
    }
  },
})
```

If you want to know more about `startServer`, there is a dedicated page documenting it.<br />
— see [`startServer` documentation](./docs/start-server-doc.md)

## `serveFile` example

The following code starts a server listening to `http://127.0.0.1:8080` serving files of the current directory.

```js
import { startServer, serveFile } from "@dmail/server"

startServer({
  protocol: "http",
  ip: "127.0.0.1",
  port: 8080,
  requestToResponse: ({ ressource, method, headers }) =>
    serveFile(`${__dirname}${ressource}`, {
      method,
      headers,
    }),
})
```

If you want to know more about `serveFile`, there is a dedicated page documenting it.<br />
— see [`serveFile` documentation](./docs/serve-file-doc.md)

## `firstService` example

Let's make a `generateResponse` function with the following behaviour:

- returns `204 no content` response for `/`
- returns `200 ok` response for `/whatever`

```js
import { firstService } from "@dmail/server"

const generateResponse = (request) => {
  return firstService(
    () => {
      if (ressource !== "/") return null
      return { status: 204 }
    },
    () => {
      if (ressource !== "/whatever") return null
      return { status: 200 }
    },
  )
}
```

If you want to know more about `firstService`, there is a dedicated page documenting it.<br />
— see [`firstService` documentation](./docs/first-service-doc.md)

## Installation

```console
npm install @dmail/server@2.4.0
```
