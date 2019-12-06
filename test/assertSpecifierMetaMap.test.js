import { assert } from "@jsenv/assert"
import { assertSpecifierMetaMap } from "../src/internal/assertSpecifierMetaMap.js"

try {
  assertSpecifierMetaMap("foo")
  throw new Error("shoud crash")
} catch (error) {
  const actual = error
  const expected = new TypeError(`specifierMetaMap must be a plain object, got foo`)
  assert({ actual, expected })
}
