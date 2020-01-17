import { assertSpecifierMetaMap } from "./internal/assertSpecifierMetaMap.js"
import { assertUrlLike } from "./internal/assertUrlLike.js"

export const normalizeSpecifierMetaMap = (specifierMetaMap, url, ...rest) => {
  assertSpecifierMetaMap(specifierMetaMap, false)
  assertUrlLike(url, "url")
  if (rest.length) {
    throw new Error(`received more arguments than expected.
--- number of arguments received ---
${2 + rest.length}
--- number of arguments expected ---
2`)
  }

  const specifierMetaMapNormalized = {}
  Object.keys(specifierMetaMap).forEach((specifier) => {
    const specifierResolved = String(new URL(specifier, url))
    specifierMetaMapNormalized[specifierResolved] = specifierMetaMap[specifier]
  })
  return specifierMetaMapNormalized
}
