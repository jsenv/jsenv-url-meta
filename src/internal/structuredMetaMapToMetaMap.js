import { isPlainObject } from "./isPlainObject.js"

export const structuredMetaMapToMetaMap = (structuredMetaMap, ...rest) => {
  if (!isPlainObject(structuredMetaMap)) {
    throw new TypeError(`structuredMetaMap must be a plain object, got ${structuredMetaMap}`)
  }
  if (rest.length) {
    throw new Error(`received more arguments than expected.
--- number of arguments received ---
${1 + rest.length}
--- number of arguments expected ---
1`)
  }

  const metaMap = {}
  Object.keys(structuredMetaMap).forEach((metaProperty) => {
    const metaValueMap = structuredMetaMap[metaProperty]
    if (!isPlainObject(metaValueMap)) {
      throw new TypeError(
        `metaValueMap must be plain object, got ${metaValueMap} for ${metaProperty}`,
      )
    }
    Object.keys(metaValueMap).forEach((pattern) => {
      const metaValue = metaValueMap[pattern]
      const meta = { [metaProperty]: metaValue }
      metaMap[pattern] = pattern in metaMap ? { ...metaMap[pattern], ...meta } : meta
    })
  })
  return metaMap
}
