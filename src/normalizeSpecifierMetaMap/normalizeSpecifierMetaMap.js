import { assertSpecifierMetaMap } from "../assertSpecifierMetaMap.js"

export const normalizeSpecifierMetaMap = (specifierMetaMap, url) => {
  assertSpecifierMetaMap(specifierMetaMap)

  const specifierMetaMapNormalized = {}
  Object.keys(specifierMetaMap).forEach((specifier) => {
    const specifierResolved = String(new URL(specifier, url))
    specifierMetaMapNormalized[specifierResolved] = specifierMetaMap[specifier]
  })
  return specifierMetaMapNormalized
}
