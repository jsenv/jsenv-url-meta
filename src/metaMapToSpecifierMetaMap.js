import { isPlainObject } from "./internal/isPlainObject.js"

export const metaMapToSpecifierMetaMap = (metaMap, ...rest) => {
  if (!isPlainObject(metaMap)) {
    throw new TypeError(`metaMap must be a plain object, got ${metaMap}`)
  }
  if (rest.length) {
    throw new Error(`received more arguments than expected.
--- number of arguments received ---
${1 + rest.length}
--- number of arguments expected ---
1`)
  }

  const specifierMetaMap = {}

  Object.keys(metaMap).forEach((metaKey) => {
    const specifierValueMap = metaMap[metaKey]
    if (!isPlainObject(specifierValueMap)) {
      throw new TypeError(
        `metaMap value must be plain object, got ${specifierValueMap} for ${metaKey}`,
      )
    }
    Object.keys(specifierValueMap).forEach((specifier) => {
      const metaValue = specifierValueMap[specifier]
      const meta = { [metaKey]: metaValue }
      specifierMetaMap[specifier] =
        specifier in specifierMetaMap ? { ...specifierMetaMap[specifier], ...meta } : meta
    })
  })

  return specifierMetaMap
}
