import { isPlainObject } from "../isPlainObject.js"

export const metaMapToSpecifierMetaMap = (metaMap) => {
  if (!isPlainObject(metaMap)) {
    throw new TypeError(`metaMap must be a plain object, got ${metaMap}`)
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
