import { isPlainObject } from "./isPlainObject.js"

export const assertSpecifierMetaMap = (value) => {
  if (!isPlainObject(value)) {
    throw new TypeError(`specifierMetaMap must be a plain object, got ${value}`)
  }
  // we could ensure it's key/value pair of url like key/object or null values
}
