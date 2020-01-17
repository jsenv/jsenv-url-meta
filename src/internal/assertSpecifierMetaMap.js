import { isPlainObject } from "./isPlainObject.js"
import { assertUrlLike } from "./assertUrlLike.js"

export const assertSpecifierMetaMap = (value, checkComposition = true) => {
  if (!isPlainObject(value)) {
    throw new TypeError(`specifierMetaMap must be a plain object, got ${value}`)
  }

  if (checkComposition) {
    const plainObject = value
    Object.keys(plainObject).forEach((key) => {
      assertUrlLike(key, "specifierMetaMap key")
      const value = plainObject[key]
      if (value !== null && !isPlainObject(value)) {
        throw new TypeError(
          `specifierMetaMap value must be a plain object or null, got ${value} under key ${key}`,
        )
      }
    })
  }
}
